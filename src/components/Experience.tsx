import React, { useRef, Suspense } from 'react';
import { useScroll, useSpring } from 'framer-motion';
import useIsMobile from '../hooks/useIsMobile';
import AIEvolutionOverlay from './AIEvolutionOverlay';

// Lazy load the heavy R3F scene
const AIEvolutionScene = React.lazy(() => import('./AIEvolutionScene'));

const Experience = () => {
    const isMobile = useIsMobile();
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // Smooth spring for cinematic interpolation
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 80,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <section id="experience">
            {/* 600vh tall scroll container */}
            <div ref={containerRef} className="relative w-full h-[600vh]">

                {/* Sticky viewport — pinned to screen during scroll */}
                <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#020617]">

                    {/* 3D Scene — Desktop only for performance */}
                    {!isMobile && (
                        <Suspense fallback={
                            <div className="absolute inset-0 bg-[#020617] flex items-center justify-center">
                                <span className="font-mono text-xs tracking-[0.3em] text-gray-600 uppercase animate-pulse">
                                    Initializing Neural Engine...
                                </span>
                            </div>
                        }>
                            <AIEvolutionScene progress={smoothProgress} />
                        </Suspense>
                    )}

                    {/* Mobile fallback background */}
                    {isMobile && (
                        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0a0a2e] to-[#020617]" />
                    )}

                    {/* HTML Overlay — always rendered */}
                    <AIEvolutionOverlay progress={smoothProgress} />
                </div>
            </div>
        </section>
    );
};

export default Experience;
