import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  Clock,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Star,
  Zap,
  CornerDownLeft
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = {
  fa: [
    'مک‌بوک پرو M3',
    'هدفون سونی WH-1000XM5',
    'اپل واچ اولترا',
    'کنسول پلی‌استیشن ۵',
    'کیبورد مکانیکال',
    'ماوس بی‌سیم ارگونومیک'
  ],
  en: [
    'MacBook Pro M3',
    'Sony WH-1000XM5',
    'Apple Watch Ultra',
    'PlayStation 5',
    'Mechanical Keyboard',
    'Ergonomic Mouse'
  ]
};

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const {
    products,
    lang,
    formatPrice,
    openProductDetails,
    setFilters,
    setActiveTab
  } = useStore();

  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const clean = term.trim();
    const updated = [clean, ...recentSearches.filter(s => s !== clean)].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem('lumina_recent_searches', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const removeRecentSearch = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== term);
    setRecentSearches(updated);
    try {
      localStorage.setItem('lumina_recent_searches', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('lumina_recent_searches');
    } catch (err) {
      console.error(err);
    }
  };

  // Instant matching products
  const matchingProducts = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products
      .filter(p => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.nameFa.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.categoryFa.toLowerCase().includes(q) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
        );
      })
      .slice(0, 8);
  }, [query, products]);

  const handleSelectProduct = (product: Product) => {
    saveRecentSearch(lang === 'fa' ? product.nameFa : product.name);
    openProductDetails(product);
    onClose();
  };

  const handleSearchSubmit = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    saveRecentSearch(searchTerm);
    setFilters(prev => ({
      ...prev,
      searchQuery: searchTerm,
      selectedCategory: 'all'
    }));
    setActiveTab('shop');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      if (matchingProducts.length > 0) {
        handleSelectProduct(matchingProducts[0]);
      } else if (query.trim()) {
        handleSearchSubmit(query);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center p-3 sm:p-6 sm:pt-20 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Surface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onKeyDown={handleKeyDown}
          className="relative w-full max-w-2xl bg-white dark:bg-[#121214] border border-zinc-200/90 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 text-zinc-900 dark:text-zinc-100"
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30">
            <Search className="w-5 h-5 text-[#62DB00] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={
                lang === 'fa'
                  ? 'جستجوی آنی در میان محصولات، برندها و مشخصات...'
                  : 'Instant search products, brands, tech specs...'
              }
              className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 font-sans"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="hidden sm:flex items-center gap-1 px-2 py-1 text-[11px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-md border border-zinc-200/60 dark:border-zinc-700/60"
            >
              ESC
            </button>
          </div>

          {/* Results / Suggestions Container */}
          <div className="max-h-[65vh] overflow-y-auto p-4 space-y-5">
            {/* Live Matches List */}
            {query.trim().length > 0 ? (
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-zinc-400 mb-2 px-1">
                  <span>{lang === 'fa' ? 'نتایج مطابق' : 'Matching Products'}</span>
                  <span className="font-mono text-[11px] text-[#62DB00]">
                    {matchingProducts.length} {lang === 'fa' ? 'کالا' : 'items'}
                  </span>
                </div>

                {matchingProducts.length > 0 ? (
                  <div className="space-y-1.5">
                    {matchingProducts.map(product => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-100/90 dark:hover:bg-zinc-800/70 border border-transparent hover:border-zinc-200/80 dark:hover:border-zinc-700/60 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-11 h-11 rounded-lg object-cover bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200/50 dark:border-zinc-700/50 group-hover:scale-105 transition-transform"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                                {product.brand}
                              </span>
                              {product.discountPercent && (
                                <span className="px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                                  {product.discountPercent}%
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-[#62DB00] transition-colors">
                              {lang === 'fa' ? product.nameFa : product.name}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 rtl:mr-2 ltr:ml-2">
                          <div className="text-left rtl:text-right">
                            <div className="text-xs sm:text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100">
                              {formatPrice(product.price, product.priceUSD)}
                            </div>
                            {product.stock <= 3 && product.stock > 0 && (
                              <div className="text-[10px] text-amber-500 font-mono">
                                {lang === 'fa' ? 'تنها چند عدد در انبار' : 'Low stock'}
                              </div>
                            )}
                          </div>
                          <div className="p-1 rounded-md text-zinc-400 group-hover:text-[#62DB00] group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-all">
                            {lang === 'fa' ? (
                              <ArrowLeft className="w-4 h-4" />
                            ) : (
                              <ArrowRight className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => handleSearchSubmit(query)}
                      className="w-full mt-3 py-2.5 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-[#62DB00] hover:text-black dark:hover:bg-[#62DB00] dark:hover:text-black font-medium text-xs text-center transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>
                        {lang === 'fa'
                          ? `مشاهده تمام نتایج برای «${query}» در فروشگاه`
                          : `View all results for "${query}" in Shop`}
                      </span>
                      <CornerDownLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-10 px-4">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <Search className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      {lang === 'fa'
                        ? `موردی برای «${query}» یافت نشد`
                        : `No products found for "${query}"`}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                      {lang === 'fa'
                        ? 'نام محصول، برند یا دسته‌بندی دیگری را جستجو کنید، یا از پیشنهادات زیر استفاده نمایید.'
                        : 'Try searching with another term or explore trending searches below.'}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-xs font-medium text-zinc-400 mb-2 px-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{lang === 'fa' ? 'جستجوهای اخیر' : 'Recent Searches'}</span>
                      </div>
                      <button
                        onClick={clearAllRecent}
                        className="text-[11px] text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                      >
                        {lang === 'fa' ? 'پاک‌سازی همه' : 'Clear all'}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setQuery(term);
                            handleSearchSubmit(term);
                          }}
                          className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 hover:bg-zinc-200/80 dark:hover:bg-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                        >
                          <span>{term}</span>
                          <button
                            onClick={e => removeRecentSearch(term, e)}
                            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-0.5 rounded"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular / Trending Searches */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 mb-2.5 px-1">
                    <TrendingUp className="w-3.5 h-3.5 text-[#62DB00]" />
                    <span>{lang === 'fa' ? 'عبارات محبوب و پرطرفدار' : 'Trending Searches'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES[lang === 'fa' ? 'fa' : 'en'].map((term, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setQuery(term);
                          handleSearchSubmit(term);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-[#62DB00] dark:hover:border-[#62DB00] bg-white dark:bg-zinc-900 hover:bg-[#62DB00]/5 text-xs text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#62DB00]" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Categories Bar */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  <div className="text-xs font-medium text-zinc-400 mb-2 px-1">
                    {lang === 'fa' ? 'دسته‌بندی‌های پیشنهادی' : 'Featured Categories'}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'laptops', nameFa: 'لپ‌تاپ و اولترابوک', name: 'Laptops' },
                      { id: 'audio', nameFa: 'هدفون و تجهیزات صدا', name: 'Audio' },
                      { id: 'wearables', nameFa: 'ساعت و گجت هوشمند', name: 'Wearables' },
                      { id: 'gaming', nameFa: 'کنسول و گیمینگ', name: 'Gaming' }
                    ].map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setFilters(prev => ({
                            ...prev,
                            selectedCategory: c.id,
                            searchQuery: ''
                          }));
                          setActiveTab('shop');
                          onClose();
                        }}
                        className="p-2.5 rounded-xl border border-zinc-200/70 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/40 text-right rtl:text-right ltr:text-left text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:text-[#62DB00] transition-colors cursor-pointer"
                      >
                        {lang === 'fa' ? c.nameFa : c.name}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Shortcuts hint */}
          <div className="px-4 py-2.5 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/50 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <div className="flex items-center gap-3">
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  ↵
                </kbd>{' '}
                {lang === 'fa' ? 'انتخاب' : 'Select'}
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  ESC
                </kbd>{' '}
                {lang === 'fa' ? 'بستن' : 'Close'}
              </span>
            </div>
            <div className="text-[10px] text-[#62DB00] font-semibold">
              LUMINA SEARCH ENGINE
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
