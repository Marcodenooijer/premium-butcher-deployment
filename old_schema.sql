--
-- PostgreSQL database dump
--

\restrict ok0Bn2yy5rxhsG32zSWRLiErd798DsaZS9A99P55ovDQooft7mMvvw74cP9jnaJ

-- Dumped from database version 15.15 (Debian 15.15-1.pgdg13+1)
-- Dumped by pg_dump version 15.15 (Debian 15.15-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: premium_butcher_user
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO premium_butcher_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: premium_butcher_user
--

CREATE TABLE public.addresses (
    address_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    customer_id uuid NOT NULL,
    address_type character varying(20) NOT NULL,
    street_address character varying(255) NOT NULL,
    address_line_2 character varying(255),
    city character varying(100) NOT NULL,
    state_province character varying(100),
    postal_code character varying(20) NOT NULL,
    country character varying(2) DEFAULT 'NL'::character varying NOT NULL,
    is_default boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT addresses_address_type_check CHECK (((address_type)::text = ANY ((ARRAY['billing'::character varying, 'delivery'::character varying, 'both'::character varying])::text[])))
);


ALTER TABLE public.addresses OWNER TO premium_butcher_user;

--
-- Name: TABLE addresses; Type: COMMENT; Schema: public; Owner: premium_butcher_user
--

COMMENT ON TABLE public.addresses IS 'Customer addresses for billing and delivery';


--
-- Name: brands; Type: TABLE; Schema: public; Owner: premium_butcher_user
--

CREATE TABLE public.brands (
    brand_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    brand_name character varying(200) NOT NULL,
    legal_name character varying(200),
    domain character varying(100),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_active boolean DEFAULT true
);


ALTER TABLE public.brands OWNER TO premium_butcher_user;

--
-- Name: TABLE brands; Type: COMMENT; Schema: public; Owner: premium_butcher_user
--

COMMENT ON TABLE public.brands IS 'Top-level organizational entity for multi-brand support';


--
-- Name: COLUMN brands.brand_id; Type: COMMENT; Schema: public; Owner: premium_butcher_user
--

COMMENT ON COLUMN public.brands.brand_id IS 'Unique identifier for the brand';


--
-- Name: COLUMN brands.brand_name; Type: COMMENT; Schema: public; Owner: premium_butcher_user
--

COMMENT ON COLUMN public.brands.brand_name IS 'Display name of the brand';


--
-- Name: customers; Type: TABLE; Schema: public; Owner: premium_butcher_user
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    shopify_customer_id character varying(255),
    email character varying(255) NOT NULL,
    name character varying(255),
    phone character varying(50),
    date_of_birth date,
    gender character varying(50),
    address text,
    city character varying(100),
    postal_code character varying(20),
    country character varying(100) DEFAULT 'Netherlands'::character varying,
    dietary_requirements text[],
    preferred_cuts text[],
    preferred_meat_types text[],
    meat_quality_preference character varying(100),
    cooking_methods text[],
    spice_level character varying(50),
    meat_temperature_preference character varying(50),
    bbq_available boolean DEFAULT false,
    bbq_type character varying(100),
    bbq_frequency character varying(50),
    favorite_dishes text[],
    cuisine_preferences text[],
    delivery_instructions text,
    preferred_delivery_day character varying(50),
    preferred_delivery_time character varying(50),
    delivery_frequency character varying(50),
    local_sourcing_percentage integer DEFAULT 85,
    co2_saved_kg numeric(10,2) DEFAULT 0,
    partner_farms_count integer DEFAULT 0,
    sustainability_score integer DEFAULT 0,
    loyalty_points integer DEFAULT 0,
    loyalty_tier character varying(50) DEFAULT 'Bronze'::character varying,
    total_orders integer DEFAULT 0,
    total_spent numeric(10,2) DEFAULT 0,
    member_since date DEFAULT CURRENT_DATE,
    available_rewards text[],
    redeemed_rewards text[],
    newsletter_subscribed boolean DEFAULT true,
    sms_notifications boolean DEFAULT false,
    email_notifications boolean DEFAULT true,
    marketing_consent boolean DEFAULT false,
    order_updates boolean DEFAULT true,
    promotional_offers boolean DEFAULT true,
    recipe_suggestions boolean DEFAULT true,
    seasonal_specials boolean DEFAULT true,
    language_preference character varying(10) DEFAULT 'nl'::character varying,
    currency_preference character varying(10) DEFAULT 'EUR'::character varying,
    profile_visibility character varying(50) DEFAULT 'private'::character varying,
    data_sharing_consent boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_login timestamp without time zone,
    account_status character varying(50) DEFAULT 'active'::character varying,
    internal_notes text,
    firebase_uid character varying(255),
    favorite_meat_types text[] DEFAULT '{}'::text[],
    cooking_preference character varying(50) DEFAULT 'medium-rare'::character varying,
    household_size integer DEFAULT 2,
    organic_only boolean DEFAULT false,
    grass_fed_preference boolean DEFAULT false,
    local_sourcing_priority boolean DEFAULT false,
    cooking_skill_level character varying(50) DEFAULT 'intermediate'::character varying,
    weekly_meat_consumption character varying(50) DEFAULT '2-3 times'::character varying,
    favorite_cuisines text[] DEFAULT '{}'::text[],
    cooking_equipment text[] DEFAULT '{}'::text[],
    marketing_communications boolean DEFAULT true,
    marketing_personalization boolean DEFAULT true,
    secondary_email character varying(255),
    primary_email_for_communication character varying(50) DEFAULT 'primary'::character varying,
    favorite_meat_other character varying(255),
    preferred_cut_other character varying(255),
    cooking_minutes_weekdays integer DEFAULT 30,
    cooking_minutes_weekend integer DEFAULT 60,
    cooking_minutes_festive integer DEFAULT 120,
    has_bbq boolean DEFAULT false,
    bbq_skill_level character varying(50),
    consumes_non_biological boolean DEFAULT false,
    nationality character varying(100) DEFAULT ''::character varying,
    ethnicity character varying(100) DEFAULT ''::character varying,
    languages jsonb DEFAULT '[]'::jsonb,
    CONSTRAINT customers_primary_email_for_communication_check CHECK (((primary_email_for_communication)::text = ANY ((ARRAY['primary'::character varying, 'secondary'::character varying])::text[])))
);


