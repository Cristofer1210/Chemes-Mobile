import * as XLSX from 'xlsx';
import { Product } from '../models/Product';

function normalizeHeader(h: string) {
  return h
    .toString()
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_')
    .replace(/[^A-Z0-9_]/g, '');
}

function mapRow(raw: any, headerMap: Record<string, string>): Product {
  const get = (keys: string[]) => {
    for (const k of keys) {
      if (raw[k] !== undefined && raw[k] !== null && raw[k] !== '') return raw[k];
    }
    return null;
  };

  const num = (v: any) => {
    if (v === null || v === undefined || v === '') return 0;
    const n = parseFloat(String(v).replace(',', '.'));
    return isNaN(n) ? 0 : n;
  };

  return {
    CODIGO: String(get([headerMap['CODIGO']]) ?? '') ,
    DESCRIPCION: String(get([headerMap['DESCRIPCION']]) ?? ''),
    DESC_ADICIONAL: get([headerMap['DESC_ADICIONAL']]) ?? null,
    RUBRO: get([headerMap['RUBRO']]) ?? null,
    SUB_RUBRO: get([headerMap['SUB_RUBRO']]) ?? null,
    SUCURSAL: get([headerMap['SUCURSAL']]) ?? null,
    SALDO: num(get([headerMap['SALDO']])),
    DEPOSITO: get([headerMap['DEPOSITO']]) ?? null,
    PENDIENTE: num(get([headerMap['PENDIENTE']])),
    LISTA_1: num(get([headerMap['LISTA_1']])),
    LISTA_2: num(get([headerMap['LISTA_2']])),
    LISTA_3: num(get([headerMap['LISTA_3']])),
    LISTA_4: num(get([headerMap['LISTA_4']])),
    LISTA_6: num(get([headerMap['LISTA_6']])),
  };
}

export async function importXLSXFromFile(file: File): Promise<{ count: number; items: Product[] }> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });
  const firstSheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[firstSheetName];
  const raw: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null, blankrows: false });

  if (!raw || raw.length === 0) return { count: 0, items: [] };

  // Build header map using normalization of keys from first row keys
  const headers = Object.keys(raw[0]);
  const normalized: Record<string, string> = {};
  for (const h of headers) {
    normalized[normalizeHeader(h)] = h;
  }

  const required = ['CODIGO','DESCRIPCION','DESC_ADICIONAL','RUBRO','SUB_RUBRO','SUCURSAL','SALDO','DEPOSITO','PENDIENTE','LISTA_1','LISTA_2','LISTA_3','LISTA_4','LISTA_6'];

  const headerMap: Record<string,string> = {};
  for (const k of required) {
    const candidates = Object.keys(normalized).filter(n => n === k || n.replace(/_/g,'') === k.replace(/_/g,'') || n.includes(k.split('_')[0]));
    if (candidates.length) headerMap[k] = normalized[candidates[0]];
    else headerMap[k] = k;
  }

  const items: Product[] = raw.map(r => mapRow(r, headerMap));
  return { count: items.length, items };
}

export async function importXLSXFromUri(uri: string): Promise<{ count: number; items: Product[] }> {
  // fetch and then read as arrayBuffer
  const res = await fetch(uri);
  const buf = await res.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });
  const firstSheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[firstSheetName];
  const raw: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null, blankrows: false });
  if (!raw || raw.length === 0) return { count: 0, items: [] };
  const headers = Object.keys(raw[0]);
  const normalized: Record<string, string> = {};
  for (const h of headers) {
    normalized[normalizeHeader(h)] = h;
  }
  const required = ['CODIGO','DESCRIPCION','DESC_ADICIONAL','RUBRO','SUB_RUBRO','SUCURSAL','SALDO','DEPOSITO','PENDIENTE','LISTA_1','LISTA_2','LISTA_3','LISTA_4','LISTA_6'];
  const headerMap: Record<string,string> = {};
  for (const k of required) {
    const candidates = Object.keys(normalized).filter(n => n === k || n.replace(/_/g,'') === k.replace(/_/g,'') || n.includes(k.split('_')[0]));
    if (candidates.length) headerMap[k] = normalized[candidates[0]];
    else headerMap[k] = k;
  }
  const items: Product[] = raw.map(r => mapRow(r, headerMap));
  return { count: items.length, items };
}
