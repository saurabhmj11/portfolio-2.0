import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Server, Database, Code, Shield, Network, Zap, Cpu, Globe, BrainCircuit } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

import type { TopologyData, TopologyNode } from '../data/topology';
export type { TopologyData, TopologyNode, TopologyEdge } from '../data/topology';

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

const DIAGRAM_HEIGHT = 420;

/**
 * Data-driven system diagram.
 * - Edges draw themselves as you scroll (GSAP ScrollTrigger scrub on stroke-dashoffset).
 * - Nodes are focusable buttons; hover or focus highlights their direct connections.
 * - Under 640px the diagram becomes a readable list of connections.
 * - prefers-reduced-motion: the finished diagram, no scroll animation.
 */
const AnimatedTopology: React.FC<AnimatedTopologyProps> = ({ data }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const diagramRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [active, setActive] = useState<string | null>(null);

    const byId = useMemo(() => new Map(data.nodes.map(n => [n.id, n])), [data.nodes]);
    const neighbours = useMemo(() => {
        const m = new Map<string, Set<string>>();
        data.nodes.forEach(n => m.set(n.id, new Set([n.id])));
        data.edges.forEach(e => {
            m.get(e.from)?.add(e.to);
            m.get(e.to)?.add(e.from);
        });
        return m;
    }, [data]);

    // Edges are drawn in pixel space so stroke widths and dash lengths are true
    // (a stretched 0–100 viewBox distorts them, and gradient strokes vanish on
    // perfectly horizontal lines).
    useLayoutEffect(() => {
        const el = diagramRef.current;
        if (!el) return;
        const update = () => setWidth(el.clientWidth);
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    useGSAP(() => {
        if (!width) return;
        const mm = gsap.matchMedia();
        mm.add('(prefers-reduced-motion: no-preference) and (min-width: 640px)', () => {
            const tl = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                    trigger: diagramRef.current,
                    start: 'top 80%',
                    end: 'center 45%',
                    scrub: 0.6,
                },
            });
            // Only the decorative visual animates (opacity/scale); the button itself stays
            // visible and focusable even while the diagram is "undrawn".
            tl.from('.topo-node-visual', { opacity: 0, scale: 0.6, stagger: 0.08, duration: 0.4 })
              .fromTo('.topo-edge', { strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.08, duration: 0.6 }, 0.15)
              .from('.topo-edge-label', { opacity: 0, stagger: 0.05, duration: 0.3 }, '>-0.2');
        });
        return () => mm.revert();
    }, { scope: containerRef, dependencies: [width > 0, data], revertOnUpdate: true });

    const isLit = (id: string) => !active || neighbours.get(active)?.has(id);
    const edgeLit = (from: string, to: string) => !active || (active === from || active === to);
    const px = (n: TopologyNode) => ({ x: (n.x / 100) * width, y: (n.y / 100) * DIAGRAM_HEIGHT });

    const describe = (id: string) => {
        const n = byId.get(id);
        const links = [...(neighbours.get(id) ?? [])].filter(x => x !== id).map(x => byId.get(x)?.label).filter(Boolean);
        return `${n?.label}${links.length ? `, connects to ${links.join(', ')}` : ''}`;
    };

    return (
        <div ref={containerRef}>
            {/* ── Diagram (≥640px) ── */}
            <div
                ref={diagramRef}
                role="group"
                aria-label="System architecture diagram"
                className="relative w-full hidden sm:block bg-[#09090b]/80 rounded-3xl border border-white/5 overflow-hidden font-mono"
                style={{ height: DIAGRAM_HEIGHT }}
            >
                <div
                    className="absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"
                    style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                    aria-hidden="true"
                />

                {width > 0 && (
                    <svg className="absolute inset-0 pointer-events-none" width={width} height={DIAGRAM_HEIGHT} aria-hidden="true">
                        {data.edges.map((edge, i) => {
                            const a = byId.get(edge.from);
                            const b = byId.get(edge.to);
                            if (!a || !b) return null;
                            const p1 = px(a);
                            const p2 = px(b);
                            const lit = edgeLit(edge.from, edge.to);
                            return (
                                <g key={`${edge.from}-${edge.to}-${i}`} style={{ opacity: lit ? 1 : 0.15, transition: 'opacity 250ms' }}>
                                    <line
                                        className="topo-edge"
                                        x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                                        stroke="rgb(34,211,238)"
                                        strokeOpacity={0.6}
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        pathLength={1}
                                        strokeDasharray={1}
                                    />
                                    {edge.label && (
                                        <text
                                            className="topo-edge-label"
                                            x={(p1.x + p2.x) / 2}
                                            y={(p1.y + p2.y) / 2 - 8}
                                            textAnchor="middle"
                                            fill="rgba(165,243,252,0.75)"
                                            fontSize={10}
                                            letterSpacing="0.05em"
                                        >
                                            {edge.label}
                                        </text>
                                    )}
                                </g>
                            );
                        })}
                    </svg>
                )}

                {data.nodes.map(node => {
                    const Icon = iconMap[node.icon] || Cpu;
                    const lit = isLit(node.id);
                    return (
                        // Outer wrapper owns positioning; GSAP animates only the inner element,
                        // so its transforms never fight the centring translate.
                        <div
                            key={node.id}
                            className="absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
                            style={{ left: `${node.x}%`, top: `${node.y}%`, opacity: lit ? 1 : 0.3 }}
                        >
                            <button
                                type="button"
                                aria-label={describe(node.id)}
                                onMouseEnter={() => setActive(node.id)}
                                onMouseLeave={() => setActive(null)}
                                onFocus={() => setActive(node.id)}
                                onBlur={() => setActive(null)}
                                className="flex flex-col items-center rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
                            >
                                <span className="topo-node-visual flex flex-col items-center">
                                <span className="w-14 h-14 bg-black/70 rounded-2xl border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                                    <Icon className="w-6 h-6 text-cyan-400" aria-hidden="true" />
                                </span>
                                <span className="mt-3 text-[11px] text-cyan-100 font-semibold uppercase tracking-wider text-center max-w-[130px] leading-tight px-2 py-1 bg-black/60 rounded-lg border border-white/5">
                                    {node.label}
                                </span>
                                </span>
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* ── Connection list (<640px) ── */}
            <ol className="sm:hidden space-y-3 font-mono" aria-label="System architecture">
                {data.nodes.map(node => {
                    const Icon = iconMap[node.icon] || Cpu;
                    const outgoing = data.edges.filter(e => e.from === node.id);
                    return (
                        <li key={node.id} className="flex gap-3 p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
                            <span className="w-10 h-10 shrink-0 rounded-xl border border-cyan-500/30 flex items-center justify-center">
                                <Icon className="w-5 h-5 text-cyan-400" aria-hidden="true" />
                            </span>
                            <span className="min-w-0">
                                <span className="block text-sm text-white">{node.label}</span>
                                {outgoing.map((e, i) => (
                                    <span key={i} className="block text-xs text-gray-400 mt-1">
                                        → {byId.get(e.to)?.label}{e.label ? ` · ${e.label}` : ''}
                                    </span>
                                ))}
                            </span>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

export default AnimatedTopology;
