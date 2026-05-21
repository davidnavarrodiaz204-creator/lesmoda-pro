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
import { CartIcon, WarningIcon, DressIcon, HeartIcon, StarIcon, TrendingIcon, ClockIcon, SearchIcon } from '../components/Icons';
import Footer from '../components/Footer';
import { setMeta, getDomain } from '../utils/seo';

const BADGES = [
  { label: 'Destacados', value: 'featured' },
  { label: 'Nuevos ingresos', value: 'new' },
  { label: 'Ofertas', value: 'sale' },
  { label: 'Ultimas unidades', value: 'last' },
  { label: 'Mas consultados', value: 'hot' },
];

export default function StorePage() {
  const [filter, setFilter] = useState({});
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('Todos');
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
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
    const seoTitle = config.siteTitle || `${storeName} — Moda online en Paita`;
    const seoDescription = config.siteDescription || `${storeName} — Tienda de ropa online en Paita. Moda para Mujer, Hombre y Accesorios. Compra facil por WhatsApp.`;
    const seoImage = config.ogImage || config.logo || `${domain}/icons/icon.svg`;
    setMeta({
      title: seoTitle,
      description: seoDescription,
      image: seoImage,
      url: domain,
      favicon: config.favicon || '/icons/icon.svg',
      indexable: config.indexable !== false,
    });
  }, [config.storeName, config.siteTitle, config.siteDescription, config.ogImage, config.logo, config.favicon, config.indexable]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const searchedProducts = useMemo(() => {
    if (!debouncedSearch.trim()) return visibleProducts;
    const q = debouncedSearch.toLowerCase();
    return visibleProducts.filter(p =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    );
  }, [visibleProducts, debouncedSearch]);

  const activeFilterLabel = activeTab === 'Todos'
    ? 'Todos'
    : BADGES.find(b => b.value === activeTab)?.label || activeTab;

  const filteredCount = searchedProducts.length;

  const handleClearFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setActiveTab('Todos');
    setFilter({});
  };

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
      setFilter({});
      return;
    }
    setActiveTab(value);
    setMenuOpen(false);
    setFilter(() => {
      if (type === 'badge') return { badge: value };
      if (type === 'category') return { category: value };
      return {};
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
                <span className="wishlist-count" style={{fontSize:'.65rem',color:'var(--lm-primary)',marginLeft:2}}>{wishlist.length}</span>
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

      {/* Search bar */}
      <div className="lm-search-bar" style={s.searchBar}>
        <div className="lm-search-inner" style={s.searchInner}>
          <SearchIcon size={18} />
          <input type="text" className="lm-search-input" style={s.searchInput}
            placeholder="Buscar prendas, colores o categorias"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)} />
          {searchQuery && (
            <button className="lm-search-clear" style={s.searchClear} onClick={() => setSearchQuery('')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      <CategorySection
        activeTab={activeTab}
        onSelect={(v) => handleFilter('category', v === activeTab ? 'Todos' : v)}
      />

      <BannerSlider />

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

      {/* Premium home sections */}
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
                      {img ? <img src={img} alt={p.name} loading="lazy" /> : <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--lm-muted)',fontSize:'.65rem',opacity:.4}}>Sin img</div>}
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

      <div style={s.resultsBar}>
        <div style={s.resultsInfo}>
          <strong>{filteredCount}</strong> producto{filteredCount === 1 ? '' : 's'}
          {activeTab !== 'Todos' && ` • ${activeFilterLabel}`}
          {debouncedSearch.trim() && ` • "${debouncedSearch.trim()}"`}
        </div>
        {(activeTab !== 'Todos' || debouncedSearch.trim()) && (
          <button type="button" style={s.clearFilters} onClick={handleClearFilters}>Limpiar filtros</button>
        )}
      </div>

      <section id="products" className="lm-grid-section" style={s.grid}>
        <h2 style={s.sectionTitle}>
          {activeTab === 'Todos'
            ? hasHomeSections ? 'Catalogo completo' : 'Todos los productos'
            : BADGES.find(b => b.value === activeTab)?.label || activeTab}
        </h2>

        {loading && <SkeletonGrid count={6} />}
        {error && <div style={s.center}><WarningIcon size={16} /> {error}</div>}

        {!loading && !error && (
          searchedProducts.length === 0
            ? debouncedSearch.trim()
              ? <SearchEmpty />
              : <EmptyState />
            : <div className="lm-product-grid" style={s.productGrid}>
                {searchedProducts.map(p => (
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
    <div style={{textAlign:'center',padding:'4rem 1.5rem',color:'var(--lm-muted)'}}>
      <div style={{marginBottom:'1rem',opacity:0.4}}><DressIcon size={48} /></div>
      <h3 style={{fontFamily:'var(--font-display)',fontSize:'1.3rem',marginBottom:'0.5rem',color:'var(--lm-text)'}}>No hay productos todavia</h3>
      <p style={{fontSize:'0.85rem'}}>Ve al <a href="/admin" style={{color:'var(--lm-primary)'}}>panel admin</a> para agregar productos.</p>
    </div>
  );
}

function SearchEmpty() {
  return (
    <div style={{textAlign:'center',padding:'4rem 1.5rem',color:'var(--lm-muted)'}}>
      <div style={{marginBottom:'1rem',opacity:0.3}}><DressIcon size={40} /></div>
      <h3 style={{fontFamily:'var(--font-display)',fontSize:'1.15rem',marginBottom:'0.4rem',color:'var(--lm-text)'}}>No encontramos productos con esa busqueda</h3>
      <p style={{fontSize:'0.85rem',color:'var(--lm-muted)'}}>Intenta con otros terminos</p>
    </div>
  );
}

  const s = {
    header:          { background:'var(--lm-secondary)', position:'sticky', top:0, zIndex:100, display:'flex', alignItems:'center' },
    headerInner:     { display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', padding:'0 .85rem' },
    logo:            { fontFamily:'var(--font-display)', fontSize:'1.25rem', color:'white', letterSpacing:'0.02em' },
    headerActions:   { display:'flex', alignItems:'center', gap:'0.3rem' },
    hamburger:       { display:'none', flexDirection:'column', gap:2, background:'none', border:'none', padding:'0.25rem', cursor:'pointer' },
    bar:             { width:18, height:2, background:'white', borderRadius:2, transition:'all 0.25s', display:'block' },
    cartBtn:         { position:'relative', background:'none', border:'none', color:'white', cursor:'pointer', padding:'0.3rem', display:'flex' },
    wishlistHeaderBtn: { position:'relative', background:'none', border:'none', color:'white', cursor:'pointer', padding:'0.3rem', display:'flex', alignItems:'center', gap:'0.15rem' },
    cartBadge:       { position:'absolute', top:-3, right:-5, background:'var(--lm-primary)', color:'white', fontSize:'0.55rem', fontWeight:700, minWidth:15, height:15, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 },
    adminLink:       { background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,.7)', padding:'0.25rem 0.6rem', borderRadius:6, fontSize:'0.65rem', fontWeight:500, letterSpacing:'0.02em' },
    mobileMenu:      { position:'absolute', top:'100%', left:0, right:0, background:'var(--lm-secondary)', borderTop:'1px solid rgba(255,255,255,.08)', padding:'0.25rem .75rem', zIndex:99 },
    mobileMenuItem:  { display:'block', color:'rgba(255,255,255,.8)', padding:'0.5rem .5rem', fontSize:'0.82rem', fontWeight:500 },

    searchBar:       { padding:'.75rem 1.25rem 0', maxWidth:1200, margin:'0 auto' },
    searchInner:     { display:'flex', alignItems:'center', gap:'0.5rem', background:'var(--lm-surface)', border:'1.5px solid var(--lm-border)', borderRadius:8, padding:'0.35rem 0.85rem', transition:'border-color .2s' },
    searchInput:     { flex:1, border:'none', outline:'none', background:'transparent', fontSize:'0.9rem', color:'var(--lm-text)', fontFamily:'inherit', padding:'0.3rem 0' },
    searchClear:     { background:'none', border:'none', cursor:'pointer', color:'var(--lm-muted)', padding:'0.2rem', display:'flex', transition:'color .2s' },

    filters:         { padding:'0.75rem 1.25rem 0', display:'flex', flexWrap:'wrap', gap:'0.4rem', alignItems:'center', maxWidth:1200, margin:'0 auto', position:'sticky', top:68, background:'var(--lm-bg)', zIndex:50, borderBottom:'1px solid var(--lm-border)' },
    filterLabel:     { fontSize:'0.65rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--lm-muted)', fontWeight:500 },
    chip:            { background:'transparent', border:'1.5px solid var(--lm-border)', color:'var(--lm-muted)', fontFamily:'var(--font-sans)', fontSize:'0.78rem', padding:'0.35rem 0.9rem', borderRadius:999, cursor:'pointer', transition:'all 0.2s' },
    chipActive:      { background:'var(--lm-primary)', borderColor:'var(--lm-primary)', color:'white', fontWeight:600 },

    resultsBar:      { display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', padding:'0.65rem 1.25rem 0', maxWidth:1200, margin:'0 auto', color:'var(--lm-text)' },
    resultsInfo:     { fontSize:'0.85rem', color:'var(--lm-muted)' },
    clearFilters:    { background:'transparent', border:'1px solid var(--lm-border)', color:'var(--lm-text)', borderRadius:999, padding:'0.5rem 0.9rem', cursor:'pointer', fontFamily:'inherit', fontSize:'0.78rem' },

    grid:            { padding:'1.25rem 1.25rem 5rem', maxWidth:1200, margin:'0 auto' },
    sectionTitle:    { fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:600, color:'var(--lm-text)', marginBottom:'1rem', borderBottom:'1px solid var(--lm-border)', paddingBottom:'0.5rem' },
    productGrid:     { display:'grid', gap:'1rem' },
    center:          { textAlign:'center', padding:'3rem', color:'var(--lm-muted)' },
  };
