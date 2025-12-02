-- Add settings and communication preferences columns
ALTER TABLE customers
ADD COLUMN IF NOT EXISTS delivery_instructions TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS marketing_communications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS marketing_personalization BOOLEAN DEFAULT true;

-- Update existing customer with default values
UPDATE customers SET 
  delivery_instructions = '',
  marketing_communications = true,
  marketing_personalization = true
WHERE delivery_instructions IS NULL;
