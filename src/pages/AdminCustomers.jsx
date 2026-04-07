import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Ban,
  MoreVertical,
  MapPin,
  ShoppingBag
} from 'lucide-react';
import toast from 'react-hot-toast';
import centralDataManager from '../data/centralDataManager';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    // First try to get customers from localStorage (where actual registrations are stored)
    if (typeof window !== 'undefined' && window.localStorage) {
      const localStorageCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
      if (localStorageCustomers && localStorageCustomers.length > 0) {
        // Transform localStorage data to match admin dashboard format
        const formattedCustomers = localStorageCustomers.map(customer => ({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone || '+91 00000 00000',
          joinDate: customer.createdAt ? new Date(customer.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          totalOrders: customer.orders?.length || 0,
          totalSpent: customer.totalSpent || 0,
          status: customer.status || 'active',
          lastOrder: customer.orders?.length > 0 ? customer.orders[customer.orders.length - 1]?.date : null,
          addresses: customer.addresses || [],
          loyaltyPoints: customer.loyaltyPoints || 0
        }));
        setCustomers(formattedCustomers);
        setFilteredCustomers(formattedCustomers);
        return;
      }
    }
    
    // Fallback to centralDataManager if no localStorage customers
    const centralCustomers = centralDataManager.getCustomers();
    if (centralCustomers && centralCustomers.length > 0) {
      setCustomers(centralCustomers);
      setFilteredCustomers(centralCustomers);
      return;
    }
    const mockCustomers = [
      {
        id: 1,
        name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        phone: '+91 98765 43210',
        joinDate: '2024-01-15',
        totalOrders: 5,
        totalSpent: 12990,
        status: 'active',
        lastOrder: '2024-04-01',
        addresses: [
          { type: 'home', address: '123 MG Road, Bangalore, Karnataka 560001', default: true },
          { type: 'work', address: '456 Brigade Road, Bangalore, Karnataka 560025', default: false }
        ],
        wishlist: ['Royal Kundan Choker Necklace', 'Pearl Drop Earrings'],
        loyaltyPoints: 250
      },
      {
        id: 2,
        name: 'Anjali Patel',
        email: 'anjali.p@email.com',
        phone: '+91 87654 32109',
        joinDate: '2024-02-20',
        totalOrders: 3,
        totalSpent: 7497,
        status: 'active',
        lastOrder: '2024-04-01',
        addresses: [
          { type: 'home', address: '789 Commercial Street, Bangalore, Karnataka 560045', default: true }
        ],
        wishlist: ['Diamond Ring', 'Bridal Set'],
        loyaltyPoints: 150
      },
      {
        id: 3,
        name: 'Kavya Reddy',
        email: 'kavya.reddy@email.com',
        phone: '+91 76543 21098',
        joinDate: '2024-03-10',
        totalOrders: 2,
        totalSpent: 4498,
        status: 'active',
        lastOrder: '2024-03-31',
        addresses: [
          { type: 'home', address: '321 Residency Road, Bangalore, Karnataka 560067', default: true },
          { type: 'work', address: '654 Infantry Road, Bangalore, Karnataka 560089', default: false }
        ],
        wishlist: ['Maang Tikka', 'Anklets'],
        loyaltyPoints: 100
      },
      {
        id: 4,
        name: 'Meera Gupta',
        email: 'meera.gupta@email.com',
        phone: '+91 65432 10987',
        joinDate: '2023-12-05',
        totalOrders: 8,
        totalSpent: 18992,
        status: 'vip',
        lastOrder: '2024-03-31',
        addresses: [
          { type: 'home', address: '987 Indiranagar, Bangalore, Karnataka 560038', default: true }
        ],
        wishlist: ['Hoop Hangers', 'Chains'],
        loyaltyPoints: 500
      },
      {
        id: 5,
        name: 'Sneha Joshi',
        email: 'sneha.joshi@email.com',
        phone: '+91 54321 09876',
        joinDate: '2024-01-28',
        totalOrders: 1,
        totalSpent: 1299,
        status: 'inactive',
        lastOrder: '2024-03-30',
        addresses: [
          { type: 'home', address: '456 Koramangala, Bangalore, Karnataka 560095', default: true }
        ],
        wishlist: [],
        loyaltyPoints: 25
      }
    ];
    centralDataManager.customers = mockCustomers;
    centralDataManager.saveData && centralDataManager.saveData();
    setCustomers(mockCustomers);
    setFilteredCustomers(mockCustomers);
  }, []);

  useEffect(() => {
    let filtered = customers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        (customer.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.phone || '').includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }

    setFilteredCustomers(filtered);
  }, [customers, searchTerm, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'vip': return 'bg-purple-500/20 text-purple-400';
      case 'inactive': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const updateCustomerStatus = (customerId, newStatus) => {
    const updated = customers.map(customer =>
      customer.id === customerId ? { ...customer, status: newStatus } : customer
    );
    setCustomers(updated);
    centralDataManager.customers = updated;
    centralDataManager.saveData && centralDataManager.saveData();
    toast.success(`Customer status updated to ${newStatus}`);
  };

  const exportCustomers = () => {
    toast.success('Customers data exported successfully!');
  };

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    vip: customers.filter(c => c.status === 'vip').length,
    inactive: customers.filter(c => c.status === 'inactive').length,
    totalRevenue: customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0),
    avgOrderValue: customers.length > 0 ? Math.round(customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0) / customers.reduce((sum, c) => sum + (c.totalOrders || 0), 0)) : 0
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Customers</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Customers</p>
              <p className="text-2xl font-bold text-white">{stats.active}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">VIP Customers</p>
              <p className="text-2xl font-bold text-white">{stats.vip}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white">₹{(stats.totalRevenue || 0).toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
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
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="vip">VIP</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <button
              onClick={exportCustomers}
              className="px-4 py-2 rounded-lg text-white flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-700/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}>
                        <span className="text-white font-bold text-sm">
                          {(customer.name || 'Customer').split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="text-white font-medium">{customer.name}</p>
                        <p className="text-gray-400 text-sm">ID: CUST{(customer.id || 0).toString().padStart(4, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-white flex items-center gap-2">
                        <Mail className="w-3 h-3 text-gray-400" />
                        {customer.email || 'No email'}
                      </p>
                      <p className="text-gray-400 text-sm flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {customer.phone || 'No phone'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-white">{customer.joinDate || 'N/A'}</p>
                      <p className="text-gray-400 text-sm">Last order: {customer.lastOrder || 'No orders'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-white font-medium">{customer.totalOrders || 0}</p>
                      <p className="text-gray-400 text-sm">orders</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-yellow-400 font-semibold">₹{(customer.totalSpent || 0).toLocaleString()}</p>
                    {(customer.loyaltyPoints || 0) > 0 && (
                      <p className="text-gray-400 text-sm">{customer.loyaltyPoints || 0} points</p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="p-1 text-blue-400 hover:text-blue-300"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <select
                        value={customer.status}
                        onChange={(e) => updateCustomerStatus(customer.id, e.target.value)}
                        className="text-sm px-2 py-1 bg-gray-700/50 border border-gray-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                      >
                        <option value="active">Active</option>
                        <option value="vip">VIP</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}>
                  <span className="text-white font-bold text-xl">
                    {(selectedCustomer.name || 'Customer').split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedCustomer.name}</h3>
                  <p className="text-gray-400">Customer ID: CUST{(selectedCustomer.id || 0).toString().padStart(4, '0')}</p>
                  <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedCustomer.status)}`}>
                    {selectedCustomer.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-white">{selectedCustomer.email || 'No email'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Phone</p>
                      <p className="text-white">{selectedCustomer.phone || 'No phone'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Order History</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Total Orders</p>
                    <p className="text-white font-semibold">{selectedCustomer.totalOrders || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Spent</p>
                    <p className="text-yellow-400 font-semibold">₹{(selectedCustomer.totalSpent || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Average Order</p>
                    <p className="text-white font-semibold">₹{Math.round((selectedCustomer.totalSpent || 0) / (selectedCustomer.totalOrders || 1)).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Loyalty Points</p>
                    <p className="text-purple-400 font-semibold">{selectedCustomer.loyaltyPoints || 0}</p>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Shipping Addresses</h4>
                <div className="space-y-3">
                  {(selectedCustomer.addresses || []).map((address, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-white font-medium capitalize">{address.type || 'Home'}</p>
                          {address.default && (
                            <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">{address.address || 'No address provided'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wishlist */}
              {(selectedCustomer.wishlist && selectedCustomer.wishlist.length > 0) && (
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">Wishlist Items</h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedCustomer.wishlist || []).map((item, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-800/50 rounded-full text-sm text-gray-300">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
