import { useState } from 'react';
import { ShareIcon, CheckIcon } from './Icons';

export default function ShareStoreButton({ storeName }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.origin;
    if (navigator.share) {
      try {
        await navigator.share({ title: storeName || 'LeisModa', text: 'Descubre nuestra tienda online', url });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  };

  return (
    <button className="share-store-btn" onClick={handleShare} title="Compartir tienda">
      {copied ? <CheckIcon size={16} /> : <ShareIcon size={16} />}
      <span>{copied ? 'Enlace copiado' : 'Compartir tienda'}</span>
    </button>
  );
}
