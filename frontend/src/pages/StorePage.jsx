// frontend/src/pages/StorePage.jsx
import { useState, useEffect } from 'react';
import { useProducts }    from '../hooks/useProducts';
import { configService }  from '../services/api';
import ProductCard        from '../components/ProductCard';

const CATEGORIES = ['Todos', 'Mujer', 'Hombre', 'Accesorios'];
const BADGES     = [{ label: '🔥 Nuevo', value: 'new' }, { label: '🏷️ Oferta', value: 'sale' }];

export default function StorePage() {
  const [filter,   setFilter]   = useState({});
  const [waNumber, setWaNumber] = useState('');
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('Todos');

  const { products, loading, error } = useProducts(filter);

  useEffect(() => {
    configService.get().then(({ data }) => {
      setWaNumber(data.data?.waNumber || '');
    }).catch(() => {});
  }, []);

  const handleFilter = (type, value) => {
    setActiveTab(value === 'Todos' ? 'Todos' : value);
    if (value === 'Todos') return setFilter({});
    if (type === 'badge')    return setFilter({ badge: value });
    if (type === 'category') return setFilter({ category: value });
  };

  return (
    <div>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.logo}>Leis<em style={{color:'#FF7F50'}}>Mo</em>da</div>
        <nav style={styles.nav}>
          {CATEGORIES.map(c => (
            <button key={c} style={{...styles.navBtn, ...(activeTab===c ? styles.navBtnActive:{})}}
              onClick={() => handleFilter('category', c)}>{c}</button>
          ))}
          <a href="/admin" style={styles.adminLink}>⚙️ Admin</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroEyebrow}>Nueva Colección 2025</div>
        <h1 style={styles.heroH1}>Moda que te <em style={{color:'#FF7F50'}}>define</em></h1>
        <p style={styles.heroP}>Tu look favorito, directo desde Paita</p>
        <div style={styles.heroSocial}>
          <a href="https://www.facebook.com/share/1ApPvvscHt/" target="_blank" rel="noopener" style={styles.socialBtn}>
            <FacebookIcon size={16}/> Facebook
          </a>
          <a href="https://www.tiktok.com/@steffan578" target="_blank" rel="noopener" style={styles.socialBtn}>
            <TikTokIcon size={16}/> TikTok
          </a>
        </div>
      </section>

      {/* FILTROS */}
      <div style={styles.filters}>
        <span style={styles.filterLabel}>Filtrar:</span>
        {CATEGORIES.map(c => (
          <button key={c} style={{...styles.chip, ...(activeTab===c?styles.chipActive:{})}}
            onClick={() => handleFilter('category', c)}>{c}</button>
        ))}
        {BADGES.map(b => (
          <button key={b.value} style={{...styles.chip, ...(activeTab===b.value?styles.chipActive:{})}}
            onClick={() => handleFilter('badge', b.value)}>{b.label}</button>
        ))}
      </div>

      {/* GRID */}
      <section style={styles.grid}>
        <h2 style={styles.sectionTitle}>
          {activeTab === 'Todos' ? 'Todos los productos' : activeTab}
        </h2>

        {loading && <div style={styles.center}>Cargando productos…</div>}
        {error   && <div style={styles.center}>⚠️ {error}</div>}

        {!loading && !error && (
          products.length === 0
            ? <EmptyState />
            : <div style={styles.productGrid}>
                {products.map(p => (
                  <ProductCard key={p._id} product={p} waNumber={waNumber} onClick={setSelected} />
                ))}
              </div>
        )}
      </section>

      {/* MODAL DETALLE */}
      {selected && (
        <ProductDetail product={selected} waNumber={waNumber} onClose={() => setSelected(null)} />
      )}

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerTop}>
          <div style={styles.footerBrand}>
            <div style={styles.footerLogo}>Leis<em style={{color:'#FF7F50'}}>Mo</em>da</div>
            <p style={styles.footerSlogan}>Tu look favorito, directo desde Paita</p>
          </div>
          <div style={styles.footerLinks}>
            <p style={styles.footerTitle}>Síguenos</p>
            <a href="https://www.facebook.com/share/1ApPvvscHt/" target="_blank" rel="noopener" style={styles.footerLink}>
              <FacebookIcon size={14}/> Facebook
            </a>
            <a href="https://www.tiktok.com/@steffan578" target="_blank" rel="noopener" style={styles.footerLink}>
              <TikTokIcon size={14}/> TikTok
            </a>
          </div>
          <div style={styles.footerLinks}>
            <p style={styles.footerTitle}>Atención</p>
            <p style={styles.footerText}>Lunes a Sábado</p>
            <p style={styles.footerText}>9:00 am – 7:00 pm</p>
            <p style={styles.footerText}>Ventas por WhatsApp</p>
          </div>
        </div>
        <div style={styles.footerBottom}>
          LeisModa © 2025 · Todos los derechos reservados
        </div>
      </footer>
    </div>
  );
}

