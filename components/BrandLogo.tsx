import React from 'react';
import { motion, Variants } from 'framer-motion';

interface BrandLogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
  color?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = "", 
  size = 40, 
  animated = false,
  color = "#D2FF00"
}) => {
  // Geometric "L" Construction:
  // Wrapped in a fixed-size container to ensure Tier 1 header stability.
  const pathVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 1.5, 
        ease: "easeInOut",
        delay: 0.2
      }
    }
  };

  return (
    <div 
      className={`relative flex items-center justify-center ${className}`} 
      style={{ width: size, height: size }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        <motion.path
          d="M28 20 L28 72 L80 20"
          stroke={color}
          strokeWidth="10" 
          strokeLinecap="square"
          strokeLinejoin="miter"
          variants={animated ? pathVariants : undefined}
          initial={animated ? "hidden" : undefined}
          animate={animated ? "visible" : undefined}
        />
      </svg>
    </div>
  );
};