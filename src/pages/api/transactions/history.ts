import { NextApiRequest, NextApiResponse } from 'next';
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

  try {
    // Get pagination parameters
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const skip = (page - 1) * limit;

    // Get transactions with stock details
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id
      },
      include: {
        stock: true
      },
      orderBy: {
        timestamp: 'desc'
      },
      skip,
      take: limit
    });

    // Get total count for pagination
    const totalCount = await prisma.transaction.count({
      where: {
        userId: user.id
      }
    });

    return res.status(200).json({
      transactions,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}