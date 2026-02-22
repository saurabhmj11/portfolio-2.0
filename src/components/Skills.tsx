import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Magnetic from './Magnetic'; // Assuming Magnetic is robust now
import { useTerminal } from '../context/TerminalContext';
import { useAudioDirector } from '../context/AudioContext';
import { useInView } from 'react-intersection-observer';
import { Helmet } from 'react-helmet-async';
import VelocityText from './VelocityText';

const allSkills = [
    { name: "Generative AI", level: "Expert" }, { name: "LLMs", level: "Expert" }, { name: "RAG Systems", level: "Expert" },
    { name: "Agentic Workflows", level: "Expert" }, { name: "LangChain", level: "Expert" }, { name: "Python", level: "Expert" },
    { name: "PyTorch", level: "Advanced" }, { name: "TensorFlow", level: "Advanced" }, { name: "OpenAI API", level: "Expert" },
    { name: "React", level: "Expert" }, { name: "Next.js 14", level: "Expert" }, { name: "TypeScript", level: "Expert" },
    { name: "Three.js", level: "Intermediate" }, { name: "WebGL", level: "Intermediate" }, { name: "Tailwind", level: "Expert" },
    { name: "Node.js", level: "Advanced" }, { name: "PostgreSQL", level: "Advanced" }, { name: "Vector DBs", level: "Expert" },
    { name: "Docker", level: "Advanced" }, { name: "AWS", level: "Advanced" }, { name: "Kubernetes", level: "Intermediate" }
];

const Skills = () => {
    const { addLog } = useTerminal();
    const [ref, inView] = useInView({ threshold: 0.1 });

    // AI Audio Director Trigger
    const { playTrack } = useAudioDirector();
    useEffect(() => {
        if (inView) {
            playTrack('skills-intro');
        }
    }, [inView, playTrack]);
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section ref={ref} className="pt-12 pb-32 bg-[#050505] text-white relative overflow-hidden" id="skills">
            {inView && (
                <Helmet>
                    <title>Skills | Saurabh Lokhande</title>
                    <meta name="description" content="Expertise in Generative AI, LLMs, and Full Stack Engineering." />
                </Helmet>
            )}

            {/* Background Elements */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[128px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="mb-16 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-sm font-mono text-blue-400 uppercase tracking-[0.2em] mb-4 inline-block"
                    >
                        Capabilities
                    </motion.h2>
                    <div className="w-full relative overflow-hidden flex justify-center mb-12">
                        <VelocityText baseVelocity={2}>
                            <span className="text-5xl md:text-8xl font-display font-bold tracking-tighter px-4">
                                Technical <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-600">Arsenal</span>
                            </span>
                        </VelocityText>
                    </div>
                </div>

                <div ref={containerRef} className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto perspective-1000">
                    {allSkills.map((skill, idx) => (
                        <SkillBadge key={idx} skill={skill.name} index={idx} addLog={addLog} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const SkillBadge = ({ skill, index, addLog }: { skill: string, index: number, addLog: any }) => {
    // Random float animation
    const randomDuration = 3 + Math.random() * 2;
    const randomDelay = Math.random() * 2;

    return (
        <Magnetic>
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, type: "spring", stiffness: 200, damping: 15 }}
                className="relative group"
            >
                <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: randomDuration, repeat: Infinity, ease: "easeInOut", delay: randomDelay }}
                    className="relative px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md overflow-hidden cursor-pointer group-hover:border-white/30 group-hover:bg-white/10 transition-colors"
                    onMouseEnter={() => addLog(`Skill Detected: ${skill}`, 'success', 'SYS')}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                    <span className="relative z-10 text-lg md:text-xl font-medium tracking-tight group-hover:text-white transition-colors">{skill}</span>
                </motion.div>
            </motion.div>
        </Magnetic>
    );
};

export default Skills;
