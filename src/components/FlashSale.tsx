import React, { useState, useEffect } from 'react';
import { Flame, Clock, ArrowLeft, ArrowRight, Zap } from 'lucide-react';
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

  const handleViewAll = () => {
    setFilters(prev => ({ ...prev, onSaleOnly: true, selectedCategory: 'all' }));
    setActiveTab('shop');
  };

  return (
    <section id="flash-sale-section" className="py-6 border-b border-zinc-200 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Minimal Drop Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-[11px] font-medium">
              <Zap className="w-3 h-3 fill-current" />
              <span>FLASH DROPS</span>
            </div>
            <h2 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {lang === 'fa' ? 'پیشنهادهای شگفت‌انگیز لومینا' : 'Limited Inventory Drops'}
            </h2>
          </div>

          {/* Monospace Countdown Clock & View All */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-600 dark:text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-[11px] text-zinc-400">{lang === 'fa' ? 'فرصت باقی‌مانده:' : 'Time Left:'}</span>
              <div className="flex items-center gap-1 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  {formatNumber(timeLeft.hours)}
                </span>
                <span>:</span>
                <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  {formatNumber(timeLeft.minutes)}
                </span>
                <span>:</span>
                <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-rose-500">
                  {formatNumber(timeLeft.seconds)}
                </span>
              </div>
            </div>

            <button
              onClick={handleViewAll}
              className="flex items-center gap-1 text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            >
              <span>{lang === 'fa' ? 'مشاهده همه' : 'View All'}</span>
              <span className="text-[10px] text-zinc-400">→</span>
            </button>
          </div>
        </div>

        {/* High Density Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {flashProducts.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
