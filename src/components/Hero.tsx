
import React, { useRef, useLayoutEffect, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from './TextReveal';
import AIParticles from './AIParticles';
import Magnetic from './Magnetic';
import { ArrowDown } from 'lucide-react';
import HackerText from './HackerText';

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
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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
                )
                .fromTo('.hero-cta',
                    { opacity: 0, scale: 0.8 },
                    { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' },
                    "-=0.4"
                );

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="home"
            ref={containerRef}
            className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-x-hidden bg-black text-white px-4 pt-24 pb-32 md:pt-0 md:pb-24"
        >
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-30"
                >
                    <source src="https://uploads-ssl.webflow.com/65b7bac85c1092089d510616/65b8c737f3618d8dd99da139_VIDEO HOME (DSK)-transcode.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 z-10" />

            {/* 3D Crystal Background */}
            <div className="absolute inset-0 z-10 pointer-events-none mix-blend-screen">
                <Suspense fallback={null}>
                    <Hero3D />
                </Suspense>
            </div>

            <AIParticles />

            {/* Main Content */}
            <motion.div
                style={{ y, opacity }}
                className="relative z-20 flex flex-col items-center text-center w-full px-2 md:px-0 max-w-[90vw]"
            >
                {/* Row 1 */}
                <div className="flex flex-col md:flex-row items-center md:items-baseline justify-center gap-2 md:gap-6 w-full leading-none">
                    <span className="hero-intro font-serif italic text-2xl md:text-4xl text-gray-300 md:mr-4 mb-2 md:mb-0 opacity-0">
                        I'm a
                    </span>
                    <h1 className="text-[clamp(3.5rem,11vw,9rem)] leading-[0.85] font-display font-bold tracking-tighter uppercase text-white">
                        <HackerText text="Generative AI" speed={40} />
                    </h1>
                </div>

                {/* Row 2 */}
                <div className="flex flex-col md:flex-row items-center md:items-baseline justify-center gap-2 md:gap-6 w-full leading-none mt-2 md:-mt-2">
                    <TextReveal el="h1" className="text-[clamp(3.5rem,11vw,9rem)] leading-[0.85] font-display font-bold tracking-tighter uppercase" delay={0.8}>
                        Engineer
                    </TextReveal>
                    <span className="hero-connector font-serif italic text-3xl md:text-6xl text-gray-300 md:ml-4 my-2 md:my-0 opacity-0">
                        &
                    </span>
                </div>

                {/* Row 3 */}
                <div className="flex flex-col items-center justify-center w-full leading-none mt-2 md:-mt-2">
                    <TextReveal el="h1" className="text-[clamp(3.5rem,11vw,9rem)] leading-[0.85] font-display font-bold tracking-tighter uppercase" delay={1.0}>
                        Software
                    </TextReveal>
                    <TextReveal el="h1" className="text-[clamp(3.5rem,11vw,9rem)] leading-[0.85] font-display font-bold tracking-tighter uppercase" delay={1.2}>
                        Developer
                    </TextReveal>
                </div>

                {/* Description & Buttons */}
                <div className="hero-desc mt-10 max-w-2xl opacity-0 flex flex-col items-center">
                    <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed font-light">
                        <span className="font-semibold text-white block mb-2">Hi, I'm Saurabh Lokhande</span>
                        Crafting intelligent agents and scalable systems.
                    </p>

                    <div className="hero-cta flex gap-6">
                        <Magnetic>
                            <a href="#projects" className="px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors duration-300 inline-block">
                                View Projects
                            </a>
                        </Magnetic>
                        <Magnetic>
                            <a href="#contact" className="px-8 py-4 border border-white/20 backdrop-blur-sm text-white font-medium rounded-full hover:bg-white/10 transition-colors duration-300 inline-block">
                                Contact Me
                            </a>
                        </Magnetic>
                    </div>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <ArrowDown size={32} />
            </motion.div>

        </section>
    );
};

export default Hero;
