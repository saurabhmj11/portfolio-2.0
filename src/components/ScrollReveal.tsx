import React from 'react';
import { motion } from 'framer-motion';
import useIsMobile from '../hooks/useIsMobile';

interface ScrollRevealProps {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    className?: string;
    threshold?: number;
}

const ScrollReveal = ({
    children,
    width = "fit-content",
    delay = 0,
    className = "",
    threshold = 0.2
}: ScrollRevealProps) => {
    const isMobile = useIsMobile();

    return (
        <motion.div
            // Compositor-only properties (opacity + translateY) — no repaints.
            // Removed blur() filter: it forces a full-screen repaint on every
            // animation frame and causes visible judder during scroll-driven reveals.
            initial={{ opacity: 0, y: isMobile ? 12 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: isMobile ? "-10px" : "-40px", amount: threshold }}
            transition={{
                duration: isMobile ? 0.5 : 0.65,
                ease: [0.22, 1, 0.36, 1],
                delay: delay,
            }}
            style={{ width, willChange: 'transform, opacity' }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
