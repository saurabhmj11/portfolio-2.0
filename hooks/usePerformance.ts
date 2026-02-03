import { useState, useEffect, useRef } from 'react';

const usePerformance = () => {
    const [fps, setFps] = useState(60);
    const [memory, setMemory] = useState<{ used: number; total: number } | null>(null);
    const [fpsHistory, setFpsHistory] = useState<number[]>(new Array(30).fill(60)); // Buffer for sparkline

    const framesRef = useRef(0);
    const prevTimeRef = useRef(performance.now());
    const requestRef = useRef<number>();

    useEffect(() => {
        const loop = () => {
            const time = performance.now();
            framesRef.current++;

            if (time >= prevTimeRef.current + 1000) {
                const currentFps = Math.round((framesRef.current * 1000) / (time - prevTimeRef.current));

                setFps(currentFps);
                setFpsHistory(prev => {
                    const newHistory = [...prev.slice(1), currentFps];
                    return newHistory;
                });

                framesRef.current = 0;
                prevTimeRef.current = time;

                // Memory Check (Chrome only)
                if ((performance as any).memory) {
                    const mem = (performance as any).memory;
                    setMemory({
                        used: Math.round(mem.usedJSHeapSize / 1024 / 1024),
                        total: Math.round(mem.jsHeapSizeLimit / 1024 / 1024)
                    });
                }
            }

            requestRef.current = requestAnimationFrame(loop);
        };

        requestRef.current = requestAnimationFrame(loop);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return { fps, memory, fpsHistory };
};

export default usePerformance;
