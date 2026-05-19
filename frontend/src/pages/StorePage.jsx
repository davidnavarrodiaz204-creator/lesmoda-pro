import { useState, useMemo, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useConfig } from '../hooks/useConfig';
import { normalizeWaNumber } from '../utils/waNumber';
import ProductCard from '../components/ProductCard';
import HeroSection from '../components/HeroSection';
import CategorySection from '../components/CategorySection';
import ProductModal from '../components/ProductModal';
import CartDrawer from '../components/CartDrawer';
import BottomNav from '../components/BottomNav';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import PromoBanner from '../components/PromoBanner';
import BannerSlider from '../components/BannerSlider';
import PromoPopup from '../components/PromoPopup';
import SocialFollowSection from '../components/SocialFollowSection';
import ShareStoreButton from '../components/ShareStoreButton';
import { SkeletonGrid } from '../components/SkeletonCard';
import { useCart } from '../components/CartContext';
import { useWishlist } from '../hooks/useWishlist';
import { useRecentViews } from '../hooks/useRecentViews';
import { useAnalytics } from '../hooks/useAnalytics';
import { CartIcon, WarningIcon, DressIcon, HeartIcon, StarIcon, TrendingIcon, ClockIcon } from '../components/Icons';
import Footer from '../components/Footer';
import { setMeta, getDomain } from '../utils/seo';

const BADGES = [
  { label: 'Nuevo', value: 'new' },
  { label: 'Oferta', value: 'sale' },
  { label: 'Trending', value: 'hot' },
  { label: 'Ult. unidades', value: 'last' },
  { label: 'Destacado', value: 'featured' },
];

