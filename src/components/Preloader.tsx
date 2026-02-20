import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
    onComplete: () => void;
}

const ringsData = [
    {
        text: "SAURABH LOKHANDE • AI ENGINEER • 2026 • ",
        radius: 110,
        speed: 15,
        dir: 1,
        trigger: 10
    },
    {
        text: "GENERATIVE AI • AGENTIC SYSTEMS • RAG • LLMS • ",
        radius: 170,
        speed: 20,
        dir: -1,
        trigger: 30
    },
    {
        text: "NEXT.JS 14 • TYPESCRIPT • PYTHON • LANGCHAIN • VECTOR DB • ",
        radius: 230,
        speed: 25,
        dir: 1,
        trigger: 50
    }
];

// Added new tech stack related data for the creative background elements
const techElements = [
    // AI / GenAI
    { label: "LLM", icon: "🧠", color: "text-purple-400", x: "10%", y: "20%", delay: 0 },
    { label: "RAG", icon: "🔎", color: "text-blue-400", x: "85%", y: "15%", delay: 0.2 },
    { label: "AGENTS", icon: "🤖", color: "text-cyan-400", x: "15%", y: "80%", delay: 0.4 },
    { label: "TRANSFORMERS", icon: "⚡", color: "text-yellow-400", x: "80%", y: "75%", delay: 0.1 },
    // Full Stack & DB
    { label: "NEXT.JS", icon: "▲", color: "text-white", x: "30%", y: "10%", delay: 0.5 },
    { label: "TYPESCRIPT", icon: "TS", color: "text-blue-500", x: "70%", y: "85%", delay: 0.3 },
    { label: "POSTGRESQL", icon: "🐘", color: "text-indigo-400", x: "5%", y: "50%", delay: 0.6 },
    { label: "VECTOR DB", icon: "🎯", color: "text-emerald-400", x: "90%", y: "45%", delay: 0.2 },
];

