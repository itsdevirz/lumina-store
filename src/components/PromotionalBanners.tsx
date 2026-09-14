import React from 'react';
import { ArrowLeft, Sparkles, Compass, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const PromotionalBanners: React.FC = () => {
  const { lang, setActiveTab, setFilters } = useStore();

  return (
    <section className="py-8 sm:py-10 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Banner 1: Audio & Studio Essentials */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between min-h-[260px] border border-slate-800 shadow-md group">
            <img
              src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=700&q=80"
              alt="Audio gear"
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            <div className="relative z-10 text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/90 text-white text-xs font-bold mb-3 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'کالکشن ویژه فصل' : 'Acoustic Masterclass'}</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-black mb-2 leading-tight">
                {lang === 'fa' ? 'تجهیزات صوتی استودیویی های-فای' : 'Studio-Grade Acoustic Sound'}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-sm mb-4 leading-relaxed font-normal">
                {lang === 'fa'
                  ? 'هدفون‌ها و اسپیکرهای حرفه‌ای با تفکیک فرکانسی دقیق و حذف نویز فعال پیشرفته.'
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-md"
              >
                <span>{lang === 'fa' ? 'مشاهده محصولات صوتی' : 'Shop Audio Gear'}</span>
                <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
              </button>
            </div>
          </div>

          {/* Banner 2: Minimal Workspace */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between min-h-[260px] border border-slate-800 shadow-md group">
            <img
              src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=700&q=80"
              alt="Keyboard"
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            <div className="relative z-10 text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/90 text-white text-xs font-bold mb-3 shadow-sm">
                <Compass className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'میز کار ارگونومیک' : 'Productivity Setup'}</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-black mb-2 leading-tight">
                {lang === 'fa' ? 'چیدمان مینیمال و ارگونومیک محیط کار' : 'Minimalist Desk Setups'}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-sm mb-4 leading-relaxed font-normal">
                {lang === 'fa'
                  ? 'کیبوردهای مکانیکال گسکت‌مانت، پایه‌های چوب گردو و دسک‌پدهای چرمی ارگونومیک.'
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-md"
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
