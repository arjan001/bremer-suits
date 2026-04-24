-- ============================================
-- Audit Logs Table
-- Tracks every administrative action for compliance + forensics.
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,                  -- e.g. create, update, delete, login, logout, password_change
  resource TEXT NOT NULL,                -- e.g. products, categories, orders, users, portfolio, auth
  resource_id TEXT,                      -- id of the row that was affected (nullable)
  actor_id TEXT,                         -- auth user id if available
  actor_email TEXT,                      -- email of the admin who performed the action
  actor_role TEXT,                       -- role of the actor at action time
  description TEXT,                      -- human-readable summary
  metadata JSONB DEFAULT '{}'::jsonb,    -- before/after payloads, extra context
  ip_address TEXT,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failure')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_email ON audit_logs(actor_email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_id ON audit_logs(resource_id);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow full access to audit_logs"
  ON audit_logs FOR ALL
  USING (true)
  WITH CHECK (true);
