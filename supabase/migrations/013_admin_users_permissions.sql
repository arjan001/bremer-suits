-- ============================================
-- Admin Users: Permissions & Auth Sync
-- Supabase SQL Migration
-- ============================================

-- Per-user permission overrides (JSONB, nullable -> derive from role)
ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS permissions JSONB;

-- Optional link to auth.users for admin panel logins
ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS auth_user_id UUID;

CREATE INDEX IF NOT EXISTS idx_admin_users_auth_user_id
  ON admin_users(auth_user_id);

-- Guarantee a single "super admin" profile row always exists.
-- Actual login credentials are managed by Supabase Auth.
INSERT INTO admin_users (name, email, role, status, permissions)
VALUES (
  'Primary Admin',
  'admin@bremer-suits.local',
  'super_admin',
  'active',
  '{
    "products": {"view": true, "edit": true, "delete": true},
    "orders": {"view": true, "edit": true, "delete": true},
    "categories": {"view": true, "edit": true, "delete": true},
    "offers": {"view": true, "edit": true, "delete": true},
    "newsletter": {"view": true, "edit": true, "delete": true},
    "delivery": {"view": true, "edit": true, "delete": true},
    "analytics": {"view": true, "edit": true, "delete": true},
    "policies": {"view": true, "edit": true, "delete": true},
    "users": {"view": true, "edit": true, "delete": true},
    "settings": {"view": true, "edit": true, "delete": true},
    "portfolio": {"view": true, "edit": true, "delete": true},
    "cardDetails": {"view": true, "edit": true, "delete": true}
  }'::jsonb
)
ON CONFLICT (email) DO UPDATE SET
  role = 'super_admin',
  status = 'active',
  permissions = EXCLUDED.permissions;
