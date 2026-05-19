import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('lesmoda_cart') || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('lesmoda_cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, { size = '', color = '', quantity = 1 }) => {
    setItems(prev => {
      const key = `${product._id}_${size}_${color}`;
      const existing = prev.find(item => item.key === key);
      if (existing) {
        return prev.map(item =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, {
        key, _id: product._id, name: product.name, slug: product.slug || '',
        price: product.price,
        image: product.images?.[0]?.url || product.mainImage || '',
        size, color, quantity,
      }];
    });
    toast.success('Agregado al carrito');
  }, []);

  const removeItem = useCallback((key) => {
    setItems(prev => prev.filter(item => item.key !== key));
    toast('Producto eliminado');
  }, []);

  const updateQuantity = useCallback((key, delta) => {
    setItems(prev => prev.map(item =>
      item.key === key ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

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
