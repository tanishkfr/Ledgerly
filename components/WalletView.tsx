import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform, useMotionTemplate } from 'framer-motion';
import { CreditCard, Plus, ArrowUpRight, Code, Server, Plane, Briefcase, Megaphone, ShoppingBag, Lock, Activity, Wifi } from 'lucide-react';
import { FinancialSummary, Account } from '../types';
import { GlowCard } from './GlowCard';
import { CardCreationModal } from './CardCreationModal';
import { SecurityStatus } from './UtilityRail';
import { AllocationMatrix } from './AllocationMatrix';
import { formatCurrency } from '../utils';
import { PageHeader } from './PageHeader';

interface WalletViewProps {
  data: FinancialSummary;
}

// --- Micro-Components ---

const DecipherText = ({ text, reveal, className = "" }: { text: string, reveal: boolean, className?: string }) => {
  const [display, setDisplay] = useState(reveal ? text : '••••');
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

  useEffect(() => {
    if (!reveal) {
      setDisplay('••••');
      return;
    }
    
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(prev => 
        text.split("").map((letter, index) => {
          if (index < iteration) {
            return text[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );
      
      if (iteration >= text.length) { 
        clearInterval(interval);
      }
      
      iteration += 1/3;
    }, 30);
    
    return () => clearInterval(interval);
  }, [reveal, text]);

  return <span className={`font-mono ${className}`}>{display}</span>;
};

// New Titanium Chip with Glowing Traces
const TitaniumChip = () => (
  <div className="relative w-11 h-8 rounded bg-[#151515] border border-[#333] overflow-hidden shadow-inner group-hover:border-fluoro-yellow/30 transition-colors">
     <svg className="w-full h-full" viewBox="0 0 44 32" fill="none">
        {/* Circuit Traces */}
        <path d="M0 10H10 L14 14 H30 L34 10 H44" stroke="#D2FF00" strokeWidth="0.5" strokeOpacity="0.4" fill="none" />
        <path d="M0 22H10 L14 18 H30 L34 22 H44" stroke="#D2FF00" strokeWidth="0.5" strokeOpacity="0.4" fill="none" />
        
        {/* Central Pad */}
        <rect x="14" y="6" width="16" height="20" rx="2" stroke="#D2FF00" strokeWidth="0.5" strokeOpacity="0.8" fill="none" />
        <rect x="16" y="8" width="12" height="16" rx="1" fill="#D2FF00" fillOpacity="0.05" />
        
        {/* Active Pulse Node */}
        <circle cx="22" cy="16" r="1.5" fill="#D2FF00" className="animate-pulse" />
        
        {/* Vertical Lines */}
        <line x1="18" y1="6" x2="18" y2="26" stroke="#D2FF00" strokeWidth="0.5" strokeOpacity="0.3" />
        <line x1="26" y1="6" x2="26" y2="26" stroke="#D2FF00" strokeWidth="0.5" strokeOpacity="0.3" />
     </svg>
  </div>
);

const LiquidityStream = () => {
  const rates = [
    { pair: "USD/BTC", val: "+1.2%", color: "text-green-500" },
    { pair: "USD/EUR", val: "-0.2%", color: "text-red-500" },
    { pair: "USD/ETH", val: "+0.8%", color: "text-green-500" },
    { pair: "USD/JPY", val: "+0.1%", color: "text-green-500" },
    { pair: "USD/GBP", val: "-0.4%", color: "text-red-500" },
    { pair: "GOLD/OZ", val: "+0.5%", color: "text-fluoro-yellow" },
  ];

  return (
    <div className="w-full overflow-hidden bg-black/40 border-y border-neutral-900 py-1.5 flex relative">
      <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-transparent to-[#080808] z-10 pointer-events-none" />
      <motion.div 
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
      >
        {[...rates, ...rates, ...rates].map((rate, i) => (
          <div key={i} className="flex items-center gap-2 text-[9px] font-mono">
             <span className="text-neutral-500">{rate.pair}:</span>
             <span className={`${rate.color}`}>{rate.val}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// --- Smart Card Component ---
interface SmartCardProps {
  account: Account;
  isExpanded: boolean;
  onSelect: () => void;
}

const SmartCard: React.FC<SmartCardProps> = ({ account, isExpanded, onSelect }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth mouse tracking
  const springConfig = { stiffness: 120, damping: 20 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Mock Transactions for HUD Ticker
  const tickerItems = [
    { label: 'AWS', amount: '-$12.40' },
    { label: 'SBUX', amount: '-$4.50' },
    { label: 'UBER', amount: '-$24.00' },
    { label: 'FIGMA', amount: '-$15.00' },
  ];

  return (
    <motion.div
        layoutId={account.id}
        ref={ref}
        onClick={onSelect}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
            opacity: 1, 
            y: 0,
            scale: isExpanded ? 1.02 : 1,
            boxShadow: isExpanded 
                ? '0 0 0 1px #D2FF00, 0 0 40px rgba(210, 255, 0, 0.15)' 
                : '0 0 0 0px transparent, 0 0 0px rgba(0,0,0,0)'
        }}
        transition={{ duration: 0.4 }}
        className={`relative overflow-hidden rounded-2xl aspect-[1.586/1] cursor-pointer group transition-all duration-500 bg-[#111]`}
    >
        {/* 1. Base Material: Radial Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1A1A1A_0%,#050505_100%)] z-0" />

        {/* 2. Texture: Micro-Noise Overlay (2% Opacity) */}
        <div 
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-0 pointer-events-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }} 
        />

        {/* 3. Kinetic Glass Refraction (Diagonal Shine) */}
        <motion.div
            className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
                background: useMotionTemplate`
                    linear-gradient(
                        115deg,
                        transparent 30%,
                        rgba(255, 255, 255, 0.03) 45%,
                        rgba(210, 255, 0, 0.08) 50%,
                        rgba(255, 255, 255, 0.03) 55%,
                        transparent 70%
                    )
                `,
                // Shift background based on mouse position to create parallax tilt effect
                backgroundPosition: useMotionTemplate`calc(50% + ${springX}px * 0.1) calc(50% + ${springY}px * 0.1)`,
                backgroundSize: '200% 200%'
            }}
        />

        {/* Content Layer */}
        <div className="relative z-20 h-full p-6 flex flex-col justify-between">
            {/* Top Row: Chip & Bank ID */}
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-neutral-400 tracking-widest uppercase">{account.bankName}</span>
                    {/* Active Heartbeat Line */}
                    <div className="h-[2px] w-8 bg-neutral-800 rounded-full overflow-hidden">
                        {isExpanded && (
                            <motion.div 
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="h-full w-full bg-fluoro-yellow shadow-[0_0_5px_#D2FF00]"
                            />
                        )}
                        {!isExpanded && <div className="h-full w-full bg-neutral-700" />}
                    </div>
                </div>
                <TitaniumChip />
            </div>

            {/* Middle: Number */}
            <div className="flex items-center justify-between mt-2">
                <div className="font-mono text-lg text-white tracking-[0.15em] drop-shadow-md">
                   <DecipherText text={account.number} reveal={isExpanded} />
                </div>
                {/* Contactless Indicator */}
                <Wifi size={16} className={`rotate-90 text-neutral-600 ${isExpanded ? 'text-fluoro-yellow animate-pulse' : ''}`} />
            </div>

            {/* Bottom Row: Details & Ticker */}
            <div className="flex justify-between items-end pt-4 border-t border-white/5 relative">
                 {/* Expiry/CVV */}
                 <div className="flex gap-6">
                    <div>
                        <div className="text-[7px] text-neutral-600 font-mono mb-0.5 uppercase">Expiry</div>
                        <div className="text-[10px] font-mono text-neutral-300">
                          <DecipherText text={account.expiry} reveal={isExpanded} />
                        </div>
                    </div>
                    <div>
                        <div className="text-[7px] text-neutral-600 font-mono mb-0.5 uppercase">CVC</div>
                        <div className="text-[10px] font-mono text-neutral-300">
                           <DecipherText text={account.cvv} reveal={isExpanded} />
                        </div>
                    </div>
                 </div>

                 {/* Micro-Ticker (Live Spending) */}
                 <div className="absolute bottom-0 right-0 w-24 h-6 overflow-hidden flex items-end justify-end pointer-events-none">
                     <div className="w-full h-[1px] bg-gradient-to-l from-fluoro-yellow/30 to-transparent absolute top-0 right-0" />
                     <motion.div 
                        className="flex gap-3 whitespace-nowrap"
                        animate={{ x: [0, -100] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                     >
                        {[...tickerItems, ...tickerItems].map((item, i) => (
                           <span key={i} className="text-[8px] font-mono text-neutral-500">
                              {item.amount} <span className="text-neutral-700">//</span>
                           </span>
                        ))}
                     </motion.div>
                 </div>
            </div>
        </div>
    </motion.div>
  );
};

// --- Animation Variants for Mechanical Entry ---
const vaultContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

// --- Main Component ---

export const WalletView: React.FC<WalletViewProps> = ({ data }) => {
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  
  // Dynamic Account State
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: 'CARD-001',
      bankName: 'BUSINESS_PRO',
      balance: 12450.00,
      type: 'CREDIT',
      number: '•••• 4829',
      expiry: '12/28',
      cvv: '842',
      theme: 'NEON'
    },
    {
      id: 'CARD-002',
      bankName: 'OPERATIONS',
      balance: 4200.50,
      type: 'DEBIT',
      number: '•••• 9921',
      expiry: '09/27',
      cvv: '194',
      theme: 'DARK'
    }
  ]);

  const handleAddCard = (newCard: Account) => {
    setAccounts((prev) => [...prev, newCard]);
  };

  const openTransactionModal = () => {
    const event = new CustomEvent('open-transaction-modal');
    window.dispatchEvent(event);
  };

  const getCategoryIcon = (category: string) => {
     const c = category.toLowerCase();
     if (c.includes('software')) return Code;
     if (c.includes('hosting')) return Server;
     if (c.includes('travel')) return Plane;
     if (c.includes('office')) return Briefcase;
     if (c.includes('marketing')) return Megaphone;
     if (c.includes('income')) return ArrowUpRight;
     return ShoppingBag;
  };

  // Derived Liquidity Logic
  const totalLiquidity = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const estimatedBurn = 1145 + 2300; 

  return (
    <div className="w-full flex flex-col gap-8 relative">
      
      {/* Background Atmosphere */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-fluoro-yellow/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <CardCreationModal 
        isOpen={isCardModalOpen} 
        onClose={() => setIsCardModalOpen(false)} 
        onSubmit={handleAddCard} 
      />
      
      <PageHeader 
        title="VAULT.ACCOUNTS"
        subtitle="ACTIVE_SECURITY_VAULT"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cards, Burn Rate */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Cards Section */}
          <div>
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase">
                   ACTIVE_CARDS // {accounts.length.toString().padStart(2, '0')}
                 </h3>
                 <button 
                   onClick={() => setIsCardModalOpen(true)}
                   className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D2FF00] bg-transparent hover:bg-[#D2FF00]/10 transition-all duration-300"
                 >
                   <Plus size={10} className="text-[#D2FF00]" />
                   <span className="text-[10px] font-mono text-[#D2FF00] tracking-widest uppercase shadow-[#D2FF00] drop-shadow-[0_0_5px_rgba(210,255,0,0.5)] group-hover:drop-shadow-[0_0_8px_rgba(210,255,0,0.8)] transition-all">
                      ADD_NEW
                   </span>
                 </button>
              </div>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6 perspective-[2000px]"
                variants={vaultContainerVariants}
                initial="hidden"
                animate="show"
              >
                <AnimatePresence mode="popLayout">
                  {accounts.map((card) => (
                    <SmartCard 
                        key={card.id}
                        account={card}
                        isExpanded={expandedCardId === card.id}
                        onSelect={() => setExpandedCardId(expandedCardId === card.id ? null : card.id)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
          </div>

          {/* Recurring Subscriptions: Burn-Rate Monitor */}
          <div className="bg-[#0A0A0A]/60 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-1.5 bg-neutral-900 rounded border border-neutral-800">
                    <Activity size={14} className="text-neutral-500" />
                </div>
                <h3 className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase">BURN_RATE_MONITOR</h3>
                <div className="flex-1 h-[1px] bg-neutral-900" />
             </div>
             
             <div className="space-y-3">
                {[
                  { name: 'AWS Cloud Services', amount: 240.50, date: 'Monthly', daysLeft: 4, icon: Server },
                  { name: 'Adobe Creative Cloud', amount: 54.99, date: 'Monthly', daysLeft: 12, icon: Code },
                  { name: 'WeWork Office', amount: 850.00, date: 'Monthly', daysLeft: 28, icon: Briefcase }
                ].map((sub, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.01, backgroundColor: 'rgba(210, 255, 0, 0.05)' }}
                    className="flex items-center justify-between p-3 border border-neutral-800/50 hover:border-fluoro-yellow/30 bg-black/20 rounded-xl group transition-all cursor-default"
                  >
                    <div className="flex items-center gap-4">
                       <motion.div 
                         whileHover={{ rotate: 360, backgroundColor: '#D2FF00', color: '#000' }}
                         transition={{ duration: 0.5 }}
                         className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400"
                       >
                         <sub.icon size={16} />
                       </motion.div>
                       <div>
                         <div className="text-xs font-bold text-white group-hover:text-fluoro-yellow transition-colors font-sans">{sub.name}</div>
                         <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] text-neutral-600 font-mono uppercase">{sub.date}</span>
                            <span className="w-1 h-1 bg-neutral-700 rounded-full" />
                            <span className="text-[9px] font-mono text-neutral-500">RENEWAL: {sub.daysLeft.toString().padStart(2, '0')} DAYS</span>
                         </div>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-sm font-mono font-bold text-white tracking-tight">{formatCurrency(sub.amount)}</div>
                       <div className="text-[8px] font-mono text-neutral-600">AUTO_PAY_ON</div>
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>

        </div>

        {/* Right Column: Balance & Actions (Refactored to Vault Utility Rail) */}
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
           
           {/* Total Balance Card */}
           <div className="bg-[#080808] border border-neutral-800 rounded-2xl p-6 sticky top-24 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-fluoro-yellow/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <h3 className="font-mono text-[9px] text-neutral-500 mb-2 tracking-widest flex items-center gap-2">
                 <Lock size={10} /> TOTAL_LIQUIDITY
              </h3>
              <div className="text-4xl font-extrabold text-white mb-6 tracking-tight">{formatCurrency(totalLiquidity)}</div>
              
              {/* New Active Security Vault Features */}
              <SecurityStatus />
              
              {/* Unified Liquidity Intelligence Module (Replaces AllocationMatrix + Runway) */}
              <AllocationMatrix accounts={accounts} monthlyBurn={estimatedBurn} />

              {/* Active Liquidity Stream */}
              <div className="mb-6 rounded border border-neutral-900 overflow-hidden">
                 <LiquidityStream />
              </div>

              <button 
                onClick={openTransactionModal}
                className="w-full mt-2 bg-fluoro-yellow text-black text-xs font-bold py-4 rounded-xl hover:bg-white transition-colors tracking-widest uppercase flex items-center justify-center gap-2 group border border-transparent hover:border-white/20 shadow-[0_0_15px_rgba(210,255,0,0.3)] hover:shadow-[0_0_25px_rgba(210,255,0,0.5)]"
              >
                <Plus size={14} className="group-hover:rotate-90 transition-transform duration-300" /> ADD TRANSACTION
              </button>
           </div>
           
           {/* High-Density Recent Activity (Vertical List) */}
           <div className="bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase">LIVE_FEED</h3>
                 <div className="w-1.5 h-1.5 rounded-full bg-fluoro-yellow animate-pulse" />
              </div>
              <div className="space-y-2 h-[200px] overflow-y-auto custom-scrollbar pr-2">
                 {data.recentTransactions.map((tx, i) => {
                    const Icon = getCategoryIcon(tx.category);
                    return (
                      <div key={tx.id} className="flex items-center justify-between p-2 hover:bg-neutral-900/50 rounded transition-colors group">
                         <div className="flex items-center gap-3">
                            <div className="text-neutral-600 group-hover:text-fluoro-yellow transition-colors">
                               <Icon size={12} />
                            </div>
                            <div className="flex flex-col">
                               <span className="text-[10px] font-bold text-neutral-300 group-hover:text-white truncate max-w-[100px]">{tx.merchant}</span>
                               <span className="text-[8px] font-mono text-neutral-600">{tx.date}</span>
                            </div>
                         </div>
                         <div className={`text-[10px] font-mono font-bold ${tx.amount > 0 ? 'text-green-500' : 'text-neutral-400'}`}>
                            {tx.amount > 0 ? '+' : ''}{Math.abs(tx.amount).toFixed(2)}
                         </div>
                      </div>
                    )
                 })}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};