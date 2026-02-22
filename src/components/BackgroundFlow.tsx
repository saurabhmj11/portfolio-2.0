
import { motion, useScroll, useTransform } from 'framer-motion';
import useIsMobile from '../hooks/useIsMobile';

const BackgroundFlow = () => {
    const { scrollYProgress } = useScroll();
    const isMobile = useIsMobile();

    // Map scroll progress to background colors
    const bg1 = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], ["#050510", "#0a0a1a", "#050a0a", "#0a0a0a", "#050510"]);

    // Ambient Orbs movement
    const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

    // Central Glow based on scroll position - MUST be called before early return to satisfy Rules of Hooks
    const glowOpacity = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0, 0.3, 0]);
    const glowScale = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0.8, 1.2, 0.8]);

    if (isMobile) {
        return (
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050510]">
                <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-blue-900/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-purple-900/10 rounded-full blur-3xl opacity-50" />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Global Gradient Shift */}
            <motion.div
                className="absolute inset-0 transition-colors duration-[2000ms]"
                style={{ backgroundColor: bg1 }}
            />

            {/* Moving Orbs */}
            <motion.div
                style={{ y: y1, rotate }}
                className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[120px]"
            />

            <motion.div
                style={{ y: y2, rotate: rotate }}
                className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-900/10 rounded-full blur-[120px]"
            />

            {/* Central Glow based on scroll position */}
            <motion.div
                style={{
                    opacity: glowOpacity,
                    scale: glowScale
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-cyan-900/10 rounded-full blur-[100px]"
            />
        </div>
    );
};

export default BackgroundFlow;
