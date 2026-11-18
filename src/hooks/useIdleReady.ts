import { useEffect, useState } from 'react';

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/**
 * Returns true once the page has loaded and the main thread is idle.
 * Use it to defer non-essential UI (cursor effects, chat, terminal, PWA prompt)
 * so it never competes with first paint or blocks input on slow phones.
 */
export function useIdleReady(timeout = 2500): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const w = window as IdleWindow;
    let idleId: number | undefined;
    let timerId: number | undefined;

    const schedule = () => {
      if (w.requestIdleCallback) {
        idleId = w.requestIdleCallback(() => setReady(true), { timeout });
      } else {
        timerId = window.setTimeout(() => setReady(true), 1200);
      }
    };

    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });

    return () => {
      window.removeEventListener('load', schedule);
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timerId !== undefined) clearTimeout(timerId);
    };
  }, [timeout]);

  return ready;
}

/** Whether the visitor asked the OS to minimise motion. */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}
