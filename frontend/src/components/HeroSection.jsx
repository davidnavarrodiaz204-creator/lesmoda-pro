import { WhatsAppIcon, FacebookIcon, TikTokIcon } from './Icons';

export default function HeroSection({ waNumber }) {
  const num = waNumber?.replace(/\D/g, '');
  const waUrl = num ? `https://wa.me/${num}` : '#';

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section">
      <div className="hero-bg" />
      <div className="hero-overlay" />
      <div className="hero-content">
        <span className="hero-eyebrow">Nueva Colección 2026</span>
        <h1 className="hero-title">
          Moda que te <span className="hero-gold">define</span>
        </h1>
        <p className="hero-subtitle">Tu look favorito, directo desde Paita</p>
        <div className="hero-actions">
          <button className="hero-btn hero-btn-primary" onClick={scrollToProducts}>
            Ver Colección
          </button>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hero-btn hero-btn-secondary">
            <WhatsAppIcon size={16} /> Escríbenos
          </a>
        </div>
        <div className="hero-social">
          <a href="https://www.facebook.com/share/1ApPvvscHt/" target="_blank" rel="noopener noreferrer" className="hero-social-link">
            <FacebookIcon size={14} /> Facebook
          </a>
          <a href="https://www.tiktok.com/@steffan578" target="_blank" rel="noopener noreferrer" className="hero-social-link">
            <TikTokIcon size={14} /> TikTok
          </a>
        </div>
      </div>
    </section>
  );
}
