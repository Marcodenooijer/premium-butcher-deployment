-- Premium Biological Butcher - Seed Data
-- Sample data for testing and demonstration

-- Insert Brand
INSERT INTO brands (brand_id, brand_name, legal_name, domain) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Premium Biological Butcher', 'Premium Biological Butcher B.V.', 'biologischvleeschatelier.profile.elysia.marketing');

-- Insert B2C Customer
INSERT INTO customers (
    customer_id, brand_id, customer_type, email, first_name, last_name,
    phone, date_of_birth, account_status, membership_tier,
    gdpr_consent_marketing, gdpr_consent_analytics
) VALUES (
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000',
    'B2C',
    'john.smith@example.com',
    'John',
    'Smith',
    '+31612345678',
    '1982-05-15',
    'active',
    'Gold',
    true,
    true
);

-- Insert B2C Address
INSERT INTO addresses (customer_id, address_type, street_address, city, postal_code, country, is_default) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'both', 'Prinsengracht 123', 'Amsterdam', '1015 DL', 'NL', true);

-- Insert Family Members for B2C Customer
INSERT INTO family_members (customer_id, relationship, gender, age, dietary_requirements) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Spouse', 'Female', 38, 'Vegetarian'),
('660e8400-e29b-41d4-a716-446655440001', 'Child', 'Male', 12, 'No restrictions'),
('660e8400-e29b-41d4-a716-446655440001', 'Child', 'Female', 9, 'Dairy-free');

-- Insert B2C Preferences
INSERT INTO preferences (
    customer_id, favorite_meats, preferred_cuts, cooking_preference,
    household_size, weekly_consumption_kg, organic_only, grass_fed_preference,
    local_sourcing, cooking_skill_level, favorite_cuisines, cooking_equipment,
    email_notifications, newsletter_subscription
) VALUES (
    '660e8400-e29b-41d4-a716-446655440001',
    ARRAY['Beef', 'Chicken', 'Pork', 'Lamb'],
    ARRAY['Ribeye', 'Tenderloin', 'Chicken Breast'],
    'Medium',
    4,
    3.5,
    true,
    true,
    true,
    'Intermediate',
    ARRAY['Italian', 'French', 'Dutch'],
    ARRAY['Oven', 'Grill', 'Sous-vide'],
    true,
    true
);

-- Insert B2B Customer
INSERT INTO customers (
    customer_id, brand_id, customer_type, email, company_name, legal_entity_name,
    business_type, company_size, website, phone, account_status,
    credit_limit, payment_terms, currency
) VALUES (
    '770e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440000',
    'B2B',
    'info@degoudenlepel.nl',
    'De Gouden Lepel Restaurant Group',
    'De Gouden Lepel B.V.',
    'Restaurant Chain',
    '50-100 employees',
    'www.degoudenlepel.nl',
    '+31201234567',
    'active',
    25000.00,
    'Net 30',
    'EUR'
);

-- Insert B2B Billing Address
INSERT INTO addresses (customer_id, address_type, street_address, city, postal_code, country, is_default) VALUES
('770e8400-e29b-41d4-a716-446655440002', 'billing', 'Herengracht 456', 'Amsterdam', '1017 CA', 'NL', true);

-- Insert Departments for B2B Customer
INSERT INTO departments (
    customer_id, location_name, center_code, department_type,
    street_address, city, postal_code, country,
    delivery_instructions, delivery_time_window, preferred_delivery_days,
    weekly_volume_kg, is_active
) VALUES
(
    '770e8400-e29b-41d4-a716-446655440002',
    'Main Restaurant - Amsterdam Center',
    'AMS-001',
    'Main Kitchen',
    'Prinsengracht 123',
    'Amsterdam',
    '1015 DL',
    'NL',
    'Loading dock at rear entrance, Ring bell for kitchen staff',
    '06:00 - 08:00',
    ARRAY['Monday', 'Wednesday', 'Friday'],
    450.00,
    true
),
(
    '770e8400-e29b-41d4-a716-446655440002',
    'Banquet Hall - Amsterdam Zuid',
    'AMS-002',
    'Event Kitchen',
    'Beethovenstraat 89',
    'Amsterdam',
    '1077 HN',
    'NL',
    'Main entrance, ask for events coordinator',
    '07:00 - 09:00',
    ARRAY['Tuesday', 'Thursday'],
    350.00,
    true
),
(
    '770e8400-e29b-41d4-a716-446655440002',
    'Catering Kitchen - Utrecht',
    'UTR-001',
    'Catering Prep',
    'Oudegracht 234',
    'Utrecht',
    '3511 NP',
    'NL',
    'Side entrance on Vismarkt, delivery between 6-8 AM only',
    '06:00 - 08:00',
    ARRAY['Monday', 'Thursday'],
    280.00,
    true
);

