// Website Product Service - Connects Website to Admin Dashboard
import centralDataManager from './centralDataManager.js';

export class WebsiteProductService {
  constructor() {
    console.log('WebsiteProductService: Initializing...');
    this.products = [];
    this.categories = [];
    this.listeners = new Map();
    
    try {
      // Initialize with real data from admin dashboard
      console.log('WebsiteProductService: Loading products...');
      this.loadProducts();
      console.log('WebsiteProductService: Loading categories...');
      this.loadCategories();
      
      // Subscribe to real-time updates from admin dashboard
      console.log('WebsiteProductService: Setting up real-time updates...');
      this.setupRealTimeUpdates();
      console.log('WebsiteProductService: Initialization complete');
    } catch (error) {
      console.error('WebsiteProductService: Error during initialization:', error);
    }
  }

  // Load products from central data manager (admin dashboard data)
  loadProducts() {
    this.products = centralDataManager.getProducts();
    console.log('Website loaded products from admin dashboard:', this.products.length, 'products');
    console.log('First 3 products:', this.products.slice(0, 3));
    return this.products;
  }

  // Load categories from central data manager
  loadCategories() {
    this.categories = centralDataManager.getCategories();
    console.log('Website loaded categories from admin dashboard:', this.categories);
    return this.categories;
  }

  // Get all products for website
  getProducts() {
    return this.products.filter(product => product.inStock !== false);
  }

  // Get products by category for website
  getProductsByCategory(categoryId) {
    return this.products.filter(product => 
      product.category === categoryId && product.inStock !== false
    );
  }

  // Get product by ID for website
  getProductById(productId) {
    return this.products.find(product => product.id === productId);
  }

  // Get featured products for website
  getFeaturedProducts() {
    return this.products
      .filter(product => product.inStock !== false)
      .slice(0, 8);
  }

  // Get new arrivals for website
  getNewArrivals() {
    return this.products
      .filter(product => product.inStock !== false)
      .slice(0, 6);
  }

  // Search products for website
  searchProducts(query) {
    if (!query || query.length < 2) return [];
    
    const searchTerm = query.toLowerCase();
    return this.products.filter(product => 
      product.inStock !== false && (
        product.name.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm)
      )
    );
  }

  // Get categories with product counts for website
  getCategoriesWithCounts() {
    return this.categories.map(category => ({
      ...category,
      productCount: this.products.filter(product => 
        product.category === category.id && product.inStock !== false
      ).length
    }));
  }

  // Get related products for website
  getRelatedProducts(productId, limit = 4) {
    const currentProduct = this.getProductById(productId);
    if (!currentProduct) return [];

    return this.products
      .filter(product => 
        product.id !== productId && 
        product.category === currentProduct.category && 
        product.inStock !== false
      )
      .slice(0, limit);
  }

  // Check if product is in stock for website
  isProductInStock(productId) {
    const product = this.getProductById(productId);
    return product && product.inStock !== false && (product.stockCount || 0) > 0;
  }

  // Get stock count for website
  getStockCount(productId) {
    const product = this.getProductById(productId);
    return product ? (product.stockCount || 0) : 0;
  }

  // Setup real-time updates from admin dashboard
  setupRealTimeUpdates() {
    // Listen for product additions
    centralDataManager.subscribe('productAdded', (product) => {
      this.loadProducts();
      this.emit('productAdded', product);
      console.log('Website: New product added from admin dashboard', product);
    });

    // Listen for product updates
    centralDataManager.subscribe('productUpdated', (product) => {
      this.loadProducts();
      this.emit('productUpdated', product);
      console.log('Website: Product updated from admin dashboard', product);
    });

    // Listen for stock updates
    centralDataManager.subscribe('stockUpdated', (data) => {
      this.loadProducts();
      this.emit('stockUpdated', data);
      console.log('Website: Stock updated from admin dashboard', data);
    });

    // Listen for category updates
    centralDataManager.subscribe('categoryAdded', (category) => {
      this.loadCategories();
      this.emit('categoryAdded', category);
      console.log('Website: New category added from admin dashboard', category);
    });

    centralDataManager.subscribe('categoryUpdated', (category) => {
      this.loadCategories();
      this.emit('categoryUpdated', category);
      console.log('Website: Category updated from admin dashboard', category);
    });

    // Listen for product deletions
    centralDataManager.subscribe('productDeleted', (product) => {
      this.loadProducts();
      this.emit('productDeleted', product);
      console.log('Website: Product deleted from admin dashboard', product);
    });

    // Listen for products reset
    centralDataManager.subscribe('productsReset', (products) => {
      this.loadProducts();
      this.emit('productsReset', products);
      console.log('Website: Products reset from admin dashboard', products);
    });
  }

  // Event system for website components - returns unsubscribe function
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => {
      const callbacks = this.listeners.get(event) || [];
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    };
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  // Get product statistics for website
  getProductStats() {
    const totalProducts = this.products.length;
    const inStockProducts = this.products.filter(p => p.inStock !== false).length;
    const outOfStockProducts = this.products.filter(p => p.inStock === false).length;
    const totalCategories = this.categories.length;

    return {
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      totalCategories,
      inStockPercentage: totalProducts > 0 ? (inStockProducts / totalProducts * 100).toFixed(1) : 0
    };
  }

  // Get products by price range for website
  getProductsByPriceRange(minPrice, maxPrice) {
    return this.products.filter(product => 
      product.inStock !== false && 
      product.price >= minPrice && 
      product.price <= maxPrice
    );
  }

  // Get products on sale for website
  getProductsOnSale() {
    return this.products.filter(product => 
      product.inStock !== false && 
      product.discount && product.discount > 0
    );
  }

  // Refresh data from admin dashboard
  refresh() {
    this.loadProducts();
    this.loadCategories();
    this.emit('dataRefreshed', { products: this.products, categories: this.categories });
    console.log('Website data refreshed from admin dashboard');
  }
}

// Create singleton instance
export const websiteProductService = new WebsiteProductService();

// Export for easy use
export default websiteProductService;
