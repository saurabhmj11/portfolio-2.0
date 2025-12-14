import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Globe, Zap, Cpu } from 'lucide-react';
import { useTerminal } from '../context/TerminalContext';

const SystemHUD = () => {
    const { systemStatus } = useTerminal();
    const [time, setTime] = useState(new Date());
    const [location, setLocation] = useState<string>('LOCATING...');
    const [fps, setFps] = useState(60);

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

    // FPS Counter Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setFps(Math.floor(Math.random() * (60 - 55 + 1) + 55));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

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

                {/* Row 3: Technical Metrics */}
                <div className="flex items-center gap-4 opacity-50">
                    <div className="flex items-center gap-2">
                        <Cpu size={12} />
                        <span>MEM: 128MB</span>
                    </div>
                    <div className="w-[1px] h-3 bg-gray-800" />
                    <span>FPS: {fps}</span>
                    <div className="w-[1px] h-3 bg-gray-800" />
                    <span>v2.0.4</span>
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
