import { FinancialSummary, Transaction } from '../types';

export const createTransaction = (
  currentData: FinancialSummary, 
  txData: Partial<Transaction>
): FinancialSummary => {
  const newTx: Transaction = {
    id: `TX-${Date.now()}`,
    merchant: txData.merchant || 'Unknown Merchant',
    amount: txData.amount || 0,
    date: txData.date || new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    category: txData.category || 'General',
    status: 'PENDING'
  };

  // 1. Update Total Balance
  const newBalance = currentData.totalBalance + newTx.amount;

  // 2. Add to Recent Transactions (Prepending for UI list)
  const updatedTransactions = [newTx, ...currentData.recentTransactions];

  // 3. Update Chart Data (Cash Flow)
  // We modify the last data point to reflect the "current" impact, creating a live feel.
  const updatedCashFlow = [...currentData.cashFlowData];
  if (updatedCashFlow.length > 0) {
    const lastIndex = updatedCashFlow.length - 1;
    // Add (or subtract if negative) the amount to the last bar
    // We add absolute value to chart for visualization magnitude if it's volume, 
    // or signed if it's net flow. Let's assume net flow:
    updatedCashFlow[lastIndex] = {
      ...updatedCashFlow[lastIndex],
      value: Math.max(0, updatedCashFlow[lastIndex].value + newTx.amount)
    };
  }

  return {
    ...currentData,
    totalBalance: newBalance,
    recentTransactions: updatedTransactions,
    cashFlowData: updatedCashFlow
  };
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};