ALTER TABLE public.customers OWNER TO premium_butcher_user;

--
-- Name: TABLE customers; Type: COMMENT; Schema: public; Owner: premium_butcher_user
--

COMMENT ON TABLE public.customers IS 'Main customer profile table with all preferences and settings';


--
-- Name: COLUMN customers.bbq_available; Type: COMMENT; Schema: public; Owner: premium_butcher_user
--

COMMENT ON COLUMN public.customers.bbq_available IS 'Whether customer has BBQ equipment available';


--
-- Name: COLUMN customers.bbq_type; Type: COMMENT; Schema: public; Owner: premium_butcher_user
--

COMMENT ON COLUMN public.customers.bbq_type IS 'Type of BBQ equipment: Gas, Charcoal, Pellet, Electric, Kamado, Smoker';


--
-- Name: COLUMN customers.sustainability_score; Type: COMMENT; Schema: public; Owner: premium_butcher_user
--

COMMENT ON COLUMN public.customers.sustainability_score IS 'Sustainability score from 0-100 based on purchasing habits';


--
-- Name: COLUMN customers.loyalty_tier; Type: COMMENT; Schema: public; Owner: premium_butcher_user
--

COMMENT ON COLUMN public.customers.loyalty_tier IS 'Customer loyalty level: Bronze, Silver, Gold, Platinum';


--
-- Name: COLUMN customers.firebase_uid; Type: COMMENT; Schema: public; Owner: premium_butcher_user
--

COMMENT ON COLUMN public.customers.firebase_uid IS 'Firebase Authentication UID';


