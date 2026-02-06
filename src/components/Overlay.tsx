import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Overlay = ({ containerRef }: { containerRef: React.RefObject<HTMLElement> }) => {
    // We expect the parent (ScrollyCanvas wrapper) to be the scroll target
    // But since Overlay is likely INSIDE the sticky container, we need to link to the same progress.
    // Ideally, we pass the generic window scroll or use the hook if the container is fixed size.

    // Actually, ScrollyCanvas creates the 500vh container. 
    // We should put Overlay INSIDE ScrollyCanvas sticky div or hook into the same timeline.

    // Let's rely on absolute positioning + separate scroll hooks for now, 
    // OR ScrollyCanvas exports progress context.
    // Simpler: Just use window scroll for now since it's the main scroller.

    const { scrollYProgress } = useScroll();

    // Mapping scroll (0-1 over the whole page not ideal, need relative)
    // Adjust logic: The parent is 500vh.
    // 0 -> 0.2 (Intro)
    // 0.2 -> 0.4 (Middle)
    // 0.4 -> 0.6 (End)

    const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.2], [0, 1, 0]);
    const y1 = useTransform(scrollYProgress, [0, 0.2], [50, -50]);

    const opacity2 = useTransform(scrollYProgress, [0.2, 0.3, 0.4], [0, 1, 0]);
    const x2 = useTransform(scrollYProgress, [0.2, 0.4], [-50, 0]);

    const opacity3 = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0, 1, 0]);
    const scale3 = useTransform(scrollYProgress, [0.4, 0.6], [0.8, 1.1]);

    return (
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-center items-center">

            {/* Section 1 */}
            <motion.div
                style={{ opacity: opacity1, y: y1 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
            >
                <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-4 mix-blend-difference">
                    Saurabh Lokhande
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 font-light tracking-widest uppercase">
                    Creative Developer
                </p>
            </motion.div>

            {/* Section 2 */}
            <motion.div
                style={{ opacity: opacity2, x: x2 }}
                className="fixed top-1/3 left-12 md:left-24 max-w-lg"
            >
                <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                    I build digital<br />
                    <span className="text-blue-500">experiences.</span>
                </h2>
            </motion.div>

            {/* Section 3 */}
            <motion.div
                style={{ opacity: opacity3, scale: scale3 }}
                className="fixed bottom-1/3 right-12 md:right-24 text-right max-w-lg"
            >
                <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                    Bridging design<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        & engineering.
                    </span>
                </h2>
            </motion.div>

        </div>
    );
};

export default Overlay;
