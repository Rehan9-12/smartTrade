// OpenAI API utility functions
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface StockRecommendation {
  symbol: string;
  name: string;
  reason: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  confidence: number;
}

/**
 * Get AI-powered stock recommendations based on user's risk profile
 */
export async function getStockRecommendations(
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH',
  existingPortfolio: string[] = []
): Promise<StockRecommendation[]> {
  try {
    const currentDate = new Date().toISOString().split('T')[0];
    
    const prompt = `
      You are a financial advisor AI. Based on current market conditions as of ${currentDate}, recommend 3 stocks that would be suitable for a ${riskLevel.toLowerCase()} risk investor.
      
      ${existingPortfolio.length > 0 ? `The investor already owns these stocks: ${existingPortfolio.join(', ')}. Try to diversify from these.` : ''}
      
      For each recommendation, provide:
      1. Stock symbol
      2. Company name
      3. A brief reason for the recommendation (1-2 sentences)
      4. Risk level (LOW, MODERATE, or HIGH)
      5. Confidence score (0-100)
      
      Format your response as a JSON array with objects containing fields: symbol, name, reason, riskLevel, confidence.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a financial advisor AI that provides stock recommendations based on risk profiles. Always respond with valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    // Extract JSON from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from OpenAI response');
    }

    const recommendations = JSON.parse(jsonMatch[0]) as StockRecommendation[];
    return recommendations;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    
    // Return mock recommendations if API fails
    return [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        reason: 'Strong fundamentals with consistent growth and innovation in product lineup.',
        riskLevel: 'LOW',
        confidence: 90
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        reason: 'Diversified revenue streams with strong cloud business growth.',
        riskLevel: 'LOW',
        confidence: 92
      },
      {
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        reason: 'E-commerce leader with growing cloud services and expanding into new markets.',
        riskLevel: 'MODERATE',
        confidence: 85
      }
    ];
  }
}

/**
 * Get AI-generated market analysis
 */
export async function getMarketAnalysis(riskLevel: 'LOW' | 'MODERATE' | 'HIGH'): Promise<string> {
  try {
    const currentDate = new Date().toISOString().split('T')[0];
    
    const prompt = `
      You are a financial analyst AI. Based on current market conditions as of ${currentDate}, provide a brief market analysis for a ${riskLevel.toLowerCase()} risk investor.
      
      Include:
      1. Overall market sentiment
      2. Key sectors to watch
      3. Potential risks and opportunities
      4. Brief investment strategy recommendation
      
      Keep your response under 300 words and make it informative but accessible to non-experts.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a financial analyst AI that provides market analysis based on risk profiles." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    return content;
  } catch (error) {
    console.error('Error getting market analysis:', error);
    
    // Return mock analysis if API fails
    return `
      Market Sentiment: Cautiously optimistic with moderate volatility expected.
      
      Key sectors showing strength include technology, healthcare, and renewable energy. 
      Financial services and consumer discretionary sectors are showing mixed signals.
      
      Potential risks include inflation concerns, supply chain disruptions, and geopolitical tensions.
      Opportunities exist in AI-driven technologies, cloud computing, and healthcare innovation.
      
      For a ${riskLevel.toLowerCase()} risk investor, a balanced approach is recommended with 
      diversification across sectors. Consider allocating 60% to established companies with strong 
      fundamentals and 40% to growth opportunities with reasonable valuations.
    `;
  }
}