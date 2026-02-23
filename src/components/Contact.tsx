import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Mail, MapPin } from 'lucide-react';
import Magnetic from './Magnetic';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import { useAudioDirector } from '../context/AudioContext';
import ScrambleText from './ScrambleText';

// ─── Matrix Rain Canvas ────────────────────────────────────────────────────────

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = 'アイウエオカキクケコサシスセソ01アバカラマナハ';
    const fontSize = 11;
    let cols = Math.floor(canvas.width / fontSize);
    let drops = Array(cols).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(2,2,2,0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;
      cols = Math.floor(canvas.width / fontSize);
      if (drops.length !== cols) drops = Array(cols).fill(1);

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const alpha = 0.04 + Math.random() * 0.08;
        ctx.fillStyle = `rgba(139,92,246,${alpha})`; // purple tinted
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 55);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full rounded-3xl pointer-events-none opacity-100"
    />
  );
};

// ─── Typewriter Placeholder Hook ─────────────────────────────────────────────

const useTypewriterPlaceholder = (phrases: string[], active: boolean) => {
  const [placeholder, setPlaceholder] = useState(phrases[0]);
  const phraseIdx = useRef(0);
  const charIdx = useRef(0);
  const deleting = useRef(false);
  const rafRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (active) return; // don't animate while user is focused

    const tick = () => {
      const current = phrases[phraseIdx.current];
      if (!deleting.current) {
        charIdx.current++;
        setPlaceholder(current.slice(0, charIdx.current) + '█');
        if (charIdx.current === current.length) {
          deleting.current = true;
          rafRef.current = setTimeout(tick, 1800);
          return;
        }
      } else {
        charIdx.current--;
        setPlaceholder(current.slice(0, charIdx.current) + '█');
        if (charIdx.current === 0) {
          deleting.current = false;
          phraseIdx.current = (phraseIdx.current + 1) % phrases.length;
        }
      }
      rafRef.current = setTimeout(tick, deleting.current ? 40 : 70);
    };

    rafRef.current = setTimeout(tick, 800);
    return () => { if (rafRef.current) clearTimeout(rafRef.current); };
  }, [active, phrases]);

  return placeholder;
};

// ─── Terminal Log Success Component ──────────────────────────────────────────

const TerminalSuccess = ({ onReset }: { onReset: () => void }) => {
  const lines = [
    { delay: 0, text: '> DIRECTIVE RECEIVED...', color: 'text-gray-400' },
    { delay: 0.6, text: `> ENCODING PAYLOAD [████████████] 100%`, color: 'text-blue-400' },
    { delay: 1.2, text: '> ROUTING TO: saurabhmj11@gmail.com', color: 'text-gray-400' },
    { delay: 1.8, text: '> PRIORITY: HIGH', color: 'text-yellow-400' },
    { delay: 2.3, text: '> STATUS: TRANSMISSION COMPLETE ✓', color: 'text-green-400' },
    { delay: 3.0, text: '> RESPONSE ETA: < 24 HOURS', color: 'text-gray-500' },
  ];

  return (
    <motion.div
      key="terminal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[420px] flex flex-col justify-center relative z-10 font-mono p-4"
    >
      {/* Terminal header bar */}
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/8">
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <div className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="ml-3 text-[10px] text-white/20 uppercase tracking-widest">transmission.log</span>
      </div>

      <div className="space-y-2">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: line.delay, duration: 0.3 }}
            className={`text-sm ${line.color}`}
          >
            {line.text}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
        className="mt-10 flex items-center gap-3"
      >
        <span className="text-green-400 text-sm">▶</span>
        <button
          onClick={onReset}
          className="font-mono text-xs text-white/30 hover:text-white uppercase tracking-widest transition-colors cursor-pointer"
        >
          Initialize New Request
        </button>
      </motion.div>
    </motion.div>
  );
};

// ─── Field with typewriter placeholder ───────────────────────────────────────

