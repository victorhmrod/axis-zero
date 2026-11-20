/** Sacola de mentira: guarda os itens no navegador (localStorage). Sem servidor. */
export interface CartItem {
  slug: string;
  finish: string;
  qty: number;
}

const KEY = 'az-cart-v2';
const MAX = 9;

const valid = (i: unknown): i is CartItem =>
  !!i && typeof (i as CartItem).slug === 'string' && typeof (i as CartItem).finish === 'string' &&
  Number.isInteger((i as CartItem).qty) && (i as CartItem).qty > 0;

export const read = (): CartItem[] => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(v) ? v.filter(valid).map((i) => ({ ...i, qty: Math.min(MAX, i.qty) })) : [];
  } catch {
    return [];
  }
};

const write = (items: CartItem[]) => {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  window.dispatchEvent(new CustomEvent('az:cart-change'));
};

export const count = () => read().reduce((n, i) => n + i.qty, 0);

export const add = (slug: string, finish: string, qty = 1) => {
  const items = read();
  const found = items.find((i) => i.slug === slug && i.finish === finish);
  if (found) found.qty = Math.min(MAX, found.qty + qty);
  else items.push({ slug, finish, qty: Math.min(MAX, qty) });
  write(items);
};

export const setQty = (slug: string, finish: string, qty: number) => {
  const items = read();
  const found = items.find((i) => i.slug === slug && i.finish === finish);
  if (!found) return;
  found.qty = Math.max(1, Math.min(MAX, qty));
  write(items);
};

export const remove = (slug: string, finish: string) =>
  write(read().filter((i) => !(i.slug === slug && i.finish === finish)));

export const clear = () => write([]);
