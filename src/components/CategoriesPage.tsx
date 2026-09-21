import React, { useState } from 'react';
import {
  FolderTree,
  Headphones,
  Shirt,
  Laptop,
  Watch,
  ShoppingBag,
  Tag,
  Briefcase,
  Coffee,
  Home,
  ArrowRight,
  ArrowLeft,
  Filter,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronRight,
  Boxes
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';
import { ProductCard } from './ProductCard';
import { playTactileClick } from '../utils/sound';

const ICON_MAP: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Headphones,
  Shirt,
  Laptop,
  Watch,
  ShoppingBag,
  Tag,
  Briefcase,
  Coffee,
  Home
};

export const CategoriesPage: React.FC = () => {
  const { lang, products, setFilters, setActiveTab } = useStore();
  const [selectedCatId, setSelectedCatId] = useState<string>('audio');

  const selectedCategory = CATEGORIES.find(c => c.id === selectedCatId) || CATEGORIES[0];
  const categoryProducts = products.filter(
    p => p.category === selectedCatId || (selectedCatId === 'all' ? true : false)
  );

  const handleSelectCategory = (id: string) => {
    playTactileClick();
    setSelectedCatId(id);
  };

  const handleExploreInShop = (catId: string) => {
    playTactileClick();
    setFilters(prev => ({
      ...prev,
      selectedCategory: catId,
      page: 1
    }));
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-8 sm:py-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#62DB00]" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#62DB00] font-bold">
                {lang === 'fa' ? 'آرشیو کاتالوگ و دسته‌بندی‌ها' : 'COLLECTION DIRECTORY'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {lang === 'fa' ? 'دسته‌بندی‌های تخصصی تجهیزات' : 'Specialized Hardware Archives'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-2xl leading-relaxed">
              {lang === 'fa'
                ? 'مرور کامل دسته‌بندی‌های سخت‌افزاری، قطعات استودیو، لوازم جانبی ارگونومیک و تجهیزات آکوستیک با جزئیات فنی و فیلترهای اختصاصی.'
                : 'Explore all hardware domains, studio acoustics, desktop ergonomics, and precision accessories cataloged by architectural standard.'}
            </p>
          </div>

          <button
            onClick={() => handleExploreInShop('all')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-mono font-bold hover:bg-[#62DB00] hover:text-black dark:hover:bg-[#62DB00] dark:hover:text-black transition-colors cursor-pointer tactile-press shadow-xs"
          >
            <span>{lang === 'fa' ? 'مشاهده همه محصولات فروشگاه' : 'View Full Store Catalog'}</span>
            {lang === 'fa' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Categories Bento Navigation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map(cat => {
            const IconComponent = ICON_MAP[cat.icon] || Headphones;
            const isSelected = cat.id === selectedCatId;

            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`relative flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-200 cursor-pointer tactile-press ${
                  isSelected
                    ? 'bg-zinc-100 dark:bg-zinc-800/90 border-zinc-900 dark:border-[#62DB00] shadow-sm'
                    : 'bg-white dark:bg-[#121215] border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-2.5 border border-zinc-200/60 dark:border-zinc-800">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                </div>

                <span className={`text-xs font-bold truncate max-w-full ${
                  isSelected ? 'text-zinc-900 dark:text-white' : 'text-zinc-700 dark:text-zinc-300'
                }`}>
                  {lang === 'fa' ? cat.nameFa : cat.name}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 mt-0.5 tabular-nums">
                  {lang === 'fa' ? `${cat.itemCount} قطعه` : `${cat.itemCount} items`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Category Highlight Banner */}
        {selectedCategory && (
          <div className="rounded-2xl bg-zinc-50 dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-mono font-bold">
                <Boxes className="w-3 h-3 text-[#62DB00]" />
                <span>{lang === 'fa' ? 'کالکشن انتخاب‌شده' : 'ACTIVE COLLECTION'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                {lang === 'fa' ? selectedCategory.nameFa : selectedCategory.name}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {(selectedCategory as any).description || (lang === 'fa'
                  ? 'برترین سخت‌افزارها و ادوات با استاندارد طراحی مدرن، تضمین اصالت و گارانتی طلایی ۲۴ ماهه لومینا.'
                  : 'Premium hardware and desktop architecture tested for high-performance creative setups.')}
              </p>
            </div>

            <button
              onClick={() => handleExploreInShop(selectedCategory.id)}
              className="px-5 py-3 rounded-xl bg-[#62DB00] hover:bg-[#52B800] text-black text-xs font-mono font-black transition-all cursor-pointer tactile-press shadow-sm flex items-center gap-2 whitespace-nowrap"
            >
              <span>{lang === 'fa' ? `مشاهده تمام کالاهای ${selectedCategory.nameFa}` : `Browse all ${selectedCategory.name}`}</span>
              {lang === 'fa' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Category Products Grid */}
        <div>
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-200/60 dark:border-zinc-800/60">
            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <span>{lang === 'fa' ? 'سخت‌افزارهای برگزیده این دسته' : 'Curated Items in this Collection'}</span>
              <span className="text-xs font-mono text-zinc-400 font-normal">
                ({categoryProducts.length})
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categoryProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                variant="grid"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
