import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from './ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        num: '01',
        title: 'Deep Discovery',
        desc: 'Framing the problem space. Example: Defining the multi-agent orchestration logic for "HireMeOS" to handle autonomous complex reasoning.'
    },
    {
        num: '02',
        title: 'System Design',
        desc: 'Architecting for scale. Example: Designing the event-driven SQS/Lambda pipeline for the "OCR Intelligence" system to handle high-throughput.'
    },
    {
        num: '03',
        title: 'Implementation',
        desc: 'Building with precision. Example: Implementing secure Stripe webhooks and idempotent billing logic for the "SubMaster" SaaS backend.'
    },
    {
        num: '04',
        title: 'Deployment',
        desc: ' launching to production. Example: Rolling out the "Student RecSys" inference engine to edge nodes for low-latency recommendations.'
    }
];

const Workflow = () => {
    const containerRef = useRef<HTMLElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const items = gsap.utils.toArray('.workflow-item');

            items.forEach((item: any, i) => {
                gsap.fromTo(item,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            });

            // Draw line
            gsap.fromTo('.workflow-line',
                { scaleY: 0 },
                {
                    scaleY: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top center',
                        end: 'bottom center',
                        scrub: 1
                    }
                }
            );

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-20 md:py-32 bg-black text-white relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="mb-16 md:mb-24 text-center">
                    <h2 className="text-[12px] uppercase tracking-widest text-gray-500 mb-4">My Process</h2>
                    <h3 className="text-[clamp(2.25rem,5vw,4.5rem)] font-bold tracking-tighter leading-none">How I Build</h3>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Central Line */}
                    <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[1px] bg-gray-800 -translate-x-1/2 md:-translate-x-1/2">
                        <div className="workflow-line w-full h-full bg-blue-500 origin-top" />
                    </div>

                    <div className="space-y-16 md:space-y-24">
                        {steps.map((step, index) => (
                            <ScrollReveal key={index} width="100%" threshold={0.1}>
                                <div className={`workflow-item flex flex-col md:flex-row items-start gap-8 md:gap-24 relative ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>

                                    {/* Timeline Dot */}
                                    <div className="absolute left-[20px] md:left-1/2 w-4 h-4 bg-black border-2 border-blue-500 rounded-full z-10 -translate-x-1/2 top-0 mt-2" />

                                    <div className={`w-full md:w-[45%] pl-12 md:pl-0 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                        <span className="text-4xl md:text-6xl font-bold text-gray-800 opacity-50 block mb-2 md:mb-4">{step.num}</span>
                                        <h4 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">{step.title}</h4>
                                        <p className="text-gray-400 leading-relaxed text-base md:text-lg">{step.desc}</p>
                                    </div>
                                    <div className="hidden md:block w-full md:w-[45%]" />
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Workflow;
