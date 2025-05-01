import { NextApiRequest, NextApiResponse } from 'next';
import { searchStocks } from '@/lib/alpha-vantage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { query } = req.query;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    const results = await searchStocks(query);
    return res.status(200).json(results);
  } catch (error) {
    console.error('Error in search API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}