import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Code2, Terminal, Cpu, FileText } from 'lucide-react';
import Magnetic from './Magnetic';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';

// ─── 1. AtmosphericLatentSpace ──────────────────────────────────────────────────
// Moody, glowing neural-network latent space background.
// Two breathing gradient orbs + a fixed SVG noise overlay.

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`;

const AtmosphericLatentSpace = () => (
  <>
    {/* Breathing orb — Blue */}
    <div
      className="absolute pointer-events-none"
      style={{
        width: '45vw',
        height: '45vw',
        maxWidth: 700,
        maxHeight: 700,
        top: '10%',
        left: '15%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.45) 0%, transparent 70%)',
        filter: 'blur(120px)',
        opacity: 0.6,
        mixBlendMode: 'screen',
        animation: 'breatheBlue 12s ease-in-out infinite',
        willChange: 'transform',
      }}
    />
    {/* Breathing orb — Purple */}
    <div
      className="absolute pointer-events-none"
      style={{
        width: '40vw',
        height: '40vw',
        maxWidth: 600,
        maxHeight: 600,
        bottom: '5%',
        right: '10%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
        filter: 'blur(120px)',
        opacity: 0.6,
        mixBlendMode: 'screen',
        animation: 'breathePurple 14s ease-in-out infinite',
        willChange: 'transform',
      }}
    />
    {/* Noise / grain texture */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: NOISE_SVG,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px',
        opacity: 0.05,
      }}
    />
    <style>{`
      @keyframes breatheBlue {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
        50%       { transform: translate3d(3%, -4%, 0) scale(1.08); }
      }
      @keyframes breathePurple {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
        50%       { transform: translate3d(-4%, 3%, 0) scale(1.12); }
      }
    `}</style>
  </>
);

// ─── 2. TelemetryMarquee ────────────────────────────────────────────────────────
// Infinite CSS-only ticker. Hardware-accelerated via translate3d.

const MARQUEE_TEXT = 'SAURABH LOKHANDE — AI/ML ENGINEER — ';

const TelemetryMarquee = () => {
  // Repeat text enough times to guarantee seamless loop
  const repeated = MARQUEE_TEXT.repeat(8);
  return (
    <div className="relative w-full overflow-hidden py-6 md:py-10 select-none group">
      <div
        className="whitespace-nowrap font-mono text-[clamp(1.2rem,4vw,3rem)] font-bold uppercase tracking-[0.15em] text-[#F3F4F6] group-hover:[animation-play-state:paused]"
        style={{
          animation: 'marquee 25s linear infinite',
          willChange: 'transform',
        }}
      >
        <span>{repeated}</span>
        <span aria-hidden="true">{repeated}</span>
      </div>
      <style>{`
        @keyframes marquee {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
    </div>
  );
};

// ─── 3. NeuralCTA — useEpochScramble Hook ───────────────────────────────────────
// Each word scrambles through ML-style epoch artifacts then snaps to final text.

const EPOCH_GLYPHS = [
  '[0.02, -0.91]',
  'Loss: 0.014',
  '[Epoch 42]',
  'grad: ∇f',
  'λ=0.001',
  'Σ weights',
  'δ: 0.023',
  'ReLU(x)',
  'softmax',
  '∂L/∂w',
];

const LETTER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

const useEpochScramble = (targetText: string, inView: boolean) => {
  const [display, setDisplay] = useState('');
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  // Total scramble duration
  const DURATION = 1800; // ms

  useEffect(() => {
    if (!inView) {
      setDisplay(targetText.replace(/[^ ]/g, '_'));
      return;
    }

    startRef.current = null;

    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / DURATION, 1);

      // How many characters are "resolved"
      const resolveCount = Math.floor(progress * targetText.length);

      let output = '';
      for (let i = 0; i < targetText.length; i++) {
        if (targetText[i] === ' ' || targetText[i] === '\n') {
          output += targetText[i];
        } else if (i < resolveCount) {
          output += targetText[i];
        } else if (progress < 0.3) {
          // Early phase: show epoch-style glyphs for the whole string
          const glyph = EPOCH_GLYPHS[Math.floor(Math.random() * EPOCH_GLYPHS.length)];
          output += glyph[i % glyph.length] || '·';
        } else {
          // Late phase: random character scramble narrowing down
          output += LETTER_CHARS[Math.floor(Math.random() * LETTER_CHARS.length)];
        }
      }

      setDisplay(output);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplay(targetText);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [inView, targetText]);

  return display;
};

