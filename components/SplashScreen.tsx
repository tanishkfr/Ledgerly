import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const SYSTEM_LOGS = [
  "BIOS_CHECK... [OK]",
  "VERIFYING_HARDWARE_ID... [OK]",
  "LOADING_KERNEL_MODULES... [OK]",
  "DECRYPTING_VAULT_STRUCTURE... [OK]",
  "ESTABLISHING_ENCLAVE_HANDSHAKE... [OK]",
  "ALLOCATING_MEMORY_BLOCKS... [OK]",
  "CHECKING_INTEGRITY_SUM... [OK]",
  "LOADING_GRAPHICS_DRIVER... [OK]",
  "INIT_SECURE_CHANNEL... [OK]",
  "AUTHENTICATING_USER_TOKEN... [OK]",
  "MOUNTING_VIRTUAL_DOM... [OK]",
  "SYNCING_LEDGER_NODES... [OK]",
  "PREFETCHING_ASSETS... [OK]",
  "SYSTEM_READY."
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [logLimit, setLogLimit] = useState(0);

  useEffect(() => {
    // 2500ms Total Sequence

    // Phase 2: Data Integration (600ms - 1800ms)
    const integrationTimer = setTimeout(() => {
        const interval = setInterval(() => {
            setPercent(prev => {
                // Stuttering random increments for "computing" feel
                const next = prev + Math.floor(Math.random() * 8) + 1;
                if (next >= 100) return 100;
                return next;
            });
            setLogLimit(prev => prev + 1);
        }, 50); // ~50ms ticks for 1200ms duration

        // Ensure 100% at end of phase
        setTimeout(() => {
            clearInterval(interval);
            setPercent(100);
            setLogLimit(SYSTEM_LOGS.length);
        }, 1150);

        return () => clearInterval(interval);
    }, 600);

    // Phase 3: Mechanical Reveal (1800ms)
    const exitTimer = setTimeout(() => {
        setIsExiting(true);
    }, 1800);

    return () => {
        clearTimeout(integrationTimer);
        clearTimeout(exitTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[10000] flex flex-col font-mono text-xs overflow-hidden text-white pointer-events-none">
        
        {/* Top Iris Shutter */}
        <motion.div 
            initial={{ y: "0%" }}
            animate={isExiting ? { y: "-100%" } : { y: "0%" }}
            transition={{ 
                duration: 0.7, 
                ease: [0.45, 0, 0.55, 1] // Heavy industrial cubic-bezier
            }}
            className="absolute top-0 left-0 right-0 h-1/2 bg-[#000000] border-b border-neutral-800 z-50 flex flex-col items-center justify-end pb-16 pointer-events-auto"
        >
             {/* Digital Grain Overlay */}
             <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')] bg-repeat" />
             
             {/* CRT Scanline */}
             <div className="absolute inset-0 z-30 opacity-[0.05] pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px]" />
             <motion.div 
                className="absolute top-0 left-0 right-0 h-[2px] bg-white/30 z-30 blur-[1px]"
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
             />

             {/* Center Brand Block */}
             <div className="flex flex-col items-center relative z-40">
                {/* Phase 1: Ignition (0-600ms) - Warm-up Flicker */}
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: [0, 0.3, 0.15, 1] }}
                   transition={{ duration: 0.6, times: [0, 0.4, 0.7, 1] }}
                   className="relative text-6xl font-bold tracking-[0.2em] text-white font-sans mix-blend-difference mb-6"
                >
                   <span className="relative z-10">LEDGERLY</span>
                   {/* Chromatic Aberration (RGB Shift) */}
                   <span className="absolute top-0 left-0 -ml-[2px] text-red-500 opacity-70 mix-blend-screen animate-pulse">LEDGERLY</span>
                   <span className="absolute top-0 left-0 ml-[2px] text-blue-500 opacity-70 mix-blend-screen animate-pulse">LEDGERLY</span>
                </motion.div>
                
                {/* Percentage Counter & HUD */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col items-center gap-2"
                >
                    <div className="text-4xl font-mono font-bold text-fluoro-yellow tracking-tighter">
                        {percent.toString().padStart(3, '0')}%
                    </div>
                    <div className="h-[1px] w-24 bg-neutral-800" />
                    <div className="flex items-center gap-3 text-[9px] text-neutral-500 tracking-widest font-mono uppercase">
                        <span>ACCESS_TOKEN: [ACTIVE]</span>
                        <span className="text-neutral-700">//</span>
                        <span>PROTOCOL: VAULT_v4.2</span>
                    </div>
                </motion.div>
             </div>
        </motion.div>

        {/* Bottom Iris Shutter */}
        <motion.div 
            initial={{ y: "0%" }}
            animate={isExiting ? { y: "100%" } : { y: "0%" }}
            transition={{ 
                duration: 0.7, 
                ease: [0.45, 0, 0.55, 1]
            }}
            onAnimationComplete={() => {
                if (isExiting) onComplete();
            }}
            className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#000000] border-t border-neutral-800 z-50 flex items-end justify-start p-8 pointer-events-auto"
        >
             {/* Overlays Mirror */}
             <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')] bg-repeat" />
             <div className="absolute inset-0 z-30 opacity-[0.05] pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px]" />
             <motion.div 
                className="absolute top-0 left-0 right-0 h-[2px] bg-white/30 z-30 blur-[1px]"
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
             />

             {/* System Log Stream */}
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="relative z-40 w-80 max-h-48 overflow-hidden"
            >
                <div className="flex flex-col justify-end space-y-1">
                    {SYSTEM_LOGS.slice(0, logLimit).map((log, i) => (
                        <div key={i} className="text-[10px] font-mono leading-tight text-neutral-600 last:text-fluoro-yellow last:animate-pulse">
                           <span className="opacity-50 mr-2">
                             {(i * 120 + 2400).toString(16).toUpperCase()}:
                           </span>
                           {log}
                        </div>
                    ))}
                </div>
             </motion.div>
        </motion.div>
    </div>
  );
};