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
    <section id="flash-sale-section" className="py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Flash Sale Header Strip */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 text-white shadow-md mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-rose-900/40">
          
          {/* Title & Tag */}
          <div className="flex items-center gap-3 text-center sm:text-right">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
              <Flame className="w-6 h-6 animate-pulse text-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'پیشنهاد محدود روزانه' : 'Limited Daily Offer'}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight">
                {lang === 'fa' ? 'پیشنهادهای شگفت‌انگیز لومینا' : 'Lumina Flash Sale Deals'}
              </h2>
            </div>
          </div>

          {/* Countdown Clock & CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs text-slate-300 font-medium">
                {lang === 'fa' ? 'زمان باقی‌مانده:' : 'Ends In:'}
              </span>
              <div className="flex items-center gap-1 font-mono text-xs sm:text-sm font-black" style={{ direction: 'ltr' }}>
                <span className="bg-slate-900 text-amber-400 px-2.5 py-1 rounded-lg border border-slate-800 shadow-xs">
                  {formatNumber(timeLeft.hours)}
                </span>
                <span className="text-slate-500 font-bold">:</span>
                <span className="bg-slate-900 text-amber-400 px-2.5 py-1 rounded-lg border border-slate-800 shadow-xs">
                  {formatNumber(timeLeft.minutes)}
                </span>
                <span className="text-slate-500 font-bold">:</span>
                <span className="bg-slate-900 text-amber-400 px-2.5 py-1 rounded-lg border border-slate-800 shadow-xs">
                  {formatNumber(timeLeft.seconds)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, onSaleOnly: true, selectedCategory: 'all' }));
                setActiveTab('shop');
              }}
              className="flex items-center gap-1 text-xs font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              <span>{lang === 'fa' ? 'مشاهده همه تخفیف‌ها' : 'View All Deals'}</span>
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>
        </div>

        {/* Product Cards Grid with stock progress indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {flashProducts.map(product => {
            const soldPercent = Math.min(100, Math.round((product.soldCount / (product.soldCount + product.stock)) * 100));

            return (
              <div key={product.id} className="flex flex-col">
                <ProductCard product={product} />

                {/* Stock Progress Bar */}
                <div className="mt-2.5 px-2">
                  <div className="flex items-center justify-between text-[11px] mb-1 font-medium">
                    <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                      {lang === 'fa'
                        ? `تنها ${product.stock} عدد در انبار باقی‌مانده`
                        : `Only ${product.stock} left in stock`}
                    </span>
                    <span className="text-rose-600 dark:text-rose-400 font-bold tabular-nums">
                      {lang === 'fa' ? `${soldPercent}٪ فروخته شد` : `${soldPercent}% sold`}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-600 rounded-full transition-all duration-300"
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
