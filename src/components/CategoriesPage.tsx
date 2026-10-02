import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Layers,
  Search,
  X,
  ArrowUpDown,
  Sparkles,
  Check,
  Loader2,
  Tag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { playTactileClick } from '../utils/sound';

interface CategoryItemConfig {
  id: string;
  name: string;
  nameFa: string;
  image: string;
  descriptionFa: string;
}

const CATEGORY_ITEMS: CategoryItemConfig[] = [
  {
    id: 'all',
    name: 'All Categories',
    nameFa: 'همه دسته‌ها',
    image: '/images/products/photo-1505740420928-5e560c06d30e.jpg',
    descriptionFa: 'مرور جامع تمامی محصولات، قطعات و اکسسوری‌های استودیویی لومینا.'
  },
  {
    id: 'audio',
    name: 'Audio',
    nameFa: 'تجهیزات صوتی',
    image: '/images/products/photo-1505740420928-5e560c06d30e.jpg',
    descriptionFa: 'هدفون‌های حرفه‌ای مانیتورینگ، سیستم‌های نویزکنسلینگ و اسپیکرهای های‌فای.'
  },
  {
    id: 'workspace',
    name: 'Workspace',
    nameFa: 'میز کار و اداری',
    image: '/images/products/photo-1527864550417-7fd91fc51a46.jpg',
    descriptionFa: 'کیبوردهای مکانیکال، استندهای چوب گردو و تجهیزات تمرکز کاری.'
  },
  {
    id: 'smart-wear',
    name: 'Smart Gadgets',
    nameFa: 'گجت هوشمند',
    image: '/images/products/photo-1523275335684-37898b6baf30.jpg',
    descriptionFa: 'ساعت‌های هوشمند پرچمدار، سنسورهای سلامت و پوشیدنی‌های نوین.'
  },
  {
    id: 'apparel',
    name: 'Apparel & Fashion',
    nameFa: 'پوشاک و مد',
    image: '/images/products/photo-1521572267360-ee0c2909d518.jpg',
    descriptionFa: 'پوشاک ارگانیک پنبه‌ای، هودی‌ها و تیشرت‌های مینیمال با دوخت استاندارد.'
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    nameFa: 'لوازم روزمره',
    image: '/images/products/photo-1553062407-98eeb64c6a62.jpg',
    descriptionFa: 'کیف‌های چرم طبیعی دست‌دوز، کوله‌پشتی‌های اولترالایت و اکسسوری‌های سفر.'
  },
  {
    id: 'coffee',
    name: 'Coffee',
    nameFa: 'قهوه و کافه',
    image: '/images/products/photo-1514432324607-a09d9b4aefdd.jpg',
    descriptionFa: 'تجهیزات تخصصی دم‌آوری قهوه، کتری‌های باریستا و ماگ‌های دوجداره.'
  },
  {
    id: 'home-design',
    name: 'Home Decor',
    nameFa: 'دکوراسیون',
    image: '/images/products/photo-1507473885765-e6ed057f782c.jpg',
    descriptionFa: 'چراغ‌های هوشمند امبینت، المان‌های معماری مینیمال و اکسسوری‌های رومیزی.'
  }
];

const ITEMS_PER_PAGE = 6;

