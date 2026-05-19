import { useState, useEffect } from 'react';
import { configService } from '../services/api';

const defaults = {
  storeName: 'LeisModa',
  storeSlogan: 'Tu look favorito, directo desde Paita',
  storeDescription: '',
  waNumber: '',
  facebook: '',
  instagram: '',
  tiktok: '',
  address: '',
  hours: '',
  logo: '',
  banner: '',
  primaryColor: '#C9A96E',
  secondaryColor: '#1A1612',
  bgColor: '#FAF7F2',
  visualMode: 'claro-premium',
  freeShippingText: 'Envio gratis en compras desde S/ 99',
  freeShippingMin: 99,
  waMessage: '',
  promoBannerEnabled: true,
  featuredProductsEnabled: true,
  stockVisible: true,
};

export function useConfig() {
  const [config, setConfig] = useState(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    configService.get().then(({ data }) => {
      if (data?.data) {
        setConfig((prev) => ({ ...prev, ...data.data }));
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return { config, loading };
}
