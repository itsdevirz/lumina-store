import React, { useState } from 'react';
import { Trophy, Award, ArrowLeft, Star, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { playTactileClick } from '../utils/sound';

export const BestSellers: React.FC = () => {
  const { products, lang, setActiveTab, setFilters } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', nameFa: 'همه پرفروش‌ها', nameEn: 'All Best Sellers' },
    { id: 'audio', nameFa: 'تجهیزات صوتی', nameEn: 'Audio' },
    { id: 'workspace', nameFa: 'لوازم میز کار', nameEn: 'Workspace' },
    { id: 'smart-wear', nameFa: 'ساعت و گجت', nameEn: 'Wearables' }
  ];

  const filteredProducts = products
    .filter(p => {
      if (selectedCategory === 'all') return p.rank !== undefined || p.soldCount > 30;
      return (p.category === selectedCategory) && (p.rank !== undefined || p.soldCount > 20);
    })
    .sort((a, b) => (a.rank || 99) - (b.rank || 99))
    .slice(0, 4);

  return (
    <section className="py-6 sm:py-8 border-t border-zinc-200 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#62DB00]/15 text-[#62DB00] flex items-center justify-center shrink-0 border border-[#62DB00]/30">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-[#62DB00] uppercase tracking-wider block font-mono">
                {lang === 'fa' ? 'رتبه‌بندی کاربران' : 'Top Verified Ranking'}
              </span>
              <h2 className="text-base sm:text-xl font-display font-extrabold text-zinc-900 dark:text-white tracking-tight">
                {lang === 'fa' ? 'پرفروش‌ترین تجهیزات لومینا' : 'Top Rated Hardware'}
              </h2>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  playTactileClick();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer font-mono tactile-press ${
                  selectedCategory === cat.id
                    ? 'bg-[#62DB00] text-black shadow-xs font-black'
                    : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {lang === 'fa' ? cat.nameFa : cat.nameEn}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid: Bestseller Composition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="bestseller"
              rankingBadge={product.rank || idx + 1}
            />
          ))}
        </div>

        {/* Bottom Link to Bestsellers Page */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setActiveTab('bestsellers')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/90 dark:hover:bg-zinc-750 text-zinc-900 dark:text-zinc-100 text-xs font-mono font-bold transition-all cursor-pointer tactile-press shadow-xs border border-zinc-200/60 dark:border-zinc-700/60"
          >
            <span>{lang === 'fa' ? 'مشاهده تمام رده‌بندی‌های پرفروش' : 'Explore Complete Bestsellers Index'}</span>
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
          </button>
        </div>

      </div>
    </section>
  );
};
