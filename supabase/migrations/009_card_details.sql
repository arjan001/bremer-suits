-- ============================================
-- Card Details (Payment Methods) Table
-- Supabase SQL Migration
-- ============================================

CREATE TABLE IF NOT EXISTS card_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL DEFAULT 'mpesa' CHECK (type IN ('mpesa', 'bank', 'card_gateway')),
  label TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_card_details_type ON card_details(type);
CREATE INDEX IF NOT EXISTS idx_card_details_active ON card_details(is_active);

-- Enable Row Level Security
ALTER TABLE card_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow full access to card_details"
  ON card_details FOR ALL
  USING (true)
  WITH CHECK (true);
