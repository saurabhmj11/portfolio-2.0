import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAudioDirector } from '../context/AudioContext';
import { useInView } from 'react-intersection-observer';
import { Helmet } from 'react-helmet-async';
import ScrollReveal from './ScrollReveal';
import ScrambleText from './ScrambleText';

// ─── Tech Stack Data ──────────────────────────────────────────────────────────
const STACK = [
    {
        domain: 'AI / LLM Core',
        color: 'from-violet-500/20 to-purple-500/20',
        accent: 'bg-violet-500',
        border: 'border-violet-500/20 hover:border-violet-500/50',
        dot: 'bg-violet-400',
        skills: [
            { name: 'LLM Agents', level: 98 },
            { name: 'RAG Systems', level: 96 },
            { name: 'LangChain / Graph', level: 94 },
            { name: 'Gemini API', level: 92 },
            { name: 'OpenAI API', level: 95 },
            { name: 'ChromaDB / FAISS', level: 88 },
        ],
    },
    {
        domain: 'Backend & Data',
        color: 'from-blue-500/20 to-cyan-500/20',
        accent: 'bg-blue-500',
        border: 'border-blue-500/20 hover:border-blue-500/50',
        dot: 'bg-blue-400',
        skills: [
            { name: 'Python / FastAPI', level: 96 },
            { name: 'Node.js', level: 88 },
            { name: 'PostgreSQL', level: 85 },
            { name: 'Prisma ORM', level: 88 },
            { name: 'Supabase', level: 90 },
            { name: 'REST / SSE', level: 92 },
        ],
    },
    {
        domain: 'Frontend',
        color: 'from-emerald-500/20 to-teal-500/20',
        accent: 'bg-emerald-500',
        border: 'border-emerald-500/20 hover:border-emerald-500/50',
        dot: 'bg-emerald-400',
        skills: [
            { name: 'React / Next.js 16', level: 95 },
            { name: 'TypeScript', level: 92 },
            { name: 'Framer Motion', level: 90 },
            { name: 'GSAP / ScrollTrigger', level: 87 },
            { name: 'Tailwind CSS', level: 94 },
            { name: 'Three.js / WebGL', level: 72 },
        ],
    },
    {
        domain: 'DevOps & Cloud',
        color: 'from-orange-500/20 to-amber-500/20',
        accent: 'bg-orange-500',
        border: 'border-orange-500/20 hover:border-orange-500/50',
        dot: 'bg-orange-400',
        skills: [
            { name: 'Docker', level: 88 },
            { name: 'Render / Vercel', level: 92 },
            { name: 'AWS (EC2, S3)', level: 80 },
            { name: 'GitHub Actions', level: 85 },
            { name: 'Prisma Migrations', level: 88 },
            { name: 'Zustand', level: 90 },
        ],
    },
];

// Marquee tech logos (text-based, no images)
const MARQUEE_TAGS = [
    'Python', 'TypeScript', 'Next.js 16', 'FastAPI', 'LangGraph', 'Gemini',
    'ChromaDB', 'Supabase', 'Prisma', 'Framer Motion', 'GSAP', 'Docker',
    'Zustand', 'shadcn/ui', 'React', 'OpenAI', 'Tailwind', 'RAG', 'SSE',
    'PostgreSQL', 'Node.js', 'Three.js', 'Presidio', 'Render',
];

