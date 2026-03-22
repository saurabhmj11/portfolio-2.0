import { useState, useEffect } from 'react';
import { Activity, Clock, Cpu, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import ScrambleText from './ScrambleText';
import ScrollReveal from './ScrollReveal';

// Helper to generate sparkline data
const generateSparkline = (length: number, min: number, max: number) => {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min) + min));
};

const TelemetryDashboard = () => {
    const [metrics, setMetrics] = useState({
        requests: 124,
        latency: 245,
        agents: 4,
        tokens: 8540,
        sparklines: {
            reqs: generateSparkline(20, 100, 150),
            lat: generateSparkline(20, 200, 300)
        }
    });

    // Simulate live data feed
    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => {
                const newReqs = Math.floor(Math.random() * 50) + 100;
                const newLat = Math.floor(Math.random() * 80) + 200;

                return {
                    ...prev,
                    requests: newReqs,
                    latency: newLat,
                    tokens: prev.tokens + Math.floor(Math.random() * 50),
                    sparklines: {
                        reqs: [...prev.sparklines.reqs.slice(1), newReqs],
                        lat: [...prev.sparklines.lat.slice(1), newLat]
                    }
                };
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const colorMap: Record<string, { base: string, glow: string, bgText: string, text: string, track: string, fill: string }> = {
        amber: { base: 'border-amber-500/20 hover:border-amber-500/50', glow: 'bg-amber-500/10 group-hover:bg-amber-500/20', bgText: 'bg-amber-500/10 text-amber-400', text: 'text-amber-400', track: 'bg-amber-500/30', fill: 'bg-amber-400' },
        blue: { base: 'border-blue-500/20 hover:border-blue-500/50', glow: 'bg-blue-500/10 group-hover:bg-blue-500/20', bgText: 'bg-blue-500/10 text-blue-400', text: 'text-blue-400', track: 'bg-blue-500/30', fill: 'bg-blue-400' },
        purple: { base: 'border-purple-500/20 hover:border-purple-500/50', glow: 'bg-purple-500/10 group-hover:bg-purple-500/20', bgText: 'bg-purple-500/10 text-purple-400', text: 'text-purple-400', track: 'bg-purple-500/30', fill: 'bg-purple-400' },
        emerald: { base: 'border-emerald-500/20 hover:border-emerald-500/50', glow: 'bg-emerald-500/10 group-hover:bg-emerald-500/20', bgText: 'bg-emerald-500/10 text-emerald-400', text: 'text-emerald-400', track: 'bg-emerald-500/30', fill: 'bg-emerald-400' }
    };

    const MetricCard = ({ title, value, unit, icon: Icon, color, sparkline }: any) => {
        const theme = colorMap[color] || colorMap.blue;
        return (
            <div className={`bg-[#0a0a0a] border rounded-2xl p-6 relative overflow-hidden group transition-colors ${theme.base}`}>
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-colors ${theme.glow}`} />

                <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-lg ${theme.bgText}`}>
                        <Icon size={20} />
                    </div>
                    {sparkline && (
                        <div className="flex items-end gap-[2px] h-8">
                            {sparkline.map((val: number, i: number) => {
                                const max = Math.max(...sparkline);
                                const height = `${(val / max) * 100}%`;
                                return (
                                    <div key={i} className={`w-1.5 rounded-t-sm overflow-hidden ${theme.track}`}>
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height }}
                                            transition={{ duration: 0.5 }}
                                            className={`w-full ${theme.fill}`}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div>
                    <p className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-1">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-display font-bold text-white tracking-tighter">
                            {typeof value === 'number' ? value.toLocaleString() : value}
                        </h3>
                        <span className={`font-mono text-xs uppercase ${theme.text}`}>{unit}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className="py-32 bg-[#020202] relative border-t border-white/5" id="telemetry">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="text-center mb-16">
                    <ScrollReveal>
                        <p className="font-mono text-[10px] text-emerald-500 uppercase tracking-[0.5em] mb-4">
                            <ScrambleText text="// System Analytics" />
                        </p>
                        <h2 className="text-[clamp(2rem,4vw,4rem)] font-display font-black leading-[0.9] tracking-tighter uppercase text-white mb-4">
                            Production<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">
                                Telemetry
                            </span>
                        </h2>
                        <p className="text-gray-400 max-w-lg mx-auto font-mono text-sm leading-relaxed">
                            Real-time observability dashboard monitoring agent execution states, LLM latencies, and vector search performance across deployed systems.
                        </p>
                    </ScrollReveal>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Active Workflows */}
                    <div className="col-span-1 lg:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-gray-500 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    System Status
                                </p>
                                <h3 className="text-xl font-bold text-white mt-2">All Agents Operational</h3>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-xs">
                                    99.99% Uptime
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                            <div>
                                <p className="text-gray-500 text-xs font-mono mb-1">Total DB Size</p>
                                <p className="text-white font-bold">12.4 GB</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-mono mb-1">Index Vectors</p>
                                <p className="text-white font-bold">1.2M</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-mono mb-1">LLM Endpoints</p>
                                <p className="text-white font-bold">4 Active</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-mono mb-1">Region</p>
                                <p className="text-white font-bold">us-east-1</p>
                            </div>
                        </div>
                    </div>

                    <MetricCard
                        title="LLM Latency (TTFT)"
                        value={metrics.latency}
                        unit="ms"
                        icon={Clock}
                        color="amber"
                        sparkline={metrics.sparklines.lat}
                    />

                    <MetricCard
                        title="RAG Traffic"
                        value={metrics.requests}
                        unit="req/m"
                        icon={Activity}
                        color="blue"
                        sparkline={metrics.sparklines.reqs}
                    />

                    <MetricCard
                        title="Tokens Processed"
                        value={metrics.tokens}
                        unit="tokens"
                        icon={Cpu}
                        color="purple"
                    />

                    <MetricCard
                        title="Security Guardrails"
                        value="Active"
                        unit="100% block"
                        icon={ShieldCheck}
                        color="emerald"
                    />
                </div>
            </div>
        </section>
    );
};

export default TelemetryDashboard;
