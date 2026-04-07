import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Package, Heart, Settings, LogOut, Calendar, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)' }}>
        <div className="text-center">
          <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Please Sign In</h2>
          <p className="text-gray-400 mb-6">You need to be signed in to view your profile</p>
          <a
            href="/login"
            className="inline-block px-6 py-3 text-white rounded-lg transition-colors"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-white">{user?.name}</h3>
                <p className="text-gray-400 text-sm">{user?.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Overview', icon: User },
                  { id: 'orders', label: 'My Orders', icon: Package },
                  { id: 'wishlist', label: 'Wishlist', icon: Heart },
                  { id: 'addresses', label: 'Addresses', icon: MapPin },
                  { id: 'settings', label: 'Settings', icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-yellow-400/20 text-yellow-400'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full mt-6 flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-6">Account Overview</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="w-5 h-5 text-blue-400" />
                        <h3 className="text-white font-medium">Total Orders</h3>
                      </div>
                      <p className="text-2xl font-bold text-blue-400">{user?.orders?.length || 0}</p>
                    </div>

                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Heart className="w-5 h-5 text-red-400" />
                        <h3 className="text-white font-medium">Wishlist Items</h3>
                      </div>
                      <p className="text-2xl font-bold text-red-400">{user?.wishlist?.length || 0}</p>
                    </div>

                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin className="w-5 h-5 text-green-400" />
                        <h3 className="text-white font-medium">Saved Addresses</h3>
                      </div>
                      <p className="text-2xl font-bold text-green-400">{user?.addresses?.length || 0}</p>
                    </div>

                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-purple-400" />
                        <h3 className="text-white font-medium">Loyalty Points</h3>
                      </div>
                      <p className="text-2xl font-bold text-purple-400">{user?.loyaltyPoints || 0}</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-white mb-4">Account Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-400">Full Name</p>
                          <p className="text-white">{user?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-400">Email Address</p>
                          <p className="text-white">{user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-400">Phone Number</p>
                          <p className="text-white">{user?.phone || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-400">Member Since</p>
                          <p className="text-white">{new Date(user?.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-6">My Orders</h2>
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No orders yet</p>
                    <a
                      href="/shop"
                      className="inline-block mt-4 px-6 py-3 text-white rounded-lg transition-colors"
                      style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}
                    >
                      Start Shopping
                    </a>
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-6">My Wishlist</h2>
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Your wishlist is empty</p>
                    <a
                      href="/shop"
                      className="inline-block mt-4 px-6 py-3 text-white rounded-lg transition-colors"
                      style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}
                    >
                      Browse Products
                    </a>
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-6">Saved Addresses</h2>
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No saved addresses</p>
                    <button className="mt-4 px-6 py-3 text-white rounded-lg transition-colors" style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}>
                      Add Address
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-6">Account Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Preferences</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span className="text-gray-300">Email Notifications</span>
                          <input type="checkbox" className="w-4 h-4 text-yellow-400 rounded" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-gray-300">SMS Notifications</span>
                          <input type="checkbox" className="w-4 h-4 text-yellow-400 rounded" />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-gray-300">Newsletter Subscription</span>
                          <input type="checkbox" className="w-4 h-4 text-yellow-400 rounded" defaultChecked />
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Security</h3>
                      <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 bg-gray-700/30 rounded-lg text-gray-300 hover:bg-gray-700/50 transition-colors">
                          Change Password
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-gray-700/30 rounded-lg text-gray-300 hover:bg-gray-700/50 transition-colors">
                          Two-Factor Authentication
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
