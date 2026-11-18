import React, { Suspense, useEffect, useState } from 'react';
import Hero from '../components/Hero';
import { MOUNT_ALL_SECTIONS_EVENT } from '../utils/scrollToSection';

// Invisible fallback — each section fades in independently when its chunk is ready.
// No spinning loader blocks the viewport; sections simply appear as they load.
const SilentFallback = () => <div aria-hidden="true" />;

// Lazy load every below-the-fold component individually so each chunk loads
// independently — no one slow chunk blocks all the others.
const About               = React.lazy(() => import('../components/About'));
const Skills              = React.lazy(() => import('../components/Skills'));
const Services            = React.lazy(() => import('../components/Services'));
const BackgroundFlow      = React.lazy(() => import('../components/BackgroundFlow'));
const Experience          = React.lazy(() => import('../components/Experience'));
const Projects            = React.lazy(() => import('../components/Projects'));
const Blog                = React.lazy(() => import('../components/Blog'));
const Workflow            = React.lazy(() => import('../components/Workflow'));
const LangGraphInteractive = React.lazy(() => import('../components/LangGraphInteractive'));
const Contact             = React.lazy(() => import('../components/Contact'));

// Narrative: proof → who → what → how → writing → contact.
// Order matters: sections mount top-down.
// Proof first: the work sits directly under the hero (owner's choice, 2026-11-16).
const SECTIONS: React.ComponentType[] = [
    BackgroundFlow,
    Projects,
    Experience,
    About,
    Skills,
    Services,
    Workflow,
    LangGraphInteractive,
    Blog,
    Contact,
];

type IdleWindow = Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
};

/**
 * Mount below-the-fold sections one per idle period instead of all at once.
 * Rendering ten heavy sections in one go produced multi-second main-thread
 * blocks on mid-range phones; spreading them out keeps the page responsive.
 * A deep link (#projects) or a nav click mounts everything immediately.
 */
function useProgressiveCount(total: number): number {
    const [count, setCount] = useState(() =>
        typeof window !== 'undefined' && window.location.hash ? total : 0
    );

    useEffect(() => {
        const mountAll = () => setCount(total);
        window.addEventListener(MOUNT_ALL_SECTIONS_EVENT, mountAll);
        return () => window.removeEventListener(MOUNT_ALL_SECTIONS_EVENT, mountAll);
    }, [total]);

    useEffect(() => {
        if (count >= total) return;
        const w = window as IdleWindow;
        const next = () => setCount(c => Math.min(c + 1, total));
        if (w.requestIdleCallback) {
            const id = w.requestIdleCallback(next, { timeout: 600 });
            return () => w.cancelIdleCallback?.(id);
        }
        const id = window.setTimeout(next, 60);
        return () => clearTimeout(id);
    }, [count, total]);

    return count;
}

const Home = () => {
    const mounted = useProgressiveCount(SECTIONS.length);

    return (
        <main className="relative w-full">
            <div className="relative z-10">
                {/* Hero is always synchronous — it IS the first paint */}
                <Hero />

                {SECTIONS.slice(0, mounted).map((Section, i) => (
                    <Suspense key={i} fallback={<SilentFallback />}>
                        <Section />
                    </Suspense>
                ))}
            </div>
        </main>
    );
};

export default Home;
