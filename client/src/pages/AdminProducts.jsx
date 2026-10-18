import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import config from '../config.js';
import {
  deleteProduct, getProducts, getToken, isDemoMode, logout, resetDemoData, saveProduct,
} from '../api.js';
import ProductImage from '../components/ProductImage.jsx';
import { formatPrice } from '../utils.js';

const EMPTY = {
  name: '', category: 'Sarees', price: '', mrp: '', stock: '', description: '',
  sizes: '', colors: '', image: '', isNew: false,
};

const toForm = (p) => ({
  ...EMPTY,
  ...p,
  sizes: (p.sizes || []).join(', '),
  colors: (p.colors || []).join(', '),
  price: p.price ?? '',
  mrp: p.mrp ?? '',
  stock: p.stock ?? '',
});

const fromForm = (f) => ({
  ...f,
  price: Number(f.price) || 0,
  mrp: f.mrp === '' ? undefined : Number(f.mrp),
  stock: Number(f.stock) || 0,
  sizes: f.sizes.split(',').map((s) => s.trim()).filter(Boolean),
  colors: f.colors.split(',').map((s) => s.trim()).filter(Boolean),
});

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState('');
  const formRef = useRef(null);

  const load = () => getProducts().then(setProducts).catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);

  // When the form opens (Add or Edit), bring it into view and focus the first field
  const formId = form ? form._id || 'new' : null;
  useEffect(() => {
    if (formId && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      formRef.current.querySelector('input')?.focus({ preventScroll: true });
    }
  }, [formId]);

  if (!getToken()) return <Navigate to="/admin" replace />;

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await saveProduct(fromForm(form));
      setSaved(form._id ? `Saved changes to "${form.name}"` : `Added "${form.name}"`);
      setTimeout(() => setSaved(''), 3000);
      setForm(null);
      await load();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      if (/login|session/i.test(err.message)) {
        logout();
        navigate('/admin', { replace: true });
      }
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(p._id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 3).length;
  const soldOut = products.filter((p) => p.stock === 0).length;

  return (
    <section className="container section">
      <div className="section-head">
        <h1 className="page-title">Products</h1>
        <div className="admin-actions">
          <button className="btn btn-primary" onClick={() => setForm({ ...EMPTY })}>+ Add product</button>
          {isDemoMode && (
            <button className="btn btn-ghost" onClick={() => { resetDemoData(); load(); }}>
              Reset demo data
            </button>
          )}
          <Link to="/shop" className="btn btn-link">View shop</Link>
          <button className="btn btn-link" onClick={() => { logout(); navigate('/admin', { replace: true }); }}>Log out</button>
        </div>
      </div>

      <div className="stats">
        <div className="stat"><span>Products</span><strong>{products.length}</strong></div>
        <div className="stat"><span>Items in stock</span><strong>{totalStock}</strong></div>
        <div className="stat"><span>Low stock</span><strong>{lowStock}</strong></div>
        <div className="stat"><span>Sold out</span><strong>{soldOut}</strong></div>
      </div>

      {error && <p className="error">{error}</p>}
      {saved && <p className="success" role="status">✓ {saved}</p>}

      {form && (
        <form ref={formRef} className="card form product-form" onSubmit={submit}>
          <h2>{form._id ? 'Edit product' : 'New product'}</h2>
          <div className="form-grid">
            <label className="span-2">Name<input value={form.name} onChange={update('name')} required /></label>
            <label>
              Category
              <select value={form.category} onChange={update('category')}>
                {config.categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>Stock<input type="number" min="0" value={form.stock} onChange={update('stock')} required /></label>
            <label>Price (₹)<input type="number" min="0" value={form.price} onChange={update('price')} required /></label>
            <label>MRP (₹, optional)<input type="number" min="0" value={form.mrp} onChange={update('mrp')} /></label>
            <label>Sizes (comma separated)<input value={form.sizes} onChange={update('sizes')} placeholder="S, M, L" /></label>
            <label>Colours (comma separated)<input value={form.colors} onChange={update('colors')} placeholder="Maroon, Gold" /></label>
            <label className="span-2">Image URL (optional)<input value={form.image} onChange={update('image')} placeholder="https://…" /></label>
            <label className="span-2">Description<textarea rows="3" value={form.description} onChange={update('description')} /></label>
            <label className="checkbox"><input type="checkbox" checked={form.isNew} onChange={update('isNew')} /> Show in New arrivals</label>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save product'}</button>
            <button type="button" className="btn btn-ghost" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th></th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td><ProductImage product={p} className="table-thumb" /></td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{formatPrice(p.price)}</td>
                <td className={p.stock === 0 ? 'out' : p.stock <= 3 ? 'low' : ''}>{p.stock}</td>
                <td className="row-actions">
                  <button className="btn btn-link" onClick={() => setForm(toForm(p))}>Edit</button>
                  <button className="btn btn-link danger" onClick={() => remove(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
