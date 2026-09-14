import React, { useState } from 'react';
import { Trophy, Award, ArrowLeft, Star, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

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
    <section className="py-8 sm:py-10 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-900">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-0.5">
                {lang === 'fa' ? 'محبوب‌ترین انتخاب‌های خریداران' : 'Customer Favorites'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {lang === 'fa' ? 'پرفروش‌ترین‌های برتر لومینا' : 'Top Best Sellers'}
              </h2>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lang === 'fa' ? cat.nameFa : cat.nameEn}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              rankingBadge={product.rank || idx + 1}
            />
          ))}
        </div>

        {/* Bottom Link to Shop */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, selectedCategory: 'all', sortBy: 'sales' }));
              setActiveTab('shop');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-all cursor-pointer"
          >
            <span>{lang === 'fa' ? 'مشاهده تمام محصولات پرفروش کاتالوگ' : 'View All Best Sellers'}</span>
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
          </button>
        </div>

      </div>
    </section>
  );
};
