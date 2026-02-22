import React, { useEffect, useRef } from 'react';
import { Home, MessageSquare, User } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import useHaptic from '../hooks/useHaptic';
import { soundManager } from '../utils/SoundManager';

interface AgentDockProps {
    setIsChatOpen: (v: boolean) => void;
    isChatOpen: boolean;
}

const AgentDock: React.FC<AgentDockProps> = ({ setIsChatOpen, isChatOpen }) => {
    const { trigger: haptic } = useHaptic();

    // ── Scroll-speed stretch ──────────────────────────────────────────────────
    const lastScrollY = useRef(0);
    const scrollVelocity = useMotionValue(0);
    const smoothVelocity = useSpring(scrollVelocity, { damping: 18, stiffness: 120 });

    // Stretch X based on scroll speed (faster scroll = wider pill)
    const scaleX = useTransform(smoothVelocity, [-600, 0, 600], [1.22, 1, 1.22]);
    // Slight vertical squeeze when stretching
    const scaleY = useTransform(smoothVelocity, [-600, 0, 600], [0.88, 1, 0.88]);

    useEffect(() => {
        let prevTime = performance.now();

        const onScroll = () => {
            const now = performance.now();
            const dt = Math.max(now - prevTime, 1);
            const dy = window.scrollY - lastScrollY.current;
            scrollVelocity.set((dy / dt) * 1000);
            lastScrollY.current = window.scrollY;
            prevTime = now;
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [scrollVelocity]);

    const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const scrollToContact = () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };
    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
        soundManager.playClick();
        haptic('medium');
    };

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 20 }}
            style={{ scaleX, scaleY }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-2 py-2 bg-black/85 backdrop-blur-xl border border-white/12 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] md:hidden origin-center"
        >
            <DockItem icon={<Home size={19} />} label="Home" onClick={scrollToTop} />

            <div className="w-px h-5 bg-white/10" />

            <DockItem
                icon={<MessageSquare size={19} className={isChatOpen ? 'text-green-400' : ''} />}
                label="Chat"
                onClick={toggleChat}
                isActive={isChatOpen}
            />

            <DockItem icon={<User size={19} />} label="Contact" onClick={scrollToContact} />
        </motion.div>
    );
};

const DockItem = ({ icon, label, onClick, isActive = false }: {
    icon: React.ReactNode; label: string; onClick: () => void; isActive?: boolean;
}) => {
    const { trigger: haptic } = useHaptic();
    return (
        <motion.button
            onClick={() => { onClick(); haptic('light'); }}
            whileTap={{ scale: 0.85 }}
            className={`p-3 rounded-full transition-all ${isActive ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
            aria-label={label}
        >
            {icon}
            {/* Active pulse dot on Chat */}
            {isActive && label === 'Chat' && (
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            )}
        </motion.button>
    );
};

export default AgentDock;
