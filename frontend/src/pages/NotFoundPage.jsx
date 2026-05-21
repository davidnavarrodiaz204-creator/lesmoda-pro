import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { configService } from '../services/api';
import { WhatsAppIcon, SearchIcon } from '../components/Icons';

export default function NotFoundPage() {
  const [waNumber, setWaNumber] = useState('');

  useEffect(() => {
    configService.get().then(({ data }) => setWaNumber(data.data?.waNumber || '')).catch(() => {});
    document.title = 'Página no encontrada — LeisModa';
  }, []);

  const num = waNumber?.replace(/\D/g, '');
  const waUrl = num ? `https://wa.me/${num}` : '#';

  return (
    <div style={{
      minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',
      justifyContent:'center',background:'var(--lm-bg)',padding:'2rem',textAlign:'center',
    }}>
      <div style={{marginBottom:'1rem',color:'var(--lm-muted)',opacity:0.4}}><SearchIcon size={64} /></div>
      <h1 style={{fontFamily:'var(--lm-font-heading, serif)',fontSize:'2rem',color:'var(--lm-text)',marginBottom:'0.5rem'}}>
        Página no encontrada
      </h1>
      <p style={{color:'var(--lm-muted)',fontSize:'0.95rem',maxWidth:400,lineHeight:1.6,marginBottom:'2rem'}}>
        La página que buscas no existe o fue movida. Puedes volver al catálogo o consultarnos por WhatsApp.
      </p>
      <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap',justifyContent:'center'}}>
        <Link to="/" style={{
          background:'var(--lm-secondary)',color:'var(--lm-primary)',padding:'0.75rem 1.75rem',
          borderRadius:999,fontWeight:600,fontSize:'0.9rem',textDecoration:'none',
        }}>
          ← Volver al catálogo
        </Link>
        <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{
          display:'inline-flex',alignItems:'center',gap:'0.5rem',
          background:'#25D366',color:'white',padding:'0.75rem 1.75rem',
          borderRadius:999,fontWeight:600,fontSize:'0.9rem',textDecoration:'none',
        }}>
          <WhatsAppIcon size={16} /> Contactar
        </a>
      </div>
    </div>
  );
}
