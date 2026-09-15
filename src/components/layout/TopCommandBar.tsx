import React from 'react';
import {
  Menu,
  Search,
  ShoppingBag,
  Heart,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Sparkles,
  Command,
  ShieldAlert,
  Keyboard,
  Sun,
  Moon
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/products';

interface TopCommandBarProps {
  onToggleMobileSidebar: () => void;
  onOpenCommandPalette: () => void;
  onOpenShortcuts: () => void;
  onGoToAdmin: () => void;
}

export const TopCommandBar: React.FC<TopCommandBarProps> = ({
  onToggleMobileSidebar,
  onOpenCommandPalette,
  onOpenShortcuts,
  onGoToAdmin
}) => {
  const {
    activeTab,
    setActiveTab,
    selectedProduct,
    filters,
    viewMode,
    setViewMode,
    cart,
    cartTotal,
    wishlist,
    formatPrice,
    lang,
    setIsCartDrawerOpen,
    setIsMobileFilterOpen,
    isAuthenticated,
    openLoginModal
  } = useStore();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Derive breadcrumbs
  const getBreadcrumbs = () => {
    const crumbs = [
      {
        label: 'Lumina',
        onClick: () => setActiveTab('home')
      }
    ];

    if (activeTab === 'home') {
      crumbs.push({ label: lang === 'fa' ? 'پیشخوان فروشگاه' : 'Storefront', onClick: () => {} });
    } else if (activeTab === 'shop') {
      crumbs.push({ label: lang === 'fa' ? 'کاتالوگ کالاها' : 'Catalog', onClick: () => {} });
      if (filters.selectedCategory && filters.selectedCategory !== 'all') {
        const cat = CATEGORIES.find(c => c.id === filters.selectedCategory);
        if (cat) {
          crumbs.push({
            label: lang === 'fa' ? cat.nameFa : cat.name,
            onClick: () => {}
          });
        }
      }
    } else if (activeTab === 'product-detail' && selectedProduct) {
      crumbs.push({
        label: lang === 'fa' ? 'کاتالوگ' : 'Catalog',
        onClick: () => setActiveTab('shop')
      });
      crumbs.push({
        label: lang === 'fa' ? selectedProduct.nameFa : selectedProduct.name,
        onClick: () => {}
      });
    } else if (activeTab === 'cart') {
      crumbs.push({ label: lang === 'fa' ? 'سبد خرید' : 'Cart', onClick: () => {} });
    } else if (activeTab === 'checkout') {
      crumbs.push({ label: lang === 'fa' ? 'تسویه حساب' : 'Checkout', onClick: () => {} });
    } else if (activeTab === 'account') {
      crumbs.push({ label: lang === 'fa' ? 'حساب کاربری' : 'Account', onClick: () => {} });
    } else if (activeTab === 'wishlist') {
      crumbs.push({ label: lang === 'fa' ? 'علاقه‌مندی‌ها' : 'Wishlist', onClick: () => {} });
    } else if (activeTab === 'festival') {
      crumbs.push({ label: lang === 'fa' ? 'جشنواره و تخفیف‌ها' : 'Festivals', onClick: () => {} });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-20 h-14 bg-white/80 dark:bg-[#09090B]/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 px-3 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left Area: Mobile Menu Trigger & Breadcrumbs */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Clean Breadcrumb Trail */}
        <nav className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 overflow-hidden whitespace-nowrap">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-zinc-300 dark:text-zinc-700">/</span>}
                <span
                  onClick={crumb.onClick}
                  className={`truncate max-w-[140px] sm:max-w-[220px] transition-colors ${
                    isLast
                      ? 'text-zinc-900 dark:text-zinc-100 font-semibold'
                      : 'hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer'
                  }`}
                >
                  {crumb.label}
                </span>
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Center Command Bar Trigger */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-zinc-100/70 dark:bg-zinc-900/60 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">
              {lang === 'fa' ? 'جستجوی کالا، فیلتر یا دستورات (⌘K)...' : 'Search products or commands...'}
            </span>
          </div>
          <kbd className="font-mono text-[10px] px-1 py-0.2 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-400 shrink-0">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls Area */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Mobile Search Icon */}
        <button
          onClick={onOpenCommandPalette}
          className="md:hidden p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* View Switcher (Only visible when on catalog / shop) */}
        {activeTab === 'shop' && (
          <div className="hidden sm:flex items-center border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5 bg-zinc-50 dark:bg-zinc-900">
            <button
              onClick={() => setViewMode('grid')}
              title={lang === 'fa' ? 'نمای شبکه‌ای' : 'Grid View'}
              className={`p-1 rounded transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              title={lang === 'fa' ? 'نمای فشرده جدولی (Table View)' : 'Table View'}
              className={`p-1 rounded transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Wishlist Link */}
        <button
          onClick={() => setActiveTab('wishlist')}
          title={lang === 'fa' ? 'علاقه‌مندی‌ها' : 'Wishlist'}
          className={`p-1.5 sm:p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative cursor-pointer ${
            activeTab === 'wishlist' ? 'text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800' : ''
          }`}
        >
          <Heart className="w-4 h-4" />
          {wishlist.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        {/* Shopping Cart Trigger */}
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-medium transition-colors cursor-pointer shadow-2xs active:scale-98"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300 shrink-0" />
          <span className="hidden sm:inline font-mono font-semibold text-[11px] text-zinc-900 dark:text-zinc-100">
            {totalCartCount > 0 ? formatPrice(cartTotal.total) : (lang === 'fa' ? 'سبد خرید' : 'Cart')}
          </span>
          {totalCartCount > 0 && (
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold">
              {totalCartCount}
            </span>
          )}
        </button>

        {/* Keyboard Shortcuts Trigger Button */}
        <button
          onClick={onOpenShortcuts}
          title="Keyboard Shortcuts (?)"
          className="hidden lg:flex p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Keyboard className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
