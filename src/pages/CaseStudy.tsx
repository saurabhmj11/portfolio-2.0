import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowUpRight, ArrowRight } from 'lucide-react';
import Magnetic from '../components/Magnetic';
import OptimizedImage from '../components/OptimizedImage';
import ScrollReveal from '../components/ScrollReveal';
import ScrambleText from '../components/ScrambleText';
import useIsMobile from '../hooks/useIsMobile';

gsap.registerPlugin(ScrollTrigger);

// ─── Project Data (shared with Projects.tsx — consider extracting to a data file later)
interface ProjectData {
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    technologies: string[];
    details: {
        problem: string;
        solution: string;
        architecture: string;
        impact: string;
    };
    metrics: { label: string; value: string }[];
    link?: string;
    repo?: string;
}

const PROJECTS: ProjectData[] = [
    {
        id: 'hiremeos',
        title: 'HireMeOS',
        category: 'LLM Systems',
        description: 'An autonomous AI operating system that plans, executes, and explains complex data analysis using LLM agents.',
        image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2670&auto=format&fit=crop',
        technologies: ['Python', 'OpenAI', 'LangChain', 'FastAPI'],
        details: {
            problem: 'Data analysis is often fragmented, manual, and time-consuming. Analysts spend 60% of their time wrangling data instead of deriving insights.',
            solution: 'A multi-agent operating system where specialized agents collaborate autonomously — a Planner decomposes tasks, a Researcher gathers data, and a Verifier ensures accuracy.',
            architecture: 'LangGraph orchestrated state machine. Agents communicate via structured JSON. Each agent has its own prompt template, tools, and guardrails.',
            impact: 'Reduced analysis time by 60% and achieved 80% autonomous completion rate across 500+ test queries.'
        },
        metrics: [
            { label: 'Time Reduction', value: '60%' },
            { label: 'Autonomous Rate', value: '80%' },
            { label: 'Test Queries', value: '500+' },
        ],
        repo: 'https://github.com/saurabhmj11/hiremeos',
        link: 'https://www.linkedin.com/posts/activity-7415710665358614528-0h3Z',
    },
    {
        id: 'ocr-pipeline',
        title: 'OCR Pipeline',
        category: 'Automation',
        description: 'Production-grade OCR pipeline with validation, confidence scoring, and human-in-the-loop review.',
        image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?q=80&w=2670&auto=format&fit=crop',
        technologies: ['Tesseract', 'Python', 'OpenCV', 'AWS Textract'],
        details: {
            problem: 'Processing thousands of non-standardized invoices led to high error rates and required manual verification of every document.',
            solution: 'A hybrid OCR pipeline combining Tesseract for speed and AWS Textract for complex layouts, with confidence scoring to route uncertain results to human review.',
            architecture: 'Event-driven SQS/Lambda architecture. Pre-processing with OpenCV for deskewing, noise removal, and contrast enhancement.',
            impact: 'Automated 95% of processing with <1% critical error rate, saving 120 hours/month of manual data entry.'
        },
        metrics: [
            { label: 'Automated', value: '95%' },
            { label: 'Error Rate', value: '<1%' },
            { label: 'Hours Saved/Mo', value: '120' },
        ],
        repo: 'https://github.com/saurabhmj11/ocr-pipeline',
    },
    {
        id: 'student-recsys',
        title: 'RecSys Engine',
        category: 'Applied ML',
        description: 'ML-driven student recommendations based on quiz performance and learning patterns.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop',
        technologies: ['Scikit-learn', 'Pandas', 'FastAPI', 'PostgreSQL'],
        details: {
            problem: 'Generic learning paths failed to address individual student gaps, resulting in low engagement and high dropout rates.',
            solution: 'A collaborative filtering engine that analyzes quiz performance patterns to deliver personalized quizzes and study materials.',
            architecture: 'Real-time inference API bridging cold-start content filtering to collaborative filtering as user data accumulates.',
            impact: 'Improved student engagement by 40% and reduced course dropout rate by 25%.'
        },
        metrics: [
            { label: 'Engagement Up', value: '40%' },
            { label: 'Dropout Down', value: '25%' },
            { label: 'Students Served', value: '2K+' },
        ],
        repo: 'https://github.com/saurabhmj11/recsys-engine',
    },
    {
        id: 'submaster',
        title: 'SubMaster',
        category: 'Backend Architecture',
        description: 'Subscription-based SaaS backend with authentication, Stripe billing, and secure sessions.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2670&auto=format&fit=crop',
        technologies: ['Node.js', 'Stripe API', 'PostgreSQL', 'Redis'],
        details: {
            problem: 'Boilerplate SaaS backends lack robust subscription lifecycle management, leading to revenue leakage and security gaps.',
            solution: 'A secure, reusable microservice handling Authentication (JWT + refresh), Payments (Stripe webhooks), and Role-based access control.',
            architecture: 'Express.js with middleware chains for RBAC. Idempotent webhook handler prevents duplicate charges. Redis session cache.',
            impact: 'Reduced initial setup time from 2 weeks to 2 days across 3 startups.'
        },
        metrics: [
            { label: 'Setup Time', value: '2 Days' },
            { label: 'Startups Using', value: '3' },
            { label: 'Uptime', value: '99.9%' },
        ],
        repo: 'https://github.com/saurabhmj11/submaster',
    },
    {
        id: 'web-intel',
        title: 'Web Intel',
        category: 'Web Agents',
        description: 'Autonomous agent that researches, validates, and summarizes information from the web.',
        image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2670&auto=format&fit=crop',
        technologies: ['Playwright', 'OpenAI', 'BeautifulSoup', 'Celery'],
        details: {
            problem: 'Market research requires parsing hundreds of pages and handling anti-bot protections, taking analysts days per report.',
            solution: 'A browsing agent that navigates JavaScript-heavy sites using headless Playwright, extracts semantic content, and produces validated summaries.',
            architecture: 'Distributed scraping using Celery workers controlling headless browsers. LLM orchestrates navigation and summarization pipeline.',
            impact: 'Capable of summarizing 50+ pages of analysis in under 5 minutes with 92% factual accuracy.'
        },
        metrics: [
            { label: 'Pages Analyzed', value: '50+' },
            { label: 'Time Per Report', value: '5 Min' },
            { label: 'Accuracy', value: '92%' },
        ],
        repo: 'https://github.com/saurabhmj11/web-agent',
    },
];

