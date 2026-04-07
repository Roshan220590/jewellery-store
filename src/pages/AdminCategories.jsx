import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Package, Tag, TrendingUp, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import centralDataManager from '../data/centralDataManager';

export default function AdminCategories() {
  const buildCategories = () => {
    const allProducts = centralDataManager.getProducts();
    const centralCats = centralDataManager.getCategories();
    const base = centralCats.length > 0 ? centralCats : [
      { id: 'necklaces', name: 'Necklaces', description: 'Beautiful necklaces for all occasions', status: 'active', image: 'https://images.unsplash.com/photo-1596944924617-7fed1bca6a0b?w=100&h=100&fit=crop' },
      { id: 'earrings', name: 'Earrings', description: 'Elegant earrings for every style', status: 'active', image: 'https://images.unsplash.com/photo-1617029877552-75c3a5ff4c5a?w=100&h=100&fit=crop' },
      { id: 'rings', name: 'Rings', description: 'Stunning rings for special moments', status: 'active', image: 'https://images.unsplash.com/photo-1605100804763-247f67d0d9c7?w=100&h=100&fit=crop' },
      { id: 'bangles', name: 'Bangles & Bracelets', description: 'Charming bangles for daily wear', status: 'active', image: 'https://images.unsplash.com/photo-1570483823943-348d99b5f59e?w=100&h=100&fit=crop' },
      { id: 'anklets', name: 'Anklets', description: 'Traditional anklets for cultural beauty', status: 'active', image: 'https://images.unsplash.com/photo-1596944924617-7fed1bca6a0b?w=100&h=100&fit=crop' },
      { id: 'maang-tikka', name: 'Maang Tikka', description: 'Elegant maang tikka for bridal looks', status: 'active', image: 'https://images.unsplash.com/photo-1605100804763-247f67d0d9c7?w=100&h=100&fit=crop' },
      { id: 'sets', name: 'Bridal Sets', description: 'Complete bridal jewellery sets', status: 'active', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=100&h=100&fit=crop' },
      { id: 'chains', name: 'Chains', description: 'Gold and silver chains', status: 'active', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop' },
      { id: 'hoop-hangers', name: 'Hoop Hangers', description: 'Trendy hoop earrings', status: 'active', image: 'https://images.unsplash.com/photo-1635797255064-4f09ab0c51e3?w=100&h=100&fit=crop' },
    ];
    return base.map(cat => ({
      ...cat,
      productCount: allProducts.filter(p => p.category === (cat.id || cat.name?.toLowerCase())).length
    }));
  };

  const [categories, setCategories] = useState(() => buildCategories());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    status: 'active'
  });

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || category.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddCategory = () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    const newCategory = centralDataManager.addCategory({
      id: formData.name.toLowerCase().replace(/\s+/g, '-'),
      ...formData,
      productCount: 0,
      image: formData.image || 'https://images.unsplash.com/photo-1596944924617-7fed1bca6a0b?w=100&h=100&fit=crop'
    });

    setCategories(buildCategories());
    setFormData({ name: '', description: '', image: '', status: 'active' });
    setShowAddModal(false);
    toast.success('Category added successfully!');
  };

  const handleEditCategory = () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    centralDataManager.updateCategory(selectedCategory.id, formData);
    setCategories(buildCategories());
    setFormData({ name: '', description: '', image: '', status: 'active' });
    setShowEditModal(false);
    setSelectedCategory(null);
    toast.success('Category updated successfully!');
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        centralDataManager.deleteCategory(categoryId);
        setCategories(buildCategories());
        toast.success('Category deleted successfully!');
      } catch (error) {
        toast.error(error.message || 'Cannot delete category');
      }
    }
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      image: category.image,
      status: category.status
    });
    setShowEditModal(true);
  };

  const activeCategories = categories.filter(cat => cat.status === 'active').length;
  const inactiveCategories = categories.filter(cat => cat.status === 'inactive').length;
  const totalProducts = categories.reduce((sum, cat) => sum + cat.productCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Category Management</h1>
          <p className="text-gray-400">Manage your product categories and organization</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-lg text-white flex items-center gap-2"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-500/20">
              <Tag className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex items-center text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              12%
            </div>
          </div>
          <div>
            <p className="text-gray-300 text-sm mb-1">Total Categories</p>
            <p className="text-3xl font-bold text-white">{categories.length}</p>
            <p className="text-gray-400 text-xs mt-2">All categories</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-500/20">
              <Package className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div>
            <p className="text-gray-300 text-sm mb-1">Total Products</p>
            <p className="text-3xl font-bold text-white">{totalProducts}</p>
            <p className="text-gray-400 text-xs mt-2">Across all categories</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <Package className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div>
            <p className="text-gray-300 text-sm mb-1">Active Categories</p>
            <p className="text-3xl font-bold text-white">{activeCategories}</p>
            <p className="text-gray-400 text-xs mt-2">Currently visible</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-500/20">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <div>
            <p className="text-gray-300 text-sm mb-1">Inactive Categories</p>
            <p className="text-3xl font-bold text-white">{inactiveCategories}</p>
            <p className="text-gray-400 text-xs mt-2">Hidden from store</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="p-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-700/50 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img src={category.image} alt={category.name} className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    category.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {category.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openEditModal(category)}
                  className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">{category.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Products</span>
              <span className="text-white font-semibold">{category.productCount}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Add New Category</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Category Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  rows="3"
                  placeholder="Enter category description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter image URL (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-700/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 rounded-lg text-white"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Edit Category</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Category Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  rows="3"
                  placeholder="Enter category description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter image URL (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-700/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditCategory}
                className="px-4 py-2 rounded-lg text-white"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}
              >
                Update Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
