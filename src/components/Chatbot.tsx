import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot } from 'lucide-react';
import Magnetic from './Magnetic';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

import useHaptic from '../hooks/useHaptic';
import { soundManager } from '../utils/SoundManager';

interface ChatbotProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, setIsOpen }) => {
    // const [isOpen, setIsOpen] = useState(false); // Prop driven now
    const [input, setInput] = useState('');
    const { trigger: haptic } = useHaptic();
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hi! I'm Saurabh's AI Assistant. Ask me about his projects, skills, or contact info!", sender: 'bot' }
    ]);

    const [isTyping, setIsTyping] = useState(false);
    // 'unknown' until the first reply tells us whether the AI backend answered.
    const [mode, setMode] = useState<'unknown' | 'online' | 'offline'>('unknown');
    const [waking, setWaking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
        const userText = input;
        // We'll pass the entire history to the backend for context
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        // Local quick answers (used when the AI backend is offline or unreachable).
        // Whole-word matching, so "which" doesn't trigger the "hi" greeting.
        const getFallbackResponse = (text: string) => {
            const has = (...words: string[]) => words.some(w => new RegExp(`\\b${w}\\b`, 'i').test(text));
            if (has('skill', 'skills', 'stack', 'tech', 'expert', 'expertise')) {
                return "Retrieval and agent systems: hybrid BM25 + vector RAG with reranking and citations, LangGraph agents, FastAPI backends, ChromaDB/FAISS, and both local (Ollama) and hosted LLMs. Building AI since 2022.";
            } else if (has('project', 'projects', 'work', 'built', 'portfolio')) {
                return "Selected work:\n• Doc AI — hybrid RAG with cited answers, evaluated on 4,584 pages (Recall@3 97.5%, retrieval p50 0.55 s).\n• Hire Me OS 2.0 — multi-tenant job-search SaaS with an A–F evaluation engine.\n• Multi-Agent Research — LangGraph planner → researcher → verifier → writer on local Ollama.\n• DataOS — browser-based agentic data-analysis simulation.\nEach opens a full case study in Selected Work.";
            } else if (has('live', 'demo', 'try')) {
                return "Doc AI has a live demo at doc-ai-frontend.onrender.com (free hosting: the first request can take 30–60 s while it wakes up). Its case study has the full evaluation.";
            } else if (has('contact', 'email', 'phone', 'hire', 'reach')) {
                return "Email: saurabhmj11@gmail.com\nPhone: +91-7767913887\nOr use the contact form at the bottom of the page.";
            } else if (has('resume', 'cv', 'background', 'experience', 'job')) {
                return "Gen AI / LLM Engineer at OneOfficeAutomation since Jan 2024; freelance ML engineer 2023–24; Data & AI intern at Pantech Solutions 2022–23. The one-page PDF résumé is linked in the top navigation.";
            } else if (has('hello', 'hi', 'hey', 'morning', 'evening')) {
                return "Hi! Ask me about Saurabh's projects, his RAG and agent work, his experience, or how to reach him.";
            }
            return "I'm not sure about that one. Try asking about his projects, skills, experience or contact details.";
        };

        const reply = (text: string) => setMessages(prev => [...prev, { id: Date.now() + 1, text, sender: 'bot' }]);

        // Free hosting sleeps when idle: tell the visitor instead of looking frozen.
        const wakingTimer = window.setTimeout(() => setWaking(true), 4000);
        const controller = new AbortController();
        const abortTimer = window.setTimeout(() => controller.abort(), 60000); // Render cold starts take ~30–60 s

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages.slice(-20).map(m => ({ sender: m.sender, text: m.text.slice(0, 2000) })) }),
                signal: controller.signal,
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            if (data.mode === 'fallback') {
                setMode('offline');
                reply(getFallbackResponse(userText));
            } else {
                setMode('online');
                reply(data.response || "Sorry, I received an empty response.");
            }
        } catch (error) {
            console.error('Chatbot API error, answering locally:', error);
            setMode('offline');
            reply(getFallbackResponse(userText));
                } finally {
            window.clearTimeout(wakingTimer);
            window.clearTimeout(abortTimer);
            setWaking(false);
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-24 left-0 right-0 md:bottom-8 md:left-auto md:right-8 z-50 flex flex-col items-center md:items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-4 w-[90vw] md:w-[350px] max-w-full bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col pointer-events-auto"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
                                    <Bot size={16} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-medium text-sm">AI Assistant</h3>
                                    <p className={`text-xs flex items-center gap-1 ${mode === 'offline' ? 'text-amber-300' : mode === 'online' ? 'text-green-400' : 'text-gray-400'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${mode === 'offline' ? 'bg-amber-300' : mode === 'online' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                                        {mode === 'offline' ? 'Quick answers (AI offline)' : 'AI assistant'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="h-[300px] overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                            ? 'bg-white text-black rounded-tr-none'
                                            : 'bg-white/10 text-gray-200 rounded-tl-none'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                    {waking && (
                                        <p className="ml-3 self-center text-xs text-gray-400" aria-hidden="true">
                                            Waking the server (free hosting) — this can take up to a minute…
                                        </p>
                                    )}
                                </div>
                            )}
                            {/* One persistent live region, so screen readers hear state changes. */}
                            <div className="sr-only" role="status" aria-live="polite">
                                {waking ? 'Waking the server, this can take up to a minute.' : ''}
                            </div>
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-white/10 bg-black/50">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask something..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-white/30 placeholder-gray-500"
                                />
                                <button
                                    type="submit"
                                    aria-label="Send message"
                                    disabled={!input.trim() || isTyping}
                                    className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Magnetic>
                <div className="relative pointer-events-auto group mt-4 md:mt-0">
                    {/* Live Agent Pulsing Aura */}
                    {!isOpen && (
                        <>
                            <span className="absolute inset-0 rounded-full bg-blue-400 opacity-60 animate-ping" style={{ animationDuration: '3s' }}></span>
                            <span className="absolute inset-[-10px] rounded-full bg-purple-500 opacity-20 animate-pulse" style={{ animationDuration: '2s' }}></span>
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-xs text-white px-3 py-1 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-sm">
                                <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                                Ask about my work
                            </div>
                        </>
                    )}
                    <button
                        onClick={() => { setIsOpen(!isOpen); if (!isOpen) { soundManager.playHover(); haptic('medium'); } else { haptic('light'); } }}
                        aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
                        aria-expanded={isOpen}
                        className="hidden md:flex relative z-10 w-16 h-16 bg-white text-black rounded-full items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-110 hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-all duration-300 active:scale-95"
                    >
                        {isOpen ? <X size={24} /> : <Bot size={28} className="text-black" />}
                    </button>
                </div>
            </Magnetic>
        </div>
    );
};

export default Chatbot;

