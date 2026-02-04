import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-[300px] md:h-[400px] bg-[#121212] text-white py-12 px-6 overflow-hidden z-0 rounded-t-[3rem] flex flex-col justify-center items-center">
      <div className="container mx-auto flex flex-col items-center gap-8">

        <div className="flex items-center gap-6">
          <a href="https://github.com/saurabhmj11" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/saurabh-lokhande-6d082ab5" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">
            LinkedIn
          </a>
          <a href="https://www.credly.com/users/saurabh-lokhande.6d082ab5" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">
            Credly
          </a>
          <a href="https://leetcode.com/u/saurabhmj11" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">
            LeetCode
          </a>
          <a href="https://www.hackerrank.com/profile/saurabhmj11" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">
            HackerRank
          </a>
        </div>

        <div className="text-gray-600 text-xs tracking-widest uppercase">
          © 2025 Saurabh Lokhande. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;