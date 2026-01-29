import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ChevronRight, Terminal, X } from 'lucide-react';

interface AiTerminalProps {
  insight: string;
  loading: boolean;
}

export const AiTerminal: React.FC<AiTerminalProps> = ({ insight, loading }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 flex items-center">
      {/* Toggle Tab */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2 bg-[#0A0A0A]/90 backdrop-blur-md border-y border-r border-neutral-800 py-3 px-4 rounded-r-xl hover:border-fluoro-yellow/50 transition-colors"
          >
            <Cpu size={18} className="text-neutral-500 group-hover:text-fluoro-yellow animate-pulse-slow" />
            <span className="text-[10px] font-mono text-neutral-500 vertical-lr tracking-widest hidden md:block">CORE_AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Terminal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 20, opacity: 1 }}
            exit={{ x: -340, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-[300px] bg-[#050505]/95 backdrop-blur-xl border border-neutral-800 rounded-lg shadow-2xl overflow-hidden"
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-neutral-900/50 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Terminal size={12} className="text-fluoro-yellow" />
                <span className="text-[10px] font-mono text-neutral-400">LEDGERLY_CORE_V1.2</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Terminal Content */}
            <div className="p-4 font-mono text-xs leading-relaxed min-h-[150px]">
              <div className="mb-2 text-neutral-600 border-b border-neutral-800 pb-2">
                > INITIALIZING SCAN...
                <br />
                > ANALYZING LIQUIDITY VECTORS...
              </div>
              <div className="text-fluoro-yellow/90">
                {loading ? (
                   <span className="animate-pulse">PROCESSING DATA STREAMS...</span>
                ) : (
                  <>
                    <span className="text-white opacity-50 mr-2">root@ledgerly:</span>
                    {insight}
                  </>
                )}
              </div>
              <motion.div 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-fluoro-yellow align-middle ml-1"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};