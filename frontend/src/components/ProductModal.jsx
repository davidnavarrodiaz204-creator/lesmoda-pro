import { useState } from 'react';
import { productService } from '../services/api';
import { useCart } from './CartContext';
import { WhatsAppIcon, CloseIcon, ChevronLeftIcon, ChevronRightIcon, MinusIcon, PlusIcon, CheckIcon, ImageIcon, LockIcon } from './Icons';

function StockBadge({ stock }) {
  if (stock == null || stock === undefined) return <span className="stock-badge stock-consult">Consultar stock</span>;
  if (stock > 5) return <span className="stock-badge stock-ok">Disponible</span>;
  if (stock > 0) return <span className="stock-badge stock-low">Stock bajo</span>;
  return <span className="stock-badge stock-consult">Consultar stock</span>;
}

export default function ProductModal({ product: rawProduct, waNumber, onClose, stockVisible = true }) {
  const { addItem } = useCart();
  const product = rawProduct || {};
  const images = product.images || [];
  const [imgIndex, setImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const hasMultipleImages = images.length > 1;
  const hasSizes = product.sizes?.length > 0;
  const hasColors = product.colors?.length > 0;

  const currentImg = images[imgIndex]?.url || product.mainImage;
  const num = waNumber?.replace(/\D/g, '');

  const handleAddToCart = () => {
    addItem(product, { size: selectedSize, color: selectedColor, quantity });
    onClose();
  };

  const handleBuyNow = () => {
    addItem(product, { size: selectedSize, color: selectedColor, quantity });
    productService.trackClick(product._id).catch(() => {});
    const imgLink = currentImg ? `\nFoto: ${currentImg}` : '';
    const msg = `*Nuevo Pedido - ${product.name}*\n\nPrecio: S/ ${product.price.toFixed(2)}${selectedSize ? `\nTalla: ${selectedSize}` : ''}${selectedColor ? `\nColor: ${selectedColor}` : ''}\nCantidad: ${quantity}\nSubtotal: S/ ${(product.price * quantity).toFixed(2)}${imgLink}`;
    const waUrl = num ? `https://wa.me/${num}?text=${encodeURIComponent(msg)}` : '#';
    window.open(waUrl, '_blank');
    onClose();
  };

  const discount = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><CloseIcon size={18} /></button>

        <div className="modal-gallery">
          <div className="modal-gallery-main">
            {currentImg ? (
              <img src={currentImg} alt={product.name} />
            ) : (
              <div className="modal-no-img"><ImageIcon size={40} /></div>
            )}
            {hasMultipleImages && (
              <>
                <button className="modal-gallery-nav modal-gallery-prev"
                  onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)}>
                  <ChevronLeftIcon size={18} />
                </button>
                <button className="modal-gallery-nav modal-gallery-next"
                  onClick={() => setImgIndex(i => (i + 1) % images.length)}>
                  <ChevronRightIcon size={18} />
                </button>
              </>
            )}
          </div>
          {hasMultipleImages && (
            <div className="modal-thumbs">
              {images.map((img, i) => (
                <button key={i}
                  className={`modal-thumb ${i === imgIndex ? 'modal-thumb-active' : ''}`}
                  onClick={() => setImgIndex(i)}>
                  <img src={img.url} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="modal-info">
          <div className="modal-category">{product.category}</div>
          <h2 className="modal-name">{product.name}</h2>
          {product.badge && (
            <span className={`modal-badge ${product.badge}`}>
              {product.badge === 'new' ? 'NUEVO' : product.badge === 'sale' ? 'OFERTA' : 'TREND'}
            </span>
          )}

          <div className="modal-pricing">
            <span className="modal-price">S/ {product.price.toFixed(2)}</span>
            {product.oldPrice && (
              <>
                <span className="modal-old-price">S/ {product.oldPrice.toFixed(2)}</span>
                {discount > 0 && <span className="modal-discount">-{discount}%</span>}
              </>
            )}
          </div>

          {hasSizes && (
            <div className="modal-variant">
              <label className="modal-variant-label">Talla</label>
              <div className="modal-size-grid">
                {product.sizes.map(s => (
                  <button key={s}
                    className={`modal-size-btn ${selectedSize === s ? 'modal-size-btn-active' : ''}`}
                    onClick={() => setSelectedSize(s === selectedSize ? '' : s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasColors && (
            <div className="modal-variant">
              <label className="modal-variant-label">Color</label>
              <div className="modal-color-grid">
                {product.colors.map(c => (
                  <button key={c}
                    className={`modal-color-btn ${selectedColor === c ? 'modal-color-btn-active' : ''}`}
                    onClick={() => setSelectedColor(c === selectedColor ? '' : c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="modal-qty">
            <label className="modal-variant-label">Cantidad</label>
            <div className="modal-qty-controls">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}><MinusIcon size={14} /></button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)}><PlusIcon size={14} /></button>
            </div>
          </div>

          <div className="modal-trust">
            {stockVisible && <StockBadge stock={product.stock} />}
            <span className="modal-trust-wa"><LockIcon size={12} /> Sin pago online — todo por WhatsApp</span>
          </div>

          {product.description && (
            <div className="modal-description">
              <label className="modal-variant-label">Descripcion</label>
              <p>{product.description}</p>
            </div>
          )}

          <div className="modal-actions">
            <button className="modal-cart-btn" onClick={handleAddToCart}>
              <CheckIcon size={16} /> Agregar al carrito
            </button>
            <button className="modal-wa-btn" onClick={handleBuyNow}>
              <WhatsAppIcon size={16} /> Comprar ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
