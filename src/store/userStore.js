import { create } from 'zustand';

// Simplified userStore for now - using AuthContext instead
const useUserStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  // Placeholder methods - AuthContext handles the real logic
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: async () => {},
  changePassword: async () => {},
  addAddress: async () => {},
  updateAddress: async () => {},
  deleteAddress: async () => {},
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  clearError: () => {},
  initialize: () => {},
}));

export default useUserStore;
