import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Tooltip, 
  ReferenceDot,
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar 
} from 'recharts';
import { 
  Activity, 
  Terminal as TerminalIcon, 
  AlertTriangle,
  Zap,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { GlowCard } from './GlowCard';
import { PageHeader } from './PageHeader';
import { formatCurrency } from '../utils';

// --- Types ---
interface Asset {
  symbol: string;
  name: string;
  price: number;
  delta: number;
  volatility: 'LOW' | 'MED' | 'HIGH';
  holdings: number;
}

// --- Mock Data ---
const HEATMAP_DATA: Asset[] = [
  { symbol: 'NVDA', name: 'Nvidia Corp', price: 842.50, delta: 5.4, volatility: 'HIGH', holdings: 12 },
  { symbol: 'BTC', name: 'Bitcoin', price: 64200.00, delta: -1.2, volatility: 'MED', holdings: 0.5 },
  { symbol: 'AAPL', name: 'Apple Inc', price: 172.40, delta: 0.4, volatility: 'LOW', holdings: 45 },
  { symbol: 'ETH', name: 'Ethereum', price: 3450.20, delta: -0.8, volatility: 'MED', holdings: 4.2 },
  { symbol: 'TSLA', name: 'Tesla Inc', price: 175.20, delta: 6.5, volatility: 'HIGH', holdings: 20 },
  { symbol: 'SOL', name: 'Solana', price: 145.00, delta: 8.2, volatility: 'HIGH', holdings: 150 },
  { symbol: 'MSFT', name: 'Microsoft', price: 420.10, delta: 0.1, volatility: 'LOW', holdings: 10 },
  { symbol: 'GOOGL', name: 'Alphabet', price: 150.50, delta: 0.2, volatility: 'LOW', holdings: 15 },
  { symbol: 'AMD', name: 'Adv Micro Dev', price: 180.00, delta: 3.1, volatility: 'HIGH', holdings: 30 },
  { symbol: 'PLTR', name: 'Palantir', price: 24.50, delta: 1.5, volatility: 'MED', holdings: 100 },
  { symbol: 'COIN', name: 'Coinbase', price: 240.00, delta: 5.8, volatility: 'HIGH', holdings: 15 },
  { symbol: 'SPY', name: 'SPDR S&P 500', price: 510.00, delta: 0.05, volatility: 'LOW', holdings: 5 },
];

const CHART_DATA = Array.from({ length: 40 }).map((_, i) => ({
  time: i,
  portfolio: 1000 + Math.random() * 200 + (i * 10),
  sp500: 1000 + Math.random() * 50 + (i * 12)
}));

const RADAR_DATA = [
  { subject: 'Beta', A: 120, fullMark: 150 },
  { subject: 'Volatility', A: 98, fullMark: 150 },
  { subject: 'Liquidity', A: 86, fullMark: 150 },
  { subject: 'Sector', A: 99, fullMark: 150 },
  { subject: 'Sentiment', A: 85, fullMark: 150 },
  { subject: 'Yield', A: 65, fullMark: 150 },
];

// --- Sub-Components ---

const SignalPips = ({ intensity }: { intensity: number }) => (
  <div className="flex gap-[2px] items-end h-3">
     {[...Array(5)].map((_, i) => (
        <motion.div 
            key={i} 
            initial={{ height: '20%' }}
            animate={{ height: `${Math.max(20, Math.random() * 100 * (intensity > 5 ? 1 : 0.4))}%` }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse', delay: i * 0.1 }}
            className={`w-[2px] rounded-sm ${i < (intensity / 2) ? 'bg-neutral-600' : 'bg-neutral-900'}`} 
        />
     ))}
  </div>
);

// Feature 1: The Event_Horizon Sidebar
const EventHorizon = () => {
    const events = [
        { id: 'DIV_PAY', time: '02H 14M', top: '20%' },
        { id: 'EARN_CALL', time: '14H 00M', top: '45%' },
        { id: 'MK_CLOSE', time: '06H 30M', top: '80%' }
    ];

    return (
        <div className="w-12 h-full border-l border-neutral-800 relative flex justify-center bg-[#080808]">
            {/* Timeline Line */}
            <div className="absolute top-4 bottom-4 w-[1px] bg-neutral-800" />
            
            {events.map((e, i) => (
                <div key={e.id} className="absolute group cursor-help z-20" style={{ top: e.top }}>
                    {/* Pip */}
                    <div className="w-1.5 h-1.5 bg-fluoro-yellow rounded-full shadow-[0_0_5px_rgba(210,255,0,0.4)] relative z-10 hover:scale-125 transition-transform" />
                    
                    {/* Tooltip (Left alignment) */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-0 pointer-events-none whitespace-nowrap bg-black border border-neutral-800 px-2 py-1 rounded-sm z-50">
                        <span className="text-[8px] font-mono text-fluoro-yellow tracking-wider">
                            {e.id} // <span className="text-white">{e.time}</span>
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Feature 2: Exposure_Rail
const ExposureRail = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1.1, duration: 0.8, ease: "circOut" }}
            className="w-full mb-8 origin-left"
        >
            <div className="flex justify-between text-[8px] font-mono text-neutral-500 mb-1.5 uppercase tracking-widest px-1">
                <span className="flex items-center gap-1"><div className="w-1 h-1 bg-neutral-600 rounded-full" />CASH_LIQUIDITY (15%)</span>
                <span className="flex items-center gap-1"><div className="w-1 h-1 bg-fluoro-yellow rounded-full" />EQUITIES_CORE (60%)</span>
                <span className="flex items-center gap-1"><div className="w-1 h-1 bg-neutral-800 rounded-full" />DERIVATIVES (25%)</span>
            </div>
            <div className="flex w-full h-[2px] bg-neutral-900 overflow-hidden rounded-full">
                <div className="w-[15%] bg-neutral-700 h-full border-r border-black" />
                <div className="w-[60%] bg-fluoro-yellow h-full shadow-[0_0_15px_rgba(210,255,0,0.3)] border-r border-black" />
                <div className="w-[25%] bg-neutral-800 h-full" />
            </div>
        </motion.div>
    );
};

// Feature 3: Audit_Log
const AuditLog = () => {
    const [lines, setLines] = useState<string[]>([]);
    
    useEffect(() => {
        // Mock data to type in
        const logs = [
            "TX_HASH_8842... CONFIRMED",
            "ALPHA_VECTOR_SYNC... [OK]",
            "VOLATILITY_INDEX... UPDATED",
            "HEARTBEAT_ACK... 14ms",
            "SYSTEM_READY"
        ];
        
        // Start sequence after splash screen
        const startDelay = 1200; 

        logs.forEach((log, index) => {
            setTimeout(() => {
                setLines(prev => [...prev, log]);
            }, startDelay + (index * 200));
        });
    }, []);

    return (
        <div className="w-full border-t border-neutral-900 bg-neutral-950/50 p-4 font-mono text-[9px] text-neutral-500 uppercase tracking-wider min-h-[100px] flex flex-col justify-end">
            <div className="mb-2 text-[8px] text-neutral-700">SYSTEM_AUDIT_LOG // RECENT_EVENTS</div>
            {lines.map((line, i) => (
                <div key={i} className="flex items-center gap-2">
                    <span className="text-neutral-700">{new Date().toLocaleTimeString('en-US', {hour12: false})}</span>
                    <span className="text-neutral-400">>></span>
                    <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={i === lines.length - 1 ? "text-fluoro-yellow" : ""}
                    >
                        {line}
                    </motion.span>
                </div>
            ))}
            <motion.div 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-1.5 h-3 bg-fluoro-yellow mt-1"
            />
        </div>
    );
};

const TradeCommitTerminal = () => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'EXECUTING' | 'SUCCESS'>('IDLE');
  const [logs, setLogs] = useState<string[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.length > 0) {
      executeTrade();
    }
  };

  const executeTrade = () => {
    setStatus('EXECUTING');
    setLogs(prev => [`> PARSING COMMAND: "${input.toUpperCase()}"...`, ...prev]);
    
    setTimeout(() => {
        setLogs(prev => [`> ROUTING ORDER TO EXCHANGE NODE...`, ...prev]);
    }, 600);

    setTimeout(() => {
        setLogs(prev => [`> ORDER FILLED: ${Math.random().toString(36).substring(7).toUpperCase()}`, ...prev]);
        setStatus('SUCCESS');
        setInput('');
        
        setTimeout(() => {
            setStatus('IDLE');
        }, 3000);
    }, 1800);
  };

  return (
    <div className="bg-black/40 border border-neutral-800 rounded-xl p-4 h-full flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-600 tracking-widest uppercase">
                <TerminalIcon size={12} className="text-neutral-500" />
                TRADE_EXECUTION_SHELL
            </div>
            <div className={`w-2 h-2 rounded-full ${status === 'IDLE' ? 'bg-neutral-800' : status === 'EXECUTING' ? 'bg-fluoro-yellow animate-ping' : 'bg-green-500'}`} />
        </div>

        {/* Logs */}
        <div className="flex-1 overflow-hidden relative mb-2">
             <div className="absolute bottom-0 left-0 w-full flex flex-col-reverse gap-1">
                 {logs.map((log, i) => (
                     <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1 - (i * 0.15), x: 0 }}
                        className="text-[10px] font-mono text-fluoro-yellow/80"
                     >
                        {log}
                     </motion.div>
                 ))}
             </div>
        </div>

        {/* Input Area */}
        <div className="relative group">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-mono text-xs">root@ledgerly:~#</span>
             <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="BUY 10 AAPL LIMIT 175.00"
                disabled={status !== 'IDLE'}
                className="w-full bg-neutral-900/30 border border-neutral-800 focus:border-fluoro-yellow/50 rounded-lg py-3 pl-36 pr-4 text-xs font-mono text-white focus:outline-none transition-colors uppercase placeholder:text-neutral-700"
             />
             <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {status === 'SUCCESS' ? (
                    <div className="flex items-center gap-1 text-[9px] text-green-500 font-mono">
                        <CheckCircle2 size={10} /> CONFIRMED
                    </div>
                ) : (
                    <div className="text-[9px] text-neutral-600 font-mono hidden group-focus-within:block">PRESS ENTER</div>
                )}
             </div>
        </div>
    </div>
  );
};

