import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Package,
  TrendingUp,
  ShoppingBag,
  Users,
  Activity,
  FileSpreadsheet,
  Tag,
  Settings,
  LogOut,
  ExternalLink,
  ChevronLeft,
  X,
  ShieldCheck,
  Sparkles,
  Headset,
  MessageSquare
} from 'lucide-react';
import { AdminUser } from '../../types/admin';

export type AdminTab =
  | 'dashboard'
  | 'support-chat'
  | 'festivals'
  | 'reviews'
  | 'charts'
  | 'products'
  | 'bestsellers'
  | 'orders'
  | 'users'
  | 'behavior'
  | 'reports'
  | 'coupons'
  | 'settings';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  adminUser: AdminUser | null;
  onLogout: () => void;
  onViewStore: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  pendingOrdersCount?: number;
  lowStockCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onTabChange,
  adminUser,
  onLogout,
  onViewStore,
  isMobileOpen,
  setIsMobileOpen,
  pendingOrdersCount = 2,
  lowStockCount = 3
}) => {
  const menuItems = [
    { id: 'dashboard' as AdminTab, label: 'داشبورد اصلی', icon: LayoutDashboard },
    {
      id: 'support-chat' as AdminTab,
      label: 'چت پشتیبانی',
      icon: Headset,
      badge: 'زنده',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30'
    },
    {
      id: 'festivals' as AdminTab,
      label: 'جشنواره‌ها و کمپین‌ها',
      icon: Sparkles,
      badge: 'ویژه',
      badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30'
    },
    {
      id: 'reviews' as AdminTab,
      label: 'نظرات و امتیازات',
      icon: MessageSquare,
      badge: 'کاربران',
      badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30'
    },
    { id: 'charts' as AdminTab, label: 'نمودارهای آماری', icon: BarChart3 },
    {
      id: 'products' as AdminTab,
      label: 'مدیریت محصولات',
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} هشدار` : undefined,
      badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-500/20 dark:text-amber-400 dark:border-transparent'
    },
    { id: 'bestsellers' as AdminTab, label: 'محصولات پرفروش', icon: TrendingUp },
    {
      id: 'orders' as AdminTab,
      label: 'مدیریت سفارش‌ها',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} جدید` : undefined,
      badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-transparent'
    },
    { id: 'users' as AdminTab, label: 'مدیریت کاربران', icon: Users },
    { id: 'behavior' as AdminTab, label: 'تحلیل رفتار کاربران', icon: Activity },
    { id: 'reports' as AdminTab, label: 'گزارش‌های فروش', icon: FileSpreadsheet },
    { id: 'coupons' as AdminTab, label: 'تخفیف‌ها و کوپن‌ها', icon: Tag },
    { id: 'settings' as AdminTab, label: 'تنظیمات و پروفایل', icon: Settings }
  ];

  const handleSelectTab = (tab: AdminTab) => {
    onTabChange(tab);
    setIsMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-xs">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-sm text-slate-900 dark:text-white tracking-wide">لومینا پنل</h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">سیستم مدیریت متمرکز</p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge ? (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                    isActive ? 'bg-white/25 text-white' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              ) : (
                <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${isActive ? 'opacity-100' : 'opacity-0'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Storefront Link & Admin Profile */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <button
          onClick={onViewStore}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold border border-slate-200/80 dark:border-transparent transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <ExternalLink className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span>مشاهده فروشگاه</span>
          </div>
          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-md font-bold">
            Live
          </span>
        </button>

        {/* User Card */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={adminUser?.avatar || '/images/products/photo-1534528741775-53994a69daeb.jpg'}
              alt=""
              className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
            />
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{adminUser?.name || 'مدیر لومینا'}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-medium">{adminUser?.email || 'admin@store.ir'}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="خروج از پنل مدیریت"
            className="p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/20 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-72 max-w-[85vw] shadow-2xl z-10 animate-in slide-in-from-right duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