const TerminalField = ({
  label, id, name, type = 'text', value, onChange,
  focused, onFocus, onBlur, placeholderPhrases, textarea = false, rows = 4, required = true
}: {
  label: string; id: string; name: string; type?: string;
  value: string; onChange: (e: React.ChangeEvent<any>) => void;
  focused: boolean; onFocus: () => void; onBlur: () => void;
  placeholderPhrases: string[]; textarea?: boolean; rows?: number; required?: boolean;
}) => {
  const ph = useTypewriterPlaceholder(placeholderPhrases, focused || value.length > 0);

  const commonProps = {
    id, name, required, value,
    onChange,
    onFocus,
    onBlur,
    placeholder: ph,
    className: 'w-full px-0 py-3 border-b border-white/15 outline-none bg-transparent transition-colors placeholder:text-gray-700 text-white focus:border-transparent text-sm',
  };

  return (
    <div className="relative group">
      <label htmlFor={id} className="block text-[10px] font-mono text-gray-500 mb-2 uppercase tracking-widest">
        {label}
      </label>
      {textarea ? (
        <textarea {...commonProps} rows={rows} style={{ resize: 'none' }} />
      ) : (
        <input {...commonProps} type={type} />
      )}
      {/* Underline reveal */}
      <motion.span
        animate={{ scaleX: focused ? 1 : 0 }}
        style={{ originX: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-blue-500 to-purple-500"
      />
      {/* Blinking cursor indicator when focused */}
      {focused && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute right-0 bottom-3 text-blue-400 font-mono text-sm select-none pointer-events-none"
        >
          █
        </motion.span>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const Contact = () => {
  const [ref, inView] = useInView({ threshold: 0.1 });
  const { playSectionChime } = useAudioDirector();

  useEffect(() => {
    if (inView) playSectionChime('contact');
  }, [inView, playSectionChime]);

  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      if (response.ok) {
        setIsSuccess(true);
        setFormState({ name: '', email: '', message: '' });
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch {
      alert('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormState({ ...formState, [e.target.name]: e.target.value });

  return (
    <section ref={ref} className="py-20 md:py-32 bg-black text-white relative z-10 overflow-hidden" id="contact">
      {inView && (
        <Helmet>
          <title>Contact | Saurabh Lokhande</title>
          <meta name="description" content="Get in touch for AI development, collaboration, and consulting." />
        </Helmet>
      )}

      {/* Background atmosphere */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24">

          {/* ── Left Column ── */}
          <div>
            <h2 className="text-[12px] uppercase tracking-widest mb-8 text-gray-500 font-mono">
              <ScrambleText text="INITIALIZE CONNECTION" className="" />
            </h2>
            <h3 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tighter mb-6 md:mb-8 leading-[0.9]">
              Let's build something{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">intelligent.</span>
            </h3>
            <p className="text-xl text-gray-400 mb-12 max-w-md leading-relaxed">
              Have a project in mind? Looking to integrate AI into your workflow? Let's discuss how we can create value together.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition-all duration-300">
                  <Mail size={20} className="text-gray-400 group-hover:text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                    Email <span className="inline-block w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse" title="Available for Freelance" />
                  </span>
                  <a href="mailto:saurabhmj11@gmail.com" className="text-lg font-medium hover:text-blue-400 transition-colors">
                    saurabhmj11@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center group-hover:bg-purple-500/20 group-hover:border-purple-500/50 transition-all duration-300">
                  <MapPin size={20} className="text-gray-400 group-hover:text-purple-400" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Global Node</span>
                  <span className="text-lg font-medium text-gray-300 group-hover:text-purple-400 transition-colors">Remote / Available Worldwide</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Terminal Form Card ── */}
          <div className="relative">
            <div className="bg-white/[0.03] backdrop-blur-xl p-6 md:p-10 lg:p-12 rounded-3xl border border-white/8 shadow-[0_0_80px_rgba(0,0,0,0.6)] relative overflow-hidden">

              {/* Matrix rain — very subtle behind form */}
              <MatrixRain />

              {/* Inner glass highlight */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none rounded-3xl" />

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <TerminalSuccess key="success" onReset={() => setIsSuccess(false)} />
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative z-10"
                  >
                    {/* Terminal title bar */}
                    <div className="flex items-center gap-2 mb-8 pb-4 border-b border-white/8">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                      <span className="ml-3 font-mono text-[9px] text-white/15 uppercase tracking-widest">new_connection.sh</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      <TerminalField
                        label="Name" id="name" name="name" value={formState.name}
                        onChange={handleChange}
                        focused={focusedField === 'name'}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        placeholderPhrases={['Enter identifier...', 'Your name...', 'Agent handle...']}
                      />
                      <TerminalField
                        label="Email" id="email" name="email" type="email" value={formState.email}
                        onChange={handleChange}
                        focused={focusedField === 'email'}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholderPhrases={['sys@domain.com', 'agent@neural.io', 'user@company.ai']}
                      />
                      <TerminalField
                        label="Payload" id="message" name="message" textarea value={formState.message}
                        onChange={handleChange}
                        focused={focusedField === 'message'}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        placeholderPhrases={['State your objective...', 'Describe the mission...', 'What shall we build?']}
                      />

                      <div className="pt-4">
                        <Magnetic>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full rounded-full py-4 text-white font-bold tracking-widest uppercase overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:scale-105 transition-transform duration-500" />
                            {/* Shimmer sweep */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            </div>
                            <div className="relative flex items-center justify-center gap-3">
                              {isSubmitting ? (
                                <><span className="font-mono text-sm">Transmitting</span> <Loader2 className="animate-spin" size={18} /></>
                              ) : (
                                <>
                                  <span className="translate-x-2 group-hover:translate-x-0 transition-transform duration-300 font-mono text-sm">
                                    Transmit Directive
                                  </span>
                                  <Send size={16} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                </>
                              )}
                            </div>
                          </button>
                        </Magnetic>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;