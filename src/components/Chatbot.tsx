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
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
        // We'll pass the entire history to the backend for context
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        // Define the local fallback logic
        const getFallbackResponse = (text: string) => {
            const lowerInput = text.toLowerCase();
            if (lowerInput.includes('skill') || lowerInput.includes('stack') || lowerInput.includes('tech') || lowerInput.includes('what can you do') || lowerInput.includes('expert')) {
                return "Core Expertise: LLM Systems & RAG (End-to-end architectures, Semantic Chunking), AI Agents (LangChain, LangGraph, CrewAI). Proficient in Python (FastAPI), Local LLMs (Ollama), and Vector DBs. ~2 years of specialized GenAI experience.";
            } else if (lowerInput.includes('project') || lowerInput.includes('work') || lowerInput.includes('built') || lowerInput.includes('portfolio')) {
                return "Saurabh's Flagships:\n• OpenReception: AI Receptionist SaaS Platform.\n• AGEN: AI Agent Browser Platform (Open Source).\n• Research Agent: Automated research workflows with LangGraph.\n• Resume Processor: Automated AI candidate intelligence pipeline.";
            } else if (lowerInput.includes('workflow') || lowerInput.includes('process') || lowerInput.includes('method') || lowerInput.includes('build')) {
                return "Saurabh's System Workflow:\n1. Deep Discovery (Problem Framing)\n2. Agentic Architecture Design (LangGraph)\n3. Precision Implementation (Python/FastAPI)\n4. Reliable Deployment (Docker/Edge)";
            } else if (lowerInput.includes('live') || lowerInput.includes('agent') || lowerInput.includes('demo') || lowerInput.includes('try')) {
                return "You can try his live agents right now! Check out 'Travel Guru', '90-Day Launchpad', or the experimental 'DuduSL001' in the Live Agents section below.";
            } else if (lowerInput.includes('contact') || lowerInput.includes('email') || lowerInput.includes('phone') || lowerInput.includes('hire') || lowerInput.includes('reach')) {
                return "Contact Saurabh directly: \nEmail: saurabhmj11@gmail.com \nPhone: +91-7767913887 \nLocation: Open to Relocation \nStatus: Immediate Joiner.";
            } else if (lowerInput.includes('resume') || lowerInput.includes('cv') || lowerInput.includes('background') || lowerInput.includes('experience') || lowerInput.includes('job')) {
                return "Saurabh is an LLM Engineer with ~2 years of experience. \n\nKey Highlights:\n• Specialized in RAG & Multi-Agent Orchestration.\n• Built Production-grade Document Processing pipelines.\n• Expert in Local LLM Deployment (Ollama).\n• Immediate Joiner.\n\nAsk for his 'full summary' if you want more details!";
            } else if (lowerInput.includes('full summary') || lowerInput.includes('summary')) {
                return "Professional Summary: LLM Engineer building production-grade AI systems. \n\nExperience: ~2 Years (Freelance & Product Projects).\n\nFocus:\n• RAG Architectures & Vector Search\n• Multi-Agent Systems (LangGraph)\n• Scalable Backends (FastAPI)\n\nHe is ready to build scalable AI solutions immediately.";
            } else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey') || lowerInput.includes('good morning') || lowerInput.includes('good evening')) {
                return "Hello! I'm your guide to Saurabh's portfolio. Ask me about his AI Projects (AGEN, OpenReception), RAG expertise, or Contact info!";
            }
            return "I'm not exactly sure about that, but I can connect you with Saurabh or tell you about his AI Agents and Projects!";
        };

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            const response = await fetch(`${apiUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: newMessages }),
            });

            if (!response.ok) {
                // Network error, drop to fallback
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Check if backend specifically told us it's running in offline/default mode
            if (data.response && data.response.includes('currently running in offline mode')) {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: getFallbackResponse(input),
                    sender: 'bot'
                }]);
            } else {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: data.response || "Sorry, I received an empty response from my circuits.",
                    sender: 'bot'
                }]);
            }

        } catch (error) {
            console.error("Chatbot API Error, falling back to local logic:", error);
            // Local Fallback simulation
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: getFallbackResponse(input),
                    sender: 'bot'
                }]);
                setIsTyping(false);
            }, 800);
            return; // Early return because we handle isTyping inside setTimeout

        } finally {
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
                                    <p className="text-xs text-green-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                        Online
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
                                </div>
                            )}
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
                                    disabled={!input.trim()}
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
                                Live Agent Online
                            </div>
                        </>
                    )}
                    <button
                        onClick={() => { setIsOpen(!isOpen); if (!isOpen) { soundManager.playHover(); haptic('medium'); } else { haptic('light'); } }}
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

