import { Transaction } from "./types";

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const generateMockChartData = (points: number, volatility: number = 500, base: number = 20000) => {
  const data = [];
  let currentValue = base;
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * volatility;
    currentValue += change;
    data.push({
      name: i.toString(),
      value: Math.max(0, currentValue)
    });
  }
  return data;
};

export const getDateLabels = (range: '1D' | '1W' | '1M' | '1Y' | 'ALL') => {
  // simplified label generator
  if (range === '1D') return Array.from({length: 24}, (_, i) => `${i}:00`);
  if (range === '1W') return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  if (range === '1M') return Array.from({length: 30}, (_, i) => `Day ${i+1}`);
  if (range === '1Y') return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return Array.from({length: 12}, (_, i) => `202${i}`);
};

export const getTimestamp = (offsetMinutes = 0) => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - offsetMinutes);
  return now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

export const generateCSV = (transactions: Transaction[]) => {
  const headers = ['ID', 'Date', 'Merchant', 'Category', 'Amount', 'Status'];
  const rows = transactions.map(tx => [
    tx.id,
    tx.date,
    `"${tx.merchant}"`, // Escape quotes
    tx.category,
    tx.amount.toString(),
    tx.status
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `ledgerly_export_${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};