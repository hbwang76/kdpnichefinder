-- Add gateway_checkout_id to credit_packs so refund can try checkout_id
-- when transaction_id is unavailable (test mode Order API 500 issue)
ALTER TABLE credit_packs ADD COLUMN gateway_checkout_id TEXT;

-- Backfill checkout_id for existing credit packs using creem_order_id pattern
-- For old packs, creem_order_id stored the order ID (ord_...) not transaction ID
-- For new packs after fix, creem_order_id will store the checkout ID (ch_...)
-- For now, we'll leave existing rows as-is and handle the refund fallback