-- Insert Contact Persons for B2B Customer
INSERT INTO contact_persons (
    customer_id, full_name, job_title, role, department_name,
    email, mobile_phone, office_phone,
    can_order, can_approve, spending_limit, is_active
) VALUES
(
    '770e8400-e29b-41d4-a716-446655440002',
    'Anna Jansen',
    'Operations Director',
    'Primary Account Holder',
    'Management',
    'anna.jansen@degoudenlepel.nl',
    '+31611112222',
    '+31201234567',
    true,
    true,
    25000.00,
    true
),
(
    '770e8400-e29b-41d4-a716-446655440002',
    'Tom Visser',
    'Purchasing Manager',
    'Purchasing Manager',
    'Procurement',
    'tom.visser@degoudenlepel.nl',
    '+31622223333',
    '+31201234568',
    true,
    true,
    10000.00,
    true
),
(
    '770e8400-e29b-41d4-a716-446655440002',
    'Lisa de Jong',
    'Finance Manager',
    'Finance Contact',
    'Finance',
    'lisa.dejong@degoudenlepel.nl',
    '+31633334444',
    '+31201234569',
    false,
    false,
    0.00,
    true
);

-- Insert B2B Preferences
INSERT INTO preferences (
    customer_id, favorite_meats, preferred_cuts, weekly_consumption_kg,
    organic_only, grass_fed_preference, local_sourcing,
    email_notifications, price_alerts
) VALUES (
    '770e8400-e29b-41d4-a716-446655440002',
    ARRAY['Beef', 'Lamb', 'Poultry', 'Pork'],
    ARRAY['Ribeye', 'Tenderloin', 'Lamb Rack', 'Duck Breast'],
    1080.00,
    true,
    true,
    true,
    true,
    true
);

-- Insert Sample Orders for B2C Customer
INSERT INTO orders (
    customer_id, order_number, order_date, order_status,
    subtotal, tax_amount, total_amount, delivery_date
) VALUES
(
    '660e8400-e29b-41d4-a716-446655440001',
    'ORD-B2C-001',
    CURRENT_TIMESTAMP - INTERVAL '7 days',
    'delivered',
    85.50,
    17.96,
    103.46,
    CURRENT_DATE - INTERVAL '5 days'
),
(
    '660e8400-e29b-41d4-a716-446655440001',
    'ORD-B2C-002',
    CURRENT_TIMESTAMP - INTERVAL '14 days',
    'delivered',
    92.00,
    19.32,
    111.32,
    CURRENT_DATE - INTERVAL '12 days'
);

-- Insert Order Items
INSERT INTO order_items (order_id, product_name, product_sku, quantity, unit_price, line_total) VALUES
((SELECT order_id FROM orders WHERE order_number = 'ORD-B2C-001'), 'Organic Ribeye Steak', 'BEEF-RIB-001', 1.5, 32.00, 48.00),
((SELECT order_id FROM orders WHERE order_number = 'ORD-B2C-001'), 'Free-Range Chicken Breast', 'CHKN-BRS-001', 1.0, 18.50, 18.50),
((SELECT order_id FROM orders WHERE order_number = 'ORD-B2C-001'), 'Organic Ground Beef', 'BEEF-GRD-001', 1.0, 19.00, 19.00);

