import { useState } from 'react';
import toast from 'react-hot-toast';
import { useCart } from './CartContext';
import { orderService } from '../services/api';
import { CloseIcon, MinusIcon, PlusIcon, TrashIcon, WhatsAppIcon, CheckIcon, CartIcon, ImageIcon } from './Icons';
import { buildOrderWhatsappMessage, openWhatsapp } from '../utils/whatsappMessage';

export default function CartDrawer({ open, onClose, waNumber, waMessage, storeName }) {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const [checkout, setCheckout] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });

  const handleCheckout = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      return toast.error('Nombre y celular son requeridos');
    }
    setSaving(true);

    const msg = buildOrderWhatsappMessage({
      storeName,
      customer: { name: form.name.trim(), phone: form.phone.trim(), address: form.address.trim() },
      items,
      total: totalPrice,
      customMessage: waMessage,
    });

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
        whatsappMessage: msg,
      });
      orderSaved = true;
    } catch {
      toast.error('No se pudo guardar el pedido, pero igual puedes enviarlo por WhatsApp');
    } finally { setSaving(false); }

    if (waNumber) openWhatsapp({ phone: waNumber, message: msg });
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
      <div
        className={`cart-overlay ${open ? 'cart-overlay-open' : ''}`}
        onClick={handleClose}
        style={{ opacity: open ? 1 : 0, transition: 'opacity 0.3s ease' }}
      />
      <div
        className={`cart-drawer ${open ? 'cart-drawer-open' : ''}`}
        style={{
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="cart-header">
          <h2 className="cart-title">
            {checkout ? 'Confirmar pedido' : `Carrito ${totalItems > 0 ? `(${totalItems})` : ''}`}
          </h2>
          <button className="cart-close" onClick={handleClose}><CloseIcon size={18} /></button>
        </div>

        {success ? (
          <div className="cart-success" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: 40, textAlign: 'center' }}>
            <div style={{ background: '#10b981', color: '#fff', borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <CheckIcon size={32} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px', color: '#111827' }}>Pedido enviado</h3>
            <p style={{ color: '#6b7280', margin: '0 0 4px', fontSize: 14, lineHeight: 1.5 }}>Tu pedido fue registrado y enviado por WhatsApp.</p>
            <p className="cart-success-sub" style={{ color: '#9ca3af', fontSize: 13, margin: '0 0 24px' }}>Te responderemos pronto para coordinar la entrega.</p>
            <button className="cart-success-btn" onClick={handleClose} style={{ padding: '12px 32px', background: '#111827', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
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
            <div className="cart-items" style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
              {items.map(item => (
                <div key={item.key} className="cart-item" style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <div className="cart-item-img-wrap" style={{ width: 52, height: 52, minWidth: 52, borderRadius: 8, overflow: 'hidden', background: '#f9fafb' }}>
                    {item.image
                      ? <img src={item.image} alt={item.name} className="cart-item-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div className="cart-item-no-img" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={18} /></div>}
                  </div>
                  <div className="cart-item-info" style={{ flex: 1, minWidth: 0 }}>
                    <div className="cart-item-name" style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                    <div className="cart-item-meta" style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>
                      {item.size && <span>Talla: {item.size}</span>}
                      {item.color && <span>{item.size ? ' | ' : ''}Color: {item.color}</span>}
                    </div>
                    <div className="cart-item-price" style={{ fontSize: 13, fontWeight: 600 }}>S/ {item.price.toFixed(2)} x{item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-checkout-form" style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6' }}>
              <div className="cart-checkout-field" style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Nombre *</label>
                <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  placeholder="Tu nombre" autoComplete="name"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, outline: 'none', transition: 'box-shadow 0.2s, border-color 0.2s', boxSizing: 'border-box' }}
                  onFocus={e => { e.target.style.boxShadow = '0 0 0 3px rgba(251,191,36,0.25)'; e.target.style.borderColor = '#f59e0b' }}
                  onBlur={e => { e.target.style.boxShadow = 'none'; e.target.style.borderColor = '#d1d5db' }} />
              </div>
              <div className="cart-checkout-field" style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Celular *</label>
                <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                  placeholder="51999999999" type="tel" autoComplete="tel"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, outline: 'none', transition: 'box-shadow 0.2s, border-color 0.2s', boxSizing: 'border-box' }}
                  onFocus={e => { e.target.style.boxShadow = '0 0 0 3px rgba(251,191,36,0.25)'; e.target.style.borderColor = '#f59e0b' }}
                  onBlur={e => { e.target.style.boxShadow = 'none'; e.target.style.borderColor = '#d1d5db' }} />
              </div>
              <div className="cart-checkout-field" style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Dirección (opcional)</label>
                <input value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))}
                  placeholder="Dirección de entrega" autoComplete="street-address"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, outline: 'none', transition: 'box-shadow 0.2s, border-color 0.2s', boxSizing: 'border-box' }}
                  onFocus={e => { e.target.style.boxShadow = '0 0 0 3px rgba(251,191,36,0.25)'; e.target.style.borderColor = '#f59e0b' }}
                  onBlur={e => { e.target.style.boxShadow = 'none'; e.target.style.borderColor = '#d1d5db' }} />
              </div>
            </div>
            <div className="cart-footer" style={{ padding: 16, borderTop: '1px solid #f3f4f6' }}>
              <div className="cart-total" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontWeight: 600, fontSize: 15 }}>Total</span>
                <span className="cart-total-price" style={{ fontWeight: 700, fontSize: 18, color: '#111' }}>S/ {totalPrice.toFixed(2)}</span>
              </div>
              <button className="cart-checkout-btn" onClick={handleCheckout} disabled={saving}
                style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, transition: 'opacity 0.2s, transform 0.15s' }}>
                <WhatsAppIcon size={20} /> {saving ? 'Guardando...' : 'Confirmar y enviar'}
              </button>
              <button className="cart-clear-btn" onClick={() => setCheckout(false)}
                style={{ width: '100%', padding: 10, marginTop: 8, background: 'transparent', border: '1px solid #d1d5db', borderRadius: 8, color: '#6b7280', fontSize: 13, cursor: 'pointer' }}>
                ← Volver al carrito
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="cart-items" style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
              {items.map(item => (
                <div key={item.key} className="cart-item" style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <div className="cart-item-img-wrap" style={{ width: 56, height: 56, minWidth: 56, borderRadius: 8, overflow: 'hidden', background: '#f9fafb' }}>
                    {item.image
                      ? <img src={item.image} alt={item.name} className="cart-item-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div className="cart-item-no-img" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={18} /></div>}
                  </div>
                  <div className="cart-item-info" style={{ flex: 1, minWidth: 0 }}>
                    <div className="cart-item-name" style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                    <div className="cart-item-meta" style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>
                      {item.size && <span>Talla: {item.size}</span>}
                      {item.color && <span>{item.size ? ' | ' : ''}Color: {item.color}</span>}
                    </div>
                    <div className="cart-item-price" style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 6 }}>S/ {item.price.toFixed(2)}</div>
                    <div className="cart-item-controls" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => updateQuantity(item.key, -1)} style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><MinusIcon size={11} /></button>
                      <span className="cart-item-qty" style={{ fontSize: 13, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.key, 1)} style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><PlusIcon size={11} /></button>
                      <button className="cart-item-remove" onClick={() => removeItem(item.key)} style={{ marginLeft: 'auto', width: 26, height: 26, borderRadius: 6, border: 'none', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <TrashIcon size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer" style={{ borderTop: '1px solid #f3f4f6', padding: 16 }}>
              <div style={{ padding: '0 0 10px', borderBottom: '1px solid #f3f4f6', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6b7280' }}>
                  <span>{totalItems} {totalItems === 1 ? 'producto' : 'productos'}</span>
                  <span>S/ {totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <div className="cart-total" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
                <span className="cart-total-price" style={{ fontWeight: 800, fontSize: 20, color: '#111' }}>S/ {totalPrice.toFixed(2)}</span>
              </div>
              <button className="cart-checkout-btn" onClick={() => setCheckout(true)}
                style={{ width: '100%', padding: 16, background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', transition: 'opacity 0.2s, transform 0.15s', animation: 'cartPulse 2s ease-in-out 3' }}>
                <WhatsAppIcon size={20} /> Enviar pedido por WhatsApp
              </button>
              <button className="cart-clear-btn" onClick={clearCart}
                style={{ width: '100%', padding: 12, marginTop: 8, background: 'transparent', border: '1px solid #d1d5db', borderRadius: 8, color: '#6b7280', fontSize: 13, cursor: 'pointer' }}>
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </div>
      <style>{`
        @keyframes cartPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(251,191,36,0); }
          50% { transform: scale(1.02); box-shadow: 0 0 0 6px rgba(251,191,36,0.25); }
        }
      `}</style>
    </>
  );
}
