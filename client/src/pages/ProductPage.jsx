import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct, getProducts } from '../api.js';
import { useCart } from '../CartContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductImage from '../components/ProductImage.jsx';
import WhatsAppButton from '../components/WhatsAppButton.jsx';
import { discountPercent, formatPrice, singleItemMessage } from '../utils.js';

export default function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState('');
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeWarning, setSizeWarning] = useState(false);

  useEffect(() => {
    setProduct(null);
    setError('');
    setQty(1);
    setAdded(false);
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
        <h1 className="page-title">Sorry, we couldn't find that product</h1>
        <p className="muted">It may have been removed or sold out.</p>
        <Link to="/shop" className="btn btn-primary">Browse the collection</Link>
      </section>
    );
  if (!product) return <section className="container section"><p className="muted">Loading…</p></section>;

  const off = discountPercent(product.price, product.mrp);
  const needsSize = product.sizes?.length > 1;
  const soldOut = product.stock === 0;
  const maxQty = Math.max(1, product.stock || 1);

  const handleAdd = () => {
    if (needsSize && !size) {
      setSizeWarning(true);
      return;
    }
    addItem(product, size, qty);
    setAdded(true);
  };

  return (
    <>
      <section className="container section">
        <Link to={`/shop?category=${product.category}`} className="breadcrumb">← Back to {product.category}</Link>
        <div className="product-detail">
          <div className="detail-media">
            <ProductImage product={product} />
          </div>
          <div className="detail-info">
            <span className="product-cat">{product.category}</span>
            <h1>{product.name}</h1>
            <div className="price-row big">
              <span className="price">{formatPrice(product.price)}</span>
              {off > 0 && (
                <>
                  <span className="mrp">{formatPrice(product.mrp)}</span>
                  <span className="off">{off}% off</span>
                </>
              )}
            </div>
            <p className="stock">
              {soldOut ? 'Sold out' : product.stock <= 3 ? `Only ${product.stock} left` : 'In stock'}
            </p>
            <p className="description">{product.description}</p>

            {product.colors?.length > 0 && (
              <p className="meta"><strong>Colour:</strong> {product.colors.join(', ')}</p>
            )}

            {product.sizes?.length > 0 && (
              <div className="option-block">
                <strong>Size {needsSize && !size && <span className="muted small">(please choose)</span>}</strong>
                <div className="chips">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      className={`chip ${size === s ? 'active' : ''}`}
                      onClick={() => {
                        setSize(s);
                        setSizeWarning(false);
                        setAdded(false);
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!soldOut && (
              <div className="option-block">
                <strong>Quantity</strong>
                <div className="qty">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease">−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(maxQty, q + 1))} disabled={qty >= maxQty} aria-label="Increase">+</button>
                </div>
              </div>
            )}

            {sizeWarning && <p className="hint">Please choose a size first.</p>}

            {soldOut ? (
              <div className="detail-actions">
                <WhatsAppButton
                  className="btn btn-ghost"
                  message={`Hi! Will "${product.name}" be back in stock? Please let me know.`}
                >
                  Ask when it's back
                </WhatsAppButton>
              </div>
            ) : (
              <div className="detail-actions">
                <WhatsAppButton
                  className="btn btn-whatsapp"
                  message={singleItemMessage(product, size, qty)}
                  onBeforeOpen={() => {
                    if (needsSize && !size) {
                      setSizeWarning(true);
                      return false;
                    }
                    return true;
                  }}
                >
                  Order on WhatsApp
                </WhatsAppButton>
                <button className="btn btn-ghost" onClick={handleAdd}>Add to bag</button>
              </div>
            )}

            {added && (
              <div className="added-note" role="status">
                <span>✓ Added to your bag</span>
                <Link to="/cart" className="btn btn-primary btn-sm">View bag</Link>
                <Link to="/shop" className="btn btn-link btn-sm">Keep shopping</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container section related">
          <div className="section-head">
            <h2>You may also like</h2>
            <Link to={`/shop?category=${product.category}`} className="link-more">More {product.category} →</Link>
          </div>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
