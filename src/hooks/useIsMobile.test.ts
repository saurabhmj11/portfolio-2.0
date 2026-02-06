import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import useIsMobile from './useIsMobile';

describe('useIsMobile', () => {
    // Helper to mock window resize
    const resizeWindow = (width: number) => {
        window.innerWidth = width;
        window.dispatchEvent(new Event('resize'));
    };

    it('should return false by default (or desktop width)', () => {
        resizeWindow(1024);
        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(false);
    });

    it('should return true when width is <= 768', () => {
        resizeWindow(500);
        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(true);
    });

    it('should update when window resizes', () => {
        resizeWindow(1024);
        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(false);

        act(() => {
            resizeWindow(500);
        });
        expect(result.current).toBe(true);
    });
});
