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
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Right side: Mobile Menu Button & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="جستجوی سریع محصولات، سفارش‌ها، کاربران..."
            className="w-full pr-9 pl-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
        </div>
      </div>

      {/* Left side actions */}
      <div className="flex items-center gap-2">
        {/* Storefront live view button */}
        <button
          onClick={onViewStore}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5 text-emerald-500" />
          <span>مشاهده فروشگاه</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute left-0 sm:right-auto mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900 dark:text-white">اعلان‌های سیستم</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} خوانده نشده
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllRead}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>خواندن همه</span>
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 my-1">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">اعلانی وجود ندارد.</div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => onMarkNotificationRead(n.id)}
                      className={`p-2.5 rounded-xl cursor-pointer transition-colors flex items-start gap-2.5 ${
                        n.read
                          ? 'opacity-70 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          : 'bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-50 dark:hover:bg-indigo-950/50'
                      }`}
                    >
                      <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                        {n.type === 'order' && <ShoppingBag className="w-3.5 h-3.5 text-indigo-500" />}
                        {n.type === 'stock' && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                        {n.type === 'user' && <User className="w-3.5 h-3.5 text-emerald-500" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{n.title}</p>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2 p-1 pl-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={adminUser?.avatar || '/images/products/photo-1534528741775-53994a69daeb.jpg'}
              alt=""
              className="w-7 h-7 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <span className="hidden md:inline text-xs font-bold text-slate-700 dark:text-slate-200">
              {adminUser?.name || 'مدیر لومینا'}
            </span>
          </button>

          {isProfileOpen && (
            <div className="absolute left-0 mt-2 w-52 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50">
              <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{adminUser?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{adminUser?.email}</p>
              </div>

              <div className="py-1 space-y-1">
                <button
                  onClick={onViewStore}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-500" />
                  <span>مشاهده فروشگاه</span>
                </button>

                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>خروج از حساب مدیریت</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
