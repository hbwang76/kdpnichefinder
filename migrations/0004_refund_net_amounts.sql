-- Record actual payment amounts from Creem webhooks so refunds can be
-- computed on the net received amount (gross - Creem processing fee),
-- not the sticker price. Creem keeps its processing fee on refunds, so
-- refunding the sticker price loses money on every refund.

-- ─── Credit Packs ────────────────────────────────────────────────────────────
ALTER TABLE credit_packs ADD COLUMN amount_cents INTEGER;        -- gross amount paid by customer (Creem webhook, cents)
ALTER TABLE credit_packs ADD COLUMN fee_cents INTEGER;           -- estimated Creem processing fee (default 3.9% + $0.40)
ALTER TABLE credit_packs ADD COLUMN net_cents INTEGER;           -- amount_cents - fee_cents = what we actually received
ALTER TABLE credit_packs ADD COLUMN currency TEXT;               -- ISO currency, e.g. USD
ALTER TABLE credit_packs ADD COLUMN refund_amount_cents INTEGER; -- actual refunded amount (from refund.created webhook)
ALTER TABLE credit_packs ADD COLUMN refund_requested_at INTEGER; -- set when a refund is requested (pending processing)

-- ─── Subscriptions (last paid invoice amounts, for subscription refunds) ─────
ALTER TABLE subscriptions ADD COLUMN last_payment_amount_cents INTEGER;
ALTER TABLE subscriptions ADD COLUMN last_payment_fee_cents INTEGER;
ALTER TABLE subscriptions ADD COLUMN last_payment_net_cents INTEGER;
ALTER TABLE subscriptions ADD COLUMN last_payment_currency TEXT;
