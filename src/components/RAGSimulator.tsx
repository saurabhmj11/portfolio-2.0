import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Database, FileText, Cpu } from 'lucide-react';
import ScrambleText from './ScrambleText';
import ScrollReveal from './ScrollReveal';

const RAGSimulator = () => {
    const [query, setQuery] = useState('');
    const [step, setStep] = useState(0);
    /* 
      Step 0: Idle
      Step 1: Embedding (Vectorizing)
      Step 2: Vector Search (FAISS)
      Step 3: Chunk Retrieval
      Step 4: LLM Generation
    */
    const [generatedText, setGeneratedText] = useState('');
    const [isSimulating, setIsSimulating] = useState(false);

    const PREDEFINED_RESPONSES: Record<string, string> = {
        "who is saurabh": "Saurabh Lokhande is an AI Engineer specializing in Generative AI, Agentic Systems, and LLM Architecture. He has 2+ years of experience building production-grade AI platforms like OpenReception and AGEN.",
        "skills": "Saurabh's core skills include Agentic AI Systems, Multi-Agent Architectures, RAG, Prompt Engineering, and Backend Engineering with Python and FastAPI. He is proficient in tools like LangChain, LangGraph, and Vector Databases (FAISS, Pinecone).",
        "experience": "Saurabh is currently a Generative AI / LLM Engineer at OneOfficeAutomation. He has built several production-style AI systems, including an AI receptionist SaaS, an open-source AI agent browser platform, and a stateful multi-agent research automation system using LangGraph.",
        "contact": "You can contact Saurabh via email at saurabhmj11@gmail.com or connect with him on LinkedIn at linkedin.com/in/saurabhmj11. His portfolio is available at saurabh-anil-lokhande.netlify.app."
    };

    const DEFAULT_RESPONSE = "Based on the provided context, Saurabh deployed an event-driven OCR pipeline using AWS Textract, Tesseract, and OpenCV, automating 95% of processing with <1% critical error rate.";

    const SUGGESTED_QUESTIONS = [
        "Who is Saurabh Lokhande?",
        "What are your core skills?",
        "Tell me about your AI experience.",
        "How to contact?"
    ];

    const getGroundedResponse = (q: string) => {
        const lowerQ = q.toLowerCase();
        if (lowerQ.includes("who is") || lowerQ.includes("saurabh")) return PREDEFINED_RESPONSES["who is saurabh"];
        if (lowerQ.includes("skills") || lowerQ.includes("tech") || lowerQ.includes("stack")) return PREDEFINED_RESPONSES["skills"];
        if (lowerQ.includes("experience") || lowerQ.includes("work") || lowerQ.includes("projects")) return PREDEFINED_RESPONSES["experience"];
        if (lowerQ.includes("contact") || lowerQ.includes("email") || lowerQ.includes("linkedin")) return PREDEFINED_RESPONSES["contact"];
        return DEFAULT_RESPONSE;
    };

    const runSimulation = async (e?: React.FormEvent, overrideQuery?: string) => {
        if (e) e.preventDefault();
        const finalQuery = overrideQuery || query;
        if (!finalQuery.trim() || isSimulating) return;

        setIsSimulating(true);
        setGeneratedText('');
        const responseToUse = getGroundedResponse(finalQuery);

        // 1. Embedding
        setStep(1);
        await new Promise(r => setTimeout(r, 1200));

        // 2. Vector Search
        setStep(2);
        await new Promise(r => setTimeout(r, 1200));

        // 3. Retrieval
        setStep(3);
        await new Promise(r => setTimeout(r, 1200));

        // 4. Generation
        setStep(4);

        // Typewriter effect
        for (let i = 0; i <= responseToUse.length; i++) {
            setGeneratedText(responseToUse.slice(0, i));
            await new Promise(r => setTimeout(r, 25)); // Slightly faster typing
        }

        await new Promise(r => setTimeout(r, 2000));
        setIsSimulating(false);
    };

    return (
        <section className="py-32 bg-[#020202] relative border-t border-white/5" id="rag-simulator">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)] pointer-events-none" />

            <div className="container mx-auto px-4 max-w-5xl relative z-10">
                <div className="text-center mb-16">
                    <ScrollReveal>
                        <p className="font-mono text-[10px] text-blue-500 uppercase tracking-[0.5em] mb-4">
                            <ScrambleText text="// RAG Architecture" />
                        </p>
                        <h2 className="text-[clamp(2rem,4vw,4rem)] font-display font-black leading-[0.9] tracking-tighter uppercase text-white mb-4">
                            Semantic<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
                                Retrieval Engine
                            </span>
                        </h2>
                        <p className="text-gray-400 max-w-lg mx-auto font-mono text-sm leading-relaxed">
                            Visualizing the math behind Retrieval-Augmented Generation. Enter a query to see how text is embedded, searched via cosine similarity, and grounded in generation.
                        </p>
                    </ScrollReveal>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">

                    {/* Input Area */}
                    <div className="mb-12">
                        <form onSubmit={(e) => { if (step === 4) setStep(0); runSimulation(e); }} className="relative mb-6">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="e.g., 'Who is Saurabh Lokhande?'"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-white font-mono text-sm focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-gray-600"
                                disabled={isSimulating && step !== 4}
                            />
                            <button
                                type="submit"
                                aria-label="Search"
                                disabled={!query.trim() || (isSimulating && step !== 4)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-2 rounded-xl transition-colors disabled:opacity-50"
                            >
                                <Search size={20} />
                            </button>
                        </form>

                        {/* Suggested Questions */}
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            {SUGGESTED_QUESTIONS.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setQuery(q); runSimulation(undefined, q); }}
                                    disabled={isSimulating}
                                    className="px-3 py-1.5 rounded-full border border-white/5 bg-white/5 text-[10px] font-mono text-gray-400 hover:border-blue-500/30 hover:text-blue-400 transition-all disabled:opacity-50"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Simulation Pipeline */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 hidden md:block -translate-y-1/2 z-0" />

                        {/* Node 1: Embedding */}
                        <div className={`relative z-10 flex flex-col items-center bg-[#050505] p-6 rounded-2xl border transition-all duration-500 ${step >= 1 ? 'border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]' : 'border-white/5 opacity-50'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${step >= 1 ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-500'}`}>
                                <Cpu size={24} />
                            </div>
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Embed Model</h3>
                            <div className="h-16 flex items-center justify-center w-full">
                                {step === 1 ? (
                                    <div className="flex flex-wrap gap-1 w-full overflow-hidden opacity-50 font-mono text-[8px] text-blue-400 break-all leading-none">
                                        {[...Array(40)].map((_, i) => (
                                            <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                                                {(Math.random() * 2 - 1).toFixed(3)}
                                            </motion.span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-600 font-mono text-center">Text to Vectors<br />[1024 d]</p>
                                )}
                            </div>
                        </div>

                        {/* Node 2: Vector DB */}
                        <div className={`relative z-10 flex flex-col items-center bg-[#050505] p-6 rounded-2xl border transition-all duration-500 ${step >= 2 ? 'border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.15)]' : 'border-white/5 opacity-50'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${step >= 2 ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-gray-500'}`}>
                                <Database size={24} />
                            </div>
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Vector DB</h3>
                            <div className="h-16 flex items-center justify-center w-full">
                                {step === 2 ? (
                                    <div className="flex flex-col gap-2 w-full">
                                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="h-1 bg-indigo-500/40 origin-left" />
                                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 0.8 }} transition={{ delay: 0.2 }} className="h-1 bg-indigo-500/60 origin-left" />
                                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 0.95 }} transition={{ delay: 0.4 }} className="h-1 bg-indigo-400 origin-left shadow-[0_0_10px_#818cf8]" />
                                        <p className="text-[9px] font-mono text-indigo-300 mt-1">Cosine Sim: 0.92</p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-600 font-mono text-center">FAISS Similarity<br />Search</p>
                                )}
                            </div>
                        </div>

                        {/* Node 3: Chunks */}
                        <div className={`relative z-10 flex flex-col items-center bg-[#050505] p-6 rounded-2xl border transition-all duration-500 ${step >= 3 ? 'border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)]' : 'border-white/5 opacity-50'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${step >= 3 ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-500'}`}>
                                <FileText size={24} />
                            </div>
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Context Chunks</h3>
                            <div className="h-16 flex items-center justify-center w-full text-center">
                                {step >= 3 ? (
                                    <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[9px] text-purple-300 font-mono leading-tight bg-purple-500/10 p-2 rounded border border-purple-500/20 line-clamp-3">
                                        {query.toLowerCase().includes("skills") ? "...Agentic AI Systems, Multi-Agent Architectures, RAG, Prompt Engineering..." : "...OCR pipeline with validation, confidence scoring... hybrid combining Tesseract and Textract..."}
                                    </motion.p>
                                ) : (
                                    <p className="text-xs text-gray-600 font-mono text-center">Top-K Docs<br />Retrieved</p>
                                )}
                            </div>
                        </div>

                        {/* Node 4: LLM */}
                        <div className={`relative z-10 flex flex-col items-center bg-[#050505] p-6 rounded-2xl border transition-all duration-500 ${step >= 4 ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]' : 'border-white/5 opacity-50'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${step >= 4 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-500'}`}>
                                <ScrambleText text="LLM" />
                            </div>
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Generation</h3>
                            <div className="h-16 flex items-center justify-center w-full">
                                {step >= 4 ? (
                                    <div className="w-full flex justify-center">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-600 font-mono text-center">Grounded<br />Synthesis</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Final Output Console */}
                    <AnimatePresence>
                        {step >= 4 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                                className="bg-black border border-emerald-500/30 rounded-xl p-6 font-mono relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                                <span className="text-xs text-emerald-500 uppercase tracking-widest mb-2 block">Agent Synthesis</span>
                                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                                    {generatedText}
                                    {step === 4 && generatedText.length < getGroundedResponse(query).length && <span className="inline-block w-2 h-4 bg-emerald-500 ml-1 animate-pulse" />}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </section>
    );
};

export default RAGSimulator;
