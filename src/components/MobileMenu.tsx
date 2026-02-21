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
        { name: 'Work', href: '#projects' },
        { name: 'Services', href: '#services' },
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
                    className="fixed inset-0 bg-[#0a0a0a] text-white z-40 flex flex-col justify-center items-center h-screen overflow-hidden"
                >
                    <div className="flex flex-col text-center w-full max-w-2xl px-4">
                        {navItems.map((item, i) => (
                            <Magnetic key={item.name}>
                                <div className="overflow-hidden">
                                    <motion.a
                                        href={item.href}
                                        onClick={(e) => {
                                            onClose();
                                            onNavClick(e, item.href);
                                        }}
                                        initial={{ opacity: 0, y: "100%" }}
                                        animate={{
                                            opacity: 1,
                                            y: "0%",
                                            transition: { delay: 0.2 + (i * 0.1), duration: 0.8, ease: [0.76, 0, 0.24, 1] }
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: "-100%",
                                            transition: { delay: i * 0.05, duration: 0.4, ease: [0.76, 0, 0.24, 1] }
                                        }}
                                        className="text-[12vw] sm:text-7xl font-display font-black uppercase tracking-tighter leading-[0.85] text-white hover:text-outline-strong hover:text-transparent transition-all duration-300 block py-1 md:py-2"
                                    >
                                        {item.name}
                                    </motion.a>
                                </div>
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
