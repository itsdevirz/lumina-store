import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Flame,
  Star,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  Filter,
  ArrowUpDown,
  Search,
  CheckCircle2,
  ChevronRight,
  ShoppingBag,
  Heart,
  Eye,
  ArrowLeft,
  PackageCheck,
  Medal
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

export const BestsellersPage: React.FC = () => {
  const {
    products,
    lang,
    formatPrice,
    setActiveTab,
    setFilters,
    addToCart,
    openProductDetails,
    setQuickViewProduct,
    toggleWishlist,
    isInWishlist
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'sales' | 'rating' | 'price-asc' | 'price-desc'>('sales');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(false);

  const categories = [
    { id: 'all', nameFa: 'همه پرفروش‌ها', nameEn: 'All Best Sellers' },
    { id: 'audio', nameFa: 'سیستم‌های صوتی', nameEn: 'Audio & Acoustics' },
    { id: 'smart-wear', nameFa: 'ساعت و گجت پوشیدنی', nameEn: 'Smart Wearables' },
    { id: 'workspace', nameFa: 'تجهیزات میز کار', nameEn: 'Workspace Setup' },
    { id: 'lifestyle', nameFa: 'سبک زندگی و سفر', nameEn: 'Lifestyle & EDC' }
  ];

  // Base bestsellers list: sorted primarily by sales volume and rank
  const rankedAll = useMemo(() => {
    return [...products].sort((a, b) => {
      // If explicit rank exists, prioritize rank 1..n
      if (a.rank !== undefined && b.rank !== undefined) {
        return a.rank - b.rank;
      }
      if (a.rank !== undefined) return -1;
      if (b.rank !== undefined) return 1;
      // Otherwise sort by soldCount
      return (b.soldCount || 0) - (a.soldCount || 0);
    });
  }, [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return rankedAll.filter(p => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      if (onlyInStock && p.stock <= 0) {
        return false;
      }
      if (onlyDiscounted && (!p.originalPrice || p.originalPrice <= p.price)) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = p.nameFa.toLowerCase().includes(query) || p.nameEn.toLowerCase().includes(query);
        const matchesBrand = p.brand?.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'sales') {
        const rankA = a.rank ?? 999;
        const rankB = b.rank ?? 999;
        if (rankA !== rankB) return rankA - rankB;
        return (b.soldCount || 0) - (a.soldCount || 0);
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      return 0;
    });
  }, [rankedAll, selectedCategory, onlyInStock, onlyDiscounted, searchQuery, sortBy]);

  // Top 3 for the podium showcase (from general top sellers)
  const top3 = useMemo(() => rankedAll.slice(0, 3), [rankedAll]);

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-[#09090B] pb-16 font-sans">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <button
            onClick={() => setActiveTab('home')}
            className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            {lang === 'fa' ? 'صفحه اصلی' : 'Home'}
          </button>
          <span>/</span>
          <span className="text-zinc-900 dark:text-white font-bold">
            {lang === 'fa' ? 'پرفروش‌ترین‌ها' : 'Best Sellers'}
          </span>
        </div>
      </div>

      {/* Hero Header Banner */}
      <section className="relative overflow-hidden pt-6 pb-10 sm:pt-8 sm:pb-14 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="absolute inset-0 bg-radial from-[#62DB00]/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#62DB00]/10 text-[#62DB00] border border-[#62DB00]/30 shadow-xs">
                <Trophy className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'رتبه‌بندی رسمی محبوب‌ترین‌ها • ۲۰۲۶' : 'Official Rankings • 2026'}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                {lang === 'fa' ? 'پرفروش‌ترین‌های فروشگاه لومینا' : 'Top Best Selling Gadgets'}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {lang === 'fa'
                  ? 'برگزیده‌ترین و پرتقاضاترین ادوات سخت‌افزاری و دیجیتال بر اساس آمار واقعی سفارشات خریداران، بالاترین میزان رضایت‌مندی و بررسی‌های ثبت‌شده.'
                  : 'Discover the most requested tech and lifestyle gear based on verified customer orders, peak review ratings, and real-time community engagement.'}
              </p>

              {/* Trust Badges Bar */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#62DB00]" />
                  <span>{lang === 'fa' ? 'ضمانت اصالت ۱۰۰٪' : '100% Genuine'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#62DB00]" />
                  <span>{lang === 'fa' ? 'ارسال اکسپرس فوری' : 'Express Delivery'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{lang === 'fa' ? 'رضایت میانگین ۴.۹ از ۵' : '4.9/5 Rating'}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Button to full shop */}
            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, selectedCategory: 'all', sortBy: 'popular' }));
                setActiveTab('shop');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <span>{lang === 'fa' ? 'مشاهده همه محصولات فروشگاه' : 'Explore Full Catalog'}</span>
              <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Top 3 Champions Podium (if no query active) */}
        {!searchQuery && selectedCategory === 'all' && top3.length >= 3 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Medal className="w-5 h-5 text-amber-500" />
                <h2 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white">
                  {lang === 'fa' ? 'سکوی ۳ کانون برتر تقاضا' : 'Top 3 Champions Podium'}
                </h2>
              </div>
              <span className="text-xs text-zinc-400 font-mono">
                {lang === 'fa' ? 'بر اساس بیشترین حجم خرید' : 'Ranked by volume'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {top3.map((product, idx) => {
                const podiumColors = [
                  {
                    rankText: '#1',
                    badgeBg: 'bg-amber-500 text-black border-amber-400',
                    cardBorder: 'border-amber-400/50 dark:border-amber-500/30',
                    labelFa: 'رتبه اول فروشگاه',
                    labelEn: 'Gold Champion',
                    glow: 'shadow-amber-500/10'
                  },
                  {
                    rankText: '#2',
                    badgeBg: 'bg-slate-300 text-black border-slate-200',
                    cardBorder: 'border-slate-300/60 dark:border-zinc-700',
                    labelFa: 'رتبه دوم فروشگاه',
                    labelEn: 'Silver Champion',
                    glow: 'shadow-slate-400/10'
                  },
                  {
                    rankText: '#3',
                    badgeBg: 'bg-amber-700 text-white border-amber-600',
                    cardBorder: 'border-amber-700/50 dark:border-amber-700/30',
                    labelFa: 'رتبه سوم فروشگاه',
                    labelEn: 'Bronze Champion',
                    glow: 'shadow-amber-700/10'
                  }
                ][idx];

                return (
                  <div
                    key={product.id}
                    onClick={() => openProductDetails(product)}
                    className={`relative p-4 rounded-2xl bg-white dark:bg-[#121215] border ${podiumColors.cardBorder} shadow-lg ${podiumColors.glow} flex flex-col justify-between transition-all hover:scale-[1.01] cursor-pointer group`}
                  >
                    {/* Top Rank Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black font-mono border shadow-xs ${podiumColors.badgeBg}`}>
                          {podiumColors.rankText}
                        </span>
                        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                          {lang === 'fa' ? podiumColors.labelFa : podiumColors.labelEn}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {product.soldCount ? `${product.soldCount} ${lang === 'fa' ? 'سفارش' : 'sold'}` : ''}
                      </span>
                    </div>

                    {/* Image & Product info */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                        <img
                          src={product.images[0]}
                          alt={lang === 'fa' ? product.nameFa : product.nameEn}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                          {product.brand}
                        </p>
                        <h3 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white line-clamp-2 mt-0.5">
                          {lang === 'fa' ? product.nameFa : product.nameEn}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold font-mono text-zinc-700 dark:text-zinc-300">
                            {product.rating}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            ({product.reviewsCount})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action footer */}
                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                      <div>
                        <div className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white font-mono">
                          {formatPrice(product.price)}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-[10px] text-zinc-400 line-through font-mono">
                            {formatPrice(product.originalPrice)}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#62DB00] hover:bg-[#52B800] text-black font-bold text-xs transition-all shadow-xs cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{lang === 'fa' ? 'افزودن به سبد' : 'Add to Cart'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Filter and Control Bar */}
        <section className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {categories.map(cat => {
                const count = cat.id === 'all'
                  ? rankedAll.length
                  : rankedAll.filter(p => p.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedCategory === cat.id
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                        : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{lang === 'fa' ? cat.nameFa : cat.nameEn}</span>
                    <span className="text-[10px] opacity-70 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Search */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={lang === 'fa' ? 'جستجو در پرفروش‌ها...' : 'Search top sellers...'}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pr-9 pl-3 py-2 text-xs focus:outline-hidden focus:border-[#62DB00] transition-colors"
              />
            </div>
          </div>

          {/* Secondary Sorting & Toggle Options */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-zinc-500 dark:text-zinc-400 font-bold">
                  {lang === 'fa' ? 'ترتیب:' : 'Sort:'}
                </span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-hidden cursor-pointer"
                >
                  <option value="sales">{lang === 'fa' ? 'بیشترین فروش (پیش‌فرض)' : 'Best Selling (Default)'}</option>
                  <option value="rating">{lang === 'fa' ? 'بالاترین امتیاز رضایت' : 'Highest Rated'}</option>
                  <option value="price-asc">{lang === 'fa' ? 'ارزان‌ترین' : 'Price: Low to High'}</option>
                  <option value="price-desc">{lang === 'fa' ? 'گران‌ترین' : 'Price: High to Low'}</option>
                </select>
              </div>

              {/* In Stock toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-600 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={e => setOnlyInStock(e.target.checked)}
                  className="rounded text-[#62DB00] focus:ring-[#62DB00] accent-[#62DB00]"
                />
                <span>{lang === 'fa' ? 'فقط کالاهای موجود' : 'In Stock Only'}</span>
              </label>

              {/* Discounted toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-600 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={onlyDiscounted}
                  onChange={e => setOnlyDiscounted(e.target.checked)}
                  className="rounded text-[#62DB00] focus:ring-[#62DB00] accent-[#62DB00]"
                />
                <span>{lang === 'fa' ? 'تخفیف‌دارها' : 'On Sale'}</span>
              </label>
            </div>

            <div className="text-[11px] font-mono text-zinc-400">
              {lang === 'fa' ? `${filteredProducts.length} محصول یافت شد` : `${filteredProducts.length} products found`}
            </div>
          </div>
        </section>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 space-y-3">
            <PackageCheck className="w-10 h-10 text-zinc-400 mx-auto" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              {lang === 'fa' ? 'محصولی با فیلترهای انتخابی یافت نشد' : 'No products match criteria'}
            </h3>
            <p className="text-xs text-zinc-500">
              {lang === 'fa' ? 'لطفاً فیلترها را پاک کرده یا دسته‌بندی دیگری را انتخاب کنید.' : 'Please clear some filters or select another category.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setOnlyInStock(false);
                setOnlyDiscounted(false);
              }}
              className="px-4 py-2 rounded-xl bg-[#62DB00] text-black font-bold text-xs transition-all cursor-pointer"
            >
              {lang === 'fa' ? 'پاک‌سازی همه فیلترها' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                rankingBadge={sortBy === 'sales' ? idx + 1 : undefined}
              />
            ))}
          </div>
        )}

        {/* Informative FAQ / Transparency Note */}
        <section className="p-6 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-3">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold text-xs">
            <Sparkles className="w-4 h-4 text-[#62DB00]" />
            <span>{lang === 'fa' ? 'شفافیت در رتبه‌بندی پرفروش‌ترین‌ها' : 'How We Rank Best Sellers'}</span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {lang === 'fa'
              ? 'لیست پرفروش‌ترین‌های فروشگاه لومینا به صورت خودکار و روزانه بر اساس تعداد خریدهای موفق نهایی‌شده، درصد بازگشت کالا (مرجوعی کمتر = امتیاز بالاتر) و امتیازات ثبت‌شده در دیدگاه‌های کاربران محاسبه و رتبه‌بندی می‌گردد. هیچ محصولی به صورت حمایت‌شده (اسپانسر شده) در این لیست قرار نمی‌گیرد.'
              : 'The Lumina Best Sellers index is recalculated daily based on verified checkout transactions, low return rates, and verified customer review sentiment. No sponsored placement is accepted in this ranking.'}
          </p>
        </section>
      </div>
    </div>
  );
};
