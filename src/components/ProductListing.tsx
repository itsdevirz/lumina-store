import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  Search,
  X,
  RotateCcw,
  Star,
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';
import { ProductCard } from './ProductCard';

export const ProductListing: React.FC = () => {
  const {
    products,
    lang,
    filters,
    setFilters,
    resetFilters,
    viewMode,
    setViewMode,
    isMobileFilterOpen,
    setIsMobileFilterOpen,
    setActiveTab,
    openProductDetails,
    formatPrice
  } = useStore();

  const [localSearch, setLocalSearch] = useState(filters.searchQuery || '');

  const handleCategorySelect = (catId: string) => {
    setFilters(prev => ({ ...prev, selectedCategory: catId }));
    if (typeof window !== 'undefined') {
      window.history.pushState(
        { tab: 'shop', category: catId },
        '',
        catId !== 'all' ? `/category/${catId}` : '/shop'
      );
    }
  };

  // Extract unique brands
  const brands = useMemo(() => {
    return Array.from(new Set(products.map(p => p.brand)));
  }, [products]);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search query
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matches =
          product.name.toLowerCase().includes(q) ||
          product.nameFa.includes(q) ||
          product.brand.toLowerCase().includes(q) ||
          product.categoryFa.includes(q);
        if (!matches) return false;
      }

      // Category
      if (filters.selectedCategory && filters.selectedCategory !== 'all') {
        if (product.category !== filters.selectedCategory) return false;
      }

      // Brand
      if (filters.selectedBrand && filters.selectedBrand !== 'all') {
        if (product.brand !== filters.selectedBrand) return false;
      }

      // Price
      if (product.price > filters.maxPrice || product.price < filters.minPrice) {
        return false;
      }

      // Rating
      if (filters.minRating > 0 && product.rating < filters.minRating) {
        return false;
      }

      // Stock
      if (filters.inStockOnly && product.stock <= 0) {
        return false;
      }

      // On Sale
      if (filters.onSaleOnly && !product.discountPercent) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.id.localeCompare(a.id);
        case 'popular':
        default:
          return b.soldCount - a.soldCount;
      }
    });
  }, [products, filters]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.selectedCategory !== 'all') count++;
    if (filters.selectedBrand !== 'all') count++;
    if (filters.minRating > 0) count++;
    if (filters.inStockOnly) count++;
    if (filters.onSaleOnly) count++;
    if (filters.searchQuery) count++;
    if (filters.maxPrice < 30000000) count++;
    return count;
  }, [filters]);

  const FilterSidebarContent = (
    <div className="space-y-5">
      {/* Header with clear button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            {lang === 'fa' ? 'فیلترهای کالا' : 'Filters'}
          </h3>
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{lang === 'fa' ? 'پاک‌سازی' : 'Reset'}</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          {lang === 'fa' ? 'دسته‌بندی' : 'Category'}
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              filters.selectedCategory === 'all'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>{lang === 'fa' ? 'همه دسته‌بندی‌ها' : 'All Categories'}</span>
            <span className="text-[11px] text-slate-400 tabular-nums">{products.length}</span>
          </button>

          {CATEGORIES.map(cat => {
            const isSelected = filters.selectedCategory === cat.id;
            const count = products.filter(p => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{lang === 'fa' ? cat.nameFa : cat.name}</span>
                <span className="text-[11px] text-slate-400 tabular-nums">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          {lang === 'fa' ? 'برند سازنده' : 'Brand'}
        </h4>
        <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
          <button
            onClick={() => setFilters(prev => ({ ...prev, selectedBrand: 'all' }))}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filters.selectedBrand === 'all'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>{lang === 'fa' ? 'همه برندها' : 'All Brands'}</span>
            {filters.selectedBrand === 'all' && <Check className="w-3.5 h-3.5" />}
          </button>
          {brands.map(b => {
            const isSelected = filters.selectedBrand === b;
            return (
              <button
                key={b}
                onClick={() => setFilters(prev => ({ ...prev, selectedBrand: isSelected ? 'all' : b }))}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{b}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          {lang === 'fa' ? 'حداکثر بودجه' : 'Budget Range'}
        </h4>
        <div className="space-y-2">
          <input
            type="range"
            min={1000000}
            max={30000000}
            step={500000}
            value={filters.maxPrice}
            onChange={e => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>{formatPrice(1000000, 20)}</span>
            <span className="font-bold text-blue-600 dark:text-blue-400 tabular-nums">
              {formatPrice(filters.maxPrice, Math.round(filters.maxPrice / 50000))}
            </span>
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          {lang === 'fa' ? 'حداقل امتیاز خریداران' : 'Minimum Rating'}
        </h4>
        <div className="grid grid-cols-4 gap-1.5">
          {[0, 4.0, 4.5, 4.8].map(r => (
            <button
              key={r}
              onClick={() => setFilters(prev => ({ ...prev, minRating: r }))}
              className={`py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                filters.minRating === r
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {r === 0 ? (
                <span>{lang === 'fa' ? 'همه' : 'All'}</span>
              ) : (
                <>
                  <Star className="w-3 h-3 fill-current" />
                  <span>{r}+</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Stock & Sale Toggles */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
        <label className="flex items-center justify-between cursor-pointer select-none">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {lang === 'fa' ? 'فقط کالاهای موجود در انبار' : 'In Stock Only'}
          </span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={e => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
            className="w-4 h-4 rounded-sm text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer select-none">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {lang === 'fa' ? 'فقط کالاهای شگفت‌انگیز و تخفیف‌دار' : 'On Sale Only'}
          </span>
          <input
            type="checkbox"
            checked={filters.onSaleOnly}
            onChange={e => setFilters(prev => ({ ...prev, onSaleOnly: e.target.checked }))}
            className="w-4 h-4 rounded-sm text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 flex-wrap">
          <button onClick={() => setActiveTab('home')} className="hover:text-blue-600 transition-colors cursor-pointer">
            {lang === 'fa' ? 'خانه' : 'Home'}
          </button>
          <ChevronRight className="w-3 h-3 rtl:rotate-180" />
          <span className="text-slate-800 dark:text-slate-200 font-bold">
            {lang === 'fa' ? 'کاتالوگ محصولات' : 'Catalog'}
          </span>
          {filters.selectedCategory !== 'all' && (
            <>
              <ChevronRight className="w-3 h-3 rtl:rotate-180" />
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {CATEGORIES.find(c => c.id === filters.selectedCategory)?.nameFa || filters.selectedCategory}
              </span>
            </>
          )}
        </div>

        {/* Top Control Bar (Search, Sort, View Modes, Mobile Filter Trigger) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 mb-6 p-3 sm:p-4 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 shadow-sm">
          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 rtl:right-3 ltr:left-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={localSearch}
              onChange={e => {
                setLocalSearch(e.target.value);
                setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
              }}
              placeholder={lang === 'fa' ? 'جستجوی نام یا مشخصات کالا...' : 'Search products...'}
              className="w-full rtl:pr-9 rtl:pl-7 ltr:pl-9 ltr:pr-7 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
            />
            {localSearch && (
              <button
                onClick={() => {
                  setLocalSearch('');
                  setFilters(prev => ({ ...prev, searchQuery: '' }));
                }}
                className="absolute inset-y-0 rtl:left-2.5 ltr:right-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Controls: Sort & Views */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>{lang === 'fa' ? 'فیلترها' : 'Filters'}</span>
              {activeFiltersCount > 0 && (
                <span className="w-4.5 h-4.5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">
                {lang === 'fa' ? 'مرتب‌سازی:' : 'Sort:'}
              </span>
              <select
                value={filters.sortBy}
                onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="text-xs font-bold bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="popular">{lang === 'fa' ? 'محبوب‌ترین‌ها' : 'Most Popular'}</option>
                <option value="newest">{lang === 'fa' ? 'جدیدترین‌ها' : 'Newest'}</option>
                <option value="price-asc">{lang === 'fa' ? 'ارزان‌ترین' : 'Price: Low to High'}</option>
                <option value="price-desc">{lang === 'fa' ? 'گران‌ترین' : 'Price: High to Low'}</option>
                <option value="rating">{lang === 'fa' ? 'بالاترین امتیاز' : 'Top Rated'}</option>
              </select>
            </div>

            {/* Grid vs List View Switcher */}
            <div className="hidden sm:flex items-center border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 bg-slate-100 dark:bg-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area: Sidebar + Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block md:col-span-1 p-5 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 sticky top-24 shadow-sm">
            {FilterSidebarContent}
          </aside>

          {/* Product Listing Main Area */}
          <main className="md:col-span-3">
            {/* Active Filters Summary Bar */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center flex-wrap gap-2 mb-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs">
                <span className="text-slate-400 font-medium">
                  {lang === 'fa' ? 'فیلترهای فعال:' : 'Active filters:'}
                </span>

                {filters.selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold border border-slate-200 dark:border-slate-700 shadow-xs">
                    {CATEGORIES.find(c => c.id === filters.selectedCategory)?.nameFa || filters.selectedCategory}
                    <button onClick={() => setFilters(prev => ({ ...prev, selectedCategory: 'all' }))} className="cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                {filters.selectedBrand !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold border border-slate-200 dark:border-slate-700 shadow-xs">
                    {filters.selectedBrand}
                    <button onClick={() => setFilters(prev => ({ ...prev, selectedBrand: 'all' }))} className="cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                {filters.searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold border border-slate-200 dark:border-slate-700 shadow-xs">
                    «{filters.searchQuery}»
                    <button onClick={() => {
                      setLocalSearch('');
                      setFilters(prev => ({ ...prev, searchQuery: '' }));
                    }} className="cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                <button
                  onClick={resetFilters}
                  className="text-rose-600 dark:text-rose-400 font-bold hover:underline mr-auto rtl:mr-auto rtl:ml-0 cursor-pointer"
                >
                  {lang === 'fa' ? 'حذف فیلترها' : 'Clear all'}
                </button>
              </div>
            )}

            {/* Products Results */}
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-8 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-3">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">
                  {lang === 'fa' ? 'محصولی با این مشخصات یافت نشد' : 'No matching products'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5 leading-relaxed">
                  {lang === 'fa'
                    ? 'فیلترها را تغییر داده یا عبارت دیگری را در کادر جستجو تایپ فرمایید.'
                    : 'Try changing your search terms or clearing active filters.'}
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer shadow-sm"
                >
                  {lang === 'fa' ? 'پاک‌سازی تمام فیلترها' : 'Reset All Filters'}
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-5">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* List View Mode */
              <div className="space-y-4">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    onClick={() => openProductDetails(product)}
                    className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 hover:border-blue-500/40 transition-all cursor-pointer shadow-sm group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-100 dark:border-slate-800 group-hover:scale-[1.02] transition-transform"
                    />
                    <div className="flex-1 min-w-0 text-right w-full">
                      <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">{product.brand}</span>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white truncate mt-0.5">
                        {lang === 'fa' ? product.nameFa : product.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 my-1.5 leading-relaxed">
                        {lang === 'fa' ? product.descriptionFa : product.description}
                      </p>
                      <div className="flex items-center gap-1.5 text-amber-500 text-xs">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">{product.rating}</span>
                        <span className="text-slate-400 text-[11px] tabular-nums">({product.reviewsCount} نظر خریداران)</span>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white tabular-nums">
                        {formatPrice(product.price, product.priceUSD)}
                      </div>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          openProductDetails(product);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm active:scale-98"
                      >
                        {lang === 'fa' ? 'مشاهده و خرید' : 'View Details'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 rtl:pl-10 rtl:pr-0">
              <div className="w-screen max-w-xs bg-white dark:bg-[#0F172A] shadow-2xl p-6 overflow-y-auto">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-black text-slate-900 dark:text-white text-base">
                    {lang === 'fa' ? 'فیلترهای کالا' : 'Filters'}
                  </h3>
                  <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {FilterSidebarContent}
                <div className="pt-6">
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-98 cursor-pointer"
                  >
                    {lang === 'fa' ? `مشاهده ${filteredProducts.length} کالا` : `Show ${filteredProducts.length} Results`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
