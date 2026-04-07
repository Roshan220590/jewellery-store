const mongoose = require('mongoose');
require('dotenv').config();

// Sample product data
const sampleProducts = [
  {
    name: "Royal Kundan Necklace",
    category: "necklaces",
    price: 1299,
    description: "Traditional Kundan necklace with intricate designs",
    image: "/images/necklaces/kundan1.jpg",
    stock: 10,
    featured: true
  },
  {
    name: "Elegant Gold Earrings",
    category: "earrings", 
    price: 899,
    description: "Beautiful gold earrings for special occasions",
    image: "/images/earrings/gold1.jpg",
    stock: 15,
    featured: true
  },
  {
    name: "Diamond Ring",
    category: "rings",
    price: 2499,
    description: "Stunning diamond ring for engagements",
    image: "/images/rings/diamond1.jpg", 
    stock: 5,
    featured: true
  }
];

async function addTestData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Add sample products
    const productsCollection = db.collection('products');
    const result = await productsCollection.insertMany(sampleProducts);
    console.log(`✅ Added ${result.insertedCount} products`);

    // Show collections count
    const collections = await db.listCollections().toArray();
    console.log('📊 Collections:', collections.map(c => c.name));
    
    // Show products count
    const productCount = await productsCollection.countDocuments();
    console.log(`💎 Total products: ${productCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addTestData();
