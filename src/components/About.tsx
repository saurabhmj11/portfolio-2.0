import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 10, suffix: '+', label: 'Agentic AI\nSystems Built' },
  { value: 60, suffix: '%', label: 'Faster RAG\nPipelines' },
  { value: 3, suffix: '+', label: 'Years of\nEngineering' },
];

const BIO_TEXT =
  "Hi, I'm Saurabh Lokhande — an AI Engineer with 3+ years of experience building production-grade Agentic AI systems, RAG pipelines, and LLM-powered applications. I specialize in LangChain, LangGraph, and scalable full-stack architectures that deliver real-world intelligent automation.";

// ── Desktop version: Award-winning GSAP pinned scroll ────────────────────────
const AboutDesktop = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const section = sectionRef.current;
    const headlineEl = headlineRef.current;
    const bioEl = bioRef.current;
    const imageEl = imageRef.current;

    if (!container || !section || !headlineEl || !bioEl || !imageEl) return;

    // Loading gate: wait for full paint before scattering letters
    // This prevents the "jumbled mid-flight" flash during slow JS hydration
    headlineEl.style.opacity = '0';

    const timer = setTimeout(() => {
    headlineEl.style.opacity = '1';

    const ctx = gsap.context(() => {
      // ── 1. Build headline: per-character spans scattered in 3D ───────────
      const HEADLINE = 'ENGINEERING AGENTIC ARCHITECTURES';
      headlineEl.innerHTML = '';

      HEADLINE.split(' ').forEach((word) => {
        const wordDiv = document.createElement('div');
        wordDiv.style.cssText =
          'display:inline-flex; margin:0 1vw; overflow:visible;';
        word.split('').forEach((char) => {
          const span = document.createElement('span');
          span.textContent = char;
          span.className = 'gsap-char';
          span.style.cssText =
            'display:inline-block; font-size:clamp(1.2rem,6vw,8rem); font-weight:900; font-family:inherit; color:#ffffff; line-height:1; text-transform:uppercase; will-change:transform,opacity;';
          wordDiv.appendChild(span);
        });
        headlineEl.appendChild(wordDiv);
      });

      // ── 2. Build bio: per-word opacity scrub ─────────────────────────────
      bioEl.innerHTML = '';
      BIO_TEXT.split(' ').forEach((word) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.cssText =
          'display:inline-block; margin-right:0.4em; opacity:0.08; will-change:opacity; color:#e5e7eb;';
        wordSpan.textContent = word;
        bioEl.appendChild(wordSpan);
      });

      const largeChars = headlineEl.querySelectorAll<HTMLElement>('.gsap-char');
      const bioWords = bioEl.querySelectorAll<HTMLElement>('span');

      // ── 3. Scatter headline chars into random 3D positions ──────────────
      largeChars.forEach((char) => {
        gsap.set(char, {
          x: (Math.random() - 0.5) * window.innerWidth * 1.8,
          y: (Math.random() - 0.5) * window.innerHeight * 1.8,
          rotation: (Math.random() - 0.5) * 480,
          rotationX: (Math.random() - 0.5) * 180,
          rotationY: (Math.random() - 0.5) * 180,
          scale: 0.2 + Math.random() * 0.8,
          opacity: 0,
        });
      });

      gsap.set(imageEl, { scale: 0.4, opacity: 0, filter: 'blur(20px)' });
      gsap.set(statsRef.current, { opacity: 0, y: 50 });

      // ── 4. Master timeline pinned to the section ─────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=250%',       // section occupies 3.5x viewport heights of scroll
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      // Phase 1 (0–0.3): Chars fly IN from scattered positions
      tl.to(
        largeChars,
        {
          x: 0,
          y: 0,
          rotation: 0,
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          opacity: 1,
          duration: 2,
          ease: 'power3.out',
          stagger: { amount: 0.8, from: 'random' },
        },
        0
      );

      // Overlay flash on entry
      tl.fromTo(
        overlayRef.current,
        { opacity: 0.7 },
        { opacity: 0, duration: 0.5, ease: 'power2.out' },
        0
      );

      // Phase 2 (0.3–0.55): Headline chars EXPLODE out, image reveals
      tl.to(
        largeChars,
        {
          x: () => (Math.random() - 0.5) * window.innerWidth * 2.5,
          y: () => (Math.random() - 0.5) * window.innerHeight * 2.5,
          rotation: () => (Math.random() - 0.5) * 720,
          scale: () => 0.1 + Math.random() * 0.5,
          opacity: 0,
          duration: 2.5,
          ease: 'power4.in',
          stagger: { amount: 0.6, from: 'center' },
        },
        1.5
      );

      // Phase 2b: Image blooms into view as chars scatter
      tl.to(
        imageEl,
        {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 2,
          ease: 'power2.out',
        },
        1.8
      );

      // Phase 3 (0.6–1.0): Bio words scrub in one by one, stats fade up
      tl.to(
        bioWords,
        {
          opacity: 1,
          duration: 0.3,
          stagger: { amount: 2, ease: 'none' },
          ease: 'none',
        },
        3
      );

      tl.to(
        statsRef.current,
        { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' },
        3.2
      );

      // Live count-up for stats synced with scroll scrub
      STATS.forEach((stat, i) => {
        const el = statsRef.current?.querySelectorAll('.stat-num')[i] as HTMLElement;
        if (!el) return;
        const obj = { val: 0 };
        tl.to(
          obj,
          {
            val: stat.value,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = Math.round(obj.val) + stat.suffix;
            },
          },
          3.4 + i * 0.15
        );
      });
    }, containerRef);

    return () => ctx.revert();
    }, 120); // end loading gate setTimeout

    return () => clearTimeout(timer);
  }, []);

  return (
    // ⚠️ CRITICAL: NO overflow-hidden here — it breaks GSAP pin
    <div ref={containerRef} className="bg-[#050505] relative z-10" id="about">
      {/* Flash overlay for cinematic entry */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-white pointer-events-none z-50 opacity-0"
      />

      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-blue-700/10 rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-700/10 rounded-full blur-[180px]" />
      </div>

      <section
        ref={sectionRef}
        className="relative w-full h-screen bg-transparent flex justify-center items-center"
        style={{ perspective: '1200px' }}
      >
        {/* Scattered headline characters layer — full screen, behind everything */}
        <div
          ref={headlineRef}
          className="absolute inset-0 flex flex-wrap content-center justify-center pointer-events-none z-10 w-full h-full text-center"
          style={{ perspective: '1000px' }}
        />

        {/* Central content: image + bio + stats */}
        <div className="relative z-20 text-center max-w-2xl w-full flex flex-col items-center px-4">
          <img
            ref={imageRef}
            src="/profile.jpg"
            alt="Saurabh Lokhande — AI Engineer"
            className="w-48 h-48 md:w-64 md:h-64 object-cover mb-8 rounded-full shadow-[0_0_80px_rgba(96,165,250,0.3)] border-4 border-white/10 bg-[#111]"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop';
            }}
          />

          {/* Bio words rendered inline — GSAP sets individual word opacities */}
          <p
            ref={bioRef}
            className="text-gray-300 text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-xl"
          />

          <div
            ref={statsRef}
            className="flex items-start justify-center gap-6 sm:gap-12 md:gap-20"
          >
            {STATS.map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="stat-num font-display font-black text-4xl md:text-6xl text-white leading-none tabular-nums tracking-tighter">
                  0{stat.suffix}
                </span>
                <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.25em] text-center whitespace-pre-line">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cinematic scan-line grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-30 opacity-[0.025]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 3px)',
            backgroundSize: '100% 3px',
          }}
        />
      </section>
    </div>
  );
};

const About = () => {
  return <AboutDesktop />;
};

export default About;
