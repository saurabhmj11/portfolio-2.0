import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Zap, Radio, Shield, Cpu, GitBranch, Navigation } from 'lucide-react';
import ScrambleText from './ScrambleText';

interface Agent {
    id: string;
    name: string;
    url: string;
    description: string;
    role: string;
    status: 'ACTIVE' | 'STANDBY' | 'PROCESSING';
    uptime: number; // in hours
    icon: React.ElementType;
    accent: string; // tailwind gradient class
    tasks: number;
}

const agents: Agent[] = [
    {
        id: 'travel-guru',
        name: 'Travel Guru',
        url: 'https://agent.ai/agent/gurutravel',
        description: 'Your personal AI concierge for planning perfect trips with real-time insights.',
        role: 'Travel Assistant',
        status: 'ACTIVE',
        uptime: 2847,
        icon: Navigation,
        accent: 'from-sky-500/20 to-cyan-500/5',
        tasks: 1243,
    },
    {
        id: '90day',
        name: '90-Day Launchpad',
        url: 'https://agent.ai/agent/90day',
        description: 'A focused accelerator agent to help you achieve your startup goals in 3 months.',
        role: 'Goal Accelerator',
        status: 'PROCESSING',
        uptime: 1934,
        icon: Zap,
        accent: 'from-amber-500/20 to-orange-500/5',
        tasks: 874,
    },
    {
        id: 'dudusl001',
        name: 'DuduSL001',
        url: 'https://agent.ai/agent/dudusl001',
        description: 'Experimental custom agent designed for specialized recursive tasks.',
        role: 'Experimental Unit',
        status: 'ACTIVE',
        uptime: 512,
        icon: GitBranch,
        accent: 'from-purple-500/20 to-violet-500/5',
        tasks: 321,
    },
    {
        id: 'agentplan01',
        name: 'Agent Plan 01',
        url: 'https://agent.ai/agent/Agentplan01',
        description: 'Strategic task planner that breaks down complex objectives into actionable steps.',
        role: 'Task Planner',
        status: 'ACTIVE',
        uptime: 3210,
        icon: Shield,
        accent: 'from-emerald-500/20 to-green-500/5',
        tasks: 2190,
    },
    {
        id: 'sl011',
        name: 'S L 011',
        url: 'https://agent.ai/agent/S_L_011',
        description: 'Advanced logic unit capable of handling multi-step reasoning problems.',
        role: 'Logic Unit',
        status: 'STANDBY',
        uptime: 1102,
        icon: Cpu,
        accent: 'from-rose-500/20 to-pink-500/5',
        tasks: 553,
    },
];

// Animated bars that simulate a live signal waveform
const SignalBars = ({ active }: { active: boolean }) => {
    const heights = [3, 7, 12, 5, 16, 8, 4, 11, 6, 14, 9, 3, 7, 13, 5];
    return (
        <div className="flex items-end gap-[2px] h-6">
            {heights.map((h, i) => (
                <motion.div
                    key={i}
                    className={`w-[2px] rounded-full ${active ? 'bg-green-400' : 'bg-white/20'}`}
                    animate={active ? {
                        height: [`${h}px`, `${Math.max(2, h * (0.4 + Math.random() * 0.8))}px`, `${h}px`],
                    } : { height: '3px' }}
                    transition={{
                        duration: 0.6 + i * 0.05,
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: 'easeInOut',
                        delay: i * 0.04,
                    }}
                    style={{ height: `${h}px` }}
                />
            ))}
        </div>
    );
};

const STATUS_COLORS: Record<string, string> = {
    ACTIVE: 'text-green-400 border-green-500/30 bg-green-500/10',
    STANDBY: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
    PROCESSING: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
};

