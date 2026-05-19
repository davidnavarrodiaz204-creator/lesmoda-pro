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
        {storeName} &copy; {new Date().getFullYear()} · Todos los derechos reservados
      </div>
    </footer>
  );
}

const s = {
  footer:  { background:'#1A1612', color:'#B0A899' },
  top:     { display:'flex', flexWrap:'wrap', gap:'2rem', padding:'2.5rem 1.25rem', justifyContent:'space-between', borderBottom:'1px solid rgba(201,169,110,.15)', maxWidth:1200, margin:'0 auto' },
  brand:   { flex:'1', minWidth:180 },
  logo:    { fontFamily:'serif', fontSize:'1.5rem', color:'#FAF7F2', marginBottom:'0.4rem' },
  slogan:  { fontSize:'0.85rem', color:'#8A7968', fontStyle:'italic', marginBottom:'0.75rem' },
  waLink:  { display:'inline-flex', alignItems:'center', gap:'0.35rem', color:'#25D366', fontSize:'0.82rem' },
  col:     { display:'flex', flexDirection:'column', gap:'0.5rem', minWidth:120 },
  colTitle:{ fontSize:'0.7rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'#C9A96E', fontWeight:600, marginBottom:'0.15rem' },
  link:    { display:'inline-flex', alignItems:'center', gap:'0.3rem', color:'#B0A899', fontSize:'0.85rem', textDecoration:'none' },
  text:    { fontSize:'0.85rem', color:'#8A7968' },
  bottom:  { textAlign:'center', padding:'1rem', fontSize:'0.75rem', color:'rgba(176,168,153,.4)', maxWidth:1200, margin:'0 auto' },
};