// ─── Animated Counter Component ──────────────────────────────────────────────
const AnimatedMetric = ({ value, label }: { value: string; label: string }) => {
    const ref = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        if (!ref.current) return;

        // Extract numeric portion
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
        <div className="text-center">
            <span
                ref={ref}
                className="block text-5xl md:text-7xl font-display font-black text-white tracking-tight"
            >
                {value}
            </span>
            <span className="block mt-2 text-xs font-mono uppercase tracking-[0.3em] text-gray-500">
                {label}
            </span>
        </div>
    );
};

// ─── CaseStudy Page ──────────────────────────────────────────────────────────
const CaseStudy = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const project = PROJECTS.find(p => p.id === id);
    const projectIdx = PROJECTS.findIndex(p => p.id === id);
    const nextProject = PROJECTS[(projectIdx + 1) % PROJECTS.length];

    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!project) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-6xl font-display font-black mb-4">404</h1>
                    <p className="text-gray-500 mb-8">Project not found</p>
                    <Link to="/#projects" className="text-blue-400 underline">← Back to Projects</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#020202] text-white min-h-screen">

            {/* ── 1. Hero Section ── */}
            <div ref={heroRef} className="relative h-[80vh] md:h-screen w-full overflow-hidden">
                <motion.div style={{ y: heroY }} className="absolute inset-0">
                    <OptimizedImage
                        src={project.image}
                        alt={project.title}
                        width={1920}
                        quality={85}
                        className="w-full h-full object-cover filter brightness-[0.35] contrast-[1.1]"
                        wrapperClassName="w-full h-full"
                    />
                </motion.div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent" />

                <motion.div
                    style={{ opacity: heroOpacity }}
                    className="absolute inset-0 flex flex-col justify-end p-6 md:p-16 z-10"
                >
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/#projects')}
                        className="absolute top-6 left-6 md:top-12 md:left-16 flex items-center gap-2 text-sm font-mono uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={16} /> Back
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
                    <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed border-l-2 border-white/10 pl-6">
                        {project.details.problem}
                    </p>
                </ScrollReveal>
            </section>

            {/* ── 3. Impact Metrics ── */}
            <section className="py-16 md:py-24 px-6 md:px-16 bg-[#080808] border-y border-white/5">
                <div className="max-w-6xl mx-auto">
                    <ScrollReveal>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
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

            {/* ── 7. Action Links ── */}
            <section className="py-16 md:py-24 px-6 md:px-16 max-w-6xl mx-auto border-t border-white/5">
                <ScrollReveal>
                    <div className="flex flex-col md:flex-row gap-6">
                        {project.link && (
                            <Magnetic>
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex justify-center items-center gap-3 bg-white text-black px-10 py-5 font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors"
                                >
                                    Live Demo <ArrowUpRight className="w-5 h-5" />
                                </a>
                            </Magnetic>
                        )}
                        {project.repo && (
                            <Magnetic>
                                <a
                                    href={project.repo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex justify-center items-center gap-3 bg-transparent text-white border border-white/20 px-10 py-5 font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-colors"
                                >
                                    Source Code <ArrowUpRight className="w-5 h-5" />
                                </a>
                            </Magnetic>
                        )}
                    </div>
                </ScrollReveal>
            </section>

            {/* ── 8. Next Project CTA ── */}
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
                                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
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
