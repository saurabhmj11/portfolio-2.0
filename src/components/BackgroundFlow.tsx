
import { motion, useScroll, useTransform } from 'framer-motion';

const BackgroundFlow = () => {
    const { scrollYProgress } = useScroll();

    // Map scroll progress to background colors
    const bg1 = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], ["#050510", "#0a0a1a", "#050a0a", "#0a0a0a", "#050510"]);

    // Ambient Orbs movement
    const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

    // Central Glow based on scroll position - MUST be called before early return to satisfy Rules of Hooks
    const glowOpacity = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0, 0.3, 0]);
    const glowScale = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0.8, 1.2, 0.8]);



    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Global Gradient Shift */}
            <motion.div
                className="absolute inset-0 transition-colors duration-[2000ms]"
                style={{ backgroundColor: bg1 }}
            />

            {/* Moving Orbs */}
            <motion.div
                style={{ y: y1 }}
                className="absolute top-[-20%] left-[-10%] w-[40vw] h-[40vw] bg-blue-900/10 rounded-full blur-[40px] will-change-transform"
            />

            <motion.div
                style={{ y: y2 }}
                className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-purple-900/10 rounded-full blur-[40px] will-change-transform"
            />

            {/* Central Glow based on scroll position */}
            <motion.div
                style={{
                    opacity: glowOpacity,
                    scale: glowScale
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] bg-cyan-900/10 rounded-full blur-[30px] will-change-transform"
            />
        </div>
    );
};

export default BackgroundFlow;
