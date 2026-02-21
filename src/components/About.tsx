import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure all refs are present before animating
    if (!sectionRef.current || !headlineRef.current || !bioRef.current || !imageRef.current) return;

    const ctx = gsap.context(() => {
      // --- 1. SETUP TEXT (Dynamic Injection) ---
      const headlineText = "CREATING THE FUTURE OF AI";
      const bioText = "Hi, I'm Saurabh — An AI Engineer & Full Stack Developer. My focus is on building intelligent, scalable, and immersive applications that bridge the gap between human creativity and artificial intelligence.";

      // Clear existing content to avoid duplication on re-renders
      if (headlineRef.current) headlineRef.current.innerHTML = '';
      if (bioRef.current) bioRef.current.innerHTML = '';

      // Generate Headline Spans (for explosion)
      headlineText.split(' ').forEach(word => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'inline-flex mx-[1vw] overflow-visible';
        word.split('').forEach(char => {
          const span = document.createElement('span');
          span.innerText = char;
          // Large, bold, white text that will explode
          span.className = 'large-char text-[8vw] md:text-[10vw] font-black text-[#ffffff] leading-none uppercase inline-block will-change-transform will-change-opacity';
          wordDiv.appendChild(span);
        });
        headlineRef.current?.appendChild(wordDiv);
      });

      // Generate Bio Spans (for implosion)
      bioText.split(' ').forEach(word => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'inline-flex mr-[0.4rem] overflow-visible';
        word.split('').forEach(char => {
          const span = document.createElement('span');
          span.innerText = char;
          // Gray text that will assemble itself
          span.className = 'bio-char inline-block will-change-transform will-change-opacity opacity-0 text-gray-400 text-base md:text-xl font-medium tracking-wide';
          wordDiv.appendChild(span);
        });
        bioRef.current?.appendChild(wordDiv);
      });

      const largeChars = headlineRef.current!.querySelectorAll('.large-char');
      const bioChars = bioRef.current!.querySelectorAll('.bio-char');

      // --- 2. CREATE TIMELINE ---
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=30%", // Drastically reduced from 80% to eliminate dead space
          pin: true,
          scrub: 0.5,
        }
      });

      // STEP A: Explode Large Headline (Starts readable, explodes away)
      largeChars.forEach(char => {
        const randomX = (Math.random() - 0.5) * window.innerWidth * 1.5;
        const randomY = (Math.random() - 0.5) * window.innerHeight * 1.5;
        const randomRot = (Math.random() - 0.5) * 360;

        tl.to(char, {
          x: randomX,
          y: randomY,
          rotation: randomRot,
          opacity: 0,
          duration: 2,
          ease: "power3.in"
        }, 0);
      });

      // STEP B: Reveal Profile Image (Scale up)
      gsap.set(imageRef.current, { scale: 0.5, opacity: 0 });
      tl.to(imageRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out"
      }, 0.5);

      // STEP C: Assemble Bio Text (Implosion - Starts scattered, comes together)
      bioChars.forEach(char => {
        const randomX = (Math.random() - 0.5) * 500;
        const randomY = (Math.random() - 0.5) * 500;
        const randomZ = (Math.random() - 0.5) * 200;

        // Initial scattered state
        gsap.set(char, {
          x: randomX,
          y: randomY,
          z: randomZ,
          opacity: 0
        });

        // Animate to neutral state
        tl.to(char, {
          x: 0,
          y: 0,
          z: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power3.out"
        }, 0.5);
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-[#050505] relative z-10 overflow-hidden" id="about">
      <section ref={sectionRef} className="relative w-full h-screen bg-[#050505] overflow-hidden flex justify-center items-center">

        {/* 1. Exploding Headline Container */}
        <div ref={headlineRef} className="absolute inset-0 flex flex-wrap content-center justify-center pointer-events-none p-8 z-10 w-full h-full text-center">
          {/* JS Injects Spans Here */}
        </div>

        {/* 2. Central Content (Image + Bio) */}
        <div className="relative z-20 text-center max-w-2xl w-full flex flex-col items-center px-4">
          <img
            ref={imageRef}
            src="/profile.jpg"
            alt="Profile"
            className="w-64 h-64 object-cover mb-8 rounded-full shadow-2xl border-4 border-white/10 hover:scale-105 transition-transform duration-500 bg-[#111]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop";
            }}
          />

          <div ref={bioRef} className="flex flex-wrap justify-center gap-y-2 gap-x-1 text-center font-medium leading-relaxed appercase relative z-30 mix-blend-difference">
            {/* JS Injects Bio Here */}
          </div>
        </div>

      </section>
    </div>
  );
};

export default About;
