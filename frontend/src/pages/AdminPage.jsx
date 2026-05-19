import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { productService, configService, authService, orderService } from '../services/api';
import { validatePeruNumber, normalizeWaNumber } from '../utils/waNumber';
import {
  ChartIcon, PackageIcon, ClipboardIcon, UsersIcon, GearIcon,
  StoreIcon, DoorIcon, UserIcon, MobileIcon, SaveIcon,
  NewBadgeIcon, FireIcon, WarningIcon, ImageIcon, PencilIcon,
  TrashIcon, EyeIcon, PlusCircleIcon, CloseIcon, TagIcon, CheckIcon,
} from '../components/Icons';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [modal, setModal] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [config, setConfig] = useState({ waNumber: '', storeName: 'LeisModa' });
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useState(() => {
    configService.get().then(({ data }) => setConfig(c => ({ ...c, ...data.data }))).catch(() => {});
  });

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const handleSaveConfig = async () => {
    setSaving(true);
    await configService.save(config).finally(() => setSaving(false));
    alert('Configuración guardada');
  };

  return (
    <div style={s.page}>
      <aside style={s.sidebar}>
        <div style={s.sidebarLogo}>Leis<em style={{color:'#C9A96E',fontStyle:'normal'}}>Mo</em>da</div>
        <nav style={s.sidebarNav}>
          {[
            ['dashboard', 'Dashboard', <ChartIcon size={16} />],
            ['products', 'Productos', <PackageIcon size={16} />],
            ['orders', 'Pedidos', <ClipboardIcon size={16} />],
            ['users', 'Usuarios', <UsersIcon size={16} />],
            ['config', 'Config', <GearIcon size={16} />],
          ].map(([k, label, icon]) => (
            <div key={k} style={{...s.sideLink, ...(activeSection===k?s.sideLinkActive:{})}}
              onClick={() => setActiveSection(k)}>
              <span style={{display:'inline-flex',alignItems:'center',gap:'0.5rem'}}>{icon} {label}</span>
            </div>
          ))}
          <div style={s.sideLink} onClick={() => navigate('/')}>
            <span style={{display:'inline-flex',alignItems:'center',gap:'0.5rem'}}><StoreIcon size={16} /> Ver tienda</span>
          </div>
          <div style={s.sideLink} onClick={handleLogout}>
            <span style={{display:'inline-flex',alignItems:'center',gap:'0.5rem'}}><DoorIcon size={16} /> Salir</span>
          </div>
        </nav>
        <div style={s.sideUser}>
          <span style={{display:'inline-flex',alignItems:'center',gap:'0.4rem'}}><UserIcon size={14} /> {user?.name}</span>
        </div>
      </aside>

      <main style={{...s.main, paddingBottom: window.innerWidth <= 768 ? '72px' : '1.5rem'}}>
        <div style={s.mobileHeader}>
          <div style={s.mobileLogo}>Leis<em style={{color:'#C9A96E',fontStyle:'normal'}}>Mo</em>da</div>
          <button style={s.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
            <span style={s.bar}/><span style={s.bar}/><span style={s.bar}/>
          </button>
        </div>

        {menuOpen && (
          <div style={s.mobileMenu}>
            {[['dashboard','Dashboard',<ChartIcon size={16} />],['products','Productos',<PackageIcon size={16} />],['orders','Pedidos',<ClipboardIcon size={16} />],['users','Usuarios',<UsersIcon size={16} />],['config','Config',<GearIcon size={16} />]].map(([k,label,icon]) => (
              <div key={k} style={{...s.mobileMenuItem, ...(activeSection===k?s.mobileMenuActive:{})}}
                onClick={() => { setActiveSection(k); setMenuOpen(false); }}>
                <span style={{display:'inline-flex',alignItems:'center',gap:'0.5rem'}}>{icon} {label}</span>
              </div>
            ))}
            <div style={s.mobileMenuItem} onClick={() => navigate('/')}><span style={{display:'inline-flex',alignItems:'center',gap:'0.5rem'}}><StoreIcon size={16} /> Ver tienda</span></div>
            <div style={s.mobileMenuItem} onClick={handleLogout}><span style={{display:'inline-flex',alignItems:'center',gap:'0.5rem'}}><DoorIcon size={16} /> Salir</span></div>
          </div>
        )}

        {activeSection === 'dashboard' && <DashboardSection onNavigate={setActiveSection} />}
        {activeSection === 'products' && (
          <ProductSection
            onEdit={(p) => setModal(p)}
            onAdd={() => setModal('new')}
          />
        )}
        {activeSection === 'orders' && <OrdersSection waNumber={config.waNumber} />}
        {activeSection === 'users' && <UserSection />}
        {activeSection === 'config' && <ConfigSection />}
      </main>

      {/* Mobile bottom tabs */}
      <nav style={{
        display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0,
        height: 56, background: '#1A1612', zIndex: 300,
        alignItems: 'center', justifyContent: 'space-around',
        borderTop: '1px solid rgba(201,169,110,.12)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        ...(window.innerWidth <= 768 ? { display: 'flex' } : {}),
      }}>
        {[
          ['dashboard', 'Dashboard', 'chart'],
          ['products', 'Productos', 'package'],
          ['orders', 'Pedidos', 'clipboard'],
          ['config', 'Config', 'gear'],
        ].map(([k, label, icon]) => (
          <button key={k} onClick={() => { setActiveSection(k); setMenuOpen(false); }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              background: 'none', border: 'none', color: activeSection === k ? '#C9A96E' : '#8A7968',
              fontSize: '0.6rem', fontWeight: 500, cursor: 'pointer', padding: '0.3rem 0.6rem',
              fontFamily: 'inherit',
            }}>
            <ActionIcon type={icon} size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {modal && (
        <ProductModal
          product={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => setModal(null)}
        />
      )}
    </div>
  );
}

// ── DASHBOARD ──────────────────────────────────────────────────────────────
function DashboardSection({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [orderStats, setOrderStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [pRes, oRes] = await Promise.allSettled([
        productService.getStats(),
        orderService.getStats(),
      ]);
      if (pRes.status === 'fulfilled') setStats(pRes.value.data?.data || null);
      if (oRes.status === 'fulfilled') setOrderStats(oRes.value.data?.data || null);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchStats(); }, []);

  useEffect(() => {
    fetch('/health', { signal: AbortSignal.timeout(5000) })
      .then(r => setApiConnected(r.ok))
      .catch(() => setApiConnected(false));
  }, []);

  if (loading) return <div style={{padding:'2rem',color:'#8A7968'}}>Cargando dashboard…</div>;

  const metricCards = [
    { label: 'Total productos', value: stats?.totalProducts ?? '—', color: '#1A1612' },
    { label: 'Activos', value: stats?.activeProducts ?? '—', color: '#2E7D52' },
    { label: 'Pedidos hoy', value: orderStats?.todayOrders ?? '—', color: '#C9A96E' },
    { label: 'Pendientes', value: orderStats?.pendingOrders ?? '—', color: '#C25E5E' },
    { label: 'Ventas potenciales', value: orderStats?.potentialRevenue != null ? `S/ ${orderStats.potentialRevenue.toFixed(0)}` : '—', color: '#25D366' },
    { label: 'Clicks WhatsApp', value: stats?.totalWhatsappClicks ?? '—', color: '#1A1612' },
  ];

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
      <h2 style={{fontFamily:'serif',fontSize:'1.3rem',color:'#1A1612'}}>Dashboard</h2>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:'1rem'}}>
        {metricCards.map((m, i) => (
          <div key={i} style={{
            background:'white', borderRadius:12, padding:'1.25rem', textAlign:'center',
            boxShadow:'0 2px 12px rgba(0,0,0,0.05)',
          }}>
            <div style={{fontSize:'1.6rem',fontWeight:700,color:m.color}}>{m.value}</div>
            <div style={{fontSize:'0.72rem',color:'#8A7968',fontWeight:500,letterSpacing:'0.05em',marginTop:'0.3rem'}}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={s.quickActions}>
        {[
          { label: 'Agregar producto', icon: 'plus', section: 'products', action: 'add' },
          { label: 'Ver pedidos', icon: 'clipboard', section: 'orders' },
          { label: 'Configurar tienda', icon: 'gear', section: 'config' },
          { label: 'Ver tienda', icon: 'store', section: null, href: '/' },
        ].map((item, i) => (
          <button key={i} style={s.quickBtn}
            onClick={() => {
              if (item.href) window.location.href = item.href;
              else onNavigate?.(item.section);
            }}>
            <ActionIcon type={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* API Status */}
      <div style={s.card}>
        <div style={s.cardHeader}><h3 style={s.cardTitle}>Estado de conexion</h3></div>
        <div style={{padding:'0.75rem 1.5rem 1rem', display:'flex', alignItems:'center', gap:'0.75rem'}}>
          <span style={{
            width:10, height:10, borderRadius:'50%',
            background: apiConnected ? '#2E7D52' : '#C25E5E',
            flexShrink:0,
          }}/>
          <span style={{fontSize:'0.85rem', color:'#1A1612'}}>
            {apiConnected ? 'Backend conectado' : 'Backend no disponible'}
          </span>
        </div>
      </div>

      {orderStats?.recentOrders?.length > 0 && (
        <div style={s.card}>
          <div style={s.cardHeader}><h3 style={s.cardTitle}>Últimos pedidos</h3></div>
          <div style={{padding:'0.75rem 1.5rem 1rem'}}>
            {orderStats.recentOrders.map((o, i) => (
              <div key={o._id} style={{
                display:'flex',alignItems:'center',gap:'0.75rem',
                padding:'0.55rem 0',borderBottom:i<orderStats.recentOrders.length-1?'1px solid #F5F0EB':'none',
              }}>
                <span style={{flex:1,fontSize:'0.85rem',color:'#1A1612',fontWeight:500}}>{o.customerName}</span>
                <StatusBadge status={o.status} />
                <span style={{fontSize:'0.78rem',color:'#8A7968',fontWeight:600}}>S/ {o.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats?.topProducts?.length > 0 && (
        <div style={s.card}>
          <div style={s.cardHeader}><h3 style={s.cardTitle}>Top 5 más consultados</h3></div>
          <div style={{padding:'0.75rem 1.5rem 1rem'}}>
            {stats.topProducts.map((p, i) => (
              <div key={p._id} style={{
                display:'flex',alignItems:'center',gap:'0.75rem',
                padding:'0.6rem 0',borderBottom:i<stats.topProducts.length-1?'1px solid #F5F0EB':'none',
              }}>
                <span style={{fontSize:'0.82rem',fontWeight:700,color:'#C9A96E',minWidth:20}}>#{i+1}</span>
                <span style={{flex:1,fontSize:'0.85rem',color:'#1A1612',fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</span>
                <span style={{fontSize:'0.78rem',color:'#25D366',fontWeight:600,whiteSpace:'nowrap'}}>{p.whatsappClicks ?? 0} clicks</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats?.lowStockProducts?.length > 0 && (
        <div style={{...s.card,borderLeft:'3px solid #C25E5E'}}>
          <div style={s.cardHeader}><h3 style={{...s.cardTitle,color:'#C25E5E'}}>Stock bajo ({stats.lowStockProducts.length})</h3></div>
          <div style={{padding:'0.75rem 1.5rem 1rem'}}>
            {stats.lowStockProducts.map((p, i) => (
              <div key={p._id} style={{
                display:'flex',alignItems:'center',gap:'0.75rem',
                padding:'0.55rem 0',borderBottom:i<stats.lowStockProducts.length-1?'1px solid #F5F0EB':'none',
              }}>
                <span style={{flex:1,fontSize:'0.85rem',color:'#1A1612',fontWeight:500}}>{p.name}</span>
                <span style={{fontSize:'0.78rem',color:'#C25E5E',fontWeight:700}}>Stock: {p.stock}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ActionIcon({ type, size = 20 }) {
  const props = { width: size, height: size, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:2, strokeLinecap:'round', strokeLinejoin:'round' };
  const paths = {
    plus:    <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></>,
    clipboard: <><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></>,
    gear:    <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    store:   <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
  };
  return <svg {...props}>{paths[type] || paths.plus}</svg>;
}

function StatusBadge({ status }) {
  const map = {
    pending:    { label: 'Pendiente', bg: '#FFF5E0', color: '#B8941E' },
    contacted:  { label: 'Contactado', bg: '#E8F0FE', color: '#1A73E8' },
    confirmed:  { label: 'Confirmado', bg: '#E0F5EC', color: '#1E8E5E' },
    delivered:  { label: 'Entregado', bg: '#E8F5E9', color: '#2E7D52' },
    cancelled:  { label: 'Cancelado', bg: '#FDE8E8', color: '#C25E5E' },
  };
  const m = map[status] || map.pending;
  return (
    <span style={{
      fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.04em',padding:'0.2rem 0.55rem',
      borderRadius:999,background:m.bg,color:m.color,whiteSpace:'nowrap',
    }}>{m.label}</span>
  );
}

// ── PRODUCTOS ──────────────────────────────────────────────────────────────
const CATEGORY_OPTIONS = ['Todas', 'Mujer', 'Hombre', 'Accesorios'];
const SORT_OPTIONS = [
  ['-createdAt', 'Más recientes'],
  ['createdAt', 'Más antiguos'],
  ['-whatsappClicks', 'Más consultados'],
  ['price', 'Menor precio'],
  ['-price', 'Mayor precio'],
  ['name', 'A-Z'],
];

function ProductSection({ onEdit, onAdd }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Todas');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('-createdAt');
  const [activeFilter, setActiveFilter] = useState('todos');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { sort: sortBy, limit: 100 };
      if (search) params.search = search;
      if (catFilter !== 'Todas') params.category = catFilter;
      if (featuredOnly) params.featured = 'true';
      if (lowStockOnly) params.lowStock = 'true';
      if (activeFilter === 'activos') params.isActive = 'true';
      else if (activeFilter === 'inactivos') params.isActive = 'false';
      const { data } = await productService.getAllAdmin(params);
      setProducts(data?.data || []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [search, catFilter, featuredOnly, lowStockOnly, sortBy, activeFilter]);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    await productService.remove(id);
    fetchProducts();
  };

  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <h3 style={s.cardTitle}>Productos ({products.length})</h3>
        <button style={s.btnAdd} onClick={onAdd}>+ Agregar</button>
      </div>

      {/* Filtros */}
      <div style={{
        display:'flex',flexWrap:'wrap',gap:'0.6rem',alignItems:'center',
        padding:'1rem 1.5rem',borderBottom:'1px solid #F0EAE0',background:'#FAF7F2',
      }}>
        <input placeholder="Buscar producto…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{...s.input,minWidth:180,flex:1}} />

        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{...s.input,minWidth:100,flex:'0 0 auto'}}>
          {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{...s.input,minWidth:130,flex:'0 0 auto'}}>
          {SORT_OPTIONS.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
        </select>

        <label style={{display:'flex',alignItems:'center',gap:'0.3rem',fontSize:'0.78rem',color:'#8A7968',cursor:'pointer',whiteSpace:'nowrap'}}>
          <input type="checkbox" checked={featuredOnly} onChange={e => setFeaturedOnly(e.target.checked)} />
          Destacados
        </label>

        <label style={{display:'flex',alignItems:'center',gap:'0.3rem',fontSize:'0.78rem',color:'#8A7968',cursor:'pointer',whiteSpace:'nowrap'}}>
          <input type="checkbox" checked={lowStockOnly} onChange={e => setLowStockOnly(e.target.checked)} />
          Stock bajo
        </label>

        <select value={activeFilter} onChange={e => setActiveFilter(e.target.value)}
          style={{...s.input,minWidth:100,flex:'0 0 auto',fontSize:'0.78rem'}}>
          <option value="todos">Todos</option>
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
        </select>
      </div>

      {loading && <p style={{padding:'2rem',color:'#8A7968'}}>Cargando…</p>}

      {!loading && products.length === 0 && (
        <p style={{padding:'2rem',textAlign:'center',color:'#8A7968'}}>No hay productos con estos filtros</p>
      )}

      {/* Tabla escritorio */}
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr style={s.thead}>
              <th style={s.th}>Img</th>
              <th style={s.th}>Nombre</th>
              <th style={s.th}>Cat.</th>
              <th style={s.th}>Precio</th>
              <th style={s.th}>Stock</th>
              <th style={s.th}>Dest.</th>
              <th style={s.th}>Estado</th>
              <th style={s.th}>WA</th>
              <th style={s.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} style={{...s.tr, opacity: p.isActive ? 1 : 0.5}}>
                <td style={s.td}>
                  {p.images?.[0]?.url
                    ? <img src={p.images[0].url} style={s.thumb} alt=""/>
                    : <div style={s.noThumb}><ImageIcon size={20} /></div>}
                </td>
                <td style={{...s.td, fontWeight:500, maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{p.name}</td>
                <td style={s.td}>{p.category}</td>
                <td style={s.td}>
                  S/ {p.price.toFixed(2)}
                  {p.oldPrice && <span style={{fontSize:'0.7rem',color:'#8A7968',textDecoration:'line-through',marginLeft:'0.2rem'}}>S/ {p.oldPrice.toFixed(2)}</span>}
                </td>
                <td style={{...s.td, textAlign:'center', color: p.stock > 0 && p.stock <= 5 ? '#C25E5E' : '#1A1612', fontWeight: p.stock <= 5 ? 700 : 400}}>
                  {p.stock ?? 0}
                </td>
                <td style={{...s.td, textAlign:'center'}}>
                  {p.featured ? <span style={{background:'#C9A96E',color:'#1A1612',fontSize:'0.62rem',fontWeight:700,padding:'0.15rem 0.4rem',borderRadius:4}}>SÍ</span> : <span style={{color:'#D0C8BE',fontSize:'0.7rem'}}>—</span>}
                </td>
                <td style={{...s.td, textAlign:'center'}}>
                  <span style={{
                    display:'inline-block',width:8,height:8,borderRadius:'50%',
                    background: p.isActive ? '#2E7D52' : '#C25E5E',
                  }}/>
                </td>
                <td style={{...s.td, textAlign:'center', color:'#25D366', fontWeight:600}}>{p.whatsappClicks ?? 0}</td>
                <td style={s.td}>
                  <button style={s.btnEdit} onClick={() => onEdit(p)}><PencilIcon size={14} /></button>
                  <button style={s.btnDel} onClick={() => handleDelete(p._id)}><TrashIcon size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards móvil */}
      <div style={s.mobileCards}>
        {products.map(p => (
          <div key={p._id} style={{...s.mobileCard, opacity: p.isActive ? 1 : 0.5}}>
            <div style={{display:'flex', gap:'0.75rem', alignItems:'center'}}>
              {p.images?.[0]?.url
                ? <img src={p.images[0].url} style={s.thumbMobile} alt=""/>
                : <div style={s.noThumbMobile}><ImageIcon size={24} /></div>}
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontWeight:600, fontSize:'0.92rem', color:'#1A1612', marginBottom:'0.2rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{p.name}</div>
                <div style={{fontSize:'0.8rem', color:'#8A7968'}}>
                  {p.category} · S/ {p.price.toFixed(2)}
                  {p.stock !== undefined && <span> · Stock: {p.stock}</span>}
                </div>
              </div>
            </div>
            <div style={{display:'flex', gap:'0.5rem', marginTop:'0.75rem'}}>
              <button style={{...s.btnEdit, flex:1, textAlign:'center'}} onClick={() => onEdit(p)}><PencilIcon size={14} /> Editar</button>
              <button style={{...s.btnDel, flex:1, textAlign:'center'}} onClick={() => handleDelete(p._id)}><TrashIcon size={14} /> Borrar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PEDIDOS ────────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  ['', 'Todos'],
  ['pending', 'Pendiente'],
  ['contacted', 'Contactado'],
  ['confirmed', 'Confirmado'],
  ['delivered', 'Entregado'],
  ['cancelled', 'Cancelado'],
];

function OrdersSection({ waNumber }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState(null);
  const num = waNumber?.replace(/\D/g, '');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const { data } = await orderService.getAll(params);
      setOrders(data?.data || []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [statusFilter, search]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await orderService.updateStatus(id, newStatus);
      fetchOrders();
      if (detail?._id === id) {
        setDetail(prev => prev ? { ...prev, status: newStatus } : prev);
      }
    } catch { alert('Error al actualizar estado'); }
  };

  const handleNotesSave = async (id, notes) => {
    try {
      await orderService.updateNotes(id, notes);
      setDetail(prev => prev ? { ...prev, notes } : prev);
    } catch { alert('Error al guardar notas'); }
  };

  const contactWa = (phone) => {
    const p = phone?.replace(/\D/g, '');
    if (p) window.open(`https://wa.me/${p}`, '_blank');
  };

  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <h3 style={s.cardTitle}>Pedidos ({orders.length})</h3>
      </div>

      <div style={{
        display:'flex',flexWrap:'wrap',gap:'0.6rem',alignItems:'center',
        padding:'1rem 1.5rem',borderBottom:'1px solid #F0EAE0',background:'#FAF7F2',
      }}>
        <input placeholder="Buscar por nombre o celular…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{...s.input,minWidth:180,flex:1}} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{...s.input,minWidth:120,flex:'0 0 auto'}}>
          {STATUS_OPTIONS.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      {loading && <p style={{padding:'2rem',color:'#8A7968'}}>Cargando pedidos…</p>}

      {!loading && orders.length === 0 && (
        <p style={{padding:'2rem',textAlign:'center',color:'#8A7968'}}>No hay pedidos</p>
      )}

      {/* Vista detalle */}
      {detail ? (
        <div style={{padding:'1.25rem 1.5rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <h4 style={{fontSize:'1rem',fontWeight:600,color:'#1A1612'}}>
              Pedido de <strong>{detail.customerName}</strong>
            </h4>
            <button style={{background:'none',border:'1px solid #D0C8BE',borderRadius:6,padding:'0.3rem 0.8rem',fontSize:'0.8rem',cursor:'pointer'}}
              onClick={() => setDetail(null)}>← Volver</button>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem',fontSize:'0.85rem',color:'#1A1612'}}>
            <div><strong>Cliente:</strong> {detail.customerName}</div>
            <div><strong>Celular:</strong> {detail.customerPhone}
              <button style={{background:'none',border:'none',color:'#25D366',cursor:'pointer',marginLeft:'0.5rem',fontSize:'0.8rem'}}
                onClick={() => contactWa(detail.customerPhone)}><MobileIcon size={14} /> Contactar</button>
            </div>
            {detail.customerAddress && <div style={{gridColumn:'1/-1'}}><strong>Dirección:</strong> {detail.customerAddress}</div>}
            <div><strong>Fecha:</strong> {new Date(detail.createdAt).toLocaleDateString('es-PE', { dateStyle: 'long' })}</div>
            <div><strong>Total:</strong> S/ {detail.total.toFixed(2)}</div>
            <div style={{gridColumn:'1/-1'}}>
              <strong>Estado:</strong>{' '}
              <select value={detail.status} onChange={e => handleStatusChange(detail._id, e.target.value)}
                style={{marginLeft:'0.5rem',padding:'0.25rem 0.5rem',borderRadius:6,border:'1.5px solid #E0D8CE',fontSize:'0.82rem'}}>
                {STATUS_OPTIONS.filter(([v]) => v).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div style={{gridColumn:'1/-1'}}>
              <strong>Notas internas:</strong>
              <textarea defaultValue={detail.notes || ''}
                onBlur={e => handleNotesSave(detail._id, e.target.value)}
                style={{display:'block',width:'100%',marginTop:'0.4rem',padding:'0.5rem 0.75rem',borderRadius:8,border:'1.5px solid #E0D8CE',fontSize:'0.85rem',fontFamily:'inherit',resize:'vertical',minHeight:60,background:'#FAF7F2'}}
                placeholder="Agregar notas internas…" />
            </div>
          </div>

          <div style={{borderTop:'1px solid #F0EAE0',paddingTop:'0.75rem'}}>
            <strong style={{fontSize:'0.85rem'}}>Productos ({detail.items.length})</strong>
            {detail.items.map((item, i) => (
              <div key={i} style={{
                display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.5rem 0',
                borderBottom:i<detail.items.length-1?'1px solid #F5F0EB':'none',fontSize:'0.85rem',
              }}>
                {item.image
                  ? <img src={item.image} style={{width:40,height:48,borderRadius:6,objectFit:'cover'}} alt=""/>
                  : <div style={{width:40,height:48,borderRadius:6,background:'#F0EBE3',display:'flex',alignItems:'center',justifyContent:'center',opacity:0.4}}><ImageIcon size={20} /></div>}
                <span style={{flex:1,fontWeight:500}}>{item.name}</span>
                {item.size && <span style={{color:'#8A7968',fontSize:'0.78rem'}}>T: {item.size}</span>}
                {item.color && <span style={{color:'#8A7968',fontSize:'0.78rem'}}>C: {item.color}</span>}
                <span style={{color:'#8A7968'}}>x{item.quantity}</span>
                <span style={{fontWeight:600}}>S/ {item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {detail.whatsappMessage && (
            <div style={{borderTop:'1px solid #F0EAE0',paddingTop:'0.75rem'}}>
              <strong style={{fontSize:'0.85rem',display:'block',marginBottom:'0.4rem'}}>Mensaje WhatsApp:</strong>
              <pre style={{fontSize:'0.78rem',color:'#8A7968',whiteSpace:'pre-wrap',fontFamily:'monospace',background:'#F5F1EB',padding:'0.75rem',borderRadius:8,lineHeight:1.5}}>{detail.whatsappMessage}</pre>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Tabla escritorio */}
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  <th style={s.th}>Cliente</th>
                  <th style={s.th}>Celular</th>
                  <th style={s.th}>Items</th>
                  <th style={s.th}>Total</th>
                  <th style={s.th}>Estado</th>
                  <th style={s.th}>Fecha</th>
                  <th style={s.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id} style={s.tr}>
                    <td style={{...s.td,fontWeight:500}}>{o.customerName}</td>
                    <td style={s.td}>{o.customerPhone}</td>
                    <td style={{...s.td,textAlign:'center'}}>{o.items?.length ?? 0}</td>
                    <td style={{...s.td,fontWeight:600}}>S/ {o.total.toFixed(2)}</td>
                    <td style={s.td}><StatusBadge status={o.status} /></td>
                    <td style={{...s.td,fontSize:'0.78rem',color:'#8A7968'}}>
                      {new Date(o.createdAt).toLocaleDateString('es-PE', { day:'2-digit', month:'2-digit' })}
                    </td>
                    <td style={s.td}>
                      <button style={s.btnEdit} onClick={() => setDetail(o)}><EyeIcon size={14} /></button>
                      <button style={{...s.btnEdit,marginLeft:'0.3rem'}}
                        onClick={() => contactWa(o.customerPhone)}><MobileIcon size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards móvil */}
          <div style={s.mobileCards}>
            {orders.map(o => (
              <div key={o._id} style={s.mobileCard}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'start'}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:'0.92rem',color:'#1A1612'}}>{o.customerName}</div>
                    <div style={{fontSize:'0.8rem',color:'#8A7968',marginTop:'0.2rem'}}>{o.customerPhone} · {o.items?.length} items</div>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'0.6rem'}}>
                  <span style={{fontWeight:700,fontSize:'1rem',color:'#1A1612'}}>S/ {o.total.toFixed(2)}</span>
                  <div style={{display:'flex',gap:'0.4rem'}}>
                    <button style={s.btnEdit} onClick={() => setDetail(o)}><EyeIcon size={14} /> Ver</button>
                    <button style={s.btnEdit} onClick={() => contactWa(o.customerPhone)}><MobileIcon size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── USUARIOS ───────────────────────────────────────────────────────────────
function UserSection() {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'admin' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const set = (k,v) => setForm(f => ({...f, [k]:v}));

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password)
      return setMsg({ ok:false, text:'Nombre, email y contraseña son requeridos' });
    setSaving(true);
    setMsg(null);
    try {
      await authService.createUser(form);
      setMsg({ ok:true, text:`Usuario ${form.email} creado correctamente` });
      setForm({ name:'', email:'', password:'', role:'admin' });
    } catch(err) {
      setMsg({ ok:false, text: err.response?.data?.message || 'Error creando usuario' });
    } finally { setSaving(false); }
  };

  return (
    <div style={s.configCard}>
      <h3 style={s.cardTitle}>Agregar nuevo usuario</h3>
      <p style={{fontSize:'0.85rem', color:'#8A7968', margin:'0.5rem 0 1.25rem'}}>
        Los usuarios con rol Admin pueden gestionar productos y configuración.
      </p>
      {msg && (
        <div style={{
          padding:'0.75rem 1rem', borderRadius:8, marginBottom:'1rem', fontSize:'0.88rem',
          background: msg.ok ? '#F0FBF4' : '#FFF5F5',
          border: `1px solid ${msg.ok ? '#A8E6C3' : '#F5C0C0'}`,
          color: msg.ok ? '#2E7D52' : '#C25E5E',
        }}>{msg.text}</div>
      )}
      <div style={s.configRow}>
        <div style={s.formGroup}>
          <label style={s.label}>Nombre</label>
          <input style={s.input} placeholder="Nombre completo"
            value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div style={s.formGroup}>
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" placeholder="correo@ejemplo.com"
            value={form.email} onChange={e => set('email', e.target.value)} />
        </div>
        <div style={s.formGroup}>
          <label style={s.label}>Contraseña</label>
          <input style={s.input} type="password" placeholder="Mínimo 6 caracteres"
            value={form.password} onChange={e => set('password', e.target.value)} />
        </div>
        <div style={s.formGroup}>
          <label style={s.label}>Rol</label>
          <select style={s.input} value={form.role} onChange={e => set('role', e.target.value)}>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
          </select>
        </div>
        <button style={s.btnSave} onClick={handleCreate} disabled={saving}>
          {saving ? 'Creando…' : <><PlusCircleIcon size={14} /> Crear usuario</>}
        </button>
      </div>
    </div>
  );
}

// ── CONFIGURACION (CENTRO DE OPERACION) ──────────────────────────────────
function ConfigSection() {
  const [form, setForm] = useState({
    storeName: '', storeSlogan: '', storeDescription: '',
    waNumber: '', facebook: '', instagram: '', tiktok: '', address: '', hours: '',
    logo: '', banner: '', primaryColor: '#C9A96E', secondaryColor: '#1A1612', bgColor: '#FAF7F2', visualMode: 'claro-premium',
    freeShippingText: '', freeShippingMin: '', waMessage: '',
    promoBannerEnabled: false, featuredProductsEnabled: false, stockVisible: false,
  });
  const [saving, setSaving] = useState(false);
  const [waError, setWaError] = useState('');
  const logoRef = useRef();
  const bannerRef = useRef();
  const [logoPreview, setLogoPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');

  useEffect(() => {
    configService.get().then(({data}) => {
      if (data?.data) {
        setForm(f => ({...f, ...data.data}));
        if (data.data.logo) setLogoPreview(data.data.logo);
        if (data.data.banner) setBannerPreview(data.data.banner);
      }
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    const waErr = validatePeruNumber(form.waNumber || '');
    if (waErr) return setWaError(waErr);
    setWaError('');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== '' && v != null) {
          if (k === 'waNumber') fd.append(k, normalizeWaNumber(v));
          else if (v instanceof File) fd.append(k, v);
          else if (typeof v === 'boolean') fd.append(k, v ? 'true' : 'false');
          else fd.append(k, v);
        }
      });
      await api.put('/config', fd);
      toast.success('Configuracion guardada correctamente');
    } catch {
      toast.error('Error al guardar configuracion');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
    setForm(f => ({...f, logo: file}));
  };

  const handleBannerFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBannerPreview(URL.createObjectURL(file));
    setForm(f => ({...f, banner: file}));
  };

  const set = (k, v) => setForm(f => ({...f, [k]: v}));

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
      <div style={s.configCard}>
        <h3 style={s.cardTitle}>Identidad de la tienda</h3>
        <div style={s.configRow}>
          <Field label="Nombre de la tienda">
            <input style={s.input} value={form.storeName || ''} onChange={e => set('storeName', e.target.value)} />
          </Field>
          <Field label="Eslogan">
            <input style={s.input} value={form.storeSlogan || ''} onChange={e => set('storeSlogan', e.target.value)} />
          </Field>
          <Field label="Descripcion">
            <textarea style={{...s.input, minHeight:70, resize:'vertical'}} value={form.storeDescription || ''} onChange={e => set('storeDescription', e.target.value)} />
          </Field>
        </div>
      </div>

      <div style={s.configCard}>
        <h3 style={s.cardTitle}>Contacto y Redes</h3>
        <div style={s.configRow}>
          <Field label="WhatsApp (9 digitos)">
            <input style={{...s.input, borderColor: waError ? '#C25E5E' : undefined}} placeholder="987654321" maxLength={9}
              value={(form.waNumber || '').replace(/\D/g, '')}
              onChange={e => { set('waNumber', e.target.value.replace(/\D/g, '').slice(0,9)); setWaError(''); }} />
            {waError && <span style={{fontSize:'0.72rem',color:'#C25E5E',marginTop:'0.2rem'}}>{waError}</span>}
          </Field>
          <Field label="Facebook">
            <input style={s.input} placeholder="URL de Facebook" value={form.facebook || ''} onChange={e => set('facebook', e.target.value)} />
          </Field>
          <Field label="Instagram">
            <input style={s.input} placeholder="URL de Instagram" value={form.instagram || ''} onChange={e => set('instagram', e.target.value)} />
          </Field>
          <Field label="TikTok">
            <input style={s.input} placeholder="URL de TikTok" value={form.tiktok || ''} onChange={e => set('tiktok', e.target.value)} />
          </Field>
          <Field label="Direccion">
            <input style={s.input} placeholder="Direccion de la tienda" value={form.address || ''} onChange={e => set('address', e.target.value)} />
          </Field>
          <Field label="Horario">
            <input style={s.input} placeholder="Ej: Lunes a Sabado 9:00 am – 7:00 pm" value={form.hours || ''} onChange={e => set('hours', e.target.value)} />
          </Field>
        </div>
      </div>

      <div style={s.configCard}>
        <h3 style={s.cardTitle}>Apariencia</h3>
        <div style={s.configRow}>
          <Field label="Logo">
            <input type="file" ref={logoRef} accept="image/*" onChange={handleLogoFile} style={{fontSize:'0.85rem'}} />
            <input style={{...s.input, marginTop:'0.3rem'}} placeholder="o pegar URL" value={form.logo && typeof form.logo === 'string' ? form.logo : ''}
              onChange={e => { set('logo', e.target.value); setLogoPreview(e.target.value); }} />
            {logoPreview && <img src={logoPreview} style={{maxHeight:60,marginTop:'0.35rem',borderRadius:6}} alt="logo preview" />}
          </Field>
          <Field label="Banner">
            <input type="file" ref={bannerRef} accept="image/*" onChange={handleBannerFile} style={{fontSize:'0.85rem'}} />
            <input style={{...s.input, marginTop:'0.3rem'}} placeholder="o pegar URL" value={form.banner && typeof form.banner === 'string' ? form.banner : ''}
              onChange={e => { set('banner', e.target.value); setBannerPreview(e.target.value); }} />
            {bannerPreview && <img src={bannerPreview} style={{maxHeight:80,marginTop:'0.35rem',borderRadius:6}} alt="banner preview" />}
          </Field>
          <Field label="Color primario">
            <input type="color" style={{...s.input, padding:'0.2rem', minWidth:60, width:60, height:38, cursor:'pointer'}} value={form.primaryColor} onChange={e => set('primaryColor', e.target.value)} />
          </Field>
          <Field label="Color secundario">
            <input type="color" style={{...s.input, padding:'0.2rem', minWidth:60, width:60, height:38, cursor:'pointer'}} value={form.secondaryColor} onChange={e => set('secondaryColor', e.target.value)} />
          </Field>
          <Field label="Color de fondo">
            <input type="color" style={{...s.input, padding:'0.2rem', minWidth:60, width:60, height:38, cursor:'pointer'}} value={form.bgColor} onChange={e => set('bgColor', e.target.value)} />
          </Field>
          <Field label="Modo visual">
            <select style={s.input} value={form.visualMode} onChange={e => set('visualMode', e.target.value)}>
              <option value="claro-premium">Claro Premium</option>
              <option value="oscuro-premium">Oscuro Premium</option>
              <option value="blanco-azul-premium">Blanco Azul Premium</option>
            </select>
          </Field>
        </div>
      </div>

      <div style={s.configCard}>
        <h3 style={s.cardTitle}>Marketing y Ventas</h3>
        <div style={s.configRow}>
          <Field label="Texto envio gratis">
            <input style={s.input} value={form.freeShippingText || ''} onChange={e => set('freeShippingText', e.target.value)} />
          </Field>
          <Field label="Monto minimo envio gratis">
            <input style={s.input} type="number" value={form.freeShippingMin || ''} onChange={e => set('freeShippingMin', e.target.value)} />
          </Field>
          <Field label="Mensaje WhatsApp">
            <textarea style={{...s.input, minHeight:70, resize:'vertical'}} placeholder="Mensaje automatico para WhatsApp" value={form.waMessage || ''} onChange={e => set('waMessage', e.target.value)} />
          </Field>
        </div>
        <div style={{display:'flex', gap:'0.65rem', flexWrap:'wrap', marginTop:'1rem'}}>
          <Toggle label="Banner promocional" checked={form.promoBannerEnabled} onChange={v => set('promoBannerEnabled', v)} />
          <Toggle label="Productos destacados" checked={form.featuredProductsEnabled} onChange={v => set('featuredProductsEnabled', v)} />
          <Toggle label="Stock visible" checked={form.stockVisible} onChange={v => set('stockVisible', v)} />
        </div>
      </div>

      <button style={s.btnSave} onClick={handleSave} disabled={saving}>
        {saving ? 'Guardando…' : <><SaveIcon size={14} /> Guardar configuracion</>}
      </button>
    </div>
  );
}

// ── MODAL PRODUCTO ─────────────────────────────────────────────────────────
const TALLAS_PRESET = ['XS','S','M','L','XL','XXL','6','7','8','9','10','11','12','Único'];
const COLOR_PRESET = ['Negro','Blanco','Gris','Rojo','Azul','Verde','Amarillo','Rosa','Beige','Marrón','Dorado','Plateado'];

function ProductModal({ product, onClose, onSaved }) {
  const isEdit = !!product;
  const fileRef = useRef();
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(product?.images?.[0]?.url || '');
  const [formTab, setFormTab] = useState('info');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [images, setImages] = useState(product?.images || []);
  const [form, setForm] = useState({
    name:        product?.name        || '',
    description: product?.description || '',
    price:       product?.price       || '',
    oldPrice:    product?.oldPrice    || '',
    category:    product?.category    || 'Mujer',
    badge:       product?.badge       || '',
    sizes:       product?.sizes || [],
    colors:      product?.colors || [],
    stock:       product?.stock ?? '',
    featured:    product?.featured    || false,
    isActive:    product?.isActive    ?? true,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setSelectedFiles(prev => [...prev, ...files]);
    const urls = files.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...urls]);
    if (!preview) setPreview(urls[0]);
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm('Eliminar esta imagen?')) return;
    try {
      await productService.deleteImage(product._id, imageId);
      setImages(prev => {
        const deleted = prev.find(img => img._id === imageId);
        const updated = prev.filter(img => img._id !== imageId);
        if (deleted?.isMain && updated.length > 0) {
          updated[0].isMain = true;
        }
        return updated;
      });
    } catch (err) {
      alert('Error al eliminar imagen');
    }
  };

  const handleSetMain = async (imageId) => {
    try {
      await productService.setMainImage(product._id, imageId);
      setImages(prev => prev.map(img => ({
        ...img,
        isMain: img._id === imageId,
      })));
    } catch (err) {
      alert('Error al marcar como principal');
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.price) return alert('Nombre y precio son requeridos');
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
      else fd.append(k, v);
    });
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((f, i) => fd.append('images', f));
    }
    try {
      if (isEdit) await productService.update(product._id, fd);
      else        await productService.create(fd);
      onSaved();
      setTimeout(() => window.location.reload(), 300);
    } catch (err) {
      alert(err.response?.data?.message || 'Error guardando');
    } finally { setSaving(false); }
  };

  return (
    <div style={ms.overlay} onClick={onClose}>
      <div style={{...ms.modal, maxWidth:600}} onClick={e => e.stopPropagation()}>
        <div style={ms.header}>
          <h2 style={ms.title}>{isEdit ? 'Editar Producto' : 'Agregar Producto'}</h2>
          <button onClick={onClose} style={ms.close}><CloseIcon size={16} /></button>
        </div>
        <div style={{
          display: 'flex', gap: '0.25rem', padding: '0.75rem 1.5rem 0',
          borderBottom: '1px solid #F0EAE0', overflowX: 'auto',
        }}>
          {[
            ['info', 'Informacion'],
            ['pricing', 'Precio/Stock'],
            ['variants', 'Variantes'],
            ['images', 'Imagenes'],
            ['status', 'Estado'],
          ].map(([k, label]) => (
            <button key={k} onClick={() => setFormTab(k)}
              style={{
                padding: '0.4rem 0.85rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600,
                border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit',
                background: formTab === k ? '#1A1612' : 'transparent',
                color: formTab === k ? '#C9A96E' : '#8A7968',
                transition: 'all .2s',
              }}>{label}</button>
          ))}
        </div>
        <div style={ms.body}>
          {formTab === 'info' && (
            <>
              <Field label="Nombre *">
                <input style={ms.input} value={form.name} onChange={e => set('name', e.target.value)} />
              </Field>
              <Field label="Descripción">
                <textarea style={{...ms.input, minHeight:70, resize:'vertical'}}
                  value={form.description} onChange={e => set('description', e.target.value)} />
              </Field>
              <div style={ms.row}>
                <Field label="Categoría">
                  <select style={ms.input} value={form.category} onChange={e => set('category', e.target.value)}>
                    <option>Mujer</option><option>Hombre</option><option>Accesorios</option>
                  </select>
                </Field>
                <Field label="Etiqueta">
                  <select style={ms.input} value={form.badge} onChange={e => set('badge', e.target.value)}>
                    <option value="">Sin etiqueta</option>
                    <option value="new">Nuevo</option>
                    <option value="sale">Oferta</option>
                    <option value="hot">Trending</option>
                  </select>
                </Field>
              </div>
            </>
          )}
          {formTab === 'pricing' && (
            <div style={ms.row3}>
              <Field label="Precio (S/) *">
                <input style={ms.input} type="number" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} />
              </Field>
              <Field label="Precio anterior">
                <input style={ms.input} type="number" step="0.01" value={form.oldPrice} onChange={e => set('oldPrice', e.target.value)} />
              </Field>
              <Field label="Stock">
                <input style={ms.input} type="number" value={form.stock} onChange={e => set('stock', e.target.value)} />
              </Field>
            </div>
          )}
          {formTab === 'variants' && (
            <div style={ms.row}>
              <Field label="Tallas">
                <SizeSelector selected={form.sizes} onChange={v => set('sizes', v)} />
              </Field>
              <Field label="Colores">
                <ColorSelector selected={form.colors} onChange={v => set('colors', v)} />
              </Field>
            </div>
          )}
          {formTab === 'images' && (
            <div>
              {images.length > 0 && (
                <div style={{marginBottom:'0.75rem'}}>
                  <label style={{fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'#8A7968',display:'block',marginBottom:'0.4rem'}}>Imágenes existentes</label>
                  <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
                    {images.map((img) => (
                      <div key={img._id} style={{
                        position:'relative', width:88, height:88, borderRadius:8, overflow:'hidden', flexShrink:0,
                        border: img.isMain ? '2px solid #C9A96E' : '2px solid transparent',
                      }}>
                        <img src={img.url} style={{width:'100%',height:'100%',objectFit:'cover'}} alt=""/>
                        {img.isMain && (
                          <span style={{
                            position:'absolute', top:0, left:0,
                            background:'#C9A96E', color:'#1A1612',
                            fontSize:'0.55rem', fontWeight:700,
                            padding:'1px 5px', borderBottomRightRadius:6,
                          }}>Principal</span>
                        )}
                        <div style={{
                          position:'absolute', bottom:0, left:0, right:0,
                          display:'flex', gap:0,
                        }}>
                          {!img.isMain && (
                            <button onClick={() => handleSetMain(img._id)} title="Marcar como principal"
                              style={{
                                flex:1, background:'rgba(26,22,18,0.75)', border:'none',
                                color:'white', fontSize:'0.6rem', padding:'3px 0',
                                cursor:'pointer', fontFamily:'inherit',
                              }}>Principal</button>
                          )}
                          <button onClick={() => handleDeleteImage(img._id)} title="Eliminar imagen"
                            style={{
                              flex:1, background:'rgba(180,40,40,0.85)', border:'none',
                              color:'white', fontSize:'0.6rem', padding:'3px 0',
                              cursor:'pointer', fontFamily:'inherit',
                            }}>Eliminar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <Field label="Agregar imágenes">
                <input type="file" ref={fileRef} accept="image/*" multiple onChange={handleFile} style={{fontSize:'0.88rem'}} />
              </Field>
              {previews.length > 0 && (
                <div style={{display:'flex',gap:'0.5rem',marginTop:'0.5rem',overflowX:'auto'}}>
                  {previews.map((url, i) => (
                    <button key={i} onClick={() => setPreview(url)}
                      style={{
                        flexShrink:0,width:56,height:56,borderRadius:8,overflow:'hidden',
                        border: preview === url ? '2px solid #C9A96E' : '2px solid transparent',
                        padding:0,cursor:'pointer',background:'none',
                      }}>
                      <img src={url} style={{width:'100%',height:'100%',objectFit:'cover'}} alt=""/>
                    </button>
                  ))}
                </div>
              )}
              {preview && (
                <div style={{position:'relative',marginTop:'0.75rem',display:'inline-block'}}>
                  <img src={preview} style={{maxHeight:160,borderRadius:8,objectFit:'cover'}} alt="preview" />
                </div>
              )}
            </div>
          )}
          {formTab === 'status' && (
            <div style={ms.toggleRow}>
              <Toggle label="Destacado" checked={form.featured} onChange={v => set('featured', v)} />
              <Toggle label="Activo" checked={form.isActive} onChange={v => set('isActive', v)} />
            </div>
          )}
        </div>
        <div style={{...ms.footer, position:'sticky', bottom:0, background:'white', zIndex:10}}>
          <button style={ms.btnCancel} onClick={onClose}>Cancelar</button>
          <button style={ms.btnSave} onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando…' : <><SaveIcon size={14} /> Guardar</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label style={{
      display:'flex',alignItems:'center',gap:'0.5rem',cursor:'pointer',
      padding:'0.35rem 0.75rem',borderRadius:8,border:'1.5px solid #E0D8CE',
      background: checked ? '#1A1612' : 'transparent',transition:'all .2s',
      userSelect:'none',
    }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        style={{display:'none'}} />
      <span style={{
        width:32,height:18,borderRadius:999,position:'relative',transition:'all .25s',
        background: checked ? '#C9A96E' : '#D0C8BE',flexShrink:0,
      }}>
        <span style={{
          position:'absolute',top:2,left:checked?16:2,width:14,height:14,borderRadius:'50%',
          background:'white',transition:'all .25s',
        }}/>
      </span>
      <span style={{fontSize:'0.78rem',fontWeight:600,color: checked ? '#C9A96E' : '#8A7968'}}>{label}</span>
    </label>
  );
}

function SizeSelector({ selected = [], onChange }) {
  const [custom, setCustom] = React.useState('');
  const toggle = (t) => onChange(selected.includes(t) ? selected.filter(s => s !== t) : [...selected, t]);
  const addCustom = () => {
    const val = custom.trim().toUpperCase();
    if (!val || selected.includes(val)) return;
    onChange([...selected, val]);
    setCustom('');
  };
  return (
    <div>
      <div style={{display:'flex',flexWrap:'wrap',gap:'0.35rem',marginBottom:'0.4rem'}}>
        {TALLAS_PRESET.map(t => (
          <ChipBtn key={t} label={t} selected={selected.includes(t)} onClick={() => toggle(t)} />
        ))}
      </div>
      <div style={{display:'flex',gap:'0.4rem'}}>
        <input style={{...ms.input,flex:1,minWidth:0,padding:'0.4rem 0.65rem',fontSize:'0.82rem'}}
          placeholder="Talla personalizada (ej: 38)" value={custom}
          onChange={e => setCustom(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustom())} />
        <button type="button" onClick={addCustom}
          style={{background:'#C9A96E',color:'#1A1612',border:'none',borderRadius:8,padding:'0 0.75rem',fontWeight:700,cursor:'pointer',fontSize:'0.85rem'}}>+</button>
      </div>
      {selected.length > 0 && (
        <div style={{marginTop:'0.3rem',fontSize:'0.75rem',color:'#8A7968'}}>
          {selected.join(', ')}
        </div>
      )}
    </div>
  );
}

function ColorSelector({ selected = [], onChange }) {
  const [custom, setCustom] = React.useState('');
  const toggle = (t) => onChange(selected.includes(t) ? selected.filter(s => s !== t) : [...selected, t]);
  const addCustom = () => {
    const val = custom.trim();
    if (!val || selected.includes(val)) return;
    onChange([...selected, val]);
    setCustom('');
  };
  return (
    <div>
      <div style={{display:'flex',flexWrap:'wrap',gap:'0.35rem',marginBottom:'0.4rem'}}>
        {COLOR_PRESET.map(c => (
          <ChipBtn key={c} label={c} selected={selected.includes(c)} onClick={() => toggle(c)} />
        ))}
      </div>
      <div style={{display:'flex',gap:'0.4rem'}}>
        <input style={{...ms.input,flex:1,minWidth:0,padding:'0.4rem 0.65rem',fontSize:'0.82rem'}}
          placeholder="Color personalizado" value={custom}
          onChange={e => setCustom(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustom())} />
        <button type="button" onClick={addCustom}
          style={{background:'#C9A96E',color:'#1A1612',border:'none',borderRadius:8,padding:'0 0.75rem',fontWeight:700,cursor:'pointer',fontSize:'0.85rem'}}>+</button>
      </div>
      {selected.length > 0 && (
        <div style={{marginTop:'0.3rem',fontSize:'0.75rem',color:'#8A7968'}}>
          {selected.join(', ')}
        </div>
      )}
    </div>
  );
}

function ChipBtn({ label, selected, onClick }) {
  return (
    <button type="button" onClick={onClick}
      style={{
        padding:'0.25rem 0.65rem',borderRadius:999,fontSize:'0.8rem',cursor:'pointer',
        border: selected ? '1.5px solid #1A1612' : '1.5px solid #E0D8CE',
        background: selected ? '#1A1612' : 'transparent',
        color: selected ? '#C9A96E' : '#8A7968',
        fontWeight: selected ? 600 : 400,transition:'all .15s',fontFamily:'inherit',
      }}>{label}</button>
  );
}

function Field({ label, children }) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'0.35rem'}}>
      <label style={{fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'#8A7968'}}>{label}</label>
      {children}
    </div>
  );
}

// ── ESTILOS ────────────────────────────────────────────────────────────────
const s = {
  page:          { display:'flex', minHeight:'100vh', background:'#FAF7F2', fontFamily:'sans-serif' },
  sidebar:       { width:220, background:'#1A1612', display:'flex', flexDirection:'column', padding:'1.5rem 1rem', position:'sticky', top:0, height:'100vh', flexShrink:0 },
  sidebarLogo:   { fontFamily:'serif', fontSize:'1.5rem', color:'#FAF7F2', letterSpacing:'0.05em', marginBottom:'2rem' },
  sidebarNav:    { display:'flex', flexDirection:'column', gap:'0.25rem', flex:1 },
  sideLink:      { color:'#B0A899', padding:'0.65rem 0.75rem', borderRadius:6, cursor:'pointer', fontSize:'0.88rem', fontWeight:500 },
  sideLinkActive:{ background:'rgba(201,169,110,0.12)', color:'#C9A96E' },
  sideUser:      { color:'#8A7968', fontSize:'0.78rem', paddingTop:'1rem', borderTop:'1px solid rgba(255,255,255,0.08)' },

  main:          { flex:1, padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1.5rem', overflowY:'auto', minWidth:0 },

  mobileHeader:  { display:'none', alignItems:'center', justifyContent:'space-between', background:'#1A1612', padding:'0.85rem 1.25rem', borderRadius:10, marginBottom:'0.25rem' },
  mobileLogo:    { fontFamily:'serif', fontSize:'1.3rem', color:'#FAF7F2' },
  hamburger:     { display:'flex', flexDirection:'column', gap:4, background:'none', border:'none', cursor:'pointer', padding:'0.3rem' },
  bar:           { width:20, height:2, background:'#C9A96E', borderRadius:2, display:'block' },

  mobileMenu:    { background:'#1A1612', borderRadius:10, padding:'0.5rem', marginBottom:'0.5rem', display:'flex', flexDirection:'column' },
  mobileMenuItem:{ color:'#B0A899', padding:'0.75rem 1rem', fontSize:'0.92rem', cursor:'pointer', borderRadius:6 },
  mobileMenuActive:{ color:'#C9A96E', background:'rgba(201,169,110,0.12)' },

  card:          { background:'white', borderRadius:12, overflow:'hidden', boxShadow:'0 2px 16px rgba(0,0,0,0.06)' },
  configCard:    { background:'white', borderRadius:12, padding:'1.5rem', boxShadow:'0 2px 16px rgba(0,0,0,0.06)' },
  configRow:     { display:'flex', alignItems:'flex-end', gap:'1rem', flexWrap:'wrap', marginTop:'1rem' },
  cardHeader:    { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.5rem', borderBottom:'1px solid #F0EAE0' },
  cardTitle:     { fontFamily:'serif', fontSize:'1.05rem', color:'#1A1612' },
  btnAdd:        { background:'#1A1612', color:'#C9A96E', border:'none', fontFamily:'sans-serif', fontSize:'0.82rem', fontWeight:700, padding:'0.5rem 1.1rem', borderRadius:6, cursor:'pointer' },
  btnSave:       { background:'#C9A96E', color:'#1A1612', border:'none', fontFamily:'sans-serif', fontSize:'0.82rem', fontWeight:700, padding:'0.5rem 1.1rem', borderRadius:6, cursor:'pointer', whiteSpace:'nowrap' },

  tableWrap:     { overflowX:'auto' },
  table:         { width:'100%', borderCollapse:'collapse', minWidth:700 },
  thead:         { background:'#FAF7F2' },
  th:            { padding:'0.65rem 0.75rem', textAlign:'left', fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:'#8A7968', whiteSpace:'nowrap' },
  tr:            { borderBottom:'1px solid #F5F0EB' },
  td:            { padding:'0.65rem 0.75rem', fontSize:'0.85rem', color:'#1A1612' },
  thumb:         { width:40, height:40, objectFit:'cover', borderRadius:6 },
  noThumb:       { width:40, height:40, background:'#F0EBE3', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', opacity:0.5, color:'#8A7968' },
  btnEdit:       { background:'none', border:'1px solid #D0C8BE', borderRadius:6, padding:'0.3rem 0.6rem', cursor:'pointer', marginRight:'0.3rem', fontSize:'0.85rem' },
  btnDel:        { background:'none', border:'1px solid #F5C0C0', borderRadius:6, padding:'0.3rem 0.6rem', cursor:'pointer', fontSize:'0.85rem' },

  mobileCards:   { display:'none', flexDirection:'column', gap:'0.75rem', padding:'1rem' },
  mobileCard:    { border:'1px solid #F0EAE0', borderRadius:10, padding:'0.85rem' },
  thumbMobile:   { width:52, height:52, objectFit:'cover', borderRadius:8, flexShrink:0 },
  noThumbMobile: { width:52, height:52, background:'#F0EBE3', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', opacity:0.5, flexShrink:0, color:'#8A7968' },

  formGroup:     { display:'flex', flexDirection:'column', gap:'0.35rem' },
  label:         { fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:'#8A7968' },
  input:         { border:'1.5px solid #E0D8CE', borderRadius:8, padding:'0.55rem 0.8rem', fontFamily:'sans-serif', fontSize:'0.88rem', outline:'none', background:'#FAF7F2', minWidth:140, color:'#1A1612' },

  quickActions: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:'0.75rem' },
  quickBtn: { display:'flex', flexDirection:'column', alignItems:'center', gap:'0.4rem', padding:'1rem 0.75rem', border:'1.5px solid #E8D5B0', borderRadius:10, background:'white', cursor:'pointer', fontFamily:'inherit', fontSize:'0.75rem', fontWeight:600, color:'#1A1612', transition:'all .2s' },
};

const ms = {
  overlay:   { position:'fixed', inset:0, background:'rgba(26,22,18,0.72)', backdropFilter:'blur(5px)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' },
  modal:     { background:'white', borderRadius:16, width:'100%', maxWidth:600, maxHeight:'92vh', overflowY:'auto', boxShadow:'0 24px 80px rgba(0,0,0,0.3)' },
  header:    { padding:'1.25rem 1.5rem 0.75rem', borderBottom:'1px solid #F0EAE0', display:'flex', alignItems:'center', justifyContent:'space-between' },
  title:     { fontFamily:'serif', fontSize:'1.15rem', color:'#1A1612' },
  close:     { background:'none', border:'none', cursor:'pointer', color:'#8A7968', display:'flex', alignItems:'center', justifyContent:'center', padding:'0.25rem' },
  body:      { padding:'1.25rem 1.5rem', display:'flex', flexDirection:'column', gap:'0.85rem' },
  row:       { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.85rem' },
  row3:      { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.85rem' },
  toggleRow: { display:'flex', gap:'0.65rem', flexWrap:'wrap' },
  input:     { border:'1.5px solid #E0D8CE', borderRadius:8, padding:'0.55rem 0.8rem', fontFamily:'sans-serif', fontSize:'0.88rem', color:'#1A1612', background:'#FAF7F2', outline:'none', width:'100%' },
  footer:    { padding:'0.75rem 1.5rem 1.25rem', display:'flex', gap:'0.75rem', justifyContent:'flex-end' },
  btnCancel: { background:'none', border:'1.5px solid #D0C8BE', color:'#8A7968', fontFamily:'sans-serif', fontSize:'0.85rem', fontWeight:500, padding:'0.5rem 1.2rem', borderRadius:8, cursor:'pointer' },
  btnSave:   { background:'#1A1612', color:'#C9A96E', border:'none', fontFamily:'sans-serif', fontSize:'0.85rem', fontWeight:700, padding:'0.5rem 1.4rem', borderRadius:8, cursor:'pointer' },
};
