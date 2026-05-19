import { createContext, useContext, useState, useCallback } from 'react';
import toast from 'react-hot-toast';

const CART_STORAGE_KEY = 'lesmoda_cart';

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

function saveCartToStorage(items) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCartFromStorage);

  const addItem = useCallback((product, { size = '', color = '', quantity = 1 }) => {
    setItems(prev => {
      const key = `${product._id}_${size}_${color}`;
      const existing = prev.find(item => item.key === key);
      let newItems;
      if (existing) {
        newItems = prev.map(item =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        newItems = [...prev, {
          key, _id: product._id, name: product.name, slug: product.slug || '',
          price: product.price,
          image: product.images?.[0]?.url || product.mainImage || '',
          size, color, quantity,
        }];
      }
      saveCartToStorage(newItems);
      return newItems;
    });
    toast.success('Agregado al carrito');
  }, []);

  const removeItem = useCallback((key) => {
    setItems(prev => {
      const newItems = prev.filter(item => item.key !== key);
      saveCartToStorage(newItems);
      return newItems;
    });
    toast('Producto eliminado');
  }, []);

  const updateQuantity = useCallback((key, delta) => {
    setItems(prev => {
      const newItems = prev.map(item =>
        item.key === key ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      );
      saveCartToStorage(newItems);
      return newItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    saveCartToStorage([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) return { items: [], addItem: () => {}, removeItem: () => {}, updateQuantity: () => {}, clearCart: () => {}, totalItems: 0, totalPrice: 0 };
  return ctx;
};
