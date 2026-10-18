import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import config from '../config.js';
import { useCart } from '../CartContext.jsx';
import { whatsappLink } from '../utils.js';

export default function Layout() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <>
      <div className="demo-banner">
        Demo project designed &amp; built by <strong>Thamu</strong> · Not a real store · No real orders
      </div>

      <header className="site-header">
        <div className="container header-inner">
          <button className="menu-btn" aria-label="Menu" onClick={() => setMenuOpen((o) => !o)}>
            ☰
          </button>
          <Link to="/" className="logo" onClick={close}>
            <span className="logo-mark">ர</span>
            <span>
              Rajakili <em>Boutique</em>
            </span>
          </Link>
          <nav className={`nav ${menuOpen ? 'open' : ''}`}>
            <NavLink to="/" end onClick={close}>Home</NavLink>
            <NavLink to="/shop" onClick={close}>Shop</NavLink>
            {config.categories.map((c) => (
              <NavLink key={c} to={`/shop?category=${c}`} onClick={close} className="nav-cat">
                {c}
              </NavLink>
            ))}
          </nav>
          <Link to="/cart" className="cart-link" onClick={close} aria-label="Cart">
            Bag <span className="cart-count">{count}</span>
          </Link>
        </div>
      </header>

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
            <a href={whatsappLink(`Hi ${config.shopName}!`)} target="_blank" rel="noreferrer">WhatsApp</a>
            <a href={config.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <Link to="/admin">Owner login</Link>
          </div>
        </div>
        <div className="container footer-note">
          Demo website by Thamu · Full-stack MERN developer · Want one for your boutique? Get in touch.
        </div>
      </footer>
    </>
  );
}
