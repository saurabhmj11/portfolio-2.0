import React from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

interface GlowCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    href?: string;
}

const GlowCard: React.FC<GlowCardProps> = ({ children, className = "", onClick, href }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({
        currentTarget,
        clientX,
        clientY,
    }: React.MouseEvent<HTMLElement>) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const wrapperClass = `group relative max-w-md rounded-2xl border border-white/10 bg-neutral-950 px-8 py-8 shadow-2xl transition-transform duration-300 hover:-translate-y-1 overflow-hidden ${className}`;

    const content = (
        <>
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(120, 119, 198, 0.15),
              transparent 80%
            )
          `,
                }}
            />
            {children}
        </>
    );

    if (href) {
        return (
            <motion.a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onMouseMove={handleMouseMove}
                className={wrapperClass}
            >
                {content}
            </motion.a>
        );
    }

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onClick={onClick}
            className={wrapperClass}
        >
            {content}
        </motion.div>
    );
};

export default GlowCard;
