import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Activity, Server, Cpu } from 'lucide-react';
import ScrambleText from './ScrambleText';

const LiveStatus = () => {
    const statsRef = useRef<HTMLDivElement>(null);
    const [latency, setLatency] = useState("1.20");

    useEffect(() => {
        // Mocks live data updates for task count
        const ctx = gsap.context(() => {
            const values = document.querySelectorAll('.stat-task-value');

            values.forEach((val) => {
                gsap.to(val, {
                    innerHTML: '+=15', // Random increment
                    snap: { innerHTML: 1 },
                    repeat: -1,
                    duration: 2,
                    yoyo: true,
                    ease: "power1.inOut",
                    modifiers: {
                        innerHTML: (v: any) => `${Math.round(parseFloat(v))}`
                    }
                });
            });

            // Pulse effect for status indicator
            gsap.to('.status-dot', {
                opacity: 0.2,
                duration: 1,
                repeat: -1,
                yoyo: true
            });

        }, statsRef);

        // Simulated High-Precision Latency Fluctuation (looks like a live connection graph)
        const latencyInterval = setInterval(() => {
            // Randomly fluctuate between 1.15 and 1.35
            const base = 1.20;
            const fluctuation = (Math.random() * 0.2) - 0.1;
            setLatency((base + fluctuation).toFixed(2));
        }, 1200);

        return () => {
            ctx.revert();
            clearInterval(latencyInterval);
        }
    }, []);

    return (
        <div ref={statsRef} className="w-full bg-white/5 border border-white/10 rounded-xl p-6 mb-12 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-3 h-3 bg-green-500 rounded-full status-dot" />
                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                    </div>
                    <span className="font-mono text-sm text-green-400 tracking-widest uppercase">
                        <ScrambleText text="SYSTEM STABLE" className="" />
                    </span>
                </div>

                {/* Stats Grid */}
                <div className="flex items-center justify-between w-full md:w-auto gap-8 md:gap-16">
                    <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-gray-500" />
                        <div>
                            <div className="text-xl font-bold font-mono text-white flex transition-all duration-300">
                                <span>{latency}</span>s
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Avg Latency</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Server className="w-5 h-5 text-gray-500" />
                        <div>
                            <div className="text-xl font-bold font-mono text-white flex">
                                <span className="stat-task-value">1243</span>+
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Tasks Completed</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Cpu className="w-5 h-5 text-gray-500" />
                        <div>
                            <div className="text-xl font-bold font-mono text-white flex">
                                <ScrambleText text="5" className="" />
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Active Agents</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveStatus;
