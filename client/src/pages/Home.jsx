import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../config.js';
import { getProducts } from '../api.js';
import ProductCard from '../components/ProductCard.jsx';
import ProductImage from '../components/ProductImage.jsx';

const CATEGORY_PREVIEW = {
  Sarees: { colors: ['Maroon', 'Gold'], blurb: 'Silk, soft silk & cotton' },
  Kurtis: { colors: ['Rose Pink', 'Gold'], blurb: 'Daily, office & festive' },
  Lehengas: { colors: ['Red', 'Gold'], blurb: 'Bridal & kids' },
  Jewellery: { colors: ['Antique Gold', 'Maroon'], blurb: 'Temple & oxidised' },
};

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="eyebrow">New festive collection · {config.city}</span>
            <h1>
              Draped in tradition, <em>made for you</em>
            </h1>
            <p>
              Handpicked Kanchipuram silks, everyday kurtis and temple jewellery. Browse the collection
              and order in one tap on WhatsApp.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary">Shop the collection</Link>
              <Link to="/shop?category=Sarees" className="btn btn-ghost">View sarees</Link>
            </div>
          </div>
          <Link to="/shop?category=Sarees" className="hero-art" aria-label="Shop silk sarees">
            <div className="hero-frame">
              <ProductImage product={{ _id: 'hero', name: 'Silk saree', category: 'Sarees', colors: ['Maroon', 'Gold'] }} />
              <span className="hero-tag">Silk sarees →</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>Shop by category</h2>
        </div>
        <div className="category-grid">
          {config.categories.map((c) => (
            <Link key={c} to={`/shop?category=${c}`} className="category-card">
              <ProductImage product={{ _id: `cat-${c}`, name: c, category: c, colors: CATEGORY_PREVIEW[c].colors }} />
              <div>
                <h3>{c}</h3>
                <span>{CATEGORY_PREVIEW[c].blurb}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>New arrivals</h2>
          <Link to="/shop" className="link-more">See all →</Link>
        </div>
        <div className="product-grid">
          {newArrivals.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="how-it-works">
          <h2>Ordering is simple</h2>
          <ol>
            <li><strong>Pick your favourites</strong><span>Choose size and add to your bag.</span></li>
            <li><strong>Tap "Order on WhatsApp"</strong><span>Your order details are filled in for you.</span></li>
            <li><strong>Confirm &amp; pay</strong><span>We confirm stock, delivery and payment by chat.</span></li>
          </ol>
        </div>
      </section>
    </>
  );
}
