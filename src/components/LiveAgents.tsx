import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Bot, Zap, Brain, Rocket, Crosshair, Activity, Cpu, Network } from 'lucide-react';

interface Agent {
    id: string;
    name: string;
    url: string;
    description: string;
    role: string;
    accent: string;
    icon: React.ElementType;
    stats: {
        latency: string;
        successRate: string;
        uptime: string;
    };
}

const agents: Agent[] = [
    {
        id: 'guru',
        name: 'Travel Guru',
        url: 'https://agent.ai/agent/gurutravel',
        description: 'Your personal AI concierge for planning perfect trips with real-time insights and autonomous itinerary generation.',
        role: 'Travel Assistant',
        accent: '#3b82f6', // blue
        icon: Rocket,
        stats: { latency: '24ms', successRate: '99.8%', uptime: '99.99%' }
    },
    {
        id: 'launchpad',
        name: '90-Day Launchpad',
        url: 'https://agent.ai/agent/90day',
        description: 'A focused accelerator agent designed to help you achieve your startup goals in 3 months with structured milestones.',
        role: 'Goal Accelerator',
        accent: '#8b5cf6', // violet
        icon: Zap,
        stats: { latency: '18ms', successRate: '98.5%', uptime: '99.95%' }
    },
    {
        id: 'dudu',
        name: 'DuduSL001',
        url: 'https://agent.ai/agent/dudusl001',
        description: 'Experimental custom agent designed for specialized recursive tasks and complex autonomous tool usage.',
        role: 'Experimental Unit',
        accent: '#f43f5e', // rose
        icon: Brain,
        stats: { latency: '42ms', successRate: '94.2%', uptime: '98.50%' }
    },
    {
        id: 'plan01',
        name: 'Agent Plan 01',
        url: 'https://agent.ai/agent/Agentplan01',
        description: 'Strategic task planner that breaks down complex, ambiguous objectives into actionable, deterministic execution steps.',
        role: 'Task Planner',
        accent: '#10b981', // emerald
        icon: Crosshair,
        stats: { latency: '12ms', successRate: '99.9%', uptime: '99.99%' }
    },
    {
        id: 'sl011',
        name: 'S L 011',
        url: 'https://agent.ai/agent/S_L_011',
        description: 'Advanced logic unit capable of handling multi-step reasoning problems, data extraction, and edge-case validations.',
        role: 'Logic Unit',
        accent: '#f59e0b', // amber
        icon: Bot,
        stats: { latency: '35ms', successRate: '97.4%', uptime: '99.90%' }
    }
];

