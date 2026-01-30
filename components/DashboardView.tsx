import React, { useRef, useEffect } from 'react';
import { motion, animate, Variants } from 'framer-motion';
import { SparklineChart } from './SparklineChart';
import { FinancialSummary, Transaction, UserProfile } from '../types';
import { formatCurrency, generateCSV } from '../utils';
import { GlowCard } from './GlowCard';
import { UtilityRail } from './UtilityRail';
import { PageHeader } from './PageHeader';
import { 
  ArrowUpRight, 
  TrendingUp,
  Zap,
  Activity,
  Layers,
  ArrowDownLeft,
  DollarSign,
  PieChart
} from 'lucide-react';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip as ReTooltip } from 'recharts';

interface DashboardViewProps {
  data: FinancialSummary;
  userProfile: UserProfile;
  insight: string;
  loadingInsight: boolean;
  highlightedTxId?: string | null;
  onNavigate: (tab: string) => void;
  onOpenTransactionModal: () => void;
  onManageBalance: () => void;
  onShowToast: (msg: string) => void;
}

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

// --- Kinetic Odometer Component ---
const Odometer: React.FC<{ value: number; className?: string }> = ({ value, className = "" }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const controls = animate(0, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (latest) => {
        node.textContent = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(latest);
      },
    });

    return () => controls.stop();
  }, [value]);

  return <span ref={ref} className={`${className} tabular-nums`} />;
};

