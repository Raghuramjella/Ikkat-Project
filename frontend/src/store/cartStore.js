import { create } from 'zustand';

const useCartStore = create((set) => ({
  cart: JSON.parse(localStorage.getItem('cart')) || [],

  addToCart: (product) => {
    let status = 'added';
    set((state) => {
      const matcher = (item) => (item.id || item._id) === (product.id || product._id);
      const existingItem = state.cart.find(matcher);
      let newCart;

      if (existingItem) {
        status = 'updated';
        newCart = state.cart.map((item) =>
          matcher(item) ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...state.cart, { ...product, quantity: 1 }];
      }

      localStorage.setItem('cart', JSON.stringify(newCart));
      return { cart: newCart };
    });
    return status;
  },

  removeFromCart: (productId) => {
    let removed = false;
    set((state) => {
      const matcher = (item) => (item.id || item._id) === productId;
      const newCart = state.cart.filter((item) => {
        if (matcher(item)) {
          removed = true;
          return false;
        }
        return true;
      });
      localStorage.setItem('cart', JSON.stringify(newCart));
      return { cart: newCart };
    });
    return removed;
  },

  updateQuantity: (productId, quantity) => {
    let updated = false;
    set((state) => {
      const matcher = (item) => (item.id || item._id) === productId;
      const newCart = state.cart.map((item) => {
        if (matcher(item)) {
          updated = true;
          return { ...item, quantity };
        }
        return item;
      });
      localStorage.setItem('cart', JSON.stringify(newCart));
      return { cart: newCart };
    });
    return updated;
  },

  clearCart: () => {
    localStorage.removeItem('cart');
    set({ cart: [] });
    return true;
  },
}));

export default useCartStore;