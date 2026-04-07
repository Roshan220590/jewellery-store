import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, ChevronDown, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
// import { useWishlist } from '../context/WishlistContext'; // Temporarily disabled
import websiteProductService from '../data/websiteProductService';
import toast from 'react-hot-toast';

const genders = ['All', 'Male', 'Female', 'Unisex'];
const lengths = ['All', '16"', '18"', '20"', '22"', '24"'];
const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest First' },
];

function ChainCard({ product }) {
  const { addItem } = useCart();
  // const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isInWishlist = () => false; // Temporary fix
  const addToWishlist = () => {}; // Temporary fix
  const removeFromWishlist = () => {}; // Temporary fix
  const wishlisted = isInWishlist(product.id);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, null, 1);
    toast.success(`${product.name} added to cart!`, { icon: '🛒' });
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

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-square bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <span className={`absolute top-3 left-3 ${product.badgeColor} text-white text-xs font-semibold px-2.5 py-1 rounded-full`}>
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-full">Out of Stock</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          {product.inStock && (
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold py-2 rounded-full transition-colors"
            >
              <ShoppingCart size={13} /> Add to Cart
            </button>
          )}
        </div>
      </Link>

      <button
        onClick={handleWishlist}
        style={{
          top: product.badge && discount > 0 ? '3.5rem' : product.badge ? '3.5rem' : discount > 0 ? '3.5rem' : '0.75rem',
          right: '0.75rem',
        }}
        className={`absolute p-2 bg-white rounded-full shadow-md transition-all hover:scale-110 z-10 ${
          wishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
        }`}
      >
        <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
      </button>

      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          {product.gender && (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                product.gender === 'Male'
                  ? 'bg-blue-100 text-blue-700'
                  : product.gender === 'Female'
                  ? 'bg-pink-100 text-pink-700'
                  : 'bg-purple-100 text-purple-700'
              }`}
            >
              {product.gender === 'Male' ? '♂' : product.gender === 'Female' ? '♀' : '⚥'} {product.gender}
            </span>
          )}
          {product.length && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
              {product.length}
            </span>
          )}
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-800 hover:text-yellow-600 transition-colors line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={11}
                className={s <= Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
          <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export default function Chains() {
  const [gender, setGender] = useState('All');
  const [length, setLength] = useState('All');
  const [sort, setSort] = useState('default');
  const [allProducts, setAllProducts] = useState(() => websiteProductService.getProducts());

  useEffect(() => {
    const unsubs = [
      websiteProductService.subscribe('productAdded', () => setAllProducts(websiteProductService.getProducts())),
      websiteProductService.subscribe('productUpdated', () => setAllProducts(websiteProductService.getProducts())),
      websiteProductService.subscribe('productDeleted', () => setAllProducts(websiteProductService.getProducts())),
      websiteProductService.subscribe('productsReset', () => setAllProducts(websiteProductService.getProducts())),
    ];
    return () => unsubs.forEach(fn => fn && fn());
  }, []);

  const chainProducts = useMemo(() => allProducts.filter((p) => p.category === 'chains'), [allProducts]);

  const filtered = useMemo(() => {
    let list = [...chainProducts];
    if (gender !== 'All') list = list.filter((p) => p.gender === gender);
    if (length !== 'All') list = list.filter((p) => p.length === length);
    switch (sort) {
      case 'price-asc': return list.sort((a, b) => a.price - b.price);
      case 'price-desc': return list.sort((a, b) => b.price - a.price);
      case 'rating': return list.sort((a, b) => b.rating - a.rating);
      case 'newest': return list.sort((a, b) => b.id - a.id);
      default: return list;
    }
  }, [gender, length, sort, chainProducts]);

  const clearFilters = () => {
    setGender('All');
    setLength('All');
  };

  const activeFilters = (gender !== 'All' ? 1 : 0) + (length !== 'All' ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div
        className="relative py-14 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 40%, #D4AF37 0%, transparent 50%), radial-gradient(circle at 10% 80%, #D4AF37 0%, transparent 40%)',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
            <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-yellow-400">Chains</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">
            � Chains{' '}
            <span style={{ color: '#D4AF37' }}>Collection</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-xl mb-8">
            Premium gold-plated &amp; silver chains for men and women. Available in multiple lengths and styles.
          </p>
          <div className="flex gap-8 flex-wrap">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{chainProducts.length}+</p>
              <p className="text-xs text-gray-400 mt-0.5">Designs</p>
            </div>
            <div className="w-px bg-gray-700 self-stretch" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">5</p>
              <p className="text-xs text-gray-400 mt-0.5">Length Options</p>
            </div>
            <div className="w-px bg-gray-700 self-stretch" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-xs text-gray-400 mt-0.5">Categories</p>
            </div>
            <div className="w-px bg-gray-700 self-stretch" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">₹449+</p>
              <p className="text-xs text-gray-400 mt-0.5">Starting Price</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-[64px] md:top-[84px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-y-3 gap-x-5 items-center justify-between">
            <div className="flex flex-wrap gap-y-3 gap-x-5 items-center">
              {/* Gender Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Gender</span>
                <div className="flex gap-1.5 flex-wrap">
                  {genders.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        gender === g
                          ? 'bg-yellow-500 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {g === 'Male' ? '♂ Male' : g === 'Female' ? '♀ Female' : g === 'Unisex' ? '⚥ Unisex' : g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Length Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Length</span>
                <div className="flex gap-1.5 flex-wrap">
                  {lengths.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLength(l)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        length === l
                          ? 'bg-yellow-500 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {activeFilters > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-semibold transition-colors"
                >
                  <X size={12} /> Clear filters
                </button>
              )}
            </div>

            {/* Sort & Count */}
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-sm text-gray-500 hidden sm:block">
                {filtered.length} product{filtered.length !== 1 ? 's' : ''}
              </span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-700 pr-8 bg-white cursor-pointer focus:outline-none focus:border-yellow-400"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeFilters > 0 && (
        <div className="max-w-7xl mx-auto px-4 pt-4 flex flex-wrap gap-2">
          {gender !== 'All' && (
            <button
              onClick={() => setGender('All')}
              className="flex items-center gap-1.5 bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-yellow-200 transition-colors"
            >
              {gender === 'Male' ? '♂' : gender === 'Female' ? '♀' : '⚥'} {gender} <X size={11} />
            </button>
          )}
          {length !== 'All' && (
            <button
              onClick={() => setLength('All')}
              className="flex items-center gap-1.5 bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-yellow-200 transition-colors"
            >
              {length} <X size={11} />
            </button>
          )}
        </div>
      )}

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">�</div>
            <h3 className="font-semibold text-gray-700 text-lg mb-2">No chains found</h3>
            <p className="text-gray-400 text-sm mb-6">Try different filter options</p>
            <button
              onClick={clearFilters}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((p) => (
              <ChainCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
