import { useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        num: '01',
        title: 'Deep Discovery',
        tag: 'PROBLEM FRAMING',
        desc: 'Decomposing the problem space before writing a single line of code. This means mapping data flows, identifying failure modes, and defining success metrics — like designing the multi-agent orchestration logic for an autonomous reasoning system.',
        accent: '#60a5fa', // blue
        icon: '◈',
    },
    {
        num: '02',
        title: 'System Design',
        tag: 'ARCHITECTURE',
        desc: 'Architecting for scale and resilience. Designing event-driven pipelines, choosing the right vector store topology, and drawing explicit boundaries between services — like an SQS/Lambda pipeline for a high-throughput OCR intelligence system.',
        accent: '#a78bfa', // violet
        icon: '⬡',
    },
    {
        num: '03',
        title: 'Implementation',
        tag: 'PRECISION ENGINEERING',
        desc: 'Building with deterministic precision. Implementing idempotent billing logic, hardened RAG retrieval chains, and type-safe API contracts — like securing Stripe webhooks and multi-tenant data isolation for a production SaaS backend.',
        accent: '#34d399', // emerald
        icon: '◎',
    },
    {
        num: '04',
        title: 'Deployment',
        tag: 'PRODUCTION LAUNCH',
        desc: 'Shipping to production with zero-downtime strategies. Rolling out ML inference engines to edge nodes, configuring observability dashboards, and establishing automated rollback gates — like launching a recommendation system for sub-100ms latency at scale.',
        accent: '#f59e0b', // amber
        icon: '⊕',
    },
];

const Workflow = () => {
    const containerRef = useRef<HTMLElement>(null);

    useLayoutEffect(() => {
        const items = gsap.utils.toArray<Element>('.workflow-item');

        ScrollTrigger.refresh();

        // Line draws as user scrolls through the section
        gsap.fromTo(
            '.workflow-line',
            { scaleY: 0 },
            {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                    end: 'bottom 60%',
                    scrub: 1,
                },
            }
        );

        // Each card reveals as it enters the viewport
        items.forEach((item) => {
            gsap.fromTo(
                item,
                { opacity: 0, y: 30, filter: 'blur(6px)' },
                {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.7,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 88%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        });

        return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    }, []);

    return (
        <section
            ref={containerRef}
            id="workflow"
            className="min-h-screen py-20 bg-[#030712] text-white relative overflow-hidden flex flex-col justify-center"
        >
            {/* Ambient glow blobs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-700/8 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-700/8 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                {/* Header */}
                <motion.div
                    className="mb-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                    <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30 mb-4">
                        My Process
                    </p>
                    <h2 className="font-display font-black tracking-tighter leading-none"
                        style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
                        How I Build
                    </h2>
                    <p className="mt-4 text-white/40 text-sm md:text-base max-w-lg mx-auto">
                        A repeatable, battle-tested engineering loop that turns vague requirements into production-grade AI systems.
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative max-w-4xl mx-auto w-full">
                    {/* Vertical line */}
                    <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-white/[0.06] overflow-hidden">
                        <div className="workflow-line w-full h-full origin-top"
                            style={{ background: 'linear-gradient(180deg, #60a5fa, #a78bfa, #34d399, #f59e0b)' }}
                        />
                    </div>

                    <div className="space-y-10 md:space-y-16">
                        {steps.map((step, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <div key={index} className="workflow-item relative opacity-0">
                                    {/* Dot on the timeline */}
                                    <div
                                        className="absolute left-6 md:left-1/2 -translate-x-1/2 top-5 w-3 h-3 rounded-full z-10"
                                        style={{
                                            background: step.accent,
                                            boxShadow: `0 0 16px ${step.accent}80`,
                                        }}
                                    />

                                    {/* Card */}
                                    <div className={`pl-14 md:pl-0 md:w-[46%] ${isEven ? 'md:mr-auto md:pr-10 md:text-right' : 'md:ml-auto md:pl-10'}`}>
                                        <div
                                            className="rounded-xl p-5 md:p-6 border transition-colors group cursor-default"
                                            style={{
                                                background: `${step.accent}06`,
                                                borderColor: `${step.accent}20`,
                                            }}
                                        >
                                            {/* Tag + number */}
                                            <div className={`flex items-center gap-2 mb-3 ${isEven ? 'md:justify-end' : ''}`}>
                                                <span className="font-mono text-[9px] tracking-[0.25em] uppercase"
                                                    style={{ color: `${step.accent}90` }}>
                                                    {step.tag}
                                                </span>
                                                <span className="font-mono text-[9px] text-white/15">
                                                    — {step.num}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="font-display font-black text-xl md:text-2xl lg:text-3xl tracking-tight text-white mb-3">
                                                <span style={{ color: step.accent }} className="mr-1.5 text-lg">{step.icon}</span>
                                                {step.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-white/50 text-sm leading-relaxed">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Scanlines */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.015]"
                style={{
                    backgroundImage:
                        'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 3px)',
                    backgroundSize: '100% 3px',
                }}
            />
        </section>
    );
};

export default Workflow;
