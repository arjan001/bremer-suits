-- ============================================
-- Policies Table
-- Supabase SQL Migration
-- ============================================

CREATE TABLE IF NOT EXISTS policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_policies_slug ON policies(slug);

-- Auto-update trigger
CREATE TRIGGER policies_updated_at
  BEFORE UPDATE ON policies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow full access to policies"
  ON policies FOR ALL
  USING (true)
  WITH CHECK (true);
