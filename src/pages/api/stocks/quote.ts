import { NextApiRequest, NextApiResponse } from 'next';
import { getCompleteStockData } from '@/lib/alpha-vantage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { symbol } = req.query;

  if (!symbol || typeof symbol !== 'string') {
    return res.status(400).json({ message: 'Symbol parameter is required' });
  }

  try {
    const stockData = await getCompleteStockData(symbol);
    
    if (!stockData) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    
    return res.status(200).json(stockData);
  } catch (error) {
    console.error('Error in quote API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}