const MagneticLetter = ({ char, className }: { char: string; className?: string }) => {
  if (char === ' ') return <span className="inline-block w-[0.3em]" />;
  return (
    <Magnetic>
      <span className={`inline-block cursor-default transition-colors duration-200 hover:text-blue-400 ${className || ''}`}>
        {char}
      </span>
    </Magnetic>
  );
};

const NeuralCTA = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const line1 = useEpochScramble("LET'S WORK", inView);
  const line2 = useEpochScramble("TOGETHER", inView);

  const resolved = inView && line1 === "LET'S WORK";

  return (
    <div ref={ref} className="flex flex-col items-center justify-center py-10 md:py-20 px-4">
      {/* Force Magnetic wrapper divs to be inline-block */}
      <style>{`
        .neural-cta-line > div { display: inline-block !important; }
        .bg-clip-text {
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
        }
      `}</style>

      {/* Line 1 */}
      <div className="neural-cta-line text-[clamp(2.5rem,12vw,10rem)] font-black uppercase leading-[0.9] tracking-tighter text-white text-center font-display flex flex-wrap justify-center">
        {resolved ? (
          line1.split('').map((c, i) => <MagneticLetter key={`l1-${i}`} char={c} />)
        ) : (
          <span className="font-mono text-[clamp(1.2rem,5vw,4rem)] text-gray-500 tracking-wider">
            {line1}
          </span>
        )}
      </div>

      {/* Line 2 — gradient text */}
      <div className="neural-cta-line text-[clamp(2.5rem,12vw,10rem)] font-black uppercase leading-[0.9] tracking-tighter text-center mt-0 md:-mt-2 font-display flex flex-wrap justify-center">
        {resolved ? (
          line2.split('').map((c, i) => (
            <MagneticLetter
              key={`l2-${i}`}
              char={c}
              className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text"
            />
          ))
        ) : (
          <span className="font-mono text-[clamp(1.2rem,5vw,4rem)] text-gray-500 tracking-wider">
            {line2}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── 4. PredictiveSocialDock ────────────────────────────────────────────────────
// Glassmorphic pills with velocity-based predictive pre-hover.

interface SocialItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  isInternal?: boolean;
  glowColor: string;
}

const SOCIAL_ITEMS: SocialItem[] = [
  { label: 'GitHub', icon: <Github size={18} />, href: 'https://github.com/saurabhmj11', glowColor: 'rgba(255,255,255,0.3)' },
  { label: 'LinkedIn', icon: <Linkedin size={18} />, href: 'https://www.linkedin.com/in/saurabhsl/', glowColor: 'rgba(10,102,194,0.5)' },
  { label: 'LeetCode', icon: <Code2 size={18} />, href: 'https://leetcode.com/u/saurabhmj11', glowColor: 'rgba(255,161,22,0.4)' },
  { label: 'HackerRank', icon: <Terminal size={18} />, href: 'https://www.hackerrank.com/profile/saurabhmj11', glowColor: 'rgba(45,204,112,0.4)' },
  { label: 'Credly', icon: <Cpu size={18} />, href: 'https://www.credly.com/users/saurabh-lokhande.6d082ab5', glowColor: 'rgba(255,111,0,0.4)' },
  { label: 'Resume', icon: <FileText size={18} />, href: '/resume', isInternal: true, glowColor: 'rgba(99,102,241,0.5)' },
];

const PredictiveSocialDock = () => {
  const dockRef = useRef<HTMLDivElement>(null);
  const [predictedIdx, setPredictedIdx] = useState<number | null>(null);
  const pillRefs = useRef<(HTMLElement | null)[]>([]);
  const velocityRef = useRef({ vx: 0, vy: 0 });
  const lastMouse = useRef({ x: 0, y: 0, t: 0 });

  const handleFooterMouseMove = useCallback((e: MouseEvent) => {
    const now = performance.now();
    const dt = now - lastMouse.current.t;
    if (dt < 16) return; // throttle to ~60fps

    const vx = (e.clientX - lastMouse.current.x) / (dt || 1);
    const vy = (e.clientY - lastMouse.current.y) / (dt || 1);
    velocityRef.current = { vx, vy };
    lastMouse.current = { x: e.clientX, y: e.clientY, t: now };

    // Predict cursor position 200ms into the future
    const futureX = e.clientX + vx * 200;
    const futureY = e.clientY + vy * 200;

    let found: number | null = null;
    pillRefs.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Expand hit area slightly for better prediction
      const pad = 20;
      if (
        futureX >= rect.left - pad &&
        futureX <= rect.right + pad &&
        futureY >= rect.top - pad &&
        futureY <= rect.bottom + pad
      ) {
        found = i;
      }
    });
    setPredictedIdx(found);
  }, []);

  useEffect(() => {
    // Attach to footer (closest parent) for wide tracking area
    const footer = dockRef.current?.closest('footer');
    if (!footer) return;
    footer.addEventListener('mousemove', handleFooterMouseMove);
    return () => footer.removeEventListener('mousemove', handleFooterMouseMove);
  }, [handleFooterMouseMove]);

  return (
    <div ref={dockRef} className="flex flex-wrap items-center justify-center gap-3 md:gap-4 py-8 md:py-12 px-4">
      {SOCIAL_ITEMS.map((item, i) => {
        const isPredicted = predictedIdx === i;
        const pill = (
          <motion.div
            ref={(el) => { pillRefs.current[i] = el; }}
            className="group relative flex items-center gap-2.5 px-5 py-3 rounded-full cursor-pointer transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: `1px solid ${isPredicted ? item.glowColor : 'rgba(255,255,255,0.08)'}`,
              boxShadow: isPredicted ? `0 0 20px ${item.glowColor}, inset 0 0 20px ${item.glowColor.replace(/[\d.]+\)$/, '0.05)')}` : 'none',
            }}
            whileHover={{
              scale: 1.08,
              boxShadow: `0 0 30px ${item.glowColor}, inset 0 0 30px ${item.glowColor.replace(/[\d.]+\)$/, '0.08)')}`,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <span className="text-gray-400 group-hover:text-white transition-colors duration-200">
              {item.icon}
            </span>
            <span className="text-xs md:text-sm font-mono uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors duration-200">
              {item.label}
            </span>
          </motion.div>
        );

        // Wrap in Magnetic for physics
        const magneticPill = <Magnetic key={item.label}>{item.isInternal ? (
          <Link to={item.href} className="block">{pill}</Link>
        ) : (
          <a href={item.href} target="_blank" rel="noreferrer" className="block">{pill}</a>
        )}</Magnetic>;

        return magneticPill;
      })}
    </div>
  );
};