--
-- Name: COLUMN customers.secondary_email; Type: COMMENT; Schema: public; Owner: premium_butcher_user
--

COMMENT ON COLUMN public.customers.secondary_email IS 'Secondary email address for the customer';


--
-- Name: COLUMN customers.primary_email_for_communication; Type: COMMENT; Schema: public; Owner: premium_butcher_user
--

COMMENT ON COLUMN public.customers.primary_email_for_communication IS 'Which email to use for communications: primary or secondary';


--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: premium_butcher_user
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customers_id_seq OWNER TO premium_butcher_user;

--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: premium_butcher_user
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: premium_butcher_user
--

CREATE TABLE public.events (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    event_date date NOT NULL,
    event_type character varying(50) NOT NULL,
    icon character varying(50),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.events OWNER TO premium_butcher_user;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: premium_butcher_user
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.events_id_seq OWNER TO premium_butcher_user;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: premium_butcher_user
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: family_members; Type: TABLE; Schema: public; Owner: premium_butcher_user
--

CREATE TABLE public.family_members (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    name character varying(255) NOT NULL,
    gender character varying(50),
    age integer,
    date_of_birth date,
    relationship character varying(100),
    dietary_requirements text[],
    allergies text[],
    favorite_dishes text[],
    dislikes text[],
    special_dietary_needs text,
    portion_size character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.family_members OWNER TO premium_butcher_user;

--
-- Name: TABLE family_members; Type: COMMENT; Schema: public; Owner: premium_butcher_user
--

COMMENT ON TABLE public.family_members IS 'Family members linked to customer accounts for household preferences';


--
-- Name: family_members_id_seq; Type: SEQUENCE; Schema: public; Owner: premium_butcher_user
--

CREATE SEQUENCE public.family_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.family_members_id_seq OWNER TO premium_butcher_user;

--
-- Name: family_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: premium_butcher_user
--

ALTER SEQUENCE public.family_members_id_seq OWNED BY public.family_members.id;


--
-- Name: loyalty_rewards; Type: TABLE; Schema: public; Owner: premium_butcher_user
--

CREATE TABLE public.loyalty_rewards (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    points_required integer NOT NULL,
    icon character varying(50),
    is_available boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.loyalty_rewards OWNER TO premium_butcher_user;

--
-- Name: loyalty_rewards_id_seq; Type: SEQUENCE; Schema: public; Owner: premium_butcher_user
--

CREATE SEQUENCE public.loyalty_rewards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.loyalty_rewards_id_seq OWNER TO premium_butcher_user;

--
-- Name: loyalty_rewards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: premium_butcher_user
--

ALTER SEQUENCE public.loyalty_rewards_id_seq OWNED BY public.loyalty_rewards.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: premium_butcher_user
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    shopify_order_id character varying(255),
    order_number character varying(100) NOT NULL,
    order_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    subtotal numeric(10,2),
    tax numeric(10,2),
    shipping_cost numeric(10,2),
    discount numeric(10,2) DEFAULT 0,
    total_amount numeric(10,2) NOT NULL,
    items jsonb NOT NULL,
    delivery_date date,
    delivery_time_slot character varying(50),
    delivery_address text,
    delivery_instructions text,
    tracking_number character varying(255),
    payment_method character varying(50),
    payment_status character varying(50) DEFAULT 'pending'::character varying,
    points_earned integer DEFAULT 0,
    points_used integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    customer_notes text,
    internal_notes text
);


ALTER TABLE public.orders OWNER TO premium_butcher_user;

--
-- Name: TABLE orders; Type: COMMENT; Schema: public; Owner: premium_butcher_user
--

COMMENT ON TABLE public.orders IS 'Customer order history with detailed items and delivery information';


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: premium_butcher_user
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO premium_butcher_user;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: premium_butcher_user
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: recommended_orders; Type: TABLE; Schema: public; Owner: premium_butcher_user
--

CREATE TABLE public.recommended_orders (
    id integer NOT NULL,
    customer_id integer,
    product_name character varying(255) NOT NULL,
    product_sku character varying(100),
    quantity integer DEFAULT 1,
    price numeric(10,2),
    image_url text,
    is_recommended boolean DEFAULT false,
    recommendation_reason text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.recommended_orders OWNER TO premium_butcher_user;

--
-- Name: recommended_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: premium_butcher_user
--

CREATE SEQUENCE public.recommended_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recommended_orders_id_seq OWNER TO premium_butcher_user;

--
-- Name: recommended_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: premium_butcher_user
--

ALTER SEQUENCE public.recommended_orders_id_seq OWNED BY public.recommended_orders.id;


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: premium_butcher_user
--

CREATE TABLE public.subscriptions (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    subscription_name character varying(255) NOT NULL,
    subscription_type character varying(100),
    status character varying(50) DEFAULT 'active'::character varying,
    frequency character varying(50) NOT NULL,
    delivery_day character varying(50),
    items jsonb NOT NULL,
    price_per_delivery numeric(10,2) NOT NULL,
    discount_percentage numeric(5,2) DEFAULT 0,
    start_date date NOT NULL,
    next_delivery_date date,
    end_date date,
    paused_until date,
    delivery_address text,
    delivery_instructions text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cancelled_at timestamp without time zone,
    cancellation_reason text
);


ALTER TABLE public.subscriptions OWNER TO premium_butcher_user;

--
-- Name: TABLE subscriptions; Type: COMMENT; Schema: public; Owner: premium_butcher_user
--

COMMENT ON TABLE public.subscriptions IS 'Recurring subscription orders with frequency and contents';


--
-- Name: subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: premium_butcher_user
--

CREATE SEQUENCE public.subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.subscriptions_id_seq OWNER TO premium_butcher_user;

--
-- Name: subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: premium_butcher_user
--

ALTER SEQUENCE public.subscriptions_id_seq OWNED BY public.subscriptions.id;


--
-- Name: sustainability_impact; Type: TABLE; Schema: public; Owner: premium_butcher_user
--

CREATE TABLE public.sustainability_impact (
    id integer NOT NULL,
    customer_id integer,
    co2_saved_kg numeric(10,2) DEFAULT 0,
    local_sourcing_percentage integer DEFAULT 0,
    partner_farms_count integer DEFAULT 0,
    sustainability_score integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.sustainability_impact OWNER TO premium_butcher_user;

--
-- Name: sustainability_impact_id_seq; Type: SEQUENCE; Schema: public; Owner: premium_butcher_user
--

CREATE SEQUENCE public.sustainability_impact_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sustainability_impact_id_seq OWNER TO premium_butcher_user;

--
-- Name: sustainability_impact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: premium_butcher_user
--

ALTER SEQUENCE public.sustainability_impact_id_seq OWNED BY public.sustainability_impact.id;


--
-- Name: tips; Type: TABLE; Schema: public; Owner: premium_butcher_user
--

CREATE TABLE public.tips (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    tip_type character varying(50) NOT NULL,
    icon character varying(50),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    product_link character varying(500)
);


ALTER TABLE public.tips OWNER TO premium_butcher_user;

--
-- Name: tips_id_seq; Type: SEQUENCE; Schema: public; Owner: premium_butcher_user
--

CREATE SEQUENCE public.tips_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tips_id_seq OWNER TO premium_butcher_user;

--
-- Name: tips_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: premium_butcher_user
--

ALTER SEQUENCE public.tips_id_seq OWNED BY public.tips.id;


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: family_members id; Type: DEFAULT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.family_members ALTER COLUMN id SET DEFAULT nextval('public.family_members_id_seq'::regclass);


--
-- Name: loyalty_rewards id; Type: DEFAULT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.loyalty_rewards ALTER COLUMN id SET DEFAULT nextval('public.loyalty_rewards_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: recommended_orders id; Type: DEFAULT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.recommended_orders ALTER COLUMN id SET DEFAULT nextval('public.recommended_orders_id_seq'::regclass);


--
-- Name: subscriptions id; Type: DEFAULT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.subscriptions ALTER COLUMN id SET DEFAULT nextval('public.subscriptions_id_seq'::regclass);


--
-- Name: sustainability_impact id; Type: DEFAULT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.sustainability_impact ALTER COLUMN id SET DEFAULT nextval('public.sustainability_impact_id_seq'::regclass);


--
-- Name: tips id; Type: DEFAULT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.tips ALTER COLUMN id SET DEFAULT nextval('public.tips_id_seq'::regclass);


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (address_id);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (brand_id);


--
-- Name: customers customers_email_key; Type: CONSTRAINT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_email_key UNIQUE (email);


--
-- Name: customers customers_firebase_uid_key; Type: CONSTRAINT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_firebase_uid_key UNIQUE (firebase_uid);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: customers customers_shopify_customer_id_key; Type: CONSTRAINT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_shopify_customer_id_key UNIQUE (shopify_customer_id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: family_members family_members_pkey; Type: CONSTRAINT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.family_members
    ADD CONSTRAINT family_members_pkey PRIMARY KEY (id);


--
-- Name: loyalty_rewards loyalty_rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.loyalty_rewards
    ADD CONSTRAINT loyalty_rewards_pkey PRIMARY KEY (id);


--
-- Name: orders orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_number_key UNIQUE (order_number);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: orders orders_shopify_order_id_key; Type: CONSTRAINT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_shopify_order_id_key UNIQUE (shopify_order_id);


--
-- Name: recommended_orders recommended_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.recommended_orders
    ADD CONSTRAINT recommended_orders_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: sustainability_impact sustainability_impact_customer_id_key; Type: CONSTRAINT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.sustainability_impact
    ADD CONSTRAINT sustainability_impact_customer_id_key UNIQUE (customer_id);


--
-- Name: sustainability_impact sustainability_impact_pkey; Type: CONSTRAINT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.sustainability_impact
    ADD CONSTRAINT sustainability_impact_pkey PRIMARY KEY (id);


--
-- Name: tips tips_pkey; Type: CONSTRAINT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.tips
    ADD CONSTRAINT tips_pkey PRIMARY KEY (id);


--
-- Name: idx_addresses_customer; Type: INDEX; Schema: public; Owner: premium_butcher_user
--

CREATE INDEX idx_addresses_customer ON public.addresses USING btree (customer_id);


--
-- Name: idx_addresses_type; Type: INDEX; Schema: public; Owner: premium_butcher_user
--

CREATE INDEX idx_addresses_type ON public.addresses USING btree (address_type);


--
-- Name: idx_customers_account_status; Type: INDEX; Schema: public; Owner: premium_butcher_user
--

CREATE INDEX idx_customers_account_status ON public.customers USING btree (account_status);


--
-- Name: idx_customers_bbq_frequency; Type: INDEX; Schema: public; Owner: premium_butcher_user
--

CREATE INDEX idx_customers_bbq_frequency ON public.customers USING btree (bbq_frequency);


--
-- Name: idx_customers_consumes_non_biological; Type: INDEX; Schema: public; Owner: premium_butcher_user
--

CREATE INDEX idx_customers_consumes_non_biological ON public.customers USING btree (consumes_non_biological);


--
-- Name: idx_customers_email; Type: INDEX; Schema: public; Owner: premium_butcher_user
--

CREATE INDEX idx_customers_email ON public.customers USING btree (email);


--
-- Name: idx_customers_ethnicity; Type: INDEX; Schema: public; Owner: premium_butcher_user
--

CREATE INDEX idx_customers_ethnicity ON public.customers USING btree (ethnicity);


--
-- Name: idx_customers_firebase_uid; Type: INDEX; Schema: public; Owner: premium_butcher_user
--

CREATE INDEX idx_customers_firebase_uid ON public.customers USING btree (firebase_uid);


--
-- Name: idx_customers_has_bbq; Type: INDEX; Schema: public; Owner: premium_butcher_user
--

CREATE INDEX idx_customers_has_bbq ON public.customers USING btree (has_bbq);


--
-- Name: idx_customers_loyalty_tier; Type: INDEX; Schema: public; Owner: premium_butcher_user
--

CREATE INDEX idx_customers_loyalty_tier ON public.customers USING btree (loyalty_tier);


--
-- Name: idx_customers_nationality; Type: INDEX; Schema: public; Owner: premium_butcher_user
--

CREATE INDEX idx_customers_nationality ON public.customers USING btree (nationality);


--
-- Name: idx_customers_shopify_id; Type: INDEX; Schema: public; Owner: premium_butcher_user
--

CREATE INDEX idx_customers_shopify_id ON public.customers USING btree (shopify_customer_id);


--
-- Name: idx_family_members_customer_id; Type: INDEX; Schema: public; Owner: premium_butcher_user
--

CREATE INDEX idx_family_members_customer_id ON public.family_members USING btree (customer_id);


--
-- Name: idx_orders_customer_id; Type: INDEX; Schema: public; Owner: premium_butcher_user
--

CREATE INDEX idx_orders_customer_id ON public.orders USING btree (customer_id);


--
-- Name: idx_orders_order_date; Type: INDEX; Schema: public; Owner: premium_butcher_user
--

CREATE INDEX idx_orders_order_date ON public.orders USING btree (order_date DESC);


--
-- Name: idx_orders_order_number; Type: INDEX; Schema: public; Owner: premium_butcher_user
--

CREATE INDEX idx_orders_order_number ON public.orders USING btree (order_number);


--
-- Name: idx_orders_shopify_id; Type: INDEX; Schema: public; Owner: premium_butcher_user
--

CREATE INDEX idx_orders_shopify_id ON public.orders USING btree (shopify_order_id);


--
-- Name: idx_orders_status; Type: INDEX; Schema: public; Owner: premium_butcher_user
--

CREATE INDEX idx_orders_status ON public.orders USING btree (status);


--
-- Name: idx_recommended_orders_customer; Type: INDEX; Schema: public; Owner: premium_butcher_user
--

CREATE INDEX idx_recommended_orders_customer ON public.recommended_orders USING btree (customer_id);


--
-- Name: idx_subscriptions_customer_id; Type: INDEX; Schema: public; Owner: premium_butcher_user
--

CREATE INDEX idx_subscriptions_customer_id ON public.subscriptions USING btree (customer_id);


--
-- Name: idx_subscriptions_next_delivery; Type: INDEX; Schema: public; Owner: premium_butcher_user
--

CREATE INDEX idx_subscriptions_next_delivery ON public.subscriptions USING btree (next_delivery_date);


--
-- Name: idx_subscriptions_status; Type: INDEX; Schema: public; Owner: premium_butcher_user
--

CREATE INDEX idx_subscriptions_status ON public.subscriptions USING btree (status);


--
-- Name: customers update_customers_updated_at; Type: TRIGGER; Schema: public; Owner: premium_butcher_user
--

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: family_members update_family_members_updated_at; Type: TRIGGER; Schema: public; Owner: premium_butcher_user
--

CREATE TRIGGER update_family_members_updated_at BEFORE UPDATE ON public.family_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: orders update_orders_updated_at; Type: TRIGGER; Schema: public; Owner: premium_butcher_user
--

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: subscriptions update_subscriptions_updated_at; Type: TRIGGER; Schema: public; Owner: premium_butcher_user
--

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: family_members family_members_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.family_members
    ADD CONSTRAINT family_members_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: recommended_orders recommended_orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.recommended_orders
    ADD CONSTRAINT recommended_orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: subscriptions subscriptions_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: sustainability_impact sustainability_impact_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: premium_butcher_user
--

ALTER TABLE ONLY public.sustainability_impact
    ADD CONSTRAINT sustainability_impact_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict ok0Bn2yy5rxhsG32zSWRLiErd798DsaZS9A99P55ovDQooft7mMvvw74cP9jnaJ

