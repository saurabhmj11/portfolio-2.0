import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, animate } from 'framer-motion';

// ─── Data ──────────────────────────────────────────────────────────────────────
const ROLES = [
  {
    pid: '003',
    live: true,
    period: '2024 → NOW',
    start: new Date('2024-01-01'),
    title: 'Gen AI / LLM Engineer',
    company: 'OneOfficeAutomation',
    desc: 'Architecting autonomous agents and production RAG pipelines for enterprise-scale intelligent workflows and decision systems.',
    accent: '#60a5fa',
    stack: ['LangGraph', 'FastAPI', 'OpenAI', 'Python', 'Supabase'],
    flags: '--agents=12+  --ctx=128k  --uptime=99.7%',
    metrics: [
      { key: 'agents_spawned', val: 12,   display: '12+',   unit: '' },
      { key: 'context_window', val: 128,  display: '128k',  unit: '' },
      { key: 'system_uptime',  val: 99.7, display: '99.7%', unit: '%' },
    ],
    diagram: [
      'USER ──→ [PLANNER] ──→ [TOOL_CALL]',
      '           ↑                ↓      ',
      '        [MEMORY] ←── [EXECUTOR]   ',
      '                         ↓        ',
      '                     OUTPUT ✓     ',
    ],
    path: '~/career/03-llm-engineer',
  },
  {
    pid: '002',
    live: false,
    period: '2023 → 2024',
    start: new Date('2023-06-01'),
    title: 'ML Engineer',
    company: 'Applied Projects',
    desc: 'Hardened vision transformers and recommendation engines for high-throughput, real-world production data streams.',
    accent: '#a78bfa',
    stack: ['TensorFlow', 'PyTorch', 'AWS', 'PostgreSQL', 'Scikit-Learn'],
    flags: '--accuracy=94%  --f1=0.91  --gpu=4x',
    metrics: [
      { key: 'model_accuracy', val: 94,   display: '94%',  unit: '%' },
      { key: 'f1_score',       val: 91,   display: '0.91', unit: '%' },
      { key: 'gpu_scale',      val: 80,   display: '4×',   unit: '%' },
    ],
    diagram: [
      ' INPUT   HIDDEN   OUTPUT ',
      '  [○]─────[●]─────[○]   ',
      '  [○]─────[●]─────[○]   ',
      '  [○]─────[●]─────[○]   ',
      '           ↓ ∇loss       ',
    ],
    path: '~/career/02-ml-engineer',
  },
  {
    pid: '001',
    live: false,
    period: '2022 → 2023',
    start: new Date('2022-06-01'),
    title: 'Data & AI Intern',
    company: 'Pantech Solutions',
    desc: 'Built semantic retrieval engines and early vector search systems from raw data ingestion pipelines.',
    accent: '#22d3ee',
    stack: ['Pandas', 'Pinecone', 'HuggingFace', 'Docker', 'Python'],
    flags: '--recall=94%  --dims=768  --pipelines=6x',
    metrics: [
      { key: 'recall@10',    val: 94,  display: '94%',  unit: '%' },
      { key: 'vector_dims',  val: 76,  display: '768',  unit: '%' },
      { key: 'pipelines',    val: 60,  display: '6×',   unit: '%' },
    ],
    diagram: [
      ' RAW_DATA → [PARSE] → [CHUNK]  ',
      '    ↓           ↓        ↓     ',
      ' [CLEAN] → [EMBED] → [INDEX]  ',
      '                      ↓       ',
      '             sim(q,k): 0.847 ✓',
    ],
    path: '~/career/01-data-ingestion',
  },
];

