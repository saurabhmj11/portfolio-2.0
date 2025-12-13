import React from 'react';
import { motion } from 'framer-motion';
import Magnetic from './Magnetic';

const Header = () => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-8 flex justify-between items-center mix-blend-difference text-white"
    >
      {/* Pill-shaped Logo */}
      <Magnetic>
        <a href="#" className="border border-white/30 px-6 py-2 rounded-full text-sm font-medium tracking-wide uppercase hover:bg-white hover:text-black transition-colors block">
          Saurabh Lokhande
        </a>
      </Magnetic>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
        {[
          { name: 'Home', href: '#home' },
          { name: 'Work', href: '#work' },
          { name: 'About', href: '#about' },
          { name: 'Contact', href: '#contact' }
        ].map((item, i) => (
          <Magnetic key={item.name}>
            <a
              href={item.href}
              className="hover:text-gray-400 transition-colors relative group block p-2"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
            </a>
          </Magnetic>
        ))}
      </nav>

      {/* Mobile Menu Button (kept for smaller screens) */}
      <button className="md:hidden text-sm font-medium uppercase tracking-widest">
        Menu
      </button>
    </motion.header>
  );
};

export default Header;
