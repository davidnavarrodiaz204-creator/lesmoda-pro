import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services/api';
import ProductModal from '../components/ProductModal';
import Footer from '../components/Footer';
import { useConfig } from '../hooks/useConfig';
import { normalizeWaNumber } from '../utils/waNumber';
import { setMeta, injectStructuredData, getDomain } from '../utils/seo';

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { config } = useConfig();
  const waNumber = normalizeWaNumber(config.waNumber || '');
  const ldRef = useRef(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    productService.getOne(slug)
      .then(({ data }) => {
        if (data?.data) {
          const p = data.data;
          setProduct(p);
          const domain = getDomain();
          const img = p.images?.[0]?.url || '';
          setMeta({
            title: `${p.name} — ${config.storeName || 'LeisModa'}`,
            description: p.description || `Compra ${p.name} en ${config.storeName || 'LeisModa'} — moda online en Paita`,
            image: img || `${domain}/icons/icon.svg`,
            url: `${domain}/producto/${p.slug}`,
            type: 'product',
          });
          const schema = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: p.name,
            description: p.description || `${p.name} en ${config.storeName || 'LeisModa'}`,
            image: img ? [img] : undefined,
            url: `${domain}/producto/${p.slug}`,
            sku: p._id,
            brand: { '@type': 'Brand', name: (config.siteTitle || config.storeName || 'LeisModa') },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'PEN',
              price: p.price,
              availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              url: `${domain}/producto/${p.slug}`,
            },
          };
          if (ldRef.current) ldRef.current.remove();
          const el = document.createElement('script');
          el.type = 'application/ld+json';
          el.textContent = JSON.stringify(schema);
          document.head.appendChild(el);
          ldRef.current = el;
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
    return () => {
      try { if (ldRef.current) { ldRef.current.remove(); ldRef.current = null; } } catch {}
    };
  }, [slug]);

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',color:'var(--lm-muted)'}}>
      Cargando producto...
    </div>
  );

  if (notFound || !product) return (
    <div className="store-page">
      <header style={{background:'var(--lm-secondary)',height:60,display:'flex',alignItems:'center',padding:'0 1.25rem'}}>
        <Link to="/" style={{fontFamily:'var(--lm-font-heading, serif)',fontSize:'1.5rem',color:'var(--lm-surface)',textDecoration:'none'}}>{config.storeName || 'LeisModa'}</Link>
      </header>
      <div style={{textAlign:'center',padding:'4rem 1.5rem',color:'var(--lm-muted)'}}>
        <h2 style={{fontFamily:'var(--lm-font-heading, serif)',fontSize:'1.5rem',color:'var(--lm-text)',marginBottom:'0.5rem'}}>Producto no encontrado</h2>
        <p>El producto que buscas no existe o ha sido eliminado.</p>
        <Link to="/" style={{display:'inline-block',marginTop:'1rem',background:'var(--lm-primary)',color:'white',padding:'0.7rem 1.5rem',borderRadius:8,fontWeight:600,textDecoration:'none'}}>
          Volver a la tienda
        </Link>
      </div>
      <Footer waNumber={waNumber} storeName={config.storeName} storeSlogan={config.storeSlogan} facebook={config.facebook} instagram={config.instagram} tiktok={config.tiktok} hours={config.hours} logo={config.logo} />
    </div>
  );

  return (
    <div className="store-page">
      <ProductModal product={product} waNumber={waNumber} onClose={() => {}} stockVisible={config.stockVisible} standalone />
      <Footer waNumber={waNumber} storeName={config.storeName} storeSlogan={config.storeSlogan} facebook={config.facebook} instagram={config.instagram} tiktok={config.tiktok} hours={config.hours} logo={config.logo} />
    </div>
  );
}
