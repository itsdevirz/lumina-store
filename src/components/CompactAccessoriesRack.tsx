import React, { useState } from 'react';
import { Cpu, ArrowRight, ArrowLeft, SlidersHorizontal, Layers } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { playTactileClick } from '../utils/sound';

export const CompactAccessoriesRack: React.FC = () => {
  const { products, lang, setActiveTab, setFilters } = useStore();
  const [filterType, setFilterType] = useState<'all' | 'workspace' | 'audio'>('all');

  const filteredItems = products
    .filter(p => {
      if (filterType === 'all') return true;
      return p.category === filterType;
    })
    .slice(0, 6);

  const handleExploreAll = () => {
    playTactileClick();
    setFilters(prev => ({ ...prev, selectedCategory: 'workspace', onSaleOnly: false }));
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-8 sm:py-12 border-b border-zinc-200 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#62DB00]" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                {lang === 'fa' ? 'رک جانبی و ملزومات کاری' : 'PERIPHERALS & ESSENTIAL RACK'}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-display font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {lang === 'fa' ? 'اکسسوری‌ها و ادوات ارتقای محیط کار' : 'Compact Workspace Peripherals & Upgrades'}
            </h2>
          </div>

          {/* Quick Category Toggles */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer tactile-press ${
                  filterType === 'all'
                    ? 'bg-[#62DB00] text-black shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {lang === 'fa' ? 'همه' : 'All'}
              </button>
              <button
                onClick={() => setFilterType('workspace')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer tactile-press ${
                  filterType === 'workspace'
                    ? 'bg-[#62DB00] text-black shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {lang === 'fa' ? 'میز کار' : 'Desk'}
              </button>
              <button
                onClick={() => setFilterType('audio')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer tactile-press ${
                  filterType === 'audio'
                    ? 'bg-[#62DB00] text-black shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {lang === 'fa' ? 'صدا' : 'Audio'}
              </button>
            </div>

            <button
              onClick={handleExploreAll}
              className="hidden sm:flex items-center gap-1 text-xs font-mono font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer tactile-press"
            >
              <span>{lang === 'fa' ? 'کاتالوگ کامل' : 'Full Rack'}</span>
              {lang === 'fa' ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* High-Density 2 or 3 Column Compact Rack */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredItems.map(product => (
            <ProductCard key={product.id} product={product} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
};
