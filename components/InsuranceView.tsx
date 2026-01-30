import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { GlowCard } from './GlowCard';
import { PageHeader } from './PageHeader';
import { ShieldAlert, AlertOctagon, ChevronRight, Fingerprint, Lock, Scan, Radar } from 'lucide-react';

// --- Micro-Components ---

const CoverageHeatbar = () => {
    return (
        <div className="w-full mb-8">
            <div className="flex justify-between items-end mb-1">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">ACTIVE_POLICY_LAYERS</span>
                <span className="text-[9px] font-mono text-fluoro-yellow">SYSTEM_INTEGRITY: 98.4%</span>
            </div>
            <div className="flex gap-1 h-1 w-full">
                {Array.from({ length: 40 }).map((_, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: i > 35 ? 0.3 : 1 }}
                        transition={{ delay: i * 0.02 }}
                        className={`flex-1 rounded-full ${i > 35 ? 'bg-neutral-800' : 'bg-fluoro-yellow'}`}
                    />
                ))}
            </div>
        </div>
    );
};

const AuditPulse = () => {
    const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));
    useEffect(() => {
        const interval = setInterval(() => setTime(new Date().toLocaleTimeString('en-US', { hour12: false })), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-3 bg-neutral-900/50 border border-neutral-800 px-3 py-1.5 rounded-lg">
            <div className="relative w-4 h-4 flex items-center justify-center">
                 <Radar size={16} className="text-fluoro-yellow animate-spin-slow absolute inset-0" />
                 <span className="w-1 h-1 bg-red-500 rounded-full animate-ping" />
            </div>
            <div className="flex flex-col">
                <span className="text-[8px] font-mono text-neutral-500 leading-none mb-0.5">LAST_SCAN</span>
                <span className="text-[10px] font-mono text-white leading-none tracking-widest">{time}_UTC</span>
            </div>
        </div>
    );
};

const Hexagon = ({ active, delay }: { active: boolean, delay: number }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0, z: 0 }}
        animate={{ opacity: 1, scale: 1, z: 0 }}
        whileHover={{ 
            scale: 1.15, 
            z: 50,
            y: -15,
            filter: "brightness(1.5)",
            transition: { duration: 0.3 }
        }}
        transition={{ 
            type: "spring", stiffness: 200, damping: 15, delay 
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-12 h-14 cursor-pointer group"
    >
         <svg viewBox="0 0 100 115" className="w-full h-full drop-shadow-2xl overflow-visible">
             <defs>
                 <filter id="glow-hex">
                     <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                     <feMerge>
                         <feMergeNode in="coloredBlur"/>
                         <feMergeNode in="SourceGraphic"/>
                     </feMerge>
                 </filter>
             </defs>
             <motion.path 
                d="M50 0 L93.3 25 V75 L50 100 L6.7 75 V25 Z" 
                fill={active ? "rgba(210, 255, 0, 0.1)" : "rgba(255, 255, 255, 0.01)"}
                stroke={active ? "#D2FF00" : "#222"}
                strokeWidth={active ? "1.5" : "1"}
                strokeDasharray={active ? "0" : "4 2"}
                className="transition-all duration-300 group-hover:stroke-[3px] group-hover:stroke-[#fff]"
                vectorEffect="non-scaling-stroke"
                filter={active ? "url(#glow-hex)" : ""}
             />
             {active && (
                 <>
                    {/* Inner Circuit */}
                    <path d="M50 20 L50 40" stroke="#D2FF00" strokeWidth="1" opacity="0.5" />
                    <circle cx="50" cy="50" r="4" fill="#D2FF00" className="animate-pulse" />
                 </>
             )}
         </svg>
    </motion.div>
);

const CircuitOverlay = () => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-30">
        <motion.path 
            d="M100 100 L200 150 L300 100" 
            stroke="#D2FF00" strokeWidth="1" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
        <motion.path 
            d="M400 250 L300 200 L400 150" 
            stroke="#D2FF00" strokeWidth="1" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
        />
    </svg>
);

