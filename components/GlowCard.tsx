import React from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, HTMLMotionProps } from 'framer-motion';

interface GlowCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlowCard: React.FC<GlowCardProps> = ({ children, className = "", onClick, ...props }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Physics for "Glow Pulse" with natural lag (damping)
  const springConfig = { stiffness: 100, damping: 20 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      // Added hover:z-50 to elevate card on hover, preventing border overlap
      // Used transition-colors instead of transition-all to allow z-index to update instantly without interpolation
      className={`relative group bg-[#0A0A0A] border border-neutral-900 overflow-hidden hover:z-50 transition-colors duration-200 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      // Use box-shadow for border highlight to prevent layout shifts (jitter)
      whileHover={{ scale: 1.01, boxShadow: "0 0 0 1px #D2FF00" }}
      // Smooth visual transition (0.2s) matching spec
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{ willChange: "transform, opacity, box-shadow" }}
      {...props}
    >
      {/* 
         Physical Light Layer
         Radius: 350px for broader spread
         Opacity: 0.15 for subtle, high-end feel
      */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition duration-500"
        style={{
           background: useMotionTemplate`
             radial-gradient(
               350px circle at ${springX}px ${springY}px,
               rgba(210, 255, 0, 0.15),
               transparent 80%
             )
           `,
           // Strict Border Masking
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
    </motion.div>
  );
};