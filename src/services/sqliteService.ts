import { Product } from '../models/Product';
import { supabase } from '../lib/supabase';

type ProductRow = {
  id?: number;
  codigo: string;
  descripcion: string;
  desc_adicional?: string | null;
  rubro?: string | null;
  sub_rubro?: string | null;
  sucursal?: string | null;
  saldo?: number | null;
  deposito?: string | null;
  pendiente?: number | null;
  lista_1?: number | null;
  lista_2?: number | null;
  lista_3?: number | null;
  lista_4?: number | null;
  lista_6?: number | null;
  created_at?: string;
};

function toDbRow(item: Product): ProductRow {
  return {
    codigo: item.CODIGO,
    descripcion: item.DESCRIPCION,
    desc_adicional: item.DESC_ADICIONAL ?? null,
    rubro: item.RUBRO ?? null,
    sub_rubro: item.SUB_RUBRO ?? null,
    sucursal: item.SUCURSAL ?? null,
    saldo: item.SALDO ?? null,
    deposito: item.DEPOSITO ?? null,
    pendiente: item.PENDIENTE ?? null,
    lista_1: item.LISTA_1 ?? null,
    lista_2: item.LISTA_2 ?? null,
    lista_3: item.LISTA_3 ?? null,
    lista_4: item.LISTA_4 ?? null,
    lista_6: item.LISTA_6 ?? null,
  };
}

function fromDbRow(row: ProductRow): Product {
  return {
    CODIGO: row.codigo,
    DESCRIPCION: row.descripcion,
    DESC_ADICIONAL: row.desc_adicional ?? null,
    RUBRO: row.rubro ?? null,
    SUB_RUBRO: row.sub_rubro ?? null,
    SUCURSAL: row.sucursal ?? null,
    SALDO: row.saldo ?? null,
    DEPOSITO: row.deposito ?? null,
    PENDIENTE: row.pendiente ?? null,
    LISTA_1: row.lista_1 ?? null,
    LISTA_2: row.lista_2 ?? null,
    LISTA_3: row.lista_3 ?? null,
    LISTA_4: row.lista_4 ?? null,
    LISTA_6: row.lista_6 ?? null,
  };
}

export async function initDB() {
  return;
}

export async function bulkInsertProducts(items: Product[]): Promise<{ count: number; firstRecord: Product | null }> {
  if (!items || items.length === 0) return { count: 0, firstRecord: null };
  const rows = items.map(toDbRow);
  const codes = rows.map(row => row.codigo);

  const { error: deleteError } = await supabase
    .from('productos')
    .delete()
    .in('codigo', codes);

  if (deleteError) throw deleteError;

  const { data, error } = await supabase
    .from('productos')
    .insert(rows)
    .select('*');

  if (error) throw error;

  const mapped = (data ?? []).map(row => fromDbRow(row as ProductRow));
  return { count: mapped.length, firstRecord: mapped[0] ?? null };
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .order('codigo', { ascending: true })
    .limit(1000);

  if (error) throw error;
  return ((data ?? []) as ProductRow[]).map(fromDbRow);
}

export async function searchProducts(q: string): Promise<Product[]> {
  if (!q) return [];
  const s = q.trim();
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .or(`codigo.ilike.%${s}%,descripcion.ilike.%${s}%`)
    .limit(500);

  if (error) throw error;
  return ((data ?? []) as ProductRow[]).map(fromDbRow);
}

