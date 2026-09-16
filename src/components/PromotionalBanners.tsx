import React from 'react';
import { ArrowRight, ArrowLeft, Zap, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const PromotionalBanners: React.FC = () => {
  const { lang, setFilters, setActiveTab } = useStore();

  const handleBannerClick = (cat: string, onSaleOnly = false) => {
    setFilters(prev => ({
      ...prev,
      selectedCategory: cat,
      onSaleOnly,
      searchQuery: ''
    }));
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Banner 1: Audio */}
        <div
          onClick={() => handleBannerClick('audio')}
          className="group relative h-64 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-between text-white shadow-md cursor-pointer"
        >
          <img
            src="/images/products/photo-1505740420928-5e560c06d30e.jpg"
            alt="Audio Studio"
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-50 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="relative z-10 flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-mono font-bold tracking-wider">
              STUDIO SOUND
            </span>
            <span className="text-xs font-mono text-[#62DB00] font-bold">UP TO 30% OFF</span>
          </div>

          <div className="relative z-10 text-right rtl:text-right ltr:text-left">
            <h3 className="text-lg sm:text-xl font-black mb-1">
              {lang === 'fa' ? 'تجهیزات صوتی حرفه‌ای' : 'Audiophile Studio Gear'}
            </h3>
            <p className="text-xs text-zinc-300 line-clamp-1 mb-3">
              {lang === 'fa' ? 'هدفون‌های Hi-Res با حذف نویز فعال' : 'Hi-Res certified wireless acoustics'}
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#62DB00] group-hover:underline">
              <span>{lang === 'fa' ? 'مشاهده محصولات' : 'Shop Collection'}</span>
              {lang === 'fa' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </div>
          </div>
        </div>

        {/* Banner 2: Workspace Essentials */}
        <div
          onClick={() => handleBannerClick('accessories')}
          className="group relative h-64 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-between text-white shadow-md cursor-pointer"
        >
          <img
            src="/images/products/photo-1527864550417-7fd91fc51a46.jpg"
            alt="Desk Setup"
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-50 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="relative z-10 flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-mono font-bold tracking-wider">
              WORKSPACE
            </span>
            <span className="text-xs font-mono text-sky-400 font-bold">SOLID WALNUT</span>
          </div>

          <div className="relative z-10 text-right rtl:text-right ltr:text-left">
            <h3 className="text-lg sm:text-xl font-black mb-1">
              {lang === 'fa' ? 'اکسسوری‌های ارگونومیک میز' : 'Minimal Desk Setups'}
            </h3>
            <p className="text-xs text-zinc-300 line-clamp-1 mb-3">
              {lang === 'fa' ? 'استندهای چوب گردو و نورپردازی مانیتور' : 'Engineered solid wood monitor stands'}
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 group-hover:underline">
              <span>{lang === 'fa' ? 'مشاهده محصولات' : 'Shop Collection'}</span>
              {lang === 'fa' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </div>
          </div>
        </div>

        {/* Banner 3: Keyboards & Gaming */}
        <div
          onClick={() => handleBannerClick('peripherals')}
          className="group relative h-64 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-between text-white shadow-md cursor-pointer"
        >
          <img
            src="/images/products/photo-1587829741301-dc798b83add3.jpg"
            alt="Keyboards"
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-50 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="relative z-10 flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-mono font-bold tracking-wider">
              CUSTOM MECHANICAL
            </span>
            <span className="text-xs font-mono text-amber-400 font-bold">HOT-SWAP</span>
          </div>

          <div className="relative z-10 text-right rtl:text-right ltr:text-left">
            <h3 className="text-lg sm:text-xl font-black mb-1">
              {lang === 'fa' ? 'کیبوردهای مکانیکال آلومینیومی' : 'Custom CNC Keyboards'}
            </h3>
            <p className="text-xs text-zinc-300 line-clamp-1 mb-3">
              {lang === 'fa' ? 'سوئیچ‌های روغن‌کاری شده و شاسی ماشین‌کاری' : 'Factory lubed linear & tactile switches'}
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:underline">
              <span>{lang === 'fa' ? 'مشاهده محصولات' : 'Shop Collection'}</span>
              {lang === 'fa' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
