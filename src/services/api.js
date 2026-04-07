const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE;
    this.token = (typeof window !== 'undefined' && window.localStorage) ? localStorage.getItem('token') : null;
  }

  // Set auth token
  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined' && window.localStorage) {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  }

  // Get auth headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Product APIs
  async getProducts(params = {}) {
    return this.get('/products', params);
  }

  async getProduct(id) {
    return this.get(`/products/${id}`);
  }

  async getFeaturedProducts(limit = 8) {
    return this.get('/products/featured', { limit });
  }

  async getNewArrivals(limit = 8) {
    return this.get('/products/new-arrivals', { limit });
  }

  async getSaleProducts(limit = 8) {
    return this.get('/products/sale', { limit });
  }

  async getRelatedProducts(id) {
    return this.get(`/products/${id}/related`);
  }

  // Category APIs
  async getCategories() {
    return this.get('/categories');
  }

  async getCategory(id) {
    return this.get(`/categories/${id}`);
  }

  // User APIs
  async register(userData) {
    const response = await this.post('/users/register', userData);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async login(credentials) {
    const response = await this.post('/users/login', credentials);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async logout() {
    this.setToken(null);
  }

  async getProfile() {
    return this.get('/users/profile');
  }

  async updateProfile(userData) {
    return this.put('/users/profile', userData);
  }

  async addAddress(addressData) {
    return this.post('/users/addresses', addressData);
  }

  async updateAddress(addressId, addressData) {
    return this.put(`/users/addresses/${addressId}`, addressData);
  }

  async deleteAddress(addressId) {
    return this.delete(`/users/addresses/${addressId}`);
  }

  async addToWishlist(productId) {
    return this.post('/users/wishlist', { productId });
  }

  async removeFromWishlist(productId) {
    return this.delete(`/users/wishlist/${productId}`);
  }

  async changePassword(passwordData) {
    return this.put('/users/change-password', passwordData);
  }

  // Order APIs
  async createOrder(orderData) {
    return this.post('/orders', orderData);
  }

  async getMyOrders(params = {}) {
    return this.get('/orders/my-orders', params);
  }

  async getOrder(id) {
    return this.get(`/orders/${id}`);
  }

  async cancelOrder(id) {
    return this.put(`/orders/${id}/cancel`);
  }

  // Utility methods
  isAuthenticated() {
    return !!this.token;
  }

  getCurrentUser() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  setCurrentUser(user) {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;
