-- Customer table
CREATE TABLE IF NOT EXISTS customer (
    id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    nationality VARCHAR(100),
    ethnicity VARCHAR(100),
    language VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Family members table
CREATE TABLE IF NOT EXISTS family_member (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customer(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100),
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customer(id) ON DELETE CASCADE,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2),
    status VARCHAR(50),
    items JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscription (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customer(id) ON DELETE CASCADE,
    subscription_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    start_date DATE,
    end_date DATE,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sustainability data table
CREATE TABLE IF NOT EXISTS sustainability_data (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customer(id) ON DELETE CASCADE,
    co2_saved DECIMAL(10, 2),
    trees_planted INTEGER,
    water_saved DECIMAL(10, 2),
    year INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_customer_firebase_uid ON customer(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_customer_email ON customer(email);
CREATE INDEX IF NOT EXISTS idx_family_member_customer_id ON family_member(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscription_customer_id ON subscription(customer_id);
CREATE INDEX IF NOT EXISTS idx_sustainability_customer_id ON sustainability_data(customer_id);

-- Recommended order table
CREATE TABLE IF NOT EXISTS recommended_order (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customer(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER,
    price DECIMAL(10, 2),
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_recommended_order_customer_id ON recommended_order(customer_id);
