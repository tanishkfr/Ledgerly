import React from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  actionElement?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actionElement }) => {
  // Parse Title Logic: "CATEGORY.SUB"
  const [category, sub] = title.includes('.') ? title.split('.') : [title, ''];

  return (
    <div className="relative mb-10 pt-2 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="flex items-center gap-4">
                {/* Vertical Accent Bar */}
                <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="w-[2px] h-12 bg-fluoro-yellow shadow-[0_0_10px_#D2FF00]" 
                />
                
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-none">
                        {category}
                        {sub && <span className="text-fluoro-yellow font-light">.{sub}</span>}
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                         <div className="h-[1px] w-4 bg-neutral-700" />
                         <p className="text-neutral-500 font-mono text-[10px] tracking-[0.2em] uppercase">
                           {subtitle}
                         </p>
                    </div>
                </div>
            </div>

            {/* Optional Action Buttons */}
            {actionElement && (
                <div className="flex items-center gap-3">
                    {actionElement}
                </div>
            )}
        </div>
    </div>
  );
};