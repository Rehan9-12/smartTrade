import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/util/supabase/api';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get user from session
  const supabase = createClient(req, res);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Handle GET request - Get user's portfolios
  if (req.method === 'GET') {
    try {
      const portfolios = await prisma.portfolio.findMany({
        where: {
          userId: user.id
        },
        include: {
          items: {
            include: {
              stock: true
            }
          }
        }
      });

      return res.status(200).json(portfolios);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Handle POST request - Create a new portfolio
  if (req.method === 'POST') {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Portfolio name is required' });
    }

    try {
      const newPortfolio = await prisma.portfolio.create({
        data: {
          name,
          userId: user.id
        }
      });

      return res.status(201).json(newPortfolio);
    } catch (error) {
      console.error('Error creating portfolio:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}