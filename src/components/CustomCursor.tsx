import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useAudioDirector } from '../context/AudioContext';

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
const TRAIL_LENGTH = 25;
const BASE_HUE = 280; // purple
const HOVER_HUE = 320; // pink on hover

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
  const { playHoverTick, playClickPop } = useAudioDirector();

  const isTouchDevice =
    typeof window !== 'undefined' &&
    (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024);

  const [cursorState, setCursorState] = useState<CursorState>('default');
  const isHovering = cursorState !== 'default';
  const canvasRef = useParticleTrail(isHovering);

  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTouchDevice) return;

    // Center elements on their (x, y) coordinates
    gsap.set([cursorRef.current, ringRef.current, labelRef.current], {
      xPercent: -50,
      yPercent: -50,
      left: 0,
      top: 0
    });

    // GSAP quickTo for ultra-fast, non-react-rendering movement
    const xMoveCursor = gsap.quickTo(cursorRef.current, 'x', { duration: 0.1, ease: 'power3' });
    const yMoveCursor = gsap.quickTo(cursorRef.current, 'y', { duration: 0.1, ease: 'power3' });
    
    // Ring has more lag for the magnetic feel
    const xMoveRing = gsap.quickTo(ringRef.current, 'x', { duration: 0.35, ease: 'power3' });
    const yMoveRing = gsap.quickTo(ringRef.current, 'y', { duration: 0.35, ease: 'power3' });

    const xMoveLabel = gsap.quickTo(labelRef.current, 'x', { duration: 0.15, ease: 'power3' });
    const yMoveLabel = gsap.quickTo(labelRef.current, 'y', { duration: 0.15, ease: 'power3' });

    const onMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      xMoveCursor(clientX);
      yMoveCursor(clientY);
      xMoveRing(clientX);
      yMoveRing(clientY);
      if (labelRef.current) {
        xMoveLabel(clientX);
        yMoveLabel(clientY + 24); // Offset below cursor
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isLink = target.tagName === 'A' || !!target.closest('a');
      const isBtn = target.tagName === 'BUTTON' || !!target.closest('button');
      const isDrag = target.classList.contains('cursor-grab') || !!target.closest('[data-cursor-drag]');
      const isText = target.tagName === 'P' || target.tagName === 'SPAN' || target.tagName === 'H1'
        || target.tagName === 'H2' || target.tagName === 'H3';

      if (isDrag) {
        setCursorState('hover-drag');
      } else if (isLink || isBtn) {
        if (cursorState !== 'hover-link') playHoverTick();
        setCursorState('hover-link');
      } else if (isText) {
        setCursorState('hover-text');
      } else {
        setCursorState('default');
      }
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isLink = target.tagName === 'A' || !!target.closest('a');
      const isBtn = target.tagName === 'BUTTON' || !!target.closest('button');
      if (isLink || isBtn) {
        playClickPop();
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('click', onClick, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('click', onClick);
    };
  }, [isTouchDevice, cursorState, playHoverTick, playClickPop]);

  // GSAP state animations
  useEffect(() => {
    if (isTouchDevice) return;

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
    const dotColor = cursorState === 'default' ? '#ffffff' : ringColor;
    const dotScale = cursorState !== 'default' ? 1.2 : 1;
    const ringRotate = cursorState === 'hover-drag' ? 45 : 0;
    const ringBorderRadius = cursorState === 'hover-drag' ? '6px' : '50%';

    gsap.to(ringRef.current, {
      width: ringSize,
      height: ringSize,
      borderColor: ringColor,
      rotate: ringRotate,
      borderRadius: ringBorderRadius,
      duration: 0.35,
      ease: 'back.out(1.7)'
    });

    gsap.to(cursorRef.current, {
      width: dotSize,
      height: dotSize,
      backgroundColor: dotColor,
      scale: dotScale,
      duration: 0.2,
      ease: 'power2.out'
    });

    if (cursorState === 'hover-drag' && labelRef.current) {
        gsap.to(labelRef.current, { opacity: 1, duration: 0.2 });
    } else if (labelRef.current) {
        gsap.to(labelRef.current, { opacity: 0, duration: 0.2 });
    }
  }, [cursorState, isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9990]"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9998]"
        style={{
          width: 36, 
          height: 36,
          border: '1.5px solid rgba(255,255,255,0.8)',
          borderRadius: '50%',
          transformOrigin: 'center center',
          mixBlendMode: 'difference'
        }}
      />

      {/* Dot */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] rounded-full bg-white"
        style={{
          width: 10, 
          height: 10,
          transformOrigin: 'center center',
          mixBlendMode: 'difference'
        }}
      />

      {/* Label */}
      <div
        ref={labelRef}
        className="fixed pointer-events-none z-[9997] text-[10px] font-mono tracking-widest text-cyan-300 uppercase opacity-0"
      >
        drag
      </div>
    </>
  );
};

export default CustomCursor;
