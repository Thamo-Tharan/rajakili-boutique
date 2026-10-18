import config from './config.js';

export const formatPrice = (n) =>
  '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

export const discountPercent = (price, mrp) =>
  mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

export function whatsappLink(message) {
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function singleItemMessage(product, size, qty = 1) {
  return [
    `Hi ${config.shopName}! I'd like to order:`,
    '',
    `• ${product.name}`,
    size ? `  Size: ${size}` : null,
    `  Qty: ${qty}`,
    `  Price: ${formatPrice(product.price)}`,
    '',
    'Please confirm availability. Thank you!',
  ]
    .filter((line) => line !== null)
    .join('\n');
}

export function cartMessage(items) {
  const lines = items.map(
    (i) =>
      `• ${i.name}${i.size ? ` (${i.size})` : ''} × ${i.qty} = ${formatPrice(i.price * i.qty)}`
  );
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  return [
    `Hi ${config.shopName}! I'd like to order:`,
    '',
    ...lines,
    '',
    `Total: ${formatPrice(total)}`,
    '',
    'Please confirm availability and delivery charges. Thank you!',
  ].join('\n');
}
