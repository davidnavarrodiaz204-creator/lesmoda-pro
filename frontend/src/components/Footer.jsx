import { Link } from 'react-router-dom';
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from './Icons';

export default function Footer({
  waNumber,
  storeName = 'LeisModa',
  storeSlogan = 'Tu look favorito, directo desde Paita',
  facebook = '',
  instagram = '',
  tiktok = '',
  hours = '',
  logo = '',
}) {
  const num = waNumber?.replace(/\D/g, '');
  const waUrl = num ? `https://wa.me/${num}` : '#';

  return (
    <footer style={s.footer}>
      <div style={s.top}>
        <div style={s.brand}>
          {logo ? (
            <img src={logo} alt={storeName} style={{maxHeight:36,marginBottom:'0.4rem'}} />
          ) : (
            <div style={s.logo}>{storeName}</div>
          )}
          <p style={s.slogan}>{storeSlogan}</p>
          {num && (
            <a href={waUrl} target="_blank" rel="noopener noreferrer" style={s.waLink}>
              <WhatsAppIcon size={14} /> {num}
            </a>
          )}
        </div>

        <div style={s.col}>
          <p style={s.colTitle}>Navegacion</p>
          <Link to="/" style={s.link}>Inicio</Link>
          <Link to="/" style={s.link}>Catalogo</Link>
          <Link to="/how-to-buy" style={s.link}>Como comprar</Link>
          <Link to="/about" style={s.link}>Sobre nosotros</Link>
        </div>

        <div style={s.col}>
          <p style={s.colTitle}>Siguenos</p>
          {facebook && (
            <a href={facebook} target="_blank" rel="noopener noreferrer" style={s.link}>
              <FacebookIcon size={13} /> Facebook
            </a>
          )}
          {instagram && (
            <a href={instagram} target="_blank" rel="noopener noreferrer" style={s.link}>
              <InstagramIcon size={13} /> Instagram
            </a>
          )}
          {tiktok && (
            <a href={tiktok} target="_blank" rel="noopener noreferrer" style={s.link}>
              <TikTokIcon size={13} /> TikTok
            </a>
          )}
        </div>

        <div style={s.col}>
          <p style={s.colTitle}>Atencion</p>
          {hours ? (
            <p style={s.text}>{hours}</p>
          ) : (
            <>
              <p style={s.text}>Lunes a Sabado</p>
              <p style={s.text}>9:00 am – 7:00 pm</p>
            </>
          )}
          <p style={s.text}>Ventas por WhatsApp</p>
        </div>
      </div>
      <div style={s.bottom}>
        {storeName} &copy; {new Date().getFullYear()} · Todos los derechos reservados · Catalogo digital administrable
      </div>
    </footer>
  );
}

const s = {
  footer:  { background:'var(--lm-secondary)', color:'var(--lm-muted)' },
  top:     { display:'flex', flexWrap:'wrap', gap:'2rem', padding:'2rem 1.25rem', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,.08)', maxWidth:1200, margin:'0 auto' },
  brand:   { flex:'1', minWidth:180 },
  logo:    { fontFamily:'var(--font-display)', fontSize:'1.35rem', color:'white', marginBottom:'0.4rem' },
  slogan:  { fontSize:'0.82rem', color:'#9CA3AF', fontStyle:'italic', marginBottom:'0.65rem' },
  waLink:  { display:'inline-flex', alignItems:'center', gap:'0.35rem', color:'var(--lm-primary)', fontSize:'0.8rem' },
  col:     { display:'flex', flexDirection:'column', gap:'0.4rem', minWidth:120 },
  colTitle:{ fontSize:'0.65rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--lm-muted)', fontWeight:600, marginBottom:'0.1rem' },
  link:    { display:'inline-flex', alignItems:'center', gap:'0.3rem', color:'#9CA3AF', fontSize:'0.82rem', textDecoration:'none' },
  text:    { fontSize:'0.82rem', color:'#9CA3AF' },
  bottom:  { textAlign:'center', padding:'1rem', fontSize:'0.72rem', color:'rgba(255,255,255,.25)', maxWidth:1200, margin:'0 auto' },
};
