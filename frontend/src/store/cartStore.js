import { create } from 'zustand';

const useCartStore = create((set) => ({
  cart: JSON.parse(localStorage.getItem('cart')) || [],

  addToCart: (product) => {
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);
      let newCart;

      if (existingItem) {
        newCart = state.cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...state.cart, { ...product, quantity: 1 }];
      }

      localStorage.setItem('cart', JSON.stringify(newCart));
      return { cart: newCart };
    });
  },

  removeFromCart: (productId) => {
    set((state) => {
      const newCart = state.cart.filter((item) => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(newCart));
      return { cart: newCart };
    });
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      const newCart = state.cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(newCart));
      return { cart: newCart };
    });
  },

  clearCart: () => {
    localStorage.removeItem('cart');
    set({ cart: [] });
  },
}));

export default useCartStore;