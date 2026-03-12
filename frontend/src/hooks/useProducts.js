// frontend/src/hooks/useProducts.js
import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/api';

export function useProducts(initialParams = {}) {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [meta,     setMeta]     = useState({ total: 0, page: 1, pages: 1 });
  const [params,   setParams]   = useState(initialParams);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await productService.getAll(params);
      setProducts(data.data);
      setMeta({ total: data.total, page: data.page, pages: data.pages });
    } catch (err) {
      setError(err.response?.data?.message || 'Error cargando productos');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return { products, loading, error, meta, setParams, refetch: fetchProducts };
}
