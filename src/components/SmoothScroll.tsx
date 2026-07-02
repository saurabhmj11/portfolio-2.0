import React from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
    children: React.ReactNode;
}

// Minimal shape of the Lenis instance we actually use.
// Named LenisHandle (not LenisRef) to avoid collision with the
// package's own exported LenisRef type.
interface LenisHandle {
    scroll: number;
    raf: (time: number) => void;
    scrollTo: (target: number | string | HTMLElement, opts?: { immediate?: boolean }) => void;
    on: (event: string, cb: () => void) => void;
}

interface ReactLenisRef {
    lenis: LenisHandle | null;
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenisRef = useRef<any>(null);  // `any` needed: ReactLenis generic ref type conflicts with our shape
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        const listener = () => setPrefersReducedMotion(mediaQuery.matches);
        mediaQuery.addEventListener('change', listener);
        return () => mediaQuery.removeEventListener('change', listener);
    }, []);

    // Smooth Lenis scroll on both desktop and mobile.
    const useLenis = !prefersReducedMotion;

    // ── Lenis → GSAP ticker bridge (desktop only) ───────────────────────────
    useEffect(() => {
        if (!useLenis) return;

        const update = (time: number) => {
            (lenisRef.current as ReactLenisRef | null)?.lenis?.raf(time * 1000);
        };

        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(update);
        };
    }, [useLenis]);

    // ── ScrollerProxy: tell GSAP where the scroll position lives ────────────
    // On desktop this is Lenis; on mobile GSAP reads window directly (default).
    useEffect(() => {
        if (!useLenis) {
            // Mobile: ensure GSAP uses native window scroll (clear any proxy)
            ScrollTrigger.clearScrollMemory();
            ScrollTrigger.refresh();
            return;
        }

        const timeout = setTimeout(() => {
            const lenis = (lenisRef.current as ReactLenisRef | null)?.lenis;
            if (!lenis) return;

            ScrollTrigger.scrollerProxy(document.documentElement, {
                scrollTop(value?: number) {
                    if (value !== undefined) {
                        lenis.scrollTo(value, { immediate: true });
                    }
                    return lenis.scroll;
                },
                getBoundingClientRect() {
                    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
                },
                pinType: 'transform',
            });

            lenis.on('scroll', ScrollTrigger.update);
            ScrollTrigger.refresh();
        }, 200);

        return () => clearTimeout(timeout);
    }, [useLenis]);

    // ── Section Ambient Color Morphing ──────────────────────────────────────
    // Each section can declare data-ambient-hue="<number>" to set a scroll-driven
    // background hue that smoothly transitions via a CSS variable on <html>.
    useEffect(() => {
        // Inject base CSS transition on the root once
        const root = document.documentElement;
        root.style.setProperty('--ambient-hue', '230');
        root.style.setProperty('--ambient-sat', '15%');
        root.style.setProperty('--ambient-lit', '4%');

        // Wait for DOM to settle
        const timer = setTimeout(() => {
            const sections = Array.from(
                document.querySelectorAll<HTMLElement>('[data-ambient-hue]')
            );
            if (!sections.length) return;

            const triggers = sections.map(section => {
                const hue = section.dataset.ambientHue ?? '230';
                const sat = section.dataset.ambientSat ?? '15%';
                const lit = section.dataset.ambientLit ?? '4%';

                return ScrollTrigger.create({
                    trigger: section,
                    start: 'top 60%',
                    end: 'bottom 40%',
                    onEnter: () => {
                        root.style.setProperty('--ambient-hue', hue);
                        root.style.setProperty('--ambient-sat', sat);
                        root.style.setProperty('--ambient-lit', lit);
                    },
                    onEnterBack: () => {
                        root.style.setProperty('--ambient-hue', hue);
                        root.style.setProperty('--ambient-sat', sat);
                        root.style.setProperty('--ambient-lit', lit);
                    },
                });
            });

            return () => triggers.forEach(t => t.kill());
        }, 600);

        return () => clearTimeout(timer);
    }, []);

    if (!useLenis) {
        // Mobile / reduced-motion: plain wrapper, GSAP ScrollTrigger still active
        return <div style={{ position: 'relative' }}>{children}</div>;
    }

    return (
        <ReactLenis
            root
            ref={lenisRef}
            autoRaf={false}
            options={{
                lerp: 0.07,
                duration: 1.5,
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 1.5,
                syncTouch: true,
                syncTouchLerp: 0.08,
                touchInertiaMultiplier: 35,
            }}
        >
            <div style={{ position: 'relative' }}>
                {children}
            </div>
        </ReactLenis>
    );
};

export default SmoothScroll;
