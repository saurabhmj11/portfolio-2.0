import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

interface MouseParallaxProps {
    children: React.ReactNode;
    className?: string;
    strength?: number; // How much it moves (default 20)
}

const MouseParallax: React.FC<MouseParallaxProps> = ({ children, className = "", strength = 20 }) => {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth physics for the mouse movement
    const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

    const transform = useMotionTemplate`translateX(${xSpring}px) translateY(${ySpring}px)`;

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;

        const { left, top, width, height } = ref.current.getBoundingClientRect();

        // Calculate relative position (-0.5 to 0.5)
        const relativeX = (e.clientX - left) / width - 0.5;
        const relativeY = (e.clientY - top) / height - 0.5;

        x.set(relativeX * strength);
        y.set(relativeY * strength);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transformStyle: "preserve-3d", transform, willChange: 'transform' }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default MouseParallax;
