// SIMPLE BACKUP - Just use this instead of the complex backend
// This turns your current products.js into a working API

const express = require('express');
const cors = require('cors');
const { products, categories } = require('./src/data/products.js');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/products', (req, res) => {
  const { category, search, sort } = req.query;
  let filteredProducts = [...products];

  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  // Filter by search
  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Sort
  if (sort === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  res.json({
    products: filteredProducts,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: filteredProducts.length
    }
  });
});

app.get('/api/products/featured', (req, res) => {
  const featured = products.filter(p => p.isFeatured);
  res.json(featured);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Simple API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Simple API running on http://localhost:${PORT}`);
  console.log(`📍 Products: http://localhost:${PORT}/api/products`);
  console.log(`📍 Categories: http://localhost:${PORT}/api/categories`);
});

module.exports = app;
