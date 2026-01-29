import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Calendar, Tag, DollarSign, Layers, Sparkles } from 'lucide-react';
import { predictCategory } from '../services/geminiService';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState('Software');
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isPredicting, setIsPredicting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setMerchant('');
      setCategory('Software');
      setType('EXPENSE');
      setDate(new Date().toISOString().split('T')[0]);
      setIsPredicting(false);
    }
  }, [isOpen]);

  const handleMerchantBlur = async () => {
    if (merchant.length > 2) {
      setIsPredicting(true);
      const predicted = await predictCategory(merchant);
      if (predicted) {
        setCategory(predicted);
        // Auto-set type based on category if obvious
        if (predicted === 'Income') setType('INCOME');
      }
      setIsPredicting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawAmount = parseFloat(amount);
    if (isNaN(rawAmount)) return;

    // Apply negative sign for expenses, positive for income
    const finalAmount = type === 'EXPENSE' ? -Math.abs(rawAmount) : Math.abs(rawAmount);

    onSubmit({
      merchant,
      amount: finalAmount,
      category,
      date: new Date(date).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      status: 'PENDING'
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative w-full max-w-md bg-[#0A0A0A] border border-neutral-800 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden mx-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 bg-neutral-900/30">
              <h2 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
                 <Layers size={14} className="text-fluoro-yellow" />
                 NEW_ENTRY
              </h2>
              <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors p-1 hover:bg-neutral-800 rounded-full">
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Transaction Type Toggle */}
              <div className="flex bg-neutral-900/50 p-1 rounded-lg border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setType('EXPENSE')}
                  className={`flex-1 py-2 text-[10px] font-bold tracking-widest uppercase rounded transition-all ${type === 'EXPENSE' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType('INCOME')}
                  className={`flex-1 py-2 text-[10px] font-bold tracking-widest uppercase rounded transition-all ${type === 'INCOME' ? 'bg-neutral-800 text-fluoro-yellow shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  Income
                </button>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Amount (USD)</label>
                <div className="relative group">
                  <DollarSign size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-fluoro-yellow transition-colors" />
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    autoFocus
                    required
                    step="0.01"
                    min="0"
                    className="w-full bg-black border border-neutral-800 rounded-xl py-4 pl-10 pr-4 text-white placeholder:text-neutral-800 focus:outline-none focus:border-fluoro-yellow/50 transition-all font-mono text-2xl font-bold"
                  />
                </div>
              </div>

              {/* Merchant Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Merchant / Source</label>
                <input 
                  type="text" 
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  onBlur={handleMerchantBlur}
                  placeholder={type === 'EXPENSE' ? "e.g. AWS Services" : "e.g. Client Payment"}
                  required
                  className="w-full bg-neutral-900/30 border border-neutral-800 rounded-xl py-3 px-4 text-white placeholder:text-neutral-700 focus:outline-none focus:border-fluoro-yellow/50 transition-colors font-sans text-sm"
                />
              </div>

              {/* Category & Date Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider flex items-center justify-between">
                    Category
                    {isPredicting && (
                      <span className="flex items-center gap-1 text-[8px] text-fluoro-yellow animate-pulse">
                         <Sparkles size={8} /> AI_AUTO
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <Tag size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isPredicting ? 'text-fluoro-yellow' : 'text-neutral-600'}`} />
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      disabled={isPredicting}
                      className="w-full bg-neutral-900/30 border border-neutral-800 rounded-xl py-3 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-fluoro-yellow/50 appearance-none cursor-pointer disabled:opacity-50 transition-all"
                    >
                      <option>Software</option>
                      <option>Hosting</option>
                      <option>Income</option>
                      <option>Travel</option>
                      <option>Office</option>
                      <option>Marketing</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Date</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
                    <input 
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-neutral-900/30 border border-neutral-800 rounded-xl py-2.5 pl-9 pr-2 text-xs text-white focus:outline-none focus:border-fluoro-yellow/50"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full bg-fluoro-yellow text-black font-bold py-4 rounded-xl hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs mt-4 shadow-[0_0_15px_rgba(210,255,0,0.15)]"
              >
                <Check size={16} /> CONFIRM_ENTRY
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};