// --- Micro-KPI Card with Scanning Beam ---
const MicroKPICard = ({ title, value, delta, icon: Icon }: { title: string, value: number, delta: string, icon: any }) => {
  return (
    <GlowCard variants={itemVariants} className="rounded-xl p-5 relative group cursor-default">
      {/* Scanning Beam Animation */}
      <div 
         className="absolute top-0 left-0 w-full h-[5%] bg-gradient-to-b from-transparent via-white/10 to-transparent blur-md pointer-events-none z-20"
         style={{ animation: 'scanBeamVertical 3s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}
      />
      
      <div className="relative z-10">
         <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{title}</span>
            <div className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 group-hover:text-fluoro-yellow transition-colors">
               <Icon size={14} />
            </div>
         </div>
         <div className="text-xl font-bold text-white tracking-tight mb-1">
            <Odometer value={value} />
         </div>
         <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 bg-[#D2FF00]/10 border border-[#D2FF00]/20 rounded text-[9px] font-mono font-bold text-fluoro-yellow">
               {delta}
            </span>
            <span className="text-[9px] text-neutral-600 font-mono">VS LAST 30D</span>
         </div>
      </div>
    </GlowCard>
  );
};

// --- Activity Table Row ---
const ActivityRow: React.FC<{ tx: Transaction }> = ({ tx }) => {
   const getStatusStyle = (status: string) => {
      switch(status) {
         case 'CLEARED': return 'bg-green-500/10 text-green-500 border-green-500/20';
         case 'PENDING': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
         case 'FAILED': return 'bg-red-500/10 text-red-500 border-red-500/20';
         default: return 'bg-neutral-800 text-neutral-500';
      }
   };

   return (
      <div className="grid grid-cols-12 gap-4 py-3 border-b border-neutral-800/50 hover:bg-neutral-900/30 transition-colors items-center">
         <div className="col-span-1 flex justify-center">
            <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
               {tx.amount > 0 ? <ArrowDownLeft size={14} className="text-green-500" /> : <ArrowUpRight size={14} className="text-white" />}
            </div>
         </div>
         <div className="col-span-2 text-[10px] font-mono text-neutral-500">{tx.id.substring(0,8)}</div>
         <div className="col-span-3 text-xs font-bold text-white truncate">{tx.merchant}</div>
         <div className="col-span-2 text-xs font-bold text-white text-right font-mono tabular-nums">
            {formatCurrency(Math.abs(tx.amount))}
         </div>
         <div className="col-span-2 text-[10px] font-mono text-neutral-500 text-right">{tx.date}</div>
         <div className="col-span-2 flex justify-end">
            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${getStatusStyle(tx.status)}`}>
               {tx.status}
            </span>
         </div>
      </div>
   );
};

// --- Transaction Marquee (Liquid Ticker) with Wheel Scroll ---
const TransactionMarquee: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
   const tickerData = [...transactions, ...transactions, ...transactions, ...transactions]; // Quadruple to ensure enough scroll width
   const scrollRef = useRef<HTMLDivElement>(null);
   const isPaused = useRef(false);

   useEffect(() => {
     const el = scrollRef.current;
     if (!el) return;

     let animationFrameId: number;
     const scrollSpeed = 0.5;

     const animateScroll = () => {
       if (!isPaused.current) {
         el.scrollLeft += scrollSpeed;
         if (el.scrollLeft >= el.scrollWidth / 2) {
            el.scrollLeft = 0;
         }
       }
       animationFrameId = requestAnimationFrame(animateScroll);
     };

     animationFrameId = requestAnimationFrame(animateScroll);

     return () => cancelAnimationFrame(animationFrameId);
   }, [transactions]);

   const handleWheel = (e: React.WheelEvent) => {
     if (scrollRef.current) {
       scrollRef.current.scrollLeft += e.deltaY;
     }
   };

   return (
       <div 
         className="w-full overflow-hidden relative group mt-auto pt-6 pb-2 border-t border-neutral-900"
         onMouseEnter={() => { isPaused.current = true; }}
         onMouseLeave={() => { isPaused.current = false; }}
         onWheel={handleWheel}
       >
           {/* Fade Gradients */}
           <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
           <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

           <div 
               ref={scrollRef}
               className="flex gap-8 w-full overflow-x-hidden whitespace-nowrap"
           >
               {tickerData.map((tx, i) => (
                    <div key={`${tx.id}-${i}`} className="flex-shrink-0 flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                       <span className={`text-[10px] font-mono font-bold ${tx.amount > 0 ? 'text-green-500' : 'text-fluoro-yellow'}`}>
                          {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                       </span>
                       <span className="text-[10px] font-sans font-bold text-neutral-400">{tx.merchant}</span>
                       <span className="text-[8px] font-mono text-neutral-600">[{tx.status}]</span>
                       <span className="w-1 h-1 rounded-full bg-neutral-800" />
                    </div>
               ))}
           </div>
       </div>
   );
};

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  data, 
  userProfile,
  insight, 
  loadingInsight, 
  highlightedTxId,
  onNavigate,
  onOpenTransactionModal,
  onManageBalance,
  onShowToast
}) => {
  // Pie Chart Data
  const allocationData = [
     { name: 'Infrastructure', value: 400, color: '#D2FF00' },
     { name: 'Payroll', value: 300, color: '#ffffff' },
     { name: 'Marketing', value: 300, color: '#525252' },
     { name: 'Software', value: 200, color: '#262626' },
  ];

  const handleExport = () => {
    generateCSV(data.recentTransactions);
    onShowToast("SYSTEM_STATUS: EXPORT_SUCCESS");
  };

  return (
    <motion.div 
      className="w-full min-h-screen grid grid-cols-1 xl:grid-cols-12 gap-8 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
       
       <style>{`
         @keyframes scanBeamVertical {
           0% { transform: translateY(-100%); opacity: 0; }
           15% { opacity: 0.15; }
           50% { opacity: 0.15; }
           100% { transform: translateY(500%); opacity: 0; }
         }
       `}</style>

       {/* --- Main Telemetry Area (9 cols) --- */}
       <div className="xl:col-span-9 flex flex-col gap-6">
          
          <PageHeader 
             title="SYSTEM.MONITOR" 
             subtitle="REAL-TIME_TELEMETRY_FEED"
             actionElement={
                <>
                  <button 
                    onClick={onManageBalance}
                    className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/50 text-[10px] font-mono text-neutral-400 hover:text-white transition-colors"
                  >
                     MANAGE_BALANCE
                  </button>
                  <button 
                    onClick={handleExport}
                    className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/50 text-[10px] font-mono text-neutral-400 hover:text-white transition-colors"
                  >
                     EXPORT_CSV
                  </button>
                </>
             }
          />

          {/* 2. Micro-KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <MicroKPICard title="TOTAL_REVENUE" value={19270.56} delta="+8%" icon={DollarSign} />
             <MicroKPICard title="SAVINGS_VELOCITY" value={8420.00} delta="+12%" icon={Layers} />
             <MicroKPICard title="MONTHLY_EXPENSE" value={3450.20} delta="-4%" icon={Zap} />
             <MicroKPICard title="NET_DELTA" value={15820.36} delta="+22%" icon={TrendingUp} />
          </div>

          {/* 3. Central Visualization (High-Fidelity Sparkline) */}
          <GlowCard variants={itemVariants} className="rounded-2xl p-6 relative">
             <div className="flex justify-between items-center mb-6">
                <div>
                   <h3 className="text-sm font-bold text-white">Cash Flow</h3>
                   <div className="text-2xl font-bold text-white mt-1">
                      <Odometer value={19270.56} />
                   </div>
                </div>
                <div className="flex gap-2">
                   {['Income', 'Expense', 'Saving'].map(tab => (
                      <button key={tab} className="px-3 py-1 rounded-full border border-neutral-800 text-[10px] font-mono text-neutral-400 hover:border-fluoro-yellow hover:text-white transition-colors">
                         {tab}
                      </button>
                   ))}
                </div>
             </div>
             
             {/* Fixed Height Container for Stability */}
             <div className="h-[300px] w-full min-h-0 relative">
                <SparklineChart data={data.cashFlowData} />
             </div>
          </GlowCard>

          {/* 4. Bottom Grid (Table + Radial) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Recent Transactions Table */}
             <div className="lg:col-span-2">
               <GlowCard variants={itemVariants} className="rounded-2xl p-6 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xs font-bold text-white uppercase tracking-wider">Transaction Activity</h3>
                     <div className="flex gap-2 text-[10px] font-mono text-neutral-500">
                        <button className="hover:text-fluoro-yellow">FILTER</button>
                        <span>|</span>
                        <button onClick={handleExport} className="hover:text-fluoro-yellow">EXPORT</button>
                     </div>
                  </div>
                  
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 pb-3 border-b border-neutral-800 text-[9px] font-mono text-neutral-500 uppercase tracking-wider">
                     <div className="col-span-1 text-center">Type</div>
                     <div className="col-span-2">ID</div>
                     <div className="col-span-3">User/Merchant</div>
                     <div className="col-span-2 text-right">Amount</div>
                     <div className="col-span-2 text-right">Date</div>
                     <div className="col-span-2 text-right">Status</div>
                  </div>

                  {/* Rows */}
                  <div className="flex-1 overflow-auto max-h-[300px] custom-scrollbar">
                     {data.recentTransactions.slice(0, 5).map(tx => (
                        <ActivityRow key={tx.id} tx={tx} />
                     ))}
                  </div>
               </GlowCard>
             </div>

             {/* Budget Allocation Radial */}
             <div className="lg:col-span-1">
               <GlowCard variants={itemVariants} className="rounded-2xl p-6 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-2">
                     <h3 className="text-xs font-bold text-white uppercase tracking-wider">Allocation</h3>
                     <Activity size={14} className="text-neutral-500" />
                  </div>
                  
                  {/* Fixed Height Wrapper for ResponsiveContainer */}
                  <div className="h-[250px] w-full relative min-w-0 min-h-0 flex items-center justify-center">
                     <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                           <Pie
                              data={allocationData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              stroke="none"
                           >
                              {allocationData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                           </Pie>
                           <ReTooltip 
                             contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '8px' }}
                             itemStyle={{ color: '#fff', fontSize: '12px', fontFamily: 'monospace' }}
                           />
                        </RePieChart>
                     </ResponsiveContainer>
                     {/* Center Stats */}
                     <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-bold text-white">100%</span>
                        <span className="text-[9px] font-mono text-neutral-500">DISTRIBUTION</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                     {allocationData.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                           <span className="text-[10px] font-mono text-neutral-400">{item.name}</span>
                        </div>
                     ))}
                  </div>
               </GlowCard>
             </div>
          </div>
          
          {/* Liquid Ticker Footer */}
          <TransactionMarquee transactions={data.recentTransactions} />

       </div>

       {/* --- Right-Side Utility Rail (3 cols) --- */}
       <div className="xl:col-span-3 w-full shrink-0">
          <UtilityRail 
            totalBalance={data.totalBalance} 
            userName={userProfile.fullName}
            onOpenTransactionModal={onOpenTransactionModal}
            onNavigate={onNavigate}
          />
       </div>

    </motion.div>
  );
};