-- ============================================
-- COMPLETE DATABASE SETUP
-- Run all migrations in order
-- Supabase SQL - Run this file to create all tables
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Shared trigger function for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Run all module migrations in order:
-- 001: Products
-- 002: Categories
-- 003: Orders & Order Items
-- 004: Offers (Hero Banners, Banners, Carousels, Navbar Offers, Popup Offers)
-- 005: Newsletter (Subscribers & Email Campaigns)
-- 006: Delivery Zones
-- 007: Policies
-- 008: Admin Users
-- 009: Card Details (Payment Methods)
-- 010: Settings

-- See individual files in supabase/migrations/ for each module's SQL.
-- Execute them in numerical order (001 through 010).
