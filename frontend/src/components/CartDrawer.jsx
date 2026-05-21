import { useState } from 'react';
import toast from 'react-hot-toast';
import { useCart } from './CartContext';
import { orderService } from '../services/api';
import { CloseIcon, MinusIcon, PlusIcon, TrashIcon, WhatsAppIcon, CheckIcon, CartIcon, ImageIcon, LockIcon } from './Icons';
import { buildOrderWhatsappMessage, openWhatsapp } from '../utils/whatsappMessage';

export default function CartDrawer({ open, onClose, waNumber, waMessage, storeName, trustText = '' }) {
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
            <div style={{ background: 'var(--lm-success)', color: '#fff', borderRadius: '50%', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <CheckIcon size={28} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px', color: 'var(--lm-text)' }}>Pedido enviado</h3>
            <p style={{ color: 'var(--lm-muted)', margin: '0 0 4px', fontSize: 14, lineHeight: 1.5 }}>Tu pedido fue registrado y enviado por WhatsApp.</p>
            <p className="cart-success-sub" style={{ color: 'var(--lm-muted)', fontSize: 12, margin: '0 0 24px', opacity: 0.6 }}>Te responderemos pronto para coordinar la entrega.</p>
            <button className="cart-success-btn" onClick={handleClose} style={{ padding: '12px 32px', background: 'var(--lm-secondary)', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
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
            <div className="cart-items" style={{ flex: 1, overflowY: 'auto', padding: '0 1rem' }}>
              {items.map(item => (
                <div key={item.key} className="cart-item" style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--lm-border)' }}>
                  <div className="cart-item-img-wrap" style={{ width: 48, height: 48, minWidth: 48, borderRadius: 6, overflow: 'hidden', background: 'var(--lm-surface-2)' }}>
                    {item.image
                      ? <img src={item.image} alt={item.name} className="cart-item-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div className="cart-item-no-img" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={16} /></div>}
                  </div>
                  <div className="cart-item-info" style={{ flex: 1, minWidth: 0 }}>
                    <div className="cart-item-name" style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--lm-text)' }}>{item.name}</div>
                    <div className="cart-item-meta" style={{ fontSize: 11, color: 'var(--lm-muted)', marginBottom: 4 }}>
                      {item.size && <span>Talla: {item.size}</span>}
                      {item.color && <span>{item.size ? ' | ' : ''}Color: {item.color}</span>}
                    </div>
                    <div className="cart-item-price" style={{ fontSize: 13, fontWeight: 600, color: 'var(--lm-text)' }}>S/ {item.price.toFixed(2)} x{item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-checkout-form" style={{ padding: '12px 16px', borderTop: '1px solid var(--lm-border)' }}>
              <div className="cart-checkout-field" style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--lm-muted)', marginBottom: 4 }}>Nombre *</label>
                <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  placeholder="Tu nombre" autoComplete="name"
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--lm-border)', borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: 'var(--lm-text)', background: 'var(--lm-surface)' }}
                  onFocus={e => { e.target.style.boxShadow = '0 0 0 3px var(--lm-focus-ring)'; e.target.style.borderColor = 'var(--lm-primary)' }}
                  onBlur={e => { e.target.style.boxShadow = 'none'; e.target.style.borderColor = 'var(--lm-border)' }} />
              </div>
              <div className="cart-checkout-field" style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--lm-muted)', marginBottom: 4 }}>Celular *</label>
                <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                  placeholder="51999999999" type="tel" autoComplete="tel"
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--lm-border)', borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: 'var(--lm-text)', background: 'var(--lm-surface)' }}
                  onFocus={e => { e.target.style.boxShadow = '0 0 0 3px var(--lm-focus-ring)'; e.target.style.borderColor = 'var(--lm-primary)' }}
                  onBlur={e => { e.target.style.boxShadow = 'none'; e.target.style.borderColor = 'var(--lm-border)' }} />
              </div>
              <div className="cart-checkout-field" style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--lm-muted)', marginBottom: 4 }}>Direccion (opcional)</label>
                <input value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))}
                  placeholder="Direccion de entrega" autoComplete="street-address"
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--lm-border)', borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: 'var(--lm-text)', background: 'var(--lm-surface)' }}
                  onFocus={e => { e.target.style.boxShadow = '0 0 0 3px var(--lm-focus-ring)'; e.target.style.borderColor = 'var(--lm-primary)' }}
                  onBlur={e => { e.target.style.boxShadow = 'none'; e.target.style.borderColor = 'var(--lm-border)' }} />
              </div>
            </div>
            <div className="cart-footer" style={{ padding: 16, borderTop: '1px solid var(--lm-border)' }}>
              <div className="cart-total" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--lm-text)' }}>Total</span>
                <span className="cart-total-price" style={{ fontWeight: 700, fontSize: 18, color: 'var(--lm-text)' }}>S/ {totalPrice.toFixed(2)}</span>
              </div>
              <button className="cart-checkout-btn" onClick={handleCheckout} disabled={saving}
                style={{ width: '100%', padding: 14, background: 'var(--lm-wa)', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, transition: 'opacity 0.2s, transform 0.15s' }}>
                <WhatsAppIcon size={20} /> {saving ? 'Guardando...' : 'Confirmar y enviar'}
              </button>
              <button className="cart-clear-btn" onClick={() => setCheckout(false)}
                style={{ width: '100%', padding: 10, marginTop: 8, background: 'transparent', border: '1.5px solid var(--lm-border)', borderRadius: 6, color: 'var(--lm-muted)', fontSize: 13, cursor: 'pointer' }}>
                ← Volver al carrito
              </button>
            </div>
          </>        
        ) : (
          <>
            <div className="cart-items" style={{ flex: 1, overflowY: 'auto', padding: '0 1rem' }}>
              {items.map(item => (
                <div key={item.key} className="cart-item" style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--lm-border)' }}>
                  <div className="cart-item-img-wrap" style={{ width: 52, height: 52, minWidth: 52, borderRadius: 6, overflow: 'hidden', background: 'var(--lm-surface-2)' }}>
                    {item.image
                      ? <img src={item.image} alt={item.name} className="cart-item-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div className="cart-item-no-img" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={16} /></div>}
                  </div>
                  <div className="cart-item-info" style={{ flex: 1, minWidth: 0 }}>
                    <div className="cart-item-name" style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--lm-text)' }}>{item.name}</div>
                    <div className="cart-item-meta" style={{ fontSize: 11, color: 'var(--lm-muted)', marginBottom: 4 }}>
                      {item.size && <span>Talla: {item.size}</span>}
                      {item.color && <span>{item.size ? ' | ' : ''}Color: {item.color}</span>}
                    </div>
                    <div className="cart-item-price" style={{ fontSize: 13, fontWeight: 700, color: 'var(--lm-text)', marginBottom: 6 }}>S/ {item.price.toFixed(2)}</div>
                    <div className="cart-item-controls" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => updateQuantity(item.key, -1)} style={{ width: 24, height: 24, borderRadius: 4, border: '1px solid var(--lm-border)', background: 'var(--lm-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><MinusIcon size={11} /></button>
                      <span className="cart-item-qty" style={{ fontSize: 13, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.key, 1)} style={{ width: 24, height: 24, borderRadius: 4, border: '1px solid var(--lm-border)', background: 'var(--lm-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><PlusIcon size={11} /></button>
                      <button className="cart-item-remove" onClick={() => removeItem(item.key)} style={{ marginLeft: 'auto', width: 24, height: 24, borderRadius: 4, border: 'none', background: '#FEF2F2', color: 'var(--lm-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <TrashIcon size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer" style={{ borderTop: '1px solid var(--lm-border)', padding: 16 }}>
              <div style={{ padding: '0 0 10px', borderBottom: '1px solid var(--lm-border)', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--lm-muted)' }}>
                  <span>{totalItems} {totalItems === 1 ? 'producto' : 'productos'}</span>
                  <span>S/ {totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <div className="cart-total" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--lm-text)' }}>Total</span>
                <span className="cart-total-price" style={{ fontWeight: 800, fontSize: 20, color: 'var(--lm-text)' }}>S/ {totalPrice.toFixed(2)}</span>
              </div>
              {trustText && (
                <div className="cta-trust"><LockIcon size={12} /> {trustText}</div>
              )}
              <button className="cart-checkout-btn" onClick={() => setCheckout(true)}
                style={{ width: '100%', padding: 16, background: 'var(--lm-wa)', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', transition: 'opacity 0.2s' }}>
                <WhatsAppIcon size={20} /> Enviar pedido por WhatsApp
              </button>
              <button className="cart-clear-btn" onClick={clearCart}
                style={{ width: '100%', padding: 12, marginTop: 8, background: 'transparent', border: '1.5px solid var(--lm-border)', borderRadius: 6, color: 'var(--lm-muted)', fontSize: 13, cursor: 'pointer' }}>
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </div>
      <style>{`
        .cart-item { animation:fadeInUp .25s ease both; }
        .cart-item:nth-child(1) { animation-delay:0s; }
        .cart-item:nth-child(2) { animation-delay:.04s; }
        .cart-item:nth-child(3) { animation-delay:.08s; }
        .cart-item:nth-child(4) { animation-delay:.12s; }
        .cart-item:nth-child(5) { animation-delay:.16s; }
      `}</style>
    </>
  );
}
