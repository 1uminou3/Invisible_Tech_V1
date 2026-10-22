type CartLine = {
    productId: string;
    color: string;
    quantity: number;
};

type Product = {
    name: string;
    price: number;
    colors: string[];
};

const products: Record<string, Product> = {
    mask: {
        name: "Acoustic & Heat Eye Mask",
        price: 398,
        colors: ["Astra Blue", "Soft Nude", "Graphite Grey"],
    },
    sleep: {
        name: "Sleep Pillow",
        price: 1199,
        colors: ["Cloud", "Soft Sand", "Slate"],
    },
    travel: {
        name: "Travel Pillow",
        price: 580,
        colors: ["Soft Sand", "Mist Blue", "Slate"],
    },
};

const allowedCountries = ["HK", "TW", "MO", "US"];

class RequestError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

function corsHeaders(origin: string): Record<string, string> {
    return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Headers": "authorization, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Vary": "Origin",
    };
}

function jsonResponse(
    body: Record<string, unknown>,
    status: number,
    headers: Record<string, string> = {},
): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...headers, "Content-Type": "application/json" },
    });
}

function requiredEnv(name: string): string {
    const value = Deno.env.get(name)?.trim();
    if (!value) {
        throw new RequestError("Checkout is not configured. Please try again later.", 503);
    }
    return value;
}

function getAllowedOrigins(): string[] {
    return (Deno.env.get("ALLOWED_ORIGINS") ?? "")
        .split(",")
        .map((origin) => origin.trim().replace(/\/+$/, ""))
        .filter(Boolean);
}

