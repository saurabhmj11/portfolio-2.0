import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// ── Types ──────────────────────────────────────────────────────────────────
type CursorState = 'default' | 'hover-link' | 'hover-text' | 'hover-drag';

interface Particle {
  x: number;
  y: number;
  alpha: number;
  radius: number;
  vx: number;
  vy: number;
  hue: number;
}

// ── Constants ──────────────────────────────────────────────────────────────
const TRAIL_LENGTH = 18;
const BASE_HUE = 210; // blue
const HOVER_HUE = 280; // violet on hover

// ── Particle Trail Canvas ─────────────────────────────────────────────────
const useParticleTrail = (isHovering: boolean) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -200, y: -200 });
  const rafRef = useRef<number>(0);
  const frameRef = useRef(0);

  const spawnParticle = useCallback((x: number, y: number) => {
    const hue = isHovering ? HOVER_HUE : BASE_HUE;
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.3 + Math.random() * 0.6;
    particlesRef.current.push({
      x,
      y,
      alpha: 0.8 + Math.random() * 0.2,
      radius: 2 + Math.random() * 3,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.4,
      hue: hue + (Math.random() - 0.5) * 40,
    });
    if (particlesRef.current.length > TRAIL_LENGTH) {
      particlesRef.current.shift();
    }
  }, [isHovering]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const animate = () => {
      frameRef.current++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn every other frame for performance
      if (frameRef.current % 2 === 0) {
        spawnParticle(mouseRef.current.x, mouseRef.current.y);
      }

      particlesRef.current = particlesRef.current.filter(p => p.alpha > 0.01);
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gravity
        p.vx *= 0.97;
        p.alpha *= 0.88;
        p.radius *= 0.97;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();

        // Glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.5);
        gradient.addColorStop(0, `hsla(${p.hue}, 100%, 80%, 1)`);
        gradient.addColorStop(0.5, `hsla(${p.hue}, 90%, 60%, 0.4)`);
        gradient.addColorStop(1, `hsla(${p.hue}, 80%, 40%, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 100%, 90%, ${p.alpha})`;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, [spawnParticle]);

  return canvasRef;
};

// ── Main Cursor Component ──────────────────────────────────────────────────
const CustomCursor = () => {
  const isTouchDevice =
    typeof window !== 'undefined' &&
    (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024);

  const [cursorState, setCursorState] = useState<CursorState>('default');
  const isHovering = cursorState !== 'default';
  const canvasRef = useParticleTrail(isHovering);

  const mouse = {
    x: useMotionValue(-200),
    y: useMotionValue(-200),
  };

  const smoothOptions = { damping: 22, stiffness: 350, mass: 0.4 };
  const smoothMouse = {
    x: useSpring(mouse.x, smoothOptions),
    y: useSpring(mouse.y, smoothOptions),
  };

  // Slower ring for magnetic lag
  const ringOptions = { damping: 28, stiffness: 120, mass: 0.8 };
  const ringMouse = {
    x: useSpring(mouse.x, ringOptions),
    y: useSpring(mouse.y, ringOptions),
  };

  useEffect(() => {
    if (isTouchDevice) return;

    const onMove = (e: MouseEvent) => {
      const { clientX: cx, clientY: cy } = e;
      mouse.x.set(cx);
      mouse.y.set(cy);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isLink = target.tagName === 'A' || !!target.closest('a');
      const isBtn = target.tagName === 'BUTTON' || !!target.closest('button');
      const isDrag = target.classList.contains('cursor-grab') || !!target.closest('[data-cursor-drag]');
      const isText = target.tagName === 'P' || target.tagName === 'SPAN' || target.tagName === 'H1'
        || target.tagName === 'H2' || target.tagName === 'H3';

      if (isDrag) setCursorState('hover-drag');
      else if (isLink || isBtn) setCursorState('hover-link');
      else if (isText) setCursorState('hover-text');
      else setCursorState('default');
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  // Ring size & color per state
  const ringSize = {
    'default': 36,
    'hover-link': 56,
    'hover-text': 44,
    'hover-drag': 48,
  }[cursorState];

  const ringColor = {
    'default': 'rgba(255,255,255,0.25)',
    'hover-link': 'rgba(139,92,246,0.6)',
    'hover-text': 'rgba(59,130,246,0.5)',
    'hover-drag': 'rgba(34,211,238,0.5)',
  }[cursorState];

  const dotSize = cursorState !== 'default' ? 6 : 10;

  return (
    <>
      {/* Particle trail canvas — behind everything */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9990]"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Outer ring — slow magnetic lag */}
      <motion.div
        className="fixed pointer-events-none z-[9998]"
        style={{
          left: ringMouse.x,
          top: ringMouse.y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: ringSize,
            height: ringSize,
            borderColor: ringColor,
            rotate: cursorState === 'hover-drag' ? 45 : 0,
          }}
          transition={{ duration: 0.25, ease: 'backOut' }}
          style={{
            border: '1.5px solid',
            borderRadius: cursorState === 'hover-drag' ? '6px' : '50%',
          }}
        />
      </motion.div>

      {/* Center dot — fast, stays exactly on cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: smoothMouse.x,
          top: smoothMouse.y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: dotSize,
            height: dotSize,
            backgroundColor: cursorState === 'default' ? '#ffffff' : ringColor,
            scale: cursorState !== 'default' ? 1.2 : 1,
          }}
          transition={{ duration: 0.2, ease: 'backOut' }}
          className="rounded-full"
        />
      </motion.div>

      {/* "Drag" label for grab state */}
      {cursorState === 'hover-drag' && (
        <motion.div
          className="fixed pointer-events-none z-[9997] text-[10px] font-mono tracking-widest text-cyan-300 uppercase"
          style={{
            left: smoothMouse.x,
            top: smoothMouse.y,
            translateX: '-50%',
            translateY: '24px',
          }}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          drag
        </motion.div>
      )}
    </>
  );
};

export default CustomCursor;
