/**
 * Loyalty Redemption Store — Frontend API Service
 *
 * Calls your Express backend proxy at /api/loyalty-store/*
 * which forwards requests to the Manus-hosted Loyalty Points API.
 * The API key is kept server-side — never exposed to the browser.
 *
 * Uses the same auth pattern as your existing api.js (Firebase getUserTokenNew).
 */

import { getUserTokenNew as getUserToken } from '../firebase';

const API_BASE = import.meta.env.VITE_API_URL || '';
const LOYALTY_BASE = `${API_BASE}/api/loyalty-store`;

async function loyaltyFetch(endpoint, options = {}) {
  const { method = 'GET', body } = options;

  // Get the Firebase auth token (same pattern as your existing api.js)
  const token = await getUserToken();

  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${LOYALTY_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || error.detail || `API error: ${response.status}`);
  }

  return response.json();
}

// ─── Points Balance ─────────────────────────────────────────────

export async function getBalance() {
  return loyaltyFetch('/balance');
}

// ─── Products ───────────────────────────────────────────────────

export async function getProducts() {
  const data = await loyaltyFetch('/products');
  return data.products;
}

export async function getAffordableProducts() {
  return loyaltyFetch('/products/affordable');
}

export async function getProduct(productId) {
  const data = await loyaltyFetch(`/products/${productId}`);
  return data.product;
}

// ─── Redemptions ────────────────────────────────────────────────

export async function redeemProduct(productId, redemptionType = 'online') {
  return loyaltyFetch('/redeem', {
    method: 'POST',
    body: { productId, redemptionType },
  });
}

export async function cancelRedemption(redemptionId) {
  return loyaltyFetch('/cancel', {
    method: 'POST',
    body: { redemptionId },
  });
}

export async function getRedemptions() {
  const data = await loyaltyFetch('/redemptions');
  return data.redemptions;
}

// ─── Transactions ───────────────────────────────────────────────

export async function getTransactions() {
  const data = await loyaltyFetch('/transactions');
  return data.transactions;
}

// ─── Health Check ───────────────────────────────────────────────

export async function healthCheck() {
  return loyaltyFetch('/health');
}

export default {
  getBalance,
  getProducts,
  getAffordableProducts,
  getProduct,
  redeemProduct,
  cancelRedemption,
  getRedemptions,
  getTransactions,
  healthCheck,
};
