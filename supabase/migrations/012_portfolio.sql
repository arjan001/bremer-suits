-- ============================================
-- Portfolio Table
-- Supabase SQL Migration
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS portfolio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  tag TEXT DEFAULT '',
  category TEXT DEFAULT '',
  client_name TEXT DEFAULT '',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_status ON portfolio(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_tag ON portfolio(tag);
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_sort_order ON portfolio(sort_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_created_at ON portfolio(created_at DESC);

-- Auto-update updated_at trigger
CREATE TRIGGER portfolio_updated_at
  BEFORE UPDATE ON portfolio
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

-- Allow full access (adjust for your auth strategy)
CREATE POLICY "Allow full access to portfolio"
  ON portfolio FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- Seed dummy portfolio data with attached images
-- ============================================
INSERT INTO portfolio (title, description, image, tag, category, client_name, is_featured, sort_order, status)
VALUES
  (
    'Executive Three-Piece Collection',
    'Bespoke three-piece suit crafted for a corporate executive. Italian wool with hand-stitched lapels and custom monogramming.',
    '/images/portfolio/portfolio-3.webp',
    'new',
    'Recent Work',
    'James Kariuki',
    true,
    1,
    'active'
  ),
  (
    'Wedding Groomsmen Ensemble',
    'Complete wedding party styling for 8 groomsmen. Coordinated navy suits with burgundy accessories and custom pocket squares.',
    '/images/portfolio/portfolio-4.webp',
    'partnership',
    'Partnerships',
    'Wanjiku & David',
    true,
    2,
    'active'
  ),
  (
    'Corporate Wardrobe Overhaul',
    'Full wardrobe consultation and 12-piece collection for a Fortune 500 CEO. From boardroom to black-tie events.',
    '/images/portfolio/portfolio-5.webp',
    'featured',
    'Recent Work',
    'Michael Oduya',
    true,
    3,
    'active'
  ),
  (
    'Fashion Week Collaboration',
    'Exclusive partnership with Nairobi Fashion Week. Showcased 20 bespoke pieces on the runway.',
    '/images/portfolio/portfolio-6.webp',
    'partnership',
    'Partnerships',
    'Nairobi Fashion Week',
    true,
    4,
    'active'
  ),
  (
    'Classic Charcoal Business Suit',
    'Timeless charcoal business suit tailored for daily executive wear. Premium worsted wool with subtle pinstripe.',
    '/images/portfolio/portfolio-7.webp',
    'new',
    'Gallery',
    'Peter Mwangi',
    false,
    5,
    'active'
  ),
  (
    'Luxury Evening Tuxedo',
    'Midnight black tuxedo with satin peak lapels. Designed for prestigious gala events and award ceremonies.',
    '/images/portfolio/portfolio-8.webp',
    'featured',
    'Gallery',
    'Brian Otieno',
    false,
    6,
    'active'
  ),
  (
    'Destination Wedding Collection',
    'Lightweight linen suits styled for a coastal destination wedding. Ivory and sand tones with natural fabric draping.',
    '/images/portfolio/portfolio-9.webp',
    'partnership',
    'Partnerships',
    'Coastal Weddings Co.',
    true,
    7,
    'active'
  ),
  (
    'Heritage Tweed Sport Coat',
    'Hand-crafted Harris Tweed sport coat with leather elbow patches. A nod to British heritage tailoring.',
    '/images/portfolio/portfolio-10.webp',
    'gallery',
    'Gallery',
    'Daniel Njoroge',
    false,
    8,
    'active'
  ),
  (
    'Ambassador Reception Attire',
    'Diplomatic event styling for an ambassador''s reception. Dark navy ensemble with gold cufflinks and silk tie.',
    '/images/portfolio/portfolio-11.webp',
    'featured',
    'Recent Work',
    'Embassy Events',
    true,
    9,
    'active'
  ),
  (
    'Premium Casual Friday Collection',
    'Smart-casual pieces bridging the gap between business and weekend wear. Unstructured blazers with premium denim.',
    '/images/portfolio/portfolio-12.webp',
    'new',
    'Gallery',
    'Alex Kimani',
    false,
    10,
    'active'
  ),
  (
    'Luxury Brand Partnership',
    'Exclusive collaboration with an Italian fabric house. Limited edition collection featuring hand-dyed silks.',
    '/images/portfolio/portfolio-13.webp',
    'partnership',
    'Partnerships',
    'Loro Piana',
    true,
    11,
    'active'
  ),
  (
    'Modern Slim-Fit Business Suit',
    'Contemporary slim-fit design for the modern professional. Stretch fabric for comfort without compromising elegance.',
    '/images/portfolio/portfolio-14.webp',
    'new',
    'Recent Work',
    'Samuel Muthui',
    false,
    12,
    'active'
  ),
  (
    'Signature Double-Breasted Blazer',
    'Our signature double-breasted blazer in rich burgundy. A statement piece that defines the Bremer aesthetic.',
    '/images/portfolio/portfolio-15.webp',
    'featured',
    'Gallery',
    'Bremer Collection',
    true,
    13,
    'active'
  ),
  (
    'Ruracio Ceremony Styling',
    'Traditional meets modern — complete styling for a Kikuyu ruracio ceremony with contemporary suit elements.',
    '/images/portfolio/portfolio-1.webp',
    'partnership',
    'Recent Work',
    'Kamau & Njeri',
    false,
    14,
    'active'
  ),
  (
    'Corporate Team Uniform Project',
    'Designed and delivered 50+ branded suits for a leading law firm. Consistent quality across all sizes.',
    '/images/portfolio/portfolio-2.webp',
    'partnership',
    'Partnerships',
    'Mwangi & Associates',
    false,
    15,
    'active'
  );
