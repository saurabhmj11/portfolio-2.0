import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Cpu, 
  Search, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Activity,
  Layers,
  ChevronRight,
  Brain,
  Play
} from 'lucide-react';
import { useSound } from '../hooks/useSound';

interface LogEntry {
  type: 'THOUGHT' | 'ACTION' | 'OBSERVATION' | 'SYSTEM';
  message: string;
  timestamp: string;
}

interface AgentMission {
  id: string;
  name: string;
  icon: React.ReactNode;
  steps: {
    type: 'THOUGHT' | 'ACTION' | 'OBSERVATION' | 'SYSTEM';
    msg: string;
    delay: number;
    meta?: { key: string; value: string }[];
  }[];
}

const MISSIONS: AgentMission[] = [
  {
    id: 'architect',
    name: 'System Architect',
    icon: <Layers size={16} />,
    steps: [
      { type: 'SYSTEM', msg: "Initializing Agent: Architect_v4.2", delay: 500 },
      { type: 'THOUGHT', msg: "Analyzing requirements for sub-millisecond latency in multi-agent orchestration...", delay: 1500 },
      { type: 'ACTION', msg: "Querying FAISS vector store for high-frequency trading patterns.", delay: 1000, meta: [{ key: "K_VAL", value: "5" }, { key: "METRIC", value: "Cosine" }] },
      { type: 'OBSERVATION', msg: "Retrieved 3 candidate patterns: Parallel Broadcast, Sequential Chain, and Feedback Loop.", delay: 1200 },
      { type: 'THOUGHT', msg: "Sequential chain found ineffective. Recommending Parallel Broadcast with a dedicated Reviewer Node.", delay: 1500 },
      { type: 'ACTION', msg: "Drafting scalable DAG (Directed Acyclic Graph) architecture.", delay: 1000 },
      { type: 'SYSTEM', msg: "Architecture complete. Confidence score: 0.98", delay: 800 },
    ]
  },
  {
    id: 'security',
    name: 'Security Auditor',
    icon: <ShieldCheck size={16} />,
    steps: [
      { type: 'SYSTEM', msg: "Initializing Security Protocol: SENTRY-X", delay: 500 },
      { type: 'THOUGHT', msg: "Scanning ingress points for potential prompt injection vulnerabilities...", delay: 1500 },
      { type: 'ACTION', msg: "Injecting adversarial test vectors into validation layer.", delay: 1200, meta: [{ key: "VECTORS", value: "124" }, { key: "DEPTH", value: "Deep" }] },
      { type: 'OBSERVATION', msg: "Found 1 edge case in the sanitization pipeline for nested JSON payloads.", delay: 1000 },
      { type: 'THOUGHT', msg: "Mitigation required. Implementing recursive schema validation.", delay: 1200 },
      { type: 'ACTION', msg: "Patching validator.ts with Zod-strict enforcement.", delay: 1500 },
      { type: 'SYSTEM', msg: "Audit complete. Vulnerability patched.", delay: 800 },
    ]
  }
];

