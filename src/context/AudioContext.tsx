import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

type AudioTrack = 'hero-intro' | 'projects-intro' | 'skills-intro' | 'contact-intro';

interface AudioContextType {
    isPlaying: boolean;
    isMuted: boolean;
    currentTrack: AudioTrack | null;
    playTrack: (track: AudioTrack) => void;
    toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true); // Default to muted to respect browser autoplay rules
    const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize the audio element once
    useEffect(() => {
        audioRef.current = new Audio();

        const handleEnded = () => setIsPlaying(false);
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audioRef.current.addEventListener('ended', handleEnded);
        audioRef.current.addEventListener('play', handlePlay);
        audioRef.current.addEventListener('pause', handlePause);

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('ended', handleEnded);
                audioRef.current.removeEventListener('play', handlePlay);
                audioRef.current.removeEventListener('pause', handlePause);
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Handle Mute toggle
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
            if (isMuted && isPlaying) {
                // If they mute while talking, we can optionally pause it
                audioRef.current.pause();
            } else if (!isMuted && currentTrack && !isPlaying) {
                // Try resuming if unmuted, though browsers might block without interaction
                audioRef.current.play().catch(() => { });
            }
        }
    }, [isMuted, isPlaying, currentTrack]);

    const playTrack = (track: AudioTrack) => {
        if (!audioRef.current || isMuted) return;

        // If the same track is requested, just log or ignore
        if (currentTrack === track && isPlaying) return;

        // Fade out existing audio logic could go here; for now, hard stop and swap
        audioRef.current.pause();

        // Define the audio paths. We expect the user to place these in /public/audio/
        const audioSrc = `/audio/${track}.mp3`;

        audioRef.current.src = audioSrc;
        audioRef.current.load();

        // Attempt to play (browsers require user interaction first, so this might fail on initial load)
        audioRef.current.play()
            .then(() => {
                setCurrentTrack(track);
            })
            .catch((err) => {
                console.warn(`Audio playback blocked or file missing for ${track}:`, err);
                // Fallback to Web Audio API Synth if file is missing
                playFallbackSynth(track);
            });
    };

    const playFallbackSynth = (track: AudioTrack) => {
        // Fallback synth is temporarily disabled at user request.
        // It will remain silent until MP3 files are added.
        setIsPlaying(false);
        return;
    };

    const toggleMute = () => setIsMuted(prev => !prev);

    return (
        <AudioContext.Provider value={{ isPlaying, isMuted, currentTrack, playTrack, toggleMute }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudioDirector = () => {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudioDirector must be used within an AudioProvider');
    }
    return context;
};
