import React, { useState } from 'react';
import {
  Package,
  Flame,
  Sparkles,
  Trophy,
  ShoppingBag,
  Heart,
  User,
  ShieldAlert,
  Layers,
  MessageSquare,
  Search,
  Moon,
  Sun,
  Globe,
  Keyboard,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
  CheckCircle2,
  Grid,
  Headphones,
  Laptop,
  Watch,
  Coffee,
  Briefcase,
  Zap,
  Radio,
  ExternalLink,
  LogOut,
  LogIn
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/products';
import { LuminaLogo } from '../LuminaLogo';

interface ModernSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenCommandPalette: () => void;
  onOpenShortcuts: () => void;
  onGoToAdmin: () => void;
  onOpenSeoInspector?: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const ModernSidebar: React.FC<ModernSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  onOpenCommandPalette,
  onOpenShortcuts,
  onGoToAdmin,
  onOpenSeoInspector,
  mobileOpen,
  onCloseMobile
}) => {
  const {
    products,
    cart,
    wishlist,
    activeTab,
    setActiveTab,
    setFilters,
    filters,
    lang,
    setLang,
    darkMode,
    toggleDarkMode,
    setIsCartDrawerOpen,
    activeFestival,
    openFestivalPage,
    currentUser,
    isAuthenticated,
    openLoginModal,
    logout
  } = useStore();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    {
      id: 'shop',
      label: lang === 'fa' ? 'کاتالوگ و محصولات' : 'All Products',
      icon: Package,
      hotkey: 'G S',
      action: () => {
        setFilters(prev => ({ ...prev, onSaleOnly: false, selectedCategory: 'all' }));
        setActiveTab('shop');
        onCloseMobile();
      },
      isActive: activeTab === 'shop' && !filters.onSaleOnly && filters.selectedCategory === 'all'
    },
    {
      id: 'flash',
      label: lang === 'fa' ? 'پیشنهادهای شگفت‌انگیز' : 'Flash Drops',
      icon: Flame,
      badge: lang === 'fa' ? 'ویژه' : 'Drop',
      badgeColor: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
      hotkey: 'G D',
      action: () => {
        setFilters(prev => ({ ...prev, onSaleOnly: true, selectedCategory: 'all' }));
        setActiveTab('shop');
        onCloseMobile();
      },
      isActive: activeTab === 'shop' && filters.onSaleOnly
    },
    {
      id: 'festival',
      label: lang === 'fa' ? 'جشنواره‌ها و کوپن' : 'Seasonal Festivals',
      icon: Sparkles,
      badge: activeFestival ? (lang === 'fa' ? 'فعال' : 'Active') : undefined,
      badgeColor: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
      hotkey: 'G F',
      action: () => {
        openFestivalPage(activeFestival || undefined);
        onCloseMobile();
      },
      isActive: activeTab === 'festival'
    },
    {
      id: 'bestsellers',
      label: lang === 'fa' ? 'پرفروش‌ترین‌ها' : 'Best Sellers',
      icon: Trophy,
      hotkey: 'G B',
      action: () => {
        setFilters(prev => ({ ...prev, sortBy: 'popular', selectedCategory: 'all', onSaleOnly: false }));
        setActiveTab('shop');
        onCloseMobile();
      },
      isActive: activeTab === 'shop' && filters.sortBy === 'popular' && !filters.onSaleOnly
    },
    {
      id: 'cart',
      label: lang === 'fa' ? 'سبد خرید' : 'Shopping Cart',
      icon: ShoppingBag,
      count: totalCartCount > 0 ? totalCartCount : undefined,
      hotkey: 'G C',
      action: () => {
        setIsCartDrawerOpen(true);
        onCloseMobile();
      },
      isActive: activeTab === 'cart'
    },
    {
      id: 'wishlist',
      label: lang === 'fa' ? 'لیست علاقه‌مندی' : 'Wishlist',
      icon: Heart,
      count: wishlist.length > 0 ? wishlist.length : undefined,
      hotkey: 'G W',
      action: () => {
        setActiveTab('wishlist');
        onCloseMobile();
      },
      isActive: activeTab === 'wishlist'
    },
    {
      id: 'account',
      label: lang === 'fa' ? 'حساب کاربری' : 'My Account',
      icon: User,
      hotkey: 'G A',
      action: () => {
        setActiveTab('account');
        onCloseMobile();
      },
      isActive: activeTab === 'account'
    }
  ];

  const categoryCounts = React.useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach(p => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  }, [products]);

  const sidebarContent = (
    <aside
      className={`h-full flex flex-col justify-between bg-[#FAFAFA] dark:bg-[#0C0C0E] border-x border-zinc-200 dark:border-zinc-800/80 transition-all duration-200 select-none ${
        isCollapsed ? 'w-16' : 'w-64 sm:w-70'
      }`}
    >
      {/* Top Workspace Header */}
      <div>
        <div className="h-14 px-3.5 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80">
          <div
            onClick={() => {
              setActiveTab('home');
              onCloseMobile();
            }}
            className="flex items-center gap-2.5 cursor-pointer overflow-hidden group"
          >
            {/* Official Lumina Logo */}
            {isCollapsed ? (
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                <LuminaLogo variant="symbol" size="sm" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LuminaLogo variant="full" size="md" />
                <span className="text-[10px] font-mono px-1 py-0.2 rounded border border-[#74DB00]/40 text-[#55A800] dark:text-[#74DB00] bg-[#74DB00]/10 font-bold">
                  PRO
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              title="Collapse Sidebar"
              className="hidden lg:flex p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {lang === 'fa' ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Quick Search / Command Palette Bar */}
        <div className="p-2 border-b border-zinc-200/60 dark:border-zinc-800/60">
          <button
            onClick={onOpenCommandPalette}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-xs transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center px-0' : 'justify-between'
            }`}
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 shrink-0" />
              {!isCollapsed && (
                <span className="text-xs text-zinc-500 font-normal">
                  {lang === 'fa' ? 'جستجو یا دستور...' : 'Search or type...'}
                </span>
              )}
            </div>
            {!isCollapsed && (
              <kbd className="font-mono text-[10px] px-1 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-400">
                ⌘K
              </kbd>
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-320px)] no-scrollbar">
          {!isCollapsed && (
            <div className="px-2 pt-1 pb-1 text-[10px] font-mono font-medium uppercase tracking-wider text-zinc-400">
              {lang === 'fa' ? 'فهرست کارها' : 'Workspace'}
            </div>
          )}

          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isCollapsed ? 'justify-center px-0' : 'justify-between'
                } ${
                  item.isActive
                    ? 'bg-zinc-200/70 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-2xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Icon className="w-4 h-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
                  {!isCollapsed && <span className="text-xs truncate font-medium">{item.label}</span>}
                </div>

                {!isCollapsed && (
                  <div className="flex items-center gap-1 shrink-0">
                    {item.badge && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && (
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold">
                        {item.count}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}

          {/* Categories Section */}
          {!isCollapsed && (
            <div className="pt-3">
              <div className="px-2 pb-1 text-[10px] font-mono font-medium uppercase tracking-wider text-zinc-400">
                {lang === 'fa' ? 'دسته‌بندی‌ها' : 'Collections'}
              </div>
              <div className="space-y-0.5">
                {CATEGORIES.map(cat => {
                  const count = categoryCounts[cat.id] || 0;
                  const isCatActive =
                    activeTab === 'shop' && filters.selectedCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setFilters(prev => ({ ...prev, selectedCategory: cat.id, onSaleOnly: false }));
                        setActiveTab('shop');
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        isCatActive
                          ? 'bg-zinc-200/70 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium'
                          : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      <span className="truncate">{lang === 'fa' ? cat.nameFa : cat.name}</span>
                      <span className="font-mono text-[10px] text-zinc-400">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick System Links */}
          {!isCollapsed && (
            <div className="pt-3">
              <div className="px-2 pb-1 text-[10px] font-mono font-medium uppercase tracking-wider text-zinc-400">
                {lang === 'fa' ? 'سیستم و ابزارها' : 'System'}
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    onGoToAdmin();
                    onCloseMobile();
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{lang === 'fa' ? 'پنل مدیریت (Admin)' : 'Admin Console'}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">/admin</span>
                </button>

                {onOpenSeoInspector && (
                  <button
                    onClick={() => {
                      onOpenSeoInspector();
                      onCloseMobile();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{lang === 'fa' ? 'آنالیز سئو (SEO)' : 'SEO Engine'}</span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer User & Settings Controls */}
      <div className="p-2 border-t border-zinc-200 dark:border-zinc-800/80 space-y-1">
        {/* User Account Tile */}
        <div
          onClick={() => {
            if (isAuthenticated) {
              setActiveTab('account');
              onCloseMobile();
            } else {
              openLoginModal();
            }
          }}
          className={`flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 cursor-pointer transition-colors ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-mono font-medium text-zinc-700 dark:text-zinc-200 overflow-hidden shrink-0 border border-zinc-300 dark:border-zinc-700">
              {currentUser ? (
                currentUser.name.slice(0, 1)
              ) : (
                <User className="w-3.5 h-3.5 text-zinc-500" />
              )}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 truncate">
                <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {currentUser ? currentUser.name : (lang === 'fa' ? 'ورود به حساب' : 'Sign In')}
                </div>
                <div className="text-[10px] font-mono text-zinc-400 truncate">
                  {currentUser ? currentUser.email : (lang === 'fa' ? 'مهمان' : 'Guest')}
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && isAuthenticated && (
            <button
              onClick={e => {
                e.stopPropagation();
                logout();
              }}
              title="Logout"
              className="p-1 rounded text-zinc-400 hover:text-rose-500 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Global Controls Row */}
        {!isCollapsed ? (
          <div className="flex items-center justify-between pt-1 text-xs text-zinc-400">
            <div className="flex items-center gap-1">
              <button
                onClick={toggleDarkMode}
                title={darkMode ? 'Light mode' : 'Dark mode'}
                className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}
                title="Switch Language"
                className="px-1.5 py-0.5 rounded font-mono text-[10.5px] hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
              >
                {lang === 'fa' ? 'EN' : 'فا'}
              </button>

              <button
                onClick={onOpenShortcuts}
                title="Keyboard Shortcuts (?)"
                className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <Keyboard className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onToggleCollapse}
              className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              <ChevronsLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 pt-1">
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
            >
              <ChevronsRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 max-w-[80vw] h-full z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