const AutonomousAgentHUD = () => {
  const [activeMission, setActiveMission] = useState(MISSIONS[0]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ tokens: 0, latency: 0, confidence: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const { playClick, playSuccess } = useSound();

  // Scroll to bottom of logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const runMission = async (mission: AgentMission) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setLogs([]);
    setProgress(0);
    setStats({ tokens: 0, latency: 0, confidence: 0 });

    for (let i = 0; i < mission.steps.length; i++) {
        const step = mission.steps[i];
        
        // Update stats randomly for "realism"
        setStats(prev => ({
            tokens: prev.tokens + Math.floor(Math.random() * 50 + 20),
            latency: Math.floor(Math.random() * 300 + 100),
            confidence: Math.min(0.99, prev.confidence + (Math.random() * 0.1) * (i/mission.steps.length) + 0.1)
        }));

        setProgress(((i + 1) / mission.steps.length) * 100);

        const newLog: LogEntry = {
            type: step.type,
            message: step.msg,
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };

        setLogs(prev => [...prev, newLog]);
        playClick(); // Play sound effect
        await new Promise(r => setTimeout(r, step.delay));
    }

    playSuccess();
    setIsProcessing(false);
  };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'THOUGHT': return 'text-purple-400';
      case 'ACTION': return 'text-blue-400';
      case 'OBSERVATION': return 'text-amber-400';
      case 'SYSTEM': return 'text-emerald-400';
      default: return 'text-gray-400';
    }
  };

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'THOUGHT': return <Brain size={12} />;
      case 'ACTION': return <ChevronRight size={12} />;
      case 'OBSERVATION': return <Search size={12} />;
      case 'SYSTEM': return <Terminal size={12} />;
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto my-20 p-6">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main HUD Container */}
      <div className="relative bg-[#050505]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[600px]">
        
        {/* Left Sidebar: Controls & Stats */}
        <div className="w-full md:w-80 border-r border-white/5 p-6 flex flex-col gap-8 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <Activity className="text-blue-400 animate-pulse" size={20} />
            </div>
            <div>
              <h3 className="text-white font-display font-bold text-lg leading-none">Agent HUD</h3>
              <p className="text-gray-500 font-mono text-[10px] mt-1 uppercase tracking-widest">v2.0 // Active Monitor</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest px-1">Select Persona</p>
            {MISSIONS.map(m => (
              <button
                key={m.id}
                onClick={() => { setActiveMission(m); runMission(m); }}
                disabled={isProcessing}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  activeMission.id === m.id 
                    ? 'bg-white/5 border-white/20 text-white shadow-lg' 
                    : 'border-transparent text-gray-500 hover:bg-white/[0.03] hover:text-gray-300'
                } disabled:opacity-50`}
              >
                {m.icon}
                <span className="text-sm font-medium">{m.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-auto space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Process Data</span>
                <span className="text-xs font-mono text-blue-400">{Math.round(progress)}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Cpu size={12} className="text-gray-500" />
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Throughput</span>
                </div>
                <p className="text-sm font-mono text-white">{stats.tokens} tokens/s</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={12} className="text-gray-500" />
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Latency</span>
                </div>
                <p className="text-sm font-mono text-white">{stats.latency}ms</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 size={12} className="text-gray-500" />
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Confidence</span>
                </div>
                <p className="text-sm font-mono text-white">{Math.round(stats.confidence * 100)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Terminal Output */}
        <div className="flex-grow flex flex-col min-w-0">
          <div className="h-12 border-b border-white/5 px-6 flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Session_Live: {activeMission.id.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest hidden md:block">0x_GROUNDED_REASONING</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-emerald-500/50" />
                <div className="w-1 h-1 rounded-full bg-emerald-500/50 animate-pulse" />
              </div>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-grow p-6 overflow-y-auto custom-scrollbar font-mono text-sm space-y-4"
          >
            {logs.length === 0 && !isProcessing && (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <Terminal size={48} className="mb-4" />
                <p className="uppercase tracking-[0.3em] text-xs">Waiting for command...</p>
              </div>
            )}
            
            <AnimatePresence>
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-4 group"
                >
                  <div className="flex flex-col items-center pt-1.5 opacity-40">
                    <div className="text-[10px] tabular-nums mb-1">{log.timestamp}</div>
                    <div className="w-px h-full bg-white/10" />
                  </div>
                  
                  <div className="flex-grow">
                    <div className={`flex items-center gap-2 mb-1.5 font-bold text-[10px] tracking-[0.2em] ${getLogColor(log.type)}`}>
                      {getLogIcon(log.type)}
                      {log.type}
                    </div>
                    <div className="text-gray-300 leading-relaxed max-w-2xl text-xs md:text-sm">
                      {log.message}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isProcessing && (
              <div className="flex gap-4">
                <div className="w-12" />
                <div className="flex items-center gap-2 text-blue-400">
                  <div className="w-1 h-4 bg-blue-500 animate-pulse" />
                  <p className="text-[10px] font-bold tracking-widest animate-pulse uppercase">Agent is thinking...</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-white/5 bg-white/[0.01]">
            <button 
              onClick={() => runMission(activeMission)}
              disabled={isProcessing}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isProcessing ? <Brain className="animate-spin" size={18} /> : <Play size={18} />}
              <span className="uppercase tracking-widest text-xs">Execute Agent Cycle</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutonomousAgentHUD;
