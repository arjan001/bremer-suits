-- ============================================================
-- Supabase SQL: Portfolio table for Bremer Suits admin panel
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Create the portfolio table
CREATE TABLE IF NOT EXISTS portfolio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  tag TEXT DEFAULT '',
  category TEXT DEFAULT '',
  client_name TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  page_location TEXT DEFAULT 'portfolio' CHECK (page_location IN ('portfolio', 'homepage', 'about', 'all')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_portfolio_status ON portfolio (status);
CREATE INDEX IF NOT EXISTS idx_portfolio_tag ON portfolio (tag);
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio (category);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON portfolio (is_featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_page_location ON portfolio (page_location);
CREATE INDEX IF NOT EXISTS idx_portfolio_sort ON portfolio (sort_order ASC, created_at DESC);

-- Auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_portfolio_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_portfolio_updated_at ON portfolio;
CREATE TRIGGER trigger_portfolio_updated_at
  BEFORE UPDATE ON portfolio
  FOR EACH ROW
  EXECUTE FUNCTION update_portfolio_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for service role (used by Netlify Functions)
CREATE POLICY "Service role full access" ON portfolio
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Seed some initial portfolio items with existing images
INSERT INTO portfolio (title, description, image, tag, category, client_name, is_featured, sort_order, status, page_location) VALUES
  ('Burgundy Bespoke Suit', 'A stunning burgundy bespoke suit with peak lapels and hand-stitched details.', '/images/portfolio/bespoke-burgundy-mannequin.jpg', 'featured', 'Recent Work', '', true, 1, 'active', 'all'),
  ('Teal Groomsmen Collection', 'Coordinated teal suits for a wedding party with matching accessories.', '/images/portfolio/wedding-teal-groomsmen.jpg', 'gallery', 'Gallery', '', true, 2, 'active', 'all'),
  ('Green Pinstripe Classic', 'A refined green pinstripe suit combining classic tailoring with bold fabric.', '/images/portfolio/bespoke-green-pinstripe.jpg', 'featured', 'Recent Work', '', true, 3, 'active', 'all'),
  ('Camo Wedding Party', 'A distinctive camo-themed wedding ensemble with matching groomsmen.', '/images/portfolio/wedding-camo-black-group.jpg', 'gallery', 'Gallery', '', false, 4, 'active', 'portfolio'),
  ('Navy Pinstripe Bespoke', 'A timeless navy pinstripe suit crafted for the modern professional.', '/images/portfolio/bespoke-navy-pinstripe-man.jpg', 'featured', 'Recent Work', '', true, 5, 'active', 'all'),
  ('Pink & Green Wedding', 'A colorful wedding celebration with coordinated pink and green styling.', '/images/portfolio/wedding-pink-green-stairs.jpg', 'gallery', 'Gallery', '', false, 6, 'active', 'all'),
  ('Cream Double-Breasted', 'A sophisticated cream double-breasted suit for special occasions.', '/images/portfolio/bespoke-cream-double-breasted.jpg', 'new', 'Recent Work', '', true, 7, 'active', 'all'),
  ('Black Suits Outdoor', 'A classic outdoor wedding with sharp black suits and coordinated styling.', '/images/portfolio/wedding-black-suits-outdoor.jpg', 'gallery', 'Gallery', '', false, 8, 'active', 'all'),
  ('Orange Statement Suit', 'A bold orange bespoke suit that commands attention in any room.', '/images/portfolio/bespoke-orange-mannequin.jpg', 'new', 'Recent Work', '', false, 9, 'active', 'portfolio'),
  ('Maroon Tailored Suit', 'A rich maroon suit with impeccable tailoring and modern silhouette.', '/images/portfolio/bespoke-maroon-mannequin.jpg', 'featured', 'Recent Work', '', false, 10, 'active', 'portfolio'),
  ('Beach Wedding Beige', 'Relaxed beige linen suits perfect for a destination beach wedding.', '/images/portfolio/wedding-beach-beige.jpg', 'gallery', 'Gallery', '', false, 11, 'active', 'portfolio'),
  ('Grey Tweed Heritage', 'A heritage-inspired grey tweed suit with classic British tailoring.', '/images/portfolio/bespoke-grey-tweed.jpg', 'new', 'Recent Work', '', false, 12, 'active', 'portfolio'),
  ('Brown Duo Collection', 'A coordinated pair of rich brown suits for a distinguished look.', '/images/portfolio/bespoke-brown-duo-mannequin.jpg', 'partnership', 'Partnerships', '', false, 13, 'active', 'portfolio'),
  ('Red Suits Group', 'A striking red group ensemble for a bold wedding celebration.', '/images/portfolio/wedding-red-suits-group.jpg', 'gallery', 'Gallery', '', false, 14, 'active', 'portfolio'),
  ('Cream Bridal Lineup', 'An elegant cream bridal party lineup with coordinated suits and gowns.', '/images/portfolio/wedding-cream-bridal-lineup.jpg', 'gallery', 'Gallery', '', false, 15, 'active', 'portfolio'),
  ('White & Black Blazer', 'A contrasting white and black blazer for a modern formal look.', '/images/portfolio/bespoke-white-black-blazer.jpg', 'new', 'Recent Work', '', false, 16, 'active', 'portfolio')
ON CONFLICT DO NOTHING;
