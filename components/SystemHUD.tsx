import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Globe, Zap, Cpu } from 'lucide-react';
import { useTerminal } from '../context/TerminalContext';
import usePerformance from '../hooks/usePerformance';

const SystemHUD = () => {
    const { systemStatus } = useTerminal();
    const [time, setTime] = useState(new Date());
    const [location, setLocation] = useState<string>('LOCATING...');
    const { fps, memory, fpsHistory } = usePerformance();

    // Clock
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Location (Simulated for aesthetics if real geolocation fails or is slow)
    useEffect(() => {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setLocation(userTimeZone.split('/')[1]?.toUpperCase().replace('_', ' ') || 'UNKNOWN SECTOR');
    }, []);

    // Generate Sparkline Path
    const generateSparkline = (data: number[]) => {
        const width = 100;
        const height = 20;
        const max = 65; // Cap at 65 for scaling
        const min = 30; // Floor at 30

        const points = data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            // Normalize y
            const normalized = Math.max(0, Math.min(1, (val - min) / (max - min)));
            const y = height - (normalized * height);
            return `${x},${y}`;
        }).join(' ');

        return `M0,${height} ${points} L${width},${height} Z`; // Closed path for fill if needed, or open for stroke
    };

    // Line only path
    const getPolyline = (data: number[]) => {
        const width = 100;
        const height = 15;
        const max = 65;
        const min = 30;

        return data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const normalized = Math.max(0, Math.min(1, (val - min) / (max - min)));
            const y = height - (normalized * height);
            return `${x},${y}`;
        }).join(' ');
    }

    return (
        <>
            {/* Desktop HUD */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="fixed bottom-8 left-8 z-40 hidden md:flex flex-col gap-4 font-mono text-[10px] text-gray-500 pointer-events-none select-none"
            >
                {/* Row 1: System Status */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Activity size={12} className={systemStatus === 'PROCESSING' ? 'animate-pulse text-green-400' : ''} />
                        <span>SYS: {systemStatus}</span>
                    </div>
                    <div className="w-[1px] h-3 bg-gray-800" />
                    <div className="flex items-center gap-2">
                        <Zap size={12} className="text-yellow-500" />
                        <span>PWR: 98%</span>
                    </div>
                </div>

                {/* Row 2: Location & Time */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Globe size={12} />
                        <span>{location}</span>
                    </div>
                    <div className="w-[1px] h-3 bg-gray-800" />
                    <span>
                        {time.toLocaleTimeString('en-US', { hour12: false })}
                    </span>
                </div>

                {/* Row 3: Technical Metrics & Graph */}
                <div className="flex items-center gap-4 opacity-70">
                    <div className="flex items-center gap-2 min-w-[80px]">
                        <Cpu size={12} />
                        <span>MEM: {memory ? `${memory.used}MB` : 'N/A'}</span>
                    </div>
                    <div className="w-[1px] h-3 bg-gray-800" />
                    <div className="flex items-center gap-2">
                        <span>FPS: {fps}</span>
                        {/* Sparkline Graph */}
                        <div className="w-[60px] h-[15px] relative overflow-hidden">
                            <svg width="100%" height="100%" viewBox="0 0 100 15" preserveAspectRatio="none">
                                <polyline
                                    points={getPolyline(fpsHistory)}
                                    fill="none"
                                    stroke={fps > 50 ? '#4ade80' : 'red'}
                                    strokeWidth="1.5"
                                    vectorEffect="non-scaling-stroke"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="w-[1px] h-3 bg-gray-800" />
                    <span>v2.1.0</span>
                </div>

                {/* Decorative Lines */}
                <svg width="200" height="20" className="opacity-20">
                    <path d="M0 10 H20 L25 15 H100" stroke="currentColor" fill="none" strokeWidth="1" />
                    <rect x="0" y="0" width="2" height="2" fill="currentColor" />
                    <rect x="198" y="0" width="2" height="2" fill="currentColor" />
                </svg>
            </motion.div>

            {/* Mobile HUD (Compact) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="fixed bottom-4 left-4 z-40 flex md:hidden flex-col gap-1 font-mono text-[10px] text-gray-500 pointer-events-none select-none"
            >
                <div className="flex items-center gap-2">
                    <Activity size={10} className={systemStatus === 'PROCESSING' ? 'animate-pulse text-green-400' : ''} />
                    <span>{systemStatus}</span>
                </div>
                <div className="flex items-center gap-2 opacity-70">
                    <span>{time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
                    <span>v2.0</span>
                </div>
            </motion.div>
        </>
    );
};

export default SystemHUD;
