import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal as TerminalIcon, Maximize2, Minimize2, Activity } from 'lucide-react';
import { useTerminal } from '../context/TerminalContext';
import { soundManager } from '../utils/SoundManager';

const Terminal = () => {
    const { logs, addLog, clearLogs, systemStatus, setSystemStatus } = useTerminal();
    const [isOpen, setIsOpen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [autoScroll, setAutoScroll] = useState(true);

    // Initial Welcome Log
    useEffect(() => {
        if (logs.length === 0) {
            addLog("Initializing Neural Interface...", "system");
            setTimeout(() => addLog("Saurabh's Core Systems [ONLINE]", "success"), 500);
            setTimeout(() => addLog("Type 'help' for command list.", "info"), 800);
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
                soundManager.playHover(); // Sound on open
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
        if (scrollRef.current && autoScroll) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs, autoScroll, isOpen]);

    const handleCommand = (cmd: string) => {
        const cleanCmd = cmd.trim().toLowerCase();
        addLog(cmd, 'info', 'USER');

        switch (cleanCmd) {
            case 'help':
                addLog("Available Commands:", "system");
                addLog("  about     - Who is Saurabh?", "info");
                addLog("  projects  - List Gen AI Projects", "info");
                addLog("  agents    - List Live Agents", "info");
                addLog("  contact   - Show contact info", "info");
                addLog("  clear     - Clear terminal", "info");
                addLog("  status    - Check System Status", "info");
                addLog("  hack      - ???", "warning");
                soundManager.playSuccess();
                break;
            case 'about':
                addLog("Saurabh Lokhande | AI Agent Systems Developer.", "success");
                addLog("Specialist in LangGraph, MCP, and Reasoning Agents.", "success");
                soundManager.playSuccess();
                break;
            case 'projects':
                addLog("Fetching Project Database...", "system");
                setTimeout(() => {
                    addLog("• Deep RAG System (Finance/Legal)", "success");
                    addLog("• Autonomous Research Agent", "success");
                    addLog("• Multi-Agent Orchestration", "success");
                    soundManager.playSuccess();
                }, 300);
                break;
            case 'agent':
            case 'agents':
                addLog("Listing Active Agents...", "system");
                setTimeout(() => {
                    addLog("• Travel Guru [ONLINE]", "success");
                    addLog("• 90-Day Launchpad [ONLINE]", "success");
                    addLog("• DuduSL001 [EXPERIMENTAL]", "warning");
                    soundManager.playSuccess();
                }, 300);
                break;
            case 'contact':
                addLog("Email: saurabhmj11@gmail.com", "info");
                addLog("Phone: +91-7767913887", "info");
                soundManager.playSuccess();
                break;
            case 'clear':
                clearLogs();
                soundManager.playHover();
                break;
            case 'exit':
                setIsOpen(false);
                break;
            case 'status':
                addLog(`System Status: ${systemStatus}`, "system");
                soundManager.playHover();
                break;
            case 'hack':
                addLog("Breaching Mainframe...", "warning");
                setSystemStatus("PROCESSING");
                setTimeout(() => {
                    addLog("Access Granted. Welcome, Administrator.", "success");
                    addLog("Just kidding. Security is tight here.", "info");
                    setSystemStatus("IDLE");
                    soundManager.playSuccess();
                }, 2000);
                break;
            case 'sudo':
                addLog("Permission denied: You are not root.", "error");
                soundManager.playError();
                break;
            case 'hire_me':
            case 'hire':
                addLog("Initiating Hiring Protocol...", "success");
                addLog("Thank you for your interest! Please email me immediately.", "success");
                soundManager.playSuccess();
                break;
            default:
                addLog(`Command not found: ${cmd}`, "error");
                soundManager.playError();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        } else {
            soundManager.playTyping();
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
                        className="bg-black/90 font-mono text-sm md:text-base rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col pointer-events-auto relative"
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
                                    {systemStatus === 'PROCESSING' && <Activity size={14} className="animate-pulse text-green-500" />}
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
                            {logs.map((log) => (
                                <div key={log.id} className="mb-1 flex gap-2">
                                    <span className="text-gray-500 text-xs select-none">[{new Date(log.timestamp).toLocaleTimeString().split(' ')[0]}]</span>
                                    <div className={`break-words whitespace-pre-wrap flex-1 ${log.type === 'error' ? 'text-red-500' :
                                        log.type === 'success' ? 'text-green-400' :
                                            log.type === 'warning' ? 'text-yellow-400' :
                                                log.type === 'system' ? 'text-blue-400' :
                                                    'text-gray-300'
                                        }`}>
                                        {log.source !== 'SYS' && log.source !== 'USER' && <span className="text-xs border border-white/10 px-1 rounded mr-2 text-gray-500">{log.source}</span>}
                                        {log.source === 'USER' && <span className="text-green-500 mr-2">➜ ~</span>}
                                        {log.message}
                                    </div>
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

export default Terminal;
