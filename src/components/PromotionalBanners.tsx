import React from 'react';
import { ArrowRight, ArrowLeft, Sparkles, Headphones, Laptop } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { playTactileClick } from '../utils/sound';

export const PromotionalBanners: React.FC = () => {
  const { lang, setFilters, setActiveTab } = useStore();

  const handleBannerClick = (cat: string) => {
    playTactileClick();
    setFilters(prev => ({
      ...prev,
      selectedCategory: cat,
      onSaleOnly: false,
      searchQuery: ''
    }));
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 select-none">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Banner 1: Audio Collection */}
        <div
          onClick={() => handleBannerClick('audio')}
          className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-900 to-zinc-950 p-6 sm:p-8 flex flex-col justify-between text-white shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer min-h-[200px] sm:min-h-[220px]"
        >
          <img
            src="/images/products/photo-1505740420928-5e560c06d30e.jpg"
            alt="Audio Studio"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent" />

          {/* Top Tag */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
              <Headphones className="w-3.5 h-3.5" />
              <span>{lang === 'fa' ? 'تجهیزات صوتی' : 'Audio Lab'}</span>
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">تا ۳۰٪ تخفیف</span>
          </div>

          {/* Bottom Title & CTA */}
          <div className="relative z-10 mt-6 text-right rtl:text-right ltr:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
              {lang === 'fa' ? 'هدفون‌ها و اسپیکرهای استودیویی' : 'Studio Headphones & Acoustics'}
            </h3>
            <p className="text-xs text-zinc-300 mb-3 line-clamp-1">
              {lang === 'fa' ? 'صدای خالص های‌فای با دیافراگم‌های تیتانیومی' : 'Hi-Res certified audio gear'}
            </p>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 group-hover:underline">
              <span>{lang === 'fa' ? 'مشاهده محصولات' : 'Shop Collection'}</span>
              {lang === 'fa' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </div>
          </div>
        </div>

        {/* Banner 2: Workspace Essentials */}
        <div
          onClick={() => handleBannerClick('workspace')}
          className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-slate-950 p-6 sm:p-8 flex flex-col justify-between text-white shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer min-h-[200px] sm:min-h-[220px]"
        >
          <img
            src="/images/products/photo-1527864550417-7fd91fc51a46.jpg"
            alt="Desk Setup"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent" />

          {/* Top Tag */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 text-[11px] font-semibold border border-sky-500/30">
              <Laptop className="w-3.5 h-3.5" />
              <span>{lang === 'fa' ? 'میز کار ارگونومیک' : 'Workspace'}</span>
            </span>
            <span className="text-xs font-mono font-bold text-sky-400">چوب گردو و آلومینیوم</span>
          </div>

          {/* Bottom Title & CTA */}
          <div className="relative z-10 mt-6 text-right rtl:text-right ltr:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
              {lang === 'fa' ? 'لوازم ستاپ و استندهای مینیمال' : 'Minimalist Desk Setup Platforms'}
            </h3>
            <p className="text-xs text-zinc-300 mb-3 line-clamp-1">
              {lang === 'fa' ? 'طراحی مهندسی ارگونومیک برای بازدهی حداکثری' : 'Ergonomic stands & accessories'}
            </p>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 group-hover:underline">
              <span>{lang === 'fa' ? 'مشاهده محصولات' : 'Shop Collection'}</span>
              {lang === 'fa' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
