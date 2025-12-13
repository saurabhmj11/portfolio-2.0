import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const About = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "start 0.25"]
  });

  const bioText = "I’m an AI Engineer passionate about creating cutting-edge solutions that push the boundaries of what’s possible with artificial intelligence. With expertise in machine learning, natural language processing, and deep learning, I specialize in building innovative AI-driven applications that address complex business challenges across various industries.";
  const words = bioText.split(" ");

  return (
    <section className="py-32 px-4 md:px-8 bg-black text-off-white" id="about">
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
              <li>Machine Learning</li>
              <li>Natural Language Processing (NLP)</li>
              <li>Deep Learning & Neural Networks</li>
              <li>Generative AI & Language Models</li>
              <li>AI Integration & Solutions</li>
            </ul>
          </div>

          {/* Column 2: My Journey */}
          <div className="md:col-span-4">
            <h3 className="text-[12px] uppercase tracking-widest mb-8 text-gray-500">My Journey</h3>
            <ul className="space-y-8">
              <li className="border-b border-gray-900 pb-4">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xl font-medium">Freelancer AI Developer</span>
                  <span className="text-sm text-gray-500">2024</span>
                </div>
                <p className="text-sm text-gray-400">Leading AI initiatives and developing cutting-edge solutions for diverse industries, specializing in AI-driven applications, NLP, and machine learning.</p>
              </li>
              <li className="border-b border-gray-900 pb-4">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xl font-medium">B.E. Computer Science</span>
                  <span className="text-sm text-gray-500">2023</span>
                </div>
                <p className="text-sm text-gray-400">Graduated from Amravati University with a focus on machine learning, deep learning, and AI technologies.</p>
              </li>
              <li className="border-b border-gray-900 pb-4">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xl font-medium">AI Research Award</span>
                  <span className="text-sm text-gray-500">2020</span>
                </div>
                <p className="text-sm text-gray-400">Recognized for innovative contributions to Natural Language Processing (NLP) research, advancing AI in language understanding.</p>
              </li>
            </ul>
          </div>

          {/* Column 3: Industries */}
          <div className="md:col-span-4">
            <h3 className="text-[12px] uppercase tracking-widest mb-8 text-gray-500">Industries</h3>
            <ul className="space-y-4 text-lg text-gray-300">
              <li>Healthcare AI</li>
              <li>Finance & FinTech</li>
              <li>Technology & Software Development</li>
              <li>Education & E-Learning</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;