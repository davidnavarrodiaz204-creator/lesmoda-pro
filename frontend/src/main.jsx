// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const style = document.createElement('style');
style.textContent = `
  /* ── NORDIC FASHION THEME ────────────────────────────── */
  :root {
    --lm-primary: #5B7CFA;
    --lm-primary-rgb: 91, 124, 250;
    --lm-primary-soft: #DCE5FF;
    --lm-secondary: #111827;
    --lm-bg: #F6F7FB;
    --lm-bg-alt: #EEF2F7;
    --lm-surface: #FFFFFF;
    --lm-surface-2: #F1F3F8;
    --lm-text: #111827;
    --lm-muted: #6B7280;
    --lm-border: #E5E7EB;
    --lm-hero-bg: #111827;
    --lm-hero-cta: #5B7CFA;
    --lm-hero-title: #FFFFFF;
    --lm-hero-cta-text: #FFFFFF;
    --lm-primary-contrast: #FFFFFF;
    --lm-focus-ring: rgba(91, 124, 250, 0.15);
    --lm-wa: #25D366;
    --lm-success: #10B981;
    --lm-danger: #EF4444;
    --lm-warning: #F59E0B;
    --font-sans: 'Inter', 'DM Sans', 'Segoe UI', system-ui, -apple-system, sans-serif;
    --font-display: 'Playfair Display', 'Georgia', serif;
  }
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior: smooth; -webkit-tap-highlight-color: transparent; }
  body { font-family: var(--font-sans); background: var(--lm-bg); color: var(--lm-text); overflow-x:hidden; -webkit-font-smoothing: antialiased; }
  a { text-decoration:none; color:inherit; }
  button { cursor:pointer; font-family:inherit; }
  input, textarea, select { font-family:inherit; }
  input:focus, textarea:focus, select:focus { outline:none; border-color:var(--lm-primary) !important; box-shadow:0 0 0 3px var(--lm-focus-ring) !important; }
  img { max-width:100%; display:block; }
  img.img-error { display:none; }
  .img-error-fallback { display:flex; align-items:center; justify-content:center; height:100%; color:var(--lm-muted); opacity:.4; }
  @media (max-width:768px) { button { min-height:44px; } .bottom-nav-btn { min-height:auto; } }

  /* ── KEYFRAMES ────────────────────────────────────────── */
  @keyframes fadeInUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes scaleIn { from { opacity:0; transform:scale(.95); } to { opacity:1; transform:scale(1); } }
  @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes shimmer { 0% { background-position:200% 0; } 100% { background-position:-200% 0; } }

  /* ── PRODUCT CARD ─────────────────────────────────────── */
  .product-card { background:var(--lm-surface); border-radius:8px; overflow:hidden;
    box-shadow:0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02);
    transition:transform .3s ease,box-shadow .3s ease;
    cursor:pointer; display:flex; flex-direction:column; position:relative;
    animation:fadeInUp .35s ease both; }
  .product-card:nth-child(2) { animation-delay:.05s; }
  .product-card:nth-child(3) { animation-delay:.1s; }
  .product-card:nth-child(4) { animation-delay:.15s; }
  .product-card:nth-child(5) { animation-delay:.2s; }
  .product-card:nth-child(6) { animation-delay:.25s; }
  .product-card:hover { transform:translateY(-2px); box-shadow:0 8px 25px -8px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04); }
  .card-image { position:relative; aspect-ratio:3/4; overflow:hidden; background:var(--lm-surface-2); }
  .card-image-skeleton { position:absolute; inset:0;
    background:linear-gradient(110deg,var(--lm-surface-2) 30%,#F8F9FB 50%,var(--lm-surface-2) 70%);
    background-size:200% 100%; animation:shimmer 1.5s ease-in-out infinite; }
  .card-image img { width:100%; height:100%; object-fit:cover; transition:transform .5s cubic-bezier(.25,.46,.45,.94); }
  .product-card:hover .card-image img { transform:scale(1.05); }
  .img-placeholder { width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
    justify-content:center;gap:.5rem;background:var(--lm-surface-2);color:var(--lm-muted);font-size:.8rem; }
  .card-badge { position:absolute;top:8px;left:8px;font-size:.58rem;font-weight:600;
    letter-spacing:.05em;text-transform:uppercase;padding:.2rem .6rem;border-radius:999px;
    z-index:2; backdrop-filter:blur(4px); }
  .card-badge.new  { background:var(--lm-primary-soft); color:var(--lm-primary); }
  .card-badge.sale { background:#FEF2F2; color:var(--lm-danger); }
  .card-badge.hot  { background:var(--lm-primary-soft); color:var(--lm-primary); }
  .card-badge.last  { background:#FEF2F2; color:var(--lm-danger); }
  .card-badge.featured { background:#EEF2FF; color:var(--lm-primary); }
  .card-discount-badge { position:absolute;top:8px;right:8px;font-size:.6rem;font-weight:700;
    background:#FEF2F2;color:var(--lm-danger);padding:.2rem .5rem;border-radius:999px;z-index:2; }
  .card-image-overlay { position:absolute;bottom:0;left:0;right:0;padding:.5rem;
    background:linear-gradient(transparent,rgba(0,0,0,.15));opacity:0;transform:translateY(8px);
    transition:all .25s ease;z-index:2; }
  .product-card:hover .card-image-overlay { opacity:1;transform:translateY(0); }
  .card-add-btn { width:100%;padding:.45rem;border:none;border-radius:8px;font-size:.72rem;
    font-weight:600;background:var(--lm-primary);color:white;cursor:pointer;transition:all .2s ease;
    box-shadow:0 2px 8px rgba(91,124,250,.25); }
  .card-add-btn:hover { opacity:.9; transform:translateY(-1px); }
  .card-add-btn:active { transform:scale(.97); }
  .card-add-btn-added { background:var(--lm-success) !important; color:white; }
  .card-body { padding:.65rem .75rem .75rem; display:flex; flex-direction:column; gap:.25rem; flex:1; }
  .card-category { font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;color:var(--lm-muted);font-weight:500; }
  .card-name { font-family:var(--font-display); font-size:.9rem; line-height:1.3; color:var(--lm-text); font-weight:500; }
  .card-desc { font-size:.72rem; color:var(--lm-muted); line-height:1.4; display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
  .card-footer { display:flex;align-items:center;justify-content:space-between;margin-top:auto;
    padding-top:.5rem;border-top:1px solid var(--lm-border); }
  .card-pricing { display:flex; align-items:baseline; gap:.3rem; }
  .card-price-current { font-size:.95rem; font-weight:700; color:var(--lm-text); letter-spacing:-.02em; }
  .card-price-old { font-size:.72rem;color:var(--lm-muted);text-decoration:line-through; }
  .btn-whatsapp { display:inline-flex;align-items:center;justify-content:center;
    background:var(--lm-wa);color:white;border:none;width:30px;height:30px;border-radius:6px;
    transition:all .2s;flex-shrink:0; }
  .btn-whatsapp:hover { opacity:.9; }
  .btn-whatsapp:active { transform:scale(.95); }
  .stock-badge { font-size:.62rem; font-weight:500; padding:.1rem .5rem; border-radius:4px; display:inline-block; width:fit-content; }
  .stock-ok { background:#ECFDF5; color:#059669; }
  .stock-low { background:#FFFBEB; color:#D97706; }
  .stock-consult { background:var(--lm-surface-2); color:var(--lm-muted); }

  /* ── HERO SECTION ─────────────────────────────────────────── */
  .hero-section { position:relative; background:var(--lm-hero-bg); overflow:hidden; }
  .hero-layout { display:grid; grid-template-columns:1fr 1fr; max-width:1200px; margin:0 auto; }
  .hero-col-text { display:flex; align-items:center; padding:2.5rem 2rem; z-index:2; }
  .hero-content-inner { max-width:460px; }
  .hero-col-image { display:flex; align-items:center; justify-content:center; overflow:hidden; min-height:320px; }
  .hero-lifestyle-img { width:100%; height:100%; object-fit:cover; }
  .hero-title { font-family:var(--font-display); font-size:clamp(1.6rem,3.8vw,2.8rem);
    font-weight:700; color:var(--lm-hero-title); line-height:1.15; padding-bottom:.5rem; }
  .hero-highlight { color:var(--lm-primary); }
  .hero-subtitle { font-size:clamp(.85rem,1.2vw,1rem); color:#9CA3AF; line-height:1.6;
    padding-bottom:1.25rem; font-weight:400; }
  .hero-actions { display:flex; gap:.6rem; flex-wrap:wrap; padding-bottom:1rem; }
  .hero-btn { display:inline-flex; align-items:center; gap:.5rem; padding:.65rem 1.5rem;
    border-radius:6px; font-size:.85rem; font-weight:600; transition:all .25s ease;
    text-decoration:none; font-family:inherit; border:none; }
  .hero-btn-primary { background:var(--lm-primary); color:white; }
  .hero-btn-primary:hover { opacity:.9; transform:translateY(-1px); }
  .hero-btn-secondary { background:transparent; color:white; border:1.5px solid rgba(255,255,255,.2); }
  .hero-btn-secondary:hover { border-color:rgba(255,255,255,.5); background:rgba(255,255,255,.06); }
  .hero-trust-badges { display:flex; gap:.4rem; flex-wrap:wrap; }
  .hero-trust-badge { display:inline-flex; align-items:center; gap:.3rem;
    font-size:.65rem; color:#9CA3AF; background:rgba(255,255,255,.04);
    padding:.25rem .5rem; border-radius:4px; font-weight:450;
    border:1px solid rgba(255,255,255,.06); }
  .hero-share { margin-top:.65rem; }

  /* ── SEARCH BAR ─────────────────────────────────────────── */
  .lm-search-bar { padding:.75rem 1.25rem 0; max-width:1200px; margin:0 auto; }
  .lm-search-inner { display:flex; align-items:center; gap:.5rem; background:var(--lm-surface);
    border:1.5px solid var(--lm-border); border-radius:8px; padding:.35rem .85rem;
    transition:border-color .2s, box-shadow .2s; }
  .lm-search-inner:focus-within { border-color:var(--lm-primary); box-shadow:0 0 0 3px var(--lm-focus-ring); }
  .lm-search-input { flex:1; border:none; outline:none; background:transparent;
    font-size:.9rem; color:var(--lm-text); font-family:inherit; padding:.3rem 0; }
  .lm-search-input::placeholder { color:var(--lm-muted); opacity:.6; }
  .lm-search-clear { background:none; border:none; cursor:pointer; color:var(--lm-muted);
    padding:.2rem; display:flex; transition:color .2s; }
  .lm-search-clear:hover { color:var(--lm-text); }

  /* ── CATEGORY SECTION ─────────────────────────────────── */
  .cat-section { padding:1.5rem 1.25rem .75rem; }
  .cat-inner { max-width:1200px; margin:0 auto; }
  .cat-heading { font-size:.75rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--lm-muted); margin-bottom:.75rem; }
  .cat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:.5rem; }
  .cat-card { display:flex;flex-direction:column;align-items:center;gap:.2rem;
    padding:.85rem .5rem; border-radius:8px; border:1.5px solid var(--lm-border);
    background:var(--lm-surface); cursor:pointer; transition:all .2s; font-family:inherit; }
  .cat-card:hover { border-color:var(--lm-primary); background:var(--lm-primary-soft); }
  .cat-card-active { border-color:var(--lm-primary); background:var(--lm-primary); }
  .cat-card-active .cat-label { color:white; }
  .cat-card-active .cat-desc { color:rgba(255,255,255,.7); }
  .cat-card-active .cat-icon { color:white; }
  .cat-icon { width:24px; height:24px; color:var(--lm-muted); }
  .cat-label { font-size:.82rem; font-weight:600; color:var(--lm-text); }
  .cat-desc { font-size:.68rem; color:var(--lm-muted); }
  .cat-card:active { transform:scale(.96); }

  /* ── PROMO BANNER ─────────────────────────────────────── */
  .promo-banner { padding:0 1.25rem; }
  .promo-inner { display:flex;align-items:center;justify-content:center;gap:.6rem;
    flex-wrap:wrap; padding:.6rem 1rem; border-radius:8px;
    background:var(--lm-secondary); }
  .promo-badge { font-size:.6rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
    background:var(--lm-primary);color:white;padding:.2rem .6rem;border-radius:4px; }
  .promo-text { font-size:.8rem;color:#9CA3AF;font-weight:400; }

  /* ── MODAL OVERLAY ─────────────────────────────────────── */
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(8px);
    z-index:400; display:flex; align-items:center; justify-content:center; padding:1rem;
    animation:fadeIn .2s ease-out; }
  .product-modal { background:var(--lm-surface); width:100%; max-width:800px;
    max-height:92dvh; overflow-y:auto; display:grid;
    grid-template-columns:1fr 1fr; grid-template-rows:auto auto; align-items:start;
    position:relative; animation:slideUp .35s ease-out; border-radius:12px; }
  .modal-close { position:absolute; top:10px; right:10px; z-index:10; width:32px;height:32px;
    border-radius:50%; background:rgba(255,255,255,.9); border:none;
    display:flex;align-items:center;justify-content:center;cursor:pointer;
    box-shadow:0 1px 6px rgba(0,0,0,.1); transition:all .2s; color:var(--lm-text); }
  .modal-close:hover { background:white; }

  .modal-gallery { display:flex;flex-direction:column; grid-row:1; grid-column:1; background:var(--lm-surface-2); }
  .modal-gallery-main { position:relative; display:flex; align-items:center; justify-content:center;
    overflow:hidden; background:var(--lm-surface-2); touch-action:pan-y; }
  .modal-gallery-main img { width:100%;height:auto;max-height:min(70vh,650px);
    object-fit:contain; display:block; transition:opacity .4s ease, transform .4s ease; }
  .modal-img-skeleton { position:absolute; inset:0;
    background:linear-gradient(110deg,var(--lm-surface-2) 30%,#F8F9FB 50%,var(--lm-surface-2) 70%);
    background-size:200% 100%; animation:shimmer 1.5s ease-in-out infinite; }
  .modal-img.img-loading { opacity:0; }
  .modal-drag-handle { display:none; position:absolute; top:8px; left:50%; transform:translateX(-50%);
    width:36px; height:4px; border-radius:4px; background:rgba(0,0,0,.15); z-index:20; }
  .modal-no-img { display:flex;align-items:center;justify-content:center;min-height:280px;
    color:var(--lm-muted); opacity:.4; }
  .modal-gallery-nav { position:absolute;top:50%;transform:translateY(-50%);width:32px;height:32px;
    border-radius:50%;background:rgba(255,255,255,.9);border:none;
    display:flex;align-items:center;justify-content:center;cursor:pointer;
    box-shadow:0 2px 8px rgba(0,0,0,.1);color:var(--lm-text);transition:all .2s;z-index:2; }
  .modal-gallery-nav:hover { background:white; }
  .modal-gallery-prev { left:10px; }
  .modal-gallery-next { right:10px; }
  .modal-thumbs { display:flex;gap:.5rem;padding:.5rem .75rem .75rem;overflow-x:auto;
    scrollbar-width:none; -ms-overflow-style:none; }
  .modal-thumbs::-webkit-scrollbar { display:none; }
  .modal-thumb { flex-shrink:0;width:56px;height:56px;border-radius:6px;overflow:hidden;
    border:2px solid transparent;cursor:pointer;padding:0;background:none;transition:all .2s; }
  .modal-thumb:hover { border-color:var(--lm-primary); opacity:.8; }
  .modal-thumb img { width:100%;height:100%;object-fit:cover; }
  .modal-thumb-active { border-color:var(--lm-primary); }

  .modal-info { grid-row:1; grid-column:2; padding:1.25rem 1.5rem;
    display:flex;flex-direction:column;gap:.75rem; position:relative; }
  .modal-info-content { flex:1; display:flex; flex-direction:column; gap:.75rem; }
  .modal-category { font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;
    color:var(--lm-muted);font-weight:500; }
  .modal-name { font-family:var(--font-display); font-size:1.4rem; line-height:1.25;
    color:var(--lm-text); font-weight:600; }
  .modal-badge { display:inline-block;font-size:.65rem;font-weight:600;letter-spacing:.1em;
    text-transform:uppercase;padding:.2rem .6rem;border-radius:4px;width:fit-content; }
  .modal-badge.new  { background:var(--lm-primary-soft); color:var(--lm-primary); }
  .modal-badge.sale { background:#FEF2F2; color:var(--lm-danger); }
  .modal-badge.hot  { background:#F3F4F6; color:var(--lm-secondary); }
  .modal-badge.last  { background:#FEF2F2; color:var(--lm-danger); }
  .modal-badge.featured { background:#F3F4F6; color:var(--lm-secondary); }
  .modal-pricing { display:flex;align-items:baseline;gap:.5rem;flex-wrap:wrap; }
  .modal-price { font-size:1.5rem;font-weight:700;color:var(--lm-text); }
  .modal-old-price { font-size:.9rem;color:var(--lm-muted);text-decoration:line-through; }
  .modal-discount { font-size:.72rem;font-weight:600;color:white;background:var(--lm-danger);
    padding:.15rem .5rem;border-radius:4px; }

  .modal-variant { display:flex;flex-direction:column;gap:.4rem; }
  .modal-variant-label { font-size:.65rem;font-weight:600;letter-spacing:.08em;
    text-transform:uppercase;color:var(--lm-muted); }
  .modal-size-grid { display:flex;flex-wrap:wrap;gap:.35rem; }
  .modal-size-btn { min-width:38px;height:34px;border-radius:6px;border:1.5px solid var(--lm-border);
    background:transparent;color:var(--lm-text);font-size:.8rem;font-weight:500;cursor:pointer;
    padding:0 .6rem;transition:all .15s;font-family:inherit; }
  .modal-size-btn:hover { border-color:var(--lm-primary); }
  .modal-size-btn-active { background:var(--lm-primary);border-color:var(--lm-primary);color:white;font-weight:600; }
  .modal-color-grid { display:flex;flex-wrap:wrap;gap:.35rem; }
  .modal-color-btn { padding:.3rem .8rem;border-radius:6px;border:1.5px solid var(--lm-border);
    background:transparent;color:var(--lm-text);font-size:.8rem;cursor:pointer;
    transition:all .15s;font-family:inherit; }
  .modal-color-btn:hover { border-color:var(--lm-primary); }
  .modal-color-btn-active { background:var(--lm-primary);border-color:var(--lm-primary);color:white;font-weight:600; }

  .modal-qty { display:flex;flex-direction:column;gap:.4rem; }
  .modal-qty-controls { display:flex;align-items:center;gap:.5rem; }
  .modal-qty-controls button { width:32px;height:32px;border-radius:6px;border:1.5px solid var(--lm-border);
    background:transparent;display:flex;align-items:center;justify-content:center;
    cursor:pointer;transition:all .15s;color:var(--lm-text); }
  .modal-qty-controls button:hover { border-color:var(--lm-primary); background:var(--lm-primary-soft); }
  .modal-qty-controls span { font-size:1rem;font-weight:600;min-width:24px;text-align:center; }

  .modal-description { display:flex;flex-direction:column;gap:.25rem; }
  .modal-description p { font-size:.82rem;color:var(--lm-muted);line-height:1.6;font-weight:400; }

  .modal-trust { display:flex; align-items:center; gap:.5rem; flex-wrap:wrap;
    background:var(--lm-surface-2); border-radius:6px; padding:.5rem .65rem; }
  .modal-trust-wa { font-size:.7rem; color:var(--lm-muted); display:inline-flex; align-items:center; gap:.35rem; font-weight:450; }

  .modal-actions { display:flex;flex-direction:column;gap:.5rem;margin-top:auto;padding-top:.5rem; }
  .modal-cart-btn { width:100%;padding:.7rem;border:none;border-radius:6px;font-size:.85rem;
    font-weight:600;background:var(--lm-primary);color:white;cursor:pointer;transition:all .2s;font-family:inherit; }
  .modal-cart-btn:hover { opacity:.9; }
  .modal-cart-btn:active { transform:scale(.97); }
  .modal-cart-btn-added { background:var(--lm-success);color:white; }
  .modal-wa-btn { display:flex;align-items:center;justify-content:center;gap:.5rem;
    width:100%;padding:.7rem;border-radius:6px;font-size:.85rem;font-weight:600;
    background:var(--lm-wa);color:white;border:none;cursor:pointer;transition:all .2s;
    text-decoration:none;font-family:inherit; }
  .modal-wa-btn:hover { opacity:.9; }
  .modal-wa-btn:active { transform:scale(.97); }

  .modal-related-wrap { grid-row:2; grid-column:1/-1; padding:0 1.5rem 1rem; overflow:hidden; }
  .modal-related { border-top:1px solid var(--lm-border);padding-top:.75rem; }
  .modal-related-title { font-family:var(--font-display);font-size:.82rem;color:var(--lm-text);margin-bottom:.65rem; font-weight:500; }
  .modal-related-grid { display:grid;grid-template-columns:repeat(2,1fr);gap:.5rem; }
  .modal-related-card { display:flex;gap:.5rem;padding:.5rem;border-radius:6px;border:1px solid var(--lm-border);
    background:var(--lm-surface);cursor:pointer;transition:all .2s;text-align:left;font-family:inherit;
    text-decoration:none;color:inherit;width:100%; }
  .modal-related-card:hover { border-color:var(--lm-primary); box-shadow:0 2px 8px var(--lm-focus-ring); }
  .modal-related-img-wrap { width:44px;height:56px;border-radius:4px;overflow:hidden;flex-shrink:0;background:var(--lm-surface-2); }
  .modal-related-img { width:100%;height:100%;object-fit:cover; }
  .modal-related-no-img { width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--lm-muted); }
  .modal-related-body { flex:1;min-width:0;display:flex;flex-direction:column;gap:.15rem;justify-content:center; }
  .modal-related-name { font-size:.7rem;font-weight:500;color:var(--lm-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
  .modal-related-price { font-size:.72rem;font-weight:600;color:var(--lm-primary); }

  /* ── CART DRAWER ──────────────────────────────────────── */
  .cart-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:500;
    opacity:0;visibility:hidden;transition:all .3s; }
  .cart-overlay-open { opacity:1;visibility:visible; }
  .cart-drawer { position:fixed;top:0;right:0;bottom:0;width:400px;max-width:90vw;
    background:var(--lm-surface);z-index:501;display:flex;flex-direction:column;
    transform:translateX(100%);transition:transform .35s cubic-bezier(.4,0,.2,1);
    box-shadow:-4px 0 24px rgba(0,0,0,.1); }
  .cart-drawer-open { transform:translateX(0); }
  .cart-header { display:flex;align-items:center;justify-content:space-between;
    padding:1rem 1.25rem;border-bottom:1px solid var(--lm-border);flex-shrink:0; }
  .cart-title { font-size:1rem; font-weight:600; color:var(--lm-text); }
  .cart-close { width:30px;height:30px;border-radius:6px;border:none;background:var(--lm-surface-2);
    display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--lm-muted);transition:all .2s; }
  .cart-close:hover { background:var(--lm-border);color:var(--lm-text); }

  .cart-empty { flex:1;display:flex;flex-direction:column;align-items:center;
    justify-content:center;gap:.5rem;padding:2rem;text-align:center; }
  .cart-empty-icon { opacity:.3; color:var(--lm-muted); }
  .cart-empty p { font-size:.95rem;color:var(--lm-text);font-weight:500; }
  .cart-empty-sub { font-size:.82rem!important;color:var(--lm-muted)!important;font-weight:400!important; }

  .cart-items { flex:1;overflow-y:auto;padding:.65rem 1.25rem;display:flex;flex-direction:column;gap:.5rem; }
  .cart-item { display:flex;gap:.65rem;padding:.65rem;border-radius:8px;
    background:var(--lm-surface-2); animation:fadeInUp .25s ease both; }
  .cart-item:nth-child(1) { animation-delay:0s; }
  .cart-item:nth-child(2) { animation-delay:.04s; }
  .cart-item:nth-child(3) { animation-delay:.08s; }
  .cart-item-img-wrap { width:56px;height:70px;flex-shrink:0;border-radius:6px;overflow:hidden;
    background:var(--lm-surface-2); }
  .cart-item-img { width:100%;height:100%;object-fit:cover; }
  .cart-item-no-img { width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.2rem;opacity:.4; }
  .cart-item-info { flex:1;min-width:0;display:flex;flex-direction:column;gap:.15rem; }
  .cart-item-name { font-size:.85rem;font-weight:600;color:var(--lm-text); }
  .cart-item-meta { font-size:.72rem;color:var(--lm-muted); }
  .cart-item-price { font-size:.82rem;font-weight:600;color:var(--lm-text);margin-top:.1rem; }
  .cart-item-controls { display:flex;align-items:center;gap:.3rem;margin-top:.2rem; }
  .cart-item-controls button { width:24px;height:24px;border-radius:4px;border:1px solid var(--lm-border);
    background:var(--lm-surface);display:flex;align-items:center;justify-content:center;cursor:pointer;
    color:var(--lm-text);transition:all .15s; }
  .cart-item-controls button:hover { border-color:var(--lm-primary); background:var(--lm-primary-soft); }
  .cart-item-qty { font-size:.8rem;font-weight:600;min-width:20px;text-align:center; }
  .cart-item-remove { margin-left:auto!important;border-color:#FECACA!important;color:var(--lm-danger)!important; }
  .cart-item-remove:hover { background:var(--lm-danger)!important;color:white!important; }

  .cart-footer { padding:.75rem 1.25rem 1.25rem;border-top:1px solid var(--lm-border);flex-shrink:0;
    display:flex;flex-direction:column;gap:.5rem; }
  .cart-total { display:flex;justify-content:space-between;align-items:center; }
  .cart-total span:first-child { font-size:.9rem;font-weight:500;color:var(--lm-text); }
  .cart-total-price { font-size:1.2rem;font-weight:700;color:var(--lm-text); }
  .cart-checkout-btn { display:flex;align-items:center;justify-content:center;gap:.5rem;
    padding:.75rem;border-radius:6px;border:none;font-size:.85rem;font-weight:600;
    background:var(--lm-wa);color:white;cursor:pointer;transition:all .2s;text-decoration:none;font-family:inherit; }
  .cart-checkout-btn:hover { opacity:.9; }
  .cart-checkout-btn:active { transform:scale(.97); }
  .cart-clear-btn { background:none;border:none;font-size:.75rem;color:var(--lm-muted);
    cursor:pointer;padding:.25rem;transition:color .2s;font-family:inherit; }
  .cart-clear-btn:hover { color:var(--lm-danger); }
  .cart-success { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.65rem; padding:2rem 1.5rem; text-align:center; }
  .cart-success-icon { color:var(--lm-success); }
  .cart-success h3 { font-family:var(--font-display); font-size:1.2rem; color:var(--lm-text); }
  .cart-success p { font-size:.85rem; color:var(--lm-muted); }
  .cart-success-sub { font-size:.78rem!important; color:var(--lm-muted)!important; opacity:.6; }
  .cart-success-btn { padding:.65rem 1.5rem; border:none; border-radius:6px; background:var(--lm-secondary); color:white; font-size:.85rem; font-weight:600; cursor:pointer; font-family:inherit; transition:all .2s; }
  .cart-success-btn:hover { opacity:.9; }

  /* ── CHECKOUT FORM ────────────────────────────────────── */
  .cart-checkout-form { padding:.65rem 1.25rem 0; display:flex; flex-direction:column; gap:.5rem; overflow-y:auto; }
  .cart-checkout-field { display:flex; flex-direction:column; gap:.2rem; }
  .cart-checkout-field label { font-size:.65rem; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:var(--lm-muted); }
  .cart-checkout-field input { border:1.5px solid var(--lm-border); border-radius:6px; padding:.55rem .75rem; font-size:.85rem; font-family:inherit; outline:none; background:var(--lm-surface); color:var(--lm-text); transition:border-color .2s; }
  .cart-checkout-field input:focus { border-color:var(--lm-primary); box-shadow:0 0 0 3px var(--lm-focus-ring); }

  /* ── BOTTOM NAV ───────────────────────────────────────── */
  .bottom-nav { position:fixed;bottom:0;left:0;right:0;height:56px;background:var(--lm-surface);
    display:none;align-items:center;justify-content:space-around;z-index:300;
    border-top:1px solid var(--lm-border);padding-bottom:env(safe-area-inset-bottom);
    box-shadow:0 -1px 8px rgba(0,0,0,0.04); }
  .bottom-nav-btn { display:flex;flex-direction:column;align-items:center;gap:1px;
    background:none;border:none;color:var(--lm-muted);font-size:.6rem;font-weight:500;
    cursor:pointer;padding:.25rem .5rem;transition:color .2s;font-family:inherit;text-decoration:none; }
  .bottom-nav-btn:active { opacity:.7; }
  .bottom-nav-btn-active { color:var(--lm-primary); }
  .bottom-nav-cart-wrap { position:relative; }
  .bottom-nav-badge { position:absolute;top:-4px;right:-6px;min-width:16px;height:16px;
    border-radius:8px;background:var(--lm-primary);color:white;font-size:.55rem;font-weight:700;
    display:flex;align-items:center;justify-content:center;line-height:1;padding:0 4px; }

    .bottom-cat-panel { position:fixed;bottom:56px;left:0;right:0;background:var(--lm-surface);
      z-index:299;padding:.65rem;display:flex;gap:.4rem;border-radius:16px 16px 0 0;
      box-shadow:0 -4px 24px rgba(0,0,0,.08);animation:slideUp .2s ease-out; }
    .bottom-cat-btn { flex:1;padding:.5rem;border-radius:999px;border:1.5px solid var(--lm-border);
      background:var(--lm-surface);font-size:.78rem;font-weight:500;color:var(--lm-text);cursor:pointer;
      transition:all .15s;font-family:inherit;text-align:center; }
    .bottom-cat-btn:active { background:var(--lm-primary);border-color:var(--lm-primary);color:white; }

  /* ── FLOATING WHATSAPP ────────────────────────────────── */
  .floating-wa { position:fixed;bottom:72px;right:12px;width:42px;height:42px;
    border-radius:50%;background:var(--lm-wa);color:white;display:none;align-items:center;
    justify-content:center;z-index:200;box-shadow:0 2px 12px rgba(37,211,102,.3);
    transition:all .2s; }
  .floating-wa:hover { transform:scale(1.06); }

  /* ── SKELETON ─────────────────────────────────────────── */
  .skeleton-card { background:var(--lm-surface);border-radius:8px;overflow:hidden; }
  .skeleton-img { aspect-ratio:3/4;background:linear-gradient(90deg,var(--lm-surface-2) 25%,#F8F9FB 50%,var(--lm-surface-2) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite; }
  .skeleton-body { padding:.85rem;display:flex;flex-direction:column;gap:.4rem; }
  .skeleton-line { height:10px;border-radius:4px;background:linear-gradient(90deg,var(--lm-surface-2) 25%,#F8F9FB 50%,var(--lm-surface-2) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite; }
  .skeleton-line.short { width:60%; }
  .skeleton-cat { width:40%;height:9px; }
  .skeleton-name { height:12px; }
  .skeleton-price { width:30%; }
  .skeleton-footer { display:flex;justify-content:space-between;align-items:center;margin-top:.4rem;padding-top:.4rem;border-top:1px solid var(--lm-border); }
  .skeleton-btn { width:28px;height:28px;border-radius:6px;background:linear-gradient(90deg,var(--lm-surface-2) 25%,#F8F9FB 50%,var(--lm-surface-2) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite; }

  /* ── BANNER SLIDER ────────────────────────────────────── */
  .banner-slider { position:relative; overflow:hidden; border-radius:6px; margin:0 1.25rem; }
  .banner-slide { padding:.65rem 2rem; text-align:center; position:relative; }
  .banner-content { max-width:900px; margin:0 auto; display:flex;flex-direction:column;align-items:center;gap:.3rem; }
  .banner-subtitle { font-size:.55rem;letter-spacing:.15em;text-transform:uppercase;opacity:.7;font-weight:500;color:white; }
  .banner-text { font-size:.82rem;font-weight:500;color:white; }
  .banner-cta { display:inline-block;font-size:.7rem;font-weight:600;padding:.2rem .85rem;border-radius:6px;background:white;color:var(--lm-secondary);text-decoration:none;transition:all .2s; }
  .banner-cta:hover { opacity:.85; }
  .banner-nav { position:absolute;top:50%;transform:translateY(-50%);width:24px;height:24px;border-radius:50%;background:rgba(255,255,255,.25);border:none;color:white;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;z-index:2; }
  .banner-nav:hover { background:rgba(255,255,255,.4); }
  .banner-nav-prev { left:4px; }
  .banner-nav-next { right:4px; }
  .banner-dots { position:absolute;bottom:4px;left:50%;transform:translateX(-50%);display:flex;gap:4px;z-index:2; }
  .banner-dot { width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.4);cursor:pointer;transition:all .2s; }
  .banner-dot-active { background:white;width:12px;border-radius:2px; }

  /* ── POPUP ────────────────────────────────────────────── */
  .popup-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);z-index:600;display:flex;align-items:center;justify-content:center;padding:1.5rem;animation:fadeIn .3s ease; }
  .popup-card { background:var(--lm-surface);border-radius:12px;padding:1.75rem 1.5rem;max-width:340px;width:100%;text-align:center;position:relative;animation:scaleIn .35s ease; }
  .popup-close { position:absolute;top:10px;right:10px;width:30px;height:30px;border-radius:6px;border:none;background:var(--lm-surface-2);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--lm-muted);transition:all .2s; }
  .popup-close:hover { background:var(--lm-border);color:var(--lm-text); }
  .popup-icon-wrap { width:48px;height:48px;border-radius:50%;background:var(--lm-primary-soft);display:flex;align-items:center;justify-content:center;margin:0 auto .85rem;color:var(--lm-primary); }
  .popup-title { font-family:var(--font-display);font-size:1.15rem;color:var(--lm-text);margin-bottom:.3rem;font-weight:600; }
  .popup-subtitle { font-size:.8rem;color:var(--lm-muted);margin-bottom:1rem; }
  .popup-actions { display:flex;flex-direction:column;gap:.4rem; }
  .popup-btn { padding:.65rem;border:none;border-radius:6px;background:var(--lm-secondary);color:white;font-size:.82rem;font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s; }
  .popup-btn:hover { opacity:.85; }
  .popup-wa { display:inline-flex;align-items:center;justify-content:center;gap:.35rem;padding:.55rem;border-radius:6px;background:var(--lm-wa);color:white;font-size:.78rem;font-weight:600;text-decoration:none;transition:all .2s;font-family:inherit; }
  .popup-wa:hover { opacity:.9; }

  /* ── WISHLIST ─────────────────────────────────────────── */
  .wishlist-btn { position:absolute;top:8px;right:8px;z-index:3;width:30px;height:30px;border-radius:6px;background:rgba(255,255,255,.9);border:1px solid var(--lm-border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--lm-muted);transition:all .2s; }
  .wishlist-btn:hover { background:white; }
  .wishlist-btn-active { color:var(--lm-danger); border-color:var(--lm-danger); background:#FEF2F2; }
  .wishlist-count { font-size:.62rem;color:var(--lm-muted); }

  /* ── SHARE STORE ──────────────────────────────────────── */
  .share-store-btn { display:inline-flex;align-items:center;gap:.35rem;padding:.4rem .85rem;border-radius:6px;border:1.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.06);color:white;font-size:.75rem;font-weight:500;cursor:pointer;transition:all .2s;font-family:inherit; }
  .share-store-btn:hover { background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.35); }

  /* ── SOCIAL FOLLOW ────────────────────────────────────── */
  .social-follow { padding:0 1.25rem 1.5rem; }
  .social-follow-inner { max-width:1200px;margin:0 auto;padding:1.25rem;border-radius:8px;background:var(--lm-secondary);text-align:center; }
  .social-follow-title { font-family:var(--font-display);font-size:1rem;color:white;margin-bottom:.75rem;font-weight:500; }
  .social-follow-links { display:flex;gap:.65rem;justify-content:center;flex-wrap:wrap; }
  .social-follow-link { display:inline-flex;align-items:center;gap:.4rem;padding:.5rem 1rem;border-radius:6px;background:rgba(255,255,255,.06);color:white;text-decoration:none;font-size:.78rem;font-weight:500;transition:all .2s;border:1px solid rgba(255,255,255,.1); }
  .social-follow-link:hover { background:rgba(255,255,255,.1);border-color:var(--hover-color);color:var(--hover-color); }

  /* ── RECENT VIEWS ─────────────────────────────────────── */
  .recent-views { padding:0 1.25rem 1.25rem; }
  .recent-views-inner { max-width:1200px;margin:0 auto; }
  .recent-views-scroll { display:flex;gap:.5rem;overflow-x:auto;padding-bottom:.35rem;scrollbar-width:none; }
  .recent-views-scroll::-webkit-scrollbar { display:none; }
  .recent-view-card { flex-shrink:0;width:120px;text-decoration:none;color:inherit; }
  .recent-view-img { width:120px;height:150px;border-radius:6px;overflow:hidden;background:var(--lm-surface-2);margin-bottom:.3rem; }
  .recent-view-img img { width:100%;height:100%;object-fit:cover; }
  .recent-view-name { font-size:.7rem;font-weight:500;color:var(--lm-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
  .recent-view-price { font-size:.72rem;font-weight:600;color:var(--lm-primary); }

  /* ── CTA TRUST TEXT ────────────────────────────────────── */
  .cta-trust { display:flex;align-items:center;justify-content:center;gap:.5rem;background:var(--lm-surface-2);border-radius:6px;padding:.5rem .65rem;font-size:.75rem;color:var(--lm-muted);font-weight:450;margin-top:.5rem; }
  .cta-trust svg { flex-shrink:0; }

  /* ── STORE PAGE LAYOUT ────────────────────────────────── */
  .store-page { padding-bottom:60px; padding-top:0; }

  /* ── FILTERS ──────────────────────────────────────────── */
  .lm-filters { padding:.75rem 1.25rem 0; display:flex; flex-wrap:wrap; gap:.4rem;
    align-items:center; max-width:1200px; margin:0 auto; }
  .lm-filter-label { font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;
    color:var(--lm-muted);font-weight:500; }

  /* ── GRID ─────────────────────────────────────────────── */
  .lm-grid-section { padding:1.25rem 1.25rem 5rem; max-width:1200px; margin:0 auto; }
  .lm-product-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; }
  @media (max-width: 1024px) { .lm-product-grid { grid-template-columns:repeat(3,1fr); } }

  /* ── MOBILE 768 ───────────────────────────────────────── */
  @media (max-width: 768px) {
    .product-card:hover { transform:none; }
    .product-card:hover .card-image img { transform:none; }
    .card-image-overlay { display:none !important; }

    .lm-hamburger { display:flex !important; }
    .lm-filters { padding:.35rem .65rem !important; gap:.2rem !important; overflow-x:auto !important;
      flex-wrap:nowrap !important; scrollbar-width:none; -ms-overflow-style:none; }
    .lm-filters::-webkit-scrollbar { display:none; }
    .lm-filter-label { display:none; }
    .lm-product-grid { grid-template-columns:repeat(2,1fr) !important; gap:.4rem !important; }
    .lm-grid-section { padding:.65rem .5rem 4.5rem !important; }

    .cat-grid { gap:.3rem; flex-wrap:nowrap; overflow-x:auto; padding-bottom:.15rem;
      grid-template-columns:none; display:flex; }
    .cat-grid::-webkit-scrollbar { display:none; }
    .cat-card { padding:.45rem .6rem; flex-shrink:0; white-space:nowrap; }
    .cat-icon { width:20px;height:20px; }

    .product-modal { grid-template-columns:1fr !important; grid-template-rows:auto auto auto !important;
      max-height:100dvh; border-radius:0; width:100vw !important; max-width:100vw !important; }
    .modal-gallery { grid-row:1 !important; grid-column:1 !important; }
    .modal-gallery-main { min-height:0; border-radius:0; }
    .modal-gallery-main img { max-height:40vh; }
    .modal-thumb { width:36px;height:36px; }
    .modal-info { grid-row:2 !important; grid-column:1 !important; padding:.5rem .65rem .25rem !important; overflow-y:visible; }
    .modal-info-content { gap:.3rem !important; }
    .modal-category { font-size:.6rem !important; }
    .modal-name { font-size:1rem !important; }
    .modal-price { font-size:1.1rem !important; }
    .modal-old-price { font-size:.8rem !important; }
    .modal-variant { gap:.3rem !important; }
    .modal-variant-label { font-size:.62rem !important; }
    .modal-size-btn { min-width:32px;height:30px;font-size:.72rem;padding:0 .45rem; }
    .modal-color-btn { padding:.2rem .6rem;font-size:.72rem; }
    .modal-qty-controls button { width:28px;height:28px; }
    .modal-qty-controls span { font-size:.95rem; }
    .modal-description p { font-size:.78rem !important; }
    .modal-trust { padding:.3rem .45rem !important; gap:.2rem !important; flex-wrap:nowrap !important; }
    .modal-actions { position:sticky; bottom:0; background:var(--lm-surface); z-index:2;
      padding:.5rem .65rem .75rem; margin-top:0;
      box-shadow:0 -2px 12px rgba(0,0,0,.06); }
    .modal-related-wrap { grid-row:3 !important; grid-column:1 !important; padding:0 .65rem .65rem; }
    .modal-related-grid { display:flex !important; overflow-x:auto !important; gap:.3rem !important; padding-bottom:.2rem; }
    .modal-related-grid::-webkit-scrollbar { display:none; }
    .modal-related-card { flex-shrink:0; width:150px; flex-direction:column; }
    .modal-related-img-wrap { width:100%; height:68px; }
    .modal-overlay { padding:0; align-items:flex-end; }
    .modal-cart-btn, .modal-wa-btn { padding:.55rem; font-size:.8rem; min-height:42px; }
    .modal-drag-handle { display:block; }
    .modal-share { top:8px; right:8px !important; }
    .modal-close { display:none; }

    .bottom-nav { display:flex !important; }
    .floating-wa { display:flex !important; bottom:64px; width:38px;height:38px; right:8px; }
    .floating-wa svg { width:18px;height:18px; }
    .store-page { padding-bottom:60px; }

    .hero-layout { grid-template-columns:1fr !important; }
    .hero-col-text { padding:.85rem 1rem .65rem; order:2; }
    .hero-col-image { order:1; min-height:160px; max-height:32vh; }
    .hero-content-inner { text-align:center; max-width:none; }
    .hero-title { font-size:clamp(1.15rem,5vw,1.45rem); padding-bottom:.3rem; text-align:center; }
    .hero-subtitle { padding-bottom:.65rem; font-size:.78rem; text-align:center; }
    .hero-actions { flex-direction:column; align-items:stretch; padding-bottom:.5rem; gap:.35rem; }
    .hero-btn { padding:.5rem 1rem; font-size:.75rem; justify-content:center; }
    .hero-btn-secondary { justify-content:center; }
    .hero-trust-badges { justify-content:center; gap:.3rem; margin-bottom:.5rem; }
    .hero-trust-badge { font-size:.6rem; padding:.2rem .45rem; }
    .hero-share { text-align:center; }

    .promo-banner { font-size:.7rem; padding:.3rem .65rem; }
    .banner-slider { margin:.3rem .65rem 0; }

    .product-card { min-height:0; }
    .card-image { height:auto; aspect-ratio:3/4; }
    .card-badge { font-size:.5rem; padding:.1rem .3rem; top:4px; left:4px; }
    .card-discount-badge { font-size:.5rem; padding:.1rem .3rem; top:4px; right:4px; }
    .card-body { padding:.35rem .4rem .5rem; gap:.1rem; }
    .card-category { font-size:.52rem; }
    .card-name { font-size:.7rem; }
    .card-desc { font-size:.65rem; }
    .card-footer { padding-top:.35rem; }
    .card-price-current { font-size:.82rem; }
    .card-price-old { font-size:.6rem; }
    .btn-whatsapp { width:26px;height:26px; }
    .wishlist-btn { width:24px;height:24px; top:4px; right:4px; }
    .wishlist-btn svg { width:11px;height:11px; }

    .lm-search-bar { padding:.5rem .5rem 0 !important; }
    .lm-search-inner { padding:.25rem .6rem !important; border-radius:6px !important; }
    .lm-search-input { font-size:.78rem !important; }

    .share-store-wrap { padding:.3rem .75rem 0; }
    .social-follow { padding:.3rem .75rem; }
    .social-follow-inner { padding:.85rem; }
    .recent-views { padding:.3rem .5rem; }
    .recent-view-card { min-width:65px; }
    .recent-view-img { width:65px;height:85px; }
  }

  @media (max-width: 400px) {
    .lm-product-grid { grid-template-columns:repeat(2,1fr) !important; gap:.3rem !important; }
    .lm-grid-section { padding:.45rem .3rem 4.5rem !important; }
    .cat-grid { gap:.2rem; }
    .cat-card { padding:.35rem .45rem; font-size:.7rem; }

    .lm-search-bar { padding:.3rem .3rem 0 !important; }
    .lm-search-inner { padding:.2rem .45rem !important; border-radius:4px !important; }
    .lm-search-input { font-size:.72rem !important; }
    .card-body { padding:.2rem .25rem .35rem; }
    .card-name { font-size:.65rem; }
    .card-price-current { font-size:.78rem; }
    .btn-whatsapp { width:24px;height:24px; }
    .wishlist-btn { width:22px;height:22px; }
    .wishlist-btn svg { width:10px;height:10px; }
  }

  /* ── ADMIN RESPONSIVE ─────────────────────────────────── */
  @media (max-width: 768px) {
    aside { display:none !important; }
    .lm-admin-main { padding:0.5rem !important; }
    .lm-mobile-header { display:flex !important; }
    .lm-mobile-cards  { display:flex !important; }
    .lm-table-wrap table { display:none; }
    .lm-admin-mobile-product-list { display:flex !important; }
    .lm-config-row { flex-direction:column !important; }
    .lm-config-row input, .lm-config-row select { min-width:100% !important; width:100% !important; }
    .admin-content h2 { font-size:1rem; }
    .admin-content select, .admin-content input, .admin-content textarea { font-size:16px !important; min-height:44px; }
    .admin-content button { min-height:44px; }

    .config-save-bar { position:sticky !important; bottom:0 !important; padding:0.75rem !important; background:var(--lm-bg) !important; z-index:50 !important; margin:0 -0.5rem !important; }
    .config-save-bar button { width:100% !important; justify-content:center !important; min-height:44px !important; }

    .lm-admin-modal-ov { padding:0 !important; align-items:flex-end !important; }
    .lm-admin-modal-cont { max-width:100vw !important; width:100vw !important; border-radius:16px 16px 0 0 !important;
      max-height:95dvh !important; }
    .lm-admin-modal-body .lm-admin-modal-row-inner { display:flex !important; flex-direction:column !important; gap:0.75rem !important; }
    .lm-prod-step-indicator { justify-content:center !important; gap:.3rem !important; padding:.5rem .75rem .4rem !important; }
    .lm-prod-step-indicator button { padding:.3rem .65rem !important; font-size:.7rem !important;
      min-height:36px; border-radius:999px !important; }
    .lm-admin-modal-tabs { gap:.35rem !important; padding:.75rem .75rem .5rem !important;
      justify-content:center !important; overflow-x:visible !important; flex-wrap:wrap !important; }
    .lm-admin-modal-tabs button { padding:.35rem .75rem !important; font-size:.72rem !important;
      min-height:36px; border-radius:999px !important;
      border:1.5px solid var(--lm-border) !important; background:transparent !important; color:var(--lm-muted) !important; }
    .lm-admin-modal-tabs button[style*="#111827"] { background:var(--lm-secondary) !important; color:white !important; border-color:var(--lm-secondary) !important; }
    .lm-admin-modal-body { padding:.85rem 1rem !important; overflow-x:hidden !important; }
    .lm-admin-modal-body .lm-prod-modal-row { grid-template-columns:1fr !important; }
    .lm-admin-modal-footer { padding:.6rem 1rem 1rem !important; gap:.5rem !important; }
    .lm-admin-modal-footer button { flex:1; justify-content:center; min-height:44px; font-size:.85rem; }
  }

  /* ── KEYBOARD / SAFE AREA ────────────────────────────── */
  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    .bottom-nav, .lm-admin-main { padding-bottom: env(safe-area-inset-bottom) !important; }
    .modal-actions { padding-bottom: calc(.75rem + env(safe-area-inset-bottom)) !important; }
    .lm-admin-modal-footer { padding-bottom: calc(1rem + env(safe-area-inset-bottom)) !important; }
  }
  .keyboard-open .modal-actions,
  .keyboard-open .lm-admin-modal-footer { padding-bottom: 8px !important; }
  .keyboard-open .bottom-nav { display: none !important; }
  .keyboard-open .floating-wa { bottom: 16px !important; }
  html { --vh: 1vh; }
  .vh-fix { height: calc(var(--vh, 1vh) * 100); }
`;
document.head.appendChild(style);

const link = document.createElement('link');
link.rel  = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap';
document.head.appendChild(link);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
);

// ── Service Worker (PWA) ─────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then((reg) => {
      console.log('SW registrado:', reg.scope);
    }).catch((err) => {
      console.log('SW registro fallo:', err);
    });
  });
}
