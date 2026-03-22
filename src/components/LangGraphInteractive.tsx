import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Database, Globe, CheckCircle, MessageSquare, Terminal as TerminalIcon, Play } from 'lucide-react';
import useIsMobile from '../hooks/useIsMobile';
import ScrollReveal from './ScrollReveal';
import ScrambleText from './ScrambleText';

type NodeId = 'input' | 'planner' | 'searcher' | 'analyser' | 'reviewer' | 'output';

interface AgentNode {
    id: NodeId;
    label: string;
    icon: any;
    x: number;
    y: number;
    desc: string;
}

const NODES: AgentNode[] = [
    { id: 'input', label: 'User Query', icon: MessageSquare, x: 50, y: 150, desc: "Receives raw complex goal" },
    { id: 'planner', label: 'Planner Agent', icon: Brain, x: 250, y: 150, desc: "Decomposes task into DAG" },
    { id: 'searcher', label: 'Web Researcher', icon: Globe, x: 450, y: 50, desc: "Executes Serper/Tavily tools" },
    { id: 'analyser', label: 'Data Analyser', icon: Database, x: 450, y: 250, desc: "Queries Vector DB (FAISS)" },
    { id: 'reviewer', label: 'Reviewer', icon: CheckCircle, x: 650, y: 150, desc: "Validates against heuristics" },
    { id: 'output', label: 'Final Output', icon: TerminalIcon, x: 850, y: 150, desc: "Streams grounded response" },
];

const EDGES = [
    { from: 'input', to: 'planner' },
    { from: 'planner', to: 'searcher' },
    { from: 'planner', to: 'analyser' },
    { from: 'searcher', to: 'reviewer' },
    { from: 'analyser', to: 'reviewer' },
    { from: 'reviewer', to: 'planner', dash: true, highlight: 'feedback' }, // Self-correction
    { from: 'reviewer', to: 'output' },
];

