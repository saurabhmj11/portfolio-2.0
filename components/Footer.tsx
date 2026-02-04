import React from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

const Footer = () => {
  return (
    <footer className="relative bg-[#121212] text-white py-12 md:py-20 px-6 overflow-hidden z-0">
      <ScrollReveal width="100%">
        <div className="container mx-auto max-w-7xl flex flex-col items-center gap-8 md:gap-12">

          {/* Navigation / Links - Grid on Mobile, Row on Desktop */}
          <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-center gap-x-12 gap-y-6 w-full md:w-auto text-center">
            <a href="https://github.com/saurabhmj11" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold py-2">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/saurabh-lokhande-6d082ab5" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold py-2">
              LinkedIn
            </a>
            <a href="https://www.credly.com/users/saurabh-lokhande.6d082ab5" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold py-2">
              Credly
            </a>
            <a href="https://leetcode.com/u/saurabhmj11" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold py-2">
              LeetCode
            </a>
            <a href="https://www.hackerrank.com/profile/saurabhmj11" target="_blank" rel="noopener noreferrer" className="col-span-2 md:col-span-1 text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold py-2">
              HackerRank
            </a>
          </div>

          <div className="w-full h-[1px] bg-white/10 max-w-xs md:max-w-2xl" />

          <div className="text-gray-600 text-[10px] md:text-xs tracking-widest uppercase text-center">
            © 2025 Saurabh Lokhande. All rights reserved.
          </div>
        </div>
      </ScrollReveal>
    </footer>
  );
};

export default Footer;