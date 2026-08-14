import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useIsMobile from '../hooks/useIsMobile';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    className?: string;
    threshold?: number;
}

const ScrollReveal = ({
    children,
    width = "fit-content",
    delay = 0,
    className = "",
    threshold = 0.2
}: ScrollRevealProps) => {
    const isMobile = useIsMobile();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(el,
                { 
                    opacity: 0, 
                    y: isMobile ? 12 : 24 
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: isMobile ? 0.5 : 0.65,
                    ease: 'power3.out',
                    delay: delay,
                    scrollTrigger: {
                        trigger: el,
                        start: `top ${100 - (threshold * 100)}%`, // equivalent to threshold
                        toggleActions: 'play none none none',
                        once: true,
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [isMobile, delay, threshold]);

    return (
        <div 
            ref={containerRef} 
            className={className}
            style={{ width, willChange: 'transform, opacity' }}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
