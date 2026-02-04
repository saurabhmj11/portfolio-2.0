import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
    {
        quote: "Saurabh turned our vague AI concepts into a production-ready RAG system in weeks. His grasp of both LLMs and backend architecture is rare.",
        author: "Alex Cheng",
        role: "CTO, FinTech Startup"
    },
    {
        quote: "The autonomous agent workflow he built saved our research team 20+ hours a week. Incredible ROI and flawless execution.",
        author: "Sarah Davis",
        role: "Head of Product, DataCorp"
    },
    {
        quote: "One of the most detail-oriented engineers I've worked with. The generative UI component he designed was a game-changer for our UX.",
        author: "James Wilson",
        role: "Founder, AI Studio"
    },
    {
        quote: "Saurabh's ability to navigate complex multi-agent systems is top-tier. He delivered a robust solution that scaled effortlessly.",
        author: "Maria Garcia",
        role: "Engineering Lead, TechFlow"
    }
];

const Testimonials = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // Clone elements for seamless loop
            const content = sliderRef.current;
            if (content) {
                // Simple marquee effect
                const totalWidth = content.scrollWidth;

                // If we want a true marquee we should duplicate content
                // For now, let's just do a scroll-triggered horizontal move or a constant auto-scroll
                // "Best" portfolio usually implies constant motion or scroll-driven

                // Let's do auto-scrolling marquee
                gsap.to(content, {
                    x: "-50%",
                    duration: 20,
                    ease: "none",
                    repeat: -1
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-24 bg-off-white overflow-hidden border-t border-gray-200">
            <div className="container mx-auto px-4 mb-16">
                <h2 className="text-[12px] uppercase tracking-widest text-gray-500 mb-2">Social Proof</h2>
                <h3 className="text-4xl md:text-6xl font-bold tracking-tighter">What People Say</h3>
            </div>

            <div className="w-full relative">
                <div ref={sliderRef} className="flex gap-12 w-max px-4">
                    {/* Render twice for seamless loop */}
                    {[...testimonials, ...testimonials].map((t, i) => (
                        <div key={i} className="w-[80vw] md:w-[40vw] max-w-xl bg-white p-12 border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                            <div className="mb-8">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span key={star} className="text-yellow-400 text-xl">★</span>
                                ))}
                            </div>
                            <p className="text-xl md:text-2xl leading-relaxed text-gray-800 mb-8 font-light italic">
                                "{t.quote}"
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                                    {t.author.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-sm uppercase tracking-wider">{t.author}</p>
                                    <p className="text-xs text-gray-500 font-mono">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
