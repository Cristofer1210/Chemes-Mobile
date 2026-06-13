export type DeliveryMode = 'con' | 'sin';

const COEFFICIENTS: Record<DeliveryMode, Record<number, number>> = {
  con: {
    3: 1.07,
    6: 1.23,
    12: 1.60,
    15: 1.80,
    18: 1.96
  },
  sin: {
    3: 1.12,
    6: 1.27,
    12: 1.67,
    15: 1.87,
    18: 2.02
  }
};

const PROTECTIONS: Record<number, number> = {
  0: 0,
  1: 0.13,
  2: 0.20,
  3: 0.25,
  4: 0.35
};

export type CreditOptions = {
  term: number; // months
  delivery: DeliveryMode;
  protectionYears: number; // 0-4
};

export type CreditResult = {
  priceBase: number;
  protectionPercent: number;
  protectionCost: number;
  priceWithProtection: number;
  coefficient: number;
  totalFinanced: number;
  monthlyPayment: number;
  differenceAgainstCash: number;
};

export function calculateCredit(priceBase: number, options: CreditOptions): CreditResult {
  const term = options.term;
  const delivery = options.delivery;
  const protectionYears = options.protectionYears;

  const coefficient = COEFFICIENTS[delivery][term] ?? 1;
  const protectionPercent = PROTECTIONS[protectionYears] ?? 0;

  const protectionCost = priceBase * protectionPercent;
  const priceWithProtection = priceBase + protectionCost;

  // Total financed: apply coefficient over base price (LISTA_2) then add protectionCost
  const totalFinanced = priceBase * coefficient + protectionCost;

  const monthlyPayment = term > 0 ? totalFinanced / term : totalFinanced;

  const differenceAgainstCash = totalFinanced - priceBase;

  return {
    priceBase,
    protectionPercent,
    protectionCost,
    priceWithProtection,
    coefficient,
    totalFinanced,
    monthlyPayment,
    differenceAgainstCash
  };
}

export const AVAILABLE_TERMS = [3,6,12,15,18];
export const AVAILABLE_PROTECTIONS = [0,1,2,3,4];
