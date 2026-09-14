import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  Clock,
  Tag,
  ShoppingBag,
  Heart,
  Eye,
  Check,
  Copy,
  ChevronLeft,
  ArrowRight,
  Gift,
  Percent,
  CheckCircle,
  TrendingDown,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Festival, FestivalProduct, Product } from '../types';
import { getFestivalTheme } from '../utils/festivalTheme';
import { useMagneticSnap } from '../hooks/useMagneticSnap';

interface FestivalCardItemProps {
  festProd: FestivalProduct;
  fullProd: Product;
}

const FestivalCardItem: React.FC<FestivalCardItemProps> = ({ festProd, fullProd }) => {
  const { lang, formatPrice, addFestivalProductToCart, openProductDetails, setQuickViewProduct, toggleWishlist, isInWishlist } = useStore();
  const { ref, style, handleMouseMove, handleMouseLeave } = useMagneticSnap(10, 8);

  const savings = festProd.originalPrice - festProd.discountedPrice;
  const discountPercent = festProd.discountPercent || Math.round((savings / festProd.originalPrice) * 100);

  return (
    <div
      ref={ref}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative liquid-glass-card rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between select-none"
    >
      {/* Discount Badge */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-end">
        <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black text-xs shadow-md shadow-rose-600/30">
          {discountPercent}٪-
        </span>
        {festProd.stock && festProd.stock <= 5 && (
          <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-white font-bold text-[10px] shadow-xs animate-pulse">
            {lang === 'fa' ? 'تنها چند عدد باقیست' : 'Few Left'}
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={() => toggleWishlist(fullProd.id)}
        className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs flex items-center justify-center text-slate-400 hover:text-rose-500 shadow-sm transition-colors cursor-pointer"
      >
        <Heart
          className={`w-4 h-4 ${
            isInWishlist(fullProd.id) ? 'fill-rose-500 text-rose-500' : ''
          }`}
        />
      </button>

      {/* Image Container */}
      <div
        onClick={() => openProductDetails(fullProd)}
        className="relative w-full aspect-square bg-slate-100 dark:bg-slate-800/50 overflow-hidden cursor-pointer flex items-center justify-center p-4"
      >
        <img
          src={festProd.image || 'https://via.placeholder.com/300'}
          alt={festProd.nameFa || festProd.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Quick View Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProduct(fullProd);
          }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold backdrop-blur-xs flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{lang === 'fa' ? 'مشاهده سریع' : 'Quick View'}</span>
        </button>
      </div>

      {/* Content Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            {festProd.brand || 'Lumina Collection'}
          </span>
          <h3
            onClick={() => openProductDetails(fullProd)}
            className="text-sm font-bold text-slate-800 dark:text-slate-100 hover:text-rose-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {lang === 'fa' ? festProd.nameFa : (festProd.name || festProd.nameFa)}
          </h3>
        </div>

        {/* Stock indicator */}
        {festProd.stock && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              <span>{lang === 'fa' ? 'موجودی تخصیص‌یافته جشنواره' : 'Festival Stock'}</span>
              <span className="text-rose-600 font-bold">{festProd.stock} عدد</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                style={{ width: `${Math.min(100, (festProd.stock / 20) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Pricing & Savings */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-400 line-through">
              {formatPrice(festProd.originalPrice)}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
              {lang === 'fa' ? `سود شما: ${formatPrice(savings)}` : `Save ${formatPrice(savings)}`}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {formatPrice(festProd.discountedPrice)}
            </div>

            <button
              onClick={() => addFestivalProductToCart(fullProd, festProd.discountedPrice, festProd.stock)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{lang === 'fa' ? 'خرید جشنواره' : 'Add Deal'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FestivalPage: React.FC = () => {
  const {
    festivals,
    activeFestival,
    selectedFestival,
    setSelectedFestival,
    setActiveTab,
    lang,
    formatPrice,
    addFestivalProductToCart,
    products,
    openProductDetails,
    setQuickViewProduct,
    toggleWishlist,
    isInWishlist
  } = useStore();

  const currentFest = selectedFestival || activeFestival || festivals.find(f => f.isActive) || festivals[0];
  const theme = getFestivalTheme(currentFest?.themeColor || 'rose');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    if (!currentFest || !currentFest.endTimestamp) return;

    const calculate = () => {
      const diff = currentFest.endTimestamp - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [currentFest]);

  if (!currentFest) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <Flame className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          {lang === 'fa' ? 'جشنواره فعالی یافت نشد' : 'No Active Festivals Found'}
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          {lang === 'fa'
            ? 'در حال حاضر جشنواره تخفیفی در سایت در جریان نیست. از صفحه محصولات دیدن فرمایید.'
            : 'There are currently no active discount festivals. Please explore the main catalog.'}
        </p>
        <button
          onClick={() => setActiveTab('home')}
          className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm cursor-pointer"
        >
          {lang === 'fa' ? 'بازگشت به فروشگاه' : 'Back to Store'}
        </button>
      </div>
    );
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  const festivalProducts = currentFest.products || [];

  // Filter categories
  const categories = ['all', ...Array.from(new Set(festivalProducts.map(p => p.category).filter(Boolean)))];

  const filteredProducts = festivalProducts.filter(p => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="min-h-screen pb-20">
      {/* Top Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            <span>{lang === 'fa' ? 'بازگشت به فروشگاه اصلی' : 'Back to Main Store'}</span>
          </button>

          {/* If there are multiple festivals, provide quick selector */}
          {festivals.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                {lang === 'fa' ? 'سایر جشنواره‌ها:' : 'Other Festivals:'}
              </span>
              {festivals.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFestival(f)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    f.id === currentFest.id
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {f.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${theme.cardGradient} border ${theme.cardBorder} p-6 sm:p-10 transition-all`}>
          {/* Ambient Lighting */}
          <div className={`absolute -top-32 -right-32 w-96 h-96 ${theme.glowTop} rounded-full blur-3xl pointer-events-none`} />
          <div className={`absolute -bottom-32 -left-32 w-96 h-96 ${theme.glowBottom} rounded-full blur-3xl pointer-events-none`} />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} ${theme.badgeText} font-black text-xs shadow-xs animate-pulse`}>
                  <Flame className={`w-4 h-4 ${theme.badgeIcon}`} />
                  <span>{currentFest.badgeText || (lang === 'fa' ? 'جشنواره طلایی تخفیف' : 'Golden Festival')}</span>
                </span>

                {currentFest.discountPercent && (
                  <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full ${theme.discountPillBg} ${theme.discountPillText} font-bold text-xs border ${theme.discountPillBorder}`}>
                    <Percent className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                    <span>{lang === 'fa' ? `تخفیف تا ${currentFest.discountPercent}٪` : `Up to ${currentFest.discountPercent}% OFF`}</span>
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-black ${theme.titleText} tracking-tight leading-tight`}>
                  {lang === 'fa' ? currentFest.title : (currentFest.titleEn || currentFest.title)}
                </h1>

                {/* Optional Slogan */}
                {currentFest.slogan && (
                  <p className={`text-sm sm:text-base ${theme.sloganText} font-medium leading-relaxed`}>
                    «{lang === 'fa' ? currentFest.slogan : (currentFest.sloganEn || currentFest.slogan)}»
                  </p>
                )}

                {currentFest.description && (
                  <p className={`text-xs sm:text-sm ${theme.descriptionText} leading-relaxed pt-1`}>
                    {lang === 'fa' ? currentFest.description : (currentFest.descriptionEn || currentFest.description)}
                  </p>
                )}
              </div>

              {/* Coupons List */}
              {currentFest.coupons && currentFest.coupons.length > 0 && (
                <div className="pt-2">
                  <span className={`text-xs ${theme.clockNumberLabel} block mb-2 font-bold`}>
                    {lang === 'fa' ? 'کدهای تخفیف اختصاصی این رویداد:' : 'Exclusive Event Coupons:'}
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {currentFest.coupons.map((coupon, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 p-2 px-3 rounded-xl ${theme.couponPillBg} border ${theme.couponPillBorder} backdrop-blur-md shadow-2xs`}
                      >
                        <Tag className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                        <span className={`font-mono font-bold ${theme.couponPillText} text-xs tracking-wider`}>{coupon.code}</span>
                        <span className={`text-[11px] ${theme.sloganText}`}>
                          ({coupon.type === 'fixed' ? formatPrice(coupon.amount) : `${coupon.amount}٪`})
                        </span>
                        <button
                          onClick={() => handleCopyCode(coupon.code)}
                          className={`p-1 rounded-lg ${theme.couponPillHover} transition-colors cursor-pointer`}
                          title={lang === 'fa' ? 'کپی کد' : 'Copy'}
                        >
                          {copiedCoupon === coupon.code ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className={`w-3.5 h-3.5 ${theme.clockNumberLabel}`} />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Countdown Box */}
            <div className={`${theme.clockBoxBg} border ${theme.clockBoxBorder} p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-3 shrink-0 shadow-lg text-center w-full sm:w-auto`}>
              <div className={`flex items-center justify-center gap-2 ${theme.clockBoxTitle} text-xs font-bold`}>
                <Clock className={`w-4 h-4 ${theme.clockBoxIcon} animate-spin`} style={{ animationDuration: '6s' }} />
                <span>{lang === 'fa' ? 'شمارش معکوس پایان جشنواره' : 'Festival Closes In'}</span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 sm:gap-2 font-mono" style={{ direction: 'ltr' }}>
                <div className={`flex flex-col items-center justify-center ${theme.clockNumberBg} p-1.5 sm:p-3 rounded-xl sm:rounded-2xl border ${theme.clockNumberBorder}`}>
                  <span className={`text-base sm:text-2xl font-black ${theme.clockNumberText}`}>
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className={`text-[9px] sm:text-[10px] ${theme.clockNumberLabel} mt-0.5`}>{lang === 'fa' ? 'روز' : 'Days'}</span>
                </div>
                <div className={`flex flex-col items-center justify-center ${theme.clockNumberBg} p-1.5 sm:p-3 rounded-xl sm:rounded-2xl border ${theme.clockNumberBorder}`}>
                  <span className={`text-base sm:text-2xl font-black ${theme.clockNumberText}`}>
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className={`text-[9px] sm:text-[10px] ${theme.clockNumberLabel} mt-0.5`}>{lang === 'fa' ? 'ساعت' : 'Hours'}</span>
                </div>
                <div className={`flex flex-col items-center justify-center ${theme.clockNumberBg} p-1.5 sm:p-3 rounded-xl sm:rounded-2xl border ${theme.clockNumberBorder}`}>
                  <span className={`text-base sm:text-2xl font-black ${theme.clockNumberText}`}>
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className={`text-[9px] sm:text-[10px] ${theme.clockNumberLabel} mt-0.5`}>{lang === 'fa' ? 'دقیقه' : 'Mins'}</span>
                </div>
                <div className={`flex flex-col items-center justify-center ${theme.clockSecondsBg} p-1.5 sm:p-3 rounded-xl sm:rounded-2xl border ${theme.clockSecondsBorder} animate-pulse`}>
                  <span className={`text-base sm:text-2xl font-black ${theme.clockSecondsText}`}>
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className={`text-[9px] sm:text-[10px] ${theme.clockSecondsText} mt-0.5`}>{lang === 'fa' ? 'ثانیه' : 'Secs'}</span>
                </div>
              </div>

              <p className={`text-[10px] sm:text-[11px] ${theme.clockNumberLabel} pt-0.5`}>
                {lang === 'fa' ? 'فرصت را از دست ندهید، موجودی محدود است' : 'Limited stock available at festival prices'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills & Product Counter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {cat === 'all' ? (lang === 'fa' ? 'همه محصولات تخفیف‌دار' : 'All Deals') : cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0">
            {lang === 'fa'
              ? `${filteredProducts.length} محصول شگفت‌انگیز یافت شد`
              : `${filteredProducts.length} discounted products`}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Tag className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
              {lang === 'fa' ? 'محصولی در این دسته‌بندی موجود نیست' : 'No products found in this category'}
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(festProd => {
              // Find matching full product from database if available
              const fullProd = (products.find(p => p.id === festProd.productId) || {
                id: festProd.productId,
                name: festProd.name || festProd.nameFa,
                nameFa: festProd.nameFa,
                brand: festProd.brand || 'Lumina',
                price: festProd.discountedPrice,
                originalPrice: festProd.originalPrice,
                category: festProd.category || 'digital',
                categoryFa: 'دیجیتال',
                rating: 4.8,
                reviewsCount: 32,
                image: festProd.image,
                images: [festProd.image],
                isNew: false,
                isFeatured: true,
                stock: festProd.stock || 10,
                soldCount: 42,
                description: 'محصول با تخفیف ویژه جشنواره',
                descriptionFa: 'محصول با تخفیف ویژه جشنواره',
                specs: {},
                features: [],
                featuresFa: [],
                tags: []
              }) as unknown as Product;

              return (
                <FestivalCardItem
                  key={festProd.productId}
                  festProd={festProd}
                  fullProd={fullProd}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
