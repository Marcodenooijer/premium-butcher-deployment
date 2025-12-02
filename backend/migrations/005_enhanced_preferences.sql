-- Add new preference columns to customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS favorite_meat_types TEXT[] DEFAULT '{}';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS preferred_cuts TEXT[] DEFAULT '{}';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS cooking_preference VARCHAR(50) DEFAULT 'medium-rare';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS household_size INTEGER DEFAULT 2;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS organic_only BOOLEAN DEFAULT false;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS grass_fed_preference BOOLEAN DEFAULT false;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS local_sourcing_priority BOOLEAN DEFAULT false;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS cooking_skill_level VARCHAR(50) DEFAULT 'intermediate';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS weekly_meat_consumption VARCHAR(50) DEFAULT '2-3 times';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS favorite_cuisines TEXT[] DEFAULT '{}';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS cooking_equipment TEXT[] DEFAULT '{}';

-- Update existing customer with sample data
UPDATE customers SET 
  favorite_meat_types = ARRAY['Beef', 'Pork'],
  preferred_cuts = ARRAY['Ribeye', 'Tenderloin'],
  cooking_preference = 'medium-rare',
  household_size = 4,
  organic_only = true,
  grass_fed_preference = true,
  local_sourcing_priority = true,
  cooking_skill_level = 'intermediate',
  weekly_meat_consumption = '2-3 times',
  favorite_cuisines = ARRAY['Dutch', 'French', 'BBQ'],
  cooking_equipment = ARRAY['Grill', 'Oven', 'Smoker']
WHERE id = 1;
