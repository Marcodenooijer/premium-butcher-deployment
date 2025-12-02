-- Create sustainability_impact table
CREATE TABLE IF NOT EXISTS sustainability_impact (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  co2_saved_kg DECIMAL(10, 2) DEFAULT 0,
  local_sourcing_percentage INTEGER DEFAULT 0,
  partner_farms_count INTEGER DEFAULT 0,
  sustainability_score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(customer_id)
);

-- Insert sample data for existing customer
INSERT INTO sustainability_impact (customer_id, co2_saved_kg, local_sourcing_percentage, partner_farms_count, sustainability_score)
VALUES (1, 125.50, 85, 12, 92)
ON CONFLICT (customer_id) DO UPDATE SET
  co2_saved_kg = EXCLUDED.co2_saved_kg,
  local_sourcing_percentage = EXCLUDED.local_sourcing_percentage,
  partner_farms_count = EXCLUDED.partner_farms_count,
  sustainability_score = EXCLUDED.sustainability_score,
  updated_at = NOW();
