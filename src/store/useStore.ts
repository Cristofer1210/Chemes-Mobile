import create from 'zustand';
import { Product } from '../models/Product';
import { initDB, bulkInsertProducts, getAllProducts } from '../services/sqliteService';

type State = {
  products: Product[];
  loadAll: () => Promise<void>;
  importAndSave: (items: Product[]) => Promise<void>;
};

export const useProductsStore = create<State>((set, get) => ({
  products: [],
  loadAll: async () => {
    await initDB();
    const items = await getAllProducts();
    set({ products: items });
  },
  importAndSave: async (items: Product[]) => {
    await initDB();
    await bulkInsertProducts(items);
    console.log('localStorage raw:', localStorage.getItem('chemes_products_v1'));
    const parsed = JSON.parse(localStorage.getItem('chemes_products_v1') || '[]');
    console.log('primer registro guardado en localStorage:', parsed[0]);
    const all = await getAllProducts();
    console.log('productos.length:', all.length);
    console.log('productos[0]:', all[0]);
    set({ products: all });
  }
}));
