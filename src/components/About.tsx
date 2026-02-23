import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Stats that counter up during the bio phase ──────────────────────────────
const STATS = [
  { value: 55, suffix: '+', label: 'AI Projects\nShipped' },
  { value: 60, suffix: '%', label: 'Faster pipelines\nbuilt' },
  { value: 1.5, suffix: '+', label: 'Years of\nengineering' },
];

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !headlineRef.current || !bioRef.current || !imageRef.current) return;

    const ctx = gsap.context(() => {
      const headlineText = 'CREATING THE FUTURE OF AI';
      const bioText = "Hi, I'm Saurabh — An AI Engineer & Full Stack Developer. My focus is on building intelligent, scalable, and immersive applications that bridge the gap between human creativity and artificial intelligence.";

      if (headlineRef.current) headlineRef.current.innerHTML = '';
      if (bioRef.current) bioRef.current.innerHTML = '';

      // Headline spans
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

      // Bio spans
      bioText.split(' ').forEach(word => {
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

      // A: Explode headline
      largeChars.forEach(char => {
        const randomX = (Math.random() - 0.5) * window.innerWidth * 1.5;
        const randomY = (Math.random() - 0.5) * window.innerHeight * 1.5;
        const randomRot = (Math.random() - 0.5) * 360;
        tl.to(char, { x: randomX, y: randomY, rotation: randomRot, opacity: 0, duration: 2, ease: 'power3.in' }, 0);
      });

      // B: Reveal profile image
      gsap.set(imageRef.current, { scale: 0.5, opacity: 0 });
      tl.to(imageRef.current, { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' }, 0.5);

      // C: Assemble bio text
      bioChars.forEach(char => {
        const randomX = (Math.random() - 0.5) * 500;
        const randomY = (Math.random() - 0.5) * 500;
        const randomZ = (Math.random() - 0.5) * 200;
        gsap.set(char, { x: randomX, y: randomY, z: randomZ, opacity: 0 });
        tl.to(char, { x: 0, y: 0, z: 0, opacity: 1, duration: 1.5, ease: 'power3.out' }, 0.5);
      });

      // D: Counter-up stats (animate numeric value in each stat element)
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

        {/* Exploding headline */}
        <div ref={headlineRef} className="absolute inset-0 flex flex-wrap content-center justify-center pointer-events-none p-8 z-10 w-full h-full text-center" />

        {/* Central content */}
        <div className="relative z-20 text-center max-w-2xl w-full flex flex-col items-center px-4">
          <img
            ref={imageRef}
            src="/profile.jpg"
            alt="Saurabh Lokhande — AI Engineer"
            className="w-64 h-64 object-cover mb-8 rounded-full shadow-2xl border-4 border-white/10 hover:scale-105 transition-transform duration-500 bg-[#111]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop';
            }}
          />

          <div ref={bioRef} className="flex flex-wrap justify-center gap-y-2 gap-x-1 text-center font-medium leading-relaxed relative z-30 mix-blend-difference" />

          {/* ── Stats counter strip ── */}
          <div
            ref={statsRef}
            className="mt-8 md:mt-12 flex items-start justify-center gap-6 md:gap-16"
          >
            {STATS.map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span
                  className="stat-num font-display font-black text-2xl md:text-5xl text-white leading-none tabular-nums"
                >
                  0{stat.suffix}
                </span>
                <span className="font-mono text-[8px] md:text-[9px] text-white/25 uppercase tracking-widest text-center whitespace-pre-line">
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

export default About;
