import { motion } from 'framer-motion';
import { useAudioDirector } from '../context/AudioContext';
import { Volume2, VolumeX } from 'lucide-react';
import useIsMobile from '../hooks/useIsMobile';

const AudioVisualizer = () => {
    const { isPlaying, isMuted, toggleMute } = useAudioDirector();
    const isMobile = useIsMobile();

    // Do not render the big visualizer on mobile to save screen real estate,
    // or render a highly minimized version. For now, we'll render a small toggle.
    if (isMobile) {
        return (
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
                onClick={toggleMute}
                className="fixed bottom-4 left-4 z-[100] bg-black/50 backdrop-blur-md border border-white/10 p-3 rounded-full text-white/50 hover:text-white transition-colors"
                aria-label="Toggle AI Director Audio"
            >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </motion.button>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2, duration: 1 }}
            className="fixed bottom-8 left-8 z-[100] flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 hover:bg-black/60 transition-colors cursor-pointer group"
            onClick={toggleMute}
            role="button"
            aria-label="Toggle AI Voice Director"
        >
            <div className="flex items-center gap-1 h-6 w-8">
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`w-1 rounded-full ${isMuted ? 'bg-red-500/50' : 'bg-cyan-400'}`}
                        animate={{
                            height: isPlaying && !isMuted
                                ? ["20%", "100%", "40%", "80%", "20%"]
                                : "20%" // Flat line when not playing
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                            delay: i * 0.15
                        }}
                        style={{
                            boxShadow: isPlaying && !isMuted ? '0 0 8px rgba(34, 211, 238, 0.6)' : 'none'
                        }}
                    />
                ))}
            </div>

            <div className="flex flex-col">
                <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase leading-none">
                    AI Director
                </span>
                <span className={`text-xs font-bold leading-none mt-1 transition-colors ${isPlaying && !isMuted ? 'text-cyan-400' : 'text-gray-600'}`}>
                    {isMuted ? 'MUTED' : (isPlaying ? 'SPEAKING' : 'STANDBY')}
                </span>
            </div>

            <div className="ml-2 text-gray-500 group-hover:text-white transition-colors">
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </div>
        </motion.div>
    );
};

export default AudioVisualizer;
