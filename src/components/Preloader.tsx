import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

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

// Every infinite/looping animation (ring spin, icon float, scan sweep) now runs
// on these CSS keyframes instead of Framer Motion's JS-driven rAF loop.
// Framer Motion is kept only for one-shot enter/exit transitions, so once the
// intro settles there are zero persistent JS animation subscriptions left —
// just GPU-composited CSS, which is what actually keeps this jank-free on
// mid-range phones.
const PRELOADER_KEYFRAMES = `
@keyframes preloader-ring-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.preloader-ring-spin {
  animation-name: preloader-ring-spin;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform;
}
@keyframes preloader-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.preloader-float {
  animation: preloader-float 3s ease-in-out infinite;
  will-change: transform;
}
@keyframes preloader-scan {
  from { transform: translateX(-20%); }
  to { transform: translateX(120%); }
}
.preloader-scan {
  animation: preloader-scan 1.2s linear infinite;
  will-change: transform;
}
`;

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleComplete = () => {
        setIsVisible(false);
        setTimeout(() => {
            onComplete();
            document.body.style.overflow = '';
        }, 300); // Shortened exit animation
    };

    const words = nameString.split(" ");

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden"
                    exit={{
                        opacity: 0,
                        transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1], delay: 0 }
                    }}
                >
                    <style>{PRELOADER_KEYFRAMES}</style>

                    {/* Atmospheric Glow — static gradient, faded in via opacity only.
                        Animating the `background` string forces a full-screen repaint
                        on every frame; opacity is compositor-only. */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none z-0"
                        style={{
                            background: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 70%)'
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, ease: "linear" }}
                    />

                    {/* Floating Tech Elements Background */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                        {techElements.map((el, idx) => (
                            <motion.div
                                key={idx}
                                className={`absolute flex flex-col items-center justify-center font-mono ${el.color}`}
                                style={{ left: el.x, top: el.y }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 0.3, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.5 } }}
                                transition={{
                                    opacity: { duration: 0.8, delay: 0.1 + el.delay },
                                    scale: { duration: 0.8, delay: 0.1 + el.delay, type: "spring" }
                                }}
                            >
                                {/* Bobbing is CSS now, not Framer Motion — it never
                                    touches JS again after the entrance finishes. */}
                                <div className="preloader-float flex flex-col items-center" style={{ animationDelay: `${el.delay}s` }}>
                                    <span className="text-2xl md:text-4xl mb-1 block">{el.icon}</span>
                                    <span className="text-[8px] md:text-[10px] tracking-widest uppercase border border-current px-2 py-0.5 rounded-sm bg-black/50 backdrop-blur-sm block">
                                        {el.label}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Rings Wrapper - Centered, absolute positioning to stay behind text */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
                        exit={{
                            scale: 15,
                            opacity: 0,
                            transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] }
                        }}
                    >
                        {ringsData.map((ring, index) => (
                            <Ring key={index} {...ring} />
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
                        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8 overflow-hidden drop-shadow-lg">
                            {words.map((word, wordIndex) => (
                                <div key={wordIndex} className="flex">
                                    {word.split('').map((char, charIndex) => (
                                        <motion.span
                                            key={charIndex}
                                            className="text-4xl md:text-7xl font-display font-bold tracking-tighter text-white"
                                            initial={{ y: 100, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{
                                                duration: 0.5,
                                                ease: [0.76, 0, 0.24, 1],
                                                delay: 0.05 + ((wordIndex * 7 + charIndex) * 0.025)
                                            }}
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Creative Cyber Badges */}
                        <motion.div
                            className="flex flex-wrap items-center justify-center gap-3 mb-12 text-xs md:text-sm font-mono tracking-[0.2em] uppercase"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                        >
                            <span className="px-3 py-1 border border-cyan-400/30 text-cyan-400 bg-cyan-400/10 rounded-full">AI Systems</span>
                            <span className="text-white/30">•</span>
                            <span className="px-3 py-1 border border-blue-400/30 text-blue-400 bg-blue-400/10 rounded-full">Full Stack</span>
                            <span className="text-white/30">•</span>
                            <span className="px-3 py-1 border border-emerald-400/30 text-emerald-400 bg-emerald-400/10 rounded-full">Engineered</span>
                        </motion.div>

                        <ProgressIndicator onComplete={handleComplete} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const ProgressIndicator = ({ onComplete }: { onComplete: () => void }) => {
    // 0 re-renders during progress!
    const progress = useMotionValue(0);
    const scaleX = useTransform(progress, [0, 100], [0, 1]);
    const percentageText = useTransform(progress, (v) => `${Math.floor(v)}%`);

    // Status text transform
    const statusText = useTransform(progress, (v) => (v < 100 ? 'INITIALIZING_' : 'SYSTEM_READY') as string);
    const statusColor = useTransform(progress, (v) => (v < 100 ? '#9ca3af' : '#22d3ee') as string); // gray-400 to cyan-400

    useEffect(() => {
        const controls = animate(progress, 100, {
            duration: 0.5, // 0.5 seconds — fast, snappy
            ease: "linear",
            onComplete: () => {
                setTimeout(onComplete, 100);
            }
        });
        return controls.stop;
    }, [progress, onComplete]);

    return (
        <div className="flex flex-col items-center gap-4 w-64 md:w-80">
            <motion.div
                className="h-[3px] bg-white/10 w-full overflow-hidden rounded-full relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <motion.div
                    className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 origin-left"
                    style={{ scaleX, width: '100%' }}
                />
                {/* Scanning light effect — moved off `left` (a layout-triggering
                    property) onto a CSS transform animation (composited, no
                    reflow on every frame). The wrapper is sized to match the
                    track (inset-0) so percentage transforms line up exactly
                    like the original -20%/120% `left` keyframes did. */}
                <div className="absolute inset-0 preloader-scan">
                    <div className="absolute top-0 bottom-0 left-0 w-8 bg-white/20" />
                </div>
            </motion.div>

            <motion.div
                className="font-mono text-xs md:text-sm tracking-widest flex justify-between w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                <motion.span className="flex items-center gap-2" style={{ color: statusColor }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <motion.span>{statusText}</motion.span>
                </motion.span>
                <motion.span
                    className="font-bold"
                    style={{ color: statusColor }}
                >
                    {percentageText}
                </motion.span>
            </motion.div>
        </div>
    );
};

const Ring = React.memo(({ text, radius, speed, dir, trigger }: { text: string, radius: number, speed: number, dir: number, trigger: number }) => {
    const chars = text.split('');
    return (
        <motion.div
            className="absolute flex items-center justify-center rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: trigger / 100 }}
            style={{ width: radius * 2, height: radius * 2 }}
        >
            {/* Rotation now lives entirely in CSS — Framer Motion above only
                handles the one-shot fade/scale-in, so the spin keeps running
                smoothly on the compositor thread even while React is busy
                doing other work (route changes, data fetching, etc). */}
            <div
                className="absolute inset-0 preloader-ring-spin"
                style={{
                    animationDuration: `${speed}s`,
                    animationDirection: dir === -1 ? 'reverse' : 'normal'
                }}
            >
                {chars.map((char, i) => {
                    const angle = (i / chars.length) * 360;
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
                                marginLeft: '-3.5px'
                            }}
                        >
                            {char}
                        </span>
                    );
                })}
            </div>
        </motion.div>
    );
});
Ring.displayName = 'Ring';

export default Preloader;