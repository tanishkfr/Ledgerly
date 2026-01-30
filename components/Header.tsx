import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import { BrandLogo } from './BrandLogo';
import { UserProfile } from '../types';

interface HeaderProps {
  userProfile: UserProfile;
  latency: number;
  onNavigate: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ userProfile, latency, onNavigate }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  // Mouse tracking for kinetic border glow
  const mouseX = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX }: React.MouseEvent) {
    const { left } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
  }

  // System Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header 
      className="fixed top-0 left-0 w-full h-[70px] z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 select-none"
      onMouseMove={handleMouseMove}
    >
      {/* Kinetic Bottom Border Glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-fluoro-yellow z-50 opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          maskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px 0px, black, transparent)`,
          WebkitMaskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px 0px, black, transparent)`
        }}
      />

      {/* 
         Container Alignment:
         Matches App.tsx main structure: px-6 md:pr-12 md:pl-32
         Inner max-w-[1440px] mx-auto
      */}
      <div className="w-full h-full px-6 md:pr-12 md:pl-32">
        <div className="w-full h-full max-w-[1440px] mx-auto flex items-center justify-between">
            {/* Left: Brand Identity */}
            <div className="relative flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <BrandLogo size={28} />
                  <h1 className="text-base font-bold tracking-[0.2em] text-white font-sans">L E D G E R L Y</h1>
                </div>
                
                <div className="hidden md:flex flex-col ml-4 pl-4 border-l border-neutral-800 h-8 justify-center gap-0.5">
                   <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-fluoro-yellow rounded-full shadow-[0_0_8px_#D2FF00] animate-pulse" />
                     <span className="text-[9px] font-mono text-fluoro-yellow tracking-wider">SYSTEM_STATUS: NOMINAL</span>
                   </div>
                   <span className="text-[9px] font-mono text-neutral-500 tracking-wider">
                     {time.toLocaleTimeString('en-US', { hour12: false })} UTC
                   </span>
                </div>
            </div>

            {/* Right: Network Status & Profile */}
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 border border-neutral-800/50 rounded-full bg-black/40">
                  <span className="font-mono text-[9px] text-neutral-500 tracking-widest">NET_IO</span>
                  <span className="font-mono text-[9px] text-white border-l border-neutral-800 pl-3">
                    {Math.floor(latency)}MS
                  </span>
              </div>

              {/* Profile Dropdown Toggle */}
              <div className="relative ml-3">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-700 hover:border-fluoro-yellow transition-all flex items-center justify-center font-bold text-xs text-white group"
                >
                  <span className="group-hover:text-fluoro-yellow transition-colors">{userProfile.initials}</span>
                </button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-3 w-56 bg-[#0A0A0A] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden py-1 z-[60]"
                    >
                        <div className="px-4 py-3 border-b border-neutral-800 bg-neutral-900/30">
                          <p className="text-white font-bold text-xs tracking-wide">{userProfile.fullName}</p>
                          <p className="text-neutral-500 font-mono text-[9px] mt-0.5">{userProfile.role}</p>
                        </div>
                      <button onClick={() => { onNavigate('settings'); setIsProfileOpen(false); }} className="w-full text-left px-4 py-2.5 text-[10px] font-mono font-bold text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors uppercase tracking-wider">PROFILE_CONFIG</button>
                      <button className="w-full text-left px-4 py-2.5 text-[10px] font-mono font-bold text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors uppercase tracking-wider">API_KEYS</button>
                      <div className="h-[1px] bg-neutral-900 my-1" />
                      <button className="w-full text-left px-4 py-2.5 text-[10px] font-mono font-bold text-red-500 hover:bg-red-900/10 transition-colors uppercase tracking-wider">DISCONNECT_SESSION</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
        </div>
      </div>
    </header>
  );
};