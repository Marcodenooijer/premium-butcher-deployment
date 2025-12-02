// frontend/src/services/api.js
import { getUserToken } from '../firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const getAuthHeaders = async () => {
  const token = await getUserToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

const apiCall = async (endpoint, options = {}) => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Session expired. Please sign in again.');
    }
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const api = {
  getProfile: async () => {
    return apiCall('/api/profile');
  },

  updateProfile: async (data) => {
    return apiCall('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getFamilyMembers: async () => {
    return apiCall('/api/profile/family');
  },

  addFamilyMember: async (data) => {
    return apiCall('/api/profile/family', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateFamilyMember: async (memberId, data) => {
    return apiCall(`/api/profile/family/${memberId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteFamilyMember: async (memberId) => {
    return apiCall(`/api/profile/family/${memberId}`, {
      method: 'DELETE',
    });
  },

  getOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/api/profile/orders${queryString ? `?${queryString}` : ''}`);
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
    return apiCall('/api/header/loyalty-points');
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

  healthCheck: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },
};

export default api;

