import React from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import { Canvas } from '@react-three/fiber';
import Robot3D from './Robot3D';
import { Github, Linkedin, Code2, Terminal, Cpu, FileText } from 'lucide-react';
import Magnetic from './Magnetic';
import { Link } from 'react-router-dom';

const SolarSystem = () => {
  return (
    <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center my-12 pointer-events-none">
      {/* Sun (Robot) */}
      <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 pointer-events-auto">
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
        className="absolute w-[180px] h-[180px] md:w-[200px] md:h-[200px] rounded-full border border-gray-800 inset-0 m-auto pointer-events-none"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <Magnetic>
            <a href="https://github.com/saurabhmj11" target="_blank" rel="noreferrer" className="group w-10 h-10 bg-[#121212] border border-gray-700 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors block relative z-50 pointer-events-auto">
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="relative flex items-center justify-center">
                <Github size={18} />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  GITHUB
                </span>
              </motion.div>
            </a>
          </Magnetic>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-50">
          <Magnetic>
            <a href="https://www.linkedin.com/in/saurabh-lokhande-6d082ab5" target="_blank" rel="noreferrer" className="group w-10 h-10 bg-[#121212] border border-gray-700 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors block relative z-50 pointer-events-auto">
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="relative flex items-center justify-center">
                <Linkedin size={18} />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  LINKEDIN
                </span>
              </motion.div>
            </a>
          </Magnetic>
        </div>
      </motion.div>

      {/* Orbit 2 showing generic tech icons/other links */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute w-[260px] h-[260px] md:w-[300px] md:h-[300px] rounded-full border border-gray-800/50 inset-0 m-auto pointer-events-none"
      >
        {/* Resume Planet - Top Center of Outer Ring */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <Magnetic>
            <Link to="/resume" className="group w-16 h-16 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:text-blue-600 text-white transition-colors block shadow-[0_0_25px_rgba(37,99,235,1)] relative">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="relative flex items-center justify-center">
                <FileText size={28} />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white border border-white/20 text-xs font-bold px-3 py-1 rounded-full opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                  RESUME
                </span>
              </motion.div>
            </Link>
          </Magnetic>
        </div>
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
          <Magnetic>
            <a href="https://leetcode.com/u/saurabhmj11" target="_blank" rel="noreferrer" className="group w-10 h-10 bg-[#121212] border border-gray-700 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors block relative">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="relative flex items-center justify-center">
                <Code2 size={18} />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  LEETCODE
                </span>
              </motion.div>
            </a>
          </Magnetic>
        </div>
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2">
          <Magnetic>
            <a href="https://www.hackerrank.com/profile/saurabhmj11" target="_blank" rel="noreferrer" className="group w-10 h-10 bg-[#121212] border border-gray-700 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors block relative">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="relative flex items-center justify-center">
                <Terminal size={18} />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  HACKERRANK
                </span>
              </motion.div>
            </a>
          </Magnetic>
        </div>
        <div className="absolute bottom-4 right-[15%]">
          <Magnetic>
            <a href="https://www.credly.com/users/saurabh-lokhande.6d082ab5" target="_blank" rel="noreferrer" className="group w-10 h-10 bg-[#121212] border border-gray-700 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors block relative">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="relative flex items-center justify-center">
                <Cpu size={18} />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  CREDLY
                </span>
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
    <footer className="relative bg-[#050505] text-white py-20 px-6 overflow-hidden z-50">
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