import { useState, useEffect } from 'react';
import { CloseIcon, WhatsAppIcon, TruckIcon, FireIcon, NewBadgeIcon, InstagramIcon } from './Icons';
import { useConfig } from '../hooks/useConfig';

const LS_KEY = 'lesmoda_popup_shown';
const TYPES = {
  new:    { icon: <NewBadgeIcon size={20} />, title: 'Nuevos ingresos', subtitle: 'Descubre las ultimas tendencias' },
  sale:   { icon: <FireIcon size={20} />, title: 'Oferta limitada', subtitle: 'No te pierdas estos precios' },
  free:   { icon: <TruckIcon size={20} />, title: 'Envio gratis', subtitle: 'En compras mayores a S/ 99' },
  social: { icon: <InstagramIcon size={20} />, title: 'Siguenos en Instagram', subtitle: 'Enterate de nuestras novedades' },
};

export default function PromoPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { config } = useConfig();

  useEffect(() => {
    if (config.promoPopupEnabled === false) return;
    const last = localStorage.getItem(LS_KEY);
    if (last) {
      const diff = Date.now() - Number(last);
      if (diff < 86400000) return;
    }
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, [config.promoPopupEnabled]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem(LS_KEY, String(Date.now()));
  };

  if (!visible || dismissed) return null;

  return (
    <div className="popup-overlay" onClick={handleDismiss}>
      <div className="popup-card" onClick={e => e.stopPropagation()}>
        <button className="popup-close" onClick={handleDismiss}><CloseIcon size={16} /></button>
        <div className="popup-icon-wrap">
          {TYPES.new.icon}
        </div>
        <h3 className="popup-title">Nuevos ingresos</h3>
        <p className="popup-subtitle">Descubre las ultimas tendencias en nuestra tienda</p>
        <div className="popup-actions">
          <button className="popup-btn" onClick={handleDismiss}>
            Ver coleccion
          </button>
          {config.waNumber && (
            <a href={`https://wa.me/${config.waNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="popup-wa">
              <WhatsAppIcon size={14} /> Consultar
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
