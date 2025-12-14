import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';
import Magnetic from './Magnetic';
// import DistortionImage from './DistortionImage';
import ErrorBoundary from './ErrorBoundary';

interface Project {
    title: string;
    category: string;
    description: string;
    image: string;
    technologies: string[];
}

const projects: Project[] = [
    {
        title: 'Deep RAG System',
        category: 'Knowledge Engineering',
        description: 'A "Chat with Complex Data" system capable of handling financial reports and legal docs. Features hybrid search (BM25 + Semantic), precise citations, multi-turn state management, and RAGAS evaluation.',
        image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2670&auto=format&fit=crop',
        technologies: ['Pinecone', 'LangChain', 'OpenAI', 'Python'],
    },
    {
        title: 'Autonomous Research Agent',
        category: 'Agentic Workflow',
        description: 'An autonomous agent that executes complex research tasks. It breaks down vague prompts, browses the web, plans sub-tasks, self-corrects errors, and compiles comprehensive reports.',
        image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2670&auto=format&fit=crop',
        technologies: ['AutoGPT', 'SerpAPI', 'React Flow', 'Node.js'],
    },
    {
        title: 'Multi-Agent Orchestration',
        category: 'System Architecture',
        description: 'A simulation of a software development team managed by AI. Includes Supervisor, Coder, Reviewer, and Designer agents working in harmony with human-in-the-loop approval steps.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop',
        technologies: ['LangGraph', 'Autogen', 'Docker', 'Python'],
    },
    {
        title: 'Generative UI Experience',
        category: 'Generative Frontend',
        description: 'A dynamic interface builder where the AI generates structured JSON to render real React components (charts, forms) on the fly, streaming the UI in real-time.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop',
        technologies: ['Next.js', 'Vercel AI SDK', 'Zod', 'Tailwind'],
    },
    {
        title: 'Multimodal Assistant',
        category: 'Vision & Voice',
        description: 'A real-time voice and vision assistant. It can analyze UI mockups to generate code and hold low-latency voice conversations using advanced multimodal models.',
        image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=2670&auto=format&fit=crop',
        technologies: ['GPT-4o', 'Whisper', 'ElevenLabs', 'React Native'],
    }
];

interface ProjectItemProps {
    project: Project;
    index: number;
    setHoveredProject: (p: Project | null) => void;
    setSelectedProject: (p: Project) => void;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, index, setHoveredProject, setSelectedProject }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Parallax effect: Shift X slightly based on scroll
    const x = useTransform(scrollYProgress, [0, 1], [-50, 50]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

    return (
        <motion.div
            ref={ref}
            style={{ x, opacity }}
            onMouseEnter={() => setHoveredProject(project)}
            onMouseLeave={() => setHoveredProject(null)}
            onClick={() => setSelectedProject(project)}
            className="group relative border-b border-gray-300 py-12 flex flex-col md:flex-row justify-between items-center cursor-pointer transition-colors hover:bg-white/50"
        >
            <div className="flex items-center gap-4 md:gap-8 w-full">
                <span className="text-gray-400 font-mono text-sm">0{index + 1}</span>
                <h3 className="text-3xl md:text-5xl font-bold tracking-tight group-hover:translate-x-4 transition-transform duration-300">
                    {project.title}
                </h3>
            </div>

            <div className="flex items-center gap-8 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                <span className="text-gray-500 uppercase tracking-widest text-sm">{project.category}</span>
                <ArrowUpRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
        </motion.div>
    )
}

const Projects = () => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
    }

    return (
        <section
            className="py-24 px-4 md:px-8 bg-off-white relative z-10 overflow-hidden"
            id="work"
            onMouseMove={handleMouseMove}
        >
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-gray-300 pb-8">
                    <h2 className="text-[10vw] md:text-[6vw] font-bold leading-none tracking-tighter uppercase">
                        Selected<br />Work
                    </h2>
                    <p className="text-gray-500 text-lg md:max-w-xs text-right mt-8 md:mt-0">
                        A collection of projects pushing the boundaries of AI, Design, and Engineering.
                    </p>
                </div>

                <div className="flex flex-col">
                    {projects.map((project, index) => (
                        <ProjectItem
                            key={project.title}
                            project={project}
                            index={index}
                            setHoveredProject={setHoveredProject}
                            setSelectedProject={setSelectedProject}
                        />
                    ))}
                </div>

                <div className="flex justify-center mt-24">
                    <Magnetic>
                        <a
                            href="/work"
                            className="group flex items-center gap-4 px-10 py-5 border border-gray-300 rounded-full text-lg uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-500"
                        >
                            <span>View All Projects</span>
                            <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                        </a>
                    </Magnetic>
                </div>

                <AnimatePresence>
                    {hoveredProject && (
                        <motion.div
                            initial={{ opacity: 0, clipPath: "inset(50% 0 50% 0)" }}
                            animate={{
                                opacity: 1,
                                clipPath: "inset(0% 0 0% 0)",
                                x: mousePosition.x - 200,
                                y: mousePosition.y - 150
                            }}
                            exit={{ opacity: 0, clipPath: "inset(50% 0 50% 0)" }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 25,
                                clipPath: { duration: 0.4, ease: "circIn" }
                            }}
                            className="fixed top-0 left-0 pointer-events-none z-50 hidden lg:block w-[400px] h-[300px] overflow-hidden rounded-lg shadow-2xl bg-black"
                        >
                            {/* WebGL Distortion Effect */}
                            {/* <ErrorBoundary fallback={
                                <motion.img
                                    src={hoveredProject.image}
                                    alt={hoveredProject.title}
                                    className="w-full h-full object-cover"
                                    initial={{ scale: 1.2, filter: "grayscale(100%)" }}
                                    animate={{ scale: 1, filter: "grayscale(0%)" }}
                                    exit={{ scale: 1.2 }}
                                    transition={{ duration: 0.5 }}
                                />
                            }>
                                <DistortionImage 
                                    image={hoveredProject.image}
                                    className="w-full h-full"
                                />
                            </ErrorBoundary> */}
                            <motion.img
                                src={hoveredProject.image}
                                alt={hoveredProject.title}
                                className="w-full h-full object-cover"
                                initial={{ scale: 1.2, filter: "grayscale(100%)" }}
                                animate={{ scale: 1, filter: "grayscale(0%)" }}
                                exit={{ scale: 1.2 }}
                                transition={{ duration: 0.5 }}
                            />
                            {/* Scanline Effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-20 pointer-events-none" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {selectedProject && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProject(null)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
                        >
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 100, opacity: 0 }}
                                onClick={e => e.stopPropagation()}
                                className="bg-white p-8 md:p-12 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <h3 className="text-4xl font-bold tracking-tighter">{selectedProject.title}</h3>
                                    <button onClick={() => setSelectedProject(null)}>
                                        <X className="w-8 h-8" />
                                    </button>
                                </div>

                                <img
                                    src={selectedProject.image}
                                    alt={selectedProject.title}
                                    className="w-full h-[400px] object-cover mb-8 filter grayscale hover:grayscale-0 transition-all duration-500"
                                />

                                <p className="text-xl leading-relaxed text-gray-700 mb-8">{selectedProject.description}</p>

                                <div className="space-y-2">
                                    <h4 className="font-bold uppercase tracking-widest text-sm">Technologies</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.technologies.map((tech) => (
                                            <span key={tech} className="px-4 py-2 border border-black rounded-full text-sm">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Projects;
