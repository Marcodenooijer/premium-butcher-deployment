-- Premium Biological Butcher - Customer Profile Database Schema
-- PostgreSQL 14+
-- Complete data model for B2C and B2B customer profiles

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- BRANDS TABLE
-- ============================================================================
CREATE TABLE brands (
    brand_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_name VARCHAR(200) NOT NULL,
    legal_name VARCHAR(200),
    domain VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

COMMENT ON TABLE brands IS 'Top-level organizational entity for multi-brand support';
COMMENT ON COLUMN brands.brand_id IS 'Unique identifier for the brand';
COMMENT ON COLUMN brands.brand_name IS 'Display name of the brand';

-- ============================================================================
-- CUSTOMERS TABLE (B2C and B2B)
-- ============================================================================
CREATE TABLE customers (
    customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES brands(brand_id) ON DELETE CASCADE,
    shopify_customer_id BIGINT UNIQUE,
    customer_type VARCHAR(10) NOT NULL CHECK (customer_type IN ('B2C', 'B2B')),
    
    -- Personal/Company Info
    email VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT false,
    phone VARCHAR(20),
    phone_verified BOOLEAN DEFAULT false,
    
    -- B2C Fields
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    
    -- B2B Fields
    company_name VARCHAR(200),
    legal_entity_name VARCHAR(200),
    vat_number_encrypted TEXT,
    vat_number_iv TEXT,
    vat_number_auth_tag TEXT,
    coc_number_encrypted TEXT,
    coc_number_iv TEXT,
    coc_number_auth_tag TEXT,
    business_type VARCHAR(100),
    company_size VARCHAR(50),
    website VARCHAR(255),
    
    -- Account Details
    account_status VARCHAR(20) DEFAULT 'active' CHECK (account_status IN ('active', 'inactive', 'suspended', 'deleted')),
    membership_tier VARCHAR(20) CHECK (membership_tier IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
    member_since TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- B2B Financial
    credit_limit DECIMAL(10, 2),
    payment_terms VARCHAR(50),
    currency VARCHAR(3) DEFAULT 'EUR',
    
    -- Security
    password_hash TEXT,
    mfa_enabled BOOLEAN DEFAULT false,
    mfa_secret TEXT,
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip INET,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    
    -- GDPR
    gdpr_consent_marketing BOOLEAN DEFAULT false,
    gdpr_consent_analytics BOOLEAN DEFAULT false,
    gdpr_consent_timestamp TIMESTAMP WITH TIME ZONE,
    gdpr_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT email_unique_per_brand UNIQUE (brand_id, email),
    CONSTRAINT b2c_requires_name CHECK (
        customer_type = 'B2B' OR (first_name IS NOT NULL AND last_name IS NOT NULL)
    ),
    CONSTRAINT b2b_requires_company CHECK (
        customer_type = 'B2C' OR company_name IS NOT NULL
    )
);

CREATE INDEX idx_customers_brand ON customers(brand_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_shopify ON customers(shopify_customer_id);
CREATE INDEX idx_customers_type ON customers(customer_type);
CREATE INDEX idx_customers_status ON customers(account_status);

COMMENT ON TABLE customers IS 'Main customer table supporting both B2C and B2B profiles';
COMMENT ON COLUMN customers.customer_type IS 'B2C for individual consumers, B2B for business clients';
COMMENT ON COLUMN customers.vat_number_encrypted IS 'Encrypted VAT number for security';

-- ============================================================================
-- ADDRESSES TABLE
-- ============================================================================
CREATE TABLE addresses (
    address_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    address_type VARCHAR(20) NOT NULL CHECK (address_type IN ('billing', 'delivery', 'both')),
    
    -- Address Fields
    street_address VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(2) NOT NULL DEFAULT 'NL',
    
    -- Metadata
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_addresses_customer ON addresses(customer_id);
CREATE INDEX idx_addresses_type ON addresses(address_type);

COMMENT ON TABLE addresses IS 'Customer addresses for billing and delivery';

-- ============================================================================
-- FAMILY MEMBERS TABLE (B2C)
-- ============================================================================
CREATE TABLE family_members (
    family_member_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    
    -- Member Info
    relationship VARCHAR(50),
    gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),
    age INTEGER CHECK (age >= 0 AND age <= 120),
    dietary_requirements TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT customer_must_be_b2c CHECK (
        EXISTS (SELECT 1 FROM customers WHERE customer_id = family_members.customer_id AND customer_type = 'B2C')
    )
);

CREATE INDEX idx_family_members_customer ON family_members(customer_id);

COMMENT ON TABLE family_members IS 'Family member information for B2C customers';

-- ============================================================================
-- DEPARTMENTS/LOCATIONS TABLE (B2B)
-- ============================================================================
CREATE TABLE departments (
    department_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    
    -- Location Info
    location_name VARCHAR(200) NOT NULL,
    center_code VARCHAR(50) NOT NULL,
    department_type VARCHAR(100),
    
    -- Address
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(2) DEFAULT 'NL',
    
    -- Delivery Details
    delivery_instructions TEXT,
    delivery_time_window VARCHAR(50),
    preferred_delivery_days TEXT[], -- Array of days: ['Monday', 'Wednesday', 'Friday']
    weekly_volume_kg DECIMAL(10, 2),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT center_code_unique UNIQUE (customer_id, center_code),
    CONSTRAINT customer_must_be_b2b CHECK (
        EXISTS (SELECT 1 FROM customers WHERE customer_id = departments.customer_id AND customer_type = 'B2B')
    )
);

CREATE INDEX idx_departments_customer ON departments(customer_id);
CREATE INDEX idx_departments_center_code ON departments(center_code);

COMMENT ON TABLE departments IS 'Multiple delivery locations for B2B customers';
COMMENT ON COLUMN departments.center_code IS 'Unique identifier for each location (e.g., AMS-001)';

-- ============================================================================
-- CONTACT PERSONS TABLE (B2B)
-- ============================================================================
CREATE TABLE contact_persons (
    contact_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(department_id) ON DELETE SET NULL,
    
    -- Personal Info
    full_name VARCHAR(200) NOT NULL,
    job_title VARCHAR(100),
    role VARCHAR(100),
    department_name VARCHAR(100),
    
    -- Contact Details
    email VARCHAR(255) NOT NULL,
    mobile_phone VARCHAR(20),
    office_phone VARCHAR(20),
    
    -- Permissions
    can_order BOOLEAN DEFAULT false,
    can_approve BOOLEAN DEFAULT false,
    spending_limit DECIMAL(10, 2),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT customer_must_be_b2b CHECK (
        EXISTS (SELECT 1 FROM customers WHERE customer_id = contact_persons.customer_id AND customer_type = 'B2B')
    )
);

CREATE INDEX idx_contact_persons_customer ON contact_persons(customer_id);
CREATE INDEX idx_contact_persons_department ON contact_persons(department_id);
CREATE INDEX idx_contact_persons_email ON contact_persons(email);

COMMENT ON TABLE contact_persons IS 'Authorized personnel for B2B accounts with role-based permissions';

-- ============================================================================
-- PREFERENCES TABLE
-- ============================================================================
CREATE TABLE preferences (
    preference_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    
    -- Meat Preferences
    favorite_meats TEXT[], -- ['Beef', 'Lamb', 'Poultry']
    preferred_cuts TEXT[], -- ['Ribeye', 'Tenderloin']
    cooking_preference VARCHAR(50),
    household_size INTEGER,
    weekly_consumption_kg DECIMAL(5, 2),
    
    -- Quality Standards
    organic_only BOOLEAN DEFAULT false,
    grass_fed_preference BOOLEAN DEFAULT false,
    local_sourcing BOOLEAN DEFAULT false,
    halal_certified BOOLEAN DEFAULT false,
    kosher_certified BOOLEAN DEFAULT false,
    dry_aged_preference BOOLEAN DEFAULT false,
    
    -- B2C Culinary
    cooking_skill_level VARCHAR(50),
    favorite_cuisines TEXT[],
    cooking_equipment TEXT[],
    
    -- Communication
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    newsletter_subscription BOOLEAN DEFAULT false,
    price_alerts BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_customer_preferences UNIQUE (customer_id)
);

CREATE INDEX idx_preferences_customer ON preferences(customer_id);

COMMENT ON TABLE preferences IS 'Customer product preferences and communication settings';

-- ============================================================================
-- ORDERS TABLE
-- ============================================================================
CREATE TABLE orders (
    order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(department_id) ON DELETE SET NULL,
    shopify_order_id BIGINT UNIQUE,
    
    -- Order Details
    order_number VARCHAR(50) NOT NULL UNIQUE,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    order_status VARCHAR(50) DEFAULT 'pending' CHECK (order_status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    
    -- Amounts
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) NOT NULL,
    shipping_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    
    -- Delivery
    delivery_date DATE,
    delivery_time_window VARCHAR(50),
    delivery_instructions TEXT,
    
    -- B2B Specific
    approved_by UUID REFERENCES contact_persons(contact_id),
    approved_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_department ON orders(department_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_date ON orders(order_date);

COMMENT ON TABLE orders IS 'Customer orders with support for B2B approval workflow';

-- ============================================================================
-- ORDER ITEMS TABLE
-- ============================================================================
CREATE TABLE order_items (
    order_item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    
    -- Product Info
    product_id VARCHAR(100),
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100),
    
    -- Quantity and Price
    quantity DECIMAL(10, 2) NOT NULL,
    unit_of_measure VARCHAR(20) DEFAULT 'kg',
    unit_price DECIMAL(10, 2) NOT NULL,
    line_total DECIMAL(10, 2) NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

COMMENT ON TABLE order_items IS 'Line items for each order';

-- ============================================================================
-- INVOICES TABLE (B2B)
-- ============================================================================
CREATE TABLE invoices (
    invoice_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(order_id) ON DELETE SET NULL,
    
    -- Invoice Details
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    
    -- Amounts
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    
    -- Payment
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue', 'cancelled')),
    paid_date DATE,
    payment_method VARCHAR(50),
    
    -- Security
    digital_signature TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT customer_must_be_b2b CHECK (
        EXISTS (SELECT 1 FROM customers WHERE customer_id = invoices.customer_id AND customer_type = 'B2B')
    )
);

CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_order ON invoices(order_id);
CREATE INDEX idx_invoices_status ON invoices(payment_status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);

COMMENT ON TABLE invoices IS 'Invoices for B2B customers with payment tracking';

-- ============================================================================
-- SUBSCRIPTIONS TABLE (B2C)
-- ============================================================================
CREATE TABLE subscriptions (
    subscription_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    
    -- Subscription Details
    subscription_type VARCHAR(100),
    frequency VARCHAR(50) CHECK (frequency IN ('Weekly', 'Bi-weekly', 'Monthly')),
    next_delivery_date DATE,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_paused BOOLEAN DEFAULT false,
    paused_until DATE,
    
    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT customer_must_be_b2c CHECK (
        EXISTS (SELECT 1 FROM customers WHERE customer_id = subscriptions.customer_id AND customer_type = 'B2C')
    )
);

CREATE INDEX idx_subscriptions_customer ON subscriptions(customer_id);
CREATE INDEX idx_subscriptions_active ON subscriptions(is_active);

COMMENT ON TABLE subscriptions IS 'Recurring subscription boxes for B2C customers';

-- ============================================================================
-- LOYALTY POINTS TABLE (B2C)
-- ============================================================================
CREATE TABLE loyalty_points (
    loyalty_point_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    
    -- Transaction Details
    transaction_type VARCHAR(50) CHECK (transaction_type IN ('earned', 'redeemed', 'expired', 'adjusted')),
    points INTEGER NOT NULL,
    description TEXT,
    order_id UUID REFERENCES orders(order_id),
    
    -- Balance
    balance_after INTEGER NOT NULL,
    
    -- Expiry
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT customer_must_be_b2c CHECK (
        EXISTS (SELECT 1 FROM customers WHERE customer_id = loyalty_points.customer_id AND customer_type = 'B2C')
    )
);

CREATE INDEX idx_loyalty_points_customer ON loyalty_points(customer_id);
CREATE INDEX idx_loyalty_points_order ON loyalty_points(order_id);

COMMENT ON TABLE loyalty_points IS 'Loyalty points transactions for B2C customers';

-- ============================================================================
-- CERTIFICATIONS TABLE (B2B)
-- ============================================================================
CREATE TABLE certifications (
    certification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    
    -- Certification Details
    certification_type VARCHAR(100) NOT NULL,
    certification_number VARCHAR(100),
    issuing_authority VARCHAR(200),
    issue_date DATE,
    expiry_date DATE,
    
    -- Document
    document_url TEXT,
    document_hash TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT customer_must_be_b2b CHECK (
        EXISTS (SELECT 1 FROM customers WHERE customer_id = certifications.customer_id AND customer_type = 'B2B')
    )
);

CREATE INDEX idx_certifications_customer ON certifications(customer_id);
CREATE INDEX idx_certifications_expiry ON certifications(expiry_date);

COMMENT ON TABLE certifications IS 'Food safety and quality certifications for B2B customers';

-- ============================================================================
-- SECURITY EVENTS TABLE
-- ============================================================================
CREATE TABLE security_events (
    event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(customer_id) ON DELETE SET NULL,
    
    -- Event Details
    event_type VARCHAR(100) NOT NULL,
    event_description TEXT,
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    request_path TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_security_events_customer ON security_events(customer_id);
CREATE INDEX idx_security_events_type ON security_events(event_type);
CREATE INDEX idx_security_events_severity ON security_events(severity);
CREATE INDEX idx_security_events_created ON security_events(created_at);

COMMENT ON TABLE security_events IS 'Security event logging for audit and monitoring';

-- ============================================================================
-- AUDIT LOG TABLE
-- ============================================================================
CREATE TABLE audit_log (
    audit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(customer_id) ON DELETE SET NULL,
    contact_id UUID REFERENCES contact_persons(contact_id) ON DELETE SET NULL,
    
    -- Action Details
    action_type VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_customer ON audit_log(customer_id);
CREATE INDEX idx_audit_log_contact ON audit_log(contact_id);
CREATE INDEX idx_audit_log_action ON audit_log(action_type);
CREATE INDEX idx_audit_log_table ON audit_log(table_name);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

COMMENT ON TABLE audit_log IS 'Comprehensive audit trail for all data changes';

-- ============================================================================
-- SUSTAINABILITY METRICS TABLE
-- ============================================================================
CREATE TABLE sustainability_metrics (
    metric_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    
    -- Metrics
    local_sourcing_percentage DECIMAL(5, 2),
    carbon_saved_kg DECIMAL(10, 2),
    partner_farms_count INTEGER,
    organic_percentage DECIMAL(5, 2),
    
    -- Period
    metric_date DATE NOT NULL,
    metric_period VARCHAR(20) CHECK (metric_period IN ('daily', 'weekly', 'monthly', 'yearly')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_customer_metric_date UNIQUE (customer_id, metric_date, metric_period)
);

CREATE INDEX idx_sustainability_metrics_customer ON sustainability_metrics(customer_id);
CREATE INDEX idx_sustainability_metrics_date ON sustainability_metrics(metric_date);

COMMENT ON TABLE sustainability_metrics IS 'Sustainability impact tracking for customers';

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_members_updated_at BEFORE UPDATE ON family_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_persons_updated_at BEFORE UPDATE ON contact_persons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_preferences_updated_at BEFORE UPDATE ON preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate loyalty points balance
CREATE OR REPLACE FUNCTION calculate_loyalty_balance(p_customer_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_balance INTEGER;
BEGIN
    SELECT COALESCE(SUM(
        CASE 
            WHEN transaction_type = 'earned' THEN points
            WHEN transaction_type = 'redeemed' THEN -points
            WHEN transaction_type = 'expired' THEN -points
            WHEN transaction_type = 'adjusted' THEN points
        END
    ), 0)
    INTO v_balance
    FROM loyalty_points
    WHERE customer_id = p_customer_id;
    
    RETURN v_balance;
END;
$$ LANGUAGE plpgsql;

-- Function to check spending limit (B2B)
CREATE OR REPLACE FUNCTION check_spending_limit(
    p_contact_id UUID,
    p_order_amount DECIMAL
) RETURNS BOOLEAN AS $$
DECLARE
    v_spending_limit DECIMAL;
    v_can_order BOOLEAN;
BEGIN
    SELECT spending_limit, can_order
    INTO v_spending_limit, v_can_order
    FROM contact_persons
    WHERE contact_id = p_contact_id AND is_active = true;
    
    IF NOT FOUND OR NOT v_can_order THEN
        RETURN false;
    END IF;
    
    IF v_spending_limit IS NULL OR p_order_amount <= v_spending_limit THEN
        RETURN true;
    END IF;
    
    RETURN false;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View: Customer Summary
CREATE OR REPLACE VIEW customer_summary AS
SELECT 
    c.customer_id,
    c.brand_id,
    c.customer_type,
    CASE 
        WHEN c.customer_type = 'B2C' THEN c.first_name || ' ' || c.last_name
        ELSE c.company_name
    END AS display_name,
    c.email,
    c.phone,
    c.account_status,
    c.member_since,
    COUNT(DISTINCT o.order_id) AS total_orders,
    COALESCE(SUM(o.total_amount), 0) AS total_spent,
    COALESCE(AVG(o.total_amount), 0) AS average_order_value,
    MAX(o.order_date) AS last_order_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.gdpr_deleted = false
GROUP BY c.customer_id;

COMMENT ON VIEW customer_summary IS 'Summary view of customer information and order statistics';

-- View: B2B Customer Dashboard
CREATE OR REPLACE VIEW b2b_customer_dashboard AS
SELECT 
    c.customer_id,
    c.company_name,
    c.account_status,
    c.credit_limit,
    c.payment_terms,
    COUNT(DISTINCT d.department_id) AS location_count,
    COUNT(DISTINCT cp.contact_id) AS contact_count,
    COUNT(DISTINCT o.order_id) AS total_orders,
    COALESCE(SUM(o.total_amount), 0) AS total_spent,
    COUNT(DISTINCT i.invoice_id) AS total_invoices,
    COALESCE(SUM(CASE WHEN i.payment_status = 'pending' THEN i.total_amount ELSE 0 END), 0) AS outstanding_balance,
    ROUND(
        COUNT(CASE WHEN i.payment_status = 'paid' AND i.paid_date <= i.due_date THEN 1 END)::DECIMAL / 
        NULLIF(COUNT(CASE WHEN i.payment_status = 'paid' THEN 1 END), 0) * 100,
        2
    ) AS on_time_payment_rate
FROM customers c
LEFT JOIN departments d ON c.customer_id = d.customer_id AND d.is_active = true
LEFT JOIN contact_persons cp ON c.customer_id = cp.customer_id AND cp.is_active = true
LEFT JOIN orders o ON c.customer_id = o.customer_id
LEFT JOIN invoices i ON c.customer_id = i.customer_id
WHERE c.customer_type = 'B2B' AND c.gdpr_deleted = false
GROUP BY c.customer_id;

COMMENT ON VIEW b2b_customer_dashboard IS 'Dashboard view for B2B customer metrics';

-- ============================================================================
-- GRANT PERMISSIONS (adjust as needed)
-- ============================================================================
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO app_user;
