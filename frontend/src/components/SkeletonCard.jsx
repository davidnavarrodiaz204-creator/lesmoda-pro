export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img" />
      <div className="skeleton-body">
        <div className="skeleton-line skeleton-cat" />
        <div className="skeleton-line skeleton-name" />
        <div className="skeleton-line skeleton-name short" />
        <div className="skeleton-footer">
          <div className="skeleton-line skeleton-price" />
          <div className="skeleton-btn" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="lm-product-grid">
      {Array.from({ length: count }, (_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