const AlphaVectorChart = () => {
    const intersections = useMemo(() => {
        const points = [];
        for (let i = 1; i < CHART_DATA.length; i++) {
            const prev = CHART_DATA[i-1];
            const curr = CHART_DATA[i];
            if (prev.portfolio <= prev.sp500 && curr.portfolio > curr.sp500) {
                points.push(curr);
            }
        }
        return points;
    }, []);

    const lastPoint = CHART_DATA[CHART_DATA.length - 1];
    const performance = (lastPoint.portfolio - lastPoint.sp500) / lastPoint.sp500;

    return (
        <div className="h-[300px] w-full flex">
             {/* Chart Area */}
             <div className="flex-1 relative group flex flex-col">
                 <div className="absolute top-4 left-4 z-10">
                     <h3 className="text-sm font-bold text-white">Alpha_Vector</h3>
                     <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
                         PORTFOLIO vs SP500 (SHADOW)
                     </p>
                 </div>
                 
                 <div className="flex-1 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={CHART_DATA}>
                            <Tooltip 
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-black/90 border-l-2 border-fluoro-yellow p-2 shadow-[0_0_10px_rgba(210,255,0,0.1)]">
                                                <div className="text-[9px] font-mono text-neutral-500 mb-1">SCANNING_BEAM_LOCKED</div>
                                                <div className="text-sm font-bold text-white font-mono">
                                                    {formatCurrency(payload[0].value as number)}
                                                </div>
                                                <div className="text-[9px] font-mono text-neutral-500">
                                                    IDX: {(payload[1].value as number).toFixed(2)}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                                cursor={{ stroke: '#444', strokeWidth: 1, strokeDasharray: '3 3' }} 
                            />
                            <Line 
                                type="monotone" 
                                dataKey="sp500" 
                                stroke="#ffffff" 
                                strokeWidth={1} 
                                strokeOpacity={0.1} 
                                dot={false}
                                animationDuration={2000} 
                            />
                            <Line 
                                type="monotone" 
                                dataKey="portfolio" 
                                stroke="#D2FF00" 
                                strokeWidth={2} 
                                strokeOpacity={0.8}
                                dot={false}
                                animationDuration={2500}
                            />
                            {intersections.map((point, i) => (
                                <ReferenceDot 
                                    key={i}
                                    x={point.time}
                                    y={point.portfolio}
                                    r={3}
                                    fill="#D2FF00"
                                    stroke="none"
                                >
                                    <animate attributeName="opacity" from="0.6" to="0" dur="2s" begin="0s" repeatCount="indefinite" />
                                </ReferenceDot>
                            ))}
                        </LineChart>
                    </ResponsiveContainer>

                    {/* Scanning Line Effect (CSS) */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute top-0 bottom-0 w-[1px] bg-white/5 left-1/2" />
                          <div className="absolute left-0 right-0 h-[1px] bg-white/5 top-1/2" />
                    </div>
                 </div>

                 {/* DeltaBar Component */}
                 <div className="h-[2px] w-full bg-neutral-900 mt-[-1px] relative z-20 overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (performance * 500) + 50)}%` }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="h-full bg-neutral-700"
                     />
                 </div>
             </div>
             
             {/* Feature 1: Event_Horizon (Right Sidebar inside Card) */}
             <EventHorizon />
        </div>
    );
};

const RiskCorrelationSpider = () => {
    return (
        <div className="h-full min-h-[250px] relative flex flex-col">
            <div className="flex justify-between items-start mb-4">
                 <div>
                    <h3 className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">Risk_Spider</h3>
                    <p className="text-[8px] text-neutral-600">SYSTEMIC_CORRELATION</p>
                 </div>
                 <AlertTriangle size={12} className="text-neutral-700" />
            </div>
            
            <div className="flex-1 -ml-6">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
                        <PolarGrid stroke="#1A1A1A" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#333', fontSize: 8, fontFamily: 'JetBrains Mono' }} />
                        <Radar
                            name="Portfolio"
                            dataKey="A"
                            stroke="#D2FF00"
                            strokeWidth={1}
                            strokeOpacity={0.7}
                            fill="#D2FF00"
                            fillOpacity={0.05}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const GlobalIndicesTicker = () => {
    return (
        <div className="relative w-full overflow-hidden h-8 bg-neutral-950 border-t border-neutral-900 flex items-center">
            {/* Scanning Beam for Ticker - Subtle */}
            <div 
                className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-white/5 to-transparent z-20 pointer-events-none"
                style={{ animation: 'tickerScan 8s linear infinite' }} 
            />
            <style>{`
                @keyframes tickerScan {
                    0% { left: -20%; }
                    100% { left: 120%; }
                }
            `}</style>

            <motion.div 
                className="flex gap-12 whitespace-nowrap px-4"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
                {[...Array(2)].map((_, i) => (
                    <React.Fragment key={i}>
                         <div className="flex items-center gap-2">
                             <span className="text-[10px] font-mono text-neutral-600">NASDAQ</span>
                             <span className="text-[10px] font-mono text-neutral-400">+1.24%</span>
                         </div>
                         <div className="flex items-center gap-2">
                             <span className="text-[10px] font-mono text-neutral-600">S&P 500</span>
                             <span className="text-[10px] font-mono text-neutral-400">+0.85%</span>
                         </div>
                         <div className="flex items-center gap-2">
                             <span className="text-[10px] font-mono text-neutral-600">BTC/USD</span>
                             <span className="text-[10px] font-mono text-red-900">-0.42%</span>
                         </div>
                         <div className="flex items-center gap-2">
                             <span className="text-[10px] font-mono text-neutral-600">ETH/USD</span>
                             <span className="text-[10px] font-mono text-green-900">+2.10%</span>
                         </div>
                         <div className="flex items-center gap-2">
                             <span className="text-[10px] font-mono text-neutral-600">VIX</span>
                             <span className="text-[10px] font-mono text-neutral-400">14.20</span>
                         </div>
                         <div className="flex items-center gap-2">
                             <span className="text-[10px] font-mono text-neutral-600">GOLD</span>
                             <span className="text-[10px] font-mono text-neutral-500">+0.1%</span>
                         </div>
                    </React.Fragment>
                ))}
            </motion.div>
        </div>
    );
};

// --- Main View ---

export const EquitiesView: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-24 w-full">

       <PageHeader 
         title="EQUITIES.COMMAND_CENTER"
         subtitle="ACTIVE_TRADING_FLOOR"
       />
       
       {/* Feature 2: Exposure_Rail (Header Telemetry) */}
       <ExposureRail />

       {/* Asymmetrical Bento Grid */}
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
           
           {/* Tier 1: Alpha Vector (Chart) */}
           <div className="lg:col-span-9">
               <GlowCard className="rounded-2xl p-0 h-full bg-[#0A0A0A] overflow-hidden">
                   <AlphaVectorChart />
               </GlowCard>
           </div>

           {/* Tier 2: Risk Spider (Radar) */}
           <div className="lg:col-span-3">
               <GlowCard className="rounded-2xl p-6 h-full bg-[#0A0A0A]">
                   <RiskCorrelationSpider />
               </GlowCard>
           </div>

           {/* Tier 3: Trade Terminal (Command Line) */}
           <div className="lg:col-span-12">
               <TradeCommitTerminal />
           </div>

           {/* Tier 4: Volatility Heatmap */}
           <div className="lg:col-span-12">
               <div className="flex items-center gap-2 mb-4">
                   <Activity size={16} className="text-neutral-500" />
                   <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">Volatility Heatmap</h3>
                   <div className="h-[1px] flex-1 bg-neutral-900" />
                   <span className="text-[9px] font-mono text-neutral-600">FILTER: ALL_ASSETS</span>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                   {HEATMAP_DATA.map((asset) => {
                       return (
                           <GlowCard
                              key={asset.symbol}
                              className={`
                                rounded-xl p-4 cursor-pointer relative group overflow-hidden transition-all
                                border border-neutral-800 hover:border-fluoro-yellow/50
                              `}
                           >
                               <div className="relative z-10">
                                   <div className="flex justify-between items-start mb-2">
                                       <span className="text-xs font-bold text-white font-sans">{asset.symbol}</span>
                                       {asset.volatility === 'HIGH' && <Zap size={10} className="text-neutral-600 group-hover:text-fluoro-yellow transition-colors" />}
                                   </div>
                                   <div className="text-[10px] font-mono text-neutral-500 truncate mb-3">{asset.name}</div>
                                   
                                   <div className="flex justify-between items-end">
                                       <div className="flex flex-col">
                                            <span className="text-xs font-mono text-white">{formatCurrency(asset.price)}</span>
                                            <span className={`text-[9px] font-mono ${asset.delta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {asset.delta > 0 ? '+' : ''}{asset.delta}%
                                            </span>
                                       </div>
                                       <SignalPips intensity={Math.abs(asset.delta)} />
                                   </div>
                               </div>

                               {/* Hover HUD - Simplified */}
                               <div className="absolute inset-0 bg-black/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center p-2 z-20">
                                   <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider mb-1">Delta_1H</div>
                                   <div className="text-lg font-bold text-white font-mono">{asset.delta > 0 ? '+' : ''}{asset.delta}%</div>
                               </div>
                           </GlowCard>
                       );
                   })}
               </div>
           </div>
       </div>

       {/* Feature 3: Audit_Log (Footer) */}
       <AuditLog />

       {/* Footer Ticker */}
       <div className="fixed bottom-0 left-0 w-full z-40">
           <GlobalIndicesTicker />
       </div>
    </div>
  );
};