import React from 'react';
import { ArrowLeft, Headphones, Watch, Laptop, Briefcase, Coffee, Home, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { useStore } from '../context/StoreContext';

const ICON_MAP: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Headphones,
  Watch,
  Laptop,
  Briefcase,
  Coffee,
  Home
};

export const CategorySection: React.FC = () => {
  const { lang, setFilters, setActiveTab } = useStore();

  const handleCategoryClick = (categoryId: string) => {
    setFilters(prev => ({ ...prev, selectedCategory: categoryId }));
    setActiveTab('shop');
    if (typeof window !== 'undefined') {
      window.history.pushState(
        { tab: 'shop', category: categoryId },
        '',
        categoryId !== 'all' ? `/category/${categoryId}` : '/shop'
      );
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-4 sm:mb-6">
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
              {lang === 'fa' ? 'دسته‌بندی‌های تخصصی' : 'Specialized Collections'}
            </span>
            <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {lang === 'fa' ? 'انتخاب بر اساس دسته‌بندی' : 'Shop by Category'}
            </h2>
          </div>

          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, selectedCategory: 'all' }));
              setActiveTab('shop');
            }}
            className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            <span>{lang === 'fa' ? 'همه کالاها' : 'View All'}</span>
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
          </button>
        </div>

        {/* Modern Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
          {CATEGORIES.map(cat => {
            const IconComponent = ICON_MAP[cat.icon] || Headphones;

            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="group relative flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#111726] border border-slate-200/80 dark:border-slate-800/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/30 hover:shadow-xs cursor-pointer select-none"
              >
                {/* Image Container with Icon badge */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800/60 mb-2.5 shadow-2xs">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-900/15 group-hover:bg-slate-900/5 transition-colors flex items-center justify-center">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/95 dark:bg-slate-900/95 shadow-2xs flex items-center justify-center text-slate-800 dark:text-slate-200">
                      <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                </div>

                {/* Name & Count */}
                <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate max-w-full">
                  {lang === 'fa' ? cat.nameFa : cat.name}
                </h3>
                <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 font-medium tabular-nums">
                  {lang === 'fa' ? `${cat.itemCount} کالا` : `${cat.itemCount} items`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
