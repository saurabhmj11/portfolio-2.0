import { useCallback, useRef, useEffect } from 'react';

// A lightweight Web Audio API synthesizer for UI interactions
// Creating premium ticking/clicking/whooshing sounds without any assets

export const useSound = () => {
    const audioCtxRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        // Only initialize on first user interaction to comply with browser autoplay policies
        const initAudio = () => {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
            }
        };
        window.addEventListener('click', initAudio, { once: true });
        window.addEventListener('keydown', initAudio, { once: true });
        return () => {
            window.removeEventListener('click', initAudio);
            window.removeEventListener('keydown', initAudio);
        };
    }, []);

    const playHover = useCallback(() => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;

        // Very subtle, crisp high-frequency tick for hovering
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);

        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01); // Very quiet
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.05);
    }, []);

    const playClick = useCallback(() => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;

        // Deeper, punchy thud/click for pressing buttons
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01); // Louder
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
    }, []);

    const playSuccess = useCallback(() => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;

        // Multi-tone electronic success chime
        const tones = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        tones.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
            
            gainNode.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
            gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * 0.1 + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.2);

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc.start(ctx.currentTime + i * 0.1);
            osc.stop(ctx.currentTime + i * 0.1 + 0.2);
        });
    }, []);

    return { playHover, playClick, playSuccess };
};
