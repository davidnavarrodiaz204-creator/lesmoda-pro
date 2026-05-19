import { useState } from 'react';
import { HomeIcon, GridIcon, WhatsAppIcon, CartIcon, DressIcon, NecktieIcon, HandbagIcon } from './Icons';

const CATEGORIES = ['Mujer', 'Hombre', 'Accesorios'];

export default function BottomNav({ cartItems, onCartClick, waNumber }) {
  const [showCategories, setShowCategories] = useState(false);
  const num = waNumber?.replace(/\D/g, '');
  const waUrl = num ? `https://wa.me/${num}` : '#';

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setShowCategories(false);
  };

  return (
    <>
      <nav className="bottom-nav">
        <button className="bottom-nav-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <HomeIcon size={20} />
          <span>Inicio</span>
        </button>
        <button className="bottom-nav-btn" onClick={() => setShowCategories(!showCategories)}>
          <GridIcon size={20} />
          <span>Categorías</span>
        </button>
        <button className="bottom-nav-btn" onClick={onCartClick}>
          <div className="bottom-nav-cart-wrap">
            <CartIcon size={20} />
            {cartItems > 0 && <span className="bottom-nav-badge">{cartItems > 99 ? '99+' : cartItems}</span>}
          </div>
          <span>Carrito</span>
        </button>
        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="bottom-nav-btn">
          <WhatsAppIcon size={20} />
          <span>WhatsApp</span>
        </a>
      </nav>

      {showCategories && (
        <div className="bottom-cat-panel">
          {CATEGORIES.map(cat => (
            <button key={cat} className="bottom-cat-btn" onClick={() => scrollTo('products')}>
              {cat === 'Mujer' ? <DressIcon size={16} /> : cat === 'Hombre' ? <NecktieIcon size={16} /> : <HandbagIcon size={16} />} {cat}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
