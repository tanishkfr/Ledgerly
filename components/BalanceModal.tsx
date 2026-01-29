import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, DollarSign, Wallet } from 'lucide-react';

interface BalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onUpdate: (newBalance: number) => void;
}

export const BalanceModal: React.FC<BalanceModalProps> = ({ isOpen, onClose, currentBalance, onUpdate }) => {
  const [balance, setBalance] = useState('');

  useEffect(() => {
    if (isOpen) {
      setBalance(currentBalance.toString());
    }
  }, [isOpen, currentBalance]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(balance);
    if (!isNaN(val)) {
      onUpdate(val);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 sm:px-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-[#0A0A0A] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden mx-4"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 bg-neutral-900/30">
              <h2 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
                 <Wallet size={14} className="text-fluoro-yellow" />
                 MANAGE_LIQUIDITY
              </h2>
              <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Total Balance (USD)</label>
                <div className="relative group">
                  <DollarSign size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-fluoro-yellow transition-colors" />
                  <input 
                    type="number" 
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    placeholder="0.00"
                    autoFocus
                    required
                    step="0.01"
                    min="0"
                    className="w-full bg-black border border-neutral-800 rounded-xl py-4 pl-10 pr-4 text-white placeholder:text-neutral-800 focus:outline-none focus:border-fluoro-yellow transition-all font-mono text-2xl font-bold"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-fluoro-yellow text-black font-bold py-3 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(210,255,0,0.2)]"
              >
                <Check size={16} /> UPDATE_BALANCE
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};