import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  ExternalLink,
  Check,
  CheckCheck,
  User,
  LogOut,
  AlertTriangle,
  Package,
  ShoppingBag
} from 'lucide-react';
import { AdminNotification, AdminUser } from '../../types/admin';

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
  adminUser: AdminUser | null;
  onLogout: () => void;
  onViewStore: () => void;
  notifications: AdminNotification[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllRead: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleMobileMenu,
  adminUser,
  onLogout,
  onViewStore,
  notifications,
  onMarkNotificationRead,
  onMarkAllRead,
  searchQuery,
  setSearchQuery,
  theme,
  onToggleTheme
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-[#09090B]/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
      {/* Right side: Mobile Menu Button & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="جستجو در سفارش‌ها، کالاها..."
            className="w-full pr-8 sm:pr-9 pl-3 sm:pl-4 py-1.5 sm:py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:border-[#62DB00] focus:ring-1 focus:ring-[#62DB00] transition-all"
          />
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 absolute right-2.5 sm:right-3 top-2 sm:top-2.5" />
        </div>
      </div>

      {/* Left side actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Storefront live view button */}
        <button
          onClick={onViewStore}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:border-[#62DB00] hover:text-[#62DB00] transition-all cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#62DB00]" />
          <span>ویترین فروشگاه</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}
          className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 relative transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#62DB00] text-black rounded-full text-[9px] font-black flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/40 sm:hidden"
                onClick={() => setIsNotifOpen(false)}
              />
              <div className="fixed inset-x-3 top-14 sm:absolute sm:inset-x-auto sm:left-0 sm:top-full mt-1 sm:mt-2 w-auto sm:w-96 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-zinc-900 dark:text-white">اعلان‌های سیستم</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-[#62DB00]/15 text-[#62DB00] border border-[#62DB00]/30 font-bold px-2 py-0.5 rounded-full font-mono">
                        {unreadCount} جدید
                      </span>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllRead}
                      className="text-[11px] text-[#62DB00] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>خواندن همه</span>
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60 my-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-zinc-400">اعلانی وجود ندارد.</div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => onMarkNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl cursor-pointer transition-colors flex items-start gap-2.5 ${
                          n.read
                            ? 'opacity-65 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                            : 'bg-zinc-100/70 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                        }`}
                      >
                        <div className="mt-0.5 p-1.5 rounded-lg bg-zinc-200/80 dark:bg-zinc-800 shrink-0">
                          {n.type === 'order' && <ShoppingBag className="w-3.5 h-3.5 text-[#62DB00]" />}
                          {n.type === 'stock' && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                          {n.type === 'user' && <User className="w-3.5 h-3.5 text-emerald-500" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{n.title}</p>
                            <span className="text-[10px] text-zinc-400 font-mono">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-0.5">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <img
              src={adminUser?.avatar || '/images/products/photo-1534528741775-53994a69daeb.jpg'}
              alt=""
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-zinc-300 dark:ring-zinc-700 shrink-0"
            />
            <span className="hidden md:inline text-xs font-bold text-zinc-700 dark:text-zinc-200">
              {adminUser?.name || 'مدیر لومینا'}
            </span>
          </button>

          {isProfileOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/40 sm:hidden"
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-2 border-b border-zinc-100 dark:border-zinc-800">
                  <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{adminUser?.name}</p>
                  <p className="text-[10px] text-zinc-400 truncate font-mono">{adminUser?.email}</p>
                </div>

                <div className="py-1 space-y-1">
                  <button
                    onClick={onViewStore}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#62DB00]" />
                    <span>مشاهده فروشگاه</span>
                  </button>

                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-500 hover:bg-rose-500/10 font-bold cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>خروج از حساب مدیریت</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
