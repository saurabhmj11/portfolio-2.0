import React, { Suspense, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useParams, useLocation, Link, Navigate } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, ArrowUpRight, ArrowRight, ExternalLink, PlayCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLenis } from 'lenis/react';
import Magnetic from '../components/Magnetic';
import Seo from '../components/Seo';
import OptimizedImage from '../components/OptimizedImage';
import AnimatedTopology from '../components/AnimatedTopology';
import projectsData, { LEGACY_PROJECT_IDS, type Project } from '../data/projectsData';
import { parseMetric, formatMetric, type ParsedMetric } from '../utils/metrics';

// Register once at module scope (never inside a component body).
gsap.registerPlugin(ScrollTrigger, useGSAP);

// Syntax highlighting is only needed by 2 of 8 projects — keep it out of this chunk.
const CodeShowcase = React.lazy(() => import('../components/CodeShowcase'));
// The 404 page ships a 3D robot; load it only for unknown ids.
const NotFound = React.lazy(() => import('./NotFound'));

// ─── Metrics ─────────────────────────────────────────────────────────────────

const Metric = ({ value, label }: { value: string; label: string }) => {
    const parsed = parseMetric(value);
    return (
        <div className="cs-reveal p-6 md:p-8 bg-[#050505]">
            {/* Screen readers always get the final value; the animated number is decorative. */}
            <span className="sr-only">{`${label}: ${value}`}</span>
            <span
                aria-hidden="true"
                className="cs-metric block text-4xl md:text-6xl font-display font-black text-white tracking-tight tabular-nums"
                data-metric={parsed ? JSON.stringify(parsed) : undefined}
                data-final={value}
            >
                {value}
            </span>
            <span aria-hidden="true" className="block mt-3 text-[11px] font-mono uppercase tracking-[0.25em] text-gray-400">
                {label}
            </span>
        </div>
    );
};

// ─── Sections ────────────────────────────────────────────────────────────────

interface SectionDef { id: string; label: string; show: boolean }

function sectionsFor(p: Project): SectionDef[] {
    const hasLinks = Boolean(p.liveUrl || p.link || p.repo || p.demoVideo || p.links?.length);
    return [
        { id: 'challenge', label: 'Challenge', show: Boolean(p.details.problem) },
        { id: 'results', label: 'In numbers', show: p.metrics.length > 0 },
        { id: 'evaluation', label: 'Evaluation', show: Boolean(p.evaluation?.tables.length) },
        { id: 'approach', label: 'Approach', show: Boolean(p.details.solution) },
        { id: 'architecture', label: 'Architecture', show: Boolean(p.details.architecture || p.topology || p.codeHighlight) },
        { id: 'tradeoffs', label: 'Trade-offs', show: Boolean(p.tradeoffs?.length) },
        { id: 'failures', label: 'Failure modes', show: Boolean(p.failures?.length || p.openIssues?.length) },
        { id: 'stack', label: 'Stack', show: p.technologies.length > 0 },
        { id: 'impact', label: 'Impact', show: Boolean(p.details.impact) },
        { id: 'links', label: 'Try it', show: hasLinks },
    ].filter(s => s.show);
}

