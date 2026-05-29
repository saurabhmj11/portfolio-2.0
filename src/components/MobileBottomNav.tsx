import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Briefcase, Zap, User, Mail } from 'lucide-react';

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    href: string;
}

const NAV_ITEMS: NavItem[] = [
    { id: 'home', label: 'Home', icon: <Home size={18} strokeWidth={1.8} />, href: '#home' },
    { id: 'projects', label: 'Work', icon: <Briefcase size={18} strokeWidth={1.8} />, href: '#projects' },
    { id: 'services', label: 'Services', icon: <Zap size={18} strokeWidth={1.8} />, href: '#services' },
    { id: 'about', label: 'About', icon: <User size={18} strokeWidth={1.8} />, href: '#about' },
    { id: 'contact', label: 'Contact', icon: <Mail size={18} strokeWidth={1.8} />, href: '#contact' },
];

/**
 * MobileBottomNav
 *
 * Native-feeling bottom navigation bar for mobile.
 * - Auto-hides when scrolling down, reappears when scrolling up
 * - Highlights active section via IntersectionObserver
 * - Smooth indicator pill slides between active tabs
 * - Haptic feedback via Vibration API (if available)
 */
const MobileBottomNav: React.FC = () => {
    const [activeId, setActiveId] = useState('home');
    const [visible, setVisible] = useState(true);
    const lastScrollY = React.useRef(0);
    const ticking = React.useRef(false);

    // Track active section via IntersectionObserver
    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        NAV_ITEMS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (!el) return;

            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
                        setActiveId(id);
                    }
                },
                { threshold: [0.4] }
            );
            obs.observe(el);
            observers.push(obs);
        });

        return () => observers.forEach(o => o.disconnect());
    }, []);

    // Auto-hide on scroll down, show on scroll up
    useEffect(() => {
        const handleScroll = () => {
            if (ticking.current) return;
            ticking.current = true;

            requestAnimationFrame(() => {
                const currentY = window.scrollY;
                const diff = currentY - lastScrollY.current;
                // Only hide if scrolled more than 10px down
                if (Math.abs(diff) > 10) {
                    setVisible(diff < 0 || currentY < 60);
                }
                lastScrollY.current = currentY;
                ticking.current = false;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = useCallback((e: React.MouseEvent, href: string, id: string) => {
        e.preventDefault();
        // Stronger Haptic feedback for tactile feel
        if (navigator.vibrate) navigator.vibrate(15);
        setActiveId(id);
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.nav
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 1 }}
                    className="fixed bottom-0 left-0 right-0 z-[200] md:hidden"
                    style={{
                        paddingBottom: 'env(safe-area-inset-bottom)',
                    }}
                    aria-label="Mobile navigation"
                >
                    {/* Glassmorphic pill container */}
                    <div
                        className="mx-3 mb-3 flex items-center justify-around rounded-2xl px-2 py-2"
                        style={{
                            background: 'rgba(10, 10, 10, 0.85)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            boxShadow: '0 -4px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
                        }}
                    >
                        {NAV_ITEMS.map((item) => {
                            const isActive = activeId === item.id;
                            return (
                                <a
                                    key={item.id}
                                    href={item.href}
                                    onClick={(e) => handleNavClick(e, item.href, item.id)}
                                    className="relative flex flex-col items-center justify-center flex-1 py-1.5 min-h-[52px] rounded-xl transition-colors duration-200 no-underline"
                                    aria-label={item.label}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    {/* Active background pill */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-active-pill"
                                            className="absolute inset-[2px] rounded-xl"
                                            style={{
                                                background: 'rgba(255,255,255,0.07)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                            }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                        />
                                    )}

                                    {/* Icon */}
                                    <span
                                        className="relative z-10 transition-all duration-300"
                                        style={{
                                            color: isActive ? '#ffffff' : 'rgba(255,255,255,0.3)',
                                            transform: isActive ? 'scale(1.1)' : 'scale(1)',
                                        }}
                                    >
                                        {item.icon}
                                    </span>

                                    {/* Label */}
                                    <span
                                        className="relative z-10 text-[9px] font-mono uppercase tracking-widest mt-0.5 transition-all duration-300"
                                        style={{
                                            color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                                            letterSpacing: '0.08em',
                                        }}
                                    >
                                        {item.label}
                                    </span>

                                    {/* Active accent dot */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-dot"
                                            className="absolute bottom-1 w-1 h-1 rounded-full"
                                            style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                                        />
                                    )}
                                </a>
                            );
                        })}
                    </div>
                </motion.nav>
            )}
        </AnimatePresence>
    );
};

export default MobileBottomNav;
