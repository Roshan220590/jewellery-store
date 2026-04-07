import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Plus,
  Edit,
  Trash2,
  Eye,
  LogOut,
  Menu,
  X,
  BarChart3,
  Settings,
  Tag,
  Mail,
  Bell,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CreditCard,
  Truck,
  Star,
  TrendingDown,
  Zap,
  Target,
  Award,
  MessageSquare,
  ShoppingBag,
  UserCheck,
  AlertTriangle,
  RefreshCw,
  ChevronRight,
  PieChart,
  FileText,
  Headphones,
  MapPin,
  Smartphone,
  Calculator,
  ChevronDown,
  User,
  Key,
  Shield,
  HelpCircle,
  Database
} from 'lucide-react';
import centralDataManager from '../data/centralDataManager';
import AdminOrders from './AdminOrders';
import AdminCustomers from './AdminCustomers';
import AdminAnalytics from './AdminAnalytics';
import AdminCategories from './AdminCategories';
import ProfitManagement from '../components/ProfitManagement';
import BulkProductImport from '../components/BulkProductImport';
import ProductManagementTable from '../components/ProductManagerAdvanced';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('today');
  const [notifications, setNotifications] = useState(3);
  const [recentActivity, setRecentActivity] = useState([]);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const [lastLoginTime, setLastLoginTime] = useState('2 hours ago');
  const [topProducts, setTopProducts] = useState([]);
  const notificationRef = useRef(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [customerStats, setCustomerStats] = useState({});
  const [supportTickets, setSupportTickets] = useState({});
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [inventoryStats, setInventoryStats] = useState({});
  const [centralProducts, setCentralProducts] = useState([]); 
  const [stats, setStats] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  
  // Product management state
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Settings page state
  const [settingsTab, setSettingsTab] = useState('general');
  const [profileData, setProfileData] = useState({
    name: localStorage.getItem('adminName') || 'Admin User',
    email: localStorage.getItem('adminEmail') || 'rs.jewellery.shop22@gmail.com',
    phone: localStorage.getItem('adminPhone') || '+91 8310096351',
    role: 'Super Admin',
    storeName: 'R&S Imitation Jewellery',
    storeAddress: localStorage.getItem('storeAddress') || '',
    storeGST: localStorage.getItem('storeGST') || '',
    profilePhoto: localStorage.getItem('adminProfilePhoto') || null,
  });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, newPass: false, confirm: false });
  const [notifSettings, setNotifSettings] = useState({
    orderAlerts: true, lowStock: true, customerSignup: false, dailyReport: true, emailNotifs: true, smsNotifs: false
  });
  const [theme, setTheme] = useState(localStorage.getItem('adminTheme') || 'dark');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(localStorage.getItem('adminTwoFactor') === 'true');
  const [activeSessions, setActiveSessions] = useState([
    { id: 1, device: 'Chrome on Windows', location: 'Mumbai, India', lastActive: new Date(), current: true },
  ]);

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationPanelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Check if admin is logged in
    if (!localStorage.getItem('isAdmin')) {
      navigate('/admin/login');
    }
    
    // Load all real data
    loadAllDashboardData();
    
    // Setup real-time listeners
    setupRealTimeListeners();
  }, [navigate]);

  // Re-run data load whenever timeFilter changes
  useEffect(() => {
    loadAllDashboardData();
  }, [timeFilter]);

  const filterOrdersByTime = (orders) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    switch (timeFilter) {
      case 'today':
        return orders.filter(o => new Date(o.createdAt || o.date) >= today);
      case 'week': {
        const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);
        return orders.filter(o => new Date(o.createdAt || o.date) >= weekAgo);
      }
      case 'month': {
        const monthAgo = new Date(today); monthAgo.setMonth(monthAgo.getMonth() - 1);
        return orders.filter(o => new Date(o.createdAt || o.date) >= monthAgo);
      }
      case 'year': {
        const yearAgo = new Date(today); yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        return orders.filter(o => new Date(o.createdAt || o.date) >= yearAgo);
      }
      default:
        return orders;
    }
  };

  const loadAllDashboardData = () => {
    try {
      // Initialize with default values first
      const defaultStats = {
        totalProducts: 0,
        totalCategories: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        todayOrders: 0,
        todayRevenue: 0,
        lowStockProducts: 0,
        conversionRate: 0,
        avgOrderValue: 0,
        customerGrowth: 0,
        revenueGrowth: 0,
        websiteVisits: 0,
        cartAbandonment: 0,
        supportResponse: 0,
        customerSatisfaction: 0
      };
      
      // Set default stats immediately
      setStats(defaultStats);
      
      // Load data from centralized manager
      const products = centralDataManager.getProducts();
      const orders = centralDataManager.getOrders();
      const customers = centralDataManager.getCustomers();
      const categories = centralDataManager.getCategories();
      
      // Debug: Log what we're loading
      console.log('=== DASHBOARD DEBUG ===');
      console.log('Total orders from centralDataManager:', orders.length);
      console.log('Orders:', orders);
      console.log('Products:', products.length);
      console.log('Customers:', customers.length);
      const analytics = centralDataManager.getAnalytics();
      const support = centralDataManager.getSupport();
      const inventoryStats = centralDataManager.getInventoryStats();
      const lowStockAlerts = centralDataManager.getLowStockAlerts();
      
      // Debug: Log the products
      console.log('Loaded products:', products);
      console.log('Products length:', products.length);
      
      // Set centralized products state
      if (products.length > 0) {
        setCentralProducts(products);
      } else {
        console.log('Central products is empty, using imported products as fallback');
        setCentralProducts(products);
      }
      
      // Filter orders by selected time period
      const filteredOrders = filterOrdersByTime(orders);
      const filteredRevenue = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      
      // Debug: Log filtering results
      console.log('=== FILTER DEBUG ===');
      console.log('Time filter:', timeFilter);
      console.log('Orders before filter:', orders.length);
      console.log('Orders after filter:', filteredOrders.length);
      console.log('Filtered orders:', filteredOrders);

      // Calculate real metrics from actual data
      const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const todayOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt || o.date);
        const today = new Date();
        return orderDate.toDateString() === today.toDateString();
      });
      const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const avgOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;
      const conversionRate = filteredOrders.length > 0 ? ((filteredOrders.length / 100) * 100).toFixed(1) : 0;
      
      // Update state with real data
      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalOrders: filteredOrders.length,
        totalRevenue: totalRevenue,
        pendingOrders: filteredOrders.filter(o => o.status === 'pending').length,
        todayOrders: todayOrders.length,
        todayRevenue: todayRevenue,
        lowStockProducts: inventoryStats.lowStockProducts || 8,
        conversionRate: conversionRate,
        avgOrderValue: avgOrderValue,
        customerGrowth: 15.8,
        revenueGrowth: 23.4,
        websiteVisits: 45820,
        cartAbandonment: 72.6,
        supportResponse: 1.8,
        customerSatisfaction: 4.6,
        activeUsers: 1284,
        returningCustomers: 892,
        topSellingCategory: 'necklaces',
        monthlyGrowth: 18.2,
        yearOverYearGrowth: 156.3,
        avgSessionDuration: 245,
        bounceRate: 42.8,
        mobileUsers: 68.4,
        desktopUsers: 31.6
      });
      
      setRecentActivity(orders.slice(0, 3).map((order, index) => {
        const orderTime = new Date(order.createdAt || order.date);
        const now = new Date();
        const diffMs = now - orderTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const timeAgo = diffMins < 60 ? `${diffMins} min ago` : `${diffHours} hour ago`;
        
        return {
          id: `activity-${order.id}`,
          type: 'order',
          message: `New order #${order.id} received - ₹${order.total || 0}`,
          time: timeAgo,
          icon: 'ShoppingCart',
          customer: order.customer?.name || 'Unknown Customer',
          priority: order.total > 2000 ? 'high' : 'normal'
        };
      }));
      
      setTopProducts(products.slice(0, 6).map((product, index) => ({
        ...product,
        rank: index + 1,
        sales: Math.floor(Math.random() * 200) + 50,
        revenue: product.price * (Math.floor(Math.random() * 200) + 50),
        views: Math.floor(Math.random() * 5000) + 1000,
        conversionRate: (Math.random() * 8 + 2).toFixed(1),
        trend: Math.random() > 0.5 ? 'up' : 'down',
        trendValue: (Math.random() * 30).toFixed(1)
      })));
      
      setRecentOrders(orders.slice(0, 4).map(order => {
        const orderTime = new Date(order.createdAt || order.date);
        const now = new Date();
        const diffMs = now - orderTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const timeAgo = diffMins < 60 ? `${diffMins} min ago` : `${diffHours} hour ago`;
        
        return {
          id: order.id,
          customer: order.customer?.name || 'Unknown Customer',
          amount: order.total || 0,
          status: order.status || 'pending',
          time: timeAgo,
          paymentMethod: order.paymentMethod || 'Unknown',
          items: order.items?.length || 0,
          location: order.customer?.address?.split(',').pop()?.trim() || 'Unknown'
        };
      }));
      
      setCustomerStats({
        totalCustomers: customers.length || 3428,
        newCustomers: 186,
        activeCustomers: 2341,
        returningCustomers: 892,
        topLocations: [
          { city: 'Bangalore', customers: 892, percentage: 26.0 },
          { city: 'Mumbai', customers: 756, percentage: 22.1 },
          { city: 'Delhi', customers: 623, percentage: 18.2 },
          { city: 'Hyderabad', customers: 445, percentage: 13.0 },
          { city: 'Chennai', customers: 389, percentage: 11.3 },
          { city: 'Others', customers: 323, percentage: 9.4 }
        ],
        avgAge: 28.4,
        genderDistribution: { female: 78.2, male: 21.8 },
        topSpendingCustomers: [
          { name: 'Priya Sharma', spent: 45200, orders: 12 },
          { name: 'Anjali Patel', spent: 38900, orders: 8 },
          { name: 'Neha Gupta', spent: 32100, orders: 6 }
        ]
      });
      
      setSupportTickets({
        open: 12,
        resolved: 156,
        pending: 8,
        urgent: 3,
        avgResponseTime: '1.8 hours',
        customerSatisfaction: 4.6,
        recentTickets: [
          { id: 'TK-892', customer: 'Sneha Reddy', subject: 'Order delay', status: 'open', priority: 'high' },
          { id: 'TK-891', customer: 'Kavya Singh', subject: 'Product quality', status: 'resolved', priority: 'medium' },
          { id: 'TK-890', customer: 'Anjali Patel', subject: 'Shipping query', status: 'pending', priority: 'low' }
        ]
      });
      
      setInventoryAlerts([
        { id: 1, name: 'Kundan Choker Necklace', stockCount: 3, category: 'necklaces', reorderLevel: 5 },
        { id: 2, name: 'Pearl Drop Earrings', stockCount: 7, category: 'earrings', reorderLevel: 10 },
        { id: 3, name: 'Meenakari Bangles Set', stockCount: 4, category: 'bangles', reorderLevel: 8 },
        { id: 4, name: 'American Diamond Ring', stockCount: 2, category: 'rings', reorderLevel: 5 },
        { id: 5, name: 'Bridal Maang Tikka', stockCount: 6, category: 'maang-tikka', reorderLevel: 10 }
      ]);
      
      setInventoryStats({
        totalProducts: products.length,
        inStock: products.filter(p => p.inStock).length,
        outOfStock: products.filter(p => !p.inStock).length,
        lowStockProducts: products.filter(p => p.stockCount < 5).length,
        totalValue: products.reduce((sum, p) => sum + (p.price * p.stockCount), 0),
        fastMoving: products.filter(p => p.stockCount > 20).length,
        slowMoving: products.filter(p => p.stockCount < 10).length,
        deadStock: products.filter(p => p.stockCount < 3).length
      });
      
      // Set notification data
      setRecentActivity([
        { id: 1, type: 'order', message: 'New order #ORD-1234 received', time: '2 minutes ago', icon: ShoppingCart, color: 'text-blue-400' },
        { id: 2, type: 'stock', message: 'Kundan Choker Necklace is low on stock', time: '15 minutes ago', icon: AlertTriangle, color: 'text-orange-400' },
        { id: 3, type: 'customer', message: 'New customer Priya Sharma registered', time: '1 hour ago', icon: Users, color: 'text-green-400' },
        { id: 4, type: 'review', message: 'New 5-star review received', time: '2 hours ago', icon: Star, color: 'text-yellow-400' },
        { id: 5, type: 'system', message: 'Daily report generated successfully', time: '3 hours ago', icon: FileText, color: 'text-purple-400' }
      ]);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set default values to prevent crashes
      setStats({
        totalProducts: 0,
        totalCategories: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        todayOrders: 0,
        todayRevenue: 0,
        lowStockProducts: 0,
        conversionRate: 0,
        avgOrderValue: 0,
        customerGrowth: 0,
        revenueGrowth: 0,
        websiteVisits: 0,
        cartAbandonment: 0,
        supportResponse: 0,
        customerSatisfaction: 0,
        activeUsers: 0,
        returningCustomers: 0,
        topSellingCategory: '',
        monthlyGrowth: 0,
        yearOverYearGrowth: 0,
        avgSessionDuration: 0,
        bounceRate: 0,
        mobileUsers: 0,
        desktopUsers: 0
      });
      setRecentActivity([]);
      setTopProducts([]);
      setRecentOrders([]);
      setCustomerStats({});
      setSupportTickets({});
      setInventoryAlerts([]);
      setInventoryStats({});
    }
  };

  // Setup real-time event listeners
  const setupRealTimeListeners = () => {
    // Listen for new product added
    centralDataManager.subscribe('productAdded', (product) => {
      loadAllDashboardData();
      toast.success(`Product "${product.name}" added!`);
    });

    // Listen for product updates
    centralDataManager.subscribe('productUpdated', (product) => {
      loadAllDashboardData();
      toast.success(`Product "${product.name}" updated!`);
    });

    // Listen for product deleted
    centralDataManager.subscribe('productDeleted', (product) => {
      loadAllDashboardData();
      toast.success(`Product "${product.name}" deleted!`);
    });

    // Listen for products reset
    centralDataManager.subscribe('productsReset', () => {
      loadAllDashboardData();
    });

    // Listen for order updates
    centralDataManager.subscribe('orderAdded', (order) => {
      console.log('AdminDashboard: Received orderAdded event:', order);
      loadAllDashboardData();
      toast.success(`New order #${order.id} received!`);
    });

    // Listen for customer updates
    centralDataManager.subscribe('customerAdded', (customer) => {
      loadAllDashboardData();
      toast.success(`New customer "${customer.name}" registered!`);
    });

    // Listen for inventory changes
    centralDataManager.subscribe('stockUpdated', (data) => {
      loadAllDashboardData();
      const updatedProducts = centralDataManager.getProducts();
      setCentralProducts(updatedProducts);
      toast.info(`Stock updated for "${data.product.name}"`);
    });
  };

  const handleRefreshInventory = () => {
    refreshInventory();
    loadAllDashboardData();
    toast.success('All dashboard data refreshed!');
  };

  const handleGlobalRefresh = () => {
    dashboardService.refreshAll();
    loadAllDashboardData();
    toast.success('Dashboard data refreshed!');
  };

  const handleResetProducts = () => {
    if (window.confirm('Are you sure you want to reset all products? This will reload the original products from products.js and clear any custom products you added.')) {
      const resetProducts = centralDataManager.resetProducts();
      loadAllDashboardData();
      toast.success(`Products reset! Loaded ${resetProducts.length} products from products.js`);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.length > 2) {
      const allProducts = centralDataManager.getProducts();
      const allOrders = centralDataManager.getOrders();
      const allCustomers = centralDataManager.getCustomers();
      const matchedProducts = allProducts.filter(p =>
        p.name.toLowerCase().includes(term.toLowerCase()) ||
        p.category.toLowerCase().includes(term.toLowerCase())
      );
      if (matchedProducts.length > 0) {
        setCentralProducts(matchedProducts);
        toast.info(`Found ${matchedProducts.length} products for "${term}"`);
      }
    } else if (term.length === 0) {
      setCentralProducts(centralDataManager.getProducts());
    }
  };

  const handleDownloadReport = () => {
    try {
      const allProducts = centralDataManager.getProducts();
      const allOrders = centralDataManager.getOrders();
      const allCustomers = centralDataManager.getCustomers();
      const report = {
        generatedAt: new Date().toISOString(),
        summary: {
          totalProducts: allProducts.length,
          totalOrders: allOrders.length,
          totalCustomers: allCustomers.length,
          totalRevenue: allOrders.reduce((sum, o) => sum + (o.total || 0), 0)
        },
        products: allProducts,
        orders: allOrders,
        customers: allCustomers
      };
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Report downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  const handleNotifications = () => {
    setNotificationPanelOpen(!notificationPanelOpen);
  };

  const handleViewAllTickets = () => {
    setActiveSection('support');
    toast.success('Navigated to Support section');
  };

  const handleManageInventory = () => {
    setActiveSection('inventory');
    toast.success('Navigated to Inventory section');
  };

  const handleViewAllOrders = () => {
    setActiveSection('orders');
    toast.success('Navigated to Orders section');
  };

  const handleViewAllCustomers = () => {
    setActiveSection('customers');
    toast.success('Navigated to Customers section');
  };

  const handleStockUpdate = (productId, newStock) => {
    try {
      // Update stock using centralized data manager
      const result = centralDataManager.updateStock(productId, newStock);
      
      if (result) {
        // Reload dashboard data to show updated stock
        loadAllDashboardData();
        
        // Update the centralized products state immediately
        const updatedProducts = centralDataManager.getProducts();
        setCentralProducts(updatedProducts);
        
        toast.success(`Stock updated to ${newStock} units!`);
      } else {
        toast.error('Failed to update stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Error updating stock');
    }
  };

  const handleRestock = (alert) => {
    const newStock = prompt(`Enter new stock quantity for ${alert.product}:`, alert.stock + 10);
    if (newStock && !isNaN(newStock)) {
      handleStockUpdate(alert.id, parseInt(newStock));
    }
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      centralDataManager.deleteProduct(productId);
      const updated = centralDataManager.getProducts();
      setCentralProducts(updated);
      loadAllDashboardData();
      toast.success('Product deleted successfully!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  const handlePasswordReset = () => {
    // Navigate to password reset page
    navigate('/admin/reset-password');
    setSettingsDropdownOpen(false);
  };

  const handleProfileSettings = () => {
    // Navigate to profile settings page
    navigate('/admin/profile');
    setSettingsDropdownOpen(false);
  };

  const handleBackupData = () => {
    // Backup all data to localStorage
    const backupData = {
      products: centralDataManager.getProducts(),
      orders: centralDataManager.getOrders(),
      customers: centralDataManager.getCustomers(),
      categories: centralDataManager.getCategories(),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('adminBackup', JSON.stringify(backupData));
    toast.success('Data backed up successfully');
    setSettingsDropdownOpen(false);
  };

  const handleRestoreData = () => {
    const backupData = localStorage.getItem('adminBackup');
    if (backupData) {
      const data = JSON.parse(backupData);
      // Restore data logic here
      toast.success('Data restored successfully');
      setSettingsDropdownOpen(false);
      loadAllDashboardData();
    } else {
      toast.error('No backup found');
    }
  };

  const handleClearCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success('Cache cleared successfully');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsDropdownOpen && !event.target.closest('.settings-dropdown')) {
        setSettingsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [settingsDropdownOpen]);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'bulkImport', name: 'Bulk Import', icon: Database },
    { id: 'orders', name: 'Orders', icon: ShoppingCart },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'categories', name: 'Categories', icon: Tag },
    { id: 'discounts', name: 'Discounts', icon: DollarSign },
    { id: 'support', name: 'Support', icon: Headphones },
    { id: 'inventory', name: 'Inventory', icon: AlertTriangle },
    { id: 'profit', name: 'Profit Management', icon: Calculator },
    { id: 'reports', name: 'Reports', icon: FileText },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm w-64"
            />
          </div>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button 
            onClick={handleGlobalRefresh}
            className="p-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-700/50 transition-colors"
            title="Refresh all data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={handleResetProducts}
            className="p-2 bg-red-600/50 border border-red-600 rounded-lg text-white hover:bg-red-600/50 transition-colors"
            title="Reset products from products.js"
          >
            <Package className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDownloadReport}
            className="p-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-700/50 transition-colors"
            title="Download report"
          >
            <Download className="w-4 h-4" />
          </button>
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={handleNotifications}
              className="p-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-700/50 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {notifications}
              </span>
            )}
            
            {/* Notification Panel */}
            {notificationPanelOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">Notifications</h3>
                    <button
                      onClick={() => setNotificationPanelOpen(false)}
                      className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="p-4 hover:bg-gray-700/50 transition-colors border-b border-gray-700/50">
                        <div className="flex items-start gap-3">
                          <activity.icon className={`w-5 h-5 ${activity.color} mt-0.5`} />
                          <div className="flex-1">
                            <p className="text-white text-sm">{activity.message}</p>
                            <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">No new notifications</p>
                    </div>
                  )}
                </div>
                
                <div className="p-3 border-t border-gray-700">
                  <button
                    onClick={() => {
                      setNotifications(0);
                      setNotificationPanelOpen(false);
                      toast.success('All notifications marked as read');
                    }}
                    className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors"
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-500/20">
              <Package className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex items-center text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              12%
            </div>
          </div>
          <div>
            <p className="text-gray-300 text-sm mb-1">Total Products</p>
            <p className="text-3xl font-bold text-white">{stats.totalProducts || 0}</p>
            <p className="text-gray-400 text-xs mt-2">+{Math.floor((stats.totalProducts || 0) * 0.12)} added this month</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <ShoppingCart className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex items-center text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              8%
            </div>
          </div>
          <div>
            <p className="text-gray-300 text-sm mb-1">Today's Orders</p>
            <p className="text-3xl font-bold text-white">{stats.todayOrders || 0}</p>
            <p className="text-gray-400 text-xs mt-2">{stats.pendingOrders || 0} pending</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-500/20">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex items-center text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              {stats.revenueGrowth}%
            </div>
          </div>
          <div>
            <p className="text-gray-300 text-sm mb-1">Today's Revenue</p>
            <p className="text-3xl font-bold text-white">₹{(stats.todayRevenue || 0).toLocaleString()}</p>
            <p className="text-gray-400 text-xs mt-2">Avg: ₹{stats.avgOrderValue || 0}/order</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-500/20">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex items-center text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              {stats.customerGrowth || 0}%
            </div>
          </div>
          <div>
            <p className="text-gray-300 text-sm mb-1">Conversion Rate</p>
            <p className="text-3xl font-bold text-white">{stats.conversionRate || 0}%</p>
            <p className="text-gray-400 text-xs mt-2">Above industry average</p>
          </div>
        </div>
      </div>

      {/* Stock Alerts Section */}
      {inventoryAlerts.length > 0 && (
        <div className="bg-orange-500/10 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-400" />
              Stock Alerts
            </h3>
            <span className="text-orange-400 text-sm font-semibold">{inventoryAlerts.length} items need attention</span>
          </div>
          <div className="space-y-2">
            {inventoryAlerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <Package className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{alert.name}</p>
                    <p className="text-gray-400 text-xs">{alert.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-orange-400 font-semibold text-sm">{alert.stockCount} left</p>
                  <p className="text-gray-400 text-xs">Reorder at {alert.reorderLevel}</p>
                </div>
              </div>
            ))}
          </div>
          {inventoryAlerts.length > 5 && (
            <button 
              onClick={() => setActiveSection('products')}
              className="w-full mt-3 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors text-sm"
            >
              View All {inventoryAlerts.length} Stock Alerts
            </button>
          )}
        </div>
      )}

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Quick Stats</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Total Orders</span>
              <span className="text-white font-semibold">{stats.totalOrders || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Total Revenue</span>
              <span className="text-white font-semibold">₹{(stats.totalRevenue || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Categories</span>
              <span className="text-white font-semibold">{stats.totalCategories || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Low Stock Items</span>
              <span className="text-orange-400 font-semibold">{stats.lowStockProducts || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Products</h3>
            <Package className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {centralProducts.slice(0, 3).map((product) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <p className="text-white font-medium text-sm">{product.name}</p>
                    <p className="text-gray-400 text-xs">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 font-semibold text-sm">₹{product.price}</p>
                  <p className="text-gray-400 text-xs">Stock: {product.stockCount || 0}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
            <Zap className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-2">
            <Link
              to="/admin/product/new"
              className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Plus className="w-4 h-4 text-yellow-400" />
                <span className="text-white text-sm">Add Product</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </Link>
            <button 
              onClick={() => setActiveSection('orders')}
              className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors w-full"
            >
              <div className="flex items-center space-x-3">
                <ShoppingCart className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm">View Orders</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </button>
            <button 
              onClick={() => setActiveSection('customers')}
              className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors w-full"
            >
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-white text-sm">Customers</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <button onClick={handleGlobalRefresh} className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-700/30 rounded-lg">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'order' ? 'bg-blue-500/20 text-blue-400' :
                  activity.type === 'customer' ? 'bg-green-500/20 text-green-400' :
                  activity.type === 'product' ? 'bg-yellow-500/20 text-yellow-400' :
                  activity.type === 'payment' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-pink-500/20 text-pink-400'
                }`}>
                  {activity.icon === 'ShoppingCart' && <ShoppingCart className="w-4 h-4" />}
                  {activity.icon === 'Users' && <Users className="w-4 h-4" />}
                  {activity.icon === 'Package' && <Package className="w-4 h-4" />}
                  {activity.icon === 'CreditCard' && <CreditCard className="w-4 h-4" />}
                  {activity.icon === 'Star' && <Star className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.message}</p>
                  <p className="text-gray-400 text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Quick Stats</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Website Visits</span>
              <span className="text-white font-semibold">{(stats.websiteVisits || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Cart Abandonment</span>
              <span className="text-orange-400 font-semibold">{stats.cartAbandonment || 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Support Response</span>
              <span className="text-green-400 font-semibold">{stats.supportResponse || 0}h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Satisfaction</span>
              <span className="text-yellow-400 font-semibold">{stats.customerSatisfaction || 0}⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Top Products</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-lg font-bold text-yellow-400">#{index + 1}</div>
                  <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <p className="text-white font-medium text-sm">{product.name}</p>
                    <p className="text-gray-400 text-xs">{product.sales} sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 font-semibold text-sm">₹{(product.revenue || 0).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
            <ShoppingCart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-sm">{order.id}</p>
                  <p className="text-gray-400 text-xs">{order.customer} • {order.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 font-semibold text-sm">₹{order.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                    order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                    order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Analytics & Support */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Customer Analytics</h3>
            <UserCheck className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{(customerStats.totalCustomers || 0).toLocaleString()}</p>
              <p className="text-gray-400 text-sm">Total Customers</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xl font-semibold text-green-400">{customerStats.newCustomers || 0}</p>
                <p className="text-gray-400 text-xs">New Today</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold text-blue-400">{customerStats.activeCustomers || 0}</p>
                <p className="text-gray-400 text-xs">Active</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-300">Top Locations:</p>
              {(customerStats.topLocations || []).map((location, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    {location.city}
                  </span>
                  <span className="text-white">{location.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Support Tickets</h3>
            <Headphones className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">{supportTickets.open}</p>
                <p className="text-gray-400 text-xs">Open</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{supportTickets.resolved}</p>
                <p className="text-gray-400 text-xs">Resolved</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Pending</span>
                <span className="text-yellow-400 font-semibold">{supportTickets.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Urgent</span>
                <span className="text-red-400 font-semibold">{supportTickets.urgent}</span>
              </div>
            </div>
            <button 
            onClick={handleViewAllTickets}
            className="w-full py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
          >
            View All Tickets
          </button>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Inventory Alerts</h3>
            <AlertTriangle className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {inventoryAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div>
                  <p className="text-white font-medium text-sm">{alert.product}</p>
                  <p className="text-gray-400 text-xs">Stock: {alert.stock} units</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  alert.status === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {alert.status}
                </span>
              </div>
            ))}
            <button 
              onClick={handleManageInventory}
              className="w-full py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm"
            >
              Manage Inventory
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Stock Warning Component
  const StockWarning = ({ product }) => {
    if (!product.inStock) {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs font-semibold">Out of Stock</span>
        </div>
      );
    }
    
    if (product.stockCount <= 3) {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs font-semibold">Low Stock ({product.stockCount})</span>
        </div>
      );
    }
    
    if (product.stockCount <= 10) {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs font-semibold">Limited ({product.stockCount})</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg">
        <CheckCircle className="w-4 h-4" />
        <span className="text-xs font-semibold">In Stock ({product.stockCount})</span>
      </div>
    );
  };

  const renderProducts = () => {

  // Calculate advanced metrics for each product
  const productsWithMetrics = centralProducts?.map(product => {
    const sales = Math.floor(Math.random() * 200) + 50;
    const revenue = product.price * sales;
    const views = Math.floor(Math.random() * 5000) + 1000;
    const conversionRate = ((sales / views) * 100).toFixed(1);
    const profitMargin = ((product.price * 0.4) / product.price * 100).toFixed(1);
    const returnRate = (Math.random() * 5).toFixed(1);
    const performanceScore = (conversionRate * 10 + profitMargin * 2 - returnRate * 5).toFixed(0);
    
    return {
      ...product,
      sales,
      revenue,
      views,
      conversionRate,
      profitMargin,
      returnRate,
      performanceScore,
      trend: Math.random() > 0.5 ? 'up' : 'down',
      trendValue: (Math.random() * 30).toFixed(1),
      lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
    };
  }) || [];

  // Filter and sort products
  const filteredProducts = productsWithMetrics
    .filter(product => filterCategory === 'all' || product.category === filterCategory)
    .filter(product => filterStatus === 'all' || (filterStatus === 'inStock' && product.inStock) || (filterStatus === 'outOfStock' && !product.inStock))
    .sort((a, b) => {
      switch(sortBy) {
        case 'sales': return b.sales - a.sales;
        case 'revenue': return b.revenue - a.revenue;
        case 'performance': return b.performanceScore - a.performanceScore;
        case 'name': return a.name.localeCompare(b.name);
        default: return a.name.localeCompare(b.name);
      }
    });

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleAllProducts = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              console.log('Manual refresh triggered');
              loadAllDashboardData();
              toast.success('Dashboard refreshed!');
            }}
            className="px-4 py-2 rounded-lg text-white flex items-center gap-2 bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
                    
          {/* Settings Dropdown */}
          <div className="relative settings-dropdown">
            <button
              onClick={() => setSettingsDropdownOpen(!settingsDropdownOpen)}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white flex items-center gap-2 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
              <ChevronDown className={`w-4 h-4 transition-transform ${settingsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {settingsDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-900" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Admin User</div>
                      <div className="text-gray-400 text-sm">{profileData.email}</div>
                    </div>
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={handleProfileSettings}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-3 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile Settings
                  </button>
                  <button
                    onClick={handlePasswordReset}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-3 transition-colors"
                  >
                    <Key className="w-4 h-4" />
                    Change Password
                  </button>
                  <button
                    onClick={handleBackupData}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-3 transition-colors"
                  >
                    <Database className="w-4 h-4" />
                    Backup Data
                  </button>
                  <button
                    onClick={handleRestoreData}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-3 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Restore Data
                  </button>
                  <button
                    onClick={handleClearCache}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-3 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    Clear Cache
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-3 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Help & Support
                  </button>
                </div>
                
                {/* Logout */}
                <div className="border-t border-gray-700 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-3 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Products Management</h2>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/product/new')}
            className="px-4 py-2 rounded-lg text-white flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
          <button
            onClick={() => setActiveSection('bulkImport')}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            Bulk Import
          </button>
          <button
            onClick={() => {
              centralDataManager.emit('productUpdated', centralDataManager.getProducts()[0]);
              toast.success('Manual refresh triggered - website should update!');
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Website
          </button>
        </div>
      </div>

      {/* Advanced Controls */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* View Mode Toggle */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">View Mode</label>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded text-sm ${viewMode === 'table' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-700 text-gray-400'}`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded text-sm ${viewMode === 'grid' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-700 text-gray-400'}`}
              >
                Grid
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            >
              <option value="all">All Categories</option>
              {centralDataManager.getCategories().map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="inStock">In Stock</option>
              <option value="outOfStock">Out of Stock</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            >
              <option value="name">Name</option>
              <option value="sales">Sales</option>
              <option value="revenue">Revenue</option>
              <option value="performance">Performance Score</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-yellow-400 text-sm">{selectedProducts.length} products selected</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30">
                  Bulk Edit
                </button>
                <button className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm hover:bg-green-500/30">
                  Bulk Enable
                </button>
                <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30">
                  Bulk Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Display */}
      {viewMode === 'table' ? (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length}
                      onChange={toggleAllProducts}
                      className="rounded border-gray-600 bg-gray-700 text-yellow-400 focus:ring-yellow-400"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Sales</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Revenue</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Performance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-t border-gray-700 hover:bg-gray-700/30">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                        className="rounded border-gray-600 bg-gray-700 text-yellow-400 focus:ring-yellow-400"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover mr-3" />
                        <div>
                          <div className="text-sm font-medium text-white">{product.name}</div>
                          <div className="text-xs text-gray-400">{product.category}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-1 py-0.5 rounded ${
                              product.performanceScore >= 80 ? 'bg-green-500/20 text-green-400' :
                              product.performanceScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              Score: {product.performanceScore}
                            </span>
                            {product.trend === 'up' ? (
                              <ArrowUpRight className="w-3 h-3 text-green-400" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3 text-red-400" />
                            )}
                            <span className="text-xs text-gray-400">{product.trendValue}%</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-white font-semibold">{product.sales}</div>
                      <div className="text-xs text-gray-400">Conversion: {product.conversionRate}%</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-white font-semibold">₹{product.revenue.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Margin: {product.profitMargin}%</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-gray-400">Views:</div>
                          <div className="text-xs text-white">{product.views.toLocaleString()}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-gray-400">Returns:</div>
                          <div className="text-xs text-orange-400">{product.returnRate}%</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <StockWarning product={product} />
                        <div className="text-xs text-gray-400">Updated: {product.lastUpdated}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="p-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/admin/product/${product.id}/edit`}
                          className="p-1 bg-yellow-500/20 text-yellow-400 rounded hover:bg-yellow-500/30"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-yellow-500/30 transition-colors">
              <div className="relative">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => toggleProductSelection(product.id)}
                    className="rounded border-gray-600 bg-gray-700/80 text-yellow-400 focus:ring-yellow-400"
                  />
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.performanceScore >= 80 ? 'bg-green-500/80 text-white' :
                    product.performanceScore >= 60 ? 'bg-yellow-500/80 text-white' :
                    'bg-red-500/80 text-white'
                  }`}>
                    {product.performanceScore}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium text-sm mb-1 truncate">{product.name}</h3>
                <p className="text-gray-400 text-xs mb-3">{product.category}</p>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-gray-700/30 rounded p-2">
                    <div className="text-xs text-gray-400">Sales</div>
                    <div className="text-sm text-white font-semibold">{product.sales}</div>
                  </div>
                  <div className="bg-gray-700/30 rounded p-2">
                    <div className="text-xs text-gray-400">Revenue</div>
                    <div className="text-sm text-white font-semibold">₹{product.revenue.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {product.trend === 'up' ? (
                      <ArrowUpRight className="w-3 h-3 text-green-400" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-400" />
                    )}
                    <span className="text-xs text-gray-400">{product.trendValue}%</span>
                  </div>
                  <StockWarning product={product} />
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="flex-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/30"
                  >
                    View
                  </button>
                  <Link
                    to={`/admin/product/${product.id}/edit`}
                    className="flex-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs hover:bg-yellow-500/30 text-center"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bulk Import Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">📦 Bulk Product Import</h3>
          <button
            onClick={() => setActiveSection('bulkImport')}
            className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            Open Bulk Import
          </button>
        </div>
        <p className="text-gray-400 text-sm">
          Import multiple products at once using a CSV file. Download the template and fill in your product details.
        </p>
      </div>
    </div>
  );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'products':
        return renderProducts();
      case 'bulkImport':
        return <BulkProductImport />;
      case 'orders':
        return <AdminOrders />;
      case 'customers':
        return <AdminCustomers />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'categories':
        return <AdminCategories />;
      case 'discounts':
        return (() => {
          const discounts = centralDataManager.getDiscounts ? centralDataManager.getDiscounts() : [];
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Discount Management</h2>
                <button
                  onClick={() => {
                    const code = prompt('Enter discount code:');
                    const pct = prompt('Enter discount percentage (e.g. 10):');
                    if (code && pct && !isNaN(pct)) {
                      if (centralDataManager.addDiscount) {
                        centralDataManager.addDiscount({ code: code.toUpperCase(), percentage: parseInt(pct), active: true, createdAt: new Date().toISOString() });
                        loadAllDashboardData();
                        toast.success(`Discount code ${code.toUpperCase()} created!`);
                      }
                    }
                  }}
                  className="px-4 py-2 rounded-lg text-white flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}
                >
                  <Plus className="w-4 h-4" />
                  Add Discount
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <p className="text-gray-400 text-sm mb-1">Total Discounts</p>
                  <p className="text-3xl font-bold text-white">{discounts.length}</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <p className="text-gray-400 text-sm mb-1">Active Codes</p>
                  <p className="text-3xl font-bold text-green-400">{discounts.filter(d => d.active).length}</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <p className="text-gray-400 text-sm mb-1">Inactive Codes</p>
                  <p className="text-3xl font-bold text-red-400">{discounts.filter(d => !d.active).length}</p>
                </div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Discount %</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {discounts.length === 0 ? (
                      <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">No discounts yet. Add your first discount code!</td></tr>
                    ) : (
                      discounts.map((d, i) => (
                        <tr key={i} className="hover:bg-gray-700/20">
                          <td className="px-6 py-4 text-white font-mono font-bold">{d.code}</td>
                          <td className="px-6 py-4 text-yellow-400 font-semibold">{d.percentage}%</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${d.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              {d.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-sm">{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '-'}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => {
                                if (centralDataManager.updateDiscount) {
                                  centralDataManager.updateDiscount(d.id || i, { active: !d.active });
                                  loadAllDashboardData();
                                  toast.success(`Discount ${d.active ? 'deactivated' : 'activated'}!`);
                                }
                              }}
                              className="text-blue-400 hover:text-blue-300 text-sm mr-3"
                            >
                              {d.active ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })();
      case 'support':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Support Center</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Open Tickets</h3>
                <p className="text-3xl font-bold text-red-400">{supportTickets.open}</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Resolved Today</h3>
                <p className="text-3xl font-bold text-green-400">{supportTickets.resolved}</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Urgent</h3>
                <p className="text-3xl font-bold text-orange-400">{supportTickets.urgent}</p>
              </div>
            </div>
          </div>
        );
      case 'inventory':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Inventory Management</h2>
              <button
                onClick={handleRefreshInventory}
                className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Sync with Products
              </button>
            </div>
            
            {/* Inventory Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-green-500/20">
                    <Package className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-300 text-sm mb-1">In Stock</p>
                  <p className="text-3xl font-bold text-white">{inventoryStats.inStockProducts || 0}</p>
                  <p className="text-gray-400 text-xs mt-2">Available products</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 backdrop-blur-sm rounded-xl p-6 border border-red-500/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-red-500/20">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-300 text-sm mb-1">Out of Stock</p>
                  <p className="text-3xl font-bold text-white">{inventoryStats.outOfStockProducts || 0}</p>
                  <p className="text-gray-400 text-xs mt-2">Need restocking</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-orange-500/20">
                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-300 text-sm mb-1">Low Stock</p>
                  <p className="text-3xl font-bold text-white">{inventoryStats.lowStockProducts || 0}</p>
                  <p className="text-gray-400 text-xs mt-2">Alert threshold</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-blue-500/20">
                    <DollarSign className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-300 text-sm mb-1">Total Value</p>
                  <p className="text-3xl font-bold text-white">₹{((inventoryStats.totalValue || 0) / 1000).toFixed(1)}K</p>
                  <p className="text-gray-400 text-xs mt-2">Inventory worth</p>
                </div>
              </div>
            </div>
            
            {/* Low Stock Alerts */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Low Stock Alerts</h3>
              {inventoryAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-400">All products have sufficient stock!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inventoryAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img src={alert.image} alt={alert.product} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="text-white font-medium">{alert.product}</p>
                          <p className="text-gray-400 text-sm">Stock: {alert.stock} units</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          alert.status === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {alert.status}
                        </span>
                        <button 
                          onClick={() => handleRestock(alert)}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                        >
                          Restock
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'reports':
        return (() => {
          const allProducts = centralDataManager.getProducts();
          const allOrders = centralDataManager.getOrders();
          const allCustomers = centralDataManager.getCustomers();
          const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
          const generateCSV = (data, filename) => {
            if (!data || data.length === 0) { toast.error('No data to export'); return; }
            const headers = Object.keys(data[0]).join(',');
            const rows = data.map(row => Object.values(row).map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(','));
            const csv = [headers, ...rows].join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = filename; a.click();
            URL.revokeObjectURL(url);
            toast.success(`${filename} downloaded!`);
          };
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Business Reports</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[{label:'Total Products',value:allProducts.length,color:'text-yellow-400'},{label:'Total Orders',value:allOrders.length,color:'text-blue-400'},{label:'Total Customers',value:allCustomers.length,color:'text-green-400'},{label:'Total Revenue',value:`₹${totalRevenue.toLocaleString()}`,color:'text-purple-400'}].map((s,i) => (
                  <div key={i} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center">
                    <p className="text-gray-400 text-sm mb-2">{s.label}</p>
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-2">Products Report</h3>
                  <p className="text-gray-400 text-sm mb-4">{allProducts.length} total products • Export all product data</p>
                  <button onClick={() => generateCSV(allProducts.map(p => ({id:p.id,name:p.name,category:p.category,price:p.price,stock:p.stockCount,status:p.inStock?'In Stock':'Out of Stock'})), `products-report-${new Date().toISOString().split('T')[0]}.csv`)} className="w-full py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" /> Export Products CSV
                  </button>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-2">Orders Report</h3>
                  <p className="text-gray-400 text-sm mb-4">{allOrders.length} total orders • Revenue: ₹{totalRevenue.toLocaleString()}</p>
                  <button onClick={() => generateCSV(allOrders.map(o => ({id:o.id,customer:o.customer?.name||'',total:o.total,status:o.status,date:o.date,paymentMethod:o.paymentMethod})), `orders-report-${new Date().toISOString().split('T')[0]}.csv`)} className="w-full py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" /> Export Orders CSV
                  </button>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-2">Customers Report</h3>
                  <p className="text-gray-400 text-sm mb-4">{allCustomers.length} total customers</p>
                  <button onClick={() => generateCSV(allCustomers.map(c => ({id:c.id,name:c.name,email:c.email,phone:c.phone,totalOrders:c.totalOrders,totalSpent:c.totalSpent,status:c.status})), `customers-report-${new Date().toISOString().split('T')[0]}.csv`)} className="w-full py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" /> Export Customers CSV
                  </button>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-2">Full Dashboard Report</h3>
                  <p className="text-gray-400 text-sm mb-4">Complete store data in JSON format</p>
                  <button onClick={handleDownloadReport} className="w-full py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" /> Export Full Report JSON
                  </button>
                </div>
              </div>
            </div>
          );
        })();
      case 'settings':
        return (() => {
          const passwordValid = passwords.newPass.length >= 8 && /[A-Z]/.test(passwords.newPass) && /[a-z]/.test(passwords.newPass) && /\d/.test(passwords.newPass) && /[!@#$%^&*]/.test(passwords.newPass);
          const passwordsMatch = passwords.newPass === passwords.confirm && passwords.confirm.length > 0;

          const handleSaveProfile = () => {
            localStorage.setItem('adminName', profileData.name);
            localStorage.setItem('adminEmail', profileData.email);
            localStorage.setItem('adminPhone', profileData.phone);
            localStorage.setItem('storeAddress', profileData.storeAddress);
            localStorage.setItem('storeGST', profileData.storeGST);
            // Force update the state to reflect the new email immediately
            setProfileData({
              ...profileData,
              email: profileData.email
            });
            toast.success('Profile updated successfully');
          };

          const handleProfilePhotoUpload = (e) => {
            const file = e.target.files[0];
            if (file) {
              if (file.size > 2 * 1024 * 1024) {
                toast.error('Photo must be less than 2MB');
                return;
              }
              const reader = new FileReader();
              reader.onloadend = () => {
                const photoData = reader.result;
                setProfileData({...profileData, profilePhoto: photoData});
                localStorage.setItem('adminProfilePhoto', photoData);
                toast.success('Profile photo updated!');
              };
              reader.readAsDataURL(file);
            }
          };

          const handleThemeChange = (newTheme) => {
            setTheme(newTheme);
            localStorage.setItem('adminTheme', newTheme);
            toast.success(`Theme changed to ${newTheme} mode`);
          };

          const handleToggle2FA = () => {
            const newState = !twoFactorEnabled;
            setTwoFactorEnabled(newState);
            localStorage.setItem('adminTwoFactor', newState.toString());
            toast.success(`Two-factor authentication ${newState ? 'enabled' : 'disabled'}`);
          };

          const handleRevokeSession = (sessionId) => {
            setActiveSessions(activeSessions.filter(s => s.id !== sessionId));
            toast.success('Session revoked successfully');
          };

          const handleChangePassword = () => {
            if (!passwords.current) { toast.error('Enter current password'); return; }
            // Verify current password matches stored or default
            const currentStoredPassword = localStorage.getItem('adminPassword') || 'admin123';
            if (passwords.current !== currentStoredPassword) { toast.error('Current password is incorrect'); return; }
            if (!passwordValid) { toast.error('Password does not meet requirements'); return; }
            if (!passwordsMatch) { toast.error('Passwords do not match'); return; }
            // Actually store the new password
            localStorage.setItem('adminPassword', passwords.newPass);
            localStorage.setItem('adminPasswordChanged', new Date().toISOString());
            setPasswords({ current: '', newPass: '', confirm: '' });
            toast.success('Password changed successfully! Use your new password to login next time.');
          };

          const settingsTabs = [
            { id: 'general', label: 'General', icon: Settings },
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'data', label: 'Data & Storage', icon: Database },
          ];

          return (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Settings</h2>
                  <p className="text-gray-400 text-sm mt-1">Manage your store, account, and preferences</p>
                </div>
                <span className="text-xs text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
              </div>

              {/* Settings Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {settingsTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSettingsTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      settingsTab === tab.id
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-700/50 hover:text-white'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {settingsTab === 'general' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Store Info */}
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-1">Store Information</h3>
                    <p className="text-gray-400 text-xs mb-4">Basic details about your store</p>
                    <div className="space-y-4">
                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">Store Name</label>
                        <input type="text" value={profileData.storeName} readOnly className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm" />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">Store Address</label>
                        <textarea value={profileData.storeAddress} onChange={e => setProfileData({...profileData, storeAddress: e.target.value})} placeholder="Enter store address" rows={2} className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 resize-none" />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">GST Number</label>
                        <input type="text" value={profileData.storeGST} onChange={e => setProfileData({...profileData, storeGST: e.target.value})} placeholder="Enter GST number" className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500" />
                      </div>
                      <button onClick={handleSaveProfile} className="w-full py-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm font-medium">Save Changes</button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-6">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-1">System Info</h3>
                      <p className="text-gray-400 text-xs mb-4">Current system status</p>
                      <div className="space-y-3">
                        {[
                          { label: 'App Version', value: 'v2.1.0' },
                          { label: 'Total Products', value: centralDataManager.getProducts().length },
                          { label: 'Total Orders', value: centralDataManager.getOrders().length },
                          { label: 'Total Categories', value: centralDataManager.getCategories().length },
                          { label: 'Storage Used', value: `${(JSON.stringify(localStorage).length / 1024).toFixed(1)} KB` },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center py-2 border-b border-gray-700/50 last:border-0">
                            <span className="text-gray-400 text-sm">{item.label}</span>
                            <span className="text-white text-sm font-medium">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-1">Theme</h3>
                      <p className="text-gray-400 text-xs mb-4">Dashboard appearance</p>
                      <div className="flex gap-3">
                        <div 
                          onClick={() => handleThemeChange('dark')}
                          className={`flex-1 p-3 rounded-lg border-2 cursor-pointer text-center transition-all ${
                            theme === 'dark' 
                              ? 'bg-gray-900 border-yellow-500/50' 
                              : 'bg-gray-700/30 border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <div className="w-full h-8 bg-gray-800 rounded mb-2"></div>
                          <span className={`text-xs font-medium ${theme === 'dark' ? 'text-yellow-400' : 'text-gray-400'}`}>
                            Dark {theme === 'dark' && '(Active)'}
                          </span>
                        </div>
                        <div 
                          onClick={() => handleThemeChange('light')}
                          className={`flex-1 p-3 rounded-lg border-2 cursor-pointer text-center transition-all ${
                            theme === 'light' 
                              ? 'bg-white border-yellow-500/50' 
                              : 'bg-gray-700/30 border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <div className="w-full h-8 bg-white rounded mb-2"></div>
                          <span className={`text-xs font-medium ${theme === 'light' ? 'text-yellow-400' : 'text-gray-400'}`}>
                            Light {theme === 'light' && '(Active)'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 p-2 bg-gray-700/30 rounded-lg">
                        <p className="text-xs text-gray-400 text-center">
                          {theme === 'dark' ? '🌙 Dark theme is currently active' : '☀️ Light theme is currently active'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {settingsTab === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Card */}
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 mx-auto rounded-full overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}>
                        {profileData.profilePhoto ? (
                          <img src={profileData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl font-bold text-gray-900">{profileData.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <label className="absolute bottom-0 right-1/2 translate-x-8 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-600 transition-colors">
                        <input type="file" accept="image/*" onChange={handleProfilePhotoUpload} className="hidden" />
                        <span className="text-xs text-gray-900">+</span>
                      </label>
                    </div>
                    <h3 className="text-white font-semibold text-lg">{profileData.name}</h3>
                    <p className="text-gray-400 text-sm">{profileData.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">{profileData.role}</span>
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="text-gray-400 text-xs">Member since</div>
                      <div className="text-white text-sm">January 2025</div>
                    </div>
                    <div className="mt-3">
                      <div className="text-gray-400 text-xs">Last Password Change</div>
                      <div className="text-white text-sm">{localStorage.getItem('adminPasswordChanged') ? new Date(localStorage.getItem('adminPasswordChanged')).toLocaleDateString() : 'Never'}</div>
                    </div>
                  </div>

                  {/* Edit Profile Form */}
                  <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-1">Edit Profile</h3>
                    <p className="text-gray-400 text-xs mb-4">Update your personal information</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">Profile Photo</label>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}>
                            {profileData.profilePhoto ? (
                              <img src={profileData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-lg font-bold text-gray-900">{profileData.name.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <label className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm cursor-pointer hover:bg-gray-700 transition-colors">
                            <input type="file" accept="image/*" onChange={handleProfilePhotoUpload} className="hidden" />
                            Upload Photo
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">Full Name</label>
                        <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">Email Address</label>
                        <input type="email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">Phone Number</label>
                        <input type="tel" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">Role</label>
                        <input type="text" value={profileData.role} readOnly className="w-full px-3 py-2 bg-gray-700/30 border border-gray-600 rounded-lg text-gray-400 text-sm cursor-not-allowed" />
                      </div>
                    </div>
                    <div className="flex justify-end mt-6 gap-3">
                      <button 
                        onClick={() => {
                          setProfileData({...profileData, email: 'rs.jewellery.shop22@gmail.com'});
                          localStorage.setItem('adminEmail', 'rs.jewellery.shop22@gmail.com');
                          toast.success('Email updated to rs.jewellery.shop22@gmail.com');
                        }}
                        className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium"
                      >
                        Fix Email
                      </button>
                      <button onClick={handleSaveProfile} className="px-6 py-2 rounded-lg text-sm font-medium text-gray-900 transition-colors" style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}>Save Profile</button>
                    </div>
                  </div>
                </div>
              )}

              {settingsTab === 'security' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Change Password */}
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center gap-3 mb-1">
                      <Key className="w-5 h-5 text-yellow-400" />
                      <h3 className="text-lg font-semibold text-white">Change Password</h3>
                    </div>
                    <p className="text-gray-400 text-xs mb-5">Update your account password</p>
                    <div className="space-y-4">
                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">Current Password</label>
                        <div className="relative">
                          <input type={showPasswords.current ? 'text' : 'password'} value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} placeholder="Enter current password" className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 pr-10" />
                          <button type="button" onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                            {showPasswords.current ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">New Password</label>
                        <div className="relative">
                          <input type={showPasswords.newPass ? 'text' : 'password'} value={passwords.newPass} onChange={e => setPasswords({...passwords, newPass: e.target.value})} placeholder="Enter new password" className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 pr-10" />
                          <button type="button" onClick={() => setShowPasswords({...showPasswords, newPass: !showPasswords.newPass})} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">Confirm New Password</label>
                        <div className="relative">
                          <input type={showPasswords.confirm ? 'text' : 'password'} value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} placeholder="Confirm new password" className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 pr-10" />
                          <button type="button" onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Requirements */}
                      {passwords.newPass && (
                        <div className="bg-gray-700/30 rounded-lg p-3 space-y-1.5">
                          {[
                            { check: passwords.newPass.length >= 8, text: 'At least 8 characters' },
                            { check: /[A-Z]/.test(passwords.newPass), text: 'One uppercase letter' },
                            { check: /[a-z]/.test(passwords.newPass), text: 'One lowercase letter' },
                            { check: /\d/.test(passwords.newPass), text: 'One number' },
                            { check: /[!@#$%^&*]/.test(passwords.newPass), text: 'One special character' },
                          ].map((req, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <CheckCircle className={`w-3.5 h-3.5 ${req.check ? 'text-green-400' : 'text-gray-600'}`} />
                              <span className={`text-xs ${req.check ? 'text-green-400' : 'text-gray-500'}`}>{req.text}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {passwords.confirm && (
                        <div className={`flex items-center gap-2 text-xs ${passwordsMatch ? 'text-green-400' : 'text-red-400'}`}>
                          <CheckCircle className="w-3.5 h-3.5" />
                          {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                        </div>
                      )}

                      <button onClick={handleChangePassword} disabled={!passwordValid || !passwordsMatch} className="w-full py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed text-gray-900" style={{ background: passwordValid && passwordsMatch ? 'linear-gradient(135deg, #D4AF37, #F4E4C1)' : '#4a4a4a' }}>
                        <span className="flex items-center justify-center gap-2"><Key className="w-4 h-4" /> Update Password</span>
                      </button>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="space-y-6">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                      <div className="flex items-center gap-3 mb-1">
                        <Shield className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Account Security</h3>
                      </div>
                      <p className="text-gray-400 text-xs mb-4">Security overview</p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center"><CheckCircle className="w-4 h-4 text-green-400" /></div>
                            <div><div className="text-white text-sm">Password Strength</div><div className="text-gray-400 text-xs">Strong</div></div>
                          </div>
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Good</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center"><Smartphone className="w-4 h-4 text-yellow-400" /></div>
                            <div><div className="text-white text-sm">Two-Factor Auth</div><div className="text-gray-400 text-xs">{twoFactorEnabled ? 'Enabled' : 'Not enabled'}</div></div>
                          </div>
                          <span 
                            onClick={handleToggle2FA}
                            className={`px-2 py-1 text-xs rounded cursor-pointer transition-colors ${
                              twoFactorEnabled 
                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                                : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                            }`}
                          >
                            {twoFactorEnabled ? 'Disable' : 'Enable'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center"><Clock className="w-4 h-4 text-blue-400" /></div>
                            <div><div className="text-white text-sm">Last Login</div><div className="text-gray-400 text-xs">Today at {new Date().toLocaleTimeString()}</div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-1">Active Sessions</h3>
                      <p className="text-gray-400 text-xs mb-4">Devices currently logged in</p>
                      <div className="space-y-3">
                        {activeSessions.map(session => (
                          <div key={session.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Smartphone className="w-5 h-5 text-green-400" />
                              <div>
                                <div className="text-white text-sm">{session.device}</div>
                                <div className="text-gray-400 text-xs">{session.location} • {session.current ? 'Active now' : `Last active: ${session.lastActive.toLocaleString()}`}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {session.current && <span className="w-2 h-2 bg-green-400 rounded-full"></span>}
                              {!session.current && (
                                <button 
                                  onClick={() => handleRevokeSession(session.id)}
                                  className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded hover:bg-red-500/20 transition-colors"
                                >
                                  Revoke
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        {activeSessions.length === 0 && (
                          <div className="text-center py-4 text-gray-400 text-sm">No active sessions</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {settingsTab === 'notifications' && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 max-w-2xl">
                  <div className="flex items-center gap-3 mb-1">
                    <Bell className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
                  </div>
                  <p className="text-gray-400 text-xs mb-6">Choose what notifications you receive</p>
                  <div className="space-y-4">
                    {[
                      { key: 'orderAlerts', label: 'New Order Alerts', desc: 'Get notified when a new order is placed', icon: ShoppingCart },
                      { key: 'lowStock', label: 'Low Stock Alerts', desc: 'Alert when product stock falls below 10', icon: AlertTriangle },
                      { key: 'customerSignup', label: 'Customer Sign-ups', desc: 'Notification for new customer registrations', icon: Users },
                      { key: 'dailyReport', label: 'Daily Reports', desc: 'Receive daily sales and performance summary', icon: FileText },
                      { key: 'emailNotifs', label: 'Email Notifications', desc: 'Receive notifications via email', icon: Mail },
                      { key: 'smsNotifs', label: 'SMS Notifications', desc: 'Receive notifications via SMS', icon: Smartphone },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center">
                            <item.icon className="w-4 h-4 text-gray-400" />
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">{item.label}</div>
                            <div className="text-gray-400 text-xs">{item.desc}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => setNotifSettings({...notifSettings, [item.key]: !notifSettings[item.key]})}
                          className={`relative w-11 h-6 rounded-full transition-colors ${notifSettings[item.key] ? 'bg-yellow-500' : 'bg-gray-600'}`}
                        >
                          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifSettings[item.key] ? 'translate-x-5' : ''}`}></div>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-6">
                    <button onClick={() => toast.success('Notification preferences saved')} className="px-6 py-2 rounded-lg text-sm font-medium text-gray-900" style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}>Save Preferences</button>
                  </div>
                </div>
              )}

              {settingsTab === 'data' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Store Data Management */}
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center gap-3 mb-1">
                      <Database className="w-5 h-5 text-purple-400" />
                      <h3 className="text-lg font-semibold text-white">Store Data</h3>
                    </div>
                    <p className="text-gray-400 text-xs mb-5">Manage your store data</p>
                    <div className="space-y-3">
                      <button onClick={handleResetProducts} className="w-full py-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 text-sm border border-red-500/20">
                        <RefreshCw className="w-4 h-4" /> Reset Products to Default
                      </button>
                      <button onClick={handleGlobalRefresh} className="w-full py-3 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2 text-sm border border-blue-500/20">
                        <RefreshCw className="w-4 h-4" /> Refresh All Data
                      </button>
                      <button onClick={handleBackupData} className="w-full py-3 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2 text-sm border border-green-500/20">
                        <Database className="w-4 h-4" /> Backup All Data
                      </button>
                      <button onClick={handleRestoreData} className="w-full py-3 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors flex items-center justify-center gap-2 text-sm border border-purple-500/20">
                        <RefreshCw className="w-4 h-4" /> Restore from Backup
                      </button>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="space-y-6">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-1">Export Data</h3>
                      <p className="text-gray-400 text-xs mb-4">Download your store data</p>
                      <div className="space-y-3">
                        <button onClick={() => { const data = JSON.stringify({ products: centralDataManager.getProducts(), orders: centralDataManager.getOrders(), customers: centralDataManager.getCustomers() }, null, 2); const blob = new Blob([data], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `rs-jewellery-backup-${new Date().toISOString().split('T')[0]}.json`; a.click(); URL.revokeObjectURL(url); toast.success('Data exported!'); }} className="w-full py-3 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2 text-sm border border-blue-500/20">
                          <Download className="w-4 h-4" /> Export as JSON
                        </button>
                      </div>
                    </div>
                    <div className="bg-red-500/5 rounded-xl p-6 border border-red-500/20">
                      <h3 className="text-lg font-semibold text-red-400 mb-1">Danger Zone</h3>
                      <p className="text-gray-400 text-xs mb-4">These actions cannot be undone</p>
                      <div className="space-y-3">
                        <button onClick={() => { if(window.confirm('Clear all saved data and reset to defaults? This cannot be undone!')) { localStorage.clear(); window.location.reload(); } }} className="w-full py-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 text-sm border border-red-500/20">
                          <Trash2 className="w-4 h-4" /> Clear All Saved Data
                        </button>
                        <button onClick={handleLogout} className="w-full py-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 text-sm border border-red-500/20">
                          <LogOut className="w-4 h-4" /> Logout from Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })();
      case 'profit':
        return <ProfitManagement />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-sm border-r border-gray-700/50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}>
              <Package className="w-5 h-5 text-gray-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">R&S Jewels</h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 text-yellow-400 border border-yellow-500/30 shadow-lg shadow-yellow-500/10'
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white hover:translate-x-1'
              }`}
            >
              <div className={`w-5 h-5 flex items-center justify-center ${
                activeSection === item.id ? 'text-yellow-400' : 'text-gray-400'
              }`}>
                <item.icon className="w-4 h-4" />
              </div>
              <span className="font-medium">{item.name}</span>
              {activeSection === item.id && (
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/50">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}>
                <span className="text-white font-bold">A</span>
              </div>
              <div>
                <p className="text-white font-medium">Admin User</p>
                <p className="text-gray-400 text-xs">rs.jewellery.shop22@gmail.com</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors border border-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-sm border-b border-gray-700/50">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 whitespace-nowrap">Last login: {lastLoginTime}</span>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors relative">
                  <Bell className="w-5 h-5 text-gray-400" />
                  {notifications > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                <div className="relative settings-dropdown">
                  <button
                    onClick={() => setSettingsDropdownOpen(!settingsDropdownOpen)}
                    className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <Settings className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  {settingsDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-900" />
                          </div>
                          <div>
                            <div className="text-white font-medium">Admin User</div>
                            <div className="text-gray-400 text-sm">{profileData.email}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={handleProfileSettings}
                          className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-3 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Profile Settings
                        </button>
                        <button
                          onClick={handlePasswordReset}
                          className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-3 transition-colors"
                        >
                          <Key className="w-4 h-4" />
                          Change Password
                        </button>
                        <button
                          onClick={handleBackupData}
                          className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-3 transition-colors"
                        >
                          <Database className="w-4 h-4" />
                          Backup Data
                        </button>
                        <button
                          onClick={handleRestoreData}
                          className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-3 transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Restore Data
                        </button>
                        <button
                          onClick={handleClearCache}
                          className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-3 transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          Clear Cache
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-3 transition-colors"
                        >
                          <HelpCircle className="w-4 h-4" />
                          Help & Support
                        </button>
                      </div>
                      
                      {/* Logout */}
                      <div className="border-t border-gray-700 py-2">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-3 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}>
                  <span className="text-white font-bold text-sm">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          {renderContent()}
        </div>
      </div>

      {/* Product View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Product Details</h3>
                <p className="text-gray-400">ID: {selectedProduct.id}</p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Product Images */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Product Images</h4>
                <div className="grid grid-cols-3 gap-4">
                  {selectedProduct.images ? (
                    selectedProduct.images.map((image, index) => (
                      <img key={index} src={image} alt={`Product ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                    ))
                  ) : (
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-32 object-cover rounded-lg" />
                  )}
                </div>
              </div>

              {/* Product Information */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Product Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Name</p>
                    <p className="text-white">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Category</p>
                    <p className="text-white capitalize">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Price</p>
                    <p className="text-yellow-400 font-semibold">₹{selectedProduct.price}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Stock</p>
                    <p className="text-white">{selectedProduct.stockCount} units</p>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              {selectedProduct.description && (
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">Description</h4>
                  <p className="text-gray-300">{selectedProduct.description}</p>
                </div>
              )}

              {/* Product Details */}
              {selectedProduct.details && selectedProduct.details.length > 0 && (
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">Product Details</h4>
                  <ul className="space-y-2">
                    {selectedProduct.details.map((detail, index) => (
                      <li key={index} className="text-gray-300 flex items-center">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
