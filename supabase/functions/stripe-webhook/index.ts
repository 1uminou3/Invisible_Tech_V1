const signatureToleranceSeconds = 300;

function requiredEnv(name: string): string {
    const value = Deno.env.get(name)?.trim();
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

function jsonResponse(body: Record<string, string>, status: number): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(left: string, right: string): boolean {
    if (left.length !== right.length) {
        return false;
    }
    let difference = 0;
    for (let index = 0; index < left.length; index++) {
        difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
    }
    return difference === 0;
}

async function verifyStripeSignature(
    rawBody: string,
    signatureHeader: string | null,
    secret: string,
): Promise<boolean> {
    if (!signatureHeader) {
        return false;
    }
    const values = new Map<string, string[]>();
    for (const item of signatureHeader.split(",")) {
        const separator = item.indexOf("=");
        if (separator < 1) continue;
        const key = item.slice(0, separator);
        const value = item.slice(separator + 1);
        values.set(key, [...(values.get(key) ?? []), value]);
    }

    const timestampValue = values.get("t")?.[0];
    const timestamp = Number(timestampValue);
    if (!timestampValue || !Number.isInteger(timestamp)) {
        return false;
    }
    if (Math.abs(Math.floor(Date.now() / 1000) - timestamp) > signatureToleranceSeconds) {
        return false;
    }

    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
    );
    const expected = bytesToHex(new Uint8Array(await crypto.subtle.sign(
        "HMAC",
        key,
        new TextEncoder().encode(`${timestamp}.${rawBody}`),
    )));
    return (values.get("v1") ?? []).some((candidate) => constantTimeEqual(expected, candidate));
}

function serviceHeaders(serviceRoleKey: string): Record<string, string> {
    return {
        "apikey": serviceRoleKey,
        "Authorization": `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    };
}

Deno.serve(async (request) => {
    if (request.method !== "POST") {
        return jsonResponse({ error: "Method not allowed." }, 405);
    }

    try {
        const rawBody = await request.text();
        if (new TextEncoder().encode(rawBody).length > 1_048_576) {
            return jsonResponse({ error: "Request body is too large." }, 413);
        }
        const webhookSecret = requiredEnv("STRIPE_WEBHOOK_SECRET");
        if (!await verifyStripeSignature(rawBody, request.headers.get("Stripe-Signature"), webhookSecret)) {
            return jsonResponse({ error: "Invalid Stripe signature." }, 400);
        }

        const event = JSON.parse(rawBody);
        if (event.livemode !== false) {
            return jsonResponse({ error: "Only Stripe test-mode events are accepted." }, 400);
        }
        const session = event.data?.object;
        const eventType = event.type;
        if (
            !session ||
            typeof session.id !== "string" ||
            typeof session.metadata?.order_id !== "string" ||
            !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(session.metadata.order_id)
        ) {
            return jsonResponse({ received: "true" }, 200);
        }

        let values: Record<string, unknown>;
        if (
            (eventType === "checkout.session.completed" ||
                eventType === "checkout.session.async_payment_succeeded") &&
            session.payment_status === "paid"
        ) {
            const customer = session.customer_details ?? {};
            const shipping = session.collected_information?.shipping_details ??
                session.shipping_details ??
                {};
            const address = shipping.address ?? customer.address ?? null;
            if (!Number.isInteger(session.amount_total) || session.amount_total < 0 || session.currency !== "hkd") {
                console.error("Stripe webhook session has an invalid total or currency.");
                return jsonResponse({ error: "Invalid checkout session totals." }, 400);
            }
            values = {
                status: "paid",
                stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
                amount_total: session.amount_total,
                customer_name: shipping.name ?? customer.name ?? null,
                customer_email: customer.email ?? null,
                customer_phone: customer.phone ?? shipping.phone ?? null,
                shipping_address: address,
                shipping_country: address?.country ?? null,
                paid_at: Number.isInteger(event.created)
                    ? new Date(event.created * 1000).toISOString()
                    : new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
        } else if (eventType === "checkout.session.expired") {
            values = { status: "expired", updated_at: new Date().toISOString() };
        } else {
            return jsonResponse({ received: "true" }, 200);
        }

        const supabaseUrl = requiredEnv("SUPABASE_URL").replace(/\/+$/, "");
        const serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
        const orderId = encodeURIComponent(session.metadata.order_id);
        const sessionId = encodeURIComponent(session.id);
        const stateFilter = eventType === "checkout.session.expired" ? "&status=eq.pending" : "";
        const response = await fetch(
            `${supabaseUrl}/rest/v1/checkout_orders?id=eq.${orderId}&stripe_checkout_session_id=eq.${sessionId}${stateFilter}`,
            {
                method: "PATCH",
                headers: serviceHeaders(serviceRoleKey),
                body: JSON.stringify(values),
            },
        );
        const responseBody = await response.text();
        if (!response.ok) {
            let databaseError: { code?: unknown; message?: unknown } = {};
            try {
                databaseError = JSON.parse(responseBody);
            } catch {
                console.error("Supabase returned a non-JSON webhook update error.", {
                    status: response.status,
                    contentType: response.headers.get("Content-Type"),
                });
            }
            console.error("Stripe webhook order update failed.", {
                status: response.status,
                code: typeof databaseError.code === "string" ? databaseError.code : undefined,
                message: typeof databaseError.message === "string" ? databaseError.message : undefined,
            });
            return jsonResponse({ error: "Unable to update the order." }, 500);
        }
        let updatedOrders: unknown;
        try {
            updatedOrders = JSON.parse(responseBody);
        } catch {
            console.error("Supabase returned a non-JSON webhook update response.", {
                status: response.status,
                contentType: response.headers.get("Content-Type"),
            });
            return jsonResponse({ error: "Unable to update the order." }, 500);
        }
        if (!Array.isArray(updatedOrders)) {
            console.error("Stripe webhook returned an unexpected order update response.");
            return jsonResponse({ error: "Unable to match the checkout session." }, 500);
        }
        if (updatedOrders.length === 0 && eventType === "checkout.session.expired") {
            const existingResponse = await fetch(
                `${supabaseUrl}/rest/v1/checkout_orders?id=eq.${orderId}&stripe_checkout_session_id=eq.${sessionId}&select=id`,
                {
                    headers: {
                        "apikey": serviceRoleKey,
                        "Authorization": `Bearer ${serviceRoleKey}`,
                    },
                },
            );
            if (existingResponse.ok && (await existingResponse.json()).length === 1) {
                return jsonResponse({ received: "true" }, 200);
            }
        }
        if (updatedOrders.length !== 1) {
            console.error("Stripe webhook could not match the event to exactly one checkout order.", {
                eventType,
                matchedOrderCount: updatedOrders.length,
            });
            return jsonResponse({ error: "Unable to match the checkout session." }, 500);
        }
        return jsonResponse({ received: "true" }, 200);
    } catch (error) {
        console.error("Stripe webhook processing failed:", error);
        return jsonResponse({ error: "Webhook processing failed." }, 500);
    }
});
