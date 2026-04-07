// Real-time Inventory Management System
import { products } from './products.js';

// Initialize inventory from products data - sync directly with products.js
let inventory = products.map(product => ({
  id: product.id,
  name: product.name,
  category: product.category,
  price: product.price,
  stockCount: product.stockCount,
  inStock: product.inStock,
  minStockAlert: 5, // Alert when stock is 5 or less
  maxStock: 100,
  lastUpdated: new Date().toISOString(),
  image: product.image
}));

// Sync inventory with products data
export const syncInventoryWithProducts = () => {
  inventory = products.map(product => ({
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    stockCount: product.stockCount,
    inStock: product.inStock,
    minStockAlert: 5,
    maxStock: 100,
    lastUpdated: new Date().toISOString(),
    image: product.image
  }));
  saveInventoryToStorage();
  return inventory;
};

// Update product in products.js when inventory changes
const updateProductInProductsFile = (productId, newStock, newInStock) => {
  // Find the product in the products array
  const productIndex = products.findIndex(p => p.id === productId);
  if (productIndex !== -1) {
    products[productIndex].stockCount = newStock;
    products[productIndex].inStock = newInStock;
    products[productIndex].lastUpdated = new Date().toISOString();
  }
};

// Get current inventory (always sync with products first)
export const getInventory = () => {
  syncInventoryWithProducts();
  return inventory;
};

// Update stock when order is placed
export const updateStockOnOrder = (orderItems) => {
  orderItems.forEach(item => {
    const product = inventory.find(p => p.id === item.id);
    if (product) {
      product.stockCount -= item.quantity;
      product.inStock = product.stockCount > 0;
      product.lastUpdated = new Date().toISOString();
      
      // Update the actual products data
      updateProductInProductsFile(item.id, product.stockCount, product.inStock);
      
      // Save to localStorage to persist changes
      saveInventoryToStorage();
    }
  });
};

// Get low stock alerts (sync with products first)
export const getLowStockAlerts = () => {
  try {
    syncInventoryWithProducts();
    if (!inventory || !Array.isArray(inventory)) {
      return [];
    }
    
    return inventory
      .filter(item => item && item.stockCount <= (item.minStockAlert || 5))
      .map(item => ({
        id: item?.id || 0,
        product: item?.name || 'Unknown Product',
        stock: item?.stockCount || 0,
        status: (item?.stockCount || 0) <= 2 ? 'critical' : 'low',
        image: item?.image || ''
      }));
  } catch (error) {
    console.error('Error in getLowStockAlerts:', error);
    return [];
  }
};

// Get inventory statistics (sync with products first)
export const getInventoryStats = () => {
  try {
    syncInventoryWithProducts();
    const totalProducts = inventory?.length || 0;
    const inStockProducts = inventory?.filter(item => item?.inStock)?.length || 0;
    const outOfStockProducts = inventory?.filter(item => !item?.inStock)?.length || 0;
    const lowStockProducts = inventory?.filter(item => item?.stockCount <= (item?.minStockAlert || 5))?.length || 0;
    const totalStock = inventory?.reduce((sum, item) => sum + (item?.stockCount || 0), 0) || 0;
    const totalValue = inventory?.reduce((sum, item) => sum + ((item?.price || 0) * (item?.stockCount || 0)), 0) || 0;

    return {
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      lowStockProducts,
      totalStock,
      totalValue
    };
  } catch (error) {
    console.error('Error in getInventoryStats:', error);
    return {
      totalProducts: 0,
      inStockProducts: 0,
      outOfStockProducts: 0,
      lowStockProducts: 0,
      totalStock: 0,
      totalValue: 0
    };
  }
};

// Update product stock manually (for admin)
export const updateProductStock = (productId, newStock) => {
  syncInventoryWithProducts();
  const product = inventory.find(p => p.id === productId);
  if (product) {
    product.stockCount = newStock;
    product.inStock = newStock > 0;
    product.lastUpdated = new Date().toISOString();
    
    // Update the actual products data
    updateProductInProductsFile(productId, newStock, newStock > 0);
    
    saveInventoryToStorage();
    return true;
  }
  return false;
};

// Add new product to inventory
export const addProductToInventory = (product) => {
  const newInventoryItem = {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    stockCount: product.stockCount || 0,
    inStock: (product.stockCount || 0) > 0,
    minStockAlert: 5,
    maxStock: 100,
    lastUpdated: new Date().toISOString(),
    image: product.image
  };
  
  inventory.push(newInventoryItem);
  saveInventoryToStorage();
  return newInventoryItem;
};

// Remove product from inventory
export const removeProductFromInventory = (productId) => {
  inventory = inventory.filter(item => item.id !== productId);
  saveInventoryToStorage();
};

// Save inventory to localStorage
const saveInventoryToStorage = () => {
  localStorage.setItem('inventory', JSON.stringify(inventory));
};

// Load inventory from localStorage
const loadInventoryFromStorage = () => {
  const saved = localStorage.getItem('inventory');
  if (saved) {
    inventory = JSON.parse(saved);
  }
};

// Get product stock for website (sync with products first)
export const getProductStock = (productId) => {
  syncInventoryWithProducts();
  const product = inventory.find(p => p.id === productId);
  return product ? {
    stockCount: product.stockCount,
    inStock: product.inStock,
    lowStock: product.stockCount <= product.minStockAlert
  } : { stockCount: 0, inStock: false, lowStock: true };
};

// Force refresh inventory from products
export const refreshInventory = () => {
  syncInventoryWithProducts();
  return inventory;
};
