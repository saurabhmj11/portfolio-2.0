import React from 'react';
import { motion, useInView } from 'framer-motion';
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
            initial={{ opacity: 0, y: isMobile ? 15 : 30, filter: isMobile ? 'blur(5px)' : 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: isMobile ? "-20px" : "-50px", amount: threshold }}
            transition={{
                duration: isMobile ? 0.6 : 0.8,
                ease: [0.22, 1, 0.36, 1], // Custom bezier for premium feel
                delay: delay
            }}
            style={{ width }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
