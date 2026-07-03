import React, { useState } from 'react';
import Analytics from './components/Analytics';
import SmoothScroll from './components/SmoothScroll';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
const Terminal = React.lazy(() => import('./components/Terminal'));
import Preloader from './components/Preloader';
const CustomCursor = React.lazy(() => import('./components/CustomCursor'));
const Chatbot = React.lazy(() => import('./components/Chatbot'));
const AgentDock = React.lazy(() => import('./components/AgentDock'));
const ScrollToTop = React.lazy(() => import('./components/ScrollToTop'));
const Spotlight = React.lazy(() => import('./components/Spotlight'));
const ScrollProgress = React.lazy(() => import('./components/ScrollProgress'));
const CommandPalette = React.lazy(() => import('./components/CommandPalette'));
const PWAPrompt = React.lazy(() => import('./components/PWAPrompt'));
import MobileBottomNav from './components/MobileBottomNav';


// Pages — all lazy-loaded; none block the initial bootstrap bundle
const Home = React.lazy(() => import('./pages/Home'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));
const AdminPage = React.lazy(() => import('./pages/Admin'));
const Resume = React.lazy(() => import('./pages/Resume'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const CaseStudy = React.lazy(() => import('./pages/CaseStudy'));
// Layout — deferred until after preloader exits
const Footer = React.lazy(() => import('./components/Footer'));

import { Routes, Route, useLocation } from 'react-router-dom';
import { TerminalProvider } from './context/TerminalContext';
import { AudioProvider } from './context/AudioContext';
import { HelmetProvider } from 'react-helmet-async';
import Seo from './components/Seo';
const AudioVisualizer = React.lazy(() => import('./components/AudioVisualizer'));



import PageTransition from './components/PageTransition';

function App() {
  const [isDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  // Swipe-to-navigate between sections on mobile (Disabled to allow smooth Lenis/ScrollTrigger animations)
  // useSwipeNavigation();
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




  return (
    <TerminalProvider>
      <AudioProvider>
        <HelmetProvider>
          <Analytics />
          <Seo />
          <SmoothScroll>
            {/* Preloader overlay — rendered on top but does NOT block crawlers from seeing content */}
            <AnimatePresence mode="wait">
              {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
            </AnimatePresence>

            {!isLoading && (
              <React.Suspense fallback={null}>
                <Spotlight />
                <ScrollProgress />
                <CustomCursor />
                <AudioVisualizer />
              </React.Suspense>
            )}

            {/* Main Content — always in DOM so Googlebot indexes it */}
            <React.Fragment>
              {!isLoading && (
                <motion.div
                  className="fixed inset-0 bg-black z-[60] pointer-events-none"
                  initial={{ scaleY: 1 }}
                  animate={{ scaleY: 0 }}
                  exit={{ scaleY: 0 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  style={{ originY: 0 }}
                />
              )}

              {/* Main Content */}
              <div
                className={`relative z-10 min-h-screen ${isDark ? 'dark' : ''} bg-off-white shadow-2xl`}
              >
                {/* Noise Overlay */}
                <div className="noise-overlay" />

                <Header />
                {!isLoading && (
                  <React.Suspense fallback={null}>
                    <CommandPalette />
                  </React.Suspense>
                )}

                <AnimatePresence mode="wait">
                  <React.Suspense fallback={null}>
                    <Routes location={location} key={location.pathname}>
                      <Route path="/" element={<PageTransition label="Home"><Home /></PageTransition>} />
                      <Route path="/blog" element={<PageTransition label="Research Log"><BlogPage /></PageTransition>} />
                      <Route path="/blog/:slug" element={<PageTransition label="Article"><BlogPostPage /></PageTransition>} />
                      <Route path="/admin" element={<PageTransition label="Admin"><AdminPage /></PageTransition>} />
                      <Route path="/resume" element={<PageTransition label="Résumé"><Resume /></PageTransition>} />
                      <Route path="/project/:id" element={<PageTransition label="Case Study"><CaseStudy /></PageTransition>} />
                      <Route path="*" element={<PageTransition label="404"><NotFound /></PageTransition>} />
                    </Routes>
                  </React.Suspense>
                </AnimatePresence>
              </div>

              {/* Fixed Footer (Behind the content) */}
              {!isLoading && (
                <React.Suspense fallback={null}>
                  <Footer />
                </React.Suspense>
              )}

              {!isLoading && (
                <React.Suspense fallback={null}>
                  <Chatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
                  <Terminal />
                  <AgentDock isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
                  <ScrollToTop />
                </React.Suspense>
              )}
              {/* Mobile bottom navigation bar */}
              {!isLoading && <MobileBottomNav />}
              {/* PWA install prompt + offline toast */}
              {!isLoading && (
                <React.Suspense fallback={null}>
                  <PWAPrompt />
                </React.Suspense>
              )}
            </React.Fragment>
          </SmoothScroll>
        </HelmetProvider>
      </AudioProvider>
    </TerminalProvider >
  );
}

export default App;