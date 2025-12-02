// backend/server.js
// Express.js backend with Firebase authentication

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  })
});

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'premium_butcher',
  user: process.env.DB_USER || 'butcher_user',
  password: process.env.DB_PASSWORD,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    console.log(`✅ Database connected at: ${new Date().toISOString()}`);
    release();
  }
});

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Attach user info to request
    req.user = {
      firebaseUid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// ============================================
// PUBLIC ENDPOINTS (No auth required)
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: pool.totalCount > 0 ? 'connected' : 'disconnected',
    firebase: 'initialized'
  });
});

// ============================================
// PROTECTED ENDPOINTS (Auth required)
// ============================================

// Get current user's profile
app.get('/api/profile', authenticateUser, async (req, res) => {
  try {
    // First, try to find by firebase_uid
    let result = await pool.query(
      'SELECT * FROM customers WHERE firebase_uid = $1',
      [req.user.firebaseUid]
    );

    if (result.rows.length === 0) {
      // No profile with this firebase_uid, check if email exists
      const emailCheck = await pool.query(
        'SELECT * FROM customers WHERE email = $1',
        [req.user.email]
      );

      if (emailCheck.rows.length > 0) {
        // Profile exists with this email but different firebase_uid
        // Update the firebase_uid to link this auth method
        result = await pool.query(
          'UPDATE customers SET firebase_uid = $1 WHERE email = $2 RETURNING *',
          [req.user.firebaseUid, req.user.email]
        );
        return res.json(result.rows[0]);
      }

      // No profile exists at all - create new one
      const newProfile = await pool.query(
        `INSERT INTO customers (firebase_uid, email, name, member_since)
         VALUES ($1, $2, $3, NOW())
         RETURNING *`,
        [req.user.firebaseUid, req.user.email, req.user.name]
      );
      return res.json(newProfile.rows[0]);
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update current user's profile
app.put('/api/profile', authenticateUser, async (req, res) => {
  try {
    const updates = req.body;
    
    // Remove fields that shouldn't be updated
    delete updates.id;
    delete updates.firebase_uid;
    delete updates.member_since;
    delete updates.created_at;
    delete updates.updated_at;
    
    // Build dynamic UPDATE query
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    values.push(req.user.firebaseUid);
    
    const query = `
      UPDATE customers 
      SET ${setClause}, updated_at = NOW()
      WHERE firebase_uid = $${values.length}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get current user's family members
app.get('/api/profile/family', authenticateUser, async (req, res) => {
  try {
    // First get customer ID from firebase_uid
    const customerResult = await pool.query(
      'SELECT id FROM customers WHERE firebase_uid = $1',
      [req.user.firebaseUid]
    );
    
    if (customerResult.rows.length === 0) {
      return res.json([]);
    }
    
    const customerId = customerResult.rows[0].id;
    
    const result = await pool.query(
      'SELECT * FROM family_members WHERE customer_id = $1 ORDER BY id',
      [customerId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching family members:', error);
    res.status(500).json({ error: 'Failed to fetch family members' });
  }
});

// Add family member
app.post('/api/profile/family', authenticateUser, async (req, res) => {
  try {
    const { name, relationship, age, dietary_requirements } = req.body;
    
    // Get customer ID
    const customerResult = await pool.query(
      'SELECT id FROM customers WHERE firebase_uid = $1',
      [req.user.firebaseUid]
    );
    
    if (customerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Customer profile not found' });
    }
    
    const customerId = customerResult.rows[0].id;
    
    const result = await pool.query(
      `INSERT INTO family_members (customer_id, name, relationship, age, dietary_requirements)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [customerId, name, relationship, age, dietary_requirements]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding family member:', error);
    res.status(500).json({ error: 'Failed to add family member' });
  }
});

// Update family member
app.put('/api/profile/family/:memberId', authenticateUser, async (req, res) => {
  try {
    const { memberId } = req.params;
    const updates = req.body;
    
    // Verify this family member belongs to the authenticated user
    const verifyResult = await pool.query(
      `SELECT fm.* FROM family_members fm
       JOIN customers c ON fm.customer_id = c.id
       WHERE fm.id = $1 AND c.firebase_uid = $2`,
      [memberId, req.user.firebaseUid]
    );
    
    if (verifyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Family member not found' });
    }
    
    // Build UPDATE query
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    values.push(memberId);
    
    const query = `
      UPDATE family_members 
      SET ${setClause}
      WHERE id = $${values.length}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating family member:', error);
    res.status(500).json({ error: 'Failed to update family member' });
  }
});

// Delete family member
app.delete('/api/profile/family/:memberId', authenticateUser, async (req, res) => {
  try {
    const { memberId } = req.params;
    
    // Verify and delete
    const result = await pool.query(
      `DELETE FROM family_members fm
       USING customers c
       WHERE fm.customer_id = c.id 
       AND fm.id = $1 
       AND c.firebase_uid = $2
       RETURNING fm.*`,
      [memberId, req.user.firebaseUid]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Family member not found' });
    }
    
    res.json({ message: 'Family member deleted', member: result.rows[0] });
  } catch (error) {
    console.error('Error deleting family member:', error);
    res.status(500).json({ error: 'Failed to delete family member' });
  }
});

// Get current user's orders
app.get('/api/profile/orders', authenticateUser, async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    
    // Get customer ID
    const customerResult = await pool.query(
      'SELECT id FROM customers WHERE firebase_uid = $1',
      [req.user.firebaseUid]
    );
    
    if (customerResult.rows.length === 0) {
      return res.json([]);
    }
    
    const customerId = customerResult.rows[0].id;
    
    const result = await pool.query(
      `SELECT * FROM orders 
       WHERE customer_id = $1 
       ORDER BY order_date DESC 
       LIMIT $2 OFFSET $3`,
      [customerId, limit, offset]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get current user's subscriptions
app.get('/api/profile/subscriptions', authenticateUser, async (req, res) => {
  try {
    // Get customer ID
    const customerResult = await pool.query(
      'SELECT id FROM customers WHERE firebase_uid = $1',
      [req.user.firebaseUid]
    );
    
    if (customerResult.rows.length === 0) {
      return res.json([]);
    }
    
    const customerId = customerResult.rows[0].id;
    
    const result = await pool.query(
      'SELECT * FROM subscriptions WHERE customer_id = $1 ORDER BY id',
      [customerId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// Update subscription
app.put('/api/profile/subscriptions/:subscriptionId', authenticateUser, async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const updates = req.body;
    
    // Verify subscription belongs to user
    const verifyResult = await pool.query(
      `SELECT s.* FROM subscriptions s
       JOIN customers c ON s.customer_id = c.id
       WHERE s.id = $1 AND c.firebase_uid = $2`,
      [subscriptionId, req.user.firebaseUid]
    );
    
    if (verifyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    // Build UPDATE query
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    values.push(subscriptionId);
    
    const query = `
      UPDATE subscriptions 
      SET ${setClause}
      WHERE id = $${values.length}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

// ============================================

// ============================================
// HEADER BLOCKS ENDPOINTS (Auth required)
// ============================================

// Get customer loyalty points for header
app.get('/api/header/loyalty-points', authenticateUser, async (req, res) => {
  try {
    const customerResult = await pool.query(
      'SELECT loyalty_points FROM customers WHERE firebase_uid = $1',
      [req.user.firebaseUid]
    );
    
    if (customerResult.rows.length === 0) {
      return res.json({ points: 0 });
    }
    
    res.json({ points: customerResult.rows[0].loyalty_points || 0 });
  } catch (error) {
    console.error('Error fetching loyalty points:', error);
    res.status(500).json({ error: 'Failed to fetch loyalty points' });
  }
});

// Get available loyalty rewards for header
app.get('/api/header/rewards', authenticateUser, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, description, points_required, icon 
       FROM loyalty_rewards 
       WHERE is_available = true 
       ORDER BY points_required ASC 
       LIMIT 5`
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({ error: 'Failed to fetch rewards' });
  }
});

// Get random tip of the day for header
app.get('/api/header/tip-of-the-day', authenticateUser, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, content, tip_type, icon 
       FROM tips 
       WHERE is_active = true 
       ORDER BY RANDOM() 
       LIMIT 1`
    );
    
    if (result.rows.length === 0) {
      return res.json({
        title: 'Welcome!',
        content: 'Check back soon for tips and recommendations',
        tip_type: 'general',
        icon: 'info'
      });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching tip:', error);
    res.status(500).json({ error: 'Failed to fetch tip' });
  }
});

// Get next upcoming event for header
app.get('/api/header/next-event', authenticateUser, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, description, event_date, event_type, icon 
       FROM events 
       WHERE is_active = true AND event_date >= CURRENT_DATE 
       ORDER BY event_date ASC 
       LIMIT 1`
    );
    
    if (result.rows.length === 0) {
      return res.json({
        title: 'No upcoming events',
        description: 'Stay tuned for future events',
        event_date: null,
        event_type: 'general',
        icon: 'calendar'
      });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Get sustainability impact
app.get('/api/sustainability', authenticateUser, async (req, res) => {
  try {
    // Get customer ID
    const customerResult = await pool.query(
      'SELECT id FROM customers WHERE firebase_uid = $1',
      [req.user.firebaseUid]
    );

    if (customerResult.rows.length === 0) {
      return res.json({
        co2_saved_kg: 0,
        local_sourcing_percentage: 0,
        partner_farms_count: 0,
        sustainability_score: 0
      });
    }

    const customerId = customerResult.rows[0].id;

    const result = await pool.query(
      'SELECT co2_saved_kg, local_sourcing_percentage, partner_farms_count, sustainability_score FROM sustainability_impact WHERE customer_id = $1',
      [customerId]
    );

    if (result.rows.length === 0) {
      return res.json({
        co2_saved_kg: 0,
        local_sourcing_percentage: 0,
        partner_farms_count: 0,
        sustainability_score: 0
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching sustainability:', error);
    res.status(500).json({ error: 'Failed to fetch sustainability data' });
  }
});


// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
🚀 Premium Butcher Backend API (with Firebase Auth)
================================
📡 Server running on port ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🗄️  Database: ${process.env.DB_NAME}
🔐 Firebase Auth: Enabled

Protected endpoints (require Authorization header):
  GET  /api/profile
  PUT  /api/profile
  GET  /api/profile/family
  POST /api/profile/family
  PUT  /api/profile/family/:memberId
  DEL  /api/profile/family/:memberId
  GET  /api/profile/orders
  GET  /api/profile/subscriptions
  PUT  /api/profile/subscriptions/:subscriptionId

Public endpoints:
  GET  /health
`);
});

