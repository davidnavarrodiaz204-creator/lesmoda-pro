export function buildOrderWhatsappMessage({ storeName, customer = {}, items = [], total, customMessage }) {
  const store = storeName || 'LeisModa';
  const prefix = store.charAt(0).toUpperCase();
  const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
  const orderCode = `${prefix}${randomCode}`;
  const parts = [];

  parts.push(`Nuevo pedido - ${store}`);
  parts.push(`Pedido #${orderCode}`);
  parts.push('');

  if (customer.name || customer.phone) {
    parts.push('Cliente:');
    parts.push(`Nombre: ${customer.name || ''}`);
    parts.push(`Celular: ${customer.phone || ''}`);
    parts.push(`Direccion: ${customer.address || 'No indicada'}`);
    parts.push('');
  }

  parts.push('Productos:');
  items.forEach((item, i) => {
    const img = item.image || (item.images?.[0]?.url) || '';
    const mainImg = item.images?.find?.(im => im.isMain)?.url || img;
    parts.push(`${i + 1}. ${item.name}`);
    parts.push(`Cantidad: ${item.quantity}`);
    if (item.size && item.size !== 'No indicada' && item.size !== 'No indicado') {
      parts.push(`Talla: ${item.size}`);
    }
    if (item.color && item.color !== 'No indicado' && item.color !== 'No indicada') {
      parts.push(`Color: ${item.color}`);
    }
    parts.push(`Precio: S/ ${Number(item.price).toFixed(2)}`);
    parts.push(`Subtotal: S/ ${(item.price * item.quantity).toFixed(2)}`);
    if (mainImg) parts.push(`Imagen: ${mainImg}`);
    if (i < items.length - 1) parts.push('---');
  });

  parts.push('');
  parts.push(`Total: S/ ${Number(total).toFixed(2)}`);

  const message = customMessage || 'Hola, quiero confirmar este pedido y coordinar entrega y pago.';
  parts.push('');
  parts.push('Mensaje:');
  parts.push(message);

  return parts.join('\n');
}

function isMobile() {
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function openWhatsapp({ phone, message }) {
  const num = phone.replace(/\D/g, '');
  if (!num) return;
  const text = encodeURIComponent(message);

  if (isMobile()) {
    const mobileUrl = `whatsapp://send?phone=${num}&text=${text}`;
    const fallbackUrl = `https://wa.me/${num}?text=${text}`;
    window.location.href = mobileUrl;
    setTimeout(() => {
      if (document.hidden) return;
      window.location.href = fallbackUrl;
    }, 2000);
  } else {
    const desktopUrl = `https://web.whatsapp.com/send?phone=${num}&text=${text}`;
    const fallbackUrl = `https://wa.me/${num}?text=${text}`;
    const w = window.open(desktopUrl, 'lesmoda_whatsapp');
    if (!w || w.closed) {
      window.open(fallbackUrl, 'lesmoda_whatsapp');
    }
  }
}
