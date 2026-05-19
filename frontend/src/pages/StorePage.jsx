import { useState, useEffect } from 'react';
import { useProducts }   from '../hooks/useProducts';
import { configService } from '../services/api';
import ProductCard       from '../components/ProductCard';
import HeroSection       from '../components/HeroSection';
import CategorySection   from '../components/CategorySection';
import ProductModal      from '../components/ProductModal';
import CartDrawer        from '../components/CartDrawer';
import BottomNav         from '../components/BottomNav';
import FloatingWhatsApp  from '../components/FloatingWhatsApp';
import PromoBanner       from '../components/PromoBanner';
import { SkeletonGrid }  from '../components/SkeletonCard';
import { useCart }       from '../components/CartContext';
import { CartIcon, WarningIcon, DressIcon } from '../components/Icons';
import Footer            from '../components/Footer';

const BADGES = [{ label: 'Nuevo', value: 'new' }, { label: 'Oferta', value: 'sale' }];

export default function StorePage() {
  const [filter,    setFilter]    = useState({});
  const [waNumber,  setWaNumber]  = useState('');
  const [selected,  setSelected]  = useState(null);
  const [activeTab, setActiveTab] = useState('Todos');
  const [cartOpen,  setCartOpen]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const { totalItems } = useCart();

  const { products, loading, error } = useProducts(filter);

  useEffect(() => {
    configService.get().then(({ data }) => {
      setWaNumber(data.data?.waNumber || '');
      if (data.data?.storeName) document.title = `${data.data.storeName} — Moda que te define`;
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
    <div className="store-page">
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={s.logo}>Leis<em style={{color:'#C9A96E',fontStyle:'normal'}}>Mo</em>da</div>
          <div style={s.headerActions}>
            <button className="lm-hamburger" style={s.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
              <span style={{...s.bar, ...(menuOpen?{transform:'rotate(45deg) translate(5px,5px)'}:{})}}/>
              <span style={{...s.bar, ...(menuOpen?{opacity:0}:{})}}/>
              <span style={{...s.bar, ...(menuOpen?{transform:'rotate(-45deg) translate(5px,-5px)'}:{})}}/>
            </button>
            <button style={s.cartBtn} onClick={() => setCartOpen(true)}>
              <CartIcon size={20} />
              {totalItems > 0 && <span style={s.cartBadge}>{totalItems > 99 ? '99+' : totalItems}</span>}
            </button>
            <a href="/admin" style={s.adminLink}>Admin</a>
          </div>
        </div>
        {menuOpen && (
          <div style={s.mobileMenu}>
            <a href="/admin" style={s.mobileMenuItem} onClick={() => setMenuOpen(false)}>Admin</a>
          </div>
        )}
      </header>

      <HeroSection waNumber={waNumber} />

      <CategorySection
        activeTab={activeTab}
        onSelect={(v) => handleFilter('category', v === activeTab ? 'Todos' : v)}
      />

      <PromoBanner />

      <section className="lm-filters" style={s.filters}>
        <span className="lm-filter-label" style={s.filterLabel}>Filtrar:</span>
        <button key="todos" style={{...s.chip,...(activeTab==='Todos'?s.chipActive:{})}}
          onClick={() => handleFilter('category', 'Todos')}>Todos</button>
        {BADGES.map(b => (
          <button key={b.value} style={{...s.chip,...(activeTab===b.value?s.chipActive:{})}}
            onClick={() => handleFilter('badge', b.value)}>{b.label}</button>
        ))}
      </section>

      <section id="products" className="lm-grid-section" style={s.grid}>
        <h2 style={s.sectionTitle}>
          {activeTab === 'Todos' ? 'Todos los productos' : activeTab}
        </h2>

        {loading && <SkeletonGrid count={6} />}
        {error   && <div style={s.center}><WarningIcon size={16} /> {error}</div>}

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

      {selected && (
        <ProductModal product={selected} waNumber={waNumber} onClose={() => setSelected(null)} />
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} waNumber={waNumber} />

      <BottomNav cartItems={totalItems} onCartClick={() => setCartOpen(true)} waNumber={waNumber} />
      <FloatingWhatsApp waNumber={waNumber} />

      <Footer waNumber={waNumber} />
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{textAlign:'center',padding:'4rem 1.5rem',color:'#8A7968'}}>
      <div style={{marginBottom:'1rem',opacity:0.4}}><DressIcon size={48} /></div>
      <h3 style={{fontFamily:'serif',fontSize:'1.4rem',marginBottom:'0.5rem',color:'#1A1612'}}>No hay productos todavía</h3>
      <p>Ve al <a href="/admin" style={{color:'#C9A96E'}}>panel admin</a> para agregar productos.</p>
    </div>
  );
}

const s = {
  header:          { background:'#1A1612', position:'sticky', top:0, zIndex:100, height:60, display:'flex', alignItems:'center' },
  headerInner:     { display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', padding:'0 1.25rem' },
  logo:            { fontFamily:'serif', fontSize:'1.5rem', color:'#FAF7F2', letterSpacing:'0.05em' },
  headerActions:   { display:'flex', alignItems:'center', gap:'0.5rem' },
  hamburger:       { display:'none', flexDirection:'column', gap:4, background:'none', border:'none', padding:'0.3rem', cursor:'pointer' },
  bar:             { width:20, height:2, background:'#C9A96E', borderRadius:2, transition:'all 0.25s', display:'block' },
  cartBtn:         { position:'relative', background:'none', border:'none', color:'#FAF7F2', cursor:'pointer', padding:'0.3rem' },
  cartBadge:       { position:'absolute', top:-4, right:-6, background:'#C9A96E', color:'#1A1612', fontSize:'0.6rem', fontWeight:700, minWidth:16, height:16, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 },
  adminLink:       { background:'rgba(201,169,110,0.15)', color:'#C9A96E', padding:'0.35rem 0.75rem', borderRadius:6, fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.05em' },
  mobileMenu:      { position:'absolute', top:60, left:0, right:0, background:'#1A1612', borderTop:'1px solid rgba(201,169,110,0.15)', padding:'0.5rem 1rem', zIndex:99 },
  mobileMenuItem:  { display:'block', color:'#C9A96E', padding:'0.75rem 0.5rem', fontSize:'0.9rem', fontWeight:600 },

  filters:         { padding:'1rem 1.25rem 0', display:'flex', flexWrap:'wrap', gap:'0.5rem', alignItems:'center', maxWidth:1200, margin:'0 auto' },
  filterLabel:     { fontSize:'0.7rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'#8A7968', fontWeight:500 },
  chip:            { background:'none', border:'1.5px solid #E8D5B0', color:'#8A7968', fontFamily:'sans-serif', fontSize:'0.8rem', padding:'0.35rem 0.9rem', borderRadius:999, cursor:'pointer', transition:'all 0.2s' },
  chipActive:      { background:'#C9A96E', borderColor:'#C9A96E', color:'#1A1612', fontWeight:600 },

  grid:            { padding:'1.5rem 1.25rem 6rem', maxWidth:1200, margin:'0 auto' },
  sectionTitle:    { fontFamily:'serif', fontSize:'1.25rem', fontStyle:'italic', color:'#1A1612', marginBottom:'1.25rem', borderBottom:'1px solid #E8D5B0', paddingBottom:'0.6rem' },
  productGrid:     { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'1.25rem' },
  center:          { textAlign:'center', padding:'3rem', color:'#8A7968' },
};
