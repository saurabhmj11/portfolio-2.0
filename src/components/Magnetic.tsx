import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../hooks/useSound';

interface MagneticProps {
    children: React.ReactElement;
}

const Magnetic: React.FC<MagneticProps> = ({ children }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const { playHover, playClick } = useSound();

    // Disable magnetic physics and hover sounds on touch devices
    const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) {
        return <>{children}</>;
    }

    const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e;
        if (!ref.current) return;

        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);

        // Magnetic strength (0.5 = strong, 0.1 = weak)
        setPosition({ x: middleX * 0.35, y: middleY * 0.35 });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;

    return (
        <motion.div
            style={{ position: 'relative' }}
            ref={ref}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 350, damping: 10, mass: 0.35 }}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            onMouseEnter={playHover}
            onMouseDown={playClick}
        >
            {children}
        </motion.div>
    );
};

export default Magnetic;