const nameString = "SAURABH LOKHANDE";

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [activeRings, setActiveRings] = useState<number[]>([]);

    useEffect(() => {
        // Prevent scrolling while preloader is active
        document.body.style.overflow = 'hidden';

        const interval = setInterval(() => {
            setProgress(prev => {
                const next = prev + 1;

                if (next >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return next;
            });
        }, 35); // Slightly faster for a snappier feel

        return () => {
            clearInterval(interval);
            document.body.style.overflow = '';
        };
    }, []);

    useEffect(() => {
        ringsData.forEach((ring, index) => {
            if (progress >= ring.trigger && !activeRings.includes(index)) {
                setActiveRings(prev => [...prev, index]);
            }
        });
    }, [progress, activeRings]);

    useEffect(() => {
        if (progress === 100) {
            setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => {
                    onComplete();
                    document.body.style.overflow = '';
                }, 1500); // Wait for complex exit animation
            }, 800);
        }
    }, [progress, onComplete]);

    // Split text into words, then letters for staggered reveal
    const words = nameString.split(" ");

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden"
                    exit={{
                        opacity: 0,
                        backdropFilter: "blur(0px)",
                        transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.8 }
                    }}
                >
                    {/* Atmospheric Glow tied to progress */}
                    <div
                        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
                        style={{
                            background: `radial-gradient(circle at center, rgba(255,255,255,${(progress / 100) * 0.05}) 0%, rgba(0,0,0,0) 70%)`
                        }}
                    />

                    {/* Floating Tech Elements Background */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                        {techElements.map((el, idx) => (
                            <motion.div
                                key={idx}
                                className={`absolute flex flex-col items-center justify-center font-mono opacity-0 ${el.color}`}
                                style={{ left: el.x, top: el.y }}
                                initial={{ opacity: 0, scale: 0, y: 20 }}
                                animate={{
                                    opacity: progress > 10 ? 0.3 : 0, // Reveal after 10%
                                    scale: progress > 10 ? 1 : 0,
                                    y: [0, -10, 0]
                                }}
                                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.5 } }}
                                transition={{
                                    opacity: { duration: 0.8, delay: el.delay },
                                    scale: { duration: 0.8, delay: el.delay, type: "spring" },
                                    y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: el.delay }
                                }}
                            >
                                <span className="text-2xl md:text-4xl mb-1">{el.icon}</span>
                                <span className="text-[8px] md:text-[10px] tracking-widest uppercase border border-current px-2 py-0.5 rounded-sm bg-black/50 backdrop-blur-sm">
                                    {el.label}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Rings Wrapper - Centered, absolute positioning to stay behind text */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
                        exit={{
                            scale: 15,
                            opacity: 0,
                            transition: { duration: 1.5, ease: [0.76, 0, 0.24, 1] }
                        }}
                    >
                        {ringsData.map((ring, index) => (
                            activeRings.includes(index) && (
                                <Ring key={index} {...ring} />
                            )
                        ))}
                    </motion.div>

                    {/* Main Content Area */}
                    <motion.div
                        className="relative z-10 flex flex-col items-center"
                        exit={{
                            y: -50,
                            opacity: 0,
                            filter: "blur(10px)",
                            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
                        }}
                    >
                        {/* Cinematic Typography Reveal */}
                        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8 overflow-hidden drop-shadow-2xl">
                            {words.map((word, wordIndex) => (
                                <div key={wordIndex} className="flex">
                                    {word.split('').map((char, charIndex) => (
                                        <motion.span
                                            key={charIndex}
                                            className="text-4xl md:text-7xl font-display font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                                            initial={{ y: 100, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{
                                                duration: 1,
                                                ease: [0.76, 0, 0.24, 1],
                                                delay: 0.1 + ((wordIndex * 7 + charIndex) * 0.05)
                                            }}
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Creative Cyber Badges (Reveal at 60%) */}
                        <motion.div
                            className="flex flex-wrap items-center justify-center gap-3 mb-12 text-xs md:text-sm font-mono tracking-[0.2em] uppercase"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: progress > 60 ? 1 : 0, y: progress > 60 ? 0 : 10 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="px-3 py-1 border border-cyan-400/30 text-cyan-400 bg-cyan-400/10 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.2)]">AI Systems</span>
                            <span className="text-white/30">•</span>
                            <span className="px-3 py-1 border border-blue-400/30 text-blue-400 bg-blue-400/10 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.2)]">Full Stack</span>
                            <span className="text-white/30">•</span>
                            <span className="px-3 py-1 border border-emerald-400/30 text-emerald-400 bg-emerald-400/10 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.2)]">Engineered</span>
                        </motion.div>

                        {/* Progress Bar & Percentage */}
                        <div className="flex flex-col items-center gap-4 w-64 md:w-80">
                            <motion.div
                                className="h-[3px] bg-white/10 w-full overflow-hidden rounded-full relative"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <motion.div
                                    className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400"
                                    style={{ width: `${progress}%` }}
                                    transition={{ ease: "linear" }}
                                />
                                {/* Scanning light effect */}
                                <motion.div
                                    className="absolute top-0 bottom-0 w-8 bg-white/40 blur-[2px]"
                                    animate={{ left: ["-20%", "120%"] }}
                                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                                />
                            </motion.div>

                            <motion.div
                                className="font-mono text-xs md:text-sm text-gray-400 tracking-widest flex justify-between w-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                    {progress < 100 ? 'INITIALIZING_' : 'SYSTEM_READY'}
                                </span>
                                <span className={progress === 100 ? "text-cyan-400 font-bold drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" : "text-white font-bold"}>
                                    {progress}%
                                </span>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const Ring = ({ text, radius, speed, dir }: { text: string, radius: number, speed: number, dir: number }) => {
    return (
        <motion.div
            className="absolute flex items-center justify-center rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: 0.4, // Reduced opacity so it doesn't overpower the main text
                scale: 1,
                rotate: dir * 360
            }}
            transition={{
                opacity: { duration: 1.2, ease: [0.76, 0, 0.24, 1] },
                scale: { duration: 1.2, ease: [0.76, 0, 0.24, 1] },
                rotate: { duration: speed, ease: "linear", repeat: Infinity }
            }}
            style={{ width: radius * 2, height: radius * 2 }}
        >
            {text.split('').map((char, i) => {
                const angle = (i / text.length) * 360;
                return (
                    <span
                        key={i}
                        className="absolute text-[9px] md:text-[11px] font-bold text-white uppercase font-mono"
                        style={{
                            transform: `rotate(${angle}deg) translateY(-${radius}px)`,
                            transformOrigin: 'center center',
                            left: '50%',
                            top: '50%',
                            marginTop: '-7px',
                            marginLeft: '-3.5px',
                            textShadow: '0 0 10px rgba(255,255,255,0.3)'
                        }}
                    >
                        {char}
                    </span>
                );
            })}
        </motion.div>
    );
};

export default Preloader;