import { useEffect } from 'react';
import { useConfig } from '../hooks/useConfig';

export function applyConfigStyles(cfg = {}) {
  try {
    const root = document.documentElement;
    const primary = cfg.primaryColor || '#5B7CFA';
    const secondary = cfg.secondaryColor || '#111827';
    const bg = cfg.bgColor || '#F6F7FB';
    const surface = cfg.surfaceColor || '#FFFFFF';
    const visual = cfg.visualMode || 'claro-premium';
    const text = cfg.textColor || (visual && visual.includes('oscuro') ? '#F8FAFC' : '#111827');
    const muted = cfg.mutedColor || '#6B7280';
    const border = cfg.borderColor || '#E5E7EB';

    root.style.setProperty('--lm-primary', primary);
    root.style.setProperty('--lm-primary-rgb', toRgb(primary));
    root.style.setProperty('--lm-secondary', secondary);
    root.style.setProperty('--lm-bg', bg);
    root.style.setProperty('--lm-surface', surface);
    root.style.setProperty('--lm-text', text);
    root.style.setProperty('--lm-muted', muted);
    root.style.setProperty('--lm-border', border);
    root.style.setProperty('--lm-bg-alt', cfg.bgAltColor || '#EEF2F7');
    root.style.setProperty('--lm-surface-2', cfg.surface2Color || '#F1F3F8');
    root.style.setProperty('--lm-primary-soft', '#DCE5FF');
    root.style.setProperty('--lm-hero-bg', secondary);
    root.style.setProperty('--lm-hero-cta', primary);
    root.style.setProperty('--lm-hero-title', getContrastColor(secondary));
    root.style.setProperty('--lm-hero-cta-text', getContrastColor(primary));
    root.style.setProperty('--lm-visual-mode', visual);

    // Some ergonomic derived vars
    root.style.setProperty('--lm-primary-contrast', getContrastColor(primary));
    root.style.setProperty('background-color', bg);
  } catch (e) {
    // noop
  }
}

function getContrastColor(hex) {
  if (!hex) return '#111827';
  const c = hex.replace('#','');
  const r = parseInt(c.substring(0,2),16);
  const g = parseInt(c.substring(2,4),16);
  const b = parseInt(c.substring(4,6),16);
  const yiq = (r*299 + g*587 + b*114) / 1000;
  return yiq >= 128 ? '#111827' : '#FFFFFF';
}

function toRgb(hex) {
  if (!hex) return '91,124,250';
  const c = hex.replace('#','');
  const r = parseInt(c.substring(0,2),16);
  const g = parseInt(c.substring(2,4),16);
  const b = parseInt(c.substring(4,6),16);
  return `${r},${g},${b}`;
}

export default function ConfigStyles() {
  const { config, loading } = useConfig();

  useEffect(() => {
    if (!loading) applyConfigStyles(config || {});
  }, [loading, config]);

  return null;
}
