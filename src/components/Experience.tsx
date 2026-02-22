import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BookOpen, BarChart, Code2, Brain } from 'lucide-react';
import VelocityText from './VelocityText';

const experiences = [
    {
        year: '2020 - 2024',
        level: 'Phase 01',
        title: 'The Learner',
        role: 'B.Tech Computer Science',
        org: 'Amravati University',
        desc: 'Like a child learning to read, I immersed myself in the fundamental syntax of reality. Mastering data structures, algorithms, and the basics of machine learning.',
        color: 'text-amber-400',
        border: 'border-amber-400/20',
        bg: 'bg-amber-500',
        icon: BookOpen
    },
    {
        year: 'June 2023 - Dec 2023',
        level: 'Phase 02',
        title: 'The Apprentice',
        role: 'Data Analyst Intern',
        org: 'Pantech Solutions',
        desc: 'Taking my first steps into the complex professional world. I learned to clean massive datasets and conceptualized my earliest RAG systems.',
        color: 'text-cyan-400',
        border: 'border-cyan-400/20',
        bg: 'bg-cyan-500',
        icon: BarChart
    },
    {
        year: 'Jan 2024 - Present',
        level: 'Phase 03',
        title: 'The Builder',
        role: 'Software Developer',
        org: 'Freelance / Remote',
        desc: 'Growing into my capability. Today, I architect true autonomy, building complex multi-agent workflows using LangGraph and custom AI servers.',
        color: 'text-emerald-400',
        border: 'border-emerald-400/20',
        bg: 'bg-emerald-500',
        icon: Code2
    },
    {
        year: 'Future',
        level: 'Phase 04',
        title: 'The Architect',
        role: 'AI Systems Leader',
        org: 'Your Organization',
        desc: 'Fully realized and ready to lead. I am equipped to deploy scalable, enterprise-level intelligence engines and shape the future of automation.',
        color: 'text-purple-400',
        border: 'border-purple-400/20',
        bg: 'bg-purple-500',
        icon: Brain
    }
];

