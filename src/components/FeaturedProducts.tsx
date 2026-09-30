import React from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { playTactileClick } from '../utils/sound';

export const FeaturedProducts: React.FC = () => {
  const { products, lang, setActiveTab, setFilters } = useStore();

  // Pick 4 curated featured products
  const featuredList = products.slice(0, 4);

  const handleViewAll = () => {
    playTactileClick();
    setFilters(prev => ({ ...prev, selectedCategory: 'all', onSaleOnly: false, sortBy: 'popular' }));
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (featuredList.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <div className="flex items-center gap-1.5 mb-1 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {lang === 'fa' ? 'انتخاب ویژه تیم لومینا' : 'Handpicked by Lumina'}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {lang === 'fa' ? 'محصولات پیشنهادی و برگزیده' : 'Featured Collections'}
          </h2>
        </div>

        <button
          type="button"
          onClick={handleViewAll}
          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          <span>{lang === 'fa' ? 'مشاهده همه' : 'View All'}</span>
          {lang === 'fa' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 4-Column Responsive Grid with Equal Sized Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {featuredList.map(product => (
          <div key={product.id} className="h-full">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};
