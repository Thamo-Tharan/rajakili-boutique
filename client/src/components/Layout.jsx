import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import config from '../config.js';
import { useCart } from '../CartContext.jsx';
import WhatsAppButton from './WhatsAppButton.jsx';

export default function Layout() {
  const { count } = useCart();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  // Close the mobile menu whenever the page changes, or on Escape
  useEffect(() => {
    setMenuOpen(false);
  }, [location.key]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Highlight a category link only when that category is showing
  const params = new URLSearchParams(location.search);
  const activeCat = location.pathname === '/shop' ? params.get('category') : null;

  return (
    <>
      <div className="demo-banner">
        Demo project designed &amp; built by <strong>Thamu</strong> · Not a real store · No real orders
      </div>

      <header className="site-header">
        <div className="container header-inner">
          <button
            className="menu-btn"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
          <Link to="/" className="logo">
            <span className="logo-mark">ர</span>
            <span>
              Rajakili <em>Boutique</em>
            </span>
          </Link>
          <nav className={`nav ${menuOpen ? 'open' : ''}`}>
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/shop" end className={() => (location.pathname === '/shop' && !activeCat ? 'active' : '')}>
              Shop all
            </NavLink>
            {config.categories.map((c) => (
              <Link key={c} to={`/shop?category=${c}`} className={`nav-cat ${activeCat === c ? 'active' : ''}`}>
                {c}
              </Link>
            ))}
          </nav>
          <Link to="/cart" className="cart-link" aria-label={`Bag, ${count} items`}>
            Bag <span className="cart-count">{count}</span>
          </Link>
        </div>
      </header>
      {menuOpen && <div className="menu-backdrop" onClick={close} />}

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <div className="logo footer-logo">
              <span className="logo-mark">ர</span> Rajakili <em>Boutique</em>
            </div>
            <p>{config.tagline}. Order easily on WhatsApp.</p>
          </div>
          <div>
            <h4>Shop</h4>
            {config.categories.map((c) => (
              <Link key={c} to={`/shop?category=${c}`}>{c}</Link>
            ))}
          </div>
          <div>
            <h4>Contact</h4>
            <WhatsAppButton className="footer-link" message={`Hi ${config.shopName}! I have a question.`}>
              WhatsApp
            </WhatsAppButton>
            {config.instagram && (
              <a href={config.instagram} target="_blank" rel="noreferrer">Instagram</a>
            )}
            <Link to="/admin">Owner login</Link>
          </div>
        </div>
        <div className="container footer-note">
          Demo website by Thamu · Full-stack MERN developer · Want one for your boutique? Get in touch.
          {' '}· Photos from{' '}
          <a className="photo-credit" href="https://unsplash.com" target="_blank" rel="noreferrer">Unsplash</a>
        </div>
      </footer>
    </>
  );
}
