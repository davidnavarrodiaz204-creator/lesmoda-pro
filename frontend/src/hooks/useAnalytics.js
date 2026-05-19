import { useCallback } from 'react';

const LS_KEY = 'lesmoda_analytics';

function load() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{"views":[],"shares":[],"favorites":[],"waClicks":[]}');
  } catch { return { views: [], shares: [], favorites: [], waClicks: [] }; }
}

function save(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

export function useAnalytics() {
  const track = useCallback((type, payload = {}) => {
    try {
      const data = load();
      const entry = { ...payload, timestamp: Date.now() };
      if (data[type]) {
        data[type].unshift(entry);
        if (data[type].length > 200) data[type] = data[type].slice(0, 200);
      }
      save(data);
    } catch {}
  }, []);

  return { track };
}
