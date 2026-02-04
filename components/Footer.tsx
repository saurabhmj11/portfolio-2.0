import React from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import { Canvas } from '@react-three/fiber';
import Robot3D from './Robot3D';
import { Github, Linkedin, Code2, Terminal, Cpu } from 'lucide-react';
import Magnetic from './Magnetic';

const SolarSystem = () => {
  return (
    <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center my-12">
      {/* Sun (Robot) */}
      <div className="relative z-10 w-32 h-32 md:w-40 md:h-40">
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }} gl={{ alpha: true }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Robot3D />
        </Canvas>
      </div>

      {/* Orbit 1 showing specific icons */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-[200px] h-[200px] rounded-full border border-gray-800"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Magnetic>
            <a href="https://github.com/saurabhmj11" target="_blank" rel="noreferrer" className="w-10 h-10 bg-[#121212] border border-gray-700 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors block">
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                <Github size={18} />
              </motion.div>
            </a>
          </Magnetic>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <Magnetic>
            <a href="https://www.linkedin.com/in/saurabh-lokhande-6d082ab5" target="_blank" rel="noreferrer" className="w-10 h-10 bg-[#121212] border border-gray-700 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors block">
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                <Linkedin size={18} />
              </motion.div>
            </a>
          </Magnetic>
        </div>
      </motion.div>

      {/* Orbit 2 showing generic tech icons/other links */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute w-[300px] h-[300px] rounded-full border border-gray-800/50"
      >
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
          <Magnetic>
            <a href="https://leetcode.com/u/saurabhmj11" target="_blank" rel="noreferrer" className="w-10 h-10 bg-[#121212] border border-gray-700 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors block">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
                <Code2 size={18} />
              </motion.div>
            </a>
          </Magnetic>
        </div>
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2">
          <Magnetic>
            <a href="https://www.hackerrank.com/profile/saurabhmj11" target="_blank" rel="noreferrer" className="w-10 h-10 bg-[#121212] border border-gray-700 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors block">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
                <Terminal size={18} />
              </motion.div>
            </a>
          </Magnetic>
        </div>
        <div className="absolute bottom-4 right-[15%]">
          <Magnetic>
            <a href="https://www.credly.com/users/saurabh-lokhande.6d082ab5" target="_blank" rel="noreferrer" className="w-10 h-10 bg-[#121212] border border-gray-700 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors block">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
                <Cpu size={18} />
              </motion.div>
            </a>
          </Magnetic>
        </div>
      </motion.div>

    </div>
  );
};

const Footer = () => {
  return (
    <footer className="relative bg-[#050505] text-white py-20 px-6 overflow-hidden z-0">
      <ScrollReveal width="100%">
        <div className="container mx-auto max-w-7xl flex flex-col items-center gap-12">

          {/* Solar System Interaction */}
          <SolarSystem />

          <div className="w-full h-[1px] bg-white/5 max-w-xs md:max-w-2xl" />

          <div className="text-gray-600 text-[10px] md:text-xs tracking-widest uppercase text-center">
            © 2025 Saurabh Lokhande. All rights reserved.
          </div>
        </div>
      </ScrollReveal>
    </footer>
  );
};

export default Footer;