export function formatCurrency(value) {
  return `\u20B9${Number(value || 0).toLocaleString()}`;
}
