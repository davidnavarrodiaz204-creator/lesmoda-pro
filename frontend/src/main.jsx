// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const style = document.createElement('style');
style.textContent = `
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'DM Sans', 'Segoe UI', sans-serif; background:#FAF7F2; color:#1A1612; }
  a { text-decoration:none; }
  button { cursor:pointer; }
  img { max-width:100%; display:block; }

  .product-card { background:white; border-radius:12px; overflow:hidden;
    box-shadow:0 4px 24px rgba(26,22,18,0.08); transition:transform .25s,box-shadow .25s;
    cursor:pointer; display:flex; flex-direction:column; }
  .product-card:hover { transform:translateY(-4px); box-shadow:0 12px 40px rgba(26,22,18,0.16); }
  .card-image { position:relative; aspect-ratio:3/4; overflow:hidden; background:#F0EBE3; }
  .card-image img { width:100%; height:100%; object-fit:cover; transition:transform .5s; }
  .product-card:hover .card-image img { transform:scale(1.06); }
  .img-placeholder { width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
    justify-content:center;gap:.5rem;background:linear-gradient(135deg,#F0EBE3,#E8D5B0);color:#8A7968;font-size:.8rem; }
  .card-badge { position:absolute;top:10px;left:10px;font-size:.68rem;font-weight:700;
    letter-spacing:.1em;text-transform:uppercase;padding:.22rem .6rem;border-radius:4px; }
  .card-badge.new  { background:#C9A96E; color:#1A1612; }
  .card-badge.sale { background:#C25E5E; color:white; }
  .card-badge.hot  { background:#1A1612; color:#C9A96E; }
  .card-body { padding:1rem 1.1rem 1.2rem; display:flex; flex-direction:column; gap:.45rem; flex:1; }
  .card-category { font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;color:#C9A96E;font-weight:600; }
  .card-name { font-family:serif; font-size:1.03rem; line-height:1.3; color:#1A1612; }
  .card-desc { font-size:.8rem; color:#8A7968; line-height:1.4; }
  .card-footer { display:flex;align-items:center;justify-content:space-between;margin-top:auto;
    padding-top:.75rem;border-top:1px solid #F0EAE0; }
  .card-price { font-size:1.1rem; font-weight:700; color:#1A1612; }
  .card-price-old { font-size:.8rem;color:#8A7968;text-decoration:line-through;margin-left:.3rem; }
  .btn-whatsapp { display:inline-flex;align-items:center;gap:.4rem;background:#25D366;color:white;
    border:none;font-family:sans-serif;font-size:.78rem;font-weight:600;padding:.48rem .9rem;
    border-radius:8px;transition:all .25s;white-space:nowrap; }
  .btn-whatsapp:hover { background:#1ebe5d; transform:scale(1.04); }

  /* ── RESPONSIVE MÓVIL ─────────────────────────────────── */
  @media (max-width: 768px) {
    .product-card:hover { transform:none; }

    /* header móvil */
    .lm-header-inner { flex-wrap:wrap; height:auto !important; padding:0.75rem 1rem !important; gap:0.5rem; }
    .lm-nav-mobile { display:flex !important; }
    .lm-nav-desktop { display:none !important; }
    .lm-hamburger { display:flex !important; }

    /* hero móvil */
    .lm-hero { padding:3rem 1.25rem 2.5rem !important; }

    /* filtros móvil */
    .lm-filters { padding:1rem !important; gap:0.4rem !important; }
    .lm-filter-label { display:none; }

    /* grid móvil: 2 columnas */
    .lm-product-grid { grid-template-columns:repeat(2,1fr) !important; gap:0.75rem !important; }

    /* sección grid padding */
    .lm-grid-section { padding:1rem 1rem 2.5rem !important; }

    /* modal móvil: 1 columna */
    .lm-detail-modal { grid-template-columns:1fr !important; max-height:95vh; }
    .lm-detail-img { min-height:220px !important; max-height:280px; }

    /* footer móvil */
    .lm-footer-top { flex-direction:column !important; gap:1.5rem !important; padding:1.75rem 1.25rem !important; }

    /* card body más compacto */
    .card-body { padding:0.75rem 0.85rem 0.9rem; }
    .card-name { font-size:0.92rem; }
    .card-price { font-size:1rem; }
    .btn-whatsapp { font-size:.72rem; padding:.42rem .7rem; }
  }


  /* ── ADMIN RESPONSIVE ─────────────────────────────────── */
  @media (max-width: 768px) {
    /* ocultar sidebar, mostrar header móvil */
    aside { display:none !important; }
    .lm-admin-main { padding:0.75rem !important; }
    [style*="width:220"] { display:none !important; }

    /* mostrar header y cards móvil */
    .lm-mobile-header { display:flex !important; }
    .lm-mobile-cards  { display:flex !important; }
    .lm-table-wrap table { display:none; }

    /* config row en columna */
    .lm-config-row { flex-direction:column !important; }
    .lm-config-row input, .lm-config-row select { min-width:100% !important; width:100% !important; }

    /* modal producto en móvil */
    .lm-prod-modal { max-width:100% !important; margin:0; border-radius:12px 12px 0 0 !important; }
    .lm-prod-modal-row { grid-template-columns:1fr !important; }
  }
  @media (max-width: 400px) {
    .lm-product-grid { grid-template-columns:repeat(2,1fr) !important; gap:0.5rem !important; }
    .lm-grid-section { padding:0.75rem 0.75rem 2rem !important; }
  }
`;
document.head.appendChild(style);

const link = document.createElement('link');
link.rel  = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap';
document.head.appendChild(link);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
);
