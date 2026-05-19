export function buildOrderWhatsappMessage({ storeName, customer = {}, items = [], total, customMessage }) {
  const store = storeName || 'LeisModa';
  const parts = [];

  parts.push(`Nuevo pedido - ${store}`);
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
    parts.push(`Talla: ${item.size || 'No indicada'}`);
    parts.push(`Color: ${item.color || 'No indicado'}`);
    parts.push(`Precio: S/ ${Number(item.price).toFixed(2)}`);
    parts.push(`Subtotal: S/ ${(item.price * item.quantity).toFixed(2)}`);
    if (mainImg) parts.push(`Imagen: ${mainImg}`);
  });

  parts.push('');
  parts.push(`Total: S/ ${Number(total).toFixed(2)}`);

  if (customMessage) {
    parts.push('');
    parts.push('Mensaje:');
    parts.push(customMessage);
  }

  return parts.join('\n');
}

export function openWhatsapp({ phone, message }) {
  const num = phone.replace(/\D/g, '');
  if (!num) return;
  const url = `https://api.whatsapp.com/send?phone=${num}&text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}