const ThreatVectorLog = () => {
    const logs = [
        "[BLOCKED] // BRUTE_FORCE_DETECTED // 0xAF4...",
        "[MITIGATED] // DDOS_WAVE_14 // PACKET_DROP",
        "[SECURED] // KEY_ROTATION_SUCCESS // NODE_04",
        "[BLOCKED] // SQL_INJECTION_ATTEMPT // 192.168...",
        "[ANALYSIS] // HEURISTIC_SCAN_COMPLETE // CLEAN"
    ];

    return (
        <div className="w-full bg-[#080808] border-t border-neutral-900 p-2 overflow-hidden flex items-center">
            <span className="text-[9px] font-mono text-neutral-500 whitespace-nowrap mr-4 uppercase tracking-widest shrink-0 border-r border-neutral-800 pr-4">Threat_Vector_Log</span>
            <motion.div 
                className="flex gap-12 whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
                {[...logs, ...logs, ...logs].map((log, i) => (
                    <div key={i} className="text-[9px] font-mono text-neutral-600 uppercase flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${log.includes('BLOCKED') ? 'bg-red-500' : 'bg-green-500'}`} />
                        {log}
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

const CoverageShield = () => {
    // Generate a honeycomb grid with staggered animation
    const rows = 3;
    const cols = 6;
    const grid = [];
    
    // Calculate distance from center for staggered delay
    const centerX = (cols - 1) / 2;
    const centerY = (rows - 1) / 2;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const distance = Math.sqrt(Math.pow(c - centerX, 2) + Math.pow(r - centerY, 2));
            grid.push({
                active: Math.random() > 0.3,
                delay: distance * 0.15, // Delay based on distance from center
                r, c
            });
        }
    }

    return (
        <div className="relative w-full h-[350px] bg-[#050505] overflow-hidden flex flex-col rounded-2xl border border-neutral-900 group">
             
             <CircuitOverlay />

             {/* Radar Sweep Animation */}
             <div className="absolute inset-0 z-20 pointer-events-none mix-blend-screen">
                 <div className="w-full h-full animate-[spin_6s_linear_infinite] origin-center bg-[conic-gradient(from_0deg,transparent_0deg,rgba(210,255,0,0.08)_60deg,transparent_60deg)] opacity-100" />
             </div>

             <div className="flex-1 flex items-center justify-center relative z-10 perspective-[1000px]">
                 <div className="grid grid-cols-6 gap-2 rotate-12 scale-125 pb-6" style={{ transformStyle: 'preserve-3d' }}>
                     {grid.map((hex, i) => (
                         <div key={i} className={i % 2 === 0 ? "translate-y-6" : ""}>
                             <Hexagon active={hex.active} delay={hex.delay} />
                         </div>
                     ))}
                 </div>
             </div>
             
             {/* HUD Overlay */}
             <div className="absolute top-4 left-4 z-30">
                 <div className="flex items-center gap-2 mb-1">
                     <ShieldAlert size={16} className="text-fluoro-yellow" />
                     <span className="text-xs font-bold text-white tracking-widest">COVERAGE_MATRIX</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-fluoro-yellow rounded-full animate-pulse" />
                    <div className="text-[9px] font-mono text-neutral-500">NODES_ACTIVE: {grid.filter(g => g.active).length}/{grid.length}</div>
                 </div>
             </div>

             <div className="absolute top-4 right-4 z-30 text-right">
                 <div className="text-[9px] font-mono text-neutral-500 mb-1">INTEGRITY_CHECK</div>
                 <div className="text-2xl font-bold text-white font-mono tracking-tighter">94.2%</div>
             </div>

             {/* Bottom Ticker */}
             <ThreatVectorLog />
        </div>
    );
};

const RiskLog = () => {
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const threats = [
            "SCAN_DETECTED_0x4F... [BLOCKED]",
            "MALFORMED_PACKET_INBOUND...",
            "AUTH_FAILURE_IP_82.14...",
            "PORT_22_PING_REJECTED",
            "SQL_INJECTION_ATTEMPT_NULL",
            "PACKET_LOSS_DETECTED",
            "ENCRYPTION_KEY_ROTATED"
        ];
        
        const interval = setInterval(() => {
            const threat = threats[Math.floor(Math.random() * threats.length)];
            const time = new Date().toLocaleTimeString('en-US', {hour12:false});
            setLogs(prev => [`[${time}] ${threat}`, ...prev.slice(0, 12)]);
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#080808] border-l border-neutral-900 h-full p-4 font-mono text-[9px] relative overflow-hidden flex flex-col">
            
            {/* CRT Scanline */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-10 bg-[linear-gradient(to_bottom,transparent_50%,#000_50%)] bg-[length:100%_2px]" />
            <div 
                className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-b from-transparent via-fluoro-yellow/5 to-transparent h-[20%]"
                style={{ animation: 'scanline 3s linear infinite' }}
            />
            <style>{`
                @keyframes scanline {
                    0% { top: -20%; }
                    100% { top: 120%; }
                }
            `}</style>

            <div className="flex items-center gap-2 mb-4 text-neutral-500 uppercase tracking-widest border-b border-neutral-900 pb-2 relative z-30">
                <AlertOctagon size={12} className="text-fluoro-yellow" /> Global_Hack_Monitor
            </div>
            
            <div className="space-y-1.5 relative z-30 flex-1 overflow-hidden">
                {logs.map((log, i) => (
                    <motion.div 
                        key={`${i}-${log}`}
                        initial={{ opacity: 0, x: -10, filter: 'brightness(2)' }}
                        animate={{ opacity: 1, x: 0, filter: 'brightness(1)' }}
                        className={`truncate ${i === 0 ? 'text-white font-bold' : 'text-neutral-600'}`}
                    >
                        {i === 0 && <span className="inline-block w-1.5 h-1.5 bg-red-500 mr-2 rounded-full animate-pulse" />}
                        {log}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const SlideToConfirm = ({ onConfirm }: { onConfirm: () => void }) => {
    const constraintsRef = useRef(null);
    const x = useMotionValue(0);
    const textOpacity = useTransform(x, [0, 150], [1, 0]);
    const width = useTransform(x, [0, 240], ["0%", "100%"]);
    const [confirmed, setConfirmed] = useState(false);

    const handleDragEnd = () => {
        if (x.get() > 200) {
            setConfirmed(true);
            onConfirm();
        } else {
            // Snap back
            x.set(0); 
        }
    };

    return (
        <div className="w-full h-14 bg-black border border-red-900/30 rounded-xl relative overflow-hidden flex items-center" ref={constraintsRef}>
             {/* Diagonal Warning Stripes */}
             <div className="absolute inset-0 opacity-10 pointer-events-none" 
                  style={{ backgroundImage: 'repeating-linear-gradient(45deg, #7f1d1d 0, #7f1d1d 10px, transparent 10px, transparent 20px)' }} 
             />

             {/* Progress Fill */}
             <motion.div 
                className="absolute left-0 top-0 bottom-0 bg-red-900/40"
                style={{ width }}
             />

             {/* Text Label */}
             <motion.div style={{ opacity: textOpacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                    Slide to Execute Protocol <ChevronRight size={12} className="animate-pulse" />
                 </span>
             </motion.div>

             {/* Success State */}
             {confirmed && (
                 <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="absolute inset-0 flex items-center justify-center bg-red-600 z-20"
                 >
                     <span className="text-black font-bold font-mono tracking-widest flex items-center gap-2">
                         <Lock size={14} /> PROTOCOL_INITIATED
                     </span>
                 </motion.div>
             )}

             {/* Draggable Handle */}
             <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 240 }}
                dragElastic={0.1}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                style={{ x }}
                className="relative z-10 h-10 w-10 ml-2 bg-neutral-900 border border-red-500/50 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:bg-neutral-800 transition-colors"
             >
                 <Fingerprint size={20} className="text-red-500" />
             </motion.div>
        </div>
    );
};

// --- Main View ---

export const InsuranceView: React.FC = () => {
    return (
        <motion.div 
            className="w-full pb-24"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} // Scanline open effect
        >
             <PageHeader 
                title="INSURANCE.RISK_ENCLAVE"
                subtitle="ASSET_PROTECTION_LAYER"
                actionElement={<AuditPulse />}
            />
            
            <CoverageHeatbar />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[500px]">
                
                {/* 1. Main Coverage Visualizer */}
                <div className="lg:col-span-3 h-full flex flex-col gap-6">
                    <CoverageShield />

                    {/* Claim Terminal */}
                    <GlowCard className="flex-1 rounded-2xl p-6 bg-[#0A0A0A] flex flex-col justify-center border border-neutral-800 hover:border-red-900/50 transition-colors group relative overflow-hidden">
                         {/* Faint Background Warning Texture */}
                         <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                         
                         <div className="flex justify-between items-start mb-6 z-10">
                            <div>
                                <div className="text-red-500 font-bold tracking-widest uppercase mb-1 text-[10px] flex items-center gap-2">
                                    <Scan size={12} className="animate-pulse" /> SYSTEM_ALERT
                                </div>
                                <h3 className="text-xl font-bold text-white max-w-md">IN_CASE_OF_EXPLOIT_EXECUTE_PROTOCOL</h3>
                                <p className="text-[10px] font-mono text-neutral-500 mt-2">
                                    This action triggers an immediate asset freeze and notifies the on-chain insurance DAO.
                                </p>
                            </div>
                         </div>
                         
                         <div className="z-10 w-full max-w-md">
                             <SlideToConfirm onConfirm={() => console.log('Protocol Executed')} />
                         </div>
                    </GlowCard>
                </div>

                {/* 2. Risk Telemetry Sidebar */}
                <div className="lg:col-span-1 h-full">
                    <div className="h-full rounded-2xl overflow-hidden border border-neutral-800 bg-[#050505]">
                        <RiskLog />
                    </div>
                </div>

            </div>
        </motion.div>
    );
};