// frontend/src/services/api.js
// Updated with NO CACHING - all requests are fresh from server
import { getUserTokenNew as getUserToken } from '../firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const getAuthHeaders = async () => {
  const token = await getUserToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
    // Force no-cache on all requests
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  };
};

const apiCall = async (endpoint, options = {}) => {
  const headers = await getAuthHeaders();
  
  // Add cache-busting timestamp to all requests
  const separator = endpoint.includes('?') ? '&' : '?';
  const cacheBustingUrl = `${API_BASE_URL}${endpoint}${separator}_t=${Date.now()}`;

  const response = await fetch(cacheBustingUrl, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
    // Disable browser caching
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Session expired. Please sign in again.');
    }
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined;
  }

  return response.json();
};

export const api = {
  signInWithProvider: async (provider, data) => {
    return apiCall(`/auth/${provider}`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
  },

  getProfile: async () => {
    return apiCall('/customer/profile');
  },

  updateProfile: async (data) => {
    return apiCall('/customer/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getFamilyMembers: async () => {
    return apiCall('/customer/family-members');
  },

  addFamilyMember: async (data) => {
    return apiCall('/customer/family-members', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateFamilyMember: async (memberId, data) => {
    return apiCall(`/customer/family-members/${memberId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteFamilyMember: async (memberId) => {
    return apiCall(`/customer/family-members/${memberId}`, {
      method: 'DELETE',
    });
  },

  getOrders: async (customerId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/customer/${customerId}/recent-orders${queryString ? `?${queryString}` : ''}`);
  },

  getOrderItems: async (orderId) => {
    return apiCall(`/orders/${orderId}/items`);
  },

  getSubscriptions: async () => {
    return apiCall('/api/profile/subscriptions');
  },

  updateSubscription: async (subscriptionId, data) => {
    return apiCall(`/api/profile/subscriptions/${subscriptionId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Header blocks API methods
  getHeaderLoyaltyPoints: async () => {
    return apiCall('/customer/header/loyalty-points');
  },

  getHeaderRewards: async () => {
    return apiCall('/api/header/rewards');
  },

  getHeaderTipOfDay: async () => {
    return apiCall('/api/header/tip-of-the-day');
  },

  getHeaderNextEvent: async () => {
    return apiCall('/api/header/next-event');
  },

  getSustainability: async () => {
    return apiCall('/api/sustainability');
  },

  // Barcode API method - ALWAYS FRESH
  getBarcode: async (enrollmentId) => {
    const token = await getUserToken();
    // Force fresh barcode every time with timestamp
    const response = await fetch(`${API_BASE_URL}/loyalty-programs/enrollments/${enrollmentId}/barcode?_t=${Date.now()}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Session expired. Please sign in again.');
      }
      throw new Error('Failed to fetch barcode');
    }

    // Return the blob as a URL
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  },

  // Google Wallet API method - ALWAYS FRESH
  getGoogleWalletPass: async () => {
    return apiCall('/api/google-wallet/pass');
  },

  healthCheck: async () => {
    const response = await fetch(`${API_BASE_URL}/health?_t=${Date.now()}`, {
      cache: 'no-store',
    });
    return response.json();
  },

  getLanguages: async () => {
    const params = new URLSearchParams();
    params.set('size', Number.MAX_SAFE_INTEGER.toString())

    return apiCall(`/localization/languages?${params}`);
  },

  getCities: async (countryId) => {
    return apiCall('/localization/cities?country=' + countryId);
  },

  getCountries: async () => {
    return apiCall('/localization/countries');
  },

  getEthnicities: async () => {
    return apiCall('/localization/countries');
  },

  createCart: async (externalConnectionId, data) => {
    const params = new URLSearchParams();
    params.set('external_connection_id', externalConnectionId);

    return apiCall(`/carts?${params}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};

export default api;

// Get recommended order - ALWAYS FRESH
export const getRecommendedOrder = async () => {
  const response = await fetch(`${API_BASE_URL}/api/profile/recommended-order?_t=${Date.now()}`, {
    headers: await getAuthHeaders(),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Failed to fetch recommended order');
  const data = await response.json();
  return data.items || [];  // Return just the items array
};
