import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { useCart } from '../CartContext.jsx';
import ProductImage from './ProductImage.jsx';

// Small pop-up after adding to the bag, with a quick way to view it.
export default function AddedToast() {
  const { lastAdded, dismissAdded, count } = useCart();

  useEffect(() => {
    if (!lastAdded) return undefined;
    const t = setTimeout(dismissAdded, 4500);
    return () => clearTimeout(t);
  }, [lastAdded]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!lastAdded) return null;

  return (
    <div className="toast" role="status" key={lastAdded.at}>
      <ProductImage product={{ _id: 'toast', ...lastAdded }} width={160} className="toast-img" />
      <div className="toast-body">
        <span className="toast-title"><Check size={16} strokeWidth={2.5} /> Added to your bag</span>
        <span className="toast-name">{lastAdded.name}{lastAdded.size ? ` · ${lastAdded.size}` : ''}</span>
        <Link to="/cart" className="toast-link" onClick={dismissAdded}>View bag ({count})</Link>
      </div>
      <button className="toast-close" onClick={dismissAdded} aria-label="Close"><X size={16} /></button>
    </div>
  );
}
