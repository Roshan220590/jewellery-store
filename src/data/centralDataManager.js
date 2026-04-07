// Simple Centralized Data Management
export class CentralDataManager {
  constructor() {
    console.log('CentralDataManager: Initializing...');
    this.products = this.getDefaultProducts();
    this.categories = this.getDefaultCategories();
    this.orders = this.getDefaultOrders();
    this.customers = this.getDefaultCustomers();
    this.listeners = new Map(); // Initialize listeners properly
    console.log('CentralDataManager: Loaded', this.products.length, 'products');
    console.log('CentralDataManager: Methods available:', Object.getOwnPropertyNames(Object.getPrototypeOf(this)));
  }

  getDefaultProducts() {
    return [
      {
        id: 1,
        name: 'Artificial Gold Plated Kundan Choker Necklace Set for Women',
        category: 'necklaces',
        price: 299,
        originalPrice: 1299,
        rating: 4.2,
        reviews: 2847,
        image: 'https://picsum.photos/seed/kundan-choker/500/500.jpg',
        images: [
          'https://picsum.photos/seed/kundan-choker-1/500/500.jpg',
          'https://picsum.photos/seed/kundan-choker-2/500/500.jpg',
          'https://picsum.photos/seed/kundan-choker-3/500/500.jpg',
          'https://picsum.photos/seed/kundan-choker-4/500/500.jpg'
        ],
        badge: 'Bestseller',
        badgeColor: 'bg-orange-500',
        description: 'Exquisite artificial gold plated Kundan choker necklace set with matching earrings. Perfect for weddings, festivals, and traditional occasions. Premium quality synthetic stones with long-lasting plating.',
        details: [
          'Brand: R&S Jewellery',
          'Material: Artificial Gold Plated Alloy',
          'Stone Type: Synthetic Kundan',
          'Plating: 22K Gold Plated',
          'Necklace Length: 16 inches + 2 inches adjustable chain',
          'Earrings Length: 2.5 inches',
          'Weight: 45 grams',
          'Occasion: Wedding, Festival, Party',
          'Care: Keep away from water and perfume'
        ],
        inStock: true,
        stockCount: 156,
        isFeatured: true,
        isNewArrival: false,
        sizes: ['16"', '18"', '20"'],
        colors: ['Gold', 'Rose Gold'],
        deliveryTime: '4-5 days',
        seller: 'R&S Jewellery Store',
        returnPolicy: '10 days replacement',
        codAvailable: true,
        emiAvailable: false,
        specialOffers: ['Free Shipping', '10% off on prepaid orders']
      },
      {
        id: 2,
        name: 'Stylish Pearl Drop Earrings for Women - Artificial Jewellery',
        category: 'earrings',
        price: 199,
        originalPrice: 599,
        rating: 4.1,
        reviews: 1856,
        image: 'https://picsum.photos/seed/pearl-earrings/500/500.jpg',
        images: [
          'https://picsum.photos/seed/pearl-earrings-1/500/500.jpg',
          'https://picsum.photos/seed/pearl-earrings-2/500/500.jpg',
          'https://picsum.photos/seed/pearl-earrings-3/500/500.jpg'
        ],
        badge: 'Hot Deal',
        badgeColor: 'bg-red-500',
        description: 'Elegant pearl drop earrings with artificial gold plating. Lightweight and comfortable for all-day wear. Suitable for office, college, and casual occasions.',
        details: [
          'Brand: R&S Jewellery',
          'Material: Artificial Gold Plated Alloy',
          'Stone Type: Faux Pearl',
          'Plating: 18K Gold Plated',
          'Earrings Length: 3 inches',
          'Weight: 12 grams (pair)',
          'Closure: Push-back',
          'Hypoallergenic: Yes',
          'Water Resistant: No',
          'Occasion: Daily Wear, Office, Party'
        ],
        inStock: true,
        stockCount: 289,
        isFeatured: true,
        isNewArrival: true,
        sizes: ['One Size'],
        colors: ['Gold', 'Silver', 'Rose Gold'],
        deliveryTime: '3-4 days',
        seller: 'R&S Jewellery Store',
        returnPolicy: '7 days replacement',
        codAvailable: true,
        emiAvailable: false,
        specialOffers: ['Buy 2 Get 1 Free', 'Free Shipping']
      },
      {
        id: 3,
        name: 'Traditional Meenakari Bangles Set for Women - 6 Pieces',
        category: 'bangles',
        price: 449,
        originalPrice: 999,
        rating: 4.3,
        reviews: 1234,
        image: 'https://picsum.photos/seed/meenakari-bangles/500/500.jpg',
        images: [
          'https://picsum.photos/seed/meenakari-bangles-1/500/500.jpg',
          'https://picsum.photos/seed/meenakari-bangles-2/500/500.jpg',
          'https://picsum.photos/seed/meenakari-bangles-3/500/500.jpg'
        ],
        badge: 'Popular',
        badgeColor: 'bg-green-600',
        description: 'Beautiful Meenakari bangles set with colorful enamel work. Set of 6 bangles in assorted designs. Perfect for traditional occasions and daily wear.',
        details: [
          'Brand: R&S Jewellery',
          'Material: High-Quality Brass',
          'Work: Meenakari Enamel Work',
          'Plating: Gold Plated',
          'Set Contains: 6 Bangles',
          'Size: 2.6 inches (adjustable)',
          'Weight: 85 grams (set)',
          'Finish: Matte with glossy enamel',
          'Occasion: Daily Wear, Festival, Wedding',
          'Packaging: Attractive gift box'
        ],
        inStock: true,
        stockCount: 98,
        isFeatured: true,
        isNewArrival: false,
        sizes: ['2.4', '2.6', '2.8', '2.10'],
        colors: ['Gold', 'Multicolor'],
        deliveryTime: '4-5 days',
        seller: 'R&S Jewellery Store',
        returnPolicy: '10 days replacement',
        codAvailable: true,
        emiAvailable: false,
        specialOffers: ['Free Gift Box', '5% off on first order']
      },
      {
        id: 4,
        name: 'American Diamond Solitaire Ring for Women - Artificial Jewellery',
        category: 'rings',
        price: 349,
        originalPrice: 899,
        rating: 4.4,
        reviews: 987,
        image: 'https://picsum.photos/seed/diamond-ring/500/500.jpg',
        images: [
          'https://picsum.photos/seed/diamond-ring-1/500/500.jpg',
          'https://picsum.photos/seed/diamond-ring-2/500/500.jpg',
          'https://picsum.photos/seed/diamond-ring-3/500/500.jpg'
        ],
        badge: 'Trending',
        badgeColor: 'bg-purple-600',
        description: 'Stunning American diamond solitaire ring with artificial gold plating. Perfect for engagement, anniversary, or special occasions.',
        details: [
          'Brand: R&S Jewellery',
          'Material: Artificial Gold Plated Silver',
          'Stone: American Diamond (CZ)',
          'Plating: 18K Gold Plated',
          'Stone Size: 6mm',
          'Ring Weight: 8 grams',
          'Adjustable: Yes',
          'Hypoallergenic: Yes',
          'Occasion: Engagement, Anniversary, Party',
          'Gift Box: Included'
        ],
        inStock: true,
        stockCount: 167,
        isFeatured: true,
        isNewArrival: true,
        sizes: ['Adjustable'],
        colors: ['Gold', 'Silver', 'Rose Gold'],
        deliveryTime: '3-4 days',
        seller: 'R&S Jewellery Store',
        returnPolicy: '7 days replacement',
        codAvailable: true,
        emiAvailable: true,
        specialOffers: ['Free Ring Size Adjuster', 'Free Shipping'],
        // Cost and Profit Management
        costData: {
          purchasePrice: 120,  // What you paid
          packagingCost: 15,   // Packaging materials
          logisticsCost: 40,   // Shipping/delivery
          otherCharges: 25,    // Marketing, fees, etc.
          totalCost: 200,      // Total cost per unit
          sellingPrice: 299,    // Customer price
          profit: 99,          // Profit per unit
          profitMargin: 33.1   // Profit percentage
        }
      },
      {
        id: 5,
        name: 'Bridal Maang Tikka with Matha Patti - Traditional Indian Jewellery',
        category: 'maang-tikka',
        price: 599,
        originalPrice: 1499,
        rating: 4.5,
        reviews: 678,
        image: 'https://picsum.photos/seed/maang-tikka/500/500.jpg',
        images: [
          'https://picsum.photos/seed/maang-tikka-1/500/500.jpg',
          'https://picsum.photos/seed/maang-tikka-2/500/500.jpg',
          'https://picsum.photos/seed/maang-tikka-3/500/500.jpg'
        ],
        badge: 'Premium',
        badgeColor: 'bg-yellow-500',
        description: 'Exquisite bridal maang tikka with matha patti for traditional Indian weddings. Features intricate Kundan work with pearl details.',
        details: [
          'Brand: R&S Jewellery',
          'Material: Artificial Gold Plated Alloy',
          'Work: Kundan with Pearl Work',
          'Plating: 22K Gold Plated',
          'Length: Matha Patti - 10 inches, Maang Tikka - 3 inches',
          'Weight: 65 grams',
          'Closure: Hook with chain',
          'Occasion: Wedding, Reception, Sangeet',
          'Packaging: Premium bridal box'
        ],
        inStock: true,
        stockCount: 45,
        isFeatured: true,
        isNewArrival: false,
        sizes: ['One Size'],
        colors: ['Gold', 'Rose Gold'],
        deliveryTime: '5-6 days',
        seller: 'R&S Jewellery Store',
        returnPolicy: '15 days replacement',
        codAvailable: true,
        emiAvailable: true,
        specialOffers: ['Free Bridal Accessories', 'Express Delivery'],
        // Cost and Profit Management
        costData: {
          purchasePrice: 280,
          packagingCost: 25,
          logisticsCost: 55,
          otherCharges: 40,
          totalCost: 400,
          sellingPrice: 599,
          profit: 199,
          profitMargin: 33.2
        }
      },
      // Wedding Hoop Hangers
      {
        id: 6,
        name: 'Elegant Wedding Hoop Hangers - Premium Bridal Collection',
        category: 'hoop-hangers',
        price: 899,
        originalPrice: 1599,
        rating: 4.8,
        reviews: 423,
        image: '/images/hoop_hanger/hoop_wedng.jpg',
        images: [
          '/images/hoop_hanger/hoop_wedng.jpg',
          '/images/hoop_hanger/hoop_wedng2.jpg',
          '/images/hoop_hanger/hoop_wedng3.jpg',
          '/images/hoop_hanger/hoop_wedng4.jpg'
        ],
        badge: 'Bridal',
        badgeColor: 'bg-pink-500',
        description: 'Elegant wedding hoop hangers with intricate gold-plated work. Perfect for bridal ceremonies and traditional weddings. Features premium quality stones with long-lasting finish.',
        details: [
          'Brand: R&S Jewellery',
          'Material: Artificial Gold Plated Alloy',
          'Stone Type: Premium Kundan',
          'Plating: 22K Gold Plated',
          'Hanger Length: 3.5 inches',
          'Hoop Diameter: 2.2 inches',
          'Weight: 35 grams (pair)',
          'Closure: Secure hook with rubber back',
          'Occasion: Wedding, Reception, Sangeet, Engagement',
          'Packaging: Premium bridal gift box'
        ],
        inStock: true,
        stockCount: 28,
        isFeatured: true,
        isNewArrival: false,
        sizes: ['One Size'],
        colors: ['Gold', 'Rose Gold'],
        deliveryTime: '4-5 days',
        seller: 'R&S Jewellery Store',
        returnPolicy: '15 days replacement',
        codAvailable: true,
        emiAvailable: true,
        specialOffers: ['Free Bridal Accessories', 'Express Delivery'],
        // Cost and Profit Management
        costData: {
          purchasePrice: 450,
          packagingCost: 35,
          logisticsCost: 65,
          otherCharges: 50,
          totalCost: 600,
          sellingPrice: 899,
          profit: 299,
          profitMargin: 33.3
        }
      },
      {
        id: 7,
        name: 'Luxury Wedding Hoop Hangers - Designer Collection',
        category: 'hoop-hangers',
        price: 1299,
        originalPrice: 2299,
        rating: 4.9,
        reviews: 289,
        image: '/images/hoop_hanger/hoop_wedng2.jpg',
        images: [
          '/images/hoop_hanger/hoop_wedng2.jpg',
          '/images/hoop_hanger/hoop_wedng3.jpg',
          '/images/hoop_hanger/hoop_wedng4.jpg',
          '/images/hoop_hanger/hoop_wedng.jpg'
        ],
        badge: 'Luxury',
        badgeColor: 'bg-purple-500',
        description: 'Luxury wedding hoop hangers with designer craftsmanship. Exquisite detailing with premium stones and flawless gold plating. Perfect for luxury weddings and grand ceremonies.',
        details: [
          'Brand: R&S Jewellery',
          'Material: Premium Gold Plated Silver',
          'Stone Type: American Diamonds & Kundan',
          'Plating: 24K Gold Plated',
          'Hanger Length: 4 inches',
          'Hoop Diameter: 2.5 inches',
          'Weight: 42 grams (pair)',
          'Closure: Premium screw-back',
          'Occasion: Luxury Wedding, Royal Functions, Grand Reception',
          'Packaging: Luxury velvet box with satin lining'
        ],
        inStock: true,
        stockCount: 15,
        isFeatured: true,
        isNewArrival: false,
        sizes: ['One Size'],
        colors: ['Gold', 'Rose Gold', 'White Gold'],
        deliveryTime: '5-6 days',
        seller: 'R&S Jewellery Store',
        returnPolicy: '15 days replacement',
        codAvailable: true,
        emiAvailable: true,
        specialOffers: ['Free International Shipping', 'Premium Gift Box'],
        // Cost and Profit Management
        costData: {
          purchasePrice: 680,
          packagingCost: 45,
          logisticsCost: 85,
          otherCharges: 60,
          totalCost: 870,
          sellingPrice: 1299,
          profit: 429,
          profitMargin: 33.0
        }
      },
      // Naming Ceremony Hoop Hangers
      {
        id: 8,
        name: 'Traditional Naming Ceremony Hoop Hangers - Baby Shower Special',
        category: 'hoop-hangers',
        price: 599,
        originalPrice: 999,
        rating: 4.6,
        reviews: 167,
        image: '/images/hoop_hanger/hoop_nam_ceremony1.jpg',
        images: [
          '/images/hoop_hanger/hoop_nam_ceremony1.jpg'
        ],
        badge: 'Traditional',
        badgeColor: 'bg-orange-500',
        description: 'Traditional hoop hangers specially designed for naming ceremonies and baby showers. Lightweight and comfortable for extended wear during ceremonies.',
        details: [
          'Brand: R&S Jewellery',
          'Material: Artificial Gold Plated Alloy',
          'Stone Type: Faux Pearls & Kundan',
          'Plating: 18K Gold Plated',
          'Hanger Length: 2.8 inches',
          'Hoop Diameter: 1.8 inches',
          'Weight: 22 grams (pair)',
          'Closure: Fish hook with safety back',
          'Occasion: Naming Ceremony, Baby Shower, Traditional Functions',
          'Packaging: Traditional gift box with baby theme'
        ],
        inStock: true,
        stockCount: 35,
        isFeatured: true,
        isNewArrival: true,
        sizes: ['One Size'],
        colors: ['Gold', 'Silver'],
        deliveryTime: '3-4 days',
        seller: 'R&S Jewellery Store',
        returnPolicy: '10 days replacement',
        codAvailable: true,
        emiAvailable: false,
        specialOffers: ['Free Baby Shower Gift', 'Same Day Delivery']
      },
      // Casual/Cat Hoop Hangers
      {
        id: 9,
        name: 'Casual Cat Design Hoop Hangers - Daily Wear Collection',
        category: 'hoop-hangers',
        price: 399,
        originalPrice: 699,
        rating: 4.4,
        reviews: 234,
        image: '/images/hoop_hanger/hoop_cat.jpg',
        images: [
          '/images/hoop_hanger/hoop_cat.jpg'
        ],
        badge: 'Casual',
        badgeColor: 'bg-blue-500',
        description: 'Cute cat design hoop hangers perfect for casual and daily wear. Lightweight and comfortable for all-day use. Features playful design with secure closure.',
        details: [
          'Brand: R&S Jewellery',
          'Material: Artificial Gold Plated Alloy',
          'Design: Cat Motif with Hoop',
          'Plating: 16K Gold Plated',
          'Hanger Length: 2.5 inches',
          'Hoop Diameter: 1.5 inches',
          'Weight: 18 grams (pair)',
          'Closure: Push-back with safety lock',
          'Occasion: Daily Wear, College, Office, Casual Outings',
          'Packaging: Cute cat-themed gift box'
        ],
        inStock: true,
        stockCount: 52,
        isFeatured: false,
        isNewArrival: true,
        sizes: ['One Size'],
        colors: ['Gold', 'Silver', 'Rose Gold'],
        deliveryTime: '2-3 days',
        seller: 'R&S Jewellery Store',
        returnPolicy: '7 days replacement',
        codAvailable: true,
        emiAvailable: false,
        specialOffers: ['Buy 2 Get 1 Free', 'Free Shipping']
      },
      // Birthday Hoop Hangers
      {
        id: 10,
        name: 'Celebration Birthday Hoop Hangers - Party Wear Special',
        category: 'hoop-hangers',
        price: 449,
        originalPrice: 799,
        rating: 4.5,
        reviews: 189,
        image: '/images/hoop_hanger/hoop_bday1.jpg',
        images: [
          '/images/hoop_hanger/hoop_bday1.jpg',
          '/images/hoop_hanger/hoop_bday2.jpg'
        ],
        badge: 'Party',
        badgeColor: 'bg-green-500',
        description: 'Festive birthday hoop hangers designed for parties and celebrations. Eye-catching design with colorful stones and premium plating. Perfect for birthday photos and parties.',
        details: [
          'Brand: R&S Jewellery',
          'Material: Artificial Gold Plated Alloy',
          'Stone Type: Colorful Synthetic Stones',
          'Plating: 18K Gold Plated',
          'Hanger Length: 3 inches',
          'Hoop Diameter: 2 inches',
          'Weight: 28 grams (pair)',
          'Closure: Secure hook with rubber back',
          'Occasion: Birthday Parties, Celebrations, Festive Events',
          'Packaging: Party-themed gift box'
        ],
        inStock: true,
        stockCount: 41,
        isFeatured: true,
        isNewArrival: true,
        sizes: ['One Size'],
        colors: ['Gold', 'Multi-color'],
        deliveryTime: '3-4 days',
        seller: 'R&S Jewellery Store',
        returnPolicy: '7 days replacement',
        codAvailable: true,
        emiAvailable: false,
        specialOffers: ['Birthday Discount 15%', 'Free Party Accessories']
      },
      {
        id: 11,
        name: 'Premium Birthday Celebration Hoop Hangers - Luxury Party Collection',
        category: 'hoop-hangers',
        price: 649,
        originalPrice: 1199,
        rating: 4.7,
        reviews: 145,
        image: '/images/hoop_hanger/hoop_bday2.jpg',
        images: [
          '/images/hoop_hanger/hoop_bday2.jpg',
          '/images/hoop_hanger/hoop_bday1.jpg'
        ],
        badge: 'Premium',
        badgeColor: 'bg-red-500',
        description: 'Premium birthday celebration hoop hangers with luxury design elements. Features sparkling stones and intricate detailing for memorable birthday celebrations.',
        details: [
          'Brand: R&S Jewellery',
          'Material: Premium Gold Plated Silver',
          'Stone Type: American Diamonds & Colorful Gems',
          'Plating: 22K Gold Plated',
          'Hanger Length: 3.2 inches',
          'Hoop Diameter: 2.2 inches',
          'Weight: 32 grams (pair)',
          'Closure: Luxury screw-back',
          'Occasion: Luxury Birthday Parties, Milestone Celebrations',
          'Packaging: Premium gift box with birthday theme'
        ],
        inStock: true,
        stockCount: 22,
        isFeatured: true,
        isNewArrival: true,
        sizes: ['One Size'],
        colors: ['Gold', 'Rose Gold', 'Silver'],
        deliveryTime: '4-5 days',
        seller: 'R&S Jewellery Store',
        returnPolicy: '10 days replacement',
        codAvailable: true,
        emiAvailable: true,
        specialOffers: ['Premium Gift Wrapping', 'Express Delivery']
      }
    ];
  }

