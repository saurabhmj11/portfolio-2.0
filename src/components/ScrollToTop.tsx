import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import Magnetic from './Magnetic';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed bottom-8 right-8 md:right-28 z-50 mix-blend-difference text-white cursor-pointer">
                    <Magnetic>
                        <motion.div
                            onClick={scrollToTop}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:shadow-white/50 transition-shadow duration-300"
                        >
                            <ArrowUp size={24} strokeWidth={2.5} />
                        </motion.div>
                    </Magnetic>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop;