const AgentRow = ({ agent, index }: { agent: Agent; index: number }) => {
    const [hovered, setHovered] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    const Icon = agent.icon;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative group border-b border-white/5"
        >
            {/* Hover flood gradient */}
            <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${agent.accent} pointer-events-none`}
                initial={{ opacity: 0 }}
                animate={{ opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.4 }}
            />

            {/* Left accent bar */}
            <motion.div
                className="absolute left-0 top-0 bottom-0 w-[2px] bg-green-400"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: hovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ originY: 0 }}
            />

            <a
                href={agent.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col md:flex-row md:items-center justify-between px-8 py-7 gap-6 relative z-10"
            >
                {/* Left: Icon + Name block */}
                <div className="flex items-center gap-6 flex-1 min-w-0">
                    {/* Index */}
                    <span className="text-[10px] font-mono text-white/20 w-5 shrink-0 select-none">
                        {String(index + 1).padStart(2, '0')}
                    </span>

                    {/* Icon */}
                    <div className="relative shrink-0">
                        <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors">
                            <Icon className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                        </div>
                        {agent.status === 'ACTIVE' && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border border-black">
                                <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                            </span>
                        )}
                    </div>

                    {/* Name and description */}
                    <div className="min-w-0">
                        <h3 className="text-white font-display font-bold text-xl leading-none tracking-tight mb-1.5 group-hover:text-white transition-colors">
                            {agent.name}
                        </h3>
                        <p className="text-white/40 text-sm leading-snug font-light truncate max-w-xs">
                            {agent.description}
                        </p>
                    </div>
                </div>

                {/* Mid: Signal waveform */}
                <div className="hidden md:flex items-center justify-center w-32 shrink-0">
                    <SignalBars active={agent.status !== 'STANDBY'} />
                </div>

                {/* Right: Stats cluster */}
                <div className="flex items-center gap-8 shrink-0">
                    {/* Status badge */}
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded border ${STATUS_COLORS[agent.status]}`}>
                        {agent.status}
                    </span>

                    {/* Uptime */}
                    <div className="hidden sm:block text-right">
                        <div className="text-white font-mono font-bold text-sm">{agent.uptime.toLocaleString()}h</div>
                        <div className="text-white/30 text-[9px] uppercase tracking-widest font-mono">Uptime</div>
                    </div>

                    {/* Tasks */}
                    <div className="hidden sm:block text-right">
                        <div className="text-white font-mono font-bold text-sm">{agent.tasks.toLocaleString()}</div>
                        <div className="text-white/30 text-[9px] uppercase tracking-widest font-mono">Tasks</div>
                    </div>

                    {/* CTA Arrow */}
                    <motion.div
                        animate={{ x: hovered ? 0 : -4, opacity: hovered ? 1 : 0.3 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                        <ExternalLink className="w-5 h-5 text-white" />
                    </motion.div>
                </div>
            </a>
        </motion.div>
    );
};

// Scrolling marquee ticker for live system stats
const StatsTicker = () => {
    const [latency, setLatency] = useState('1.20');
    useEffect(() => {
        const id = setInterval(() => {
            const v = 1.2 + (Math.random() * 0.2 - 0.1);
            setLatency(v.toFixed(2));
        }, 1400);
        return () => clearInterval(id);
    }, []);

    const items = [
        `NEURAL_UPTIME: 99.97%`,
        `AVG_LATENCY: ${latency}s`,
        `AGENTS_ONLINE: 5`,
        `TASKS_COMPLETED: 5,181+`,
        `SYSTEM: STABLE`,
        `RUNTIME: DISTRIBUTED`,
        `MODEL: GPT-4o / CLAUDE-3.5`,
        `FRAMEWORK: LANGCHAIN`,
    ];

    return (
        <div className="relative overflow-hidden border-y border-white/5 py-3 select-none">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10" />
            <motion.div
                className="flex gap-16 whitespace-nowrap"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
                {[...items, ...items].map((item, i) => (
                    <span key={i} className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] flex items-center gap-4">
                        <Radio className="w-2.5 h-2.5 text-green-400 shrink-0" />
                        {item}
                    </span>
                ))}
            </motion.div>
        </div>
    );
};

const LiveAgents = () => {
    const ref = useRef<HTMLElement>(null);

    return (
        <section ref={ref} className="bg-[#050505] text-white relative z-10 overflow-hidden" id="agents">

            {/* SVG Grid Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                }}
            />

            {/* Radial ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">

                {/* Header Block */}
                <div className="pt-28 pb-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-end border-b border-white/10">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="flex items-center gap-3 mb-8"
                        >
                            <div className="relative flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-400">
                                    <span className="absolute inset-0 rounded-full bg-green-400 animate-ping" />
                                </div>
                                <span className="font-mono text-xs text-green-400 uppercase tracking-[0.4em]">
                                    <ScrambleText text="// NETWORK ONLINE" />
                                </span>
                            </div>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="text-[13vw] md:text-[7vw] font-display font-black leading-[0.85] tracking-tighter uppercase"
                        >
                            Live
                            <br />
                            <span className="text-white/20 italic">Agents</span>
                        </motion.h2>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="flex flex-col justify-end gap-6"
                    >
                        <p className="text-white/40 text-lg leading-relaxed font-light">
                            A constellation of autonomous agents deployed in production, each specializing in a domain — from travel planning to structured reasoning.
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                            <span className="font-mono text-xs text-white/30 uppercase tracking-widest">5 nodes active</span>
                        </div>
                    </motion.div>
                </div>

                {/* Scrolling stats ticker */}
                <div className="py-4">
                    <StatsTicker />
                </div>

                {/* Agent Rows */}
                <div className="pb-28">
                    {agents.map((agent, index) => (
                        <AgentRow key={agent.id} agent={agent} index={index} />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default LiveAgents;
