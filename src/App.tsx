import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { TerminalProvider } from './context/TerminalContext';
import { AudioProvider }    from './context/AudioContext';
import { scrollToSection }  from './utils/scrollToSection';

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
  const [isChatOpen,  setIsChatOpen]  = useState(false);
  // Swipe-to-navigate is disabled to allow smooth Lenis/ScrollTrigger animations.
  // useSwipeNavigation();

  const location = useLocation();

  /**
   * Scroll to a hash section whenever the route changes.
   * Uses the shared scrollToSection utility so lazy-loaded sections are
   * retried up to 15 × 100 ms before giving up.
   */
  React.useEffect(() => {
    if (location.hash) {
      scrollToSection(location.hash);
    } else {
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
            {/* Preloader overlay — does NOT block crawlers from seeing content */}
            <AnimatePresence mode="wait">
              {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
            </AnimatePresence>

            {/* Visual overlays loaded after preloader exits */}
            {!isLoading && (
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

                {!isLoading && (
                  <React.Suspense fallback={null}>
                    <CommandPalette />
                  </React.Suspense>
                )}

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

              {/* Fixed footer — rendered behind the main content layer */}
              {!isLoading && (
                <React.Suspense fallback={null}>
                  <Footer />
                </React.Suspense>
              )}

              {/* Floating UI — chatbot, terminal, scroll-to-top */}
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
    </TerminalProvider>
  );
}

export default App;
