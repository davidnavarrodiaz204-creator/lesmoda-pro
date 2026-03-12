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

  const { products, loading, error, refetch } = useProducts(filter);

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
        <div style={styles.logo}>Les<em>Mo</em>da</div>
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
        <div style={styles.heroEyebrow}>Nueva Colección 2026</div>
        <h1 style={styles.heroH1}>Moda que te <em style={{color:'#C9A96E'}}>define</em></h1>
        <p style={styles.heroP}>Piezas únicas · Calidad premium · Envíos a todo el Peru</p>
      </section>

      {/* FILTROS BADGE */}
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

      <footer style={styles.footer}>
        <strong>LesModa</strong> — Moda con estilo &nbsp;·&nbsp; Ventas por WhatsApp &nbsp;·&nbsp; © 2025
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
    <div style={{textAlign:'center',padding:'5rem 2rem',color:'#8A7968'}}>
      <div style={{fontSize:'3rem',marginBottom:'1rem',opacity:0.4}}>👗</div>
      <h3 style={{fontFamily:'serif',fontSize:'1.4rem',marginBottom:'0.5rem'}}>No hay productos todavía</h3>
      <p>Ve al <a href="/admin" style={{color:'#C9A96E'}}>panel admin</a> para agregar productos.</p>
    </div>
  );
}

// ── Estilos inline (mínimos para que funcione sin CSS externo) ────────────
const styles = {
  header:      { background:'#1A1612', padding:'0 2rem', position:'sticky', top:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', height:64 },
  logo:        { fontFamily:'serif', fontSize:'1.75rem', color:'#C9A96E', letterSpacing:'0.1em', textTransform:'uppercase' },
  nav:         { display:'flex', alignItems:'center', gap:'0.25rem' },
  navBtn:      { background:'none', border:'none', color:'#B0A899', fontFamily:'sans-serif', fontSize:'0.82rem', fontWeight:500, padding:'0.45rem 0.85rem', borderRadius:4, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.08em' },
  navBtnActive:{ color:'#C9A96E', background:'rgba(201,169,110,0.1)' },
  adminLink:   { background:'#C9A96E', color:'#1A1612', padding:'0.45rem 1rem', borderRadius:6, fontSize:'0.8rem', fontWeight:700, marginLeft:'0.5rem' },
  hero:        { background:'#1A1612', padding:'5rem 2rem 4rem', textAlign:'center' },
  heroEyebrow: { fontSize:'0.72rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#C9A96E', fontWeight:500, marginBottom:'1rem' },
  heroH1:      { fontFamily:'serif', fontSize:'clamp(2.4rem,6vw,4rem)', color:'white', lineHeight:1.1, marginBottom:'1rem' },
  heroP:       { color:'#B0A899', fontSize:'1rem', fontWeight:300 },
  filters:     { padding:'1.5rem 2rem 0', display:'flex', flexWrap:'wrap', gap:'0.5rem', alignItems:'center', maxWidth:1400, margin:'0 auto' },
  filterLabel: { fontSize:'0.73rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'#8A7968', fontWeight:500 },
  chip:        { background:'none', border:'1.5px solid #E8D5B0', color:'#8A7968', fontFamily:'sans-serif', fontSize:'0.82rem', padding:'0.38rem 1rem', borderRadius:999, cursor:'pointer', transition:'all 0.2s' },
  chipActive:  { background:'#C9A96E', borderColor:'#C9A96E', color:'#1A1612', fontWeight:600 },
  grid:        { padding:'1.75rem 2rem 3rem', maxWidth:1400, margin:'0 auto' },
  sectionTitle:{ fontFamily:'serif', fontSize:'1.35rem', fontStyle:'italic', color:'#1A1612', marginBottom:'1.5rem', borderBottom:'1px solid #E8D5B0', paddingBottom:'0.7rem' },
  productGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'1.5rem' },
  center:      { textAlign:'center', padding:'3rem', color:'#8A7968' },
  footer:      { background:'#1A1612', color:'#B0A899', textAlign:'center', padding:'2rem', fontSize:'0.8rem', marginTop:'2rem' },
  overlay:     { position:'fixed', inset:0, background:'rgba(26,22,18,0.78)', backdropFilter:'blur(6px)', zIndex:400, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' },
  detailModal: { background:'white', borderRadius:16, width:'100%', maxWidth:780, maxHeight:'92vh', overflow:'hidden', display:'grid', gridTemplateColumns:'1fr 1fr' },
  detailImg:   { overflow:'hidden', background:'#F0EBE3', minHeight:350 },
  noImg:       { display:'flex', alignItems:'center', justifyContent:'center', height:'100%', fontSize:'3rem', opacity:0.3 },
  detailContent:{ padding:'2.5rem 2rem', display:'flex', flexDirection:'column', gap:'1rem', overflowY:'auto', position:'relative' },
  closeBtn:    { position:'absolute', top:'1rem', right:'1rem', background:'none', border:'none', fontSize:'1.3rem', cursor:'pointer', color:'#8A7968' },
  detailCat:   { fontSize:'0.7rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'#C9A96E', fontWeight:600 },
  detailName:  { fontFamily:'serif', fontSize:'1.75rem', lineHeight:1.2, color:'#1A1612' },
  detailDesc:  { fontSize:'0.88rem', color:'#8A7968', lineHeight:1.6, fontWeight:300 },
  detailPrice: { fontSize:'1.55rem', fontWeight:700, color:'#1A1612' },
  detailOld:   { fontSize:'0.9rem', color:'#8A7968', textDecoration:'line-through', marginLeft:'0.45rem' },
  waBtnLg:     { display:'flex', alignItems:'center', justifyContent:'center', gap:'0.6rem', background:'#25D366', color:'white', border:'none', fontFamily:'sans-serif', fontSize:'1rem', fontWeight:600, padding:'0.9rem 1.5rem', borderRadius:10, cursor:'pointer', textDecoration:'none', marginTop:'auto' },
};
