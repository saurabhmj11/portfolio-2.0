import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BookOpen, Code2, Rocket } from 'lucide-react';

const ScrollIconEvolution = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll progress within this container (0 at top, 1 at bottom).
    // Target takes up 300vh, providing 3 screens worth of scroll duration.
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // --- Opacities ---
    // Transforms crossfade cleanly based on scroll percentage.
    const stage1Opacity = useTransform(scrollYProgress, [0, 0.3, 0.4], [1, 1, 0]);
    const stage2Opacity = useTransform(scrollYProgress, [0.3, 0.5, 0.6, 0.7], [0, 1, 1, 0]);
    const stage3Opacity = useTransform(scrollYProgress, [0.6, 0.8, 1], [0, 1, 1]);

    // --- Scales ---
    // Icons scale up when entering, scale down when exiting.
    const stage1Scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.5]);
    const stage2Scale = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0.5, 1, 0.5]);
    const stage3Scale = useTransform(scrollYProgress, [0.6, 0.8, 1], [0.5, 1, 1.2]);

    // --- Rotations ---
    // Subtle rotation for a morphing feel during transitions.
    const stage1Rotate = useTransform(scrollYProgress, [0, 0.4], [0, -45]);
    const stage2Rotate = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [45, 0, -45]);
    const stage3Rotate = useTransform(scrollYProgress, [0.6, 0.8, 1], [45, 0, 0]);

    // --- Theme Colors ---
    // Background radial blur changes color dynamically based on the stage.
    const bgGlowColor = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        ['#3b82f6', '#8b5cf6', '#10b981'] // Blue -> Purple -> Emerald
    );

    // --- Progress Bar ---
    const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    return (
        // The container is 300vh tall to allow for plenty of scroll distance
        <div ref={containerRef} className="relative w-full h-[300vh] bg-black text-white">

            {/* Sticky Content - Stays pinned to the screen while scrolling through the container */}
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

                {/* Dynamic Background Glow */}
                <motion.div
                    className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full mix-blend-screen opacity-20 blur-[100px] pointer-events-none transition-colors"
                    style={{ backgroundColor: bgGlowColor }}
                />

                {/* Text Headers */}
                <div className="z-10 text-center mb-16 px-4">
                    <h2 className="text-4xl md:text-6xl font-black font-display tracking-tighter mb-4">
                        Evolution of Mastery
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto font-mono">
                        Scroll to explore the progression matrix.
                    </p>
                </div>

                {/* The Evolving Icon UI */}
                <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-12">

                    {/* Outer Rotating Ring */}
                    <motion.div
                        className="absolute inset-0 rounded-full border border-white/10 border-t-white/40"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    />
                    {/* Inner Rotating Ring (Counter-clockwise) */}
                    <motion.div
                        className="absolute inset-4 rounded-full border border-white/5 border-l-white/30"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* Inner Orb & Icon Constraints */}
                    <div className="absolute inset-8 rounded-full bg-black/50 backdrop-blur-xl shadow-2xl border border-white/10 flex items-center justify-center overflow-hidden">

                        {/* Stage 1: The Learner */}
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center text-blue-400"
                            style={{ opacity: stage1Opacity, scale: stage1Scale, rotate: stage1Rotate }}
                        >
                            <BookOpen className="w-20 h-20 md:w-28 md:h-28 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]" strokeWidth={1.5} />
                        </motion.div>

                        {/* Stage 2: The Builder (Intermediate) */}
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center text-purple-400"
                            style={{ opacity: stage2Opacity, scale: stage2Scale, rotate: stage2Rotate }}
                        >
                            <Code2 className="w-20 h-20 md:w-28 md:h-28 drop-shadow-[0_0_20px_rgba(139,92,246,0.6)]" strokeWidth={1.5} />
                        </motion.div>

                        {/* Stage 3: The Architect (Advanced) */}
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center text-emerald-400"
                            style={{ opacity: stage3Opacity, scale: stage3Scale, rotate: stage3Rotate }}
                        >
                            <Rocket className="w-20 h-20 md:w-28 md:h-28 drop-shadow-[0_0_20px_rgba(16,185,129,0.6)]" strokeWidth={1.5} />
                        </motion.div>

                    </div>
                </div>

                {/* Morphing Role Labels */}
                <div className="relative h-12 w-full flex items-center justify-center z-10">
                    <motion.h3
                        className="absolute text-2xl md:text-3xl font-bold tracking-tight text-blue-400 uppercase"
                        style={{ opacity: stage1Opacity, y: useTransform(stage1Opacity, [0, 1], [20, 0]) }}
                    >
                        1. The Learner
                    </motion.h3>
                    <motion.h3
                        className="absolute text-2xl md:text-3xl font-bold tracking-tight text-purple-400 uppercase"
                        style={{ opacity: stage2Opacity, y: useTransform(stage2Opacity, [0, 1], [20, 0]) }}
                    >
                        2. The Builder
                    </motion.h3>
                    <motion.h3
                        className="absolute text-2xl md:text-3xl font-bold tracking-tight text-emerald-400 uppercase"
                        style={{ opacity: stage3Opacity, y: useTransform(stage3Opacity, [0, 1], [20, 0]) }}
                    >
                        3. The Architect
                    </motion.h3>
                </div>

                {/* Progress Bar Line */}
                <div className="absolute bottom-12 w-64 md:w-96 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                        style={{ width: progressWidth }}
                    />
                </div>

            </div>
        </div>
    );
};

export default ScrollIconEvolution;
