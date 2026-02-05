import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis } from 'recharts';
import { ChartDataPoint } from '../types';
import { formatCurrency } from '../utils';

interface SparklineChartProps {
  data: ChartDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 backdrop-blur-md border border-[#D2FF00]/30 p-2 rounded shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <p className="text-[8px] font-mono text-neutral-500 mb-0.5 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-bold text-fluoro-yellow font-sans tracking-tight">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export const SparklineChart: React.FC<SparklineChartProps> = ({ data }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Prevent render during initial layout calculations
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return <div className="w-full h-full min-h-[150px] bg-neutral-900/10 rounded-lg" />;

  return (
    // Fixed Min-Height Guard
    <div className="w-full h-full min-h-[150px] min-w-0 relative overflow-hidden rounded-lg group">
        {/* 99% Width Hack + Debounce prevents ResizeObserver loop errors */}
        <ResponsiveContainer width="99%" height="100%" debounce={100}>
            <AreaChart data={data}>
            <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D2FF00" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#D2FF00" stopOpacity={0}/>
                </linearGradient>
                <filter id="glow" height="300%" width="300%" x="-75%" y="-75%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
                </filter>
            </defs>
            <XAxis 
                dataKey="name" 
                hide 
            />
            <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ 
                stroke: '#D2FF00', 
                strokeWidth: 1, 
                strokeDasharray: '4 4',
                strokeOpacity: 0.8
                }} 
                isAnimationActive={false}
            />
            <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#D2FF00" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                filter="url(#glow)"
                isAnimationActive={true}
                animationDuration={2000}
                animationEasing="ease-out"
            />
            </AreaChart>
        </ResponsiveContainer>
    </div>
  );
};