-- Insert Sample Orders for B2B Customer
INSERT INTO orders (
    customer_id, department_id, order_number, order_date, order_status,
    subtotal, tax_amount, total_amount, delivery_date
) VALUES
(
    '770e8400-e29b-41d4-a716-446655440002',
    (SELECT department_id FROM departments WHERE center_code = 'AMS-001'),
    'ORD-B2B-001',
    CURRENT_TIMESTAMP - INTERVAL '3 days',
    'delivered',
    1150.00,
    241.50,
    1391.50,
    CURRENT_DATE - INTERVAL '1 day'
);

-- Insert B2B Order Items
INSERT INTO order_items (order_id, product_name, product_sku, quantity, unit_price, line_total) VALUES
((SELECT order_id FROM orders WHERE order_number = 'ORD-B2B-001'), 'Organic Ribeye Steak (Bulk)', 'BEEF-RIB-B001', 25.0, 28.00, 700.00),
((SELECT order_id FROM orders WHERE order_number = 'ORD-B2B-001'), 'Organic Lamb Rack', 'LAMB-RCK-001', 15.0, 30.00, 450.00);

-- Insert Invoice for B2B Order
INSERT INTO invoices (
    customer_id, order_id, invoice_number, invoice_date, due_date,
    subtotal, tax_amount, total_amount, payment_status
) VALUES (
    '770e8400-e29b-41d4-a716-446655440002',
    (SELECT order_id FROM orders WHERE order_number = 'ORD-B2B-001'),
    'INV-2025-001',
    CURRENT_DATE - INTERVAL '1 day',
    CURRENT_DATE + INTERVAL '29 days',
    1150.00,
    241.50,
    1391.50,
    'pending'
);

-- Insert B2C Subscription
INSERT INTO subscriptions (
    customer_id, subscription_type, frequency, next_delivery_date, is_active
) VALUES (
    '660e8400-e29b-41d4-a716-446655440001',
    'Family Box - Medium',
    'Weekly',
    CURRENT_DATE + INTERVAL '7 days',
    true
);

-- Insert Loyalty Points for B2C Customer
INSERT INTO loyalty_points (
    customer_id, transaction_type, points, description, balance_after
) VALUES
(
    '660e8400-e29b-41d4-a716-446655440001',
    'earned',
    100,
    'Welcome bonus',
    100
),
(
    '660e8400-e29b-41d4-a716-446655440001',
    'earned',
    103,
    'Order ORD-B2C-001',
    203
),
(
    '660e8400-e29b-41d4-a716-446655440001',
    'earned',
    111,
    'Order ORD-B2C-002',
    314
),
(
    '660e8400-e29b-41d4-a716-446655440001',
    'redeemed',
    50,
    'Discount on order',
    264
);

-- Insert Certifications for B2B Customer
INSERT INTO certifications (
    customer_id, certification_type, certification_number,
    issuing_authority, issue_date, expiry_date, is_active, verified
) VALUES
(
    '770e8400-e29b-41d4-a716-446655440002',
    'HACCP',
    'HACCP-2024-001',
    'Dutch Food Safety Authority',
    '2024-01-15',
    '2026-01-15',
    true,
    true
),
(
    '770e8400-e29b-41d4-a716-446655440002',
    'ISO 22000',
    'ISO22000-2024-456',
    'ISO Certification Body',
    '2024-03-01',
    '2027-03-01',
    true,
    true
);

-- Insert Sustainability Metrics
INSERT INTO sustainability_metrics (
    customer_id, local_sourcing_percentage, carbon_saved_kg,
    partner_farms_count, organic_percentage, metric_date, metric_period
) VALUES
(
    '660e8400-e29b-41d4-a716-446655440001',
    87.00,
    245.00,
    12,
    95.00,
    CURRENT_DATE,
    'monthly'
),
(
    '770e8400-e29b-41d4-a716-446655440002',
    89.00,
    1240.00,
    18,
    98.00,
    CURRENT_DATE,
    'monthly'
);

-- Verify data
SELECT 'Brands:', COUNT(*) FROM brands;
SELECT 'Customers:', COUNT(*), customer_type FROM customers GROUP BY customer_type;
SELECT 'Departments:', COUNT(*) FROM departments;
SELECT 'Contact Persons:', COUNT(*) FROM contact_persons;
SELECT 'Orders:', COUNT(*) FROM orders;
SELECT 'Invoices:', COUNT(*) FROM invoices;
