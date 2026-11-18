import { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ArrowUpRight, PlayCircle } from 'lucide-react';
import { useAudioDirector } from '../context/AudioContext';
import useIsMobile from '../hooks/useIsMobile';
import { prefersReducedMotion } from '../hooks/useIdleReady';
import ScrollReveal from './ScrollReveal';
import ScrambleText from './ScrambleText';
import OptimizedImage from './OptimizedImage';
import ProjectModal from './ProjectModal';
import RagJourney from './journey/RagJourney';
import projectsData, { type Project } from '../data/projectsData';

/**
 * Selected Work.
 *
 * Desktop: a scroll-driven embedding space of the projects — a live RAG pass
 * (query → retrieve → generate) where every project node is clickable.
 * Everyone (and the only view on phones / reduced motion): a card grid of all
 * projects. Both open the same project detail modal.
 */
const Projects = () => {
    const [selected, setSelected] = useState<Project | null>(null);
    const isMobile = useIsMobile();
    const showJourney = !isMobile && !prefersReducedMotion();
    const [ref, inView] = useInView({ threshold: 0.05 });

    const { playSectionChime } = useAudioDirector();
    useEffect(() => {
        if (inView) playSectionChime('projects');
    }, [inView, playSectionChime]);

    const openById = useCallback((id: string) => {
        const p = projectsData.find(x => x.id === id);
        if (p) setSelected(p);
    }, []);
    const close = useCallback(() => setSelected(null), []);

    return (
        <section ref={ref} id="projects" className="relative z-10 w-full bg-background">

            {/* Heading */}
            <div className="max-w-7xl mx-auto px-6 pt-24 md:pt-32 pb-10 md:pb-16">
                <ScrollReveal>
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-[0.3em] mb-4 block">// SELECTED WORK</span>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <h2 className="text-[clamp(2.75rem,8vw,6.5rem)] font-display font-black leading-[0.9] tracking-tighter uppercase text-white">
                            <ScrambleText text="Selected" />
                            <span className="text-gray-500 italic ml-4"><ScrambleText text="Works" /></span>
                        </h2>
                        <p className="max-w-sm text-gray-400 font-mono text-xs leading-relaxed border-l border-white/10 pl-4">
                            {showJourney
                                ? 'Scroll to watch retrieval search my work. Click any project to open it.'
                                : 'Tap a project to open the details.'}
                        </p>
                    </div>
                </ScrollReveal>
            </div>

            {showJourney && <RagJourney onSelect={openById} />}

            {/* All projects */}
            <div id="projects-grid" className="max-w-7xl mx-auto px-6 pb-24 md:pb-32 scroll-mt-24">
                {showJourney && (
                    <h3 className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-gray-500">
                        All {projectsData.length} projects
                    </h3>
                )}
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {projectsData.map((project, i) => (
                        <li key={project.id}>
                            <button
                                type="button"
                                onClick={() => setSelected(project)}
                                className="group w-full h-full text-left rounded-3xl overflow-hidden border border-white/10 bg-white/[0.03] hover:border-cyan-400/40 hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 transition-colors duration-300 flex flex-col"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <OptimizedImage
                                        src={project.image}
                                        alt=""
                                        width={600}
                                        quality={65}
                                        className="w-full h-full object-cover grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                        wrapperClassName="w-full h-full"
                                    />
                                    <span className="absolute top-4 left-4 text-[10px] font-mono tracking-widest text-white/80 bg-black/40 backdrop-blur px-2 py-1 rounded-full">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                </div>
                                <div className="p-6 flex flex-col gap-3 flex-1">
                                    <span className="flex flex-wrap items-center gap-2">
                                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-300/80">{project.category}</span>
                                        {project.demoVideo && (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-200 border border-cyan-300/40 rounded-full px-2 py-0.5">
                                                <PlayCircle className="w-3 h-3" aria-hidden="true" /> Demo video
                                            </span>
                                        )}
                                        {project.status === 'concept' && (
                                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-200 border border-amber-300/40 rounded-full px-2 py-0.5">Concept</span>
                                        )}
                                    </span>
                                    <span className="flex items-start justify-between gap-3">
                                        <span className="text-2xl font-display font-bold text-white leading-tight">{project.title}</span>
                                        <ArrowUpRight className="w-5 h-5 shrink-0 text-gray-500 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                                    </span>
                                    {project.metrics.length > 0 && (
                                        // The proof, visible without opening the card.
                                        <span className="flex flex-wrap gap-x-5 gap-y-2">
                                            {project.metrics.slice(0, 2).map(m => (
                                                <span key={m.label} className="flex flex-col">
                                                    <span className="text-xl font-display font-bold text-cyan-200 tabular-nums">{m.value}</span>
                                                    <span className="text-[11px] font-mono text-gray-400">{m.label}</span>
                                                </span>
                                            ))}
                                        </span>
                                    )}
                                    <span className="text-sm text-gray-400 leading-relaxed line-clamp-3">{project.description}</span>
                                    <span className="mt-auto pt-3 flex flex-wrap gap-2">
                                        {project.technologies.slice(0, 4).map(t => (
                                            <span key={t} className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-gray-400 border border-white/10 rounded-full">{t}</span>
                                        ))}
                                    </span>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <ProjectModal project={selected} onClose={close} />
        </section>
    );
};

export default Projects;
