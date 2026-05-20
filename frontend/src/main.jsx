// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const style = document.createElement('style');
style.textContent = `
  /* ── RESET & BASE ─────────────────────────────────────── */
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior: smooth; -webkit-tap-highlight-color: transparent; }
  body { font-family: 'DM Sans', 'Segoe UI', sans-serif; background:#FAF7F2; color:#1A1612; overflow-x:hidden; }
  a { text-decoration:none; color:inherit; }
  button { cursor:pointer; font-family:inherit; }
  img { max-width:100%; display:block; }
  img.img-error { display:none; }
  .img-error-fallback { display:flex; align-items:center; justify-content:center; height:100%; color:#8A7968; opacity:.4; }
  @media (max-width:768px) { button { min-height:44px; } .bottom-nav-btn { min-height:auto; } }

  /* ── PRODUCT CARD ─────────────────────────────────────── */
  .product-card { background:white; border-radius:12px; overflow:hidden;
    box-shadow:0 2px 16px rgba(26,22,18,0.06); transition:transform .3s,box-shadow .3s;
    cursor:pointer; display:flex; flex-direction:column; position:relative; }
  .product-card:hover { transform:translateY(-3px); box-shadow:0 8px 32px rgba(26,22,18,0.12); }
  .card-image { position:relative; aspect-ratio:3/4; overflow:hidden; background:#F0EBE3; }
  .card-image-skeleton { position:absolute; inset:0; background:linear-gradient(90deg,#F0EBE3 25%,#F8F4EE 50%,#F0EBE3 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; }
  .card-image img { width:100%; height:100%; object-fit:cover; transition:transform .6s cubic-bezier(.25,.46,.45,.94); }
  .product-card:hover .card-image img { transform:scale(1.08); }
  .img-placeholder { width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
    justify-content:center;gap:.5rem;background:linear-gradient(135deg,#F0EBE3,#E8D5B0);color:#8A7968;font-size:.8rem; }
  .card-badge { position:absolute;top:10px;left:10px;font-size:.65rem;font-weight:700;
    letter-spacing:.1em;text-transform:uppercase;padding:.22rem .6rem;border-radius:4px;z-index:2; }
  .card-badge.new  { background:#C9A96E; color:#1A1612; }
  .card-badge.sale { background:#C25E5E; color:white; }
  .card-badge.hot  { background:#1A1612; color:#C9A96E; }
  .card-badge.last  { background:#C25E5E; color:white; }
  .card-badge.featured { background:#1A1612; color:#C9A96E; }
  .card-discount-badge { position:absolute;top:10px;right:10px;font-size:.62rem;font-weight:700;
    background:#C25E5E;color:white;padding:.2rem .5rem;border-radius:4px;z-index:2; }
  .card-image-overlay { position:absolute;bottom:0;left:0;right:0;padding:.75rem;
    background:linear-gradient(transparent,rgba(0,0,0,.5));opacity:0;transform:translateY(8px);
    transition:all .3s;z-index:2; }
  .product-card:hover .card-image-overlay { opacity:1;transform:translateY(0); }
  .card-add-btn { width:100%;padding:.6rem;border:none;border-radius:8px;font-size:.8rem;
    font-weight:600;background:#C9A96E;color:#1A1612;cursor:pointer;transition:all .25s; }
  .card-add-btn:hover { background:#b8944f; }
  .card-add-btn-added { background:#2E7D52;color:white; }
  .card-body { padding:.9rem 1rem 1rem; display:flex; flex-direction:column; gap:.35rem; flex:1; }
  .card-category { font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:#C9A96E;font-weight:600; }
  .card-name { font-family:'Playfair Display', serif; font-size:1rem; line-height:1.3; color:#1A1612; font-weight:500; }
  .card-desc { font-size:.78rem; color:#8A7968; line-height:1.4; display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
  .card-footer { display:flex;align-items:center;justify-content:space-between;margin-top:auto;
    padding-top:.65rem;border-top:1px solid #F0EAE0; }
  .card-pricing { display:flex; align-items:baseline; gap:.35rem; }
  .card-price-current { font-size:1.05rem; font-weight:700; color:#1A1612; }
  .card-price-old { font-size:.78rem;color:#8A7968;text-decoration:line-through; }
  .btn-whatsapp { display:inline-flex;align-items:center;justify-content:center;gap:.4rem;
    background:#25D366;color:white;border:none;width:36px;height:36px;border-radius:50%;
    transition:all .25s;flex-shrink:0; }
  .btn-whatsapp:hover { background:#1ebe5d;transform:scale(1.08); }
  .stock-badge { font-size:.68rem; font-weight:600; padding:.15rem .6rem; border-radius:4px; display:inline-block; width:fit-content; margin-top:.35rem; }
  .stock-ok { background:#E8F5E9; color:#2E7D52; }
  .stock-low { background:#FFF5E0; color:#B8941E; }
  .stock-consult { background:#F5F1EB; color:#8A7968; }

  /* ── HERO SECTION ─────────────────────────────────────── */
  .hero-section { position:relative; min-height:85vh; display:flex; align-items:center;
    justify-content:center; overflow:hidden; background:#1A1612; }
  .hero-section--with-banner { background-size:cover; background-position:center;
    background-repeat:no-repeat; }
  .hero-bg { position:absolute; inset:0;
    background:radial-gradient(ellipse at 30% 50%, rgba(201,169,110,.15) 0%, transparent 60%),
               radial-gradient(ellipse at 70% 80%, rgba(201,169,110,.08) 0%, transparent 50%),
               linear-gradient(180deg, #1A1612 0%, #231F1A 100%); }
  .hero-overlay { position:absolute; inset:0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A96E' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
  .hero-overlay-banner { position:absolute; inset:0; z-index:1;
    background:linear-gradient(180deg, rgba(26,22,18,.75) 0%, rgba(26,22,18,.45) 50%, rgba(26,22,18,.85) 100%); }
  .hero-content { position:relative; z-index:2; text-align:center; padding:3rem 2rem; max-width:680px;
    animation:heroFadeIn 1s ease-out; }
  @keyframes heroFadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  .hero-logo-wrap { margin-bottom:1.5rem; display:flex; justify-content:center; }
  .hero-logo { max-height:80px; width:auto; object-fit:contain; }
  .hero-title { font-family:'Playfair Display', serif; font-size:clamp(2.2rem,7vw,4.5rem);
    color:#FAF7F2; line-height:1.08; padding-bottom:1rem; font-weight:700; }
  .hero-gold { color:#C9A96E; }
  .hero-subtitle { color:#B0A899; font-size:clamp(.95rem,2vw,1.15rem); font-weight:300;
    padding-bottom:2rem; letter-spacing:.02em; }
  .hero-actions { display:flex; gap:.75rem; justify-content:center; flex-wrap:wrap; padding-bottom:2rem; }
  .hero-btn { display:inline-flex;align-items:center;gap:.5rem; padding:.85rem 2rem;
    border-radius:999px; font-size:.9rem; font-weight:600; transition:all .3s ease; border:none;
    cursor:pointer; letter-spacing:.02em; }
  .hero-btn-primary { background:#C9A96E; color:#1A1612; box-shadow:0 4px 20px rgba(201,169,110,.25); }
  .hero-btn-primary:hover { background:#b8944f; transform:translateY(-2px);
    box-shadow:0 6px 28px rgba(201,169,110,.35); }
  .hero-btn-secondary { background:rgba(255,255,255,.08); color:#FAF7F2; backdrop-filter:blur(6px);
    border:1px solid rgba(255,255,255,.15); }
  .hero-btn-secondary:hover { background:rgba(255,255,255,.16); transform:translateY(-2px); }
  .hero-social { display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; padding-bottom:.5rem; }
  .hero-social-link { display:inline-flex;align-items:center;justify-content:center;
    width:36px; height:36px; border-radius:50%; color:#8A7968; transition:all .3s ease;
    background:rgba(255,255,255,.04); }
  .hero-social-link:hover { color:#C9A96E; background:rgba(201,169,110,.1); transform:translateY(-1px); }

  /* ── CATEGORY SECTION ─────────────────────────────────── */
  .cat-section { padding:2rem 1.25rem 1rem; }
  .cat-inner { max-width:1200px; margin:0 auto; }
  .cat-heading { font-family:'Playfair Display', serif; font-size:1.15rem; color:#1A1612;
    margin-bottom:1rem; font-style:italic; }
  .cat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:.75rem; }
  .cat-card { display:flex;flex-direction:column;align-items:center;gap:.35rem;
    padding:1.25rem .75rem; border-radius:12px; border:1.5px solid #E8D5B0;
    background:white; cursor:pointer; transition:all .25s; font-family:inherit; }
  .cat-card:hover { border-color:#C9A96E; background:#FCFAF6; }
  .cat-card-active { border-color:#C9A96E; background:#C9A96E; }
  .cat-card-active .cat-label { color:#1A1612; }
  .cat-card-active .cat-desc { color:rgba(26,22,18,.6); }
  .cat-icon { width:28px; height:28px; color:#8A7968; }
  .cat-card-active .cat-icon { color:#1A1612; }
  .cat-label { font-size:.85rem; font-weight:600; color:#1A1612; }
  .cat-desc { font-size:.72rem; color:#8A7968; }

  /* ── PROMO BANNER ─────────────────────────────────────── */
  .promo-banner { padding:0 1.25rem; }
  .promo-inner { display:flex;align-items:center;justify-content:center;gap:.75rem;
    flex-wrap:wrap; padding:.75rem 1.25rem; border-radius:10px;
    background:linear-gradient(135deg,#1A1612,#2D2822); }
  .promo-badge { font-size:.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
    background:#C9A96E;color:#1A1612;padding:.2rem .65rem;border-radius:4px; }
  .promo-text { font-size:.82rem;color:#B0A899;font-weight:300; }

  /* ── MODAL OVERLAY ─────────────────────────────────────── */
  .modal-overlay { position:fixed; inset:0; background:rgba(26,22,18,0.8); backdrop-filter:blur(8px);
    z-index:400; display:flex; align-items:center; justify-content:center; padding:1rem;
    animation:fadeIn .2s ease-out; }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  .product-modal { background:white; border-radius:16px; width:100%; max-width:800px;
    max-height:92vh; overflow-y:auto; display:grid;
    grid-template-columns:1fr 1fr; grid-template-rows:auto auto; align-items:start;
    position:relative; animation:modalFadeIn .35s ease-out; }
  @keyframes modalFadeIn { 0% { opacity:0; transform:translateY(24px) scale(.97); } 100% { opacity:1; transform:translateY(0) scale(1); } }
  .modal-close { position:absolute; top:12px; right:12px; z-index:10; width:36px;height:36px;
    border-radius:50%; background:rgba(255,255,255,.9); border:none;
    display:flex;align-items:center;justify-content:center;cursor:pointer;
    box-shadow:0 2px 12px rgba(0,0,0,.12); transition:all .2s; color:#1A1612; }
  .modal-close:hover { background:white; transform:scale(1.05); }

  .modal-gallery { display:flex;flex-direction:column; grid-row:1; grid-column:1; background:#F5F1EB; }
  .modal-gallery-main { position:relative; display:flex; align-items:center; justify-content:center;
    overflow:hidden; background:#F0EBE3; touch-action:pan-y; }
  .modal-gallery-main img { width:100%;height:auto;max-height:min(70vh,650px);
    object-fit:contain; display:block; transition:opacity .25s ease; }
  .modal-no-img { display:flex;align-items:center;justify-content:center;min-height:280px;
    color:#8A7968; opacity:.4; }
  .modal-gallery-nav { position:absolute;top:50%;transform:translateY(-50%);width:34px;height:34px;
    border-radius:50%;background:rgba(255,255,255,.9);border:none;
    display:flex;align-items:center;justify-content:center;cursor:pointer;
    box-shadow:0 2px 10px rgba(0,0,0,.12);color:#1A1612;transition:all .2s;z-index:2; }
  .modal-gallery-nav:hover { background:white; transform:translateY(-50%) scale(1.08); }
  .modal-gallery-prev { left:12px; }
  .modal-gallery-next { right:12px; }
  .modal-thumbs { display:flex;gap:.6rem;padding:.75rem .75rem 1rem;overflow-x:auto;
    scrollbar-width:none; -ms-overflow-style:none; }
  .modal-thumbs::-webkit-scrollbar { display:none; }
  .modal-thumb { flex-shrink:0;width:64px;height:64px;border-radius:10px;overflow:hidden;
    border:2px solid transparent;cursor:pointer;padding:0;background:none;transition:all .2s; }
  .modal-thumb:hover { border-color:#D4C4A8; }
  .modal-thumb img { width:100%;height:100%;object-fit:cover; }
  .modal-thumb-active { border-color:#C9A96E; box-shadow:0 0 0 1px #C9A96E; }

  .modal-info { grid-row:1; grid-column:2; padding:1.5rem 1.75rem;
    display:flex;flex-direction:column;gap:.9rem; position:relative; }
  .modal-info-content { flex:1; display:flex; flex-direction:column; gap:.9rem; }
  .modal-category { font-size:.68rem;letter-spacing:.15em;text-transform:uppercase;
    color:#C9A96E;font-weight:600; }
  .modal-name { font-family:'Playfair Display',serif; font-size:1.6rem; line-height:1.2;
    color:#1A1612; font-weight:600; }
  .modal-badge { display:inline-block;font-size:.68rem;font-weight:700;letter-spacing:.1em;
    text-transform:uppercase;padding:.25rem .7rem;border-radius:4px;width:fit-content; }
  .modal-badge.new  { background:#C9A96E;color:#1A1612; }
  .modal-badge.sale { background:#C25E5E;color:white; }
  .modal-badge.hot  { background:#1A1612;color:#C9A96E; }
  .modal-badge.last  { background:#C25E5E; color:white; }
  .modal-badge.featured { background:#1A1612; color:#C9A96E; }
  .modal-pricing { display:flex;align-items:baseline;gap:.5rem;flex-wrap:wrap; }
  .modal-price { font-size:1.7rem;font-weight:700;color:#1A1612; }
  .modal-old-price { font-size:.95rem;color:#8A7968;text-decoration:line-through; }
  .modal-discount { font-size:.75rem;font-weight:700;color:white;background:#C25E5E;
    padding:.15rem .5rem;border-radius:4px; }

  .modal-variant { display:flex;flex-direction:column;gap:.5rem; }
  .modal-variant-label { font-size:.7rem;font-weight:600;letter-spacing:.08em;
    text-transform:uppercase;color:#8A7968; }
  .modal-size-grid { display:flex;flex-wrap:wrap;gap:.4rem; }
  .modal-size-btn { min-width:40px;height:36px;border-radius:8px;border:1.5px solid #E0D8CE;
    background:transparent;color:#1A1612;font-size:.82rem;font-weight:500;cursor:pointer;
    padding:0 .65rem;transition:all .2s;font-family:inherit; }
  .modal-size-btn:hover { border-color:#C9A96E; background:rgba(201,169,110,.06); }
  .modal-size-btn-active { background:#C9A96E;border-color:#C9A96E;color:#1A1612;font-weight:600; }
  .modal-size-btn-active:hover { background:#C9A96E;border-color:#C9A96E; }
  .modal-color-grid { display:flex;flex-wrap:wrap;gap:.4rem; }
  .modal-color-btn { padding:.35rem .85rem;border-radius:8px;border:1.5px solid #E0D8CE;
    background:transparent;color:#1A1612;font-size:.82rem;cursor:pointer;
    transition:all .2s;font-family:inherit; }
  .modal-color-btn:hover { border-color:#C9A96E; background:rgba(201,169,110,.06); }
  .modal-color-btn-active { background:#C9A96E;border-color:#C9A96E;color:#1A1612;font-weight:600; }
  .modal-color-btn-active:hover { background:#C9A96E;border-color:#C9A96E; }

  .modal-qty { display:flex;flex-direction:column;gap:.5rem; }
  .modal-qty-controls { display:flex;align-items:center;gap:.5rem; }
  .modal-qty-controls button { width:34px;height:34px;border-radius:8px;border:1.5px solid #E0D8CE;
    background:transparent;display:flex;align-items:center;justify-content:center;
    cursor:pointer;transition:all .2s;color:#1A1612; }
  .modal-qty-controls button:hover { border-color:#C9A96E; }
  .modal-qty-controls span { font-size:1.1rem;font-weight:600;min-width:24px;text-align:center; }

  .modal-description { display:flex;flex-direction:column;gap:.3rem; }
  .modal-description p { font-size:.85rem;color:#8A7968;line-height:1.6;font-weight:300; }

  .modal-trust { display:flex; align-items:center; gap:.5rem; flex-wrap:wrap;
    background:#F5F1EB; border-radius:8px; padding:.6rem .75rem; }
  .modal-trust-wa { font-size:.72rem; color:#6B5D4F; display:inline-flex; align-items:center; gap:.35rem;
    font-weight:450; }

  .modal-actions { display:flex;flex-direction:column;gap:.65rem;margin-top:auto;padding-top:.5rem; }
  .modal-cart-btn { width:100%;padding:.8rem;border:none;border-radius:10px;font-size:.9rem;
    font-weight:600;background:#1A1612;color:#C9A96E;cursor:pointer;transition:all .25s;font-family:inherit; }
  .modal-cart-btn:hover { background:#2D2822; }
  .modal-cart-btn-added { background:#2E7D52;color:white; }
  .modal-wa-btn { display:flex;align-items:center;justify-content:center;gap:.5rem;
    width:100%;padding:.8rem;border-radius:10px;font-size:.9rem;font-weight:600;
    background:#25D366;color:white;border:none;cursor:pointer;transition:all .25s;
    text-decoration:none;font-family:inherit; }
  .modal-wa-btn:hover { background:#1ebe5d; }

  .modal-share-tooltip { font-size:.65rem;color:#2E7D52;position:absolute;top:0;right:0; }

  .modal-related-wrap { grid-row:2; grid-column:1/-1; padding:0 1.75rem 1.25rem; overflow:hidden; }
  .modal-related { border-top:1px solid #F0EAE0;padding-top:1rem; }
  .modal-related-title { font-family:'Playfair Display',serif;font-size:.85rem;color:#1A1612;margin-bottom:.75rem; }
  .modal-related-grid { display:grid;grid-template-columns:repeat(2,1fr);gap:.5rem; }
  .modal-related-card { display:flex;gap:.5rem;padding:.5rem;border-radius:8px;border:1px solid #F0EAE0;
    background:white;cursor:pointer;transition:all .2s;text-align:left;font-family:inherit;
    text-decoration:none;color:inherit;width:100%; }
  .modal-related-card:hover { border-color:#C9A96E;box-shadow:0 2px 8px rgba(201,169,110,.12); }
  .modal-related-img-wrap { width:48px;height:60px;border-radius:6px;overflow:hidden;flex-shrink:0;background:#F0EBE3; }
  .modal-related-img { width:100%;height:100%;object-fit:cover; }
  .modal-related-no-img { width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#8A7968; }
  .modal-related-body { flex:1;min-width:0;display:flex;flex-direction:column;gap:.15rem;justify-content:center; }
  .modal-related-name { font-size:.72rem;font-weight:500;color:#1A1612;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
  .modal-related-price { font-size:.75rem;font-weight:700;color:#C9A96E; }

  /* ── MICRO-ANIMATIONS ──────────────────────────────────── */
  @keyframes fadeInUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes scaleIn { from { opacity:0; transform:scale(.95); } to { opacity:1; transform:scale(1); } }
  @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes cartBounce { 0%,100% { transform:scale(1); } 50% { transform:scale(1.15); } }
  .product-card { animation:fadeInUp .35s ease both; }
  .product-card:nth-child(2) { animation-delay:.05s; }
  .product-card:nth-child(3) { animation-delay:.1s; }
  .product-card:nth-child(4) { animation-delay:.15s; }
  .product-card:nth-child(5) { animation-delay:.2s; }
  .product-card:nth-child(6) { animation-delay:.25s; }
  .hero-content { animation:heroFadeIn .8s ease-out; }
  .cat-card { transition:all .25s cubic-bezier(.25,.46,.45,.94); }
  .cat-card:active { transform:scale(.96); }
  .modal-gallery-main img { cursor:zoom-in; transition:opacity .3s ease, transform .3s ease; }
  .modal-gallery-main img.img-zoomed { cursor:zoom-out; transform:scale(1.5); }
  button:active { transform:scale(.97); }
  .cart-checkout-btn:active { transform:scale(.97); }
  .modal-cart-btn:active { transform:scale(.97); }
  .modal-wa-btn:active { transform:scale(.97); }
  .hero-btn:active { transform:scale(.97); }

  /* ── CART DRAWER ──────────────────────────────────────── */
  .cart-checkout-form { padding:.75rem 1.5rem 0; display:flex; flex-direction:column; gap:.65rem; overflow-y:auto; }
  .cart-checkout-field { display:flex; flex-direction:column; gap:.25rem; }
  .cart-checkout-field label { font-size:.7rem; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:#8A7968; }
  .cart-checkout-field input { border:1.5px solid #E0D8CE; border-radius:8px; padding:.6rem .8rem; font-size:.88rem; font-family:inherit; outline:none; background:#FAF7F2; color:#1A1612; }
  .cart-checkout-field input:focus { border-color:#C9A96E; }

  .cart-overlay { position:fixed;inset:0;background:rgba(26,22,18,0.5);z-index:500;
    opacity:0;visibility:hidden;transition:all .3s; }
  .cart-overlay-open { opacity:1;visibility:visible; }
  .cart-drawer { position:fixed;top:0;right:0;bottom:0;width:400px;max-width:90vw;
    background:white;z-index:501;display:flex;flex-direction:column;
    transform:translateX(100%);transition:transform .35s cubic-bezier(.4,0,.2,1);
    box-shadow:-8px 0 32px rgba(0,0,0,.15); }
  .cart-drawer-open { transform:translateX(0); }
  .cart-header { display:flex;align-items:center;justify-content:space-between;
    padding:1.25rem 1.5rem;border-bottom:1px solid #F0EAE0;flex-shrink:0; }
  .cart-title { font-family:'Playfair Display',serif;font-size:1.15rem;color:#1A1612; }
  .cart-close { width:32px;height:32px;border-radius:50%;border:none;background:#F5F1EB;
    display:flex;align-items:center;justify-content:center;cursor:pointer;color:#8A7968;transition:all .2s; }
  .cart-close:hover { background:#EBE5DB;color:#1A1612; }

  .cart-empty { flex:1;display:flex;flex-direction:column;align-items:center;
    justify-content:center;gap:.5rem;padding:2rem;text-align:center; }
  .cart-empty-icon { opacity:.3; color:#8A7968; }
  .cart-empty p { font-size:1rem;color:#1A1612;font-weight:500; }
  .cart-empty-sub { font-size:.85rem!important;color:#8A7968!important;font-weight:400!important; }

  .cart-items { flex:1;overflow-y:auto;padding:.75rem 1.5rem;display:flex;flex-direction:column;gap:.75rem; }
  .cart-item { display:flex;gap:.75rem;padding:.75rem;border-radius:10px;
    background:#FAF7F2; }
  .cart-item-img-wrap { width:64px;height:80px;flex-shrink:0;border-radius:8px;overflow:hidden;
    background:#F0EBE3; }
  .cart-item-img { width:100%;height:100%;object-fit:cover; }
  .cart-item-no-img { width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;opacity:.4; }
  .cart-item-info { flex:1;min-width:0;display:flex;flex-direction:column;gap:.2rem; }
  .cart-item-name { font-size:.88rem;font-weight:600;color:#1A1612; }
  .cart-item-meta { font-size:.75rem;color:#8A7968; }
  .cart-item-price { font-size:.85rem;font-weight:700;color:#1A1612;margin-top:.1rem; }
  .cart-item-controls { display:flex;align-items:center;gap:.3rem;margin-top:.25rem; }
  .cart-item-controls button { width:26px;height:26px;border-radius:6px;border:1px solid #E0D8CE;
    background:white;display:flex;align-items:center;justify-content:center;cursor:pointer;
    color:#1A1612;transition:all .15s; }
  .cart-item-controls button:hover { border-color:#C9A96E; }
  .cart-item-qty { font-size:.82rem;font-weight:600;min-width:20px;text-align:center; }
  .cart-item-remove { margin-left:auto!important;border-color:#F5C0C0!important;color:#C25E5E!important; }
  .cart-item-remove:hover { background:#C25E5E!important;color:white!important; }

  .cart-footer { padding:1rem 1.5rem 1.5rem;border-top:1px solid #F0EAE0;flex-shrink:0;
    display:flex;flex-direction:column;gap:.65rem; }
  .cart-total { display:flex;justify-content:space-between;align-items:center; }
  .cart-total span:first-child { font-size:.95rem;font-weight:500;color:#1A1612; }
  .cart-total-price { font-size:1.35rem;font-weight:700;color:#1A1612; }
  .cart-checkout-btn { display:flex;align-items:center;justify-content:center;gap:.5rem;
    padding:.85rem;border-radius:10px;border:none;font-size:.9rem;font-weight:600;
    background:#25D366;color:white;cursor:pointer;transition:all .25s;text-decoration:none;font-family:inherit; }
  .cart-checkout-btn:hover { background:#1ebe5d; }
  .cart-clear-btn { background:none;border:none;font-size:.78rem;color:#8A7968;
    cursor:pointer;padding:.25rem;transition:color .2s;font-family:inherit; }
  .cart-clear-btn:hover { color:#C25E5E; }
  .cart-success { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.75rem; padding:2.5rem 1.5rem; text-align:center; }
  .cart-success-icon { color:#2E7D52; }
  .cart-success h3 { font-family:'Playfair Display',serif; font-size:1.3rem; color:#1A1612; }
  .cart-success p { font-size:.9rem; color:#8A7968; }
  .cart-success-sub { font-size:.8rem!important; color:#B0A899!important; }
  .cart-success-btn { padding:.75rem 2rem; border:none; border-radius:10px; background:#C9A96E; color:#1A1612; font-size:.9rem; font-weight:600; cursor:pointer; font-family:inherit; transition:all .25s; }
  .cart-success-btn:hover { background:#b8944f; }

  /* ── BOTTOM NAV ───────────────────────────────────────── */
  .bottom-nav { position:fixed;bottom:0;left:0;right:0;height:60px;background:#1A1612;
    display:none;align-items:center;justify-content:space-around;z-index:300;
    border-top:1px solid rgba(201,169,110,.12);padding-bottom:env(safe-area-inset-bottom); }
  .bottom-nav-btn { display:flex;flex-direction:column;align-items:center;gap:2px;
    background:none;border:none;color:#8A7968;font-size:.65rem;font-weight:500;
    cursor:pointer;padding:.3rem .6rem;transition:color .2s;font-family:inherit;text-decoration:none; }
  .bottom-nav-btn:active { color:#C9A96E; transform:scale(.95); }
  .bottom-nav-cart-wrap { position:relative; }
  .bottom-nav-badge { position:absolute;top:-6px;right:-8px;min-width:16px;height:16px;
    border-radius:8px;background:#C9A96E;color:#1A1612;font-size:.55rem;font-weight:700;
    display:flex;align-items:center;justify-content:center;line-height:1;padding:0 4px; }

  .bottom-cat-panel { position:fixed;bottom:60px;left:0;right:0;background:white;
    z-index:299;padding:.75rem;display:flex;gap:.5rem;border-radius:12px 12px 0 0;
    box-shadow:0 -4px 24px rgba(0,0,0,.08);animation:slideUp .2s ease-out; }
  .bottom-cat-btn { flex:1;padding:.6rem;border-radius:10px;border:1.5px solid #E8D5B0;
    background:white;font-size:.82rem;font-weight:500;color:#1A1612;cursor:pointer;
    transition:all .2s;font-family:inherit;text-align:center; }
  .bottom-cat-btn:active { background:#C9A96E;border-color:#C9A96E;color:#1A1612; }

  /* ── FLOATING WHATSAPP ────────────────────────────────── */
  .floating-wa { position:fixed;bottom:80px;right:16px;width:52px;height:52px;
    border-radius:50%;background:#25D366;color:white;display:none;align-items:center;
    justify-content:center;z-index:200;box-shadow:0 4px 20px rgba(37,211,102,.4);
    transition:all .3s;animation:waPulse 2s infinite; }
  .floating-wa:hover { transform:scale(1.08);box-shadow:0 6px 24px rgba(37,211,102,.5); }
  @keyframes waPulse { 0%,100% { box-shadow:0 4px 20px rgba(37,211,102,.4); }
    50% { box-shadow:0 4px 28px rgba(37,211,102,.6); } }

  /* ── SKELETON ─────────────────────────────────────────── */
  .skeleton-card { background:white;border-radius:12px;overflow:hidden; }
  .skeleton-img { aspect-ratio:3/4;background:linear-gradient(90deg,#F0EBE3 25%,#F8F4EE 50%,#F0EBE3 75%);background-size:200% 100%;animation:shimmer 1.5s infinite; }
  .skeleton-body { padding:1rem;display:flex;flex-direction:column;gap:.5rem; }
  .skeleton-line { height:12px;border-radius:6px;background:linear-gradient(90deg,#F0EBE3 25%,#F8F4EE 50%,#F0EBE3 75%);background-size:200% 100%;animation:shimmer 1.5s infinite; }
  .skeleton-line.short { width:60%; }
  .skeleton-cat { width:40%;height:10px; }
  .skeleton-name { height:14px; }
  .skeleton-price { width:35%; }
  .skeleton-footer { display:flex;justify-content:space-between;align-items:center;margin-top:.5rem;padding-top:.5rem;border-top:1px solid #F0EAE0; }
  .skeleton-btn { width:32px;height:32px;border-radius:50%;background:linear-gradient(90deg,#F0EBE3 25%,#F8F4EE 50%,#F0EBE3 75%);background-size:200% 100%;animation:shimmer 1.5s infinite; }
  @keyframes shimmer { 0% { background-position:200% 0; } 100% { background-position:-200% 0; } }

  /* ── BANNER SLIDER ────────────────────────────────────── */
  .banner-slider { position:relative; overflow:hidden; }
  .banner-slide { padding:.85rem 2.5rem; text-align:center; position:relative; }
  .banner-content { max-width:900px; margin:0 auto; display:flex;flex-direction:column;align-items:center;gap:.35rem; }
  .banner-subtitle { font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;opacity:.7;font-weight:500;color:white; }
  .banner-text { font-size:.85rem;font-weight:500;color:white; }
  .banner-cta { display:inline-block;font-size:.72rem;font-weight:600;padding:.25rem 1rem;border-radius:999px;background:white;color:#1A1612;text-decoration:none;transition:all .2s; }
  .banner-cta:hover { opacity:.85; }
  .banner-nav { position:absolute;top:50%;transform:translateY(-50%);width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.25);border:none;color:white;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;z-index:2; }
  .banner-nav:hover { background:rgba(255,255,255,.4); }
  .banner-nav-prev { left:6px; }
  .banner-nav-next { right:6px; }
  .banner-dots { position:absolute;bottom:6px;left:50%;transform:translateX(-50%);display:flex;gap:5px;z-index:2; }
  .banner-dot { width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.4);cursor:pointer;transition:all .2s; }
  .banner-dot-active { background:white;width:14px;border-radius:3px; }

  /* ── POPUP ────────────────────────────────────────────── */
  .popup-overlay { position:fixed;inset:0;background:rgba(26,22,18,0.7);backdrop-filter:blur(4px);z-index:600;display:flex;align-items:center;justify-content:center;padding:1.5rem;animation:fadeIn .3s ease; }
  .popup-card { background:white;border-radius:20px;padding:2rem 1.75rem;max-width:360px;width:100%;text-align:center;position:relative;animation:scaleIn .35s ease; }
  .popup-close { position:absolute;top:12px;right:12px;width:32px;height:32px;border-radius:50%;border:none;background:#F5F1EB;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#8A7968;transition:all .2s; }
  .popup-close:hover { background:#EBE5DB;color:#1A1612; }
  .popup-icon-wrap { width:56px;height:56px;border-radius:50%;background:#F5F1EB;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;color:#C9A96E; }
  .popup-title { font-family:'Playfair Display',serif;font-size:1.25rem;color:#1A1612;margin-bottom:.35rem; }
  .popup-subtitle { font-size:.82rem;color:#8A7968;margin-bottom:1.25rem; }
  .popup-actions { display:flex;flex-direction:column;gap:.5rem; }
  .popup-btn { padding:.7rem;border:none;border-radius:10px;background:#1A1612;color:#C9A96E;font-size:.85rem;font-weight:600;cursor:pointer;font-family:inherit;transition:all .25s; }
  .popup-btn:hover { background:#2D2822; }
  .popup-wa { display:inline-flex;align-items:center;justify-content:center;gap:.35rem;padding:.6rem;border-radius:10px;background:#25D366;color:white;font-size:.8rem;font-weight:600;text-decoration:none;transition:all .25s;font-family:inherit; }
  .popup-wa:hover { background:#1ebe5d; }

  /* ── WISHLIST ─────────────────────────────────────────── */
  .wishlist-btn { position:absolute;top:10px;right:10px;z-index:3;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.9);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#8A7968;transition:all .25s;box-shadow:0 2px 8px rgba(0,0,0,.1); }
  .wishlist-btn:hover { background:white;transform:scale(1.08); }
  .wishlist-btn-active { color:#C25E5E; }
  .wishlist-count { font-size:.65rem;color:#8A7968; }
  .wishlist-section .lm-product-grid .product-card { animation:fadeInUp .35s ease both; }

  /* ── SHARE STORE ──────────────────────────────────────── */
  .share-store-btn { display:inline-flex;align-items:center;gap:.4rem;padding:.5rem 1rem;border-radius:999px;border:1.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.06);color:#FAF7F2;font-size:.78rem;font-weight:500;cursor:pointer;transition:all .25s;font-family:inherit;backdrop-filter:blur(4px); }
  .share-store-btn:hover { background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.35); }

  /* ── SOCIAL FOLLOW ────────────────────────────────────── */
  .social-follow { padding:0 1.25rem 1.5rem; }
  .social-follow-inner { max-width:1200px;margin:0 auto;padding:1.5rem;border-radius:12px;background:#1A1612;text-align:center; }
  .social-follow-title { font-family:'Playfair Display',serif;font-size:1.1rem;color:#FAF7F2;margin-bottom:1rem; }
  .social-follow-links { display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap; }
  .social-follow-link { display:inline-flex;align-items:center;gap:.5rem;padding:.6rem 1.25rem;border-radius:999px;background:rgba(255,255,255,.06);color:#FAF7F2;text-decoration:none;font-size:.82rem;font-weight:500;transition:all .25s;border:1px solid rgba(255,255,255,.1); }
  .social-follow-link:hover { background:rgba(255,255,255,.1);border-color:var(--hover-color);color:var(--hover-color); }

  /* ── RECENT VIEWS ─────────────────────────────────────── */
  .recent-views { padding:0 1.25rem 1.5rem; }
  .recent-views-inner { max-width:1200px;margin:0 auto; }
  .recent-views-scroll { display:flex;gap:.65rem;overflow-x:auto;padding-bottom:.5rem;scrollbar-width:none; }
  .recent-views-scroll::-webkit-scrollbar { display:none; }
  .recent-view-card { flex-shrink:0;width:130px;text-decoration:none;color:inherit; }
  .recent-view-img { width:130px;height:162px;border-radius:10px;overflow:hidden;background:#F0EBE3;margin-bottom:.35rem; }
  .recent-view-img img { width:100%;height:100%;object-fit:cover; }
  .recent-view-name { font-size:.72rem;font-weight:500;color:#1A1612;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
  .recent-view-price { font-size:.75rem;font-weight:700;color:#C9A96E; }

  /* ── CTA TRUST TEXT ────────────────────────────────────── */
  .cta-trust { display:flex;align-items:center;justify-content:center;gap:.5rem;background:#F5F1EB;border-radius:8px;padding:.6rem .75rem;font-size:.78rem;color:#6B5D4F;font-weight:450;margin-top:.65rem; }
  .cta-trust svg { flex-shrink:0; }

  /* ── STORE PAGE LAYOUT ────────────────────────────────── */
  .store-page { padding-bottom:60px; }

  /* ── FILTERS ──────────────────────────────────────────── */
  .lm-filters { padding:1rem 1.25rem 0; display:flex; flex-wrap:wrap; gap:.5rem;
    align-items:center; max-width:1200px; margin:0 auto; }
  .lm-filter-label { font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;
    color:#8A7968;font-weight:500; }

  /* ── GRID ─────────────────────────────────────────────── */
  .lm-grid-section { padding:1.5rem 1.25rem 6rem; max-width:1200px; margin:0 auto; }
  .lm-product-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:1.25rem; }

  /* ── FOOTER ───────────────────────────────────────────── */
  .lm-footer-top { display:flex; flex-wrap:wrap; gap:2rem; padding:2.5rem 1.25rem;
    justify-content:space-between; border-bottom:1px solid rgba(201,169,110,.15); }

  /* ── RESPONSIVE MÓVIL ─────────────────────────────────── */
  @media (max-width: 768px) {
    .product-card:hover { transform:none; }
    .product-card:hover .card-image img { transform:none; }
    .product-card:hover .card-image-overlay { opacity:1;transform:translateY(0); }

    .lm-hamburger { display:flex !important; }
    .lm-filters { padding:.5rem .75rem !important; gap:.3rem !important; overflow-x:auto !important;
      flex-wrap:nowrap !important; -webkit-overflow-scrolling:touch; }
    .lm-filters::-webkit-scrollbar { display:none; }
    .lm-filter-label { display:none; }
    .lm-product-grid { grid-template-columns:repeat(2,1fr) !important; gap:.6rem !important; }
    .lm-grid-section { padding:1rem .75rem 6rem !important; }

    .cat-grid { gap:.4rem; flex-wrap:nowrap; overflow-x:auto; padding-bottom:.25rem;
      -webkit-overflow-scrolling:touch; grid-template-columns:none; display:flex; }
    .cat-grid::-webkit-scrollbar { display:none; }
    .cat-card { padding:.65rem .7rem; flex-shrink:0; white-space:nowrap; }
    .cat-icon { font-size:1.2rem; }

    .product-modal { grid-template-columns:1fr !important; grid-template-rows:auto auto auto !important;
      max-height:100vh; border-radius:0; width:100vw !important; max-width:100vw !important; }
    .modal-gallery { grid-row:1 !important; grid-column:1 !important; }
    .modal-gallery-main { min-height:0; border-radius:0; }
    .modal-gallery-main img { max-height:50vh; }
    .modal-thumb { width:48px;height:48px; }
    .modal-info { grid-row:2 !important; grid-column:1 !important; padding:1rem 1rem 0.75rem; overflow-y:visible; }
    .modal-info-content { gap:.7rem; }
    .modal-actions { position:sticky; bottom:0; background:white; z-index:2;
      padding:.75rem 1rem 1rem; margin-top:0;
      box-shadow:0 -4px 20px rgba(26,22,18,.08); }
    .modal-related-wrap { grid-row:3 !important; grid-column:1 !important; padding:0 1rem 1rem; }
    .modal-name { font-size:1.15rem; }
    .modal-price { font-size:1.3rem; }
    .modal-overlay { padding:0; align-items:flex-end; }
    .modal-cart-btn, .modal-wa-btn { padding:.7rem; font-size:.85rem; min-height:44px; }
    .modal-share { top:8px; right:8px !important; }
    .modal-close { display:none; }

    .lm-footer-top { flex-direction:column !important; gap:1rem !important; padding:1.5rem 1.25rem !important; }

    .bottom-nav { display:flex !important; }
    .floating-wa { display:flex !important; bottom:76px; width:48px;height:48px; }
    .floating-wa svg { width:22px;height:22px; }
    .store-page { padding-bottom:64px; }

    .hero-section { min-height:auto; padding-bottom:1rem; }
    .hero-content { padding:1.25rem 1.25rem 0.5rem; }
    .hero-title { font-size:clamp(1.4rem,6vw,2rem); padding-bottom:.5rem;
      text-align:center; }
    .hero-logo { max-height:48px; }
    .hero-logo-wrap { margin-bottom:.5rem; }
    .hero-subtitle { padding-bottom:1rem; font-size:.85rem; text-align:center; }
    .hero-actions { flex-direction:column; align-items:stretch; padding-bottom:.75rem; gap:.5rem; }
    .hero-btn { padding:.65rem 1.2rem; font-size:.8rem; justify-content:center; }
    .hero-btn-secondary { justify-content:center; }
    .hero-share-wrap { text-align:center; padding-bottom:0; }
    .hero-share-wrap button { font-size:.75rem; }

    .promo-banner { font-size:.75rem; padding:.45rem .75rem; }
    .banner-slider { margin:.5rem .75rem 0; }

    .lm-grid-section .section-title { font-size:1rem; }

    .product-card { min-height:0; }
    .card-image { height:auto; aspect-ratio:3/4; }
    .card-badge { font-size:.6rem; padding:.15rem .45rem; top:6px; left:6px; }
    .card-discount { font-size:.6rem; padding:.1rem .35rem; top:6px; right:6px; }
    .card-body { padding:.45rem .5rem .5rem; gap:.15rem; }
    .card-category { font-size:.6rem; }
    .card-name { font-size:.78rem; }
    .card-price-current { font-size:.95rem; }
    .card-price-old { font-size:.7rem; }
    .btn-whatsapp { width:32px;height:32px; }
    .wishlist-btn { width:28px;height:28px; top:6px; right:6px; }
    .wishlist-btn svg { width:14px;height:14px; }
    .card-discount-badge { font-size:.6rem; padding:.1rem .35rem; top:6px; right:6px; }

    .share-store-wrap { padding:.5rem 1rem 0; }
    .social-follow { padding:.5rem 1rem; }
    .recent-views { padding:.5rem .75rem; }
    .recent-view-card { min-width:80px; }
  }

  @media (max-width: 400px) {
    .lm-product-grid { grid-template-columns:repeat(2,1fr) !important; gap:.4rem !important; }
    .lm-grid-section { padding:.6rem .5rem 6rem !important; }
    .cat-grid { gap:.35rem; }
    .cat-card { padding:.5rem .6rem; font-size:.75rem; }

    .card-body { padding:.35rem .4rem .45rem; }
    .card-name { font-size:.72rem; }
    .card-price-current { font-size:.85rem; }
    .btn-whatsapp { width:28px;height:28px; }
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

    .lm-admin-modal-ov { padding:.5rem !important; align-items:flex-end !important; }
    .lm-admin-modal-cont { max-width:100vw !important; width:100vw !important; border-radius:16px 16px 0 0 !important;
      max-height:92vh !important; }
    .lm-admin-modal-tabs { gap:.15rem !important; padding:.6rem .75rem 0 !important; }
    .lm-admin-modal-tabs button { padding:.35rem .65rem !important; font-size:.7rem !important; min-height:36px; }
    .lm-admin-modal-body { padding:.85rem 1rem !important; }
    .lm-admin-modal-body .lm-prod-modal-row { grid-template-columns:1fr !important; }
    .lm-admin-modal-footer { padding:.6rem 1rem 1rem !important; gap:.5rem !important; }
    .lm-admin-modal-footer button { flex:1; justify-content:center; min-height:44px; font-size:.85rem; }
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
