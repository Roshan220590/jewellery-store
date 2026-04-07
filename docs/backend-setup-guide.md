# Backend Setup Guide for Jewelry Store

## Option 1: Node.js + Express + MongoDB (Recommended)

### Step 1: Install Backend Dependencies
```bash
cd jewellery-store
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
npm install -D nodemon
```

### Step 2: Create Backend Structure
```
backend/
├── config/
│   └── db.js
├── models/
│   ├── Product.js
│   ├── User.js
│   └── Order.js
├── routes/
│   ├── products.js
│   ├── users.js
│   └── orders.js
├── middleware/
│   └── auth.js
├── server.js
└── package.json
```

### Step 3: Basic Server Setup
```javascript
// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Step 4: Product Model
```javascript
// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: Number,
  rating: Number,
  reviews: Number,
  image: String,
  images: [String],
  badge: String,
  badgeColor: String,
  description: String,
  details: [String],
  inStock: { type: Boolean, default: true },
  stockCount: Number,
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
```

### Step 5: Product Routes
```javascript
// backend/routes/products.js
const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 12, sort, search } = req.query;
    
    let query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    
    let sortOption = {};
    if (sort === 'price-low') sortOption.price = 1;
    if (sort === 'price-high') sortOption.price = -1;
    if (sort === 'rating') sortOption.rating = -1;
    
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product (Admin)
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
```

### Step 6: Environment Variables
```bash
# .env
MONGODB_URI=mongodb://localhost:27017/jewellery-store
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
PORT=5000
```

## Option 2: Firebase (Easier Setup)

### Step 1: Install Firebase
```bash
npm install firebase
```

### Step 2: Firebase Config
```javascript
// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

## Option 3: JSON Server (Quick Mock Backend)

### Step 1: Install JSON Server
```bash
npm install -g json-server
npm install json-server
```

### Step 2: Create Database File
```json
// db.json
{
  "products": [
    {
      "id": 1,
      "name": "Royal Kundan Choker Necklace",
      "category": "necklaces",
      "price": 1299,
      "originalPrice": 2199,
      "rating": 4.8,
      "reviews": 124,
      "image": "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&q=80"
    }
  ]
}
```

### Step 3: Start JSON Server
```bash
json-server --watch db.json --port 5000
```

## Migration Steps

### Step 1: Update Frontend to Use API
```javascript
// src/services/api.js
const API_BASE = 'http://localhost:5000/api';

export const api = {
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/products?${queryString}`);
    return response.json();
  },
  
  getProduct: async (id) => {
    const response = await fetch(`${API_BASE}/products/${id}`);
    return response.json();
  },
  
  getFeaturedProducts: async () => {
    const response = await fetch(`${API_BASE}/products/featured`);
    return response.json();
  }
};
```

### Step 2: Update Components
```javascript
// src/pages/Shop.jsx
import { api } from '../services/api';
import { useEffect, useState } from 'react';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Rest of component...
}
```

## Recommended Approach

For your jewelry store, I recommend **Node.js + Express + MongoDB** because:

1. **Scalability**: Can handle growing product catalog
2. **Flexibility**: Easy to add features like orders, users, reviews
3. **Performance**: Fast and efficient for e-commerce
4. **Control**: Full control over your data and logic
5. **Cost**: Can be hosted affordably on platforms like Heroku, Vercel, or DigitalOcean

## Next Steps

1. Choose your backend option
2. Set up the backend server
3. Migrate your static data to the database
4. Update frontend to use API calls
5. Add authentication and order management
6. Deploy both frontend and backend

Would you like me to help you implement any specific backend option?
