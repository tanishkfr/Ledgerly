import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlowCard } from './GlowCard';
import { PageHeader } from './PageHeader';
import { 
  Users, 
  Clock, 
  Terminal as TerminalIcon,
} from 'lucide-react';

// --- Micro-Components ---

const ParticleStream = ({ pathId, delay = 0 }: { pathId: string, delay?: number }) => (
    <motion.circle 
       r="2" 
       fill="#D2FF00" 
       filter="url(#glow-particle)"
    >
       <animateMotion 
          dur="3s" 
          begin={`${delay}s`}
          repeatCount="indefinite"
          rotate="auto"
       >
          <mpath href={`#${pathId}`} />
       </animateMotion>
    </motion.circle>
);

const GravityChart = () => {
    return (
        <div className="relative w-full h-[300px] flex items-center justify-center overflow-hidden">
            {/* Rotating Force Field Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="w-[500px] h-[500px] rounded-full border border-neutral-800/50 border-dashed opacity-30"
                 />
                 <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute w-[350px] h-[350px] rounded-full border border-neutral-800/30 border-dotted opacity-30"
                 />
            </div>

            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <radialGradient id="gravityGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#D2FF00" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                    <filter id="glow-particle">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                
                <circle cx="50%" cy="50%" r="120" fill="url(#gravityGradient)" />
                
                {/* Connector Paths (Hidden for layout, used by particles) */}
                <path id="path1" d="M180 100 L 50% 50%" stroke="none" />
                <path id="path2" d="M80% 20% L 50% 50%" stroke="none" />
                <path id="path3" d="M70% 80% L 50% 50%" stroke="none" />

                {/* Visible Lines */}
                <line x1="180" y1="100" x2="50%" y2="50%" stroke="#333" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="80%" y1="20%" x2="50%" y2="50%" stroke="#333" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="70%" y1="80%" x2="50%" y2="50%" stroke="#333" strokeWidth="1" strokeDasharray="4 4" />

                {/* Particles */}
                <ParticleStream pathId="path1" delay={0} />
                <ParticleStream pathId="path1" delay={1.5} />
                <ParticleStream pathId="path2" delay={0.5} />
                <ParticleStream pathId="path3" delay={1} />
            </svg>

            {/* Central Node: The Proposal */}
            <motion.div 
                className="relative z-10 w-24 h-24 rounded-full bg-neutral-900 border border-fluoro-yellow flex flex-col items-center justify-center shadow-[0_0_30px_rgba(210,255,0,0.2)]"
                animate={{ y: [0, -5, 0], boxShadow: ["0 0 30px rgba(210,255,0,0.2)", "0 0 50px rgba(210,255,0,0.3)", "0 0 30px rgba(210,255,0,0.2)"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <span className="text-[8px] font-mono text-neutral-500 mb-1">PROP_ID</span>
                <span className="text-xl font-bold text-white font-mono">104</span>
                <div className="absolute -bottom-6 text-[9px] font-mono text-fluoro-yellow flex items-center gap-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-fluoro-yellow animate-pulse" /> ACTIVE
                </div>
            </motion.div>

            {/* Gravity Wells: Voters (Absolute Positions matching paths) */}
            <motion.div 
                className="absolute top-[25%] left-[10%] w-16 h-16 rounded-full bg-[#111] border border-neutral-800 flex items-center justify-center group cursor-pointer hover:border-white transition-colors z-20"
                whileHover={{ scale: 1.1 }}
                style={{ top: 80, left: 150 }} // Approximate to path start M180 100
            >
                <div className="text-center">
                    <div className="text-[8px] font-mono text-neutral-500">WHALE</div>
                    <div className="text-[10px] font-bold text-white">12%</div>
                </div>
            </motion.div>

            <motion.div 
                className="absolute top-[15%] right-[15%] w-12 h-12 rounded-full bg-[#111] border border-neutral-800 flex items-center justify-center group cursor-pointer hover:border-white transition-colors z-20"
                whileHover={{ scale: 1.1 }}
            >
                 <div className="text-[9px] font-bold text-white">5%</div>
            </motion.div>

             <motion.div 
                className="absolute bottom-[15%] right-[25%] w-20 h-20 rounded-full bg-[#111] border border-neutral-800 flex items-center justify-center group cursor-pointer hover:border-white transition-colors z-20"
                whileHover={{ scale: 1.1 }}
            >
                 <div className="text-center">
                    <div className="text-[8px] font-mono text-neutral-500">DAO_POOL</div>
                    <div className="text-[10px] font-bold text-white">24%</div>
                </div>
            </motion.div>
        </div>
    );
};

const DoomsdayClock = ({ time }: { time: string }) => (
    <div className="flex items-center gap-2 font-mono text-[10px] text-fluoro-yellow bg-black px-3 py-1.5 rounded border border-neutral-800 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
        <Clock size={10} className="animate-pulse" />
        <span className="tracking-widest" style={{ textShadow: '0 0 5px rgba(210,255,0,0.5)' }}>{time}</span>
    </div>
);

const ProposalCard = ({ id, title, votes, time, status }: { id: string, title: string, votes: number, time: string, status: string }) => (
    <motion.div 
        whileHover={{ x: 5, borderColor: 'rgba(210, 255, 0, 0.3)' }}
        className="group border border-neutral-800 bg-[#0A0A0A] p-4 rounded-xl mb-3 cursor-pointer transition-all relative overflow-hidden"
    >
        <div className="flex justify-between items-start mb-3 relative z-10">
            <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-neutral-900 text-[9px] font-mono text-neutral-400 rounded border border-neutral-800">#{id}</span>
                {status === 'ACTIVE' && <span className="w-1.5 h-1.5 rounded-full bg-fluoro-yellow animate-pulse shadow-[0_0_5px_#D2FF00]" />}
                <span className={`text-[9px] font-mono uppercase font-bold ${status === 'ACTIVE' ? 'text-white' : 'text-neutral-500'}`}>{status}</span>
            </div>
            <DoomsdayClock time={time} />
        </div>
        
        <h3 className="text-sm font-bold text-white mb-4 group-hover:text-fluoro-yellow transition-colors font-sans relative z-10">{title}</h3>
        
        <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden mb-2 relative z-10">
            <motion.div 
                className="h-full bg-white relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: `${votes}%` }}
                transition={{ duration: 1.5 }}
            >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-[50%] skew-x-12 animate-[shimmer_2s_infinite]" />
                <style>{`
                    @keyframes shimmer {
                        0% { transform: translateX(-150%); }
                        100% { transform: translateX(250%); }
                    }
                `}</style>
            </motion.div>
        </div>
        <div className="flex justify-between text-[9px] font-mono text-neutral-500 relative z-10">
            <span>QUORUM_REACHED</span>
            <span>{votes}% YES</span>
        </div>
    </motion.div>
);

const VoteTerminal = () => {
    const [input, setInput] = useState('');
    const [log, setLog] = useState<string>('');
    const [bootText, setBootText] = useState('');
    const bootSequence = "> INITIALIZING VOTE PROTOCOL...\n> SECURE CONNECTION ESTABLISHED.\n> READY FOR INPUT.";

    // Boot Effect
    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setBootText(bootSequence.slice(0, i));
            i++;
            if (i > bootSequence.length) clearInterval(interval);
        }, 30);
        return () => clearInterval(interval);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (input.trim() === 'COMMIT_VOTE --YES' || input.trim() === 'COMMIT_VOTE --NO') {
                setLog(`> HASH_SIGNED: 0x${Math.random().toString(16).substr(2, 8).toUpperCase()} [CONFIRMED]`);
            } else {
                setLog('> ERROR: INVALID SYNTAX. USE: COMMIT_VOTE --YES | --NO');
            }
            setInput('');
        }
    };

    return (
        <div className="bg-[#050505] border border-neutral-800 rounded-xl p-6 font-mono text-xs shadow-2xl">
            <div className="flex items-center gap-2 text-neutral-500 mb-4 border-b border-neutral-900 pb-2">
                <TerminalIcon size={12} className="text-fluoro-yellow" />
                <span className="text-[9px] tracking-widest uppercase">DIRECT_VOTING_INTERFACE</span>
            </div>
            
            <div className="min-h-[80px] mb-2 text-neutral-400 whitespace-pre-wrap leading-relaxed">
                {bootText}
                <div className="text-fluoro-yellow mt-2">{log}</div>
            </div>

            <div className="flex items-center gap-2 mt-4 bg-neutral-900/30 p-2 rounded border border-neutral-800/50">
                <span className="text-fluoro-yellow">root@governance:~$</span>
                <div className="flex-1 relative">
                    <input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-transparent border-none outline-none text-white uppercase placeholder:text-neutral-700 caret-transparent"
                        autoFocus
                    />
                    {/* Custom Block Cursor */}
                    <motion.div 
                        className="absolute top-0 bottom-0 bg-fluoro-yellow w-2.5 opacity-50 pointer-events-none"
                        style={{ left: `${input.length * 7.2}px` }} // Approx char width
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                    />
                </div>
            </div>
            <div className="mt-2 text-[8px] text-neutral-600">
                TYPE 'COMMIT_VOTE --YES' OR 'COMMIT_VOTE --NO' TO EXECUTE
            </div>
        </div>
    );
};

