import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Wifi, WifiOff } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// ── Offline Toast ──────────────────────────────────────────────────────────
const OfflineToast = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    let backTimer: ReturnType<typeof setTimeout>;
    const handleOffline = () => setIsOnline(false);
    const handleOnline = () => {
      setIsOnline(true);
      setShowBack(true);
      backTimer = setTimeout(() => setShowBack(false), 3000);
    };
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      clearTimeout(backTimer);
    };
  }, []);

  const show = !isOnline || showBack;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={isOnline ? 'online' : 'offline'}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9980] flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl"
          style={{
            background: isOnline
              ? 'rgba(6, 78, 59, 0.85)'
              : 'rgba(69, 10, 10, 0.85)',
            borderColor: isOnline ? 'rgba(52, 211, 153, 0.3)' : 'rgba(239, 68, 68, 0.3)',
          }}
        >
          {isOnline
            ? <Wifi size={14} className="text-emerald-400 shrink-0" />
            : <WifiOff size={14} className="text-red-400 shrink-0" />
          }
          <span className="text-xs font-mono text-white">
            {isOnline ? 'Back online' : 'You are offline — cached content available'}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── Install Banner ─────────────────────────────────────────────────────────
const PWAPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // Don't show if already dismissed or installed
    if (localStorage.getItem('pwa-dismissed') === '1') return;
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show after 30 seconds of engagement
      timerRef.current = setTimeout(() => setShowBanner(true), 30_000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timerRef.current);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') localStorage.setItem('pwa-dismissed', '1');
    setShowBanner(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-dismissed', '1');
    setShowBanner(false);
  };

  return (
    <>
      <OfflineToast />
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-[9980] w-80 rounded-2xl border border-white/10 bg-gray-950/90 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            {/* Accent line */}
            <div className="h-0.5 w-full bg-gradient-to-r from-sky-500 via-violet-500 to-pink-500" />

            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center">
                    <Download size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-none mb-0.5">Install Portfolio App</p>
                    <p className="text-[10px] text-gray-500 font-mono">saurabh.ai</p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="text-gray-600 hover:text-gray-400 transition-colors p-1"
                  aria-label="Dismiss"
                >
                  <X size={14} />
                </button>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Add to your home screen for instant access, offline viewing, and a native app experience.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={handleInstall}
                  className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  Install
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-3 py-2 rounded-xl border border-white/10 text-gray-400 text-xs hover:bg-white/5 transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PWAPrompt;
