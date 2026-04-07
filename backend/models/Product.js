const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    enum: ['necklaces', 'earrings', 'bangles', 'rings', 'maang-tikka', 'anklets', 'sets', 'chains', 'hoop-hangers']
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: { 
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  rating: { 
    type: Number, 
    min: 0, 
    max: 5, 
    default: 0 
  },
  reviews: { 
    type: Number, 
    min: 0, 
    default: 0 
  },
  image: { 
    type: String, 
    required: [true, 'Product image is required']
  },
  images: [{
    type: String
  }],
  badge: { 
    type: String,
    enum: ['Bestseller', 'Sale', 'New', 'Limited', 'Trending'],
    default: null
  },
  badgeColor: { 
    type: String,
    enum: ['bg-orange-500', 'bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500'],
    default: 'bg-orange-500'
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  details: [{ 
    type: String 
  }],
  inStock: { 
    type: Boolean, 
    default: true 
  },
  stockCount: { 
    type: Number, 
    min: 0, 
    default: 0 
  },
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  isNewArrival: { 
    type: Boolean, 
    default: false 
  },
  tags: [{ 
    type: String 
  }],
  weight: {
    type: String, // e.g., "20g", "50g"
    default: null
  },
  material: {
    type: String, // e.g., "Gold-plated brass", "Silver"
    default: null
  },
  dimensions: {
    length: String,
    width: String,
    height: String
  },
  careInstructions: {
    type: String,
    default: "Keep away from water and chemicals. Clean with dry cloth."
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Index for search functionality
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isNewArrival: 1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Product', productSchema);
