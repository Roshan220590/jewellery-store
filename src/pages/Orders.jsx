import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Orders() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)' }}>
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Please Sign In</h2>
          <p className="text-gray-400 mb-6">You need to be signed in to view your orders</p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 text-white rounded-lg transition-colors"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/profile" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">My Orders</h1>
          <p className="text-gray-400">Track and manage your orders</p>
        </div>

        {/* Orders Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
            <p className="text-gray-400 mb-6">You haven't placed any orders yet. Start shopping to see your orders here.</p>
            <Link
              to="/shop"
              className="inline-block px-6 py-3 text-white rounded-lg transition-colors"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
