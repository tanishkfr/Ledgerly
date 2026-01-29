import React from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlowCard: React.FC<GlowCardProps> = ({ children, className = "", onClick }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Physical Light Physics: Frictionless motion
  const springConfig = { stiffness: 150, damping: 20 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`relative group bg-[#0A0A0A] border border-neutral-900 overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      {/* 
         Physical Light Layer - REFINED
         1. Radius: 300px (maintained for spread).
         2. Opacity: REDUCED to 0.15 (from 0.25) for a subtle backlight.
         3. Strict Border Masking.
      */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition duration-500"
        style={{
           background: useMotionTemplate`
             radial-gradient(
               300px circle at ${springX}px ${springY}px,
               rgba(210, 255, 0, 0.15),
               transparent 60%
             )
           `,
           // Strict Border Masking: Content Box XOR Border Box = Only 1px Border Area
           maskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
           WebkitMaskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
           maskComposite: 'exclude',
           WebkitMaskComposite: 'xor',
           padding: '1px'
        }}
      />
      
      {/* Content Layer */}
      <div className="relative z-30 h-full">
        {children}
      </div>
    </div>
  );
};