import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import Magnetic from './Magnetic';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Atom, Command } from 'lucide-react';

const Header = () => {
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
  };

  return (
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
      {/* Interactive Sliding Logo */}
      <Magnetic>
        <Link
          to="/"
          className="group flex items-center h-10 px-3 rounded-full border border-white/30 backdrop-blur-md transition-colors hover:bg-white hover:border-white text-white hover:text-black overflow-hidden relative cursor-pointer"
        >
          {/* Futuristic AI Core Icon */}
          <div className="flex items-center justify-center shrink-0 relative z-10 transition-transform duration-[800ms] group-hover:rotate-180">
            <Atom className="w-5 h-5 text-white group-hover:text-black transition-colors md:animate-[spin_6s_linear_infinite]" strokeWidth={1.5} />
          </div>

          {/* Sliding Text Container */}
          <div className="grid grid-cols-[1fr] md:grid-cols-[0fr] group-hover:grid-cols-[1fr] transition-all duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)]">
            <div className="overflow-hidden flex items-center">
              <span className="block pl-3 whitespace-nowrap text-sm font-bold tracking-widest uppercase">
                Saurabh Lokhande
              </span>
            </div>
          </div>
        </Link>
      </Magnetic>

      {/* Desktop Navigation Links */}
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

        {/* Command Palette Hint */}
        <button
          className="ml-4 h-8 px-2 bg-white/5 border border-white/10 rounded-lg flex items-center gap-1.5 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all duration-300 group/k"
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
