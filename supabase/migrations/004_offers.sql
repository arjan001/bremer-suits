-- ============================================
-- Offers & Banners Tables (5 types)
-- Supabase SQL Migration
-- ============================================

-- Hero Banners
CREATE TABLE IF NOT EXISTS hero_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  collection TEXT DEFAULT '',
  link TEXT DEFAULT '',
  button_text TEXT DEFAULT 'Shop Now',
  image TEXT DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Banners
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  link TEXT DEFAULT '',
  image TEXT DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Carousels
CREATE TABLE IF NOT EXISTS carousels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  image TEXT DEFAULT '',
  link TEXT DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Navbar Offers
CREATE TABLE IF NOT EXISTS navbar_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Popup Offers
CREATE TABLE IF NOT EXISTS popup_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  discount_percent INTEGER NOT NULL DEFAULT 0,
  code TEXT DEFAULT '',
  image TEXT DEFAULT '',
  collect_newsletter BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_hero_banners_active ON hero_banners(is_active);
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(is_active);
CREATE INDEX IF NOT EXISTS idx_carousels_active ON carousels(is_active);
CREATE INDEX IF NOT EXISTS idx_navbar_offers_active ON navbar_offers(is_active);
CREATE INDEX IF NOT EXISTS idx_popup_offers_active ON popup_offers(is_active);

-- Enable Row Level Security
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousels ENABLE ROW LEVEL SECURITY;
ALTER TABLE navbar_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE popup_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow full access to hero_banners" ON hero_banners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to banners" ON banners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to carousels" ON carousels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to navbar_offers" ON navbar_offers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to popup_offers" ON popup_offers FOR ALL USING (true) WITH CHECK (true);
