import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Minus, Plus, ShoppingBag, Trash2, Truck, Undo2 } from 'lucide-react';
import { useCart } from '../CartContext.jsx';
import ProductImage from '../components/ProductImage.jsx';
import WhatsAppButton from '../components/WhatsAppButton.jsx';
import { cartMessage, formatPrice } from '../utils.js';

export default function Cart() {
  const { items, count, updateQty, clear, total, restoreItem } = useCart();
  const [removed, setRemoved] = useState(null);

  const removeItem = (item) => {
    const index = items.findIndex((i) => i.key === item.key);
    updateQty(item.key, 0);
    setRemoved({ item, index });
  };

  const undoRemove = () => {
    if (removed) restoreItem(removed.item, removed.index);
    setRemoved(null);
  };

  const confirmClear = () => {
    if (window.confirm(`Remove all ${count} ${count === 1 ? 'item' : 'items'} from your bag?`)) {
      clear();
      setRemoved(null);
    }
  };

  if (items.length === 0)
    return (
      <section className="container section empty-state">
        <span className="empty-icon"><ShoppingBag size={30} /></span>
        <h1 className="page-title">Your bag is empty</h1>
        {removed ? (
          <>
            <p className="muted">You removed {removed.item.name}.</p>
            <div className="hero-actions">
              <button className="btn btn-outline" onClick={undoRemove}><Undo2 size={18} /> Undo</button>
              <Link to="/shop" className="btn btn-primary">Keep shopping</Link>
            </div>
          </>
        ) : (
          <>
            <p className="muted">Find something you love in the collection.</p>
            <Link to="/shop" className="btn btn-primary">Start shopping</Link>
          </>
        )}
      </section>
    );

  return (
    <section className="container section">
      <div className="section-head">
        <h1 className="page-title">Your bag <span className="muted count-label">({count} {count === 1 ? 'item' : 'items'})</span></h1>
        <Link to="/shop" className="link-more back-link"><ArrowLeft size={16} /> Keep shopping</Link>
      </div>

      <div className="cart-layout">
        <div>
          <div className="cart-list-head">
            <span>Item</span>
            <button className="btn btn-danger-outline btn-sm" onClick={confirmClear}>
              <Trash2 size={16} /> Clear bag
            </button>
          </div>

          {removed && (
            <div className="undo-bar" role="status">
              <span>Removed <strong>{removed.item.name}</strong></span>
              <button className="btn btn-link" onClick={undoRemove}><Undo2 size={16} /> Undo</button>
            </div>
          )}

          <ul className="cart-list">
            {items.map((i) => (
              <li key={i.key} className="cart-item">
                <Link to={`/product/${i.id}`} className="cart-thumb-link">
                  <ProductImage product={{ _id: i.key, ...i }} className="cart-thumb" width={200} />
                </Link>
                <div className="cart-item-info">
                  <Link to={`/product/${i.id}`}><strong>{i.name}</strong></Link>
                  {i.size && <span className="muted">Size: {i.size}</span>}
                  <span className="muted">{formatPrice(i.price)} each</span>
                </div>
                <div className="cart-item-controls">
                  <div className="qty" aria-label={`Quantity for ${i.name}`}>
                    <button onClick={() => updateQty(i.key, i.qty - 1)} disabled={i.qty <= 1} aria-label="Decrease"><Minus size={15} /></button>
                    <span>{i.qty}</span>
                    <button onClick={() => updateQty(i.key, i.qty + 1)} aria-label="Increase"><Plus size={15} /></button>
                  </div>
                  <button className="remove-icon" onClick={() => removeItem(i)} aria-label={`Remove ${i.name}`} title="Remove">
                    <Trash2 size={18} />
                  </button>
                  <strong className="line-total">{formatPrice(i.price * i.qty)}</strong>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="cart-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <div className="summary-row muted-row">
            <span>Delivery</span>
            <span>Confirmed on WhatsApp</span>
          </div>
          <WhatsAppButton className="btn btn-whatsapp full btn-lg" message={cartMessage(items)}>
            <MessageCircle size={19} /> Order bag on WhatsApp
          </WhatsAppButton>
          <p className="summary-note"><Truck size={16} /> Delivery across India in 4 to 7 days</p>
        </aside>
      </div>

      <div className="sticky-buy cart-sticky">
        <div>
          <strong>{formatPrice(total)}</strong>
          <span>{count} {count === 1 ? 'item' : 'items'}</span>
        </div>
        <WhatsAppButton className="btn btn-whatsapp sticky-order" message={cartMessage(items)}>
          <MessageCircle size={19} /> Order on WhatsApp
        </WhatsAppButton>
      </div>
    </section>
  );
}
