import { useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// Behaves like a normal website:
// - clicking a link (even a filter on the same page) starts the new page at the top
// - pressing Back/Forward returns you to where you were on that page
const positions = new Map();
let currentKey = null;

try {
  window.history.scrollRestoration = 'manual';
} catch {
  /* older browsers */
}

export default function ScrollManager() {
  const location = useLocation();
  const navType = useNavigationType();

  // One scroll listener that always records the position for the page currently showing
  useEffect(() => {
    const save = () => {
      if (currentKey) positions.set(currentKey, window.scrollY);
    };
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, []);

  useLayoutEffect(() => {
    currentKey = location.key;
    if (navType !== 'POP') {
      window.scrollTo(0, 0);
      return;
    }
    const target = positions.get(location.key) || 0;
    // Content may still be loading, so keep trying for a moment until the page is tall enough
    let tries = 0;
    let timer;
    const restore = () => {
      if (currentKey !== location.key) return;
      const maxY = document.documentElement.scrollHeight - window.innerHeight;
      if (maxY >= target || tries > 20) {
        window.scrollTo(0, Math.min(target, Math.max(maxY, 0)));
      } else {
        tries += 1;
        timer = setTimeout(restore, 50);
      }
    };
    restore();
    return () => clearTimeout(timer);
  }, [location.key, navType]);

  return null;
}