function ProductDetail({ product, waNumber, onClose }) {
  const img = product.images?.[0]?.url || product.mainImage;
  const num = waNumber?.replace(/\D/g, '');
  const msg = `¡Hola! Me interesa: *${product.name}* (S/ ${product.price.toFixed(2)}). ¿Está disponible? 🛍️`;
  const waUrl = num ? `https://wa.me/${num}?text=${encodeURIComponent(msg)}` : '#';

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.detailModal} onClick={e => e.stopPropagation()}>
        <div style={styles.detailImg}>
          {img ? <img src={img} alt={product.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <div style={styles.noImg}>📷</div>}
        </div>
        <div style={styles.detailContent}>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
          <div style={styles.detailCat}>{product.category}</div>
          <h2 style={styles.detailName}>{product.name}</h2>
          <p style={styles.detailDesc}>{product.description || 'Consulta tallas y colores por WhatsApp.'}</p>
          <div>
            <span style={styles.detailPrice}>S/ {product.price.toFixed(2)}</span>
            {product.oldPrice && <span style={styles.detailOld}>S/ {product.oldPrice.toFixed(2)}</span>}
          </div>
          <a href={waUrl} target="_blank" rel="noopener" style={styles.waBtnLg}
            onClick={() => { import('../services/api').then(m => m.productService.trackClick(product._id)); }}>
            🟢 Comprar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{textAlign:'center',padding:'5rem 2rem',color:'#6c757d'}}>
      <div style={{fontSize:'3rem',marginBottom:'1rem',opacity:0.4}}>👗</div>
      <h3 style={{fontFamily:'serif',fontSize:'1.4rem',marginBottom:'0.5rem',color:'#1B263B'}}>No hay productos todavía</h3>
      <p>Ve al <a href="/admin" style={{color:'#C5A059'}}>panel admin</a> para agregar productos.</p>
    </div>
  );
}

// ── Iconos ────────────────────────────────────────────────────────────────
function FacebookIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function TikTokIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.16 8.16 0 004.77 1.52V6.75a4.85 4.85 0 01-1-.06z"/>
    </svg>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────
