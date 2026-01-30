import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Shield, CreditCard, Key, AlertTriangle, Activity, Save, Terminal, User, Cpu } from 'lucide-react';
import { UserProfile } from '../types';
import { GlowCard } from './GlowCard';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { PageHeader } from './PageHeader';

interface ProfileViewProps {
  initialProfile: UserProfile;
  onSave: (profile: Partial<UserProfile>) => void;
}

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

// --- Micro-Components ---

const GlitchAvatar = ({ initials }: { initials: string }) => {
  return (
    <div className="relative w-24 h-24 group cursor-pointer shrink-0">
      <div className="absolute inset-0 bg-neutral-900 rounded-xl flex items-center justify-center border border-neutral-800 overflow-hidden">
        {/* Base Layer */}
        <span className="text-3xl font-bold text-white relative z-10 font-mono">{initials}</span>
        
        {/* Glitch Layers (Subtler) */}
        <div className="absolute inset-0 bg-fluoro-yellow/5 translate-x-[1px] opacity-0 group-hover:opacity-100 transition-opacity mix-blend-screen flex items-center justify-center">
           <span className="text-3xl font-bold text-fluoro-yellow/30 font-mono">{initials}</span>
        </div>

        {/* Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] z-20 bg-[length:100%_2px] pointer-events-none opacity-50" />
      </div>
      
      {/* Corner Accents */}
      <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

const ThreatMap = () => {
  const nodes = [
    { x: 20, y: 40, status: 'active' }, // NA
    { x: 45, y: 35, status: 'idle' },   // EU
    { x: 75, y: 50, status: 'idle' },   // ASIA
    { x: 30, y: 70, status: 'idle' }    // SA
  ];

  return (
    <div className="relative w-full h-32 bg-neutral-950 rounded-lg border border-neutral-800 overflow-hidden group">
       <div className="absolute inset-0 opacity-10" 
            style={{ 
                backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', 
                backgroundSize: '12px 12px' 
            }} 
       />
       {/* Map Outline */}
       <svg className="w-full h-full text-neutral-800" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M10,30 Q25,20 40,30 T70,30 T90,40 V80 H10 Z" opacity="0.1" />
       </svg>

       {nodes.map((node, i) => (
         <div key={i} className="absolute" style={{ top: `${node.y}%`, left: `${node.x}%` }}>
            <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'active' ? 'bg-fluoro-yellow shadow-[0_0_5px_rgba(210,255,0,0.3)]' : 'bg-neutral-800'}`} />
            {node.status === 'active' && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-neutral-900 border border-neutral-700 rounded text-[7px] font-mono text-neutral-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                   US_EAST_1
                </div>
            )}
         </div>
       ))}
    </div>
  );
};

const BiometricPulse = () => {
  return (
     <div className="h-10 flex items-end gap-[2px] overflow-hidden w-full opacity-50">
        {Array.from({ length: 30 }).map((_, i) => (
           <motion.div
             key={i}
             className="flex-1 bg-fluoro-yellow/40 rounded-t-sm"
             animate={{ 
                height: [4, Math.random() * 24 + 4, 4],
                opacity: [0.3, 0.8, 0.3]
             }}
             transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.05,
                ease: "easeInOut"
             }}
           />
        ))}
     </div>
  );
};

const TinySparkline = ({ color = "#666", data }: { color?: string, data: any[] }) => (
    <div className="h-10 w-24 min-w-0 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <Line type="monotone" dataKey="value" stroke={color} strokeWidth={1} dot={false} isAnimationActive={true} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

// --- Main Component ---

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  initialProfile,
  onSave 
}) => {
  const [formData, setFormData] = useState<UserProfile>(initialProfile);
  const [isCommitting, setIsCommitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [bioInput, setBioInput] = useState("Full-stack systems architect specializing in high-frequency trading interfaces.");

  // Sync internal state if prop updates
  useEffect(() => {
    setFormData(initialProfile);
  }, [initialProfile]);

  const handleCommit = () => {
    setIsCommitting(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
        setUploadProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                return 100;
            }
            return prev + 5; // 20 steps * 50ms = ~1s
        });
    }, 50);

    setTimeout(() => {
        setIsCommitting(false);
        if (onSave) onSave(formData);
    }, 1200);
  };

  const rpsData = Array.from({ length: 15 }).map(() => ({ value: Math.random() * 100 }));
  const burnData = Array.from({ length: 15 }).map(() => ({ value: Math.random() * 50 + 20 }));

  return (
    <motion.div 
      className="relative w-full min-h-screen pb-24 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      
      <PageHeader 
        title="USER.CONFIG"
        subtitle="ACCESS_LEVEL_1"
      />

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* 1. General Settings: The "Biometric" Identity */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
            <GlowCard className="h-full rounded-2xl p-8 relative flex flex-col justify-between bg-[#0A0A0A]">
                <div className="absolute top-4 right-4 text-[8px] font-mono text-neutral-600 tracking-widest">CFG_MODULE_01 // BIO_ID</div>
                
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <GlitchAvatar initials={formData.initials} />
                    
                    <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1 group">
                                <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider group-focus-within:text-neutral-300 transition-colors">Designation (Name)</label>
                                <input 
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    className="w-full bg-neutral-900/50 border border-neutral-800 rounded px-3 py-2.5 text-sm font-mono text-white focus:border-fluoro-yellow/50 focus:outline-none transition-colors placeholder:text-neutral-700"
                                />
                            </div>
                            <div className="space-y-1 group">
                                <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider group-focus-within:text-neutral-300 transition-colors">Classification (Role)</label>
                                <input 
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    className="w-full bg-neutral-900/50 border border-neutral-800 rounded px-3 py-2.5 text-sm font-mono text-white focus:border-fluoro-yellow/50 focus:outline-none transition-colors placeholder:text-neutral-700"
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-1 group">
                            <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider group-focus-within:text-neutral-300 transition-colors">Bio-Data Feed</label>
                            <div className="relative">
                                <Terminal size={12} className="absolute top-3 left-3 text-neutral-700" />
                                <textarea 
                                    rows={3}
                                    value={bioInput}
                                    onChange={(e) => setBioInput(e.target.value)}
                                    className="w-full bg-black border border-neutral-800 rounded px-3 py-2 pl-8 text-xs font-mono text-neutral-400 focus:text-white focus:border-fluoro-yellow/50 focus:outline-none transition-colors resize-none placeholder:text-neutral-800 leading-relaxed"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Commit Button - Primary Action stays bright */}
                <div className="relative pt-4 border-t border-neutral-900">
                    {isCommitting && (
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-neutral-900 overflow-hidden">
                            <motion.div 
                                className="h-full bg-fluoro-yellow shadow-[0_0_5px_#D2FF00]"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    )}
                    <button 
                        onClick={handleCommit}
                        disabled={isCommitting}
                        className="w-full bg-fluoro-yellow text-black font-bold py-3.5 rounded-xl hover:bg-white transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(210,255,0,0.1)] hover:shadow-[0_0_25px_rgba(210,255,0,0.3)]"
                    >
                        {isCommitting ? (
                            <span className="animate-pulse flex items-center gap-2">
                               <Cpu size={12} className="animate-spin" /> UPLOADING TO MAINFRAME... {uploadProgress}%
                            </span>
                        ) : (
                            <>
                                <Save size={14} className="group-hover:scale-110 transition-transform" /> COMMIT_CONFIGURATION
                            </>
                        )}
                    </button>
                </div>
            </GlowCard>
        </motion.div>

        {/* 2. Security Settings: "Active Defense" */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
            <GlowCard className="h-full rounded-2xl p-6 relative flex flex-col bg-[#0A0A0A]">
                <div className="absolute top-4 right-4 text-[8px] font-mono text-neutral-600 tracking-widest">SEC_ALPHA // DEFENSE</div>
                
                <div className="flex items-center gap-2 mb-8">
                    <Shield size={16} className="text-neutral-500" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Defense</h3>
                </div>

                <div className="space-y-8 flex-1">
                    <div>
                        <div className="flex justify-between items-end mb-3">
                           <span className="text-[9px] font-mono text-neutral-500">ENCRYPTION_PULSE</span>
                           <span className="text-[9px] font-mono text-neutral-400">AES-256-GCM</span>
                        </div>
                        <BiometricPulse />
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-3">
                           <span className="text-[9px] font-mono text-neutral-500">GLOBAL_THREAT_MAP</span>
                           <span className="text-[9px] font-mono text-white flex items-center gap-1">
                             <span className="w-1.5 h-1.5 rounded-full bg-green-900"/> 1 ACTIVE
                           </span>
                        </div>
                        <ThreatMap />
                    </div>
                </div>

                <button className="mt-auto w-full border border-neutral-800 bg-neutral-900/30 text-neutral-500 py-3 rounded-lg hover:bg-red-900/10 hover:text-red-500 hover:border-red-900/30 transition-colors uppercase tracking-widest text-[10px] font-bold flex items-center justify-center gap-2 group">
                    <AlertTriangle size={12} /> SYSTEM_PURGE
                </button>
            </GlowCard>
        </motion.div>

        {/* 3. API Sandbox */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
            <GlowCard className="h-full rounded-2xl p-6 relative bg-[#0A0A0A]">
                <div className="absolute top-4 right-4 text-[8px] font-mono text-neutral-600 tracking-widest">DEV_SANDBOX // API</div>
                
                <div className="flex items-center gap-2 mb-6">
                    <Key size={16} className="text-neutral-500" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">API Telemetry</h3>
                </div>

                <div className="p-3 bg-neutral-900/50 rounded border border-neutral-800 mb-6 group relative overflow-hidden">
                    <div className="text-[9px] font-mono text-neutral-500 mb-1">PK_LIVE_KEY</div>
                    <code className="text-[10px] font-mono text-neutral-400 break-all opacity-50 blur-[3px] group-hover:blur-0 transition-all cursor-crosshair">
                        {formData.apiKey}
                    </code>
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <div className="text-2xl font-bold text-white font-mono flex items-baseline gap-1">
                            842 <span className="text-[10px] text-neutral-500 font-normal">req/s</span>
                        </div>
                        <div className="text-[9px] font-mono text-neutral-500 mt-1">SYSTEM LOAD</div>
                    </div>
                    <TinySparkline data={rpsData} color="#333" />
                </div>
            </GlowCard>
        </motion.div>

        {/* 4. Billing Sandbox */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
             <GlowCard className="h-full rounded-2xl p-6 relative bg-[#0A0A0A]">
                <div className="absolute top-4 right-4 text-[8px] font-mono text-neutral-600 tracking-widest">FIN_MOD // BILLING</div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800 text-neutral-500">
                            <CreditCard size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Pro Subscription</h3>
                            <p className="text-[10px] font-mono text-neutral-500 mt-1 flex items-center gap-1">
                                <span className="w-1 h-1 bg-green-900 rounded-full" /> NEXT_BILLING: 14 DAYS
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 w-full md:w-auto bg-neutral-900/30 p-4 rounded-xl border border-neutral-800">
                        <div>
                            <div className="text-[9px] font-mono text-neutral-500 mb-1 uppercase">Burn Rate (7D)</div>
                            <div className="text-lg font-bold text-white font-mono">$0.42<span className="text-xs text-neutral-600">/hr</span></div>
                        </div>
                        <div className="h-12 w-32 min-w-0 min-h-0 relative">
                             <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={burnData}>
                                    <Line type="step" dataKey="value" stroke="#444" strokeWidth={1} dot={false} strokeOpacity={0.8} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
             </GlowCard>
        </motion.div>

      </div>
    </motion.div>
  );
};