import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { configService } from '../services/api';
import { FacebookIcon, TikTokIcon, WhatsAppIcon, DressIcon, ChatIcon, TruckIcon, LockIcon } from '../components/Icons';

export default function AboutPage() {
  const [config, setConfig] = useState({ waNumber: '', storeName: 'LeisModa', storeSlogan: '' });

  useEffect(() => {
    configService.get().then(({ data }) => setConfig(c => ({ ...c, ...data.data }))).catch(() => {});
  }, []);

  const num = config.waNumber?.replace(/\D/g, '');
  const waUrl = num ? `https://wa.me/${num}` : '#';

  useEffect(() => {
    document.title = `${config.storeName} — Sobre nosotros`;
  }, [config.storeName]);

  return (
    <div className="store-page">
      <header style={headerS}>
        <Link to="/" style={headerS.logo}>{config.storeName}</Link>
      </header>

      <section style={s.hero}>
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content" style={{padding:'4rem 2rem'}}>
          <h1 className="hero-title" style={{fontSize:'clamp(2rem,5vw,3.5rem)'}}>
            Sobre <span className="hero-gold">nosotros</span>
          </h1>
          <p className="hero-subtitle">Conoce más sobre {config.storeName}</p>
        </div>
      </section>

      <section style={s.section}>
        <div style={s.card}>
          <h2 style={s.h2}>Nuestra historia</h2>
          <p style={s.p}>
            {config.storeName} nació en Paita con la misión de ofrecer moda accesible, moderna y de calidad.
            Creemos que la ropa es una forma de expresión y trabajamos para traerte las mejores tendencias
            directo a tu puerta.
          </p>
          <p style={s.p}>
            Cada prenda es seleccionada pensando en ti, combinando estilo, comodidad y los mejores precios.
            Nos encanta verte lucir bien.
          </p>
        </div>

        <div style={s.card}>
          <h2 style={s.h2}>Por qué comprar con nosotros</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'1rem',marginTop:'1rem'}}>
              {[
                { icon: <DressIcon size={28} />, title: 'Moda seleccionada', desc: 'Prendas elegidas con estilo y calidad' },
                { icon: <ChatIcon size={28} />, title: 'Atención personalizada', desc: 'Te respondemos directo por WhatsApp' },
                { icon: <TruckIcon size={28} />, title: 'Envío a tu ciudad', desc: 'Coordinamos la entrega contigo' },
                { icon: <LockIcon size={28} />, title: 'Compra segura', desc: 'Sin pago online, todo por WhatsApp' },
              ].map((item, i) => (
                <div key={i} style={{textAlign:'center',padding:'1.25rem',background:'#FAF7F2',borderRadius:12}}>
                  <div style={{marginBottom:'0.5rem',color:'#8A7968'}}>{item.icon}</div>
                <h3 style={{fontSize:'0.95rem',fontWeight:600,color:'#1A1612',marginBottom:'0.3rem'}}>{item.title}</h3>
                <p style={{fontSize:'0.82rem',color:'#8A7968'}}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={s.card}>
          <h2 style={s.h2}>Contacto</h2>
          <div style={{display:'flex',flexDirection:'column',gap:'0.75rem',marginTop:'0.75rem'}}>
            {num && (
              <a href={waUrl} target="_blank" rel="noopener noreferrer" style={s.contactBtn}>
                <WhatsAppIcon size={18} /> {config.waNumber}
              </a>
            )}
            <div style={{display:'flex',gap:'0.75rem'}}>
              <a href="https://www.facebook.com/share/1ApPvvscHt/" target="_blank" rel="noopener noreferrer" style={s.socialBtn}>
                <FacebookIcon size={16} /> Facebook
              </a>
              <a href="https://www.tiktok.com/@steffan578" target="_blank" rel="noopener noreferrer" style={s.socialBtn}>
                <TikTokIcon size={16} /> TikTok
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer waNumber={config.waNumber} storeName={config.storeName} />
    </div>
  );
}

const headerS = {
  background:'#1A1612', height:60, display:'flex', alignItems:'center',
  padding:'0 1.25rem', fontFamily:'serif', fontSize:'1.5rem', color:'#FAF7F2',
  textDecoration:'none',
};

const s = {
  hero: { position:'relative', minHeight:'40vh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', background:'#1A1612' },
  section: { maxWidth:800, margin:'0 auto', padding:'2rem 1.25rem', display:'flex', flexDirection:'column', gap:'1.5rem' },
  card: { background:'white', borderRadius:12, padding:'1.5rem', boxShadow:'0 2px 16px rgba(0,0,0,.06)' },
  h2: { fontFamily:'serif', fontSize:'1.2rem', color:'#1A1612' },
  p: { fontSize:'0.88rem', color:'#8A7968', lineHeight:1.7, marginTop:'0.75rem', fontWeight:300 },
  contactBtn: { display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'#25D366', color:'white', padding:'0.7rem 1.25rem', borderRadius:10, fontWeight:600, fontSize:'0.9rem', textDecoration:'none', width:'fit-content' },
  socialBtn: { display:'inline-flex', alignItems:'center', gap:'0.4rem', border:'1px solid #E0D8CE', padding:'0.5rem 1rem', borderRadius:999, fontSize:'0.82rem', color:'#8A7968', textDecoration:'none' },
};
