import { NextApiRequest, NextApiResponse } from 'next';
import { getDailyTimeSeries } from '@/lib/alpha-vantage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { symbol, outputSize } = req.query;

  if (!symbol || typeof symbol !== 'string') {
    return res.status(400).json({ message: 'Symbol parameter is required' });
  }

  try {
    const timeSeriesData = await getDailyTimeSeries(
      symbol, 
      (outputSize === 'full' ? 'full' : 'compact') as 'compact' | 'full'
    );
    
    if (!timeSeriesData) {
      return res.status(404).json({ message: 'Historical data not found' });
    }
    
    // Transform the data into a more usable format
    const formattedData = Object.entries(timeSeriesData).map(([date, values]: [string, any]) => ({
      date,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume']),
    }));
    
    return res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error in history API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}