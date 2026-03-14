// frontend/src/pages/StorePage.jsx
import { useState, useEffect } from 'react';
import { useProducts }   from '../hooks/useProducts';
import { configService } from '../services/api';
import ProductCard       from '../components/ProductCard';

const CATEGORIES = ['Todos', 'Mujer', 'Hombre', 'Accesorios'];
const BADGES     = [{ label: '🔥 Nuevo', value: 'new' }, { label: '🏷️ Oferta', value: 'sale' }];

export default function StorePage() {
  const [filter,    setFilter]    = useState({});
  const [waNumber,  setWaNumber]  = useState('');
  const [selected,  setSelected]  = useState(null);
  const [activeTab, setActiveTab] = useState('Todos');
  const [menuOpen,  setMenuOpen]  = useState(false);

  const { products, loading, error } = useProducts(filter);

  useEffect(() => {
    configService.get().then(({ data }) => {
      setWaNumber(data.data?.waNumber || '');
    }).catch(() => {});
  }, []);

  const handleFilter = (type, value) => {
    setActiveTab(value === 'Todos' ? 'Todos' : value);
    setMenuOpen(false);
    if (value === 'Todos') return setFilter({});
    if (type === 'badge')    return setFilter({ badge: value });
    if (type === 'category') return setFilter({ category: value });
  };

  return (
    <div>
      {/* HEADER */}
      <header style={s.header}>
        <div className="lm-header-inner" style={s.headerInner}>
          <div style={s.logo}>Leis<em style={{color:'#C9A96E',fontStyle:'normal'}}>Mo</em>da</div>

          {/* Nav escritorio */}
          <nav className="lm-nav-desktop" style={s.nav}>
            {CATEGORIES.map(c => (
              <button key={c} style={{...s.navBtn,...(activeTab===c?s.navBtnActive:{})}}
                onClick={() => handleFilter('category', c)}>{c}</button>
            ))}
            <a href="/admin" style={s.adminLink}>⚙️ Admin</a>
          </nav>

          {/* Botón hamburguesa móvil */}
          <button className="lm-hamburger" style={s.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
            <span style={{...s.bar, ...(menuOpen?{transform:'rotate(45deg) translate(5px,5px)'}:{})}}/>
            <span style={{...s.bar, ...(menuOpen?{opacity:0}:{})}}/>
            <span style={{...s.bar, ...(menuOpen?{transform:'rotate(-45deg) translate(5px,-5px)'}:{})}}/>
          </button>
        </div>

        {/* Menú móvil desplegable */}
        {menuOpen && (
          <div style={s.mobileMenu}>
            {CATEGORIES.map(c => (
              <button key={c} style={{...s.mobileMenuItem,...(activeTab===c?s.mobileMenuActive:{})}}
                onClick={() => handleFilter('category', c)}>{c}</button>
            ))}
            <a href="/admin" style={s.mobileMenuAdmin} onClick={() => setMenuOpen(false)}>⚙️ Admin</a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="lm-hero" style={s.hero}>
        <div style={s.heroEyebrow}>Nueva Colección 2026</div>
        <h1 style={s.heroH1}>Moda que te <em style={{color:'#C9A96E'}}>define</em></h1>
        <p style={s.heroP}>Tu look favorito, directo desde Paita</p>
        <div style={s.heroSocial}>
          <a href="https://www.facebook.com/share/1ApPvvscHt/" target="_blank" rel="noopener" style={s.socialBtn}>
            <FacebookIcon size={15}/> Facebook
          </a>
          <a href="https://www.tiktok.com/@steffan578" target="_blank" rel="noopener" style={s.socialBtn}>
            <TikTokIcon size={15}/> TikTok
          </a>
        </div>
      </section>

      {/* FILTROS */}
      <div className="lm-filters" style={s.filters}>
        <span className="lm-filter-label" style={s.filterLabel}>Filtrar:</span>
        {CATEGORIES.map(c => (
          <button key={c} style={{...s.chip,...(activeTab===c?s.chipActive:{})}}
            onClick={() => handleFilter('category', c)}>{c}</button>
        ))}
        {BADGES.map(b => (
          <button key={b.value} style={{...s.chip,...(activeTab===b.value?s.chipActive:{})}}
            onClick={() => handleFilter('badge', b.value)}>{b.label}</button>
        ))}
      </div>

      {/* GRID */}
      <section className="lm-grid-section" style={s.grid}>
        <h2 style={s.sectionTitle}>
          {activeTab === 'Todos' ? 'Todos los productos' : activeTab}
        </h2>

        {loading && <div style={s.center}>Cargando productos…</div>}
        {error   && <div style={s.center}>⚠️ {error}</div>}

        {!loading && !error && (
          products.length === 0
            ? <EmptyState />
            : <div className="lm-product-grid" style={s.productGrid}>
                {products.map(p => (
                  <ProductCard key={p._id} product={p} waNumber={waNumber} onClick={setSelected}/>
                ))}
              </div>
        )}
      </section>

      {/* MODAL */}
      {selected && (
        <ProductDetail product={selected} waNumber={waNumber} onClose={() => setSelected(null)}/>
      )}

      {/* FOOTER */}
      <footer style={s.footer}>
        <div className="lm-footer-top" style={s.footerTop}>
          <div style={s.footerBrand}>
            <div style={s.footerLogo}>Leis<em style={{color:'#C9A96E',fontStyle:'normal'}}>Mo</em>da</div>
            <p style={s.footerSlogan}>Tu look favorito, directo desde Paita</p>
          </div>
          <div style={s.footerLinks}>
            <p style={s.footerTitle}>Síguenos</p>
            <a href="https://www.facebook.com/share/1ApPvvscHt/" target="_blank" rel="noopener" style={s.footerLink}>
              <FacebookIcon size={14}/> Facebook
            </a>
            <a href="https://www.tiktok.com/@steffan578" target="_blank" rel="noopener" style={s.footerLink}>
              <TikTokIcon size={14}/> TikTok
            </a>
          </div>
          <div style={s.footerLinks}>
            <p style={s.footerTitle}>Atención</p>
            <p style={s.footerText}>Lunes a Sábado</p>
            <p style={s.footerText}>9:00 am – 7:00 pm</p>
            <p style={s.footerText}>Ventas por WhatsApp</p>
          </div>
        </div>
        <div style={s.footerBottom}>
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
    <div style={s.overlay} onClick={onClose}>
      <div className="lm-detail-modal" style={s.detailModal} onClick={e => e.stopPropagation()}>
        <div className="lm-detail-img" style={s.detailImg}>
          {img
            ? <img src={img} alt={product.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            : <div style={s.noImg}>📷</div>}
        </div>
        <div style={s.detailContent}>
          <button onClick={onClose} style={s.closeBtn}>✕</button>
          <div style={s.detailCat}>{product.category}</div>
          <h2 style={s.detailName}>{product.name}</h2>
          <p style={s.detailDesc}>{product.description || 'Consulta tallas y colores por WhatsApp.'}</p>
          <div>
            <span style={s.detailPrice}>S/ {product.price.toFixed(2)}</span>
            {product.oldPrice && <span style={s.detailOld}>S/ {product.oldPrice.toFixed(2)}</span>}
          </div>
          <a href={waUrl} target="_blank" rel="noopener" style={s.waBtnLg}
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
    <div style={{textAlign:'center',padding:'4rem 1.5rem',color:'#8A7968'}}>
      <div style={{fontSize:'3rem',marginBottom:'1rem',opacity:0.4}}>👗</div>
      <h3 style={{fontFamily:'serif',fontSize:'1.4rem',marginBottom:'0.5rem',color:'#1A1612'}}>No hay productos todavía</h3>
      <p>Ve al <a href="/admin" style={{color:'#C9A96E'}}>panel admin</a> para agregar productos.</p>
    </div>
  );
}

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
const s = {
  header:          { background:'#1A1612', position:'sticky', top:0, zIndex:100 },
  headerInner:     { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 2rem', height:64 },
  logo:            { fontFamily:'serif', fontSize:'1.75rem', color:'#FAF7F2', letterSpacing:'0.05em' },
  nav:             { display:'flex', alignItems:'center', gap:'0.25rem' },
  navBtn:          { background:'none', border:'none', color:'#B0A899', fontFamily:'sans-serif', fontSize:'0.82rem', fontWeight:500, padding:'0.45rem 0.85rem', borderRadius:4, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.08em' },
  navBtnActive:    { color:'#C9A96E', background:'rgba(201,169,110,0.1)' },
  adminLink:       { background:'#C9A96E', color:'#1A1612', padding:'0.45rem 1rem', borderRadius:6, fontSize:'0.8rem', fontWeight:700, marginLeft:'0.5rem' },

  hamburger:       { display:'none', flexDirection:'column', gap:5, background:'none', border:'none', padding:'0.4rem', cursor:'pointer' },
  bar:             { width:22, height:2, background:'#C9A96E', borderRadius:2, transition:'all 0.25s', display:'block' },

  mobileMenu:      { background:'#1A1612', borderTop:'1px solid rgba(201,169,110,0.2)', padding:'0.5rem 1rem 1rem', display:'flex', flexDirection:'column', gap:'0.25rem' },
  mobileMenuItem:  { background:'none', border:'none', color:'#B0A899', fontFamily:'sans-serif', fontSize:'0.95rem', fontWeight:500, padding:'0.75rem 0.5rem', textAlign:'left', cursor:'pointer', borderBottom:'1px solid rgba(201,169,110,0.08)', textTransform:'uppercase', letterSpacing:'0.08em' },
  mobileMenuActive:{ color:'#C9A96E' },
  mobileMenuAdmin: { color:'#C9A96E', fontFamily:'sans-serif', fontSize:'0.9rem', fontWeight:700, padding:'0.75rem 0.5rem', marginTop:'0.25rem' },

  hero:            { background:'#1A1612', padding:'5rem 2rem 4rem', textAlign:'center' },
  heroEyebrow:     { fontSize:'0.72rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#C9A96E', fontWeight:500, marginBottom:'1rem' },
  heroH1:          { fontFamily:'serif', fontSize:'clamp(2rem,6vw,4rem)', color:'white', lineHeight:1.1, marginBottom:'1rem' },
  heroP:           { color:'#B0A899', fontSize:'1rem', fontWeight:300, marginBottom:'1.5rem' },
  heroSocial:      { display:'flex', gap:'0.75rem', justifyContent:'center', marginTop:'1.5rem', flexWrap:'wrap' },
  socialBtn:       { display:'inline-flex', alignItems:'center', gap:'0.4rem', color:'#B0A899', border:'1px solid rgba(201,169,110,0.4)', padding:'0.4rem 1rem', borderRadius:999, fontSize:'0.82rem' },

  filters:         { padding:'1.25rem 2rem 0', display:'flex', flexWrap:'wrap', gap:'0.5rem', alignItems:'center', maxWidth:1400, margin:'0 auto' },
  filterLabel:     { fontSize:'0.73rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'#8A7968', fontWeight:500 },
  chip:            { background:'none', border:'1.5px solid #E8D5B0', color:'#8A7968', fontFamily:'sans-serif', fontSize:'0.82rem', padding:'0.38rem 1rem', borderRadius:999, cursor:'pointer', transition:'all 0.2s' },
  chipActive:      { background:'#C9A96E', borderColor:'#C9A96E', color:'#1A1612', fontWeight:600 },

  grid:            { padding:'1.75rem 2rem 3rem', maxWidth:1400, margin:'0 auto' },
  sectionTitle:    { fontFamily:'serif', fontSize:'1.35rem', fontStyle:'italic', color:'#1A1612', marginBottom:'1.5rem', borderBottom:'1px solid #E8D5B0', paddingBottom:'0.7rem' },
  productGrid:     { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'1.5rem' },
  center:          { textAlign:'center', padding:'3rem', color:'#8A7968' },

  footer:          { background:'#1A1612', color:'#B0A899', marginTop:'2rem' },
  footerTop:       { display:'flex', flexWrap:'wrap', gap:'2rem', padding:'2.5rem 2rem', justifyContent:'space-between', borderBottom:'1px solid rgba(201,169,110,0.15)' },
  footerBrand:     { flex:'1', minWidth:160 },
  footerLogo:      { fontFamily:'serif', fontSize:'1.5rem', color:'#FAF7F2', marginBottom:'0.4rem' },
  footerSlogan:    { fontSize:'0.85rem', color:'#8A7968', fontStyle:'italic' },
  footerLinks:     { display:'flex', flexDirection:'column', gap:'0.5rem', minWidth:130 },
  footerTitle:     { fontSize:'0.72rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'#C9A96E', fontWeight:600, marginBottom:'0.25rem' },
  footerLink:      { display:'inline-flex', alignItems:'center', gap:'0.4rem', color:'#B0A899', fontSize:'0.85rem' },
  footerText:      { fontSize:'0.85rem', color:'#8A7968' },
  footerBottom:    { textAlign:'center', padding:'1rem', fontSize:'0.75rem', color:'rgba(176,168,153,0.4)' },

  overlay:         { position:'fixed', inset:0, background:'rgba(26,22,18,0.82)', backdropFilter:'blur(6px)', zIndex:400, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' },
  detailModal:     { background:'white', borderRadius:16, width:'100%', maxWidth:780, maxHeight:'92vh', overflow:'hidden', display:'grid', gridTemplateColumns:'1fr 1fr' },
  detailImg:       { overflow:'hidden', background:'#F0EBE3', minHeight:350 },
  noImg:           { display:'flex', alignItems:'center', justifyContent:'center', height:'100%', fontSize:'3rem', opacity:0.3 },
  detailContent:   { padding:'2rem 1.75rem', display:'flex', flexDirection:'column', gap:'1rem', overflowY:'auto', position:'relative' },
  closeBtn:        { position:'absolute', top:'1rem', right:'1rem', background:'none', border:'none', fontSize:'1.3rem', cursor:'pointer', color:'#8A7968' },
  detailCat:       { fontSize:'0.7rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'#C9A96E', fontWeight:600 },
  detailName:      { fontFamily:'serif', fontSize:'1.75rem', lineHeight:1.2, color:'#1A1612' },
  detailDesc:      { fontSize:'0.88rem', color:'#8A7968', lineHeight:1.6, fontWeight:300 },
  detailPrice:     { fontSize:'1.55rem', fontWeight:700, color:'#1A1612' },
  detailOld:       { fontSize:'0.9rem', color:'#8A7968', textDecoration:'line-through', marginLeft:'0.45rem' },
  waBtnLg:         { display:'flex', alignItems:'center', justifyContent:'center', gap:'0.6rem', background:'#25D366', color:'white', border:'none', fontFamily:'sans-serif', fontSize:'1rem', fontWeight:600, padding:'0.9rem 1.5rem', borderRadius:10, cursor:'pointer', textDecoration:'none', marginTop:'auto' },
};
