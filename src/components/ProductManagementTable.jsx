import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import centralDataManager from '../data/centralDataManager';

const ProductManagementTable = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setIsLoading(true);
    try {
      const allProducts = centralDataManager.getProducts() || [];
      setProducts(allProducts);
    } catch (error) {
      toast.error('Error loading products');
      console.error('Load products error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct({ ...product });
  };

  const handleSave = async () => {
    if (!editingProduct) return;

    setIsLoading(true);
    try {
      // Update product in centralDataManager
      centralDataManager.updateProduct(editingProduct.id, editingProduct);
      
      // Update local state
      setProducts(products.map(p => 
        p.id === editingProduct.id ? editingProduct : p
      ));
      
      setEditingProduct(null);
      toast.success('Product updated successfully!');
    } catch (error) {
      toast.error('Error updating product');
      console.error('Update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setIsLoading(true);
    try {
      centralDataManager.deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
      toast.success('Product deleted successfully!');
    } catch (error) {
      toast.error('Error deleting product');
      console.error('Delete error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    if (field === 'price' || field === 'originalPrice' || field === 'stockCount' || field === 'rating') {
      setEditingProduct({ ...editingProduct, [field]: parseFloat(value) || 0 });
    } else if (field === 'inStock' || field === 'isNewArrival') {
      setEditingProduct({ ...editingProduct, [field]: value === 'true' || value === true });
    } else {
      setEditingProduct({ ...editingProduct, [field]: value });
    }
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'inStock' && product.inStock) ||
                           (filterStatus === 'outOfStock' && !product.inStock);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'price': return a.price - b.price;
        case 'stock': return a.stockCount - b.stockCount;
        case 'sku': return (a.sku || '').localeCompare(b.sku || '');
        default: return a.name.localeCompare(b.name);
      }
    });

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'SKU', 'Price', 'Original Price', 'Stock', 'In Stock', 'Rating', 'Description'];
    const csvData = filteredProducts.map(product => [
      product.id,
      `"${product.name}"`,
      `"${product.sku || ''}"`,
      product.price || 0,
      product.originalPrice || 0,
      product.stockCount || 0,
      product.inStock ? 'Yes' : 'No',
      product.rating || 0,
      `"${product.description || ''}"`
    ]);
    
    const csv = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Products exported to CSV!');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📦 Product Management</h2>
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              📥 Export CSV
            </button>
            <button
              onClick={loadProducts}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Products</option>
              <option value="inStock">In Stock</option>
              <option value="outOfStock">Out of Stock</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="stock">Stock</option>
              <option value="sku">SKU</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              <strong>{filteredProducts.length}</strong> products
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img 
                        src={product.images?.[0] || 'https://via.placeholder.com/50x50'} 
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </td>
                    
                    <td className="px-6 py-4">
                      {editingProduct?.id === product.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editingProduct.name}
                            onChange={(e) => handleFieldChange('name', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <textarea
                            value={editingProduct.description || ''}
                            onChange={(e) => handleFieldChange('description', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            rows="2"
                            placeholder="Description"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">{product.description}</div>
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingProduct?.id === product.id ? (
                        <input
                          type="text"
                          value={editingProduct.sku || ''}
                          onChange={(e) => handleFieldChange('sku', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="SKU"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{product.sku || '-'}</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingProduct?.id === product.id ? (
                        <div className="space-y-1">
                          <input
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) => handleFieldChange('price', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Price"
                          />
                          <input
                            type="number"
                            value={editingProduct.originalPrice || ''}
                            onChange={(e) => handleFieldChange('originalPrice', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Original Price"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm font-medium text-gray-900">₹{product.price}</div>
                          {product.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">₹{product.originalPrice}</div>
                          )}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingProduct?.id === product.id ? (
                        <div className="space-y-1">
                          <input
                            type="number"
                            value={editingProduct.stockCount}
                            onChange={(e) => handleFieldChange('stockCount', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Stock"
                          />
                          <select
                            value={editingProduct.inStock}
                            onChange={(e) => handleFieldChange('inStock', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value={true}>In Stock</option>
                            <option value={false}>Out of Stock</option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.stockCount || 0}</div>
                          <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                            product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </div>
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingProduct?.id === product.id ? (
                        <div className="space-y-1">
                          <select
                            value={editingProduct.isNewArrival}
                            onChange={(e) => handleFieldChange('isNewArrival', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value={true}>New Arrival</option>
                            <option value={false}>Regular</option>
                          </select>
                          {editingProduct.badge && (
                            <input
                              type="text"
                              value={editingProduct.badge}
                              onChange={(e) => handleFieldChange('badge', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="Badge"
                            />
                          )}
                        </div>
                      ) : (
                        <div>
                          {product.isNewArrival && (
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">New</span>
                          )}
                          {product.badge && (
                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full ml-1">{product.badge}</span>
                          )}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingProduct?.id === product.id ? (
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={editingProduct.rating || 0}
                          onChange={(e) => handleFieldChange('rating', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Rating"
                        />
                      ) : (
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900">{product.rating || 'N/A'}</span>
                          {product.rating && (
                            <span className="text-yellow-400 ml-1">⭐</span>
                          )}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingProduct?.id === product.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{products.length}</div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {products.filter(p => p.inStock).length}
            </div>
            <div className="text-sm text-gray-600">In Stock</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {products.filter(p => !p.inStock).length}
            </div>
            <div className="text-sm text-gray-600">Out of Stock</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              ₹{products.reduce((sum, p) => sum + (p.price * (p.stockCount || 0)), 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagementTable;
