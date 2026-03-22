import { motion, useTransform, MotionValue } from 'framer-motion';
import ScrambleText from './ScrambleText';
import Magnetic from './Magnetic';

// ── Experience data ────────────────────────────────────────────────────────
const experiences = [
    {
        year: '2024 — Present',
        role: 'Generative AI / LLM Engineer',
        org: 'OneOfficeAutomation',
        desc: 'Designed and deployed production-style AI systems focusing on agent orchestration, retrieval architecture, and scalable AI services.',
        tech: ['LangGraph', 'FastAPI', 'Python', 'RAG'],
        accent: '#3b82f6',
    },
    {
        year: '2023 — 2024',
        role: 'ML Engineer',
        org: 'Applied Projects',
        desc: 'Built production-grade OCR pipelines and collaborative filtering recommendation engines.',
        tech: ['TensorFlow', 'Scikit-Learn', 'AWS', 'PostgreSQL'],
        accent: '#8b5cf6',
    },
    {
        year: '2022 — 2023',
        role: 'Data & AI Intern',
        org: 'Pantech Solutions',
        desc: 'Engineered data pipelines and conceptualized early RAG systems for semantic search.',
        tech: ['Pandas', 'Pinecone', 'HuggingFace', 'Docker'],
        accent: '#06b6d4',
    },
];

