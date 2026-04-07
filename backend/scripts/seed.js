const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
require('dotenv').config();

// Sample products data
const sampleProducts = [
  {
    name: 'Royal Kundan Choker Necklace',
    category: 'necklaces',
    price: 1299,
    originalPrice: 2199,
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80',
      'https://images.unsplash.com/photo-1573408301185-9519592c4b46?w=500&q=80',
    ],
    badge: 'Bestseller',
    badgeColor: 'bg-orange-500',
    description: 'Elegant Kundan choker set with intricate gold-plated work. Perfect for weddings and festive occasions. Features premium quality stones with anti-tarnish coating.',
    details: ['Material: Gold-plated brass', 'Stone: Kundan (synthetic)', 'Finish: Matte gold', 'Occasion: Wedding, Festival'],
    inStock: true,
    stockCount: 15,
    isFeatured: true,
    isNewArrival: false,
    tags: ['kundan', 'choker', 'wedding', 'traditional'],
    weight: '45g',
    material: 'Gold-plated brass with Kundan stones',
    dimensions: {
      length: '14 inches',
      width: '1.5 inches'
    }
  },
  {
    name: 'Pearl Drop Earrings',
    category: 'earrings',
    price: 449,
    originalPrice: 799,
    rating: 4.6,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1635797255064-4f09ab0c51e3?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1635797255064-4f09ab0c51e3?w=500&q=80',
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500&q=80',
    ],
    badge: 'Sale',
    badgeColor: 'bg-red-500',
    description: 'Delicate pearl drop earrings with silver-plated settings. Lightweight and comfortable for all-day wear. Perfect for both traditional and modern outfits.',
    details: ['Material: Silver-plated brass', 'Stone: Freshwater pearls', 'Finish: Polished silver', 'Length: 2.5 inches'],
    inStock: true,
    stockCount: 25,
    isFeatured: false,
    isNewArrival: false,
    tags: ['pearl', 'drop', 'silver', 'lightweight'],
    weight: '12g',
    material: 'Silver-plated brass with freshwater pearls',
    dimensions: {
      length: '2.5 inches',
      width: '0.8 inches'
    }
  },
  {
    name: 'Gold Plated Bangles Set',
    category: 'bangles',
    price: 899,
    originalPrice: 1499,
    rating: 4.7,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1596944924616-7a1b32b0b647?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1596944924616-7a1b32b0b647?w=500&q=80',
      'https://images.unsplash.com/photo-1527631746610-52773f4532db?w=500&q=80',
    ],
    badge: 'New',
    badgeColor: 'bg-green-500',
    description: 'Set of 6 gold-plated bangles with intricate meenakari work. Perfect for daily wear and special occasions. Comes in a beautiful gift box.',
    details: ['Material: Gold-plated brass', 'Work: Meenakari', 'Finish: Glossy gold', 'Size: 2.4 inches diameter'],
    inStock: true,
    stockCount: 18,
    isFeatured: true,
    isNewArrival: true,
    tags: ['bangles', 'gold', 'meenakari', 'set'],
    weight: '120g',
    material: 'Gold-plated brass with meenakari work',
    dimensions: {
      diameter: '2.4 inches',
      width: '0.3 inches'
    }
  },
  {
    name: 'Solitaire Diamond Ring',
    category: 'rings',
    price: 2199,
    originalPrice: 3499,
    rating: 4.9,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1515372039744-b8e02a3ae846?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8e02a3ae846?w=500&q=80',
      'https://images.unsplash.com/photo-1604438327059-0b5a0a4a1a3f?w=500&q=80',
    ],
    badge: 'Limited',
    badgeColor: 'bg-purple-500',
    description: 'Stunning solitaire ring with lab-created diamond. Set in 18k gold-plated silver. Perfect for engagements and special moments.',
    details: ['Material: 18k gold-plated silver', 'Stone: Lab-created diamond', 'Setting: Prong setting', 'Size: Available 5-9'],
    inStock: true,
    stockCount: 8,
    isFeatured: true,
    isNewArrival: false,
    tags: ['ring', 'diamond', 'solitaire', 'engagement'],
    weight: '8g',
    material: '18k gold-plated silver with lab diamond',
    dimensions: {
      bandWidth: '2mm',
      stoneSize: '0.5 carat'
    }
  },
  {
    name: 'Traditional Maang Tikka',
    category: 'maang-tikka',
    price: 649,
    originalPrice: 999,
    rating: 4.5,
    reviews: 67,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80',
      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&q=80',
    ],
    badge: 'Trending',
    badgeColor: 'bg-blue-500',
    description: 'Traditional maang tikka with pearl and stone work. Adjustable chain for perfect fit. Ideal for brides and festive occasions.',
    details: ['Material: Gold-plated brass', 'Stones: Pearls and synthetic gems', 'Length: Adjustable', 'Style: Traditional'],
    inStock: true,
    stockCount: 12,
    isFeatured: false,
    isNewArrival: true,
    tags: ['maang-tikka', 'traditional', 'pearl', 'bridal'],
    weight: '25g',
    material: 'Gold-plated brass with pearls and gems',
    dimensions: {
      length: '10 inches adjustable',
      pendantSize: '1.5 inches'
    }
  },
  {
    name: 'Anklet with Bells',
    category: 'anklets',
    price: 299,
    originalPrice: 499,
    rating: 4.4,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1573408301185-9519592c4b46?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1573408301185-9519592c4b46?w=500&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8e02a3ae846?w=500&q=80',
    ],
    badge: 'Sale',
    badgeColor: 'bg-red-500',
    description: 'Delicate silver anklet with small bells. Adjustable chain for comfortable fit. Makes subtle sound with movement.',
    details: ['Material: Silver-plated brass', 'Features: Small bells', 'Length: Adjustable 9-11 inches', 'Finish: Polished silver'],
    inStock: true,
    stockCount: 30,
    isFeatured: false,
    isNewArrival: false,
    tags: ['anklet', 'bells', 'silver', 'adjustable'],
    weight: '18g',
    material: 'Silver-plated brass with bells',
    dimensions: {
      length: '9-11 inches adjustable',
      width: '0.2 inches'
    }
  },
  {
    name: 'Bridal Necklace Set',
    category: 'sets',
    price: 3499,
    originalPrice: 5999,
    rating: 4.9,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80',
      'https://images.unsplash.com/photo-1573408301185-9519592c4b46?w=500&q=80',
    ],
    badge: 'Bestseller',
    badgeColor: 'bg-orange-500',
    description: 'Complete bridal set with necklace, earrings, and maang tikka. Intricate Kundan work with premium quality stones. Perfect for weddings.',
    details: ['Set: Necklace + Earrings + Maang Tikka', 'Material: Gold-plated brass', 'Stones: High-quality Kundan', 'Finish: Antique gold'],
    inStock: true,
    stockCount: 6,
    isFeatured: true,
    isNewArrival: false,
    tags: ['bridal', 'set', 'kundan', 'wedding'],
    weight: '280g',
    material: 'Gold-plated brass with premium Kundan',
    dimensions: {
      necklaceLength: '16 inches',
      earringsLength: '2 inches',
      tikkaLength: '10 inches'
    }
  },
  {
    name: 'Gold Chain',
    category: 'chains',
    price: 799,
    originalPrice: 1299,
    rating: 4.6,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1596944924616-7a1b32b0b647?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1596944924616-7a1b32b0b647?w=500&q=80',
      'https://images.unsplash.com/photo-1527631746610-52773f4532db?w=500&q=80',
    ],
    badge: 'New',
    badgeColor: 'bg-green-500',
    description: 'Classic gold chain with secure clasp. Perfect for daily wear or layering with pendants. Hypoallergenic and skin-friendly.',
    details: ['Material: Gold-plated brass', 'Length: 20 inches', 'Width: 2mm', 'Clasp: Lobster clasp'],
    inStock: true,
    stockCount: 22,
    isFeatured: false,
    isNewArrival: true,
    tags: ['chain', 'gold', 'daily-wear', 'layering'],
    weight: '35g',
    material: 'Gold-plated brass',
    dimensions: {
      length: '20 inches',
      width: '2mm',
      claspType: 'Lobster'
    }
  },
  {
    name: 'Hoop Hangers',
    category: 'hoop-hangers',
    price: 349,
    originalPrice: 599,
    rating: 4.3,
    reviews: 78,
    image: 'https://images.unsplash.com/photo-1635797255064-4f09ab0c51e3?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1635797255064-4f09ab0c51e3?w=500&q=80',
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500&q=80',
    ],
    badge: 'Trending',
    badgeColor: 'bg-blue-500',
    description: 'Stylish hoop hangers with secure lock mechanism. Lightweight and comfortable for extended wear. Modern design for contemporary fashion.',
    details: ['Material: Silver-plated brass', 'Diameter: 2 inches', 'Lock: Secure screw-back', 'Finish: Polished silver'],
    inStock: true,
    stockCount: 20,
    isFeatured: false,
    isNewArrival: true,
    tags: ['hoops', 'hangers', 'modern', 'contemporary'],
    weight: '15g',
    material: 'Silver-plated brass',
    dimensions: {
      diameter: '2 inches',
      thickness: '2mm',
      lockType: 'Screw-back'
    }
  }
];

