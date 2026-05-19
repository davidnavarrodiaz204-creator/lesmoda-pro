import { WhatsAppIcon } from './Icons';

export default function FloatingWhatsApp({ waNumber }) {
  const num = waNumber?.replace(/\D/g, '');
  if (!num) return null;

  const waUrl = `https://wa.me/${num}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-wa"
      aria-label="Contactar por WhatsApp"
    >
      <WhatsAppIcon size={24} />
    </a>
  );
}
