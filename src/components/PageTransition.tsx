import React from 'react';
import { motion } from 'framer-motion';

const columns = 5;

const anim = {
    initial: {
        top: "0%",
    },
    enter: (i: number) => ({
        top: "100%",
        transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i }
    }),
    exit: (i: number) => ({
        top: "0%",
        transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.05 * (columns - 1 - i) }
    })
};

const PageTransition = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="page-transition-wrapper w-full relative">
            {/* The sweeping curtain effect */}
            <div className="fixed inset-0 z-[9999] pointer-events-none flex h-screen w-screen">
                {Array.from({ length: columns }).map((_, i) => (
                    <motion.div
                        key={i}
                        variants={anim}
                        custom={i}
                        initial="initial"
                        animate="enter"
                        exit="exit"
                        className="h-full w-full bg-[#0a0a0a] relative border-r border-white/5 last:border-r-0"
                    />
                ))}
            </div>

            {/* Content reveal */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, filter: "blur(5px)" }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default PageTransition;
