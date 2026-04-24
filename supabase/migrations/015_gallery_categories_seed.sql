-- ============================================
-- Gallery Categories Seed
-- Re-seeds the categories table with the collections that appear in the
-- public portfolio / gallery (Weddings, Couples, Senator Suit, Kaunda Suit,
-- Bespoke Suits, Made-to-Measure) along with representative cover images.
-- ============================================

-- Ensure the portfolio table has a page_location column (referenced by the
-- admin-portfolio function). Safe to run repeatedly.
ALTER TABLE portfolio
  ADD COLUMN IF NOT EXISTS page_location TEXT NOT NULL DEFAULT 'portfolio';

INSERT INTO categories (name, slug, description, image, status)
VALUES
  (
    'Weddings',
    'wedding',
    'Bespoke wedding tuxedos, groomsmen suits, and coordinated wedding-party styling.',
    '/images/portfolio/wedding-pink-green-stairs.jpg',
    'active'
  ),
  (
    'Couples',
    'couples',
    'Coordinated couples styling — his and hers ensembles for weddings, engagements, and special occasions.',
    '/images/portfolio/couples-black-suit-roses.jpg',
    'active'
  ),
  (
    'Senator Suit',
    'senator-suit',
    'Senator suits — collarless African formalwear with embroidered detailing and traditional cap options.',
    '/images/portfolio/senator-navy-gold-embroidered-cane.jpg',
    'active'
  ),
  (
    'Kaunda Suit',
    'kaunda-suit',
    'Kaunda suits — timeless African safari-style tailoring with mandarin collars and signature pocket details.',
    '/images/portfolio/kaunda-brown-mandarin-pocketsquare.jpg',
    'active'
  ),
  (
    'Bespoke Suits',
    'bespoke',
    'Fully bespoke suits crafted from scratch. Pinstripes, double-breasted, three-piece ensembles for executives and events.',
    '/images/portfolio/bespoke-navy-pinstripe-3piece.jpg',
    'active'
  ),
  (
    'Made-to-Measure',
    'made-to-measure',
    'Made-to-measure suits and blazers adjusted to your exact measurements from our signature block patterns.',
    '/images/portfolio/bespoke-cream-double-breasted.jpg',
    'active'
  )
ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name,
      description = EXCLUDED.description,
      image = EXCLUDED.image,
      status = EXCLUDED.status;

-- ============================================
-- Portfolio (gallery) re-seed for the same categories.
-- Uses ON CONFLICT guard via WHERE NOT EXISTS so existing rows are not duplicated.
-- Stores the public category slug in the `category` column so the
-- storefront filter works out of the box.
-- ============================================