const DataTable = ({ caption, columns, rows, highlightRow, note }: { caption: string; columns: string[]; rows: string[][]; highlightRow?: number; note?: string }) => (
    <figure className="cs-reveal">
        <div className="overflow-x-auto border border-white/10" tabIndex={0} role="region" aria-label={caption}>
            <table className="w-full text-left text-sm font-mono">
                <caption className="text-left px-4 py-3 text-xs uppercase tracking-[0.2em] text-gray-300 border-b border-white/10 bg-white/[0.03]">{caption}</caption>
                <thead>
                    <tr className="border-b border-white/10">
                        {columns.map(c => <th key={c} scope="col" className="px-4 py-3 font-medium text-gray-400 whitespace-nowrap">{c}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr key={i} className={`border-b border-white/5 last:border-0 ${i === highlightRow ? 'bg-cyan-400/[0.07]' : ''}`}>
                            {r.map((cell, j) => j === 0
                                ? <th key={j} scope="row" className={`px-4 py-3 font-normal ${i === highlightRow ? 'text-cyan-200' : 'text-gray-200'}`}>{cell}</th>
                                : <td key={j} className={`px-4 py-3 text-gray-200 tabular-nums ${/^[~≈<>≥≤\d.,%\s]+(s|ms|%)?$/.test(cell) ? 'whitespace-nowrap' : 'min-w-[14rem]'}`}>{cell}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {note && <figcaption className="mt-3 text-sm text-gray-300 leading-relaxed">{note}</figcaption>}
    </figure>
);

const SectionHeading = ({ index, eyebrow, title, accent }: { index: number; eyebrow: string; title: string; accent: string }) => (
    <div className="cs-reveal mb-8">
        <span className={`text-xs font-mono uppercase tracking-[0.3em] flex items-center gap-3 mb-4 ${accent}`}>
            <span className="tabular-nums">{String(index + 1).padStart(2, '0')}</span>
            <span className="w-8 h-px bg-current opacity-50" aria-hidden="true" />
            {eyebrow}
        </span>
        <h2 className="text-3xl md:text-5xl font-display font-black leading-tight">{title}</h2>
    </div>
);

/** Re-measure ScrollTrigger positions once lazily-loaded content has actually mounted. */
const RefreshOnMount = ({ children }: { children: React.ReactNode }) => {
    useLayoutEffect(() => { ScrollTrigger.refresh(); }, []);
    return <>{children}</>;
};

/**
 * Run `start` once the first-load preloader (which locks body scroll) and the
 * route transition curtain are out of the way, so intro animations are seen.
 * Returns a cleanup function.
 */
function whenStageIsClear(start: () => void): () => void {
    let timer = 0;
    const go = () => { timer = window.setTimeout(start, 650); }; // PageTransition reveals content at ~0.35–1.0s
    if (document.body.style.overflow !== 'hidden') { go(); return () => clearTimeout(timer); }
    const mo = new MutationObserver(() => {
        if (document.body.style.overflow !== 'hidden') { mo.disconnect(); go(); }
    });
    mo.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    return () => { mo.disconnect(); clearTimeout(timer); };
}

// ─── Page ────────────────────────────────────────────────────────────────────

const CaseStudy = () => {
    const { id } = useParams<{ id: string }>();
    const project = projectsData.find(p => p.id === id);

    // Old slug → current one (keeps old links and search results working).
    // Own keys only — `/project/constructor` must not match Object.prototype.
    const legacyTarget = id && Object.prototype.hasOwnProperty.call(LEGACY_PROJECT_IDS, id) ? LEGACY_PROJECT_IDS[id] : undefined;
    if (!project && legacyTarget) {
        return <Navigate to={`/project/${legacyTarget}`} replace />;
    }

    if (!project) {
        return (
            <>
                <Helmet>
                    <title>Project Not Found | Saurabh Lokhande</title>
                    <meta name="robots" content="noindex" />
                </Helmet>
                <Suspense fallback={<div className="min-h-screen bg-[#020202]" />}>
                    <NotFound />
                </Suspense>
            </>
        );
    }
    return <CaseStudyView project={project} />;
};

const CaseStudyView = ({ project }: { project: Project }) => {
    const root = useRef<HTMLElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const location = useLocation();
    const lenis = useLenis();
    const prefersReduced = useReducedMotion();

    const idx = projectsData.findIndex(p => p.id === project.id);
    const next = projectsData[(idx + 1) % projectsData.length];
    const sections = sectionsFor(project);
    const indexOf = (sid: string) => sections.findIndex(s => s.id === sid);

    // Hero parallax stays on framer-motion: cheap, and MotionConfig(reducedMotion="user") covers it.
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    const refresh = useCallback(() => ScrollTrigger.refresh(), []);

    useGSAP(() => {
        // Arriving from another case study, the window (and Lenis) still sit at
        // the old page's scroll position. Reset before creating any trigger, or
        // once-only reveals/counters fire off-screen. (App's own reset runs later.)
        if (!location.hash) {
            lenis?.scrollTo(0, { immediate: true, force: true });
            window.scrollTo(0, 0);
        }

        // Section tracking for the side nav — runs regardless of motion preference.
        // Short final sections never reach the 55% line, so the page end selects the last one.
        const last = sections[sections.length - 1];
        if (last) {
            ScrollTrigger.create({
                trigger: root.current,
                start: 'bottom bottom+=2',
                onEnter: () => setActiveSection(last.id),
                onLeaveBack: () => setActiveSection(cur => (cur === last.id ? null : cur)),
            });
        }
        sections.forEach(s => {
            ScrollTrigger.create({
                trigger: `#${s.id}`,
                start: 'top 55%',
                end: 'bottom 55%',
                onToggle: self => {
                    setActiveSection(cur => (self.isActive ? s.id : cur === s.id ? null : cur));
                },
            });
        });

        const mm = gsap.matchMedia();
        mm.add(
            { motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' },
            ctx => {
                const { motion: canAnimate } = ctx.conditions as { motion: boolean; reduce: boolean };
                if (!canAnimate) return; // reduced motion: everything is already in its final state

                // Hero title: words rise out of their line masks — held until the
                // preloader / route-transition curtain has cleared so it's actually seen.
                const intro = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } })
                    .from('.cs-title-word', { yPercent: 110, duration: 1, stagger: 0.07 })
                    .from('.cs-hero-meta', { opacity: 0, y: 16, duration: 0.7, stagger: 0.08 }, '-=0.6');
                const cancelIntro = whenStageIsClear(() => intro.play());

                // Reading progress.
                gsap.fromTo('.cs-progress', { scaleX: 0 }, {
                    scaleX: 1,
                    ease: 'none',
                    scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
                });

                // Content reveals: one batched, staggered tween per group entering the viewport.
                // opacity (not autoAlpha): visibility:hidden would drop not-yet-revealed links
                // and buttons out of the tab order and the accessibility tree.
                gsap.set('.cs-reveal', { opacity: 0, y: 32 });
                ScrollTrigger.batch('.cs-reveal', {
                    start: 'top 88%',
                    once: true,
                    onEnter: batch => { gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', overwrite: true }); },
                });
                // Keyboard users can tab into content before it has scrolled in: show it at once.
                const onFocusIn = (e: FocusEvent) => {
                    const el = (e.target as HTMLElement | null)?.closest?.('.cs-reveal, .cs-hero-meta');
                    if (el) gsap.set(el, { opacity: 1, y: 0, overwrite: true });
                };
                root.current?.addEventListener('focusin', onFocusIn);

                // Count-up metrics (numeric values only).
                gsap.utils.toArray<HTMLElement>('.cs-metric[data-metric]').forEach(el => {
                    const parsed = JSON.parse(el.dataset.metric!) as ParsedMetric;
                    const counter = { v: 0 };
                    el.textContent = formatMetric(parsed, 0);
                    gsap.to(counter, {
                        v: parsed.value,
                        duration: 1.4,
                        ease: 'power2.out',
                        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
                        onUpdate: () => { el.textContent = formatMetric(parsed, counter.v); },
                        onComplete: () => { el.textContent = formatMetric(parsed, parsed.value); },
                    });
                });

                return () => {
                    cancelIntro();
                    root.current?.removeEventListener('focusin', onFocusIn);
                    // Text written by the counter isn't reverted by GSAP; restore the source value
                    // (e.g. when the visitor switches to reduced motion mid-count).
                    root.current?.querySelectorAll<HTMLElement>('.cs-metric[data-final]').forEach(el => {
                        el.textContent = el.dataset.final!;
                    });
                };
            }
        );

        // Late layout (fonts) moves trigger positions; re-measure once they're in.
        document.fonts?.ready.then(() => ScrollTrigger.refresh());
    }, { scope: root });

    const goTo = (sid: string) => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const el = document.getElementById(sid);
        if (!el) return;
        el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        // Move keyboard focus with the view (sections are focusable via tabIndex=-1).
        el.focus({ preventScroll: true });
    };

    const titleWords = project.title.split(' ');
    const liveUrl = project.liveUrl ?? project.link;

    return (
        <article ref={root} className="bg-[#020202] text-white min-h-screen">
            <Seo
                title={`${project.title} — Case Study`}
                description={project.description}
                url={`/project/${project.id}`}
                type="article"
                keywords={project.technologies.join(', ')}
            />

            {/* Reading progress */}
            <div className="fixed top-0 left-0 right-0 h-[2px] z-[60] pointer-events-none" aria-hidden="true">
                <div className="cs-progress h-full origin-left bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" style={{ transform: 'scaleX(0)' }} />
            </div>

            {/* ── Hero ── */}
            <header ref={heroRef} className="relative h-[75vh] md:h-[88vh] w-full overflow-hidden">
                <motion.div style={prefersReduced ? undefined : { y: heroY }} className="absolute inset-0">
                    <OptimizedImage
                        src={project.image}
                        alt=""
                        width={1920}
                        quality={80}
                        priority
                        onLoaded={refresh}
                        className="w-full h-full object-cover brightness-[0.3] contrast-[1.15]"
                        wrapperClassName="w-full h-full"
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/30 to-transparent" aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#020202]/50 to-transparent" aria-hidden="true" />

                <motion.div style={prefersReduced ? undefined : { opacity: heroOpacity }} className="absolute inset-0 flex flex-col justify-end p-6 md:p-16 z-10">
                    <Link
                        to="/#projects"
                        className="cs-hero-meta absolute top-24 left-6 md:top-28 md:left-16 flex items-center gap-2 text-sm font-mono uppercase tracking-[0.2em] text-gray-300 hover:text-white transition-colors group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                        All projects
                    </Link>

                    <span className="cs-hero-meta text-xs font-mono text-cyan-300/90 uppercase tracking-[0.3em] mb-5">
                        Case study · {project.category}{project.status === 'concept' ? ' · Concept' : ''}
                    </span>
                    <h1 className="text-[clamp(2.75rem,9vw,8rem)] font-display font-black uppercase leading-[0.9] tracking-tighter">
                        {titleWords.map((w, i) => (
                            <React.Fragment key={i}>
                                <span className="inline-block overflow-hidden align-bottom pb-[0.08em]">
                                    <span className="cs-title-word inline-block">{w}</span>
                                </span>
                                {/* Real spaces, so the accessible name reads as words. */}
                                {i < titleWords.length - 1 && ' '}
                            </React.Fragment>
                        ))}
                    </h1>
                    <p className="cs-hero-meta mt-6 max-w-2xl text-lg md:text-xl text-gray-300 font-light leading-relaxed">
                        {project.description}
                    </p>
                    {project.status === 'concept' && (
                        <p className="cs-hero-meta mt-4 inline-flex w-fit items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-amber-200 border border-amber-300/40 rounded-full px-3 py-1.5">
                            Concept · no public repo or demo yet
                        </p>
                    )}
                </motion.div>
            </header>

            {/* ── Body: sticky section nav + content ── */}
            <div className="max-w-7xl mx-auto px-6 md:px-16 lg:grid lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-16">
                <nav aria-label="Case study sections" className="hidden lg:block">
                    <ol className="sticky top-32 mt-24 space-y-3 font-mono text-[11px] uppercase tracking-[0.2em]">
                        {sections.map((s, i) => (
                            <li key={s.id}>
                                <button
                                    type="button"
                                    onClick={() => goTo(s.id)}
                                    aria-current={activeSection === s.id ? 'location' : undefined}
                                    className={`flex items-center gap-3 transition-colors ${activeSection === s.id ? 'text-cyan-300' : 'text-gray-400 hover:text-gray-100'}`}
                                >
                                    <span className="tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                                    <span className={`h-px transition-all duration-300 ${activeSection === s.id ? 'w-6 bg-cyan-300' : 'w-3 bg-current'}`} aria-hidden="true" />
                                    {s.label}
                                </button>
                            </li>
                        ))}
                    </ol>
                </nav>

                <div className="min-w-0">
                    {indexOf('challenge') >= 0 && (
                        <section id="challenge" tabIndex={-1} className="focus:outline-none py-20 md:py-28 scroll-mt-24">
                            <SectionHeading index={indexOf('challenge')} eyebrow="The problem" title="The challenge" accent="text-red-300" />
                            <p className="cs-reveal text-xl md:text-2xl text-gray-300 font-light leading-relaxed border-l-2 border-red-500/30 pl-6">
                                {project.details.problem}
                            </p>
                        </section>
                    )}

                    {indexOf('results') >= 0 && (
                        <section id="results" tabIndex={-1} className="focus:outline-none py-16 md:py-20 scroll-mt-24">
                            <SectionHeading index={indexOf('results')} eyebrow="Facts & figures" title="In numbers" accent="text-gray-300" />
                            <div
                                className={`grid grid-cols-1 gap-px bg-white/10 border border-white/10 ${
                                    project.metrics.length === 2 ? 'sm:grid-cols-2'
                                    : project.metrics.length === 4 ? 'sm:grid-cols-2 xl:grid-cols-4'
                                    : project.metrics.length >= 3 ? 'sm:grid-cols-3' : ''
                                }`}
                            >
                                {project.metrics.map(m => <Metric key={m.label} value={m.value} label={m.label} />)}
                            </div>
                        </section>
                    )}

                    {indexOf('evaluation') >= 0 && project.evaluation && (
                        <section id="evaluation" tabIndex={-1} className="focus:outline-none py-16 md:py-20 scroll-mt-24 space-y-10">
                            <SectionHeading index={indexOf('evaluation')} eyebrow="Measured, not claimed" title="Evaluation" accent="text-cyan-300" />
                            <p className="cs-reveal text-lg text-gray-300 leading-relaxed">
                                {project.evaluation.summary}
                                {project.evaluation.source && (
                                    <> Source:{' '}
                                        <a href={project.evaluation.source.url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline underline-offset-4 hover:text-cyan-200">
                                            {project.evaluation.source.label}<span className="sr-only"> (opens in a new tab)</span>
                                        </a>.
                                    </>
                                )}
                            </p>
                            {project.evaluation.tables.map(t => <DataTable key={t.caption} {...t} />)}
                        </section>
                    )}

                    {indexOf('approach') >= 0 && (
                        <section id="approach" tabIndex={-1} className="focus:outline-none py-20 md:py-28 scroll-mt-24">
                            <SectionHeading index={indexOf('approach')} eyebrow="What I built" title="The approach" accent="text-emerald-300" />
                            <p className="cs-reveal text-xl md:text-2xl text-white font-medium leading-relaxed">
                                {project.details.solution}
                            </p>
                        </section>
                    )}

                    {indexOf('architecture') >= 0 && (
                        <section id="architecture" tabIndex={-1} className="focus:outline-none py-16 md:py-24 scroll-mt-24 space-y-12">
                            <SectionHeading index={indexOf('architecture')} eyebrow="How it fits together" title="Architecture" accent="text-cyan-300" />
                            {project.details.architecture && (
                                <p className="cs-reveal text-base md:text-lg text-gray-300 leading-relaxed font-mono bg-white/[0.02] border border-white/5 p-6 md:p-10">
                                    {project.details.architecture}
                                </p>
                            )}
                            {project.topology && (
                                <div>
                                    <h3 className="cs-reveal font-mono text-xs uppercase tracking-[0.3em] text-gray-400 mb-6">System topology</h3>
                                    <RefreshOnMount><AnimatedTopology data={project.topology} /></RefreshOnMount>
                                </div>
                            )}
                            {project.codeHighlight && (
                                <div className="cs-reveal">
                                    <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-gray-400 mb-6">Key implementation</h3>
                                    <Suspense fallback={<div className="h-64 rounded-2xl border border-white/10 bg-[#0a0a0a]" />}>
                                        <RefreshOnMount>
                                            <CodeShowcase
                                                code={project.codeHighlight.code}
                                                language={project.codeHighlight.language}
                                                filename={project.codeHighlight.filename}
                                            />
                                        </RefreshOnMount>
                                    </Suspense>
                                </div>
                            )}
                        </section>
                    )}

                    {indexOf('tradeoffs') >= 0 && project.tradeoffs && (
                        <section id="tradeoffs" tabIndex={-1} className="focus:outline-none py-16 md:py-20 scroll-mt-24">
                            <SectionHeading index={indexOf('tradeoffs')} eyebrow="Decisions" title="Trade-offs" accent="text-violet-300" />
                            <ul className="space-y-4">
                                {project.tradeoffs.map(t => (
                                    <li key={t.decision} className="cs-reveal border border-white/10 bg-white/[0.02] p-5 md:p-6">
                                        <p className="text-white font-medium">
                                            {t.decision} <span className="text-gray-400 font-normal">over</span> {t.alternative}
                                        </p>
                                        <p className="mt-2 text-gray-300 leading-relaxed">{t.why}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {indexOf('failures') >= 0 && (
                        <section id="failures" tabIndex={-1} className="focus:outline-none py-16 md:py-20 scroll-mt-24 space-y-10">
                            <SectionHeading index={indexOf('failures')} eyebrow="What breaks, and what I did" title="Failure modes" accent="text-amber-300" />
                            {project.failures && project.failures.length > 0 && (
                                <DataTable caption="Failures and mitigations in place" columns={['Failure', 'Mitigation']} rows={project.failures.map(f => [f.failure, f.mitigation])} />
                            )}
                            {project.openIssues && project.openIssues.length > 0 && (
                                <div className="cs-reveal">
                                    <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-gray-300 mb-4">Still open</h3>
                                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                                        {project.openIssues.map(i => <li key={i}>{i}</li>)}
                                    </ul>
                                </div>
                            )}
                        </section>
                    )}

                    {indexOf('stack') >= 0 && (
                        <section id="stack" tabIndex={-1} className="focus:outline-none py-16 md:py-20 scroll-mt-24">
                            <SectionHeading index={indexOf('stack')} eyebrow="Tools" title="Technology stack" accent="text-gray-300" />
                            <ul className="flex flex-wrap gap-3">
                                {project.technologies.map(tech => (
                                    <li key={tech} className="cs-reveal px-5 py-2.5 bg-white/5 border border-white/10 text-sm font-mono tracking-widest text-gray-200 uppercase">
                                        {tech}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {indexOf('impact') >= 0 && (
                        <section id="impact" tabIndex={-1} className="focus:outline-none py-16 md:py-24 scroll-mt-24">
                            <SectionHeading index={indexOf('impact')} eyebrow="Outcome" title="Impact" accent="text-blue-300" />
                            <p className="cs-reveal text-xl md:text-2xl text-gray-300 font-light leading-relaxed border-l-2 border-blue-500/30 pl-6">
                                {project.details.impact}
                            </p>
                        </section>
                    )}

                    {indexOf('links') >= 0 && (
                        <section id="links" tabIndex={-1} className="focus:outline-none py-16 md:py-24 scroll-mt-24 border-t border-white/5">
                            <SectionHeading index={indexOf('links')} eyebrow="See it for yourself" title="Try it" accent="text-gray-300" />
                            <div className="cs-reveal flex flex-col sm:flex-row gap-4">
                                {liveUrl && (
                                    <Magnetic>
                                        <a href={liveUrl} target="_blank" rel="noopener noreferrer"
                                            className="inline-flex justify-center items-center gap-3 bg-white text-black px-10 py-5 font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors">
                                            Live demo <ExternalLink className="w-4 h-4" aria-hidden="true" />
                                            <span className="sr-only">(opens in a new tab)</span>
                                        </a>
                                    </Magnetic>
                                )}
                                {project.demoVideo && (
                                    <Magnetic>
                                        <a href={project.demoVideo.url} target="_blank" rel="noopener noreferrer"
                                            className="inline-flex justify-center items-center gap-3 text-white bg-cyan-500/15 border border-cyan-300/50 px-10 py-5 font-bold uppercase tracking-widest text-sm hover:bg-cyan-500/25 transition-colors">
                                            <PlayCircle className="w-5 h-5" aria-hidden="true" /> {project.demoVideo.label}
                                            <span className="sr-only">(opens in a new tab)</span>
                                        </a>
                                    </Magnetic>
                                )}
                                {project.repo && (
                                    <Magnetic>
                                        <a href={project.repo} target="_blank" rel="noopener noreferrer"
                                            className="inline-flex justify-center items-center gap-3 text-white border border-white/20 px-10 py-5 font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-colors">
                                            Source code <ArrowUpRight className="w-5 h-5" aria-hidden="true" />
                                            <span className="sr-only">(opens in a new tab)</span>
                                        </a>
                                    </Magnetic>
                                )}
                            </div>
                            {liveUrl && project.liveNote && (
                                <p className="cs-reveal mt-4 text-sm text-gray-300">{project.liveNote}</p>
                            )}
                            {project.demoVideo?.note && (
                                <p className="cs-reveal mt-2 text-sm text-gray-300">{project.demoVideo.note}</p>
                            )}
                            {project.links && project.links.length > 0 && (
                                <ul className="cs-reveal mt-8 space-y-2">
                                    {project.links.map(l => (
                                        <li key={l.url}>
                                            <a href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-cyan-300 underline underline-offset-4 hover:text-cyan-200">
                                                {l.label} <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                                                <span className="sr-only">(opens in a new tab)</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    )}
                </div>
            </div>

            {/* ── Next project ── */}
            <section className="py-24 md:py-40 px-6 md:px-16 bg-[#050505] border-t border-white/5">
                <Link
                    to={`/project/${next.id}`}
                    aria-label={`Next case study: ${next.title}`}
                    className="cs-reveal block max-w-6xl mx-auto group"
                >
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-[0.3em] mb-6 block">Next case study</span>
                    <span className="flex items-center justify-between gap-6">
                        <span className="text-[clamp(2.25rem,7vw,6.5rem)] font-display font-black uppercase leading-[0.9] tracking-tighter group-hover:text-cyan-300 transition-colors duration-300">
                            {next.title}
                        </span>
                        <span className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300 shrink-0" aria-hidden="true">
                            <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
                        </span>
                    </span>
                    <span className="mt-4 block text-gray-400 font-mono text-sm uppercase tracking-widest">{next.category}</span>
                </Link>
            </section>
        </article>
    );
};

export default CaseStudy;
