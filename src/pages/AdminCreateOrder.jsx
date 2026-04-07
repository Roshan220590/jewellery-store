import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Search, Package, DollarSign, User, Phone, MapPin, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import centralDataManager from '../data/centralDataManager';

export default function AdminCreateOrder() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const allProducts = centralDataManager.getProducts() || [];
    setProducts(allProducts);
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    product.inStock
  );

  const addToOrder = (product) => {
    const existingItem = selectedProducts.find(item => item.id === product.id);
    if (existingItem) {
      setSelectedProducts(selectedProducts.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromOrder(productId);
    } else {
      setSelectedProducts(selectedProducts.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const removeFromOrder = (productId) => {
    setSelectedProducts(selectedProducts.filter(item => item.id !== productId));
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => {
      const price = item.originalPrice && item.originalPrice > item.price ? item.price : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedProducts.length === 0) {
      toast.error('Please add at least one product');
      return;
    }

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast.error('Please fill in all required customer information');
      return;
    }

    setLoading(true);

    try {
      const newOrder = {
        id: `ORD-${Date.now()}`,
        customer: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pincode}`
        },
        items: selectedProducts.map(item => ({
          id: item.id,
          name: item.name,
          price: item.originalPrice && item.originalPrice > item.price ? item.price : item.price,
          originalPrice: item.originalPrice,
          quantity: item.quantity,
          image: item.images?.[0] || ''
        })),
        total: calculateTotal(),
        subtotal: calculateTotal(),
        shipping: 0,
        tax: 0,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: customerInfo.paymentMethod,
        paymentId: '',
        date: new Date().toLocaleDateString(),
        createdAt: new Date().toISOString(),
        platform: 'Admin',
        device: 'Manual Order',
        notes: 'Manual order created by admin'
      };

      // Add order to centralDataManager
      centralDataManager.addOrder(newOrder);
      
      // Update product stock
      selectedProducts.forEach(item => {
        const newStock = (item.stockCount || 0) - item.quantity;
        centralDataManager.updateProduct(item.id, { 
          stockCount: Math.max(0, newStock),
          inStock: newStock > 0
        });
      });

      toast.success('Order created successfully!');
      navigate('/admin/dashboard/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/dashboard/orders')}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <h1 className="text-2xl font-bold text-white">Create Manual Order</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Information */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Customer name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="customer@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Address *</label>
                  <textarea
                    required
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    rows="2"
                    placeholder="Street address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                    <input
                      type="text"
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">State</label>
                    <input
                      type="text"
                      value={customerInfo.state}
                      onChange={(e) => setCustomerInfo({...customerInfo, state: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="State"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={customerInfo.pincode}
                    onChange={(e) => setCustomerInfo({...customerInfo, pincode: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="400001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Payment Method</label>
                  <select
                    value={customerInfo.paymentMethod}
                    onChange={(e) => setCustomerInfo({...customerInfo, paymentMethod: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="cod">Cash on Delivery</option>
                    <option value="upi">UPI</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Products and Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Search */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Add Products
              </h2>
              
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Search products..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-gray-700/30 rounded-lg p-3 border border-gray-600">
                    <div className="flex gap-3">
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/60x60'}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm">{product.name}</h3>
                        <p className="text-gray-400 text-xs mb-2">Stock: {product.stockCount || 0}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            {product.originalPrice && product.originalPrice > product.price ? (
                              <>
                                <span className="text-white font-bold">₹{product.price}</span>
                                <span className="text-gray-500 text-xs line-through ml-1">₹{product.originalPrice}</span>
                              </>
                            ) : (
                              <span className="text-white font-bold">₹{product.price}</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => addToOrder(product)}
                            className="p-1 bg-yellow-500 text-gray-900 rounded hover:bg-yellow-400 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Order Summary
              </h2>
              
              {selectedProducts.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No products added to order</p>
              ) : (
                <div className="space-y-4">
                  {selectedProducts.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-700/30 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images?.[0] || 'https://via.placeholder.com/40x40'}
                          alt={item.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <h4 className="text-white font-medium text-sm">{item.name}</h4>
                          <p className="text-gray-400 text-xs">
                            {item.originalPrice && item.originalPrice > item.price ? (
                              <>
                                ₹{item.price} <span className="line-through">₹{item.originalPrice}</span>
                              </>
                            ) : (
                              `₹${item.price}`
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 bg-gray-600 text-white rounded hover:bg-gray-500"
                        >
                          -
                        </button>
                        <span className="text-white w-8 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 bg-gray-600 text-white rounded hover:bg-gray-500"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromOrder(item.id)}
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-gray-600 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-white">₹{calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Shipping</span>
                      <span className="text-white">FREE</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Tax</span>
                      <span className="text-white">₹0</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold text-white">
                      <span>Total</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || selectedProducts.length === 0}
            className="px-6 py-3 rounded-lg text-white font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}
          >
            {loading ? 'Creating...' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
