import { ReactLenis } from '@studio-freight/react-lenis';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useIsMobile from '../hooks/useIsMobile';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
    children: React.ReactNode;
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
    const lenisRef = useRef<any>(null);
    const isMobile = useIsMobile();
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const listener = () => setPrefersReducedMotion(mediaQuery.matches);
        mediaQuery.addEventListener('change', listener);
        return () => mediaQuery.removeEventListener('change', listener);
    }, []);

    const shouldDisable = isMobile || prefersReducedMotion;

    useEffect(() => {
        if (shouldDisable) return;

        const update = (time: number, deltaTime: number, frame: number) => {
            lenisRef.current?.lenis?.raf(time * 1000);
        };

        gsap.ticker.add(update);

        return () => {
            gsap.ticker.remove(update);
        };
    }, [shouldDisable]);

    if (shouldDisable) {
        return <>{children}</>;
    }

    return (
        <ReactLenis
            root
            ref={lenisRef}
            autoRaf={false}
            options={{
                lerp: 0.07,
                duration: 1.2,
                smoothWheel: true,
                wheelMultiplier: 1.2,
                touchMultiplier: 2,
            }}
        >
            <div style={{ position: 'relative' }}>
                {children}
            </div>
        </ReactLenis>
    );
};

export default SmoothScroll;
