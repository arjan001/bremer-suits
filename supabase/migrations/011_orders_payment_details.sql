-- ============================================
-- Add payment_details (JSONB) and payment_status to orders table
-- Stores full card/mpesa payment information with each order
-- ============================================

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_details JSONB,
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending_processing'
    CHECK (payment_status IN ('pending_collection', 'pending_processing', 'completed', 'failed'));
