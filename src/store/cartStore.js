import { create } from 'zustand';

const useCartStore = create(
  (set, get) => ({
      // State
      items: [],
      isOpen: false,

      // Actions
      addItem: (product, quantity = 1, size = null, customizations = null) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => 
              item.id === product.id && 
              item.size === size && 
              item.customizations === customizations
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id && 
                item.size === size && 
                item.customizations === customizations
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          const newItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity,
            size,
            customizations,
            maxQuantity: product.stockCount || 10,
          };

          return {
            items: [...state.items, newItem],
          };
        });
      },

      removeItem: (productId, size = null, customizations = null) => {
        set((state) => ({
          items: state.items.filter(
            (item) => 
              !(item.id === productId && 
                item.size === size && 
                item.customizations === customizations)
          ),
        }));
      },

      updateQuantity: (productId, quantity, size = null, customizations = null) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId && 
            item.size === size && 
            item.customizations === customizations
              ? { ...item, quantity: Math.max(1, Math.min(quantity, item.maxQuantity)) }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      // Getters
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getShippingCost: () => {
        const subtotal = get().getSubtotal();
        return subtotal >= 1000 ? 0 : 50;
      },

      getTax: () => {
        return Math.round(get().getSubtotal() * 0.18);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = get().getShippingCost();
        const tax = get().getTax();
        return subtotal + shipping + tax;
      },

      isInCart: (productId, size = null, customizations = null) => {
        return get().items.some(
          (item) => 
            item.id === productId && 
            item.size === size && 
            item.customizations === customizations
        );
      },

      getItemQuantity: (productId, size = null, customizations = null) => {
        const item = get().items.find(
          (item) => 
            item.id === productId && 
            item.size === size && 
            item.customizations === customizations
        );
        return item ? item.quantity : 0;
      },
    }),
  )
);

export default useCartStore;
