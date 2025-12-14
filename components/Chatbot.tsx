import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Bot } from 'lucide-react';
import Magnetic from './Magnetic';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
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

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI delay and response
        setTimeout(() => {
            let botText = "I'm not sure about that, but I can connect you with Saurabh or tell you about his Agents!";
            const lowerInput = userMsg.text.toLowerCase();

            if (lowerInput.includes('project') || lowerInput.includes('work') || lowerInput.includes('built')) {
                botText = "Saurabh has built advanced Gen AI systems like a Deep RAG System, Autonomous Research Agents, and a Multi-Agent Orchestration platform. Check out the 'Selected Work' & 'Live Agents' sections!";
            }
            else if (lowerInput.includes('live') || lowerInput.includes('agent') || lowerInput.includes('demo')) {
                botText = "You can try his live agents right now! Check out 'Travel Guru', '90-Day Launchpad', or the experimental 'DuduSL001' in the Live Agents section below.";
            }
            else if (lowerInput.includes('skill') || lowerInput.includes('stack') || lowerInput.includes('tech')) {
                botText = "Core Expertise: Agentic AI Systems, LangGraph, Google ADK, Model Context Protocol (MCP). Proficient in Python, RAG Implementation, and Reasoning Models. A solid 1.8 years of specialized GenAI experience.";
            }
            else if (lowerInput.includes('contact') || lowerInput.includes('email') || lowerInput.includes('phone') || lowerInput.includes('hire')) {
                botText = "Contact Saurabh directly: \nEmail: saurabhmj11@gmail.com \nPhone: +91-7767913887 \nStatus: Immediate Joiner (No Notice Period).";
            }
            else if (lowerInput.includes('resume') || lowerInput.includes('cv') || lowerInput.includes('background') || lowerInput.includes('experience')) {
                botText = "Saurabh is an AI Agent Systems Developer with 1.8 years of experience. \n\nKey Highlights:\n• Specialized in LangGraph & Multi-Agent Orchestration.\n• Built Long-Running Agents & Reasoning Models.\n• Foundation in MCP Servers & Agent Memory.\n• Immediate Joiner.\n\nAsk for his 'full summary' if you want more details!";
            }
            else if (lowerInput.includes('full summary') || lowerInput.includes('summary')) {
                botText = "Professional Summary: Highly focused AI Agent Systems Developer. \n\nExperience: 1.8 Years (Freelance & Pantech Solutions).\n\nProjects:\n• Quiz-Based Contextual Logic System (RAG + Memory).\n• Agent Execution Monitoring System.\n\nTech: Python, FastAPI, Docker, GCP/Vertex AI.\n\nHe is ready to deploy scalable solutions immediately.";
            }
            else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
                botText = "Hello! I'm your guide to Saurabh's portfolio. Ask me about his Resume, Skills, Live Agents, or Contact info!";
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, text: botText, sender: 'bot' }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-4 w-[350px] bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
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
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-200 transition-all active:scale-95"
                >
                    {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
                </button>
            </Magnetic>
        </div>
    );
};

export default Chatbot;
