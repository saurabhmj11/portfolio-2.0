import { useEffect, useRef, useCallback } from 'react';

/**
 * useWebGLBudget
 *
 * Pauses/resumes a Three.js WebGLRenderer when its host element
 * enters/leaves the viewport. This prevents multiple simultaneous
 * WebGL contexts from competing for the GPU budget, which causes
 * "Context Lost" crashes when scrolling between 3D sections.
 *
 * Usage:
 *   const { mountRef, pauseRenderer, resumeRenderer } = useWebGLBudget(renderer);
 *
 * Simply attach `mountRef` to the container div of your Three.js canvas.
 * The hook will automatically stop the render loop when invisible and
 * restart it when the element re-enters the viewport.
 */

interface ThreeRenderer {
  setAnimationLoop: (callback: ((time: number) => void) | null) => void;
  dispose?: () => void;
}

interface UseWebGLBudgetOptions {
  /** Margin around the root — positive = preload before visible */
  rootMargin?: string;
  /** Fraction of the element that must be visible to activate */
  threshold?: number;
}

export const useWebGLBudget = (
  renderer: ThreeRenderer | null | undefined,
  animationLoop: ((time: number) => void) | null,
  options: UseWebGLBudgetOptions = {}
) => {
  const { rootMargin = '100px', threshold = 0 } = options;
  const mountRef = useRef<HTMLDivElement>(null);
  const isActiveRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const pauseRenderer = useCallback(() => {
    if (!renderer || !isActiveRef.current) return;
    renderer.setAnimationLoop(null);
    isActiveRef.current = false;
  }, [renderer]);

  const resumeRenderer = useCallback(() => {
    if (!renderer || isActiveRef.current || !animationLoop) return;
    renderer.setAnimationLoop(animationLoop);
    isActiveRef.current = true;
  }, [renderer, animationLoop]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el || !renderer) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            resumeRenderer();
          } else {
            pauseRenderer();
          }
        }
      },
      { rootMargin, threshold }
    );

    observerRef.current.observe(el);

    return () => {
      observerRef.current?.disconnect();
      pauseRenderer();
    };
  }, [renderer, animationLoop, rootMargin, threshold, pauseRenderer, resumeRenderer]);

  return { mountRef, pauseRenderer, resumeRenderer };
};

/**
 * WebGL Context Budget — Global Singleton
 *
 * Tracks active WebGL canvases site-wide. When more than MAX_CONTEXTS
 * are active simultaneously, older ones are paused automatically.
 * This prevents the browser from hitting its WebGL context limit (~8–16).
 */

const MAX_CONTEXTS = 3;
type ContextEntry = { id: string; pause: () => void; resume: () => void; active: boolean };
const contextRegistry: ContextEntry[] = [];

export const registerWebGLContext = (entry: ContextEntry) => {
  contextRegistry.push(entry);
  enforceWebGLBudget();
};

export const unregisterWebGLContext = (id: string) => {
  const idx = contextRegistry.findIndex(e => e.id === id);
  if (idx !== -1) contextRegistry.splice(idx, 1);
};

export const markWebGLContextVisible = (id: string) => {
  const entry = contextRegistry.find(e => e.id === id);
  if (!entry) return;
  entry.active = true;
  enforceWebGLBudget();
};

export const markWebGLContextHidden = (id: string) => {
  const entry = contextRegistry.find(e => e.id === id);
  if (!entry) return;
  entry.active = false;
  entry.pause();
};

const enforceWebGLBudget = () => {
  const active = contextRegistry.filter(e => e.active);
  if (active.length <= MAX_CONTEXTS) {
    // All active contexts can run
    active.forEach(e => e.resume());
    return;
  }
  // Too many — pause oldest beyond budget
  active.slice(0, active.length - MAX_CONTEXTS).forEach(e => e.pause());
  active.slice(active.length - MAX_CONTEXTS).forEach(e => e.resume());
};

export default useWebGLBudget;