// ─── Skill Bar ────────────────────────────────────────────────────────────────
const SkillBar = ({
    name, level, accent, delay, cardHovered,
}: { name: string; level: number; accent: string; delay: number; cardHovered: boolean }) => {
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [displayNum, setDisplayNum] = useState(0);
    const rafRef = useRef<number | null>(null);

    // Count up on card hover
    useEffect(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (!cardHovered) { setDisplayNum(0); return; }
        const duration = 1500 + delay * 400;
        const start = performance.now();
        const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplayNum(Math.round(eased * level));
            if (p < 1) rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, [cardHovered, level, delay]);

    return (
        <div ref={ref}>
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono transition-colors duration-300"
                    style={{ color: cardHovered ? 'white' : 'rgb(156,163,175)' }}>
                    {name}
                </span>
                <span
                    className="text-[10px] font-mono tabular-nums transition-colors duration-300"
                    style={{ color: cardHovered ? 'rgb(209,213,219)' : 'rgb(75,85,99)' }}
                >
                    {cardHovered ? displayNum : level}%
                </span>
            </div>
            <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    key={cardHovered ? 'hovered' : 'normal'}
                    className={`h-full ${accent} rounded-full`}
                    initial={{ width: '0%' }}
                    animate={{ width: `${level}%` }}
                    transition={{
                        duration: cardHovered ? 1.5 + delay * 0.4 : 1.5,
                        delay: cardHovered ? delay * 0.15 : delay,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                />
            </div>
        </div>
    );
};

// ─── Domain Card ─────────────────────────────────────────────────────────────
const DomainCard = ({
    domain, color, accent, border, dot, skills, index,
}: typeof STACK[number] & { index: number }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className={`relative p-6 bg-gradient-to-br ${color} border ${border} rounded-2xl transition-all duration-500 overflow-hidden group`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Hover shimmer */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />
            </div>

            {/* Header */}
            <div className="flex items-center gap-2.5 mb-6 relative z-10">
                <span className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
                <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-gray-400 group-hover:text-gray-300 transition-colors">
                    {domain}
                </h3>
            </div>

            {/* Skill bars */}
            <div className="space-y-4 relative z-10">
                {skills.map((s, i) => (
                    <SkillBar
                        key={s.name}
                        name={s.name}
                        level={s.level}
                        accent={accent}
                        delay={i * 0.06}
                        cardHovered={hovered}
                    />
                ))}
            </div>
        </motion.div>
    );
};

// ─── Marquee Strip ────────────────────────────────────────────────────────────
const MarqueeStrip = ({ reverse = false }: { reverse?: boolean }) => {
    const doubled = [...MARQUEE_TAGS, ...MARQUEE_TAGS];
    return (
        <div className="overflow-hidden py-3 mask-fade-x">
            <motion.div
                className="flex gap-6 w-max"
                animate={{ x: reverse ? ['0%', '50%'] : ['0%', '-50%'] }}
                transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
            >
                {doubled.map((tag, i) => (
                    <span
                        key={i}
                        className="px-4 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-600 border border-white/5 rounded-full whitespace-nowrap hover:text-white hover:border-white/20 transition-colors duration-300 cursor-default"
                    >
                        {tag}
                    </span>
                ))}
            </motion.div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Skills = () => {
    const [ref, inView] = useInView({ threshold: 0.1 });
    const { playSectionChime } = useAudioDirector();

    useEffect(() => {
        if (inView) playSectionChime('skills');
    }, [inView, playSectionChime]);

    return (
        <section
            ref={ref}
            className="py-20 md:py-32 bg-[#050505] text-white relative overflow-hidden"
            id="skills"
        >
            {inView && (
                <Helmet>
                    <title>Capabilities | Saurabh Lokhande</title>
                    <meta name="description" content="Full-stack AI engineering capabilities: LLM agents, RAG systems, FastAPI, Next.js, and production-grade deployments." />
                </Helmet>
            )}

            {/* Background atmosphere */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-900/8 rounded-full blur-[160px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-900/8 rounded-full blur-[160px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* ── Header ── */}
                <ScrollReveal>
                    <div className="mb-16 md:mb-20">
                        <span className="text-xs font-mono text-gray-500 uppercase tracking-[0.3em] mb-4 block">
                            // SYSTEM CAPABILITIES
                        </span>
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                            <h2 className="text-[clamp(2.5rem,7vw,5rem)] font-display font-black leading-[0.9] tracking-tighter uppercase">
                                <ScrambleText text="Technical" />
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-700 italic">
                                    <ScrambleText text="Arsenal" />
                                </span>
                            </h2>
                            <p className="max-w-sm text-gray-500 font-mono text-xs leading-relaxed border-l border-white/10 pl-4">
                                Full-stack AI engineering across the entire delivery stack — from LLM agent design
                                to production deployments on Render, Vercel, and Docker.
                            </p>
                        </div>
                    </div>
                </ScrollReveal>

                {/* ── Marquee Tags ── */}
                <div className="mb-16 space-y-2">
                    <MarqueeStrip />
                    <MarqueeStrip reverse />
                </div>

                {/* ── Domain Grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                    {STACK.map((domain, i) => (
                        <DomainCard key={domain.domain} {...domain} index={i} />
                    ))}
                </div>

                {/* ── Bottom Callout ── */}
                <ScrollReveal>
                    <div className="mt-16 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6 flex-wrap justify-center md:justify-start">
                            {[
                                { value: '4+', label: 'Years Building AI' },
                                { value: '15+', label: 'Production Projects' },
                                { value: '2', label: 'Live SaaS Deployed' },
                            ].map(({ value, label }) => (
                                <div key={label} className="text-center md:text-left">
                                    <span className="block text-3xl font-display font-black text-white tracking-tight">{value}</span>
                                    <span className="block text-[10px] font-mono text-gray-600 uppercase tracking-[0.2em] mt-1">{label}</span>
                                </div>
                            ))}
                        </div>
                        <a
                            href="#projects"
                            className="flex items-center gap-3 px-6 py-3 border border-white/10 font-mono text-xs uppercase tracking-widest text-gray-400 hover:text-white hover:border-white/30 transition-all duration-300 rounded-full"
                        >
                            See Projects in Action
                            <span className="w-4 h-[1px] bg-current" />
                        </a>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
};

export default Skills;
