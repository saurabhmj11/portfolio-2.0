import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const Spotlight = () => {
    // Disable on touch devices to save battery and prevent unwanted visual behavior
    const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return null;

    const [isVisible, setIsVisible] = useState(false);

    // Using useMotionValue and useSpring for smooth following
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothOptions = { damping: 30, stiffness: 200, mass: 0.5 };
    const springX = useSpring(mouseX, smoothOptions);
    const springY = useSpring(mouseY, smoothOptions);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('mouseleave', handleMouseLeave);
        document.body.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [isVisible, mouseX, mouseY]);

    return (
        <motion.div
            className="pointer-events-none fixed inset-0 z-0 h-full w-full transition-opacity duration-300"
            style={{
                opacity: isVisible ? 1 : 0,
                background: "transparent",
            }}
        >
            <motion.div
                className="absolute w-[800px] h-[800px] rounded-full"
                style={{
                    x: springX,
                    y: springY,
                    translateX: "-50%",
                    translateY: "-50%",
                    background: "radial-gradient(circle, rgba(56,189,248,0.12) 0%, rgba(30,58,138,0.05) 40%, rgba(0,0,0,0) 70%)", // Richer cyber-blue glow
                    filter: "blur(60px)",
                    mixBlendMode: "screen"
                }}
            />
        </motion.div>
    );
};

export default Spotlight;
