import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';


const Hero = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Slight parallax for the text
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <section
            id="home"
            ref={containerRef}
            className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black text-white px-4"
        >
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-50"
                >
                    <source src="https://uploads-ssl.webflow.com/65b7bac85c1092089d510616/65b8c737f3618d8dd99da139_VIDEO HOME (DSK)-transcode.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 z-10" />

            {/* Main Content */}
            <motion.div
                style={{ y }}
                className="relative z-20 flex flex-col items-center text-center w-full px-2 md:px-0"
            >
                {/* Row 1 */}
                <div className="flex flex-col md:flex-row items-center md:items-baseline justify-center gap-4 md:gap-8 w-full leading-none">
                    <motion.span
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="font-serif italic text-4xl md:text-5xl text-gray-300 md:mr-4"
                    >
                        I'm a
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-[10vw] md:text-[8vw] font-bold tracking-tighter"
                    >
                        GENERATIVE AI
                    </motion.h1>
                </div>

                {/* Row 2 */}
                <div className="flex flex-col md:flex-row items-center md:items-baseline justify-center gap-4 md:gap-8 w-full leading-none -mt-4 md:-mt-6">
                    <motion.h1
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-[10vw] md:text-[8vw] font-bold tracking-tighter"
                    >
                        ENGINEER
                    </motion.h1>
                    <motion.span
                        initial={{ opacity: 0, rotate: -20 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="font-serif italic text-6xl md:text-7xl text-gray-300 md:ml-4"
                    >
                        &
                    </motion.span>
                </div>

                {/* Row 3 */}
                <div className="flex flex-col items-center justify-center w-full leading-none -mt-4 md:-mt-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-[10vw] md:text-[8vw] font-bold tracking-tighter"
                    >
                        SOFTWARE
                    </motion.h1>
                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="text-[10vw] md:text-[8vw] font-bold tracking-tighter"
                    >
                        ENGINEER
                    </motion.h1>
                </div>

                {/* Description & Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="mt-12 max-w-2xl"
                >
                    <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
                        <span className="font-bold text-white block mb-2">Hi, I'm Saurabh Lokhande</span>
                        An AI/Software Developer transforming ideas into intelligent solutions.
                        <br /><br />
                        I specialize in creating AI-driven applications, crafting innovative generative AI models, and building scalable software solutions. Passionate about learning and pushing the boundaries of technology.
                    </p>


                </motion.div>
            </motion.div>

        </section>
    );
};

export default Hero;
