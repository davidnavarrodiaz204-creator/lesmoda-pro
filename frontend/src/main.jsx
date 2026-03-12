// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Reset CSS mínimo global
const style = document.createElement('style');
style.textContent = `
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'DM Sans', 'Segoe UI', sans-serif; background:#FAF7F2; color:#1A1612; }
  a { text-decoration:none; }
  button { cursor:pointer; }
  img { max-width:100%; display:block; }

  /* Clases compartidas de tarjetas (reutilizadas desde StorePage) */
  .product-card { background:white; border-radius:12px; overflow:hidden;
    box-shadow:0 4px 24px rgba(26,22,18,0.08); transition:transform .25s,box-shadow .25s; cursor:pointer; display:flex; flex-direction:column; }
  .product-card:hover { transform:translateY(-6px); box-shadow:0 12px 40px rgba(26,22,18,0.16); }
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
`;
document.head.appendChild(style);

// Fuente Google
const link = document.createElement('link');
link.rel  = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap';
document.head.appendChild(link);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
);
