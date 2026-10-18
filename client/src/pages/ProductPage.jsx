import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct } from '../api.js';
import { useCart } from '../CartContext.jsx';
import ProductImage from '../components/ProductImage.jsx';
import { discountPercent, formatPrice, singleItemMessage, whatsappLink } from '../utils.js';

export default function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    getProduct(id)
      .then((p) => {
        setProduct(p);
        setSize(p.sizes?.length === 1 ? p.sizes[0] : '');
      })
      .catch((e) => setError(e.message));
  }, [id]);

  if (error)
    return (
      <section className="container section">
        <p className="error">{error}</p>
        <Link to="/shop" className="btn btn-ghost">Back to shop</Link>
      </section>
    );
  if (!product) return <section className="container section"><p className="muted">Loading…</p></section>;

  const off = discountPercent(product.price, product.mrp);
  const needsSize = product.sizes?.length > 1;
  const soldOut = product.stock === 0;
  const canOrder = !soldOut && (!needsSize || size);

  const handleAdd = () => {
    addItem(product, size, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="container section">
      <Link to={`/shop?category=${product.category}`} className="breadcrumb">← {product.category}</Link>
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
              <strong>Size</strong>
              <div className="chips">
                {product.sizes.map((s) => (
                  <button key={s} className={`chip ${size === s ? 'active' : ''}`} onClick={() => setSize(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="option-block">
            <strong>Quantity</strong>
            <div className="qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Increase">+</button>
            </div>
          </div>

          {needsSize && !size && !soldOut && <p className="hint">Please choose a size.</p>}

          <div className="detail-actions">
            <a
              className={`btn btn-whatsapp ${canOrder ? '' : 'disabled'}`}
              href={canOrder ? whatsappLink(singleItemMessage(product, size, qty)) : undefined}
              target="_blank"
              rel="noreferrer"
              aria-disabled={!canOrder}
            >
              Order on WhatsApp
            </a>
            <button className="btn btn-ghost" disabled={!canOrder} onClick={handleAdd}>
              {added ? 'Added ✓' : 'Add to bag'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
