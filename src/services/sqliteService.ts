import { Product } from '../models/Product';

const STORAGE_KEY = 'chemes_products_v1';

export async function initDB() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
}

function readAll(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Product[];
  } catch (e) {
    console.error('readAll parse', e);
    return [];
  }
}

function writeAll(items: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export async function bulkInsertProducts(items: Product[]) {
  if (!items || items.length === 0) return;
  const existing = readAll();
  const map = new Map<string, Product>();
  for (const e of existing) map.set(e.CODIGO, e);
  for (const it of items) map.set(it.CODIGO, it);
  const merged = Array.from(map.values());
  writeAll(merged);
}

export async function getAllProducts(): Promise<Product[]> {
  const all = readAll();
  return all.slice(0, 1000);
}

export async function searchProducts(q: string): Promise<Product[]> {
  if (!q) return [];
  const s = q.toLowerCase();
  const all = readAll();
  const res = all.filter(p => (p.CODIGO || '').toLowerCase().includes(s) || (p.DESCRIPCION || '').toLowerCase().includes(s));
  return res.slice(0, 500);
}

