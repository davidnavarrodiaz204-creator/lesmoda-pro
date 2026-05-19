import { InstagramIcon, FacebookIcon, TikTokIcon } from './Icons';

export default function SocialFollowSection({ instagram, facebook, tiktok }) {
  const links = [
    { url: instagram, icon: <InstagramIcon size={20} />, label: 'Instagram', color: '#E4405F' },
    { url: facebook,  icon: <FacebookIcon size={20} />, label: 'Facebook', color: '#1877F2' },
    { url: tiktok,    icon: <TikTokIcon size={20} />, label: 'TikTok', color: '#000000' },
  ].filter(l => l.url);

  if (links.length === 0) return null;

  return (
    <section className="social-follow">
      <div className="social-follow-inner">
        <h3 className="social-follow-title">Siguenos</h3>
        <div className="social-follow-links">
          {links.map(l => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer" className="social-follow-link" style={{ '--hover-color': l.color }}>
              {l.icon}
              <span>{l.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
