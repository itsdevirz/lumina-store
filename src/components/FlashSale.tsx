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
        <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-900 dark:bg-[#111726] text-white shadow-xs mb-4 sm:mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border border-slate-800">
          
          {/* Title & Tag */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/20">
                <Flame className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>{lang === 'fa' ? 'پیشنهاد روز' : 'Daily Deal'}</span>
                </div>
                <h2 className="text-sm sm:text-base lg:text-lg font-black tracking-tight">
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
              className="sm:hidden flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white"
            >
              <span>{lang === 'fa' ? 'همه' : 'All'}</span>
              <ArrowLeft className="w-3 h-3 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>

          {/* Countdown Clock & Desktop CTA */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[10px] sm:text-xs text-slate-300 font-medium">
                {lang === 'fa' ? 'زمان باقی‌مانده:' : 'Ends In:'}
              </span>
              <div className="flex items-center gap-1 font-mono text-xs font-black" style={{ direction: 'ltr' }}>
                <span className="bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded text-[11px]">
                  {formatNumber(timeLeft.hours)}
                </span>
                <span className="text-slate-500 font-bold">:</span>
                <span className="bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded text-[11px]">
                  {formatNumber(timeLeft.minutes)}
                </span>
                <span className="text-slate-500 font-bold">:</span>
                <span className="bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded text-[11px]">
                  {formatNumber(timeLeft.seconds)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, onSaleOnly: true, selectedCategory: 'all' }));
                setActiveTab('shop');
              }}
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              <span>{lang === 'fa' ? 'مشاهده همه تخفیف‌ها' : 'View All Deals'}</span>
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>
        </div>

        {/* Product Cards Grid: 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {flashProducts.map(product => {
            const soldPercent = Math.min(100, Math.round((product.soldCount / (product.soldCount + product.stock)) * 100));

            return (
              <div key={product.id} className="flex flex-col">
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
