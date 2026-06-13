import { CardMapping, DEFAULT_CARDS } from './cardsMapping';
import { Product } from '../models/Product';
import { calculateCredit, AVAILABLE_TERMS } from './creditoChemes';

export type CardResult = {
  id: string;
  name: string;
  listKey: string;
  listPrice: number;
  totalFinanced: number;
  monthlyPayment: number;
  differenceAgainstCash: number;
};

function getListPrice(product: Product, listKey: string): number {
  const key = listKey.toUpperCase();
  const val = (product as any)[key];
  if (val === undefined || val === null) return 0;
  const n = Number(val);
  return isNaN(n) ? 0 : n;
}

export function calculateForCard(product: Product, card: CardMapping, term: number): CardResult {
  const listPrice = getListPrice(product, String(card.listKey));

  // If the card mapping defines a per-term multiplier, apply it; otherwise assume
  // the listPrice already encodes the financed total for the term (common case).
  let totalFinanced = listPrice;
  if (card.termMultiplier && card.termMultiplier[term]) {
    totalFinanced = listPrice * card.termMultiplier[term];
  }

  const monthlyPayment = term > 0 ? totalFinanced / term : totalFinanced;
  const differenceAgainstCash = totalFinanced - (Number(product.LISTA_2 ?? 0));

  return {
    id: card.id,
    name: card.name,
    listKey: String(card.listKey),
    listPrice,
    totalFinanced,
    monthlyPayment,
    differenceAgainstCash
  };
}

export function compareAllCards(product: Product, term: number): CardResult[] {
  const cards = DEFAULT_CARDS;
  const results: CardResult[] = [];
  for (const c of cards) {
    results.push(calculateForCard(product, c, term));
  }

  // Sort by totalFinanced ascending
  results.sort((a,b) => a.totalFinanced - b.totalFinanced);
  return results;
}
