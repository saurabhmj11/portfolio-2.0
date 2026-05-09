import React, { useRef, Suspense } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import useIsMobile from '../hooks/useIsMobile';
import AIEvolutionOverlay from './AIEvolutionOverlay';

// Lazy load the heavy R3F scene
const AIEvolutionScene = React.lazy(() => import('./AIEvolutionScene'));

// ─── Experience data ────────────────────────────────────────────────────────
const experiences = [
    {
        year: '2024 — Present',
        role: 'Generative AI / LLM Engineer',
        org: 'OneOfficeAutomation',
        desc: 'Designed and deployed production-style AI systems focusing on agent orchestration, retrieval architecture, and scalable AI services.',
        tech: ['LangGraph', 'FastAPI', 'Python', 'RAG'],
        accent: '#3b82f6',
        index: '01',
    },
    {
        year: '2023 — 2024',
        role: 'ML Engineer',
        org: 'Applied Projects',
        desc: 'Built production-grade OCR pipelines and collaborative filtering recommendation engines.',
        tech: ['TensorFlow', 'Scikit-Learn', 'AWS', 'PostgreSQL'],
        accent: '#8b5cf6',
        index: '02',
    },
    {
        year: '2022 — 2023',
        role: 'Data & AI Intern',
        org: 'Pantech Solutions',
        desc: 'Engineered data pipelines and conceptualized early RAG systems for semantic search.',
        tech: ['Pandas', 'Pinecone', 'HuggingFace', 'Docker'],
        accent: '#06b6d4',
        index: '03',
    },
];

// ─── Mobile Timeline Card ────────────────────────────────────────────────────
const MobileCard = ({ exp, i }: { exp: typeof experiences[0]; i: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
    >
        {/* Connector line */}
        <div
            className="absolute left-5 top-0 w-[2px] h-full"
            style={{ background: `linear-gradient(to bottom, ${exp.accent}60, transparent)` }}
        />

        <div className="flex gap-5 items-start">
            {/* Timeline dot */}
            <div className="relative shrink-0 mt-1">
                <span
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-mono font-bold z-10 relative border"
                    style={{ backgroundColor: `${exp.accent}15`, borderColor: `${exp.accent}40`, color: exp.accent }}
                >
                    {exp.index}
                </span>
                {/* Pulse ring */}
                <span
                    className="absolute inset-0 rounded-full animate-ping opacity-20"
                    style={{ backgroundColor: exp.accent }}
                />
            </div>

            {/* Card body */}
            <div
                className="flex-1 mb-10 rounded-2xl border p-5 bg-white/[0.03] backdrop-blur-sm"
                style={{ borderColor: `${exp.accent}20` }}
            >
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-gray-500 block mb-2">
                    {exp.year}
                </span>
                <h3 className="text-xl font-display font-black uppercase tracking-tighter text-white leading-tight mb-1">
                    {exp.role}
                </h3>
                <p className="font-mono text-[10px] tracking-widest text-gray-500 uppercase mb-3">
                    // {exp.org}
                </p>
                <p className="text-sm text-gray-400 font-light leading-relaxed mb-4">
                    {exp.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                    {exp.tech.map((t) => (
                        <span
                            key={t}
                            className="px-2.5 py-1 text-[10px] font-mono tracking-widest uppercase rounded-full border"
                            style={{ borderColor: `${exp.accent}30`, color: exp.accent }}
                        >
                            {t}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    </motion.div>
);

// ─── Mobile Experience Layout ─────────────────────────────────────────────────
const MobileExperience = () => (
    <section id="experience" className="bg-[#020617] text-white w-full overflow-hidden">
        {/* Top gradient fade from previous section */}
        <div className="h-16 bg-gradient-to-b from-transparent to-[#020617]" />

        <div className="px-5 pb-20 max-w-lg mx-auto">

            {/* Section label */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-12"
            >
                <span className="font-mono text-[10px] tracking-[0.35em] text-cyan-400/70 uppercase block mb-4">
                    // CAREER EVOLUTION
                </span>
                <h2 className="text-[clamp(2.8rem,12vw,5rem)] font-display font-black uppercase tracking-tighter leading-[0.85] text-white">
                    Building
                </h2>
                <h2 className="text-[clamp(2.8rem,12vw,5rem)] font-display font-black uppercase tracking-tighter leading-[0.85] text-cyan-400">
                    Intelligence
                </h2>
                <h2 className="text-[clamp(2.8rem,12vw,5rem)] font-display font-black uppercase tracking-tighter leading-[0.85] text-white/20 italic">
                    From Data
                </h2>
            </motion.div>

            {/* Divider */}
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="h-[1px] bg-gradient-to-r from-cyan-500/40 via-blue-500/20 to-transparent mb-12 origin-left"
            />

            {/* Timeline */}
            <div className="relative">
                {experiences.map((exp, i) => (
                    <MobileCard key={exp.index} exp={exp} i={i} />
                ))}
            </div>

            {/* Final statement */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 p-6 rounded-3xl border border-white/10 bg-white/[0.03] text-center"
            >
                <span className="font-mono text-[10px] tracking-[0.3em] text-purple-400/60 uppercase block mb-3">
                    // SYSTEM READY
                </span>
                <p className="text-2xl font-display font-black uppercase tracking-tighter text-white leading-tight">
                    Architecting
                    <span className="block text-purple-400">Intelligent Systems</span>
                </p>
            </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="h-16 bg-gradient-to-b from-[#020617] to-transparent" />
    </section>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Experience = () => {
    const isMobile = useIsMobile();
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // Smooth spring for cinematic interpolation
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 80,
        damping: 30,
        restDelta: 0.001,
    });

    // Render completely different layout on mobile
    if (isMobile) {
        return <MobileExperience />;
    }

    return (
        <section id="experience">
            {/* 600vh tall scroll container — desktop only */}
            <div ref={containerRef} className="relative w-full h-[600vh]">

                {/* Sticky viewport — pinned to screen during scroll */}
                <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#020617]">

                    {/* 3D Scene — Desktop only for performance */}
                    <Suspense fallback={
                        <div className="absolute inset-0 bg-[#020617] flex items-center justify-center">
                            <span className="font-mono text-xs tracking-[0.3em] text-gray-600 uppercase animate-pulse">
                                Initializing Neural Engine...
                            </span>
                        </div>
                    }>
                        <AIEvolutionScene progress={smoothProgress} />
                    </Suspense>

                    {/* HTML Overlay — always rendered */}
                    <AIEvolutionOverlay progress={smoothProgress} />
                </div>
            </div>
        </section>
    );
};

export default Experience;