// ─── Live Uptime ───────────────────────────────────────────────────────────────
const Uptime = ({ start, accent }: { start: Date; accent: string }) => {
  const [t, setT] = useState('');
  useEffect(() => {
    const tick = () => {
      const d = Math.floor((Date.now() - start.getTime()) / 86400000);
      const h = Math.floor((Date.now() - start.getTime()) / 3600000) % 24;
      setT(`${d}d ${h}h`);
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [start]);
  return (
    <span className="font-mono text-[9px]" style={{ color: accent }}>
      uptime: {t}
    </span>
  );
};

// Helper to interpolate display values nicely
const interpolateDisplay = (progress: number, display: string) => {
  if (display.endsWith('+')) {
    const num = parseFloat(display);
    return `${Math.round(progress * num)}+`;
  }
  if (display.endsWith('k')) {
    const num = parseFloat(display);
    return `${Math.round(progress * num)}k`;
  }
  if (display.endsWith('%')) {
    const num = parseFloat(display);
    const val = progress * num;
    const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1);
    return `${formatted}%`;
  }
  if (display.endsWith('×') || display.endsWith('x')) {
    const num = parseFloat(display);
    return `${Math.round(progress * num)}×`;
  }
  if (display.startsWith('0.')) {
    const num = parseFloat(display);
    return (progress * num).toFixed(2);
  }
  const parsed = parseFloat(display);
  if (!isNaN(parsed)) {
    return Math.round(progress * parsed).toString();
  }
  return display;
};

// ─── Animated Metric Bar ───────────────────────────────────────────────────────
const MetricBar = ({ metric, accent, active, cardHovered }: {
  metric: typeof ROLES[0]['metrics'][0];
  accent: string;
  active: boolean;
  cardHovered: boolean;
}) => {
  const [displayStr, setDisplayStr] = useState('0');

  useEffect(() => {
    let animControls: any;
    if (cardHovered) {
      animControls = animate(0, 1, {
        duration: 1.5,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (latest) => {
          setDisplayStr(interpolateDisplay(latest, metric.display));
        }
      });
    } else {
      setDisplayStr(metric.display);
    }
    return () => {
      if (animControls) animControls.stop();
    };
  }, [cardHovered, metric.display]);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="font-mono text-[9px] text-white/30 tracking-widest">{metric.key}</span>
        <span className="font-mono text-[10px] font-bold" style={{ color: accent }}>{displayStr}</span>
      </div>
      <div className="h-[2.5px] w-full bg-white/[0.06] relative overflow-hidden rounded-full">
        <motion.div
          key={cardHovered ? 'hovered' : 'normal'}
          initial={{ width: '0%' }}
          animate={{ width: `${metric.val}%` }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${accent}60, ${accent})` }}
        />
      </div>
    </div>
  );
};

// ─── ASCII Diagram ─────────────────────────────────────────────────────────────
const AsciiDiagram = ({ lines, accent, active }: { lines: string[]; accent: string; active: boolean }) => (
  <div
    className="rounded-lg p-4 font-mono text-[10px] md:text-xs leading-relaxed whitespace-pre select-none"
    style={{
      background: `${accent}06`,
      border: `1px solid ${accent}15`,
      color: `${accent}99`,
      textShadow: active ? `0 0 8px ${accent}60` : 'none',
      transition: 'text-shadow 0.5s ease',
    }}
  >
    {lines.map((l, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -8 }}
        animate={active ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
      >
        {l}
      </motion.div>
    ))}
  </div>
);

// ─── Process Card ──────────────────────────────────────────────────────────────
const ProcessCard = ({ role, index }: { role: typeof ROLES[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-6%' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-xl overflow-hidden cursor-default"
      style={{
        border: `1px solid ${hovered ? role.accent + '50' : isInView ? role.accent + '25' : 'rgba(255,255,255,0.06)'}`,
        background: hovered ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.02)',
        transition: 'border-color 0.4s, background-color 0.4s',
      }}
    >
      {/* Terminal title bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{ borderColor: `${role.accent}15`, background: `${role.accent}06` }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: role.accent, boxShadow: `0 0 6px ${role.accent}` }} />
          <span className="font-mono text-[9px] text-white/30 tracking-widest">{role.path}</span>
        </div>
        <div className="flex items-center gap-3">
          {role.live
            ? <Uptime start={role.start} accent={role.accent} />
            : <span className="font-mono text-[9px] text-white/20">{role.period}</span>
          }
          <span
            className="font-mono text-[8px] font-bold px-2 py-0.5 rounded tracking-widest uppercase"
            style={{
              color: role.live ? '#4ade80' : 'rgba(255,255,255,0.2)',
              background: role.live ? '#4ade8012' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${role.live ? '#4ade8030' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            {role.live ? '■ RUNNING' : '✓ COMPLETED'}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-8 md:gap-12">

        {/* Left: Identity */}
        <div className="space-y-5">
          <div>
            <div className="flex items-baseline gap-3 mb-1">
              <span className="font-mono text-[10px] font-black tracking-widest" style={{ color: `${role.accent}70` }}>
                PID:{role.pid}
              </span>
              <span className="font-mono text-[8px] text-white/15 tracking-widest">{role.period}</span>
            </div>
            <h3
              className="font-display font-black uppercase tracking-tight leading-[0.9] text-white"
              style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)' }}
            >
              {role.title}
            </h3>
            <p className="font-mono text-xs tracking-widest uppercase mt-1.5" style={{ color: role.accent }}>
              @ {role.company}
            </p>
          </div>

          <p className="text-white/40 text-sm leading-relaxed">{role.desc}</p>

          {/* CLI flags */}
          <div
            className="rounded-lg px-3 py-2 font-mono text-[9px] leading-relaxed"
            style={{ background: '#ffffff05', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <span className="text-white/15">$ run </span>
            <span style={{ color: role.accent + 'aa' }}>{role.flags}</span>
            {role.live && (
              <span className="text-white/20 animate-pulse ml-1">█</span>
            )}
          </div>

          {/* Stack */}
          <div className="flex flex-wrap gap-1.5">
            {role.stack.map(t => (
              <span
                key={t}
                className="px-2.5 py-1 font-mono text-[8px] uppercase tracking-widest rounded-md border"
                style={{ color: `${role.accent}99`, borderColor: `${role.accent}20`, background: `${role.accent}08` }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Metrics + diagram */}
        <div className="space-y-6">
          <AsciiDiagram lines={role.diagram} accent={role.accent} active={isInView} />
          <div className="space-y-3.5">
            {role.metrics.map(m => (
              <MetricBar key={m.key} metric={m} accent={role.accent} active={isInView} cardHovered={hovered} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ScrambleTextOnHover = ({ text, hovered }: { text: string; hovered: boolean }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = '01#$X%@&?_+=~';

  useEffect(() => {
    if (hovered) {
      let ticks = 0;
      const interval = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, index) => {
              if (char === ' ' || char === '.') return char;
              if (index < ticks) return text[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );
        ticks += 0.5;
        if (ticks >= text.length) {
          setDisplayText(text);
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    } else {
      setDisplayText(text);
    }
  }, [hovered, text]);

  return <>{displayText}</>;
};

// ─── Shell Prompt Header ───────────────────────────────────────────────────────
const ShellHeader = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [hovered, setHovered] = useState(false);

  const [runningCount, setRunningCount] = useState(1);
  const [completedCount, setCompletedCount] = useState(2);
  const [runtimeCount, setRuntimeCount] = useState(3);

  useEffect(() => {
    let anim: any;
    if (hovered) {
      anim = animate(0, 1, {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (v) => {
          setRunningCount(Math.round(v * 1));
          setCompletedCount(Math.round(v * 2));
          setRuntimeCount(Math.round(v * 3));
        }
      });
    } else {
      setRunningCount(1);
      setCompletedCount(2);
      setRuntimeCount(3);
    }
    return () => anim && anim.stop();
  }, [hovered]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mb-16 md:mb-20"
    >
      {/* Shell prompt line */}
      <div className="flex items-center gap-2 mb-8 font-mono text-xs">
        <span className="text-[#4ade80]">saurabh</span>
        <span className="text-white/20">@</span>
        <span className="text-[#60a5fa]">portfolio</span>
        <span className="text-white/20">:~$</span>
        <span className="text-white/50 ml-1">cat career.log</span>
        <motion.span
          className="text-white/60"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
        >
          █
        </motion.span>
      </div>

      {/* Output block */}
      <div className="border-l-2 border-white/[0.06] pl-6 space-y-2">
        <p className="font-mono text-[9px] text-white/20 tracking-widest">
          # Scanning /career/... found 3 processes
        </p>
        <motion.h2
          className="font-display font-black text-white leading-[0.85] tracking-tighter cursor-default select-none"
          style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          animate={{ scale: hovered ? 1.02 : 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <ScrambleTextOnHover text="Work" hovered={hovered} />
          <br />
          <motion.span
            className="block"
            animate={{
              WebkitTextFillColor: hovered ? 'rgba(96,165,250,0.9)' : 'transparent',
              filter: hovered ? 'drop-shadow(0 0 20px rgba(96,165,250,0.55))' : 'drop-shadow(0 0 0px transparent)',
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ WebkitTextStroke: '1.5px rgba(96,165,250,0.6)', display: 'block' }}
          >
            <ScrambleTextOnHover text="History." hovered={hovered} />
          </motion.span>
        </motion.h2>
        <p className="font-mono text-[9px] text-white/20 tracking-widest mt-4">
          # {runningCount} running · {completedCount} completed · total runtime ≈ {runtimeCount}y
        </p>
      </div>
    </motion.div>
  );
};

// ─── Separator ─────────────────────────────────────────────────────────────────
const Sep = ({ accent }: { accent: string }) => (
  <div className="flex items-center gap-4 py-6" aria-hidden>
    <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${accent}20, transparent)` }} />
    <span className="font-mono text-[8px] tracking-widest text-white/10">──────</span>
    <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${accent}20, transparent)` }} />
  </div>
);

// ─── Main Export ───────────────────────────────────────────────────────────────
const Experience = () => (
  <section id="experience" className="relative bg-[#030712] py-24 md:py-32 overflow-hidden">
    {/* Scanlines */}
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.018]"
      style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 3px)',
        backgroundSize: '100% 3px',
      }}
    />

    {/* Ambient glow blobs */}
    <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full blur-[120px] opacity-[0.06] bg-cyan-400 pointer-events-none" />
    <div className="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full blur-[120px] opacity-[0.06] bg-violet-500 pointer-events-none" />

    <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">
      <ShellHeader />

      {ROLES.map((role, i) => (
        <React.Fragment key={role.pid}>
          <ProcessCard role={role} index={i} />
          {i < ROLES.length - 1 && <Sep accent={ROLES[i + 1].accent} />}
        </React.Fragment>
      ))}

      {/* EOF */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-12 font-mono text-[9px] text-white/10 tracking-widest flex items-center gap-3"
      >
        <span className="text-[#4ade80]/30">saurabh@portfolio:~$</span>
        <span>EOF · exit 0</span>
      </motion.div>
    </div>
  </section>
);

export default Experience;
