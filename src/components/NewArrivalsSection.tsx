import React from 'react';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { playTactileClick } from '../utils/sound';

export const NewArrivalsSection: React.FC = () => {
  const { products, lang, setActiveTab, setFilters } = useStore();

  // Filter newest items or pick 3-4 products
  const newProducts = products.slice(2, 5);

  const handleViewAllNew = () => {
    playTactileClick();
    setFilters(prev => ({ ...prev, selectedCategory: 'all', onSaleOnly: false, sortBy: 'newest' }));
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (newProducts.length === 0) return null;

  return (
    <section className="py-10 sm:py-14 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-[#070709]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#62DB00]" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-bold">
                {lang === 'fa' ? 'محصولات نوآورانه فصل' : 'SEASONAL RELEASES // DROP 03'}
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-display font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {lang === 'fa' ? 'ورودی‌های تازه با استانداردهای استودیویی' : 'New Arrivals & Minimalist Silhouettes'}
            </h2>
          </div>

          <button
            onClick={handleViewAllNew}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer tactile-press shrink-0"
          >
            <span>{lang === 'fa' ? 'مشاهده تمام ورودی‌های جدید' : 'View All Releases'}</span>
            {lang === 'fa' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Asymmetric Staggered 3-Card Composition */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {newProducts.map((product, idx) => (
            <div
              key={product.id}
              className={`flex flex-col ${
                idx === 1 ? 'lg:translate-y-4' : idx === 2 ? 'lg:-translate-y-2' : ''
              }`}
            >
              <ProductCard product={product} variant="new_arrival" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