const styles = {
  header:       { background:'#1B263B', padding:'0 2rem', position:'sticky', top:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', height:64 },
  logo:         { fontFamily:'serif', fontSize:'1.75rem', color:'#C5A059', letterSpacing:'0.1em' },
  nav:          { display:'flex', alignItems:'center', gap:'0.25rem' },
  navBtn:       { background:'none', border:'none', color:'#E0C9A6', fontFamily:'sans-serif', fontSize:'0.82rem', fontWeight:500, padding:'0.45rem 0.85rem', borderRadius:4, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.08em' },
  navBtnActive: { color:'#FF7F50', background:'rgba(255,127,80,0.12)' },
  adminLink:    { background:'#C5A059', color:'#1B263B', padding:'0.45rem 1rem', borderRadius:6, fontSize:'0.8rem', fontWeight:700, marginLeft:'0.5rem' },

  hero:         { background:'#1B263B', padding:'5rem 2rem 4rem', textAlign:'center' },
  heroEyebrow:  { fontSize:'0.72rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#C5A059', fontWeight:500, marginBottom:'1rem' },
  heroH1:       { fontFamily:'serif', fontSize:'clamp(2.4rem,6vw,4rem)', color:'#F8F9FA', lineHeight:1.1, marginBottom:'1rem' },
  heroP:        { color:'#E0C9A6', fontSize:'1rem', fontWeight:300, marginBottom:'1.5rem' },
  heroSocial:   { display:'flex', gap:'0.75rem', justifyContent:'center', marginTop:'1.5rem' },
  socialBtn:    { display:'inline-flex', alignItems:'center', gap:'0.4rem', color:'#E0C9A6', border:'1px solid #C5A059', padding:'0.4rem 1rem', borderRadius:999, fontSize:'0.82rem', transition:'all .2s' },

  filters:      { padding:'1.5rem 2rem 0', display:'flex', flexWrap:'wrap', gap:'0.5rem', alignItems:'center', maxWidth:1400, margin:'0 auto' },
  filterLabel:  { fontSize:'0.73rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'#6c757d', fontWeight:500 },
  chip:         { background:'none', border:'1.5px solid #E0C9A6', color:'#6c757d', fontFamily:'sans-serif', fontSize:'0.82rem', padding:'0.38rem 1rem', borderRadius:999, cursor:'pointer', transition:'all 0.2s' },
  chipActive:   { background:'#C5A059', borderColor:'#C5A059', color:'#1B263B', fontWeight:600 },

  grid:         { padding:'1.75rem 2rem 3rem', maxWidth:1400, margin:'0 auto' },
  sectionTitle: { fontFamily:'serif', fontSize:'1.35rem', fontStyle:'italic', color:'#1B263B', marginBottom:'1.5rem', borderBottom:'1px solid #E0C9A6', paddingBottom:'0.7rem' },
  productGrid:  { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'1.5rem' },
  center:       { textAlign:'center', padding:'3rem', color:'#6c757d' },

  footer:       { background:'#1B263B', color:'#E0C9A6', marginTop:'2rem' },
  footerTop:    { display:'flex', flexWrap:'wrap', gap:'2rem', padding:'2.5rem 2rem', justifyContent:'space-between', borderBottom:'1px solid rgba(224,201,166,0.15)' },
  footerBrand:  { flex:'1', minWidth:180 },
  footerLogo:   { fontFamily:'serif', fontSize:'1.5rem', color:'#C5A059', marginBottom:'0.4rem' },
  footerSlogan: { fontSize:'0.85rem', color:'#E0C9A6', fontStyle:'italic' },
  footerLinks:  { display:'flex', flexDirection:'column', gap:'0.4rem', minWidth:140 },
  footerTitle:  { fontSize:'0.72rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'#C5A059', fontWeight:600, marginBottom:'0.3rem' },
  footerLink:   { display:'inline-flex', alignItems:'center', gap:'0.4rem', color:'#E0C9A6', fontSize:'0.85rem', transition:'color .2s' },
  footerText:   { fontSize:'0.85rem', color:'#E0C9A6' },
  footerBottom: { textAlign:'center', padding:'1rem', fontSize:'0.75rem', color:'rgba(224,201,166,0.5)' },

  overlay:      { position:'fixed', inset:0, background:'rgba(27,38,59,0.82)', backdropFilter:'blur(6px)', zIndex:400, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' },
  detailModal:  { background:'white', borderRadius:16, width:'100%', maxWidth:780, maxHeight:'92vh', overflow:'hidden', display:'grid', gridTemplateColumns:'1fr 1fr' },
  detailImg:    { overflow:'hidden', background:'#F0EBE3', minHeight:350 },
  noImg:        { display:'flex', alignItems:'center', justifyContent:'center', height:'100%', fontSize:'3rem', opacity:0.3 },
  detailContent:{ padding:'2.5rem 2rem', display:'flex', flexDirection:'column', gap:'1rem', overflowY:'auto', position:'relative' },
  closeBtn:     { position:'absolute', top:'1rem', right:'1rem', background:'none', border:'none', fontSize:'1.3rem', cursor:'pointer', color:'#6c757d' },
  detailCat:    { fontSize:'0.7rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'#C5A059', fontWeight:600 },
  detailName:   { fontFamily:'serif', fontSize:'1.75rem', lineHeight:1.2, color:'#1B263B' },
  detailDesc:   { fontSize:'0.88rem', color:'#6c757d', lineHeight:1.6, fontWeight:300 },
  detailPrice:  { fontSize:'1.55rem', fontWeight:700, color:'#1B263B' },
  detailOld:    { fontSize:'0.9rem', color:'#6c757d', textDecoration:'line-through', marginLeft:'0.45rem' },
  waBtnLg:      { display:'flex', alignItems:'center', justifyContent:'center', gap:'0.6rem', background:'#FF7F50', color:'white', border:'none', fontFamily:'sans-serif', fontSize:'1rem', fontWeight:600, padding:'0.9rem 1.5rem', borderRadius:10, cursor:'pointer', textDecoration:'none', marginTop:'auto' },
};
