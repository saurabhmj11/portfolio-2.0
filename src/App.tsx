import React, { useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { TerminalProvider } from './context/TerminalContext';
import { AudioProvider }    from './context/AudioContext';
import { scrollToSection }  from './utils/scrollToSection';
import { useIdleReady } from './hooks/useIdleReady';

import Analytics      from './components/Analytics';
import SmoothScroll   from './components/SmoothScroll';
import Header         from './components/Header';
import Preloader      from './components/Preloader';
import MobileBottomNav from './components/MobileBottomNav';
import PageTransition from './components/PageTransition';
import Seo            from './components/Seo';

// Lazy-loaded UI overlays — deferred so the initial bundle stays lean
const Terminal       = React.lazy(() => import('./components/Terminal'));
const CustomCursor   = React.lazy(() => import('./components/CustomCursor'));
const Chatbot        = React.lazy(() => import('./components/Chatbot'));
const AgentDock      = React.lazy(() => import('./components/AgentDock'));
const ScrollToTop    = React.lazy(() => import('./components/ScrollToTop'));
const Spotlight      = React.lazy(() => import('./components/Spotlight'));
const ScrollProgress = React.lazy(() => import('./components/ScrollProgress'));
const CommandPalette = React.lazy(() => import('./components/CommandPalette'));
const PWAPrompt      = React.lazy(() => import('./components/PWAPrompt'));
const AudioVisualizer = React.lazy(() => import('./components/AudioVisualizer'));
const Footer         = React.lazy(() => import('./components/Footer'));

// Lazy-loaded pages
const Home        = React.lazy(() => import('./pages/Home'));
const BlogPage    = React.lazy(() => import('./pages/BlogPage'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));
const AdminPage   = React.lazy(() => import('./pages/Admin'));
const Resume      = React.lazy(() => import('./pages/Resume'));
const NotFound    = React.lazy(() => import('./pages/NotFound'));
const CaseStudy   = React.lazy(() => import('./pages/CaseStudy'));

// ---------------------------------------------------------------------------

function App() {
  const [isLoading,   setIsLoading]   = useState(true);
  // Decorative / secondary UI waits until the browser is idle after load.
  const idle = useIdleReady();
  const ready = !isLoading && idle;
  const [isChatOpen,  setIsChatOpen]  = useState(false);

  const location = useLocation();

  /**
   * Scroll to a hash section whenever the route changes.
   * Uses the shared scrollToSection utility so lazy-loaded sections are
   * retried up to 15 × 100 ms before giving up.
   */
  React.useEffect(() => {
    if (location.hash === '#main-content') return; // skip link: native focus jump
    if (location.hash) {
      scrollToSection(location.hash);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <MotionConfig reducedMotion="user">
    <TerminalProvider>
      <AudioProvider>
        <HelmetProvider>
          <Analytics />
          <Seo />
          <SmoothScroll>
            {/* Keyboard users: jump past the header and floating widgets. */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[3000] focus:px-4 focus:py-2 focus:rounded-full focus:bg-white focus:text-black focus:font-medium"
            >
              Skip to content
            </a>
            {/* Preloader overlay — does NOT block crawlers from seeing content */}
            <AnimatePresence mode="wait">
              {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
            </AnimatePresence>

            {/* Visual overlays loaded after preloader exits */}
            {ready && (
              <React.Suspense fallback={null}>
                <Spotlight />
                <ScrollProgress />
                <CustomCursor />
                <AudioVisualizer />
              </React.Suspense>
            )}

            <React.Fragment>
              {/* Main content shell — always in DOM so crawlers index it */}
              <div className="relative z-10 min-h-screen dark bg-background text-off-white shadow-2xl">
                <div className="noise-overlay" />

                <Header />

                {ready && (
                  <React.Suspense fallback={null}>
                    <CommandPalette />
                  </React.Suspense>
                )}

                <div id="main-content" tabIndex={-1} className="outline-none">
                <AnimatePresence mode="wait">
                  <React.Suspense fallback={null}>
                    <Routes location={location} key={location.pathname}>
                      <Route path="/"             element={<PageTransition label="Home">       <Home />        </PageTransition>} />
                      <Route path="/blog"          element={<PageTransition label="Research Log"><BlogPage />    </PageTransition>} />
                      <Route path="/blog/:slug"    element={<PageTransition label="Article">    <BlogPostPage /> </PageTransition>} />
                      <Route path="/admin"         element={<PageTransition label="Admin">      <AdminPage />   </PageTransition>} />
                      <Route path="/resume"        element={<PageTransition label="Résumé">     <Resume />      </PageTransition>} />
                      <Route path="/project/:id"   element={<PageTransition label="Case Study"> <CaseStudy />   </PageTransition>} />
                      <Route path="*"              element={<PageTransition label="404">        <NotFound />    </PageTransition>} />
                    </Routes>
                  </React.Suspense>
                </AnimatePresence>
                </div>
              </div>

              {/* Fixed footer — rendered behind the main content layer */}
              {ready && (
                <React.Suspense fallback={null}>
                  <Footer />
                </React.Suspense>
              )}

              {/* Floating UI — chatbot, terminal, scroll-to-top */}
              {ready && (
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
              {ready && (
                <React.Suspense fallback={null}>
                  <PWAPrompt />
                </React.Suspense>
              )}
            </React.Fragment>
          </SmoothScroll>
        </HelmetProvider>
      </AudioProvider>
    </TerminalProvider>
    </MotionConfig>
  );
}

export default App;
