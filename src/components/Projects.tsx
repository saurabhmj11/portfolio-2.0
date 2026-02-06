import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from './Magnetic';
import { useTerminal } from '../context/TerminalContext';
import useIsMobile from '../hooks/useIsMobile';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import ScrollReveal from './ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

interface Project {
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
    link?: string;
    repo?: string;
}

const projects: Project[] = [
    {
        title: 'HireMeOS',
        category: 'LLM Systems • AI Agents',
        description: 'An autonomous AI operating system that plans, executes, and explains complex data analysis using LLM agents.',
        image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2670&auto=format&fit=crop', // Replace with real screenshot later
        technologies: ['Python', 'OpenAI', 'LangChain', 'FastAPI', 'React'],
        details: {
            problem: 'Data analysis is often fragmented, manual, and time-consuming, requiring constant context switching between tools.',
            solution: 'A multi-agent operating system where specialized agents (Planner, Coder, Reviewer) collaborate to execute high-level objectives autonomously.',
            architecture: 'Orchestrated via LangGraph with a shared state machine. Agents communicate via structured JSON. Tools include a local Python sandbox and internet search.',
            impact: 'Reduced analysis time by 60% and achieved 80% autonomous task completion rate for standard data queries.'
        },
        repo: 'https://github.com/saurabhmj11/hiremeos',
        link: 'https://www.linkedin.com/posts/activity-7415710665358614528-0h3Z?utm_source=share&utm_medium=member_desktop&rcm=ACoAABwgLI0BRQLx3hnGIPqSoEG7kFgdRf91h6g'
    },

    {
        title: 'OCR Pipeline',
        category: 'Production • Automation',
        description: 'Production-grade OCR pipeline with validation, confidence scoring, and human-in-the-loop review.',
        image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?q=80&w=2670&auto=format&fit=crop',
        technologies: ['Tesseract', 'Python', 'OpenCV', 'Docker', 'AWS Textract'],
        details: {
            problem: 'Processing thousands of non-standardized invoices manually led to high error rates and slow turnaround times.',
            solution: 'A hybrid OCR pipeline combining Tesseract for speed and AWS Textract for complex layouts, with a fallback UI for low-confidence results.',
            architecture: 'Event-driven architecture using SQS/Lambda. Images are pre-processed with OpenCV (deskewing, binarization) before extraction.',
            impact: 'Automated 95% of document processing with <1% critical error rate.'
        },
        repo: 'https://github.com/saurabhmj11/ocr-pipeline'
    },
    {
        title: 'Student RecSys',
        category: 'Applied ML • Analytics',
        description: 'ML-driven student recommendations based on quiz performance and learning patterns.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop',
        technologies: ['Scikit-learn', 'Pandas', 'FastAPI', 'PostgreSQL'],
        details: {
            problem: 'Generic learning paths failed to address individual student gaps, leading to plateauing performance.',
            solution: 'A collaborative filtering engine that recommends personalized quizzes and materials based on peer performance and history.',
            architecture: 'Content-based filtering for cold start, transitioning to collaborative filtering. Real-time inference via FastAPI endpoint.',
            impact: 'Improved student engagement by 40% and quiz completion rates by 25%.'
        },
        repo: 'https://github.com/saurabhmj11/recsys-engine'
    },
    {
        title: 'SubMaster SaaS',
        category: 'SaaS • Backend',
        description: 'Subscription-based SaaS backend with authentication, Stripe billing, and secure session management.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2670&auto=format&fit=crop',
        technologies: ['Node.js', 'Stripe API', 'PostgreSQL', 'Redis', 'JWT'],
        details: {
            problem: 'Boilerplate SaaS backends are often insecure or lack robust subscription lifecycle management.',
            solution: 'A secure, reusable backend microservice handling Auth, Payments, and Webhooks with idempotent processing.',
            architecture: 'Express.js API with varying middleware for role-based access control. Webhook handler ensures Stripe state consistency.',
            impact: 'Deployed as a foundation for 3 startups, reducing initial backend setup time from 2 weeks to 2 days.'
        },
        repo: 'https://github.com/saurabhmj11/submaster'
    },
    {
        title: 'Web Intel Agent',
        category: 'Agents • Web Automation',
        description: 'Autonomous agent that researches, validates, and summarizes information from the web.',
        image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2670&auto=format&fit=crop',
        technologies: ['Playwright', 'OpenAI', 'BeautifulSoup', 'Celery'],
        details: {
            problem: 'Market research requires parsing hundreds of pages, often hitting anti-bot protections or unstructured data.',
            solution: 'A browsing agent that navigates complex js-heavy sites, extracts semantic content, and synthesizes reports.',
            architecture: 'Distributed scraping using Celery workers. Headless browser controlled by agentic logic to handle popups/pagination.',
            impact: 'Capable of summarizing 50+ pages of competitor analysis in under 5 minutes.'
        },
        repo: 'https://github.com/saurabhmj11/web-agent'
    }
];