// ── Glass Card ─────────────────────────────────────────────────────────────
const GlassCard = ({ exp, index, progress }: {
    exp: typeof experiences[0];
    index: number;
    progress: MotionValue<number>;
}) => {
    // Each card appears staggered within the Scene 3 window (0.40–0.60)
    const start = 0.40 + index * 0.05;
    const end = start + 0.08;

    const opacity = useTransform(progress, [start, end, 0.62, 0.68], [0, 1, 1, 0]);
    const x = useTransform(progress, [start, end], [-60, 0]);
    const scale = useTransform(progress, [start, end], [0.95, 1]);

    return (
        <motion.div
            style={{ opacity, x, scale }}
            className="relative p-[1px] rounded-2xl overflow-hidden mb-4 pointer-events-auto"
        >
            {/* Gradient border */}
            <div
                className="absolute inset-0 rounded-2xl opacity-60"
                style={{
                    background: `linear-gradient(135deg, ${exp.accent}50, transparent 50%, transparent 70%, ${exp.accent}30)`,
                }}
            />

            {/* Card body */}
            <div className="relative rounded-2xl bg-black/70 backdrop-blur-2xl p-6 md:p-8 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] tracking-[0.3em] text-gray-500 uppercase">
                        {exp.year}
                    </span>
                    <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: exp.accent }}
                    />
                </div>

                <h4 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tighter text-white leading-[0.9] mb-1">
                    {exp.role}
                </h4>
                <p className="font-mono text-xs tracking-widest text-gray-500 uppercase mb-4">
                    // {exp.org}
                </p>
                <p className="text-sm text-gray-300 font-light leading-relaxed mb-5">
                    {exp.desc}
                </p>

                <div className="flex flex-wrap gap-2">
                    {exp.tech.map((tech, i) => (
                        <Magnetic key={i}>
                            <span
                                className="px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase rounded-full border transition-colors duration-300 hover:bg-white/5"
                                style={{ borderColor: `${exp.accent}40`, color: exp.accent }}
                            >
                                {tech}
                            </span>
                        </Magnetic>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

// ── Main Overlay ───────────────────────────────────────────────────────────
const AIEvolutionOverlay = ({ progress }: { progress: MotionValue<number> }) => {

    // ─ Scene 1: "Building Intelligence From Data" (0.00–0.20)
    const s1Opacity = useTransform(progress, [0.02, 0.08, 0.16, 0.20], [0, 1, 1, 0]);
    const s1Y = useTransform(progress, [0.02, 0.08], [30, 0]);

    // ─ Scene 2: "Learning Patterns / Building Systems" (0.20–0.40)
    const s2Opacity = useTransform(progress, [0.22, 0.28, 0.36, 0.40], [0, 1, 1, 0]);
    const s2Y = useTransform(progress, [0.22, 0.28], [30, 0]);
    const s2Line2Opacity = useTransform(progress, [0.26, 0.32], [0, 1]);

    // ─ Scene 3: Cards (handled by GlassCard components)

    // ─ Scene 4: "Systems / Agents / Intelligence" (0.60–0.80)
    const s4Opacity = useTransform(progress, [0.62, 0.68, 0.76, 0.80], [0, 1, 1, 0]);
    const s4W1 = useTransform(progress, [0.62, 0.66], [40, 0]);
    const s4W2 = useTransform(progress, [0.65, 0.69], [40, 0]);
    const s4W3 = useTransform(progress, [0.68, 0.72], [40, 0]);

    // ─ Scene 5: "Architecting Intelligent Systems" (0.80–1.00)
    const s5Opacity = useTransform(progress, [0.84, 0.90, 0.98, 1.0], [0, 1, 1, 0.8]);
    const s5Y = useTransform(progress, [0.84, 0.90], [20, 0]);
    const s5Scale = useTransform(progress, [0.84, 0.92], [0.95, 1]);

    // ─ Progress indicator
    const progressWidth = useTransform(progress, [0, 1], ['0%', '100%']);

    // ─ Scene label
    const sceneLabel = useTransform(progress, (p: number): string => {
        if (p < 0.20) return '01 — AWAKENING';
        if (p < 0.40) return '02 — NEURAL LEARNING';
        if (p < 0.60) return '03 — CAREER TIMELINE';
        if (p < 0.80) return '04 — INTELLIGENCE';
        return '05 — AI ARCHITECT';
    });

    return (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">

            {/* ── Top HUD ── */}
            <div className="absolute top-6 left-6 md:top-10 md:left-12 z-20">
                <motion.span className="font-mono text-[10px] tracking-[0.3em] text-gray-600 uppercase block">
                    {sceneLabel}
                </motion.span>
            </div>

            {/* ── Progress bar ── */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 md:w-64 h-[2px] bg-white/5 rounded-full overflow-hidden z-20">
                <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500"
                    style={{ width: progressWidth }}
                />
            </div>

            {/* ── Scene 1 Text ── */}
            <motion.div
                style={{ opacity: s1Opacity, y: s1Y }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
            >
                <span className="font-mono text-[10px] tracking-[0.3em] text-cyan-400/60 uppercase mb-6">
                    <ScrambleText text="// INITIALIZING" />
                </span>
                <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-display font-black uppercase leading-[0.85] tracking-tighter text-white">
                    Building Intelligence
                </h2>
                <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-display font-black uppercase leading-[0.85] tracking-tighter text-cyan-400 mt-2" style={{ textShadow: '0 0 40px rgba(14,165,233,0.5), 0 0 80px rgba(14,165,233,0.2)' }}>
                    From Data
                </h2>
            </motion.div>

            {/* ── Scene 2 Text ── */}
            <motion.div
                style={{ opacity: s2Opacity, y: s2Y }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
            >
                <span className="font-mono text-[10px] tracking-[0.3em] text-cyan-400/60 uppercase mb-6">
                    <ScrambleText text="// PATTERN RECOGNITION" />
                </span>
                <h2 className="text-[clamp(2rem,7vw,5rem)] font-display font-black uppercase leading-[0.85] tracking-tighter text-white">
                    Learning Patterns
                </h2>
                <motion.h2
                    style={{ opacity: s2Line2Opacity, textShadow: '0 0 40px rgba(6,182,212,0.5), 0 0 80px rgba(6,182,212,0.2)' }}
                    className="text-[clamp(2rem,7vw,5rem)] font-display font-black uppercase leading-[0.85] tracking-tighter text-cyan-300 mt-2"
                >
                    Building Systems
                </motion.h2>
            </motion.div>

            {/* ── Scene 3: Experience Cards ── */}
            <motion.div className="absolute inset-0 flex items-center justify-end pr-6 md:pr-16">
                <div className="w-full max-w-md">
                    <motion.div
                        style={{
                            opacity: useTransform(progress, [0.38, 0.42, 0.58, 0.62], [0, 1, 1, 0]),
                        }}
                    >
                        <span className="font-mono text-[10px] tracking-[0.3em] text-blue-400/60 uppercase mb-4 block">
                            <ScrambleText text="// CAREER MILESTONES" />
                        </span>
                        {experiences.map((exp, i) => (
                            <GlassCard key={i} exp={exp} index={i} progress={progress} />
                        ))}
                    </motion.div>
                </div>
            </motion.div>

            {/* ── Scene 4 Text — Staggered reveals ── */}
            <motion.div
                style={{ opacity: s4Opacity }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 gap-4"
            >
                <span className="font-mono text-[10px] tracking-[0.3em] text-violet-400/60 uppercase mb-4">
                    <ScrambleText text="// INTELLIGENCE FORMATION" />
                </span>
                <motion.h2
                    style={{ y: s4W1 }}
                    className="text-[clamp(3rem,10vw,8rem)] font-display font-black uppercase leading-[0.85] tracking-tighter text-white"
                >
                    Systems
                </motion.h2>
                <motion.h2
                    style={{ y: s4W2, textShadow: '0 0 40px rgba(139,92,246,0.5), 0 0 80px rgba(139,92,246,0.2)' }}
                    className="text-[clamp(3rem,10vw,8rem)] font-display font-black uppercase leading-[0.85] tracking-tighter text-violet-400"
                >
                    Agents
                </motion.h2>
                <motion.h2
                    style={{ y: s4W3 }}
                    className="text-[clamp(3rem,10vw,8rem)] font-display font-black uppercase leading-[0.85] tracking-tighter text-white"
                >
                    Intelligence
                </motion.h2>
            </motion.div>

            {/* ── Scene 5 Text — Final statement ── */}
            <motion.div
                style={{ opacity: s5Opacity, y: s5Y, scale: s5Scale }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
            >
                <span className="font-mono text-[10px] tracking-[0.3em] text-purple-400/60 uppercase mb-6">
                    <ScrambleText text="// SYSTEM READY" />
                </span>
                <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-display font-black uppercase leading-[0.85] tracking-tighter text-white">
                    Architecting
                </h2>
                <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-display font-black uppercase leading-[0.85] tracking-tighter text-purple-400 mt-2" style={{ textShadow: '0 0 40px rgba(168,85,247,0.5), 0 0 80px rgba(168,85,247,0.2)' }}>
                    Intelligent Systems
                </h2>
            </motion.div>

        </div>
    );
};

export default AIEvolutionOverlay;
