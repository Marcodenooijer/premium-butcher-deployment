/**
 * Loyalty Points Redemption — Express Proxy Routes (Full Sync)
 * 
 * These routes proxy requests from your frontend to the Manus-hosted
 * Loyalty Points API. The LOYALTY_API_KEY stays server-side.
 * 
 * FULL SYNC MODE:
 *   - Hetzner customers.loyalty_points is the source of truth
 *   - On /balance: passes loyalty_points as X-Initial-Balance header to Manus
 *   - On /redeem: deducts points from Hetzner customers.loyalty_points
 *   - On /cancel: refunds points back to Hetzner customers.loyalty_points
 * 
 * USAGE: In your server.js, add these two lines:
 * 
 *   const loyaltyProxy = require('./loyaltyProxy');
 *   loyaltyProxy(app, authenticateUser, pool);
 * 
 * REQUIRED ENV VARS (add to Infisical):
 *   LOYALTY_API_URL  — e.g. "https://pointsstore-jbs6nxi9.manus.space"
 *   LOYALTY_API_KEY  — The API key matching the Manus app
 */

const axios = require('axios' );

module.exports = function registerLoyaltyProxy(app, authenticateUser, pool) {

  const LOYALTY_API_URL = process.env.LOYALTY_API_URL;
  const LOYALTY_API_KEY = process.env.LOYALTY_API_KEY;

  // ─── Helper: get customer DB id and loyalty_points from Firebase UID ────
  async function getCustomer(firebaseUid) {
    const result = await pool.query(
      'SELECT id, loyalty_points FROM customers WHERE firebase_uid = $1',
      [firebaseUid]
    );
    if (result.rows.length === 0) return null;
    return {
      id: result.rows[0].id,
      loyaltyPoints: result.rows[0].loyalty_points || 0,
    };
  }

  // ─── Helper: update loyalty_points in Hetzner customer table ────
  async function updateCustomerPoints(customerId, newBalance) {
    await pool.query(
      'UPDATE customers SET loyalty_points = $1 WHERE id = $2',
      [newBalance, customerId]
    );
  }

  // ─── Helper: forward request to Manus API ────────────────────
  async function proxyToManus(path, { method = 'GET', body, userId, initialBalance }) {
    if (!LOYALTY_API_URL || !LOYALTY_API_KEY) {
      throw new Error('LOYALTY_API_URL and LOYALTY_API_KEY must be set in environment');
    }

    const headers = {
      'X-API-Key': LOYALTY_API_KEY,
      'X-User-Id': String(userId),
      'Content-Type': 'application/json',
    };

    // Pass the Hetzner loyalty_points as initial balance for first-time sync
    if (initialBalance !== undefined && initialBalance !== null) {
      headers['X-Initial-Balance'] = String(initialBalance);
    }

    const config = {
      method,
      url: `${LOYALTY_API_URL}/api/v1/loyalty${path}`,
      headers,
      validateStatus: () => true,
    };

    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      config.data = body;
    }

    const response = await axios(config);
    return { status: response.status, data: response.data };
  }

  // ============================================================
  // LOYALTY REDEMPTION STORE ENDPOINTS (proxied to Manus)
  // All require Firebase auth
  // ============================================================

  // Health check (no auth needed)
  app.get('/api/loyalty-store/health', async (req, res) => {
    try {
      const result = await proxyToManus('/health', { method: 'GET', userId: 'system' });
      res.status(result.status).json(result.data);
    } catch (error) {
      console.error('Loyalty store health check failed:', error.message);
      res.status(503).json({ error: 'Loyalty store unavailable', details: error.message });
    }
  });

  // Get points balance — FULL SYNC: reads loyalty_points from Hetzner, passes to Manus
  app.get('/api/loyalty-store/balance', authenticateUser, async (req, res) => {
    try {
      const customer = await getCustomer(req.user.firebaseUid);
      if (!customer) return res.status(404).json({ error: 'Customer not found' });

      const result = await proxyToManus('/balance', {
        userId: customer.id,
        initialBalance: customer.loyaltyPoints,
      });

      // Override the balance response with the Hetzner source of truth
      if (result.status === 200 && result.data) {
        const reservedPoints = result.data.reservedPoints || 0;
        result.data.balance = customer.loyaltyPoints;
        result.data.availablePoints = customer.loyaltyPoints - reservedPoints;
        result.data.reservedPoints = reservedPoints;
      }

      res.status(result.status).json(result.data);
    } catch (error) {
      console.error('Error fetching loyalty store balance:', error.message);
      res.status(500).json({ error: 'Failed to fetch balance' });
    }
  });

  // Get all redeemable products
  app.get('/api/loyalty-store/products', authenticateUser, async (req, res) => {
    try {
      const customer = await getCustomer(req.user.firebaseUid);
      if (!customer) return res.status(404).json({ error: 'Customer not found' });

      const result = await proxyToManus('/products', {
        userId: customer.id,
        initialBalance: customer.loyaltyPoints,
      });
      res.status(result.status).json(result.data);
    } catch (error) {
      console.error('Error fetching loyalty store products:', error.message);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  // Get affordable products (within customer's available points)
  app.get('/api/loyalty-store/products/affordable', authenticateUser, async (req, res) => {
    try {
      const customer = await getCustomer(req.user.firebaseUid);
      if (!customer) return res.status(404).json({ error: 'Customer not found' });

      const result = await proxyToManus('/products/affordable', {
        userId: customer.id,
        initialBalance: customer.loyaltyPoints,
      });
      res.status(result.status).json(result.data);
    } catch (error) {
      console.error('Error fetching affordable products:', error.message);
      res.status(500).json({ error: 'Failed to fetch affordable products' });
    }
  });

  // Get single product details
  app.get('/api/loyalty-store/products/:productId', authenticateUser, async (req, res) => {
    try {
      const customer = await getCustomer(req.user.firebaseUid);
      if (!customer) return res.status(404).json({ error: 'Customer not found' });

      const result = await proxyToManus(`/products/${req.params.productId}`, {
        userId: customer.id,
        initialBalance: customer.loyaltyPoints,
      });
      res.status(result.status).json(result.data);
    } catch (error) {
      console.error('Error fetching product:', error.message);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  });

  // Redeem a product — FULL SYNC: deducts points from Hetzner after successful Manus redemption
  app.post('/api/loyalty-store/redeem', authenticateUser, async (req, res) => {
    try {
      const customer = await getCustomer(req.user.firebaseUid);
      if (!customer) return res.status(404).json({ error: 'Customer not found' });

      const { productId, redemptionType } = req.body;
      if (!productId) {
        return res.status(400).json({ error: 'productId is required' });
      }

      const result = await proxyToManus('/redeem', {
        method: 'POST',
        userId: customer.id,
        initialBalance: customer.loyaltyPoints,
        body: { productId, redemptionType: redemptionType || 'online' },
      });

      // If redemption succeeded, deduct points from Hetzner customer table
      if (result.status === 200 && result.data && result.data.redemption) {
        const pointsSpent = result.data.redemption.pointsSpent || 0;
        if (pointsSpent > 0) {
          const newBalance = Math.max(0, customer.loyaltyPoints - pointsSpent);
          await updateCustomerPoints(customer.id, newBalance);
          console.log(`[Loyalty Sync] Deducted ${pointsSpent} points from customer ${customer.id}. New Hetzner balance: ${newBalance}`);
        }
      }

      res.status(result.status).json(result.data);
    } catch (error) {
      console.error('Error redeeming product:', error.message);
      res.status(500).json({ error: 'Failed to redeem product' });
    }
  });

  // Cancel a redemption — FULL SYNC: refunds points back to Hetzner after successful cancellation
  app.post('/api/loyalty-store/cancel', authenticateUser, async (req, res) => {
    try {
      const customer = await getCustomer(req.user.firebaseUid);
      if (!customer) return res.status(404).json({ error: 'Customer not found' });

      const { redemptionId } = req.body;
      if (!redemptionId) {
        return res.status(400).json({ error: 'redemptionId is required' });
      }

      const result = await proxyToManus('/cancel', {
        method: 'POST',
        userId: customer.id,
        initialBalance: customer.loyaltyPoints,
        body: { redemptionId },
      });

      // If cancellation succeeded, refund points to Hetzner customer table
      if (result.status === 200 && result.data && result.data.pointsRefunded) {
        const pointsRefunded = result.data.pointsRefunded || 0;
        if (pointsRefunded > 0) {
          const newBalance = customer.loyaltyPoints + pointsRefunded;
          await updateCustomerPoints(customer.id, newBalance);
          console.log(`[Loyalty Sync] Refunded ${pointsRefunded} points to customer ${customer.id}. New Hetzner balance: ${newBalance}`);
        }
      }

      res.status(result.status).json(result.data);
    } catch (error) {
      console.error('Error cancelling redemption:', error.message);
      res.status(500).json({ error: 'Failed to cancel redemption' });
    }
  });

  // Get customer's redemptions list
  app.get('/api/loyalty-store/redemptions', authenticateUser, async (req, res) => {
    try {
      const customer = await getCustomer(req.user.firebaseUid);
      if (!customer) return res.status(404).json({ error: 'Customer not found' });

      const result = await proxyToManus('/redemptions', {
        userId: customer.id,
        initialBalance: customer.loyaltyPoints,
      });
      res.status(result.status).json(result.data);
    } catch (error) {
      console.error('Error fetching redemptions:', error.message);
      res.status(500).json({ error: 'Failed to fetch redemptions' });
    }
  });

  // Get customer's points transaction history
  app.get('/api/loyalty-store/transactions', authenticateUser, async (req, res) => {
    try {
      const customer = await getCustomer(req.user.firebaseUid);
      if (!customer) return res.status(404).json({ error: 'Customer not found' });

      const result = await proxyToManus('/transactions', {
        userId: customer.id,
        initialBalance: customer.loyaltyPoints,
      });
      res.status(result.status).json(result.data);
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  });

  console.log('Loyalty Redemption Store proxy routes registered (/api/loyalty-store/*) [Full Sync Mode]');
};
