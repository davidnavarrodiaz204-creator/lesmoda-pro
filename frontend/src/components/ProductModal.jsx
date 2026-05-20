import { useState, useRef, useEffect, useCallback } from 'react';
import { productService } from '../services/api';
import { useCart } from './CartContext';
import { WhatsAppIcon, CloseIcon, ChevronLeftIcon, ChevronRightIcon, MinusIcon, PlusIcon, CheckIcon, ImageIcon, LockIcon, ShareIcon } from './Icons';
import { buildOrderWhatsappMessage, openWhatsapp } from '../utils/whatsappMessage';

const BADGE_LABEL = { new: 'NUEVO', sale: 'OFERTA', hot: 'TREND', last: 'ULTIMAS UNIDADES', featured: 'DESTACADO' };

function StockBadge({ stock }) {
  if (stock == null || stock === undefined) return <span className="stock-badge stock-consult">Consultar stock</span>;
  if (stock > 5) return <span className="stock-badge stock-ok">Disponible</span>;
  if (stock > 0) return <span className="stock-badge stock-low">Stock bajo</span>;
  return <span className="stock-badge stock-consult">Consultar stock</span>;
}

function RelatedProducts({ productId, onSelect }) {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!productId) return;
    productService.getRelated(productId)
      .then(({ data }) => setRelated(data?.data || []))
      .catch(() => {});
  }, [productId]);

  if (related.length === 0) return null;

  return (
    <div className="modal-related">
      <h4 className="modal-related-title">Tambien te puede gustar</h4>
      <div className="modal-related-grid">
        {related.map(p => {
          const img = p.images?.[0]?.url || p.mainImage;
          return (
            <button key={p._id} className="modal-related-card" onClick={() => onSelect(p)}>
              <div className="modal-related-img-wrap">
                {img ? (
                  <img src={img} alt={p.name} className="modal-related-img" />
                ) : (
                  <div className="modal-related-no-img"><ImageIcon size={16} /></div>
                )}
              </div>
              <div className="modal-related-body">
                <div className="modal-related-name">{p.name}</div>
                <div className="modal-related-price">S/ {p.price.toFixed(2)}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ProductModal({ product: rawProduct, waNumber, onClose, stockVisible = true, standalone, onView, trustText = '' }) {
  const { addItem } = useCart();
  const product = rawProduct || {};
  const images = product.images || [];
  const [imgIndex, setImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [relatedProduct, setRelatedProduct] = useState(null);
  const [shared, setShared] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const touchStartX = useRef(0);

  const hasMultipleImages = images.length > 1;
  const hasSizes = product.sizes?.length > 0;
  const hasColors = product.colors?.length > 0;
  const isOutOfStock = product.stock === 0 && stockVisible;

  const currentImg = images[imgIndex]?.url || product.mainImage;

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!hasMultipleImages) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (delta > 50) {
      setImgIndex(i => (i + 1) % images.length);
    } else if (delta < -50) {
      setImgIndex(i => (i - 1 + images.length) % images.length);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, { size: selectedSize, color: selectedColor, quantity });
    if (!standalone) onClose();
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product, { size: selectedSize, color: selectedColor, quantity });
    productService.trackClick(product._id).catch(() => {});
    const msg = buildOrderWhatsappMessage({
      storeName: '',
      items: [{
        name: product.name,
        price: product.price,
        quantity,
        size: selectedSize,
        color: selectedColor,
        images: product.images,
      }],
      total: product.price * quantity,
    });
    if (waNumber) openWhatsapp({ phone: waNumber, message: msg });
    if (!standalone) onClose();
  };

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/producto/${product.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: product.description || '', url });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {}
    }
  }, [product]);

  useEffect(() => {
    if (product._id) onView?.(product);
  }, [product._id]);

  const discount = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleImageClick = () => {
    if (!currentImg) return;
    setZoomed(!zoomed);
  };

  if (relatedProduct) {
    return (
      <ProductModal
        product={relatedProduct}
        waNumber={waNumber}
        onClose={() => setRelatedProduct(null)}
        stockVisible={stockVisible}
        standalone={standalone}
      />
    );
  }

  return (
    <div className="modal-overlay" onClick={standalone ? undefined : onClose}>
      <div className="product-modal" onClick={e => e.stopPropagation()}>
        {!standalone && <button className="modal-close" onClick={onClose}><CloseIcon size={18} /></button>}
        <button className="modal-share" onClick={handleShare} title="Compartir producto" style={{
          position:'absolute',top:12,right: standalone ? 12 : 54,zIndex:10,width:36,height:36,
          borderRadius:'50%',background:'rgba(255,255,255,.9)',border:'none',
          display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',
          boxShadow:'0 2px 12px rgba(0,0,0,.12)',color: shared ? '#2E7D52' : '#1A1612',transition:'all .2s'
        }}>
          <ShareIcon size={16} />
        </button>

        <div className="modal-gallery">
          <div className="modal-gallery-main"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}>
            {currentImg ? (
              <img src={currentImg} alt={product.name}
                className={zoomed ? 'img-zoomed' : ''}
                onClick={handleImageClick}
                onError={(e) => { e.target.style.display='none'; e.target.parentElement.classList.add('img-error-fallback'); }} />
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
          <div className="modal-info-content">
            <div className="modal-category">{product.category}</div>
            <h2 className="modal-name">{product.name}</h2>
            {product.badge && (
              <span className={`modal-badge ${product.badge}`}>
                {BADGE_LABEL[product.badge] || product.badge}
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
              <span className="modal-trust-wa"><LockIcon size={12} /> {trustText || 'Sin pago online — todo por WhatsApp'}</span>
            </div>

            {product.description && (
              <div className="modal-description">
                <label className="modal-variant-label">Descripcion</label>
                <p>{product.description}</p>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button className="modal-cart-btn" onClick={handleAddToCart} disabled={isOutOfStock} style={{opacity: isOutOfStock ? 0.5 : 1}}>
              <CheckIcon size={16} /> {isOutOfStock ? 'Consultar disponibilidad' : 'Agregar al carrito'}
            </button>
            {!isOutOfStock && (
              <button className="modal-wa-btn" onClick={handleBuyNow}>
                <WhatsAppIcon size={16} /> Comprar ahora
              </button>
            )}
          </div>
        </div>

        <div className="modal-related-wrap">
          <RelatedProducts productId={product._id} onSelect={setRelatedProduct} />
        </div>
      </div>
    </div>
  );
}
