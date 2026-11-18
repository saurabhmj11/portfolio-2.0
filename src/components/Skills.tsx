import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAudioDirector } from '../context/AudioContext';
import { useInView } from 'react-intersection-observer';
import ScrollReveal from './ScrollReveal';
import ScrambleText from './ScrambleText';
import Card3DTilt from './Card3DTilt';
import projectsData from '../data/projectsData';

// ─── Tech Stack Data ──────────────────────────────────────────────────────────
const STACK = [
    {
        domain: 'AI / LLM Core',
        color: 'from-violet-500/20 to-purple-500/20',
        accent: 'bg-violet-500',
        border: 'border-violet-500/20 hover:border-violet-500/50',
        dot: 'bg-violet-400',
        skills: [
            'LLM Agents',
            'RAG Systems',
            'LangChain / Graph',
            'Gemini API',
            'OpenAI API',
            'ChromaDB / FAISS',
        ],
    },
    {
        domain: 'Backend & Data',
        color: 'from-blue-500/20 to-cyan-500/20',
        accent: 'bg-blue-500',
        border: 'border-blue-500/20 hover:border-blue-500/50',
        dot: 'bg-blue-400',
        skills: [
            'Python / FastAPI',
            'Node.js',
            'PostgreSQL',
            'Prisma ORM',
            'Supabase',
            'REST / SSE',
        ],
    },
    {
        domain: 'Frontend',
        color: 'from-emerald-500/20 to-teal-500/20',
        accent: 'bg-emerald-500',
        border: 'border-emerald-500/20 hover:border-emerald-500/50',
        dot: 'bg-emerald-400',
        skills: [
            'React / Next.js',
            'TypeScript',
            'Framer Motion',
            'GSAP / ScrollTrigger',
            'Tailwind CSS',
            'Three.js / WebGL',
        ],
    },
    {
        domain: 'DevOps & Cloud',
        color: 'from-orange-500/20 to-amber-500/20',
        accent: 'bg-orange-500',
        border: 'border-orange-500/20 hover:border-orange-500/50',
        dot: 'bg-orange-400',
        skills: [
            'Docker',
            'Render / Vercel',
            'AWS (EC2, S3)',
            'GitHub Actions',
            'Prisma Migrations',
            'Zustand',
        ],
    },
];

// ─── Domain Card ─────────────────────────────────────────────────────────────
const DomainCard = ({
    domain, color, border, dot, skills, index,
}: typeof STACK[number] & { index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className={`relative p-6 bg-gradient-to-br ${color} border ${border} rounded-2xl transition-all duration-500 overflow-hidden group`}
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

            {/* Skills */}
            <ul className="flex flex-wrap gap-2 relative z-10">
                {skills.map((name) => (
                    <li
                        key={name}
                        className="px-3 py-1.5 text-xs font-mono text-gray-300 border border-white/10 rounded-full bg-black/20"
                    >
                        {name}
                    </li>
                ))}
            </ul>
        </motion.div>
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

            {/* Background atmosphere */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-900/8 rounded-full blur-[160px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-900/8 rounded-full blur-[160px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* ── Header ── */}
                <ScrollReveal>
                    <div className="mb-10 md:mb-12">
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

                {/* ── Domain Grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                    {STACK.map((domain, i) => (
                        <Card3DTilt key={domain.domain} intensity={0.7} className="rounded-2xl">
                            <DomainCard {...domain} index={i} />
                        </Card3DTilt>
                    ))}
                </div>

                {/* ── Bottom Callout ── */}
                <ScrollReveal>
                    <div className="mt-16 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6 flex-wrap justify-center md:justify-start">
                            {[
                                { value: '2022', label: 'Building AI Since' },
                                { value: String(projectsData.length), label: 'Projects Shown' },
                                { value: String(projectsData.filter(p => p.liveUrl && p.repo).length), label: 'Live Apps with Source' },
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
