// Alpha Vantage API utility functions

const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

export interface StockQuote {
  symbol: string;
  name?: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  sector?: string;
  updatedAt: Date;
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  marketOpen: string;
  marketClose: string;
  timezone: string;
  currency: string;
  matchScore: string;
}

/**
 * Search for stocks by keywords
 */
export async function searchStocks(query: string): Promise<StockSearchResult[]> {
  try {
    const response = await fetch(
      `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.bestMatches) {
      return [];
    }
    
    // Filter for Indian stocks only (NSE, BSE)
    const indianStocks = data.bestMatches.filter((match: any) => {
      const region = match['4. region'];
      const currency = match['8. currency'];
      return (region === 'India' || region === 'India/NSE' || region === 'India/BSE') && currency === 'INR';
    });
    
    return indianStocks.map((match: any) => ({
      symbol: match['1. symbol'],
      name: match['2. name'],
      type: match['3. type'],
      region: match['4. region'],
      marketOpen: match['5. marketOpen'],
      marketClose: match['6. marketClose'],
      timezone: match['7. timezone'],
      currency: match['8. currency'],
      matchScore: match['9. matchScore']
    }));
  } catch (error) {
    console.error('Error searching stocks:', error);
    return [];
  }
}

/**
 * Get global quote for a stock
 */
export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  try {
    const response = await fetch(
      `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data['Global Quote'] || Object.keys(data['Global Quote']).length === 0) {
      return null;
    }
    
    const quote = data['Global Quote'];
    const currentPrice = parseFloat(quote['05. price']);
    const previousClose = parseFloat(quote['08. previous close']);
    const change = parseFloat(quote['09. change']);
    const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
    
    return {
      symbol,
      currentPrice,
      previousClose,
      change,
      changePercent,
      volume: parseInt(quote['06. volume']),
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    return null;
  }
}

/**
 * Get company overview for a stock
 */
export async function getCompanyOverview(symbol: string): Promise<any | null> {
  try {
    const response = await fetch(
      `${BASE_URL}?function=OVERVIEW&symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || Object.keys(data).length === 0 || data.Note) {
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching company overview:', error);
    return null;
  }
}

/**
 * Get daily time series for a stock
 */
export async function getDailyTimeSeries(symbol: string, outputSize: 'compact' | 'full' = 'compact'): Promise<any | null> {
  try {
    const response = await fetch(
      `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol)}&outputsize=${outputSize}&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data['Time Series (Daily)'] || Object.keys(data['Time Series (Daily)']).length === 0) {
      return null;
    }
    
    return data['Time Series (Daily)'];
  } catch (error) {
    console.error('Error fetching daily time series:', error);
    return null;
  }
}

/**
 * Get complete stock data (quote + company overview)
 */
export async function getCompleteStockData(symbol: string): Promise<StockQuote | null> {
  try {
    const [quote, overview] = await Promise.all([
      getStockQuote(symbol),
      getCompanyOverview(symbol)
    ]);
    
    if (!quote) {
      return null;
    }
    
    if (overview) {
      quote.name = overview.Name;
      quote.marketCap = parseFloat(overview.MarketCapitalization);
      quote.sector = overview.Sector;
    }
    
    return quote;
  } catch (error) {
    console.error('Error fetching complete stock data:', error);
    return null;
  }
}