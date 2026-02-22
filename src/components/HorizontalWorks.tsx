/**
 * HorizontalWorks — A GSAP-pinned horizontal scroll strip
 * that sits between the About explosion and the Projects neural web.
 *
 * Each "work" card travels horizontally as the user scrolls vertically.
 * The section is pinned for 300vh of scroll distance.
 */
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useIsMobile from '../hooks/useIsMobile';

gsap.registerPlugin(ScrollTrigger);

const WORKS = [
    {
        num: '01',
        title: 'HireMeOS',
        category: 'Autonomous AI',
        year: '2024',
        color: '#0a0a0a',
        accent: '#3b82f6',
        img: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=900&auto=format&fit=crop',
    },
    {
        num: '02',
        title: 'OCR Pipeline',
        category: 'Computer Vision',
        year: '2024',
        color: '#050505',
        accent: '#8b5cf6',
        img: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?q=80&w=900&auto=format&fit=crop',
    },
    {
        num: '03',
        title: 'Multi-Agent RAG',
        category: 'LLM Systems',
        year: '2024',
        color: '#0a0a0a',
        accent: '#ec4899',
        img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=900&auto=format&fit=crop',
    },
    {
        num: '04',
        title: 'Generative UI',
        category: 'GenAI Product',
        year: '2023',
        color: '#050505',
        accent: '#22d3ee',
        img: 'https://images.unsplash.com/photo-1677442135968-6db3b0025e95?q=80&w=900&auto=format&fit=crop',
    },
    {
        num: '05',
        title: 'Live Agent Grid',
        category: 'Real-time AI',
        year: '2023',
        color: '#0a0a0a',
        accent: '#a3e635',
        img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=900&auto=format&fit=crop',
    },
];

const HorizontalWorks = () => {
    const isMobile = useIsMobile();
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (isMobile) return;
        if (!containerRef.current || !trackRef.current) return;

        const ctx = gsap.context(() => {
            const totalWidth = trackRef.current!.scrollWidth - window.innerWidth;

            gsap.to(trackRef.current, {
                x: () => -totalWidth,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    pin: true,
                    scrub: 0.8,
                    start: 'top top',
                    end: () => `+=${totalWidth}`,
                    invalidateOnRefresh: true,
                    anticipatePin: 1,
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, [isMobile]);

    if (isMobile) {
        // Mobile: vertical grid
        return (
            <section className="bg-[#020202] py-20 px-5" id="works">
                <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.5em] mb-4 text-center">// Selected Works</p>
                <div className="space-y-8">
                    {WORKS.map(w => (
                        <div key={w.num} className="relative rounded-2xl overflow-hidden border border-white/8 h-60">
                            <img src={w.img} alt={w.title} className="w-full h-full object-cover brightness-50" />
                            <div className="absolute inset-0 p-5 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">{w.num}</span>
                                    <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">{w.category}</span>
                                </div>
                                <div>
                                    <h3 className="font-display font-black text-3xl uppercase text-white leading-none">{w.title}</h3>
                                    <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">{w.year}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section ref={containerRef} className="relative bg-[#020202] overflow-hidden" id="works">
            {/* Eyebrow — pinned at top left */}
            <div className="absolute top-8 left-12 z-20 pointer-events-none">
                <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.5em]">// Selected Works</p>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 right-12 z-20 flex items-center gap-3 pointer-events-none">
                <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">Scroll to explore</span>
                <div className="flex gap-1">
                    {[0.3, 0.6, 1].map((o, i) => (
                        <div key={i} className="w-6 h-px bg-white" style={{ opacity: o }} />
                    ))}
                </div>
            </div>

            {/* Horizontal track */}
            <div ref={trackRef} className="flex items-center h-screen gap-6 pl-16 pr-[20vw]">

                {/* Left opening title card */}
                <div className="flex-shrink-0 w-[22vw] flex flex-col justify-center">
                    <h2
                        className="font-display font-black uppercase leading-[0.82] text-white"
                        style={{ fontSize: 'clamp(3rem, 5vw, 5.5rem)' }}
                    >
                        Selected<br />
                        <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)', color: 'transparent' }}>Works</span>
                    </h2>
                    <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mt-6 max-w-[180px]">
                        {WORKS.length} projects across AI, LLMs, and full-stack
                    </p>
                </div>

                {/* Project cards */}
                {WORKS.map((work, _i) => (
                    <div
                        key={work.num}
                        className="flex-shrink-0 relative overflow-hidden rounded-2xl border border-white/8 cursor-pointer group"
                        style={{
                            width: '38vw',
                            height: '70vh',
                            backgroundColor: work.color,
                        }}
                    >
                        {/* Image */}
                        <img
                            src={work.img}
                            alt={work.title}
                            className="absolute inset-0 w-full h-full object-cover brightness-40 group-hover:brightness-60 group-hover:scale-105 transition-all duration-700"
                            draggable={false}
                        />

                        {/* Accent glow at bottom */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                            style={{ background: `linear-gradient(to top, ${work.accent}40, transparent)` }}
                        />

                        {/* Content */}
                        <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
                            {/* Top row */}
                            <div className="flex items-start justify-between">
                                <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.3em]">{work.num}</span>
                                <span
                                    className="font-mono text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border"
                                    style={{ color: work.accent, borderColor: `${work.accent}50` }}
                                >
                                    {work.category}
                                </span>
                            </div>

                            {/* Bottom: title + year */}
                            <div>
                                <div
                                    className="w-8 h-px mb-4 group-hover:w-16 transition-all duration-500"
                                    style={{ backgroundColor: work.accent }}
                                />
                                <h3 className="font-display font-black text-white uppercase leading-none mb-2"
                                    style={{ fontSize: 'clamp(2rem, 3.5vw, 3.5rem)' }}>
                                    {work.title}
                                </h3>
                                <span className="font-mono text-[10px] text-white/25 uppercase tracking-widest">{work.year}</span>
                            </div>
                        </div>

                        {/* Hover arrow */}
                        <div className="absolute top-8 right-8 w-10 h-10 border border-white/15 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <span className="text-white text-sm">↗</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HorizontalWorks;
