import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Menu, X, User, LogOut, Settings, Package, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { getTotalItems } = useCart();
  // const { items: wishlistItems } = useWishlist();
  const wishlistItems = []; // Temporary fix
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const profileRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>

      {/* Moving Announcement Bar */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/90 via-purple-800/90 to-purple-900/90" style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
        <div className="flex animate-marquee whitespace-nowrap">
          <div className="flex items-center space-x-8 py-2">
            {/* First set */}
            <span className="text-purple-200 text-sm font-medium flex items-center gap-2">
              <span className="text-yellow-400">🎯</span>
              We Make Handmade Hoop Hangers • Artisan Crafted Excellence
              <span className="text-yellow-400">✨</span>
            </span>
            <span className="text-purple-200 text-sm font-medium flex items-center gap-2">
              <span className="text-yellow-400">💍</span>
              Perfect for Wedding • Birthday • Anniversary • Engagement
              <span className="text-yellow-400">🎉</span>
            </span>
            <span className="text-purple-200 text-sm font-medium flex items-center gap-2">
              <span className="text-yellow-400">🎁</span>
              Festival • Party • Corporate Events • Traditional Celebrations
              <span className="text-yellow-400">🌟</span>
            </span>
            <span className="text-purple-200 text-sm font-medium flex items-center gap-2">
              <span className="text-yellow-400">💎</span>
              Premium Imitation Jewellery • Affordable Luxury Collection
              <span className="text-yellow-400">🎊</span>
            </span>
            {/* Second set (duplicate for seamless loop) */}
            <span className="text-purple-200 text-sm font-medium flex items-center gap-2">
              <span className="text-yellow-400">🎯</span>
              We Make Handmade Hoop Hangers • Artisan Crafted Excellence
              <span className="text-yellow-400">✨</span>
            </span>
            <span className="text-purple-200 text-sm font-medium flex items-center gap-2">
              <span className="text-yellow-400">💍</span>
              Perfect for Wedding • Birthday • Anniversary • Engagement
              <span className="text-yellow-400">🎉</span>
            </span>
            <span className="text-purple-200 text-sm font-medium flex items-center gap-2">
              <span className="text-yellow-400">🎁</span>
              Festival • Party • Corporate Events • Traditional Celebrations
              <span className="text-yellow-400">🌟</span>
            </span>
            <span className="text-purple-200 text-sm font-medium flex items-center gap-2">
              <span className="text-yellow-400">💎</span>
              Premium Imitation Jewellery • Affordable Luxury Collection
              <span className="text-yellow-400">🎊</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className={`sticky top-auto z-50 transition-all duration-300 ${scrolled ? 'shadow-[0_6px_30px_rgba(0,0,0,0.3)]' : ''}`} style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)', borderBottom: '1px solid rgba(212,175,55,0.3)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-20 md:h-24">
            {/* Logo - Left Side */}
            <Link to="/" className="flex flex-col leading-none select-none group" style={{ gap: '2px' }}>
              <div className="flex items-center">
                <div className="flex flex-col">
                  <div className="flex items-baseline">
                    <span style={{
                      fontSize: '1.8rem',
                      fontFamily: '"Playfair Display", "Georgia", serif',
                      fontWeight: '700',
                      color: '#D4AF37',
                      lineHeight: 0.9,
                      letterSpacing: '0.01em',
                      textTransform: 'uppercase',
                    }}>R</span>
                    <span style={{
                      fontSize: '1.8rem',
                      fontFamily: '"Playfair Display", "Georgia", serif',
                      fontWeight: '700',
                      color: '#D4AF37',
                      lineHeight: 0.9,
                      letterSpacing: '0.01em',
                      textTransform: 'uppercase',
                      margin: '0 0.05rem'
                    }}>&amp;</span>
                    <span style={{
                      fontSize: '1.8rem',
                      fontFamily: '"Playfair Display", "Georgia", serif',
                      fontWeight: '700',
                      color: '#D4AF37',
                      lineHeight: 0.9,
                      letterSpacing: '0.01em',
                      textTransform: 'uppercase',
                    }}>S</span>
                  </div>
                </div>
              </div>
              <div className="text-center" style={{ marginTop: '4px' }}>
                <span style={{
                  fontSize: '0.55rem',
                  letterSpacing: '0.15em',
                  color: '#FDE68A',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                  fontFamily: '"Montserrat", sans-serif',
                }}>
                  Elite Imitation Jewellery
                </span>
              </div>
            </Link>

            {/* Desktop Nav - Centered */}
            <nav className="hidden lg:flex items-center gap-8 mx-auto">
              <Link to="/" className="text-gray-300 hover:text-yellow-400 transition-colors">Home</Link>
              <Link to="/products" className="text-gray-300 hover:text-yellow-400 transition-colors">Products</Link>
              <Link to="/shop" className="text-gray-300 hover:text-yellow-400 transition-colors">Shop</Link>
              <Link to="/shop?tag=new" className="text-gray-300 hover:text-yellow-400 transition-colors">New</Link>
              <Link to="/shop?tag=sale" className="text-gray-300 hover:text-yellow-400 transition-colors">Sale</Link>
              <Link to="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors">Contact</Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">

              {/* Authentication */}
              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/10 transition-colors text-gray-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                      <User size={16} className="text-gray-900" />
                    </div>
                    <span className="hidden md:block text-sm font-medium">{user?.name}</span>
                    <ChevronDown size={16} className={`transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                      <div className="p-3 border-b border-gray-700">
                        <p className="text-sm font-medium text-white">{user?.name}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <User size={16} />
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Package size={16} />
                          My Orders
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Settings size={16} />
                          Settings
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors w-full"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                    style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-gray-200">
                <Heart size={20} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart"
                className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-gray-200">
                <ShoppingCart size={20} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 text-white text-xs rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #be185d, #7c3aed)' }}>
                    {getTotalItems()}
                  </span>
                )}
              </Link>

              {/* Mobile menu toggle */}
              <button onClick={() => setMobileMenuOpen(v => !v)}
                className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-colors text-gray-200">
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 py-4 space-y-1 bg-gray-800 border-t border-gray-700">
            <Link to="/" className="block py-2 text-sm text-gray-300">Home</Link>
            <Link to="/products" className="block py-2 text-sm text-gray-300">Products</Link>
            <Link to="/shop" className="block py-2 text-sm text-gray-300">Shop</Link>
            <Link to="/shop?tag=new" className="block py-2 text-sm text-gray-300">New</Link>
            <Link to="/shop?tag=sale" className="block py-2 text-sm text-gray-300">Sale</Link>
            <Link to="/contact" className="block py-2 text-sm text-gray-300">Contact</Link>
            
            {/* Mobile Auth */}
            <div className="border-t border-gray-700 pt-4 mt-4">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                  <Link to="/profile" className="block py-2 text-sm text-gray-300">My Profile</Link>
                  <Link to="/orders" className="block py-2 text-sm text-gray-300">My Orders</Link>
                  <Link to="/settings" className="block py-2 text-sm text-gray-300">Settings</Link>
                  <button
                    onClick={logout}
                    className="block py-2 text-sm text-gray-300 text-left w-full"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block py-2 text-sm text-gray-300">Sign In</Link>
                  <Link to="/register" className="block py-2 text-sm text-gray-300">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
