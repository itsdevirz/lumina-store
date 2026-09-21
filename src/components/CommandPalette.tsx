import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Command,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Heart,
  User,
  ShieldAlert,
  Moon,
  Sun,
  Globe,
  Tag,
  Flame,
  Zap,
  Package,
  Layers,
  Check,
  X,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToAdmin: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onGoToAdmin
}) => {
  const {
    products,
    lang,
    setLang,
    darkMode,
    toggleDarkMode,
    setActiveTab,
    openProductDetails,
    setFilters,
    setIsCartDrawerOpen,
    formatPrice,
    activeFestival,
    openFestivalPage
  } = useStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build command groups
  const filteredProducts = useMemo(() => {
    if (!query.trim()) return products.slice(0, 5);
    const q = query.toLowerCase().trim();
    return products.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.nameFa.includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.categoryFa.includes(q)
    ).slice(0, 6);
  }, [products, query]);

  const navigationActions = useMemo(() => {
    const items = [
      {
        id: 'nav-shop',
        label: lang === 'fa' ? 'فروشگاه و تمام کالاها' : 'Catalog & All Products',
        shortcut: 'G S',
        icon: Package,
        action: () => {
          setActiveTab('shop');
          onClose();
        }
      },
      {
        id: 'nav-flash',
        label: lang === 'fa' ? 'پیشنهادهای شگفت‌انگیز (Flash Drops)' : 'Flash Drops & Deals',
        shortcut: 'G D',
        icon: Flame,
        action: () => {
          setFilters(prev => ({ ...prev, onSaleOnly: true, selectedCategory: 'all' }));
          setActiveTab('shop');
          onClose();
        }
      },
      {
        id: 'nav-cart',
        label: lang === 'fa' ? 'سبد خرید' : 'Open Shopping Cart',
        shortcut: 'G C',
        icon: ShoppingBag,
        action: () => {
          setIsCartDrawerOpen(true);
          onClose();
        }
      },
      {
        id: 'nav-wishlist',
        label: lang === 'fa' ? 'لیست علاقه‌مندی‌ها' : 'Wishlist',
        shortcut: 'G W',
        icon: Heart,
        action: () => {
          setActiveTab('wishlist');
          onClose();
        }
      },
      {
        id: 'nav-account',
        label: lang === 'fa' ? 'حساب کاربری و سفارش‌ها' : 'My Account & Orders',
        shortcut: 'G A',
        icon: User,
        action: () => {
          setActiveTab('account');
          onClose();
        }
      },
      {
        id: 'nav-festival',
        label: lang === 'fa' ? 'جشنواره‌ها و کوپن‌های تخفیف' : 'Festivals & Promotions',
        shortcut: 'G F',
        icon: Sparkles,
        action: () => {
          openFestivalPage(activeFestival || undefined);
          onClose();
        }
      },
      {
        id: 'nav-admin',
        label: lang === 'fa' ? 'ورود به پنل مدیریت' : 'Open Admin Console',
        shortcut: 'G M',
        icon: ShieldAlert,
        action: () => {
          onGoToAdmin();
          onClose();
        }
      }
    ];

    if (!query.trim()) return items;
    const q = query.toLowerCase().trim();
    return items.filter(item => item.label.toLowerCase().includes(q));
  }, [lang, query, setActiveTab, setFilters, setIsCartDrawerOpen, openFestivalPage, activeFestival, onGoToAdmin, onClose]);

  const quickActions = useMemo(() => {
    const items = [
      {
        id: 'act-theme',
        label: lang === 'fa' ? `تغییر حالت به ${darkMode ? 'روشن' : 'تاریک'}` : `Switch to ${darkMode ? 'Light' : 'Dark'} Mode`,
        shortcut: 'T',
        icon: darkMode ? Sun : Moon,
        action: () => {
          toggleDarkMode();
          onClose();
        }
      },
      {
        id: 'act-lang',
        label: lang === 'fa' ? 'Switch Language to English' : 'تغییر زبان به فارسی',
        shortcut: 'L',
        icon: Globe,
        action: () => {
          setLang(lang === 'fa' ? 'en' : 'fa');
          onClose();
        }
      }
    ];

    if (!query.trim()) return items;
    const q = query.toLowerCase().trim();
    return items.filter(item => item.label.toLowerCase().includes(q));
  }, [lang, darkMode, toggleDarkMode, setLang, onClose, query]);

  // Combined flat list for keyboard navigation
  const allItems = useMemo(() => {
    const list: Array<{ type: 'product' | 'nav' | 'action'; item: any }> = [];
    filteredProducts.forEach(p => list.push({ type: 'product', item: p }));
    navigationActions.forEach(n => list.push({ type: 'nav', item: n }));
    quickActions.forEach(a => list.push({ type: 'action', item: a }));
    return list;
  }, [filteredProducts, navigationActions, quickActions]);

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (allItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + (allItems.length || 1)) % (allItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = allItems[selectedIndex];
      if (current) {
        if (current.type === 'product') {
          openProductDetails(current.item);
          onClose();
        } else {
          current.item.action();
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        />

        {/* Command Menu Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -8 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="relative w-full max-w-xl bg-white dark:bg-[#0C0C0E] rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[78vh]"
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30">
            <Search className="w-4 h-4 text-zinc-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={lang === 'fa' ? 'جستجوی کالا، دستورات، صفحات یا کلیدواژه‌ها...' : 'Search products, commands, routes...'}
              className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none font-sans"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div ref={listRef} className="overflow-y-auto flex-1 p-2 space-y-4 no-scrollbar">
            {/* Products Group */}
            {filteredProducts.length > 0 && (
              <div>
                <div className="px-2 py-1 text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                  {lang === 'fa' ? 'محصولات و کاتالوگ' : 'Products & Catalog'}
                </div>
                <div className="mt-1 space-y-0.5">
                  {filteredProducts.map((p, idx) => {
                    const isSelected = selectedIndex === idx;
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          openProductDetails(p);
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-colors text-xs ${
                          isSelected
                            ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100'
                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-7 h-7 rounded object-cover bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200/50 dark:border-zinc-800"
                          />
                          <div className="truncate">
                            <span className="font-medium text-zinc-900 dark:text-zinc-100">
                              {lang === 'fa' ? p.nameFa : p.name}
                            </span>
                            <span className="mx-1.5 text-zinc-400">•</span>
                            <span className="text-[11px] text-zinc-400 font-mono">{p.brand}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-[11px] font-medium text-zinc-900 dark:text-zinc-100">
                            {formatPrice(p.price, p.priceUSD)}
                          </span>
                          <span className="text-[10px] text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 font-mono">
                            {lang === 'fa' ? p.categoryFa : p.category}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation Group */}
            {navigationActions.length > 0 && (
              <div>
                <div className="px-2 py-1 text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                  {lang === 'fa' ? 'ناوبری و صفحات' : 'Navigation & Views'}
                </div>
                <div className="mt-1 space-y-0.5">
                  {navigationActions.map((item, idx) => {
                    const globalIdx = filteredProducts.length + idx;
                    const isSelected = selectedIndex === globalIdx;
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={`flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-colors text-xs ${
                          isSelected
                            ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100'
                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-zinc-400" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <kbd className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                          {item.shortcut}
                        </kbd>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Actions Group */}
            {quickActions.length > 0 && (
              <div>
                <div className="px-2 py-1 text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                  {lang === 'fa' ? 'دستورات سریع سیستم' : 'System Actions'}
                </div>
                <div className="mt-1 space-y-0.5">
                  {quickActions.map((act, idx) => {
                    const globalIdx = filteredProducts.length + navigationActions.length + idx;
                    const isSelected = selectedIndex === globalIdx;
                    const Icon = act.icon;
                    return (
                      <div
                        key={act.id}
                        onClick={act.action}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={`flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-colors text-xs ${
                          isSelected
                            ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100'
                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-zinc-400" />
                          <span className="font-medium">{act.label}</span>
                        </div>
                        <kbd className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                          {act.shortcut}
                        </kbd>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {allItems.length === 0 && (
              <div className="py-8 text-center text-xs text-zinc-400">
                {lang === 'fa' ? 'نتیجه‌ای برای این جستجو یافت نشد.' : 'No commands or items found.'}
              </div>
            )}
          </div>

          {/* Footer Navigation Hints */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-zinc-200 dark:border-zinc-800/80 text-[11px] font-mono text-zinc-400 bg-zinc-50 dark:bg-zinc-900/40">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1 rounded bg-zinc-200 dark:bg-zinc-800">↑↓</kbd> {lang === 'fa' ? 'پیمایش' : 'Navigate'}
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 rounded bg-zinc-200 dark:bg-zinc-800">↵</kbd> {lang === 'fa' ? 'انتخاب' : 'Select'}
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">Lumina Engine</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
