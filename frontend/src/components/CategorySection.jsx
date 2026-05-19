import { DressIcon, NecktieIcon, HandbagIcon } from './Icons';

const CATEGORIES = [
  { key: 'Mujer', icon: <DressIcon size={28} />, label: 'Mujer', desc: 'Vestidos, tops y más' },
  { key: 'Hombre', icon: <NecktieIcon size={28} />, label: 'Hombre', desc: 'Camisas, polos y más' },
  { key: 'Accesorios', icon: <HandbagIcon size={28} />, label: 'Accesorios', desc: 'Bolsos, joyas y más' },
];

export default function CategorySection({ activeTab, onSelect }) {
  return (
    <section className="cat-section">
      <div className="cat-inner">
        <h2 className="cat-heading">Categorías</h2>
        <div className="cat-grid">
          {CATEGORIES.map(({ key, icon, label, desc }) => (
            <button
              key={key}
              className={`cat-card ${activeTab === key ? 'cat-card-active' : ''}`}
              onClick={() => onSelect(key)}
            >
              <span className="cat-icon">{icon}</span>
              <span className="cat-label">{label}</span>
              <span className="cat-desc">{desc}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
