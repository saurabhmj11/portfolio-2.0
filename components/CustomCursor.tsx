import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { soundManager } from '../utils/SoundManager';

const CustomCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const [isHovering, setIsHovering] = useState(false);
    const [hoverText, setHoverText] = useState('');

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 16);
            cursorY.set(e.clientY - 16);
        }

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName.toLowerCase() === 'a' || target.closest('a') || target.tagName.toLowerCase() === 'button' || target.closest('button')) {
                setIsHovering(true);
                setHoverText('LINK DETECTED');
                soundManager.playHover();
            } else {
                setIsHovering(false);
                setHoverText('');
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        }
    }, [cursorX, cursorY]);

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference flex items-center gap-2"
            style={{
                translateX: cursorXSpring,
                translateY: cursorYSpring,
            }}
        >
            <motion.div
                animate={{
                    scale: isHovering ? 1.5 : 1,
                    rotate: isHovering ? 45 : 0
                }}
                className={`w-8 h-8 border border-white rounded-full flex items-center justify-center transition-colors duration-300 ${isHovering ? 'border-dashed' : ''}`}
            >
                <div className={`w-1.5 h-1.5 bg-white rounded-full ${isHovering ? 'animate-ping' : ''}`} />
            </motion.div>

            <AnimatePresence>
                {isHovering && (
                    <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 20 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="text-[10px] font-mono font-bold text-white bg-black/50 px-2 py-1 rounded"
                    >
                        {hoverText}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CustomCursor;
