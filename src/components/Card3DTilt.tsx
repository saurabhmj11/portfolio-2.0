import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Card3DTiltProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number;     // 0–1 multiplier for tilt strength
    glareEnabled?: boolean;
}

/**
 * Card3DTilt — A drop-in wrapper that adds a physical 3D perspective tilt
 * to any child component, reacting to the user's cursor position.
 *
 * Features:
 * - Spring-physics smoothing for a natural, weighty feel
 * - Optional specular glare highlight that follows the cursor
 * - Graceful reset animation on mouse leave
 * - Zero dependencies outside of framer-motion (already installed)
 */
const Card3DTilt = ({ children, className = '', intensity = 1, glareEnabled = true }: Card3DTiltProps) => {
    const cardRef = useRef<HTMLDivElement>(null);

    // Raw motion values for mouse position (normalized -1 to +1)
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);

    // Spring-smoothed versions — feel heavy and physical
    const springConfig = { stiffness: 280, damping: 28, mass: 0.6 };
    const smoothX = useSpring(rawX, springConfig);
    const smoothY = useSpring(rawY, springConfig);

    // Map spring values to CSS 3D rotation angles
    const maxAngle = 14 * intensity;
    const rotateY = useTransform(smoothX, [-1, 1], [-maxAngle, maxAngle]);
    const rotateX = useTransform(smoothY, [-1, 1], [maxAngle, -maxAngle]);

    // Glare position (shifts based on mouse)
    const glareX = useTransform(smoothX, [-1, 1], ['-40%', '140%']);
    const glareY = useTransform(smoothY, [-1, 1], ['-40%', '140%']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        rawX.set(x);
        rawY.set(y);
    };

    const handleMouseLeave = () => {
        rawX.set(0);
        rawY.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
                perspective: '800px',
            }}
            className={`relative ${className}`}
        >
            {/* The main card content — pushed forward in Z */}
            <div style={{ transform: 'translateZ(0px)', transformStyle: 'preserve-3d' }}>
                {children}
            </div>

            {/* Specular glare highlight */}
            {glareEnabled && (
                <motion.div
                    className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden"
                    style={{ zIndex: 20 }}
                >
                    <motion.div
                        className="absolute w-[200%] h-[200%] rounded-full"
                        style={{
                            left: glareX,
                            top: glareY,
                            background: 'radial-gradient(circle at center, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)',
                            translateX: '-50%',
                            translateY: '-50%',
                        }}
                    />
                </motion.div>
            )}
        </motion.div>
    );
};

export default Card3DTilt;