export const CategoriesPage: React.FC = () => {
  const { lang, products } = useStore();

  // Filter States
  const [selectedCatId, setSelectedCatId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'popular' | 'discount'>('popular');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(false);

  // Pagination & Infinite Scrolling States
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const observerTargetRef = useRef<HTMLDivElement>(null);

  // Extract all available brands
  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set);
  }, [products]);

  // Active Category Meta
  const activeCategory = CATEGORY_ITEMS.find(c => c.id === selectedCatId) || CATEGORY_ITEMS[0];

  // Reset pagination when category, search, or filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
    setIsLoadingMore(false);
  }, [selectedCatId, searchQuery, selectedBrand, sortBy, inStockOnly, onSaleOnly]);

  // Compute filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Category Filter
      if (selectedCatId !== 'all' && product.category !== selectedCatId) {
        return false;
      }

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchName = product.name?.toLowerCase().includes(query);
        const matchNameFa = product.nameFa?.toLowerCase().includes(query);
        const matchBrand = product.brand?.toLowerCase().includes(query);
        const matchDesc = product.descriptionFa?.toLowerCase().includes(query);
        if (!matchName && !matchNameFa && !matchBrand && !matchDesc) {
          return false;
        }
      }

      // 3. Brand Filter
      if (selectedBrand !== 'all' && product.brand !== selectedBrand) {
        return false;
      }

      // 4. In-Stock Filter
      if (inStockOnly && product.stock <= 0) {
        return false;
      }

      // 5. On-Sale Filter
      if (onSaleOnly) {
        const hasDiscount = (product.discountPercent && product.discountPercent > 0) ||
          (product.originalPrice && product.originalPrice > product.price);
        if (!hasDiscount) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'discount') {
        const discA = a.discountPercent || 0;
        const discB = b.discountPercent || 0;
        return discB - discA;
      }
      if (sortBy === 'newest') return (b.rank || 0) - (a.rank || 0);
      // Default: popular
      return (b.soldCount || 0) - (a.soldCount || 0);
    });
  }, [products, selectedCatId, searchQuery, selectedBrand, inStockOnly, onSaleOnly, sortBy]);

  // Paginated visible products
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const hasMoreProducts = visibleCount < filteredProducts.length;

  // Infinite Scroll Trigger via Intersection Observer
  const loadMoreProducts = useCallback(() => {
    if (isLoadingMore || !hasMoreProducts) return;

    setIsLoadingMore(true);
    // Simulate database / server API fetch delay for smooth UX
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredProducts.length));
      setIsLoadingMore(false);
    }, 600);
  }, [isLoadingMore, hasMoreProducts, filteredProducts.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMoreProducts && !isLoadingMore) {
          loadMoreProducts();
        }
      },
      { rootMargin: '180px' }
    );

    const currentTarget = observerTargetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMoreProducts, isLoadingMore, loadMoreProducts]);

  const handleSelectCategory = (id: string) => {
    playTactileClick();
    setSelectedCatId(id);
  };

  const hasActiveFilters = searchQuery !== '' || selectedBrand !== 'all' || inStockOnly || onSaleOnly || selectedCatId !== 'all';

  const handleResetFilters = () => {
    playTactileClick();
    setSelectedCatId('all');
    setSearchQuery('');
    setSelectedBrand('all');
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSortBy('popular');
  };

  return (
    <div className="py-4 sm:py-8 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        
        {/* 1. Page Header (Compact & Crisp) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold mb-1">
              <Sparkles className="w-3 h-3" />
              <span>{lang === 'fa' ? 'دسته‌بندی‌ها و کالکشن‌ها' : 'Collections'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
              {lang === 'fa' ? 'دسته‌بندی‌های محصولات' : 'Specialized Hardware Collections'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400">
              {filteredProducts.length} {lang === 'fa' ? 'کالا یافت شد' : 'items found'}
            </span>
          </div>
        </div>

        {/* 2. Compact, Neat Category Selector with Real Photos (Horizontal Scroll on Mobile / 8-Grid on Desktop) */}
        <div className="relative">
          <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x sm:grid sm:grid-cols-4 lg:grid-cols-8">
            {CATEGORY_ITEMS.map(cat => {
              const isSelected = selectedCatId === cat.id;
              const count = cat.id === 'all'
                ? products.length
                : products.filter(p => p.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`group relative flex flex-col items-center shrink-0 w-[72px] sm:w-auto p-1.5 sm:p-2 rounded-2xl transition-all duration-200 cursor-pointer snap-start ${
                    isSelected
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 shadow-xs'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  {/* Category Real Photo Thumbnail */}
                  <div
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 transition-all duration-200 shadow-xs ${
                      isSelected
                        ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-zinc-900 scale-105'
                        : 'border border-zinc-200/80 dark:border-zinc-800 group-hover:border-zinc-400 group-hover:scale-102'
                    }`}
                  >
                    {cat.id === 'all' ? (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-zinc-900 flex items-center justify-center text-white">
                        <Layers className="w-6 h-6" />
                      </div>
                    ) : (
                      <img
                        src={cat.image}
                        alt={cat.nameFa}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                  </div>

                  {/* Category Title */}
                  <span
                    className={`text-[11px] sm:text-xs font-semibold text-center mt-1.5 truncate max-w-full leading-tight ${
                      isSelected
                        ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                        : 'text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {lang === 'fa' ? cat.nameFa : cat.name}
                  </span>

                  {/* Compact Count Badge */}
                  <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 tabular-nums">
                    {count} {lang === 'fa' ? 'کالا' : 'items'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Search & Advanced Filter Controls Toolbar */}
        <div className="rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 p-3 sm:p-4 shadow-xs space-y-3">
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
            {/* Live Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={lang === 'fa' ? 'جستجو در نام محصول، برند یا مشخصات فنی...' : 'Search products, brand, or specs...'}
                className="w-full h-9 sm:h-10 pr-10 pl-9 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort & Brand Dropdowns */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative flex items-center">
                <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="h-9 sm:h-10 pr-9 pl-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none"
                >
                  <option value="popular">مرتب‌سازی: پرفروش‌ترین‌ها</option>
                  <option value="newest">جدیدترین محصولات</option>
                  <option value="price-asc">ارزان‌ترین به گران‌ترین</option>
                  <option value="price-desc">گران‌ترین به ارزان‌ترین</option>
                  <option value="discount">بیشترین تخفیف</option>
                </select>
              </div>

              {/* Brand Filter */}
              <select
                value={selectedBrand}
                onChange={e => setSelectedBrand(e.target.value)}
                className="h-9 sm:h-10 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">همه برندها</option>
                {brands.map(b => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Toggle Filter Chips */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/60 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  inStockOnly
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                <Check className={`w-3 h-3 ${inStockOnly ? 'opacity-100' : 'opacity-0'}`} />
                <span>فقط کالاهای موجود</span>
              </button>

              <button
                type="button"
                onClick={() => setOnSaleOnly(!onSaleOnly)}
                className={`h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  onSaleOnly
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                <Tag className="w-3 h-3 text-rose-500" />
                <span>فقط کالاهای تخفیف‌دار</span>
              </button>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>پاک کردن فیلترها</span>
              </button>
            )}
          </div>
        </div>

        {/* 4. Active Category Note (Slim & Elegant) */}
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 px-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {lang === 'fa' ? activeCategory.nameFa : activeCategory.name}
            </span>
            <span>•</span>
            <span className="line-clamp-1">{activeCategory.descriptionFa}</span>
          </div>
        </div>

        {/* 5. Products Catalog Grid */}
        <div>
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
              <Layers className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                {lang === 'fa' ? 'هیچ کالایی با این مشخصات یافت نشد' : 'No products found'}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-4">
                {lang === 'fa' ? 'لطفاً فیلترها را تغییر داده یا عبارت دیگری را جستجو کنید.' : 'Try adjusting your filters or search terms.'}
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                پاک کردن تمام فیلترها
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {visibleProducts.map(product => (
                <div key={product.id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. Infinite Scroll Sentinel & Small Loading Indicator */}
        <div ref={observerTargetRef} className="py-6 flex flex-col items-center justify-center">
          {isLoadingMore && (
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-md animate-fade-in">
              <Loader2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-spin" />
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">
                {lang === 'fa' ? 'درحال بارگذاری...' : 'Loading more items...'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          )}

          {!hasMoreProducts && filteredProducts.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 dark:text-zinc-500 pt-2">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>{lang === 'fa' ? 'تمامی کالاهای این بخش بارگذاری شدند' : 'All items loaded'}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
