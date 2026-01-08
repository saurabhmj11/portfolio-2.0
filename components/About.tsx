import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTerminal } from '../context/TerminalContext';
import { soundManager } from '../utils/SoundManager';
import { ChevronRight } from 'lucide-react';

import useHaptic from '../hooks/useHaptic';

const ListItem = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const { trigger: haptic } = useHaptic();

  return (
    <motion.li
      className={`flex items-center gap-2 cursor-pointer group ${className}`}
      onMouseEnter={() => { soundManager.playHover(); haptic('light'); }}
      initial={{ x: 0 }}
      whileHover={{ x: 10 }}
    >
      <span className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ChevronRight size={16} />
      </span>
      <span className="group-hover:text-green-400 group-hover:shadow-[0_0_10px_rgba(74,222,128,0.5)] transition-all duration-300">
        {children}
      </span>
    </motion.li>
  );
};

const JourneyItem = ({ role, year, description }: { role: string, year: string, description: string }) => {
  const { trigger: haptic } = useHaptic();

  return (
    <motion.li
      className="border-b border-gray-900 pb-4 cursor-pointer group"
      onMouseEnter={() => { soundManager.playHover(); haptic('light'); }}
      initial={{ opacity: 0.8 }}
      whileHover={{ opacity: 1, backgroundColor: 'rgba(255, 255, 255, 0.02)', paddingLeft: 10, paddingRight: 10 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <div className="flex justify-between items-baseline mb-2">
        <div className="flex items-center gap-2">
          <span className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ChevronRight size={16} />
          </span>
          <span className="text-xl font-medium group-hover:text-green-400 transition-colors">{role}</span>
        </div>
        <span className="text-sm text-gray-500 font-mono group-hover:text-white transition-colors">{year}</span>
      </div>
      <p className="text-sm text-gray-400 pl-6 border-l-2 border-transparent group-hover:border-green-500/30 transition-all">{description}</p>
    </motion.li>
  )
}

const About = () => {
  const containerRef = useRef(null);
  const { addLog } = useTerminal();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "start 0.25"]
  });

  const bioText = "I’m an AI Engineer passionate about creating cutting-edge solutions that push the boundaries of what’s possible with artificial intelligence. With expertise in machine learning, natural language processing, and deep learning, I specialize in building innovative AI-driven applications that address complex business challenges across various industries.";
  const words = bioText.split(" ");

  return (
    <section
      className="py-20 md:py-32 px-4 md:px-8 bg-black text-off-white"
      id="about"
      onMouseEnter={() => addLog("Parsing User Biography...", "system", "SYS")}
    >
      <div className="container mx-auto">

        <div className="mb-24 flex flex-col md:flex-row items-center gap-12 border-t border-gray-800 pt-8" ref={containerRef}>
          <div className="flex-1">
            <h2 className="text-[12px] uppercase tracking-widest mb-4">About Me</h2>
            <div className="text-xl md:text-3xl font-light leading-relaxed text-gray-300 flex flex-wrap gap-x-2">
              {words.map((word, i) => {
                const start = i / words.length;
                const end = start + (1 / words.length);
                const opacity = useTransform(scrollYProgress, [start, end], [0.3, 1]);

                return (
                  <motion.span key={i} style={{ opacity }} className="relative">
                    {word}
                  </motion.span>
                )
              })}
            </div>
          </div>
          <div className="w-full md:w-1/3 flex justify-center md:justify-end">
            <motion.div
              style={{ opacity: scrollYProgress }}
              className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-gray-800 grayscale hover:grayscale-0 transition-all duration-500"
            >
              <img src="/profile.jpg" alt="Saurabh Lokhande" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-24 border-t border-gray-800 pt-8">

          {/* Column 1: Specializations */}
          <div className="md:col-span-4">
            <h3 className="text-[12px] uppercase tracking-widest mb-8 text-gray-500">Specializations</h3>
            <ul className="space-y-4 text-lg text-gray-300">
              <ListItem>Machine Learning</ListItem>
              <ListItem>Natural Language Processing (NLP)</ListItem>
              <ListItem>Deep Learning & Neural Networks</ListItem>
              <ListItem>Generative AI & Language Models</ListItem>
              <ListItem>AI Integration & Solutions</ListItem>
            </ul>
          </div>

          {/* Column 2: My Journey */}
          <div className="md:col-span-4">
            <h3 className="text-[12px] uppercase tracking-widest mb-8 text-gray-500">My Journey</h3>
            <ul className="space-y-8">
              <JourneyItem
                role="Freelancer AI Developer"
                year="2024"
                description="Leading AI initiatives and developing cutting-edge solutions for diverse industries, specializing in AI-driven applications, NLP, and machine learning."
              />
              <JourneyItem
                role="B.E. Computer Science"
                year="2023"
                description="Graduated from Amravati University with a focus on machine learning, deep learning, and AI technologies."
              />
              <JourneyItem
                role="AI Research Award"
                year="2020"
                description="Recognized for innovative contributions to Natural Language Processing (NLP) research, advancing AI in language understanding."
              />
            </ul>
          </div>

          {/* Column 3: Industries */}
          <div className="md:col-span-4">
            <h3 className="text-[12px] uppercase tracking-widest mb-8 text-gray-500">Industries</h3>
            <ul className="space-y-4 text-lg text-gray-300">
              <ListItem>Healthcare AI</ListItem>
              <ListItem>Finance & FinTech</ListItem>
              <ListItem>Technology & Software Development</ListItem>
              <ListItem>Education & E-Learning</ListItem>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
