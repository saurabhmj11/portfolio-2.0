class SoundManager {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private initialized: boolean = false;

    constructor() {
        // Lazy init on first user interaction to handle autoplay policies
        if (typeof window !== 'undefined') {
            window.addEventListener('click', () => this.init(), { once: true });
            window.addEventListener('keydown', () => this.init(), { once: true });
        }
    }

    private init() {
        if (this.initialized) return;

        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            this.ctx = new AudioContextClass();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.3; // Low volume by default
            this.masterGain.connect(this.ctx.destination);
            this.initialized = true;
        } catch {
            console.error("AudioContext not supported");
        }
    }

    // Short, high-pitched bleep for hover
    playHover() {
        if (!this.initialized || !this.ctx || !this.masterGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    // Standard UI click
    playClick() {
        if (!this.initialized || !this.ctx || !this.masterGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    // Mechanical click for typing
    playTyping() {
        if (!this.initialized || !this.ctx || !this.masterGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        // Noise-like click
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.03);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.03);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.03);
    }

    // Success chime/chord
    playSuccess() {
        if (!this.initialized || !this.ctx || !this.masterGain) return;

        [440, 554, 659].forEach((freq, i) => { // A Major chord
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();

            osc.connect(gain);
            gain.connect(this.masterGain!);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + (i * 0.05));

            gain.gain.setValueAtTime(0.1, this.ctx!.currentTime + (i * 0.05));
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + 0.5);

            osc.start(this.ctx!.currentTime + (i * 0.05));
            osc.stop(this.ctx!.currentTime + 0.5);
        });
    }

    // Error buzz
    playError() {
        if (!this.initialized || !this.ctx || !this.masterGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    }
}

export const soundManager = new SoundManager();
