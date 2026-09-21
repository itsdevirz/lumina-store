import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  Globe,
  Sun,
  Moon,
  LogOut,
  LogIn,
  LayoutDashboard,
  Truck,
  ShieldCheck,
  Flame,
  Tag,
  ArrowRight,
  SlidersHorizontal,
  Command
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';
import { LuminaLogo } from './LuminaLogo';
import { playTactileClick } from '../utils/sound';

interface ModernHeaderProps {
  onGoToAdmin?: () => void;
  onOpenSearchModal: () => void;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  onGoToAdmin,
  onOpenSearchModal
}) => {
  const {
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
    formatPrice
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [currency, setCurrency] = useState<'IRR' | 'USD'>('IRR');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(CATEGORIES[0]?.id || null);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  // Detect scroll for dynamic blur & elevation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCategoryClick = (catId: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCategory: catId,
      searchQuery: ''
    }));
    setActiveTab('shop');
    setIsCategoryMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'home', labelFa: 'صفحه اصلی', labelEn: 'Home' },
    { id: 'shop', labelFa: 'فروشگاه و محصولات', labelEn: 'Shop All' },
    { id: 'festival', labelFa: 'جشنواره تخفیف‌ها', labelEn: 'Flash Drops', badge: 'HOT' },
    { id: 'bestsellers', labelFa: 'پرفروش‌ترین‌ها', labelEn: 'Best Sellers' }
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-zinc-950 text-zinc-300 text-[11px] py-1.5 px-4 border-b border-zinc-900 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Free shipping promise */}
          <div className="flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#62DB00] animate-pulse" />
            <span className="font-medium">
              {lang === 'fa'
                ? 'ارسال اکسپرس رایگان برای سفارش‌های بالای ۲ میلیون تومان'
                : 'Free express shipping on all orders over $150'}
            </span>
            <span className="hidden md:inline-block text-zinc-600">•</span>
            <span className="hidden md:inline-block text-zinc-400 font-mono">
              {lang === 'fa' ? 'ضمانت اصالت ۱۰۰٪ کالاها' : 'Official 2-Year Warranty'}
            </span>
          </div>

          {/* Right: Quick utility switchers */}
          <div className="flex items-center gap-3 font-mono">
            {/* Currency selector */}
            <button
              onClick={() => setCurrency(currency === 'IRR' ? 'USD' : 'IRR')}
              className="hover:text-white transition-colors cursor-pointer"
              title="تغییر واحد پول"
            >
              {currency === 'IRR' ? 'تومان (IRR)' : 'USD ($)'}
            </button>

            <span className="text-zinc-700">|</span>

            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <Globe className="w-3 h-3 text-[#62DB00]" />
              <span>{lang === 'fa' ? 'English' : 'فارسی'}</span>
            </button>

            {onGoToAdmin && (
              <>
                <span className="text-zinc-700">|</span>
                <button
                  onClick={onGoToAdmin}
                  className="text-zinc-400 hover:text-[#62DB00] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <LayoutDashboard className="w-3 h-3" />
                  <span>{lang === 'fa' ? 'پنل ادمین' : 'Admin'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 dark:bg-[#09090B]/95 backdrop-blur-md shadow-xs border-b border-zinc-200/90 dark:border-zinc-800/90'
            : 'bg-white dark:bg-[#09090B] border-b border-zinc-200/60 dark:border-zinc-800/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-3 sm:gap-6">
            {/* Left Area: Mobile Menu Button & Brand Logo */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Official Brand Logo */}
              <div
                onClick={() => setActiveTab('home')}
                className="cursor-pointer transition-transform hover:scale-[1.02] shrink-0"
              >
                <LuminaLogo variant="full" size="md" />
              </div>
            </div>

            {/* Center Area: Animated Search Bar */}
            <div className="flex-1 max-w-xl hidden md:block">
              <div
                onClick={onOpenSearchModal}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`group relative flex items-center w-full h-11 px-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                  searchFocused
                    ? 'bg-white dark:bg-zinc-900 border-[#62DB00] shadow-[0_0_12px_rgba(98,219,0,0.15)] ring-2 ring-[#62DB00]/20'
                    : 'bg-zinc-100/80 dark:bg-zinc-900/60 border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <Search className="w-4 h-4 text-zinc-400 group-hover:text-[#62DB00] transition-colors shrink-0" />
                <span className="flex-1 px-3 text-xs sm:text-sm text-zinc-400 select-none text-right rtl:text-right ltr:text-left truncate">
                  {lang === 'fa'
                    ? 'جستجوی لپ‌تاپ، هدفون، ساعت هوشمند و...'
                    : 'Search laptops, audio gear, smartwatches...'}
                </span>
                <div className="flex items-center gap-1 shrink-0 font-mono text-[10px] text-zinc-400 bg-zinc-200/70 dark:bg-zinc-800/70 px-1.5 py-0.5 rounded border border-zinc-300/60 dark:border-zinc-700/60">
                  <Command className="w-2.5 h-2.5" />
                  <span>K</span>
                </div>
              </div>
            </div>

            {/* Right Area: Actions (Theme, Search Mobile, Wishlist, Cart, User) */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Mobile search trigger */}
              <button
                onClick={onOpenSearchModal}
                className="md:hidden p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={() => {
                  playTactileClick(1500);
                  toggleDarkMode();
                }}
                className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer tactile-press"
                title={darkMode ? 'حالت روشن' : 'حالت تاریک'}
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-600" />
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => {
                  playTactileClick(1300);
                  setActiveTab('wishlist');
                }}
                className="relative p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer tactile-press"
                aria-label="Wishlist"
                title={lang === 'fa' ? 'علاقه‌مندی‌ها' : 'Wishlist'}
              >
                <Heart
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : ''
                  }`}
                />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-mono font-bold text-white bg-rose-500 rounded-full shadow-xs">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Shopping Cart Button */}
              <button
                id="shopping-cart-button"
                onClick={() => {
                  playTactileClick(1100);
                  setIsCartDrawerOpen(true);
                }}
                className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl bg-zinc-100/90 dark:bg-zinc-900 hover:border-[#62DB00]/60 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-800 transition-all duration-150 cursor-pointer group tactile-press"
                aria-label="Shopping Cart"
              >
                <div className="relative shrink-0">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-700 dark:text-zinc-200 group-hover:text-[#62DB00] transition-colors" />
                  {totalCartItems > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[10px] font-mono font-bold text-black bg-[#62DB00] rounded-full shadow-xs">
                      {totalCartItems}
                    </span>
                  )}
                </div>

                <div className="hidden lg:flex flex-col text-right rtl:text-right ltr:text-left leading-tight select-none">
                  <span className="text-[10px] text-zinc-400 font-medium">
                    {lang === 'fa' ? 'سبد خرید' : 'My Cart'}
                  </span>
                  <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#62DB00] transition-colors">
                    {cartTotal?.total > 0
                      ? formatPrice(cartTotal.total)
                      : (lang === 'fa' ? '۰ تومان' : '0 Toman')}
                  </span>
                </div>
              </button>

              {/* User Account Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => {
                    if (currentUser) {
                      setIsUserMenuOpen(!isUserMenuOpen);
                    } else {
                      setIsAuthModalOpen(true);
                    }
                  }}
                  className="flex items-center gap-1.5 p-1.5 sm:p-2 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 border border-zinc-200/60 dark:border-zinc-800/60 transition-colors cursor-pointer"
                  aria-label="Account"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs">
                    {currentUser ? currentUser.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  {currentUser && (
                    <span className="hidden xl:inline-block text-xs font-medium max-w-[90px] truncate">
                      {currentUser.name}
                    </span>
                  )}
                </button>

                {/* Account Dropdown */}
                <AnimatePresence>
                  {isUserMenuOpen && currentUser && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 rtl:left-0 rtl:right-auto ltr:right-0 ltr:left-auto mt-2 w-56 bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-2 z-50 text-zinc-800 dark:text-zinc-200"
                    >
                      <div className="px-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {currentUser.name}
                        </p>
                        <p className="text-[11px] font-mono text-zinc-400 truncate mt-0.5">
                          {currentUser.email || currentUser.phone}
                        </p>
                      </div>

                      <div className="py-1 space-y-0.5">
                        <button
                          onClick={() => {
                            setActiveTab('account');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors text-right rtl:text-right ltr:text-left"
                        >
                          <User className="w-4 h-4 text-zinc-400" />
                          <span>{lang === 'fa' ? 'حساب کاربری و سفارشات' : 'My Account & Orders'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('wishlist');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors text-right rtl:text-right ltr:text-left"
                        >
                          <Heart className="w-4 h-4 text-zinc-400" />
                          <span>{lang === 'fa' ? 'لیست علاقه‌مندی‌ها' : 'Wishlist'}</span>
                        </button>
                      </div>

                      <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors text-right rtl:text-right ltr:text-left font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{lang === 'fa' ? 'خروج از حساب' : 'Log Out'}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Secondary Sub-Navigation Bar (Categories & Links) */}
          <nav className="hidden lg:flex items-center justify-between py-2 border-t border-zinc-100 dark:border-zinc-800/70 text-xs font-medium">
            <div className="flex items-center gap-6">
              {/* Mega Categories Trigger */}
              <div className="relative" ref={categoryMenuRef}>
                <button
                  onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                  onMouseEnter={() => setIsCategoryMenuOpen(true)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-semibold ${
                    isCategoryMenuOpen
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-transparent shadow-xs'
                      : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200/80 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#62DB00]" />
                  <span>{lang === 'fa' ? 'دسته‌بندی کالاها' : 'Categories'}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isCategoryMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Rich Categories Dropdown */}
                <AnimatePresence>
                  {isCategoryMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      onMouseLeave={() => setIsCategoryMenuOpen(false)}
                      className="absolute top-full mt-2 w-[720px] bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 p-4 grid grid-cols-12 gap-4 text-zinc-900 dark:text-zinc-100"
                    >
                      {/* Left: Category list */}
                      <div className="col-span-5 space-y-1 border-l rtl:border-l rtl:border-r-0 ltr:border-r ltr:border-l-0 border-zinc-100 dark:border-zinc-800/80 pr-2 rtl:pr-0 rtl:pl-2">
                        {CATEGORIES.map(cat => (
                          <div
                            key={cat.id}
                            onMouseEnter={() => setHoveredCategory(cat.id)}
                            onClick={() => handleCategoryClick(cat.id)}
                            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                              hoveredCategory === cat.id
                                ? 'bg-[#62DB00]/10 text-zinc-950 dark:text-white border border-[#62DB00]/30'
                                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400'
                            }`}
                          >
                            <span>{lang === 'fa' ? cat.nameFa : cat.name}</span>
                            <ChevronLeft className="w-3.5 h-3.5 opacity-50 rtl:rotate-0 ltr:rotate-180" />
                          </div>
                        ))}
                      </div>

                      {/* Right: Featured Preview for Selected Category */}
                      <div className="col-span-7 flex flex-col justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              {lang === 'fa' ? 'پیشنهاد ویژه این دسته' : 'Featured in Category'}
                            </span>
                            <span className="text-[10px] font-mono text-[#62DB00] font-semibold">
                              OFFICIAL WARRANTY
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                            {lang === 'fa'
                              ? 'جدیدترین ادوات سخت‌افزاری اورجینال با گارانتی معتبر شرکتی، مهلت تست ۷ روزه و ارسال فوری.'
                              : 'Next-generation certified electronics with guaranteed authentic build quality and rapid dispatch.'}
                          </p>
                        </div>

                        <button
                          onClick={() => handleCategoryClick(hoveredCategory || 'all')}
                          className="w-full py-2 px-3 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-[#62DB00] hover:text-black dark:hover:bg-[#62DB00] dark:hover:text-black font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>{lang === 'fa' ? 'مشاهده همه محصولات این بخش' : 'View All Category Items'}</span>
                          <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Direct links */}
              {navLinks.map(link => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      setActiveTab(link.id as any);
                    }}
                    className={`relative py-1 transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'text-zinc-900 dark:text-white font-bold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <span>{lang === 'fa' ? link.labelFa : link.labelEn}</span>
                    {link.badge && (
                      <span className="px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        {link.badge}
                      </span>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute -bottom-2 inset-x-0 h-0.5 bg-[#62DB00]"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right micro badge */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#62DB00]" />
              <span>{lang === 'fa' ? 'ضمانت بازگشت ۷ روزه' : '7-Day Return Guarantee'}</span>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Slide-Out Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: lang === 'fa' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: lang === 'fa' ? '100%' : '-100%' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-4/5 max-w-sm h-full bg-white dark:bg-[#0C0C0E] border-r rtl:border-r-0 rtl:border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col justify-between overflow-y-auto z-10"
            >
              <div>
                {/* Header with Logo & Close */}
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                  <LuminaLogo variant="full" size="sm" />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Primary Nav Links */}
                <div className="p-4 space-y-1">
                  {navLinks.map(link => (
                    <button
                      key={link.id}
                      onClick={() => {
                        setActiveTab(link.id as any);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-sm font-semibold text-right rtl:text-right ltr:text-left transition-colors ${
                        activeTab === link.id
                          ? 'bg-[#62DB00]/10 text-zinc-900 dark:text-white border border-[#62DB00]/30'
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <span>{lang === 'fa' ? link.labelFa : link.labelEn}</span>
                      {link.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-500">
                          {link.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Categories Accordion */}
                <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
                    {lang === 'fa' ? 'دسته‌بندی‌های کالا' : 'Product Categories'}
                  </div>
                  <div className="space-y-1">
                    {CATEGORIES.map(c => (
                      <button
                        key={c.id}
                        onClick={() => handleCategoryClick(c.id)}
                        className="w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 text-right rtl:text-right ltr:text-left"
                      >
                        <span>{lang === 'fa' ? c.nameFa : c.name}</span>
                        <ChevronLeft className="w-3.5 h-3.5 opacity-50 rtl:rotate-0 ltr:rotate-180" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer with User & Switchers */}
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 space-y-3">
                {currentUser ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-xs">
                        <div className="font-bold truncate max-w-[120px]">{currentUser.name}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          {currentUser.role === 'admin' ? 'مدیر ارشد' : 'کاربر ویژه'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                      title="خروج"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{lang === 'fa' ? 'ورود / ثبت‌نام در لومینا' : 'Sign In / Register'}</span>
                  </button>
                )}

                {/* Language & Currency toggles */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 text-xs font-mono text-zinc-500">
                  <button
                    onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}
                    className="hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    {lang === 'fa' ? 'English' : 'فارسی'}
                  </button>
                  <button
                    onClick={() => setCurrency(currency === 'IRR' ? 'USD' : 'IRR')}
                    className="hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    {currency}
                  </button>
                  {onGoToAdmin && (
                    <button
                      onClick={() => {
                        onGoToAdmin();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-[#62DB00] font-bold"
                    >
                      {lang === 'fa' ? 'پنل ادمین' : 'Admin'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
