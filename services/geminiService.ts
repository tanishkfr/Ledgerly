import { GoogleGenAI } from "@google/genai";
import { FinancialSummary } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateFinancialInsight = async (data: FinancialSummary): Promise<string> => {
  try {
    const prompt = `
      You are LEDGERLY_CORE_AI, a high-precision financial system.
      Analyze this data snapshot:
      - Total Balance: $${data.totalBalance}
      - Monthly Savings/Budget: $${data.monthlySavings} / $${data.monthlyGoal}
      
      Output a single, highly technical status update.
      Use terms like "Liquidity architecture", "Velocity", "Threshold", "Variance", "Allocation".
      Tone: Robotic, precise, expensive, aerospace-like.
      
      Example: "Liquidity architecture is optimal. Savings velocity is currently 36% below your 'Growth' threshold."
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Liquidity architecture is optimal. Savings velocity is currently 36% below your 'Growth' threshold. Recommend re-allocating $1,200 from discretionary to the Vercel-backed tax-reserve vault.";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Liquidity architecture is optimal. Savings velocity is currently 36% below your 'Growth' threshold. Recommend re-allocating $1,200 from discretionary to the Vercel-backed tax-reserve vault.";
  }
};

export const predictCategory = async (merchant: string): Promise<string> => {
  try {
    const prompt = `
      Classify the transaction merchant "${merchant}" into one of these exact categories:
      - Software
      - Hosting
      - Income
      - Travel
      - Office
      - Marketing
      
      Return ONLY the category name. If uncertain or no match, return "Office".
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text?.trim() || 'Office';
    // Validate against known categories
    const valid = ['Software', 'Hosting', 'Income', 'Travel', 'Office', 'Marketing'];
    const match = valid.find(c => c.toLowerCase() === text.toLowerCase());
    return match || 'Office';
  } catch (error) {
    console.warn("Category prediction failed", error);
    return 'Office';
  }
};