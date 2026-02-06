import React, { useState } from 'react';
import Analytics from './components/Analytics';
import SmoothScroll from './components/SmoothScroll';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Terminal from './components/Terminal';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import Chatbot from './components/Chatbot';
import SystemHUD from './components/SystemHUD';
import AgentDock from './components/AgentDock';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import AdminPage from './pages/Admin';
import Resume from './pages/Resume';
import NotFound from './pages/NotFound';

import { Routes, Route, useLocation } from 'react-router-dom';
import { TerminalProvider } from './context/TerminalContext';
import { HelmetProvider } from 'react-helmet-async';
import Seo from './components/Seo';



import PageTransition from './components/PageTransition';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();

  // Scroll logic on route change
  React.useEffect(() => {
    if (location.hash) {
      // If there is a hash, give a small delay for page load then scroll
      setTimeout(() => {
        const element = document.getElementById(location.hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Otherwise scroll to top
      window.scrollTo(0, 0);
    }
  }, [location]);


  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <TerminalProvider>
      <HelmetProvider>
        <Analytics />
        <Seo />
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

              {/* Main Content */}
              <div className={`relative z-10 min-h-screen ${isDark ? 'dark' : ''} bg-off-white shadow-2xl`}>
                {/* Noise Overlay */}
                <div className="noise-overlay" />

                <Header />

                <AnimatePresence mode="wait">
                  <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                    <Route path="/blog" element={<PageTransition><BlogPage /></PageTransition>} />
                    <Route path="/blog/:slug" element={<PageTransition><BlogPostPage /></PageTransition>} />
                    <Route path="/admin" element={<PageTransition><AdminPage /></PageTransition>} />
                    <Route path="/resume" element={<PageTransition><Resume /></PageTransition>} />
                    <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
                  </Routes>
                </AnimatePresence>
              </div>

              {/* Fixed Footer (Behind the content) */}
              <Footer />

              <Chatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
              <Terminal />
              <ScrollToTop />

              <SystemHUD />
              <AgentDock isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
            </React.Fragment>
          )}
        </SmoothScroll>
      </HelmetProvider>
    </TerminalProvider >
  );
}

export default App;