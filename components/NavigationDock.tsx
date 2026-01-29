import React from 'react';
import { Home, Wallet, Settings, Zap, PieChart, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationDockProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DockItem = ({ icon: Icon, active = false, onClick, label }: { icon: any, active?: boolean, onClick: () => void, label: string }) => (
  <motion.button 
    onClick={onClick}
    className="group relative flex flex-col items-center justify-center p-3"
    whileHover={{ scale: 1.2, y: -5 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    {/* Active Indicator Dot - Refined Shadow */}
    {active && (
      <motion.div 
        layoutId="activeDot"
        className="absolute -bottom-1 w-1 h-1 bg-fluoro-yellow rounded-full shadow-[0_0_5px_rgba(210,255,0,0.4)]"
      />
    )}
    
    <div className={`relative z-10 p-3 rounded-2xl transition-all duration-300 ${active ? 'bg-white/10 text-fluoro-yellow' : 'bg-transparent text-neutral-500 group-hover:text-white'}`}>
      <Icon size={22} strokeWidth={active ? 2.5 : 2} />
    </div>

    {/* Tooltip Label */}
    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-white px-2 py-1 rounded pointer-events-none whitespace-nowrap">
      {label}
    </div>
  </motion.button>
);

export const NavigationDock: React.FC<NavigationDockProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#050505]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
        <div className="border-r border-white/10 pr-4 mr-2 flex items-center">
             <Zap className="text-fluoro-yellow" size={20} fill="#D2FF00" />
        </div>
        
        <div className="flex gap-2">
            <DockItem icon={Home} label="OVERVIEW" active={activeTab === 'dashboard'} onClick={() => onTabChange('dashboard')} />
            <DockItem icon={Wallet} label="ACCOUNTS" active={activeTab === 'wallet'} onClick={() => onTabChange('wallet')} />
            <DockItem icon={TrendingUp} label="MARKETS" active={activeTab === 'equities'} onClick={() => onTabChange('equities')} />
            <DockItem icon={PieChart} label="DATA" active={activeTab === 'analytics'} onClick={() => onTabChange('analytics')} />
            <DockItem icon={Settings} label="SYSTEM" active={activeTab === 'settings'} onClick={() => onTabChange('settings')} />
        </div>
      </div>
    </div>
  );
};