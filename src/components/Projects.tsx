import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from './Magnetic';
import { useAudioDirector } from '../context/AudioContext';
import useIsMobile from '../hooks/useIsMobile';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import ScrollReveal from './ScrollReveal';
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
    position: { x: string, y: string };
}

const projects: Project[] = [
    {
        id: 'hiremeos',
        title: 'HireMeOS',
        category: 'LLM Systems',
        description: 'An autonomous AI operating system that plans, executes, and explains complex data analysis using LLM agents.',
        image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2670&auto=format&fit=crop',
        technologies: ['Python', 'OpenAI', 'LangChain', 'FastAPI'],
        details: {
            problem: 'Data analysis is often fragmented, manual, and time-consuming.',
            solution: 'A multi-agent operating system where specialized agents collaborate autonomously.',
            architecture: 'LangGraph orchestrated state machine. Agents communicate via structured JSON.',
            impact: 'Reduced analysis time by 60% and achieved 80% autonomous completion rate.'
        },
        repo: 'https://github.com/saurabhmj11/hiremeos',
        link: 'https://www.linkedin.com/posts/activity-7415710665358614528-0h3Z',
        position: { x: '10%', y: '15%' }
    },
    {
        id: 'ocr-pipeline',
        title: 'OCR Pipeline',
        category: 'Automation',
        description: 'Production-grade OCR pipeline with validation, confidence scoring, and human-in-the-loop review.',
        image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?q=80&w=2670&auto=format&fit=crop',
        technologies: ['Tesseract', 'Python', 'OpenCV', 'AWS Textract'],
        details: {
            problem: 'Processing thousands of non-standardized invoices led to high error rates.',
            solution: 'A hybrid OCR pipeline combining Tesseract for speed and Textract for complex layouts.',
            architecture: 'Event-driven SQS/Lambda. Pre-processing with OpenCV.',
            impact: 'Automated 95% of processing with <1% critical error rate.'
        },
        repo: 'https://github.com/saurabhmj11/ocr-pipeline',
        position: { x: '60%', y: '5%' }
    },
    {
        id: 'student-recsys',
        title: 'RecSys Engine',
        category: 'Applied ML',
        description: 'ML-driven student recommendations based on quiz performance and learning patterns.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop',
        technologies: ['Scikit-learn', 'Pandas', 'FastAPI', 'PostgreSQL'],
        details: {
            problem: 'Generic learning paths failed to address individual student gaps.',
            solution: 'A collaborative filtering engine for personalized quizzes and materials.',
            architecture: 'Real-time inference API bridging cold-start content filtering to collaborative.',
            impact: 'Improved student engagement by 40%.'
        },
        repo: 'https://github.com/saurabhmj11/recsys-engine',
        position: { x: '25%', y: '50%' }
    },
    {
        id: 'submaster',
        title: 'SubMaster',
        category: 'Backend Architecture',
        description: 'Subscription-based SaaS backend with authentication, Stripe billing, and secure sessions.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2670&auto=format&fit=crop',
        technologies: ['Node.js', 'Stripe API', 'PostgreSQL', 'Redis'],
        details: {
            problem: 'Boilerplate SaaS backends lack robust lifecycle management.',
            solution: 'A secure, reusable microservice handling Auth, Payments, and Webhooks.',
            architecture: 'Express.js with varying middleware for RBAC. Idempotent webhook handler.',
            impact: 'Reduced initial setup time from 2 weeks to 2 days across 3 startups.'
        },
        repo: 'https://github.com/saurabhmj11/submaster',
        position: { x: '70%', y: '45%' }
    },
    {
        id: 'web-intel',
        title: 'Web Intel',
        category: 'Web Agents',
        description: 'Autonomous agent that researches, validates, and summarizes information from the web.',
        image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2670&auto=format&fit=crop',
        technologies: ['Playwright', 'OpenAI', 'BeautifulSoup', 'Celery'],
        details: {
            problem: 'Market research requires parsing hundreds of pages and handling anti-bot protections.',
            solution: 'A browsing agent navigating JS-heavy sites to extract semantic content.',
            architecture: 'Distributed scraping using Celery workers controlling headless browsers.',
            impact: 'Capable of summarizing 50+ pages of analysis in under 5 minutes.'
        },
        repo: 'https://github.com/saurabhmj11/web-agent',
        position: { x: '45%', y: '75%' }
    }
];

