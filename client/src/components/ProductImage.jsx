import { useState } from 'react';

// Shows the product photo if there is one (falls back to the drawing if it fails to load). Otherwise draws an elegant
// illustrated placeholder in the product's colours, so the demo never looks empty.
const COLOR_MAP = {
  maroon: '#7a1f2b', gold: '#c9a14a', mustard: '#d4a017', black: '#2b2b2b',
  'peacock blue': '#0f6e7a', pink: '#d96a8f', 'rose pink': '#e48aa4', indigo: '#3b4a8a',
  'mint green': '#7fbfa4', red: '#b3202e', green: '#2f7d4f', 'antique gold': '#b08d3c',
  silver: '#9aa0a6', blue: '#2f5fa8', yellow: '#e2b423', purple: '#6b3a8c',
};

function palette(colors = []) {
  const hex = colors.map((c) => COLOR_MAP[c.toLowerCase()]).filter(Boolean);
  return [hex[0] || '#7a1f2b', hex[1] || '#c9a14a'];
}

function Motif({ category, a, b }) {
  switch (category) {
    case 'Sarees':
      return (
        <g>
          <path d="M60 40 Q100 30 140 40 L150 170 Q100 185 50 170 Z" fill={a} />
          <path d="M60 40 Q100 30 140 40 L130 75 Q100 68 70 75 Z" fill={b} opacity="0.9" />
          <path d="M50 160 Q100 175 150 160 L150 170 Q100 185 50 170 Z" fill={b} />
          {[70, 90, 110, 130].map((x) => (
            <circle key={x} cx={x} cy="120" r="3" fill={b} opacity="0.7" />
          ))}
        </g>
      );
    case 'Kurtis':
      return (
        <g>
          <path d="M75 35 L125 35 L150 60 L138 72 L128 64 L135 175 L65 175 L72 64 L62 72 L50 60 Z" fill={a} />
          <path d="M90 35 Q100 55 110 35" fill="none" stroke={b} strokeWidth="4" />
          <line x1="100" y1="50" x2="100" y2="110" stroke={b} strokeWidth="3" strokeDasharray="4 5" />
          <path d="M65 165 L135 165" stroke={b} strokeWidth="5" />
        </g>
      );
    case 'Lehengas':
      return (
        <g>
          <path d="M78 35 L122 35 L118 75 L82 75 Z" fill={b} />
          <path d="M82 78 L118 78 L160 175 L40 175 Z" fill={a} />
          <path d="M48 160 L152 160 L160 175 L40 175 Z" fill={b} />
          {[70, 100, 130].map((x) => (
            <path key={x} d={`M${x} 110 l5 8 l-5 8 l-5 -8 z`} fill={b} opacity="0.8" />
          ))}
        </g>
      );
    default:
      return (
        <g fill="none" stroke={b} strokeWidth="5">
          <path d="M55 50 Q100 140 145 50" />
          <circle cx="100" cy="112" r="14" fill={a} />
          <path d="M70 140 l0 18 M130 140 l0 18" />
          <path d="M60 158 q10 14 20 0 z M120 158 q10 14 20 0 z" fill={b} />
        </g>
      );
  }
}

// Smaller photo for thumbnails (bag, admin table) so pages load fast
function sized(url, width) {
  return url.includes('images.unsplash.com') ? url.replace(/w=\d+/, `w=${width}`) : url;
}

export default function ProductImage({ product, className = '', width = 800, eager = false }) {
  const [failed, setFailed] = useState(false);
  if (product.image && !failed) {
    return (
      <img
        className={`product-img is-photo ${className}`}
        src={sized(product.image, width)}
        alt={product.name}
        loading={eager ? 'eager' : 'lazy'}
        onError={() => setFailed(true)}
      />
    );
  }
  const [a, b] = palette(product.colors);
  const pid = `dots-${String(product._id || product.name).replace(/[^a-zA-Z0-9-]/g, '')}`;
  return (
    <svg className={`product-img ${className}`} viewBox="0 0 200 210" role="img" aria-label={product.name}>
      <defs>
        <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="1.4" fill={b} opacity="0.25" />
        </pattern>
      </defs>
      <rect width="200" height="210" fill="#f8efe4" />
      <rect width="200" height="210" fill={`url(#${pid})`} />
      <Motif category={product.category} a={a} b={b} />
    </svg>
  );
}
