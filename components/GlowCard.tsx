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

  // NOTE: overflow-hidden removed from outer div to prevent outline/shadow clipping.
  // Clipping is moved to inner divs.
  return (
    <motion.div
      className={`relative group bg-[#0A0A0A] border border-neutral-900 hover:z-50 transition-colors duration-200 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      whileHover={{ 
        scale: 1.01, 
        outline: "1px solid #D2FF00", 
        boxShadow: "inset 0 0 10px rgba(210, 255, 0, 0.2)" 
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{ 
        outlineOffset: '-1px', 
        willChange: "transform, opacity, outline, box-shadow" 
      }}
      {...props}
    >
      {/* 
         Physical Light Layer
         Radius: 350px for broader spread
         Opacity: 0.15 for subtle, high-end feel
         Wrapped in overflow-hidden to contain the effect within borders
      */}
      <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none">
        <motion.div
            className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition duration-500"
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
      </div>
      
      {/* Content Layer - also clipped to respect rounded corners */}
      <div className="relative z-30 h-full rounded-[inherit] overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
};