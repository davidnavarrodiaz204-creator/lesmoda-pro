import { useState } from 'react';
import toast from 'react-hot-toast';
import { useCart } from './CartContext';
import { orderService } from '../services/api';
import { CloseIcon, MinusIcon, PlusIcon, TrashIcon, WhatsAppIcon, CheckIcon, CartIcon, ImageIcon } from './Icons';

export default function CartDrawer({ open, onClose, waNumber, waMessage, storeName }) {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const num = waNumber?.replace(/\D/g, '');
  const [checkout, setCheckout] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });

  const generateWAMessage = () => {
    const lines = items.map((item, i) =>
      `${i + 1}. *${item.name}* - S/ ${(item.price * item.quantity).toFixed(2)}` +
      (item.size ? `\n   Talla: ${item.size}` : '') +
      (item.color ? ` | Color: ${item.color}` : '') +
      `\n   Cant: ${item.quantity}`
    );
    const store = storeName || 'LeisModa';
    const header = `*Nuevo Pedido - ${store}*\n\n`;
    const extra = waMessage ? `\n${waMessage}\n` : '';
    const footer = `\n────────────────\n*Total: S/ ${totalPrice.toFixed(2)}*`;
    return header + lines.join('\n\n') + extra + footer;
  };

  const handleCheckout = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      return toast.error('Nombre y celular son requeridos');
    }
    setSaving(true);
    const waMsg = generateWAMessage();
    let orderSaved = false;

    try {
      await orderService.create({
        customerName: form.name.trim(),
        customerPhone: form.phone.trim(),
        customerAddress: form.address.trim(),
        items: items.map(i => ({
          productId: i._id,
          name: i.name,
          slug: i.slug || '',
          image: i.image || '',
          size: i.size,
          color: i.color,
          quantity: i.quantity,
          price: i.price,
        })),
        total: totalPrice,
        whatsappMessage: waMsg,
      });
      orderSaved = true;
    } catch {
      toast.error('No se pudo guardar el pedido, pero igual puedes enviarlo por WhatsApp');
    } finally { setSaving(false); }

    const waUrl = num ? `https://wa.me/${num}?text=${encodeURIComponent(waMsg)}` : '#';
    window.open(waUrl, '_blank');
    if (orderSaved) {
      clearCart();
      setCheckout(false);
      setSuccess(true);
      toast.success('Pedido registrado');
    }
  };

  const handleClose = () => {
    setCheckout(false);
    setSuccess(false);
    setForm({ name: '', phone: '', address: '' });
    onClose();
  };

  const statusBadge = (s) => {
    const map = { pending: { label: 'Pendiente', bg: '#FFF5E0', color: '#B8941E' } };
    return map[s] || map.pending;
  };

  return (
    <>
      <div className={`cart-overlay ${open ? 'cart-overlay-open' : ''}`} onClick={handleClose} />
      <div className={`cart-drawer ${open ? 'cart-drawer-open' : ''}`}>
        <div className="cart-header">
          <h2 className="cart-title">
            {checkout ? 'Confirmar pedido' : `Carrito ${totalItems > 0 ? `(${totalItems})` : ''}`}
          </h2>
          <button className="cart-close" onClick={handleClose}><CloseIcon size={18} /></button>
        </div>

        {success ? (
          <div className="cart-success">
            <div className="cart-success-icon"><CheckIcon size={36} /></div>
            <h3>Pedido enviado</h3>
            <p>Tu pedido fue registrado y enviado por WhatsApp.</p>
            <p className="cart-success-sub">Te responderemos pronto para coordinar la entrega.</p>
            <button className="cart-success-btn" onClick={handleClose}>
              Seguir comprando
            </button>
          </div>
        ) : items.length === 0 && !checkout ? (
          <div className="cart-empty">
            <span className="cart-empty-icon"><CartIcon size={48} /></span>
            <p>Tu carrito está vacío</p>
            <p className="cart-empty-sub">Agrega productos para empezar tu pedido</p>
          </div>
        ) : checkout ? (
          <>
            <div className="cart-items">
              {items.map(item => (
                <div key={item.key} className="cart-item">
                  <div className="cart-item-img-wrap">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="cart-item-img" />
                      : <div className="cart-item-no-img"><ImageIcon size={24} /></div>}
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-meta">
                      {item.size && <span>Talla: {item.size}</span>}
                      {item.color && <span>{item.size ? '| ' : ''}Color: {item.color}</span>}
                    </div>
                    <div className="cart-item-price">S/ {item.price.toFixed(2)} x{item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-checkout-form">
              <div className="cart-checkout-field">
                <label>Nombre *</label>
                <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  placeholder="Tu nombre" />
              </div>
              <div className="cart-checkout-field">
                <label>Celular *</label>
                <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                  placeholder="51999999999" type="tel" />
              </div>
              <div className="cart-checkout-field">
                <label>Dirección (opcional)</label>
                <input value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))}
                  placeholder="Dirección de entrega" />
              </div>
            </div>
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <span className="cart-total-price">S/ {totalPrice.toFixed(2)}</span>
              </div>
              <button className="cart-checkout-btn" onClick={handleCheckout} disabled={saving}>
                <WhatsAppIcon size={18} /> {saving ? 'Guardando…' : 'Confirmar y enviar'}
              </button>
              <button className="cart-clear-btn" onClick={() => setCheckout(false)}>
                ← Volver al carrito
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="cart-items">
              {items.map(item => (
                <div key={item.key} className="cart-item">
                  <div className="cart-item-img-wrap">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="cart-item-img" />
                      : <div className="cart-item-no-img"><ImageIcon size={24} /></div>}
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-meta">
                      {item.size && <span>Talla: {item.size}</span>}
                      {item.color && <span>{item.size ? '| ' : ''}Color: {item.color}</span>}
                    </div>
                    <div className="cart-item-price">S/ {item.price.toFixed(2)}</div>
                    <div className="cart-item-controls">
                      <button onClick={() => updateQuantity(item.key, -1)}><MinusIcon size={12} /></button>
                      <span className="cart-item-qty">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.key, 1)}><PlusIcon size={12} /></button>
                      <button className="cart-item-remove" onClick={() => removeItem(item.key)}>
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <span className="cart-total-price">S/ {totalPrice.toFixed(2)}</span>
              </div>
              <button className="cart-checkout-btn" onClick={() => setCheckout(true)}>
                <WhatsAppIcon size={18} /> Enviar pedido por WhatsApp
              </button>
              <button className="cart-clear-btn" onClick={clearCart}>
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
