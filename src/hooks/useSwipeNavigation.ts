import { useEffect, useRef } from 'react';

const SECTION_IDS = ['home', 'about', 'services', 'projects', 'contact'];
const MIN_SWIPE_PX = 60;
const THROTTLE_MS = 800;

/**
 * useSwipeNavigation
 *
 * Registers touch listeners that detect up/down swipes and smoothly
 * scroll to the next/previous section. Safe to use in parallel with
 * normal page scrolling — uses touchstart/touchend, not touchmove.
 *
 * Only active on mobile (pointer: coarse).
 */
const useSwipeNavigation = () => {
    const lastFireRef = useRef(0);
    const touchStartY = useRef(0);

    useEffect(() => {
        const isTouch = window.matchMedia('(pointer: coarse)').matches;
        if (!isTouch) return;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartY.current = e.changedTouches[0].clientY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const now = Date.now();
            if (now - lastFireRef.current < THROTTLE_MS) return;

            const endY = e.changedTouches[0].clientY;
            const delta = touchStartY.current - endY; // positive = swipe up
            if (Math.abs(delta) < MIN_SWIPE_PX) return;

            const direction = delta > 0 ? 1 : -1; // 1 = next, -1 = prev

            // Find current active section
            let currentIdx = 0;
            let minDist = Infinity;
            SECTION_IDS.forEach((id, i) => {
                const el = document.getElementById(id);
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const dist = Math.abs(rect.top);
                if (dist < minDist) {
                    minDist = dist;
                    currentIdx = i;
                }
            });

            const nextIdx = Math.max(0, Math.min(SECTION_IDS.length - 1, currentIdx + direction));
            const target = document.getElementById(SECTION_IDS[nextIdx]);
            if (target && nextIdx !== currentIdx) {
                lastFireRef.current = now;
                target.scrollIntoView({ behavior: 'smooth' });
            }
        };

        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);
};

export default useSwipeNavigation;
