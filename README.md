# Invisible Tech website

## Project layout

- `pages/` contains the editable HTML page templates.
- `partials/` contains the shared header, footer, and social-link markup.
- `css/`, `js/`, and `assets/` contain the site styles, behavior, and media.
- `tools/build_site.py` expands the templates and partials into the root-level pages used for publishing.

## Build

Run `python tools/build_site.py` after changing a page template or partial. The generated `.html` pages remain at the site root, so existing links and static hosting URLs do not change.

Use `python tools/build_site.py --check` to verify that the published pages match their sources without rewriting them.

The English/Traditional Chinese selection is saved in the browser and carried across every page. Update shared language behavior in `js/site-language.js`; page-specific translations live in the corresponding page scripts.

## Stripe test checkout and Supabase orders

Checkout is implemented in Stripe test mode only. Before enabling it:

1. In `js/site-config.js`, set `supabaseUrl` to the public project URL and `supabaseAnonKey` to the project's public anon/publishable key. These values are intended for browser use; never put a service-role key or Stripe secret in this file.
2. Install and authenticate the Supabase CLI, link this project, and apply the migrations:

   ```powershell
   supabase link --project-ref <project-ref>
   supabase db push
   ```

   If an earlier migration version is already marked applied but `checkout_orders` is missing, do not edit or repair the applied migration. Apply the follow-up migration `20261023000000_create_checkout_orders.sql` with `supabase db push`.

3. Set Edge Function secrets using a Stripe **test** secret key and the test webhook signing secret. Use the site's exact HTTPS origin (no path) for `SITE_URL` and `ALLOWED_ORIGINS`:

   ```powershell
   supabase secrets set STRIPE_SECRET_KEY=sk_test_... STRIPE_WEBHOOK_SECRET=whsec_... SITE_URL=https://your-site.example ALLOWED_ORIGINS=https://your-site.example
   ```

   For local browser testing, add the exact local origin to the comma-separated `ALLOWED_ORIGINS` value as well.

4. Deploy both functions:

   ```powershell
   supabase functions deploy stripe-checkout
   supabase functions deploy stripe-webhook
   ```

5. In the Stripe **test-mode** dashboard, add a webhook endpoint at `https://<project-ref>.supabase.co/functions/v1/stripe-webhook` for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, and `checkout.session.expired`. Copy that endpoint's signing secret into `STRIPE_WEBHOOK_SECRET`.

The checkout function accepts only product IDs, color names, and quantities; it looks up prices on the server, creates one Checkout Session for the whole bag, and asks Stripe to collect a shipping address (HK, TW, MO, or US) and phone number. Prices are HKD and are defined by the server function in `supabase/functions/stripe-checkout/index.ts`. No shipping fee or shipping-method selection is configured yet.

The `orders` table has RLS enabled and is not readable by browser roles. Checkout creates a pending item snapshot; customer contact/address details and the paid status are written only after a valid Stripe webhook signature confirms payment. Card details are handled by Stripe and are never stored in this project. Webhook updates are idempotent for Stripe retries.

No remote migration or deployment has been run from this workspace. Configure test credentials and the project CLI before testing a hosted payment. Do not switch to live Stripe keys until test checkout, webhook delivery, and fulfillment handling have been verified.
