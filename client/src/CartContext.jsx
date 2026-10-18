import { createContext, useContext, useEffect, useState } from 'react';
import { getProducts } from './api.js';

const CartContext = createContext(null);
const KEY = 'rajakili-cart-v2';

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  // Shows the 'Added to bag' pop-up
  const [lastAdded, setLastAdded] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* storage blocked: cart still works for this visit */
    }
  }, [items]);

  // Keep saved bag items in sync with the current catalogue (names, prices, photos)
  useEffect(() => {
    getProducts()
      .then((list) => {
        const byId = new Map(list.map((p) => [p._id, p]));
        setItems((prev) =>
          prev
            .filter((i) => byId.has(i.id))
            .map((i) => {
              const p = byId.get(i.id);
              return { ...i, name: p.name, price: p.price, image: p.image, colors: p.colors, category: p.category };
            })
        );
      })
      .catch(() => {
        /* keep the saved bag if products can't load */
      });
  }, []);

  const keyOf = (id, size) => `${id}__${size || ''}`;

  const addItem = (product, size, qty = 1) => {
    setLastAdded({ name: product.name, image: product.image, category: product.category, colors: product.colors, size, at: Date.now() });
    setItems((prev) => {
      const key = keyOf(product._id, size);
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      }
      return [
        ...prev,
        {
          key,
          id: product._id,
          name: product.name,
          price: product.price,
          category: product.category,
          colors: product.colors,
          image: product.image,
          size,
          qty,
        },
      ];
    });
  };

  const updateQty = (key, qty) =>
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i))
    );

  const clear = () => setItems([]);
  // Put a removed item back (Undo)
  const restoreItem = (item, index = Infinity) =>
    setItems((prev) => {
      if (prev.some((i) => i.key === item.key)) return prev;
      const next = [...prev];
      next.splice(Math.min(index, next.length), 0, item);
      return next;
    });
  // count = different products in the bag; pieces = total quantity
  const count = items.length;
  const pieces = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, clear, restoreItem, count, pieces, total, lastAdded, dismissAdded: () => setLastAdded(null) }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
