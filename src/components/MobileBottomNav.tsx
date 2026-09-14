import React from 'react';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface MobileBottomNavProps {
  onGoToAdmin?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onGoToAdmin }) => {
  const { activeTab, setActiveTab, cart, wishlist, setIsCartDrawerOpen, lang } = useStore();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav
      id="mobile-bottom-nav"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/90 dark:bg-[#090D16]/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 md:hidden px-2 py-1.5 shadow-lg"
    >
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 p-1 min-w-[56px] min-h-[44px] justify-center transition-colors cursor-pointer ${
            activeTab === 'home'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">{lang === 'fa' ? 'خانه' : 'Home'}</span>
        </button>

        {/* Shop / Catalog */}
        <button
          onClick={() => {
            setActiveTab('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 p-1 min-w-[56px] min-h-[44px] justify-center transition-colors cursor-pointer ${
            activeTab === 'shop'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">{lang === 'fa' ? 'فروشگاه' : 'Shop'}</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => {
            setActiveTab('wishlist');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`relative flex flex-col items-center gap-1 p-1 min-w-[56px] min-h-[44px] justify-center transition-colors cursor-pointer ${
            activeTab === 'wishlist'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px]">{lang === 'fa' ? 'علاقه‌مندی' : 'Wishlist'}</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="relative flex flex-col items-center gap-1 p-1 min-w-[56px] min-h-[44px] justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">{lang === 'fa' ? 'سبد خرید' : 'Cart'}</span>
        </button>

        {/* Account */}
        <button
          onClick={() => {
            setActiveTab('account');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 p-1 min-w-[56px] min-h-[44px] justify-center transition-colors cursor-pointer ${
            activeTab === 'account'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">{lang === 'fa' ? 'پروفایل' : 'Account'}</span>
        </button>
      </div>
    </nav>
  );
};
