import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollConnector = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="fixed top-0 left-0 right-0 h-1 z-[100] pointer-events-none">
            {/* Track */}
            <div className="absolute inset-0 bg-white/5 w-full" />

            {/* Glowing Line Head - Horizontal */}
            <motion.div
                className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-blue-500 via-purple-500 to-white shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                style={{ scaleX, originX: 0 }}
            />
        </div>
    );
};

export default ScrollConnector;
