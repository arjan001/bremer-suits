-- ============================================
-- PayHero Payment Gateway Configuration
-- Adds PayHero API credentials to settings table
-- ============================================

ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS payhero_api_username TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS payhero_api_password TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS payhero_channel_id TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS payhero_enabled BOOLEAN DEFAULT false;
