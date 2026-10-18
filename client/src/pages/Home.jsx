import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, RefreshCw, ShoppingBag, Truck, Shirt, Send, BadgeCheck } from 'lucide-react';
import config from '../config.js';
import { getProducts } from '../api.js';
import ProductCard from '../components/ProductCard.jsx';
import ProductImage from '../components/ProductImage.jsx';
import WhatsAppButton from '../components/WhatsAppButton.jsx';

// Free Unsplash photos for the home page
const img = (id, w = 700) => `https://images.unsplash.com/${id}?w=${w}&q=75&auto=format&fit=crop`;
const photo = (id, name, w) => ({ _id: id, name, category: 'Sarees', colors: ['Maroon', 'Gold'], image: img(id, w) });

const HERO_MAIN = photo('photo-1617627143750-d86bc21e42bb', 'Woman in a pink silk saree with gold jewellery', 900);
const HERO_SIDE_1 = photo('photo-1758995115518-26f90aa61b97', 'Gold temple necklace on blue velvet', 500);
const HERO_SIDE_2 = photo('photo-1724856605022-106d6dd6e842', 'Close-up of red and gold zari work', 500);
const WEDDING = photo('photo-1733937108021-d5db469f2216', 'Bride in a yellow and red bridal outfit', 1000);

const CATEGORIES = {
  Sarees: { blurb: 'Kanchipuram, soft silk, Kota', image: 'photo-1641699862936-be9f49b1c38d' },
  Kurtis: { blurb: 'Daily, office and festive', image: 'photo-1741847639057-b51a25d42892' },
  Lehengas: { blurb: 'Bridal and festive', image: 'photo-1759906760638-eeffcb471e53' },
  Jewellery: { blurb: 'Temple sets and earrings', image: 'photo-1758995115857-2de1eb6283d0' },
};

const LOOKBOOK = [
  { id: 'photo-1688382654723-a7366006519b', alt: 'Green silk saree with gold jewellery', to: '/shop?category=Sarees', caption: 'Green and gold for temple visits' },
  { id: 'photo-1610030469983-98e550d6193c', alt: 'Violet and gold Kanchipuram silk saree', to: '/shop?category=Sarees', caption: 'Rich violet Kanchipuram' },
  { id: 'photo-1767955694884-d4bf352c23c2', alt: 'Yellow and maroon festive lehenga', to: '/shop?category=Lehengas', caption: 'Haldi-ready yellow' },
  { id: 'photo-1770838446917-cf324f1be078', alt: 'Green saree with an ornate gold necklace', to: '/shop?category=Jewellery', caption: 'Layer the temple necklace' },
  { id: 'photo-1610189012906-4c0aa9b9781e', alt: 'Blue and yellow Kota silk saree', to: '/shop?category=Sarees', caption: 'Light Kota for day functions' },
];

const PROMISES = [
  { icon: MessageCircle, title: 'Order on WhatsApp', text: 'No sign-up. Your order is typed for you.' },
  { icon: Truck, title: 'Delivery across India', text: 'Packed with care, tracked to your door.' },
  { icon: RefreshCw, title: 'Easy size exchange', text: 'Wrong fit? Exchange within 7 days.' },
];

