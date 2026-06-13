import Papa from 'papaparse';
import { Product } from '../models/Product';

export async function importFromCSV(text: string): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const data = results.data as any[];
        const items: Product[] = data.map((r) => ({
          CODIGO: (r['CODIGO'] || r['codigo'] || '').toString(),
          DESCRIPCION: (r['DESCRIPCION'] || r['descripcion'] || '').toString(),
          DESC_ADICIONAL: r['DESC_ADICIONAL'] || r['desc_adicional'] || null,
          RUBRO: r['RUBRO'] || null,
          SUB_RUBRO: r['SUB_RUBRO'] || null,
          SUCURSAL: r['SUCURSAL'] || null,
          SALDO: parseFloat(r['SALDO'] || '0') || 0,
          DEPOSITO: r['DEPOSITO'] || null,
          PENDIENTE: parseFloat(r['PENDIENTE'] || '0') || 0,
          LISTA_1: parseFloat(r['LISTA_1'] || '0') || 0,
          LISTA_2: parseFloat(r['LISTA_2'] || '0') || 0,
          LISTA_3: parseFloat(r['LISTA_3'] || '0') || 0,
          LISTA_4: parseFloat(r['LISTA_4'] || '0') || 0,
          LISTA_6: parseFloat(r['LISTA_6'] || '0') || 0
        }));
        resolve(items);
      },
      error: (err: any) => reject(err)
    });
  });
}
