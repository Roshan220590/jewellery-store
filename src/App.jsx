import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
// import Wishlist from './pages/Wishlist'; // Temporarily disabled
import About from './pages/About';
import Contact from './pages/Contact';
import Chains from './pages/Chains';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProductForm from './pages/AdminProductForm';
import AdminOrders from './pages/AdminOrders';
import AdminCreateOrder from './pages/AdminCreateOrder';
import AdminCustomers from './pages/AdminCustomers';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminCategories from './pages/AdminCategories';
import AdminResetPassword from './pages/AdminResetPassword';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';

function FrontendApp() {
  console.log('FrontendApp rendering...');
  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          {/* <Route path="/wishlist" element={<Wishlist />} /> */} {/* Temporarily disabled */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/chains" element={<Chains />} />
          
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  console.log('App rendering...');
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Admin Routes - Completely Separate */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/product/new" element={<AdminProductForm />} />
            <Route path="/admin/product/:id/edit" element={<AdminProductForm />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/orders/add" element={<AdminCreateOrder />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/reset-password" element={<AdminResetPassword />} />
            
            {/* Frontend Routes - With Header and Footer */}
            <Route path="*" element={<FrontendApp />} />
          </Routes>
          <Toaster position="top-right" />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
