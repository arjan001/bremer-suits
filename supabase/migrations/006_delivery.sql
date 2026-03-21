-- ============================================
-- Delivery Zones Table
-- Supabase SQL Migration
-- ============================================

CREATE TABLE IF NOT EXISTS delivery_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  estimated_days TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_delivery_zones_status ON delivery_zones(status);

-- Enable Row Level Security
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow full access to delivery_zones"
  ON delivery_zones FOR ALL
  USING (true)
  WITH CHECK (true);
