import React, { useRef, useLayoutEffect, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from './TextReveal';
import AIParticles from './AIParticles';

const Hero3D = React.lazy(() => import('./Hero3D'));

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Slight parallax for the text
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Sequence for non-TextReveal elements (like the description and "I'm a")
            const tl = gsap.timeline({ delay: 0.5 });

            tl.fromTo('.hero-intro',
                { opacity: 0, x: -50 },
                { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
            )
                .fromTo('.hero-connector',
                    { opacity: 0, rotation: -20, scale: 0.8 },
                    { opacity: 1, rotation: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' },
                    "-=0.4"
                )
                .fromTo('.hero-desc',
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
                    "-=0.2"
                );

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="home"
            ref={containerRef}
            className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-black text-white px-4 py-20 md:py-0"
        >
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-50"
                >
                    <source src="https://uploads-ssl.webflow.com/65b7bac85c1092089d510616/65b8c737f3618d8dd99da139_VIDEO HOME (DSK)-transcode.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 z-10" />

            {/* 3D Crystal Background - Disabled for Debugging */}
            <div className="absolute inset-0 z-10 opacity-80 pointer-events-none mix-blend-screen">
                <Suspense fallback={null}>
                    <Hero3D />
                </Suspense>
            </div>

            <AIParticles />

            {/* Main Content */}
            <motion.div
                style={{ y }}
                className="relative z-20 flex flex-col items-center text-center w-full px-2 md:px-0 max-w-[90vw]"
            >
                {/* Row 1 */}
                <div className="flex flex-col md:flex-row items-center md:items-baseline justify-center gap-2 md:gap-8 w-full leading-none">
                    <span className="hero-intro font-serif italic text-3xl md:text-5xl text-gray-300 md:mr-4 mb-2 md:mb-0 opacity-0">
                        I'm a
                    </span>
                    <TextReveal el="h1" className="text-[clamp(3rem,12vw,10rem)] leading-[0.9] font-bold tracking-tighter" delay={0.6}>
                        GENERATIVE AI
                    </TextReveal>
                </div>

                {/* Row 2 */}
                <div className="flex flex-col md:flex-row items-center md:items-baseline justify-center gap-2 md:gap-8 w-full leading-none mt-2 md:-mt-4">
                    <TextReveal el="h1" className="text-[clamp(3rem,12vw,10rem)] leading-[0.9] font-bold tracking-tighter" delay={0.8}>
                        ENGINEER
                    </TextReveal>
                    <span className="hero-connector font-serif italic text-4xl md:text-7xl text-gray-300 md:ml-4 my-2 md:my-0 opacity-0">
                        &
                    </span>
                </div>

                {/* Row 3 */}
                <div className="flex flex-col items-center justify-center w-full leading-none mt-2 md:-mt-4">
                    <TextReveal el="h1" className="text-[clamp(3rem,12vw,10rem)] leading-[0.9] font-bold tracking-tighter" delay={1.0}>
                        SOFTWARE
                    </TextReveal>
                    <TextReveal el="h1" className="text-[clamp(3rem,12vw,10rem)] leading-[0.9] font-bold tracking-tighter" delay={1.2}>
                        ENGINEER
                    </TextReveal>
                </div>

                {/* Description & Buttons */}
                <div className="hero-desc mt-12 max-w-2xl opacity-0">
                    <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
                        <span className="font-bold text-white block mb-2">Hi, I'm Saurabh Lokhande</span>
                        An AI Engineer & Software Developer transforming ideas into intelligent solutions.
                        <br /><br />
                        I specialize in creating AI-driven applications, crafting innovative generative AI models, and building scalable software solutions. Passionate about learning and pushing the boundaries of technology.
                    </p>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
