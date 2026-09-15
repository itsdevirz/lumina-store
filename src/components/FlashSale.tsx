import React, { useState, useEffect } from 'react';
import { Flame, Clock, ArrowLeft, Zap, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const FlashSale: React.FC = () => {
  const { products, lang, setActiveTab, setFilters } = useStore();

  const flashProducts = products.filter(p => p.isFlashSale);

  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <section id="flash-sale-section" className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Flash Sale Header Strip */}
        <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#E80645] via-[#D0053E] to-[#B30435] text-white shadow-md shadow-rose-900/10 mb-4 sm:mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border border-rose-600/30">
          
          {/* Title & Tag */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0 backdrop-blur-xs">
                <Flame className="w-5 h-5 text-white animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-rose-100 uppercase tracking-wider font-modern">
                  <Sparkles className="w-3 h-3" />
                  <span>{lang === 'fa' ? 'پیشنهاد روز' : 'Daily Deal'}</span>
                </div>
                <h2 className="text-base sm:text-lg lg:text-xl font-normal text-white font-display">
                  {lang === 'fa' ? 'پیشنهادهای شگفت‌انگیز لومینا' : 'Lumina Flash Sale'}
                </h2>
              </div>
            </div>

            {/* Mobile View All Button */}
            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, onSaleOnly: true, selectedCategory: 'all' }));
                setActiveTab('shop');
              }}
              className="sm:hidden flex items-center gap-1 text-[11px] font-bold text-white/90 hover:text-white font-modern"
            >
              <span>{lang === 'fa' ? 'همه' : 'All'}</span>
              <ArrowLeft className="w-3 h-3 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>

          {/* Countdown Clock & Desktop CTA */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-black/25 px-3 py-1.5 rounded-xl border border-white/20 text-xs backdrop-blur-xs font-modern">
              <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="text-[10px] sm:text-xs text-white/90 font-medium">
                {lang === 'fa' ? 'زمان باقی‌مانده:' : 'Ends In:'}
              </span>
              <div className="flex items-center gap-1 font-mono text-xs font-black" style={{ direction: 'ltr' }}>
                <span className="bg-white text-slate-900 px-1.5 py-0.5 rounded text-[11px] shadow-xs font-bold font-modern">
                  {formatNumber(timeLeft.hours)}
                </span>
                <span className="text-white font-bold">:</span>
                <span className="bg-white text-slate-900 px-1.5 py-0.5 rounded text-[11px] shadow-xs font-bold font-modern">
                  {formatNumber(timeLeft.minutes)}
                </span>
                <span className="text-white font-bold">:</span>
                <span className="bg-white text-slate-900 px-1.5 py-0.5 rounded text-[11px] shadow-xs font-bold font-modern">
                  {formatNumber(timeLeft.seconds)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, onSaleOnly: true, selectedCategory: 'all' }));
                setActiveTab('shop');
              }}
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-white hover:text-white/80 transition-colors cursor-pointer bg-white/15 px-3 py-1.5 rounded-xl hover:bg-white/25 font-modern"
            >
              <span>{lang === 'fa' ? 'مشاهده همه تخفیف‌ها' : 'View All Deals'}</span>
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>
        </div>

        {/* Product Cards Grid: 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          {flashProducts.map(product => {
            const soldPercent = Math.min(100, Math.round((product.soldCount / (product.soldCount + product.stock)) * 100));

            return (
              <div key={product.id} className="flex flex-col h-full">
                <ProductCard product={product} />

                {/* Stock Progress Bar */}
                <div className="mt-1.5 px-1">
                  <div className="flex items-center justify-between text-[10px] mb-1 font-medium">
                    <span className="text-slate-400 dark:text-slate-500 tabular-nums">
                      {lang === 'fa'
                        ? `${product.stock} عدد در انبار`
                        : `${product.stock} in stock`}
                    </span>
                    <span className="text-rose-500 font-bold tabular-nums">
                      {soldPercent}٪
                    </span>
                  </div>
                  <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-300"
                      style={{ width: `${soldPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
