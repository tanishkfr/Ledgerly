import React from 'react';
import { Home, Settings, Zap, PieChart, RefreshCw, Shield, TrendingUp } from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SidebarItem = ({ icon: Icon, active = false, onClick }: { icon: any, active?: boolean, onClick: () => void }) => {
  // Spotlight Logic for Sidebar Items
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Physics based smoothing
  const springConfig = { stiffness: 150, damping: 20 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.button 
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className="relative group cursor-pointer p-3 rounded-xl w-full flex justify-center overflow-hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Spotlight Glow Background */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              100px circle at ${springX}px ${springY}px,
              rgba(210, 255, 0, 0.1),
              transparent 80%
            )
          `,
        }}
      />
      
      {/* Border Trace - Subtle */}
       <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
           background: useMotionTemplate`
             radial-gradient(
               120px circle at ${springX}px ${springY}px,
               rgba(210, 255, 0, 0.5),
               transparent 80%
             )
           `,
           maskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
           WebkitMaskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
           maskComposite: 'exclude',
           WebkitMaskComposite: 'xor',
           padding: '1px'
        }}
      />

      {/* Static Active State */}
      {active && (
         <div className="absolute inset-0 bg-fluoro-yellow/5 rounded-xl border border-fluoro-yellow/20" />
      )}

      <Icon 
        size={24} 
        className={`relative z-10 transition-colors duration-200 ${active ? 'text-fluoro-yellow' : 'text-neutral-500 group-hover:text-white'}`} 
      />
    </motion.button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-[#050505] border-r border-neutral-900 hidden md:flex flex-col items-center py-8 z-50">
      <div className="mb-12">
        <Zap className="text-fluoro-yellow" size={32} strokeWidth={2.5} />
      </div>

      <div className="flex flex-col gap-4 w-full px-4">
        {/* Priority Reorder */}
        <SidebarItem icon={Home} active={activeTab === 'dashboard'} onClick={() => onTabChange('dashboard')} />
        <SidebarItem icon={PieChart} active={activeTab === 'analytics'} onClick={() => onTabChange('analytics')} />
        <SidebarItem icon={TrendingUp} active={activeTab === 'equities'} onClick={() => onTabChange('equities')} />
        <SidebarItem icon={RefreshCw} active={activeTab === 'exchange'} onClick={() => onTabChange('exchange')} />
        <SidebarItem icon={Shield} active={activeTab === 'insurance'} onClick={() => onTabChange('insurance')} />
        <SidebarItem icon={Settings} active={activeTab === 'settings'} onClick={() => onTabChange('settings')} />
      </div>

      <div className="mt-auto">
        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse" />
      </div>
    </div>
  );
};