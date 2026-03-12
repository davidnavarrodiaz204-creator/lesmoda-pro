// frontend/src/pages/AdminPage.jsx
import { useState, useRef } from 'react';
import { useNavigate }      from 'react-router-dom';
import { useAuth }          from '../context/AuthContext';
import { useProducts }      from '../hooks/useProducts';
import { productService, configService } from '../services/api';

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { products, loading, refetch } = useProducts({});
  const [modal,   setModal]   = useState(null); // null | 'new' | product
  const [config,  setConfig]  = useState({ waNumber: '', storeName: 'LesModa' });
  const [saving,  setSaving]  = useState(false);

  // Cargar config al montar
  useState(() => {
    configService.get().then(({ data }) => setConfig(c => ({ ...c, ...data.data }))).catch(() => {});
  });

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    await productService.remove(id);
    refetch();
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    await configService.save(config).finally(() => setSaving(false));
    alert('✅ Configuración guardada');
  };

  return (
    <div style={s.page}>
      {/* SIDEBAR */}
      <aside style={s.sidebar}>
        <div style={s.sidebarLogo}>Les<em style={{color:'#C9A96E'}}>Mo</em>da</div>
        <nav style={s.sidebarNav}>
          <div style={{...s.sideLink, ...s.sideLinkActive}}>📦 Productos</div>
          <div style={s.sideLink} onClick={() => navigate('/')}>🏪 Ver tienda</div>
          <div style={s.sideLink} onClick={handleLogout}>🚪 Salir</div>
        </nav>
        <div style={s.sideUser}>👤 {user?.name}</div>
      </aside>

      {/* MAIN */}
      <main style={s.main}>
        {/* CONFIG */}
        <div style={s.configCard}>
          <h3 style={s.cardTitle}>⚙️ Configuración de la tienda</h3>
          <div style={s.configRow}>
            <div style={s.formGroup}>
              <label style={s.label}>Nombre de la tienda</label>
              <input style={s.input} value={config.storeName || ''}
                onChange={e => setConfig(c => ({...c, storeName: e.target.value}))} />
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>📱 Número WhatsApp</label>
              <input style={s.input} placeholder="+51 999 999 999"
                value={config.waNumber || ''}
                onChange={e => setConfig(c => ({...c, waNumber: e.target.value}))} />
            </div>
            <button style={s.btnSave} onClick={handleSaveConfig} disabled={saving}>
              {saving ? 'Guardando…' : '💾 Guardar'}
            </button>
          </div>
        </div>

        {/* PRODUCTOS */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <h3 style={s.cardTitle}>📦 Productos ({products.length})</h3>
            <button style={s.btnAdd} onClick={() => setModal('new')}>+ Agregar</button>
          </div>

          {loading && <p style={{padding:'2rem',color:'#8A7968'}}>Cargando…</p>}

          <table style={s.table}>
            <thead>
              <tr style={s.thead}>
                <th style={s.th}>Imagen</th>
                <th style={s.th}>Nombre</th>
                <th style={s.th}>Categoría</th>
                <th style={s.th}>Precio</th>
                <th style={s.th}>Clics WA</th>
                <th style={s.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} style={s.tr}>
                  <td style={s.td}>
                    {p.images?.[0]?.url
                      ? <img src={p.images[0].url} style={s.thumb} alt="" />
                      : <div style={s.noThumb}>📷</div>}
                  </td>
                  <td style={{...s.td, fontWeight:500}}>{p.name}</td>
                  <td style={s.td}>{p.category}</td>
                  <td style={s.td}>S/ {p.price.toFixed(2)}</td>
                  <td style={{...s.td, textAlign:'center'}}>{p.whatsappClicks ?? 0}</td>
                  <td style={s.td}>
                    <button style={s.btnEdit} onClick={() => setModal(p)}>✏️</button>
                    <button style={s.btnDel}  onClick={() => handleDelete(p._id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL AGREGAR / EDITAR */}
      {modal && (
        <ProductModal
          product={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); refetch(); }}
        />
      )}
    </div>
  );
}

