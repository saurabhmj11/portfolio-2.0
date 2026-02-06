import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from './Magnetic';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onNavClick: (e: React.MouseEvent, href: string) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onNavClick }) => {
    const menuVariants = {
        initial: {
            y: "-100%"
        },
        enter: {
            y: "0%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
        },
        exit: {
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
        }
    };

    const navItems = [
        { name: 'Home', href: '#home' },
        { name: 'Work', href: '#work' },
        { name: 'Insights', href: '#insights' },
        { name: 'About', href: '#about' },
        { name: 'Contact', href: '#contact' }
    ];

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    variants={menuVariants}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    className="fixed inset-0 bg-[#1c1c1c] text-white z-40 flex flex-col justify-center items-center h-screen"
                >
                    <div className="flex flex-col gap-8 text-center">
                        {navItems.map((item, i) => (
                            <Magnetic key={item.name}>
                                <motion.a
                                    href={item.href}
                                    onClick={(e) => {
                                        onClose();
                                        onNavClick(e, item.href);
                                    }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: 0.5 + (i * 0.1) }
                                    }}
                                    className="text-5xl md:text-6xl font-medium uppercase tracking-tighter hover:text-gray-400 transition-colors block"
                                >
                                    {item.name}
                                </motion.a>
                            </Magnetic>
                        ))}
                    </div>

                    <div className="absolute bottom-10 left-0 w-full px-10 flex justify-between text-xs uppercase text-white/50 tracking-widest">
                        <span>Portfolio 2.0</span>
                        <span>@2025</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MobileMenu;
