import React from 'react';
import { ArrowLeft, Sparkles, Compass, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const PromotionalBanners: React.FC = () => {
  const { lang, setActiveTab, setFilters } = useStore();

  return (
    <section className="py-6 sm:py-8 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-6">
          
          {/* Banner 1: Audio & Studio Essentials */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 text-white p-4.5 sm:p-7 flex flex-col justify-between min-h-[210px] sm:min-h-[250px] border border-slate-800 shadow-xs group">
            <img
              src="/images/products/photo-1546435770-a3e426bf472b.jpg"
              alt="Audio gear"
              className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:scale-103 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            <div className="relative z-10 text-right">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E80645]/90 text-white text-[11px] font-bold mb-2 shadow-xs">
                <Sparkles className="w-3 h-3" />
                <span>{lang === 'fa' ? 'کالکشن ویژه' : 'Special Collection'}</span>
              </span>
              <h3 className="text-base sm:text-xl font-black mb-1.5 leading-tight">
                {lang === 'fa' ? 'تجهیزات صوتی استودیویی های-فای' : 'Studio-Grade Acoustic Sound'}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-sm mb-3 leading-relaxed font-normal">
                {lang === 'fa'
                  ? 'هدفون‌ها و اسپیکرهای حرفه‌ای با تفکیک فرکانسی دقیق و حذف نویز فعال.'
                  : 'Studio-grade headphones and wireless audio with acoustic clarity.'}
              </p>
            </div>

            <div className="relative z-10 text-right">
              <button
                onClick={() => {
                  setFilters(prev => ({ ...prev, selectedCategory: 'audio' }));
                  setActiveTab('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E80645] hover:bg-[#c7053b] text-white text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <span>{lang === 'fa' ? 'مشاهده محصولات صوتی' : 'Shop Audio Gear'}</span>
                <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
              </button>
            </div>
          </div>

          {/* Banner 2: Minimal Workspace */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 text-white p-4.5 sm:p-7 flex flex-col justify-between min-h-[210px] sm:min-h-[250px] border border-slate-800 shadow-xs group">
            <img
              src="/images/products/photo-1587829741301-dc798b83add3.jpg"
              alt="Keyboard"
              className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:scale-103 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            <div className="relative z-10 text-right">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600/90 text-white text-[11px] font-bold mb-2 shadow-xs">
                <Compass className="w-3 h-3" />
                <span>{lang === 'fa' ? 'میز کار ارگونومیک' : 'Productivity Setup'}</span>
              </span>
              <h3 className="text-base sm:text-xl font-black mb-1.5 leading-tight">
                {lang === 'fa' ? 'چیدمان مینیمال و ارگونومیک محیط کار' : 'Minimalist Desk Setups'}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-sm mb-3 leading-relaxed font-normal">
                {lang === 'fa'
                  ? 'کیبوردهای مکانیکال گسکت‌مانت، پایه‌های چوب گردو و دسک‌پدهای ارگونومیک.'
                  : 'Gasket-mounted mechanical keyboards and walnut desk organizers.'}
              </p>
            </div>

            <div className="relative z-10 text-right">
              <button
                onClick={() => {
                  setFilters(prev => ({ ...prev, selectedCategory: 'workspace' }));
                  setActiveTab('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <span>{lang === 'fa' ? 'مشاهده تجهیزات میز کار' : 'Shop Desk Essentials'}</span>
                <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
