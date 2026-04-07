import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Search, X, Users, Globe, Package, ShoppingCart } from 'lucide-react';
// products import replaced by centralDataManager below
import { updateStockOnOrder } from '../data/inventory';
import { websiteIntegration } from '../data/websiteIntegration';
import centralDataManager from '../data/centralDataManager';
import toast from 'react-hot-toast';

export default function AdminAddOrder() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [orderData, setOrderData] = useState({
    customer: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    items: [],
    paymentMethod: 'COD',
    paymentStatus: 'pending',
    source: 'Manual',
    platform: 'Manual Entry',
    notes: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const allProducts = centralDataManager.getProducts();
  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addProductToOrder = () => {
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }

    const existingItem = orderData.items.find(item => item.id === selectedProduct.id);
    
    if (existingItem) {
      setOrderData(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.id === selectedProduct.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }));
    } else {
      setOrderData(prev => ({
        ...prev,
        items: [...prev.items, {
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          quantity: quantity,
          image: selectedProduct.image
        }]
      }));
    }

    setSelectedProduct(null);
    setQuantity(1);
    setSearchTerm('');
    toast.success('Product added to order');
  };

  const removeItemFromOrder = (itemId) => {
    setOrderData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
    toast.success('Item removed from order');
  };

  const calculateTotal = () => {
    return orderData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }
    
    // Validation
    if (!orderData.customer.name || !orderData.customer.phone || !orderData.customer.address) {
      toast.error('Please fill in all customer information');
      return;
    }

    if (orderData.items.length === 0) {
      toast.error('Please add at least one product to the order');
      return;
    }

    setIsSubmitting(true);

    // Create new order
    const newOrder = {
      id: generateOrderId(),
      customer: orderData.customer,
      date: new Date().toISOString().split('T')[0],
      total: calculateTotal(),
      status: 'pending',
      paymentStatus: orderData.paymentMethod === 'COD' ? 'pending' : 'paid',
      paymentMethod: orderData.paymentMethod,
      paymentId: `${orderData.paymentMethod}_${Date.now()}`,
      platform: orderData.platform,
      device: 'Manual',
      items: orderData.items,
      shipping: {
        address: orderData.customer.address,
        method: 'Standard Delivery',
        tracking: `MANUAL_${Date.now()}`,
        status: 'Pending'
      },
      source: orderData.source,
      notes: orderData.notes
    };

    // Save to localStorage
    try {
      const existingOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
      const updatedOrders = [newOrder, ...existingOrders];
      localStorage.setItem('adminOrders', JSON.stringify(updatedOrders));
      
      // Update inventory stock
      updateStockOnOrder(orderData.items);
      
      // Handle website integration
      websiteIntegration.handleWebsiteOrder(newOrder);
      
      // Add order to centralized data manager (this will trigger real-time updates)
      centralDataManager.addOrder(newOrder);
      
      toast.success(`Order ${newOrder.id} created successfully! Stock updated and all sections synced.`);
      
      // Add a small delay before navigation to ensure toast is shown
      setTimeout(() => {
        navigate('/admin/orders');
      }, 1500);
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Error saving order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/orders')}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Add Manual Order</h1>
                <p className="text-gray-400 text-sm">Create order from Facebook, Instagram or external sources</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
                <Users className="w-4 h-4 text-gray-900" />
              </div>
              <h2 className="text-lg font-semibold text-white">Customer Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Customer Name *</label>
                <input
                  type="text"
                  value={orderData.customer.name}
                  onChange={(e) => setOrderData(prev => ({
                    ...prev,
                    customer: { ...prev.customer, name: e.target.value }
                  }))}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={orderData.customer.email}
                  onChange={(e) => setOrderData(prev => ({
                    ...prev,
                    customer: { ...prev.customer, email: e.target.value }
                  }))}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                  placeholder="customer@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={orderData.customer.phone}
                  onChange={(e) => setOrderData(prev => ({
                    ...prev,
                    customer: { ...prev.customer, phone: e.target.value }
                  }))}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Complete Address *</label>
                <input
                  type="text"
                  value={orderData.customer.address}
                  onChange={(e) => setOrderData(prev => ({
                    ...prev,
                    customer: { ...prev.customer, address: e.target.value }
                  }))}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                  placeholder="123 MG Road, Bangalore, Karnataka 560001"
                  required
                />
              </div>
            </div>
          </div>

          {/* Order Source */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-white">Order Source</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Source</label>
                <select
                  value={orderData.source}
                  onChange={(e) => setOrderData(prev => ({ ...prev, source: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                >
                  <option value="Manual">Manual Entry</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Phone">Phone Call</option>
                  <option value="Email">Email</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Payment Method</label>
                <select
                  value={orderData.paymentMethod}
                  onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                >
                  <option value="COD">Cash on Delivery</option>
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Wallet">Wallet</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Platform</label>
                <select
                  value={orderData.platform}
                  onChange={(e) => setOrderData(prev => ({ ...prev, platform: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                >
                  <option value="Manual Entry">Manual Entry</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Phone">Phone</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Order Notes</label>
              <textarea
                value={orderData.notes}
                onChange={(e) => setOrderData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                rows={2}
                placeholder="Add any special notes about this order..."
              />
            </div>
          </div>

          {/* Product Selection */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-white">Add Products</h2>
              </div>
              <div className="text-sm text-gray-400">
                {orderData.items.length} {orderData.items.length === 1 ? 'item' : 'items'} added
              </div>
            </div>
            
            {/* Product Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                  placeholder="Search products by name or category..."
                />
              </div>
            </div>

            {/* Product Selection */}
            {searchTerm && (
              <div className="mb-4">
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {filteredProducts.map(product => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-lg" />
                        <div>
                          <p className="text-white font-medium text-sm">{product.name}</p>
                          <p className="text-gray-400 text-xs">{product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-400 font-semibold text-sm">₹{product.price.toLocaleString()}</p>
                        <p className="text-gray-400 text-xs">Stock: {product.stockCount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add Button */}
            {selectedProduct && (
              <div className="mb-4 p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="w-10 h-10 object-cover rounded-lg" />
                    <div>
                      <p className="text-white font-medium text-sm">{selectedProduct.name}</p>
                      <p className="text-yellow-400 font-semibold text-sm">₹{selectedProduct.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <label className="text-gray-300 text-xs">Qty:</label>
                      <input
                        type="number"
                        min="1"
                        max={selectedProduct.stockCount}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-center text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addProductToOrder}
                      className="px-3 py-1 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors text-sm"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProduct(null);
                        setSearchTerm('');
                        setQuantity(1);
                      }}
                      className="p-1 text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <ShoppingCart className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-white">Order Items</h2>
              </div>
              <div className="text-sm text-gray-400">
                Total: ₹{calculateTotal().toLocaleString()}
              </div>
            </div>
            
            {orderData.items.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No items added yet. Search and add products above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orderData.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                      <div>
                        <p className="text-white font-medium text-sm">{item.name}</p>
                        <p className="text-gray-400 text-xs">₹{item.price.toLocaleString()} × {item.quantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <p className="text-yellow-400 font-semibold text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                      <button
                        type="button"
                        onClick={() => removeItemFromOrder(item.id)}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold text-white">Total Amount</p>
                    <p className="text-xl font-bold text-yellow-400">₹{calculateTotal().toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}
            >
              {isSubmitting ? 'Creating Order...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
