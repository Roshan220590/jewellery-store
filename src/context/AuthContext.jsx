import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication on mount
  useEffect(() => {
    // Check if localStorage is available (client-side)
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const token = localStorage.getItem('customerToken');
        const userData = localStorage.getItem('customerData');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('customerToken');
        localStorage.removeItem('customerData');
      }
    }
    setLoading(false);
  }, []);

  // Register new customer
  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Simulate API call - in production, this would be a real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists (mock validation)
      let newUser = null;
      if (typeof window !== 'undefined' && window.localStorage) {
        const existingUsers = JSON.parse(localStorage.getItem('customers') || '[]');
        if (existingUsers.find(u => u.email === userData.email)) {
          throw new Error('An account with this email already exists');
        }

        // Create new user
        newUser = {
          id: Date.now().toString(),
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: btoa(userData.password), // Basic encoding (in production, use proper hashing)
          createdAt: new Date().toISOString(),
          addresses: [],
          orders: [],
          wishlist: [],
          loyaltyPoints: 0,
          totalSpent: 0,
          status: 'active'
        };

        // Save to localStorage (in production, save to database)
        existingUsers.push(newUser);
        localStorage.setItem('customers', JSON.stringify(existingUsers));

        // Auto-login after registration
        const token = btoa(newUser.id + ':' + Date.now());
        localStorage.setItem('customerToken', token);
        localStorage.setItem('customerData', JSON.stringify(newUser));
        
        setUser(newUser);
        setIsAuthenticated(true);
      } else {
        throw new Error('LocalStorage not available');
      }
      
      toast.success('Account created successfully! Welcome to R&S Jewellery!');
      
      // Redirect to intended page or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
      
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Login customer
  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get users from localStorage (in production, check against database)
      let user = null;
      if (typeof window !== 'undefined' && window.localStorage) {
        const users = JSON.parse(localStorage.getItem('customers') || '[]');
        user = users.find(u => u.email === credentials.email);
        
        if (!user) {
          throw new Error('No account found with this email address');
        }
        
        if (user.password !== btoa(credentials.password)) {
          throw new Error('Invalid password');
        }
        
        if (user.status !== 'active') {
          throw new Error('Your account has been deactivated');
        }
        
        // Create token and save
        const token = btoa(user.id + ':' + Date.now());
        localStorage.setItem('customerToken', token);
        localStorage.setItem('customerData', JSON.stringify(user));
        
        setUser(user);
        setIsAuthenticated(true);
      } else {
        throw new Error('LocalStorage not available');
      }
      
      toast.success(`Welcome back, ${user?.name || 'Customer'}!`);
      
      // Redirect to intended page or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
      
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout customer
  const logout = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('customerToken');
      localStorage.removeItem('customerData');
    }
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      
      // Get current users
      const users = JSON.parse(localStorage.getItem('customers') || '[]');
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      // Update user data
      const updatedUser = { ...users[userIndex], ...updates };
      users[userIndex] = updatedUser;
      localStorage.setItem('customers', JSON.stringify(users));
      
      // Update local state
      setUser(updatedUser);
      localStorage.setItem('customerData', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Add address
  const addAddress = async (address) => {
    try {
      const users = JSON.parse(localStorage.getItem('customers') || '[]');
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      const newAddress = {
        ...address,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      users[userIndex].addresses = users[userIndex].addresses || [];
      users[userIndex].addresses.push(newAddress);
      
      // Set as default if it's the first address
      if (users[userIndex].addresses.length === 1) {
        newAddress.default = true;
      }
      
      localStorage.setItem('customers', JSON.stringify(users));
      setUser(users[userIndex]);
      localStorage.setItem('customerData', JSON.stringify(users[userIndex]));
      
      toast.success('Address added successfully!');
      return { success: true };
    } catch (error) {
      toast.error('Failed to add address');
      return { success: false };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    register,
    login,
    logout,
    updateProfile,
    addAddress
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
