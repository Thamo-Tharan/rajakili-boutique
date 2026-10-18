import { Link } from 'react-router-dom';
import { useCart } from '../CartContext.jsx';
import ProductImage from '../components/ProductImage.jsx';
import WhatsAppButton from '../components/WhatsAppButton.jsx';
import { cartMessage, formatPrice } from '../utils.js';

export default function Cart() {
  const { items, count, updateQty, clear, total } = useCart();

  if (items.length === 0)
    return (
      <section className="container section empty-state">
        <h1 className="page-title">Your bag is empty</h1>
        <p className="muted">Find something you love in the collection.</p>
        <Link to="/shop" className="btn btn-primary">Start shopping</Link>
      </section>
    );

  const confirmClear = () => {
    if (window.confirm('Remove all items from your bag?')) clear();
  };

  return (
    <section className="container section">
      <div className="section-head">
        <h1 className="page-title">Your bag <span className="muted count-label">({count} {count === 1 ? 'item' : 'items'})</span></h1>
        <Link to="/shop" className="link-more">← Keep shopping</Link>
      </div>
      <div className="cart-layout">
        <ul className="cart-list">
          {items.map((i) => (
            <li key={i.key} className="cart-item">
              <Link to={`/product/${i.id}`} className="cart-thumb-link">
                <ProductImage product={{ _id: i.key, ...i }} className="cart-thumb" width={200} />
              </Link>
              <div className="cart-item-info">
                <Link to={`/product/${i.id}`}><strong>{i.name}</strong></Link>
                {i.size && <span className="muted">Size: {i.size}</span>}
                <span>{formatPrice(i.price)} {i.qty > 1 && <span className="muted">× {i.qty} = {formatPrice(i.price * i.qty)}</span>}</span>
                <button className="btn btn-link remove-btn" onClick={() => updateQty(i.key, 0)}>Remove</button>
              </div>
              <div className="qty">
                <button onClick={() => updateQty(i.key, i.qty - 1)} disabled={i.qty <= 1} aria-label="Decrease">−</button>
                <span>{i.qty}</span>
                <button onClick={() => updateQty(i.key, i.qty + 1)} aria-label="Increase">+</button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="cart-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <p className="muted small">Delivery charges are confirmed on WhatsApp.</p>
          <WhatsAppButton className="btn btn-whatsapp full" message={cartMessage(items)}>
            Order bag on WhatsApp
          </WhatsAppButton>
          <button className="btn btn-link" onClick={confirmClear}>Clear bag</button>
        </aside>
      </div>
    </section>
  );
}
