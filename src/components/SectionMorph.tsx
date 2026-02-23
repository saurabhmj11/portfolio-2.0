import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useIsMobile from '../hooks/useIsMobile';

gsap.registerPlugin(ScrollTrigger);

type MorphEffect = 'curtainWipe' | 'scaleReveal' | 'colorShift' | 'fadeOverlap';

interface SectionMorphProps {
    /** CSS selector or id of the outgoing (preceding) section */
    from: string;
    /** CSS selector or id of the incoming (following) section */
    to: string;
    /** Transition effect to apply */
    effect: MorphEffect;
    /** Optional background color to lerp towards (for colorShift) */
    toColor?: string;
}

/**
 * SectionMorph — Invisible GSAP-powered wrapper that creates fluid
 * transitions between adjacent sections as the user scrolls.
 *
 * Takes no visual space — it creates ScrollTrigger timelines
 * that animate the `from` and `to` sections during scroll overlap.
 *
 * Gracefully degrades on mobile and reduced-motion.
 */
const SectionMorph = ({ from, to, effect, toColor = '#020202' }: SectionMorphProps) => {
    const markerRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();

    useLayoutEffect(() => {
        // Skip on mobile for perf, and respect prefers-reduced-motion
        if (isMobile) return;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;

        const fromEl = document.querySelector(from) as HTMLElement;
        const toEl = document.querySelector(to) as HTMLElement;
        if (!fromEl || !toEl) return;

        const ctx = gsap.context(() => {
            switch (effect) {
                case 'curtainWipe': {
                    // Incoming section reveals via an animated clip-path
                    gsap.set(toEl, { clipPath: 'inset(100% 0 0 0)' });

                    ScrollTrigger.create({
                        trigger: markerRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1,
                        onUpdate: (self) => {
                            const p = self.progress;
                            // Outgoing fades + blurs out
                            gsap.set(fromEl, {
                                opacity: 1 - p * 0.6,
                                filter: `blur(${p * 6}px)`,
                            });
                            // Incoming reveals from bottom
                            gsap.set(toEl, {
                                clipPath: `inset(${100 - p * 100}% 0 0 0)`,
                            });
                        },
                        onLeaveBack: () => {
                            gsap.set(fromEl, { opacity: 1, filter: 'blur(0px)' });
                            gsap.set(toEl, { clipPath: 'inset(100% 0 0 0)' });
                        },
                        onLeave: () => {
                            gsap.set(fromEl, { opacity: 1, filter: 'blur(0px)' });
                            gsap.set(toEl, { clipPath: 'inset(0% 0 0 0)' });
                        },
                    });
                    break;
                }

                case 'scaleReveal': {
                    // Incoming section scales from 0.95 → 1.0 with slight parallax
                    gsap.set(toEl, { scale: 0.95, transformOrigin: 'center top' });

                    ScrollTrigger.create({
                        trigger: markerRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.2,
                        onUpdate: (self) => {
                            const p = self.progress;
                            gsap.set(toEl, { scale: 0.95 + p * 0.05 });
                            gsap.set(fromEl, {
                                y: `${p * -30}px`,
                                opacity: 1 - p * 0.3,
                            });
                        },
                        onLeaveBack: () => {
                            gsap.set(toEl, { scale: 0.95 });
                            gsap.set(fromEl, { y: '0px', opacity: 1 });
                        },
                        onLeave: () => {
                            gsap.set(toEl, { scale: 1 });
                            gsap.set(fromEl, { y: '0px', opacity: 1 });
                        },
                    });
                    break;
                }

                case 'colorShift': {
                    // Background color lerp between sections
                    ScrollTrigger.create({
                        trigger: markerRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1,
                        onUpdate: (self) => {
                            const p = self.progress;
                            toEl.style.opacity = String(0.6 + p * 0.4);
                            // Subtle background tint shift
                            fromEl.style.filter = `brightness(${1 - p * 0.15})`;
                        },
                        onLeaveBack: () => {
                            toEl.style.opacity = '1';
                            fromEl.style.filter = 'brightness(1)';
                        },
                        onLeave: () => {
                            toEl.style.opacity = '1';
                            fromEl.style.filter = 'brightness(1)';
                        },
                    });
                    break;
                }

                case 'fadeOverlap': {
                    // Outgoing fades + blurs as incoming slides over
                    ScrollTrigger.create({
                        trigger: markerRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 0.8,
                        onUpdate: (self) => {
                            const p = self.progress;
                            gsap.set(fromEl, {
                                opacity: 1 - p * 0.5,
                                scale: 1 - p * 0.02,
                                filter: `blur(${p * 4}px)`,
                            });
                        },
                        onLeaveBack: () => {
                            gsap.set(fromEl, { opacity: 1, scale: 1, filter: 'blur(0px)' });
                        },
                        onLeave: () => {
                            gsap.set(fromEl, { opacity: 1, scale: 1, filter: 'blur(0px)' });
                        },
                    });
                    break;
                }
            }
        });

        return () => ctx.revert();
    }, [from, to, effect, toColor, isMobile]);

    // Invisible marker div — only purpose is to give ScrollTrigger a trigger point
    return (
        <div
            ref={markerRef}
            className="relative w-full pointer-events-none"
            style={{ height: '30vh', marginTop: '-15vh', marginBottom: '-15vh' }}
            aria-hidden="true"
        />
    );
};

export default SectionMorph;
