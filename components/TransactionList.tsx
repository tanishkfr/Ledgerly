import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Transaction } from '../types';
import { ArrowUpRight, ArrowDownLeft, Search, Filter, ArrowUpDown } from 'lucide-react';
import { formatCurrency } from '../utils';

interface TransactionListProps {
  transactions: Transaction[];
}

type FilterType = 'ALL' | 'INCOME' | 'EXPENSE';
type SortType = 'DATE' | 'AMOUNT';

export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const [filterType, setFilterType] = useState<FilterType>('ALL');
  const [sortType, setSortType] = useState<SortType>('DATE');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Type Filter
        if (filterType === 'INCOME' && tx.amount < 0) return false;
        if (filterType === 'EXPENSE' && tx.amount > 0) return false;
        
        // Search Filter
        const query = searchQuery.toLowerCase();
        return (
          tx.merchant.toLowerCase().includes(query) ||
          tx.category.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (sortType === 'AMOUNT') {
          return Math.abs(b.amount) - Math.abs(a.amount);
        }
        return 0; 
      });
  }, [transactions, filterType, sortType, searchQuery]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-mono text-neutral-500 tracking-wider">TRANSACTION_ACTIVITY</h3>
          <span className="text-[10px] font-mono text-neutral-600">{filteredTransactions.length} EVENTS</span>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col gap-2">
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-fluoro-yellow transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Filter merchant or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg py-1.5 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-fluoro-yellow transition-colors font-mono"
            />
          </div>

          <div className="flex justify-between items-center">
            {/* Tabs */}
            <div className="flex bg-neutral-900/50 p-1 rounded-lg border border-neutral-800">
              {(['ALL', 'INCOME', 'EXPENSE'] as FilterType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all duration-200 ${
                    filterType === type 
                      ? 'bg-neutral-800 text-fluoro-yellow shadow-sm' 
                      : 'text-neutral-500 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Sort Toggle */}
            <button 
              onClick={() => setSortType(prev => prev === 'DATE' ? 'AMOUNT' : 'DATE')}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-neutral-800 hover:border-fluoro-yellow/50 text-[10px] font-mono text-neutral-400 hover:text-fluoro-yellow transition-all"
            >
              <ArrowUpDown size={10} />
              {sortType}
            </button>
          </div>
        </div>
      </div>
      
      {/* List */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode='popLayout'>
          {filteredTransactions.map((tx) => (
            <motion.div 
              key={tx.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`group flex items-center justify-between p-3 mb-2 rounded-lg border border-transparent hover:border-neutral-800 hover:bg-neutral-900/50 transition-all duration-200 ${tx.status === 'PENDING' ? 'opacity-70 bg-neutral-900/20' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${tx.amount > 0 ? 'bg-fluoro-yellow/10 text-fluoro-yellow' : 'bg-white/10 text-white'}`}>
                  {tx.amount > 0 ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-fluoro-yellow transition-colors font-sans">{tx.merchant}</p>
                  <p className="text-[10px] font-mono text-neutral-500">{tx.date} • {tx.category.toUpperCase()}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-mono font-medium ${tx.amount > 0 ? 'text-fluoro-yellow' : 'text-white'}`}>
                  {tx.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                </span>
                <div className={`text-[9px] mt-0.5 font-mono ${tx.status === 'PENDING' ? 'text-fluoro-yellow/70 italic' : 'text-neutral-600'}`}>
                  {tx.status}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-neutral-600 font-mono text-xs">
            NO_DATA_FOUND
          </div>
        )}
      </div>
    </div>
  );
};