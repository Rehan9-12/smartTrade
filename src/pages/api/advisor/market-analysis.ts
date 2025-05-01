import { NextApiRequest, NextApiResponse } from 'next';
import { getMarketAnalysis } from '@/lib/openai';
import { createClient } from '@/util/supabase/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Get user from session
  const supabase = createClient(req, res);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { riskLevel } = req.query;
  
  if (!riskLevel || typeof riskLevel !== 'string' || !['LOW', 'MODERATE', 'HIGH'].includes(riskLevel)) {
    return res.status(400).json({ message: 'Valid riskLevel parameter is required (LOW, MODERATE, or HIGH)' });
  }

  try {
    const analysis = await getMarketAnalysis(riskLevel as 'LOW' | 'MODERATE' | 'HIGH');
    
    return res.status(200).json({ analysis });
  } catch (error) {
    console.error('Error in market analysis API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}