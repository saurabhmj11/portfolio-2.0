import React from 'react';
import { Home, Terminal, MessageSquare, User, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import useHaptic from '../hooks/useHaptic';
import { soundManager } from '../utils/SoundManager';

interface AgentDockProps {
    setIsChatOpen: (v: boolean) => void;
    isChatOpen: boolean;
}

const AgentDock: React.FC<AgentDockProps> = ({ setIsChatOpen, isChatOpen }) => {
    const { trigger: haptic } = useHaptic();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToContact = () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
        soundManager.playClick();
        haptic('medium');
    };

    // Terminal toggle (simulated by scrolling to terminal section as it's at the bottom often, or we can add a real toggle later)
    // For now, let's just scroll to bottom where Terminal usually resides or is fixed.
    // Actually Terminal component is fixed? No, it's `fixed bottom-4 left-4`.
    // Wait, Terminal.tsx returns a `AnimatePresence` and is `fixed`.
    // So "Toggle Terminal" might need `TerminalContext` or just rely on it being there.
    // The Terminal is ALWAYS visible in the bottom left on desktop. On mobile it might be hidden?
    // Let's check Terminal.tsx responsiveness.

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-2 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-full shadow-2xl md:hidden"
        >
            <DockItem icon={<Home size={20} />} label="Home" onClick={scrollToTop} />

            {/* Divider */}
            <div className="w-[1px] h-6 bg-white/10" />

            <DockItem
                icon={<MessageSquare size={20} className={isChatOpen ? "text-green-400" : ""} />}
                label="Chat"
                onClick={toggleChat}
                isActive={isChatOpen}
            />

            <DockItem icon={<User size={20} />} label="Contact" onClick={scrollToContact} />
        </motion.div>
    );
};

const DockItem = ({ icon, label, onClick, isActive = false }: { icon: React.ReactNode, label: string, onClick: () => void, isActive?: boolean }) => {
    const { trigger: haptic } = useHaptic();

    return (
        <button
            onClick={() => { onClick(); haptic('light'); }}
            className={`p-3 rounded-full transition-all active:scale-90 ${isActive ? 'bg-white/20' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
            aria-label={label}
        >
            {icon}
        </button>
    );
}

export default AgentDock;
