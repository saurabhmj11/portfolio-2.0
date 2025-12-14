import React, { useState } from 'react';
import SmoothScroll from './components/SmoothScroll';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
// import ScrollLine from './components/ScrollLine';
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
    <SmoothScroll>
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

          {/* Main Content with Parallax Effect */}
          <div className={`relative z-10 min-h-screen ${isDark ? 'dark' : ''} bg-off-white mb-[300px] md:mb-[400px] shadow-2xl`}>
            {/* Noise Overlay */}
            <div className="noise-overlay" />

            {/* Visual Thread */}
            {/* <ScrollLine /> */}

            <Header />
            <main>
              <Hero />
              <About />
              <Projects />
              <Blog />
              <Contact />
              {/* Footer is removed from here and placed outside */}
            </main>
          </div>

          {/* Fixed Footer (Behind the content) */}
          <Footer />

          <Chatbot />
        </React.Fragment>
      )}
    </SmoothScroll>
  );
}

export default App;