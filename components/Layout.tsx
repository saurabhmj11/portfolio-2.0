import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import Preloader from './Preloader';
import AIParticles from './AIParticles';
import { useCursor } from '../hooks/useCursor';

const Layout = () => {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useCursor();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`${isDark ? 'dark' : ''}`}>
      <AnimatePresence>
        {isLoading && <Preloader />}
      </AnimatePresence>
      <AIParticles />
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <main className="min-h-screen bg-white dark:bg-gray-900 pt-16">
        <Outlet />
      </main>
      <Footer isDark={isDark} toggleTheme={toggleTheme} />
    </div>
  );
};

export default Layout;