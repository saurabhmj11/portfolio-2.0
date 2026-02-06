import React, { useRef } from 'react';
import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';

const VelocityText = ({ children }: { children: React.ReactNode }) => {
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });

    // Map velocity to skew
    const skewX = useTransform(smoothVelocity, [-1000, 1000], [-15, 15]);

    return (
        <motion.div style={{ skewX }} className="inline-block">
            {children}
        </motion.div>
    );
};

export default VelocityText;
