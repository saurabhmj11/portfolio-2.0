import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollLine = () => {
    const { scrollYProgress } = useScroll();
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            style={{ scaleY }}
            className="fixed top-0 left-6 md:left-12 w-[1px] h-full bg-gradient-to-b from-transparent via-gray-400 to-transparent z-[0] origin-top mix-blend-difference opacity-30"
        />
    );
};

export default ScrollLine;
