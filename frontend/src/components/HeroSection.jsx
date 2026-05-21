import { WhatsAppIcon, CheckIcon, TruckIcon, ChatIcon, LockIcon, ShoppingBagIcon } from './Icons';
import ShareStoreButton from './ShareStoreButton';

const TRUST_BADGES = [
  { icon: TruckIcon, label: 'Envios en Paita' },
  { icon: ChatIcon, label: 'Pedidos por WhatsApp' },
  { icon: CheckIcon, label: 'Atencion rapida' },
];

export default function HeroSection({
  waNumber,
  storeName = 'LeisModa',
  storeSlogan = 'Tu look favorito, directo desde Paita',
  logo = '',
  banner = '',
  ctaText = '',
  trustText = '',
}) {
  const num = waNumber?.replace(/\D/g, '');
  const waUrl = num ? `https://wa.me/${num}` : '#';

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const titleWords = (storeName || 'LeisModa').split(' ');
  const firstPart = titleWords.length > 1 ? titleWords.slice(0, -1).join(' ') : '';
  const lastWord = titleWords[titleWords.length - 1] || '';

  return (
    <section className="hero-section">
      <div className="hero-layout">
        <div className="hero-col hero-col-text">
          <div className="hero-content-inner">
            {logo && (
              <div className="hero-logo-wrap">
                <img src={logo} alt={storeName} className="hero-logo" />
              </div>
            )}
            <h1 className="hero-title">
              {firstPart ? <>{firstPart} <span className="hero-highlight">{lastWord}</span></>
                : <>{storeName} <span className="hero-highlight">que te define</span></>}
            </h1>
            <p className="hero-subtitle">{storeSlogan}</p>
            <div className="hero-actions">
              <button className="hero-btn hero-btn-primary" onClick={scrollToProducts}>
                {ctaText || 'Ver Coleccion'}
              </button>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hero-btn hero-btn-secondary">
                <WhatsAppIcon size={16} /> Escribenos
              </a>
            </div>
            {trustText && (
              <div className="hero-trust-banner">
                <LockIcon size={11} /> {trustText}
              </div>
            )}
            <div className="hero-trust-badges">
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <span key={label} className="hero-trust-badge">
                  <Icon size={11} /> {label}
                </span>
              ))}
            </div>
            <div className="hero-share">
              <ShareStoreButton storeName={storeName} />
            </div>
          </div>
        </div>
        <div className={`hero-col hero-col-image${!banner ? ' hero-col-image-empty' : ''}`}>
          {banner ? (
            <img src={banner} alt="" className="hero-lifestyle-img" />
          ) : (
            <div className="hero-card-fallback">
              <div className="hero-card-fallback-inner">
                <ShoppingBagIcon size={32} />
                <span className="hero-card-fallback-title">Nueva coleccion disponible</span>
                <span className="hero-card-fallback-sub">Descubre las ultimas tendencias en moda</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
