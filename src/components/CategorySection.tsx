import React from 'react';
import { ArrowLeft, ArrowRight, Headphones, Watch, Laptop, Briefcase, Coffee, Home, Sparkles, Layers } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { useStore } from '../context/StoreContext';
import { playTactileClick } from '../utils/sound';

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
    playTactileClick();
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
    <section className="py-8 sm:py-10 border-b border-zinc-200/80 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#62DB00]" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-bold">
                {lang === 'fa' ? 'دسته‌بندی‌های تخصصی' : 'ARCHITECTURE DIRECTORY'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
              {lang === 'fa' ? 'انتخاب بر اساس کالکشن' : 'Browse Collections'}
            </h2>
          </div>

          <button
            onClick={() => {
              playTactileClick();
              setFilters(prev => ({ ...prev, selectedCategory: 'all' }));
              setActiveTab('shop');
            }}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer tactile-press"
          >
            <span>{lang === 'fa' ? 'همه کالاها' : 'View All'}</span>
            {lang === 'fa' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Modern Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map(cat => {
            const IconComponent = ICON_MAP[cat.icon] || Headphones;

            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="group relative flex flex-col items-center text-center p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 cursor-pointer shadow-xs tactile-press select-none"
              >
                {/* Image Container with Icon badge */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-3 border border-zinc-200/50 dark:border-zinc-800/80">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-white/95 dark:bg-zinc-900/95 shadow-xs flex items-center justify-center text-zinc-800 dark:text-zinc-200">
                      <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                </div>

                {/* Name & Count */}
                <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#62DB00] transition-colors truncate max-w-full">
                  {lang === 'fa' ? cat.nameFa : cat.name}
                </h3>
                <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 mt-1 tabular-nums">
                  {lang === 'fa' ? `${cat.itemCount} قطعه` : `${cat.itemCount} items`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
