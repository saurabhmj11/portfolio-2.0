import React, { useState } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import Magnetic from './Magnetic';
import MobileMenu from './MobileMenu';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();
  const navigate = useNavigate();

  // Progressive Glassmorphism values mapped to exactly 0px-100px of scroll
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.05]);
  const backgroundColor = useMotionTemplate`rgba(255, 255, 255, ${bgOpacity})`;

  const blurValue = useTransform(scrollY, [0, 100], [0, 16]);
  const backdropFilter = useMotionTemplate`blur(${blurValue}px)`;

  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.1]);
  const borderBottom = useMotionTemplate`1px solid rgba(255, 255, 255, ${borderOpacity})`;

  const py = useTransform(scrollY, [0, 100], ["2rem", "1rem"]);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/${href}`);
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        style={{
          backgroundColor,
          backdropFilter,
          borderBottom,
          paddingTop: py,
          paddingBottom: py,
        }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 text-white"
      >
        {/* Pill-shaped Logo */}
        <Magnetic>
          <Link
            to="/"
            className="border px-6 py-2 rounded-full text-sm font-medium tracking-wide uppercase transition-colors block border-white/30 text-white hover:bg-white hover:text-black"
          >
            Saurabh Lokhande
          </Link>
        </Magnetic>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-white">
          {[
            { name: 'Home', href: '#home' },
            { name: 'Work', href: '#projects' },
            { name: 'Services', href: '#services' },
            { name: 'About', href: '#about' },
            { name: 'Contact', href: '#contact' }
          ].map((item) => (
            <Magnetic key={item.name}>
              <a
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="hover:text-gray-300 transition-colors relative group block p-2 cursor-pointer"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-current group-hover:w-full transition-all duration-300" />
              </a>
            </Magnetic>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-sm font-medium uppercase tracking-widest relative z-50 text-white"
        >
          {isMenuOpen ? 'Close' : 'Menu'}
        </button>
      </motion.header>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavClick={handleNavClick}
      />
    </>
  );
};

export default Header;
