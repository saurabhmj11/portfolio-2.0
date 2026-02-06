import React, { useRef } from 'react';
import Magnetic from './Magnetic';
import ScrollReveal from './ScrollReveal';
import { useTerminal } from '../context/TerminalContext';
import { useInView } from 'react-intersection-observer';
import { Helmet } from 'react-helmet-async';

const skillCategories = [
    {
        title: "AI & Machine Learning",
        skills: ["Python", "PyTorch", "TensorFlow", "LangChain", "OpenAI API", "Hugging Face", "RAG Systems", "Ollama"]
    },
    {
        title: "Frontend Development",
        skills: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP", "Three.js", "Vite"]
    },
    {
        title: "Backend & Systems",
        skills: ["Node.js", "FastAPI", "PostgreSQL", "Redis", "Docker", "AWS Lambda", "GraphQL"]
    },
    {
        title: "DevOps & Tools",
        skills: ["Git", "GitHub Actions", "Kubernetes", "Linux", "Nginx", "Vercel"]
    }
];

const Skills = () => {
    const { addLog } = useTerminal();
    const [ref, inView] = useInView({ threshold: 0.2 });

    return (
        <section ref={ref} className="py-24 bg-[#0a0a0a] text-white relative overflow-hidden" id="skills">
            {inView && (
                <Helmet>
                    <title>Skills | Saurabh Lokhande</title>
                    <meta name="description" content="Technical arsenal including AI/ML, Full Stack Development, and Cloud Architecture." />
                </Helmet>
            )}

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <ScrollReveal width="100%">
                    <div className="mb-20 text-center">
                        <h2 className="text-[12px] uppercase tracking-widest text-gray-500 mb-4">My Arsenal</h2>
                        <h3 className="text-[clamp(2.5rem,5vw,5rem)] font-bold tracking-tighter leading-none">
                            Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Stack</span>
                        </h3>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                    {skillCategories.map((category, idx) => (
                        <div key={idx} className="flex flex-col gap-6">
                            <ScrollReveal delay={idx * 0.1}>
                                <h4 className="text-xl font-mono text-gray-400 border-b border-gray-800 pb-2 mb-4 inline-block">
                                    0{idx + 1} // {category.title}
                                </h4>
                            </ScrollReveal>

                            <div className="flex flex-wrap gap-4">
                                {category.skills.map((skill, sIdx) => (
                                    <ScrollReveal key={sIdx} delay={0.1 + (sIdx * 0.05)} width="fit-content" threshold={0.1}>
                                        <Magnetic>
                                            <div
                                                className="px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-colors cursor-default"
                                                onMouseEnter={() => addLog(`Inspecting Skill: ${skill}`, 'info', 'SYS')}
                                            >
                                                <span className="text-sm md:text-base font-medium tracking-wide">
                                                    {skill}
                                                </span>
                                            </div>
                                        </Magnetic>
                                    </ScrollReveal>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
