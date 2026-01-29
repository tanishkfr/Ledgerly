import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { GlowCard } from './GlowCard';
import { formatCurrency } from '../utils';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  Plus, 
  ShieldCheck,
  Lock,
  Wifi
} from 'lucide-react';

interface UtilityRailProps {
  totalBalance: number;
  userName: string;
  onOpenTransactionModal: () => void;
  onNavigate: (tab: string) => void;
}

interface Account {
  id: string;
  balance: number;
}

// --- Shared Titanium Components ---

// Titanium Chip with Glowing Traces
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

// Rail Smart Card Component (Titanium Enclave Style)
const RailSmartCard = ({ userName }: { userName: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse tracking for glass effect
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

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="absolute top-0 left-0 right-0 h-[140px] rounded-2xl overflow-hidden cursor-pointer group bg-[#111] shadow-2xl"
      initial={{ y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
                backgroundPosition: useMotionTemplate`calc(50% + ${springX}px * 0.1) calc(50% + ${springY}px * 0.1)`,
                backgroundSize: '200% 200%'
            }}
        />

        {/* Content Layer */}
        <div className="relative z-20 h-full p-5 flex flex-col justify-between">
            {/* Top Row: Chip & Bank ID */}
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-neutral-400 tracking-widest uppercase">BUSINESS_PRO</span>
                    {/* Active Heartbeat Line */}
                    <div className="h-[2px] w-8 bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div 
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="h-full w-full bg-fluoro-yellow shadow-[0_0_5px_#D2FF00]"
                        />
                    </div>
                </div>
                <TitaniumChip />
            </div>

            {/* Middle: Number */}
            <div className="flex items-center justify-between">
                <div className="text-lg font-mono text-white tracking-[0.15em] drop-shadow-md">
                    •••• 6541
                </div>
                <Wifi size={16} className="rotate-90 text-neutral-600 group-hover:text-fluoro-yellow transition-colors" />
            </div>

            {/* Bottom Row: Name & Visa */}
            <div className="flex justify-between items-end border-t border-white/5 pt-2">
                <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest truncate max-w-[150px]">{userName}</div>
                <div className="text-xs font-bold text-white italic">VISA</div>
            </div>
            
            {/* Micro Ticker (Stylized Decoration) */}
             <div className="absolute bottom-0 right-0 w-24 h-6 overflow-hidden flex items-end justify-end pointer-events-none opacity-50">
                 <div className="w-full h-[1px] bg-gradient-to-l from-fluoro-yellow/30 to-transparent absolute top-0 right-0" />
             </div>
        </div>
    </motion.div>
  );
};

// --- New Feature: Rotating Encryption Key ---
export const SecurityStatus = () => {
  const [key, setKey] = useState('0x7F2...9A1');
  
  useEffect(() => {
    const chars = '0123456789ABCDEF';
    const generateKey = () => {
      let result = '0x';
      for (let i = 0; i < 3; i++) result += chars[Math.floor(Math.random() * 16)];
      result += '...';
      for (let i = 0; i < 3; i++) result += chars[Math.floor(Math.random() * 16)];
      return result;
    };

    const interval = setInterval(() => {
      setKey(generateKey());
    }, 30000); // 30s update

    setKey(generateKey()); // Initial
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between bg-black/40 border border-neutral-800 rounded-lg p-3 mb-6">
      <div className="flex items-center gap-2">
        <ShieldCheck size={14} className="text-fluoro-yellow" />
        <span className="text-[9px] font-mono text-neutral-500 tracking-widest uppercase">ENCRYPTION</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono text-white tracking-widest">{key}</span>
        <div className="relative w-2 h-2">
           <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
           <span className="absolute inset-0 rounded-full bg-green-500" />
        </div>
      </div>
    </div>
  );
};

const QuickAction = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05, backgroundColor: 'rgba(210, 255, 0, 0.1)' }}
    whileTap={{ scale: 0.95 }}
    className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#111] border border-neutral-800 group transition-colors"
  >
    <Icon size={20} className="text-neutral-400 group-hover:text-fluoro-yellow mb-2 transition-colors" />
    <span className="text-[9px] font-mono text-neutral-500 font-bold tracking-wider">{label}</span>
  </motion.button>
);

const SpendingBar = ({ label, percent, color }: { label: string, percent: number, color: string }) => (
  <div className="mb-3">
    <div className="flex justify-between items-end mb-1">
      <span className="text-[9px] font-mono text-neutral-400 uppercase">{label}</span>
      <span className="text-[9px] font-mono text-white">{percent}%</span>
    </div>
    <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  </div>
);

export const UtilityRail: React.FC<UtilityRailProps> = ({ totalBalance, userName, onOpenTransactionModal, onNavigate }) => {
  return (
    <div className="flex flex-col gap-6 h-full">
      
      {/* 1. Live Card Stack */}
      <div className="relative">
        <h3 className="text-xs font-mono text-neutral-500 mb-4 tracking-widest uppercase">Active Cards</h3>
        <div className="relative h-[180px]">
          {/* Back Card (Static Ghost) */}
          <div className="absolute top-4 left-0 right-0 h-[140px] bg-neutral-900 border border-neutral-800 rounded-2xl transform scale-95 translate-y-4 opacity-50 z-0" />
          
          {/* Front Card (Smart Titanium) */}
          <RailSmartCard userName={userName} />
        </div>
      </div>

      {/* 2. Quick Actions */}
      <div>
        <h3 className="text-xs font-mono text-neutral-500 mb-4 tracking-widest uppercase">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <QuickAction icon={Plus} label="TOP_UP" onClick={onOpenTransactionModal} />
          <QuickAction icon={ArrowUpRight} label="TRANSFER" onClick={onOpenTransactionModal} />
          <QuickAction icon={ArrowDownLeft} label="REQUEST" onClick={onOpenTransactionModal} />
          <QuickAction icon={History} label="HISTORY" onClick={() => onNavigate('analytics')} />
        </div>
      </div>

      {/* 3. Smart Spending Limits */}
      <div className="bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-5 flex-1 min-h-[200px]">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-mono text-white font-bold">Daily Limit</h3>
            <span className="text-[10px] font-mono text-neutral-500">$1,200 / $2,000</span>
         </div>
         
         <div className="mb-6">
            <div className="text-2xl font-bold text-white mb-1">
               $1,200 <span className="text-sm font-normal text-neutral-500">used</span>
            </div>
            <div className="w-full h-2 bg-neutral-900 rounded-full flex overflow-hidden gap-0.5">
               <motion.div initial={{ width: 0 }} animate={{ width: '27%' }} className="h-full bg-orange-500" />
               <motion.div initial={{ width: 0 }} animate={{ width: '35%' }} className="h-full bg-indigo-500" />
               <motion.div initial={{ width: 0 }} animate={{ width: '18%' }} className="h-full bg-fluoro-yellow" />
            </div>
         </div>

         <div className="space-y-1">
            <SpendingBar label="SHOPPING (27%)" percent={27} color="#f97316" />
            <SpendingBar label="SUBSCRIPTIONS (35%)" percent={35} color="#6366f1" />
            <SpendingBar label="DINING OUT (18%)" percent={18} color="#D2FF00" />
            <SpendingBar label="OTHER (20%)" percent={20} color="#525252" />
         </div>
      </div>

    </div>
  );
};