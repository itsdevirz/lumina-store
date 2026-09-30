import React from 'react';
import {
  Laptop,
  Headphones,
  Watch,
  Layers,
  Keyboard,
  Briefcase,
  Coffee,
  Home,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';
import { playTactileClick } from '../utils/sound';

export const FeaturedCategories: React.FC = () => {
  const { lang, setFilters, setActiveTab, products } = useStore();

  const categoryConfigs: Record<
    string,
    { icon: React.ReactNode; bgLight: string; textAccent: string; borderTint: string }
  > = {
    audio: {
      icon: <Headphones className="w-5 h-5" />,
      bgLight: 'bg-[#ECFDF5] dark:bg-emerald-950/40',
      textAccent: 'text-emerald-600 dark:text-emerald-400',
      borderTint: 'border-emerald-200/60 dark:border-emerald-900/50'
    },
    workspace: {
      icon: <Laptop className="w-5 h-5" />,
      bgLight: 'bg-[#EFF6FF] dark:bg-blue-950/40',
      textAccent: 'text-blue-600 dark:text-blue-400',
      borderTint: 'border-blue-200/60 dark:border-blue-900/50'
    },
    'smart-wear': {
      icon: <Watch className="w-5 h-5" />,
      bgLight: 'bg-[#FFF7D6] dark:bg-amber-950/40',
      textAccent: 'text-amber-600 dark:text-amber-400',
      borderTint: 'border-amber-200/60 dark:border-amber-900/50'
    },
    lifestyle: {
      icon: <Briefcase className="w-5 h-5" />,
      bgLight: 'bg-[#FFF1E8] dark:bg-orange-950/40',
      textAccent: 'text-orange-600 dark:text-orange-400',
      borderTint: 'border-orange-200/60 dark:border-orange-900/50'
    },
    coffee: {
      icon: <Coffee className="w-5 h-5" />,
      bgLight: 'bg-[#F5F0FF] dark:bg-purple-950/40',
      textAccent: 'text-purple-600 dark:text-purple-400',
      borderTint: 'border-purple-200/60 dark:border-purple-900/50'
    },
    'home-design': {
      icon: <Home className="w-5 h-5" />,
      bgLight: 'bg-[#FDF2F8] dark:bg-rose-950/40',
      textAccent: 'text-rose-600 dark:text-rose-400',
      borderTint: 'border-rose-200/60 dark:border-rose-900/50'
    },
    apparel: {
      icon: <Layers className="w-5 h-5" />,
      bgLight: 'bg-[#F0FDF4] dark:bg-teal-950/40',
      textAccent: 'text-teal-600 dark:text-teal-400',
      borderTint: 'border-teal-200/60 dark:border-teal-900/50'
    }
  };

  const handleSelectCategory = (catId: string) => {
    playTactileClick();
    setFilters(prev => ({
      ...prev,
      selectedCategory: catId,
      searchQuery: ''
    }));
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Limit to top 6 categories for a clean grid
  const displayCategories = CATEGORIES.slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {lang === 'fa' ? 'دسته‌بندی‌های محصولات' : 'Shop by Category'}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {lang === 'fa' ? 'مجموعه‌های تخصصی و استاندارد لومینا' : 'Explore hardware & lifestyle categories'}
          </p>
        </div>

        <button
          onClick={() => {
            playTactileClick();
            setActiveTab('categories');
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          <span>{lang === 'fa' ? 'همه دسته‌بندی‌ها' : 'All Categories'}</span>
          {lang === 'fa' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Categories Grid (6 columns desktop, 3 tablet, 2 mobile) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {displayCategories.map(cat => {
          const count = products.filter(p => p.category === cat.id).length;
          const config = categoryConfigs[cat.id] || {
            icon: <Layers className="w-5 h-5" />,
            bgLight: 'bg-[#F8FAF9] dark:bg-zinc-900',
            textAccent: 'text-zinc-600 dark:text-zinc-300',
            borderTint: 'border-zinc-200/60 dark:border-zinc-800'
          };

          return (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`group p-3.5 sm:p-4 rounded-2xl ${config.bgLight} border ${config.borderTint} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col items-center text-center justify-center min-h-[110px] sm:min-h-[120px]`}
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl bg-white/80 dark:bg-zinc-900/80 shadow-2xs flex items-center justify-center mb-2.5 ${config.textAccent} transition-transform group-hover:scale-110`}>
                {config.icon}
              </div>

              {/* Title */}
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 transition-colors line-clamp-1">
                {lang === 'fa' ? cat.nameFa : cat.name}
              </h3>

              {/* Count */}
              <span className="text-[10px] text-zinc-400 font-mono mt-0.5">
                {count} {lang === 'fa' ? 'کالا' : 'items'}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