const EvolutionGraphic = ({ index }: { index: number }) => {
    const activeExp = experiences[index];

    return (
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none scale-75 md:scale-100 min-h-[400px]">
            {/* Massive Ambient Background Glow */}
            <div className="absolute inset-0 flex items-center justify-center transition-all duration-1000 mix-blend-screen">
                <div className={`w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full blur-[100px] opacity-20 md:opacity-30 transition-colors duration-1000 ${activeExp.bg}`}
                />
            </div>

            {/* Giant Background Number */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`number-${index}`}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 0.03, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ duration: 0.8 }}
                    className="absolute text-[250px] md:text-[400px] font-black font-display text-white z-0 pointer-events-none select-none leading-none flex items-center justify-center"
                >
                    {index + 1}
                </motion.div>
            </AnimatePresence>

            {/* The Evolving Core (Persistent Render, only styling changes) */}
            <div className="relative z-10 w-64 h-64 md:w-96 md:h-96 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 flex items-center justify-center shadow-2xl transition-all duration-1000">

                {/* Expanding animated rings representing growth */}
                {Array.from({ length: 4 }).map((_, i) => (
                    <motion.div
                        key={`ring-${i}`}
                        className={`absolute rounded-full border border-white/10 transition-opacity duration-1000 ${i <= index ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            width: `${100 + i * 25}%`,
                            height: `${100 + i * 25}%`
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
                    />
                ))}

                {/* The Inner Glowing Badge */}
                <div
                    className={`w-32 h-32 md:w-48 md:h-48 rounded-full ${activeExp.bg} bg-opacity-10 flex items-center justify-center shadow-[0_0_60px_rgba(0,0,0,0.3)] border border-white/20 transition-colors duration-1000`}
                    style={{ borderLeftColor: 'transparent', borderTopColor: 'transparent' }}
                >
                    {/* The Icons (Rendered simultaneously, faded via opacity to prevent unmount glitching) */}
                    <div className="relative w-full h-full flex items-center justify-center">
                        {experiences.map((exp, i) => {
                            const IconComponent = exp.icon;
                            const isActive = i === index;
                            return (
                                <IconComponent
                                    key={`icon-${i}`}
                                    className={`absolute w-12 h-12 md:w-20 md:h-20 ${exp.color} drop-shadow-2xl transition-all duration-700 ease-in-out ${isActive ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-45'}`}
                                    strokeWidth={isActive ? 1.5 : 1}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

        </div>
    );
};

const ExperienceBlock = ({ exp, index, setActiveIndex }: any) => {
    // Ultra-precise horizontal center trigger line (like an intersection laser)
    const { ref, inView } = useInView({
        threshold: 0.1, // Trigger as soon as 10% is visible
        rootMargin: "-10% 0px -10% 0px" // More relaxed margins to ensure activation across viewport sizes
    });

    useEffect(() => {
        if (inView) {
            setActiveIndex(index);
        }
    }, [inView, index, setActiveIndex]);

    return (
        <div ref={ref} className="min-h-[70vh] flex flex-col justify-center py-10 pr-4 pl-4 md:pl-20 max-w-3xl relative z-10 pointer-events-auto">
            <motion.div
                initial={{ opacity: 0.3, scale: 0.95 }}
                animate={{
                    opacity: inView ? 1 : 0.3,
                    scale: inView ? 1 : 0.95,
                    x: inView ? 0 : -20
                }}
                transition={{ duration: 0.5, type: 'spring' }}
                className={`p-8 md:p-12 rounded-3xl bg-black/40 border ${inView ? exp.border : 'border-white/5'} backdrop-blur-md shadow-2xl relative overflow-hidden transition-colors duration-500`}
            >
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                    <span className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border rounded-full ${exp.color} ${exp.border} bg-white/5`}>
                        {exp.level}
                    </span>
                    <span className="text-gray-400 font-mono text-sm tracking-wider">{exp.year}</span>
                </div>

                <h3 className={`text-4xl md:text-6xl font-black font-display uppercase tracking-tight mb-4 ${exp.color} drop-shadow-lg`}>
                    {exp.title}
                </h3>

                <div className="mb-6">
                    <h4 className="text-2xl text-white font-bold tracking-tight">{exp.role}</h4>
                    <p className="text-lg text-gray-400 font-mono tracking-wide">{exp.org}</p>
                </div>

                <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
                    {exp.desc}
                </p>
            </motion.div>
        </div>
    );
};

const Experience = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section id="experience" className="relative bg-[#050505] text-white">

            {/* Background Text Overlay */}
            <div className="absolute top-[10%] left-0 w-full opacity-5 pointer-events-none z-0 mix-blend-overlay overflow-hidden">
                <VelocityText baseVelocity={-1.5}>
                    <span className="text-[150px] font-display font-black tracking-tighter text-white uppercase whitespace-nowrap">
                        My Journey
                    </span>
                </VelocityText>
            </div>

            {/* Header */}
            <div className="absolute top-20 left-10 md:left-24 z-20">
                <h2 className="text-[12px] uppercase tracking-widest text-gray-500 mb-2">My Journey</h2>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tighter">Growth Trajectory</h3>
            </div>

            {/* Main Flex Layout */}
            <div className="relative w-full max-w-7xl mx-auto flex flex-col md:flex-row pt-[10vh]">

                {/* Scrollable Text Blocks (Left Side) */}
                <div className="w-full md:w-1/2 flex flex-col pt-[10vh] pb-[20vh] z-10 px-4 md:px-0 relative">
                    {experiences.map((exp, i) => (
                        <ExperienceBlock
                            key={i}
                            exp={exp}
                            index={i}
                            setActiveIndex={setActiveIndex}
                        />
                    ))}
                </div>

                {/* Sticky Graphic (Right Side) */}
                <div className="absolute inset-0 md:relative w-full md:w-1/2 pointer-events-none z-0">
                    <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden opacity-30 md:opacity-100 transition-opacity duration-1000">
                        <EvolutionGraphic index={activeIndex} />

                        {/* Vertical Progress Line (Desktop) */}
                        <div className="hidden md:block absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-white/10 rounded-full overflow-hidden">
                            <div
                                className={`w-full transition-all duration-700 ease-out ${experiences[activeIndex].bg}`}
                                style={{ height: `${((activeIndex + 1) / experiences.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-20" />
        </section>
    );
};

export default Experience;
