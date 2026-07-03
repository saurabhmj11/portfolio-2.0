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
    // rAF ref: batches getBoundingClientRect() away from the mousemove flood
    const rafId = useRef<number | null>(null);
    const latestMouse = useRef({ x: 0, y: 0 });

    // Disable magnetic physics and hover sounds on touch devices
    const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) {
        return <>{children}</>;
    }

    const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
        // Store raw coords — zero layout cost
        latestMouse.current = { x: e.clientX, y: e.clientY };

        if (rafId.current !== null) return; // already scheduled
        rafId.current = requestAnimationFrame(() => {
            rafId.current = null;
            if (!ref.current) return;
            // getBoundingClientRect() is safe here — we're inside rAF,
            // so the browser has already committed the previous frame's layout.
            const { height, width, left, top } = ref.current.getBoundingClientRect();
            const { x: clientX, y: clientY } = latestMouse.current;
            const middleX = clientX - (left + width / 2);
            const middleY = clientY - (top + height / 2);
            setPosition({ x: middleX * 0.35, y: middleY * 0.35 });
        });
    };

    const reset = () => {
        if (rafId.current !== null) {
            cancelAnimationFrame(rafId.current);
            rafId.current = null;
        }
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
