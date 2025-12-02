-- Events table (store events, holidays, festivities)
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tips table (product recommendations, recipes, advice)
CREATE TABLE IF NOT EXISTS tips (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  tip_type VARCHAR(50) NOT NULL,
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Loyalty rewards table (items that can be redeemed)
CREATE TABLE IF NOT EXISTS loyalty_rewards (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  icon VARCHAR(50),
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add loyalty_points column to customers
ALTER TABLE customers ADD COLUMN IF NOT EXISTS loyalty_points INTEGER DEFAULT 0;

-- Insert sample events
INSERT INTO events (title, description, event_date, event_type, icon) VALUES
('Christmas Sale', 'Special holiday discounts on premium cuts', '2024-12-25', 'holiday', 'gift'),
('BBQ Workshop', 'Learn grilling techniques from our master chef', '2024-12-15', 'store_event', 'flame'),
('New Year Celebration', 'Ring in the new year', '2025-01-01', 'festivity', 'star');

-- Insert sample tips
INSERT INTO tips (title, content, tip_type, icon) VALUES
('Perfect Ribeye', 'Let it rest at room temperature for 30 minutes before grilling', 'recipe', 'chef-hat'),
('Winter Special', 'Try our grass-fed beef - perfect for hearty winter stews', 'product', 'package'),
('Grilling Tip', 'Preheat your grill for at least 15 minutes', 'advice', 'flame');

-- Insert sample rewards
INSERT INTO loyalty_rewards (name, description, points_required, icon) VALUES
('Free Premium Steak', 'Redeem for any premium cut up to 500g', 2000, 'gift'),
('10% Discount Voucher', 'Get 10% off your next purchase', 500, 'tag'),
('BBQ Spice Set', 'Premium spice collection', 1000, 'star');
