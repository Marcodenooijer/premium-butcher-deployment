/**
 * Loyalty Redemption Store — Frontend API Service
 *
 * Calls your Express backend proxy at /api/loyalty-store/*
 * which forwards requests to the Manus-hosted Loyalty Points API.
 * The API key is kept server-side — never exposed to the browser.
 *
 * Uses the same auth pattern as your existing api.js (Firebase getUserTokenNew).
 */

import {getUserTokenNew as getUserToken} from '../firebase';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const LOYALTY_BASE = `${API_BASE}/loyalty-programs`;

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

export async function getEnrollments() {
  return await loyaltyFetch('/enrollments');
}

// ─── Products ───────────────────────────────────────────────────

export async function getProducts(loyaltyProgramId) {
  const params = new URLSearchParams()
  params.set('match_configured_channels', 'true')
  params.set('include_redemption_channels', 'true')

  const data = await loyaltyFetch(`/${loyaltyProgramId}/product-variants?${params}`);
  return data.results;
}

export async function getAffordableProducts() {
  return loyaltyFetch('/products/affordable');
}

export async function getProduct(productId) {
  const data = await loyaltyFetch(`/products/${productId}`);
  return data.product;
}

// ─── Redemptions ────────────────────────────────────────────────

export async function redeemProduct(enrollmentId, productId, channel_id) {
  return loyaltyFetch(`/enrollments/${enrollmentId}/redemptions`, {
    method: 'POST',
    body: { loyalty_product_id: productId, redemption_channel_id: channel_id },
  });
}

export async function cancelRedemption(redemptionId) {
  return loyaltyFetch(`/redemptions/${redemptionId}/cancel`, {
    method: 'POST'
  });
}

export async function getRedemptionChannels(enrollmentId) {
  return await loyaltyFetch(`/enrollments/${enrollmentId}/redemption-channels`);
}

export async function getRedemptions(enrollmentId) {
  return await loyaltyFetch(`/enrollments/${enrollmentId}/redemptions`);
}

// ─── Transactions ───────────────────────────────────────────────

export async function getTransactions(enrollmentId) {
  const data = await loyaltyFetch(`/enrollments/${enrollmentId}/transactions`)
  return data.results
}

// ─── Health Check ───────────────────────────────────────────────

export async function healthCheck() {
  return loyaltyFetch('/health');
}

export default {
  getEnrollments,
  getRedemptionChannels,
  getProducts,
  getAffordableProducts,
  getProduct,
  redeemProduct,
  cancelRedemption,
  getRedemptions,
  getTransactions,
  healthCheck,
};