const LangGraphInteractive = () => {
    const isMobile = useIsMobile();
    const [activeNode, setActiveNode] = useState<NodeId | null>(null);
    const [activeEdges, setActiveEdges] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev.slice(-3), msg]); // Keep last 4 logs
    };

    const runSimulation = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setLogs([]);
        setActiveEdges([]);
        setActiveNode(null);

        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

        // Step 1: Input
        setActiveNode('input');
        addLog("[SYS] Received Query: 'Analyze market competitors'");
        await delay(1000);

        // Step 2: Planner
        setActiveEdges(['input-planner']);
        setActiveNode('planner');
        addLog("[PLANNER] Decomposing task into sub-graphs...");
        await delay(1500);

        // Step 3: Parallel Execution
        setActiveEdges(['input-planner', 'planner-searcher', 'planner-analyser']);
        setActiveNode('searcher');
        addLog("[SEARCHER] Extracting real-time web context...");
        await delay(800);
        setActiveNode('analyser');
        addLog("[ANALYSER] Retrieving internal docs from VectorStore...");
        await delay(1200);

        // Step 4: Reviewer
        setActiveEdges(['input-planner', 'planner-searcher', 'planner-analyser', 'searcher-reviewer', 'analyser-reviewer']);
        setActiveNode('reviewer');
        addLog("[REVIEWER] Evaluating outputs for hallucinations...");
        await delay(1500);

        // Step 5: Self-Correction Loop (Feedback)
        setActiveEdges(['input-planner', 'planner-searcher', 'planner-analyser', 'searcher-reviewer', 'analyser-reviewer', 'reviewer-planner']);
        addLog("[REVIEWER] Missing data detected. Triggering re-plan loop.");
        await delay(1000);
        setActiveNode('planner');
        addLog("[PLANNER] Adjusting execution parameters...");
        await delay(1000);

        // Final Output
        setActiveEdges(['reviewer-output']);
        setActiveNode('output');
        addLog("[OUTPUT] Delivering validated final synthesis.");
        await delay(1500);

        setIsRunning(false);
    };

    // Calculate path for SVG
    const getPath = (fromNode: AgentNode, toNode: AgentNode, offset = 0) => {
        const dx = toNode.x - fromNode.x;

        // Add curve for feedback loop visually
        if (offset) {
            return `M ${fromNode.x + 30} ${fromNode.y - 15} Q ${fromNode.x + dx / 2} ${fromNode.y - offset} ${toNode.x} ${toNode.y - 15}`;
        }

        return `M ${fromNode.x + 30} ${fromNode.y} C ${fromNode.x + dx / 2 + 30} ${fromNode.y}, ${fromNode.x + dx / 2 - 30} ${toNode.y}, ${toNode.x - 30} ${toNode.y}`;
    };

    if (isMobile) {
        return (
            <section className="bg-[#020202] py-20 px-4 border-t border-white/5" id="architecture">
                <div className="mb-12 text-center">
                    <p className="font-mono text-[10px] text-cyan-500 uppercase tracking-[0.5em] mb-4">// System Architecture</p>
                    <h2 className="text-4xl font-display font-black text-white uppercase leading-none">Agentic<br />Orchestration</h2>
                    <p className="text-gray-400 mt-4 text-sm font-mono">LangGraph State Machine</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
                    <div className="space-y-6 relative z-10">
                        {NODES.map((node) => (
                            <div key={node.id} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                                    <node.icon size={16} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold uppercase text-sm tracking-widest">{node.label}</h3>
                                    <p className="text-gray-500 text-xs font-mono">{node.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-[#020202] py-32 relative overflow-hidden flex flex-col items-center justify-center border-t border-white/5" id="architecture">
            {/* Background Noise */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-screen bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <ScrollReveal>
                        <p className="font-mono text-[10px] text-cyan-500 uppercase tracking-[0.5em] mb-4">
                            <ScrambleText text="// System Architecture" />
                        </p>
                        <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-display font-black leading-[0.9] tracking-tighter uppercase text-white mb-6">
                            Agentic<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                                Orchestration
                            </span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto font-mono text-sm leading-relaxed">
                            Moving beyond naive prompt chains. Visualizing a deterministic, stateful multi-agent LangGraph execution featuring parallel tool-use and self-correction loops.
                        </p>
                    </ScrollReveal>
                </div>

                <div className="max-w-5xl mx-auto bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl relative">

                    {/* Console HUD */}
                    <div className="absolute top-6 left-8 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="ml-4 font-mono text-[10px] text-gray-500 tracking-widest uppercase">langgraph.live_trace</span>
                    </div>

                    <div className="absolute top-6 right-8">
                        <button
                            onClick={() => { runSimulation().catch(console.error); }}
                            disabled={isRunning}
                            className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-4 py-2 rounded-full font-mono text-xs uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Play size={14} className={isRunning ? 'animate-pulse' : ''} />
                            {isRunning ? 'Executing...' : 'Run Graph'}
                        </button>
                    </div>

                    {/* The Graph interactive area */}
                    <div className="w-full h-[400px] relative mt-16 overflow-hidden bg-black/50 rounded-2xl border border-white/5 mx-auto" style={{ width: 900 }}>
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <defs>
                                <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                                </linearGradient>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Base inactive edges */}
                            {EDGES.map((edge, i) => {
                                const fromNode = NODES.find(n => n.id === edge.from)!;
                                const toNode = NODES.find(n => n.id === edge.to)!;
                                const isFeedback = edge.dash;
                                return (
                                    <path
                                        key={`base-${i}`}
                                        d={getPath(fromNode, toNode, isFeedback ? 150 : 0)}
                                        fill="none"
                                        stroke="#ffffff"
                                        strokeOpacity="0.1"
                                        strokeWidth="2"
                                        strokeDasharray={isFeedback ? "4 4" : "none"}
                                    />
                                );
                            })}

                            {/* Active Edges overlay */}
                            {EDGES.map((edge, i) => {
                                const fromNode = NODES.find(n => n.id === edge.from)!;
                                const toNode = NODES.find(n => n.id === edge.to)!;
                                const edgeId = `${edge.from}-${edge.to}`;
                                const isActive = activeEdges.includes(edgeId);
                                const isFeedback = edge.dash;

                                return isActive ? (
                                    <motion.path
                                        key={`active-${i}`}
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 0.8, ease: "easeInOut" }}
                                        d={getPath(fromNode, toNode, isFeedback ? 150 : 0)}
                                        fill="none"
                                        stroke="url(#edge-gradient)"
                                        strokeWidth="3"
                                        filter="url(#glow)"
                                        strokeDasharray={isFeedback ? "4 4" : "none"}
                                    />
                                ) : null;
                            })}
                        </svg>

                        {/* Nodes */}
                        {NODES.map((node) => {
                            const isActive = activeNode === node.id;
                            return (
                                <motion.div
                                    key={node.id}
                                    className={`absolute flex flex-col items-center transition-all duration-500 ${isActive ? 'scale-110 z-20' : 'scale-100 z-10 grayscale-[50%] opacity-70'}`}
                                    style={{ left: node.x - 30, top: node.y - 30 }}
                                >
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-colors duration-500 shadow-2xl relative ${isActive ? 'bg-[#0a0a0a] border-cyan-400 text-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.4)]' : 'bg-black border-white/20 text-gray-500'}`}>
                                        <node.icon strokeWidth={isActive ? 2.5 : 1.5} size={28} />
                                        {isActive && (
                                            <span className="absolute -inset-2 border border-cyan-500/50 rounded-3xl animate-ping opacity-20" style={{ animationDuration: '2s' }} />
                                        )}
                                    </div>
                                    <div className="mt-4 text-center absolute top-full w-32 -ml-8 bg-black/80 backdrop-blur-sm p-2 rounded border border-white/5">
                                        <p className={`font-mono text-[10px] uppercase tracking-widest ${isActive ? 'text-white' : 'text-gray-500'}`}>{node.label}</p>
                                        {isActive && <p className="text-[9px] text-cyan-400/80 mt-1 leading-tight">{node.desc}</p>}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Terminal execution log */}
                    <div className="mt-8 bg-black rounded-xl border border-white/10 p-4 h-32 font-mono text-xs overflow-hidden flex flex-col justify-end">
                        <AnimatePresence>
                            {logs.length === 0 && !isRunning && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
                                    &gt; System Idle. Waiting for execution trigger...
                                </motion.p>
                            )}
                            {logs.map((log, i) => (
                                <motion.div
                                    key={`${log}-${i}`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-cyan-400 mb-1 flex items-start gap-2"
                                >
                                    <span className="text-gray-600 mt-0.5">{'>'}</span>
                                    <span>{log}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LangGraphInteractive;
