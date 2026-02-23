import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
        let mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            const items = gsap.utils.toArray('.workflow-item');

            // Allow layout to settle
            ScrollTrigger.refresh();

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: '+=300%',
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1
                }
            });

            // 1. Draw the line
            tl.fromTo('.workflow-line',
                { scaleY: 0 },
                { scaleY: 1, duration: 4, ease: 'none' }
            );

            // 2. Animate items sequentially linked to the line drawing
            items.forEach((item: any, i) => {
                tl.fromTo(item,
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, duration: 1, ease: 'power2.out' },
                    `-=${3.5 - (i * 0.5)}` // Overlap slightly with line drawing
                );
            });
        });

        return () => mm.revert();
    }, []);

    return (
        <section ref={containerRef} className="min-h-screen py-20 bg-black text-white relative overflow-hidden flex flex-col justify-center">
            <div className="container mx-auto px-4 relative z-10 flex flex-col justify-center">
                <div className="mb-16 text-center shrink-0">
                    <h2 className="text-[12px] uppercase tracking-widest text-gray-500 mb-4">My Process</h2>
                    <h3 className="text-[clamp(2.25rem,5vw,4.5rem)] font-bold tracking-tighter leading-none">How I Build</h3>
                </div>

                <div className="relative max-w-5xl mx-auto w-full">
                    {/* Central Line — continuous, properly centered */}
                    <div className="absolute left-[16px] md:left-1/2 md:-translate-x-[0.5px] top-0 bottom-0 w-[1px] bg-gray-800 overflow-hidden">
                        <div className="workflow-line w-full h-full bg-blue-500 origin-top" />
                    </div>

                    <div className="space-y-12 md:space-y-20">
                        {steps.map((step, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <div key={index} className="workflow-item relative">
                                    {/* Timeline Dot — always on the line */}
                                    <div className="absolute left-[16px] md:left-1/2 -translate-x-1/2 top-2 w-3.5 h-3.5 bg-black border-2 border-blue-500 rounded-full z-10 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />

                                    {/* Content — alternates sides on desktop, always right on mobile */}
                                    <div className={`pl-10 md:pl-0 md:w-[45%] ${isEven ? 'md:ml-0 md:text-right md:pr-12' : 'md:ml-auto md:text-left md:pl-12'}`}>
                                        <h4 className="text-2xl md:text-4xl font-bold mb-2 text-white tracking-tight font-display leading-tight">
                                            <span className="text-blue-500 mr-1.5">{step.num}.</span>
                                            <span className="font-extrabold">{step.title}</span>
                                        </h4>
                                        <p className="text-gray-400 leading-relaxed text-sm md:text-base font-light max-w-md inline-block">{step.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Workflow;