// ── Modal de producto ──────────────────────────────────────────────────────
function ProductModal({ product, onClose, onSaved }) {
  const isEdit = !!product;
  const fileRef = useRef();
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(product?.images?.[0]?.url || '');
  const [form, setForm] = useState({
    name:        product?.name        || '',
    description: product?.description || '',
    price:       product?.price       || '',
    oldPrice:    product?.oldPrice    || '',
    category:    product?.category    || 'Mujer',
    badge:       product?.badge       || '',
    sizes:       (product?.sizes || []).join(', '),
    colors:      (product?.colors|| []).join(', '),
    stock:       product?.stock       || 0,
    featured:    product?.featured    || false,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.name || !form.price) return alert('Nombre y precio son requeridos');
    setSaving(true);

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (fileRef.current?.files[0]) fd.append('image', fileRef.current.files[0]);

    try {
      if (isEdit) await productService.update(product._id, fd);
      else        await productService.create(fd);
      onSaved();
    } catch (err) {
      alert(err.response?.data?.message || 'Error guardando');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={ms.overlay} onClick={onClose}>
      <div style={ms.modal} onClick={e => e.stopPropagation()}>
        <div style={ms.header}>
          <h2 style={ms.title}>{isEdit ? 'Editar Producto' : 'Agregar Producto'}</h2>
          <button onClick={onClose} style={ms.close}>✕</button>
        </div>
        <div style={ms.body}>
          <Field label="Nombre *">
            <input style={ms.input} value={form.name} onChange={e => set('name', e.target.value)} />
          </Field>
          <div style={ms.row}>
            <Field label="Precio (S/) *">
              <input style={ms.input} type="number" value={form.price} onChange={e => set('price', e.target.value)} />
            </Field>
            <Field label="Precio anterior">
              <input style={ms.input} type="number" value={form.oldPrice} onChange={e => set('oldPrice', e.target.value)} />
            </Field>
          </div>
          <div style={ms.row}>
            <Field label="Categoría">
              <select style={ms.input} value={form.category} onChange={e => set('category', e.target.value)}>
                <option>Mujer</option><option>Hombre</option><option>Accesorios</option>
              </select>
            </Field>
            <Field label="Etiqueta">
              <select style={ms.input} value={form.badge} onChange={e => set('badge', e.target.value)}>
                <option value="">Sin etiqueta</option>
                <option value="new">🆕 Nuevo</option>
                <option value="sale">🏷️ Oferta</option>
                <option value="hot">🔥 Trending</option>
              </select>
            </Field>
          </div>
          <Field label="Descripción">
            <textarea style={{...ms.input, minHeight:70, resize:'vertical'}}
              value={form.description} onChange={e => set('description', e.target.value)} />
          </Field>
          <div style={ms.row}>
            <Field label="Tallas (ej: S, M, L, XL)">
              <input style={ms.input} value={form.sizes} onChange={e => set('sizes', e.target.value)} placeholder="S, M, L" />
            </Field>
            <Field label="Stock">
              <input style={ms.input} type="number" value={form.stock} onChange={e => set('stock', e.target.value)} />
            </Field>
          </div>
          <Field label="Imagen">
            <input type="file" ref={fileRef} accept="image/*" onChange={handleFile} style={{fontSize:'0.88rem'}} />
            {preview && <img src={preview} style={{marginTop:'0.5rem',maxHeight:140,borderRadius:8,objectFit:'cover'}} alt="preview" />}
          </Field>
        </div>
        <div style={ms.footer}>
          <button style={ms.btnCancel} onClick={onClose}>Cancelar</button>
          <button style={ms.btnSave}   onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando…' : '💾 Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'0.38rem'}}>
      <label style={{fontSize:'0.73rem',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'#8A7968'}}>{label}</label>
      {children}
    </div>
  );
}

