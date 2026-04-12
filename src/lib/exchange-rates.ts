export type ExchangeRates = Record<string, number>;

let cachedRates: { rates: ExchangeRates; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function getExchangeRates(
  baseCurrency: string = "USD"
): Promise<ExchangeRates> {
  if (cachedRates && Date.now() - cachedRates.timestamp < CACHE_DURATION) {
    return cachedRates.rates;
  }

  try {
    const res = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    cachedRates = { rates: data.rates, timestamp: Date.now() };
    return data.rates;
  } catch {
    // Fallback rates if API is down
    return { USD: 1, MAD: 10.0, EUR: 0.92 };
  }
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRates
): number {
  if (fromCurrency === toCurrency) return amount;

  // Convert to USD first (base), then to target
  const amountInUSD = amount / (rates[fromCurrency] || 1);
  return amountInUSD * (rates[toCurrency] || 1);
}

export function formatCurrency(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