const STEPS = [
  { icon: Shirt, title: 'Pick what you love', text: 'Choose your size and add it to your bag.' },
  { icon: Send, title: 'Send it on WhatsApp', text: 'One tap sends your order with every detail filled in.' },
  { icon: BadgeCheck, title: 'Confirm and pay', text: 'We confirm stock and delivery, then you pay by UPI or COD.' },
];

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);
  const sarees = products.filter((p) => p.category === 'Sarees').slice(0, 4);
  const countIn = (c) => products.filter((p) => p.category === c).length;

  return (
    <>
      <section className="hero">
        <div className="hero-word" aria-hidden="true">ராஜகிளி</div>
        <div className="container hero-inner">
          <div className="hero-text">
            <h1>Silks and stories, draped for every celebration</h1>
            <p className="hero-lead">
              Kanchipuram silks, everyday kurtis and temple jewellery from {config.city}, picked one by one.
              Browse, choose your size, and order in one tap on WhatsApp.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-accent btn-lg">
                <ShoppingBag size={19} /> Shop the collection
              </Link>
              <WhatsAppButton className="btn btn-outline btn-lg" message={`Hi ${config.shopName}! I'd like to see your new collection.`}>
                <MessageCircle size={19} /> Ask on WhatsApp
              </WhatsAppButton>
            </div>
            <ul className="promise-row">
              {PROMISES.map(({ icon: Icon, title }) => (
                <li key={title}><span className="promise-icon"><Icon size={16} /></span>{title}</li>
              ))}
            </ul>
          </div>

          <div className="hero-collage">
            <Link to="/shop?category=Sarees" className="collage-main" aria-label="Shop silk sarees">
              <ProductImage product={HERO_MAIN} width={900} eager />
            </Link>
            <Link to="/shop?category=Jewellery" className="collage-side collage-side-1" aria-label="Shop temple jewellery">
              <ProductImage product={HERO_SIDE_1} width={500} eager />
              <span className="collage-tag">Temple jewellery</span>
            </Link>
            <Link to="/shop?category=Lehengas" className="collage-side collage-side-2" aria-label="Shop bridal lehengas">
              <ProductImage product={HERO_SIDE_2} width={500} eager />
              <span className="collage-tag">Zari lehengas</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="zari-band" aria-hidden="true" />

      <section className="container section">
        <div className="section-head">
          <h2>Shop by category</h2>
          <Link to="/shop" className="link-more">View everything</Link>
        </div>
        <div className="category-grid">
          {config.categories.map((c) => (
            <Link key={c} to={`/shop?category=${c}`} className="category-tile">
              <ProductImage width={600} product={{ _id: `cat-${c}`, name: c, category: c, image: img(CATEGORIES[c].image, 600) }} />
              <div className="category-info">
                <h3>{c}</h3>
                <span>{CATEGORIES[c].blurb}</span>
                {countIn(c) > 0 && <em>{countIn(c)} styles</em>}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>New this week</h2>
          <Link to="/shop" className="link-more">See all</Link>
        </div>
        <div className="product-grid">
          {newArrivals.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      <section className="wedding">
        <div className="container wedding-inner">
          <div className="wedding-photo">
            <ProductImage product={WEDDING} width={1000} />
          </div>
          <div className="wedding-text">
            <h2>The wedding edit</h2>
            <p>
              Heavy zari lehengas, temple necklaces and silk sarees for the bride, her sisters and everyone
              dancing at the sangeet. Made-to-measure blouses on request.
            </p>
            <div className="hero-actions">
              <Link to="/shop?category=Lehengas" className="btn btn-accent">Shop bridal lehengas</Link>
              <Link to="/shop?category=Jewellery" className="btn btn-outline-light">Shop jewellery</Link>
            </div>
          </div>
        </div>
      </section>

      {sarees.length > 0 && (
        <section className="container section">
          <div className="section-head">
            <h2>Silk sarees</h2>
            <Link to="/shop?category=Sarees" className="link-more">All sarees</Link>
          </div>
          <div className="product-grid">
            {sarees.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="container section">
        <div className="steps">
          <h2>How ordering works</h2>
          <ol>
            {STEPS.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <span className="step-icon"><Icon size={22} /></span>
                <strong>{title}</strong>
                <span>{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section lookbook-section">
        <div className="container section-head">
          <h2>Lookbook</h2>
          <span className="muted">Ideas for styling, tap to shop the look</span>
        </div>
        <div className="lookbook">
          {LOOKBOOK.map((l) => (
            <Link key={l.id} to={l.to} className="look">
              <ProductImage width={500} product={{ _id: l.id, name: l.alt, category: 'Sarees', image: img(l.id, 500) }} />
              <span>{l.caption}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
