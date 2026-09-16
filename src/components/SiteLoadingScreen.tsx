import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LuminaLogo } from './LuminaLogo';
import { useStore } from '../context/StoreContext';

interface SiteLoadingScreenProps {
  onFinish?: () => void;
  minDuration?: number;
}

export const SiteLoadingScreen: React.FC<SiteLoadingScreenProps> = ({
  onFinish,
  minDuration = 1100
}) => {
  const { lang } = useStore();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [statusMessage, setStatusMessage] = useState(
    lang === 'fa' ? 'در حال بارگذاری استودیو لومینا...' : 'Initializing Lumina Studio...'
  );

  useEffect(() => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / minDuration) * 100));
      setProgress(pct);

      if (pct < 35) {
        setStatusMessage(
          lang === 'fa' ? 'راه‌اندازی محیط و اجزای هسته...' : 'Bootstrapping runtime...'
        );
      } else if (pct < 70) {
        setStatusMessage(
          lang === 'fa' ? 'همگام‌سازی کاتالوگ و مشخصات کالاها...' : 'Syncing hardware catalog...'
        );
      } else if (pct < 95) {
        setStatusMessage(
          lang === 'fa' ? 'بارگذاری تم و تایپوگرافی اختصاصی...' : 'Applying design tokens...'
        );
      } else {
        setStatusMessage(
          lang === 'fa' ? 'آماده‌سازی فضای کاربری...' : 'Workspace ready.'
        );
      }

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsVisible(false);
          if (onFinish) onFinish();
        }, 220);
      }
    }, 24);

    return () => clearInterval(interval);
  }, [minDuration, onFinish, lang]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#09090B] text-zinc-100 select-none overflow-hidden"
      >
        {/* Subtle background ambient mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/60 via-[#09090B] to-[#09090B] pointer-events-none" />

        {/* Delicate subtle grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* Center Content Container */}
        <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
          {/* Glowing Logo */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative mb-8"
          >
            {/* Ambient Lime Backlight Glow */}
            <div className="absolute -inset-6 bg-[#74DB00]/15 rounded-full blur-2xl pointer-events-none animate-pulse" />

            <div className="relative flex items-center justify-center p-3">
              <LuminaLogo variant="full" size="lg" glow animated />
            </div>
          </motion.div>

          {/* Minimalist Progress Track */}
          <div className="w-48 sm:w-56 h-[2px] bg-zinc-800/90 rounded-full overflow-hidden mb-4 relative">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 via-[#74DB00] to-lime-300 rounded-full shadow-[0_0_12px_#74DB00]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          {/* Telemetry Status Line */}
          <div className="flex items-center justify-between w-48 sm:w-56 text-[10px] font-mono text-zinc-500 mb-1">
            <span className="truncate max-w-[150px] text-zinc-400 text-right rtl:text-right ltr:text-left">
              {statusMessage}
            </span>
            <span className="font-semibold text-[#74DB00] tabular-nums">
              {progress}%
            </span>
          </div>

          {/* Quick Skip button for instant access */}
          <button
            onClick={() => {
              setIsVisible(false);
              if (onFinish) onFinish();
            }}
            className="mt-6 text-[10px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors uppercase tracking-wider px-2 py-1 rounded cursor-pointer"
          >
            {lang === 'fa' ? 'ورود مستقیم ↵' : 'Skip ↵'}
          </button>
        </div>

        {/* Bottom Technical Watermark */}
        <div className="absolute bottom-6 font-mono text-[10px] text-zinc-600 tracking-widest uppercase">
          LUMINA PLATFORM • v2.6.0
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
