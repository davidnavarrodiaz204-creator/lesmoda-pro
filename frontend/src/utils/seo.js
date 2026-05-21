export function setMeta(props) {
  const { title, description, image, url, type = 'website', favicon, indexable = true } = props;
  const d = document;
  const siteTitle = title || 'LeisModa';
  const siteDesc = description || 'Tienda de ropa online en Paita. Moda para Mujer, Hombre y Accesorios. Compra por WhatsApp.';
  const siteUrl = url || d.location.href;
  const siteImage = image || '/icons/icon.svg';

  d.title = siteTitle;

  setMetaTag('description', siteDesc);
  setMetaTag('og:title', siteTitle);
  setMetaTag('og:description', siteDesc);
  setMetaTag('og:image', siteImage);
  setMetaTag('og:url', siteUrl);
  setMetaTag('og:type', type);
  setMetaTag('twitter:title', siteTitle);
  setMetaTag('twitter:description', siteDesc);
  setMetaTag('twitter:image', siteImage);
  setMetaTag('twitter:card', 'summary_large_image');
  setMetaTag('robots', indexable ? 'index,follow' : 'noindex,nofollow');

  setCanonical(siteUrl);
  setFavicon(favicon);
}

function setMetaTag(name, content) {
  if (!content) return;
  let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      el.setAttribute('property', name);
    } else {
      el.setAttribute('name', name);
    }
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(url) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', url);
}

function setFavicon(href) {
  if (!href) return;
  let el = document.querySelector('link[rel="icon"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'icon');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function injectStructuredData(schema) {
  if (!schema) return;
  const el = document.createElement('script');
  el.type = 'application/ld+json';
  el.textContent = JSON.stringify(schema);
  document.head.appendChild(el);
}

export function getDomain() {
  return window.location.origin;
}
