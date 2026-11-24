import { CurrencyType } from '../types';

export interface CurrencyRates {
  USD: number;
  RUB: number;
  EUR: number;
  updatedAt: string;
}

const DEFAULT_RATES: CurrencyRates = {
  USD: 12850,
  RUB: 145,
  EUR: 13800,
  updatedAt: new Date().toISOString()
};

const STORAGE_KEY = 'moneytracker_currency_rates_v1';

export const getStoredRates = (): CurrencyRates => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.USD === 'number' && typeof parsed.RUB === 'number') {
        return parsed;
      }
    }
  } catch {
    // ignore parse error
  }
  return DEFAULT_RATES;
};

export const fetchLiveRates = async (): Promise<CurrencyRates> => {
  const current = getStoredRates();

  // 1. Try Central Bank of Uzbekistan (cbu.uz)
  try {
    const res = await fetch('https://cbu.uz/uz/arkhiv-kursov-valyut/json/', {
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        const usdItem = data.find((i: any) => i.Ccy === 'USD');
        const rubItem = data.find((i: any) => i.Ccy === 'RUB');
        const eurItem = data.find((i: any) => i.Ccy === 'EUR');

        const usdRate = usdItem?.Rate ? parseFloat(usdItem.Rate) : current.USD;
        const rubRate = rubItem?.Rate ? parseFloat(rubItem.Rate) : current.RUB;
        const eurRate = eurItem?.Rate ? parseFloat(eurItem.Rate) : current.EUR;

        if (usdRate > 0 && rubRate > 0) {
          const newRates: CurrencyRates = {
            USD: Math.round(usdRate * 100) / 100,
            RUB: Math.round(rubRate * 100) / 100,
            EUR: Math.round(eurRate * 100) / 100,
            updatedAt: new Date().toISOString()
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newRates));
          return newRates;
        }
      }
    }
  } catch {
    // Primary failed, continue to fallback
  }

  // 2. Secondary fallback API: open.er-api.com
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (res.ok) {
      const data = await res.json();
      const uzsRate = data?.rates?.UZS;
      const rubRateUsd = data?.rates?.RUB;

      if (uzsRate && rubRateUsd) {
        const rubToUzs = uzsRate / rubRateUsd;
        const newRates: CurrencyRates = {
          USD: Math.round(uzsRate * 100) / 100,
          RUB: Math.round(rubToUzs * 100) / 100,
          EUR: Math.round((uzsRate / (data.rates.EUR || 0.95)) * 100) / 100,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newRates));
        return newRates;
      }
    }
  } catch {
    // Secondary failed
  }

  return current;
};

export const convertAmount = (
  amount: number,
  from: CurrencyType,
  to: CurrencyType,
  rates: CurrencyRates
): number => {
  if (from === to || amount === 0) return amount;

  // First convert `from` to UZS
  let inUZS = amount;
  if (from === 'USD') inUZS = amount * rates.USD;
  else if (from === 'RUB') inUZS = amount * rates.RUB;

  // Then convert UZS to `to`
  if (to === 'UZS') return inUZS;
  if (to === 'USD') return inUZS / rates.USD;
  if (to === 'RUB') return inUZS / rates.RUB;

  return inUZS;
};