const Projects = () => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const { addLog } = useTerminal();

    // GSAP Refs
    const sectionRef = useRef<HTMLElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const horizontalScrollRef = useRef<HTMLDivElement>(null);
    // Accessibility: Ref to focus prompt modal
    const modalRef = useRef<HTMLDivElement>(null);

    // Accessibility & Body Lock Effect
    useEffect(() => {
        let lastActiveElement: HTMLElement | null = null;

        if (selectedProject) {
            // 1. Lock Body
            document.body.style.overflow = 'hidden';
            // 2. Save current focus
            lastActiveElement = document.activeElement as HTMLElement;
            // 3. Focus modal (next tick to ensure mount)
            requestAnimationFrame(() => {
                modalRef.current?.focus();
            });

            // 4. Escape Key Handler
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') setSelectedProject(null);
            };
            window.addEventListener('keydown', handleKeyDown);

            return () => {
                window.removeEventListener('keydown', handleKeyDown);
                document.body.style.overflow = '';
                // 5. Restore focus
                if (lastActiveElement) lastActiveElement.focus();
            };
        } else {
            // Cleanup if needed (redundant usually due to return above, but safe)
            document.body.style.overflow = '';
        }
    }, [selectedProject]);

    const isMobile = useIsMobile();
    const [activeProjectIndex, setActiveProjectIndex] = useState(0);

    // Mobile Swipe Handler
    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x > 100) {
            setActiveProjectIndex(prev => Math.max(0, prev - 1));
        } else if (info.offset.x < -100) {
            setActiveProjectIndex(prev => Math.min(projects.length - 1, prev + 1));
        }
    };
    const currentProject = projects[activeProjectIndex];

    // GSAP Horizontal Scroll Setup
    useLayoutEffect(() => {
        if (isMobile) return; // Don't run GSAP on mobile for this section, use swipe

        const ctx = gsap.context(() => {
            const container = horizontalScrollRef.current;
            const totalWidth = container?.scrollWidth;
            const viewportWidth = window.innerWidth;

            if (container && totalWidth) {
                gsap.to(container, {
                    x: () => -(totalWidth - viewportWidth),
                    ease: "none",
                    scrollTrigger: {
                        trigger: triggerRef.current,
                        start: "top top",
                        end: () => `+=${totalWidth}`,
                        scrub: 1,
                        pin: true,
                        invalidateOnRefresh: true,
                        anticipatePin: 1
                    }
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [isMobile]);

    const [ref, inView] = useInView({ threshold: 0.1 });

    return (
        <section
            ref={(node) => {
                // @ts-ignore
                sectionRef.current = node;
                ref(node);
            }}
            className="bg-off-white relative z-10 overflow-hidden"
            id="work"
        >
            {inView && (
                <Helmet>
                    <title>Selected Work | Saurabh Lokhande</title>
                    <meta name="description" content="Explore my latest AI projects including Deep RAG Systems, Autonomous Agents, and Generative UI." />
                </Helmet>
            )}

            {isMobile ? (
                // Mobile Layout (Unchanged mostly, just structured better)
                <div className="py-16 px-4">
                    <div className="mb-8 text-center">
                        <ScrollReveal>
                            <h2 className="text-[10vw] font-bold leading-none tracking-tighter uppercase mb-2">Selected Work</h2>
                            <p className="text-gray-500">Swipe to explore projects.</p>
                        </ScrollReveal>
                    </div>

                    <div className="min-h-[60vh] flex items-center justify-center relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeProjectIndex}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.2}
                                onDragEnd={handleDragEnd}
                                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="w-full max-w-sm bg-white border border-gray-200 shadow-xl rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img src={currentProject.image} alt={currentProject.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-mono border border-white/20">
                                        {activeProjectIndex + 1} / {projects.length}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">{currentProject.category}</span>
                                    <h3 className="text-2xl font-bold mt-2 mb-4 leading-tight">{currentProject.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-3 mb-6">{currentProject.description}</p>
                                    <button
                                        onClick={() => { setSelectedProject(currentProject); addLog(`Opening Project Details: ${currentProject.title}`, 'success', 'NAV'); }}
                                        className="w-full py-3 bg-black text-white rounded-lg text-sm uppercase tracking-wider font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        View Case Study <ArrowUpRight size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                        <div className="absolute bottom-[-40px] flex gap-2">
                            {projects.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeProjectIndex ? 'bg-black w-6' : 'bg-gray-300'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                // Desktop Horizontal Scroll Layout
                <div ref={triggerRef} className="h-screen w-full flex flex-col justify-center relative">
                    <div className="absolute top-12 left-12 z-20">
                        <ScrollReveal>
                            <h2 className="text-[4vw] font-bold leading-none tracking-tighter uppercase">
                                Selected Work <span className="text-lg font-normal text-gray-500 normal-case tracking-normal block mt-2">Scroll &rarr;</span>
                            </h2>
                        </ScrollReveal>
                    </div>

                    <div ref={horizontalScrollRef} className="flex gap-12 md:gap-24 px-12 md:px-24 items-center h-[70vh] w-max">
                        {/* Intro Card */}
                        <div className="w-[80vw] md:w-[30vw] shrink-0 max-w-md">
                            <ScrollReveal delay={0.2}>
                                <p className="text-xl md:text-2xl leading-relaxed text-gray-600">
                                    A curated collection of AI-driven applications, utilizing modern architectures like RAG, Multi-Agent Systems, and Generative UI to solve complex problems.
                                </p>
                            </ScrollReveal>
                        </div>

                        {/* Project Cards */}
                        {projects.map((project, index) => (
                            <div
                                key={index}
                                className="group relative w-[60vh] h-[40vh] md:w-[70vh] md:h-[50vh] shrink-0 bg-white border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
                                onClick={() => { setSelectedProject(project); addLog(`Opening Project: ${project.title}`, 'success', 'NAV'); }}
                            >
                                <div className="absolute inset-0 overflow-hidden">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                                </div>

                                <div className="absolute bottom-0 left-0 w-full p-8 text-white z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="text-xs font-mono uppercase tracking-widest bg-white/20 backdrop-blur-sm px-2 py-1 mb-4 inline-block">{project.category}</span>
                                            <h3 className="text-4xl font-bold tracking-tight mb-2">{project.title}</h3>
                                        </div>
                                        <ArrowUpRight className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-2" />
                                    </div>
                                    <p className="text-gray-200 line-clamp-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        {project.description}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* View All / End Card */}
                        <div className="w-[30vw] shrink-0 flex items-center justify-center">
                            <Magnetic>
                                <a
                                    href="https://github.com/saurabhmj11"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-48 h-48 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold uppercase tracking-widest hover:scale-110 transition-transform duration-300"
                                >
                                    View All
                                </a>
                            </Magnetic>
                        </div>
                    </div>
                </div>
            )}

            {/* Project Modal (Overlay) */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedProject(null)}
                        className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[1000] p-0 md:p-6"
                        role="dialog"
                        aria-modal="true"
                        aria-label={selectedProject.title}
                        tabIndex={-1}
                        ref={modalRef}
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white w-full max-w-5xl h-full md:h-auto md:max-h-[90vh] md:rounded-2xl overflow-hidden relative flex flex-col"
                        >
                            {/* Sticky Header */}
                            <div className="sticky top-0 left-0 right-0 z-50 flex justify-between items-center p-6 bg-white/90 backdrop-blur-md border-b border-gray-100">
                                <div>
                                    <span className="text-xs font-mono text-blue-600 uppercase tracking-widest block md:hidden">{selectedProject.category}</span>
                                    <h3 className="text-xl md:text-2xl font-bold tracking-tight md:hidden">{selectedProject.title}</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="p-3 hover:bg-gray-100 rounded-full transition-colors border border-gray-200 group"
                                >
                                    <X className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="overflow-y-auto p-6 md:p-12 pb-24 flex-1">
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div>
                                        <span className="text-sm font-mono text-blue-600 uppercase tracking-widest mb-4 hidden md:block">{selectedProject.category}</span>
                                        <h3 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 hidden md:block">{selectedProject.title}</h3>
                                        <p className="text-lg leading-relaxed text-gray-700 mb-8 font-medium">{selectedProject.description}</p>

                                        <div className="space-y-8 mb-12">
                                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                                <h4 className="font-bold uppercase tracking-widest text-xs mb-3 text-gray-400">The Problem</h4>
                                                <p className="text-gray-700 leading-relaxed font-light">{selectedProject.details.problem}</p>
                                            </div>
                                            <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                                                <h4 className="font-bold uppercase tracking-widest text-xs mb-3 text-blue-400">The Solution</h4>
                                                <p className="text-gray-800 leading-relaxed font-medium">{selectedProject.details.solution}</p>
                                            </div>
                                        </div>

                                        <div className="mb-12">
                                            <h4 className="font-bold uppercase tracking-widest text-xs mb-4 text-gray-400">Tech Stack</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedProject.technologies.map((tech) => (
                                                    <span key={tech} className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-bold tracking-wide uppercase shadow-sm">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-4">
                                            {selectedProject.link && (
                                                <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform duration-300 shadow-xl hover:shadow-2xl">
                                                    View Live Demo <ArrowUpRight className="w-4 h-4" />
                                                </a>
                                            )}
                                            <a href={selectedProject.repo || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center gap-2 bg-white text-black border border-gray-200 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-gray-50 transition-colors">
                                                GitHub Repo <ArrowUpRight className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="aspect-video bg-gray-100 overflow-hidden rounded-xl shadow-lg border border-gray-200">
                                            <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                                        </div>

                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                                <h5 className="font-bold text-xs mb-4 uppercase tracking-widest text-gray-500">System Architecture</h5>
                                                <p className="text-sm text-gray-600 leading-relaxed font-mono">{selectedProject.details.architecture}</p>
                                            </div>

                                            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                    <h5 className="font-bold text-xs uppercase tracking-widest text-green-600">Measurable Impact</h5>
                                                </div>
                                                <p className="text-lg font-bold text-gray-900 leading-tight">{selectedProject.details.impact}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Projects;
