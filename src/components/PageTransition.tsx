import React from 'react';
import { motion } from 'framer-motion';

const COLUMNS = 6;

interface PageTransitionProps {
    children: React.ReactNode;
    label?: string;
}

const PageTransition = ({ children, label = '' }: PageTransitionProps) => {
    return (
        <div className="page-transition-wrapper w-full relative">

            {/* ── Ink-bleed curtain columns ── */}
            <div className="fixed inset-0 z-[9998] pointer-events-none flex h-full w-full">
                {Array.from({ length: COLUMNS }).map((_, i) => (
                    <motion.div
                        key={i}
                        custom={i}
                        variants={{
                            initial: { scaleY: 1 },
                            enter: (idx: number) => ({
                                scaleY: 0,
                                transition: {
                                    duration: 0.7,
                                    ease: [0.76, 0, 0.24, 1],
                                    delay: 0.04 * idx,
                                }
                            }),
                            exit: (idx: number) => ({
                                scaleY: 1,
                                transition: {
                                    duration: 0.55,
                                    ease: [0.76, 0, 0.24, 1],
                                    delay: 0.04 * (COLUMNS - 1 - idx),
                                }
                            }),
                        }}
                        initial="exit"
                        animate="enter"
                        exit="exit"
                        style={{ originY: 0 }}
                        className="h-full w-full bg-[#030303] relative"
                    />
                ))}
            </div>

            {/* ── Centered label overlay (shows during transition) ── */}
            {label && (
                <motion.div
                    variants={{
                        initial: { opacity: 1 },
                        enter: { opacity: 0, transition: { duration: 0.3, delay: 0.2 } },
                        exit: { opacity: 1, transition: { duration: 0.2 } },
                    }}
                    initial="exit"
                    animate="enter"
                    exit="exit"
                    className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center"
                >
                    <motion.span
                        variants={{
                            initial: { y: 20, opacity: 0 },
                            enter: { y: 0, opacity: 0, transition: { duration: 0.4, delay: 0.15 } },
                            exit: { y: 0, opacity: 1, transition: { duration: 0.25 } },
                        }}
                        className="font-display font-black text-white text-[10vw] uppercase tracking-tighter leading-none select-none"
                    >
                        {label}
                    </motion.span>
                </motion.div>
            )}

            {/* ── Page content — clip-path reveal from bottom ── */}
            <motion.div
                variants={{
                    initial: { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
                    enter: {
                        clipPath: 'inset(0% 0 0 0)',
                        opacity: 1,
                        transition: { duration: 0.65, delay: 0.35, ease: [0.22, 1, 0.36, 1] }
                    },
                    exit: {
                        opacity: 0,
                        scale: 0.99,
                        filter: 'blur(4px)',
                        transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] }
                    },
                }}
                initial="initial"
                animate="enter"
                exit="exit"
            >
                {children}
            </motion.div>
        </div>
    );
};

export default PageTransition;
