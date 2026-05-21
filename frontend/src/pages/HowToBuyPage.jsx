import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { configService } from '../services/api';
import { CartIcon, ChatIcon, HandshakeIcon, LightbulbIcon, DressIcon } from '../components/Icons';

const STEPS = [
  { icon: <DressIcon size={24} />, title: 'Explora el catálogo', desc: 'Navega por nuestras categorías: Mujer, Hombre y Accesorios. Encuentra las prendas que más te gusten.' },
  { icon: <CartIcon size={24} />, title: 'Agrega al carrito', desc: 'Selecciona tu talla y color, elige la cantidad y agrega los productos a tu carrito de compras.' },
  { icon: <ChatIcon size={24} />, title: 'Envía tu pedido por WhatsApp', desc: 'Completa tus datos (nombre y celular) y envía el pedido directo a nuestro WhatsApp. Incluye todos los productos seleccionados.' },
  { icon: <HandshakeIcon size={24} />, title: 'Coordinamos pago y entrega', desc: 'Te contactamos para coordinar el pago (Yape, Plin, transferencia) y la entrega en Paita y zonas cercanas.' },
];

export default function HowToBuyPage() {
  const [config, setConfig] = useState({ waNumber: '', storeName: 'LeisModa' });

  useEffect(() => {
    configService.get().then(({ data }) => setConfig(c => ({ ...c, ...data.data }))).catch(() => {});
  }, []);

  useEffect(() => {
    document.title = `${config.storeName} — Cómo comprar`;
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
            Cómo comprar
          </h1>
          <p className="hero-subtitle">Comprar en {config.storeName} es muy fácil</p>
        </div>
      </section>

      <section style={s.section}>
        <div style={s.card}>
          <h2 style={s.h2}>Sigue estos pasos</h2>
          <div style={{display:'flex',flexDirection:'column',gap:'1.25rem',marginTop:'1.25rem'}}>
            {STEPS.map((step, i) => (
              <div key={i} style={{display:'flex',gap:'1rem',alignItems:'flex-start'}}>
                <div style={{
                  width:48,height:48,borderRadius:'50%',background:'var(--lm-secondary)',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  flexShrink:0, color:'var(--lm-primary)',
                }}>{step.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.25rem'}}>
                    <span style={{
                      width:20,height:20,borderRadius:'50%',background:'var(--lm-primary)',
                      color:'white',fontSize:'0.72rem',fontWeight:700,
                      display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
                    }}>{i + 1}</span>
                    <h3 style={{fontSize:'1rem',fontWeight:600,color:'var(--lm-text)'}}>{step.title}</h3>
                  </div>
                  <p style={{fontSize:'0.85rem',color:'var(--lm-muted)',lineHeight:1.6,marginLeft:'1.75rem'}}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{...s.card,background:'var(--lm-secondary)',textAlign:'center'}}>
          <h2 style={{...s.h2,color:'var(--lm-surface)'}}>¿Listo para empezar?</h2>
          <p style={{color:'var(--lm-muted)',fontSize:'0.88rem',marginTop:'0.5rem'}}>
            Explora nuestro catálogo y arma tu pedido
          </p>
          <Link to="/" style={{
            display:'inline-block',marginTop:'1rem',background:'var(--lm-primary)',color:'white',
            padding:'0.75rem 2rem',borderRadius:999,fontWeight:600,fontSize:'0.9rem',textDecoration:'none',
          }}>
            Ver catálogo
          </Link>
        </div>

        <div style={s.card}>
          <h2 style={s.h2}>Medios de pago</h2>
          <p style={s.p}>Aceptamos los siguientes medios de pago:</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:'0.75rem',marginTop:'0.75rem'}}>
            {['Yape', 'Plin', 'Transferencia bancaria', 'Efectivo (entrega)'].map((m, i) => (
              <span key={i} style={{
                padding:'0.4rem 1rem',borderRadius:999,border:'1px solid var(--lm-border)',
                fontSize:'0.82rem',color:'var(--lm-text)',fontWeight:500,
              }}>{m}</span>
            ))}
          </div>
          <p style={{...s.p,marginTop:'1rem',fontSize:'0.8rem'}}>
            <LightbulbIcon size={14} /> No realizamos cobros online. Todo el proceso de pago se coordina por WhatsApp después de realizar tu pedido.
          </p>
        </div>

        <div style={s.card}>
          <h2 style={s.h2}>Envíos</h2>
          <p style={s.p}>
            Realizamos envíos en Paita y zonas cercanas. Coordinamos la entrega directamente contigo por WhatsApp.
            Para otras ciudades, consulta disponibilidad.
          </p>
        </div>
      </section>

      <Footer waNumber={config.waNumber} storeName={config.storeName} />
    </div>
  );
}

const headerS = {
  background:'var(--lm-secondary)', height:60, display:'flex', alignItems:'center',
  padding:'0 1.25rem', fontFamily:'var(--lm-font-heading, serif)', fontSize:'1.5rem', color:'var(--lm-surface)',
  textDecoration:'none',
};

const s = {
  hero: { position:'relative', minHeight:'40vh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', background:'var(--lm-secondary)' },
  section: { maxWidth:800, margin:'0 auto', padding:'2rem 1.25rem 4rem', display:'flex', flexDirection:'column', gap:'1.5rem' },
  card: { background:'var(--lm-surface)', borderRadius:12, padding:'1.5rem', boxShadow:'0 2px 16px rgba(0,0,0,.06)' },
  h2: { fontFamily:'var(--lm-font-heading, serif)', fontSize:'1.2rem', color:'var(--lm-text)' },
  p: { fontSize:'0.85rem', color:'var(--lm-muted)', lineHeight:1.6, marginTop:'0.5rem', fontWeight:300 },
};
