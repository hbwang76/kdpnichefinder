-- KDP Niche Finder — Add oauth_states for Google OAuth PKCE
-- Fixes: login route was incorrectly using webhook_events table

CREATE TABLE IF NOT EXISTS oauth_states (
  id         TEXT PRIMARY KEY,
  verifier   TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_oauth_states_expires_at ON oauth_states(expires_at);