// Sample categories data
const sampleCategories = [
  { id: 'necklaces', name: 'Necklaces', icon: '🌸', description: 'Elegant necklaces for every occasion' },
  { id: 'earrings', name: 'Earrings', icon: '✨', description: 'Beautiful earrings to complement your look' },
  { id: 'bangles', name: 'Bangles & Bracelets', icon: '🟡', description: 'Traditional and modern bangles' },
  { id: 'rings', name: 'Rings', icon: '💍', description: 'Stunning rings for special moments' },
  { id: 'maang-tikka', name: 'Maang Tikka', icon: '🌟', description: 'Traditional forehead jewelry' },
  { id: 'anklets', name: 'Anklets', icon: '🌺', description: 'Delicate anklets with traditional designs' },
  { id: 'sets', name: 'Bridal Sets', icon: '👑', description: 'Complete jewelry sets for brides' },
  { id: 'chains', name: 'Chains', icon: '📿', description: 'Classic chains for daily wear' },
  { id: 'hoop-hangers', name: 'Hoop Hangers', icon: '🎯', description: 'Modern hoop earrings' }
];

// Seed database
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    
    console.log('🗑️ Cleared existing data');
    
    // Insert categories
    const categories = await Category.insertMany(sampleCategories);
    console.log(`✅ Inserted ${categories.length} categories`);
    
    // Insert products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${products.length} products`);
    
    // Create admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@rsjewellery.com',
      password: 'admin123',
      role: 'admin',
      isEmailVerified: true
    });
    
    await adminUser.save();
    console.log('✅ Created admin user');
    
    // Create sample user
    const sampleUser = new User({
      firstName: 'Roshan',
      lastName: 'Sawkar',
      email: 'customer@example.com',
      password: 'customer123',
      phone: '+91 9876543210',
      addresses: [{
        type: 'home',
        street: '123 Jewelry Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
        isDefault: true
      }],
      isEmailVerified: true
    });
    
    await sampleUser.save();
    console.log('✅ Created sample user');
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@rsjewellery.com / admin123');
    console.log('Customer: customer@example.com / customer123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding function
seedDatabase();
