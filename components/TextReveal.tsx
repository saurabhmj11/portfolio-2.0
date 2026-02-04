import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
    children: string;
    className?: string;
    el?: keyof JSX.IntrinsicElements;
    delay?: number;
    threshold?: number;
}

const TextReveal: React.FC<TextRevealProps> = ({ children, className, el: Wrapper = 'p', delay = 0, threshold = 0.85 }) => {
    const ref = useRef<HTMLElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const words = ref.current?.querySelectorAll('.word');
            if (words) {
                gsap.fromTo(words,
                    {
                        y: 100,
                        opacity: 0,
                        rotateX: 45
                    },
                    {
                        y: 0,
                        opacity: 1,
                        rotateX: 0,
                        duration: 1.2,
                        ease: 'power3.out',
                        stagger: 0.05,
                        delay: delay,
                        scrollTrigger: {
                            trigger: ref.current,
                            start: `top ${threshold * 100}%`,
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            }
        }, ref);

        return () => ctx.revert();
    }, [delay, threshold, children]);

    const words = children.split(" ");

    return (
        <Wrapper ref={ref} className={`${className} overflow-hidden leading-tight`}>
            {words.map((word, index) => (
                <span key={index} className="word inline-block mr-[0.25em] will-change-transform transform-gpu">
                    {word}
                </span>
            ))}
        </Wrapper>
    );
};

export default TextReveal;
