create table if not exists public.checkout_orders (
    id uuid primary key,
    stripe_checkout_session_id text unique,
    stripe_payment_intent_id text unique,
    status text not null check (status in ('pending', 'paid', 'expired', 'failed')),
    currency text not null check (currency = 'hkd'),
    amount_subtotal integer not null check (amount_subtotal > 0),
    amount_total integer not null check (amount_total >= 0),
    items jsonb not null check (jsonb_typeof(items) = 'array'),
    customer_name text,
    customer_email text,
    customer_phone text,
    shipping_address jsonb,
    shipping_country text check (shipping_country is null or shipping_country in ('HK', 'TW', 'MO', 'US')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    paid_at timestamptz
);

create index if not exists checkout_orders_status_created_at_idx
    on public.checkout_orders (status, created_at desc);

alter table public.checkout_orders enable row level security;

revoke all on table public.checkout_orders from anon, authenticated;
grant all on table public.checkout_orders to service_role;
