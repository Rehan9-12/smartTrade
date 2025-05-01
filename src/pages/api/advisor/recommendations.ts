import { NextApiRequest, NextApiResponse } from 'next';
import { getStockRecommendations } from '@/lib/openai';
import { createClient } from '@/util/supabase/api';
import prisma from '@/lib/prisma';

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
    // Get user's existing portfolio
    const portfolioItems = await prisma.portfolioItem.findMany({
      where: {
        portfolio: {
          userId: user.id
        }
      },
      include: {
        stock: true
      }
    });

    const existingStocks = portfolioItems.map(item => item.stock.symbol);
    
    const recommendations = await getStockRecommendations(
      riskLevel as 'LOW' | 'MODERATE' | 'HIGH',
      existingStocks
    );
    
    return res.status(200).json(recommendations);
  } catch (error) {
    console.error('Error in recommendations API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}