const LiveAgents = () => {
    const [activeAgentIndex, setActiveAgentIndex] = useState(0);
    const activeAgent = agents[activeAgentIndex];
    const ActiveIcon = activeAgent.icon;

    // Optional: Auto-rotate agents if the user hasn't interacted recently
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveAgentIndex((prev) => (prev + 1) % agents.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="agents" className="min-h-screen bg-[#030712] relative flex flex-col justify-center py-32 px-4 md:px-8 overflow-hidden z-10">
            {/* Ambient Background Glow matching active agent */}
            <motion.div 
                className="absolute inset-0 opacity-10 pointer-events-none transition-colors duration-1000 ease-in-out z-0"
                animate={{ backgroundColor: activeAgent.accent }}
            />
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full blur-[120px] opacity-20 pointer-events-none transition-colors duration-1000 z-0"
                style={{ backgroundColor: activeAgent.accent }}
            />

            <div className="container mx-auto relative z-20">
                {/* Section Header */}
                <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4 text-white/50">
                            <Activity className="w-5 h-5 animate-pulse" style={{ color: activeAgent.accent }} />
                            <span className="font-mono text-xs tracking-[0.3em] uppercase">
                                Production Grid Online
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-white uppercase leading-none">
                            Live<br />Agents
                        </h2>
                    </div>
                    <p className="text-white/40 max-w-sm text-sm md:text-base font-light text-right">
                        Select an autonomous entity from the roster to view its operational parameters and initialize deployment.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    {/* Left Column: Agent Roster */}
                    <div className="lg:col-span-5 flex flex-col gap-2">
                        {agents.map((agent, index) => {
                            const isActive = index === activeAgentIndex;
                            return (
                                <button
                                    key={agent.id}
                                    onMouseEnter={() => setActiveAgentIndex(index)}
                                    onClick={() => setActiveAgentIndex(index)}
                                    className={`relative w-full text-left py-6 px-8 rounded-2xl transition-all duration-500 overflow-hidden group ${
                                        isActive ? 'bg-white/5' : 'hover:bg-white-[0.02]'
                                    }`}
                                >
                                    {/* Active Indicator Line */}
                                    {isActive && (
                                        <motion.div 
                                            layoutId="activeIndicator"
                                            className="absolute left-0 top-0 bottom-0 w-1"
                                            style={{ backgroundColor: agent.accent }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}

                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex flex-col">
                                            <span 
                                                className="font-mono text-[10px] tracking-widest uppercase mb-1 transition-colors duration-300"
                                                style={{ color: isActive ? agent.accent : 'rgba(255,255,255,0.3)' }}
                                            >
                                                UNIT // {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <h3 
                                                className={`text-2xl md:text-4xl font-display font-bold transition-all duration-300 ${
                                                    isActive ? 'text-white translate-x-2' : 'text-white/30 group-hover:text-white/60'
                                                }`}
                                            >
                                                {agent.name}
                                            </h3>
                                        </div>
                                    </div>
                                    
                                    {/* Subtle hover gradient */}
                                    <div 
                                        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                                        style={{ background: `linear-gradient(90deg, ${agent.accent}, transparent)` }}
                                    />
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Column: Active Agent HUD (Heads Up Display) */}
                    <div className="lg:col-span-7 h-full min-h-[500px] relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeAgent.id}
                                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="w-full h-full border border-white/10 rounded-[2rem] bg-black/40 backdrop-blur-xl p-8 md:p-12 relative overflow-hidden flex flex-col justify-between"
                            >
                                {/* HUD Grid Lines */}
                                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                                     style={{
                                         backgroundImage: `linear-gradient(${activeAgent.accent} 1px, transparent 1px), linear-gradient(90deg, ${activeAgent.accent} 1px, transparent 1px)`,
                                         backgroundSize: '40px 40px'
                                     }}
                                />

                                {/* HUD Top Section */}
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div 
                                                className="w-14 h-14 rounded-xl flex items-center justify-center border"
                                                style={{ backgroundColor: `${activeAgent.accent}15`, borderColor: `${activeAgent.accent}40`, color: activeAgent.accent }}
                                            >
                                                <ActiveIcon size={24} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeAgent.accent }} />
                                                    <span className="font-mono text-xs uppercase tracking-wider text-white/70">Status: Online</span>
                                                </div>
                                                <span className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
                                                    ID: {activeAgent.id.toUpperCase()}_OS_V2
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                                        {activeAgent.name}
                                    </h3>
                                    <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed max-w-xl">
                                        {activeAgent.description}
                                    </p>
                                </div>

                                {/* HUD Bottom Section (Stats & Action) */}
                                <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
                                    <div className="grid grid-cols-3 gap-4 mb-8">
                                        <div className="flex flex-col">
                                            <span className="text-white/40 text-xs font-mono uppercase mb-1 flex items-center gap-1">
                                                <Cpu size={12} /> Latency
                                            </span>
                                            <span className="text-white font-mono text-xl" style={{ color: activeAgent.accent }}>{activeAgent.stats.latency}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white/40 text-xs font-mono uppercase mb-1 flex items-center gap-1">
                                                <Crosshair size={12} /> Success Rate
                                            </span>
                                            <span className="text-white font-mono text-xl">{activeAgent.stats.successRate}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white/40 text-xs font-mono uppercase mb-1 flex items-center gap-1">
                                                <Network size={12} /> Uptime
                                            </span>
                                            <span className="text-white font-mono text-xl">{activeAgent.stats.uptime}</span>
                                        </div>
                                    </div>

                                    <a
                                        href={activeAgent.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative w-full flex items-center justify-between px-8 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all overflow-hidden"
                                    >
                                        <div 
                                            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                                            style={{ backgroundColor: activeAgent.accent }}
                                        />
                                        <span className="font-bold uppercase tracking-widest text-sm relative z-10">
                                            Initialize Deployment
                                        </span>
                                        <ExternalLink size={20} className="relative z-10 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </a>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LiveAgents;
