import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "Saurabh turned our vague AI concepts into a production-ready RAG system in weeks. His grasp of both LLMs and backend architecture is genuinely rare.",
    author: "Alex Cheng",
    role: "CTO, FinTech Startup",
    hue: 210,
  },
  {
    quote: "The autonomous agent workflow he built saved our research team 20+ hours a week. Incredible ROI, flawless execution, zero handholding.",
    author: "Sarah Davis",
    role: "Head of Product, DataCorp",
    hue: 270,
  },
  {
    quote: "One of the most detail-oriented engineers I've worked with. The generative UI component he designed became the centrepiece of our entire UX.",
    author: "James Wilson",
    role: "Founder, AI Studio",
    hue: 175,
  },
  {
    quote: "Saurabh's ability to navigate complex multi-agent systems is top-tier. He delivered a robust solution that scaled effortlessly under production load.",
    author: "Maria Garcia",
    role: "Engineering Lead, TechFlow",
    hue: 340,
  },
];

// Deterministic avatar color from author name
const getAvatarGradient = (hue: number) =>
  `linear-gradient(135deg, hsl(${hue},80%,40%), hsl(${hue + 40},90%,60%))`;

const QuoteIcon = ({ hue }: { hue: number }) => (
  <svg width="48" height="40" viewBox="0 0 48 40" fill="none" className="absolute top-6 right-6 opacity-[0.07]">
    <path
      d="M0 40V24C0 10.745 8.955 2.04 26.864 0L28 4.44C19.636 6.27 15.454 10.88 15.454 18.36H21.818V40H0ZM26.182 40V24C26.182 10.745 35.136 2.04 53.046 0L54.182 4.44C45.818 6.27 41.636 10.88 41.636 18.36H48V40H26.182Z"
      fill={`hsl(${hue},90%,70%)`}
    />
  </svg>
);

const TestimonialCard = ({ quote, author, role, hue }: typeof testimonials[0]) => {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stars = starsRef.current?.querySelectorAll('.star');
    if (!stars) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(stars,
        { scale: 0, opacity: 0, rotation: -30 },
        {
          scale: 1, opacity: 1, rotation: 0,
          duration: 0.5, ease: 'back.out(2)',
          stagger: 0.08,
          scrollTrigger: { trigger: starsRef.current, start: 'top 85%', once: true },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const initials = author.split(' ').map(n => n[0]).join('');

  return (
    <div
      className="relative w-[80vw] md:w-[42vw] max-w-[480px] shrink-0 rounded-2xl overflow-hidden group"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(16px)',
        boxShadow: `0 0 60px -20px hsla(${hue},80%,50%,0.15), 0 4px 32px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Gradient top edge */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, hsl(${hue},80%,60%), transparent)` }}
      />

      {/* Ambient glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(circle at 50% 0%, hsla(${hue},80%,50%,0.07) 0%, transparent 70%)` }}
      />

      <QuoteIcon hue={hue} />

      <div className="relative p-8 md:p-10 flex flex-col h-full">
        {/* Stars */}
        <div ref={starsRef} className="flex gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="star w-4 h-4" viewBox="0 0 20 20" fill={`hsl(${hue},90%,65%)`}>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Quote */}
        <p className="text-gray-300 text-base md:text-lg leading-relaxed font-light italic flex-1 mb-8">
          "{quote}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ background: getAvatarGradient(hue), boxShadow: `0 0 12px hsla(${hue},80%,50%,0.4)` }}
            aria-hidden
          >
            {initials}
          </div>
          <div>
            <p className="font-semibold text-sm text-white">{author}</p>
            <p className="text-xs font-mono text-gray-500">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const content = sliderRef.current;
    if (!content) return;

    const ctx = gsap.context(() => {
      tweenRef.current = gsap.to(content, {
        x: '-50%',
        duration: 28,
        ease: 'none',
        repeat: -1,
      });

      // Pause on hover
      content.addEventListener('mouseenter', () => tweenRef.current?.pause());
      content.addEventListener('mouseleave', () => tweenRef.current?.play());
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-24 overflow-hidden relative"
      style={{ background: 'linear-gradient(180deg, #020202 0%, #060610 50%, #020202 100%)' }}
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-violet-900/10 rounded-full blur-[140px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-sky-900/10 rounded-full blur-[120px] -translate-y-1/2" />
      </div>

      {/* Heading */}
      <div className="container mx-auto px-4 mb-14 relative z-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gray-600 font-mono mb-3">Social Proof</p>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
          What People Say
        </h2>
        <div className="mt-4 h-px w-24 bg-gradient-to-r from-sky-500 to-violet-500" />
      </div>

      {/* Marquee */}
      <div className="w-full relative z-10">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#020202] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#020202] to-transparent z-20 pointer-events-none" />

        <div ref={sliderRef} className="flex gap-6 w-max px-6">
          {[...testimonials, ...testimonials].map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
