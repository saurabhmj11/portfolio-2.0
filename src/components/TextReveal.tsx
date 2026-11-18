import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { prefersReducedMotion } from '../hooks/useIdleReady';

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
    children: string;
    className?: string;
    el?: React.ElementType;
    delay?: number;
    threshold?: number;
    /**
     * Fade words in from transparent. Set false for above-the-fold headings so
     * they paint immediately (keeps Largest Contentful Paint fast) and only slide.
     */
    fade?: boolean;
}

const TextReveal: React.FC<TextRevealProps> = ({ children, className, el: Wrapper = 'p', delay = 0, threshold = 0.85, fade = true }) => {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        if (prefersReducedMotion()) return;
        const ctx = gsap.context(() => {
            const words = ref.current?.querySelectorAll('.word');
            if (words) {
                gsap.fromTo(words,
                    fade
                        ? { y: 100, opacity: 0, rotateX: 45 }
                        : { yPercent: 35, rotateX: 25 },
                    {
                        y: 0,
                        yPercent: 0,
                        opacity: 1,
                        rotateX: 0,
                        duration: 1.2,
                        ease: 'power3.out',
                        stagger: 0.05,
                        delay: delay,
                        scrollTrigger: {
                            trigger: ref.current,
                            start: `top ${threshold * 100}%`,
                            toggleActions: 'play none none none'
                        }
                    }
                );
            }
        }, ref);

        return () => ctx.revert();
    }, [delay, threshold, children, fade]);

    const words = children.split(" ");

    return (
        <Wrapper ref={ref as React.RefObject<HTMLParagraphElement>} className={`${className} overflow-hidden pt-[0.1em] pb-[0.2em] -mt-[0.1em] -mb-[0.2em]`}>
            {words.map((word, index) => (
                <span key={index} className="word inline-block mr-[0.25em] will-change-transform transform-gpu">
                    {word}
                </span>
            ))}
        </Wrapper>
    );
};

export default TextReveal;