export default function StorePage() {
  const [filter, setFilter] = useState({});
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('Todos');
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const { totalItems } = useCart();
  const { config } = useConfig();
  const { wishlist, toggleWishlist, isFavorite } = useWishlist();
  const { recentViews, addView } = useRecentViews();
  const { track } = useAnalytics();

  const { products, loading, error } = useProducts(filter);
  const visibleProducts = config.showOutOfStock === false
    ? products.filter(p => p.stock > 0)
    : products;

  const waNumber = normalizeWaNumber(config.waNumber || '');

  useEffect(() => {
    const domain = getDomain();
    const storeName = config.storeName || 'LeisModa';
    setMeta({
      title: `${storeName} — Moda online en Paita`,
      description: config.siteDescription || `${storeName} — Tienda de ropa online en Paita. Moda para Mujer, Hombre y Accesorios. Compra facil por WhatsApp.`,
      image: config.logo || `${domain}/icons/icon.svg`,
      url: domain,
    });
  }, [config.storeName, config.siteDescription, config.logo]);

  const featuredProducts = useMemo(() => visibleProducts.filter(p => p.featured).slice(0, 4), [visibleProducts]);
  const newProducts = useMemo(() => visibleProducts.filter(p => p.badge === 'new').slice(0, 4), [visibleProducts]);
  const saleProducts = useMemo(() => visibleProducts.filter(p => p.badge === 'sale').slice(0, 4), [visibleProducts]);
  const hotProducts = useMemo(() => visibleProducts.filter(p => p.badge === 'hot').slice(0, 4), [visibleProducts]);
  const lastProducts = useMemo(() => visibleProducts.filter(p => p.badge === 'last').slice(0, 4), [visibleProducts]);
  const favoriteProducts = useMemo(() => visibleProducts.filter(p => wishlist.includes(p._id)), [visibleProducts, wishlist]);
  const topWishlist = useMemo(() => favoriteProducts.slice(0, 4), [favoriteProducts]);
  const mostViewed = useMemo(() => [...visibleProducts].sort((a, b) => (b.whatsappClicks || 0) - (a.whatsappClicks || 0)).slice(0, 4), [visibleProducts]);

  const handleFilter = (type, value) => {
    if (value === 'Todos') {
      setActiveTab('Todos');
      return setFilter({});
    }
    setActiveTab(value);
    setMenuOpen(false);
    setFilter(prev => {
      const next = { ...prev };
      if (type === 'badge') {
        next.badge = value;
      } else if (type === 'category') {
        next.category = value;
      }
      return next;
    });
  };

  const handleSelectProduct = (p) => {
    setSelected(p);
    addView(p);
    track('views', { productId: p._id });
  };

  const handleToggleFav = (id) => {
    toggleWishlist(id);
    track('favorites', { productId: id });
  };

  const handleShareStore = () => {
    track('shares', { type: 'store' });
  };

  const handleWaClick = () => {
    track('waClicks', { type: 'any' });
  };

  const hasHomeSections = featuredProducts.length > 0 || newProducts.length > 0 || saleProducts.length > 0 || hotProducts.length > 0 || lastProducts.length > 0;

  return (
    <div className="store-page">
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={s.logo}>{config.storeName || 'LeisModa'}</div>
          <div style={s.headerActions}>
            {wishlist.length > 0 && (
              <button style={s.wishlistHeaderBtn} onClick={() => setShowFavorites(!showFavorites)} title="Favoritos">
                <HeartIcon size={18} />
                <span className="wishlist-count" style={{fontSize:'.65rem',color:'#C9A96E',marginLeft:2}}>{wishlist.length}</span>
              </button>
            )}
            <button style={s.cartBtn} onClick={() => setCartOpen(true)}>
              <CartIcon size={20} />
              {totalItems > 0 && <span style={s.cartBadge}>{totalItems > 99 ? '99+' : totalItems}</span>}
            </button>
            <a href="/admin" style={s.adminLink}>Admin</a>
            <button className="lm-hamburger" style={s.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
              <span style={{...s.bar, ...(menuOpen?{transform:'rotate(45deg) translate(5px,5px)'}:{})}}/>
              <span style={{...s.bar, ...(menuOpen?{opacity:0}:{})}}/>
              <span style={{...s.bar, ...(menuOpen?{transform:'rotate(-45deg) translate(5px,-5px)'}:{})}}/>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div style={s.mobileMenu}>
            <a href="/admin" style={s.mobileMenuItem} onClick={() => setMenuOpen(false)}>Admin</a>
          </div>
        )}
      </header>

      <HeroSection
        waNumber={waNumber}
        storeName={config.storeName}
        storeSlogan={config.storeSlogan}
        facebook={config.facebook}
        instagram={config.instagram}
        tiktok={config.tiktok}
        logo={config.logo}
        banner={config.banner}
        ctaText={config.ctaText}
        trustText={config.trustText}
      />

      <BannerSlider />

      <CategorySection
        activeTab={activeTab}
        onSelect={(v) => handleFilter('category', v === activeTab ? 'Todos' : v)}
      />

      {config.promoBannerEnabled !== false && (
        <PromoBanner
          text={config.freeShippingText}
          minAmount={config.freeShippingMin}
        />
      )}

      {/* Favorites section */}
      {showFavorites && favoriteProducts.length > 0 && (
        <section className="lm-grid-section wishlist-section" style={{...s.grid, paddingBottom:'1rem'}}>
          <h2 style={s.sectionTitle}><HeartIcon size={16} /> Favoritos ({favoriteProducts.length})</h2>
          <button style={{...s.chip, marginBottom:'1rem'}} onClick={() => setShowFavorites(false)}>Cerrar favoritos</button>
          <div className="lm-product-grid" style={s.productGrid}>
            {favoriteProducts.map(p => (
              <ProductCard key={p._id} product={p} waNumber={waNumber} onClick={handleSelectProduct} stockVisible={config.stockVisible} isFavorite={isFavorite} onToggleFavorite={handleToggleFav} />
            ))}
          </div>
        </section>
      )}

      {/* Home premium: Clientes favoritos */}
      {!showFavorites && topWishlist.length > 0 && (
        <section className="lm-grid-section" style={{...s.grid, paddingBottom:'1rem'}}>
          <h2 style={s.sectionTitle}><StarIcon size={14} /> Favoritos de clientes</h2>
          <div className="lm-product-grid" style={s.productGrid}>
            {topWishlist.map(p => (
              <ProductCard key={p._id} product={p} waNumber={waNumber} onClick={handleSelectProduct} stockVisible={config.stockVisible} isFavorite={isFavorite} onToggleFavorite={handleToggleFav} />
            ))}
          </div>
        </section>
      )}

      {/* Home premium: Ultimas unidades */}
      {!showFavorites && lastProducts.length > 0 && (
        <section className="lm-grid-section" style={{...s.grid, paddingBottom:'1rem'}}>
          <h2 style={s.sectionTitle}><TrendingIcon size={14} /> Ultimas unidades</h2>
          <div className="lm-product-grid" style={s.productGrid}>
            {lastProducts.map(p => (
              <ProductCard key={p._id} product={p} waNumber={waNumber} onClick={handleSelectProduct} stockVisible={config.stockVisible} isFavorite={isFavorite} onToggleFavorite={handleToggleFav} />
            ))}
          </div>
        </section>
      )}

      {/* Home premium: Mas consultados */}
      {!showFavorites && mostViewed.length > 0 && (
        <section className="lm-grid-section" style={{...s.grid, paddingBottom:'1rem'}}>
          <h2 style={s.sectionTitle}><TrendingIcon size={14} /> Mas consultados</h2>
          <div className="lm-product-grid" style={s.productGrid}>
            {mostViewed.map(p => (
              <ProductCard key={p._id} product={p} waNumber={waNumber} onClick={handleSelectProduct} stockVisible={config.stockVisible} isFavorite={isFavorite} onToggleFavorite={handleToggleFav} />
            ))}
          </div>
        </section>
      )}

      {/* Home premium: Nuevos ingresos */}
      {!showFavorites && newProducts.length > 0 && (
        <section className="lm-grid-section" style={{...s.grid, paddingBottom:'1rem'}}>
          <h2 style={s.sectionTitle}>Nuevos ingresos</h2>
          <div className="lm-product-grid" style={s.productGrid}>
            {newProducts.map(p => (
              <ProductCard key={p._id} product={p} waNumber={waNumber} onClick={handleSelectProduct} stockVisible={config.stockVisible} isFavorite={isFavorite} onToggleFavorite={handleToggleFav} />
            ))}
          </div>
        </section>
      )}

      {/* Featured + Sale sections (Phase 11 compat) */}
      {!showFavorites && featuredProducts.length > 0 && (
        <section className="lm-grid-section" style={{...s.grid, paddingBottom:'1rem'}}>
          <h2 style={s.sectionTitle}>Destacados</h2>
          <div className="lm-product-grid" style={s.productGrid}>
            {featuredProducts.map(p => (
              <ProductCard key={p._id} product={p} waNumber={waNumber} onClick={handleSelectProduct} stockVisible={config.stockVisible} isFavorite={isFavorite} onToggleFavorite={handleToggleFav} />
            ))}
          </div>
        </section>
      )}

      {!showFavorites && saleProducts.length > 0 && (
        <section className="lm-grid-section" style={{...s.grid, paddingBottom:'1rem'}}>
          <h2 style={s.sectionTitle}>Ofertas</h2>
          <div className="lm-product-grid" style={s.productGrid}>
            {saleProducts.map(p => (
              <ProductCard key={p._id} product={p} waNumber={waNumber} onClick={handleSelectProduct} stockVisible={config.stockVisible} isFavorite={isFavorite} onToggleFavorite={handleToggleFav} />
            ))}
          </div>
        </section>
      )}

      {/* Recent views */}
      {!showFavorites && recentViews.length > 0 && (
        <section className="recent-views">
          <div className="recent-views-inner">
            <h2 style={s.sectionTitle}><ClockIcon size={14} /> Vistos recientemente</h2>
            <div className="recent-views-scroll">
              {recentViews.map(p => {
                const img = p.images?.[0]?.url || '';
                return (
                  <a key={p._id} className="recent-view-card" onClick={(e) => { e.preventDefault(); handleSelectProduct(p); }} href={`/producto/${p.slug || ''}`}>
                    <div className="recent-view-img">
                      {img ? <img src={img} alt={p.name} loading="lazy" /> : <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',color:'#8A7968',fontSize:'.65rem',opacity:.4}}>Sin img</div>}
                    </div>
                    <div className="recent-view-name">{p.name}</div>
                    <div className="recent-view-price">S/ {p.price?.toFixed(2)}</div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

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
          {activeTab === 'Todos'
            ? hasHomeSections ? 'Catalogo completo' : 'Todos los productos'
            : activeTab}
        </h2>

        {loading && <SkeletonGrid count={6} />}
        {error && <div style={s.center}><WarningIcon size={16} /> {error}</div>}

        {!loading && !error && (
          visibleProducts.length === 0
            ? <EmptyState />
            : <div className="lm-product-grid" style={s.productGrid}>
                {visibleProducts.map(p => (
                  <ProductCard key={p._id} product={p} waNumber={waNumber} onClick={handleSelectProduct} stockVisible={config.stockVisible} isFavorite={isFavorite} onToggleFavorite={handleToggleFav} />
                ))}
              </div>
        )}
      </section>

      <SocialFollowSection
        instagram={config.instagram}
        facebook={config.facebook}
        tiktok={config.tiktok}
      />

      {selected && (
        <ProductModal product={selected} waNumber={waNumber} onClose={() => setSelected(null)} stockVisible={config.stockVisible} onView={addView} trustText={config.trustText} />
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} waNumber={waNumber} waMessage={config.waMessage} storeName={config.storeName} trustText={config.trustText} />

      <BottomNav cartItems={totalItems} onCartClick={() => setCartOpen(true)} waNumber={waNumber} />
      <FloatingWhatsApp waNumber={waNumber} onTrack={handleWaClick} />

      <PromoPopup />

      <Footer
        waNumber={waNumber}
        storeName={config.storeName}
        storeSlogan={config.storeSlogan}
        facebook={config.facebook}
        instagram={config.instagram}
        tiktok={config.tiktok}
        hours={config.hours}
        logo={config.logo}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{textAlign:'center',padding:'4rem 1.5rem',color:'#8A7968'}}>
      <div style={{marginBottom:'1rem',opacity:0.4}}><DressIcon size={48} /></div>
      <h3 style={{fontFamily:'serif',fontSize:'1.4rem',marginBottom:'0.5rem',color:'#1A1612'}}>No hay productos todavia</h3>
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
  wishlistHeaderBtn: { position:'relative', background:'none', border:'none', color:'#FAF7F2', cursor:'pointer', padding:'0.3rem', display:'flex', alignItems:'center', gap:'0.15rem' },
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

