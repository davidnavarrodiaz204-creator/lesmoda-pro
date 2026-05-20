import { useEffect } from 'react';
import { WhatsAppIcon } from './Icons';

export default function FloatingWhatsApp({ waNumber, onTrack }) {
  const num = waNumber?.replace(/\D/g, '');
  if (!num) return null;

  const waUrl = `https://wa.me/${num}`;

  useEffect(() => {
    if (!window.visualViewport) return;
    const handler = () => {
      const vh = window.visualViewport.height;
      const dh = window.innerHeight;
      const offset = Math.max(0, dh - vh);
      const body = document.body;
      if (offset > 100) {
        body.classList.add('keyboard-open');
      } else {
        body.classList.remove('keyboard-open');
      }
    };
    window.visualViewport.addEventListener('resize', handler);
    return () => window.visualViewport.removeEventListener('resize', handler);
  }, []);

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-wa"
      aria-label="Contactar por WhatsApp"
      onClick={() => onTrack?.()}
    >
      <WhatsAppIcon size={20} />
    </a>
  );
}
