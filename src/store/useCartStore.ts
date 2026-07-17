import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category: string;
  material?: string;
  size?: string;
}

interface CartState {
  cartItems: CartItem[];
  isCartOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setCartOpen: (isOpen: boolean) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      isCartOpen: false,
      addItem: (item) => {
        set((state) => {
          const existingItemIndex = state.cartItems.findIndex((i) => i.id === item.id);
          const addQty = item.quantity ?? 1;
          
          if (existingItemIndex > -1) {
            const newCartItems = [...state.cartItems];
            newCartItems[existingItemIndex].quantity += addQty;
            return { cartItems: newCartItems, isCartOpen: true };
          }
          
          return {
            cartItems: [...state.cartItems, { ...item, quantity: addQty }],
            isCartOpen: true, // Auto-open cart drawer when item is added
          };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          cartItems: state.cartItems.filter((i) => i.id !== id),
        }));
      },
      updateQuantity: (id, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              cartItems: state.cartItems.filter((i) => i.id !== id),
            };
          }
          return {
            cartItems: state.cartItems.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          };
        });
      },
      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      clearCart: () => set({ cartItems: [] }),
      getCartTotal: () => {
        return get().cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getCartCount: () => {
        return get().cartItems.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'shas-cart-storage',
    }
  )
);
