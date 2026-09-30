import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  LogOut,
  LogIn,
  LayoutDashboard,
  ShieldCheck,
  TrendingUp,
  History,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';
import { LuminaLogo } from './LuminaLogo';
import { playTactileClick } from '../utils/sound';

interface ModernHeaderProps {
  onGoToAdmin?: () => void;
  onOpenSearchModal: () => void;
}

const POPULAR_SEARCH_TERMS = [
  'هدفون نویز کنسلینگ',
  'کیبورد مکانیکال',
  'ساعت هوشمند',
  'کوله پشتی مسافرتی',
  'ماگ عایق حرارتی',
  'چراغ مطالعه ارگونومیک'
];

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  onGoToAdmin,
  onOpenSearchModal
}) => {
  const {
    products,
    cart,
    wishlist,
    lang,
    setLang,
    darkMode,
    toggleDarkMode,
    activeTab,
    setActiveTab,
    setFilters,
    setIsCartDrawerOpen,
    currentUser,
    logout,
    setIsAuthModalOpen,
    cartTotal,
    formatPrice,
    openProductDetails
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_search_history');
      return saved ? JSON.parse(saved) : ['هدفون بیسیم', 'کیبورد مکانیکال', 'ساعت هوشمند'];
    } catch {
      return ['هدفون بیسیم', 'کیبورد مکانیکال', 'ساعت هوشمند'];
    }
  });

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Dynamic Live Search Results
  const liveSearchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.trim().toLowerCase();
    return products
      .filter(p =>
        p.nameFa.toLowerCase().includes(query) ||
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.tags?.some(t => t.toLowerCase().includes(query))
      )
      .slice(0, 5);
  }, [products, searchQuery]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Outside click listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const executeSearch = (term: string) => {
    const finalTerm = term.trim();
    if (!finalTerm) return;

    // Save to history
    const updated = [finalTerm, ...searchHistory.filter(h => h !== finalTerm)].slice(0, 6);
    setSearchHistory(updated);
    try {
      localStorage.setItem('lumina_search_history', JSON.stringify(updated));
    } catch {}

    setFilters(prev => ({
      ...prev,
      searchQuery: finalTerm,
      selectedCategory: 'all'
    }));
    setActiveTab('shop');
    setIsSearchDropdownOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  const navLinks = [
    { id: 'home', labelFa: 'صفحه اصلی', labelEn: 'Home' },
    { id: 'categories', labelFa: 'دسته‌بندی‌ها', labelEn: 'Categories' },
    { id: 'bestsellers', labelFa: 'پرفروش‌ترین‌ها', labelEn: 'Best Sellers' },
    { id: 'festival', labelFa: 'جشنواره تخفیف', labelEn: 'Festival', highlight: true },
    { id: 'blog', labelFa: 'راهنما و وبلاگ', labelEn: 'Blog' }
  ];

  return (
    <>
      {/* 1. Slim Top Utility Bar */}
      <div className="bg-zinc-900 text-zinc-300 text-[11px] py-1 px-4 border-b border-zinc-800 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>ارسال رایگان سفارش‌های بالای ۲ میلیون تومان</span>
            </div>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <div className="hidden sm:flex items-center gap-1 text-zinc-400">
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>پشتیبانی: ۰۲۱-۸۸۸۸۴۳۲۱</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onGoToAdmin && (
              <button
                onClick={onGoToAdmin}
                className="text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <LayoutDashboard className="w-3 h-3" />
                <span>{lang === 'fa' ? 'پنل مدیریت' : 'Admin'}</span>
              </button>
            )}
            <span className="text-zinc-700">|</span>
            <button
              onClick={toggleDarkMode}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              title={darkMode ? 'حالت روشن' : 'حالت تاریک'}
            >
              {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 dark:bg-[#09090B]/95 backdrop-blur-md shadow-xs border-b border-zinc-200/80 dark:border-zinc-800/80'
            : 'bg-white dark:bg-[#09090B] border-b border-zinc-200/60 dark:border-zinc-800/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-3 sm:gap-6">
            
            {/* Logo & Mobile Menu Toggle */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label="منو"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div
                onClick={() => {
                  playTactileClick();
                  setActiveTab('home');
                }}
                className="cursor-pointer transition-transform hover:scale-[1.02] flex items-center gap-2"
              >
                <LuminaLogo variant="full" size="md" />
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map(link => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      playTactileClick();
                      setActiveTab(link.id as any);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold'
                        : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-850'
                    }`}
                  >
                    <span>{lang === 'fa' ? link.labelFa : link.labelEn}</span>
                  </button>
                );
              })}
            </nav>

            {/* Center/Desktop Search Input */}
            <div className="flex-1 max-w-xs xl:max-w-sm relative hidden md:block" ref={searchContainerRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <div
                  className={`flex items-center w-full h-10 rounded-xl border transition-all duration-200 bg-zinc-50 dark:bg-zinc-900 ${
                    isSearchDropdownOpen
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-white dark:bg-zinc-900 shadow-xs'
                      : 'border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <Search className="w-4 h-4 text-zinc-400 mr-3 rtl:mr-3 rtl:ml-0 ltr:ml-3 ltr:mr-0 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => {
                      setSearchQuery(e.target.value);
                      setIsSearchDropdownOpen(true);
                    }}
                    onFocus={() => setIsSearchDropdownOpen(true)}
                    placeholder={lang === 'fa' ? 'جستجوی کالا، برند یا مدل...' : 'Search products...'}
                    className="w-full bg-transparent text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none px-2 font-sans"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1 text-zinc-400 hover:text-zinc-600 ml-2 rtl:ml-2 rtl:mr-0 ltr:mr-2 ltr:ml-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </form>

              {/* Live Search Dropdown */}
              {isSearchDropdownOpen && (
                <div className="absolute top-full right-0 left-0 mt-2 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {searchQuery.trim() ? (
                    <div>
                      <div className="text-[11px] font-bold text-zinc-400 mb-2 px-1">
                        نتایج هم‌زمان ({liveSearchResults.length} کالا)
                      </div>
                      {liveSearchResults.length > 0 ? (
                        <div className="space-y-1">
                          {liveSearchResults.map(product => (
                            <div
                              key={product.id}
                              onClick={() => {
                                openProductDetails(product);
                                setIsSearchDropdownOpen(false);
                              }}
                              className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={product.images[0]}
                                  alt={product.nameFa}
                                  className="w-9 h-9 rounded-lg object-contain bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800"
                                />
                                <div>
                                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                                    {lang === 'fa' ? product.nameFa : product.name}
                                  </h4>
                                  <span className="text-[10px] text-zinc-400">{product.brand}</span>
                                </div>
                              </div>
                              <span className="text-xs font-bold font-mono text-zinc-900 dark:text-zinc-100">
                                {formatPrice(product.price, product.priceUSD)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-4 text-center text-xs text-zinc-400">
                          کالایی یافت نشد.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="text-[11px] font-bold text-zinc-400 mb-2 px-1">
                        جستجوهای پیشنهادی
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {POPULAR_SEARCH_TERMS.map((term, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSearchQuery(term);
                              executeSearch(term);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-600 text-xs font-medium text-zinc-600 dark:text-zinc-300 transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions: Search (mobile), Wishlist, User, Cart */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Mobile Search Button */}
              <button
                type="button"
                onClick={onOpenSearchModal}
                className="md:hidden p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label="جستجو"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  setActiveTab('wishlist');
                }}
                className="relative p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="علاقه‌مندی‌ها"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold flex items-center justify-center shadow-xs">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* User Account Button / Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    if (!currentUser) {
                      setIsAuthModalOpen(true);
                    } else {
                      setIsUserMenuOpen(!isUserMenuOpen);
                    }
                  }}
                  className="flex items-center gap-1.5 p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title={currentUser ? currentUser.name : 'ورود به حساب'}
                >
                  <User className="w-5 h-5" />
                  {currentUser && (
                    <span className="hidden xl:inline text-xs font-semibold max-w-[80px] truncate">
                      {currentUser.name}
                    </span>
                  )}
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && currentUser && (
                  <div className="absolute top-full left-0 rtl:left-0 rtl:right-auto ltr:right-0 ltr:left-auto mt-2 w-48 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                        {currentUser.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('account');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-right rtl:text-right ltr:text-left px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        حساب کاربری
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('account');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-right rtl:text-right ltr:text-left px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        سفارش‌های من
                      </button>
                    </div>

                    <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-right rtl:text-right ltr:text-left px-3 py-1.5 rounded-lg text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center justify-between"
                      >
                        <span>خروج از حساب</span>
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  setIsCartDrawerOpen(true);
                }}
                className="h-10 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer shrink-0"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4" />
                  {totalCartItems > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white text-emerald-700 text-[10px] font-mono font-bold flex items-center justify-center shadow-xs">
                      {totalCartItems}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline font-mono tabular-nums">
                  {cartTotal?.total > 0 ? (cartTotal.total / 10).toLocaleString('fa-IR') + ' ت' : 'سبد خرید'}
                </span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 3. Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-72 max-w-[80vw] bg-white dark:bg-[#111114] border-l border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between mb-6">
                <LuminaLogo variant="full" size="sm" />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {navLinks.map(link => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(link.id as any);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-right px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      activeTab === link.id
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {lang === 'fa' ? link.labelFa : link.labelEn}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
              <span>لومینا ۲۰۲۶</span>
              <button
                type="button"
                onClick={toggleDarkMode}
                className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span>{darkMode ? 'حالت روشن' : 'حالت تاریک'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
