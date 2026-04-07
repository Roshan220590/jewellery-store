import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Filter,
  Search,
  Download,
  Eye,
  Edit,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MoreVertical,
  Smartphone,
  CreditCard,
  Wallet,
  Building,
  Globe,
  Mail,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
import centralDataManager from '../data/centralDataManager';

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [shippingStatusFilter, setShippingStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  // Load order data from centralDataManager
  useEffect(() => {
    const centralOrders = centralDataManager.getOrders();
    console.log('=== ADMIN ORDERS DEBUG ===');
    console.log('Central orders from getOrders():', centralOrders.length);
    console.log('Central orders array:', centralOrders);
    
    let allOrders = [];
    
    if (centralOrders && centralOrders.length > 0) {
      // Transform centralized orders to match AdminOrders expected structure
      allOrders = centralOrders.map(order => ({
        ...order,
        date: new Date(order.createdAt).toLocaleDateString(),
        paymentId: order.paymentId || '',
        platform: order.platform || 'Website',
        device: order.device || 'Web',
        shipping: {
          address: order.customer.address,
          method: 'Standard Delivery',
          status: order.status === 'pending' ? 'pending' : 
                 order.status === 'confirmed' ? 'processing' :
                 order.status === 'shipped' ? 'shipped' :
                 order.status === 'delivered' ? 'delivered' : 'pending',
          trackingId: '',
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
        }
      }));
    } else {
      // Fallback empty orders if no orders
      allOrders = [];
    }
    
    setOrders(allOrders);
    setFilteredOrders(allOrders);
  }, []);

  // Subscribe to order updates
  useEffect(() => {
    const unsubscribe = centralDataManager.subscribe('orderAdded', () => {
      refreshOrders();
    });
    
    return unsubscribe;
  }, []);

  // Refresh orders from centralDataManager
  const refreshOrders = () => {
    const centralOrders = centralDataManager.getOrders();
    console.log('=== ADMIN ORDERS REFRESH DEBUG ===');
    console.log('Central orders on refresh:', centralOrders.length);
    console.log('Central orders array:', centralOrders);
    
    if (centralOrders && centralOrders.length > 0) {
      // Transform centralized orders to match AdminOrders expected structure
      const transformedOrders = centralOrders.map(order => ({
        ...order,
        date: new Date(order.createdAt).toLocaleDateString(),
        paymentId: order.paymentId || '',
        platform: order.platform || 'Website',
        device: order.device || 'Web',
        shipping: {
          address: order.customer.address,
          method: 'Standard Delivery',
          status: order.status === 'pending' ? 'pending' : 
                 order.status === 'confirmed' ? 'processing' :
                 order.status === 'shipped' ? 'shipped' :
                 order.status === 'delivered' ? 'delivered' : 'pending',
          trackingId: '',
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
        }
      }));
      setOrders(transformedOrders);
      setFilteredOrders(transformedOrders);
    }
  };

  // Auto-refresh when component mounts (for returning from add order page)
  useEffect(() => {
    refreshOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Payment status filter
    if (paymentStatusFilter !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus === paymentStatusFilter);
    }

    // Shipping status filter
    if (shippingStatusFilter !== 'all') {
      filtered = filtered.filter(order => order.shipping.status === shippingStatusFilter);
    }

    // Payment method filter
    if (paymentMethodFilter !== 'all') {
      filtered = filtered.filter(order => order.paymentMethod === paymentMethodFilter);
    }

    // Source filter
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(order => order.source === sourceFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

      filtered = filtered.filter(order => {
        const orderDate = new Date(order.date);
        if (dateFilter === 'today') {
          return orderDate.toDateString() === today.toDateString();
        } else if (dateFilter === 'yesterday') {
          return orderDate.toDateString() === yesterday.toDateString();
        } else if (dateFilter === 'week') {
          return orderDate >= lastWeek;
        } else if (dateFilter === 'lastmonth') {
          return orderDate >= startOfLastMonth && orderDate <= endOfLastMonth;
        } else if (dateFilter === 'custom' && customDateRange.start && customDateRange.end) {
          return orderDate >= new Date(customDateRange.start) && orderDate <= new Date(customDateRange.end);
        }
        return true;
      });
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, dateFilter, customDateRange, paymentMethodFilter, sourceFilter, paymentStatusFilter, shippingStatusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'processing': return 'bg-blue-500/20 text-blue-400';
      case 'shipped': return 'bg-purple-500/20 text-purple-400';
      case 'delivered': return 'bg-green-500/20 text-green-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <AlertCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'UPI': return <Smartphone className="w-3 h-3" />;
      case 'Credit Card': return <CreditCard className="w-3 h-3" />;
      case 'Debit Card': return <CreditCard className="w-3 h-3" />;
      case 'COD': return <Package className="w-3 h-3" />;
      case 'Net Banking': return <Building className="w-3 h-3" />;
      case 'Wallet': return <Wallet className="w-3 h-3" />;
      default: return <DollarSign className="w-3 h-3" />;
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'UPI': return 'bg-blue-500/20 text-blue-400';
      case 'Credit Card': return 'bg-purple-500/20 text-purple-400';
      case 'Debit Card': return 'bg-indigo-500/20 text-indigo-400';
      case 'COD': return 'bg-orange-500/20 text-orange-400';
      case 'Net Banking': return 'bg-green-500/20 text-green-400';
      case 'Wallet': return 'bg-pink-500/20 text-pink-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    // Sync to centralDataManager
    centralDataManager.updateOrderStatus(orderId, newStatus);

    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast.success(`Order ${orderId} status updated to ${newStatus}`);

    // Automatic payment status updates based on order status
    const order = orders.find(o => o.id === orderId);
    if (order) {
      let paymentStatus = order.paymentStatus;
      
      if (newStatus === 'processing' && paymentStatus === 'pending') {
        paymentStatus = 'paid';
      } else if (newStatus === 'cancelled' && paymentStatus === 'paid') {
        paymentStatus = 'refunded';
      } else if (newStatus === 'delivered' && paymentStatus === 'paid') {
        paymentStatus = 'completed';
      }

      if (paymentStatus !== order.paymentStatus) {
        setOrders(prev => prev.map(o =>
          o.id === orderId ? { ...o, paymentStatus } : o
        ));
        toast.success(`Payment status automatically updated to ${paymentStatus}`);
      }
    }
  };

  const updateShippingStatus = (orderId, shippingStatus) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, shippingStatus } : order
    ));
    toast.success(`Shipping status updated to ${shippingStatus}`);
  };

  const getInitialPaymentStatus = (paymentMethod) => {
    // Automatically determine payment status based on payment method
    switch (paymentMethod) {
      case 'UPI':
      case 'Credit Card':
      case 'Debit Card':
      case 'Net Banking':
      case 'Wallet':
        return 'paid'; // Online payments are automatically marked as paid
      case 'COD':
        return 'pending'; // COD payments are pending until delivery
      default:
        return 'pending';
    }
  };

  const updatePaymentStatus = (orderId, paymentStatus) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, paymentStatus } : order
    ));
    const statusText = paymentStatus === 'paid' ? 'Received' : paymentStatus === 'pending' ? 'Not Received' : paymentStatus;
    toast.success(`Payment status updated to ${statusText}`);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setPaymentStatusFilter('all');
    setPaymentMethodFilter('all');
    setShippingStatusFilter('all');
    setDateFilter('all');
    setCustomDateRange({ start: '', end: '' });
    toast.success('All filters cleared');
  };

  const exportOrders = () => {
    try {
      // Get the orders that are currently filtered
      const ordersToExport = filteredOrders.length > 0 ? filteredOrders : orders;
      
      if (ordersToExport.length === 0) {
        toast.error('No orders to export');
        return;
      }

      // Create CSV content
      const headers = [
        'Order ID',
        'Customer Name',
        'Customer Email',
        'Customer Phone',
        'Order Date',
        'Total Amount',
        'Order Status',
        'Payment Status',
        'Payment Method',
        'Payment ID',
        'Shipping Status',
        'Shipping Address',
        'Platform',
        'Source',
        'Items Count',
        'Items Details'
      ];

      const csvRows = ordersToExport.map(order => {
        const itemsDetails = order.items.map(item => 
          `${item.name} (Qty: ${item.quantity}, Price: ₹${item.price})`
        ).join(' | ');

        return [
          order.id,
          order.customer.name,
          order.customer.email || '',
          order.customer.phone,
          order.date,
          order.total,
          order.status,
          order.paymentStatus,
          order.paymentMethod,
          order.paymentId || '',
          order.shipping?.status || '',
          order.shipping?.address || '',
          order.platform || '',
          order.source || '',
          order.items.length,
          `"${itemsDetails}"`
        ];
      });

      // Convert to CSV string
      const csvContent = [
        headers.join(','),
        ...csvRows.map(row => row.join(','))
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      // Generate filename with current date and filter info
      const now = new Date().toISOString().split('T')[0];
      const filterInfo = filteredOrders.length !== orders.length ? '_filtered' : '';
      const filename = `orders_export_${now}${filterInfo}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${ordersToExport.length} orders successfully!`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export orders');
    }
  };

  const handleBulkAction = () => {
    if (selectedOrders.length === 0) {
      toast.error('Please select orders first');
      return;
    }

    if (!bulkAction) {
      toast.error('Please select an action');
      return;
    }

    // Apply bulk action
    setOrders(prev => prev.map(order => {
      if (selectedOrders.includes(order.id)) {
        let updatedOrder = { ...order };
        
        if (bulkAction === 'mark-processing') {
          updatedOrder.status = 'processing';
          updatedOrder.paymentStatus = 'paid';
        } else if (bulkAction === 'mark-shipped') {
          updatedOrder.status = 'shipped';
        } else if (bulkAction === 'mark-delivered') {
          updatedOrder.status = 'delivered';
          updatedOrder.paymentStatus = 'completed';
        } else if (bulkAction === 'cancel') {
          updatedOrder.status = 'cancelled';
          updatedOrder.paymentStatus = 'refunded';
        }
        
        return updatedOrder;
      }
      return order;
    }));

    toast.success(`Bulk action applied to ${selectedOrders.length} orders`);
    setSelectedOrders([]);
    setBulkAction('');
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const selectAllOrders = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    revenue: orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0),
    paymentMethods: {
      upi: orders.filter(o => o.paymentMethod === 'UPI').length,
      creditCard: orders.filter(o => o.paymentMethod === 'Credit Card').length,
      debitCard: orders.filter(o => o.paymentMethod === 'Debit Card').length,
      cod: orders.filter(o => o.paymentMethod === 'COD').length,
      netBanking: orders.filter(o => o.paymentMethod === 'Net Banking').length,
      wallet: orders.filter(o => o.paymentMethod === 'Wallet').length,
    },
    sources: {
      direct: orders.filter(o => o.source === 'Direct').length,
      googleAds: orders.filter(o => o.source === 'Google Ads').length,
      facebookAds: orders.filter(o => o.source === 'Facebook Ads').length,
      instagram: orders.filter(o => o.source === 'Instagram').length,
      emailMarketing: orders.filter(o => o.source === 'Email Marketing').length,
      organic: orders.filter(o => o.source === 'Organic').length,
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-white">{stats.pending}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Processing</p>
              <p className="text-2xl font-bold text-white">{stats.processing}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Revenue</p>
              <p className="text-2xl font-bold text-white">₹{stats.revenue.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods & Sources Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Payment Methods</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-blue-400" />
                <span className="text-white">UPI</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-400 text-sm">{stats.paymentMethods.upi} orders</span>
                <span className="text-blue-400 font-semibold">
                  {stats.total > 0 ? Math.round((stats.paymentMethods.upi / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-purple-400" />
                <span className="text-white">Credit Card</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-400 text-sm">{stats.paymentMethods.creditCard} orders</span>
                <span className="text-purple-400 font-semibold">
                  {stats.total > 0 ? Math.round((stats.paymentMethods.creditCard / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-indigo-400" />
                <span className="text-white">Debit Card</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-400 text-sm">{stats.paymentMethods.debitCard} orders</span>
                <span className="text-indigo-400 font-semibold">
                  {stats.total > 0 ? Math.round((stats.paymentMethods.debitCard / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-orange-400" />
                <span className="text-white">COD</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-400 text-sm">{stats.paymentMethods.cod} orders</span>
                <span className="text-orange-400 font-semibold">
                  {stats.total > 0 ? Math.round((stats.paymentMethods.cod / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-green-400" />
                <span className="text-white">Net Banking</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-400 text-sm">{stats.paymentMethods.netBanking} orders</span>
                <span className="text-green-400 font-semibold">
                  {stats.total > 0 ? Math.round((stats.paymentMethods.netBanking / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Traffic Sources</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-green-400" />
                <span className="text-white">Direct</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-400 text-sm">{stats.sources.direct} orders</span>
                <span className="text-green-400 font-semibold">
                  {stats.total > 0 ? Math.round((stats.sources.direct / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span className="text-white">Google Ads</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-400 text-sm">{stats.sources.googleAds} orders</span>
                <span className="text-blue-400 font-semibold">
                  {stats.total > 0 ? Math.round((stats.sources.googleAds / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-white">Facebook Ads</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-400 text-sm">{stats.sources.facebookAds} orders</span>
                <span className="text-blue-400 font-semibold">
                  {stats.total > 0 ? Math.round((stats.sources.facebookAds / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-pink-400" />
                <span className="text-white">Instagram</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-400 text-sm">{stats.sources.instagram} orders</span>
                <span className="text-pink-400 font-semibold">
                  {stats.total > 0 ? Math.round((stats.sources.instagram / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-yellow-400" />
                <span className="text-white">Email Marketing</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-400 text-sm">{stats.sources.emailMarketing} orders</span>
                <span className="text-yellow-400 font-semibold">
                  {stats.total > 0 ? Math.round((stats.sources.emailMarketing / stats.total) * 100) : 0}%
                </span>
              </div>
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
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
          
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => navigate('/admin/orders/add')}
              className="px-4 py-2 rounded-lg text-white flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}
            >
              <Plus className="w-4 h-4" />
              Create Manual Order
            </button>
            
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="all">Payment Status</option>
              <option value="paid">Payment Received</option>
              <option value="pending">Payment Pending</option>
              <option value="refunded">Refunded</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="all">Payment Mode</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="COD">COD</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Wallet">Wallet</option>
            </select>

            <select
              value={shippingStatusFilter}
              onChange={(e) => setShippingStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="all">Shipping Status</option>
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Returned">Returned</option>
              <option value="Lost">Lost</option>
            </select>
            
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="all">Date Range</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last Week</option>
              <option value="lastmonth">Last Month</option>
              <option value="custom">Custom Range</option>
            </select>
            
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Clear Filters
            </button>
            
            <button
              onClick={exportOrders}
              className="px-4 py-2 rounded-lg text-white flex items-center gap-2 relative"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}
            >
              <Download className="w-4 h-4" />
              Export
              {filteredOrders.length > 0 && filteredOrders.length !== orders.length && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center">
                  {filteredOrders.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Date Range Picker */}
      {dateFilter === 'custom' && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">Custom Date Range</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
              <input
                type="date"
                value={customDateRange.start}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
              <input
                type="date"
                value={customDateRange.end}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setCustomDateRange({ start: '', end: '' });
                  setDateFilter('all');
                }}
                className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-white">
                {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={selectAllOrders}
                className="text-yellow-400 hover:text-yellow-300 text-sm"
              >
                {selectedOrders.length === filteredOrders.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Select Action</option>
                <option value="mark-processing">Mark as Processing</option>
                <option value="mark-shipped">Mark as Shipped</option>
                <option value="mark-delivered">Mark as Delivered</option>
                <option value="cancel">Cancel Orders</option>
              </select>
              <button
                onClick={handleBulkAction}
                className="px-4 py-2 rounded-lg text-white"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}
              >
                Apply Action
              </button>
              <button
                onClick={() => setSelectedOrders([])}
                className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              Orders {filteredOrders.length !== orders.length && (
                <span className="text-sm text-gray-400 ml-2">
                  (Showing {filteredOrders.length} of {orders.length})
                </span>
              )}
            </h3>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                {filteredOrders.length > 0 && filteredOrders.length !== orders.length 
                  ? `Will export ${filteredOrders.length} filtered orders`
                  : `Will export all ${orders.length} orders`
                }
              </span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={selectAllOrders}
                    className="w-4 h-4 text-yellow-400 border-gray-600 rounded bg-gray-700 focus:ring-yellow-400"
                  />
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Payment</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Payment Received</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Shipping Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-700/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleOrderSelection(order.id)}
                      className="w-4 h-4 text-yellow-400 border-gray-600 rounded bg-gray-700 focus:ring-yellow-400"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="text-white font-medium text-sm">{order.id}</p>
                    <p className="text-gray-400 text-xs">{order.items.length} items</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>
                      <p className="text-white font-medium text-sm">{order.customer.name}</p>
                      <p className="text-gray-400 text-xs">{order.customer.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="text-white text-sm">{order.date}</p>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <p className="text-yellow-400 font-semibold text-sm">₹{order.total.toLocaleString()}</p>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPaymentMethodColor(order.paymentMethod)}`}>
                        {getPaymentMethodIcon(order.paymentMethod)}
                        {order.paymentMethod}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                        className="text-xs px-2 py-1 bg-gray-700/50 border border-gray-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-yellow-400 w-full"
                      >
                        <option value="paid">Received</option>
                        <option value="pending">Not Received</option>
                        <option value="refunded">Refunded</option>
                        <option value="completed">Completed</option>
                      </select>
                      {getInitialPaymentStatus(order.paymentMethod) === order.paymentStatus && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                          Auto-set
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <select
                      value={order.shipping.status}
                      onChange={(e) => updateShippingStatus(order.id, e.target.value)}
                      className="text-xs px-2 py-1 bg-gray-700/50 border border-gray-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-yellow-400 w-full"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Returned">Returned</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1 text-blue-400 hover:text-blue-300"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Order Details</h3>
                <p className="text-gray-400">{selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Customer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Name</p>
                    <p className="text-white">{selectedOrder.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white">{selectedOrder.customer.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white">{selectedOrder.customer.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Shipping Address</p>
                    <p className="text-white">{selectedOrder.shipping.address}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-yellow-400 font-semibold">₹{item.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <div className="flex justify-between items-center">
                    <p className="text-white font-semibold">Total</p>
                    <p className="text-yellow-400 font-bold text-xl">₹{selectedOrder.total.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Shipping Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Shipping Method</p>
                    <p className="text-white">{selectedOrder.shipping.method}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Tracking Number</p>
                    <p className="text-white">{selectedOrder.shipping.tracking}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
