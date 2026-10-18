import { Link } from 'react-router-dom';
import { useCart } from '../CartContext.jsx';
import ProductImage from '../components/ProductImage.jsx';
import { cartMessage, formatPrice, whatsappLink } from '../utils.js';

export default function Cart() {
  const { items, updateQty, clear, total } = useCart();

  if (items.length === 0)
    return (
      <section className="container section empty-state">
        <h1 className="page-title">Your bag is empty</h1>
        <p className="muted">Find something you love in the collection.</p>
        <Link to="/shop" className="btn btn-primary">Start shopping</Link>
      </section>
    );

  return (
    <section className="container section">
      <h1 className="page-title">Your bag</h1>
      <div className="cart-layout">
        <ul className="cart-list">
          {items.map((i) => (
            <li key={i.key} className="cart-item">
              <ProductImage product={{ _id: i.key, ...i }} className="cart-thumb" />
              <div className="cart-item-info">
                <Link to={`/product/${i.id}`}><strong>{i.name}</strong></Link>
                {i.size && <span className="muted">Size: {i.size}</span>}
                <span>{formatPrice(i.price)}</span>
              </div>
              <div className="qty">
                <button onClick={() => updateQty(i.key, i.qty - 1)} aria-label="Decrease">−</button>
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
          <a className="btn btn-whatsapp full" href={whatsappLink(cartMessage(items))} target="_blank" rel="noreferrer">
            Order bag on WhatsApp
          </a>
          <button className="btn btn-link" onClick={clear}>Clear bag</button>
        </aside>
      </div>
    </section>
  );
}
