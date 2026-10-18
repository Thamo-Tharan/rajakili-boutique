import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config.js';
import { isDemoMode, login } from '../api.js';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(isDemoMode ? config.demoAdmin.email : '');
  const [password, setPassword] = useState(isDemoMode ? config.demoAdmin.password : '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
      navigate('/admin/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="container section narrow">
      <form className="card form" onSubmit={submit}>
        <h1 className="page-title">Owner login</h1>
        <p className="muted">Manage products, prices and stock.</p>
        {isDemoMode && (
          <p className="notice">
            Demo mode: login details are filled in for you. Changes are saved only in this browser.
          </p>
        )}
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary full" disabled={busy}>
          {busy ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </section>
  );
}
