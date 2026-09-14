import React, { useState, useEffect } from 'react';
import { Flame, Clock, ChevronLeft, Copy, Check, Percent } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getFestivalTheme } from '../utils/festivalTheme';

export const FestivalBanner: React.FC = () => {
  const { activeFestival, openFestivalPage, lang, formatPrice } = useStore();
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
  const theme = getFestivalTheme(activeFestival.themeColor || 'rose');

  const format2Digits = (n: number) => String(n).padStart(2, '0');

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-1">
      <div
        onClick={() => openFestivalPage(activeFestival)}
        className={`relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r ${theme.cardGradient} border ${theme.cardBorder} p-3.5 sm:p-4.5 md:p-5 transition-all cursor-pointer group shadow-sm hover:shadow-md`}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3.5 sm:gap-4">
          {/* Left Column: Compact Header, Title & Coupon */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-start w-full md:w-auto">
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} ${theme.badgeText} font-black text-[11px] shadow-2xs`}
              >
                <Flame className={`w-3.5 h-3.5 ${theme.badgeIcon} animate-pulse`} />
                <span>
                  {activeFestival.badgeText ||
                    (lang === 'fa' ? 'جشنواره ویژه' : 'Special Festival')}
                </span>
              </span>

              {activeFestival.discountPercent && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${theme.discountPillBg} ${theme.discountPillText} font-black text-[11px] border ${theme.discountPillBorder}`}
                >
                  <Percent className="w-3 h-3" />
                  <span>
                    {lang === 'fa'
                      ? `تا ${activeFestival.discountPercent}٪ تخفیف`
                      : `Up to ${activeFestival.discountPercent}% OFF`}
                  </span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2
                className={`text-sm sm:text-base font-black ${theme.titleText} tracking-tight`}
              >
                {lang === 'fa'
                  ? activeFestival.title
                  : activeFestival.titleEn || activeFestival.title}
              </h2>

              {/* Coupon Pill (compact) */}
              {coupon && (
                <button
                  type="button"
                  onClick={(e) => handleCopyCode(e, coupon.code)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg ${theme.couponPillBg} border ${theme.couponPillBorder} ${theme.couponPillText} text-[11px] font-mono font-bold transition-colors cursor-pointer`}
                  title={lang === 'fa' ? 'کپی کد تخفیف' : 'Copy coupon'}
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3 opacity-70" />
                  )}
                  <span>{coupon.code}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Sleek Inline Countdown Timer & CTA */}
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 w-full md:w-auto">
            {/* Streamlined Countdown Timer */}
            <div
              className={`flex items-center gap-2 ${theme.clockBoxBg} px-3 py-1.5 rounded-xl border ${theme.clockBoxBorder}`}
            >
              <Clock className={`w-3.5 h-3.5 ${theme.clockBoxIcon}`} />
              <div
                className="flex items-center gap-1 font-mono text-xs font-black tabular-nums"
                style={{ direction: 'ltr' }}
              >
                {timeLeft.days > 0 && (
                  <>
                    <span className="text-slate-800 dark:text-slate-100">
                      {timeLeft.days}
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans">
                      {lang === 'fa' ? 'روز' : 'd'}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">:</span>
                  </>
                )}
                <span className="text-slate-800 dark:text-slate-100">
                  {format2Digits(timeLeft.hours)}
                </span>
                <span className="text-slate-300 dark:text-slate-600">:</span>
                <span className="text-slate-800 dark:text-slate-100">
                  {format2Digits(timeLeft.minutes)}
                </span>
                <span className="text-slate-300 dark:text-slate-600">:</span>
                <span className="text-rose-600 dark:text-rose-400">
                  {format2Digits(timeLeft.seconds)}
                </span>
              </div>
            </div>

            {/* Compact CTA Button */}
            <button
              type="button"
              onClick={() => openFestivalPage(activeFestival)}
              className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${theme.ctaButton}`}
            >
              <span>{lang === 'fa' ? 'مشاهده کالاها' : 'Explore Deals'}</span>
              <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
