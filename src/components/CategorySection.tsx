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
    <section className="py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
              {lang === 'fa' ? 'دسته‌بندی‌های تخصصی' : 'Specialized Collections'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {lang === 'fa' ? 'انتخاب بر اساس دسته‌بندی' : 'Shop by Category'}
            </h2>
          </div>

          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, selectedCategory: 'all' }));
              setActiveTab('shop');
            }}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            <span>{lang === 'fa' ? 'مشاهده همه محصولات' : 'View All'}</span>
            <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
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
                className="group relative flex flex-col items-center text-center p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 transition-all duration-200 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-md cursor-pointer select-none"
              >
                {/* Image Container with Icon badge */}
                <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800/60 mb-3 shadow-xs">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                    <div className="w-8 h-8 rounded-xl bg-white/95 dark:bg-slate-900/95 shadow-sm flex items-center justify-center text-slate-800 dark:text-slate-200">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Name & Count */}
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate max-w-full">
                  {lang === 'fa' ? cat.nameFa : cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 mt-0.5 font-medium tabular-nums">
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
