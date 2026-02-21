import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
    // Disable completely on mobile touch screens to save battery and prevent dual-cursors
    const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return null;

    const [isHovering, setIsHovering] = useState(false);

    const cursorSize = isHovering ? 20 : 15;

    const mouse = {
        x: useMotionValue(0),
        y: useMotionValue(0)
    }

    // Smooth physics for the main cursor
    const smoothOptions = { damping: 20, stiffness: 300, mass: 0.5 }
    const smoothMouse = {
        x: useSpring(mouse.x, smoothOptions),
        y: useSpring(mouse.y, smoothOptions)
    }

    useEffect(() => {
        const manageMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            mouse.x.set(clientX - cursorSize / 2);
            mouse.y.set(clientY - cursorSize / 2);
        }

        const manageMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName.toLowerCase() === 'a' || target.closest('a') ||
                target.tagName.toLowerCase() === 'button' || target.closest('button') ||
                target.classList.contains('magnetic-target')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        }

        window.addEventListener("mousemove", manageMouseMove);
        window.addEventListener("mouseover", manageMouseOver);

        return () => {
            window.removeEventListener("mousemove", manageMouseMove);
            window.removeEventListener("mouseover", manageMouseOver);
        }
    }, [isHovering, cursorSize]);

    return (
        <>
            <motion.div
                style={{
                    left: smoothMouse.x,
                    top: smoothMouse.y,
                }}
                className="fixed z-[9999] pointer-events-none mix-blend-difference"
            >
                <motion.div
                    animate={{
                        scale: isHovering ? 4 : 1
                    }}
                    transition={{ duration: 0.3, ease: "backOut" }}
                    className="w-[20px] h-[20px] bg-white rounded-full"
                />
            </motion.div>
            <motion.div
                style={{
                    left: mouse.x,
                    top: mouse.y,
                }}
                className="fixed z-[9999] pointer-events-none mix-blend-difference"
            >
                <div className="w-[10px] h-[10px] bg-white rounded-full" />
            </motion.div>
        </>
    );
};

export default CustomCursor;
