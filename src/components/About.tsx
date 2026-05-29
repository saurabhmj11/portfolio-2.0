import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useIsMobile from '../hooks/useIsMobile';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 10, suffix: '+', label: 'Agentic AI\nSystems Built' },
  { value: 60, suffix: '%', label: 'Faster RAG\nPipelines' },
  { value: 3, suffix: '+', label: 'Years of\nEngineering' },
];

const BIO_TEXT = "Hi, I'm Saurabh Lokhande — an AI Engineer with 3+ years of experience building production-grade Agentic AI systems, RAG pipelines, and LLM-powered applications. I specialize in LangChain, LangGraph, and scalable full-stack architectures that deliver real-world intelligent automation.";

// ── Mobile version: Glassmorphic 3D Tilt Reveal ───────────────────────────────
const AboutMobile = () => {
  return (
    <div className="bg-[#050505] relative z-10 overflow-hidden min-h-screen flex items-center justify-center py-20 px-4" id="about">
      {/* Background ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="w-[80vw] h-[80vw] bg-blue-600 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, rotateX: 20, y: 50, scale: 0.95 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ perspective: 1000 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 flex flex-col items-center shadow-2xl relative overflow-hidden">
          {/* Inner glass highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50" />
          
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "backOut" }}
            viewport={{ once: true }}
            src="/profile.jpg"
            alt="Saurabh Lokhande"
            className="w-32 h-32 object-cover rounded-full shadow-2xl border-2 border-white/20 mb-6 bg-[#111]"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop';
            }}
          />

          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-3xl font-display font-black text-white uppercase tracking-tight text-center leading-tight mb-4"
          >
            Engineering <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Agentic</span> <br/>
            Architectures
          </motion.h2>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-gray-400 text-sm leading-relaxed text-center font-medium mb-8"
          >
            {BIO_TEXT}
          </motion.p>

          <div className="flex items-start justify-center gap-6 w-full pt-6 border-t border-white/10">
            {STATS.map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + (i * 0.1) }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-1 flex-1"
              >
                <span className="stat-num font-display font-black text-2xl text-white leading-none tabular-nums">
                  0{stat.suffix}
                </span>
                <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest text-center whitespace-pre-line leading-tight">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ── Desktop version: full GSAP per-character explosion ───────────────────────
const AboutDesktop = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !headlineRef.current || !bioRef.current || !imageRef.current) return;

    const ctx = gsap.context(() => {
      const headlineText = 'ENGINEERING AGENTIC ARCHITECTURES';

      if (headlineRef.current) headlineRef.current.innerHTML = '';
      if (bioRef.current) bioRef.current.innerHTML = '';

      headlineText.split(' ').forEach(word => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'inline-flex mx-[1vw] overflow-visible';
        word.split('').forEach(char => {
          const span = document.createElement('span');
          span.innerText = char;
          span.className = 'large-char text-[8vw] md:text-[10vw] font-black text-[#ffffff] leading-none uppercase inline-block will-change-transform will-change-opacity';
          wordDiv.appendChild(span);
        });
        headlineRef.current?.appendChild(wordDiv);
      });

      BIO_TEXT.split(' ').forEach(word => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'inline-flex mr-[0.4rem] overflow-visible';
        word.split('').forEach(char => {
          const span = document.createElement('span');
          span.innerText = char;
          span.className = 'bio-char inline-block will-change-transform will-change-opacity opacity-0 text-gray-400 text-base md:text-xl font-medium tracking-wide';
          wordDiv.appendChild(span);
        });
        bioRef.current?.appendChild(wordDiv);
      });

      const largeChars = headlineRef.current!.querySelectorAll('.large-char');
      const bioChars = bioRef.current!.querySelectorAll('.bio-char');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=40%',
          pin: true,
          scrub: 0.5,
        }
      });

      largeChars.forEach(char => {
        const randomX = (Math.random() - 0.5) * window.innerWidth * 1.5;
        const randomY = (Math.random() - 0.5) * window.innerHeight * 1.5;
        const randomRot = (Math.random() - 0.5) * 360;
        tl.to(char, { x: randomX, y: randomY, rotation: randomRot, opacity: 0, duration: 2, ease: 'power3.in' }, 0);
      });

      gsap.set(imageRef.current, { scale: 0.5, opacity: 0 });
      tl.to(imageRef.current, { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' }, 0.5);

      bioChars.forEach(char => {
        const randomX = (Math.random() - 0.5) * 500;
        const randomY = (Math.random() - 0.5) * 500;
        const randomZ = (Math.random() - 0.5) * 200;
        gsap.set(char, { x: randomX, y: randomY, z: randomZ, opacity: 0 });
        tl.to(char, { x: 0, y: 0, z: 0, opacity: 1, duration: 1.5, ease: 'power3.out' }, 0.5);
      });

      if (statsRef.current) {
        gsap.set(statsRef.current, { opacity: 0, y: 30 });
        tl.to(statsRef.current, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, 0.6);
        STATS.forEach((stat, i) => {
          const el = statsRef.current!.querySelectorAll('.stat-num')[i] as HTMLElement;
          if (!el) return;
          const obj = { val: 0 };
          tl.to(obj, {
            val: stat.value,
            duration: 1.2,
            ease: 'power2.out',
            onUpdate: () => { el.textContent = Math.round(obj.val) + stat.suffix; }
          }, 0.7);
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-[#050505] relative z-10 overflow-hidden" id="about">
      <section ref={sectionRef} className="relative w-full h-screen bg-[#050505] overflow-hidden flex justify-center items-center">
        <div ref={headlineRef} className="absolute inset-0 flex flex-wrap content-center justify-center pointer-events-none p-4 md:p-8 z-10 w-full h-full text-center" />
        <div className="relative z-20 text-center max-w-2xl w-full flex flex-col items-center px-4">
          <img
            ref={imageRef}
            src="/profile.jpg"
            alt="Saurabh Lokhande — AI Engineer"
            className="w-40 h-40 md:w-64 md:h-64 object-cover mb-6 md:mb-8 rounded-full shadow-2xl border-2 md:border-4 border-white/10 hover:scale-105 transition-transform duration-500 bg-[#111]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop';
            }}
          />
          <div ref={bioRef} className="flex flex-wrap justify-center gap-y-1 md:gap-y-2 gap-x-1 text-center font-medium leading-relaxed relative z-30 mix-blend-difference" />
          <div ref={statsRef} className="mt-6 md:mt-12 flex items-start justify-center gap-4 md:gap-16">
            {STATS.map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="stat-num font-display font-black text-2xl md:text-5xl text-white leading-none tabular-nums">
                  0{stat.suffix}
                </span>
                <span className="font-mono text-[9px] md:text-[10px] text-white/30 uppercase tracking-widest text-center whitespace-pre-line">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// ── Smart wrapper ─────────────────────────────────────────────────────────────
const About = () => {
  const isMobile = useIsMobile();
  return isMobile ? <AboutMobile /> : <AboutDesktop />;
};

export default About;
