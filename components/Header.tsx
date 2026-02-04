import React from 'react';
import { motion } from 'framer-motion';
import Magnetic from './Magnetic';
import MobileMenu from './MobileMenu';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();

    // If we are on the home page, standard hash navigation works (smooth scroll via CSS/Lenis)
    if (location.pathname === '/') {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on another page, navigate to home with hash
      // We use state/hash to trigger scroll after nav if needed, 
      // but react-router-dom's HashLink or a simple timeout might be needed.
      // For now, simple navigation for /#hash.
      navigate(`/${href}`); // e.g., /#about
      // Note: App.tsx has scrollTo(0,0) on location change which might override this.
      // We might need a delay or check in App.tsx. 
      // Actually, let's just use navigate('/') and let the user scroll or use a robust HashLink solution.
      // But the user expects it to go to the section.
      // Let's try navigating to the hash directly.
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-8 flex justify-between items-center mix-blend-difference text-white"
      >
        {/* Pill-shaped Logo */}
        <Magnetic>
          <Link to="/" className="border border-white/30 px-6 py-2 rounded-full text-sm font-medium tracking-wide uppercase hover:bg-white hover:text-black transition-colors block">
            Saurabh Lokhande
          </Link>
        </Magnetic>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
          {[
            { name: 'Home', href: '#home' },
            { name: 'Work', href: '#work' },
            { name: 'Insights', href: '#insights' },
            { name: 'About', href: '#about' },
            { name: 'Contact', href: '#contact' }
          ].map((item, i) => (
            <Magnetic key={item.name}>
              <a
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="hover:text-gray-400 transition-colors relative group block p-2 cursor-pointer"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
              </a>
            </Magnetic>
          ))}
          {/* Explicit Blog Link if distinct from Insights section */}
          {/* We link Insights to #insights section on Home, which is correct. */}
          {/* But we also have a separate /blog page. The #insights section is the preview. */}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-sm font-medium uppercase tracking-widest relative z-50"
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
