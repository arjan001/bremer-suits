-- ============================================
-- Admin User Seed Script (Manual)
-- ============================================
-- Purpose:
-- Insert a default admin row into admin_users table.
--
-- Notes:
-- 1) Replace placeholder values before running.
-- 2) This script manages admin profile metadata only.
-- 3) Authentication for admin panel is handled by Supabase Auth.
--    Create the actual admin user in Supabase Dashboard -> Authentication -> Users.

INSERT INTO admin_users (name, email, role, status)
VALUES (
  'Primary Admin',
  'admin@example.com',
  'super_admin',
  'active'
)
ON CONFLICT (email)
DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  last_login = NOW();
