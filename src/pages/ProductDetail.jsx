import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Star, Package, Truck, Shield, RefreshCw, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import websiteProductService from '../data/websiteProductService';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addItem, checkStockAvailability } = useCart();
  // const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const addToWishlist = () => {}; // Temporary fix
  const removeFromWishlist = () => {}; // Temporary fix
  const isInWishlist = () => false; // Temporary fix

  useEffect(() => {
    loadProduct();
    
    // Subscribe to real-time updates from admin dashboard
    const unsubscribeProductUpdated = websiteProductService.subscribe('productUpdated', (updatedProduct) => {
      if (updatedProduct.id === parseInt(id)) {
        console.log('Product updated from admin dashboard:', updatedProduct);
        setProduct(updatedProduct);
        toast.info(`Product "${updatedProduct.name}" updated!`);
      }
    });

    const unsubscribeStockUpdated = websiteProductService.subscribe('stockUpdated', (data) => {
      if (data.productId === parseInt(id)) {
        console.log('Stock updated from admin dashboard:', data);
        setProduct(prev => prev ? { ...prev, stockCount: data.newStock } : null);
        toast.info(`Stock updated to ${data.newStock} units`);
      }
    });

    return () => {
      unsubscribeProductUpdated();
      unsubscribeStockUpdated();
    };
  }, [id]);

  const loadProduct = () => {
    try {
      const productData = websiteProductService.getProductById(parseInt(id));
      
      if (productData) {
        console.log('Website loaded product detail:', productData);
        setProduct(productData);
        
        // Load related products
        const related = websiteProductService.getRelatedProducts(parseInt(id));
        setRelatedProducts(related);
      } else {
        toast.error('Product not found');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Error loading product');
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link to="/shop" className="text-blue-600 hover:text-blue-800">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    
    // Check stock availability
    const stockCheck = checkStockAvailability(product.id, selectedSize, quantity);
    
    if (!stockCheck.canAdd) {
      if (stockCheck.maxCanAdd <= 0) {
        toast.error(`Sorry, this product is out of stock!`);
      } else {
        toast.error(`Only ${stockCheck.available} items available in stock. You requested ${quantity} items.`);
      }
      return;
    }
    
    const success = addItem(product, selectedSize, quantity);
    if (success) {
      toast.success('Added to cart!');
    }
  };

  const handleWishlist = () => {
    if (wishlisted) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-3 text-sm font-medium text-gray-500 mb-10" style={{ fontFamily: '"Inter", "Helvetica", sans-serif' }}>
          <Link to="/" className="hover:text-yellow-600 transition-colors duration-300 flex items-center gap-2">
            <span>🏠</span> Home
          </Link>
          <span className="text-yellow-500">›</span>
          <Link to="/shop" className="hover:text-yellow-600 transition-colors duration-300">Shop</Link>
          <span className="text-yellow-500">›</span>
          <span className="text-gray-700 capitalize font-semibold">{product.category.replace('-', ' ')}</span>
          <span className="text-yellow-500">›</span>
          <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === idx ? 'border-amber-500' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight" style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}>
              {product.name}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-6 mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={24} className={s <= Math.round(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 fill-gray-300'} />
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-800" style={{ fontFamily: '"Inter", "Helvetica", sans-serif' }}>
                  {product.rating} out of 5
                </span>
                <span className="text-sm text-gray-600">{product.reviews} customer reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl md:text-5xl font-bold text-gray-900" style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}>
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <>
                      <span className="text-xl text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-lg font-bold px-3 py-1 rounded-full">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>
                {product.inStock ? (
                  <div className="flex items-center gap-2 mt-3">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-sm font-semibold text-green-700">
                      In Stock - {product.stockCount} {product.stockCount === 1 ? 'item' : 'items'} available
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-3">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="text-sm font-semibold text-red-700">Out of Stock</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2" style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}>
                <span>💎</span> Product Description
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed" style={{ fontFamily: '"Inter", "Helvetica", sans-serif' }}>
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2" style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}>
                  <span>📏</span> Select Size
                </h3>
                <div className="flex gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-300 ${
                        selectedSize === size
                          ? 'border-yellow-500 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg transform scale-105'
                          : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 text-gray-700'
                      }`}
                      style={{ fontFamily: '"Inter", "Helvetica", sans-serif' }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2" style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}>
                <span>🔢</span> Quantity
              </h3>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-yellow-500 hover:border-yellow-500 hover:text-white transition-all duration-300 font-bold text-lg"
                >
                  -
                </button>
                <span className="w-16 text-center text-xl font-bold text-gray-800" style={{ fontFamily: '"Inter", "Helvetica", sans-serif' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-yellow-500 hover:border-yellow-500 hover:text-white transition-all duration-300 font-bold text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-10">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 ${
                  product.inStock
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                style={{ fontFamily: '"Inter", "Helvetica", sans-serif' }}
              >
                <ShoppingCart size={24} />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                onClick={handleWishlist}
                className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                  wishlisted
                    ? 'border-red-500 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                    : 'border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600'
                }`}
              >
                <Heart size={24} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                <Truck className="w-12 h-12 mx-auto mb-3 text-blue-500" />
                <h4 className="font-bold text-gray-800 mb-2" style={{ fontFamily: '"Inter", "Helvetica", sans-serif' }}>Free Delivery</h4>
                <p className="text-sm text-gray-600">Free shipping on all orders above ₹999</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
                <RotateCcw className="w-12 h-12 mx-auto mb-3 text-green-500" />
                <h4 className="font-bold text-gray-800 mb-2" style={{ fontFamily: '"Inter", "Helvetica", sans-serif' }}>7-Day Returns</h4>
                <p className="text-sm text-gray-600">Easy returns within 7 days of delivery</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                <Shield className="w-12 h-12 mx-auto mb-3 text-purple-500" />
                <h4 className="font-bold text-gray-800 mb-2" style={{ fontFamily: '"Inter", "Helvetica", sans-serif' }}>100% Authentic</h4>
                <p className="text-sm text-gray-600">Guaranteed genuine products</p>
              </div>
            </div>

            {/* Details */}
            <div className="border-t-2 border-gray-200 pt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3" style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}>
                <span>📋</span> Product Details
              </h3>
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl">
                <ul className="space-y-3">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700" style={{ fontFamily: '"Inter", "Helvetica", sans-serif' }}>
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-base">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}>
                You Might Also Like
              </h2>
              <p className="text-lg text-gray-600" style={{ fontFamily: '"Inter", "Helvetica", sans-serif' }}>
                Discover more beautiful pieces from our collection
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {relatedProducts.map(p => (
                <div key={p.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <Link to={`/product/${p.id}`} className="block">
                    <div className="relative">
                      <img src={p.image} alt={p.name} className="w-full h-56 object-cover" />
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Quick View
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 mb-3 text-base leading-tight" style={{ fontFamily: '"Inter", "Helvetica", sans-serif' }}>
                        {p.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-700" style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}>
                          ₹{p.price.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-gray-600">{p.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
