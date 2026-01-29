import React from 'react';

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category: string;
  status: 'PENDING' | 'CLEARED' | 'FAILED';
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface FinancialSummary {
  totalBalance: number;
  monthlySavings: number;
  monthlyGoal: number;
  cashFlowData: ChartDataPoint[];
  recentTransactions: Transaction[];
}

export interface GeminiInsightResponse {
  insight: string;
  mood: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
}

export interface WidgetConfig {
  id: string;
  colSpan: string;
  rowSpan?: string;
  visible: boolean;
  title: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  role: string;
  twoFactor: boolean;
  apiKey: string;
  initials: string;
}

export interface Account {
  id: string;
  bankName: string;
  balance: number;
  type: 'DEBIT' | 'CREDIT';
  number: string;
  expiry: string;
  cvv: string;
  theme: 'NEON' | 'DARK' | 'COBALT';
}