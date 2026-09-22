import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Server, Database, Code, Shield, Network, Zap, Cpu, Globe, BrainCircuit } from 'lucide-react';

export interface TopologyNode {
    id: string;
    label: string;
    icon: string;
    x: number; // 0 to 100 percentage
    y: number; // 0 to 100 percentage
}

export interface TopologyEdge {
    from: string;
    to: string;
    label?: string;
    animated?: boolean;
}

export interface TopologyData {
    nodes: TopologyNode[];
    edges: TopologyEdge[];
}

interface AnimatedTopologyProps {
    data: TopologyData;
}

const iconMap: Record<string, React.ElementType> = {
    server: Server,
    database: Database,
    code: Code,
    shield: Shield,
    network: Network,
    zap: Zap,
    cpu: Cpu,
    globe: Globe,
    brain: BrainCircuit,
};

const AnimatedTopology: React.FC<AnimatedTopologyProps> = ({ data }) => {
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const getConnectedNodes = (nodeId: string) => {
        const connected = new Set<string>();
        connected.add(nodeId);
        data.edges.forEach((edge) => {
            if (edge.from === nodeId) connected.add(edge.to);
            if (edge.to === nodeId) connected.add(edge.from);
        });
        return connected;
    };

    const connectedNodes = hoveredNode ? getConnectedNodes(hoveredNode) : null;

    return (
        <div className="relative w-full h-[450px] bg-[#09090b]/80 rounded-3xl border border-white/5 overflow-hidden shadow-2xl shadow-cyan-900/10 backdrop-blur-md font-mono mt-8">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] opacity-50" />

            {/* SVG Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(34, 211, 238, 0.2)" />
                        <stop offset="100%" stopColor="rgba(34, 211, 238, 0.8)" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                {data.edges.map((edge, i) => {
                    const fromNode = data.nodes.find((n) => n.id === edge.from);
                    const toNode = data.nodes.find((n) => n.id === edge.to);
                    if (!fromNode || !toNode) return null;

                    const isHighlighted =
                        !hoveredNode ||
                        (connectedNodes && connectedNodes.has(edge.from) && connectedNodes.has(edge.to));

                    // Use percentages in SVG for responsiveness
                    const x1 = `${fromNode.x}%`;
                    const y1 = `${fromNode.y}%`;
                    const x2 = `${toNode.x}%`;
                    const y2 = `${toNode.y}%`;

                    return (
                        <g key={`edge-${i}`}>
                            <motion.line
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="url(#edge-gradient)"
                                strokeWidth="2"
                                opacity={isHighlighted ? 0.6 : 0.1}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: isHighlighted ? 0.6 : 0.1 }}
                                transition={{ duration: 1.5, ease: 'easeInOut' }}
                            />
                            {/* In standard SVG, offsetPath using percentages is not widely supported across browsers.
                                We'll skip the offsetPath animation for this MVP and just use the glowing line. */}
                        </g>
                    );
                })}
            </svg>

            {/* Nodes */}
            {data.nodes.map((node) => {
                const Icon = iconMap[node.icon] || Cpu;
                const isHighlighted = !hoveredNode || (connectedNodes && connectedNodes.has(node.id));

                return (
                    <motion.div
                        key={node.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer"
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: isHighlighted ? 1 : 0.8,
                            opacity: isHighlighted ? 1 : 0.3,
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        whileHover={{ scale: 1.1 }}
                    >
                        <div className="w-14 h-14 bg-black/60 rounded-2xl border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)] backdrop-blur-xl relative group">
                            <div className="absolute inset-0 rounded-2xl bg-cyan-400/10 blur-md group-hover:bg-cyan-400/30 transition-colors" />
                            <Icon className="w-6 h-6 text-cyan-400 relative z-10" />
                        </div>
                        <div className="mt-3 text-[10px] sm:text-xs text-cyan-100 font-semibold uppercase tracking-wider text-center max-w-[120px] leading-tight px-2 py-1 bg-black/50 rounded-lg backdrop-blur-sm border border-white/5">
                            {node.label}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default AnimatedTopology;
