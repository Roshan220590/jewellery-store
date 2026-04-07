import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  console.log('ProductCard: Rendering product:', product?.name, 'image:', product?.image);
  const { addItem, checkStockAvailability } = useCart();
  // const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isInWishlist = () => false; // Temporary fix
  const addToWishlist = () => {}; // Temporary fix
  const removeFromWishlist = () => {}; // Temporary fix
  const wishlisted = isInWishlist(product.id);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.sizes && product.sizes.length > 0) {
      navigate(`/product/${product.id}`);
      return;
    }
    
    // Check stock availability
    const stockCheck = checkStockAvailability(product.id, null, 1);
    
    if (!stockCheck.canAdd) {
      if (stockCheck.maxCanAdd <= 0) {
        toast.error('Sorry, this product is out of stock!');
      } else {
        toast.error(`Only ${stockCheck.available} items available in stock!`);
      }
      return;
    }
    
    const success = addItem(product, null, 1);
    if (success) {
      toast.success('Added to cart!', { icon: '🛒' });
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist', { icon: '💔' });
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist!', { icon: '❤️' });
    }
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const secondImage = product.images && product.images.length > 1 ? product.images[1] : null;

  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden bg-gray-50" style={{ paddingBottom: '115%' }}>
        {/* Primary image */}
        <img
          src={product.image}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${secondImage && hovered ? 'opacity-0' : 'opacity-100 scale-100 group-hover:scale-105'}`}
        />
        {/* Secondary image on hover */}
        {secondImage && (
          <img
            src={secondImage}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <span className="bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-full tracking-wide">Out of Stock</span>
          </div>
        )}

        {/* Slide-up Add to Cart */}
        {product.inStock && (
          <div className={`absolute bottom-0 inset-x-0 z-10 transition-transform duration-300 ${hovered ? 'translate-y-0' : 'translate-y-full'}`}>
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-700 to-rose-600 hover:from-amber-600 hover:to-amber-500 text-white text-xs font-bold py-3 transition-all"
            >
              <ShoppingCart size={13} />
              {product.sizes && product.sizes.length > 0 ? 'Select Options' : 'Add to Cart'}
            </button>
          </div>
        )}
      </Link>

      {/* Badges — top left */}
      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-20">
        {product.badge && (
          <span className={`${product.badgeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse`}>
            {product.badge}
          </span>
        )}
        {product.badge === 'NEW' && (
          <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-bounce">
            NEW
          </span>
        )}
        {discount >= 5 && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
            -{discount}%
          </span>
        )}
      </div>

      {/* Quick View Button - appears on hover */}
      <div className={`absolute top-2.5 right-12 z-20 transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(`/product/${product.id}`);
          }}
          className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          title="Quick View"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>

      {/* Wishlist — top right, always visible */}
      <button
        onClick={handleWishlist}
        className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 ${
          wishlisted ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-white text-gray-400 hover:text-red-400'
        }`}
      >
        <Heart 
          size={14} 
          fill={wishlisted ? 'currentColor' : 'none'} 
          className={`transition-all duration-300 ${wishlisted ? 'scale-110' : 'scale-100'}`}
        />
      </button>

      {/* Product Info */}
      <div className="p-4">
        <p className="font-body text-xs-pro text-gray-400 uppercase tracking-wider capitalize mb-2 font-semibold">
          {product.category.replace('-', ' ')}
        </p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-heading text-base-pro font-semibold text-gray-800 hover:text-yellow-700 transition-colors line-clamp-2 leading-tight mb-3 text-elevated">
            {product.name}
          </h3>
        </Link>

        {/* Product Description */}
        <p className="font-body text-sm-pro text-gray-600 line-clamp-2 leading-relaxed mb-3" style={{ 
          fontFamily: '"Inter", "Helvetica", sans-serif',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          color: '#4b5563'
        }}>
          {product.description}
        </p>

        {/* Stars */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} size={12} className={s <= Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
            ))}
          </div>
          <span className="font-body text-xs-pro text-gray-500">({product.reviews} reviews)</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 flex-wrap mb-2">
          <span className="font-heading text-lg-pro font-bold text-gray-900" style={{ 
            fontFamily: '"Playfair Display", "Georgia", serif'
          }}>
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice > product.price && (
            <span className="font-body text-sm-pro text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
          {discount >= 5 && (
            <span className="font-body text-xs-pro font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{discount}% OFF</span>
          )}
        </div>

        {/* Stock Information */}
        <div className="flex items-center gap-2">
          {product.inStock ? (
            <>
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-xs text-gray-600">
                {product.stockCount > 0 ? `${product.stockCount} available` : 'In Stock'}
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="text-xs text-red-600 font-semibold">Out of Stock</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
