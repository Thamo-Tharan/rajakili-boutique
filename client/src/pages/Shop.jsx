import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import config from '../config.js';
import { getProducts } from '../api.js';
import ProductCard from '../components/ProductCard.jsx';

const SORTS = {
  newest: { label: 'Newest', fn: () => 0 },
  low: { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  high: { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
};

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || 'All';
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getProducts({ category })
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [category]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products;
    return [...list].sort(SORTS[sort].fn);
  }, [products, search, sort]);

  const setCategory = (c) => {
    if (c === 'All') params.delete('category');
    else params.set('category', c);
    setParams(params);
  };

  return (
    <section className="container section">
      <div className="section-head">
        <h1 className="page-title">{category === 'All' ? 'All products' : category}</h1>
      </div>

      <div className="filters">
        <div className="chips">
          {['All', ...config.categories].map((c) => (
            <button
              key={c}
              className={`chip ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="filter-controls">
          <input
            type="search"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="muted">Loading…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && visible.length === 0 && <p className="muted">No products found.</p>}

      <div className="product-grid">
        {visible.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
