// Change these values for each client project.
const config = {
  shopName: 'Rajakili Boutique',
  tagline: 'Handpicked sarees, kurtis & jewellery',
  city: 'Chennai',
  // true = demo store: WhatsApp buttons show a preview instead of opening WhatsApp.
  // For a real client, set this to false and put their real number below.
  demoStore: true,
  // WhatsApp number with country code, digits only.
  whatsappNumber: '919999999999',
  // Shop's Instagram page. Leave empty to hide the link.
  instagram: '',
  // Backend URL. Empty = demo mode (data stays in the browser).
  apiUrl: (import.meta.env.VITE_API_URL || '').replace(/\/$/, ''),
  categories: ['Sarees', 'Kurtis', 'Lehengas', 'Jewellery'],
  // Demo-mode admin login (only used when there is no backend).
  demoAdmin: { email: 'admin@rajakili.demo', password: 'demo123' },
};

export default config;
