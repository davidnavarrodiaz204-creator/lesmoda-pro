// frontend/src/components/ProductCard.jsx
import { productService } from '../services/api';

export default function ProductCard({ product, waNumber, onClick }) {
  const handleBuy = async (e) => {
    e.stopPropagation();
    // Registrar el click en el backend
    productService.trackClick(product._id).catch(() => {});
    const num = waNumber?.replace(/\D/g, '');
    const msg = `¡Hola! Me interesa comprar: *${product.name}* (S/ ${product.price.toFixed(2)}). ¿Está disponible? 🛍️`;
    const url = num
      ? `https://wa.me/${num}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const badgeLabel = { new: 'NUEVO', sale: 'OFERTA', hot: 'TREND' };
  const img = product.images?.[0]?.url || product.mainImage;

  return (
    <div className="product-card" onClick={() => onClick?.(product)}>
      <div className="card-image">
        {img ? (
          <img src={img} alt={product.name} loading="lazy" />
        ) : (
          <div className="img-placeholder">
            <span>📷</span> Sin imagen
          </div>
        )}
        {product.badge && (
          <span className={`card-badge ${product.badge}`}>
            {badgeLabel[product.badge]}
          </span>
        )}
      </div>
      <div className="card-body">
        <div className="card-category">{product.category}</div>
        <div className="card-name">{product.name}</div>
        {product.description && (
          <div className="card-desc">
            {product.description.substring(0, 72)}{product.description.length > 72 ? '…' : ''}
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
            <WhatsAppIcon size={15} /> Comprar
          </button>
        </div>
      </div>
    </div>
  );
}

export function WhatsAppIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}
