import React, { useState, useEffect } from 'react';
import { Clock, ArrowLeft, ArrowRight, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { playTactileClick } from '../utils/sound';

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
    playTactileClick();
    setFilters(prev => ({ ...prev, onSaleOnly: true, selectedCategory: 'all' }));
    setActiveTab('shop');
  };

  if (flashProducts.length === 0) return null;

  return (
    <section id="flash-sale-section" className="py-6 border-b border-zinc-200 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Minimal Drop Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-[#62DB00]/30 bg-[#62DB00]/10 text-[#62DB00] font-mono text-[11px] font-bold">
              <span className="signal-dot animate-pulse" />
              <span>FLASH DROP</span>
            </div>
            <h2 className="text-sm sm:text-base font-display font-bold text-zinc-900 dark:text-zinc-100">
              {lang === 'fa' ? 'پیشنهادهای شگفت‌انگیز لومینا' : 'Limited Inventory Allocation'}
            </h2>
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono text-zinc-500">
              <span>BATCH 04:</span>
              <div className="w-16 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                <div className="w-[74%] h-full bg-[#62DB00]" />
              </div>
              <span className="text-zinc-700 dark:text-zinc-300 font-bold">74% CLAIMED</span>
            </div>
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
                <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[#62DB00]">
                  {formatNumber(timeLeft.seconds)}
                </span>
              </div>
            </div>

            <button
              onClick={handleViewAll}
              className="flex items-center gap-1 text-xs font-mono font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer tactile-press"
            >
              <span>{lang === 'fa' ? 'مشاهده همه' : 'View All'}</span>
              {lang === 'fa' ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* High Density Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {flashProducts.slice(0, 4).map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="discount"
              claimedPercent={idx === 0 ? 82 : idx === 1 ? 67 : idx === 2 ? 91 : 74}
              batchCode={`DROP-0${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