INSERT INTO portfolio (title, description, image, tag, category, client_name, is_featured, sort_order, status, page_location)
SELECT v.title, v.description, v.image, v.tag, v.category, v.client_name, v.is_featured, v.sort_order, v.status, 'all'
FROM (VALUES
  ('Pink & Green Wedding on Grand Staircase', 'Groom in pink with groomsmen in sage green – staircase wedding styling.', '/images/portfolio/wedding-pink-green-stairs.jpg', 'wedding', 'wedding', '', TRUE, 101, 'active'),
  ('Brown & Beige Wedding Groomsmen', 'Coordinated brown and beige three-piece groomsmen suits.', '/images/portfolio/wedding-brown-beige-group.jpg', 'wedding', 'wedding', '', FALSE, 102, 'active'),
  ('Custom White Wedding Suit', 'Crisp white wedding suit styled with the bride.', '/images/portfolio/wedding-white-suit-bride.jpg', 'wedding', 'wedding', '', FALSE, 103, 'active'),
  ('Teal Bespoke Groomsmen', 'Teal bespoke groomsmen suits for a formal ceremony.', '/images/portfolio/wedding-teal-groomsmen.jpg', 'wedding', 'wedding', '', FALSE, 104, 'active'),
  ('Green Double-Breasted Tuxedo Groom', 'Green double-breasted tuxedo styling with the bride.', '/images/portfolio/wedding-green-tux-groom-bride.jpg', 'wedding', 'wedding', '', TRUE, 105, 'active'),

  ('Agbada & Pink Gown Couples Styling', 'His and hers styling: agbada paired with a pink gown.', '/images/portfolio/couples-agbada-pink-gown.jpg', 'couples', 'couples', '', TRUE, 201, 'active'),
  ('Black Dress & Burgundy Suit Couple', 'Elegant evening pairing: black dress with burgundy suit.', '/images/portfolio/couples-black-dress-burgundy-suit.jpg', 'couples', 'couples', '', FALSE, 202, 'active'),
  ('Teal Matching Couples Set', 'Matching teal his-and-hers couples outfit.', '/images/portfolio/couples-teal-matching-set.jpg', 'couples', 'couples', '', FALSE, 203, 'active'),
  ('Black Suit with Red Roses', 'Classic black suit with a roses bouquet couple portrait.', '/images/portfolio/couples-black-suit-roses.jpg', 'couples', 'couples', '', TRUE, 204, 'active'),
  ('Cream Suit & Red Gown', 'Romantic cream suit and red gown couple styling.', '/images/portfolio/couples-cream-suit-red-gown.jpg', 'couples', 'couples', '', FALSE, 205, 'active'),

  ('Green Senator Suit with Embroidered Band', 'Green senator suit with embroidered band and fedora.', '/images/portfolio/senator-green-embroidered-hat.jpg', 'senator-suit', 'senator-suit', '', TRUE, 301, 'active'),
  ('Navy Senator Suit with Kufi Cap', 'Navy senator suit with embroidered band and kufi cap.', '/images/portfolio/senator-navy-embroidered-cap.jpg', 'senator-suit', 'senator-suit', '', FALSE, 302, 'active'),
  ('Burgundy Senator Suit with Kufi Cap', 'Burgundy senator suit with embroidered band and kufi cap.', '/images/portfolio/senator-burgundy-embroidered-cap.jpg', 'senator-suit', 'senator-suit', '', FALSE, 303, 'active'),
  ('Navy Senator Suit with Walking Cane', 'Navy senator suit with gold embroidered sash and walking cane.', '/images/portfolio/senator-navy-gold-embroidered-cane.jpg', 'senator-suit', 'senator-suit', '', TRUE, 304, 'active'),
  ('Black & Gold Senator – Formal', 'Black senator suit with gold embroidery formal styling.', '/images/portfolio/senator-black-gold-embroidery-formal.jpg', 'senator-suit', 'senator-suit', '', FALSE, 305, 'active'),

  ('Grey Kaunda Suit with African Cap', 'Grey kaunda suit with black pocket detail and African cap.', '/images/portfolio/kaunda-grey-black-pocket-cap.jpg', 'kaunda-suit', 'kaunda-suit', '', TRUE, 401, 'active'),
  ('Brown Kaunda Suit with African Cap', 'Brown kaunda suit with black pocket detail and African cap.', '/images/portfolio/kaunda-brown-black-pocket-cap.jpg', 'kaunda-suit', 'kaunda-suit', '', FALSE, 402, 'active'),
  ('Khaki Safari Kaunda Suit', 'Khaki short-sleeve kaunda safari suit with pocket accents.', '/images/portfolio/kaunda-khaki-shortsleeve-safari.jpg', 'kaunda-suit', 'kaunda-suit', '', FALSE, 403, 'active'),
  ('Brown Pinstripe Kaunda with Gold Buttons', 'Brown pinstripe kaunda with gold buttons and embroidered pockets.', '/images/portfolio/kaunda-brown-pinstripe-gold-buttons.jpg', 'kaunda-suit', 'kaunda-suit', '', TRUE, 404, 'active'),
  ('Mint Green Kaunda with Mandarin Collar', 'Mint green kaunda suit with mandarin collar and pocket square.', '/images/portfolio/kaunda-mint-green-mandarin.jpg', 'kaunda-suit', 'kaunda-suit', '', FALSE, 405, 'active'),
  ('Brown Kaunda with Pocket Square', 'Brown kaunda suit with mandarin collar and pocket square.', '/images/portfolio/kaunda-brown-mandarin-pocketsquare.jpg', 'kaunda-suit', 'kaunda-suit', '', FALSE, 406, 'active'),

  ('Navy Pinstripe Three-Piece Bespoke', 'Navy pinstripe three-piece bespoke suit.', '/images/portfolio/bespoke-navy-pinstripe-3piece.jpg', 'bespoke', 'bespoke', '', TRUE, 501, 'active'),
  ('Navy Pinstripe Bespoke', 'Navy pinstripe bespoke suit portrait.', '/images/portfolio/bespoke-navy-pinstripe-man.jpg', 'bespoke', 'bespoke', '', FALSE, 502, 'active'),
  ('Grey Tweed Bespoke Sport Coat', 'Grey tweed bespoke sport coat.', '/images/portfolio/bespoke-grey-tweed.jpg', 'bespoke', 'bespoke', '', FALSE, 503, 'active'),
  ('Navy Double-Breasted with Gold Buttons', 'Navy double-breasted suit with gold buttons.', '/images/portfolio/bespoke-navy-double-breasted-gold.jpg', 'bespoke', 'bespoke', '', FALSE, 504, 'active'),
  ('Burnt Orange Double-Breasted Blazer', 'Burnt orange double-breasted blazer.', '/images/portfolio/bespoke-burnt-orange-double-breasted.jpg', 'bespoke', 'bespoke', '', FALSE, 505, 'active'),

  ('Cream Double-Breasted Made-to-Measure', 'Cream double-breasted made-to-measure suit.', '/images/portfolio/bespoke-cream-double-breasted.jpg', 'made-to-measure', 'made-to-measure', '', TRUE, 601, 'active'),
  ('Orange Made-to-Measure', 'Orange made-to-measure blazer.', '/images/portfolio/bespoke-orange-mannequin.jpg', 'made-to-measure', 'made-to-measure', '', FALSE, 602, 'active'),
  ('Light Blue Made-to-Measure Blazer', 'Light blue blazer made-to-measure on mannequin.', '/images/portfolio/bespoke-lightblue-blazer-mannequin.jpg', 'made-to-measure', 'made-to-measure', '', FALSE, 603, 'active'),
  ('Rust Red Made-to-Measure Blazer', 'Rust red blazer made-to-measure on mannequin.', '/images/portfolio/bespoke-rust-red-blazer-mannequin.jpg', 'made-to-measure', 'made-to-measure', '', FALSE, 604, 'active'),
  ('Green Houndstooth Double-Breasted', 'Green houndstooth double-breasted blazer.', '/images/portfolio/bespoke-green-houndstooth-mannequin.jpg', 'made-to-measure', 'made-to-measure', '', FALSE, 605, 'active')
) AS v(title, description, image, tag, category, client_name, is_featured, sort_order, status)
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio p WHERE p.image = v.image
);