// ─── 5. SystemStatusBar ─────────────────────────────────────────────────────────
// Minimal anchoring bar: SYS_ID | STATUS | LOC + LIVE CLOCK

const LiveClock = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    const tick = () => setTime(fmt.format(new Date()).toUpperCase());
    tick(); // immediate
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span data-testid="live-clock">{time}</span>;
};

const SystemStatusBar = () => (
  <div className="w-full border-t border-white/5 mt-4">
    <div className="container mx-auto max-w-7xl px-4 py-5 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-0 items-center font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-gray-600">
      {/* Left Node */}
      <div className="text-center md:text-left">
        SYS_ID: SAURABH_LOKHANDE // V_2026.1
      </div>

      {/* Center Node */}
      <div className="flex items-center justify-center gap-2">
        <span
          className="inline-block w-2 h-2 rounded-full bg-emerald-500"
          style={{ animation: 'statusPulse 2s ease-in-out infinite' }}
        />
        <span className="text-gray-500">[ STATUS: DEPLOYMENT READY ]</span>
      </div>

      {/* Right Node */}
      <div className="text-center md:text-right text-gray-600">
        LOC: WARDHA, MH // TIME: <LiveClock />
      </div>
    </div>
    <style>{`
      @keyframes statusPulse {
        0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(16,185,129,0.6); }
        50%       { opacity: 0.6; box-shadow: 0 0 8px 4px rgba(16,185,129,0.2); }
      }
    `}</style>
  </div>
);

// ─── Footer (Composed) ─────────────────────────────────────────────────────────

const Footer = () => {
  return (
    <footer className="relative bg-[#050505] text-white overflow-hidden z-50">
      {/* 1. Background atmosphere */}
      <AtmosphericLatentSpace />

      <div className="relative z-10">
        <ScrollReveal width="100%">
          {/* 2. Telemetry Marquee */}
          <TelemetryMarquee />

          {/* 3. Neural CTA */}
          <NeuralCTA />

          {/* 4. Social Dock */}
          <PredictiveSocialDock />

          {/* 5. System Status Bar */}
          <SystemStatusBar />
        </ScrollReveal>
      </div>
    </footer>
  );
};

export default Footer;