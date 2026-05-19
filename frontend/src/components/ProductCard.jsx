import React, { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/api';
import { useCart } from './CartContext';
import { WhatsAppIcon, CheckIcon, ImageIcon, HeartIcon, HeartFilledIcon } from './Icons';
import { openWhatsapp } from '../utils/whatsappMessage';

const badgeLabel = { new: 'NUEVO', sale: 'OFERTA', hot: 'TREND', last: 'ULTIMAS UNIDADES', featured: 'DESTACADO' };

const PREMIUM_STYLE_ID = 'pcard-premium';

const ProductCard = React.memo(function ProductCard({ product: rawProduct, waNumber, onClick, stockVisible = true, isFavorite, onToggleFavorite }) {
  if (!rawProduct) return null;
  const product = rawProduct;
  const { addItem } = useCart();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [adding, setAdding] = useState(false);

  const img = product.images?.[0]?.url || product.mainImage;
  const fav = isFavorite ? isFavorite(product._id) : false;

  useEffect(() => {
    if (document.getElementById(PREMIUM_STYLE_ID)) return;
    const el = document.createElement('style');
    el.id = PREMIUM_STYLE_ID;
    el.textContent = `
      .product-card {
        transition: transform .3s cubic-bezier(.25,.46,.45,.94), box-shadow .3s ease;
      }
      .product-card:hover {
        transform: scale(1.02);
        box-shadow: 0 12px 40px rgba(26,22,18,.14);
      }
      .card-badge {
        border-radius: 999px;
        padding: .25rem .7rem;
        font-size: .6rem;
      }
      .card-pricing {
        display: flex;
        align-items: baseline;
        gap: .35rem;
      }
      .card-price-current {
        font-size: 1.05rem;
        font-weight: 700;
        color: #1A1612;
      }
      .card-price-old {
        font-size: .78rem;
        color: #8A7968;
        text-decoration: line-through;
      }
      .card-image-overlay {
        opacity: 0;
        transform: translateY(100%);
        transition: all .3s cubic-bezier(.25,.46,.45,.94);
      }
      .product-card:hover .card-image-overlay {
        opacity: 1;
        transform: translateY(0);
      }
      .card-image-skeleton {
        background: linear-gradient(90deg,#F0EBE3 25%,#F8F4EE 50%,#F0EBE3 75%);
        background-size: 200% 100%;
        animation: shimmer 1.2s ease-in-out infinite;
      }
      @media (max-width: 480px) {
        .product-card .card-body {
          padding: .65rem .75rem .85rem;
        }
        .product-card .card-name {
          font-size: .85rem;
        }
        .product-card .card-price-current {
          font-size: .9rem;
        }
        .product-card .card-price-old {
          font-size: .7rem;
        }
        .product-card .card-category {
          font-size: .58rem;
        }
      }
    `;
    document.head.appendChild(el);
  }, []);

  const handleQuickAdd = async (e) => {
    e.stopPropagation();
    setAdding(true);
    addItem(product, { quantity: 1 });
    setTimeout(() => setAdding(false), 400);
  };

  const handleBuy = useCallback(async (e) => {
    e.stopPropagation();
    productService.trackClick(product._id).catch(() => {});
    const msg = `Hola! Me interesa comprar: ${product.name} (S/ ${product.price.toFixed(2)}). Esta disponible?`;
    if (waNumber) openWhatsapp({ phone: waNumber, message: msg });
  }, [product._id, product.name, product.price, waNumber]);

  const handleToggleFav = (e) => {
    e.stopPropagation();
    onToggleFavorite?.(product._id);
  };

  return (
    <div className="product-card" onClick={() => onClick?.(product)}>
      {onToggleFavorite && (
        <button className={`wishlist-btn ${fav ? 'wishlist-btn-active' : ''}`} onClick={handleToggleFav} title={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}>
          {fav ? <HeartFilledIcon size={16} /> : <HeartIcon size={16} />}
        </button>
      )}
      <div className="card-image">
        {!imgLoaded && <div className="card-image-skeleton" />}
        {img ? (
          <img
            src={img}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={(e) => { e.target.style.display='none'; e.target.parentElement.classList.add('img-error-fallback'); }}
            style={{ opacity: imgLoaded ? 1 : 0, transition:'opacity .3s ease' }}
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
            {product.description.substring(0, 60)}{product.description.length > 60 ? '...' : ''}
          </div>
        )}
        <div className="card-footer">
          <div className="card-pricing">
            <span className="card-price-current">S/ {product.price.toFixed(2)}</span>
            {product.oldPrice && (
              <span className="card-price-old">S/ {product.oldPrice.toFixed(2)}</span>
            )}
          </div>
          <button className="btn-whatsapp" onClick={handleBuy}>
            <WhatsAppIcon size={14} />
          </button>
        </div>
        {stockVisible && <StockBadge stock={product.stock} />}
      </div>
    </div>
  );
});

export default ProductCard;

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
