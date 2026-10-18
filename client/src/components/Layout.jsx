import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, MessageCircle, RefreshCw, Search, ShoppingBag, Truck, X } from 'lucide-react';
import config from '../config.js';
import { useCart } from '../CartContext.jsx';
import WhatsAppButton from './WhatsAppButton.jsx';
import AddedToast from './AddedToast.jsx';

const NOTES = [
  { icon: MessageCircle, text: 'Order in one tap on WhatsApp' },
  { icon: Truck, text: 'Delivery across India' },
  { icon: RefreshCw, text: 'Easy size exchange within 7 days' },
];

export function Logo({ light = false }) {
  return (
    <span className={`logo ${light ? 'logo-light' : ''}`}>
      <span className="logo-mark" aria-hidden="true">ர</span>
      <span className="logo-text">
        Rajakili
        <small>Boutique · {config.city}</small>
      </span>
    </span>
  );
}

export default function Layout() {
  const { count, pieces } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [bump, setBump] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.key]);

  useEffect(() => {
    if (!menuOpen && !searchOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen, searchOpen]);

  // Little bounce on the bag when something is added
  useEffect(() => {
    if (!pieces) return undefined;
    setBump(true);
    const t = setTimeout(() => setBump(false), 450);
    return () => clearTimeout(t);
  }, [pieces]);

  const params = new URLSearchParams(location.search);
  const activeCat = location.pathname === '/shop' ? params.get('category') : null;

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/shop?search=${encodeURIComponent(q)}` : '/shop');
    setQuery('');
  };

  return (
    <>
      <div className="announce">
        <div className="container announce-inner">
          <span className="announce-demo">Demo store by <strong>Thamu</strong>. No real orders.</span>
          <ul className="announce-notes">
            {NOTES.map(({ icon: Icon, text }) => (
              <li key={text}><Icon size={14} aria-hidden="true" /> {text}</li>
            ))}
          </ul>
        </div>
      </div>

      <header className="site-header">
        <div className="container header-inner">
          <button
            className="icon-btn menu-btn"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" aria-label="Rajakili Boutique home"><Logo /></Link>

          <nav className={`nav ${menuOpen ? 'open' : ''}`} aria-label="Main">
            <NavLink to="/" end>Home</NavLink>
            {config.categories.map((c) => (
              <Link key={c} to={`/shop?category=${c}`} className={activeCat === c ? 'active' : ''}>{c}</Link>
            ))}
            <NavLink to="/shop" end className={() => (location.pathname === '/shop' && !activeCat ? 'active' : '')}>
              Shop all
            </NavLink>
          </nav>

          <div className="header-actions">
            <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen((o) => !o)}>
              <Search size={20} />
            </button>
            <Link to="/cart" className={`icon-btn bag-btn ${bump ? 'bump' : ''}`} aria-label={`Bag, ${count} ${count === 1 ? 'item' : 'items'}`}>
              <ShoppingBag size={20} />
              {count > 0 && <span className="bag-count">{count}</span>}
            </Link>
          </div>
        </div>

        {searchOpen && (
          <form className="search-bar container" onSubmit={submitSearch} role="search">
            <Search size={18} aria-hidden="true" />
            <input
              autoFocus
              type="search"
              placeholder="Search sarees, kurtis, jewellery"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
            />
            <button className="btn btn-primary btn-sm" type="submit">Search</button>
          </form>
        )}
      </header>
      {menuOpen && <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />}

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <Logo light />
            <p>Sarees, kurtis, lehengas and temple jewellery, picked one by one and sent to your door.</p>
            <WhatsAppButton className="btn btn-accent" message={`Hi ${config.shopName}! I have a question.`}>
              <MessageCircle size={18} /> Chat on WhatsApp
            </WhatsAppButton>
          </div>
          <div>
            <h4>Shop</h4>
            {config.categories.map((c) => (
              <Link key={c} to={`/shop?category=${c}`}>{c}</Link>
            ))}
          </div>
          <div>
            <h4>Help</h4>
            <Link to="/cart">Your bag</Link>
            <WhatsAppButton className="footer-link" message={`Hi ${config.shopName}! I'd like help with sizing.`}>
              Size help
            </WhatsAppButton>
            {config.instagram && <a href={config.instagram} target="_blank" rel="noreferrer">Instagram</a>}
            <Link to="/admin">Owner login</Link>
          </div>
        </div>
        <div className="container footer-note">
          <span>Demo website designed and built by Thamu, full-stack MERN developer. Want one for your boutique? Get in touch.</span>
          <span>Photos from <a className="photo-credit" href="https://unsplash.com" target="_blank" rel="noreferrer">Unsplash</a></span>
        </div>
      </footer>

      <AddedToast />
    </>
  );
}
