// Website Integration Service - Connects Dashboard with Real Website
import { getProductStock } from './inventory.js';
import { dashboardService } from './dashboardService.js';

export class WebsiteIntegrationService {
  // Get real-time stock for website
  static getWebsiteStock(productId) {
    return getProductStock(productId);
  }

  // Get featured products for website
  static getFeaturedProducts() {
    const dashboard = dashboardService;
    const topProducts = dashboard.getTopProducts();
    return topProducts.map(product => ({
      ...product,
      stock: this.getWebsiteStock(product.id)
    }));
  }

  // Get products by category for website
  static getProductsByCategory(category) {
    const dashboard = dashboardService;
    const allProducts = dashboard.analytics.topProducts;
    return allProducts
      .filter(product => product.category === category)
      .map(product => ({
        ...product,
        stock: this.getWebsiteStock(product.id)
      }));
  }

  // Update stock when website order is placed
  static handleWebsiteOrder(order) {
    // Add order to dashboard
    dashboardService.addOrder(order);
    
    // Update inventory (handled by inventory service)
    return true;
  }

  // Get real-time analytics for website
  static getWebsiteAnalytics() {
    const dashboard = dashboardService;
    const analytics = dashboard.analytics;
    
    return {
      totalProducts: analytics.topProducts.length,
      inStockProducts: analytics.topProducts.filter(p => 
        this.getWebsiteStock(p.id).inStock
      ).length,
      totalOrders: dashboard.orders.length,
      todayOrders: analytics.orders.today,
      conversionRate: analytics.conversion.rate,
      avgOrderValue: analytics.avgOrderValue
    };
  }

  // Get customer data for website personalization
  static getCustomerData(customerId) {
    const dashboard = dashboardService;
    const customer = dashboard.customers.find(c => c.id === customerId);
    
    if (customer) {
      return {
        name: customer.name,
        email: customer.email,
        preferences: {
          categories: this.getCustomerPreferredCategories(customer),
          lastOrder: customer.lastOrder
        }
      };
    }
    
    return null;
  }

  // Get customer preferred categories
  static getCustomerPreferredCategories(customer) {
    // This would analyze customer's order history
    // For now, return common categories
    return ['necklaces', 'earrings', 'rings'];
  }

  // Get real-time notifications for website
  static getWebsiteNotifications() {
    const dashboard = dashboardService;
    const lowStock = this.getLowStockNotifications();
    const newOrders = this.getNewOrderNotifications();
    
    return {
      lowStock,
      newOrders,
      total: lowStock.length + newOrders.length
    };
  }

  // Get low stock notifications for website
  static getLowStockNotifications() {
    const dashboard = dashboardService;
    const alerts = dashboard.getRecentActivity().filter(a => a.type === 'product');
    
    return alerts.map(alert => ({
      type: 'low_stock',
      message: alert.message,
      productId: alert.id,
      severity: 'warning'
    }));
  }

  // Get new order notifications for website
  static getNewOrderNotifications() {
    const dashboard = dashboardService;
    const recentOrders = dashboard.getRecentOrders();
    
    return recentOrders.map(order => ({
      type: 'new_order',
      message: `New order #${order.id} received`,
      orderId: order.id,
      amount: order.amount,
      severity: 'info'
    }));
  }

  // Sync website with dashboard data
  static syncWebsiteWithDashboard() {
    dashboardService.refreshAll();
    return {
      synced: true,
      timestamp: new Date().toISOString(),
      message: 'Website synced with dashboard'
    };
  }

  // Get real-time pricing information
  static getRealTimePricing() {
    const dashboard = dashboardService;
    const topProducts = dashboard.getTopProducts();
    
    return topProducts.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0,
      inStock: this.getWebsiteStock(product.id).inStock,
      stockCount: this.getWebsiteStock(product.id).stockCount
    }));
  }

  // Handle customer registration from website
  static handleCustomerRegistration(customerData) {
    const dashboard = dashboardService;
    
    // Add customer to dashboard
    const newCustomer = {
      id: dashboard.customers.length + 1,
      ...customerData,
      totalOrders: 0,
      totalSpent: 0,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      lastOrder: null
    };
    
    dashboard.customers.push(newCustomer);
    dashboard.saveCustomers();
    
    return newCustomer;
  }

  // Get website performance metrics
  static getWebsitePerformance() {
    const dashboard = dashboardService;
    const analytics = dashboard.analytics;
    
    return {
      visitors: analytics.visitors.today,
      pageViews: analytics.visitors.today * 3.2, // Average 3.2 pages per visitor
      bounceRate: 32.5,
      avgSessionDuration: 245, // seconds
      conversionRate: analytics.conversion.rate,
      revenue: analytics.revenue.today,
      cartAbandonment: analytics.cartAbandonment
    };
  }
}

// Export instance for easy use
export const websiteIntegration = WebsiteIntegrationService;
