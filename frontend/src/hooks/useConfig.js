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
  primaryColor: '#5B7CFA',
  secondaryColor: '#111827',
  bgColor: '#F6F7FB',
  surfaceColor: '#FFFFFF',
  textColor: '#111827',
  mutedColor: '#6B7280',
  borderColor: '#E5E7EB',
  visualMode: 'claro-premium',
  freeShippingText: 'Envio gratis en compras desde S/ 99',
  freeShippingMin: 99,
  waMessage: '',
  promoBannerEnabled: true,
  featuredProductsEnabled: true,
  stockVisible: true,
  siteTitle: '',
  siteDescription: '',
  keywords: '',
  ogImage: '',
  favicon: '',
  indexable: true,
};

export function useConfig() {
  const [config, setConfig] = useState(defaults);
  const [loading, setLoading] = useState(true);

  const boolKeys = ['promoBannerEnabled','featuredProductsEnabled','stockVisible','newOrderSound','showOutOfStock','relatedProductsEnabled','shareProductEnabled','indexable'];

  useEffect(() => {
    configService.get().then(({ data }) => {
      if (data?.data) {
        const norm = {};
        Object.entries(data.data).forEach(([k, v]) => {
          norm[k] = boolKeys.includes(k) ? (v === true || v === 'true' || v === 1) : v;
        });
        setConfig((prev) => ({ ...prev, ...norm }));
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return { config, loading };
}
