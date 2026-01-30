import { FinancialSummary } from '../types';

/**
 * MOCK AI SERVICE - VERCEL DEPLOYMENT MODE
 * 
 * Replaces live Google GenAI calls with high-fidelity deterministic mocks.
 * This ensures the application functions as a static demo without requiring 
 * active API keys or backend infrastructure.
 */

export const generateFinancialInsight = async (data: FinancialSummary): Promise<string> => {
  // Simulate "Thinking" Latency for realism
  await new Promise(resolve => setTimeout(resolve, 2000));

  const insights = [
    "Liquidity architecture is optimal. Savings velocity is currently 36% below your 'Growth' threshold. Recommend re-allocating $1,200 from discretionary to the Vercel-backed tax-reserve vault.",
    "Variance detected in monthly burn rate. Infrastructure costs have exceeded baseline by 12%. Suggest optimization of AWS instances to reserved tier.",
    "Capital allocation efficiency is at 94%. Surplus liquidity detected in operational accounts. Consider deploying to high-yield static instruments.",
    "System nominal. Revenue streams align with Q3 projections. Alpha vector indicates positive momentum vs S&P 500 baseline.",
    "Spending anomaly detected in 'Travel' sector. Rate of expenditure is 1.5x higher than trailing 30-day average. Awaiting manual override.",
    "Reserve buffers are healthy. Estimated runway extended by 14 days due to recent reduction in 'Software' subscriptions."
  ];

  // Return a random insight to simulate dynamic analysis
  return insights[Math.floor(Math.random() * insights.length)];
};

export const predictCategory = async (merchant: string): Promise<string> => {
  // Simulate "Processing" Latency
  await new Promise(resolve => setTimeout(resolve, 800));

  const lowerMerchant = merchant.toLowerCase();
  
  if (lowerMerchant.includes('uber') || lowerMerchant.includes('lyft') || lowerMerchant.includes('flight') || lowerMerchant.includes('hotel') || lowerMerchant.includes('airbnb')) return 'Travel';
  if (lowerMerchant.includes('aws') || lowerMerchant.includes('vercel') || lowerMerchant.includes('digitalocean') || lowerMerchant.includes('heroku') || lowerMerchant.includes('hosting')) return 'Hosting';
  if (lowerMerchant.includes('figma') || lowerMerchant.includes('adobe') || lowerMerchant.includes('linear') || lowerMerchant.includes('slack') || lowerMerchant.includes('jetbrains') || lowerMerchant.includes('cursor')) return 'Software';
  if (lowerMerchant.includes('client') || lowerMerchant.includes('invoice') || lowerMerchant.includes('payment') || lowerMerchant.includes('stripe') || lowerMerchant.includes('paypal')) return 'Income';
  if (lowerMerchant.includes('wework') || lowerMerchant.includes('staples') || lowerMerchant.includes('office') || lowerMerchant.includes('fedex')) return 'Office';
  if (lowerMerchant.includes('ads') || lowerMerchant.includes('meta') || lowerMerchant.includes('linkedin') || lowerMerchant.includes('google')) return 'Marketing';
  if (lowerMerchant.includes('food') || lowerMerchant.includes('restaurant') || lowerMerchant.includes('coffee') || lowerMerchant.includes('starbucks')) return 'Dining';

  return 'Office'; // Default fallback
};