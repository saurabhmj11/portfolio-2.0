import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import Preloader from './Preloader';
import AIParticles from './AIParticles';
import { useCursor } from '../hooks/useCursor';

const Layout = () => {
  const [isLoading, setIsLoading] = useState(true);

  useCursor();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);



  return (
    <div>
      <AnimatePresence>
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      <AIParticles />
      <Header />
      <main className="min-h-screen bg-white dark:bg-gray-900 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;