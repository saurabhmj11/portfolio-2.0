
import React, { useRef, useLayoutEffect, Suspense, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useInView } from 'react-intersection-observer';
import { useAudioDirector } from '../context/AudioContext';
import TextReveal from './TextReveal';
import Magnetic from './Magnetic';
import { ArrowDown, Github, Star, GitBranch, Users } from 'lucide-react';
import HackerText from './HackerText';
import useIsMobile from '../hooks/useIsMobile';
import { useGitHubStats } from '../hooks/useGitHubStats';

const InteractiveCore = React.lazy(() => import('./InteractiveCore'));

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const isMobile = useIsMobile();
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const { stats, loading } = useGitHubStats('saurabhmj11');

    const { playSectionChime } = useAudioDirector();
    const [inViewRef, inView] = useInView({ threshold: 0.5 });

    const [coreInViewRef, coreInView] = useInView({ threshold: 0, rootMargin: "200px" });

    // Merge refs for Framer Motion scroll and Intersection Observer
    const setRefs = React.useCallback(
        (node: HTMLElement | null) => {
            // @ts-expect-error -- containerRef is typed as RefObject<HTMLElement> but accepts null from callback ref
            containerRef.current = node;
            inViewRef(node);
            coreInViewRef(node);
        },
        [inViewRef, coreInViewRef]
    );

    useEffect(() => {
        if (inView) {
            playSectionChime('hero');
        }
    }, [inView, playSectionChime]);

    // Slight parallax for the text
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Sequence for non-TextReveal elements (like the description and "I'm a")
            const tl = gsap.timeline({ delay: 0.1 });

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
            ref={setRefs}
            data-ambient-hue="230"
            data-ambient-sat="20%"
            data-ambient-lit="3%"
            className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-x-hidden bg-black text-white px-4 pt-24 pb-32 md:pt-0 md:pb-24"
        >
            {/* Background — Gradient (No heavy video) */}
            <div className="absolute inset-0 z-0">
                <div className="w-full h-full bg-gradient-to-br from-[#030303] via-[#0a0a1a] to-[#030303]" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 z-10" />

            {/* 3D Components — Desktop only, z-30 so clicks reach the Canvas */}
            {!isMobile && coreInView ? (
                <div className="absolute inset-0 z-30 pointer-events-auto mix-blend-screen overflow-hidden">
                    <Suspense fallback={null}>
                        <InteractiveCore />
                    </Suspense>
                </div>
            ) : (
                <div className="absolute inset-0 z-10 mobile-mesh-bg pointer-events-none" />
            )}

            {/* Main Content */}
            <motion.div
                style={{ y, opacity }}
                className="relative z-40 pointer-events-none flex flex-col items-center text-center w-full px-2 md:px-0 max-w-[90vw]"
            >
                {/* ── Open to Work badge ── */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-2.5 px-4 py-2 mb-6 rounded-full border border-green-500/30 bg-green-500/5 backdrop-blur-sm pointer-events-auto"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    <span className="text-green-400 text-xs font-mono tracking-widest uppercase">Open to Work — AI / LLM Roles</span>
                </motion.div>

                {/* Extraordinary Typography Block */}
                <div className="flex flex-col w-full max-w-7xl mx-auto leading-[0.85] font-display font-bold tracking-tighter uppercase cursor-default relative text-white px-0 lg:px-12">

                    {/* Row 1: I'm a Generative AI */}
                    <div className="flex flex-col items-center md:items-start relative z-10 w-full md:pl-[10%] mb-4 md:-mb-6">
                        <span className="hero-intro font-serif italic text-3xl md:text-5xl text-blue-400 opacity-0 normal-case tracking-normal md:pl-16 mb-2 mix-blend-screen">
                            I'm a
                        </span>
                        <h1 className="text-[clamp(2rem,11.5vw,9rem)] text-center md:text-left leading-none">
                            <HackerText text="Generative AI" speed={40} />
                        </h1>
                    </div>

                    {/* Row 2: ENGINEER & (Outlined) */}
                    <div className="flex flex-col md:flex-row items-center justify-center md:justify-end relative z-0 w-full md:pr-[10%] mt-4 md:-mt-4">
                        <TextReveal el="h1" className="text-[clamp(3.5rem,11.5vw,12rem)] text-outline-strong mix-blend-screen text-center md:text-right leading-none" delay={0.8}>
                            ENGINEER
                        </TextReveal>
                        <span className="hero-connector font-serif italic text-4xl md:text-7xl text-blue-400 opacity-0 normal-case tracking-normal mt-2 md:mt-0 md:mb-6 md:ml-4">
                            &
                        </span>
                    </div>

                    {/* Row 3: SOFTWARE DEVELOPER */}
                    <div className="flex flex-col items-center md:items-start relative z-20 w-full md:pl-[20%] mt-4 md:-mt-8">
                        <TextReveal el="h1" className="text-[clamp(1.8rem,10vw,9rem)] text-center md:text-left leading-none" delay={1.0}>
                            SOFTWARE
                        </TextReveal>
                        <TextReveal el="h1" className="text-[clamp(1.8rem,10vw,9rem)] text-center md:text-left leading-[0.85]" delay={1.2}>
                            DEVELOPER
                        </TextReveal>
                    </div>

                </div>

                {/* Description & Buttons */}
                <div className="hero-desc mt-10 max-w-2xl opacity-0 flex flex-col items-center">
                    <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed font-light">
                        <span className="font-semibold text-white block mb-2">Hi, I'm Saurabh Lokhande</span>
                        Crafting intelligent agents and scalable systems.
                    </p>

                    <div className="hero-cta flex flex-col sm:flex-row gap-3 sm:gap-6 items-center pointer-events-auto">
                        <Magnetic>
                            <a href="#projects" className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors duration-300 inline-block text-sm sm:text-base w-48 sm:w-auto text-center">
                                View Projects
                            </a>
                        </Magnetic>
                        <Magnetic>
                            <a href="#contact" className="px-6 sm:px-8 py-3.5 sm:py-4 border border-white/20 backdrop-blur-sm text-white font-medium rounded-full hover:bg-white/10 transition-colors duration-300 inline-block text-sm sm:text-base w-48 sm:w-auto text-center">
                                Contact Me
                            </a>
                        </Magnetic>
                    </div>
                </div>

                {/* ── GitHub Social Proof Strip (Live Data) ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-gray-500 pointer-events-auto"
                >
                    <a
                        href="https://github.com/saurabhmj11"
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-white transition-colors group"
                        aria-label="GitHub profile"
                    >
                        <Github size={12} className="text-gray-600 group-hover:text-white transition-colors" />
                        <span>saurabhmj11</span>
                    </a>
                    <span className="text-gray-700">·</span>
                    <span className="flex items-center gap-1.5">
                        <GitBranch size={12} className="text-blue-400/60" />
                        {loading ? '--' : stats?.publicRepos} Public Repos
                    </span>
                    <span className="text-gray-700">·</span>
                    <span className="flex items-center gap-1.5">
                        <Star size={12} className="text-yellow-400/60" />
                        {!loading && (stats?.totalStars ?? 0) > 0 ? `${stats?.totalStars} Stars` : 'Active Builder'}
                    </span>
                    <span className="text-gray-700">·</span>
                    <span className="flex items-center gap-1.5">
                        <Users size={12} className="text-purple-400/60" />
                        {!loading && (stats?.followers ?? 0) > 0 ? `${stats?.followers} Followers` : 'Open Source Contributor'}
                    </span>
                </motion.div>
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
