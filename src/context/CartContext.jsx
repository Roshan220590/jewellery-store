import React, { createContext, useContext, useState } from 'react';
import centralDataManager from '../data/centralDataManager';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Get current stock from central data manager
  const getCurrentStock = (productId) => {
    const products = centralDataManager.getProducts();
    const product = products.find(p => p.id === productId);
    return product ? product.stockCount : 0;
  };

  // Check if adding quantity would exceed stock
  const checkStockAvailability = (productId, selectedSize, requestedQuantity) => {
    const currentStock = getCurrentStock(productId);
    
    // Calculate current quantity in cart for this product/size
    const currentCartQuantity = items
      .filter(item => item.id === productId && item.selectedSize === selectedSize)
      .reduce((total, item) => total + item.quantity, 0);
    
    const totalRequested = currentCartQuantity + requestedQuantity;
    
    return {
      available: currentStock,
      requested: totalRequested,
      canAdd: totalRequested <= currentStock,
      maxCanAdd: currentStock - currentCartQuantity
    };
  };

  const addItem = (product, selectedSize, quantity = 1) => {
    // Check stock availability
    const stockCheck = checkStockAvailability(product.id, selectedSize, quantity);
    
    if (!stockCheck.canAdd) {
      if (stockCheck.maxCanAdd <= 0) {
        toast.error(`Sorry, this product is out of stock!`);
      } else {
        toast.error(`Only ${stockCheck.available} items available in stock. You already have ${stockCheck.requested - quantity} in your cart.`);
      }
      return false;
    }

    const existingItem = items.find(item => 
      item.id === product.id && item.selectedSize === selectedSize
    );
    
    if (existingItem) {
      setItems(items.map(item =>
        item.id === product.id && item.selectedSize === selectedSize
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setItems([...items, { ...product, selectedSize, quantity }]);
    }
    
    toast.success('Added to cart!');
    return true;
  };

  const removeItem = (id, selectedSize) => {
    setItems(items.filter(item => 
      !(item.id === id && item.selectedSize === selectedSize)
    ));
  };

  const updateQuantity = (id, selectedSize, quantity) => {
    // Check stock availability
    const stockCheck = checkStockAvailability(id, selectedSize, 0);
    
    if (quantity > stockCheck.available) {
      toast.error(`Only ${stockCheck.available} items available in stock!`);
      return false;
    }

    setItems(items.map(item =>
      item.id === id && item.selectedSize === selectedSize
        ? { ...item, quantity }
        : item
    ));
    
    return true;
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems,
      checkStockAvailability,
      getCurrentStock
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
