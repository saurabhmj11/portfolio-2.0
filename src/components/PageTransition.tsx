import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { usePresence } from 'framer-motion';

const COLUMNS = 6;

interface PageTransitionProps {
    children: React.ReactNode;
    label?: string;
}

const PageTransition = ({ children, label = '' }: PageTransitionProps) => {
    const container = useRef<HTMLDivElement>(null);
    const [isPresent, safeToRemove] = usePresence();

    useEffect(() => {
        if (!container.current) return;

        const ctx = gsap.context(() => {
            if (!container.current) return;
            const columns1 = gsap.utils.toArray('.transition-col-1', container.current);
            const columns2 = gsap.utils.toArray('.transition-col-2', container.current);
            const labelEl = container.current.querySelector('.transition-label');
            const contentEl = container.current.querySelector('.transition-content');

            if (isPresent) {
                // ENTER ANIMATION
                const tl = gsap.timeline();
                
                // Set initial states for enter
                gsap.set([columns1, columns2], { transformOrigin: 'top', scaleY: 1 });
                if (labelEl) gsap.set(labelEl, { opacity: 0, y: 20 });
                if (contentEl) gsap.set(contentEl, { clipPath: 'inset(100% 0 0 0)', opacity: 0 });

                // Animate
                if (labelEl) {
                    tl.to(labelEl, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 0.15)
                      .to(labelEl, { opacity: 0, duration: 0.3 }, "+=0.2");
                }

                tl.to(columns1, {
                    scaleY: 0,
                    duration: 0.7,
                    stagger: 0.04,
                    ease: "power4.inOut"
                }, 0);

                tl.to(columns2, {
                    scaleY: 0,
                    duration: 0.7,
                    stagger: 0.04,
                    ease: "power4.inOut"
                }, 0.1);

                if (contentEl) {
                    tl.to(contentEl, {
                        clipPath: 'inset(0% 0 0 0)',
                        opacity: 1,
                        duration: 0.65,
                        ease: 'power3.out'
                    }, 0.35);
                }

            } else {
                // EXIT ANIMATION
                const tl = gsap.timeline({ onComplete: () => safeToRemove && safeToRemove() });
                
                gsap.set([columns1, columns2], { transformOrigin: 'bottom' });

                if (contentEl) {
                    tl.to(contentEl, {
                        opacity: 0,
                        scale: 0.99,
                        filter: 'blur(4px)',
                        duration: 0.4,
                        ease: 'power3.inOut'
                    }, 0);
                }

                if (labelEl) {
                    tl.to(labelEl, { opacity: 1, y: 0, duration: 0.25 }, 0);
                }

                tl.to(columns2, {
                    scaleY: 1,
                    duration: 0.55,
                    stagger: -0.04,
                    ease: "power4.inOut"
                }, 0);

                tl.to(columns1, {
                    scaleY: 1,
                    duration: 0.55,
                    stagger: -0.04,
                    ease: "power4.inOut"
                }, 0.1);
            }
        }, container);

        return () => ctx.revert();
    }, [isPresent, safeToRemove]);

    return (
        <div ref={container} className="page-transition-wrapper w-full relative">

            {/* ── Multi-layer curtain columns ── */}
            <div className="fixed inset-0 z-[9997] pointer-events-none flex h-full w-full">
                {Array.from({ length: COLUMNS }).map((_, i) => (
                    <div
                        key={`layer1-${i}`}
                        className="transition-col-1 h-full w-full bg-neon-purple relative"
                    />
                ))}
            </div>
            <div className="fixed inset-0 z-[9998] pointer-events-none flex h-full w-full">
                {Array.from({ length: COLUMNS }).map((_, i) => (
                    <div
                        key={`layer2-${i}`}
                        className="transition-col-2 h-full w-full bg-[#030305] relative"
                    />
                ))}
            </div>

            {/* ── Centered label overlay (shows during transition) ── */}
            {label && (
                <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center">
                    <span className="transition-label font-display font-black text-white text-[10vw] uppercase tracking-tighter leading-none select-none opacity-0">
                        {label}
                    </span>
                </div>
            )}

            {/* ── Page content — clip-path reveal from bottom ── */}
            <div className="transition-content">
                {children}
            </div>
        </div>
    );
};

export default PageTransition;
