import React, { useState } from 'react';
import {
  Headphones,
  Shirt,
  Laptop,
  Watch,
  Briefcase,
  Coffee,
  Home,
  ArrowLeft,
  ArrowRight,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';
import { ProductCard } from './ProductCard';
import { playTactileClick } from '../utils/sound';

interface CategoryStyleConfig {
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
  iconColor: string;
  lightBg: string;
  borderTint: string;
  activeRing: string;
  badgeBg: string;
  badgeText: string;
  descriptionFa: string;
}

const CATEGORY_STYLES: Record<string, CategoryStyleConfig> = {
  apparel: {
    icon: <Shirt className="w-6 h-6" />,
    gradient: 'from-emerald-500 to-teal-500',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/80',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    lightBg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    borderTint: 'border-emerald-200/80 dark:border-emerald-800/60',
    activeRing: 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/50 shadow-md shadow-emerald-500/10',
    badgeBg: 'bg-emerald-100/80 dark:bg-emerald-900/60',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    descriptionFa: 'کالکشن لباس‌های مینیمال، تیشرت‌های پنبه ارگانیک، شلوارها و هودی‌های راحت و باکیفیت لومینا.'
  },
  audio: {
    icon: <Headphones className="w-6 h-6" />,
    gradient: 'from-rose-500 to-pink-500',
    iconBg: 'bg-rose-100 dark:bg-rose-950/80',
    iconColor: 'text-rose-600 dark:text-rose-400',
    lightBg: 'bg-rose-50/50 dark:bg-rose-950/20',
    borderTint: 'border-rose-200/80 dark:border-rose-800/60',
    activeRing: 'ring-2 ring-rose-500 border-rose-500 bg-rose-50/90 dark:bg-rose-950/50 shadow-md shadow-rose-500/10',
    badgeBg: 'bg-rose-100/80 dark:bg-rose-900/60',
    badgeText: 'text-rose-700 dark:text-rose-300',
    descriptionFa: 'هدفون‌های حرفه‌ای مانیتورینگ، نویزکنسلینگ فعال هیبریدی، ایرپادهای بیسیم و اسپیکرهای های‌فای.'
  },
  workspace: {
    icon: <Laptop className="w-6 h-6" />,
    gradient: 'from-sky-500 to-blue-500',
    iconBg: 'bg-sky-100 dark:bg-sky-950/80',
    iconColor: 'text-sky-600 dark:text-sky-400',
    lightBg: 'bg-sky-50/50 dark:bg-sky-950/20',
    borderTint: 'border-sky-200/80 dark:border-sky-800/60',
    activeRing: 'ring-2 ring-sky-500 border-sky-500 bg-sky-50/90 dark:bg-sky-950/50 shadow-md shadow-sky-500/10',
    badgeBg: 'bg-sky-100/80 dark:bg-sky-900/60',
    badgeText: 'text-sky-700 dark:text-sky-300',
    descriptionFa: 'لوازم ارگونومیک ستاپ، کیبوردهای مکانیکال آلومینیومی، استندهای چوب گردو و تجهیزات تمرکز کاری.'
  },
  'smart-wear': {
    icon: <Watch className="w-6 h-6" />,
    gradient: 'from-amber-500 to-yellow-500',
    iconBg: 'bg-amber-100 dark:bg-amber-950/80',
    iconColor: 'text-amber-600 dark:text-amber-400',
    lightBg: 'bg-amber-50/50 dark:bg-amber-950/20',
    borderTint: 'border-amber-200/80 dark:border-amber-800/60',
    activeRing: 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/90 dark:bg-amber-950/50 shadow-md shadow-amber-500/10',
    badgeBg: 'bg-amber-100/80 dark:bg-amber-900/60',
    badgeText: 'text-amber-700 dark:text-amber-300',
    descriptionFa: 'ساعت‌های هوشمند پرچمدار با بدنه تیتانیوم، سنسورهای دقیق پایش سلامت و شارژدهی طولانی مدت.'
  },
  lifestyle: {
    icon: <Briefcase className="w-6 h-6" />,
    gradient: 'from-orange-500 to-amber-500',
    iconBg: 'bg-orange-100 dark:bg-orange-950/80',
    iconColor: 'text-orange-600 dark:text-orange-400',
    lightBg: 'bg-orange-50/50 dark:bg-orange-950/20',
    borderTint: 'border-orange-200/80 dark:border-orange-800/60',
    activeRing: 'ring-2 ring-orange-500 border-orange-500 bg-orange-50/90 dark:bg-orange-950/50 shadow-md shadow-orange-500/10',
    badgeBg: 'bg-orange-100/80 dark:bg-orange-900/60',
    badgeText: 'text-orange-700 dark:text-orange-300',
    descriptionFa: 'کیف‌های چرم طبیعی دست‌دوز، کوله‌پشتی‌های اولترالایت ضدآب مسافرتی و اکسسوری‌های مینیمال.'
  },
  coffee: {
    icon: <Coffee className="w-6 h-6" />,
    gradient: 'from-purple-500 to-indigo-500',
    iconBg: 'bg-purple-100 dark:bg-purple-950/80',
    iconColor: 'text-purple-600 dark:text-purple-400',
    lightBg: 'bg-purple-50/50 dark:bg-purple-950/20',
    borderTint: 'border-purple-200/80 dark:border-purple-800/60',
    activeRing: 'ring-2 ring-purple-500 border-purple-500 bg-purple-50/90 dark:bg-purple-950/50 shadow-md shadow-purple-500/10',
    badgeBg: 'bg-purple-100/80 dark:bg-purple-900/60',
    badgeText: 'text-purple-700 dark:text-purple-300',
    descriptionFa: 'کتری‌های برقی هوشمند باریستا، دانه‌های قهوه تخصصی و ماگ‌های عایق حرارتی استیل دو جداره.'
  },
  'home-design': {
    icon: <Home className="w-6 h-6" />,
    gradient: 'from-indigo-500 to-cyan-500',
    iconBg: 'bg-indigo-100 dark:bg-indigo-950/80',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    lightBg: 'bg-indigo-50/50 dark:bg-indigo-950/20',
    borderTint: 'border-indigo-200/80 dark:border-indigo-800/60',
    activeRing: 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/90 dark:bg-indigo-950/50 shadow-md shadow-indigo-500/10',
    badgeBg: 'bg-indigo-100/80 dark:bg-indigo-900/60',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    descriptionFa: 'چراغ‌های هوشمند امبینت و کهربایی، دکوری‌های بتنی دست‌ساز و المان‌های آرامش‌بخش خانگی.'
  }
};

export const CategoriesPage: React.FC = () => {
  const { lang, products, setActiveTab } = useStore();
  const [selectedCatId, setSelectedCatId] = useState<string>('all');

  const selectedCategory = CATEGORIES.find(c => c.id === selectedCatId);
  const selectedStyle = selectedCatId !== 'all' && CATEGORY_STYLES[selectedCatId]
    ? CATEGORY_STYLES[selectedCatId]
    : null;

  const categoryProducts = products.filter(
    p => selectedCatId === 'all' || p.category === selectedCatId
  );

  const handleSelectCategory = (id: string) => {
    playTactileClick();
    setSelectedCatId(id);
  };

  return (
    <div className="py-6 sm:py-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* 1. Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'fa' ? 'دسته‌بندی‌های تخصصی و کالکشن‌ها' : 'Curated Categories'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              {lang === 'fa' ? 'دسته‌بندی‌های فروشگاه لومینا' : 'Hardware & Lifestyle Categories'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 max-w-xl leading-relaxed">
              {lang === 'fa'
                ? 'مرور کامل محصولات بر اساس دسته‌بندی با آیکون‌های رنگی و دسترسی مستقیم به کالاهای منتخب.'
                : 'Browse all products categorized by hardware collection and lifestyle essentials.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSelectCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                selectedCatId === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <span>{lang === 'fa' ? 'نمایش همه محصولات' : 'View All'}</span>
            </button>
          </div>
        </div>

        {/* 2. Beautiful Colorful Categories Selector (7-Column Grid on Desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {CATEGORIES.map(cat => {
            const style = CATEGORY_STYLES[cat.id] || {
              icon: <Layers className="w-6 h-6" />,
              gradient: 'from-emerald-500 to-teal-500',
              iconBg: 'bg-emerald-100 dark:bg-emerald-950/80',
              iconColor: 'text-emerald-600 dark:text-emerald-400',
              lightBg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
              borderTint: 'border-emerald-200/80 dark:border-emerald-800/60',
              activeRing: 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/90 shadow-md',
              badgeBg: 'bg-emerald-100',
              badgeText: 'text-emerald-700',
              descriptionFa: ''
            };

            const isSelected = cat.id === selectedCatId;
            const count = products.filter(p => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.id)}
                className={`group relative flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? style.activeRing
                    : `${style.lightBg} ${style.borderTint} hover:shadow-md hover:-translate-y-0.5`
                }`}
              >
                {/* Colorful Rounded Icon Container */}
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${style.iconBg} ${style.iconColor} flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110 shadow-xs`}
                >
                  {style.icon}
                </div>

                {/* Category Title */}
                <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight mb-1 truncate max-w-full">
                  {lang === 'fa' ? cat.nameFa : cat.name}
                </span>

                {/* Item Count Badge */}
                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${style.badgeBg} ${style.badgeText} tabular-nums`}
                >
                  {count} {lang === 'fa' ? 'کالا' : 'items'}
                </span>

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-2 left-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-50 dark:fill-emerald-950" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* 3. Active Category Banner & Description */}
        <div className="rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-4">
            {selectedStyle ? (
              <div
                className={`w-12 h-12 rounded-xl ${selectedStyle.iconBg} ${selectedStyle.iconColor} flex items-center justify-center shrink-0`}
              >
                {selectedStyle.icon}
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center shrink-0">
                <Layers className="w-6 h-6" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                  {selectedCatId === 'all'
                    ? (lang === 'fa' ? 'همه محصولات فروشگاه' : 'All Products')
                    : (selectedCategory ? (lang === 'fa' ? selectedCategory.nameFa : selectedCategory.name) : '')}
                </h2>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                  {categoryProducts.length} {lang === 'fa' ? 'محصول' : 'items'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed max-w-2xl">
                {selectedStyle
                  ? selectedStyle.descriptionFa
                  : 'تمامی تجهیزات، هدفون‌ها، لوازم کار و گجت‌های استاندارد با ۱۸ ماه گارانتی رسمی لومینا.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playTactileClick();
              setActiveTab('home');
            }}
            className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>{lang === 'fa' ? 'بازگشت به صفحه اصلی' : 'Back to Home'}</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4. Category Products Grid (Standard 4-Column Responsive Grid) */}
        <div>
          {categoryProducts.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
              <Layers className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {lang === 'fa' ? 'محصولی در این دسته‌بندی یافت نشد' : 'No products in this category'}
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {categoryProducts.map(product => (
                <div key={product.id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
