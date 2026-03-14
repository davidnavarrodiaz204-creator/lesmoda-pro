// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Reset CSS mínimo global
const style = document.createElement('style');
style.textContent = `
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'DM Sans', 'Segoe UI', sans-serif; background:#F8F9FA; color:#1B263B; }
  a { text-decoration:none; }
  button { cursor:pointer; }
  img { max-width:100%; display:block; }

  /* Clases compartidas de tarjetas */
  .product-card { background:white; border-radius:12px; overflow:hidden;
    box-shadow:0 4px 24px rgba(27,38,59,0.08); transition:transform .25s,box-shadow .25s; cursor:pointer; display:flex; flex-direction:column; }
  .product-card:hover { transform:translateY(-6px); box-shadow:0 12px 40px rgba(27,38,59,0.16); }
  .card-image { position:relative; aspect-ratio:3/4; overflow:hidden; background:#F0EBE3; }
  .card-image img { width:100%; height:100%; object-fit:cover; transition:transform .5s; }
  .product-card:hover .card-image img { transform:scale(1.06); }
  .img-placeholder { width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
    justify-content:center;gap:.5rem;background:linear-gradient(135deg,#E0C9A6,#C5A059);color:#1B263B;font-size:.8rem; }
  .card-badge { position:absolute;top:10px;left:10px;font-size:.68rem;font-weight:700;
    letter-spacing:.1em;text-transform:uppercase;padding:.22rem .6rem;border-radius:4px; }
  .card-badge.new  { background:#C5A059; color:#1B263B; }
  .card-badge.sale { background:#FF7F50; color:white; }
  .card-badge.hot  { background:#1B263B; color:#C5A059; }
  .card-body { padding:1rem 1.1rem 1.2rem; display:flex; flex-direction:column; gap:.45rem; flex:1; }
  .card-category { font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;color:#C5A059;font-weight:600; }
  .card-name { font-family:serif; font-size:1.03rem; line-height:1.3; color:#1B263B; }
  .card-desc { font-size:.8rem; color:#6c757d; line-height:1.4; }
  .card-footer { display:flex;align-items:center;justify-content:space-between;margin-top:auto;
    padding-top:.75rem;border-top:1px solid #E0C9A6; }
  .card-price { font-size:1.1rem; font-weight:700; color:#1B263B; }
  .card-price-old { font-size:.8rem;color:#6c757d;text-decoration:line-through;margin-left:.3rem; }
  .btn-whatsapp { display:inline-flex;align-items:center;gap:.4rem;background:#FF7F50;color:white;
    border:none;font-family:sans-serif;font-size:.78rem;font-weight:600;padding:.48rem .9rem;
    border-radius:8px;transition:all .25s;white-space:nowrap; }
  .btn-whatsapp:hover { background:#e86d3e; transform:scale(1.04); }
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
