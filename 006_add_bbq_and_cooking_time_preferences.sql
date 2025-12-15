-- Migration: Add BBQ Profile and Cooking Time Preferences
-- Date: 2025-12-11
-- Description: Extends the existing preference columns with BBQ profile and cooking time fields
-- Note: This migration assumes migration 005_enhanced_preferences.sql has already been applied

-- Add BBQ Profile Columns
ALTER TABLE customers ADD COLUMN IF NOT EXISTS has_bbq BOOLEAN DEFAULT false;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS bbq_type VARCHAR(50);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS bbq_frequency VARCHAR(50);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS bbq_skill_level VARCHAR(50);

-- Add Cooking Time Columns (for meal planning)
ALTER TABLE customers ADD COLUMN IF NOT EXISTS cooking_minutes_weekdays INTEGER DEFAULT 30;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS cooking_minutes_weekend INTEGER DEFAULT 60;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS cooking_minutes_festive INTEGER DEFAULT 120;

-- Add additional preference columns that may be missing from migration 005
ALTER TABLE customers ADD COLUMN IF NOT EXISTS favorite_meat_other VARCHAR(255);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS preferred_cut_other VARCHAR(255);

-- Verify the migration
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'customers' 
-- ORDER BY ordinal_position;
