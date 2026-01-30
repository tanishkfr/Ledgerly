import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
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
  Layers,
  ArrowRightLeft,
  Settings2,
  RefreshCw,
  Network
} from 'lucide-react';

// --- Micro-Components ---

const GasOracle = () => {
  return (
    <div className="relative group flex items-center">
      <div className="bg-[#111] border border-neutral-800 rounded-l-full pl-4 pr-3 py-1.5 flex items-center gap-2 h-9">
         <Zap size={12} className="text-fluoro-yellow fill-fluoro-yellow" />
         <div className="flex flex-col">
            <span className="text-[8px] font-mono text-neutral-500 tracking-widest uppercase leading-none">GAS_GWEI</span>
            <span className="text-[10px] font-bold text-white font-mono leading-none">14</span>
         </div>
      </div>
      <div className="bg-[#111] border-y border-r border-neutral-800 rounded-r-full pr-4 pl-3 py-1.5 flex items-center gap-2 h-9 ml-[-1px]">
         <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
         <span className="text-[9px] font-mono text-neutral-400">NOMINAL</span>
      </div>
    </div>
  );
};

const BridgeMonitor = () => {
    return (
        <div className="w-[200px] h-9 bg-[#0A0A0A] border border-neutral-800 rounded-full flex items-center justify-between px-4 relative overflow-hidden group">
            {/* Background Flow */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                 <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-fluoro-yellow to-transparent" />
            </div>

            <div className="relative z-10 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_5px_#6366f1]" />
                <span className="text-[9px] font-mono text-neutral-400 font-bold">ETH</span>
            </div>

            {/* Animated Connector */}
            <div className="flex-1 mx-3 h-[20px] relative flex items-center justify-center">
                 <svg width="100%" height="100%" className="overflow-visible">
                    <defs>
                        <filter id="glow-bridge">
                            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    {/* Track */}
                    <path d="M0,10 L80,10" stroke="#222" strokeWidth="1" fill="none" />
                    {/* Flowing Data */}
                    <motion.path 
                        d="M0,10 L80,10" 
                        stroke="#D2FF00" 
                        strokeWidth="1.5" 
                        fill="none"
                        strokeDasharray="4 6"
                        filter="url(#glow-bridge)"
                        animate={{ strokeDashoffset: [0, -20] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                 </svg>
            </div>

            <div className="relative z-10 flex items-center gap-2">
                <span className="text-[9px] font-mono text-neutral-400 font-bold">SOL</span>
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_5px_#a855f7]" />
            </div>
        </div>
    );
};

const MicroSpark = ({ color, trend }: { color: string, trend: 'UP' | 'DOWN' }) => {
  const points = trend === 'UP' ? "0,25 15,20 25,22 35,5 45,8 60,0" : "0,5 15,10 25,8 35,25 45,20 60,30";
  
  return (
    <div className="w-[60px] h-[30px] flex items-center">
       <svg width="60" height="30" className="overflow-visible">
          <motion.polyline
             points={points}
             fill="none"
             stroke={color}
             strokeWidth="1.5"
             strokeLinecap="round"
             strokeLinejoin="round"
             initial={{ pathLength: 0, opacity: 0 }}
             animate={{ pathLength: 1, opacity: 1 }}
             transition={{ duration: 1.5, ease: "circOut" }}
          />
          <circle cx={trend === 'UP' ? "60" : "60"} cy={trend === 'UP' ? "0" : "30"} r="2" fill={color} className="animate-pulse" />
       </svg>
    </div>
  );
};

const TickerLog = ({ symbol }: { symbol: string }) => {
  const [logs, setLogs] = useState([
     { type: 'BUY', amt: (Math.random() * 1000).toFixed(2), time: '14:20:01' },
     { type: 'SELL', amt: (Math.random() * 50).toFixed(2), time: '14:19:55' },
     { type: 'BUY', amt: (Math.random() * 5000).toFixed(2), time: '14:19:42' },
  ]);

  useEffect(() => {
     const interval = setInterval(() => {
         const type = Math.random() > 0.4 ? 'BUY' : 'SELL';
         const amt = (Math.random() * (type === 'BUY' ? 2000 : 500)).toFixed(2);
         const time = new Date().toLocaleTimeString('en-US', { hour12: false });
         setLogs(prev => [{ type, amt, time }, ...prev.slice(0, 2)]);
     }, 3000 + Math.random() * 2000);
     return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4 border-t border-neutral-800/50 pt-3 space-y-1.5">
      <div className="flex justify-between items-center mb-2">
         <span className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest">Whale_Stream // {symbol}</span>
         <Activity size={8} className="text-neutral-600" />
      </div>
      {logs.map((log, i) => (
        <motion.div 
            key={`${log.time}-${i}`} 
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-between text-[9px] font-mono leading-tight"
        >
           <span className="text-neutral-600">{log.time}</span>
           <span className={log.type === 'BUY' ? 'text-[#D2FF00]' : 'text-neutral-600'}>
             {log.type === 'BUY' ? '+' : '-'}{log.amt} <span className="opacity-50">{symbol}</span>
           </span>
        </motion.div>
      ))}
    </div>
  );
};

const AssetCard = ({ symbol, name, price, change }: { symbol: string, name: string, price: number, change: number }) => (
  <GlowCard className="rounded-xl p-5 bg-[#0A0A0A] h-full flex flex-col justify-between group hover:border-neutral-700 transition-colors">
      <div>
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs font-bold text-white group-hover:border-fluoro-yellow/50 transition-colors">
                    {symbol[0]}
                </div>
                <div>
                    <div className="text-sm font-bold text-white font-sans">{symbol}</div>
                    <div className="text-[10px] font-mono text-neutral-500 uppercase">{name}</div>
                </div>
            </div>
            <MicroSpark color={change > 0 ? '#D2FF00' : '#EF4444'} trend={change > 0 ? 'UP' : 'DOWN'} />
        </div>

        <div className="flex justify-between items-end mb-4">
             <div className="text-lg font-mono font-bold text-white tracking-tight">{formatCurrency(price)}</div>
             <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${change > 0 ? 'bg-fluoro-yellow/10 text-fluoro-yellow' : 'bg-red-900/10 text-red-500'}`}>
                {change > 0 ? '+' : ''}{change}%
             </span>
        </div>
      </div>
      
      <TickerLog symbol={symbol} />
  </GlowCard>
);

// --- New Feature: System Diagnostic Graph (Dynamic Wave) ---
const SystemDiagnosticGraph = ({ isHovered }: { isHovered: boolean }) => {
  const [state, setState] = useState<'IDLE' | 'ACTIVE' | 'VOLATILE'>('IDLE');
  const [t, setT] = useState(0);
  const canvasRef = useRef<SVGSVGElement>(null);

  // Logic to switch states periodically for demo
  useEffect(() => {
    const timer = setInterval(() => {
       const next = Math.random();
       if (next < 0.33) setState('IDLE');
       else if (next < 0.66) setState('ACTIVE');
       else setState('VOLATILE');
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Params Ref for smooth interpolation
  const paramsRef = useRef({ amp: 10, freq: 2, speed: 0.05 });
  
  useEffect(() => {
    let animationFrame: number;
    const animate = () => {
       let targetAmp = 10;
       let targetFreq = 2;
       let targetSpeed = 0.02;

       if (state === 'ACTIVE') { targetAmp = 20; targetFreq = 4; targetSpeed = 0.05; }
       if (state === 'VOLATILE') { targetAmp = 40; targetFreq = 6; targetSpeed = 0.08; }
       
       if (isHovered) targetAmp *= 1.2;

       // Lerp current to target for smooth transition
       const lerp = (a: number, b: number, f: number) => a + (b - a) * f;
       paramsRef.current.amp = lerp(paramsRef.current.amp, targetAmp, 0.05);
       paramsRef.current.freq = lerp(paramsRef.current.freq, targetFreq, 0.05);
       paramsRef.current.speed = lerp(paramsRef.current.speed, targetSpeed, 0.05);

       setT(prev => prev + paramsRef.current.speed);
       animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [state, isHovered]);

  const generatePath = (width: number, height: number) => {
     const { amp, freq } = paramsRef.current;
     const points = [];
     const segments = 100;
     for (let i = 0; i <= segments; i++) {
         const x = (i / segments) * width;
         // Sine wave equation
         const normalizedX = i / segments;
         const y = height / 2 + Math.sin((normalizedX * Math.PI * 2 * freq) + t) * amp;
         points.push(`${x},${y}`);
     }
     return `M ${points[0]} L ${points.slice(1).join(' ')}`;
  };

  const pathD = generatePath(1000, 64);

  return (
     <div className="h-16 w-full relative overflow-hidden opacity-80">
         <div className="absolute inset-0 bg-gradient-to-t from-fluoro-yellow/10 to-transparent" />
         
         <div className="absolute top-0 right-0 p-1 bg-black/50 border border-neutral-800 rounded z-20 backdrop-blur-sm">
             <div className="flex items-center gap-1.5">
                 <div className={`w-1.5 h-1.5 rounded-full ${state === 'VOLATILE' ? 'bg-red-500 animate-ping' : state === 'ACTIVE' ? 'bg-fluoro-yellow animate-pulse' : 'bg-green-500'}`} />
                 <span className="text-[8px] font-mono text-white tracking-widest uppercase">
                    STATE: [{state === 'VOLATILE' ? 'HIGH_VELOCITY' : state === 'ACTIVE' ? 'ACTIVE_FLOW' : 'STABLE_DRIFT'}]
                 </span>
             </div>
         </div>

         <svg ref={canvasRef} width="100%" height="100%" viewBox="0 0 1000 64" preserveAspectRatio="none" className="overflow-visible relative z-10">
             <defs>
                 <filter id="glow-wave">
                     <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                     <feMerge>
                         <feMergeNode in="coloredBlur" />
                         <feMergeNode in="SourceGraphic" />
                     </feMerge>
                 </filter>
             </defs>
             <path 
                d={pathD}
                fill="none"
                stroke="#D2FF00"
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#glow-wave)"
             />
         </svg>
     </div>
  );
};

const ExecutionTerminal = () => {
    const [slippage, setSlippage] = useState(0.5);
    const [fromVal, setFromVal] = useState(1.0);

    return (
        <GlowCard className="h-auto min-h-fit rounded-2xl p-6 pb-8 bg-[#080808] flex flex-col border border-neutral-800">
            <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-4 shrink-0">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Settings2 size={14} className="text-fluoro-yellow" /> Atomic Execution
                </h3>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-neutral-500">ROUTER: OPTIMAL</span>
                </div>
            </div>

            <div className="flex gap-6 flex-1">
                {/* Inputs Area */}
                <div className="flex-1 flex flex-col gap-5">
                     {/* FROM */}
                     <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-3 hover:border-neutral-700 transition-colors">
                          <div className="flex justify-between mb-2">
                              <span className="text-[9px] font-mono text-neutral-500">FROM_ASSET</span>
                              <span className="text-[9px] font-mono text-neutral-400">BAL: 14.5 ETH</span>
                          </div>
                          <div className="flex justify-between items-center">
                              <input 
                                 type="number"
                                 value={fromVal}
                                 onChange={(e) => setFromVal(parseFloat(e.target.value))}
                                 className="bg-transparent text-xl font-mono font-bold text-white w-24 outline-none"
                              />
                              <button className="flex items-center gap-2 px-2 py-1 bg-black border border-neutral-800 rounded text-xs font-bold text-white hover:border-fluoro-yellow transition-colors">
                                  ETH <ArrowRightLeft size={10} className="text-neutral-500" />
                              </button>
                          </div>
                     </div>
                     
                     {/* Divider */}
                     <div className="flex justify-center -my-2 relative z-10">
                        <div className="bg-[#080808] p-1.5 rounded-full border border-neutral-800 text-fluoro-yellow">
                            <ArrowDownLeft size={14} />
                        </div>
                     </div>

                     {/* TO */}
                     <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-3 hover:border-neutral-700 transition-colors">
                          <div className="flex justify-between mb-2">
                              <span className="text-[9px] font-mono text-neutral-500">TO_ESTIMATE</span>
                              <span className="text-[9px] font-mono text-fluoro-yellow">BEST_PRICE</span>
                          </div>
                          <div className="flex justify-between items-center">
                              <span className="text-xl font-mono font-bold text-neutral-300">
                                  {(fromVal * 3420.50).toLocaleString(undefined, {maximumFractionDigits: 2})}
                              </span>
                              <button className="flex items-center gap-2 px-2 py-1 bg-black border border-neutral-800 rounded text-xs font-bold text-white hover:border-fluoro-yellow transition-colors">
                                  USDC <ArrowRightLeft size={10} className="text-neutral-500" />
                              </button>
                          </div>
                     </div>

                     {/* Metrics */}
                     <div className="mt-auto space-y-2 py-4 border-t border-neutral-800/50">
                        <div className="flex justify-between text-[9px] font-mono text-neutral-500">
                            <span>EXPECTED_OUTPUT</span>
                            <span className="text-white">{(fromVal * 3420.50).toFixed(2)} USDC</span>
                        </div>
                        <div className="flex justify-between text-[9px] font-mono text-neutral-500">
                            <span>MINIMUM_GUARANTEED</span>
                            <span className="text-red-400">{(fromVal * 3420.50 * (1 - slippage/100)).toFixed(2)} USDC</span>
                        </div>
                        <div className="flex justify-between text-[9px] font-mono text-neutral-500">
                            <span>PRICE_IMPACT</span>
                            <span className="text-green-500">~0.05%</span>
                        </div>
                     </div>

                     <button className="w-full py-4 bg-transparent border border-fluoro-yellow text-fluoro-yellow font-bold text-[10px] uppercase tracking-[0.15em] rounded-xl hover:bg-fluoro-yellow hover:text-black transition-all shadow-[0_0_15px_rgba(210,255,0,0.1)] hover:shadow-[0_0_25px_rgba(210,255,0,0.4)] relative overflow-hidden group mt-2">
                          <span className="relative z-10">INITIATE_ATOMIC_SWAP</span>
                          <div className="absolute inset-0 bg-fluoro-yellow/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                     </button>
                </div>

                {/* Slippage Control (Right Side Flex Column) */}
                <div className="flex gap-3 h-full">
                     {/* Rotated Label */}
                     <div className="h-full flex flex-col justify-center">
                        <span 
                            className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest whitespace-nowrap"
                            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                        >
                            SLIPPAGE_TOLERANCE
                        </span>
                     </div>

                     {/* Slider Track Container */}
                     <div className="w-10 bg-neutral-900/30 border border-neutral-800 rounded-xl flex flex-col items-center py-4 relative min-h-[250px] self-stretch">
                        <div className="flex-1 w-1 bg-neutral-800 rounded-full my-6 relative cursor-pointer group">
                            {/* Interactive Track Area */}
                            <input 
                                type="range" 
                                min="0.1" 
                                max="5" 
                                step="0.1"
                                value={slippage}
                                onChange={(e) => setSlippage(parseFloat(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 appearance-none"
                                style={{ writingMode: 'vertical-lr', direction: 'rtl' }} 
                            />
                            {/* Fill */}
                            <motion.div 
                                className="absolute bottom-0 left-0 right-0 bg-fluoro-yellow rounded-full w-full pointer-events-none"
                                style={{ height: `${(slippage / 5) * 100}%` }}
                            />
                            {/* Knob */}
                            <motion.div 
                                className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-black border border-fluoro-yellow rounded-full shadow-[0_0_10px_rgba(210,255,0,0.5)] z-10 pointer-events-none"
                                style={{ bottom: `calc(${(slippage / 5) * 100}% - 8px)` }}
                            />
                        </div>
                        
                        <div className="text-[10px] font-mono font-bold text-white mb-2">{slippage}%</div>
                     </div>
                </div>
            </div>
        </GlowCard>
    );
};

// --- Main View ---

export const ExchangeView: React.FC = () => {
  const [isHoveredHotWallet, setIsHoveredHotWallet] = useState(false);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full pb-24">
       
       <PageHeader 
         title="EXCHANGE.P2P_VAULT" 
         subtitle="DECENTRALIZED_ASSET_LAYER"
         actionElement={
             <div className="flex items-center gap-4">
                 <BridgeMonitor />
                 <GasOracle />
             </div>
         }
       />

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 1. Hot & Cold Enclaves */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Hot Wallet */}
              <div 
                onMouseEnter={() => setIsHoveredHotWallet(true)}
                onMouseLeave={() => setIsHoveredHotWallet(false)}
              >
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

                      {/* System Diagnostic Graph (Replaces static loop) */}
                      <SystemDiagnosticGraph isHovered={isHoveredHotWallet} />
                  </GlowCard>
              </div>

              {/* Cold Vault */}
              <div className="relative group rounded-2xl p-6 bg-[#050505] border border-neutral-800 hover:border-white/20 transition-all overflow-hidden">
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

          {/* 2. Token Matrix with Whale Watch */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
             <AssetCard symbol="ETH" name="Ethereum" price={3420.50} change={2.4} />
             <AssetCard symbol="SOL" name="Solana" price={148.10} change={8.5} />
             <AssetCard symbol="BTC" name="Bitcoin" price={67100.00} change={-0.5} />
             <AssetCard symbol="ARB" name="Arbitrum" price={1.20} change={-2.1} />
          </div>

          {/* 3. Execution Terminal (Replaces Quick Swap) */}
          <div className="lg:col-span-5">
              <ExecutionTerminal />
          </div>

       </div>
    </div>
  );
};