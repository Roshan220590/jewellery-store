import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, Filter, TrendingUp, TrendingDown, Package, DollarSign, Truck, Box, Calculator, BarChart3, PieChart, FileText, Calendar, Plus } from 'lucide-react';
import centralDataManager from '../data/centralDataManager';
import AddProductForm from './AddProductForm';

export default function ProfitManagement() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('profit');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    setProducts(centralDataManager.getProducts());
  }, []);

  const handleProductAdded = (newProduct) => {
    setProducts(centralDataManager.getProducts());
  };

  // Calculate comprehensive profit metrics
  const profitMetrics = useMemo(() => {
    const totalRevenue = products.reduce((sum, p) => sum + (p.costData?.sellingPrice || p.price) * (p.stockCount || 0), 0);
    const totalCost = products.reduce((sum, p) => sum + (p.costData?.totalCost || 0) * (p.stockCount || 0), 0);
    const totalProfit = totalRevenue - totalCost;
    const avgProfitMargin = products.length > 0 ? 
      (products.reduce((sum, p) => sum + (p.costData?.profitMargin || 0), 0) / products.length).toFixed(1) : 0;

    return {
      totalRevenue,
      totalCost,
      totalProfit,
      avgProfitMargin: parseFloat(avgProfitMargin),
      totalProducts: products.length,
      inStockProducts: products.filter(p => p.inStock).length,
      lowStockProducts: products.filter(p => p.stockCount < 10).length
    };
  }, [products]);

  // Category-wise profit analysis
  const categoryProfit = useMemo(() => {
    const categories = {};
    products.forEach(product => {
      const category = product.category;
      if (!categories[category]) {
        categories[category] = {
          name: category,
          revenue: 0,
          cost: 0,
          profit: 0,
          count: 0
        };
      }
      const stockCount = product.stockCount || 0;
      categories[category].revenue += (product.costData?.sellingPrice || product.price) * stockCount;
      categories[category].cost += (product.costData?.totalCost || 0) * stockCount;
      categories[category].profit += (product.costData?.profit || 0) * stockCount;
      categories[category].count += 1;
    });
    return Object.values(categories).sort((a, b) => b.profit - a.profit);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => product.costData);

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch(sortBy) {
        case 'profit':
          aVal = a.costData?.profit || 0;
          bVal = b.costData?.profit || 0;
          break;
        case 'profitMargin':
          aVal = a.costData?.profitMargin || 0;
          bVal = b.costData?.profitMargin || 0;
          break;
        case 'revenue':
          aVal = (a.costData?.sellingPrice || a.price) * (a.stockCount || 0);
          bVal = (b.costData?.sellingPrice || b.price) * (b.stockCount || 0);
          break;
        case 'stock':
          aVal = a.stockCount || 0;
          bVal = b.stockCount || 0;
          break;
        default:
          aVal = a.name;
          bVal = b.name;
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return filtered;
  }, [products, categoryFilter, searchTerm, sortBy, sortOrder]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Product Name', 'Category', 'Stock', 'Purchase Price', 'Selling Price', 
      'Packaging Cost', 'Logistics Cost', 'Other Charges', 'Total Cost', 'Profit', 'Profit Margin %'
    ];
    
    const csvData = filteredProducts.map(product => [
      product.name,
      product.category,
      product.stockCount || 0,
      product.costData?.purchasePrice || 0,
      product.costData?.sellingPrice || product.price,
      product.costData?.packagingCost || 0,
      product.costData?.logisticsCost || 0,
      product.costData?.otherCharges || 0,
      product.costData?.totalCost || 0,
      product.costData?.profit || 0,
      product.costData?.profitMargin || 0
    ]);

    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profit_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Export to PDF (simplified version - would need a PDF library for full implementation)
  const exportToPDF = () => {
    // For now, create a print-friendly version
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Profit & Inventory Management</h2>
          <p className="text-gray-400">Track costs, profits, and inventory performance</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {showAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-green-500 text-sm font-medium">+12.5%</span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Total Revenue</h3>
            <p className="text-2xl font-bold text-white">₹{profitMetrics.totalRevenue.toLocaleString()}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Package className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-blue-500 text-sm font-medium">Active</span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Total Cost</h3>
            <p className="text-2xl font-bold text-white">₹{profitMetrics.totalCost.toLocaleString()}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-purple-500 text-sm font-medium">{profitMetrics.avgProfitMargin}%</span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Total Profit</h3>
            <p className="text-2xl font-bold text-white">₹{profitMetrics.totalProfit.toLocaleString()}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Box className="w-6 h-6 text-orange-500" />
              </div>
              <span className="text-orange-500 text-sm font-medium">{profitMetrics.lowStockProducts} Low</span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Products</h3>
            <p className="text-2xl font-bold text-white">{profitMetrics.totalProducts}</p>
          </div>
        </div>
      )}

      {/* Category Profit Analysis */}
      {showAnalytics && categoryProfit.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Profit by Category</h3>
          <div className="space-y-3">
            {categoryProfit.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-gray-300 capitalize">{category.name}</span>
                  <span className="text-gray-500 text-sm">({category.count} products)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400">₹{category.profit.toLocaleString()}</span>
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${(category.profit / Math.max(...categoryProfit.map(c => c.profit))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Search Products</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or category..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Categories</option>
              {[...new Set(products.map(p => p.category))].map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="profit">Profit</option>
              <option value="profitMargin">Profit Margin</option>
              <option value="revenue">Revenue</option>
              <option value="stock">Stock Level</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase">Product</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase">Cat</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase">Stock</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-400 uppercase">Cost</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-400 uppercase">Price</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-400 uppercase">Profit</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase">Margin</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredProducts.map((product) => {
                // Create short product name
                const shortName = product.name.length > 25 
                  ? product.name.substring(0, 22) + '...' 
                  : product.name;
                
                return (
                <tr key={product.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-8 h-8 rounded object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-white font-medium text-xs truncate" title={product.name}>
                          {shortName}
                        </div>
                        <div className="text-gray-500 text-xs">#{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs capitalize">
                      {product.category === 'hoop-hangers' ? 'Hoop' : 
                       product.category === 'maang-tikka' ? 'Tikka' :
                       product.category.substring(0, 3)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`font-bold text-xs ${(product.stockCount || 0) < 10 ? 'text-red-400' : 'text-green-400'}`}>
                        {product.stockCount || 0}
                      </span>
                      {(product.stockCount || 0) < 10 && (
                        <span className="text-xs text-red-400">Low</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="text-gray-300 text-xs">₹{product.costData?.totalCost || 0}</div>
                    <div className="text-gray-500 text-xs">+{product.costData?.packagingCost || 0}+{product.costData?.logisticsCost || 0}</div>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="text-white font-medium text-xs">₹{product.costData?.sellingPrice || product.price}</div>
                    <div className="text-gray-500 text-xs">P: ₹{product.costData?.purchasePrice || 0}</div>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className={`font-bold text-xs ${(product.costData?.profit || 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ₹{product.costData?.profit || 0}
                    </div>
                    {(product.costData?.profit || 0) > 0 && (
                      <TrendingUp className="w-3 h-3 text-green-400 inline ml-1" />
                    )}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={`font-medium text-xs ${
                      (product.costData?.profitMargin || 0) > 30 ? 'text-green-400' : 
                      (product.costData?.profitMargin || 0) > 20 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {product.costData?.profitMargin || 0}%
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      product.inStock 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {product.inStock ? '✓' : '✗'}
                    </span>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-6 border border-purple-700">
        <h3 className="text-lg font-semibold text-white mb-4">Business Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-gray-400 text-sm mb-2">Total Investment</h4>
            <p className="text-2xl font-bold text-white">₹{profitMetrics.totalCost.toLocaleString()}</p>
            <p className="text-gray-400 text-sm mt-1">Across {profitMetrics.totalProducts} products</p>
          </div>
          <div>
            <h4 className="text-gray-400 text-sm mb-2">Expected Returns</h4>
            <p className="text-2xl font-bold text-green-400">₹{profitMetrics.totalRevenue.toLocaleString()}</p>
            <p className="text-gray-400 text-sm mt-1">If all stock sells</p>
          </div>
          <div>
            <h4 className="text-gray-400 text-sm mb-2">Potential Profit</h4>
            <p className="text-2xl font-bold text-purple-400">₹{profitMetrics.totalProfit.toLocaleString()}</p>
            <p className="text-gray-400 text-sm mt-1">Avg margin: {profitMetrics.avgProfitMargin}%</p>
          </div>
        </div>
      </div>
    {/* Add Product Form Modal */}
      {showAddForm && (
        <AddProductForm
          onClose={() => setShowAddForm(false)}
          onProductAdded={handleProductAdded}
        />
      )}
    </div>
  );
}
