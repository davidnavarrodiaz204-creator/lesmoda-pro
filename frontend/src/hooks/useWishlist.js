import { useState, useCallback, useEffect } from 'react';

const LS_KEY = 'lesmoda_wishlist';

function load() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  } catch { return []; }
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState(load);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = useCallback((productId) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  }, []);

  const isFavorite = useCallback((productId) => wishlist.includes(productId), [wishlist]);

  return { wishlist, toggleWishlist, isFavorite };
}
