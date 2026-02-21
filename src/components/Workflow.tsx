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
        <section ref={containerRef} className="h-screen py-20 bg-black text-white relative overflow-hidden flex flex-col justify-center">
            <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
                <div className="mb-12 text-center shrink-0">
                    <h2 className="text-[12px] uppercase tracking-widest text-gray-500 mb-4">My Process</h2>
                    <h3 className="text-[clamp(2.25rem,5vw,4.5rem)] font-bold tracking-tighter leading-none">How I Build</h3>
                </div>

                <div className="relative max-w-5xl mx-auto flex-1 flex flex-col justify-center">
                    {/* Central Line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-gray-800 -translate-x-1/2 md:-translate-x-1/2 overflow-hidden">
                        <div className="workflow-line w-full h-full bg-blue-500 origin-top" />
                    </div>

                    <div className="space-y-8 md:space-y-16">
                        {steps.map((step, index) => (
                            <div key={index} className={`workflow-item flex flex-col md:flex-row items-center gap-8 md:gap-16 relative ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>

                                {/* Timeline Dot */}
                                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-black border-2 border-blue-500 rounded-full z-10 -translate-x-1/2 top-1.5 shadow-[0_0_15px_rgba(59,130,246,0.6)]">
                                    <div className="w-full h-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform duration-300" />
                                </div>

                                <div className={`w-full md:w-[45%] pl-12 md:pl-0 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                                    <h4 className="text-3xl md:text-4xl font-bold mb-3 text-white tracking-tight font-display">
                                        <span className="text-blue-500 mr-2">{step.num}.</span>
                                        {step.title}
                                    </h4>
                                    <p className="text-gray-400 leading-relaxed text-sm md:text-base font-light">{step.desc}</p>
                                </div>
                                <div className="hidden md:block w-full md:w-[45%]" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Workflow;
