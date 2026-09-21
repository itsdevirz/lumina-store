import React from 'react';
import { ArrowRight, ArrowLeft, Headphones, Layers, Keyboard, Sparkles, Activity } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { playTactileClick } from '../utils/sound';

export const PromotionalBanners: React.FC = () => {
  const { lang, setFilters, setActiveTab } = useStore();

  const handleBannerClick = (cat: string, onSaleOnly = false) => {
    playTactileClick();
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none">
      {/* Section Subtitle / Category Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#62DB00]" />
          <h2 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-bold">
            {lang === 'fa' ? 'دسته‌بندی‌های برگزیده استودیو' : 'Curated Hardware Collections'}
          </h2>
        </div>
        <span className="font-mono text-[10px] text-zinc-400">ARCHIVE 2026</span>
      </div>

      {/* Asymmetrical Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Flagship Banner (Large: 7 Cols) */}
        <div
          onClick={() => handleBannerClick('audio')}
          className="group relative lg:col-span-7 h-[300px] sm:h-[340px] rounded-3xl overflow-hidden bg-[#09090C] border border-zinc-800 p-6 sm:p-8 flex flex-col justify-between text-white shadow-xl cursor-pointer tactile-press"
        >
          {/* Background image with dramatic lighting */}
          <img
            src="/images/products/photo-1505740420928-5e560c06d30e.jpg"
            alt="Audio Studio"
            className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-105 group-hover:opacity-55 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
          
          {/* Precision Architectural Grid Line */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#62DB00]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Metadata */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-mono font-bold tracking-wider border border-white/15 flex items-center gap-1.5">
                <Headphones className="w-3 h-3 text-[#62DB00]" />
                <span>STUDIO ACOUSTICS</span>
              </span>
              <span className="hidden sm:inline-block font-mono text-[10px] text-zinc-400">
                SERIES // AUD-40
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#62DB00] text-black text-[10px] font-mono font-black">
              UP TO 30% OFF
            </span>
          </div>

          {/* Bottom Editorial Content */}
          <div className="relative z-10 text-right rtl:text-right ltr:text-left max-w-xl">
            <span className="text-[11px] font-mono text-[#62DB00] uppercase tracking-wider block mb-1">
              {lang === 'fa' ? 'مهندسی فرکانس‌های دقیق' : 'Precision Frequency Response'}
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-display font-extrabold mb-2 tracking-tight">
              {lang === 'fa' ? 'تجهیزات صوتی حرفه‌ای و مانیتورینگ' : 'Audiophile Studio Reference Gear'}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 mb-4 leading-relaxed font-normal">
              {lang === 'fa'
                ? 'هدفون‌های Hi-Res با دیافراگم بریلیوم خالص، حذف نویز فعال هیبریدی و تفکیک صدای استودیویی بی‌رقیب.'
                : 'Pure beryllium diaphragms, hybrid active noise cancellation, and sub-millisecond low-latency wireless transmission.'}
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#62DB00] group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
              <span>{lang === 'fa' ? 'ورود به کالکشن صوتی' : 'Explore Audio Lab'}</span>
              {lang === 'fa' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </div>
          </div>
        </div>

        {/* Stacked Right Column (5 Cols) */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          
          {/* Card 2: Workspace Essentials */}
          <div
            onClick={() => handleBannerClick('workspace')}
            className="group relative h-[142px] sm:h-[162px] rounded-2xl overflow-hidden bg-[#0C0D10] border border-zinc-800 p-5 flex flex-col justify-between text-white shadow-lg cursor-pointer tactile-press"
          >
            <img
              src="/images/products/photo-1527864550417-7fd91fc51a46.jpg"
              alt="Desk Setup"
              className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 group-hover:opacity-45 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[9px] font-mono font-bold tracking-wider border border-white/15 flex items-center gap-1 text-sky-300">
                <Layers className="w-3 h-3 text-sky-400" />
                <span>WORKSPACE ARCHITECTURE</span>
              </span>
              <span className="text-[10px] font-mono text-sky-400 font-bold">SOLID WALNUT</span>
            </div>

            <div className="relative z-10 text-right rtl:text-right ltr:text-left">
              <h3 className="text-sm sm:text-base font-display font-bold text-white mb-0.5">
                {lang === 'fa' ? 'استند و اکسسوری چوب گردو' : 'Solid Walnut Desk Platforms'}
              </h3>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-sky-400 group-hover:underline">
                <span>{lang === 'fa' ? 'مشاهده لوازم میز' : 'View Hardware'}</span>
                {lang === 'fa' ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
              </div>
            </div>
          </div>

          {/* Card 3: Keyboards & Custom CNC */}
          <div
            onClick={() => handleBannerClick('peripherals')}
            className="group relative h-[142px] sm:h-[162px] rounded-2xl overflow-hidden bg-[#0C0D10] border border-zinc-800 p-5 flex flex-col justify-between text-white shadow-lg cursor-pointer tactile-press"
          >
            <img
              src="/images/products/photo-1587829741301-dc798b83add3.jpg"
              alt="Keyboards"
              className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 group-hover:opacity-45 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[9px] font-mono font-bold tracking-wider border border-white/15 flex items-center gap-1 text-amber-300">
                <Keyboard className="w-3 h-3 text-amber-400" />
                <span>CUSTOM MECHANICAL</span>
              </span>
              <span className="text-[10px] font-mono text-amber-400 font-bold">CNC ANODIZED</span>
            </div>

            <div className="relative z-10 text-right rtl:text-right ltr:text-left">
              <h3 className="text-sm sm:text-base font-display font-bold text-white mb-0.5">
                {lang === 'fa' ? 'کیبوردهای مکانیکال آلومینیومی' : 'Precision CNC Anodized Keyboards'}
              </h3>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-400 group-hover:underline">
                <span>{lang === 'fa' ? 'مشاهده کیبوردها' : 'View Peripherals'}</span>
                {lang === 'fa' ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