// --- Main View ---

export const GovernanceView: React.FC = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full pb-24">
            <PageHeader 
                title="GOVERNANCE.DIRECTIVES"
                subtitle="DAO_CONSENSUS_LAYER"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 1. Gravity Chart (Visual Centerpiece) */}
                <div className="lg:col-span-8">
                    <GlowCard className="h-full rounded-2xl p-0 bg-[#080808] overflow-hidden">
                        <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#0A0A0A] relative z-20">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <Users size={14} className="text-fluoro-yellow" /> Weight Distribution
                            </h3>
                            <div className="text-[9px] font-mono text-neutral-500">LIVE_WEIGHT: 4.2M TOKENS</div>
                        </div>
                        <GravityChart />
                    </GlowCard>
                </div>

                {/* 2. Proposal Feed */}
                <div className="lg:col-span-4 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest">Active Directives</h3>
                        <div className="w-1.5 h-1.5 bg-fluoro-yellow animate-pulse rounded-full" />
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <ProposalCard 
                            id="104"
                            title="Protocol Upgrade: V3 Liquidity Migration"
                            votes={84}
                            time="02:14:55"
                            status="ACTIVE"
                        />
                        <ProposalCard 
                            id="103"
                            title="Treasury Allocation: Q4 Marketing"
                            votes={45}
                            time="14:00:00"
                            status="PENDING"
                        />
                         <ProposalCard 
                            id="102"
                            title="Emergency Patch: Security Module"
                            votes={98}
                            time="00:00:00"
                            status="EXECUTED"
                        />
                    </div>
                </div>

                {/* 3. Commit Terminal (Voting Mechanism) */}
                <div className="lg:col-span-12">
                    <VoteTerminal />
                </div>
            </div>
        </div>
    );
};