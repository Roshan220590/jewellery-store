// Categories defined locally to avoid circular dependency
export const categories = [
  { id: 'necklaces', name: 'Necklaces', icon: '🌸' },
  { id: 'earrings', name: 'Earrings', icon: '✨' },
  { id: 'bangles', name: 'Bangles & Bracelets', icon: '🟡' },
  { id: 'rings', name: 'Rings', icon: '💍' },
  { id: 'maang-tikka', name: 'Maang Tikka', icon: '🌟' },
  { id: 'anklets', name: 'Anklets', icon: '🌺' },
  { id: 'sets', name: 'Bridal Sets', icon: '👑' },
  { id: 'chains', name: 'Chains', icon: '📿', link: '/chains' },
  { id: 'hoop-hangers', name: 'Hoop Hangers', icon: '🎯' },
];

// Import centralDataManager - no circular dependency since centralDataManager doesn't import from here
import centralDataManager from './centralDataManager.js';

// Get products from centralized manager
export const products = centralDataManager.getProducts();

export const getProductById = (id) => products.find(p => p.id === Number(id));
export const getProductsByCategory = (cat) => products.filter(p => p.category === cat);
export const getFeaturedProducts = () => products.filter(p => p.isFeatured);
export const getNewArrivals = () => products.filter(p => p.isNewArrival);
export const getSaleProducts = () => products.filter(p => p.originalPrice && p.originalPrice > p.price);
