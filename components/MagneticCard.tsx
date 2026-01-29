import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

interface MagneticCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  expanded?: boolean;
}

export const MagneticCard: React.FC<MagneticCardProps> = ({ 
  children, 
  className = "", 
  onClick,
  expanded = false
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Motion values for tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Mouse position for spotlight effect (pixels relative to element)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for heavy, expensive physics feel
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });

  // Subtle rotation range (max 2 degrees) for precision feel
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["2deg", "-2deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-2deg", "2deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || expanded) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    
    mouseX.set(clientX);
    mouseY.set(clientY);

    const xPct = clientX / width - 0.5;
    const yPct = clientY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    mouseX.set(0); // Optional: Reset spotlight or keep last position
    mouseY.set(0);
  };

  // Generate a stable random ID for the UI
  const sysId = React.useMemo(() => `SYS-${Math.floor(Math.random() * 900) + 100}`, []);

  return (
    <motion.div
      ref={ref}
      layout
      whileHover={{ 
        scale: 1.02,
      }}
      style={{
        rotateX: expanded ? 0 : rotateX,
        rotateY: expanded ? 0 : rotateY,
        transformStyle: "preserve-3d",
        perspective: 1200
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 40, damping: 20 }}
      className={`relative group ${className} ${expanded ? 'z-50 cursor-default' : 'cursor-pointer z-0'}`}
    >
      {/* 
         "Glass-Ghost" Border - Spotlight Effect
         Only reveals border when cursor is near
      */}
      <motion.div
        className="absolute inset-0 rounded-2xl z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              150px circle at ${mouseX}px ${mouseY}px,
              rgba(210, 255, 0, 0.5),
              transparent 80%
            )
          `,
          padding: '1px',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
        }}
      />

      {/* Static Subtle Border for visibility when not hovering */}
      <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/5 transition-colors pointer-events-none z-10" />

      {/* Glassmorphism Background - Heavy Blur */}
      <div className="absolute inset-0 rounded-2xl bg-[#0A0A0A]/60 backdrop-blur-2xl transition-all duration-300 z-0" />

      {/* Content Layer */}
      <div className="relative z-30 h-full transform-gpu" style={{ transform: "translateZ(15px)" }}>
         {/* System Metadata Micro-copy */}
         <div className="absolute top-2 right-2 p-2 flex flex-col items-end gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity duration-500 select-none mix-blend-plus-lighter z-50">
            <span className="font-mono text-[7px] text-neutral-500 tracking-[0.2em]">SECURE_ID</span>
            <span className="font-mono text-[7px] text-fluoro-yellow tracking-[0.2em]">{sysId}</span>
         </div>
         {children}
      </div>
    </motion.div>
  );
};