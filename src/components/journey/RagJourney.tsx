import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { buildEmbeddingSpace, DIMS, QUERY, TOP_K } from './embedding';
import projectsData from '../../data/projectsData';
import { useIdleReady } from '../../hooks/useIdleReady';
import { scrollToSection } from '../../utils/scrollToSection';
import type { SceneProgress } from './EmbeddingScene';

const EmbeddingScene = React.lazy(() => import('./EmbeddingScene'));

/** Scroll-progress boundaries for the three captions. Mirrors stages() in the scene. */
const STAGES = [
    { from: 0.1, to: 0.32 },  // 01 query
    { from: 0.32, to: 0.58 }, // 02 retrieve
    { from: 0.58, to: 1.01 }, // 03 generate — stays until the scene fades
];

/** -1 = intro (before step 1), 0..2 = steps, 3 = finished. */
function stageAt(p: number): number {
    if (p < STAGES[0].from) return -1;
    const i = STAGES.findIndex(s => p >= s.from && p < s.to);
    return i === -1 ? STAGES.length : i;
}

/**
 * Desktop-only lead-in to the Projects section. The canvas stays sticky while
 * the visitor scrolls through a RAG pass over the projects, then hands off to
 * the project grid below. The WebGL scene (and three.js) loads only when the
 * section comes within a viewport of the screen and the browser is idle.
 */
interface RagJourneyProps {
    /** Open a project's details (by id). */
    onSelect: (projectId: string) => void;
}

