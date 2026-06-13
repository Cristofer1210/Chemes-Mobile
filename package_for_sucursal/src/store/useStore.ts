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
    const all = await getAllProducts();
    set({ products: all });
  }
}));
