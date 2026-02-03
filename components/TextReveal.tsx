import React, { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

interface TextRevealProps {
    children: string;
    className?: string;
    el?: keyof JSX.IntrinsicElements; // Allow 'h1', 'p', etc.
}

const TextReveal: React.FC<TextRevealProps> = ({ children, className, el: Wrapper = 'p' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    const words = children.split(" ");

    const container: Variants = {
        hidden: { opacity: 0 },
        visible: (i: number = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
        }),
    };

    const child: Variants = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <Wrapper ref={ref} className={className}>
            <motion.span
                variants={container}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="inline-block"
            >
                {words.map((word, index) => (
                    <motion.span
                        variants={child}
                        key={index}
                        className="inline-block mr-[0.2em] whitespace-nowrap"
                    >
                        {word}
                    </motion.span>
                ))}
            </motion.span>
        </Wrapper>
    );
};

export default TextReveal;
