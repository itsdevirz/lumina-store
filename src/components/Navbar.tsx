import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ShoppingCart,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  Globe,
  LogIn,
  LogOut,
  Bell,
  Percent,
  Flame,
  Zap,
  Grid,
  Headphones,
  Laptop,
  Watch,
  Coffee,
  Briefcase,
  Home,
  MapPin,
  Check
} from 'lucide-react';

import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';
import { buildMegaMenuItems, MegaMenuItem, MegaMenuSubItem } from '../data/megaMenuData';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  onGoToAdmin?: () => void;
}

const CITIES = [
  'تهران، پونک (پیش‌فرض)',
  'تهران، سعادت‌آباد',
  'تهران، تهرانپارس',
  'مشهد، بلوار سجاد',
  'اصفهان، چهارباغ عباسی',
  'شیراز، معالی‌آباد',
  'تبریز، ولیعصر',
  'کرج، عظیمیه'
];

export const Navbar: React.FC<NavbarProps> = ({ onGoToAdmin }) => {
  const {
    products,
    cart,
    wishlist,
    lang,
    setLang,
    activeTab,
    setActiveTab,
    setIsCartDrawerOpen,
    openProductDetails,
    setFilters,
    formatPrice,
    isAuthenticated,
    openLoginModal,
    logout,
    userProfile,
    activeFestival,
    openFestivalPage
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const megaMenuItems = useMemo(() => buildMegaMenuItems(products), [products]);
  const [activeMegaCategory, setActiveMegaCategory] = useState<string>('audio');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('انتخاب آدرس');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuContainerRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsUserMenuOpen(false);
        setIsMegaMenuOpen(false);
        setIsNotificationsOpen(false);
        setIsAddressModalOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
      if (
        megaMenuContainerRef.current &&
        !megaMenuContainerRef.current.contains(e.target as Node)
      ) {
        setIsMegaMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const matchingProducts = debouncedSearch.trim()
    ? products
        .filter(p => {
          const q = debouncedSearch.toLowerCase().trim();
          return (
            p.name.toLowerCase().includes(q) ||
            p.nameFa.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q)
          );
        })
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (term: string) => {
    if (!term.trim()) return;
    setFilters(prev => ({ ...prev, searchQuery: term, selectedCategory: 'all' }));
    setActiveTab('shop');
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMegaMenuAction = (item: MegaMenuSubItem, categoryId: string) => {
    // 1. Direct Product Click: Opens exact Product details modal
    if (item.type === 'product' && item.productId) {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        openProductDetails(prod);
        setIsMegaMenuOpen(false);
        setIsMobileMenuOpen(false);
        return;
      }
    }

    // 2. Brand Click: Filters specifically by real brand in that category
    if (item.type === 'brand' && item.brand) {
      setFilters(prev => ({
        ...prev,
        selectedCategory: categoryId,
        selectedBrand: item.brand!,
        searchQuery: '',
        onSaleOnly: false,
        inStockOnly: false
      }));
      setActiveTab('shop');
      setIsMegaMenuOpen(false);
      setIsMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 3. Filter and Quick Access Click
    if (item.type === 'filter') {
      if (item.label.includes('شگفت‌انگیز')) {
        setFilters(prev => ({
          ...prev,
          selectedCategory: categoryId,
          onSaleOnly: true,
          searchQuery: '',
          selectedBrand: 'all'
        }));
      } else if (item.label.includes('آماده ارسال') || item.label.includes('موجود')) {
        setFilters(prev => ({
          ...prev,
          selectedCategory: categoryId,
          inStockOnly: true,
          searchQuery: '',
          selectedBrand: 'all'
        }));
      } else if (item.label.includes('پرفروش‌ترین')) {
        setFilters(prev => ({
          ...prev,
          selectedCategory: categoryId,
          sortBy: 'popular',
          searchQuery: '',
          selectedBrand: 'all'
        }));
      } else if (item.label.includes('زیر')) {
        const limit = item.label.includes('۱۰') ? 10000000 : item.label.includes('۶') ? 6000000 : 5000000;
        setFilters(prev => ({
          ...prev,
          selectedCategory: categoryId,
          maxPrice: limit,
          minPrice: 0,
          searchQuery: '',
          selectedBrand: 'all'
        }));
      } else if (item.label.includes('بالای')) {
        const limit = item.label.includes('۱۵') ? 15000000 : item.label.includes('۱۰') ? 10000000 : 6000000;
        setFilters(prev => ({
          ...prev,
          selectedCategory: categoryId,
          minPrice: limit,
          searchQuery: '',
          selectedBrand: 'all'
        }));
      }
      setActiveTab('shop');
      setIsMegaMenuOpen(false);
      setIsMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 4. Feature / Technical Spec Click
    setFilters(prev => ({
      ...prev,
      selectedCategory: categoryId,
      searchQuery: item.label,
      selectedBrand: 'all'
    }));
    setActiveTab('shop');
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAllCategoryClick = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCategory: categoryId,
      searchQuery: '',
      selectedBrand: 'all',
      onSaleOnly: false,
      inStockOnly: false
    }));
    setActiveTab('shop');
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Headphones':
        return <Headphones className="w-4 h-4" />;
      case 'Laptop':
        return <Laptop className="w-4 h-4" />;
      case 'Watch':
        return <Watch className="w-4 h-4" />;
      case 'Coffee':
        return <Coffee className="w-4 h-4" />;
      case 'Home':
        return <Home className="w-4 h-4" />;
      case 'Briefcase':
        return <Briefcase className="w-4 h-4" />;
      default:
        return <Grid className="w-4 h-4" />;
    }
  };

  const currentCategoryData =
    megaMenuItems.find(c => c.id === activeMegaCategory) || megaMenuItems[0];

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-40 w-full bg-white dark:bg-[#0B111E] transition-all duration-200 font-sans shadow-xs"
    >
      {/* 1. TOP MAIN ROW */}
      <div className="border-b border-slate-100 dark:border-slate-800/80 py-2.5 sm:py-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* RIGHT SIDE (RTL): Brand Logo & Wide Search Input */}
          <div className="flex items-center gap-4 sm:gap-6 flex-1 max-w-3xl">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="منو"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand Logo: Lumina */}
            <button
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 shrink-0 select-none group cursor-pointer focus:outline-none"
              title="Lumina"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <span className="text-2xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-mono">
                Lumina
              </span>
            </button>

            {/* Search Box: Sits beside Logo with placeholder "جستجو" */}
            <div ref={searchContainerRef} className="relative flex-1 max-w-xl hidden md:block">
              <div
                onClick={() => {
                  setIsSearchOpen(true);
                  setTimeout(() => searchInputRef.current?.focus(), 40);
                }}
                className="w-full flex items-center bg-[#F0F0F1] dark:bg-slate-800/90 rounded-xl px-3.5 py-2.5 transition-all text-slate-800 dark:text-slate-200 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500"
              >
                <Search className="w-5 h-5 text-slate-400 shrink-0 rtl:ml-2.5 ltr:mr-2.5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSearchSubmit(searchTerm);
                  }}
                  placeholder={lang === 'fa' ? 'جستجو' : 'Search'}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setSearchTerm('');
                    }}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Suggestions Dropdown */}
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.99 }}
                    transition={{ duration: 0.12 }}
                    className="absolute top-full rtl:right-0 ltr:left-0 mt-2 w-full bg-white dark:bg-[#0F172A] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3.5 z-50"
                  >
                    {matchingProducts.length > 0 ? (
                      <div className="space-y-1 mb-2">
                        <div className="text-[10px] font-bold text-slate-400 px-1 mb-1">
                          {lang === 'fa' ? 'نتایج پیشنهادی' : 'Suggested Products'}
                        </div>
                        {matchingProducts.map(p => (
                          <div
                            key={p.id}
                            onClick={() => {
                              openProductDetails(p);
                              setIsSearchOpen(false);
                            }}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors group"
                          >
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {lang === 'fa' ? p.nameFa : p.name}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">
                                {p.brand} • {p.categoryFa}
                              </div>
                            </div>
                            <div className="text-xs font-extrabold text-slate-900 dark:text-white shrink-0 tabular-nums">
                              {formatPrice(p.price, p.priceUSD)}
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => handleSearchSubmit(searchTerm)}
                          className="w-full text-center py-2 mt-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                        >
                          {lang === 'fa'
                            ? `مشاهده تمام نتایج (${matchingProducts.length} کالا)`
                            : 'View all results'}
                        </button>
                      </div>
                    ) : searchTerm.trim() ? (
                      <div className="py-5 text-center text-xs text-slate-400">
                        {lang === 'fa'
                          ? 'کالایی با این عبارت یافت نشد.'
                          : 'No matching products.'}
                      </div>
                    ) : (
                      <div className="py-2">
                        <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{lang === 'fa' ? 'جستجوهای پرطرفدار' : 'Popular Searches'}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {['هدفون بی‌سیم', 'ساعت هوشمند', 'اسپیکر قابل حمل', 'میز کار'].map(
                            (term, i) => (
                              <button
                                key={i}
                                onClick={() => handleSearchSubmit(term)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
                              >
                                {term}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* LEFT SIDE (RTL): Bell, Auth Button, Separator, Cart Icon */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Mobile Search Trigger */}
            <button
              onClick={() => {
                setIsSearchOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 40);
              }}
              className="md:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
              aria-label="جستجو"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notification Bell */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer relative rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="اعلان‌ها"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF394E]" />
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.12 }}
                    className="absolute top-full rtl:left-0 ltr:right-0 mt-2 w-72 bg-white dark:bg-[#0F172A] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 text-xs"
                  >
                    <div className="font-bold text-slate-800 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span>{lang === 'fa' ? 'پیام‌ها و اعلان‌ها' : 'Notifications'}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-50 text-[#EF394E] font-bold">
                        ۲ جدید
                      </span>
                    </div>
                    <div className="space-y-2 pt-2">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 text-[11px] leading-relaxed">
                        🎉 جشنواره ویژه لومینا آغاز شد! تا ۲۰٪ تخفیف روی محصولات برگزیده فعال گردید.
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 text-[11px] leading-relaxed">
                        ⚡ ارسال سریع و اکسپرس برای سفارش‌های امروز ثبت گردید.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Button: "ورود | ثبت‌نام" with Door LogIn Icon */}
            <div ref={userMenuRef} className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer"
                >
                  <img
                    src={userProfile.avatar}
                    alt=""
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[85px]">
                    {userProfile.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ) : (
                <button
                  onClick={openLoginModal}
                  className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-slate-700 dark:text-slate-300 rtl:rotate-180" />
                  <span>{lang === 'fa' ? 'ورود | ثبت‌نام' : 'Sign In | Register'}</span>
                </button>
              )}

              {/* User Dropdown */}
              <AnimatePresence>
                {isUserMenuOpen && isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.12 }}
                    className="absolute top-full rtl:left-0 ltr:right-0 mt-2 w-60 bg-white dark:bg-[#0F172A] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2.5 z-50 space-y-1 text-xs font-bold"
                  >
                    <div className="p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl mb-1">
                      <div className="text-slate-900 dark:text-white truncate">
                        {userProfile.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {userProfile.email}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('account');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-right p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between"
                    >
                      <span>داشبورد سفارش‌ها</span>
                      <User className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('wishlist');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-right p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between"
                    >
                      <span>لیست علاقه‌مندی‌ها</span>
                      <Heart className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-right p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-[#EF394E] flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2"
                    >
                      <span>خروج از حساب</span>
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Vertical Divider Line */}
            <div className="w-[1px] h-6 bg-slate-300 dark:bg-slate-700 mx-0.5" />

            {/* Shopping Cart Icon with Badge */}
            <button
              id="navbar-cart-button"
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="سبد خرید"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 rounded-full bg-[#EF394E] text-white text-[10px] font-black flex items-center justify-center tabular-nums shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Compact Dark Mode & Language Toggle Tools */}
            <div className="hidden xl:flex items-center gap-1.5 ms-1">
              <ThemeToggle />
              <button
                onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}
                className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="تغییر زبان"
              >
                {lang === 'fa' ? 'EN' : 'فا'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECONDARY NAVIGATION BAR (With Digikala-Style Mega Menu) */}
      <div
        ref={megaMenuContainerRef}
        className="relative hidden lg:block border-b border-slate-100 dark:border-slate-800/80 py-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-xs font-bold text-slate-600 dark:text-slate-300"
      >
        <div className="flex items-center justify-between">
          {/* Right Navigation Links Cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* "دسته‌بندی کالاها" Toggle */}
            <button
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-black ${
                isMegaMenuOpen
                  ? 'text-[#EF394E] bg-rose-50/50 dark:bg-rose-950/30'
                  : 'text-slate-900 dark:text-white hover:text-[#EF394E]'
              }`}
            >
              <Menu className="w-4.5 h-4.5" />
              <span>{lang === 'fa' ? 'دسته‌بندی کالاها' : 'Categories'}</span>
            </button>

            {/* Vertical Divider */}
            <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

            {/* "شگفت‌انگیزها" with % icon */}
            <button
              onClick={() => {
                const el = document.getElementById('flash-sale-section');
                if (activeTab !== 'home') {
                  setActiveTab('home');
                  setTimeout(
                    () =>
                      document
                        .getElementById('flash-sale-section')
                        ?.scrollIntoView({ behavior: 'smooth' }),
                    100
                  );
                } else {
                  el?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Percent className="w-3.5 h-3.5 text-slate-500" />
              <span>{lang === 'fa' ? 'شگفت‌انگیزها' : 'Flash Deals'}</span>
            </button>

            {/* "پرفروش‌ترین‌ها" with Flame icon */}
            <button
              onClick={() => {
                const el = document.getElementById('best-sellers-section');
                if (activeTab !== 'home') {
                  setActiveTab('home');
                  setTimeout(
                    () =>
                      document
                        .getElementById('best-sellers-section')
                        ?.scrollIntoView({ behavior: 'smooth' }),
                    100
                  );
                } else {
                  el?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-slate-500" />
              <span>{lang === 'fa' ? 'پرفروش‌ترین‌ها' : 'Best Sellers'}</span>
            </button>

            {/* Festival active pill */}
            {activeFestival?.isActive && (
              <button
                onClick={() => openFestivalPage(activeFestival)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[#EF394E] hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer font-black"
              >
                <Flame className="w-3.5 h-3.5 text-[#EF394E] animate-pulse" />
                <span>{lang === 'fa' ? 'جشنواره ویژه' : 'Festival'}</span>
              </button>
            )}
          </div>

          {/* Left Side: Amber Location Pill "انتخاب آدرس" */}
          <button
            onClick={() => setIsAddressModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50/90 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/70 dark:border-amber-900/50 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{selectedCity}</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* MEGA MENU: Exact Digikala layout matching uploaded screenshot */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {isMegaMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
              className="absolute top-full rtl:right-0 ltr:left-0 w-full mt-1 bg-white dark:bg-[#0C1220] rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 z-50 overflow-hidden flex min-h-[460px] max-h-[560px]"
            >
              {/* RIGHT SIDEBAR (Vertical categories list with icons) */}
              <div className="w-56 shrink-0 bg-slate-50/80 dark:bg-[#080E1A] border-l border-slate-100 dark:border-slate-800/80 py-3 overflow-y-auto">
                <div className="space-y-0.5 px-2">
                  {megaMenuItems.map(item => {
                    const isActive = activeMegaCategory === item.id;
                    return (
                      <button
                        key={item.id}
                        onMouseEnter={() => setActiveMegaCategory(item.id)}
                        onClick={() => handleAllCategoryClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-right transition-all cursor-pointer text-xs font-black ${
                          isActive
                            ? 'bg-white dark:bg-[#0C1220] text-[#EF394E] shadow-sm border border-slate-200/60 dark:border-slate-800'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={
                              isActive
                                ? 'text-[#EF394E]'
                                : 'text-slate-500 dark:text-slate-400'
                            }
                          >
                            {getCategoryIcon(item.iconName)}
                          </span>
                          <span>{item.nameFa}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-normal px-1.5 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                            {item.productCount}
                          </span>
                          {isActive && <ChevronLeft className="w-3.5 h-3.5 text-[#EF394E]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* LEFT CONTENT AREA: Top "همه محصولات >" + 4 Columns of sub-links */}
              <div className="flex-1 p-6 overflow-y-auto bg-white dark:bg-[#0C1220]">
                {/* Top Link: "همه محصولات [دسته] >" */}
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={() => handleAllCategoryClick(currentCategoryData.id)}
                    className="flex items-center gap-1.5 text-xs font-black text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 cursor-pointer group"
                  >
                    <span>{currentCategoryData.allProductsLabelFa} ({currentCategoryData.productCount} کالا)</span>
                    <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {currentCategoryData.productCount} محصول رسمی با گارانتی اصالت فیزیکی
                  </span>
                </div>

                {/* Columns Grid (4 columns based on real products) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-7">
                  {currentCategoryData.columns.map((column, idx) => (
                    <div key={idx} className="space-y-3">
                      {/* Column Title with Red Vertical Pipe Bar */}
                      <div
                        onClick={() => handleAllCategoryClick(currentCategoryData.id)}
                        className="flex items-center gap-1.5 cursor-pointer group select-none"
                      >
                        <span className="w-0.5 h-4 bg-[#EF394E] rounded-full inline-block shrink-0" />
                        <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-[#EF394E] transition-colors flex items-center gap-1">
                          {column.title}
                          <ChevronLeft className="w-3 h-3 text-slate-400 group-hover:text-[#EF394E] group-hover:-translate-x-0.5 transition-all" />
                        </span>
                      </div>

                      {/* Column Sub-items List */}
                      <ul className="space-y-2 text-[11.5px] font-normal text-slate-600 dark:text-slate-400">
                        {column.items.map((subItem, itemIdx) => (
                          <li
                            key={itemIdx}
                            onClick={() =>
                              handleMegaMenuAction(subItem, currentCategoryData.id)
                            }
                            className="flex items-center justify-between gap-1.5 hover:text-[#EF394E] dark:hover:text-[#EF394E] cursor-pointer transition-colors leading-relaxed group"
                            title={subItem.label}
                          >
                            <span className="truncate group-hover:translate-x-[-2px] transition-transform">
                              {subItem.label}
                            </span>
                            {subItem.badge && (
                              <span className="text-[9.5px] px-1.5 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/50 text-[#EF394E] font-bold shrink-0">
                                {subItem.badge}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. CITY SELECTION MODAL (When clicking "انتخاب آدرس") */}
      <AnimatePresence>
        {isAddressModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setIsAddressModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm bg-white dark:bg-[#0F172A] rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#EF394E]" />
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    انتخاب استان و شهر
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddressModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {CITIES.map(city => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city.split(' (')[0]);
                      setIsAddressModalOpen(false);
                    }}
                    className={`w-full text-right p-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCity === city.split(' (')[0]
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-[#EF394E]'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{city}</span>
                    {selectedCity === city.split(' (')[0] && (
                      <Check className="w-4 h-4 text-[#EF394E]" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. MOBILE MENU DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-[#090D16] border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-4 shadow-xl overflow-hidden max-h-[85vh] overflow-y-auto"
          >
            {/* Mobile Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute rtl:right-3 ltr:left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit(searchTerm);
                    setIsMobileMenuOpen(false);
                  }
                }}
                placeholder={lang === 'fa' ? 'جستجو در لومینا...' : 'Search in Lumina...'}
                className="w-full rtl:pr-9 rtl:pl-4 ltr:pl-9 ltr:pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Mobile Categories Accordion */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 mb-2">
                {lang === 'fa' ? 'دسته‌بندی‌های کالا' : 'Categories'}
              </div>
              <div className="space-y-1">
                {megaMenuItems.map(item => {
                  const isExpanded = mobileExpandedCat === item.id;
                  return (
                    <div
                      key={item.id}
                      className="border border-slate-100 dark:border-slate-800/80 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/40"
                    >
                      <button
                        onClick={() => setMobileExpandedCat(isExpanded ? null : item.id)}
                        className="w-full p-2.5 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 text-right cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 dark:text-blue-400">
                            {getCategoryIcon(item.iconName)}
                          </span>
                          <span>{item.nameFa}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-normal px-1.5 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-500">
                            {item.productCount}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-3 pb-3 pt-1 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0B111E] space-y-3">
                          <button
                            onClick={() => handleAllCategoryClick(item.id)}
                            className="w-full text-right text-[11px] font-black text-sky-600 dark:text-sky-400 py-1"
                          >
                            {item.allProductsLabelFa} ({item.productCount} کالا) &gt;
                          </button>
                          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                            {item.columns.flatMap(c => c.items.slice(0, 3)).map((sub, i) => (
                              <button
                                key={i}
                                onClick={() => handleMegaMenuAction(sub, item.id)}
                                className="text-right py-1 hover:text-[#EF394E] truncate flex items-center justify-between gap-1"
                              >
                                <span className="truncate">• {sub.label}</span>
                                {sub.badge && (
                                  <span className="text-[9px] px-1 py-0.2 rounded bg-rose-50 dark:bg-rose-950/50 text-[#EF394E] font-bold shrink-0">
                                    {sub.badge}
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Address selector */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAddressModalOpen(true);
              }}
              className="w-full p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-between text-xs font-bold cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>{selectedCity}</span>
              </div>
              <span className="text-[10px] text-amber-600">تغییر</span>
            </button>

            {/* Mobile Tools */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold">پوسته:</span>
                <ThemeToggle />
              </div>
              <button
                onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span>{lang === 'fa' ? 'English (EN)' : 'فارسی (FA)'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
