import React from 'react';

export const NoiseOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-[9999] h-screen w-screen opacity-[0.035] mix-blend-overlay">
    <svg className="h-full w-full">
      <defs>
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.8" 
            numOctaves="3" 
            stitchTiles="stitch" 
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" className="animate-noise-shift" />
    </svg>
    <style>{`
      @keyframes noiseShift {
        0% { transform: translate(0, 0); }
        10% { transform: translate(-5%, -5%); }
        20% { transform: translate(-10%, 5%); }
        30% { transform: translate(5%, -10%); }
        40% { transform: translate(-5%, 15%); }
        50% { transform: translate(-10%, 5%); }
        60% { transform: translate(15%, 0); }
        70% { transform: translate(0, 10%); }
        80% { transform: translate(-15%, 0); }
        90% { transform: translate(10%, 5%); }
        100% { transform: translate(5%, 0); }
      }
      .animate-noise-shift {
        animation: noiseShift 8s steps(10) infinite;
      }
    `}</style>
  </div>
);