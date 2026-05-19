import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services/api';
import ProductModal from '../components/ProductModal';
import Footer from '../components/Footer';
import { useConfig } from '../hooks/useConfig';
import { normalizeWaNumber } from '../utils/waNumber';

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { config } = useConfig();
  const waNumber = normalizeWaNumber(config.waNumber || '');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    productService.getOne(slug)
      .then(({ data }) => {
        if (data?.data) {
          setProduct(data.data);
          document.title = `${data.data.name} — ${config.storeName || 'LeisModa'}`;
          const ogTitle = document.querySelector('meta[property="og:title"]');
          const ogDesc = document.querySelector('meta[property="og:description"]');
          const ogImage = document.querySelector('meta[property="og:image"]');
          if (ogTitle) ogTitle.content = `${data.data.name} — ${config.storeName || 'LeisModa'}`;
          if (ogDesc) ogDesc.content = data.data.description || `Compra ${data.data.name} en ${config.storeName || 'LeisModa'}`;
          if (ogImage && data.data.images?.[0]?.url) ogImage.content = data.data.images[0].url;
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
    return () => {
      document.title = 'LeisModa — Moda que te define';
    };
  }, [slug]);

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',color:'#8A7968'}}>
      Cargando producto...
    </div>
  );

  if (notFound || !product) return (
    <div className="store-page">
      <header style={{background:'#1A1612',height:60,display:'flex',alignItems:'center',padding:'0 1.25rem'}}>
        <Link to="/" style={{fontFamily:'serif',fontSize:'1.5rem',color:'#FAF7F2',textDecoration:'none'}}>{config.storeName || 'LeisModa'}</Link>
      </header>
      <div style={{textAlign:'center',padding:'4rem 1.5rem',color:'#8A7968'}}>
        <h2 style={{fontFamily:'serif',fontSize:'1.5rem',color:'#1A1612',marginBottom:'0.5rem'}}>Producto no encontrado</h2>
        <p>El producto que buscas no existe o ha sido eliminado.</p>
        <Link to="/" style={{display:'inline-block',marginTop:'1rem',background:'#C9A96E',color:'#1A1612',padding:'0.7rem 1.5rem',borderRadius:8,fontWeight:600,textDecoration:'none'}}>
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
