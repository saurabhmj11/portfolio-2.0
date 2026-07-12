import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const steps = [
    {
        num: '01',
        title: 'Deep Discovery',
        tag: 'PROBLEM FRAMING',
        desc: 'Decomposing the problem space before writing a single line of code. Mapping data flows, identifying failure modes, and defining success metrics — architecting the multi-agent orchestration logic for autonomous reasoning systems.',
        accent: '#3b82f6', // blue-500
        gradient: 'from-blue-500/20 to-transparent',
        icon: '◈',
    },
    {
        num: '02',
        title: 'System Design',
        tag: 'ARCHITECTURE',
        desc: 'Architecting for scale and resilience. Designing event-driven pipelines, choosing the right vector store topology, and drawing explicit boundaries between services — building robust infrastructure for high-throughput AI systems.',
        accent: '#8b5cf6', // violet-500
        gradient: 'from-violet-500/20 to-transparent',
        icon: '⬡',
    },
    {
        num: '03',
        title: 'Implementation',
        tag: 'PRECISION ENGINEERING',
        desc: 'Building with deterministic precision. Implementing idempotent logic, hardened RAG retrieval chains, and type-safe API contracts — securing integration points and ensuring multi-tenant data isolation for production backends.',
        accent: '#10b981', // emerald-500
        gradient: 'from-emerald-500/20 to-transparent',
        icon: '◎',
    },
    {
        num: '04',
        title: 'Deployment',
        tag: 'PRODUCTION LAUNCH',
        desc: 'Shipping to production with zero-downtime strategies. Rolling out ML inference engines to edge nodes, configuring observability dashboards, and establishing automated rollback gates — ensuring sub-100ms latency at scale.',
        accent: '#f59e0b', // amber-500
        gradient: 'from-amber-500/20 to-transparent',
        icon: '⊕',
    },
];

const StackedCard = ({ step, index, progress }: { step: any; index: number; progress: any }) => {
    // We want the card to slightly scale down and darken as the next cards stack on top of it.
    // progress is 0 to 1 for the whole section.
    // There are 4 cards, so we can map based on the index.
    const startRange = index * 0.25;
    const endRange = 1;
    
    // Scale and opacity effects for when the NEXT card scrolls over
    const scale = useTransform(progress, [startRange, endRange], [1, 0.9]);
    const opacity = useTransform(progress, [startRange, endRange], [1, 0.4]);

    return (
        <motion.div
            className="sticky w-full max-w-5xl mx-auto rounded-[2rem] border backdrop-blur-xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-center p-8 md:p-16 gap-8 md:gap-16"
            style={{
                top: `calc(15vh + ${index * 40}px)`,
                height: '65vh',
                marginBottom: '10vh',
                backgroundColor: 'rgba(10, 10, 12, 0.7)',
                borderColor: `${step.accent}30`,
                scale,
                opacity,
                transformOrigin: 'top center'
            }}
        >
            {/* Massive Background Number */}
            <div 
                className="absolute -bottom-10 -right-10 text-[15rem] md:text-[25rem] font-display font-black leading-none pointer-events-none z-0"
                style={{ color: `${step.accent}0A` }}
            >
                {step.num}
            </div>

            {/* Glowing Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-50 pointer-events-none z-0`} />

            {/* Content Left */}
            <div className="relative z-10 flex-1 w-full h-full flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                    <span 
                        className="flex items-center justify-center w-10 h-10 rounded-full border text-lg"
                        style={{ borderColor: `${step.accent}50`, color: step.accent, backgroundColor: `${step.accent}10` }}
                    >
                        {step.icon}
                    </span>
                    <span className="font-mono text-xs tracking-[0.2em] uppercase" style={{ color: step.accent }}>
                        {step.tag}
                    </span>
                </div>
                
                <h3 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white mb-6">
                    {step.title}
                </h3>
                
                <p className="text-lg text-white/60 leading-relaxed font-light">
                    {step.desc}
                </p>
            </div>

            {/* Content Right (Visuals) */}
            <div className="relative z-10 hidden md:flex flex-1 w-full h-full items-center justify-center">
                {/* Abstract visualization representation of the step */}
                <div 
                    className="w-full aspect-square rounded-full border border-dashed opacity-20 relative flex items-center justify-center pointer-events-none"
                    style={{ borderColor: step.accent, animation: 'spin 30s linear infinite' }}
                >
                    <div 
                        className="w-2/3 aspect-square rounded-full border border-dotted opacity-40 absolute"
                        style={{ borderColor: step.accent, animation: 'spin 20s linear infinite reverse' }}
                    />
                    <div 
                        className="w-1/3 aspect-square rounded-full border opacity-80 absolute blur-md"
                        style={{ borderColor: step.accent, backgroundColor: step.accent, animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

const Workflow = () => {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <section
            ref={containerRef}
            id="workflow"
            className="w-full bg-[#030712] relative pt-32 pb-48 px-4"
        >
            {/* Header */}
            <div className="text-center mb-24 max-w-3xl mx-auto relative z-20">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30 mb-4">
                    My Process
                </p>
                <h2 className="font-display font-black text-white tracking-tighter leading-none text-5xl md:text-7xl">
                    How I Build
                </h2>
                <p className="mt-6 text-white/50 text-lg md:text-xl max-w-xl mx-auto font-light">
                    A deterministic engineering loop transforming complex requirements into resilient, production-grade AI systems.
                </p>
            </div>

            {/* Sticky Cards Container */}
            <div className="relative w-full pb-[20vh]">
                {steps.map((step, index) => (
                    <StackedCard 
                        key={step.num} 
                        step={step} 
                        index={index} 
                        progress={scrollYProgress} 
                    />
                ))}
            </div>

            {/* Scanlines */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.015] z-0"
                style={{
                    backgroundImage:
                        'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 3px)',
                    backgroundSize: '100% 3px',
                }}
            />
        </section>
    );
};

export default Workflow;

