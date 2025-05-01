import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/util/supabase/api';
import prisma from '@/lib/prisma';
import { getStockQuote } from '@/lib/alpha-vantage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Get user from session
  const supabase = createClient(req, res);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { symbol, type, quantity } = req.body;

  // Validate request body
  if (!symbol || !type || !quantity) {
    return res.status(400).json({ message: 'Symbol, type, and quantity are required' });
  }

  if (type !== 'BUY' && type !== 'SELL') {
    return res.status(400).json({ message: 'Type must be either BUY or SELL' });
  }

  if (quantity <= 0 || !Number.isInteger(quantity)) {
    return res.status(400).json({ message: 'Quantity must be a positive integer' });
  }

  try {
    // Get current stock price
    const stockQuote = await getStockQuote(symbol);
    
    if (!stockQuote) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const price = stockQuote.currentPrice;
    const total = price * quantity;

    // Get user data
    const userData = await prisma.user.findUnique({
      where: {
        id: user.id
      }
    });

    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has enough balance for buying
    if (type === 'BUY' && userData.balance < total) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // For selling, check if user owns enough shares
    if (type === 'SELL') {
      // Find the default portfolio (or create one if it doesn't exist)
      let defaultPortfolio = await prisma.portfolio.findFirst({
        where: {
          userId: user.id
        }
      });

      if (!defaultPortfolio) {
        return res.status(400).json({ message: 'No portfolio found' });
      }

      // Check if user owns the stock and has enough shares
      const portfolioItem = await prisma.portfolioItem.findFirst({
        where: {
          portfolioId: defaultPortfolio.id,
          stock: {
            symbol
          }
        }
      });

      if (!portfolioItem || portfolioItem.quantity < quantity) {
        return res.status(400).json({ message: 'Insufficient shares' });
      }
    }

    // Start a transaction
    return await prisma.$transaction(async (prisma) => {
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
            currentPrice: price,
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
            currentPrice: price,
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

      // Find or create default portfolio
      let defaultPortfolio = await prisma.portfolio.findFirst({
        where: {
          userId: user.id
        }
      });

      if (!defaultPortfolio) {
        defaultPortfolio = await prisma.portfolio.create({
          data: {
            name: 'Default Portfolio',
            userId: user.id
          }
        });
      }

      // Create transaction record
      const transaction = await prisma.transaction.create({
        data: {
          userId: user.id,
          stockId: stock.id,
          type,
          quantity,
          price,
          total
        }
      });

      // Update user balance
      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          balance: type === 'BUY' 
            ? { decrement: total } 
            : { increment: total }
        }
      });

      // Update portfolio
      if (type === 'BUY') {
        // Check if user already owns this stock
        const existingItem = await prisma.portfolioItem.findFirst({
          where: {
            portfolioId: defaultPortfolio.id,
            stockId: stock.id
          }
        });

        if (existingItem) {
          // Update existing position
          const newQuantity = existingItem.quantity + quantity;
          const newAvgBuyPrice = ((existingItem.avgBuyPrice * existingItem.quantity) + (price * quantity)) / newQuantity;
          
          await prisma.portfolioItem.update({
            where: {
              id: existingItem.id
            },
            data: {
              quantity: newQuantity,
              avgBuyPrice: newAvgBuyPrice
            }
          });
        } else {
          // Create new position
          await prisma.portfolioItem.create({
            data: {
              portfolioId: defaultPortfolio.id,
              stockId: stock.id,
              quantity,
              avgBuyPrice: price
            }
          });
        }
      } else {
        // Handle SELL
        const existingItem = await prisma.portfolioItem.findFirst({
          where: {
            portfolioId: defaultPortfolio.id,
            stockId: stock.id
          }
        });

        if (!existingItem) {
          return res.status(400).json({ message: 'Stock not found in portfolio' });
        }

        if (existingItem.quantity === quantity) {
          // Remove the item if selling all shares
          await prisma.portfolioItem.delete({
            where: {
              id: existingItem.id
            }
          });
        } else {
          // Update quantity
          await prisma.portfolioItem.update({
            where: {
              id: existingItem.id
            },
            data: {
              quantity: existingItem.quantity - quantity
            }
          });
        }
      }

      return res.status(201).json(transaction);
    });
  } catch (error) {
    console.error('Error processing transaction:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}