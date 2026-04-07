import React, { useState } from 'react';
import { Plus, X, Save, Calculator, Package, Truck, Box, DollarSign } from 'lucide-react';
import centralDataManager from '../data/centralDataManager';
import toast from 'react-hot-toast';

export default function AddProductForm({ onClose, onProductAdded }) {
  const [formData, setFormData] = useState({
    // Basic Product Info
    name: '',
    category: 'necklaces',
    price: '',
    originalPrice: '',
    description: '',
    image: '',
    inStock: true,
    stockCount: '',
    
    // Cost Information
    purchasePrice: '',
    packagingCost: '',
    logisticsCost: '',
    otherCharges: '',
    
    // Additional Details
    sizes: '',
    colors: '',
    deliveryTime: '',
    returnPolicy: '',
    codAvailable: true,
    emiAvailable: true,
    specialOffers: ''
  });

  const categories = centralDataManager.getCategories();

  // Calculate profit and margin
  const calculateProfit = () => {
    const sellingPrice = parseFloat(formData.price) || 0;
    const totalCost = parseFloat(formData.purchasePrice) + 
                     parseFloat(formData.packagingCost || 0) + 
                     parseFloat(formData.logisticsCost || 0) + 
                     parseFloat(formData.otherCharges || 0);
    const profit = sellingPrice - totalCost;
    const margin = sellingPrice > 0 ? ((profit / sellingPrice) * 100).toFixed(1) : 0;
    
    return { totalCost, profit, margin };
  };

  const { totalCost, profit, margin } = calculateProfit();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.price || !formData.purchasePrice) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Create product object
    const newProduct = {
      id: Math.max(...centralDataManager.getProducts().map(p => p.id), 0) + 1,
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      originalPrice: parseFloat(formData.originalPrice) || parseFloat(formData.price),
      description: formData.description,
      image: formData.image || 'https://picsum.photos/seed/product/500/500.jpg',
      rating: 4.5,
      reviews: 0,
      inStock: formData.inStock,
      stockCount: parseInt(formData.stockCount) || 0,
      isFeatured: false,
      isNewArrival: true,
      sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()) : ['One Size'],
      colors: formData.colors ? formData.colors.split(',').map(c => c.trim()) : ['Gold'],
      deliveryTime: formData.deliveryTime || '3-4 days',
      seller: 'R&S Jewellery Store',
      returnPolicy: formData.returnPolicy || '7 days replacement',
      codAvailable: formData.codAvailable,
      emiAvailable: formData.emiAvailable,
      specialOffers: formData.specialOffers ? formData.specialOffers.split(',').map(o => o.trim()) : [],
      
      // Cost and Profit Management
      costData: {
        purchasePrice: parseFloat(formData.purchasePrice),
        packagingCost: parseFloat(formData.packagingCost) || 0,
        logisticsCost: parseFloat(formData.logisticsCost) || 0,
        otherCharges: parseFloat(formData.otherCharges) || 0,
        totalCost: totalCost,
        sellingPrice: parseFloat(formData.price),
        profit: profit,
        profitMargin: parseFloat(margin)
      }
    };

    // Add product to centralDataManager
    centralDataManager.addProduct(newProduct);
    
    toast.success(`Product "${formData.name}" added successfully!`);
    onProductAdded(newProduct);
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Plus className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add New Product</h2>
              <p className="text-gray-400 text-sm">Enter product details and cost information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Product Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-400" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Selling Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="₹0"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Original Price</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  placeholder="₹0"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Stock Count *</label>
                <input
                  type="number"
                  name="stockCount"
                  value={formData.stockCount}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Leave empty for default image"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="text-gray-400 text-sm mb-2 block">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows={3}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Cost Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-green-400" />
              Cost & Profit Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Purchase Price *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    name="purchasePrice"
                    value={formData.purchasePrice}
                    onChange={handleInputChange}
                    placeholder="What you paid to supplier"
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Packaging Cost</label>
                <div className="relative">
                  <Box className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    name="packagingCost"
                    value={formData.packagingCost}
                    onChange={handleInputChange}
                    placeholder="Boxes, wrapping, labels"
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Logistics Cost</label>
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    name="logisticsCost"
                    value={formData.logisticsCost}
                    onChange={handleInputChange}
                    placeholder="Shipping, delivery charges"
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Other Charges</label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    name="otherCharges"
                    value={formData.otherCharges}
                    onChange={handleInputChange}
                    placeholder="Marketing, fees, etc."
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Profit Calculation Display */}
            <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
              <h4 className="text-white font-medium mb-3">Profit Calculation Preview</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Total Cost</p>
                  <p className="text-lg font-bold text-blue-400">₹{totalCost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Expected Profit</p>
                  <p className={`text-lg font-bold ${profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ₹{profit.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Profit Margin</p>
                  <p className={`text-lg font-bold ${margin > 30 ? 'text-green-400' : margin > 20 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {margin}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Additional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Sizes (comma-separated)</label>
                <input
                  type="text"
                  name="sizes"
                  value={formData.sizes}
                  onChange={handleInputChange}
                  placeholder="Small, Medium, Large"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Colors (comma-separated)</label>
                <input
                  type="text"
                  name="colors"
                  value={formData.colors}
                  onChange={handleInputChange}
                  placeholder="Gold, Silver, Rose Gold"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Delivery Time</label>
                <input
                  type="text"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleInputChange}
                  placeholder="3-4 days"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Return Policy</label>
                <input
                  type="text"
                  name="returnPolicy"
                  value={formData.returnPolicy}
                  onChange={handleInputChange}
                  placeholder="7 days replacement"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="text-gray-400 text-sm mb-2 block">Special Offers (comma-separated)</label>
              <input
                type="text"
                name="specialOffers"
                value={formData.specialOffers}
                onChange={handleInputChange}
                placeholder="Free Shipping, Gift Box, Discount"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            
            <div className="mt-4 flex gap-4">
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="codAvailable"
                  checked={formData.codAvailable}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded accent-purple-500"
                />
                <span>COD Available</span>
              </label>
              
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="emiAvailable"
                  checked={formData.emiAvailable}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded accent-purple-500"
                />
                <span>EMI Available</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
