import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Zap, FileText, User, Mail, Github, Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import projectsData from '../data/projectsData';

interface CommandItem {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    action: () => void;
    category: 'Navigation' | 'Projects' | 'Social' | 'Actions';
}

const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const commands: CommandItem[] = [
        // Navigation
        { id: 'nav-home', title: 'Go to Home', description: 'Jump to the landing section', icon: <Zap className="w-4 h-4" />, category: 'Navigation', action: () => scrollToSection('#home') },
        { id: 'nav-projects', title: 'View Projects', description: 'See the neural web of work', icon: <FileText className="w-4 h-4" />, category: 'Navigation', action: () => scrollToSection('#projects') },
        { id: 'nav-about', title: 'Read Bio', description: 'About Saurabh and his mission', icon: <User className="w-4 h-4" />, category: 'Navigation', action: () => scrollToSection('#about') },
        { id: 'nav-contact', title: 'Get in Touch', description: 'Initialize a new connection', icon: <Mail className="w-4 h-4" />, category: 'Navigation', action: () => scrollToSection('#contact') },
        
        // Projects (Dynamic from data)
        ...projectsData.map(p => ({
            id: `project-${p.id}`,
            title: `Project: ${p.title}`,
            description: p.category,
            icon: <Zap className="w-4 h-4 text-blue-400" />,
            category: 'Projects' as const,
            action: () => { navigate(`/project/${p.id}`); setIsOpen(false); }
        })),

        // Social
        { id: 'social-github', title: 'GitHub Profile', description: 'Explore my open source work', icon: <Github className="w-4 h-4" />, category: 'Social', action: () => window.open('https://github.com/saurabhmj11', '_blank') },
        { id: 'social-linkedin', title: 'LinkedIn Profile', description: 'Connect for opportunities', icon: <Linkedin className="w-4 h-4" />, category: 'Social', action: () => window.open('https://www.linkedin.com/in/saurabhsl/', '_blank') },
    ];

    const filteredCommands = query === '' 
        ? commands 
        : commands.filter(c => 
            c.title.toLowerCase().includes(query.toLowerCase()) || 
            c.description.toLowerCase().includes(query.toLowerCase()) ||
            c.category.toLowerCase().includes(query.toLowerCase())
        );

    const scrollToSection = (id: string) => {
        setIsOpen(false);
        if (window.location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const el = document.querySelector(id);
                el?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const el = document.querySelector(id);
            el?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setIsOpen(prev => !prev);
        }
        if (e.key === 'Escape') setIsOpen(false);

        if (isOpen) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                filteredCommands[selectedIndex]?.action();
            }
        }
    }, [isOpen, filteredCommands, selectedIndex]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    // Handle clicks outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    
                    <motion.div
                        ref={containerRef}
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden"
                    >
                        {/* Search Input */}
                        <div className="relative flex items-center px-6 py-4 border-b border-white/5">
                            <Search className="w-5 h-5 text-gray-500 mr-4" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                                placeholder="Type a command or search..."
                                className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder-gray-600 font-light"
                            />
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-gray-500 font-mono">
                                <span>ESC</span>
                            </div>
                        </div>

                        {/* Command List */}
                        <div className="max-h-[50vh] overflow-y-auto py-2 custom-scrollbar">
                            {filteredCommands.length === 0 ? (
                                <div className="px-6 py-12 text-center">
                                    <p className="text-gray-500 text-sm">No results found for "{query}"</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {/* Group by category */}
                                    {['Navigation', 'Projects', 'Social'].map(cat => {
                                        const catItems = filteredCommands.filter(c => c.category === cat);
                                        if (catItems.length === 0) return null;
                                        
                                        return (
                                            <div key={cat} className="px-2 pb-2">
                                                <div className="px-4 py-2 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                                                    {cat}
                                                </div>
                                                {catItems.map((command) => {
                                                    const globalIdx = filteredCommands.indexOf(command);
                                                    const isSelected = globalIdx === selectedIndex;
                                                    
                                                    return (
                                                        <div
                                                            key={command.id}
                                                            onClick={command.action}
                                                            onMouseEnter={() => setSelectedIndex(globalIdx)}
                                                            className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-colors ${isSelected ? 'bg-white/5' : 'transparent'}`}
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${isSelected ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5'} transition-colors`}>
                                                                    {command.icon}
                                                                </div>
                                                                <div>
                                                                    <div className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                                                        {command.title}
                                                                    </div>
                                                                    <div className="text-[11px] text-gray-600">
                                                                        {command.description}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {isSelected && (
                                                                <motion.div
                                                                    layoutId="arrow"
                                                                    className="text-gray-500"
                                                                >
                                                                    <ArrowRight className="w-4 h-4" />
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer Hints */}
                        <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center gap-6">
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                                <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">↑↓</kbd>
                                <span>Navigate</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                                <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">ENTER</kbd>
                                <span>Execute</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;
