export function LoadingState() {
  return (
    <div className="loading-state" role="status" aria-live="polite" aria-label="Loading products">
      <ul className="product-grid product-grid--skeleton">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i} className="product-grid__item">
            <div className="skeleton-card">
              <div className="skeleton-card__image" />
              <div className="skeleton-card__body">
                <div className="skeleton-line skeleton-line--sm" />
                <div className="skeleton-line skeleton-line--md" />
                <div className="skeleton-line skeleton-line--lg" />
                <div className="skeleton-card__btn" />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <span className="visually-hidden">Loading products…</span>
    </div>
  )
}
