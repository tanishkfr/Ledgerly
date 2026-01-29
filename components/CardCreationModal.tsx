import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, CreditCard, DollarSign, Wallet } from 'lucide-react';

interface CardCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (card: any) => void;
}

export const CardCreationModal: React.FC<CardCreationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [bankName, setBankName] = useState('');
  const [balance, setBalance] = useState('');
  const [type, setType] = useState<'DEBIT' | 'CREDIT'>('DEBIT');
  const [theme, setTheme] = useState<'NEON' | 'DARK' | 'COBALT'>('DARK');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: `CARD-${Date.now()}`,
      bankName,
      balance: parseFloat(balance) || 0,
      type,
      theme,
      number: `•••• ${Math.floor(1000 + Math.random() * 9000)}`,
      expiry: '12/29'
    });
    // Reset
    setBankName('');
    setBalance('');
    setType('DEBIT');
    setTheme('DARK');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 sm:px-0">
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
            className="relative w-full max-w-md bg-[#0A0A0A] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden mx-4"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 bg-neutral-900/30">
              <h2 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
                 <Wallet size={14} className="text-fluoro-yellow" />
                 ADD_NEW_CARD
              </h2>
              <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Card Type */}
              <div className="flex bg-neutral-900/50 p-1 rounded-lg border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setType('DEBIT')}
                  className={`flex-1 py-2 text-[10px] font-bold tracking-widest uppercase rounded transition-all ${type === 'DEBIT' ? 'bg-neutral-800 text-fluoro-yellow shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  Debit
                </button>
                <button
                  type="button"
                  onClick={() => setType('CREDIT')}
                  className={`flex-1 py-2 text-[10px] font-bold tracking-widest uppercase rounded transition-all ${type === 'CREDIT' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  Credit
                </button>
              </div>

              {/* Bank Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Institution Name</label>
                <div className="relative group">
                  <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-fluoro-yellow transition-colors" />
                  <input 
                    type="text" 
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. Chase Sapphire"
                    required
                    className="w-full bg-neutral-900/30 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-fluoro-yellow transition-colors font-sans"
                  />
                </div>
              </div>

              {/* Initial Balance */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Starting Balance</label>
                <div className="relative group">
                  <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-fluoro-yellow transition-colors" />
                  <input 
                    type="number" 
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    placeholder="0.00"
                    required
                    step="0.01"
                    className="w-full bg-neutral-900/30 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-fluoro-yellow transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Theme Selector */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Card Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setTheme('NEON')}
                    className={`h-12 rounded-lg border-2 transition-all ${theme === 'NEON' ? 'border-fluoro-yellow bg-fluoro-yellow/10' : 'border-transparent bg-neutral-900'}`}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-black rounded opacity-80 flex items-center justify-center">
                       <div className="w-3 h-3 rounded-full bg-fluoro-yellow shadow-[0_0_5px_#D2FF00]" />
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('DARK')}
                    className={`h-12 rounded-lg border-2 transition-all ${theme === 'DARK' ? 'border-white bg-white/10' : 'border-transparent bg-neutral-900'}`}
                  >
                     <div className="w-full h-full bg-[#111] rounded flex items-center justify-center">
                       <div className="w-3 h-3 rounded-full bg-neutral-600" />
                     </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('COBALT')}
                    className={`h-12 rounded-lg border-2 transition-all ${theme === 'COBALT' ? 'border-blue-500 bg-blue-500/10' : 'border-transparent bg-neutral-900'}`}
                  >
                     <div className="w-full h-full bg-blue-900 rounded flex items-center justify-center">
                       <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_5px_blue]" />
                     </div>
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-fluoro-yellow text-black font-bold py-3.5 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] mt-4 shadow-[0_0_20px_rgba(210,255,0,0.2)]"
              >
                <Check size={14} /> INITIALIZE_CARD
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};