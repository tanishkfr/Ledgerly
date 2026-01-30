import React from 'react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import { X } from 'lucide-react';

interface HelpOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpOverlay: React.FC<HelpOverlayProps> = ({ isOpen, onClose }) => {
  // Mouse tracking for spotlight glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const modules = [
    { id: '01', title: 'VAULT', desc: 'Tracking liquidity velocity & burn-rate sustainability.' },
    { id: '02', title: 'ANALYTICS', desc: 'Predictive engine for drift forecasting & anomaly logs.' },
    { id: '03', title: 'EQUITIES', desc: 'Traditional asset telemetry & alpha-vector metrics.' },
    { id: '04', title: 'EXCHANGE', desc: 'P2P Web3 enclaves & real-time gas-ping tracking.' },
    { id: '05', title: 'GOVERNANCE', desc: 'Directive-based stake weight & gravity voting.' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Terminal Container */}
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.3, ease: 'linear' }}
            onMouseMove={handleMouseMove}
            className="relative w-full max-w-lg bg-black border border-neutral-800 shadow-2xl overflow-hidden group"
          >
            {/* Spotlight Effect Layer */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: useMotionTemplate`
                  radial-gradient(
                    300px circle at ${mouseX}px ${mouseY}px,
                    rgba(210, 255, 0, 0.08),
                    transparent 80%
                  )
                `
              }}
            />

            {/* Scanline Decoration */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-10 bg-[linear-gradient(to_bottom,transparent_50%,#000_50%)] bg-[length:100%_2px]" />

            {/* Header */}
            <div className="relative z-20 flex justify-between items-center px-6 py-4 border-b border-neutral-800 bg-neutral-900/30">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-fluoro-yellow rounded-sm animate-pulse" />
                 <h2 className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">PROTOCOL_GUIDE_v4.2</h2>
              </div>
              <button 
                onClick={onClose} 
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Content Body */}
            <div className="relative z-20 p-6 space-y-4">
               {modules.map((mod) => (
                   <div key={mod.id} className="flex gap-4 group/item hover:bg-white/[0.02] p-2 rounded transition-colors cursor-default">
                       <span className="text-[10px] font-mono text-neutral-600 group-hover/item:text-fluoro-yellow transition-colors">[{mod.id}]</span>
                       <div>
                           <div className="text-[10px] font-mono font-bold text-fluoro-yellow mb-1 tracking-wider">{mod.title}</div>
                           <div className="text-[10px] font-mono text-[#888] leading-relaxed">{mod.desc}</div>
                       </div>
                   </div>
               ))}
            </div>

            {/* Footer */}
            <div className="relative z-20 px-6 py-3 border-t border-neutral-800 bg-neutral-900/20 flex justify-between items-center text-[9px] font-mono text-neutral-600">
                <span>SYSTEM_MANUAL_LOADED</span>
                <span>END_OF_FILE</span>
            </div>

            {/* Top-to-bottom Scanning Line Animation */}
            <motion.div 
               className="absolute left-0 right-0 h-[1px] bg-fluoro-yellow/30 z-30 shadow-[0_0_10px_#D2FF00]"
               animate={{ top: ['0%', '100%'] }}
               transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};