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
import VelocityText from './VelocityText';
import ScrambleText from './ScrambleText';

gsap.registerPlugin(ScrollTrigger);

interface Project {
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
    link?: string;
    repo?: string;
}

const projects: Project[] = [
    {
        id: 'hiremeos',
        title: 'HireMeOS',
        category: 'LLM Systems • AI Agents',
        description: 'An autonomous AI operating system that plans, executes, and explains complex data analysis using LLM agents.',
        image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2670&auto=format&fit=crop',
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
        id: 'ocr-pipeline',
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
        id: 'student-recsys',
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
        id: 'submaster',
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
        id: 'web-intel',
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
    const modalRef = useRef<HTMLDivElement>(null);

    // Accessibility & Body Lock Effect
    useEffect(() => {
        let lastActiveElement: HTMLElement | null = null;
        if (selectedProject) {
            document.body.style.overflow = 'hidden';
            lastActiveElement = document.activeElement as HTMLElement;
            requestAnimationFrame(() => {
                modalRef.current?.focus();
            });
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') setSelectedProject(null);
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
                document.body.style.overflow = '';
                if (lastActiveElement) lastActiveElement.focus();
            };
        }
    }, [selectedProject]);

    const isMobile = useIsMobile();
    const [activeProjectIndex, setActiveProjectIndex] = useState(0);

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x > 100) {
            setActiveProjectIndex(prev => Math.max(0, prev - 1));
        } else if (info.offset.x < -100) {
            setActiveProjectIndex(prev => Math.min(projects.length - 1, prev + 1));
        }
    };
    const currentProject = projects[activeProjectIndex];

    useLayoutEffect(() => {
        if (isMobile) return;

        const ctx = gsap.context(() => {
            const container = horizontalScrollRef.current;

            // Force refresh to ensure correct dimensions
            ScrollTrigger.refresh();

            if (container) {
                const totalWidth = container.scrollWidth;
                const viewportWidth = window.innerWidth;
                const scrollDistance = totalWidth - viewportWidth;

                gsap.to(container, {
                    x: -scrollDistance,
                    ease: "none",
                    scrollTrigger: {
                        trigger: triggerRef.current,
                        start: "top top",
                        end: () => `+=${totalWidth}`,
                        scrub: 1,
                        pin: true,
                        invalidateOnRefresh: true,
                        anticipatePin: 1,
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
            className="bg-black relative z-10 overflow-hidden w-full max-w-full"
            id="projects"
        >
            {inView && (
                <Helmet>
                    <title>Selected Work | Saurabh Lokhande</title>
                    <meta name="description" content="Explore my latest AI projects including Deep RAG Systems, Autonomous Agents, and Generative UI." />
                </Helmet>
            )}

            {isMobile ? (
                <div className="py-16 px-4 w-full">
                    <div className="mb-8 text-center">
                        <ScrollReveal>
                            <h2 className="text-[10vw] font-display font-bold leading-none tracking-tighter uppercase mb-2">
                                <ScrambleText text="Selected Work" />
                            </h2>
                            <p className="text-gray-500">Swipe to explore projects.</p>
                        </ScrollReveal>
                    </div>

                    <div className="min-h-[60vh] flex items-center justify-center relative w-full overflow-hidden">
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
                                className="w-full max-w-[90vw] sm:max-w-sm bg-white border border-gray-200 shadow-xl rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
                            >
                                <div className="h-48 overflow-hidden relative w-full">
                                    <img src={currentProject.image} alt={currentProject.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-mono border border-white/20">
                                        {activeProjectIndex + 1} / {projects.length}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">{currentProject.category}</span>
                                    <h3 className="text-2xl font-display font-bold mt-2 mb-4 leading-tight">{currentProject.title}</h3>
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
                <div ref={triggerRef} className="h-screen w-full flex flex-col justify-center relative bg-black">
                    {/* Background Marquee - High Visibility */}
                    <div className="absolute top-64 left-0 w-full z-0 pointer-events-none select-none overflow-hidden">
                        <div className="opacity-100 text-[#333] text-[15vw] font-black leading-none whitespace-nowrap">
                            <VelocityText baseVelocity={-2}>SELECTED WORK — SELECTED WORK —</VelocityText>
                        </div>
                    </div>

                    {/* Static Header */}
                    <div className="absolute top-32 left-0 w-full text-center z-20 pointer-events-none">
                        <ScrollReveal>
                            <h2 className="text-sm md:text-base font-mono text-blue-400 uppercase tracking-[0.4em] mb-2">
                                <ScrambleText text="Featured Projects" />
                            </h2>
                        </ScrollReveal>
                    </div>

                    <div ref={horizontalScrollRef} className="flex gap-12 md:gap-24 px-12 md:px-24 items-center h-[70vh] w-max relative z-10">
                        {/* Intro Card */}
                        <div className="w-[80vw] md:w-[30vw] shrink-0 max-w-md relative">
                            {/* Optional subtle glow behind text for contrast */}
                            <div className="absolute inset-0 bg-black/40 blur-2xl z[-1]" />
                            <ScrollReveal delay={0.2}>
                                <p className="text-xl md:text-2xl leading-relaxed text-gray-200 font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                    A curated collection of AI-driven applications, utilizing modern architectures like RAG, Multi-Agent Systems, and Generative UI to solve complex problems.
                                </p>
                            </ScrollReveal>
                        </div>

                        {/* Project Cards */}
                        {projects.map((project, index) => (
                            <motion.div
                                key={index}
                                layoutId={`project-container-${project.id}`}
                                whileHover={{ y: -20, scale: 1.02 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="group relative w-[80vw] md:w-[70vh] max-w-[600px] h-[40vh] md:h-[50vh] min-h-[400px] shrink-0 bg-[#0a0a0a] border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-500 cursor-pointer overflow-hidden rounded-2xl"
                                onClick={() => { setSelectedProject(project); addLog(`Opening Project: ${project.title}`, 'success', 'NAV'); }}
                            >
                                <div className="absolute inset-0 overflow-hidden">
                                    <motion.img
                                        layoutId={`project-image-${project.id}`}
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                                </div>

                                <div className="absolute bottom-0 left-0 w-full p-8 text-white z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="flex justify-between items-end">
                                        <div className="flex-1">
                                            <span className="text-xs font-mono uppercase tracking-widest bg-white/10 backdrop-blur-md px-3 py-1 mb-4 inline-block border border-white/20 rounded-full text-blue-300 shadow-glow">{project.category}</span>
                                            <div className="overflow-hidden">
                                                <motion.h3 layoutId={`project-title-${project.id}`} className="text-4xl font-display font-bold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                                    {project.title}
                                                </motion.h3>
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-black mb-2">
                                            <ArrowUpRight className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <p className="text-gray-300 line-clamp-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 font-light">
                                        {project.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}

                        {/* View All / End Card */}
                        <div className="w-[30vw] shrink-0 flex items-center justify-center">
                            <Magnetic>
                                <a
                                    href="https://github.com/saurabhmj11"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-48 h-48 rounded-full bg-white text-black flex items-center justify-center text-xl font-display font-bold uppercase tracking-widest hover:scale-110 transition-transform duration-300"
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
                            layoutId={`project-container-${selectedProject.id}`}
                            onClick={e => e.stopPropagation()}
                            className="bg-white w-full max-w-5xl h-full md:h-auto md:max-h-[90vh] md:rounded-2xl overflow-hidden relative flex flex-col"
                        >
                            <div className="sticky top-0 left-0 right-0 z-50 flex justify-between items-center p-6 bg-white/90 backdrop-blur-md border-b border-gray-100">
                                <div>
                                    <span className="text-xs font-mono text-blue-600 uppercase tracking-widest block md:hidden">{selectedProject.category}</span>
                                    <h3 className="text-xl md:text-2xl font-display font-bold tracking-tight md:hidden">{selectedProject.title}</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="p-3 hover:bg-gray-100 rounded-full transition-colors border border-gray-200 group"
                                >
                                    <X className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" />
                                </button>
                            </div>

                            <div className="overflow-y-auto p-6 md:p-12 pb-24 flex-1">
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div>
                                        <span className="text-sm font-mono text-blue-600 uppercase tracking-widest mb-4 hidden md:block">{selectedProject.category}</span>
                                        <motion.h3 layoutId={`project-title-${selectedProject.id}`} className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6 hidden md:block">{selectedProject.title}</motion.h3>
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
                                                <Magnetic>
                                                    <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform duration-300 shadow-xl hover:shadow-2xl">
                                                        View Live Demo <ArrowUpRight className="w-4 h-4" />
                                                    </a>
                                                </Magnetic>
                                            )}
                                            <Magnetic>
                                                <a href={selectedProject.repo || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center gap-2 bg-white text-black border border-gray-200 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-gray-50 transition-colors">
                                                    GitHub Repo <ArrowUpRight className="w-4 h-4" />
                                                </a>
                                            </Magnetic>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="aspect-video bg-gray-100 overflow-hidden rounded-xl shadow-lg border border-gray-200">
                                            <motion.img layoutId={`project-image-${selectedProject.id}`} src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
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