// Interactive Node Component (Draggable Project Card)
const ProjectNode = ({ project, index, isHovered, setHovered, setSelectedProject }: { project: Project, index: number, isHovered: boolean, setHovered: (id: string | null) => void, setSelectedProject: (p: Project) => void }) => {

    // Spring physics for hover scaling
    const scale = useSpring(1, { stiffness: 300, damping: 20 });

    // Parallax values for the image inside the node
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const smoothX = useSpring(x, { stiffness: 150, damping: 20 });
    const smoothY = useSpring(y, { stiffness: 150, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set((e.clientX - centerX) / 5);
        y.set((e.clientY - centerY) / 5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setHovered(null);
        scale.set(1);
    };

    const handleMouseEnter = () => {
        setHovered(project.id);
        scale.set(1.05);
    };

    return (
        <motion.div
            drag
            dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
            dragElastic={0.2}
            dragTransition={{ bounceStiffness: 200, bounceDamping: 20 }}
            whileDrag={{ scale: 1.1, cursor: "grabbing", zIndex: 50 }}
            style={{
                scale,
                left: project.position.x,
                top: project.position.y
            }}
            className={`absolute w-[280px] h-[350px] md:w-[350px] md:h-[450px] origin-center cursor-grab transition-opacity duration-500 ease-out z-[15] ${isHovered && project.id !== (isHovered as unknown as string) ? 'opacity-30 grayscale-[50%]' : 'opacity-100 grayscale-0'}`}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => { setSelectedProject(project); }}
            layoutId={`project-container-${project.id}`}
        >
            <div className="relative w-full h-full rounded-[2rem] overflow-hidden group border border-white/10 shadow-2xl bg-[#0a0a0a]" style={{ filter: 'url(#liquid-filter)' }}>
                {/* Embedded image with parallax */}
                <motion.div style={{ x: smoothX, y: smoothY }} className="absolute inset-[-20%] w-[140%] h-[140%]">
                    <motion.img
                        layoutId={`project-image-${project.id}`}
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover filter brightness-[0.6] contrast-[1.2] group-hover:brightness-[0.8] transition-all duration-700"
                        draggable={false}
                    />
                </motion.div>

                {/* Node Metadata (Visible on Hover) */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-difference z-20">
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-mono text-white tracking-[0.2em] font-bold">0{index + 1}</span>
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Projects = () => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

    const sectionRef = useRef<HTMLElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();
    const [ref, inView] = useInView({ threshold: 0.1 });

    const { playTrack } = useAudioDirector();
    useEffect(() => {
        if (inView) {
            playTrack('projects-intro');
        }
    }, [inView, playTrack]);

    // Handle body scroll locking
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

    // Pinning the neural web container
    useLayoutEffect(() => {
        if (isMobile) return;
        const ctx = gsap.context(() => {
            ScrollTrigger.refresh();
            ScrollTrigger.create({
                trigger: triggerRef.current,
                start: "top top",
                end: "+=150vh",
                pin: true,
                pinSpacing: true,
                scrub: true,
                anticipatePin: 1
            });
        }, sectionRef);
        return () => ctx.revert();
    }, [isMobile]);

    const hoveredProject = hoveredProjectId ? projects.find(p => p.id === hoveredProjectId) : null;

    return (
        <section
            ref={(node) => {
                // @ts-expect-error Types mismatch due to intersection observer returning Element
                sectionRef.current = node;
                ref(node);
            }}
            className="bg-[#020202] relative z-10 w-full overflow-hidden"
            id="projects"
        >
            {inView && (
                <Helmet>
                    <title>Neural Web | Saurabh Lokhande</title>
                    <meta name="description" content="Explore my latest AI projects represented as an interactive neural network." />
                </Helmet>
            )}

            {/* SVG Filter Definition for the Liquid/Gooey Distortion */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <defs>
                    <filter id="liquid-filter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="warp" />
                        <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="30" in="SourceGraphic" in2="warp" />
                    </filter>
                </defs>
            </svg>

            {isMobile ? (
                // Mobile View - Vertical Stack
                <div className="py-24 px-4 w-full min-h-screen bg-[#020202] flex flex-col justify-center">
                    <div className="mb-16 text-center">
                        <ScrollReveal>
                            <h2 className="text-[14vw] font-display font-black leading-[0.9] tracking-tighter uppercase mb-4 text-white text-center">
                                <ScrambleText text="Neural" />
                                <br />
                                <span className="text-gray-600 italic"><ScrambleText text="Web" /></span>
                            </h2>
                        </ScrollReveal>
                    </div>

                    <div className="space-y-12">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                layoutId={`project-container-${project.id}`}
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden"
                                onClick={() => setSelectedProject(project)}
                            >
                                <div className="h-64 overflow-hidden relative w-full">
                                    <motion.img layoutId={`project-image-${project.id}`} src={project.image} alt={project.title} className="w-full h-full object-cover filter grayscale contrast-125" />
                                    <div className="absolute inset-0 bg-black/40" />
                                    <div className="absolute inset-0 p-6 flex flex-col justify-between mix-blend-difference">
                                        <div className="flex justify-between items-start text-white">
                                            <span className="text-xs font-mono uppercase tracking-widest">0{index + 1}</span>
                                            <span className="text-xs font-mono uppercase tracking-widest text-right">{project.category}</span>
                                        </div>
                                        <motion.h3 layoutId={`project-title-${project.id}`} className="text-4xl font-display font-black leading-tight text-white uppercase">{project.title}</motion.h3>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : (
                // Desktop View - The Experimental Physics "Neural Web"
                <div ref={triggerRef} className="max-h-screen h-[100vh] w-full flex flex-col justify-center items-center relative custom-cursor-area overflow-hidden">

                    {/* Background Noise & Grid */}
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-5 mix-blend-screen bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-[#020202] to-[#020202]" />

                    {/* Prominent Section Heading */}
                    <div className="absolute top-12 md:top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none mix-blend-difference text-center w-full">
                        <ScrollReveal>
                            <h2 className="text-[10vw] md:text-[6vw] font-display font-black leading-[0.9] tracking-tighter uppercase mb-4 text-white">
                                <ScrambleText text="Selected" />
                                <span className="text-gray-500 italic ml-4"><ScrambleText text="Works" /></span>
                            </h2>
                        </ScrollReveal>
                    </div>

                    {/* Central Anchor Text */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none w-full text-center">
                        <h2 className="text-[12vw] font-display font-black leading-[0.8] tracking-tighter uppercase text-white/5 mx-auto select-none">
                            EXPERIMENTS
                        </h2>
                    </div>

                    {/* The Interactive Plane */}
                    <div className="relative w-full max-w-[1600px] h-[80vh] mx-auto z-10">
                        {projects.map((project, index) => (
                            <ProjectNode
                                key={project.id}
                                project={project}
                                index={index}
                                isHovered={hoveredProjectId !== null}
                                setHovered={setHoveredProjectId}
                                setSelectedProject={setSelectedProject}
                            />
                        ))}
                    </div>

                    {/* Dynamic Glitch Typography Overlay (Reacts to Hovered Node) */}
                    <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center mix-blend-difference">
                        <AnimatePresence mode="wait">
                            {hoveredProject && (
                                <motion.div
                                    key={hoveredProject.id}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="text-center w-full px-12"
                                >
                                    <span className="text-sm font-mono text-white/70 tracking-[0.5em] uppercase mb-4 block">
                                        <ScrambleText text={`// NODE_${hoveredProject.category.toUpperCase().replace(/\s+/g, '_')}`} />
                                    </span>
                                    <h3 className="text-[10vw] font-display font-black leading-[0.85] tracking-tighter text-white uppercase break-words hyphens-auto">
                                        <ScrambleText text={hoveredProject.title} />
                                    </h3>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Instruction Overlay */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 pointer-events-none opacity-40">
                        <p className="text-xs font-mono text-white uppercase tracking-[0.3em] flex items-center gap-4">
                            <span className="w-12 h-[1px] bg-white block" />
                            Drag Nodes to Explore
                            <span className="w-12 h-[1px] bg-white block" />
                        </p>
                    </div>
                </div>
            )}

            {/* Project Modal (The "Focus" State Dive) */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        onClick={() => setSelectedProject(null)}
                        className="fixed inset-0 bg-[#020202]/90 flex items-center justify-center z-[1000] p-0 md:p-12 overflow-hidden"
                        role="dialog"
                        aria-modal="true"
                        aria-label={selectedProject.title}
                        tabIndex={-1}
                        ref={modalRef}
                    >
                        <motion.div
                            layoutId={`project-container-${selectedProject.id}`}
                            onClick={e => e.stopPropagation()}
                            className="bg-[#0a0a0a] w-full max-w-7xl h-full md:h-[90vh] md:rounded-[3rem] overflow-hidden relative flex flex-col border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)]"
                        >
                            {/* Modal Header */}
                            <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-8 mix-blend-difference pointer-events-none">
                                <div>
                                    <span className="text-xs font-mono text-white uppercase tracking-[0.3em] block">NODE INSIGHT</span>
                                </div>
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="p-4 rounded-full transition-transform hover:scale-110 border border-white/20 pointer-events-auto bg-black/20 backdrop-blur-md"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            <div className="flex flex-col md:flex-row h-full">
                                {/* Left Side: Massive Hero Image */}
                                <div className="w-full md:w-1/2 h-[50vh] md:h-full relative overflow-hidden bg-black">
                                    <motion.img
                                        layoutId={`project-image-${selectedProject.id}`}
                                        src={selectedProject.image}
                                        alt={selectedProject.title}
                                        className="w-full h-full object-cover filter grayscale contrast-[1.2] opacity-80"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a] hidden md:block" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent block md:hidden" />

                                    <div className="absolute bottom-8 left-8 right-8 z-10 md:hidden mix-blend-difference">
                                        <motion.h3 layoutId={`project-title-${selectedProject.id}`} className="text-5xl font-display font-black tracking-tighter text-white uppercase leading-[0.9]">{selectedProject.title}</motion.h3>
                                    </div>
                                </div>

                                {/* Right Side: Data Payload */}
                                <div className="w-full md:w-1/2 h-full overflow-y-auto p-8 md:p-16 custom-scrollbar bg-[#0a0a0a] z-10">
                                    <div className="hidden md:block mb-16">
                                        <span className="text-xs font-mono text-gray-500 uppercase tracking-[0.3em] mb-4 block">// CATEGORY: {selectedProject.category}</span>
                                        <motion.h3 layoutId={`project-title-${selectedProject.id}`} className="text-7xl font-display font-black tracking-tighter text-white uppercase leading-[0.85] mix-blend-difference">{selectedProject.title}</motion.h3>
                                    </div>

                                    <div className="space-y-16">
                                        <p className="text-2xl leading-tight text-gray-300 font-light italic border-l-2 border-white/20 pl-6">{selectedProject.description}</p>

                                        <div className="grid grid-cols-1 gap-12">
                                            <div>
                                                <h4 className="font-mono uppercase tracking-[0.2em] text-xs mb-4 text-gray-600 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> SYSTEM DEFICIENCY</h4>
                                                <p className="text-gray-300 leading-relaxed font-light text-lg">{selectedProject.details.problem}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-mono uppercase tracking-[0.2em] text-xs mb-4 text-gray-600 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> IMPLEMENTED SOLUTION</h4>
                                                <p className="text-white leading-relaxed font-medium text-lg">{selectedProject.details.solution}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-mono uppercase tracking-[0.2em] text-xs mb-6 text-gray-600">TECHNOLOGY STACK</h4>
                                            <div className="flex flex-wrap gap-3">
                                                {selectedProject.technologies.map((tech) => (
                                                    <span key={tech} className="px-5 py-2.5 bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-gray-300 uppercase rounded-none">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-white/5 p-8 border border-white/5 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-white/5 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
                                            <h5 className="font-mono text-xs mb-4 uppercase tracking-[0.2em] text-gray-500 relative z-10">ARCHITECTURE METADATA</h5>
                                            <p className="text-sm text-gray-400 leading-relaxed font-mono relative z-10">{selectedProject.details.architecture}</p>
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-6 pt-8 border-t border-white/10">
                                            {selectedProject.link && (
                                                <Magnetic>
                                                    <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center gap-3 bg-white text-black px-8 py-5 font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors w-full md:w-auto text-center">
                                                        Execute Deployment <ArrowUpRight className="w-5 h-5" />
                                                    </a>
                                                </Magnetic>
                                            )}
                                            <Magnetic>
                                                <a href={selectedProject.repo || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center gap-3 bg-transparent text-white border border-white/20 px-8 py-5 font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-colors w-full md:w-auto text-center">
                                                    Access Source <ArrowUpRight className="w-5 h-5" />
                                                </a>
                                            </Magnetic>
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
