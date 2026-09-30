import React, { useState, useEffect } from 'react';
import { Clock, ArrowLeft, ArrowRight, Zap, Flame, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { playTactileClick } from '../utils/sound';
import { toPersianDigits } from '../utils/persianNumber';

export const FlashSale: React.FC = () => {
  const { products, lang, setActiveTab, setFilters } = useStore();

  const flashProducts = products.filter(p => p.isFlashSale || (p.discountPercent && p.discountPercent > 0));

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

  const handleViewAll = () => {
    playTactileClick();
    setFilters(prev => ({ ...prev, onSaleOnly: true, selectedCategory: 'all' }));
    setActiveTab('shop');
  };

  if (flashProducts.length === 0) return null;

  return (
    <section id="flash-sale-section" className="py-8 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mehrnoosh Wonder Box Container */}
        <div className="rounded-3xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 p-4 sm:p-6 shadow-xl text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* Right side (RTL): Flash drop callout & Countdown */}
            <div className="lg:col-span-3 flex flex-col justify-between h-full p-2 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-amber-300 fill-amber-300 animate-bounce" />
                  <span className="text-xs font-mono font-black text-amber-200 tracking-wider">
                    WONDER DEALS
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                  پیشنهاد شگفت‌انگیز روز
                </h2>
                <p className="text-xs text-rose-100/90 mt-1 leading-relaxed">
                  تخفیف‌های استثنایی و محدود با ارسال رایگان و ضمانت اصالت ۱۰۰٪ کالاها
                </p>
              </div>

              {/* Countdown Flip Clock */}
              <div className="bg-black/25 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
                <div className="flex items-center justify-between text-[11px] text-rose-100 font-medium mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    <span>زمان باقی‌مانده:</span>
                  </div>
                  <span className="font-bold text-amber-300">محدود</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 font-mono text-sm font-black">
                  <div className="bg-white text-zinc-950 px-2 py-1.5 rounded-lg shadow-sm w-9 text-center">
                    {toPersianDigits(timeLeft.hours.toString().padStart(2, '0'))}
                  </div>
                  <span className="text-white text-base">:</span>
                  <div className="bg-white text-zinc-950 px-2 py-1.5 rounded-lg shadow-sm w-9 text-center">
                    {toPersianDigits(timeLeft.minutes.toString().padStart(2, '0'))}
                  </div>
                  <span className="text-white text-base">:</span>
                  <div className="bg-amber-300 text-zinc-950 px-2 py-1.5 rounded-lg shadow-sm w-9 text-center">
                    {toPersianDigits(timeLeft.seconds.toString().padStart(2, '0'))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleViewAll}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer"
              >
                <span>مشاهده همه شگفت‌انگیزها</span>
                <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
              </button>
            </div>

            {/* Left side: Product Cards */}
            <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {flashProducts.slice(0, 3).map((product, idx) => (
                <div key={product.id} className="h-full">
                  <ProductCard
                    product={product}
                    variant="discount"
                    claimedPercent={idx === 0 ? 86 : idx === 1 ? 72 : 93}
                    batchCode={`OFFER-0${idx + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
