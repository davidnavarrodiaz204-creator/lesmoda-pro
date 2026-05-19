export default function PromoBanner({ text = 'Envio gratis en compras desde S/ 99', minAmount }) {
  const displayText = minAmount
    ? text || `Envio gratis en compras desde S/ ${minAmount}`
    : text;

  return (
    <section className="promo-banner">
      <div className="promo-inner">
        <span className="promo-badge">Envio gratis</span>
        <p className="promo-text">{displayText}</p>
      </div>
    </section>
  );
}
