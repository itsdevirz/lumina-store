import React, { useState, useEffect } from 'react';
import { Flame, Clock, ChevronLeft, Copy, Check, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const FestivalBanner: React.FC = () => {
  const { activeFestival, openFestivalPage, lang } = useStore();
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!activeFestival || !activeFestival.endTimestamp) return;

    const calculateTime = () => {
      const diff = activeFestival.endTimestamp - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [activeFestival]);

  if (!activeFestival || !activeFestival.isActive || timeLeft.isExpired) {
    return null;
  }

  const handleCopyCode = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const coupon =
    activeFestival.coupons?.[0] ||
    (activeFestival.couponCode
      ? {
          code: activeFestival.couponCode,
          amount: activeFestival.discountPercent || 20,
          type: 'percent'
        }
      : null);

  const format2Digits = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-1">
      <div
        onClick={() => openFestivalPage(activeFestival)}
        className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 text-zinc-900 dark:text-zinc-100 transition-colors cursor-pointer hover:border-amber-500/50"
      >
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10">
            {activeFestival.badgeText || (lang === 'fa' ? 'رویداد فصلی' : 'Seasonal Event')}
          </span>

          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {lang === 'fa' ? activeFestival.title : activeFestival.titleEn || activeFestival.title}
          </span>

          {coupon && (
            <button
              type="button"
              onClick={e => handleCopyCode(e, coupon.code)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 cursor-pointer"
            >
              {copied ? (
                <Check className="w-3 h-3 text-emerald-500" />
              ) : (
                <Copy className="w-3 h-3 opacity-60" />
              )}
              <span>{coupon.code}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
          <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
            <Clock className="w-3 h-3 text-zinc-400" />
            <span className="tabular-nums" style={{ direction: 'ltr' }}>
              {timeLeft.days > 0 && `${timeLeft.days}d `}
              {format2Digits(timeLeft.hours)}:{format2Digits(timeLeft.minutes)}:
              <span className="text-amber-600 dark:text-amber-400">{format2Digits(timeLeft.seconds)}</span>
            </span>
          </div>

          <span className="text-[11px] font-mono text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
            {lang === 'fa' ? 'مشاهده کالاها ←' : 'View Deals →'}
          </span>
        </div>
      </div>
    </div>
  );
};
