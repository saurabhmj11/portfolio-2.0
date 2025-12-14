import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal as TerminalIcon, Maximize2, Minimize2 } from 'lucide-react';

interface TerminalLine {
    type: 'input' | 'output' | 'system';
    content: React.ReactNode;
}

const Terminal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<TerminalLine[]>([
        { type: 'system', content: 'Welcome to Saurabh\'s Agentic Terminal v1.0.0' },
        { type: 'system', content: 'Type "help" to see available commands.' }
    ]);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const handleCommand = (cmd: string) => {
        const cleanCmd = cmd.trim().toLowerCase();
        const newHistory: TerminalLine[] = [...history, { type: 'input', content: cmd }];

        switch (cleanCmd) {
            case 'help':
                newHistory.push({
                    type: 'output',
                    content: (
                        <div className="grid grid-cols-[100px_1fr] gap-2">
                            <span className="text-yellow-400">about</span> <span>Who is Saurabh?</span>
                            <span className="text-yellow-400">projects</span> <span>List Gen AI Projects</span>
                            <span className="text-yellow-400">agents</span> <span>List Live Agents</span>
                            <span className="text-yellow-400">contact</span> <span>Show contact info</span>
                            <span className="text-yellow-400">clear</span> <span>Clear terminal</span>
                            <span className="text-yellow-400">exit</span> <span>Close terminal</span>
                        </div>
                    )
                });
                break;
            case 'about':
                newHistory.push({
                    type: 'output',
                    content: "Saurabh Lokhande | AI Agent Systems Developer. 1.8+ Years Exp. Specialist in LangGraph, MCP, and Reasoning Agnets."
                });
                break;
            case 'projects':
                newHistory.push({
                    type: 'output',
                    content: (
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Deep RAG System (Finance/Legal)</li>
                            <li>Autonomous Research Agent</li>
                            <li>Multi-Agent Orchestration</li>
                            <li>Generative UI Experience</li>
                            <li>Multimodal Assistant</li>
                        </ul>
                    )
                });
                break;
            case 'agent':
            case 'agents':
                newHistory.push({
                    type: 'output',
                    content: (
                        <ul className="list-disc pl-4 space-y-1">
                            <li><a href="https://agent.ai/agent/gurutravel" target="_blank" className="text-blue-400 hover:underline">Travel Guru</a></li>
                            <li><a href="https://agent.ai/agent/90day" target="_blank" className="text-blue-400 hover:underline">90-Day Launchpad</a></li>
                            <li><a href="https://agent.ai/agent/dudusl001" target="_blank" className="text-blue-400 hover:underline">DuduSL001</a></li>
                            <li><a href="https://agent.ai/agent/Agentplan01" target="_blank" className="text-blue-400 hover:underline">Agent Plan 01</a></li>
                            <li><a href="https://agent.ai/agent/S_L_011" target="_blank" className="text-blue-400 hover:underline">S L 011</a></li>
                        </ul>
                    )
                });
                break;
            case 'contact':
                newHistory.push({
                    type: 'output',
                    content: (
                        <div>
                            <div>Email: saurabhmj11@gmail.com</div>
                            <div>Phone: +91-7767913887</div>
                        </div>
                    )
                });
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'exit':
                setIsOpen(false);
                return;
            case 'sudo':
                newHistory.push({ type: 'output', content: <span className="text-red-500">Permission denied: You are not root.</span> });
                break;
            default:
                newHistory.push({ type: 'output', content: <span className="text-red-400">Command not found: {cmd}. Type 'help' for options.</span> });
        }

        setHistory(newHistory);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-4">
                    {/* Overlay Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            width: isMaximized ? '95vw' : '800px',
                            height: isMaximized ? '95vh' : '500px'
                        }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-black/90 text-green-500 font-mono text-sm md:text-base rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col pointer-events-auto relative"
                    >
                        {/* Terminal Header */}
                        <div className="bg-white/10 p-3 flex justify-between items-center select-none handle cursor-move">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={() => setIsOpen(false)} />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" onClick={() => setIsMaximized(!isMaximized)} />
                                </div>
                                <div className="flex items-center gap-2 ml-4 text-gray-400">
                                    <TerminalIcon size={14} />
                                    <span>saurabh@portfolio:~</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <button onClick={() => setIsMaximized(!isMaximized)} className="hover:text-white">
                                    {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                                </button>
                                <button onClick={() => setIsOpen(false)} className="hover:text-white">
                                    <X size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Terminal Body */}
                        <div
                            ref={scrollRef}
                            className="flex-1 p-6 overflow-y-auto font-mono scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                            onClick={() => inputRef.current?.focus()}
                        >
                            {history.map((line, i) => (
                                <div key={i} className="mb-2">
                                    {line.type === 'input' ? (
                                        <div className="flex gap-2 text-white">
                                            <span className="text-green-500">➜</span>
                                            <span className="text-blue-400">~</span>
                                            <span>{line.content}</span>
                                        </div>
                                    ) : (
                                        <div className="text-gray-300 ml-6 break-words whitespace-pre-wrap">
                                            {typeof line.content === 'string' ? <Typewriter text={line.content} /> : line.content}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Active Input Line */}
                            <div className="flex gap-2 items-center mt-2 group">
                                <span className="text-green-500">➜</span>
                                <span className="text-blue-400">~</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="bg-transparent border-none outline-none text-white flex-1 caret-white"
                                    autoFocus
                                    autoComplete="off"
                                    spellCheck="false"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const Typewriter = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState('');
    const index = useRef(0);

    useEffect(() => {
        index.current = 0;
        setDisplayedText('');

        const intervalId = setInterval(() => {
            setDisplayedText((prev) => {
                if (index.current < text.length) {
                    const char = text.charAt(index.current);
                    index.current++;
                    return prev + char;
                }
                clearInterval(intervalId);
                return prev;
            });
        }, 15); // Speed of typing

        return () => clearInterval(intervalId);
    }, [text]);

    return <span>{displayedText}</span>;
};

export default Terminal;
