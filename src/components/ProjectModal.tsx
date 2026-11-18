import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, ArrowRight, PlayCircle } from 'lucide-react';
import Magnetic from './Magnetic';
import OptimizedImage from './OptimizedImage';
import type { Project } from '../data/projectsData';

interface ProjectModalProps {
    project: Project | null;
    onClose: () => void;
}

/** Full-screen project detail ("node insight"), shared by every way of opening a project. */
const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Scroll lock, focus management and Escape-to-close
    useEffect(() => {
        if (!project) return;
        const lastActive = document.activeElement as HTMLElement | null;
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => modalRef.current?.focus());
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
            lastActive?.focus();
        };
    }, [project, onClose]);

    return (
        <AnimatePresence>
            {project && (
                <motion.div
                    key={project.id}
                    initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                    animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
                    exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    onClick={onClose}
                    className="fixed inset-0 bg-[#020202]/90 flex items-center justify-center z-[1000] p-0 md:p-12 overflow-hidden"
                    role="dialog"
                    aria-modal="true"
                    aria-label={project.title}
                    tabIndex={-1}
                    ref={modalRef}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.98 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        onClick={e => e.stopPropagation()}
                        className="bg-[#0a0a0a] w-full max-w-7xl h-full md:h-[90vh] md:rounded-[3rem] overflow-hidden relative flex flex-col border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)]"
                    >
                        {/* Header */}
                        <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-8 mix-blend-difference pointer-events-none">
                            <span className="text-xs font-mono text-white uppercase tracking-[0.3em] block">NODE INSIGHT</span>
                            <button
                                onClick={onClose}
                                aria-label="Close project details"
                                className="p-4 rounded-full transition-transform hover:scale-110 border border-white/20 pointer-events-auto bg-black/20 backdrop-blur-md"
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row h-full">
                            {/* Image */}
                            <div className="w-full md:w-1/2 h-[50vh] md:h-full relative overflow-hidden bg-black">
                                <OptimizedImage
                                    src={project.image}
                                    alt={project.title}
                                    width={1200}
                                    quality={80}
                                    className="w-full h-full object-cover filter grayscale contrast-[1.2] opacity-80"
                                    wrapperClassName="w-full h-full"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a] hidden md:block" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent block md:hidden" />
                                <div className="absolute bottom-8 left-8 right-8 z-10 md:hidden mix-blend-difference">
                                    <h3 className="text-5xl font-display font-black tracking-tighter text-white uppercase leading-[0.9]">{project.title}</h3>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="w-full md:w-1/2 h-full overflow-y-auto p-8 md:p-16 custom-scrollbar bg-[#0a0a0a] z-10">
                                <div className="hidden md:block mb-16">
                                    <span className="text-xs font-mono text-gray-500 uppercase tracking-[0.3em] mb-4 block">
                                        // CATEGORY: {project.category}
                                        {project.status === 'concept' && <span className="ml-3 text-amber-200">· Concept (no public repo or demo yet)</span>}
                                    </span>
                                    <h3 className="text-7xl font-display font-black tracking-tighter text-white uppercase leading-[0.85]">{project.title}</h3>
                                </div>

                                <div className="space-y-16">
                                    <p className="text-2xl leading-tight text-gray-300 font-light italic border-l-2 border-white/20 pl-6">{project.description}</p>

                                    <div className="grid grid-cols-1 gap-12">
                                        <div>
                                            <h4 className="font-mono uppercase tracking-[0.2em] text-xs mb-4 text-gray-500 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> SYSTEM DEFICIENCY</h4>
                                            <p className="text-gray-300 leading-relaxed font-light text-lg">{project.details.problem}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-mono uppercase tracking-[0.2em] text-xs mb-4 text-gray-500 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> IMPLEMENTED SOLUTION</h4>
                                            <p className="text-white leading-relaxed font-medium text-lg">{project.details.solution}</p>
                                        </div>
                                    </div>

                                    {project.metrics.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                            {project.metrics.map(m => (
                                                <div key={m.label} className="border-l border-white/10 pl-4">
                                                    <span className="block text-3xl font-display font-black text-white">{m.value}</span>
                                                    <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 mt-1">{m.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div>
                                        <h4 className="font-mono uppercase tracking-[0.2em] text-xs mb-6 text-gray-500">TECHNOLOGY STACK</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {project.technologies.map(tech => (
                                                <span key={tech} className="px-5 py-2.5 bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-gray-300 uppercase">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white/5 p-8 border border-white/5">
                                        <h5 className="font-mono text-xs mb-4 uppercase tracking-[0.2em] text-gray-500">ARCHITECTURE METADATA</h5>
                                        <p className="text-sm text-gray-400 leading-relaxed font-mono">{project.details.architecture}</p>
                                    </div>

                                    {project.liveUrl && project.liveNote && (
                                        <p className="text-sm text-gray-300">{project.liveNote}</p>
                                    )}
                                    <div className="flex flex-col md:flex-row gap-6 pt-8 border-t border-white/10">
                                        <Magnetic>
                                            <Link
                                                to={`/project/${project.id}`}
                                                className="inline-flex justify-center items-center gap-3 bg-white text-black px-8 py-5 font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors w-full md:w-auto text-center no-underline"
                                            >
                                                View Full Case Study <ArrowRight className="w-5 h-5" />
                                            </Link>
                                        </Magnetic>
                                        {project.liveUrl && (
                                            <Magnetic>
                                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center gap-3 bg-blue-600 text-white px-8 py-5 font-bold uppercase tracking-widest text-sm hover:bg-blue-500 transition-colors w-full md:w-auto text-center">
                                                    Live Demo <ArrowUpRight className="w-5 h-5" />
                                                </a>
                                            </Magnetic>
                                        )}
                                        {project.demoVideo && (
                                            <Magnetic>
                                                <a href={project.demoVideo.url} target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center gap-3 bg-transparent text-white border border-cyan-300/50 px-8 py-5 font-bold uppercase tracking-widest text-sm hover:bg-cyan-500/15 transition-colors w-full md:w-auto text-center">
                                                    Demo video <PlayCircle className="w-5 h-5" aria-hidden="true" />
                                                    <span className="sr-only">(opens LinkedIn in a new tab)</span>
                                                </a>
                                            </Magnetic>
                                        )}
                                        {project.repo && (
                                            <Magnetic>
                                                <a href={project.repo} target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center gap-3 bg-transparent text-white border border-white/20 px-8 py-5 font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-colors w-full md:w-auto text-center">
                                                    Access Source <ArrowUpRight className="w-5 h-5" />
                                                </a>
                                            </Magnetic>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProjectModal;
