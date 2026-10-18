import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, MessageCircle, Minus, Plus, RefreshCw, ShoppingBag, Truck } from 'lucide-react';
import { getProduct, getProducts } from '../api.js';
import { useCart } from '../CartContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductImage from '../components/ProductImage.jsx';
import WhatsAppButton from '../components/WhatsAppButton.jsx';
import { discountPercent, formatPrice, singleItemMessage } from '../utils.js';

const CARE = {
  Sarees: 'Dry clean only for silk. Store folded in a muslin cloth and refold every few months to protect the zari.',
  Kurtis: 'Gentle hand wash or machine wash cold, inside out. Dry in shade.',
  Lehengas: 'Dry clean only. Store flat or on a padded hanger, away from damp.',
  Jewellery: 'Keep away from water and perfume. Store in the pouch provided.',
};

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`accordion ${open ? 'open' : ''}`}>
      <button className="accordion-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {title}
        <ChevronDown size={18} aria-hidden="true" />
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState('');
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [sizeWarning, setSizeWarning] = useState(false);

  useEffect(() => {
    setProduct(null);
    setError('');
    setQty(1);
    setSizeWarning(false);
    getProduct(id)
      .then((p) => {
        setProduct(p);
        setSize(p.sizes?.length === 1 ? p.sizes[0] : '');
        return getProducts({ category: p.category });
      })
      .then((list) => setRelated((list || []).filter((x) => x._id !== id).slice(0, 4)))
      .catch((e) => setError(e.message));
  }, [id]);

  if (error)
    return (
      <section className="container section empty-state">
        <h1 className="page-title">We couldn't find that product</h1>
        <p className="muted">It may have been removed or sold out.</p>
        <Link to="/shop" className="btn btn-primary">Browse the collection</Link>
      </section>
    );
  if (!product) return <section className="container section"><p className="muted">Loading…</p></section>;

  const off = discountPercent(product.price, product.mrp);
  const needsSize = product.sizes?.length > 1;
  const soldOut = product.stock === 0;
  const maxQty = Math.max(1, product.stock || 1);

  const checkSize = () => {
    if (needsSize && !size) {
      setSizeWarning(true);
      document.querySelector('.size-block')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    if (!checkSize()) return;
    addItem(product, size, qty);
  };

  const orderButton = (extraClass = '') => (
    <WhatsAppButton
      className={`btn btn-whatsapp ${extraClass}`}
      message={singleItemMessage(product, size, qty)}
      onBeforeOpen={checkSize}
    >
      <MessageCircle size={19} /> Order on WhatsApp
    </WhatsAppButton>
  );

  return (
    <>
      <section className="container section product-section">
        <Link to={`/shop?category=${product.category}`} className="breadcrumb">
          <ArrowLeft size={16} /> {product.category}
        </Link>
        <div className="product-detail">
          <div className="detail-media">
            <ProductImage product={product} width={1000} eager />
            {off > 0 && <span className="badge badge-off detail-badge">{off}% off</span>}
          </div>

          <div className="detail-info">
            <span className="product-cat">{product.category}</span>
            <h1>{product.name}</h1>
            <div className="price-row big">
              <span className="price">{formatPrice(product.price)}</span>
              {off > 0 && <span className="mrp">MRP {formatPrice(product.mrp)}</span>}
            </div>
            <p className={`stock ${soldOut ? 'out' : product.stock <= 3 ? 'low' : ''}`}>
              {soldOut ? 'Sold out' : product.stock <= 3 ? `Only ${product.stock} left` : 'In stock, ready to ship'}
            </p>
            <p className="description">{product.description}</p>

            {product.colors?.length > 0 && (
              <p className="meta"><span>Colour</span> {product.colors.join(', ')}</p>
            )}

            {product.sizes?.length > 0 && (
              <div className={`option-block size-block ${sizeWarning ? 'warn' : ''}`}>
                <span className="option-label">Size {needsSize && !size && <em>Choose one</em>}</span>
                <div className="chips">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      className={`chip size-chip ${size === s ? 'active' : ''}`}
                      onClick={() => {
                        setSize(s);
                        setSizeWarning(false);
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {sizeWarning && <p className="hint">Choose a size first.</p>}
              </div>
            )}

            {!soldOut && (
              <div className="option-block">
                <span className="option-label">Quantity</span>
                <div className="qty">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease"><Minus size={16} /></button>
                  <span>{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(maxQty, q + 1))} disabled={qty >= maxQty} aria-label="Increase"><Plus size={16} /></button>
                </div>
              </div>
            )}

            {soldOut ? (
              <div className="detail-actions">
                <WhatsAppButton
                  className="btn btn-outline"
                  message={`Hi! Will "${product.name}" be back in stock? Please let me know.`}
                >
                  <MessageCircle size={18} /> Ask when it's back
                </WhatsAppButton>
              </div>
            ) : (
              <div className="detail-actions">
                {orderButton()}
                <button className="btn btn-primary" onClick={handleAdd}><ShoppingBag size={18} /> Add to bag</button>
              </div>
            )}

            <ul className="detail-promises">
              <li><Truck size={18} /> Delivery across India in 4 to 7 days</li>
              <li><RefreshCw size={18} /> Size exchange within 7 days</li>
            </ul>

            <div className="accordions">
              <Accordion title="Product details" defaultOpen>
                <p>{product.description}</p>
                {product.colors?.length > 0 && <p>Colour: {product.colors.join(', ')}.</p>}
              </Accordion>
              <Accordion title="Care">
                <p>{CARE[product.category] || CARE.Kurtis}</p>
              </Accordion>
              <Accordion title="Delivery and exchange">
                <p>Orders are confirmed on WhatsApp and shipped within 2 days. Need a different size? Message us within 7 days of delivery.</p>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container section related">
          <div className="section-head">
            <h2>You may also like</h2>
            <Link to={`/shop?category=${product.category}`} className="link-more">More {product.category.toLowerCase()}</Link>
          </div>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {!soldOut && (
        <div className="sticky-buy" aria-hidden="false">
          <div>
            <strong>{formatPrice(product.price * qty)}</strong>
            <span>{size || (needsSize ? 'Choose a size' : '')}</span>
          </div>
          <button className="btn btn-primary btn-icon" onClick={handleAdd} aria-label="Add to bag"><ShoppingBag size={19} /></button>
          {orderButton('sticky-order')}
        </div>
      )}
    </>
  );
}
