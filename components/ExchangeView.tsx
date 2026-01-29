import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlowCard } from './GlowCard';
import { PageHeader } from './PageHeader';
import { formatCurrency } from '../utils';
import { 
  Zap, 
  Activity, 
  Lock, 
  Unlock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Cpu, 
  Layers 
} from 'lucide-react';

// --- Micro-Components ---

const GasOracle = () => {
  return (
    <div className="relative group">
      {/* Sonar Ripple */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
         <motion.div 
            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="w-full h-full rounded-full border border-[#D2FF00]/30"
         />
      </div>
      
      <div className="relative bg-[#111] border border-neutral-800 rounded-full px-4 py-2 flex items-center gap-3 z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
         <Zap size={14} className="text-fluoro-yellow fill-fluoro-yellow" />
         <div>
            <div className="text-[9px] font-mono text-neutral-500 tracking-widest uppercase leading-none mb-0.5">NET_CONGESTION</div>
            <div className="text-xs font-bold text-white font-mono leading-none">
               14 <span className="text-neutral-600">GWEI</span>
            </div>
         </div>
      </div>
    </div>
  );
};

const MicroSpark = ({ color, trend }: { color: string, trend: 'UP' | 'DOWN' }) => {
  // Simple SVG path simulation
  const points = "0,15 10,15 15,5 20,25 30,15 50,15";
  
  return (
    <div className="w-[50px] h-[30px] flex items-center">
       <svg width="50" height="30" className="overflow-visible">
          <motion.polyline
             points={points}
             fill="none"
             stroke={color}
             strokeWidth="1.5"
             strokeLinecap="round"
             strokeLinejoin="round"
             initial={{ strokeDasharray: 100, strokeDashoffset: 100 }}
             animate={{ strokeDashoffset: 0 }}
             transition={{ duration: 1.5, ease: "circOut" }}
          />
          {/* Flicker Effect */}
          <motion.circle 
             cx="50" cy="15" r="2" fill={color}
             animate={{ opacity: [1, 0.2, 1] }}
             transition={{ duration: 0.2, repeat: Infinity, repeatDelay: Math.random() * 5 }}
          />
       </svg>
    </div>
  );
};

const TokenRow = ({ symbol, name, price, change }: { symbol: string, name: string, price: number, change: number }) => (
  <div className="grid grid-cols-12 items-center py-4 border-b border-neutral-800/50 hover:bg-white/[0.02] transition-colors group">
      <div className="col-span-1">
         <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[10px] font-bold text-white group-hover:border-fluoro-yellow/50 transition-colors">
            {symbol[0]}
         </div>
      </div>
      <div className="col-span-3">
         <div className="text-sm font-bold text-white font-sans">{symbol}</div>
         <div className="text-[10px] font-mono text-neutral-500 uppercase">{name}</div>
      </div>
      <div className="col-span-3">
         <MicroSpark color={change > 0 ? '#D2FF00' : '#EF4444'} trend={change > 0 ? 'UP' : 'DOWN'} />
      </div>
      <div className="col-span-3 text-right">
         <div className="text-sm font-mono font-bold text-white">{formatCurrency(price)}</div>
      </div>
      <div className="col-span-2 text-right">
         <span className={`text-[10px] font-mono ${change > 0 ? 'text-fluoro-yellow' : 'text-red-500'}`}>
            {change > 0 ? '+' : ''}{change}%
         </span>
      </div>
  </div>
);

// --- Main View ---

export const ExchangeView: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full pb-24">
       
       <PageHeader 
         title="EXCHANGE.P2P_VAULT" 
         subtitle="DECENTRALIZED_ASSET_LAYER"
         actionElement={<GasOracle />}
       />

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 1. Hot & Cold Enclaves */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Hot Wallet */}
              <GlowCard className="rounded-2xl p-6 relative bg-[#080808]">
                  <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800">
                              <Unlock size={18} className="text-fluoro-yellow" />
                          </div>
                          <div>
                              <h3 className="text-sm font-bold text-white">Hot Storage</h3>
                              <div className="text-[9px] font-mono text-neutral-500 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> ONLINE
                              </div>
                          </div>
                      </div>
                      <div className="text-right">
                          <div className="text-2xl font-bold text-white font-mono tracking-tight">$14,240.50</div>
                          <div className="text-[9px] font-mono text-neutral-500">LIQUID_ASSETS</div>
                      </div>
                  </div>

                  {/* Activity Pulse Visualization (Smooth Looping Wave) */}
                  <div className="h-16 w-full relative overflow-hidden opacity-80">
                      <div className="absolute inset-0 bg-gradient-to-t from-fluoro-yellow/20 to-transparent" />
                      
                      {/* 
                         Seamless Loop Logic:
                         1. Create a repeating pattern in SVG.
                         2. Animate strokeDashoffset to simulate flow along the path.
                         3. Ensure strokeDasharray matches a repeatable segment.
                      */}
                      <svg width="100%" height="100%" viewBox="0 0 1000 64" preserveAspectRatio="none" className="overflow-visible">
                          <defs>
                              <filter id="glow-line">
                                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                  <feMerge>
                                      <feMergeNode in="coloredBlur" />
                                      <feMergeNode in="SourceGraphic" />
                                  </feMerge>
                              </filter>
                              <linearGradient id="wave-grad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#D2FF00" stopOpacity="0.2" />
                                  <stop offset="100%" stopColor="#D2FF00" stopOpacity="0" />
                              </linearGradient>
                          </defs>

                          {/* Base Path (Static Fill) */}
                          <path 
                             d="M0,32 Q125,0 250,32 T500,32 T750,32 T1000,32 V64 H0 Z" 
                             fill="url(#wave-grad)" 
                             stroke="none"
                          />

                          {/* Animated Flow Line */}
                          <motion.path 
                              d="M0,32 Q125,0 250,32 T500,32 T750,32 T1000,32"
                              fill="none"
                              stroke="#D2FF00"
                              strokeWidth="3"
                              strokeLinecap="round"
                              filter="url(#glow-line)"
                              // Path length is roughly 1000. We set array to 200, 200.
                              strokeDasharray="20 10" 
                              animate={{ strokeDashoffset: [0, -300] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          />
                      </svg>
                      
                      {/* Pulse Overlay */}
                      <motion.div 
                        className="absolute inset-0 bg-fluoro-yellow mix-blend-overlay"
                        animate={{ opacity: [0, 0.2, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      />
                  </div>
              </GlowCard>

              {/* Cold Vault */}
              <div className="relative group rounded-2xl p-6 bg-[#050505] border border-neutral-800 hover:border-white/20 transition-all overflow-hidden">
                  {/* Digital Noise Overlay specific to this card */}
                  <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
                  
                  <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800 group-hover:bg-neutral-800 transition-colors">
                              <Lock size={18} className="text-neutral-400 group-hover:text-white" />
                          </div>
                          <div>
                              <h3 className="text-sm font-bold text-neutral-400 group-hover:text-white transition-colors">Cold Vault</h3>
                              <div className="text-[9px] font-mono text-neutral-600 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" /> OFFLINE_AIRGAPPED
                              </div>
                          </div>
                      </div>
                      <div className="text-right">
                          <div className="text-2xl font-bold text-neutral-500 group-hover:text-white font-mono tracking-tight transition-colors">$245,000.00</div>
                          <div className="text-[9px] font-mono text-neutral-700 group-hover:text-neutral-500">SECURE_STORAGE</div>
                      </div>
                  </div>

                  <div className="h-16 w-full flex items-center justify-center border border-dashed border-neutral-800 rounded-lg group-hover:border-neutral-600 transition-colors">
                      <span className="text-[10px] font-mono text-neutral-600 group-hover:text-fluoro-yellow uppercase tracking-widest flex items-center gap-2">
                          <Cpu size={12} /> HARDWARE_KEY_REQUIRED
                      </span>
                  </div>
              </div>
          </div>

          {/* 2. Token Matrix */}
          <div className="lg:col-span-8">
             <GlowCard className="rounded-2xl p-0 bg-[#0A0A0A] h-full">
                 <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Layers size={14} className="text-fluoro-yellow" /> Token Matrix
                    </h3>
                    <div className="flex gap-2">
                        <span className="px-2 py-1 bg-neutral-900 rounded text-[9px] font-mono text-neutral-500">VOL_24H: $1.2B</span>
                    </div>
                 </div>
                 <div className="p-6 pt-2">
                    <TokenRow symbol="ETH" name="Ethereum" price={3420.50} change={2.4} />
                    <TokenRow symbol="SOL" name="Solana" price={148.10} change={8.5} />
                    <TokenRow symbol="BTC" name="Bitcoin" price={67100.00} change={-0.5} />
                    <TokenRow symbol="ARB" name="Arbitrum" price={1.20} change={-2.1} />
                    <TokenRow symbol="LINK" name="Chainlink" price={18.40} change={5.2} />
                 </div>
             </GlowCard>
          </div>

          {/* 3. Quick Swap / Actions */}
          <div className="lg:col-span-4 space-y-6">
              <GlowCard className="rounded-2xl p-6 bg-[#0A0A0A]">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Quick Swap</h3>
                  
                  <div className="space-y-4">
                      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-3">
                          <div className="flex justify-between mb-1">
                              <span className="text-[9px] font-mono text-neutral-500">FROM</span>
                              <span className="text-[9px] font-mono text-white">MAX: 14.5 ETH</span>
                          </div>
                          <div className="flex justify-between items-center">
                              <span className="text-xl font-mono font-bold text-white">1.00</span>
                              <span className="px-2 py-1 bg-neutral-800 rounded text-[10px] font-bold text-white">ETH</span>
                          </div>
                      </div>
                      
                      <div className="flex justify-center -my-2 relative z-10">
                          <div className="bg-black border border-neutral-700 p-1.5 rounded-full">
                              <ArrowDownLeft size={14} className="text-fluoro-yellow" />
                          </div>
                      </div>

                      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-3">
                          <div className="flex justify-between mb-1">
                              <span className="text-[9px] font-mono text-neutral-500">TO (ESTIMATE)</span>
                          </div>
                          <div className="flex justify-between items-center">
                              <span className="text-xl font-mono font-bold text-white">3,420.50</span>
                              <span className="px-2 py-1 bg-neutral-800 rounded text-[10px] font-bold text-white">USDC</span>
                          </div>
                      </div>

                      <button className="w-full py-4 bg-fluoro-yellow text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-colors shadow-[0_0_15px_rgba(210,255,0,0.2)]">
                          EXECUTE_SWAP
                      </button>
                  </div>
              </GlowCard>
          </div>

       </div>
    </div>
  );
};