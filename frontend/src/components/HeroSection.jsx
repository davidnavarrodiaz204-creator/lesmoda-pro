import { WhatsAppIcon, FacebookIcon, InstagramIcon, TikTokIcon } from './Icons';

export default function HeroSection({
  waNumber,
  storeName = 'LeisModa',
  storeSlogan = 'Tu look favorito, directo desde Paita',
  facebook = '',
  instagram = '',
  tiktok = '',
  logo = '',
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
      <div className="hero-bg" />
      <div className="hero-overlay" />
      <div className="hero-content">
        {logo && <img src={logo} alt={storeName} style={{maxHeight:60,marginBottom:'0.75rem'}} />}
        <span className="hero-eyebrow">Nueva Coleccion 2026</span>
        <h1 className="hero-title">
          {firstPart ? <>{firstPart} <span className="hero-gold">{lastWord}</span></> : <>{storeName} <span className="hero-gold">que te define</span></>}
        </h1>
        <p className="hero-subtitle">{storeSlogan}</p>
        <div className="hero-actions">
          <button className="hero-btn hero-btn-primary" onClick={scrollToProducts}>
            Ver Coleccion
          </button>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hero-btn hero-btn-secondary">
            <WhatsAppIcon size={16} /> Escríbenos
          </a>
        </div>
        <div className="hero-social">
          {facebook && (
            <a href={facebook} target="_blank" rel="noopener noreferrer" className="hero-social-link">
              <FacebookIcon size={14} /> Facebook
            </a>
          )}
          {instagram && (
            <a href={instagram} target="_blank" rel="noopener noreferrer" className="hero-social-link">
              <InstagramIcon size={14} /> Instagram
            </a>
          )}
          {tiktok && (
            <a href={tiktok} target="_blank" rel="noopener noreferrer" className="hero-social-link">
              <TikTokIcon size={14} /> TikTok
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
