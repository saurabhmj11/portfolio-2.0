import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PreloaderProps {
    onComplete: () => void;
}

const words = ["Hello", "Bonjour", "Ciao", "Olà", "Namaste", "Saurabh"];

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // Lock scroll
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; }
    }, []);

    useEffect(() => {
        if (index === words.length - 1) return;
        const timeout = setTimeout(() => {
            setIndex(index + 1);
        }, 1200 / words.length);
        return () => clearTimeout(timeout);
    }, [index]);

    useEffect(() => {
        if (index === words.length - 1) {
            const timeout = setTimeout(() => {
                onComplete();
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [index, onComplete]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            {/* Background Columns */}
            <div className="absolute inset-0 flex h-screen w-screen">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: "100%" }}
                        exit={{ height: "0%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i } }}
                        className="relative w-1/5 bg-black border-r border-gray-900 last:border-r-0"
                    />
                ))}
            </div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10 text-off-white flex items-center gap-4 mix-blend-difference"
            >
                <span className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span className="text-4xl md:text-6xl font-bold tracking-tighter shadow-xl">
                    {words[index]}
                </span>
            </motion.div>

        </div>
    );
};

export default Preloader;
