import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
type SectionName = 'hero' | 'about' | 'skills' | 'services' | 'experience' | 'projects' | 'contact' | 'footer';

interface AudioContextType {
    isPlaying: boolean;
    isMuted: boolean;
    toggleMute: () => void;
    playSectionChime: (section: SectionName) => void;
    playHoverTick: () => void;
    playClickPop: () => void;
}

const AudioCtx = createContext<AudioContextType | undefined>(undefined);

// ─── Section Chime Frequencies (musical, C major pentatonic) ─────────────────
const SECTION_NOTES: Record<SectionName, number> = {
    hero: 523.25,       // C5
    about: 587.33,      // D5
    skills: 659.25,     // E5
    services: 783.99,   // G5
    experience: 880.00, // A5
    projects: 1046.50,  // C6
    contact: 1174.66,   // D6
    footer: 1318.51,    // E6
};

// ─── Provider ────────────────────────────────────────────────────────────────
export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMuted, setIsMuted] = useState(true); // Respect browser autoplay rules
    const [isPlaying, setIsPlaying] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const droneRef = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);
    const playedSections = useRef<Set<SectionName>>(new Set());

    // Lazy-initialize Web Audio context (requires user gesture)
    const getAudioCtx = useCallback(() => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
    }, []);

    // ── Ambient Drone ──────────────────────────────────────────────────────────
    const startDrone = useCallback(() => {
        if (droneRef.current) return;
        const ctx = getAudioCtx();

        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(65.41, ctx.currentTime); // C2 — very low, subliminal

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 2); // Fade in over 2s

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        droneRef.current = { osc, gain };
        setIsPlaying(true);
    }, [getAudioCtx]);

    const stopDrone = useCallback(() => {
        if (!droneRef.current) return;
        const { osc, gain } = droneRef.current;
        const ctx = audioCtxRef.current;
        if (ctx) {
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
            setTimeout(() => {
                osc.stop();
                osc.disconnect();
                gain.disconnect();
            }, 600);
        }
        droneRef.current = null;
        setIsPlaying(false);
    }, []);

    // ── Toggle Mute ────────────────────────────────────────────────────────────
    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            const next = !prev;
            if (!next) {
                startDrone(); // Unmuting → start drone
            } else {
                stopDrone(); // Muting → stop drone
                playedSections.current.clear();
            }
            return next;
        });
    }, [startDrone, stopDrone]);

    // ── Section Chime (short resonant tone, plays once per section) ────────────
    const playSectionChime = useCallback((section: SectionName) => {
        if (isMuted) return;
        if (playedSections.current.has(section)) return;
        playedSections.current.add(section);

        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(SECTION_NOTES[section], ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.8);
    }, [isMuted, getAudioCtx]);

    // ── Hover Tick (white noise burst, very soft) ──────────────────────────────
    const playHoverTick = useCallback(() => {
        if (isMuted) return;
        const ctx = getAudioCtx();

        const bufferSize = ctx.sampleRate * 0.02; // 20ms
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.3;
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

        source.connect(gain);
        gain.connect(ctx.destination);
        source.start();
    }, [isMuted, getAudioCtx]);

    // ── Click Pop (sharper tick for button clicks) ─────────────────────────────
    const playClickPop = useCallback(() => {
        if (isMuted) return;
        const ctx = getAudioCtx();

        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.06);
    }, [isMuted, getAudioCtx]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopDrone();
            if (audioCtxRef.current) {
                audioCtxRef.current.close();
            }
        };
    }, [stopDrone]);

    return (
        <AudioCtx.Provider value={{ isPlaying, isMuted, toggleMute, playSectionChime, playHoverTick, playClickPop }}>
            {children}
        </AudioCtx.Provider>
    );
};

export const useAudioDirector = () => {
    const context = useContext(AudioCtx);
    if (context === undefined) {
        throw new Error('useAudioDirector must be used within an AudioProvider');
    }
    return context;
};
