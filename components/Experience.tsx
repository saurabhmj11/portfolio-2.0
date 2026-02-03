import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

const experiences = [
    {
        year: '2020-2023',
        title: 'B.Tech Copmuter Science',
        org: 'Amravati University',
        desc: 'Specialized in Machine Learning & Deep Learning. Published research on NLP.',
        color: 'from-purple-500 to-indigo-500'
    },
    {
        year: 'June 2023 - Dec 2023',
        title: 'Data Analyst Intern',
        org: 'Pantech Solutions',
        desc: 'Conceptualized RAG systems. Cleaned investment data for reasoning models.',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        year: 'Jan 2024 - Present',
        title: 'Junior Developer',
        org: 'Freelance / Remote',
        desc: 'Building autonomous agents using LangGraph & Google ADK. Implementing MCP servers.',
        color: 'from-green-500 to-emerald-500'
    },
    {
        year: 'Future',
        title: 'AI Architect',
        org: 'Saurabh Lokhande',
        desc: 'Ready to deploy scalable Multi-Agent Systems for your company. Immediate Joiner.',
        color: 'from-orange-500 to-red-500'
    }
];

const Experience = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"]
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-85%"]);

    return (
        <section ref={targetRef} className="relative h-[250vh] bg-black text-white">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">

                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none z-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
                </div>

                <div className="absolute top-10 left-10 z-10">
                    <h2 className="text-[12px] uppercase tracking-widest text-gray-500 mb-2">My Journey</h2>
                    <h3 className="text-4xl font-bold">Experience Timeline</h3>
                </div>

                <motion.div style={{ x }} className="flex gap-12 px-24 will-change-transform">
                    {experiences.map((exp, i) => (
                        <TiltCard key={i} exp={exp} index={i} total={experiences.length} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const TiltCard = ({ exp, index, total }: { exp: any, index: number, total: number }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div className="relative group min-w-[500px] md:min-w-[600px] perspective-1000">
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative overflow-hidden rounded-3xl bg-neutral-900 border border-white/10 p-12 h-[400px] flex flex-col justify-between hover:border-white/30 transition-colors duration-500"
            >
                <div
                    style={{ transform: "translateZ(50px)" }}
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${exp.color} opacity-20 blur-3xl rounded-full group-hover:opacity-40 transition-opacity duration-500`}
                />

                <div style={{ transform: "translateZ(75px)" }}>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${exp.color} bg-clip-text text-transparent border border-white/10 mb-6`}>
                        {exp.year}
                    </span>
                    <h4 className="text-4xl font-bold mb-2">{exp.title}</h4>
                    <p className="text-xl text-gray-400">{exp.org}</p>
                </div>

                <p style={{ transform: "translateZ(50px)" }} className="text-lg text-gray-300 leading-relaxed max-w-sm">
                    {exp.desc}
                </p>

                <span style={{ transform: "translateZ(20px)" }} className="absolute bottom-8 right-8 text-9xl font-bold text-white/5 select-none -z-0">
                    0{index + 1}
                </span>
            </motion.div>

            {/* Connecting Line */}
            {index < total - 1 && (
                <div className="absolute top-1/2 right-[-24px] w-12 h-[1px] bg-white/20 z-0" />
            )}
        </div>
    );
};

export default Experience;
