import React from 'react';
import { getProductStock } from '../data/inventory';

const StockDisplay = ({ productId, showBadge = true }) => {
  const stock = getProductStock(productId);
  
  if (!showBadge) {
    return (
      <div className="text-sm text-gray-600">
        {stock.inStock ? `${stock.stockCount} in stock` : 'Out of stock'}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {stock.inStock ? (
        <>
          <span className={`text-xs px-2 py-1 rounded-full ${
            stock.lowStock 
              ? 'bg-orange-100 text-orange-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {stock.stockCount} in stock
          </span>
          {stock.lowStock && (
            <span className="text-xs text-orange-600">Only {stock.stockCount} left!</span>
          )}
        </>
      ) : (
        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
          Out of stock
        </span>
      )}
    </div>
  );
};

export default StockDisplay;
