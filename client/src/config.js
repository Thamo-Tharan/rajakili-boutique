// Change these values for each client project.
const config = {
  shopName: 'Rajakili Boutique',
  tagline: 'Handpicked sarees, kurtis & jewellery',
  city: 'Chennai',
  // WhatsApp number with country code, digits only (this demo uses a placeholder).
  whatsappNumber: '919999999999',
  instagram: 'https://instagram.com/',
  // Backend URL. Empty = demo mode (data stays in the browser).
  apiUrl: (import.meta.env.VITE_API_URL || '').replace(/\/$/, ''),
  categories: ['Sarees', 'Kurtis', 'Lehengas', 'Jewellery'],
  // Demo-mode admin login (only used when there is no backend).
  demoAdmin: { email: 'admin@rajakili.demo', password: 'demo123' },
};

export default config;
