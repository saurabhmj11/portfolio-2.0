import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Atom, Command, Volume2, VolumeX } from 'lucide-react';
import { useAudioDirector } from '../context/AudioContext';
import Magnetic from './Magnetic';
import { scrollToSection } from '../utils/scrollToSection';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { name: 'Home',     href: '#home'     },
  { name: 'Work',     href: '#projects' },
  { name: 'Services', href: '#services' },
  { name: 'About',    href: '#about'    },
  { name: 'Contact',  href: '#contact'  },
] as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Header: React.FC = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const { isMuted, toggleMute } = useAudioDirector();

  /**
   * Scroll to a hash section on the current page, or navigate to home with
   * the hash when called from another route so App.tsx can resolve it.
   */
  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (location.pathname === '/') {
      scrollToSection(href);
    } else {
      navigate(`/${href}`);
    }
  };

  return (
    <motion.header
      initial={{ y: -100, x: '-50%', opacity: 0 }}
      animate={{ y: 0, x: '-50%', opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
      className="fixed top-6 left-1/2 z-50 flex justify-between items-center px-4 py-3 md:py-2 md:px-6 w-[92%] max-w-5xl rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] text-white"
    >
      {/* Logo ---------------------------------------------------------------- */}
      <Magnetic>
        <Link
          to="/"
          className="group flex items-center h-10 px-3 rounded-full border border-white/30 backdrop-blur-md transition-colors hover:bg-white hover:border-white text-white hover:text-black overflow-hidden relative cursor-pointer"
        >
          {/* Animated atom icon */}
          <div className="flex items-center justify-center shrink-0 relative z-10 transition-transform duration-[800ms] group-hover:rotate-180">
            <Atom
              className="w-5 h-5 text-white group-hover:text-black transition-colors md:animate-[spin_6s_linear_infinite]"
              strokeWidth={1.5}
            />
          </div>

          {/* Name — hidden on mobile, slides in on hover */}
          <div className="grid grid-cols-[1fr] md:grid-cols-[0fr] group-hover:grid-cols-[1fr] transition-all duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)]">
            <div className="overflow-hidden flex items-center">
              <span className="block pl-3 whitespace-nowrap text-sm font-bold tracking-widest uppercase">
                Saurabh Lokhande
              </span>
            </div>
          </div>
        </Link>
      </Magnetic>

      {/* Desktop navigation ------------------------------------------------- */}
      <nav
        className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-white"
        aria-label="Primary navigation"
      >
        {NAV_ITEMS.map((item) => (
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

        {/* Audio mute toggle */}
        <button
          onClick={toggleMute}
          className="ml-2 h-8 w-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
          aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
        >
          {isMuted
            ? <VolumeX className="w-4 h-4 text-gray-400" />
            : <Volume2 className="w-4 h-4 text-white" />
          }
        </button>

        {/* Command palette shortcut hint */}
        <button
          className="h-8 px-2 bg-white/5 border border-white/10 rounded-lg flex items-center gap-1.5 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all duration-300 group/k"
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          aria-label="Open Command Palette"
        >
          <Command className="w-3 h-3 text-gray-500 group-hover/k:text-white transition-colors" />
          <span className="text-[10px] font-mono text-gray-500 group-hover/k:text-white transition-colors">K</span>
        </button>
      </nav>
    </motion.header>
  );
};

export default Header;