function supabaseHeaders(serviceRoleKey: string): Record<string, string> {
    return {
        "apikey": serviceRoleKey,
        "Authorization": `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
    };
}

async function updateOrder(
    supabaseUrl: string,
    serviceRoleKey: string,
    orderId: string,
    filters: string,
    values: Record<string, unknown>,
): Promise<boolean> {
    const response = await fetch(
        `${supabaseUrl}/rest/v1/checkout_orders?id=eq.${encodeURIComponent(orderId)}${filters}`,
        {
            method: "PATCH",
            headers: {
                ...supabaseHeaders(serviceRoleKey),
                "Prefer": "return=representation",
            },
            body: JSON.stringify(values),
        },
    );
    if (!response.ok) {
        console.error("Order update failed:", response.status);
        return false;
    }
    const rows = await response.json();
    return Array.isArray(rows) && rows.length === 1;
}

function validateCart(value: unknown): CartLine[] {
    if (!Array.isArray(value) || value.length < 1 || value.length > 20) {
        throw new RequestError("Your bag is empty or cannot be checked out.", 400);
    }

    let totalQuantity = 0;
    const seen = new Set<string>();
    return value.map((rawLine) => {
        if (!rawLine || typeof rawLine !== "object") {
            throw new RequestError("Your bag contains an invalid item.", 400);
        }
        const line = rawLine as Record<string, unknown>;
        const product = typeof line.productId === "string" ? products[line.productId] : undefined;
        const key = `${line.productId}:${line.color}`;
        if (
            !product ||
            typeof line.color !== "string" ||
            !product.colors.includes(line.color) ||
            !Number.isInteger(line.quantity) ||
            (line.quantity as number) < 1 ||
            (line.quantity as number) > 99 ||
            seen.has(key)
        ) {
            throw new RequestError("Your bag contains an invalid item.", 400);
        }
        seen.add(key);
        totalQuantity += line.quantity as number;
        if (totalQuantity > 99) {
            throw new RequestError("Your bag exceeds the maximum checkout quantity.", 400);
        }
        return {
            productId: line.productId as string,
            color: line.color,
            quantity: line.quantity as number,
        };
    });
}

async function createStripeSession(
    stripeKey: string,
    siteUrl: string,
    orderId: string,
    cart: CartLine[],
): Promise<{ id: string; url: string }> {
    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("shipping_address_collection[allowed_countries][0]", allowedCountries[0]);
    params.set("shipping_address_collection[allowed_countries][1]", allowedCountries[1]);
    params.set("shipping_address_collection[allowed_countries][2]", allowedCountries[2]);
    params.set("shipping_address_collection[allowed_countries][3]", allowedCountries[3]);
    params.set("phone_number_collection[enabled]", "true");
    params.set("customer_creation", "always");
    params.set("success_url", `${siteUrl}/purchase.html?checkout=success`);
    params.set("cancel_url", `${siteUrl}/purchase.html?checkout=cancelled`);
    params.set("metadata[order_id]", orderId);
    params.set("payment_intent_data[metadata][order_id]", orderId);

    cart.forEach((line, index) => {
        const product = products[line.productId];
        params.set(`line_items[${index}][price_data][currency]`, "hkd");
        params.set(`line_items[${index}][price_data][unit_amount]`, String(product.price * 100));
        params.set(`line_items[${index}][price_data][product_data][name]`, `${product.name} · ${line.color}`);
        params.set(`line_items[${index}][quantity]`, String(line.quantity));
    });

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${stripeKey}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
    });
    const responseBody = await response.text();
    let payload: {
        id?: unknown;
        url?: unknown;
        error?: {
            type?: unknown;
            code?: unknown;
            param?: unknown;
            message?: unknown;
        };
    } = {};
    try {
        payload = JSON.parse(responseBody);
    } catch {
        console.error("Stripe returned a non-JSON Checkout Session response.", {
            status: response.status,
            contentType: response.headers.get("Content-Type"),
        });
    }
    if (!response.ok || typeof payload.id !== "string" || typeof payload.url !== "string") {
        const stripeError = payload.error ?? {};
        console.error("Stripe Checkout Session creation failed.", {
            status: response.status,
            type: typeof stripeError.type === "string" ? stripeError.type : undefined,
            code: typeof stripeError.code === "string" ? stripeError.code : undefined,
            param: typeof stripeError.param === "string" ? stripeError.param : undefined,
            message: typeof stripeError.message === "string" ? stripeError.message : undefined,
        });
        throw new Error("Stripe Checkout Session creation failed.");
    }
    return { id: payload.id, url: payload.url };
}

Deno.serve(async (request) => {
    const origin = request.headers.get("Origin") ?? "";
    const allowedOrigins = getAllowedOrigins();
    if (!origin || !allowedOrigins.includes(origin.replace(/\/+$/, ""))) {
        return jsonResponse({ error: "This website is not allowed to start checkout." }, 403);
    }
    const headers = corsHeaders(origin);
    if (request.method === "OPTIONS") {
        return new Response("ok", { headers });
    }
    if (request.method !== "POST") {
        return jsonResponse({ error: "Method not allowed." }, 405, headers);
    }

    let orderId: string | undefined;
    let supabaseUrl: string | undefined;
    let serviceRoleKey: string | undefined;
    try {
        const contentLength = Number(request.headers.get("Content-Length") ?? 0);
        if (contentLength > 16_384) {
            throw new RequestError("Your bag request is too large.", 413);
        }
        const requestText = await request.text();
        if (new TextEncoder().encode(requestText).length > 16_384) {
            throw new RequestError("Your bag request is too large.", 413);
        }
        const body = JSON.parse(requestText);
        const cart = validateCart(body?.items);
        const stripeKey = requiredEnv("STRIPE_SECRET_KEY");
        if (!stripeKey.startsWith("sk_test_")) {
            throw new RequestError("Checkout is restricted to Stripe test mode during setup.", 503);
        }
        supabaseUrl = requiredEnv("SUPABASE_URL").replace(/\/+$/, "");
        serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
        const configuredSiteUrl = requiredEnv("SITE_URL").replace(/\/+$/, "");
        const parsedSiteUrl = new URL(configuredSiteUrl);
        if (parsedSiteUrl.protocol !== "https:" && parsedSiteUrl.hostname !== "localhost" && parsedSiteUrl.hostname !== "127.0.0.1") {
            throw new RequestError("The checkout return address is not configured securely.", 503);
        }
        const siteUrl = parsedSiteUrl.origin;

        orderId = crypto.randomUUID();
        const items = cart.map((line) => ({
            product_id: line.productId,
            product_name: products[line.productId].name,
            color: line.color,
            quantity: line.quantity,
            unit_amount: products[line.productId].price * 100,
        }));
        const amountSubtotal = cart.reduce(
            (total, line) => total + products[line.productId].price * 100 * line.quantity,
            0,
        );

        const insertResponse = await fetch(`${supabaseUrl}/rest/v1/checkout_orders`, {
            method: "POST",
            headers: { ...supabaseHeaders(serviceRoleKey), "Prefer": "return=minimal" },
            body: JSON.stringify({
                id: orderId,
                status: "pending",
                currency: "hkd",
                amount_subtotal: amountSubtotal,
                amount_total: amountSubtotal,
                items,
            }),
        });
        if (!insertResponse.ok) {
            console.error("Pending order creation failed:", insertResponse.status);
            throw new Error("Unable to create the pending order.");
        }

        try {
            const session = await createStripeSession(stripeKey, siteUrl, orderId, cart);
            const saved = await updateOrder(
                supabaseUrl,
                serviceRoleKey,
                orderId,
                "",
                { stripe_checkout_session_id: session.id },
            );
            if (!saved) {
                await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(session.id)}/expire`, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${stripeKey}` },
                });
                throw new Error("Unable to associate the Checkout Session with the order.");
            }
            return jsonResponse({ url: session.url }, 200, headers);
        } catch (error) {
            await updateOrder(supabaseUrl, serviceRoleKey, orderId, "", { status: "failed" });
            throw error;
        }
    } catch (error) {
        if (error instanceof RequestError) {
            return jsonResponse({ error: error.message }, error.status, headers);
        }
        if (error instanceof SyntaxError) {
            return jsonResponse({ error: "The checkout request is not valid JSON." }, 400, headers);
        }
        console.error("Checkout request failed:", error);
        return jsonResponse({ error: "Unable to start secure checkout. Please try again." }, 500, headers);
    }
});
