import React, { useState, useEffect } from 'react';
import { 
    ResponsiveContainer, 
    ComposedChart, 
    Bar, 
    Line, 
    XAxis, 
    YAxis, 
    Tooltip, 
    CartesianGrid, 
    Cell,
    LabelList 
} from 'recharts';
import { AlertCircle } from 'lucide-react';

interface VelocityChartProps {
  data: any[];
  viewMode?: 'TOTAL_VOLUME' | 'NET_BURN';
}

// Custom Cursor for the "Scanning Line" effect
const CustomCursor = (props: any) => {
  const { x, y, width, height, stroke } = props;
  const cx = x + width / 2;
  return (
    <g>
      <line 
        x1={cx} 
        y1={y} 
        x2={cx} 
        y2={y + height} 
        stroke={stroke} 
        strokeWidth={1} 
        strokeDasharray="4 4" 
      />
      <circle cx={cx} cy={y + height} r={3} fill={stroke} />
      <circle cx={cx} cy={y} r={3} fill={stroke} />
    </g>
  );
};

// Precision Detailed Popup
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    const isAnomaly = dataPoint.isAnomaly;
    const isForecast = dataPoint.type === 'FORECAST';

    return (
      <div className="relative bg-black/90 backdrop-blur-md border border-[#D2FF00] p-4 rounded shadow-[0_0_20px_rgba(210,255,0,0.3)] min-w-[160px] z-50 transform -translate-y-2">
         <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                {isForecast ? 'PREDICTION' : label}
            </span>
            <div className={`w-1.5 h-1.5 rounded-full ${isAnomaly ? 'bg-red-500 animate-ping' : 'bg-fluoro-yellow animate-pulse'}`} />
         </div>
         
         {isAnomaly && (
             <div className="mb-2 pb-2 border-b border-white/10">
                 <div className="flex items-center gap-1.5 text-red-500">
                    <AlertCircle size={12} />
                    <span className="text-[9px] font-mono font-bold">SYSTEM_ALERT</span>
                 </div>
                 <div className="text-[8px] font-mono text-neutral-400 mt-0.5">UNUSUAL_BURN_DETECTED</div>
             </div>
         )}

         <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-mono text-fluoro-yellow tracking-wider">
                {isForecast ? 'PROJECTED_VOL' : 'NET_FLOW'}
            </span>
            <span className="text-xl font-bold text-white font-sans tabular-nums">
               ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
         </div>

         {/* Tooltip Arrow */}
         <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black border-r border-b border-[#D2FF00] rotate-45" />
      </div>
    );
  }
  return null;
};

// Custom Anomaly Label Render
const AnomalyLabel = (props: any) => {
    const { x, y, width, value, index, payload } = props;
    // Safety check: payload might be undefined in some Recharts contexts
    if (!payload || !payload.isAnomaly) return null;

    return (
        <g transform={`translate(${x + width / 2 - 8}, ${y - 20})`}>
             <circle cx="8" cy="8" r="4" fill="#ef4444" opacity="0.2" className="animate-pulse" />
             <text x="8" y="11" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">!</text>
             {/* Radial Glow for Industrial Feel */}
             <circle cx="8" cy="8" r="10" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />
        </g>
    );
};

export const VelocityChart: React.FC<VelocityChartProps> = ({ data, viewMode = 'TOTAL_VOLUME' }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Mount Guard to ensure window exists before Recharts calculates dimensions
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    // Size Guard: Min-height ensures the container is never 0px high, even if flex parent collapses
    <div className="w-full h-full min-h-[300px] relative">
        {isMounted ? (
            // 99% Width Hack: Forces Recharts to recalculate properly inside flex containers
            <ResponsiveContainer width="99%" height="100%">
                <ComposedChart
                    data={data}
                    margin={{ top: 20, right: 10, left: -15, bottom: 0 }}
                    onMouseMove={(state: any) => {
                        if (state.isTooltipActive) {
                            setActiveIndex(state.activeTooltipIndex);
                        } else {
                            setActiveIndex(null);
                        }
                    }}
                    onMouseLeave={() => setActiveIndex(null)}
                >
                    <defs>
                      <filter id="neonGlow" height="300%" width="300%" x="-75%" y="-75%">
                        <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <pattern id="diagonalHatch" width="4" height="4" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="0" x2="0" y2="4" style={{stroke:'#D2FF00', strokeWidth:1, opacity: 0.3}} />
                      </pattern>
                    </defs>

                    <CartesianGrid 
                        vertical={false} 
                        stroke="#1A1A1A" 
                        strokeDasharray="3 3" 
                    />
                    
                    <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#666', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
                        axisLine={false}
                        tickLine={false}
                        dy={15}
                        interval="preserveStartEnd"
                    />
                    
                    <YAxis 
                        tick={{ fill: '#666', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                    />
                    
                    <Tooltip 
                        content={<CustomTooltip />}
                        cursor={<CustomCursor stroke="#D2FF00" />}
                        isAnimationActive={false}
                        offset={25}
                        allowEscapeViewBox={{ x: true, y: true }}
                    />

                    {/* Predictive Drift Trendline */}
                    <Line 
                        type="monotone" 
                        dataKey="trendValue" 
                        stroke="#D2FF00" 
                        strokeWidth={1} 
                        strokeDasharray="4 4" 
                        dot={false}
                        activeDot={false}
                        opacity={0.5}
                        animationDuration={2000}
                    />
                    
                    <Bar 
                        dataKey="value" 
                        animationDuration={1500}
                        animationEasing="ease-out"
                    >
                        {data.map((entry, index) => {
                            const isForecast = entry.type === 'FORECAST';
                            const isHovered = activeIndex === index;
                            
                            // Style Logic
                            let fill = '#1A1A1A';
                            let stroke = 'transparent';
                            let opacity = 1;
                            let strokeWidth = 0;

                            if (viewMode === 'NET_BURN') {
                                fill = 'transparent';
                                stroke = '#D2FF00';
                                strokeWidth = 1;
                            } else {
                                // Total Volume Mode
                                fill = isHovered ? '#D2FF00' : '#1A1A1A';
                            }

                            if (isForecast) {
                                opacity = 0.3;
                                fill = 'url(#diagonalHatch)'; // Texture for forecast
                                stroke = '#D2FF00';
                                strokeWidth = 1;
                            }

                            return (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={fill}
                                    stroke={stroke}
                                    strokeWidth={strokeWidth}
                                    fillOpacity={opacity}
                                    filter={isHovered && !isForecast ? "url(#neonGlow)" : ""}
                                    style={{ 
                                        transition: 'all 0.3s ease', 
                                        cursor: 'crosshair'
                                    }}
                                />
                            );
                        })}
                        <LabelList dataKey="value" content={<AnomalyLabel />} />
                    </Bar>
                </ComposedChart>
            </ResponsiveContainer>
        ) : (
             // Placeholder during measuring phase to maintain layout stability
            <div className="w-full h-full flex items-center justify-center bg-neutral-900/10 rounded-lg">
                <span className="text-[10px] font-mono text-neutral-600 animate-pulse">INITIALIZING_METRICS...</span>
            </div>
        )}
    </div>
  );
};