import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, Loader2, Mail, MapPin } from 'lucide-react';
import Magnetic from './Magnetic';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import ScrambleText from './ScrambleText';

const Contact = () => {
  const [ref, inView] = useInView({ threshold: 0.1 });
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormState({ name: '', email: '', message: '' });
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section ref={ref} className="py-20 md:py-32 bg-black text-white relative z-10 overflow-hidden" id="contact">
      {inView && (
        <Helmet>
          <title>Contact | Saurabh Lokhande</title>
          <meta name="description" content="Get in touch for AI development, collaboration, and consulting." />
        </Helmet>
      )}

      {/* Background Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
          {/* Left Column: Info */}
          <div>
            <h2 className="text-[12px] uppercase tracking-widest mb-8 text-gray-500">
              <ScrambleText text="INITIALIZE CONNECTION" className="" />
            </h2>
            <h3 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-8 leading-[0.9]">
              Let's build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">intelligent.</span>
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
                  <span className="text-xs uppercase tracking-widest text-gray-500 mb-1">Email <span className="inline-block w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse" title="Available for Freelance" /></span>
                  <a href="mailto:saurabhmj11@gmail.com" className="text-lg font-medium hover:text-blue-400 transition-colors">saurabhmj11@gmail.com</a>
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

          {/* Right Column: Premium Glass Form */}
          <div className="relative">
            <div className="bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">

              {/* Inner Glass Highlight */}
              <div className="absolute inset-0 bg-gradient-to-b from-white-5 to-transparent pointer-events-none rounded-3xl" />

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="min-h-[400px] flex flex-col items-center justify-center text-center relative z-10"
                  >
                    <div className="w-20 h-20 bg-green-500/20 border border-green-500/50 text-green-400 rounded-full flex items-center justify-center mb-6 relative">
                      <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                      <CheckCircle2 size={40} />
                    </div>
                    <h4 className="text-2xl font-bold mb-2">Transmission Successful</h4>
                    <p className="text-gray-400">Your message has been received.</p>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="mt-8 text-sm font-medium text-blue-400 hover:text-blue-300 uppercase tracking-widest cursor-pointer"
                    >
                      Initialize New Request
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-8 relative z-10"
                  >
                    {/* Name Input */}
                    <div className="relative group">
                      <label htmlFor="name" className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-widest">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formState.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-0 py-3 border-b border-white/20 outline-none bg-transparent transition-colors placeholder:text-gray-600 text-white focus:border-transparent"
                        placeholder="Enter identifier..."
                      />
                      <span className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${focusedField === 'name' ? 'w-full' : 'w-0'}`} />
                    </div>

                    {/* Email Input */}
                    <div className="relative group">
                      <label htmlFor="email" className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-widest">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formState.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-0 py-3 border-b border-white/20 outline-none bg-transparent transition-colors placeholder:text-gray-600 text-white focus:border-transparent"
                        placeholder="sys@domain.com"
                      />
                      <span className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${focusedField === 'email' ? 'w-full' : 'w-0'}`} />
                    </div>

                    {/* Message Input */}
                    <div className="relative group">
                      <label htmlFor="message" className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-widest">Payload</label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={4}
                        value={formState.message}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-0 py-3 border-b border-white/20 outline-none bg-transparent transition-colors resize-none placeholder:text-gray-600 text-white focus:border-transparent"
                        placeholder="State your objective..."
                      />
                      <span className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${focusedField === 'message' ? 'w-full' : 'w-0'}`} />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                      <Magnetic>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="group relative w-full rounded-full py-4 text-white font-bold tracking-widest uppercase overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:scale-105 transition-transform duration-500" />
                          <div className="relative flex items-center justify-center gap-3">
                            {isSubmitting ? (
                              <>Transmitting <Loader2 className="animate-spin text-white" size={20} /></>
                            ) : (
                              <>
                                <span className="translate-x-2 group-hover:translate-x-0 transition-transform duration-300">Transmit Directive</span>
                                <Send size={18} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                              </>
                            )}
                          </div>
                        </button>
                      </Magnetic>
                    </div>
                  </motion.form>
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