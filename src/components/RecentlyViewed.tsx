import React from 'react';
import { Clock, Trash2, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const RecentlyViewed: React.FC = () => {
  const { recentlyViewed, clearRecentlyViewed, lang, setActiveTab } = useStore();

  if (!recentlyViewed || recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className="py-6 sm:py-8 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <Clock className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {lang === 'fa' ? 'کالاهای اخیراً مشاهده شده' : 'Recently Viewed Products'}
              </h2>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
                {lang === 'fa' ? 'بر اساس بازدیدهای اخیر شما در فروشگاه' : 'Based on your recent browsing history'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearRecentlyViewed}
              title={lang === 'fa' ? 'پاک کردن تاریخچه' : 'Clear history'}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'fa' ? 'پاک‌سازی' : 'Clear'}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer mr-2 rtl:mr-0 rtl:ml-2"
            >
              <span>{lang === 'fa' ? 'مشاهده همه محصولات' : 'View All'}</span>
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>
        </div>

        {/* Product Grid: 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          {recentlyViewed.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