  getDefaultCategories() {
    return [
      { id: 'necklaces', name: 'Necklaces', icon: '🌸' },
      { id: 'earrings', name: 'Earrings', icon: '✨' },
      { id: 'bangles', name: 'Bangles & Bracelets', icon: '🟡' },
      { id: 'rings', name: 'Rings', icon: '💍' },
      { id: 'maang-tikka', name: 'Maang Tikka', icon: '🌟' },
      { id: 'anklets', name: 'Anklets', icon: '🌺' },
      { id: 'sets', name: 'Bridal Sets', icon: '👑' },
      { id: 'chains', name: 'Chains', icon: '📿', link: '/chains' },
      { id: 'hoop-hangers', name: 'Hoop Hangers', icon: '🎯' },
    ];
  }

  getDefaultOrders() {
    // Try to load orders from localStorage first
    const savedOrders = localStorage.getItem('jewelleryStore_orders');
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        console.log('Loaded orders from localStorage:', parsedOrders.length);
        return parsedOrders;
      } catch (error) {
        console.log('Error loading orders from localStorage:', error);
      }
    }
    
    // Fallback to default orders if no saved orders
    console.log('Using default orders');
    return [
      {
        id: 'ORD-2287',
        customer: {
          name: 'Priya Sharma',
          email: 'priya.sharma@email.com',
          phone: '8310096351',
          address: '123 MG Road, Bangalore, Karnataka - 560001'
        },
        items: [
          {
            id: 6,
            name: 'Elegant Wedding Hoop Hangers',
            price: 899,
            quantity: 1,
            image: '/images/hoop_hanger/hoop_wedng.jpg'
          }
        ],
        total: 899,
        paymentMethod: 'COD',
        paymentStatus: 'pending',
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'ORD-2286',
        customer: {
          name: 'Neha Gupta',
          email: 'neha.gupta@email.com',
          phone: '9876543211',
          address: '456 Brigade Road, Bangalore, Karnataka - 560025'
        },
        items: [
          {
            id: 1,
            name: 'Artificial Gold Plated Kundan Choker Necklace Set',
            price: 299,
            quantity: 2,
            image: 'https://picsum.photos/seed/kundan-choker/500/500.jpg'
          }
        ],
        total: 598,
        paymentMethod: 'Credit Card',
        paymentStatus: 'paid',
        status: 'confirmed',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  getDefaultCustomers() {
    return [
      {
        id: 'CUST-1',
        name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        phone: '8310096351',
        address: '123 MG Road, Bangalore, Karnataka - 560001',
        joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        totalOrders: 1,
        status: 'active'
      },
      {
        id: 'CUST-2',
        name: 'Neha Gupta',
        email: 'neha.gupta@email.com',
        phone: '9876543211',
        address: '456 Brigade Road, Bangalore, Karnataka - 560025',
        joinDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        totalOrders: 3,
        status: 'active'
      }
    ];
  }

  getProducts() {
    return this.products;
  }

  getCategories() {
    return this.categories;
  }

  getAnalytics() { 
    return { 
      revenue: { total: 0, month: 0, today: 0 },
      orders: { total: 0, today: 0 },
      customers: { total: 0, new: 0 },
      products: { total: this.products.length, inStock: this.products.filter(p => p.inStock).length, outOfStock: this.products.filter(p => !p.inStock).length },
      conversionRate: 3.2,
      avgOrderValue: 0
    }; 
  }
  getSupport() { return []; }
  getDiscounts() { return []; }
  getReports() { return []; }
  
  // Add missing methods for admin dashboard
  getInventoryStats() {
    return {
      totalProducts: this.products.length,
      inStock: this.products.filter(p => p.inStock).length,
      outOfStock: this.products.filter(p => !p.inStock).length,
      lowStockProducts: this.products.filter(p => p.stockCount < 5).length
    };
  }
  
  getLowStockAlerts() {
    return this.products
      .filter(p => p.stockCount < 5)
      .map(p => ({
        id: p.id,
        name: p.name,
        stockCount: p.stockCount,
        category: p.category
      }));
  }
  
  // Event system for real-time updates
  subscribe(event, callback) {
    if (!this.listeners) this.listeners = new Map();
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
    console.log('Emitting event:', event, 'with data:', data);
    if (!this.listeners) {
      console.log('No listeners map found');
      return;
    }
    const callbacks = this.listeners.get(event) || [];
    console.log('Found', callbacks.length, 'listeners for event:', event);
    callbacks.forEach(callback => callback(data));
  }
  
  // CRUD operations for products
  addProduct(product) {
    console.log('addProduct called with:', product);
    console.log('Current products count:', this.products.length);
    const newProduct = {
      ...product,
      id: Math.max(...this.products.map(p => p.id), 0) + 1
    };
    this.products.push(newProduct);
    console.log('Product added, new count:', this.products.length);
    this.emit('productAdded', newProduct);
    return newProduct;
  }
  
  updateProduct(id, updates) {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      const oldProduct = this.products[index];
      const updatedProduct = { ...oldProduct, ...updates };
      this.products[index] = updatedProduct;
      
      // Emit stock update if stock changed
      if (updates.stockCount !== undefined && updates.stockCount !== oldProduct.stockCount) {
        this.emit('stockUpdated', {
          productId: id,
          oldStock: oldProduct.stockCount,
          newStock: updates.stockCount,
          product: updatedProduct
        });
      }
      
      this.emit('productUpdated', updatedProduct);
      return updatedProduct;
    }
    return null;
  }
  
  deleteProduct(id) {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      const deleted = this.products.splice(index, 1)[0];
      this.emit('productDeleted', deleted);
      return deleted;
    }
    return null;
  }
  
  getProductById(id) {
    return this.products.find(p => p.id === id);
  }

  // Order management methods
  addOrder(orderData) {
    console.log('addOrder called with:', orderData);
    console.log('Current orders before adding:', this.orders.length);
    console.log('Current orders array:', this.orders);
    
    const newOrder = {
      id: `ORD-${Math.max(...this.orders.map(o => parseInt(o.id?.split('-')[1] || 0)), 0) + 1}`,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.orders.push(newOrder);
    
    // Save orders to localStorage for persistence
    localStorage.setItem('jewelleryStore_orders', JSON.stringify(this.orders));
    
    console.log('Order added successfully!');
    console.log('New order:', newOrder);
    console.log('Total orders after adding:', this.orders.length);
    console.log('Updated orders array:', this.orders);
    console.log('Orders saved to localStorage');
    
    // Update stock levels
    orderData.items.forEach(item => {
      const product = this.getProductById(item.id);
      if (product) {
        product.stockCount = Math.max(0, product.stockCount - item.quantity);
        if (product.stockCount === 0) {
          product.inStock = false;
        }
      }
    });
    
    // Add customer if not exists
    if (orderData.customer && !this.customers.find(c => c.email === orderData.customer.email)) {
      this.addCustomer({
        ...orderData.customer,
        joinDate: new Date().toISOString(),
        totalOrders: 1,
        status: 'active'
      });
    }
    
    console.log('Emitting orderAdded event with:', newOrder);
    this.emit('orderAdded', newOrder);
    console.log('Emitting stockUpdated event');
    this.emit('stockUpdated', { items: orderData.items });
    console.log('Order added successfully, total orders:', this.orders.length);
    return newOrder;
  }

  getOrders() {
    return this.orders;
  }

  getOrdersByCustomer(customerEmail) {
    return this.orders.filter(order => order.customer.email === customerEmail);
  }

  updateOrderStatus(orderId, status) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      this.emit('orderUpdated', order);
      return order;
    }
    return null;
  }

  // Customer management methods
  addCustomer(customerData) {
    const newCustomer = {
      id: `CUST-${Math.max(...this.customers.map(c => parseInt(c.id?.split('-')[1] || 0)), 0) + 1}`,
      ...customerData,
      createdAt: new Date().toISOString()
    };
    this.customers.push(newCustomer);
    this.emit('customerAdded', newCustomer);
    return newCustomer;
  }

  getCustomers() {
    return this.customers;
  }

  getCustomerByEmail(email) {
    return this.customers.find(c => c.email === email);
  }

  // Analytics methods
  getAnalytics() {
    const totalRevenue = this.orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const todayOrders = this.orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const today = new Date();
      return orderDate.toDateString() === today.toDateString();
    });
    const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    return {
      revenue: {
        total: totalRevenue,
        today: todayRevenue
      },
      orders: {
        total: this.orders.length,
        today: todayOrders.length
      },
      conversionRate: this.orders.length > 0 ? ((this.orders.length / 10000) * 100).toFixed(1) : 0,
      avgOrderValue: this.orders.length > 0 ? (totalRevenue / this.orders.length).toFixed(0) : 0
    };
  }

  // Support methods
  getSupport() {
    return [
      { id: 'TK-892', customer: 'Sneha Reddy', subject: 'Order delay', status: 'open', priority: 'high' },
      { id: 'TK-891', customer: 'Kavya Singh', subject: 'Product quality', status: 'resolved', priority: 'medium' },
      { id: 'TK-890', customer: 'Anjali Patel', subject: 'Shipping query', status: 'pending', priority: 'low' }
    ];
  }
}

// Create singleton instance
export const centralDataManager = new CentralDataManager();
export default centralDataManager;
