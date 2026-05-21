import { useState, useEffect, useCallback } from 'react';
import { bannerService } from '../services/api';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

export default function BannerSlider() {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    bannerService.getAll()
      .then(({ data }) => setBanners(data?.data || []))
      .catch(() => {});
  }, []);

  const next = useCallback(() => setCurrent(i => (i + 1) % banners.length), [banners.length]);
  const prev = useCallback(() => setCurrent(i => (i - 1 + banners.length) % banners.length), [banners.length]);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [banners.length, next]);

  if (banners.length === 0) return null;

  const b = banners[current];

  return (
    <div className="banner-slider">
      <div className="banner-slide" style={{ background: b.color || 'var(--lm-secondary)' }}>
        <div className="banner-content">
          {b.subtitle && <span className="banner-subtitle">{b.subtitle}</span>}
          <span className="banner-text">{b.text}</span>
          {b.cta && (
            <a href={b.link || '#'} target="_blank" rel="noopener noreferrer" className="banner-cta">
              {b.cta}
            </a>
          )}
        </div>
      </div>
      {banners.length > 1 && (
        <>
          <button className="banner-nav banner-nav-prev" onClick={prev}><ChevronLeftIcon size={14} /></button>
          <button className="banner-nav banner-nav-next" onClick={next}><ChevronRightIcon size={14} /></button>
          <div className="banner-dots">
            {banners.map((_, i) => (
              <span key={i} className={`banner-dot ${i === current ? 'banner-dot-active' : ''}`} onClick={() => setCurrent(i)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
