import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import HeroVideo from '../components/HeroVideo';
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

export default function Home() {
  const [activeTab, setActiveTab] = useState('featured');
  const [allProducts, setAllProducts] = useState(() => websiteProductService.getProducts());

  useEffect(() => {
    const unsubs = [
      websiteProductService.subscribe('productAdded', () => {
        console.log('Home: Product added, refreshing...');
        setAllProducts([...websiteProductService.getProducts()]);
      }),
      websiteProductService.subscribe('productUpdated', () => {
        console.log('Home: Product updated, refreshing...');
        setAllProducts([...websiteProductService.getProducts()]);
      }),
      websiteProductService.subscribe('productDeleted', () => {
        console.log('Home: Product deleted, refreshing...');
        setAllProducts([...websiteProductService.getProducts()]);
      }),
      websiteProductService.subscribe('productsReset', () => {
        console.log('Home: Products reset, refreshing...');
        setAllProducts([...websiteProductService.getProducts()]);
      }),
    ];
    return () => unsubs.forEach(fn => fn && fn());
  }, []);

  const featured = allProducts.filter(p => p.isFeatured);
  const newArrivals = allProducts.filter(p => p.isNewArrival);
  const saleItems = allProducts.filter(p => p.originalPrice > p.price);
  const tabProducts = {
    featured: (featured.length > 0 ? featured : allProducts).slice(0, 8),
    new: (newArrivals.length > 0 ? newArrivals : allProducts).slice(0, 8),
    sale: (saleItems.length > 0 ? saleItems : allProducts).slice(0, 8),
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <Star size={12} fill="currentColor" /> New Collection 2026
            </div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-5">
              Jewellery That <br />
              <span style={{ color: '#D4AF37' }}>Tells Your Story</span>
            </h1>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Premium quality jewellery at prices you'll love — because you deserve to shine every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/shop"
                className="flex items-center justify-center gap-2 text-gray-900 font-bold px-9 py-4 rounded-full text-sm transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(90deg, #F59E0B, #FCD34D, #F59E0B)', boxShadow: '0 8px 28px rgba(245,158,11,0.5)' }}>
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link to="/shop?tag=new"
                className="flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-full text-sm transition-all duration-300 hover:scale-105">
                New Arrivals
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start">
              <div className="text-center px-4 border-r border-white/20">
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="text-xs text-purple-300 mt-0.5">Products</p>
              </div>
              <div className="text-center px-4 border-r border-white/20">
                <p className="text-3xl font-bold text-white">10K+</p>
                <p className="text-xs text-purple-300 mt-0.5">Happy Customers</p>
              </div>
              <div className="text-center px-4">
                <p className="text-3xl font-bold text-white">4.8★</p>
                <p className="text-xs text-purple-300 mt-0.5">Avg Rating</p>
              </div>
            </div>
          </div>
          <div className="relative hidden lg:flex justify-center items-center">
            {/* Glow behind video */}
            <div className="absolute inset-6 rounded-[2.5rem] blur-3xl opacity-50"
              style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #be185d 100%)' }} />
            {/* Jewellery Video Showcase */}
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl"
                 style={{ border: '2px solid rgba(212,175,55,0.5)', width: '100%', maxWidth: '600px' }}>
              <video 
                autoPlay 
                muted 
                loop 
                playsInline
                className="w-full h-[500px] object-cover"
                poster="/images/home/hero.jpg">
                <source src="/videos/jewellery-hero.mp4" type="video/mp4" />
                <source src="/videos/jewellery-hero.webm" type="video/webm" />
                {/* Fallback slideshow if video doesn't load */}
                <div className="w-full h-full relative jewellery-slideshow">
                  <img src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80" alt="Necklaces" className="w-full h-full object-cover absolute inset-0" />
                  <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80" alt="Earrings" className="w-full h-full object-cover absolute inset-0" />
                  <img src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80" alt="Bangles" className="w-full h-full object-cover absolute inset-0" />
                  <img src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80" alt="Rings" className="w-full h-full object-cover absolute inset-0" />
                </div>
              </video>
              {/* Overlay gradient for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>
            {/* Rating badge — top right */}
            <div className="absolute -top-5 -right-5 bg-white rounded-2xl px-4 py-3 shadow-2xl border border-gray-100">
              <div className="flex items-center gap-1.5">
                <Star size={15} className="text-amber-400 fill-amber-400" />
                <span className="text-base font-bold text-gray-800">4.8</span>
                <span className="text-xs text-gray-400">/5</span>
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-0.5">Top Rated</p>
            </div>
            {/* Video indicator */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-medium">Live Showcase</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Trust Badges */}
      <section className="py-8" style={{ background: 'linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-white font-bold text-sm mb-1">10K+ Happy Customers</h3>
              <p className="text-gray-400 text-xs">Trusted across India</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-white font-bold text-sm mb-1">100% Authentic</h3>
              <p className="text-gray-400 text-xs">Premium quality guaranteed</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-white font-bold text-sm mb-1">Free Shipping</h3>
              <p className="text-gray-400 text-xs">On orders above ₹999</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-white font-bold text-sm mb-1">Easy Returns</h3>
              <p className="text-gray-400 text-xs">7-day return policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-4" style={{ background: '#1a1a1a', borderTop: '1px solid rgba(212,175,55,0.2)', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-400 fill-yellow-400" size={16} />
              <span className="text-gray-300">4.8/5 Rating</span>
              <span className="text-gray-500">(2,341 reviews)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-300">📸</span>
              <span className="text-gray-300">15K+ Instagram Followers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-300">🎁</span>
              <span className="text-gray-300">50+ Daily Orders</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16" style={{ background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 50%, #fafafa 100%)' }}>
        <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl-pro md:text-5xl-pro font-bold mb-4 text-red-600 text-elevated">Shop By Category</h2>
          <div className="flex justify-center mb-4"><div className="h-1.5 w-20 rounded-full bg-gradient-to-r from-red-600 to-red-800 shadow-lg" /></div>
          <p className="font-body text-lg-pro text-gray-600 max-w-2xl mx-auto leading-relaxed">Explore our exquisite collection of jewellery categories, each piece carefully curated for your special moments</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5">
          {centralDataManager.getCategories().map(cat => (
            <Link key={cat.id} to={cat.link || `/shop?category=${cat.id}`}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ aspectRatio: '3/4' }}>
              <img
                src={categoryImages[cat.id] || 'https://images.unsplash.com/photo-1573408301185-9519592c4b46?w=300&q=80'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-4 text-center">
                <span className="text-3xl mb-2 block">{cat.icon}</span>
                <span className="font-heading text-white text-base-pro font-bold leading-tight block text-elevated tracking-wide">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
        </div>
      </section>

      {/* Handmade Hoop Hangers - Special Highlight */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
              Artisan Collection
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Handmade <span style={{ color: '#D4AF37' }}>Hoop Hangers</span>
            </h2>
            <div className="flex justify-center mb-4">
              <div className="h-1 w-20 rounded-full bg-gradient-to-r from-purple-400 to-purple-600" />
            </div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Discover our exquisite collection of handmade hoop hangers, each piece carefully crafted by skilled artisans using traditional techniques.
            </p>
          </div>

          {/* Hoop Hangers Section with Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Slideshow - Left Side (2 columns) */}
            <div className="lg:col-span-2">
              <div className="jewellery-slideshow relative overflow-hidden rounded-2xl shadow-2xl" style={{ aspectRatio: '3/2', maxHeight: '500px' }}>
                <img
                  src="/images/hoop_hanger/hoop_wedng.jpg"
                  alt="Wedding Hoop Hanger"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <img
                  src="/images/hoop_hanger/hoop_wedng2.jpg"
                  alt="Wedding Hoop Hanger - Elegant"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <img
                  src="/images/hoop_hanger/hoop_wedng3.jpg"
                  alt="Wedding Hoop Hanger - Luxury"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <img
                  src="/images/hoop_hanger/hoop_wedng4.jpg"
                  alt="Wedding Hoop Hanger - Premium"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <img
                  src="/images/hoop_hanger/hoop_bday1.jpg"
                  alt="Birthday Hoop Hanger"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <img
                  src="/images/hoop_hanger/hoop_bday2.jpg"
                  alt="Birthday Hoop Hanger - Party"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <img
                  src="/images/hoop_hanger/hoop_nam_ceremony1.jpg"
                  alt="Naming Ceremony Hoop Hanger"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <img
                  src="/images/hoop_hanger/hoop_cat.jpg"
                  alt="Anniversary Hoop Hanger"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                  <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                      Complete Collection
                    </div>
                    <h2 className="font-serif text-xl md:text-2xl font-bold text-white leading-tight mb-2">
                      Handmade Hoop Hangers
                    </h2>
                    <p className="text-gray-200 text-sm md:text-base max-w-xl mx-auto mb-3">
                      For Every Special Moment
                    </p>
                    <Link to="/shop?category=hoop-hangers"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold px-6 py-2 md:px-8 md:py-3 rounded-full text-sm md:text-base transition-all duration-300 hover:scale-105 shadow-lg"
                      style={{ boxShadow: '0 8px 28px rgba(147, 51, 234, 0.4)' }}
                    >
                      Explore Collection <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Right Side (1 column) */}
            <div className="space-y-4">
              {/* Quick Occasion Links */}
              <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 backdrop-blur-sm rounded-2xl p-4 border border-purple-400/20">
                <h3 className="font-bold text-white text-lg mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                  Shop by Occasion
                </h3>
                <div className="space-y-2">
                  {[
                    { name: 'Wedding', icon: '💒', color: 'from-pink-500 to-pink-600', link: '/shop?category=hoop-hangers&occasion=Wedding' },
                    { name: 'Birthday', icon: '🎂', color: 'from-purple-500 to-purple-600', link: '/shop?category=hoop-hangers&occasion=Birthday' },
                    { name: 'Anniversary', icon: '💝', color: 'from-red-500 to-red-600', link: '/shop?category=hoop-hangers&occasion=Anniversary' },
                    { name: 'Naming Ceremony', icon: '🔔', color: 'from-orange-500 to-orange-600', link: '/shop?category=hoop-hangers&occasion=Naming Ceremony' },
                  ].map((occasion, index) => (
                    <Link key={index} to={occasion.link}
                      className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/50 hover:to-gray-600/50 transition-all duration-300 group">
                      <span className="text-2xl">{occasion.icon}</span>
                      <div className="flex-1">
                        <span className="text-white font-medium text-sm group-hover:text-purple-300 transition-colors">{occasion.name}</span>
                      </div>
                      <ArrowRight size={14} className="text-gray-400 group-hover:text-purple-400 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>

              
                          </div>
          </div>

          {/* Featured Hoop Hangers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Wedding Hoop Hanger - Classic Gold */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
              <div className="aspect-square">
                <img
                  src="/images/hoop_hanger/hoop_wedng.jpg"
                  alt="Wedding Hoop Hanger - Classic Gold"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">Wedding</span>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <h3 className="text-white font-bold text-lg mb-1">Wedding Hoop Hanger</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400 font-bold">₹1,299</span>
                    <span className="text-gray-400 line-through text-sm">₹1,999</span>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="text-yellow-400 fill-yellow-400" size={14} />
                    <span className="text-gray-300 text-sm">4.9 (67)</span>
                  </div>
                  <Link to={`/product/22`}
                    className="block w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white text-center py-2 rounded-lg font-semibold transition-all duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>

            {/* Birthday Hoop Hanger - Festive Celebration */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
              <div className="aspect-square">
                <img
                  src="/images/hoop_hanger/hoop_bday1.jpg"
                  alt="Birthday Hoop Hanger - Festive Celebration"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">Birthday</span>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <h3 className="text-white font-bold text-lg mb-1">Birthday Hoop Hanger</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400 font-bold">₹899</span>
                    <span className="text-gray-400 line-through text-sm">₹1,499</span>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="text-yellow-400 fill-yellow-400" size={14} />
                    <span className="text-gray-300 text-sm">4.7 (45)</span>
                  </div>
                  <Link to={`/product/26`}
                    className="block w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-center py-2 rounded-lg font-semibold transition-all duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>

            {/* Naming Ceremony Hoop Hanger - Traditional */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
              <div className="aspect-square">
                <img
                  src="/images/hoop_hanger/hoop_nam_ceremony1.jpg"
                  alt="Naming Ceremony Hoop Hanger - Traditional"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">Traditional</span>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <h3 className="text-white font-bold text-lg mb-1">Naming Ceremony Hoop Hanger</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400 font-bold">₹999</span>
                    <span className="text-gray-400 line-through text-sm">₹1,599</span>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="text-yellow-400 fill-yellow-400" size={14} />
                    <span className="text-gray-300 text-sm">5.0 (23)</span>
                  </div>
                  <Link to={`/product/28`}
                    className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-center py-2 rounded-lg font-semibold transition-all duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>

            {/* Anniversary Hoop Hanger - Romantic Design */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
              <div className="aspect-square">
                <img
                  src="/images/hoop_hanger/hoop_cat.jpg"
                  alt="Anniversary Hoop Hanger - Romantic Design"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">Anniversary</span>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <h3 className="text-white font-bold text-lg mb-1">Anniversary Hoop Hanger</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400 font-bold">₹1,099</span>
                    <span className="text-gray-400 line-through text-sm">₹1,799</span>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="text-yellow-400 fill-yellow-400" size={14} />
                    <span className="text-gray-300 text-sm">4.9 (34)</span>
                  </div>
                  <Link to={`/product/29`}
                    className="block w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-center py-2 rounded-lg font-semibold transition-all duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link to="/shop?category=hoop-hangers"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              style={{ boxShadow: '0 8px 28px rgba(147, 51, 234, 0.4)' }}
            >
              Explore All Hoop Hangers <ArrowRight size={18} />
            </Link>
            <p className="text-gray-400 text-sm mt-3">Limited stock available • Handcrafted with love</p>
          </div>
        </div>
      </section>

      {/* Why Choose R&S */}
      <section className="py-14" style={{ background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 50%, #fafafa 100%)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl-pro md:text-5xl-pro font-bold mb-4 text-red-600 text-elevated">Why Choose R&amp;S Jewellery?</h2>
            <div className="flex justify-center mb-4"><div className="h-1.5 w-20 rounded-full bg-gradient-to-r from-red-600 to-red-800 shadow-lg" /></div>
            <p className="font-body text-lg-pro text-gray-600 max-w-2xl mx-auto leading-relaxed">Trusted by thousands of happy customers across India for our exceptional quality and timeless designs</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: '💎', title: 'Premium Quality', desc: 'Anti-tarnish coating lasts 2+ years' },
              { icon: '🎁', title: 'Gift Ready', desc: 'Beautiful packaging on every order' },
              { icon: '✈️', title: 'Pan India Delivery', desc: 'Ships to all states in 3–5 days' },
              { icon: '🔄', title: 'Easy Exchange', desc: '7-day no-questions return policy' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center border border-gray-100">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-heading text-lg-pro font-bold text-gray-900 mb-3 text-elevated">{item.title}</h3>
                <p className="font-body text-sm-pro text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products — Tabbed */}
      <section className="py-14" style={{ background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 50%, #fafafa 100%)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-heading text-4xl-pro md:text-5xl-pro font-bold mb-2 text-red-600 text-elevated">Our Collection</h2>
              <p className="font-body text-lg-pro text-gray-600">Curated just for you with love and care</p>
            </div>
            <div className="flex gap-1 bg-white rounded-full p-1 shadow-sm border border-gray-100 self-start">
              {[{ key: 'featured', label: '⭐ Trending' }, { key: 'new', label: '🆕 New' }, { key: 'sale', label: '🔥 Sale' }].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-sm'
                      : 'text-gray-600 hover:text-red-600'
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {(tabProducts[activeTab] || []).slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="text-center mt-8">
            <Link to="/shop" className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-8 py-3 rounded-full text-sm transition-all duration-300 shadow-lg shadow-red-500/20">
              View All Products <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/918310096351?text=Hi!%20I'm%20interested%20in%20your%20jewellery%20collection"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-all duration-300 group"
        style={{ boxShadow: '0 8px 28px rgba(34,197,94,0.4)' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
        </svg>
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}
