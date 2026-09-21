import React from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Layers, ShieldCheck, Compass } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { playTactileClick } from '../utils/sound';

export const EditorialShowcase: React.FC = () => {
  const { products, lang, setActiveTab, setFilters } = useStore();

  // Pick the flagship product (or highest rated / featured)
  const flagshipProduct =
    products.find(p => p.id === 'lum-01') ||
    products.find(p => p.featured) ||
    products[0];

  // Pick two companion items (e.g. workspace stand and keyboard/accessories)
  const companionProducts = products
    .filter(p => p.id !== flagshipProduct?.id)
    .slice(0, 2);

  const handleExploreCollection = () => {
    playTactileClick();
    setFilters(prev => ({ ...prev, selectedCategory: 'all', onSaleOnly: false }));
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!flagshipProduct) return null;

  return (
    <section className="py-8 sm:py-12 border-b border-zinc-200 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#62DB00]" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#62DB00] font-bold">
                {lang === 'fa' ? 'روایت دیزاین و مهندسی' : 'CURATED HARDWARE ARCHITECTURE'}
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-display font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {lang === 'fa'
                ? 'ست‌آپ پیشنهادی استودیو: تمرکز، ارگونومی و صدای ناب'
                : 'The Flagship Setup: Acoustic & Spatial Harmony'}
            </h2>
          </div>

          <button
            onClick={handleExploreCollection}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer tactile-press shrink-0"
          >
            <span>{lang === 'fa' ? 'مشاهده کاتالوگ جامع' : 'Explore Complete Archive'}</span>
            {lang === 'fa' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Asymmetric Bento Layout: 7 Cols (Featured) + 5 Cols (Companions) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Featured Flagship Card (7 cols) */}
          <div className="lg:col-span-7 flex">
            <ProductCard
              product={flagshipProduct}
              variant="featured"
              priority={true}
            />
          </div>

          {/* Companion Recommended Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {companionProducts.map((companion, idx) => (
              <div key={companion.id} className="flex-1">
                <ProductCard
                  product={companion}
                  variant="recommended"
                  curatorNote={
                    idx === 0
                      ? 'Solid wood elevation matches studio acoustic aesthetics.'
                      : 'Zero-latency wireless controller for fluid creative flow.'
                  }
                  curatorNoteFa={
                    idx === 0
                      ? 'پایه ارگونومیک با چوب طبیعی گردو هماهنگ با خط آکوستیک استودیو.'
                      : 'سخت‌افزار مکانیکال با کمترین تاخیر برای جریان مداوم تمرکز و کارایی.'
                  }
                  pairingNote={idx === 0 ? 'Pairs with Horizon ANC' : 'Workspace Sync'}
                  pairingNoteFa={idx === 0 ? 'مکمل هدفون هورایزن' : 'همگام با میز کار'}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
