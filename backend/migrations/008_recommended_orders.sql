-- Create recommended_orders table
CREATE TABLE IF NOT EXISTS recommended_orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100),
    quantity INTEGER DEFAULT 1,
    price DECIMAL(10, 2),
    image_url TEXT,
    is_recommended BOOLEAN DEFAULT false,
    recommendation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_recommended_orders_customer ON recommended_orders(customer_id);

-- Insert sample recommended orders for existing customers
INSERT INTO recommended_orders (customer_id, product_name, product_sku, quantity, price, image_url, is_recommended, recommendation_reason)
SELECT 
    c.id,
    'Biologisch Rundvlees Gehakt',
    'BIO-BEEF-001',
    500,
    12.50,
    'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400',
    false,
    'Your usual order'
FROM customers c
WHERE c.email = 'marco.denooijer17@gmail.com'
ON CONFLICT DO NOTHING;

INSERT INTO recommended_orders (customer_id, product_name, product_sku, quantity, price, image_url, is_recommended, recommendation_reason )
SELECT 
    c.id,
    'Biologische Kipfilet',
    'BIO-CHICKEN-002',
    400,
    15.00,
    'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400',
    false,
    'Your usual order'
FROM customers c
WHERE c.email = 'marco.denooijer17@gmail.com'
ON CONFLICT DO NOTHING;

INSERT INTO recommended_orders (customer_id, product_name, product_sku, quantity, price, image_url, is_recommended, recommendation_reason )
SELECT 
    c.id,
    'Premium Dry-Aged Ribeye',
    'BIO-RIBEYE-PREMIUM',
    2,
    28.00,
    'https://images.unsplash.com/photo-1558030006-450675393462?w=400',
    true,
    'Perfect with your usual order - customers love this!'
FROM customers c
WHERE c.email = 'marco.denooijer17@gmail.com'
ON CONFLICT DO NOTHING;
