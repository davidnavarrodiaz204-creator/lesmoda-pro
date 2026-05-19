import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { productService, configService, authService, orderService, systemService, bannerService, analyticsService } from '../services/api';
import ImportModal from '../components/ImportModal';
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
  const [unviewedCount, setUnviewedCount] = useState(0);

  useState(() => {
    configService.get().then(({ data }) => setConfig(c => ({ ...c, ...data.data }))).catch(() => {});
  });

  useEffect(() => {
    const fetchUnviewed = async () => {
      try {
        const { data } = await orderService.getStats();
        setUnviewedCount(data?.data?.unviewedCount ?? 0);
      } catch {}
    };
    fetchUnviewed();
    const interval = setInterval(fetchUnviewed, 30000);
    return () => clearInterval(interval);
  }, []);

  const prevUnviewed = useRef(unviewedCount);
  useEffect(() => {
    if (prevUnviewed.current > 0 && unviewedCount > prevUnviewed.current) {
      toast((t) => (
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
          <span style={{fontWeight:600}}>{unviewedCount - prevUnviewed.current} pedido(s) nuevo(s)</span>
          <button onClick={() => { toast.dismiss(t.id); setActiveSection('orders'); }}
            style={{background:'#C9A96E',color:'#1A1612',border:'none',borderRadius:6,padding:'0.3rem 0.8rem',fontWeight:600,cursor:'pointer',fontSize:'0.75rem',fontFamily:'inherit'}}>
            Ver pedido
          </button>
        </div>
      ));
    }
    prevUnviewed.current = unviewedCount;
  }, [unviewedCount]);

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
        <div style={{fontSize:'0.6rem',color:'#5A5045',letterSpacing:'0.05em',marginBottom:'1.5rem',marginTop:'-0.5rem'}}>v1.0 estable</div>
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
              {k === 'orders' && unviewedCount > 0 && (
                <span style={{marginLeft:'auto',background:'#C25E5E',color:'white',fontSize:'0.6rem',fontWeight:700,minWidth:18,height:18,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 4px',lineHeight:1}}>{unviewedCount}</span>
              )}
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
                {k === 'orders' && unviewedCount > 0 && (
                  <span style={{marginLeft:'auto',background:'#C25E5E',color:'white',fontSize:'0.6rem',fontWeight:700,minWidth:18,height:18,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 4px',lineHeight:1}}>{unviewedCount}</span>
                )}
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
        {activeSection === 'orders' && <OrdersSection waNumber={config.waNumber} unviewedCount={unviewedCount} onUnviewedChange={setUnviewedCount} />}
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
            <div style={{position:'relative'}}>
              <ActionIcon type={icon} size={18} />
              {k === 'orders' && unviewedCount > 0 && (
                <span style={{position:'absolute',top:-6,right:-8,background:'#C25E5E',color:'white',fontSize:'0.55rem',fontWeight:700,minWidth:16,height:16,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 3px',lineHeight:1}}>{unviewedCount}</span>
              )}
            </div>
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

// ── SYSTEM STATUS ──────────────────────────────────────────────────────────
function SystemStatusCard() {
  const [status, setStatus] = useState(null);
  const [telegramResult, setTelegramResult] = useState(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetch('/health').then(r => r.json()).then(setStatus).catch(() => setStatus({ status: 'error' }));
  }, []);

  const handleTestTelegram = async () => {
    setTesting(true);
    setTelegramResult(null);
    try {
      const { data } = await orderService.testTelegram();
      setTelegramResult(data.success ? 'ok' : 'error');
    } catch {
      setTelegramResult('error');
    } finally { setTesting(false); }
  };

  if (!status) return null;

  const rows = [
    { label: 'API', value: status.status === 'ok' ? 'Conectada' : 'Desconectada', ok: status.status === 'ok' },
    { label: 'Base de datos', value: status.mongodb === 'connected' ? 'Conectada' : 'Desconectada', ok: status.mongodb === 'connected' },
    { label: 'Cloudinary', value: status.cloudinary === 'configured' ? 'Configurado' : 'No configurado', ok: status.cloudinary === 'configured' },
    { label: 'Telegram', value: status.telegram === 'enabled' ? 'Activo' : 'Inactivo', ok: status.telegram === 'enabled' },
  ];

  return (
    <div style={s.configCard}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.75rem'}}>
        <h3 style={s.cardTitle}>Estado del sistema</h3>
        <span style={{fontSize:'0.7rem',color:'#8A7968'}}>v1.0 estable</span>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
        {rows.map((r, i) => (
          <div key={i} style={{display:'flex',alignItems:'center',gap:'0.5rem',fontSize:'0.85rem'}}>
            <span style={{
              width:8,height:8,borderRadius:'50%',flexShrink:0,
              background: r.ok ? '#2E7D52' : '#C25E5E',
            }}/>
            <span style={{color:'#1A1612',fontWeight:500,minWidth:100}}>{r.label}</span>
            <span style={{color:'#8A7968'}}>{r.value}</span>
          </div>
        ))}
      </div>
      <div style={{marginTop:'0.75rem',display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
        <button onClick={handleTestTelegram} disabled={testing}
          style={{...s.btnSave, fontSize:'0.75rem', padding:'0.4rem 0.9rem'}}>
          {testing ? 'Enviando...' : 'Probar Telegram'}
        </button>
        <button onClick={() => window.location.href = '/'}
          style={{...s.btnAdd, fontSize:'0.75rem', padding:'0.4rem 0.9rem'}}>
          Ver tienda
        </button>
      </div>
      {telegramResult && (
        <div style={{
          marginTop:'0.5rem', fontSize:'0.8rem', padding:'0.4rem 0.75rem', borderRadius:6,
          background: telegramResult === 'ok' ? '#E0F5EC' : '#FFF5F5',
          color: telegramResult === 'ok' ? '#2E7D52' : '#C25E5E',
        }}>
          {telegramResult === 'ok' ? 'Mensaje de prueba enviado a Telegram correctamente' : 'Error al enviar mensaje de prueba a Telegram'}
        </div>
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
      if (oRes.status === 'fulfilled') {
        const d = oRes.value.data?.data || null;
        setOrderStats(d);
      }
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchStats(); }, []);

  useEffect(() => {
    fetch('/health', { signal: AbortSignal.timeout(5000) })
      .then(r => setApiConnected(r.ok))
      .catch(() => setApiConnected(false));
  }, []);

  if (loading) return <div style={{padding:'2rem',color:'#8A7968'}}>Cargando dashboard…</div>;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 86400000);
  const weekStart = new Date(todayStart.getTime() - todayStart.getDay() * 86400000);
  const orders = orderStats?.recentOrders || [];
  const todayCount = orderStats?.todayOrders ?? orders.filter(o => new Date(o.createdAt) >= todayStart).length;
  const yesterdayCount = orders.filter(o => {
    const d = new Date(o.createdAt);
    return d >= yesterdayStart && d < todayStart;
  }).length;
  const weekCount = orders.filter(o => new Date(o.createdAt) >= weekStart).length;
  const barData = [
    { label: 'Hoy', value: todayCount },
    { label: 'Ayer', value: yesterdayCount },
    { label: 'Semana', value: weekCount },
  ];
  const maxBar = Math.max(...barData.map(d => d.value), 1);
  const barH = 180;
  const barW = 240;

  const metricCards = [
    { label: 'Total productos', value: stats?.totalProducts ?? '—', color: '#1A1612' },
    { label: 'Activos', value: stats?.activeProducts ?? '—', color: '#2E7D52' },
    { label: 'Pedidos hoy', value: orderStats?.todayOrders ?? '—', color: '#C9A96E' },
    { label: 'Pendientes', value: orderStats?.pendingOrders ?? '—', color: '#C25E5E' },
    { label: 'Ventas potenciales', value: orderStats?.potentialRevenue != null ? `S/ ${orderStats.potentialRevenue.toFixed(0)}` : '—', color: '#25D366' },
    { label: 'Clicks WhatsApp', value: stats?.totalWhatsappClicks ?? '—', color: '#1A1612' },
    { label: 'Pedidos semana', value: orderStats?.weekOrders ?? '---', color: '#C9A96E' },
    { label: 'Total potencial semana', value: orderStats?.weekRevenue != null ? `S/ ${orderStats.weekRevenue.toFixed(0)}` : '---', color: '#25D366' },
    ...(stats?.totalWhatsappClicks > 0 ? [{ label: 'Tasa conversion', value: ((orderStats?.todayOrders ?? 0) / stats.totalWhatsappClicks * 100).toFixed(1) + '%', color: '#1A73E8' }] : [{ label: 'Tasa conversion', value: '---', color: '#1A73E8' }]),
  ];

  const topProducts = stats?.topProducts || [];
  const maxClicks = Math.max(...topProducts.map(p => p.whatsappClicks || 0), 1);

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'2rem'}}>
      <h2 style={{fontFamily:'serif',fontSize:'1.3rem',color:'#1A1612'}}>Dashboard</h2>

      {/* Metric Cards */}
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
      <div>
        <h3 style={{fontFamily:'serif',fontSize:'1rem',color:'#1A1612',marginBottom:'0.75rem'}}>Acciones rapidas</h3>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))',gap:'0.75rem'}}>
          {[
            { label: 'Agregar producto', icon: 'plus', section: 'products' },
            { label: 'Ver pedidos', icon: 'clipboard', section: 'orders' },
            { label: 'Configurar tienda', icon: 'gear', section: 'config' },
            { label: 'Ver tienda', icon: 'store', section: null, href: '/' },
          ].map((item, i) => (
            <button key={i} style={{
              display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem',
              padding:'1.25rem 1rem',
              border:'1.5px solid #E8D5B0', borderRadius:12,
              background:'white', cursor:'pointer', fontFamily:'inherit',
              fontSize:'0.78rem', fontWeight:600, color:'#1A1612',
              transition:'all .2s', boxShadow:'0 2px 8px rgba(0,0,0,0.04)',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A96E'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(201,169,110,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8D5B0'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'none'; }}
              onClick={() => {
                if (item.href) window.location.href = item.href;
                else onNavigate?.(item.section);
              }}>
              <ActionIcon type={item.icon} size={24} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>
        {/* Orders bar chart */}
        <div style={{background:'white',borderRadius:12,padding:'1.25rem 1.5rem',boxShadow:'0 2px 16px rgba(0,0,0,0.06)'}}>
          <h3 style={{fontFamily:'serif',fontSize:'0.95rem',color:'#1A1612',marginBottom:'1rem'}}>Pedidos recibidos</h3>
          <svg width="100%" height={barH} viewBox={`0 0 ${barW} ${barH}`} style={{display:'block'}}>
            {barData.map((d, i) => {
              const colW = 60;
              const x = 15 + i * 75;
              const h = (d.value / maxBar) * (barH - 40);
              const y = barH - 20 - h;
              return (
                <g key={i}>
                  <rect x={x} y={y} width={30} height={Math.max(h, 0)} rx={4} fill={i === 0 ? '#C9A96E' : i === 1 ? '#B0A899' : '#8A7968'} />
                  <text x={x + 15} y={barH - 4} textAnchor="middle" fontSize="11" fill="#8A7968" fontWeight="600">{d.label}</text>
                  <text x={x + 15} y={y - 6} textAnchor="middle" fontSize="13" fill="#1A1612" fontWeight="700">{d.value}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Top products horizontal bar */}
        <div style={{background:'white',borderRadius:12,padding:'1.25rem 1.5rem',boxShadow:'0 2px 16px rgba(0,0,0,0.06)'}}>
          <h3 style={{fontFamily:'serif',fontSize:'0.95rem',color:'#1A1612',marginBottom:'1rem'}}>Top {topProducts.length} mas consultados</h3>
          {topProducts.length === 0 ? (
            <p style={{fontSize:'0.82rem',color:'#8A7968'}}>Sin datos aun</p>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'0.6rem'}}>
              {topProducts.map((p, i) => {
                const pct = ((p.whatsappClicks || 0) / maxClicks) * 100;
                return (
                  <div key={p._id} style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                    <span style={{fontSize:'0.72rem',fontWeight:700,color:'#C9A96E',minWidth:18}}>#{i+1}</span>
                    <span style={{flex:1,fontSize:'0.75rem',color:'#1A1612',fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</span>
                    <div style={{flex:'0 0 100px',height:12,background:'#F0EBE3',borderRadius:6,overflow:'hidden'}}>
                      <div style={{width:`${pct}%`,height:'100%',background:'#25D366',borderRadius:6,transition:'width .4s'}} />
                    </div>
                    <span style={{fontSize:'0.7rem',color:'#25D366',fontWeight:600,minWidth:30,textAlign:'right'}}>{p.whatsappClicks ?? 0}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Most Ordered Products */}
      {orderStats?.mostOrderedProducts?.length > 0 && (
        <div style={{background:'white',borderRadius:12,padding:'1.25rem 1.5rem',boxShadow:'0 2px 16px rgba(0,0,0,0.06)'}}>
          <h3 style={{fontFamily:'serif',fontSize:'0.95rem',color:'#1A1612',marginBottom:'1rem'}}>Productos mas pedidos</h3>
          <div style={{display:'flex',flexDirection:'column',gap:'0.6rem'}}>
            {orderStats.mostOrderedProducts.map((p, i) => {
              const maxQty = Math.max(...orderStats.mostOrderedProducts.map(x => x.count), 1);
              const pct = (p.count / maxQty) * 100;
              return (
                <div key={p._id || i} style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                  <span style={{fontSize:'0.72rem',fontWeight:700,color:'#C9A96E',minWidth:18}}>#{i+1}</span>
                  <span style={{flex:1,fontSize:'0.75rem',color:'#1A1612',fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</span>
                  <div style={{flex:'0 0 100px',height:12,background:'#F0EBE3',borderRadius:6,overflow:'hidden'}}>
                    <div style={{width:`${pct}%`,height:'100%',background:'#C9A96E',borderRadius:6,transition:'width .4s'}} />
                  </div>
                  <span style={{fontSize:'0.7rem',color:'#C9A96E',fontWeight:600,minWidth:30,textAlign:'right'}}>{p.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* API Status */}
      <div style={{background:'white',borderRadius:12,padding:'1rem 1.5rem',boxShadow:'0 2px 16px rgba(0,0,0,0.06)',display:'flex',alignItems:'center',gap:'0.75rem'}}>
        <div style={{
          width:36,height:36,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
          background: apiConnected ? '#E0F5EC' : '#FDE8E8',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={apiConnected ? '#2E7D52' : '#C25E5E'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {apiConnected ? (
              <><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></>
            ) : (
              <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>
            )}
          </svg>
        </div>
        <div>
          <div style={{fontSize:'0.85rem',fontWeight:600,color:'#1A1612'}}>
            {apiConnected ? 'Backend conectado' : 'Backend no disponible'}
          </div>
          <div style={{fontSize:'0.72rem',color:'#8A7968',marginTop:'0.1rem'}}>
            {apiConnected ? 'API operativa' : 'Verifica que el servidor este corriendo'}
          </div>
        </div>
        <span style={{
          marginLeft:'auto',width:10,height:10,borderRadius:'50%',flexShrink:0,
          background: apiConnected ? '#2E7D52' : '#C25E5E',
        }}/>
      </div>

      {/* Recent Orders */}
      {orderStats?.recentOrders?.length > 0 && (
        <div style={s.card}>
          <div style={s.cardHeader}><h3 style={s.cardTitle}>Ultimos pedidos</h3></div>
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

      {/* Low Stock */}
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

      <SystemStatusCard />
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
  const [showImport, setShowImport] = useState(false);

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

  const handleDuplicate = async (id) => {
    try {
      await productService.duplicate(id);
      toast.success('Producto duplicado como inactivo');
      fetchProducts();
    } catch {
      toast.error('Error al duplicar producto');
    }
  };

  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <h3 style={s.cardTitle}>Productos ({products.length})</h3>
        <div style={{display:'flex',gap:'0.5rem'}}>
          <button style={s.btnAdd} onClick={onAdd}>+ Agregar</button>
          <button style={{...s.btnSave}} onClick={() => setShowImport(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'0.3rem',verticalAlign:'middle'}}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Importar
          </button>
        </div>
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
                  <button style={s.btnEdit} onClick={() => handleDuplicate(p._id)} title="Duplicar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button>
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
              <button style={{...s.btnEdit, flex:1, textAlign:'center'}} onClick={() => handleDuplicate(p._id)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Duplicar</button>
              <button style={{...s.btnDel, flex:1, textAlign:'center'}} onClick={() => handleDelete(p._id)}><TrashIcon size={14} /> Borrar</button>
            </div>
          </div>
        ))}
      </div>
      {showImport && <ImportModal onClose={() => { setShowImport(false); fetchProducts(); }} />}
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

function OrdersSection({ waNumber, unviewedCount, onUnviewedChange }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState(null);
  const [quickFilter, setQuickFilter] = useState('');
  const num = waNumber?.replace(/\D/g, '');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      if (quickFilter === 'unviewed') params.isViewed = 'false';
      if (quickFilter === 'today') {
        const today = new Date();
        params.startDate = today.toISOString().split('T')[0];
      }
      const { data } = await orderService.getAll(params);
      setOrders(data?.data || []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [statusFilter, search, quickFilter]);

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
        <input placeholder="Buscar por nombre, celular o producto…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{...s.input,minWidth:180,flex:1}} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{...s.input,minWidth:120,flex:'0 0 auto'}}>
          {STATUS_OPTIONS.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
      <div style={{
        display:'flex',flexWrap:'wrap',gap:'0.4rem',alignItems:'center',
        padding:'0 1.5rem 0.75rem',borderBottom:'1px solid #F0EAE0',background:'#FAF7F2',
      }}>
        {[
          ['', 'Pendientes', 'pending'],
          ['unviewed', 'No vistos', 'unviewed'],
          ['today', 'Hoy', 'today'],
        ].map(([val, lab]) => (
          <button key={val} onClick={() => setQuickFilter(prev => prev === val ? '' : val)}
            style={{
              padding:'0.3rem 0.75rem',borderRadius:999,fontSize:'0.7rem',fontWeight:600,
              border: quickFilter === val ? '1.5px solid #C9A96E' : '1.5px solid #E0D8CE',
              background: quickFilter === val ? '#C9A96E' : 'transparent',
              color: quickFilter === val ? '#1A1612' : '#8A7968',
              cursor:'pointer',fontFamily:'inherit',transition:'all .15s',
            }}>{lab}</button>
        ))}
        {['contacted','confirmed','delivered','cancelled'].map(st => (
          <button key={st} onClick={() => setStatusFilter(prev => prev === st ? '' : st)}
            style={{
              padding:'0.3rem 0.75rem',borderRadius:999,fontSize:'0.7rem',fontWeight:600,
              border: statusFilter === st ? '1.5px solid #C9A96E' : '1.5px solid #E0D8CE',
              background: statusFilter === st ? '#C9A96E' : 'transparent',
              color: statusFilter === st ? '#1A1612' : '#8A7968',
              cursor:'pointer',fontFamily:'inherit',transition:'all .15s',
            }}>{STATUS_OPTIONS.find(([v])=>v===st)?.[1] || st}</button>
        ))}
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
              {detail.isViewed === false && (
                <button onClick={async () => {
                  await orderService.markViewed(detail._id);
                  setDetail(prev => prev ? {...prev, isViewed: true} : prev);
                  setOrders(prev => prev.map(o => o._id === detail._id ? {...o, isViewed: true} : o));
                  if (onUnviewedChange && unviewedCount > 0) onUnviewedChange(unviewedCount - 1);
                }}
                  style={{marginLeft:'0.75rem',padding:'0.3rem 0.7rem',borderRadius:6,border:'1.5px solid #C9A96E',background:'#C9A96E',color:'#1A1612',fontSize:'0.75rem',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
                  Marcar como visto
                </button>
              )}
            </div>
            <div style={{gridColumn:'1/-1',display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
              {[['contacted','Contactado'],['confirmed','Confirmado'],['delivered','Entregado']].map(([st,lab]) => (
                <button key={st} onClick={() => handleStatusChange(detail._id, st)}
                  style={{
                    padding:'0.3rem 0.7rem',borderRadius:6,border:'1.5px solid #E0D8CE',
                    background: detail.status === st ? '#1A1612' : 'transparent',
                    color: detail.status === st ? '#C9A96E' : '#8A7968',
                    fontSize:'0.75rem',fontWeight:600,cursor:'pointer',fontFamily:'inherit',
                  }}>{lab}</button>
              ))}
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
                    <td style={{...s.td,fontWeight:500}}>
                      {o.isViewed === false && <NewBadgeIcon size={12} style={{marginRight:'0.3rem',verticalAlign:'middle',color:'#C25E5E'}} />}
                      {o.customerName}
                    </td>
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
                    <div style={{fontWeight:600,fontSize:'0.92rem',color:'#1A1612'}}>
                      {o.isViewed === false && <NewBadgeIcon size={12} style={{marginRight:'0.3rem',verticalAlign:'middle',color:'#C25E5E'}} />}
                      {o.customerName}
                    </div>
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

// ── BANNERS MANAGER ───────────────────────────────────────────────────────
function BannersManager() {
  const [banners, setBanners] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    bannerService.getAllAdmin()
      .then(({ data }) => setBanners(data?.data || []))
      .catch(() => {});
  };

  useEffect(() => { fetch(); }, []);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const { data } = await bannerService.create({ text: 'Nuevo banner', subtitle: '', isActive: true });
      setEditing(data?.data || { text: 'Nuevo banner', subtitle: '', isActive: true });
      fetch();
      toast.success('Banner creado — editalo');
    } catch { toast.error('Error al crear banner'); }
    setSaving(false);
  };

  const handleUpdate = async (id, data) => {
    setSaving(true);
    try {
      await bannerService.update(id, data);
      fetch();
      setEditing(null);
      toast.success('Banner actualizado');
    } catch { toast.error('Error al actualizar banner'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Eliminar este banner?')) return;
    setSaving(true);
    try {
      await bannerService.remove(id);
      fetch();
      toast.success('Banner eliminado');
    } catch { toast.error('Error al eliminar banner'); }
    setSaving(false);
  };

  const handleToggleActive = async (b) => {
    setSaving(true);
    try {
      await bannerService.update(b._id, { isActive: !b.isActive });
      fetch();
      toast.success(b.isActive ? 'Banner desactivado' : 'Banner activado');
    } catch { toast.error('Error al cambiar estado'); }
    setSaving(false);
  };

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h3 style={{fontFamily:'serif',fontSize:'1rem',color:'#1A1612'}}>Banners promocionales</h3>
        <button onClick={handleCreate} disabled={saving} style={{...s.btnAdd, padding:'0.45rem 0.9rem', fontSize:'0.78rem'}}>
          <PlusCircleIcon size={12} /> Agregar banner
        </button>
      </div>
      {banners.length === 0 && <p style={{fontSize:'0.85rem',color:'#8A7968'}}>No hay banners aun. Crea uno para mostrar promociones.</p>}
      {banners.map(b => {
        const isEditing = editing?._id === b._id;
        return (
        <div key={b._id} style={{
          background:'#FAF7F2', borderRadius:10, padding:'0.75rem 1rem',
          border: `1.5px solid ${isEditing ? '#C9A96E' : '#E8D5B0'}`,
          display:'flex', flexDirection:'column', gap:'0.5rem',
          opacity: b.isActive ? 1 : 0.6,
        }}>
          {isEditing ? (
            <>
              <input style={s.input} value={editing.text} onChange={e => setEditing({...editing, text: e.target.value})} placeholder="Texto del banner" />
              <input style={s.input} value={editing.subtitle || ''} onChange={e => setEditing({...editing, subtitle: e.target.value})} placeholder="Subtitulo (opcional)" />
              <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
                <input style={{...s.input, flex:1, minWidth:100}} value={editing.cta || ''} onChange={e => setEditing({...editing, cta: e.target.value})} placeholder="Texto del boton" />
                <input style={{...s.input, flex:1, minWidth:100}} value={editing.link || ''} onChange={e => setEditing({...editing, link: e.target.value})} placeholder="URL del boton" />
              </div>
              <div style={{display:'flex',gap:'0.5rem',alignItems:'center',flexWrap:'wrap'}}>
                <label style={{fontSize:'0.78rem',color:'#1A1612',display:'flex',alignItems:'center',gap:'0.3rem'}}>
                  Color: <input type="color" value={editing.color || '#C9A96E'} onChange={e => setEditing({...editing, color: e.target.value})} style={{width:32,height:28,border:'1px solid #E0D8CE',borderRadius:4,cursor:'pointer',padding:0}} />
                </label>
                <label style={{fontSize:'0.78rem',color:'#1A1612',display:'flex',alignItems:'center',gap:'0.3rem'}}>
                  <input type="checkbox" checked={editing.isActive} onChange={e => setEditing({...editing, isActive: e.target.checked})} />
                  Activo
                </label>
              </div>
              <div style={{
                padding:'0.5rem 1rem', borderRadius:6, textAlign:'center', fontSize:'0.82rem',
                background: editing.color || '#C9A96E', color:'white', fontWeight:500,
              }}>
                {editing.text} {editing.cta && <span style={{textDecoration:'underline',marginLeft:'0.5rem'}}>{editing.cta}</span>}
              </div>
              <div style={{display:'flex',gap:'0.5rem'}}>
                <button onClick={() => handleUpdate(b._id, editing)} disabled={saving} style={{...s.btnSave, fontSize:'0.78rem', padding:'0.4rem 0.9rem'}}>
                  {saving ? 'Guardando...' : <><SaveIcon size={12} /> Guardar</>}
                </button>
                <button onClick={() => setEditing(null)} style={{fontSize:'0.78rem',padding:'0.4rem 0.9rem',background:'transparent',border:'1.5px solid #D0C8BE',borderRadius:6,color:'#8A7968',cursor:'pointer',fontFamily:'inherit'}}>Cancelar</button>
              </div>
            </>
          ) : (
            <>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                  <span style={{width:10,height:10,borderRadius:'50%',background:b.isActive?'#2E7D52':'#E0D8CE'}} />
                  <strong style={{fontSize:'0.88rem',color:'#1A1612'}}>{b.text || '(sin texto)'}</strong>
                </div>
                <div style={{display:'flex',gap:'0.3rem'}}>
                  <button onClick={() => handleToggleActive(b)} disabled={saving} style={{background:'none',border:'none',color:'#8A7968',cursor:'pointer',padding:'0.2rem'}} title={b.isActive ? 'Desactivar' : 'Activar'}>
                    {b.isActive ? <EyeIcon size={14} /> : <EyeOffIcon size={14} />}
                  </button>
                  <button onClick={() => setEditing({...b})} disabled={saving} style={{background:'none',border:'none',color:'#8A7968',cursor:'pointer',padding:'0.2rem'}} title="Editar"><PencilIcon size={14} /></button>
                  <button onClick={() => handleDelete(b._id)} disabled={saving} style={{background:'none',border:'none',color:'#C25E5E',cursor:'pointer',padding:'0.2rem'}} title="Eliminar"><TrashIcon size={14} /></button>
                </div>
              </div>
              {b.subtitle && <div style={{fontSize:'0.78rem',color:'#8A7968'}}>{b.subtitle}</div>}
              {b.cta && <div style={{fontSize:'0.72rem',color:'#C9A96E',fontWeight:600}}>CTA: {b.cta}{b.link ? ' → '+b.link : ''}</div>}
              <div style={{
                padding:'0.5rem 1rem', borderRadius:6, textAlign:'center', fontSize:'0.82rem',
                background: b.color || '#C9A96E', color:'white', fontWeight:500,
              }}>
                {b.text} {b.cta && <span style={{textDecoration:'underline',marginLeft:'0.5rem'}}>{b.cta}</span>}
              </div>
            </>
          )}
        </div>
        );
      })}
    </div>
  );
}

// ── ANALYTICS DASHBOARD ──────────────────────────────────────────────────
function AnalyticsDashboard() {
  const [localData, setLocalData] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('lesmoda_analytics');
      if (raw) setLocalData(JSON.parse(raw));
    } catch {}
  }, []);

  const counts = localData ? {
    views: localData.views?.length || 0,
    shares: localData.shares?.length || 0,
    favorites: localData.favorites?.length || 0,
    waClicks: localData.waClicks?.length || 0,
  } : { views: 0, shares: 0, favorites: 0, waClicks: 0 };

  const todayCount = localData ? {
    views: localData.views?.filter(v => Date.now() - v.timestamp < 86400000).length || 0,
  } : { views: 0 };

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
      <h3 style={{fontFamily:'serif',fontSize:'1rem',color:'#1A1612',marginBottom:'0.5rem'}}>Analytics comerciales (local)</h3>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:'0.75rem'}}>
        {[
          { label: 'Productos vistos', value: counts.views, color: '#1A1612' },
          { label: 'Vistos hoy', value: todayCount.views, color: '#C9A96E' },
          { label: 'Clicks WhatsApp', value: counts.waClicks, color: '#25D366' },
          { label: 'Favoritos', value: localData?.favorites?.length ? [...new Set(localData.favorites.map(f => f.productId))].length : 0, color: '#C25E5E' },
          { label: 'Veces compartido', value: counts.shares, color: '#1A73E8' },
        ].map((m, i) => (
          <div key={i} style={{
            background:'white', borderRadius:10, padding:'1rem', textAlign:'center',
            boxShadow:'0 2px 8px rgba(0,0,0,0.04)', border:'1.5px solid #F0EAE0',
          }}>
            <div style={{fontSize:'1.4rem',fontWeight:700,color:m.color}}>{m.value}</div>
            <div style={{fontSize:'0.68rem',color:'#8A7968',fontWeight:500,letterSpacing:'0.05em',marginTop:'0.25rem'}}>{m.label}</div>
          </div>
        ))}
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
    newOrderSound: true, pollInterval: '30', showOutOfStock: true,
    relatedProductsEnabled: true, shareProductEnabled: true, ctaText: '', trustText: '',
    siteTitle: '', siteDescription: '', keywords: '', ogImage: '', favicon: '', indexable: true,
  });
  const [saving, setSaving] = useState(false);
  const [waError, setWaError] = useState('');
  const [activeTab, setActiveTab] = useState('general');
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
        if (v === undefined || v === null) return;
        if (k === 'waNumber') fd.append(k, normalizeWaNumber(v));
        else if (v instanceof File) fd.append(k, v);
        else if (typeof v === 'boolean') fd.append(k, v ? 'true' : 'false');
        else fd.append(k, v);
      });
      await api.put('/config', fd);
      toast.success('Configuracion guardada correctamente');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error al guardar configuracion');
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

  const handleExportProducts = async () => {
    try {
      const { data } = await productService.exportCSV();
      const url = URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'productos_export.csv';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Productos exportados');
    } catch { toast.error('Error al exportar productos'); }
  };

  const handleExportOrders = async () => {
    try {
      const { data } = await orderService.exportCSV();
      const url = URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pedidos_export.csv';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Pedidos exportados');
    } catch { toast.error('Error al exportar pedidos'); }
  };

  const handleDownloadBackup = async () => {
    try {
      const { data } = await systemService.backup();
      if (data.success) {
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_lesmoda_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Backup descargado');
      }
    } catch { toast.error('Error al generar backup'); }
  };

  const [restoreOpen, setRestoreOpen] = useState(false);
  const [restoreResult, setRestoreResult] = useState(null);
  const [restoreMerge, setRestoreMerge] = useState(false);

  const handleRestore = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const backup = JSON.parse(text);
        if (!backup.products || !backup.orders) {
          toast.error('El archivo no es un backup valido');
          return;
        }
        setRestoreResult({ backup, file });
      } catch {
        toast.error('Error al leer el archivo JSON');
      }
    };
    input.click();
  };

  const handleConfirmRestore = async () => {
    if (!restoreResult) return;
    try {
      const { data } = await systemService.restore(restoreResult.backup, restoreMerge);
      if (data.success) {
        toast.success(`Restauracion completada: ${data.data.imported.products} productos, ${data.data.imported.orders} pedidos`);
        setRestoreResult(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al restaurar');
    }
  };

  const tabs = [
    { key: 'general', label: 'General' },
    { key: 'branding', label: 'Branding' },
    { key: 'social', label: 'Social/Contacto' },
    { key: 'whatsapp', label: 'WhatsApp' },
    { key: 'marketing', label: 'Marketing' },
    { key: 'commercial', label: 'Comercial' },
    { key: 'seo', label: 'SEO' },
    { key: 'banners', label: 'Banners' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'backups', label: 'Backups' },
    { key: 'appearance', label: 'Apariencia' },
    { key: 'advanced', label: 'Avanzado' },
  ];

  const tabStyle = (isActive) => ({
    padding:'0.5rem 1rem', borderRadius:8, fontSize:'0.78rem', fontWeight:600,
    border:'none', cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit',
    background: isActive ? '#1A1612' : 'transparent',
    color: isActive ? '#C9A96E' : '#8A7968',
    transition:'all .2s',
  });

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
      {/* Tab buttons */}
      <div style={{
        display:'flex', gap:'0.25rem', flexWrap:'wrap',
        background:'white', borderRadius:12, padding:'0.5rem',
        boxShadow:'0 2px 16px rgba(0,0,0,0.06)',
      }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={tabStyle(activeTab === t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{background:'white',borderRadius:12,padding:'1.5rem',boxShadow:'0 2px 16px rgba(0,0,0,0.06)'}}>
        {activeTab === 'general' && (
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <h3 style={{fontFamily:'serif',fontSize:'1rem',color:'#1A1612',marginBottom:'0.5rem'}}>Informacion general</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              <Field label="Nombre de la tienda">
                <input style={s.input} value={form.storeName || ''} onChange={e => set('storeName', e.target.value)} />
              </Field>
              <Field label="Eslogan">
                <input style={s.input} value={form.storeSlogan || ''} onChange={e => set('storeSlogan', e.target.value)} />
              </Field>
            </div>
            <Field label="Descripcion">
              <textarea style={{...s.input, minHeight:70, resize:'vertical'}} value={form.storeDescription || ''} onChange={e => set('storeDescription', e.target.value)} />
            </Field>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              <Field label="Direccion">
                <input style={s.input} placeholder="Direccion de la tienda" value={form.address || ''} onChange={e => set('address', e.target.value)} />
              </Field>
              <Field label="Horario">
                <input style={s.input} placeholder="Ej: Lunes a Sabado 9:00 am - 7:00 pm" value={form.hours || ''} onChange={e => set('hours', e.target.value)} />
              </Field>
            </div>
          </div>
        )}

        {activeTab === 'branding' && (
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <h3 style={{fontFamily:'serif',fontSize:'1rem',color:'#1A1612',marginBottom:'0.5rem'}}>Marca</h3>
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
          </div>
        )}

        {activeTab === 'social' && (
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <h3 style={{fontFamily:'serif',fontSize:'1rem',color:'#1A1612',marginBottom:'0.5rem'}}>Redes sociales y contacto</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              <Field label="Facebook">
                <input style={s.input} placeholder="URL de Facebook" value={form.facebook || ''} onChange={e => set('facebook', e.target.value)} />
              </Field>
              <Field label="Instagram">
                <input style={s.input} placeholder="URL de Instagram" value={form.instagram || ''} onChange={e => set('instagram', e.target.value)} />
              </Field>
              <Field label="TikTok">
                <input style={s.input} placeholder="URL de TikTok" value={form.tiktok || ''} onChange={e => set('tiktok', e.target.value)} />
              </Field>
            </div>
          </div>
        )}

        {activeTab === 'whatsapp' && (
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <h3 style={{fontFamily:'serif',fontSize:'1rem',color:'#1A1612',marginBottom:'0.5rem'}}>WhatsApp</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              <Field label="WhatsApp (9 digitos)">
                <input style={{...s.input, borderColor: waError ? '#C25E5E' : undefined}} placeholder="987654321" maxLength={9}
                  value={(form.waNumber || '').replace(/\D/g, '')}
                  onChange={e => { set('waNumber', e.target.value.replace(/\D/g, '').slice(0,9)); setWaError(''); }} />
                {waError && <span style={{fontSize:'0.72rem',color:'#C25E5E',marginTop:'0.2rem'}}>{waError}</span>}
              </Field>
            </div>
            <Field label="Mensaje WhatsApp">
              <textarea style={{...s.input, minHeight:80, resize:'vertical'}} placeholder="Mensaje automatico para WhatsApp" value={form.waMessage || ''} onChange={e => set('waMessage', e.target.value)} />
            </Field>
          </div>
        )}

        {activeTab === 'marketing' && (
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <h3 style={{fontFamily:'serif',fontSize:'1rem',color:'#1A1612',marginBottom:'0.5rem'}}>Marketing</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              <Field label="Texto envio gratis">
                <input style={s.input} value={form.freeShippingText || ''} onChange={e => set('freeShippingText', e.target.value)} />
              </Field>
              <Field label="Monto minimo envio gratis">
                <input style={s.input} type="number" value={form.freeShippingMin || ''} onChange={e => set('freeShippingMin', e.target.value)} />
              </Field>
            </div>
            <div style={{display:'flex', gap:'0.65rem', flexWrap:'wrap', marginTop:'0.5rem'}}>
              <Toggle label="Banner promocional" checked={form.promoBannerEnabled} onChange={v => set('promoBannerEnabled', v)} />
              <Toggle label="Productos destacados" checked={form.featuredProductsEnabled} onChange={v => set('featuredProductsEnabled', v)} />
              <Toggle label="Stock visible" checked={form.stockVisible} onChange={v => set('stockVisible', v)} />
            </div>
          </div>
        )}

        {activeTab === 'commercial' && (
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <h3 style={{fontFamily:'serif',fontSize:'1rem',color:'#1A1612',marginBottom:'0.5rem'}}>Configuracion comercial</h3>
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.65rem'}}>
              <Toggle label="Productos relacionados" checked={form.relatedProductsEnabled} onChange={v => set('relatedProductsEnabled', v)} />
              <Toggle label="Compartir producto" checked={form.shareProductEnabled} onChange={v => set('shareProductEnabled', v)} />
              <Toggle label="Mostrar sin stock" checked={form.showOutOfStock} onChange={v => set('showOutOfStock', v)} />
            </div>
            <Field label="Texto CTA principal">
              <input style={s.input} value={form.ctaText || ''} onChange={e => set('ctaText', e.target.value)} placeholder="Ej: Compra ahora por WhatsApp" />
            </Field>
            <Field label="Texto de confianza bajo carrito">
              <textarea style={{...s.input, minHeight:60, resize:'vertical'}} value={form.trustText || ''} onChange={e => set('trustText', e.target.value)} placeholder="Ej: Compra 100% segura, paga contra entrega" />
            </Field>
          </div>
        )}

        {activeTab === 'backups' && (
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <h3 style={{fontFamily:'serif',fontSize:'1rem',color:'#1A1612',marginBottom:'0.5rem'}}>Exportacion y respaldos</h3>

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'0.75rem'}}>
              <button onClick={handleExportProducts} style={{
                display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem',
                padding:'1.25rem 1rem', borderRadius:10, border:'1.5px solid #E8D5B0',
                background:'white', cursor:'pointer', fontFamily:'inherit', fontSize:'0.82rem',
                fontWeight:600, color:'#1A1612', transition:'all .2s',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Exportar productos CSV
              </button>

              <button onClick={handleExportOrders} style={{
                display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem',
                padding:'1.25rem 1rem', borderRadius:10, border:'1.5px solid #E8D5B0',
                background:'white', cursor:'pointer', fontFamily:'inherit', fontSize:'0.82rem',
                fontWeight:600, color:'#1A1612', transition:'all .2s',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Exportar pedidos CSV
              </button>

              <button onClick={handleDownloadBackup} style={{
                display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem',
                padding:'1.25rem 1rem', borderRadius:10, border:'1.5px solid #E8D5B0',
                background:'white', cursor:'pointer', fontFamily:'inherit', fontSize:'0.82rem',
                fontWeight:600, color:'#1A1612', transition:'all .2s',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Descargar backup completo
              </button>

              <button onClick={handleRestore} style={{
                display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem',
                padding:'1.25rem 1rem', borderRadius:10, border:'1.5px solid #F5C0C0',
                background:'white', cursor:'pointer', fontFamily:'inherit', fontSize:'0.82rem',
                fontWeight:600, color:'#C25E5E', transition:'all .2s',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
                </svg>
                Restaurar backup
              </button>
            </div>

            {restoreResult && (
              <div style={{
                background:'#FFF5F5', border:'1.5px solid #F5C0C0', borderRadius:12,
                padding:'1.25rem', display:'flex', flexDirection:'column', gap:'0.75rem',
              }}>
                <div style={{fontSize:'0.9rem',fontWeight:600,color:'#C25E5E'}}>Restaurar backup</div>
                <div style={{fontSize:'0.82rem',color:'#8A7968',lineHeight:1.6}}>
                  Se encontraron {restoreResult.backup.products?.length || 0} productos y {restoreResult.backup.orders?.length || 0} pedidos en el archivo.
                  Los productos con nombre existente se saltaran.
                </div>
                <label style={{display:'flex',alignItems:'center',gap:'0.5rem',fontSize:'0.82rem',color:'#1A1612',cursor:'pointer'}}>
                  <input type="checkbox" checked={restoreMerge} onChange={e => setRestoreMerge(e.target.checked)} />
                  Actualizar productos existentes (merge)
                </label>
                <div style={{display:'flex',gap:'0.5rem'}}>
                  <button onClick={handleConfirmRestore} style={{
                    padding:'0.55rem 1.25rem', borderRadius:6, border:'none',
                    background:'#C25E5E', color:'white', fontWeight:600, fontSize:'0.85rem',
                    cursor:'pointer', fontFamily:'inherit',
                  }}>Confirmar restauracion</button>
                  <button onClick={() => setRestoreResult(null)} style={{
                    padding:'0.55rem 1.25rem', borderRadius:6, border:'1.5px solid #D0C8BE',
                    background:'transparent', color:'#8A7968', fontWeight:500, fontSize:'0.85rem',
                    cursor:'pointer', fontFamily:'inherit',
                  }}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'seo' && (
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <h3 style={{fontFamily:'serif',fontSize:'1rem',color:'#1A1612',marginBottom:'0.5rem'}}>SEO y posicionamiento</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              <Field label="Site Title (para buscadores)">
                <input style={s.input} value={form.siteTitle || ''} onChange={e => set('siteTitle', e.target.value)} placeholder="LeisModa — Moda que te define" />
              </Field>
              <Field label="Site Description">
                <input style={s.input} value={form.siteDescription || ''} onChange={e => set('siteDescription', e.target.value)} placeholder="Tienda de ropa online en Paita..." />
              </Field>
            </div>
            <Field label="Keywords (separadas por coma)">
              <input style={s.input} value={form.keywords || ''} onChange={e => set('keywords', e.target.value)} placeholder="ropa, moda, Paita, vestidos, mujer, hombre, accesorios" />
            </Field>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              <Field label="OG Image URL">
                <input style={s.input} value={form.ogImage || ''} onChange={e => set('ogImage', e.target.value)} placeholder="https://..." />
              </Field>
              <Field label="Favicon URL">
                <input style={s.input} value={form.favicon || ''} onChange={e => set('favicon', e.target.value)} placeholder="/icons/icon.svg" />
              </Field>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.65rem'}}>
              <Toggle label="Indexable (permitir a Google indexar)" checked={form.indexable !== false} onChange={v => set('indexable', v)} />
            </div>
            <div style={{fontSize:'0.8rem',color:'#8A7968',background:'#F5F1EB',borderRadius:8,padding:'0.75rem 1rem',lineHeight:1.6}}>
              Sitemap disponible en: <code style={{background:'#EBE5DB',padding:'0.15rem 0.4rem',borderRadius:4}}>/sitemap.xml</code><br />
              Robots.txt disponible en: <code style={{background:'#EBE5DB',padding:'0.15rem 0.4rem',borderRadius:4}}>/robots.txt</code>
            </div>
          </div>
        )}

        {activeTab === 'banners' && (
          <BannersManager />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard />
        )}

        {activeTab === 'appearance' && (
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <h3 style={{fontFamily:'serif',fontSize:'1rem',color:'#1A1612',marginBottom:'0.5rem'}}>Apariencia</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem'}}>
              <Field label="Color primario">
                <input type="color" style={{...s.input, padding:'0.2rem', minWidth:60, width:60, height:38, cursor:'pointer'}} value={form.primaryColor} onChange={e => set('primaryColor', e.target.value)} />
              </Field>
              <Field label="Color secundario">
                <input type="color" style={{...s.input, padding:'0.2rem', minWidth:60, width:60, height:38, cursor:'pointer'}} value={form.secondaryColor} onChange={e => set('secondaryColor', e.target.value)} />
              </Field>
              <Field label="Color de fondo">
                <input type="color" style={{...s.input, padding:'0.2rem', minWidth:60, width:60, height:38, cursor:'pointer'}} value={form.bgColor} onChange={e => set('bgColor', e.target.value)} />
              </Field>
            </div>
            <Field label="Modo visual">
              <select style={{...s.input, maxWidth:300}} value={form.visualMode} onChange={e => set('visualMode', e.target.value)}>
                <option value="claro-premium">Claro Premium</option>
                <option value="oscuro-premium">Oscuro Premium</option>
                <option value="blanco-azul-premium">Blanco Azul Premium</option>
              </select>
            </Field>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <h3 style={{fontFamily:'serif',fontSize:'1rem',color:'#1A1612',marginBottom:'0.5rem'}}>Configuracion avanzada</h3>
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.65rem'}}>
              <Toggle label="Sonido de pedido nuevo" checked={form.newOrderSound} onChange={v => set('newOrderSound', v)} />
              <Toggle label="Mostrar stock publico" checked={form.stockVisible} onChange={v => set('stockVisible', v)} />
              <Toggle label="Mostrar productos sin stock" checked={form.showOutOfStock} onChange={v => set('showOutOfStock', v)} />
            </div>
            <Field label="Intervalo de revision">
              <select style={{...s.input, maxWidth:200}} value={String(form.pollInterval)} onChange={e => set('pollInterval', e.target.value)}>
                <option value="20">20 segundos</option>
                <option value="30">30 segundos</option>
                <option value="60">60 segundos</option>
              </select>
            </Field>
          </div>
        )}
      </div>

      {/* Save button */}
      <button style={{...s.btnSave, alignSelf:'flex-end', padding:'0.65rem 1.5rem', fontSize:'0.88rem'}} onClick={handleSave} disabled={saving}>
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
                    <option value="last">Ultimas unidades</option>
                    <option value="featured">Destacado</option>
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
