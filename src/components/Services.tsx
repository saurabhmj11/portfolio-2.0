import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Code, Cpu, Globe, Rocket, Zap } from 'lucide-react';

// ─── Generative Backgrounds ────────────────────────────────────────────────

// Neural node network (for AI Strategy)
const NeuralBg = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const W = canvas.offsetWidth; const H = canvas.offsetHeight;
        canvas.width = W; canvas.height = H;
        const nodes = Array.from({ length: 18 }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
            r: 2 + Math.random() * 2,
        }));
        let raf: number;
        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            nodes.forEach(n => {
                n.x += n.vx; n.y += n.vy;
                if (n.x < 0 || n.x > W) n.vx *= -1;
                if (n.y < 0 || n.y > H) n.vy *= -1;
            });
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x; const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255,255,255,${0.12 * (1 - dist / 130)})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
                ctx.beginPath();
                ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.25)';
                ctx.fill();
            }
            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(raf);
    }, []);
    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

// Code rain (for LLM Agents)
const CodeRainBg = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const W = canvas.offsetWidth; const H = canvas.offsetHeight;
        canvas.width = W; canvas.height = H;
        const FONT_SIZE = 11;
        const cols = Math.floor(W / FONT_SIZE);
        const drops: number[] = Array(cols).fill(1);
        const chars = '01アイウエオ∑∆Ω∇λ{}>;</>⟩';
        let raf: number;
        const draw = () => {
            ctx.fillStyle = 'rgba(0,0,0,0.06)';
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = 'rgba(255,255,255,0.15)';
            ctx.font = `${FONT_SIZE}px monospace`;
            drops.forEach((y, i) => {
                const char = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(char, i * FONT_SIZE, y * FONT_SIZE);
                if (y * FONT_SIZE > H && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            });
            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(raf);
    }, []);
    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" />;
};

// Waveform (for RAG Systems)
const WaveformBg = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const W = canvas.offsetWidth; const H = canvas.offsetHeight;
        canvas.width = W; canvas.height = H;
        let t = 0;
        let raf: number;
        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            for (let layer = 0; layer < 3; layer++) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255,255,255,${0.07 - layer * 0.02})`;
                ctx.lineWidth = 1.5 - layer * 0.4;
                for (let x = 0; x <= W; x += 2) {
                    const freq = 0.012 + layer * 0.005;
                    const amp = (H / 6) - layer * 8;
                    const y = H / 2 + Math.sin(x * freq + t + layer * 1.2) * amp
                        + Math.sin(x * freq * 2.3 + t * 0.8) * (amp * 0.35);
                    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
            t += 0.018;
            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(raf);
    }, []);
    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

// Orbiting rings (for Full-Stack)
const OrbitBg = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const W = canvas.offsetWidth; const H = canvas.offsetHeight;
        canvas.width = W; canvas.height = H;
        const cx = W / 2, cy = H / 2;
        const rings = [
            { r: 60, speed: 0.003, dotAngle: 0, dotR: 4, opacity: 0.15 },
            { r: 100, speed: -0.002, dotAngle: Math.PI / 3, dotR: 3, opacity: 0.1 },
            { r: 145, speed: 0.0015, dotAngle: Math.PI, dotR: 2.5, opacity: 0.07 },
        ];
        let raf: number;
        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            rings.forEach(ring => {
                ring.dotAngle += ring.speed;
                ctx.beginPath();
                ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255,255,255,${ring.opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
                const dx = cx + Math.cos(ring.dotAngle) * ring.r;
                const dy = cy + Math.sin(ring.dotAngle) * ring.r;
                ctx.beginPath();
                ctx.arc(dx, dy, ring.dotR, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,0.6)`;
                ctx.fill();
            });
            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(raf);
    }, []);
    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

// Rising particles (for MVP)
const ParticleBg = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const W = canvas.offsetWidth; const H = canvas.offsetHeight;
        canvas.width = W; canvas.height = H;
        const particles = Array.from({ length: 40 }, () => ({
            x: Math.random() * W, y: H + Math.random() * H,
            size: 1 + Math.random() * 2, speed: 0.3 + Math.random() * 0.7, opacity: Math.random() * 0.3,
        }));
        let raf: number;
        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => {
                p.y -= p.speed;
                if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
                ctx.fill();
            });
            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(raf);
    }, []);
    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

// Zap lightning (for Perf Optimization)
const ZapBg = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const W = canvas.offsetWidth; const H = canvas.offsetHeight;
        canvas.width = W; canvas.height = H;
        let t = 0;
        let raf: number;
        const drawBolt = (x1: number, y1: number, x2: number, y2: number, roughness: number, depth: number) => {
            if (depth <= 0) { ctx.lineTo(x2, y2); return; }
            const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * roughness;
            const my = (y1 + y2) / 2 + (Math.random() - 0.5) * roughness;
            drawBolt(x1, y1, mx, my, roughness * 0.55, depth - 1);
            drawBolt(mx, my, x2, y2, roughness * 0.55, depth - 1);
        };
        const draw = () => {
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect(0, 0, W, H);
            if (t % 15 === 0) {
                ctx.beginPath();
                ctx.moveTo(W / 2 + (Math.random() - 0.5) * 60, 0);
                drawBolt(W / 2, 0, W / 2 + (Math.random() - 0.5) * 40, H, 80, 6);
                ctx.strokeStyle = 'rgba(255,255,255,0.18)';
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
            t++;
            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(raf);
    }, []);
    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

// ─── Capability Card ────────────────────────────────────────────────────────

const BG_COMPONENTS = [NeuralBg, CodeRainBg, WaveformBg, OrbitBg, ParticleBg, ZapBg];

