import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import ProductImage from './ProductImage.jsx';
import { useCart } from '../CartContext.jsx';
import { discountPercent, formatPrice } from '../utils.js';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const off = discountPercent(product.price, product.mrp);
  const soldOut = product.stock === 0;
  const oneSize = !product.sizes?.length || product.sizes.length === 1;

  // Quick add: one-size items go straight to the bag, others open the product to pick a size
  const quickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (oneSize) addItem(product, product.sizes?.[0] || '', 1);
    else navigate(`/product/${product._id}`);
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-media">
        <ProductImage product={product} width={600} />
        <div className="card-badges">
          {product.isNew && <span className="badge">New</span>}
          {off > 0 && <span className="badge badge-off">{off}% off</span>}
        </div>
        {soldOut ? (
          <span className="sold-out">Sold out</span>
        ) : (
          <button className="quick-add" onClick={quickAdd} aria-label={oneSize ? `Add ${product.name} to bag` : `Choose a size for ${product.name}`}>
            <Plus size={16} strokeWidth={2.5} />
            <span>{oneSize ? 'Add' : 'Choose size'}</span>
          </button>
        )}
      </div>
      <div className="product-info">
        <span className="product-cat">{product.category}</span>
        <h3>{product.name}</h3>
        <div className="price-row">
          <span className="price">{formatPrice(product.price)}</span>
          {off > 0 && <span className="mrp">{formatPrice(product.mrp)}</span>}
        </div>
        {!soldOut && product.stock <= 3 && <span className="low-stock">Only {product.stock} left</span>}
      </div>
    </Link>
  );
}
