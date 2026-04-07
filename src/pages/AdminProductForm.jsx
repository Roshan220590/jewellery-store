import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Plus, Trash2 } from 'lucide-react';
import { categories } from '../data/products';
import centralDataManager from '../data/centralDataManager';
import toast from 'react-hot-toast';

export default function AdminProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    description: '',
    details: [],
    stockCount: '',
    inStock: true,
    isFeatured: false,
    isNewArrival: false,
    badge: '',
    badgeColor: 'bg-blue-500',
    images: [],
    sizes: [],
    materials: [],
    occasions: [],
    weight: '',
    dimensions: '',
    sku: '',
    rating: 4.5,
    costData: {
      purchasePrice: '',
      packagingCost: '',
      logisticsCost: '',
      otherCharges: ''
    }
  });

  const [newDetail, setNewDetail] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newMaterial, setNewMaterial] = useState('');
  const [newOccasion, setNewOccasion] = useState('');

  // Category-specific size options
  const categorySizes = {
    rings: ['4', '5', '6', '7', '8', '9', '10', '11', '12'],
    bangles: ['2.2', '2.4', '2.6', '2.8', '3.0', '3.2', '3.4'],
    bracelets: ['6', '6.5', '7', '7.5', '8', '8.5', '9'],
    necklaces: ['16', '18', '20', '22', '24', '26', '28'],
    earrings: ['Free Size'],
    chains: ['16', '18', '20', '22', '24', '26', '28'],
    pendants: ['Free Size'],
    default: ['Free Size', 'Small', 'Medium', 'Large']
  };

  const getCategorySizes = (category) => {
    return categorySizes[category] || categorySizes.default;
  };

  useEffect(() => {
    if (isEditing) {
      // Load product data for editing from centralized data manager
      const products = centralDataManager.getProducts();
      const product = products.find(p => p.id === parseInt(id));
      if (product) {
        setFormData({
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice || '',
          description: product.description || '',
          details: product.details || [],
          stockCount: product.stockCount || 0,
          inStock: product.inStock !== false,
          isFeatured: product.isFeatured || false,
          isNewArrival: product.isNewArrival || false,
          badge: product.badge || '',
          badgeColor: product.badgeColor || 'bg-blue-500',
          images: product.images || [product.image],
          sizes: product.sizes || [],
          materials: product.materials || [],
          occasions: product.occasions || [],
          weight: product.weight || '',
          dimensions: product.dimensions || '',
          sku: product.sku || '',
          rating: product.rating || 4.5,
          costData: product.costData || {
            purchasePrice: '',
            packagingCost: '',
            logisticsCost: '',
            otherCharges: ''
          }
        });
        setImagePreviews(product.images || [product.image]);
      }
    }
  }, [isEditing, id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('cost_')) {
      const costField = name.replace('cost_', '');
      setFormData(prev => ({
        ...prev,
        costData: {
          ...prev.costData,
          [costField]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAddMaterial = () => {
    if (newMaterial.trim()) {
      setFormData(prev => ({
        ...prev,
        materials: [...prev.materials, newMaterial.trim()]
      }));
      setNewMaterial('');
    }
  };

  const handleRemoveMaterial = (index) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const handleAddOccasion = () => {
    if (newOccasion.trim()) {
      setFormData(prev => ({
        ...prev,
        occasions: [...prev.occasions, newOccasion.trim()]
      }));
      setNewOccasion('');
    }
  };

  const handleRemoveOccasion = (index) => {
    setFormData(prev => ({
      ...prev,
      occasions: prev.occasions.filter((_, i) => i !== index)
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleAddDetail = () => {
    if (newDetail.trim()) {
      setFormData(prev => ({
        ...prev,
        details: [...prev.details, newDetail.trim()]
      }));
      setNewDetail('');
    }
  };

  const handleRemoveDetail = (index) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, e.target.result]);
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, e.target.result]
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleRemoveImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.category || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stockCount: parseInt(formData.stockCount),
        inStock: parseInt(formData.stockCount) > 0,
        image: formData.images[0] || '', // First image is primary
        images: formData.images,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (isEditing) {
        // Update existing product
        const updatedProduct = centralDataManager.updateProduct(parseInt(id), productData);
        if (updatedProduct) {
          toast.success('Product updated successfully!');
          toast.success('Website will refresh automatically...', { duration: 2000 });
          navigate('/admin/dashboard');
        } else {
          toast.error('Failed to update product');
        }
      } else {
        // Add new product
        const newProduct = centralDataManager.addProduct(productData);
        if (newProduct) {
          toast.success('Product added successfully!');
          toast.success('Website will refresh automatically...', { duration: 2000 });
          navigate('/admin/dashboard');
        } else {
          toast.error('Failed to add product');
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Error saving product');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)' }}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-gray-400">
                {isEditing ? 'Update product information' : 'Create a new product for your store'}
              </p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg text-white flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}
          >
            <Save className="w-4 h-4" />
            {isEditing ? 'Update Product' : 'Save Product'}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sale Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="₹0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Original Price
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="₹0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stock Count *
                </label>
                <input
                  type="number"
                  name="stockCount"
                  value={formData.stockCount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Badge
                </label>
                <input
                  type="text"
                  name="badge"
                  value={formData.badge}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="New, Sale, Bestseller"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Describe your product..."
              />
            </div>
          </div>

          {/* Product Specifications */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-6">Product Specifications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sizes based on category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Available Sizes
                </label>
                <div className="text-xs text-gray-400 mb-2">
                  {formData.category ? `Sizes for ${formData.category}` : 'Select category first'}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {getCategorySizes(formData.category).map(size => (
                    <label key={size} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.sizes.includes(size)}
                        onChange={() => handleSizeToggle(size)}
                        className="w-3 h-3 text-yellow-400 border-gray-600 rounded bg-gray-700 focus:ring-yellow-400"
                      />
                      <span className="text-white text-sm">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Materials
                </label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMaterial}
                      onChange={(e) => setNewMaterial(e.target.value)}
                      className="flex-1 px-3 py-1 bg-gray-700/50 border border-gray-600 rounded text-white placeholder-gray-400 text-sm"
                      placeholder="Add material (e.g., Gold Plated)"
                    />
                    <button
                      type="button"
                      onClick={handleAddMaterial}
                      className="px-3 py-1 bg-yellow-500 text-gray-900 rounded text-sm hover:bg-yellow-400"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.materials.map((material, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-700 text-white rounded text-sm flex items-center gap-1">
                        {material}
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Occasions */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Occasions
                </label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newOccasion}
                      onChange={(e) => setNewOccasion(e.target.value)}
                      className="flex-1 px-3 py-1 bg-gray-700/50 border border-gray-600 rounded text-white placeholder-gray-400 text-sm"
                      placeholder="Add occasion (e.g., Wedding)"
                    />
                    <button
                      type="button"
                      onClick={handleAddOccasion}
                      className="px-3 py-1 bg-yellow-500 text-gray-900 rounded text-sm hover:bg-yellow-400"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.occasions.map((occasion, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-700 text-white rounded text-sm flex items-center gap-1">
                        {occasion}
                        <button
                          type="button"
                          onClick={() => handleRemoveOccasion(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Weight & Dimensions */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Weight & Dimensions
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded text-white placeholder-gray-400 text-sm"
                    placeholder="Weight (e.g., 10g)"
                  />
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded text-white placeholder-gray-400 text-sm"
                    placeholder="Dimensions (e.g., 2cm x 3cm)"
                  />
                </div>
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded text-white placeholder-gray-400 text-sm"
                  placeholder="Product SKU (e.g., RS-NECK-001)"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rating
                </label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  min="1"
                  max="5"
                  step="0.1"
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded text-white placeholder-gray-400 text-sm"
                  placeholder="4.5"
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-6">Product Details</h2>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newDetail}
                  onChange={(e) => setNewDetail(e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Add product detail (e.g., Material: Gold-plated brass)"
                />
                <button
                  type="button"
                  onClick={handleAddDetail}
                  className="px-4 py-2 rounded-lg text-white"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {formData.details.map((detail, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-white">{detail}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDetail(index)}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-6">Product Images</h2>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-300">Click to upload images</span>
                  <span className="text-gray-500 text-sm">PNG, JPG up to 10MB</span>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cost Management */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-6">Cost Management</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Purchase Price
                </label>
                <input
                  type="number"
                  name="cost_purchasePrice"
                  value={formData.costData.purchasePrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded text-white placeholder-gray-400 text-sm"
                  placeholder="What you paid for the product"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Packaging Cost
                </label>
                <input
                  type="number"
                  name="cost_packagingCost"
                  value={formData.costData.packagingCost}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded text-white placeholder-gray-400 text-sm"
                  placeholder="Packaging expenses"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Logistics Cost
                </label>
                <input
                  type="number"
                  name="cost_logisticsCost"
                  value={formData.costData.logisticsCost}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded text-white placeholder-gray-400 text-sm"
                  placeholder="Shipping & handling"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Other Charges
                </label>
                <input
                  type="number"
                  name="cost_otherCharges"
                  value={formData.costData.otherCharges}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded text-white placeholder-gray-400 text-sm"
                  placeholder="Marketing, fees, etc."
                />
              </div>
            </div>

            {/* Cost Summary */}
            <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
              <h3 className="text-white font-medium mb-3">Cost Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Cost:</span>
                  <span className="text-white">
                    ₹{(
                      (parseFloat(formData.costData.purchasePrice) || 0) +
                      (parseFloat(formData.costData.packagingCost) || 0) +
                      (parseFloat(formData.costData.logisticsCost) || 0) +
                      (parseFloat(formData.costData.otherCharges) || 0)
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Selling Price:</span>
                  <span className="text-white">₹{formData.price || 0}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-300">Profit:</span>
                  <span className="text-green-400">
                    ₹{(
                      (parseFloat(formData.price) || 0) -
                      ((parseFloat(formData.costData.purchasePrice) || 0) +
                       (parseFloat(formData.costData.packagingCost) || 0) +
                       (parseFloat(formData.costData.logisticsCost) || 0) +
                       (parseFloat(formData.costData.otherCharges) || 0))
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Options */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-6">Product Options</h2>
            
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-yellow-400 border-gray-600 rounded bg-gray-700 focus:ring-yellow-400"
                />
                <span className="text-white">In Stock</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-yellow-400 border-gray-600 rounded bg-gray-700 focus:ring-yellow-400"
                />
                <span className="text-white">Featured Product</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isNewArrival"
                  checked={formData.isNewArrival}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-yellow-400 border-gray-600 rounded bg-gray-700 focus:ring-yellow-400"
                />
                <span className="text-white">New Arrival</span>
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
