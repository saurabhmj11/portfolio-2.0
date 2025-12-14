import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticProps {
    children: React.ReactElement;
}

// import useSound from 'use-sound';

// Placeholder for sound file. To enable sound:
// 1. Install use-sound
// 2. Add pop.mp3 to public folder
// 3. Uncomment imports and hook

const Magnetic: React.FC<MagneticProps> = ({ children }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    // const [playHover] = useSound('/pop.mp3', { volume: 0.5 });

    const handleMouse = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current?.getBoundingClientRect() || { height: 0, width: 0, left: 0, top: 0 };
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX, y: middleY });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const onMouseEnter = () => {
        // playHover();
    }

    const { x, y } = position;

    return (
        <motion.div
            style={{ position: "relative" }}
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            onMouseEnter={onMouseEnter}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        >
            {children}
        </motion.div>
    );
};

export default Magnetic;
