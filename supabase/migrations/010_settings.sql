-- ============================================
-- Settings Table (single-row store configuration)
-- Supabase SQL Migration
-- ============================================

CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_name TEXT DEFAULT '',
  store_email TEXT DEFAULT '',
  store_phone TEXT DEFAULT '',
  currency TEXT DEFAULT '$',
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  free_delivery_threshold NUMERIC(10,2) DEFAULT 0,
  whatsapp_number TEXT DEFAULT '',
  address TEXT DEFAULT '',
  social_links JSONB DEFAULT '{}'::jsonb,
  theme JSONB DEFAULT '{}'::jsonb,
  footer_text TEXT DEFAULT '',
  seo_pages JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update trigger
CREATE TRIGGER settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow full access to settings"
  ON settings FOR ALL
  USING (true)
  WITH CHECK (true);
