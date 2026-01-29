import React from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  actionElement?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actionElement }) => {
  // Logic: Split title by '.' to handle CATEGORY.SUB_PATH coloring
  const [category, sub] = title.includes('.') ? title.split('.') : [title, ''];

  return (
    <div className="relative w-full flex flex-col md:flex-row justify-between items-end gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center">
            {/* Vertical Accent Bar (2px #D2FF00) */}
            <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: '3rem', opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "circOut" }}
                className="w-[2px] bg-fluoro-yellow shadow-[0_0_15px_rgba(210,255,0,0.6)] mr-6" 
            />
            
            <div>
                {/* Title: Bold Monospace */}
                <h1 className="text-3xl md:text-4xl font-mono font-bold tracking-tighter text-white uppercase leading-none">
                    {category}
                    {sub && <span className="text-fluoro-yellow">.{sub}</span>}
                </h1>
                
                {/* Subtitle: 10px Muted Gray Metadata */}
                <div className="flex items-center gap-3 mt-2">
                     <p className="text-neutral-500 font-mono text-[10px] tracking-[0.2em] uppercase">
                       {subtitle}
                     </p>
                     {/* Decorative connector */}
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: 40 }}
                       transition={{ delay: 0.5, duration: 0.5 }}
                       className="h-[1px] bg-neutral-800" 
                     />
                </div>
            </div>
        </div>

        {/* Action Buttons / Utility Area */}
        {actionElement && (
            <div className="flex items-center gap-3 mb-1">
                {actionElement}
            </div>
        )}
    </div>
  );
};