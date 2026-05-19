import { useState } from 'react';
import { productService } from '../services/api';
import { useCart } from './CartContext';
import { WhatsAppIcon, CheckIcon, ImageIcon } from './Icons';

const badgeLabel = { new: 'NUEVO', sale: 'OFERTA', hot: 'TREND' };

export default function ProductCard({ product, waNumber, onClick }) {
  const { addItem } = useCart();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [adding, setAdding] = useState(false);

  const img = product.images?.[0]?.url || product.mainImage;

  const handleQuickAdd = async (e) => {
    e.stopPropagation();
    setAdding(true);
    addItem(product, { quantity: 1 });
    setTimeout(() => setAdding(false), 400);
  };

  const handleBuy = async (e) => {
    e.stopPropagation();
    productService.trackClick(product._id).catch(() => {});
    const num = waNumber?.replace(/\D/g, '');
    const msg = `¡Hola! Me interesa comprar en LeisModa: *${product.name}* (S/ ${product.price.toFixed(2)}). ¿Está disponible?`;
    const url = num
      ? `https://wa.me/${num}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="product-card" onClick={() => onClick?.(product)}>
      <div className="card-image">
        {!imgLoaded && <div className="card-image-skeleton" />}
        {img ? (
          <img
            src={img}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            style={{ opacity: imgLoaded ? 1 : 0 }}
          />
        ) : (
          <div className="img-placeholder"><ImageIcon size={22} /> Sin imagen</div>
        )}
        {product.badge && (
          <span className={`card-badge ${product.badge}`}>
            {badgeLabel[product.badge]}
          </span>
        )}
        {product.oldPrice && product.oldPrice > product.price && (
          <span className="card-discount-badge">
            -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
          </span>
        )}
        <div className="card-image-overlay">
          <button
            className={`card-add-btn ${adding ? 'card-add-btn-added' : ''}`}
            onClick={handleQuickAdd}
          >
            {adding ? <><CheckIcon size={14} /> Agregado</> : 'Agregar'}
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="card-category">{product.category}</div>
        <div className="card-name">{product.name}</div>
        {product.description && (
          <div className="card-desc">
            {product.description.substring(0, 60)}{product.description.length > 60 ? '…' : ''}
          </div>
        )}
        <div className="card-footer">
          <div>
            <span className="card-price">S/ {product.price.toFixed(2)}</span>
            {product.oldPrice && (
              <span className="card-price-old">S/ {product.oldPrice.toFixed(2)}</span>
            )}
          </div>
          <button className="btn-whatsapp" onClick={handleBuy}>
            <WhatsAppIcon size={14} />
          </button>
        </div>
        <StockBadge stock={product.stock} />
      </div>
    </div>
  );
}

function StockBadge({ stock }) {
  if (stock == null || stock === undefined) {
    return <div className="stock-badge stock-consult">Consultar stock</div>;
  }
  if (stock > 5) {
    return <div className="stock-badge stock-ok">Disponible</div>;
  }
  if (stock > 0) {
    return <div className="stock-badge stock-low">Stock bajo</div>;
  }
  return <div className="stock-badge stock-consult">Consultar stock</div>;
}
