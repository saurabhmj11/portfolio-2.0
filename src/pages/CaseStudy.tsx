import { useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowUpRight, ArrowRight, ExternalLink } from 'lucide-react';
import Magnetic from '../components/Magnetic';
import OptimizedImage from '../components/OptimizedImage';
import ScrollReveal from '../components/ScrollReveal';
import ScrambleText from '../components/ScrambleText';
import { Helmet } from 'react-helmet-async';
// ── Single source of truth: shared with Projects.tsx neural web ──
import projectsData from '../data/projectsData';

gsap.registerPlugin(ScrollTrigger);

// ─── Animated Counter Component ──────────────────────────────────────────────
const AnimatedMetric = ({ value, label }: { value: string; label: string }) => {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const numericMatch = value.match(/[\d.]+/);
        if (!numericMatch) return;
        const target = parseFloat(numericMatch[0]);
        const prefix = value.slice(0, value.indexOf(numericMatch[0]));
        const suffix = value.slice(value.indexOf(numericMatch[0]) + numericMatch[0].length);

        const ctx = gsap.context(() => {
            const counter = { val: 0 };
            ScrollTrigger.create({
                trigger: ref.current,
                start: 'top 80%',
                once: true,
                onEnter: () => {
                    gsap.to(counter, {
                        val: target,
                        duration: 1.5,
                        ease: 'power2.out',
                        onUpdate: () => {
                            if (ref.current) {
                                const display = Number.isInteger(target)
                                    ? Math.floor(counter.val).toString()
                                    : counter.val.toFixed(1);
                                ref.current.textContent = `${prefix}${display}${suffix}`;
                            }
                        },
                    });
                },
            });
        });
        return () => ctx.revert();
    }, [value]);

    return (
        <div className="text-center p-6 border border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors duration-300">
            <span
                ref={ref}
                className="block text-5xl md:text-6xl font-display font-black text-white tracking-tight tabular-nums"
            >
                {value}
            </span>
            <span className="block mt-3 text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500">
                {label}
            </span>
        </div>
    );
};

