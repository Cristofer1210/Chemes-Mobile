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

function pickHeader(normalized: Record<string, string>, aliases: string[]) {
  const keys = Object.keys(normalized);
  for (const alias of aliases) {
    const target = normalizeHeader(alias);
    const match = keys.find(n => n === target || n.replace(/_/g, '') === target.replace(/_/g, '') || n.includes(target) || target.includes(n));
    if (match) return normalized[match];
  }
  return null;
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

  const headers = Object.keys(raw[0]);
  const normalized: Record<string, string> = {};
  for (const h of headers) {
    normalized[normalizeHeader(h)] = h;
  }

  const headerMap: Record<string,string> = {};
  headerMap['CODIGO'] = pickHeader(normalized, ['CODIGO', 'Código', 'Codigo', 'CÓDIGO']) ?? 'CODIGO';
  headerMap['DESCRIPCION'] = pickHeader(normalized, ['DESCRIPCION', 'Descripción', 'Descripcion', 'DESCRIPCIÓN', 'Detalle', 'Nombre']) ?? 'DESCRIPCION';
  headerMap['LISTA_2'] = pickHeader(normalized, ['LISTA_2', 'Lista 2', 'Lista2', 'Precio', 'Precio Venta', 'PVP', 'Importe', 'Valor']) ?? 'LISTA_2';
  headerMap['SALDO'] = pickHeader(normalized, ['SALDO', 'Stock', 'Existencia', 'Cantidad', 'Disponible', 'Saldo']) ?? 'SALDO';
  headerMap['DESC_ADICIONAL'] = pickHeader(normalized, ['DESC_ADICIONAL', 'Desc Adicional', 'Descripción Adicional']) ?? 'DESC_ADICIONAL';
  headerMap['RUBRO'] = pickHeader(normalized, ['RUBRO']) ?? 'RUBRO';
  headerMap['SUB_RUBRO'] = pickHeader(normalized, ['SUB_RUBRO', 'Sub Rubro']) ?? 'SUB_RUBRO';
  headerMap['SUCURSAL'] = pickHeader(normalized, ['SUCURSAL', 'Sucursal']) ?? 'SUCURSAL';
  headerMap['DEPOSITO'] = pickHeader(normalized, ['DEPOSITO', 'Depósito', 'Deposito']) ?? 'DEPOSITO';
  headerMap['PENDIENTE'] = pickHeader(normalized, ['PENDIENTE', 'Pendiente']) ?? 'PENDIENTE';
  headerMap['LISTA_1'] = pickHeader(normalized, ['LISTA_1', 'Lista 1', 'Lista1']) ?? 'LISTA_1';
  headerMap['LISTA_3'] = pickHeader(normalized, ['LISTA_3', 'Lista 3', 'Lista3']) ?? 'LISTA_3';
  headerMap['LISTA_4'] = pickHeader(normalized, ['LISTA_4', 'Lista 4', 'Lista4']) ?? 'LISTA_4';
  headerMap['LISTA_6'] = pickHeader(normalized, ['LISTA_6', 'Lista 6', 'Lista6']) ?? 'LISTA_6';

  const items: Product[] = raw.map(r => mapRow(r, headerMap));
  console.log('Primer registro leído del XLSX:', raw[0]);
  console.log('Primer producto mapeado:', items[0]);
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
  const headerMap: Record<string,string> = {};
  headerMap['CODIGO'] = pickHeader(normalized, ['CODIGO', 'Código', 'Codigo', 'CÓDIGO']) ?? 'CODIGO';
  headerMap['DESCRIPCION'] = pickHeader(normalized, ['DESCRIPCION', 'Descripción', 'Descripcion', 'DESCRIPCIÓN', 'Detalle', 'Nombre']) ?? 'DESCRIPCION';
  headerMap['LISTA_2'] = pickHeader(normalized, ['LISTA_2', 'Lista 2', 'Lista2', 'Precio', 'Precio Venta', 'PVP', 'Importe', 'Valor']) ?? 'LISTA_2';
  headerMap['SALDO'] = pickHeader(normalized, ['SALDO', 'Stock', 'Existencia', 'Cantidad', 'Disponible', 'Saldo']) ?? 'SALDO';
  headerMap['DESC_ADICIONAL'] = pickHeader(normalized, ['DESC_ADICIONAL', 'Desc Adicional', 'Descripción Adicional']) ?? 'DESC_ADICIONAL';
  headerMap['RUBRO'] = pickHeader(normalized, ['RUBRO']) ?? 'RUBRO';
  headerMap['SUB_RUBRO'] = pickHeader(normalized, ['SUB_RUBRO', 'Sub Rubro']) ?? 'SUB_RUBRO';
  headerMap['SUCURSAL'] = pickHeader(normalized, ['SUCURSAL', 'Sucursal']) ?? 'SUCURSAL';
  headerMap['DEPOSITO'] = pickHeader(normalized, ['DEPOSITO', 'Depósito', 'Deposito']) ?? 'DEPOSITO';
  headerMap['PENDIENTE'] = pickHeader(normalized, ['PENDIENTE', 'Pendiente']) ?? 'PENDIENTE';
  headerMap['LISTA_1'] = pickHeader(normalized, ['LISTA_1', 'Lista 1', 'Lista1']) ?? 'LISTA_1';
  headerMap['LISTA_3'] = pickHeader(normalized, ['LISTA_3', 'Lista 3', 'Lista3']) ?? 'LISTA_3';
  headerMap['LISTA_4'] = pickHeader(normalized, ['LISTA_4', 'Lista 4', 'Lista4']) ?? 'LISTA_4';
  headerMap['LISTA_6'] = pickHeader(normalized, ['LISTA_6', 'Lista 6', 'Lista6']) ?? 'LISTA_6';
  const items: Product[] = raw.map(r => mapRow(r, headerMap));
  console.log('Primer registro leído del XLSX:', raw[0]);
  console.log('Primer producto mapeado:', items[0]);
  return { count: items.length, items };
}