const RagJourney = ({ onSelect }: RagJourneyProps) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const progress: SceneProgress = useRef(0);
    const [stage, setStage] = useState(-1);
    const [inView, setInView] = useState(false);
    const [near, setNear] = useState(false);
    const [tabVisible, setTabVisible] = useState(() => typeof document === 'undefined' || !document.hidden);
    const idle = useIdleReady();

    const space = useMemo(() => buildEmbeddingSpace(), []);
    const retrieved = useMemo(
        () => space.projects.filter(p => p.retrieved).sort((a, b) => a.rank - b.rank),
        [space]
    );

    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
    useMotionValueEvent(scrollYProgress, 'change', v => {
        progress.current = v;
        const s = stageAt(v);
        setStage(prev => (prev === s ? prev : s));
    });
    // Fade only in the last few percent so the hand-off to the grid isn't a dead black frame.
    const sceneOpacity = useTransform(scrollYProgress, [0, 0.97, 1], [1, 1, 0]);

    // Only render frames while the journey is on screen and the tab is visible.
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '100px' });
        // Start downloading three.js one viewport before the section arrives, then keep it.
        const pre = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); pre.disconnect(); } }, { rootMargin: '100% 0px' });
        pre.observe(el);
        io.observe(el);
        const onVis = () => setTabVisible(!document.hidden);
        document.addEventListener('visibilitychange', onVis);
        return () => { io.disconnect(); pre.disconnect(); document.removeEventListener('visibilitychange', onVis); };
    }, []);

    return (
        <div
            ref={sectionRef}
            id="journey"
            data-stage={stage}
            role="region"
            aria-label="How retrieval-augmented generation finds my work"
            className="relative h-[180vh] bg-background pointer-events-none"
        >
            <motion.div
                style={{ opacity: sceneOpacity }}
                className="sticky top-0 h-[100dvh] w-full overflow-hidden"
            >
                {/* Cheap CSS backdrop that shows until (and behind) the canvas */}
                <div className="absolute inset-0 mobile-mesh-bg opacity-60" aria-hidden="true" />

                {idle && near && (
                    <div className="absolute inset-0" aria-hidden="true">
                        <Suspense fallback={null}>
                            <EmbeddingScene progress={progress} active={inView && tabVisible} onSelect={onSelect} />
                        </Suspense>
                    </div>
                )}

                {/* Not everyone wants the tour: jump straight to the project grid. */}
                <button
                    type="button"
                    onClick={() => scrollToSection('#projects-grid')}
                    className="pointer-events-auto absolute top-24 left-8 lg:left-16 z-10 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/50 backdrop-blur px-4 py-2 text-sm text-white hover:bg-white hover:text-black transition-colors"
                >
                    Skip to all projects <span aria-hidden="true">↓</span>
                </button>

                {/* Vignette for legibility of captions and hero text */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(3,3,5,0.85) 100%)' }}
                    aria-hidden="true"
                />

                {/* ── Captions ── */}
                <div className="absolute inset-x-0 bottom-0 px-8 lg:px-16 pb-32 flex items-end justify-between gap-10">
                    <div className="relative w-[34rem] max-w-[46vw] min-h-[11rem]">
                        <Caption show={stage === -1} step="00" title="My work as an embedding space">
                            <p className="font-display text-2xl xl:text-3xl text-white leading-snug">
                                Each glowing cluster is a project. Click one to open it, or scroll to watch retrieval find the best matches.
                            </p>
                        </Caption>

                        <Caption show={stage === 0} step="01" title="Embed the query">
                            <p className="font-display text-2xl xl:text-3xl text-white leading-snug">“{QUERY}”</p>
                            <p className="mt-3 text-sm text-gray-400">
                                Tokenised and hashed into a {DIMS}-d vector — the same space every project lives in.
                            </p>
                        </Caption>

                        <Caption show={stage === 1} step="02" title={`Retrieve · top-${TOP_K} by cosine similarity`}>
                            <ol className="space-y-1 font-mono text-sm">
                                {retrieved.map(p => (
                                    <li key={p.id}>
                                        <button
                                            type="button"
                                            onClick={() => onSelect(p.id)}
                                            tabIndex={stage === 1 ? 0 : -1}
                                            className="pointer-events-auto group flex items-baseline gap-3 py-0.5 text-left"
                                        >
                                            <span className="text-cyan-300 tabular-nums">{p.score.toFixed(3)}</span>
                                            <span className="text-white underline decoration-white/20 underline-offset-4 group-hover:decoration-cyan-300">{p.title}</span>
                                            <span className="text-gray-500 text-xs hidden xl:inline">{p.category}</span>
                                        </button>
                                    </li>
                                ))}
                            </ol>
                        </Caption>

                        <Caption show={stage === 2} step="03" title="Generate a grounded answer">
                            <p className="font-display text-2xl xl:text-3xl text-white leading-snug">
                                Top {retrieved.length} of {space.projects.length} shipped projects by cosine score, led by Doc AI. Open one to check the evidence.
                            </p>
                            <div className="mt-5 flex flex-wrap gap-2">
                                {retrieved.map(p => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => onSelect(p.id)}
                                        tabIndex={stage === 2 ? 0 : -1}
                                        className="pointer-events-auto px-4 py-2 rounded-full border border-white/20 bg-black/40 backdrop-blur text-sm text-white hover:border-cyan-300 hover:text-cyan-200 transition-colors"
                                    >
                                        {p.title}
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => scrollToSection('#projects-grid')}
                                tabIndex={stage === 2 ? 0 : -1}
                                className="pointer-events-auto mt-4 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-cyan-200 transition-colors"
                            >
                                Browse all {projectsData.length} projects <span aria-hidden="true">↓</span>
                            </button>
                        </Caption>
                    </div>

                    {/* Progress rail */}
                    <ol className={`hidden lg:flex flex-col gap-3 mb-4 font-mono text-[10px] uppercase tracking-[0.25em] transition-opacity duration-700 ${stage < 0 ? 'opacity-0' : 'opacity-100'}`} aria-hidden="true">
                        {['Query', 'Retrieve', 'Generate'].map((label, i) => (
                            <li key={label} className={`flex items-center gap-3 transition-colors duration-500 ${stage === i ? 'text-cyan-300' : stage > i ? 'text-gray-400' : 'text-gray-700'}`}>
                                <span className={`h-px transition-all duration-500 ${stage === i ? 'w-10 bg-cyan-300' : 'w-5 bg-current'}`} />
                                {label}
                            </li>
                        ))}
                    </ol>
                </div>

                <p className={`absolute top-24 right-8 lg:right-16 max-w-[18rem] text-right font-mono text-[11px] leading-relaxed text-white/65 transition-opacity duration-700 ${stage < 0 ? 'opacity-0' : 'opacity-100'}`}>
                    Live math, not a mock-up: hashed TF-IDF embeddings of each project's write-up, real cosine scores for a sample question, seeded projection to 3D. Concept projects are excluded.
                </p>
            </motion.div>
        </div>
    );
};

function Caption({ show, step, title, children }: { show: boolean; step: string; title: string; children: React.ReactNode }) {
    return (
        <div
            aria-hidden={!show}
            className={`absolute bottom-0 left-0 w-full transition-all duration-700 ease-out ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-300/80">
                {step} — {title}
            </p>
            {children}
        </div>
    );
}

export default RagJourney;
