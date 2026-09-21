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
  Check,
  Eye,
  ShoppingBag,
  Zap,
  ArrowUpDown
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
    setQuickViewProduct,
    addToCart,
    formatPrice
  } = useStore();

  const [localSearch, setLocalSearch] = useState(filters.searchQuery || '');

  const handleCategorySelect = (catId: string) => {
    setFilters(prev => ({ ...prev, selectedCategory: catId }));
  };

  // Unique brands
  const brands = useMemo(() => {
    return Array.from(new Set(products.map(p => p.brand)));
  }, [products]);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
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
      })
      .sort((a, b) => {
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-zinc-400" />
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">
            {lang === 'fa' ? 'فیلترهای مشخصات' : 'Filter Specifications'}
          </h3>
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-[11px] font-mono text-[#62DB00] hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{lang === 'fa' ? 'بازنشانی' : 'Reset'}</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
          {lang === 'fa' ? 'دسته‌بندی' : 'Category'}
        </h4>
        <div className="space-y-0.5">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
              filters.selectedCategory === 'all'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
            }`}
          >
            <span>{lang === 'fa' ? 'همه کالاها' : 'All Products'}</span>
            <span className="text-[10px] font-mono text-zinc-400">{products.length}</span>
          </button>

          {CATEGORIES.map(cat => {
            const isSelected = filters.selectedCategory === cat.id;
            const count = products.filter(p => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <span>{lang === 'fa' ? cat.nameFa : cat.name}</span>
                <span className="text-[10px] font-mono text-zinc-400">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
        <h4 className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
          {lang === 'fa' ? 'برند سازنده' : 'Brand'}
        </h4>
        <div className="space-y-0.5 max-h-36 overflow-y-auto pr-1 no-scrollbar">
          <button
            onClick={() => setFilters(prev => ({ ...prev, selectedBrand: 'all' }))}
            className={`w-full flex items-center justify-between px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
              filters.selectedBrand === 'all'
                ? 'text-[#62DB00] font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
            }`}
          >
            <span>{lang === 'fa' ? 'همه برندها' : 'All Brands'}</span>
            {filters.selectedBrand === 'all' && <Check className="w-3.5 h-3.5 text-[#62DB00]" />}
          </button>
          {brands.map(b => {
            const isSelected = filters.selectedBrand === b;
            return (
              <button
                key={b}
                onClick={() => setFilters(prev => ({ ...prev, selectedBrand: isSelected ? 'all' : b }))}
                className={`w-full flex items-center justify-between px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? 'text-[#62DB00] font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <span>{b}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#62DB00]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-1.5">
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            {lang === 'fa' ? 'سقف قیمت' : 'Max Budget'}
          </h4>
          <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            {formatPrice(filters.maxPrice, Math.round(filters.maxPrice / 50000))}
          </span>
        </div>
        <input
          type="range"
          min={1000000}
          max={30000000}
          step={500000}
          value={filters.maxPrice}
          onChange={e => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
          className="w-full accent-[#62DB00] cursor-pointer"
        />
      </div>

      {/* Stock & Sale Toggles */}
      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
        <label className="flex items-center justify-between cursor-pointer select-none text-xs">
          <span className="text-zinc-700 dark:text-zinc-300">
            {lang === 'fa' ? 'فقط کالاهای موجود' : 'In Stock Only'}
          </span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={e => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
            className="w-3.5 h-3.5 rounded accent-[#62DB00] cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer select-none text-xs">
          <span className="text-zinc-700 dark:text-zinc-300">
            {lang === 'fa' ? 'فقط تخفیف‌دار و شگفت‌انگیز' : 'On Sale Only'}
          </span>
          <input
            type="checkbox"
            checked={filters.onSaleOnly}
            onChange={e => setFilters(prev => ({ ...prev, onSaleOnly: e.target.checked }))}
            className="w-3.5 h-3.5 rounded accent-[#62DB00] cursor-pointer"
          />
        </label>
      </div>
    </div>
  );

  return (
    <div className="py-5 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Top Filter & Command Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-4 mb-5 border-b border-zinc-200 dark:border-zinc-800/80">
        {/* Left: Search Bar with Active Count */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute rtl:right-2.5 ltr:left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={localSearch}
              onChange={e => {
                setLocalSearch(e.target.value);
                setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
              }}
              placeholder={lang === 'fa' ? 'فیلتر سریع در میان محصولات...' : 'Filter products...'}
              className="w-full rtl:pr-8 rtl:pl-7 ltr:pl-8 ltr:pr-7 py-1.5 text-xs rounded-md bg-white dark:bg-[#0C0C0E] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-[#62DB00] transition-colors"
            />
            {localSearch && (
              <button
                onClick={() => {
                  setLocalSearch('');
                  setFilters(prev => ({ ...prev, searchQuery: '' }));
                }}
                className="absolute rtl:left-2 ltr:right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 tactile-press"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {activeFiltersCount > 0 && (
              <span className="font-mono text-[10px] px-1 rounded bg-[#62DB00] text-black font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Right: Metrics & Sort */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          <span className="font-mono tabular-nums text-[11px] text-zinc-400">
            {filteredProducts.length} {lang === 'fa' ? 'مورد' : 'items'}
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
              {lang === 'fa' ? 'مرتب‌سازی:' : 'Sort:'}
            </span>
            <select
              value={filters.sortBy}
              onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="text-xs bg-white dark:bg-[#0C0C0E] text-zinc-800 dark:text-zinc-200 px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-[#62DB00] cursor-pointer font-sans"
            >
              <option value="popular">{lang === 'fa' ? 'محبوب‌ترین' : 'Most Popular'}</option>
              <option value="newest">{lang === 'fa' ? 'جدیدترین' : 'Newest'}</option>
              <option value="price-asc">{lang === 'fa' ? 'ارزان‌ترین' : 'Price: Low to High'}</option>
              <option value="price-desc">{lang === 'fa' ? 'گران‌ترین' : 'Price: High to Low'}</option>
              <option value="rating">{lang === 'fa' ? 'بالاترین امتیاز' : 'Top Rated'}</option>
            </select>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-md p-0.5 bg-zinc-50 dark:bg-zinc-900">
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1 rounded cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                  : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="Table View"
              className={`p-1 rounded cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                  : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Products */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block md:col-span-1 p-3.5 rounded-lg bg-white dark:bg-[#0C0C0E] border border-zinc-200 dark:border-zinc-800/90 sticky top-20">
          {FilterSidebarContent}
        </aside>

        {/* Content Area */}
        <div className="md:col-span-3">
          {/* Active Filters Tag Bar */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center flex-wrap gap-1.5 mb-3.5 p-2 rounded-md bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-xs">
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                {lang === 'fa' ? 'فیلترها:' : 'Active:'}
              </span>

              {filters.selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[11px] font-mono">
                  {CATEGORIES.find(c => c.id === filters.selectedCategory)?.nameFa || filters.selectedCategory}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, selectedCategory: 'all' }))}
                    className="hover:text-rose-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.selectedBrand !== 'all' && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[11px] font-mono">
                  {filters.selectedBrand}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, selectedBrand: 'all' }))}
                    className="hover:text-rose-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.searchQuery && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[11px] font-mono">
                  "{filters.searchQuery}"
                  <button
                    onClick={() => {
                      setLocalSearch('');
                      setFilters(prev => ({ ...prev, searchQuery: '' }));
                    }}
                    className="hover:text-rose-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={resetFilters}
                className="font-mono text-[10px] text-[#62DB00] hover:underline mr-auto rtl:mr-auto rtl:ml-0"
              >
                {lang === 'fa' ? 'پاک‌سازی همه' : 'Clear all'}
              </button>
            </div>
          )}

          {/* Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-[#0C0C0E] rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <Search className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                {lang === 'fa' ? 'هیچ محصولی با این فیلترها پیدا نشد' : 'No matching items'}
              </h3>
              <p className="text-[11px] text-zinc-400 mb-4">
                {lang === 'fa' ? 'فیلترهای انتخابی را بازنشانی فرمایید.' : 'Try resetting your filter parameters.'}
              </p>
              <button
                onClick={resetFilters}
                className="px-3 py-1.5 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-medium tactile-press cursor-pointer"
              >
                {lang === 'fa' ? 'بازنشانی فیلترها' : 'Reset filters'}
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* Modern Responsive E-Commerce Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Compact Developer-Tool Table View */
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-[#0C0C0E]">
              <table className="w-full text-left rtl:text-right border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">{lang === 'fa' ? 'کالا / برند' : 'Product / Brand'}</th>
                    <th className="py-2.5 px-3 hidden sm:table-cell">{lang === 'fa' ? 'دسته‌بندی' : 'Category'}</th>
                    <th className="py-2.5 px-3 hidden md:table-cell">{lang === 'fa' ? 'وضعیت انبار' : 'Inventory'}</th>
                    <th className="py-2.5 px-3 hidden sm:table-cell">{lang === 'fa' ? 'امتیاز' : 'Rating'}</th>
                    <th className="py-2.5 px-3">{lang === 'fa' ? 'قیمت' : 'Price'}</th>
                    <th className="py-2.5 px-3 text-right rtl:text-left">{lang === 'fa' ? 'عملیات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/80">
                  {filteredProducts.map(product => (
                    <tr
                      key={product.id}
                      onClick={() => openProductDetails(product)}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors"
                    >
                      {/* Product Name & Image */}
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-8 h-8 rounded object-cover bg-zinc-100 dark:bg-zinc-800 shrink-0 img-outline"
                          />
                          <div className="min-w-0">
                            <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[140px] sm:max-w-xs">
                              {lang === 'fa' ? product.nameFa : product.name}
                            </div>
                            <div className="text-[10px] font-mono text-zinc-400 truncate">
                              {product.brand}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-2 px-3 hidden sm:table-cell">
                        <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-800">
                          {lang === 'fa' ? product.categoryFa : product.category}
                        </span>
                      </td>

                      {/* Stock Status */}
                      <td className="py-2 px-3 hidden md:table-cell font-mono tabular-nums text-[11px]">
                        {product.stock > 0 ? (
                          <span className="text-emerald-600 dark:text-emerald-400">
                            ● {product.stock} {lang === 'fa' ? 'عدد در انبار' : 'units'}
                          </span>
                        ) : (
                          <span className="text-rose-500">
                            ○ {lang === 'fa' ? 'ناموجود' : 'Out of stock'}
                          </span>
                        )}
                      </td>

                      {/* Rating */}
                      <td className="py-2 px-3 hidden sm:table-cell font-mono tabular-nums text-[11px] text-zinc-500">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>{product.rating}</span>
                          <span className="text-zinc-400 text-[10px]">({product.reviewsCount})</span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-2 px-3">
                        <div className="flex flex-col">
                          {product.originalPrice && (
                            <span className="text-[10px] font-mono tabular-nums text-zinc-400 line-through">
                              {formatPrice(product.originalPrice, product.originalPriceUSD)}
                            </span>
                          )}
                          <span className="font-mono tabular-nums font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                            {formatPrice(product.price, product.priceUSD)}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-2 px-3 text-right rtl:text-left">
                        <div className="flex items-center justify-end rtl:justify-start gap-1">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setQuickViewProduct(product);
                            }}
                            title="Quick View"
                            className="p-1.5 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer tactile-press"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              addToCart(product, 1);
                            }}
                            title="Add to Cart"
                            className="p-1.5 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer tactile-press"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 rtl:pl-10 rtl:pr-0">
            <div className="w-screen max-w-xs bg-white dark:bg-[#0C0C0E] border-l border-zinc-200 dark:border-zinc-800 p-5 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                  {lang === 'fa' ? 'فیلترها' : 'Filters'}
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {FilterSidebarContent}
              <div className="pt-5">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-2 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium text-xs cursor-pointer"
                >
                  {lang === 'fa' ? `نمایش ${filteredProducts.length} نتیجه` : `Show ${filteredProducts.length} Results`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
