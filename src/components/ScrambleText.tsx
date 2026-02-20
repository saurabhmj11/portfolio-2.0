import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

interface ScrambleTextProps {
    text: string;
    className?: string;
    delay?: number;
    duration?: number;
}

const ScrambleText: React.FC<ScrambleTextProps> = ({ text, className = "", delay = 0, duration = 1500 }) => {
    const [displayText, setDisplayText] = useState("");
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (!isInView) return;

        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            // Wait for delay
            if (elapsed < delay * 1000) {
                animationFrameId = requestAnimationFrame(animate);
                return;
            }

            const activeElapsed = elapsed - (delay * 1000);
            const progress = Math.min(activeElapsed / duration, 1);

            // How many characters should be firmly resolved by now
            const resolveCount = Math.floor(progress * text.length);

            let newText = "";
            for (let i = 0; i < text.length; i++) {
                if (text[i] === " " || text[i] === "\n") {
                    newText += text[i];
                } else if (i < resolveCount) {
                    newText += text[i];
                } else {
                    newText += CHARSET[Math.floor(Math.random() * CHARSET.length)];
                }
            }

            setDisplayText(newText);

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isInView, text, delay, duration]);

    return (
        <motion.span
            ref={ref}
            className={`inline-block font-mono ${className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1, delay }}
        >
            {displayText || text.replace(/[^ \n]/g, '_')} {/* Initial placeholder */}
        </motion.span>
    );
};

export default ScrambleText;
