-- KDP Niche Finder — Initial schema
-- Users, sessions, subscriptions, credits, analyses

-- ─── Users ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  google_sub TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  profile_image_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free',      -- free | starter | pro
  creem_customer_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_sub ON users(google_sub);

-- ─── Sessions ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

-- ─── Subscriptions ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,                    -- starter | pro
  creem_subscription_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active | cancelled | past_due
  current_period_start INTEGER NOT NULL,
  current_period_end INTEGER NOT NULL,
  cancel_at_period_end INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_creem_id ON subscriptions(creem_subscription_id);

-- ─── Credit Packs ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS credit_packs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  creem_order_id TEXT UNIQUE NOT NULL,
  credits INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active | refunded
  purchased_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_credit_packs_user_id ON credit_packs(user_id);

-- ─── Credit Ledger ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS credit_ledger (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,               -- positive = credit, negative = debit
  balance_after INTEGER NOT NULL,
  reason TEXT NOT NULL,                  -- purchase | analysis | refund | bonus
  reference_id TEXT,                     -- credit_pack id, analysis id, etc.
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_credit_ledger_user_id ON credit_ledger(user_id);

-- ─── Analyses (history) ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS analyses (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,  -- NULL = anonymous free-tier analysis (rate-limited by IP marker in query)
  query TEXT NOT NULL,
  result TEXT NOT NULL,                  -- JSON string of niche analysis result
  tier TEXT NOT NULL DEFAULT 'free',     -- free | starter | pro
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at);

-- ─── Webhook Idempotency ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS webhook_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  processed_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_webhook_events_id ON webhook_events(id);
