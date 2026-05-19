import { useState, useEffect, useCallback, useRef } from 'react';
import { productService } from '../services/api';

export function useProducts(initialParams = {}) {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [meta,     setMeta]     = useState({ total: 0, page: 1, pages: 1 });
  const [params,   setParams]   = useState(initialParams);
  const debounceRef = useRef(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await productService.getAll(params);
      setProducts(data?.data || []);
      setMeta({ total: data?.total ?? 0, page: data?.page ?? 1, pages: data?.pages ?? 1 });
    } catch (err) {
      setError(err.response?.data?.message || 'Error cargando productos');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchProducts, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [fetchProducts]);

  return { products, loading, error, meta, setParams, refetch: fetchProducts };
}
