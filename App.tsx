import React, { useState } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import Chatbot from './components/Chatbot';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <ReactLenis root>
      <CustomCursor />
      <AnimatePresence mode="wait">
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <React.Fragment>
          <motion.div
            className="fixed inset-0 bg-black z-[60] pointer-events-none"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ originY: 0 }}
          />
          <div className={`min-h-screen ${isDark ? 'dark' : ''} bg-off-white`}>
            {/* Noise Overlay */}
            <div className="noise-overlay" />

            <Header />
            <main>
              <Hero />
              <About />
              <Projects />
              <Contact />
              <Footer />
              <Chatbot />
            </main>
          </div>
        </React.Fragment>
      )}
    </ReactLenis>
  );
}

export default App;