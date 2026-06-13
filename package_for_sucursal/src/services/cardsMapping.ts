/**
 * Mapeo configurable de entidades (tarjetas/bancos) a la lista de precio usada
 * La tabla real de equivalencias debe reemplazar los valores por defecto aquí.
 * Cada entrada puede especificar `listKey` (ej. 'LISTA_3') y opcionalmente
 * una tabla de multiplicadores por plazo `termMultiplier` si la financiera
 * aplica un coeficiente distinto al precio de lista.
 */

export type CardMapping = {
  id: string;
  name: string;
  listKey: keyof any; // e.g. 'LISTA_1' | 'LISTA_2' | ...
  // Optional per-term multiplier (term in months -> multiplier to apply over list price)
  termMultiplier?: Record<number, number>;
};

export const DEFAULT_CARDS: CardMapping[] = [
  { id: 'chemes', name: 'Crédito Chemes', listKey: 'LISTA_2' },
  { id: 'nacion', name: 'Banco Nación', listKey: 'LISTA_3' },
  { id: 'naranja', name: 'Naranja', listKey: 'LISTA_4' },
  { id: 'visa_naranja', name: 'Visa Naranja', listKey: 'LISTA_4' },
  { id: 'macro', name: 'Macro', listKey: 'LISTA_3' },
  { id: 'bbva', name: 'BBVA', listKey: 'LISTA_3' },
  { id: 'galicia', name: 'Galicia', listKey: 'LISTA_3' },
  { id: 'cabal', name: 'Cabal', listKey: 'LISTA_6' }
  // Agregar otros bancos según tabla real
];

export function findCardById(id: string): CardMapping | undefined {
  return DEFAULT_CARDS.find(c => c.id === id);
}
