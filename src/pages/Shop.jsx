import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, Search, LayoutGrid, List, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import centralDataManager from '../data/centralDataManager';
import websiteProductService from '../data/websiteProductService';

const categoryImages = {
  'necklaces': '/images/categories/necklace.jpg',
  'earrings': '/images/categories/earrings.jpg',
  'bangles': '/images/categories/bangles.jpg',
  'rings': '/images/categories/rings.jpg',
  'maang-tikka': '/images/categories/maang-tikka.jpg',
  'anklets': '/images/categories/anklets.jpg',
  'sets': '/images/categories/sets.jpg',
  'chains': '/images/categories/chains.jpg',
  'hoop-hangers': '/images/hoop_hanger/hoop_cat.jpg',
};

const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest First' },
];

export default function Shop() {
  const [allProducts, setAllProducts] = useState(() => websiteProductService.getProducts());
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 6000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedBadges, setSelectedBadges] = useState([]);

  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  const tagParam = searchParams.get('tag');

  useEffect(() => {
    if (categoryParam) setSelectedCategories([categoryParam]);
  }, [categoryParam]);

  useEffect(() => {
    const unsubs = [
      websiteProductService.subscribe('productAdded', () => {
        console.log('Shop: Product added, refreshing...');
        setAllProducts([...websiteProductService.getProducts()]);
      }),
      websiteProductService.subscribe('productUpdated', () => {
        console.log('Shop: Product updated, refreshing...');
        setAllProducts([...websiteProductService.getProducts()]);
      }),
      websiteProductService.subscribe('productDeleted', () => {
        console.log('Shop: Product deleted, refreshing...');
        setAllProducts([...websiteProductService.getProducts()]);
      }),
      websiteProductService.subscribe('productsReset', () => {
        console.log('Shop: Products reset, refreshing...');
        setAllProducts([...websiteProductService.getProducts()]);
      }),
    ];
    return () => unsubs.forEach(fn => fn && fn());
  }, []);

  const toggleCategory = (catId) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    setSearchParams(params);
  };

  const toggleBadge = (badge) => {
    setSelectedBadges(prev =>
      prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 6000]);
    setInStockOnly(false);
    setSelectedRating(0);
    setSelectedBadges([]);
    setSort('default');
    setSearchParams({});
  };

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (selectedCategories.length > 0) {
      list = list.filter(p => selectedCategories.includes(p.category));
    }
    if (searchParam) {
      const q = searchParam.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (tagParam === 'new') list = list.filter(p => p.isNewArrival);
    if (tagParam === 'sale') list = list.filter(p => p.originalPrice > p.price);
    if (inStockOnly) list = list.filter(p => p.inStock);
    if (selectedRating > 0) list = list.filter(p => p.rating >= selectedRating);
    if (selectedBadges.length > 0) {
      list = list.filter(p => {
        // Check if product matches any selected badge (color, material, or occasion)
        const hasMatchingBadge = selectedBadges.some(badge => {
          // Check badge field
          if (p.badge === badge) return true;
          // Check occasions array
          if (p.occasions && p.occasions.includes(badge)) return true;
          // Check color in name or description
          if (p.name.toLowerCase().includes(badge.toLowerCase()) || 
              (p.description && p.description.toLowerCase().includes(badge.toLowerCase()))) return true;
          // Check details array for material or other attributes
          if (p.details && p.details.some(detail => detail.toLowerCase().includes(badge.toLowerCase()))) return true;
          return false;
        });
        return hasMatchingBadge;
      });
    }
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sort) {
      case 'price-asc': return list.sort((a, b) => a.price - b.price);
      case 'price-desc': return list.sort((a, b) => b.price - a.price);
      case 'rating': return list.sort((a, b) => b.rating - a.rating);
      case 'newest': return list.sort((a, b) => b.id - a.id);
      default: return list;
    }
  }, [allProducts, selectedCategories, searchParam, tagParam, inStockOnly, priceRange, sort, selectedRating, selectedBadges]);

  const pageTitle = tagParam === 'new' ? 'New Arrivals'
    : tagParam === 'sale' ? 'Sale Items'
    : searchParam ? `Search: "${searchParam}"`
    : categoryParam ? centralDataManager.getCategories().find(c => c.id === categoryParam)?.name || 'Products'
    : 'All Products';

  const FilterPanel = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <h3 className="font-bold text-lg text-gray-900" style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}>Filters</h3>
        <button onClick={clearFilters} className="text-sm text-yellow-600 hover:text-yellow-700 font-semibold transition-colors duration-300">
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2" style={{ fontFamily: '"Inter", "Helvetica", sans-serif' }}>
          <span>🏷️</span> Category
        </h4>
        <div className="space-y-3">
          {centralDataManager.getCategories().map(cat => (
            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-yellow-50 transition-all duration-300">
              <input type="checkbox" checked={selectedCategories.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
                className="w-5 h-5 rounded accent-yellow-500 cursor-pointer transform scale-110" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-yellow-700 transition-colors duration-300" style={{ fontFamily: '"Inter", "Helvetica", sans-serif' }}>
                {cat.icon} {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2" style={{ fontFamily: '"Inter", "Helvetica", sans-serif' }}>
          <span>💰</span> Price Range
        </h4>
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
          <div className="text-center mb-3">
            <span className="text-sm font-semibold text-gray-700">
              ₹{priceRange[0].toLocaleString()} – ₹{priceRange[1].toLocaleString()}
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-600 w-12">₹0</span>
              <input 
                type="range" 
                min={0} 
                max={6000} 
                step={50}
                value={priceRange[0]}
                onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="flex-1 accent-yellow-500 h-2 rounded-lg cursor-pointer" 
              />
              <input 
                type="range" 
                min={0} 
                max={6000} 
                step={50}
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="flex-1 accent-yellow-500 h-2 rounded-lg cursor-pointer" 
              />
              <span className="text-xs font-medium text-gray-600 w-12">₹6K</span>
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-600 bg-white/50 px-3 py-2 rounded-lg">
              <span>Min: ₹{priceRange[0].toLocaleString()}</span>
              <span>Max: ₹{priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-green-50 transition-all duration-300 border border-gray-200 hover:border-green-300">
          <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)}
            className="w-5 h-5 rounded accent-green-500 cursor-pointer transform scale-110" />
          <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>✅</span> In Stock Only
          </span>
        </label>
      </div>

      {/* Color Filter */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Color</h4>
        <div className="grid grid-cols-4 gap-2">
          {[
            { name: 'Gold', color: 'bg-gradient-to-br from-yellow-300 to-yellow-600' },
            { name: 'Rose Gold', color: 'bg-gradient-to-br from-pink-300 to-pink-500' },
            { name: 'Silver', color: 'bg-gradient-to-br from-gray-300 to-gray-500' },
            { name: 'Black', color: 'bg-gradient-to-br from-gray-800 to-black' },
            { name: 'Blue', color: 'bg-gradient-to-br from-blue-300 to-blue-600' },
            { name: 'Red', color: 'bg-gradient-to-br from-red-300 to-red-600' },
            { name: 'Green', color: 'bg-gradient-to-br from-green-300 to-green-600' },
            { name: 'Multi', color: 'bg-gradient-to-br from-purple-300 via-pink-300 to-yellow-300' },
          ].map(color => (
            <button
              key={color.name}
              onClick={() => {
                if (selectedBadges.includes(color.name)) {
                  setSelectedBadges(selectedBadges.filter(b => b !== color.name));
                } else {
                  setSelectedBadges([...selectedBadges, color.name]);
                }
              }}
              className={`relative h-10 rounded-lg ${color.color} hover:scale-110 transition-transform duration-200 border-2 ${
                selectedBadges.includes(color.name) ? 'border-gray-800 shadow-lg' : 'border-transparent'
              }`}
              title={color.name}
            >
              {selectedBadges.includes(color.name) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 20 20" fill="currentColor" className="text-gray-800">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Material Filter */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Material</h4>
        <div className="space-y-2">
          {[
            { id: 'gold-plated', name: 'Gold Plated', icon: '🥇' },
            { id: 'silver-plated', name: 'Silver Plated', icon: '🥈' },
            { id: 'brass', name: 'Brass', icon: '🔶' },
            { id: 'copper', name: 'Copper', icon: '🔸' },
            { id: 'pearl', name: 'Pearl', icon: '🤍' },
            { id: 'kundan', name: 'Kundan', icon: '💎' },
          ].map(material => (
            <label key={material.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={selectedBadges.includes(material.name)}
                onChange={() => {
                  if (selectedBadges.includes(material.name)) {
                    setSelectedBadges(selectedBadges.filter(b => b !== material.name));
                  } else {
                    setSelectedBadges([...selectedBadges, material.name]);
                  }
                }}
                className="w-4 h-4 rounded accent-yellow-500 cursor-pointer" 
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors flex items-center gap-1">
                <span>{material.icon}</span>
                {material.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Occasion Filter */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Occasion</h4>
        <div className="space-y-2">
          {[
            { id: 'wedding', name: 'Wedding', icon: '💒' },
            { id: 'birthday', name: 'Birthday', icon: '🎂' },
            { id: 'naming-ceremony', name: 'Naming Ceremony', icon: '🔔' },
            { id: 'anniversary', name: 'Anniversary', icon: '💝' },
            { id: 'engagement', name: 'Engagement', icon: '💍' },
            { id: 'party', name: 'Party', icon: '🎉' },
            { id: 'traditional', name: 'Traditional', icon: '🪔' },
            { id: 'romantic', name: 'Romantic', icon: '💕' },
            { id: 'luxury', name: 'Luxury', icon: '👑' },
            { id: 'festive', name: 'Festive', icon: '🎊' },
          ].map(occasion => (
            <label key={occasion.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={selectedBadges.includes(occasion.name)}
                onChange={() => {
                  if (selectedBadges.includes(occasion.name)) {
                    setSelectedBadges(selectedBadges.filter(b => b !== occasion.name));
                  } else {
                    setSelectedBadges([...selectedBadges, occasion.name]);
                  }
                }}
                className="w-4 h-4 rounded accent-yellow-500 cursor-pointer" 
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors flex items-center gap-1">
                <span>{occasion.icon}</span>
                {occasion.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {[{ val: 0, label: 'All Ratings' }, { val: 4.5, label: '4.5+' }, { val: 4, label: '4.0+' }, { val: 3, label: '3.0+' }].map(r => (
            <label key={r.val} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="radio" name="rating" checked={selectedRating === r.val}
                onChange={() => setSelectedRating(r.val)}
                className="w-4 h-4 accent-yellow-500 cursor-pointer" />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 flex items-center gap-1">
                {r.val > 0 && <Star size={11} className="text-yellow-400 fill-yellow-400" />}
                {r.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Product Tags */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Product Tags</h4>
        <div className="space-y-2">
          {['Bestseller', 'New', 'Trending', 'Top Rated', 'Sale', 'Premium'].map(badge => (
            <label key={badge} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" checked={selectedBadges.includes(badge)}
                onChange={() => toggleBadge(badge)}
                className="w-4 h-4 rounded accent-yellow-500 cursor-pointer" />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">{badge}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="relative py-16" style={{ background: 'linear-gradient(135deg, #3b0764 0%, #6b21a8 50%, #be185d 100%)' }}>
        {categoryParam && categoryImages[categoryParam] && (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={categoryImages[categoryParam]}
              alt={pageTitle}
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #3b0764 0%, #6b21a8 50%, #be185d 100%)' }} />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 text-gray-300 text-sm mb-4 font-medium">
            <a href="/" className="hover:text-yellow-300 transition-colors duration-300 flex items-center gap-2">
              <span>🏠</span> Home
            </a>
            <span className="text-yellow-300">›</span>
            <span className="text-yellow-300 font-semibold">{pageTitle}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3 leading-tight" style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}>
                {pageTitle}
              </h1>
              <p className="text-gray-200 text-lg md:text-xl" style={{ fontFamily: '"Inter", "Helvetica", sans-serif' }}>
                Discover exquisite jewellery collections with {filtered.length} carefully curated pieces
              </p>
            </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-full border border-white/20">
              <div className="flex items-center gap-2">
                <span className="text-yellow-300 text-2xl">💎</span>
                <span className="text-white font-semibold text-lg">{filtered.length}</span>
              </div>
              <span className="text-gray-200 text-sm">Products Available</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex gap-8">
          {/* Sidebar – Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white rounded-3xl px-6 py-4 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4">
                <button onClick={() => setFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-yellow-600 transition-all duration-300 border-2 border-gray-200 hover:border-yellow-400 px-4 py-2 rounded-full">
                  <SlidersHorizontal size={16} /> 
                  <span>Filters</span>
                  {(selectedCategories.length > 0 || inStockOnly || selectedRating > 0 || selectedBadges.length > 0) && (
                    <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {selectedCategories.length + (inStockOnly ? 1 : 0) + (selectedRating > 0 ? 1 : 0) + selectedBadges.length}
                    </span>
                  )}
                </button>
                <div className="hidden sm:block">
                  <p className="text-lg font-semibold text-gray-800" style={{ fontFamily: '"Inter", "Helvetica", sans-serif' }}>
                    {filtered.length} <span className="text-gray-500 font-normal">Beautiful Pieces</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* View mode */}
                <div className="flex border-2 border-gray-200 rounded-full overflow-hidden bg-gray-50">
                  <button onClick={() => setViewMode('grid')}
                    className={`p-2 transition-all duration-300 ${viewMode === 'grid' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md' : 'text-gray-600 hover:bg-white'}`}>
                    <LayoutGrid size={18} />
                  </button>
                  <button onClick={() => setViewMode('list')}
                    className={`p-2 transition-all duration-300 ${viewMode === 'list' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md' : 'text-gray-600 hover:bg-white'}`}>
                    <List size={18} />
                  </button>
                </div>
                {/* Sort */}
                <div className="relative">
                  <select value={sort} onChange={e => setSort(e.target.value)}
                    className="appearance-none border-2 border-gray-200 rounded-full px-5 py-2.5 text-sm font-medium text-gray-700 pr-10 bg-white cursor-pointer focus:outline-none focus:border-yellow-400 hover:border-yellow-300 transition-all duration-300"
                    style={{ fontFamily: '"Inter", "Helvetica", sans-serif' }}>
                    {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active filters */}
            {(selectedCategories.length > 0 || searchParam || tagParam || inStockOnly || selectedRating > 0 || selectedBadges.length > 0 || (priceRange[0] > 0 || priceRange[1] < 6000)) && (
              <div className="flex flex-wrap gap-3 mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <span>🎯</span> Active Filters:
                </div>
                {selectedCategories.map(c => {
                  const cat = centralDataManager.getCategories().find(cat => cat.id === c);
                  return (
                    <button key={c} onClick={() => toggleCategory(c)}
                      className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-md hover:shadow-lg">
                      {cat?.icon} {cat?.name} <X size={14} />
                    </button>
                  );
                })}
                {selectedBadges.map(b => (
                  <button key={b} onClick={() => {
                    setSelectedBadges(prev => prev.filter(badge => badge !== b));
                  }}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
                    🏷️ {b} <X size={14} />
                  </button>
                ))}
                {inStockOnly && (
                  <button onClick={() => setInStockOnly(false)}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg">
                    ✅ In Stock <X size={14} />
                  </button>
                )}
                {selectedRating > 0 && (
                  <button onClick={() => setSelectedRating(0)}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg">
                    ⭐ {selectedRating}+ <X size={14} />
                  </button>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 6000) && (
                  <button onClick={() => setPriceRange([0, 6000])}
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg">
                    💰 ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()} <X size={14} />
                  </button>
                )}
                {searchParam && (
                  <button onClick={() => setSearchParams({})}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg">
                    <Search size={14} /> "{searchParam}" <X size={14} />
                  </button>
                )}
              </div>
            )}

            {/* Products */}
            {filtered.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl shadow-lg border border-gray-100">
                <div className="text-7xl mb-6 animate-pulse">🔍</div>
                <h3 className="font-bold text-gray-800 text-2xl mb-3" style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}>No products found</h3>
                <p className="text-gray-500 text-lg mb-8" style={{ fontFamily: '"Inter", "Helvetica", sans-serif' }}>Try adjusting your filters or search terms to discover beautiful pieces</p>
                <button onClick={clearFilters}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold px-8 py-3 rounded-full text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-6'}>
                                {filtered.map(p => (
                  viewMode === 'grid' ? <ProductCard key={p.id} product={p} /> :
                    <div key={p.id} className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                      <img src={p.image} alt={p.name} className="w-24 h-24 object-cover rounded-xl flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 capitalize mb-1">{p.category.replace('-', ' ')}</p>
                        <h3 className="font-semibold text-gray-800 text-sm">{p.name}</h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">₹{p.price.toLocaleString()}</span>
                            <span className="text-xs text-gray-400 line-through">₹{p.originalPrice.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50 lg:hidden" onClick={() => setFiltersOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6 lg:hidden max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg text-gray-900">Filters</h2>
              <button onClick={() => setFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={18} />
              </button>
            </div>
            <FilterPanel />
            <button onClick={() => setFiltersOpen(false)}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-full mt-6 transition-colors">
              Apply Filters ({filtered.length} results)
            </button>
          </div>
        </>
      )}
    </div>
  );
}