// ── Estilos ────────────────────────────────────────────────────────────────
const s = {
  page:       { display:'flex', minHeight:'100vh', background:'#FAF7F2', fontFamily:'sans-serif' },
  sidebar:    { width:220, background:'#1A1612', display:'flex', flexDirection:'column', padding:'1.5rem 1rem', position:'sticky', top:0, height:'100vh' },
  sidebarLogo:{ fontFamily:'serif', fontSize:'1.5rem', color:'#C9A96E', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'2rem' },
  sidebarNav: { display:'flex', flexDirection:'column', gap:'0.25rem', flex:1 },
  sideLink:   { color:'#B0A899', padding:'0.6rem 0.75rem', borderRadius:6, cursor:'pointer', fontSize:'0.88rem', fontWeight:500 },
  sideLinkActive:{ background:'rgba(201,169,110,0.12)', color:'#C9A96E' },
  sideUser:   { color:'#8A7968', fontSize:'0.78rem', paddingTop:'1rem', borderTop:'1px solid rgba(255,255,255,0.08)' },
  main:       { flex:1, padding:'2rem', display:'flex', flexDirection:'column', gap:'1.5rem', overflowY:'auto' },
  card:       { background:'white', borderRadius:12, overflow:'hidden', boxShadow:'0 2px 16px rgba(0,0,0,0.06)' },
  configCard: { background:'white', borderRadius:12, padding:'1.5rem', boxShadow:'0 2px 16px rgba(0,0,0,0.06)' },
  configRow:  { display:'flex', alignItems:'flex-end', gap:'1rem', flexWrap:'wrap', marginTop:'1rem' },
  cardHeader: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.25rem 1.5rem', borderBottom:'1px solid #F0EAE0' },
  cardTitle:  { fontFamily:'serif', fontSize:'1.1rem', color:'#1A1612' },
  btnAdd:     { background:'#1A1612', color:'#C9A96E', border:'none', fontFamily:'sans-serif', fontSize:'0.82rem', fontWeight:700, padding:'0.5rem 1.1rem', borderRadius:6, cursor:'pointer' },
  btnSave:    { background:'#C9A96E', color:'#1A1612', border:'none', fontFamily:'sans-serif', fontSize:'0.82rem', fontWeight:700, padding:'0.5rem 1.1rem', borderRadius:6, cursor:'pointer', whiteSpace:'nowrap' },
  table:      { width:'100%', borderCollapse:'collapse' },
  thead:      { background:'#FAF7F2' },
  th:         { padding:'0.75rem 1rem', textAlign:'left', fontSize:'0.73rem', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:'#8A7968' },
  tr:         { borderBottom:'1px solid #F5F0EB' },
  td:         { padding:'0.75rem 1rem', fontSize:'0.88rem', color:'#1A1612' },
  thumb:      { width:48, height:48, objectFit:'cover', borderRadius:6 },
  noThumb:    { width:48, height:48, background:'#F0EBE3', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', opacity:0.5 },
  btnEdit:    { background:'none', border:'1px solid #D0C8BE', borderRadius:6, padding:'0.3rem 0.6rem', cursor:'pointer', marginRight:'0.3rem' },
  btnDel:     { background:'none', border:'1px solid #F5C0C0', borderRadius:6, padding:'0.3rem 0.6rem', cursor:'pointer' },
  formGroup:  { display:'flex', flexDirection:'column', gap:'0.38rem' },
  label:      { fontSize:'0.73rem', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:'#8A7968' },
  input:      { border:'1.5px solid #E0D8CE', borderRadius:8, padding:'0.6rem 0.85rem', fontFamily:'sans-serif', fontSize:'0.9rem', outline:'none', background:'#FAF7F2', minWidth:160 },
};

const ms = {
  overlay: { position:'fixed', inset:0, background:'rgba(26,22,18,0.72)', backdropFilter:'blur(5px)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' },
  modal:   { background:'white', borderRadius:16, width:'100%', maxWidth:520, maxHeight:'92vh', overflowY:'auto', boxShadow:'0 24px 80px rgba(0,0,0,0.3)' },
  header:  { padding:'1.4rem 1.5rem 1rem', borderBottom:'1px solid #F0EAE0', display:'flex', alignItems:'center', justifyContent:'space-between' },
  title:   { fontFamily:'serif', fontSize:'1.2rem', color:'#1A1612' },
  close:   { background:'none', border:'none', fontSize:'1.2rem', cursor:'pointer', color:'#8A7968' },
  body:    { padding:'1.4rem 1.5rem', display:'flex', flexDirection:'column', gap:'1rem' },
  row:     { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' },
  input:   { border:'1.5px solid #E0D8CE', borderRadius:8, padding:'0.62rem 0.85rem', fontFamily:'sans-serif', fontSize:'0.9rem', color:'#1A1612', background:'#FAF7F2', outline:'none', width:'100%' },
  footer:  { padding:'1rem 1.5rem 1.5rem', display:'flex', gap:'0.75rem', justifyContent:'flex-end' },
  btnCancel:{ background:'none', border:'1.5px solid #D0C8BE', color:'#8A7968', fontFamily:'sans-serif', fontSize:'0.88rem', fontWeight:500, padding:'0.55rem 1.3rem', borderRadius:8, cursor:'pointer' },
  btnSave: { background:'#1A1612', color:'#C9A96E', border:'none', fontFamily:'sans-serif', fontSize:'0.88rem', fontWeight:700, padding:'0.55rem 1.5rem', borderRadius:8, cursor:'pointer' },
};
