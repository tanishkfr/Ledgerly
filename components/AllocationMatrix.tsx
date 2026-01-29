import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlowCard } from './GlowCard';
import { Account } from '../types';
import { formatCurrency } from '../utils';

interface AllocationMatrixProps {
  accounts: Account[];
  monthlyBurn?: number;
}

const RealTimeBurn = ({ monthlyBurn }: { monthlyBurn: number }) => {
    // Calculate accumulated burn for current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const secondsInMonth = 30 * 24 * 60 * 60; // Approx
    const burnPerSecond = monthlyBurn / secondsInMonth;
    
    // Initial accumulation
    const initialAccumulated = ((now.getTime() - startOfMonth.getTime()) / 1000) * burnPerSecond;
    
    const [currentBurn, setCurrentBurn] = useState(initialAccumulated);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBurn(prev => prev + burnPerSecond);
        }, 1000);
        return () => clearInterval(interval);
    }, [burnPerSecond]);

    return (
        <div className="font-mono text-xs text-fluoro-yellow">
            <span className="text-[9px] text-neutral-600 mr-2">MTD_BURN:</span>
            {formatCurrency(currentBurn)}
        </div>
    );
};

export const AllocationMatrix: React.FC<AllocationMatrixProps> = ({ accounts, monthlyBurn = 3445 }) => {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const runwayMonths = monthlyBurn > 0 ? totalBalance / monthlyBurn : 0;
  
  const totalNodes = 64; // 8x8 grid

  // Map accounts to specific grid indices with concentration metrics
  const nodeData = accounts.reduce((acc, account, i) => {
     // Deterministic spacing based on ID or Index
     const step = Math.floor(totalNodes / (accounts.length + 1));
     const index = (i + 1) * step; 
     
     const percentage = totalBalance > 0 ? (account.balance / totalBalance) * 100 : 0;
     let riskLevel = 'LOW';
     let riskColor = 'text-green-500';

     if (percentage > 40) {
         riskLevel = 'CRITICAL';
         riskColor = 'text-red-500';
     } else if (percentage > 20) {
         riskLevel = 'MODERATE';
         riskColor = 'text-yellow-500';
     }

     acc[index] = { ...account, percentage, riskLevel, riskColor };
     return acc;
  }, {} as Record<number, Account & { percentage: number, riskLevel: string, riskColor: string }>);

  return (
    <div className="mb-6 relative group">
      <GlowCard className="rounded-2xl p-0 overflow-hidden relative h-[340px] flex flex-col bg-[#050505] border-neutral-800">
         
         {/* 1. Liquidity Wave Background */}
         <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] to-[#000]" />
             {/* Wave Container */}
             <div className="absolute bottom-0 left-0 right-0 h-full overflow-hidden flex items-end">
                <motion.div 
                   initial={{ height: "0%" }}
                   animate={{ height: "65%" }} // Represents volume
                   transition={{ duration: 2.5, ease: "circOut", delay: 0.2 }}
                   className="w-full relative"
                >
                   {/* Wave SVG 1 - Back */}
                   <motion.div 
                     animate={{ x: ["0%", "-50%"] }}
                     transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                     className="absolute -top-12 left-0 w-[200%] h-24 text-fluoro-yellow/5 fill-current"
                   >
                      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
                          <path d="M0,0 C300,100 900,0 1200,50 L1200,120 L0,120 Z" />
                      </svg>
                   </motion.div>
                   {/* Wave SVG 2 - Front */}
                   <motion.div 
                     animate={{ x: ["-50%", "0%"] }}
                     transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                     className="absolute -top-16 left-0 w-[200%] h-24 text-fluoro-yellow/10 fill-current"
                   >
                      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
                          <path d="M0,50 C400,0 800,100 1200,20 L1200,120 L0,120 Z" />
                      </svg>
                   </motion.div>
                   
                   {/* Liquid Body */}
                   <div className="w-full h-full bg-gradient-to-t from-fluoro-yellow/10 to-transparent backdrop-blur-[1px]" />
                </motion.div>
             </div>
         </div>

         {/* 2. Ghost Matrix Overlay */}
         <div className="absolute inset-0 z-10 grid grid-cols-8 grid-rows-8 pointer-events-none">
            {Array.from({ length: totalNodes }).map((_, i) => {
                const data = nodeData[i];
                // Opacity ties to balance percentage (higher = brighter)
                const opacity = data ? 0.3 + (data.percentage / 100) * 0.7 : 0;
                
                return (
                    <div key={i} className="border-[0.5px] border-white/[0.02] relative flex items-center justify-center group/node">
                        {data && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.5 + (Math.random() * 0.5), duration: 0.4 }}
                                className="relative pointer-events-auto cursor-help"
                            >
                                {/* Core Node */}
                                <div 
                                    className="w-1.5 h-1.5 bg-fluoro-yellow rounded-full shadow-[0_0_10px_#D2FF00] relative z-10 transition-transform duration-300 group-hover/node:scale-125 group-hover/node:bg-white" 
                                    style={{ opacity: opacity + 0.2 }}
                                />
                                
                                {/* Glow Halo - Size based on percentage */}
                                <div 
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-fluoro-yellow/30 rounded-full blur-md animate-pulse" 
                                    style={{ 
                                        width: `${16 + (data.percentage * 1.5)}px`,
                                        height: `${16 + (data.percentage * 1.5)}px`,
                                        opacity: opacity
                                    }}
                                />

                                {/* Risk Concentration Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover/node:opacity-100 transition-opacity duration-200 z-50 pointer-events-none min-w-[140px]">
                                    <div className="bg-black/90 border border-neutral-800 p-2.5 rounded-lg shadow-xl backdrop-blur-md">
                                        <div className="text-[8px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
                                            {data.bankName}
                                        </div>
                                        <div className="text-[10px] font-bold text-white mb-1.5 font-sans">
                                            {formatCurrency(data.balance)}
                                        </div>
                                        <div className="h-[1px] w-full bg-neutral-800 mb-1.5" />
                                        <div className="text-[7px] font-mono text-neutral-400 leading-tight">
                                            CONCENTRATION RISK<br/>
                                            <span className={`font-bold ${data.riskColor} mt-0.5 block`}>
                                                {data.riskLevel} ({data.percentage.toFixed(1)}%)
                                            </span>
                                        </div>
                                        
                                        {/* Tooltip Arrow */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 bg-black border-r border-b border-neutral-800 rotate-45" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                );
            })}
         </div>

         {/* 3. Foreground Content / HUD */}
         <div className="relative z-20 p-6 flex flex-col h-full justify-between pointer-events-none">
             
             {/* Header */}
             <div className="flex justify-between items-start">
                 <div>
                     <div className="flex items-center gap-2 mb-2">
                         <div className="w-1.5 h-1.5 bg-fluoro-yellow rounded-full animate-pulse" />
                         <span className="text-[9px] font-mono text-fluoro-yellow tracking-widest uppercase">LIQUIDITY_INTELLIGENCE</span>
                     </div>
                     <div className="text-6xl font-bold text-white tracking-tighter font-sans drop-shadow-2xl flex items-baseline gap-2">
                         {runwayMonths.toFixed(1)} <span className="text-sm font-normal text-neutral-500 font-mono tracking-widest uppercase">Months</span>
                     </div>
                     <p className="text-[10px] text-neutral-400 font-mono mt-1">
                        SUSTAINABLE RUNWAY PROJECTION
                     </p>
                 </div>
                 
                 <div className="text-right flex flex-col items-end">
                     <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1">BURN_VELOCITY</div>
                     <div className="text-xl font-mono font-bold text-white tracking-tight">{formatCurrency(monthlyBurn)}<span className="text-xs text-neutral-600 font-normal">/mo</span></div>
                     <div className="mt-1">
                         <RealTimeBurn monthlyBurn={monthlyBurn} />
                     </div>
                 </div>
             </div>

             {/* Footer / Runway Gauge */}
             <div className="space-y-4">
                 
                 <div className="flex justify-between items-end text-[9px] font-mono text-neutral-400">
                     <span>STABILIZATION_GAUGE</span>
                     <span className="text-fluoro-yellow">OPTIMAL_RANGE</span>
                 </div>
                 
                 {/* The Runway Bar (Integrated into base) */}
                 <div className="h-2 w-full bg-neutral-900/80 rounded-full overflow-hidden backdrop-blur border border-white/5 flex gap-0.5 p-0.5">
                    {Array.from({ length: 12 }).map((_, i) => {
                         const active = i < runwayMonths;
                         const isCritical = i < 2;
                         return (
                             <motion.div 
                                key={i}
                                initial={{ opacity: 0, height: '0%' }}
                                animate={{ opacity: active ? 1 : 0.1, height: '100%' }}
                                transition={{ delay: 0.5 + (i * 0.1), duration: 0.5 }}
                                className={`flex-1 rounded-full ${
                                    active 
                                    ? isCritical && runwayMonths < 3 ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-fluoro-yellow shadow-[0_0_10px_#D2FF00]'
                                    : 'bg-white'
                                }`}
                             />
                         )
                    })}
                 </div>

                 {/* Telemetry Footer */}
                 <div className="flex justify-between pt-3 border-t border-white/5">
                     <div className="flex gap-6">
                         <div className="flex flex-col">
                             <span className="text-[8px] text-neutral-600 uppercase tracking-wider">REQ_LATENCY</span>
                             <span className="text-[10px] text-neutral-300 font-mono font-bold">14ms</span>
                         </div>
                         <div className="flex flex-col">
                             <span className="text-[8px] text-neutral-600 uppercase tracking-wider">GRID_NODES</span>
                             <span className="text-[10px] text-neutral-300 font-mono font-bold">{accounts.length} ACTIVE</span>
                         </div>
                     </div>
                     <div className="text-[9px] text-neutral-500 font-mono self-end">
                         VAULT_ID: <span className="text-white">0x8...F2A</span>
                     </div>
                 </div>
             </div>
         </div>
         
         {/* Vignette */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)] pointer-events-none z-10" />
      </GlowCard>
    </div>
  );
};