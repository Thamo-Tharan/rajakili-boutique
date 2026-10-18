import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import config from '../config.js';
import { getProducts } from '../api.js';
import ProductCard from '../components/ProductCard.jsx';

const SORTS = {
  newest: { label: 'Newest first', fn: () => 0 },
  low: { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  high: { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
};

const INTRO = {
  All: 'Every saree, kurti, lehenga and piece of jewellery in the store.',
  Sarees: 'Kanchipuram pure silk, soft silk and light Kota for every occasion.',
  Kurtis: 'Comfortable kurtis and kurta sets for daily, office and festive wear.',
  Lehengas: 'Bridal and festive lehengas with zari work. Made to measure on request.',
  Jewellery: 'Temple necklaces and statement earrings to finish the look.',
};

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || 'All';
  const urlSearch = params.get('search') || '';
  const [search, setSearch] = useState(urlSearch);
  const [sort, setSort] = useState('newest');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // A search from the header updates this page
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    setLoading(true);
    setError('');
    getProducts({ category })
      .then(setProducts)
      .catch(() => setError("Products couldn't load. Check your connection and refresh the page."))
      .finally(() => setLoading(false));
  }, [category]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q
      ? products.filter((p) => `${p.name} ${p.category} ${p.description} ${(p.colors || []).join(' ')}`.toLowerCase().includes(q))
      : products;
    return [...list].sort(SORTS[sort].fn);
  }, [products, search, sort]);

  const setCategory = (c) => {
    const next = new URLSearchParams(params);
    if (c === 'All') next.delete('category');
    else next.set('category', c);
    setParams(next);
  };

  const clearSearch = () => {
    setSearch('');
    const next = new URLSearchParams(params);
    next.delete('search');
    setParams(next, { replace: true });
  };

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">{category === 'All' ? 'All products' : category}</h1>
          <p>{INTRO[category] || INTRO.All}</p>
        </div>
      </section>

      <section className="container section shop-section">
        <div className="filters">
          <div className="chips" role="tablist" aria-label="Categories">
            {['All', ...config.categories].map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={category === c}
                className={`chip ${category === c ? 'active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="filter-controls">
            <label className="search-field">
              <Search size={17} aria-hidden="true" />
              <input
                type="search"
                placeholder="Search this collection"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search products"
              />
              {search && (
                <button type="button" onClick={clearSearch} aria-label="Clear search"><X size={16} /></button>
              )}
            </label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
              {Object.entries(SORTS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>

        {!loading && !error && (
          <p className="result-count">
            {visible.length} {visible.length === 1 ? 'style' : 'styles'}
            {search.trim() && <> for “{search.trim()}”</>}
          </p>
        )}

        {loading && <p className="muted">Loading the collection…</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && visible.length === 0 && (
          <div className="empty-state">
            <h2>Nothing matches “{search.trim()}”</h2>
            <p className="muted">Try another word, or browse every category.</p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={clearSearch}>Clear search</button>
              <Link to="/shop" className="btn btn-outline" onClick={clearSearch}>See all products</Link>
            </div>
          </div>
        )}

        <div className="product-grid">
          {visible.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
