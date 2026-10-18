// One place for all data access.
// With VITE_API_URL set it talks to the Express API; without it, it runs in demo mode
// using the seed data and saves admin changes in this browser only.
import config from './config.js';
import seedProducts from './data/seedProducts.js';

const DEMO_KEY = 'rajakili-demo-products-v4'; // bump when demo data changes
const TOKEN_KEY = 'rajakili-admin-token';

export const isDemoMode = !config.apiUrl;

// ---------- storage helpers (never crash if storage is blocked) ----------
function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key, value) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

let memoryProducts = null;
function demoLoad() {
  if (memoryProducts) return memoryProducts;
  const saved = safeGet(DEMO_KEY);
  try {
    memoryProducts = saved ? JSON.parse(saved) : null;
  } catch {
    memoryProducts = null;
  }
  if (!Array.isArray(memoryProducts)) {
    memoryProducts = seedProducts.map((p, i) => ({ ...p, _id: `demo-${i + 1}` }));
  }
  return memoryProducts;
}
function demoSave(list) {
  memoryProducts = list;
  safeSet(DEMO_KEY, JSON.stringify(list));
}

// ---------- auth ----------
export function getToken() {
  return safeGet(TOKEN_KEY);
}
export function logout() {
  safeSet(TOKEN_KEY, null);
}

async function request(path, options = {}) {
  const res = await fetch(`${config.apiUrl}/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export async function login(email, password) {
  if (isDemoMode) {
    const ok =
      email.trim().toLowerCase() === config.demoAdmin.email && password === config.demoAdmin.password;
    if (!ok) throw new Error('Invalid email or password');
    safeSet(TOKEN_KEY, 'demo-token');
    return { email };
  }
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  safeSet(TOKEN_KEY, data.token);
  return data;
}

// ---------- products ----------
export async function getProducts({ category, search } = {}) {
  if (isDemoMode) {
    let list = [...demoLoad()].reverse();
    if (category && category !== 'All') list = list.filter((p) => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return list;
  }
  const params = new URLSearchParams();
  if (category && category !== 'All') params.set('category', category);
  if (search) params.set('search', search);
  return request(`/products?${params}`);
}

export async function getProduct(id) {
  if (isDemoMode) {
    const p = demoLoad().find((x) => x._id === id);
    if (!p) throw new Error('Product not found');
    return p;
  }
  return request(`/products/${id}`);
}

export async function saveProduct(product) {
  if (isDemoMode) {
    const list = demoLoad();
    if (product._id) {
      demoSave(list.map((p) => (p._id === product._id ? { ...p, ...product } : p)));
      return product;
    }
    const created = { ...product, _id: `demo-${Date.now()}` };
    demoSave([...list, created]);
    return created;
  }
  // eslint-disable-next-line no-unused-vars
  const { _id, __v, createdAt, updatedAt, ...body } = product;
  return _id
    ? request(`/products/${_id}`, { method: 'PUT', body: JSON.stringify(body) })
    : request('/products', { method: 'POST', body: JSON.stringify(body) });
}

export async function deleteProduct(id) {
  if (isDemoMode) {
    demoSave(demoLoad().filter((p) => p._id !== id));
    return;
  }
  return request(`/products/${id}`, { method: 'DELETE' });
}

export function resetDemoData() {
  safeSet(DEMO_KEY, null);
  memoryProducts = null;
}
