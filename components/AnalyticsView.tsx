import React, { useState, useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import { FinancialSummary } from '../types';
import { VelocityChart } from './VelocityChart';
import { generateMockChartData, getDateLabels } from '../utils';
import { TrendingUp, Activity, Zap, BarChart2, AlertCircle } from 'lucide-react';
import { GlowCard } from './GlowCard';
import { PageHeader } from './PageHeader';

interface AnalyticsViewProps {
  data: FinancialSummary;
}

type TimeRange = '1D' | '1W' | '1M' | '1Y' | 'ALL';
type ViewMode = 'TOTAL_VOLUME' | 'NET_BURN';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const KPICard = ({ title, value, sub, icon: Icon }: { title: string, value: string, sub: string, icon: any }) => (
  <motion.div variants={itemVariants} className="h-full">
      <GlowCard className="rounded-2xl p-6 relative group h-full">
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
        <Icon size={40} className="text-neutral-500" />
        </div>
        <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-3 bg-fluoro-yellow rounded-sm" />
            <h3 className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase">{title}</h3>
        </div>
        <div className="text-3xl font-bold text-white tracking-tight mb-2">
            {value}
        </div>
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-fluoro-yellow bg-fluoro-yellow/10 px-1.5 py-0.5 rounded border border-fluoro-yellow/20">
                {sub}
            </span>
        </div>
        </div>
    </GlowCard>
  </motion.div>
);

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ data }) => {
  const [range, setRange] = useState<TimeRange>('1W');
  const [viewMode, setViewMode] = useState<ViewMode>('TOTAL_VOLUME');

  // Derive data based on time range using memoization for performance
  const chartData = useMemo(() => {
    let rawData = [];
    
    if (range === '1W') {
      rawData = data.cashFlowData;
    } else {
      let points = 7;
      if (range === '1D') points = 24;
      if (range === '1M') points = 30;
      if (range === '1Y') points = 12;
      if (range === 'ALL') points = 50;

      rawData = generateMockChartData(points, 3000, data.totalBalance / 8).map((item, i) => ({
        ...item,
        name: getDateLabels(range)[i % getDateLabels(range).length]
      }));
    }

    // 1. Calculate Mean for Anomaly Detection
    const total = rawData.reduce((acc, curr) => acc + curr.value, 0);
    const mean = total / rawData.length;

    // 2. Process Actual Data with Anomalies
    const processedActuals = rawData.map(d => ({
        ...d,
        type: 'ACTUAL',
        // Flag if >20% below mean
        isAnomaly: d.value < (mean * 0.8),
        trendValue: d.value
    }));

    // 3. Generate 3 "Phantom" Forecast Bars
    const lastValue = processedActuals[processedActuals.length - 1].value;
    const forecastData = Array.from({ length: 3 }).map((_, i) => {
        // Subtle drift calculation
        const drift = lastValue * (1 + (Math.random() * 0.15 - 0.05) * (i + 1)); 
        return {
            name: `FCST ${i + 1}`,
            value: drift,
            type: 'FORECAST',
            isAnomaly: false,
            trendValue: drift
        };
    });

    return [...processedActuals, ...forecastData];
  }, [range, data]);

  return (
    <motion.div 
      className="w-full pb-24 isolate"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      
      <PageHeader 
        title="DATA.ANALYTICS"
        subtitle="PREDICTIVE_INTELLIGENCE"
      />

      {/* Bento Grid Layout */}
      <div className="flex flex-col gap-6 isolate">
        
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 isolate">
           <KPICard 
              title="LIQUIDITY_INDEX" 
              value="94.2%" 
              sub="OPTIMAL_RANGE" 
              icon={Activity} 
           />
           <KPICard 
              title="BURN_RATE" 
              value="$142.50/day" 
              sub="-12% VS LAST MONTH" 
              icon={Zap} 
           />
           <KPICard 
              title="FORECAST_YIELD" 
              value="+$4,200" 
              sub="PROJECTED EOM" 
              icon={TrendingUp} 
           />
        </div>

        {/* Main Chart Container */}
        <motion.div variants={itemVariants}>
           <GlowCard className="rounded-2xl p-6 relative">
                {/* Chart Header & Controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800">
                            <BarChart2 size={16} className="text-fluoro-yellow" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">CASH_FLOW_VELOCITY</h3>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Predictive Model Active</span>
                            </div>
                        </div>

                        {/* View Mode Segmented Control */}
                        <div className="hidden md:flex bg-neutral-900/50 p-0.5 rounded-lg border border-neutral-800 ml-4">
                            {(['TOTAL_VOLUME', 'NET_BURN'] as ViewMode[]).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`px-3 py-1.5 rounded-md text-[9px] font-mono font-bold transition-all duration-300 ${
                                        viewMode === mode
                                            ? 'bg-neutral-800 text-white shadow-sm'
                                            : 'text-neutral-500 hover:text-neutral-300'
                                    }`}
                                >
                                    {mode.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time Range Toggles */}
                    <div className="bg-neutral-900/50 p-1 rounded-lg border border-neutral-800 flex gap-1">
                        {(['1D', '1W', '1M', '1Y', 'ALL'] as TimeRange[]).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-4 py-1.5 rounded-md text-[10px] font-mono font-bold transition-all duration-300 ${
                            range === r 
                                ? 'text-black bg-fluoro-yellow shadow-[0_0_15px_rgba(210,255,0,0.3)]' 
                                : 'text-neutral-500 hover:text-white hover:bg-neutral-800'
                            }`}
                        >
                            {r}
                        </button>
                        ))}
                    </div>
                </div>

                {/* Fixed Height Chart Area - Wrapped as Requested */}
                <div className="h-[450px] min-h-0 w-full relative z-10">
                    <VelocityChart data={chartData} viewMode={viewMode} />
                </div>

                {/* Background Decoration */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                    style={{ 
                        backgroundImage: 'linear-gradient(0deg, transparent 24%, #333 25%, #333 26%, transparent 27%, transparent 74%, #333 75%, #333 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #333 25%, #333 26%, transparent 27%, transparent 74%, #333 75%, #333 76%, transparent 77%, transparent)',
                        backgroundSize: '50px 50px'
                    }} 
                />
           </GlowCard>
        </motion.div>
      </div>
    </motion.div>
  );
};