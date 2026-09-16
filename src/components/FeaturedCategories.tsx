import React from 'react';
import { motion } from 'motion/react';
import {
  Laptop,
  Headphones,
  Watch,
  Layers,
  Keyboard,
  Gamepad2,
  BatteryCharging,
  ArrowRight,
  ArrowLeft,
  ChevronLeft
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';

export const FeaturedCategories: React.FC = () => {
  const { lang, setFilters, setActiveTab, products } = useStore();

  const categoryIcons: Record<string, React.ReactNode> = {
    laptops: <Laptop className="w-6 h-6 text-[#62DB00]" />,
    audio: <Headphones className="w-6 h-6 text-sky-400" />,
    wearables: <Watch className="w-6 h-6 text-amber-400" />,
    accessories: <Layers className="w-6 h-6 text-emerald-400" />,
    peripherals: <Keyboard className="w-6 h-6 text-purple-400" />,
    gaming: <Gamepad2 className="w-6 h-6 text-rose-400" />,
    power: <BatteryCharging className="w-6 h-6 text-indigo-400" />
  };

  const handleSelectCategory = (catId: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCategory: catId,
      searchQuery: ''
    }));
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#62DB00]" />
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              {lang === 'fa' ? 'دسته‌بندی‌های برگزیده' : 'Curated Categories'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {lang === 'fa' ? 'کاوش در مجموعه‌های تخصصی لومینا' : 'Explore Hardware Collections'}
          </h2>
        </div>

        <button
          onClick={() => {
            setFilters(prev => ({ ...prev, selectedCategory: 'all' }));
            setActiveTab('shop');
          }}
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <span>{lang === 'fa' ? 'مشاهده همه محصولات' : 'View All Products'}</span>
          {lang === 'fa' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {CATEGORIES.map(cat => {
          const count = products.filter(p => p.category === cat.id).length;

          return (
            <motion.div
              key={cat.id}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleSelectCategory(cat.id)}
              className="group relative p-4 rounded-2xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700/80 shadow-xs hover:shadow-md transition-all cursor-pointer text-right rtl:text-right ltr:text-left flex flex-col justify-between min-h-[140px]"
            >
              {/* Icon & Count */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800/70 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {categoryIcons[cat.id] || <Layers className="w-5 h-5 text-zinc-400" />}
                </div>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold">
                  {count} {lang === 'fa' ? 'کالا' : 'items'}
                </span>
              </div>

              {/* Title & Chevron */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#62DB00] transition-colors leading-snug">
                  {lang === 'fa' ? cat.nameFa : cat.name}
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>{lang === 'fa' ? 'مشاهده دسته' : 'Explore'}</span>
                  <ChevronLeft className="w-3 h-3 rtl:rotate-0 ltr:rotate-180" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
