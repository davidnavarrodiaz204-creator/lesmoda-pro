import { useState, useEffect, useCallback } from 'react';

const LS_KEY = 'lesmoda_recent_views';
const MAX = 8;

function load() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  } catch { return []; }
}

export function useRecentViews() {
  const [recentViews, setRecentViews] = useState(load);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(recentViews));
  }, [recentViews]);

  const addView = useCallback((product) => {
    if (!product || !product._id) return;
    setRecentViews(prev => {
      const filtered = prev.filter(p => p._id !== product._id);
      return [{ _id: product._id, name: product.name, price: product.price, images: product.images, slug: product.slug }, ...filtered].slice(0, MAX);
    });
  }, []);

  return { recentViews, addView };
}
