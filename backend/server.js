import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import pg from 'pg';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection pool
const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'premium_butcher',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected successfully at', res.rows[0].now);
  }
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Stricter rate limit for authentication
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later.'
});

// ============================================================================
// API ROUTES
// ============================================================================

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: pool.totalCount > 0 ? 'connected' : 'disconnected'
  });
});

// Get customer profile
app.get('/api/customers/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM customer_summary WHERE customer_id = $1',
      [customerId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get customer addresses
app.get('/api/customers/:customerId/addresses', async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM addresses WHERE customer_id = $1 AND is_active = true ORDER BY is_default DESC',
      [customerId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get customer preferences
app.get('/api/customers/:customerId/preferences', async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM preferences WHERE customer_id = $1',
      [customerId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Preferences not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get customer orders
app.get('/api/customers/:customerId/orders', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    const result = await pool.query(
      `SELECT o.*, 
        json_agg(
          json_build_object(
            'product_name', oi.product_name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'line_total', oi.line_total
          )
        ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.order_id = oi.order_id
       WHERE o.customer_id = $1
       GROUP BY o.order_id
       ORDER BY o.order_date DESC
       LIMIT $2 OFFSET $3`,
      [customerId, limit, offset]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get family members (B2C)
app.get('/api/customers/:customerId/family-members', async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM family_members WHERE customer_id = $1',
      [customerId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching family members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get departments (B2B)
app.get('/api/customers/:customerId/departments', async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM departments WHERE customer_id = $1 AND is_active = true ORDER BY location_name',
      [customerId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get contact persons (B2B)
app.get('/api/customers/:customerId/contacts', async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM contact_persons WHERE customer_id = $1 AND is_active = true ORDER BY full_name',
      [customerId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get invoices (B2B)
app.get('/api/customers/:customerId/invoices', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    const result = await pool.query(
      `SELECT * FROM invoices 
       WHERE customer_id = $1 
       ORDER BY invoice_date DESC 
       LIMIT $2 OFFSET $3`,
      [customerId, limit, offset]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get loyalty points (B2C)
app.get('/api/customers/:customerId/loyalty-points', async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const result = await pool.query(
      `SELECT * FROM loyalty_points 
       WHERE customer_id = $1 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [customerId]
    );
    
    // Calculate current balance
    const balance = result.rows.length > 0 ? result.rows[0].balance_after : 0;
    
    res.json({
      balance,
      transactions: result.rows
    });
  } catch (error) {
    console.error('Error fetching loyalty points:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get sustainability metrics
app.get('/api/customers/:customerId/sustainability', async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const result = await pool.query(
      `SELECT * FROM sustainability_metrics 
       WHERE customer_id = $1 
       ORDER BY metric_date DESC 
       LIMIT 1`,
      [customerId]
    );
    
    if (result.rows.length === 0) {
      return res.json({
        local_sourcing_percentage: 0,
        carbon_saved_kg: 0,
        partner_farms_count: 0,
        organic_percentage: 0
      });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching sustainability metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get B2B dashboard
app.get('/api/customers/:customerId/b2b-dashboard', async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM b2b_customer_dashboard WHERE customer_id = $1',
      [customerId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'B2B customer not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching B2B dashboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});
