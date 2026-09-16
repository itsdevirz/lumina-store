import React from 'react';
import { Home, Compass, Search, Heart, ShoppingBag, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface MobileBottomNavProps {
  onOpenSearch?: () => void;
  onGoToAdmin?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenSearch,
  onGoToAdmin
}) => {
  const {
    activeTab,
    setActiveTab,
    cart,
    wishlist,
    setIsCartDrawerOpen,
    lang
  } = useStore();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav
      id="mobile-bottom-nav"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#09090B]/95 backdrop-blur-xl border-t border-zinc-200/80 dark:border-zinc-800/80 md:hidden px-3 py-2 shadow-lg select-none"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 min-w-[50px] min-h-[44px] justify-center transition-colors cursor-pointer ${
            activeTab === 'home'
              ? 'text-zinc-950 dark:text-white font-bold'
              : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">{lang === 'fa' ? 'خانه' : 'Home'}</span>
          {activeTab === 'home' && (
            <span className="w-1 h-1 rounded-full bg-[#62DB00] -mt-0.5" />
          )}
        </button>

        {/* Shop / Catalog */}
        <button
          onClick={() => {
            setActiveTab('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 min-w-[50px] min-h-[44px] justify-center transition-colors cursor-pointer ${
            activeTab === 'shop'
              ? 'text-zinc-950 dark:text-white font-bold'
              : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">{lang === 'fa' ? 'فروشگاه' : 'Shop'}</span>
          {activeTab === 'shop' && (
            <span className="w-1 h-1 rounded-full bg-[#62DB00] -mt-0.5" />
          )}
        </button>

        {/* Search */}
        <button
          onClick={() => {
            if (onOpenSearch) onOpenSearch();
          }}
          className="flex flex-col items-center gap-1 min-w-[50px] min-h-[44px] justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">{lang === 'fa' ? 'جستجو' : 'Search'}</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => {
            setActiveTab('wishlist');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`relative flex flex-col items-center gap-1 min-w-[50px] min-h-[44px] justify-center transition-colors cursor-pointer ${
            activeTab === 'wishlist'
              ? 'text-zinc-950 dark:text-white font-bold'
              : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-[15px] h-[15px] px-0.5 text-[9px] font-mono font-bold text-white bg-rose-500 rounded-full">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">{lang === 'fa' ? 'علاقه‌مندی' : 'Wishlist'}</span>
          {activeTab === 'wishlist' && (
            <span className="w-1 h-1 rounded-full bg-[#62DB00] -mt-0.5" />
          )}
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="relative flex flex-col items-center gap-1 min-w-[50px] min-h-[44px] justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9px] font-mono font-bold text-black bg-[#62DB00] rounded-full">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">{lang === 'fa' ? 'سبد خرید' : 'Cart'}</span>
        </button>
      </div>
    </nav>
  );
};
