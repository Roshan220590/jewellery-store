// Complete Dashboard Data Service - Connects Everything
import { products, categories } from './products.js';
import { getInventory, getLowStockAlerts, getInventoryStats } from './inventory.js';

// Real-time data service for dashboard
export class DashboardDataService {
  constructor() {
    this.orders = this.loadOrders();
    this.customers = this.loadCustomers();
    this.analytics = this.loadAnalytics();
    this.support = this.loadSupport();
  }

  // Load orders from localStorage or mock data
  loadOrders() {
    const savedOrders = localStorage.getItem('adminOrders');
    if (savedOrders) {
      return JSON.parse(savedOrders);
    }
    
    // Mock orders data
    return [
      {
        id: 'ORD-001',
        customer: { name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 98765 43210' },
        items: [
          { id: 1, name: 'Royal Kundan Choker', quantity: 1, price: 1299 },
          { id: 2, name: 'Pearl Drop Earrings', quantity: 2, price: 449 }
        ],
        total: 2197,
        date: '2024-04-01',
        status: 'pending',
        paymentStatus: 'paid',
        paymentMethod: 'UPI',
        paymentId: 'UPI123456789',
        shipping: { status: 'Pending', address: '123 MG Road, Bangalore' },
        platform: 'Website',
        source: 'Google Ads',
        notes: 'Gift wrapping requested'
      },
      {
        id: 'ORD-002',
        customer: { name: 'Anjali Patel', email: 'anjali@email.com', phone: '+91 87654 32109' },
        items: [
          { id: 3, name: 'Meenakari Bangle Set', quantity: 1, price: 899 }
        ],
        total: 899,
        date: '2024-04-01',
        status: 'processing',
        paymentStatus: 'paid',
        paymentMethod: 'Credit Card',
        paymentId: 'CC987654321',
        shipping: { status: 'Processing', address: '456 Brigade Road, Bangalore' },
        platform: 'Website',
        source: 'Direct',
        notes: ''
      }
    ];
  }

  // Load customers from localStorage or mock data
  loadCustomers() {
    const savedCustomers = localStorage.getItem('adminCustomers');
    if (savedCustomers) {
      return JSON.parse(savedCustomers);
    }
    
    return [
      {
        id: 1,
        name: 'Priya Sharma',
        email: 'priya@email.com',
        phone: '+91 98765 43210',
        address: '123 MG Road, Bangalore',
        totalOrders: 3,
        totalSpent: 5289,
        joinDate: '2024-01-15',
        status: 'active',
        lastOrder: '2024-04-01'
      },
      {
        id: 2,
        name: 'Anjali Patel',
        email: 'anjali@email.com',
        phone: '+91 87654 32109',
        address: '456 Brigade Road, Bangalore',
        totalOrders: 2,
        totalSpent: 2398,
        joinDate: '2024-02-20',
        status: 'active',
        lastOrder: '2024-04-01'
      }
    ];
  }

  // Load analytics data
  loadAnalytics() {
    return {
      revenue: {
        today: 18750,
        week: 125000,
        month: 458920,
        year: 2456780
      },
      orders: {
        today: 47,
        week: 312,
        month: 1247,
        year: 5678
      },
      visitors: {
        today: 15420,
        week: 89500,
        month: 345670,
        year: 1567890
      },
      conversion: {
        rate: 3.2,
        trend: 'up'
      },
      cartAbandonment: 68.3,
      avgOrderValue: 368,
      topProducts: products.slice(0, 4).map(p => ({
        ...p,
        sales: Math.floor(Math.random() * 50) + 10,
        revenue: p.price * (Math.floor(Math.random() * 50) + 10)
      }))
    };
  }

  // Load support data
  loadSupport() {
    return {
      open: 8,
      resolved: 23,
      pending: 5,
      urgent: 2,
      tickets: [
        {
          id: 1,
          customer: 'Meera Gupta',
          subject: 'Order not received',
          status: 'open',
          priority: 'urgent',
          created: '2024-04-01',
          lastReply: '2024-04-01'
        }
      ]
    };
  }

  // Get dashboard stats
  getDashboardStats() {
    try {
      const inventoryStats = getInventoryStats();
      const analytics = this.analytics;
      
      return {
        totalProducts: products?.length || 0,
        totalCategories: categories?.length || 0,
        totalOrders: this.orders?.length || 0,
        totalRevenue: analytics?.revenue?.month || 0,
        pendingOrders: this.orders?.filter(o => o?.status === 'pending')?.length || 0,
        todayOrders: analytics?.orders?.today || 0,
        todayRevenue: analytics?.revenue?.today || 0,
        lowStockProducts: inventoryStats?.lowStockProducts || 0,
        conversionRate: analytics?.conversion?.rate || 0,
        avgOrderValue: analytics?.avgOrderValue || 0,
        customerGrowth: 12.5,
        revenueGrowth: 8.3,
        websiteVisits: analytics?.visitors?.today || 0,
        cartAbandonment: analytics?.cartAbandonment || 0,
        supportResponse: 2.4,
        customerSatisfaction: 4.8
      };
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      return {
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
    }
  }

  // Get recent activity
  getRecentActivity() {
    try {
      const activities = [];
      
      // Add recent orders
      if (this.orders && Array.isArray(this.orders)) {
        this.orders.slice(0, 3).forEach(order => {
          if (order && order.id && order.customer) {
            activities.push({
              id: `order-${order.id}`,
              type: 'order',
              message: `New order #${order.id} received from ${order.customer.name || 'Customer'}`,
              time: '2 min ago',
              icon: 'ShoppingCart'
            });
          }
        });
      }
      
      // Add low stock alerts
      try {
        const alerts = getLowStockAlerts();
        if (alerts && Array.isArray(alerts)) {
          alerts.slice(0, 2).forEach(alert => {
            if (alert && alert.id && alert.product) {
              activities.push({
                id: `stock-${alert.id}`,
                type: 'product',
                message: `Low stock alert: ${alert.product}`,
                time: '10 min ago',
                icon: 'Package'
              });
            }
          });
        }
      } catch (error) {
        console.error('Error getting low stock alerts:', error);
      }
      
      return activities;
    } catch (error) {
      console.error('Error in getRecentActivity:', error);
      return [];
    }
  }

  // Get top products
  getTopProducts() {
    try {
      const analytics = this.analytics;
      if (analytics && analytics.topProducts && Array.isArray(analytics.topProducts)) {
        return analytics.topProducts.map((product, index) => ({
          ...product,
          rank: index + 1
        }));
      }
      return [];
    } catch (error) {
      console.error('Error in getTopProducts:', error);
      return [];
    }
  }

  // Get recent orders
  getRecentOrders() {
    try {
      if (this.orders && Array.isArray(this.orders)) {
        return this.orders.slice(0, 4).map(order => ({
          id: order?.id || 'Unknown',
          customer: order?.customer?.name || 'Unknown',
          amount: order?.total || 0,
          status: order?.status || 'pending',
          time: '2 min ago',
          paymentMethod: order?.paymentMethod || 'Unknown'
        }));
      }
      return [];
    } catch (error) {
      console.error('Error in getRecentOrders:', error);
      return [];
    }
  }

  // Get customer analytics
  getCustomerAnalytics() {
    try {
      if (!this.customers || !Array.isArray(this.customers)) {
        return {
          totalCustomers: 0,
          newCustomers: 0,
          activeCustomers: 0,
          returningCustomers: 0,
          topLocations: ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai']
        };
      }
      
      const totalCustomers = this.customers.length;
      const newCustomers = this.customers.filter(c => {
        if (!c.joinDate) return false;
        const joinDate = new Date(c.joinDate);
        const today = new Date();
        return (today - joinDate) / (1000 * 60 * 60 * 24) <= 30;
      }).length;
      
      return {
        totalCustomers,
        newCustomers,
        activeCustomers: this.customers.filter(c => c?.status === 'active').length,
        returningCustomers: this.customers.filter(c => c?.totalOrders > 1).length,
        topLocations: ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai']
      };
    } catch (error) {
      console.error('Error in getCustomerAnalytics:', error);
      return {
        totalCustomers: 0,
        newCustomers: 0,
        activeCustomers: 0,
        returningCustomers: 0,
        topLocations: ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai']
      };
    }
  }

  // Get support tickets
  getSupportTickets() {
    try {
      return this.support || {
        open: 0,
        resolved: 0,
        pending: 0,
        urgent: 0
      };
    } catch (error) {
      console.error('Error in getSupportTickets:', error);
      return {
        open: 0,
        resolved: 0,
        pending: 0,
        urgent: 0
      };
    }
  }

  // Add new order
  addOrder(order) {
    this.orders.unshift(order);
    this.saveOrders();
    
    // Update inventory
    if (order.items && order.items.length > 0) {
      // This will be handled by the inventory system
    }
    
    return order;
  }

  // Save orders to localStorage
  saveOrders() {
    localStorage.setItem('adminOrders', JSON.stringify(this.orders));
  }

  // Save customers to localStorage
  saveCustomers() {
    localStorage.setItem('adminCustomers', JSON.stringify(this.customers));
  }

  // Refresh all data
  refreshAll() {
    this.orders = this.loadOrders();
    this.customers = this.loadCustomers();
    this.analytics = this.loadAnalytics();
    this.support = this.loadSupport();
  }
}

// Create singleton instance
export const dashboardService = new DashboardDataService();
