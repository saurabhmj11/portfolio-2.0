import { useState, useRef, useEffect } from 'react';

const chars = "-_~`!@#$%^&*()+=[]{}|;:,.<>?/";

const HackerText = ({ text, className = "", speed = 40, trigger = false }: { text: string, className?: string, speed?: number, trigger?: boolean }) => {
    const [displayText, setDisplayText] = useState(text);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // We need a stable reference to the original text
    const originalText = text;

    const startScramble = () => {
        let iteration = 0;
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setDisplayText(
                originalText
                    .split("")
                    .map((_letter, index) => {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("")
            );

            if (iteration >= originalText.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
            }

            iteration += 1 / 2; // Slower reveal
        }, speed);
    };

    useEffect(() => {
        if (trigger) {
            startScramble();
        }
    }, [trigger]);

    return (
        <span
            className={`${className}`}
            onMouseEnter={startScramble}
        >
            {displayText}
        </span>
    );
};

export default HackerText;