const services = [
    { icon: Brain, title: 'AI Strategy & Consulting', description: 'Translating complex AI capabilities into actionable business ROI. I help startups and enterprises identify high-impact AI use cases, define architecture, and build the roadmap to get there.', tags: ['Roadmapping', 'Feasibility', 'Architecture'], num: '01', span: 'md:col-span-2 md:row-span-2' },
    { icon: Code, title: 'Custom LLM Agents', description: 'Building autonomous agents that plan, execute, and reason. From customer support to complex multi-agent workflows with memory, tools, and structured outputs.', tags: ['LangChain', 'AutoGPT', 'OpenAI API'], num: '02', span: 'md:col-span-1 md:row-span-1' },
    { icon: Cpu, title: 'RAG Systems', description: 'Production-ready Retrieval Augmented Generation. Chat with your data securely, accurately, and at scale using hybrid search and intelligent re-ranking.', tags: ['Vector DBs', 'Embeddings', 'Semantic Search'], num: '03', span: 'md:col-span-1 md:row-span-1' },
    { icon: Globe, title: 'Full-Stack AI Apps', description: 'End-to-end development of AI-native applications with real-time streaming, robust error handling, and seamless model integration into modern interfaces.', tags: ['React', 'Node.js', 'FastAPI'], num: '04', span: 'md:col-span-1 md:row-span-2' },
    { icon: Rocket, title: 'MVP Acceleration', description: 'Rapid prototyping to get your AI idea to market in weeks. Production-grade foundations from day one with tight feedback loops.', tags: ['Rapid Dev', 'Prototype', 'Launch'], num: '05', span: 'md:col-span-1 md:row-span-1' },
    { icon: Zap, title: 'Performance Optimization', description: 'Fine-tuning models and optimizing inference latency. Fast, cost-effective, and scalable — from prompt engineering to quantized deployment.', tags: ['Fine-tuning', 'Latency', 'Cost Ops'], num: '06', span: 'md:col-span-1 md:row-span-1' },
];

const CapabilityCard = ({ service, bgIndex }: { service: typeof services[0]; bgIndex: number }) => {
    const [hovered, setHovered] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-50px' });
    const Icon = service.icon;
    const BgComponent = BG_COMPONENTS[bgIndex];
    const isLarge = service.span.includes('row-span-2') && service.span.includes('col-span-2');

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: bgIndex * 0.07, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`relative overflow-hidden border border-white/10 bg-[#080808] ${service.span} min-h-[220px] md:min-h-[240px] group cursor-default`}
            style={{ borderRadius: '1.5rem' }}
        >
            {/* Generative Background */}
            <div className="absolute inset-0 z-0">
                <BgComponent />
            </div>

            {/* Dark vignette overlay */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

            {/* Number + Icon header */}
            <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
                <span className="text-[10px] font-mono text-white/30 tracking-widest">{service.num}</span>
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-white/50" strokeWidth={1.5} />
                </div>
            </div>

            {/* Ghost big title behind */}
            <div className="absolute bottom-0 left-0 right-0 z-[2] px-6 pb-6 pointer-events-none">
                <motion.h3
                    animate={{ y: hovered ? -50 : 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className={`font-display font-black leading-[0.85] tracking-tighter uppercase text-white ${isLarge ? 'text-5xl md:text-6xl' : 'text-3xl md:text-4xl'}`}
                >
                    {service.title}
                </motion.h3>
            </div>

            {/* Hover reveal panel */}
            <motion.div
                initial={false}
                animate={{ y: hovered ? 0 : '101%' }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-0 left-0 right-0 z-[5] bg-black/80 backdrop-blur-md border-t border-white/10 p-4 md:p-6"
            >
                <p className="text-white/60 text-xs md:text-sm leading-relaxed font-light mb-3">{service.description}</p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {service.tags.map(tag => (
                        <span key={tag} className="text-[8px] md:text-[9px] font-mono text-white/50 border border-white/15 px-2 py-0.5 md:px-2.5 md:py-1 uppercase tracking-widest">
                            {tag}
                        </span>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── Section ────────────────────────────────────────────────────────────────

const Services = () => {
    const headerRef = useRef<HTMLDivElement>(null);
    const inView = useInView(headerRef, { once: true });

    const title = "CAPABILITIES";
    const letters = Array.from(title);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const letterVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
    };

    return (
        <section id="services" className="bg-[#030303] text-white relative overflow-hidden">

            {/* Subtle ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-white/[0.02] blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

                {/* Header */}
                <div ref={headerRef} className="pt-28 pb-16">
                    <motion.p
                        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.5 }}
                        className="font-mono text-xs text-white/25 uppercase tracking-[0.4em] mb-6"
                    >
                        // My Expertise
                    </motion.p>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                        <motion.h2
                            variants={containerVariants}
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            className="text-[14vw] md:text-[7vw] font-display font-black leading-[0.85] tracking-tighter uppercase"
                        >
                            {letters.map((char, index) => (
                                <motion.span key={index} variants={letterVariants} className="inline-block">
                                    {char}
                                </motion.span>
                            ))}
                        </motion.h2>
                    </div>

                    <div className="flex items-center mt-8 md:mt-12">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={inView ? { width: '100%' } : {}}
                            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="h-px bg-white/10 flex-grow"
                        />
                        <motion.p
                            initial={{ opacity: 0, x: 50 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.7, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            className="text-white/40 text-lg md:text-xl leading-relaxed font-light pl-8 max-w-xl"
                        >
                            I bridge the gap between{' '}
                            <em className="text-white not-italic font-semibold">bleeding-edge AI research</em>{' '}
                            and robust, scalable production systems.
                        </motion.p>
                    </div>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[300px] gap-4 pb-28">
                    {services.map((service, i) => (
                        <CapabilityCard key={service.num} service={service} bgIndex={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
