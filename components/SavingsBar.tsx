import React from 'react';
import { motion } from 'framer-motion';

interface SavingsBarProps {
  current: number;
  goal: number;
}

export const SavingsBar: React.FC<SavingsBarProps> = ({ current, goal }) => {
  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2 font-mono text-xs text-neutral-400">
        <span className="tracking-widest text-[10px]">BUDGET_ALLOCATION</span>
        <span className="text-fluoro-yellow">{percentage.toFixed(1)}%</span>
      </div>
      <div className="relative h-3 w-full bg-neutral-900 rounded-sm overflow-hidden border border-neutral-800/50">
        {/* Liquid Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            type: "spring", 
            stiffness: 40, 
            damping: 15,
            delay: 0.5
          }}
          className="absolute top-0 left-0 h-full overflow-hidden bg-[#b8e600] relative"
        >
          {/* Wave Pattern */}
          <div 
            className="absolute inset-0 w-[200%] h-full opacity-80"
            style={{
              background: 'repeating-linear-gradient(45deg, #D2FF00, #D2FF00 10px, #b8e600 10px, #b8e600 20px)'
            }}
          >
             <style>{`
               @keyframes waveSlide {
                 0% { transform: translateX(0); }
                 100% { transform: translateX(-50%); }
               }
               @keyframes scanLine {
                 0% { left: -50%; opacity: 0; }
                 50% { opacity: 1; }
                 100% { left: 150%; opacity: 0; }
               }
             `}</style>
             <div className="w-full h-full" style={{ animation: 'waveSlide 20s linear infinite' }} />
          </div>
          
          {/* Scanning Beam Animation */}
          <div 
             className="absolute top-0 bottom-0 w-[20%] bg-gradient-to-r from-transparent via-white/80 to-transparent blur-[3px]"
             style={{ animation: 'scanLine 3s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}
          />

          {/* Glow */}
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]" />
        </motion.div>
      </div>
    </div>
  );
};