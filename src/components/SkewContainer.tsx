import React from 'react';
import { useLenis } from '@studio-freight/react-lenis';
import { motion, useSpring, useTransform } from 'framer-motion';

interface SkewContainerProps {
    children: React.ReactNode;
}

const SkewContainer: React.FC<SkewContainerProps> = ({ children }) => {
    const skew = useSpring(0, { stiffness: 200, damping: 30 });

    useLenis((lenis: any) => {
        const velocity = lenis.velocity || 0;
        // Limit max skew to avoid usability issues
        const targetSkew = Math.max(Math.min(velocity * 0.05, 5), -5);
        skew.set(targetSkew);
    });

    const skewY = useTransform(skew, (value) => `${value}deg`);

    return (
        <motion.div style={{ skewY, transformOrigin: "center center" }}>
            {children}
        </motion.div>
    );
};

export default SkewContainer;