// ─── CaseStudy Page ──────────────────────────────────────────────────────────
const CaseStudy = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const project = projectsData.find(p => p.id === id);
    const projectIdx = projectsData.findIndex(p => p.id === id);
    const nextProject = projectsData[(projectIdx + 1) % projectsData.length];

    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

    // Scroll to top on project change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    // Escape key to go back
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') navigate('/#projects');
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [navigate]);

    if (!project) {
        return (
            <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center">
                <Helmet>
                    <title>Project Not Found | Saurabh Lokhande</title>
                </Helmet>
                <div className="text-center">
                    <p className="text-xs font-mono text-red-400 uppercase tracking-[0.3em] mb-4">
                        // 404_NODE_NOT_FOUND
                    </p>
                    <h1 className="text-6xl font-display font-black mb-4">Not Found</h1>
                    <p className="text-gray-500 mb-8 font-mono text-sm">
                        Project ID <code className="text-white">"{id}"</code> does not exist in the neural web.
                    </p>
                    <Link to="/#projects" className="text-blue-400 font-mono text-sm hover:text-blue-300 transition-colors">
                        ← Return to Neural Web
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#020202] text-white min-h-screen">
            <Helmet>
                <title>{project.title} — Case Study | Saurabh Lokhande</title>
                <meta name="description" content={project.description} />
            </Helmet>

            {/* ── 1. Hero Section ── */}
            <div ref={heroRef} className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
                <motion.div style={{ y: heroY }} className="absolute inset-0">
                    <OptimizedImage
                        src={project.image}
                        alt={project.title}
                        width={1920}
                        quality={85}
                        className="w-full h-full object-cover filter brightness-[0.3] contrast-[1.15]"
                        wrapperClassName="w-full h-full"
                    />
                </motion.div>

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#020202]/40 to-transparent" />

                <motion.div
                    style={{ opacity: heroOpacity }}
                    className="absolute inset-0 flex flex-col justify-end p-6 md:p-16 z-10"
                >
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/#projects')}
                        className="absolute top-6 left-6 md:top-12 md:left-16 flex items-center gap-2 text-sm font-mono uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors group"
                        aria-label="Back to projects"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Neural Web
                    </button>

                    <span className="text-xs font-mono text-gray-500 uppercase tracking-[0.3em] mb-4">
                        // {project.category}
                    </span>
                    <h1 className="text-[clamp(3rem,10vw,8rem)] font-display font-black uppercase leading-[0.85] tracking-tighter">
                        <ScrambleText text={project.title} />
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg md:text-xl text-gray-300 font-light leading-relaxed">
                        {project.description}
                    </p>
                </motion.div>
            </div>

            {/* ── 2. The Challenge ── */}
            <section className="py-20 md:py-32 px-6 md:px-16 max-w-6xl mx-auto">
                <ScrollReveal>
                    <span className="text-xs font-mono text-red-400 uppercase tracking-[0.3em] flex items-center gap-2 mb-6">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        SYSTEM DEFICIENCY
                    </span>
                    <h2 className="text-3xl md:text-5xl font-display font-black leading-tight mb-8">
                        The Challenge
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed border-l-2 border-red-500/30 pl-6">
                        {project.details.problem}
                    </p>
                </ScrollReveal>
            </section>

            {/* ── 3. Impact Metrics ── */}
            <section className="py-16 md:py-24 px-6 md:px-16 bg-[#080808] border-y border-white/5">
                <div className="max-w-6xl mx-auto">
                    <ScrollReveal>
                        <span className="text-xs font-mono text-gray-600 uppercase tracking-[0.3em] mb-10 block">
                            KEY METRICS
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/5">
                            {project.metrics.map((m) => (
                                <AnimatedMetric key={m.label} value={m.value} label={m.label} />
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* ── 4. The Solution ── */}
            <section className="py-20 md:py-32 px-6 md:px-16 max-w-6xl mx-auto">
                <ScrollReveal>
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-[0.3em] flex items-center gap-2 mb-6">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        IMPLEMENTED SOLUTION
                    </span>
                    <h2 className="text-3xl md:text-5xl font-display font-black leading-tight mb-8">
                        The Approach
                    </h2>
                    <p className="text-xl md:text-2xl text-white font-medium leading-relaxed">
                        {project.details.solution}
                    </p>
                </ScrollReveal>
            </section>

            {/* ── 5. Architecture ── */}
            <section className="py-16 md:py-24 px-6 md:px-16 max-w-6xl mx-auto">
                <ScrollReveal>
                    <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 relative overflow-hidden group">
                        {/* Hover shimmer */}
                        <div className="absolute inset-0 bg-white/[0.02] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out" />
                        <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-gray-500 mb-6 relative z-10">
                            ARCHITECTURE METADATA
                        </h3>
                        <p className="text-sm md:text-base text-gray-400 leading-relaxed font-mono relative z-10">
                            {project.details.architecture}
                        </p>
                    </div>
                </ScrollReveal>
            </section>

            {/* ── 6. Tech Stack ── */}
            <section className="py-16 md:py-24 px-6 md:px-16 max-w-6xl mx-auto">
                <ScrollReveal>
                    <h3 className="font-mono uppercase tracking-[0.3em] text-xs text-gray-600 mb-8">
                        TECHNOLOGY STACK
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {project.technologies.map((tech) => (
                            <Magnetic key={tech}>
                                <span className="px-6 py-3 bg-white/5 border border-white/10 text-sm font-mono tracking-widest text-gray-300 uppercase hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-default">
                                    {tech}
                                </span>
                            </Magnetic>
                        ))}
                    </div>
                </ScrollReveal>
            </section>

            {/* ── 7. Impact ── */}
            <section className="py-16 md:py-24 px-6 md:px-16 max-w-6xl mx-auto">
                <ScrollReveal>
                    <span className="text-xs font-mono text-blue-400 uppercase tracking-[0.3em] flex items-center gap-2 mb-6">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        MEASURED IMPACT
                    </span>
                    <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed border-l-2 border-blue-500/30 pl-6">
                        {project.details.impact}
                    </p>
                </ScrollReveal>
            </section>

            {/* ── 8. Action Links ── */}
            <section className="py-16 md:py-24 px-6 md:px-16 max-w-6xl mx-auto border-t border-white/5">
                <ScrollReveal>
                    <div className="flex flex-col md:flex-row gap-6">
                        {(project.liveUrl || project.link) && (
                            <Magnetic>
                                <a
                                    href={project.liveUrl ?? project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex justify-center items-center gap-3 bg-white text-black px-10 py-5 font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors"
                                >
                                    Live Demo <ExternalLink className="w-4 h-4" />
                                </a>
                            </Magnetic>
                        )}
                        {project.repo && (
                            <Magnetic>
                                <a
                                    href={project.repo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex justify-center items-center gap-3 bg-transparent text-white border border-white/20 px-10 py-5 font-bold uppercase tracking-widest text-sm hover:bg-white/10 hover:border-white/30 transition-colors"
                                >
                                    Source Code <ArrowUpRight className="w-5 h-5" />
                                </a>
                            </Magnetic>
                        )}
                    </div>
                </ScrollReveal>
            </section>

            {/* ── 9. Next Project CTA ── */}
            <section className="py-24 md:py-40 px-6 md:px-16 bg-[#050505] border-t border-white/5">
                <Link
                    to={`/project/${nextProject.id}`}
                    className="block max-w-6xl mx-auto group"
                >
                    <ScrollReveal>
                        <span className="text-xs font-mono text-gray-600 uppercase tracking-[0.3em] mb-6 block">
                            NEXT CASE STUDY
                        </span>
                        <div className="flex items-center justify-between">
                            <h2 className="text-[clamp(2.5rem,8vw,7rem)] font-display font-black uppercase leading-[0.85] tracking-tighter group-hover:text-blue-400 transition-colors duration-300">
                                {nextProject.title}
                            </h2>
                            <Magnetic>
                                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300 shrink-0">
                                    <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
                                </div>
                            </Magnetic>
                        </div>
                        <p className="mt-4 text-gray-500 font-mono text-sm uppercase tracking-widest">
                            {nextProject.category}
                        </p>
                    </ScrollReveal>
                </Link>
            </section>

        </div>
    );
};

export default CaseStudy;
