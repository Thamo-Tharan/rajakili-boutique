import { Link } from 'react-router-dom';
import ProductImage from './ProductImage.jsx';
import { discountPercent, formatPrice } from '../utils.js';

export default function ProductCard({ product }) {
  const off = discountPercent(product.price, product.mrp);
  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-media">
        <ProductImage product={product} width={600} />
        {product.isNew && <span className="badge">New</span>}
        {product.stock === 0 && <span className="badge badge-out">Sold out</span>}
      </div>
      <div className="product-info">
        <span className="product-cat">{product.category}</span>
        <h3>{product.name}</h3>
        <div className="price-row">
          <span className="price">{formatPrice(product.price)}</span>
          {off > 0 && (
            <>
              <span className="mrp">{formatPrice(product.mrp)}</span>
              <span className="off">{off}% off</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
