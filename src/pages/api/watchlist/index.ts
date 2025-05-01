import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/util/supabase/api';
import prisma from '@/lib/prisma';
import { getStockQuote } from '@/lib/alpha-vantage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get user from session
  const supabase = createClient(req, res);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Handle GET request - Get user's watchlist
  if (req.method === 'GET') {
    try {
      // Find or create default watchlist
      let defaultWatchlist = await prisma.watchlist.findFirst({
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

      if (!defaultWatchlist) {
        defaultWatchlist = await prisma.watchlist.create({
          data: {
            name: 'Default Watchlist',
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
      }

      return res.status(200).json(defaultWatchlist);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Handle POST request - Add stock to watchlist
  if (req.method === 'POST') {
    const { symbol } = req.body;

    if (!symbol) {
      return res.status(400).json({ message: 'Stock symbol is required' });
    }

    try {
      // Get stock data
      const stockQuote = await getStockQuote(symbol);
      
      if (!stockQuote) {
        return res.status(404).json({ message: 'Stock not found' });
      }

      // Find or create default watchlist
      let defaultWatchlist = await prisma.watchlist.findFirst({
        where: {
          userId: user.id
        }
      });

      if (!defaultWatchlist) {
        defaultWatchlist = await prisma.watchlist.create({
          data: {
            name: 'Default Watchlist',
            userId: user.id
          }
        });
      }

      // Find or create the stock
      let stock = await prisma.stock.findUnique({
        where: {
          symbol
        }
      });

      if (!stock) {
        stock = await prisma.stock.create({
          data: {
            symbol,
            name: stockQuote.name || symbol,
            currentPrice: stockQuote.currentPrice,
            previousClose: stockQuote.previousClose,
            change: stockQuote.change,
            changePercent: stockQuote.changePercent,
            volume: stockQuote.volume,
            marketCap: stockQuote.marketCap,
            sector: stockQuote.sector
          }
        });
      } else {
        // Update stock data
        stock = await prisma.stock.update({
          where: {
            id: stock.id
          },
          data: {
            currentPrice: stockQuote.currentPrice,
            previousClose: stockQuote.previousClose,
            change: stockQuote.change,
            changePercent: stockQuote.changePercent,
            volume: stockQuote.volume,
            marketCap: stockQuote.marketCap,
            sector: stockQuote.sector,
            updatedAt: new Date()
          }
        });
      }

      // Check if stock is already in watchlist
      const existingItem = await prisma.watchlistItem.findFirst({
        where: {
          watchlistId: defaultWatchlist.id,
          stockId: stock.id
        }
      });

      if (existingItem) {
        return res.status(400).json({ message: 'Stock already in watchlist' });
      }

      // Add stock to watchlist
      const watchlistItem = await prisma.watchlistItem.create({
        data: {
          watchlistId: defaultWatchlist.id,
          stockId: stock.id
        },
        include: {
          stock: true
        }
      });

      return res.status(201).json(watchlistItem);
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Handle DELETE request - Remove stock from watchlist
  if (req.method === 'DELETE') {
    const { symbol } = req.query;

    if (!symbol || typeof symbol !== 'string') {
      return res.status(400).json({ message: 'Stock symbol is required' });
    }

    try {
      // Find default watchlist
      const defaultWatchlist = await prisma.watchlist.findFirst({
        where: {
          userId: user.id
        }
      });

      if (!defaultWatchlist) {
        return res.status(404).json({ message: 'Watchlist not found' });
      }

      // Find the stock
      const stock = await prisma.stock.findUnique({
        where: {
          symbol
        }
      });

      if (!stock) {
        return res.status(404).json({ message: 'Stock not found' });
      }

      // Find and delete the watchlist item
      const watchlistItem = await prisma.watchlistItem.findFirst({
        where: {
          watchlistId: defaultWatchlist.id,
          stockId: stock.id
        }
      });

      if (!watchlistItem) {
        return res.status(404).json({ message: 'Stock not in watchlist' });
      }

      await prisma.watchlistItem.delete({
        where: {
          id: watchlistItem.id
        }
      });

      return res.status(200).json({ message: 'Stock removed from watchlist' });
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}