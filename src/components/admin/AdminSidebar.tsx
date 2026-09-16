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
import { LuminaLogo } from '../LuminaLogo';

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
      label: 'چت پشتیبانی زنده',
      icon: Headset,
      badge: 'LIVE',
      badgeColor: 'bg-[#62DB00]/15 text-[#62DB00] border border-[#62DB00]/30 font-mono'
    },
    {
      id: 'festivals' as AdminTab,
      label: 'جشنواره‌ها و کمپین‌ها',
      icon: Sparkles,
      badge: 'ویژه',
      badgeColor: 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
    },
    {
      id: 'reviews' as AdminTab,
      label: 'نظرات و امتیازات',
      icon: MessageSquare,
      badge: 'کاربران',
      badgeColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
    },
    { id: 'charts' as AdminTab, label: 'نمودارهای تحلیلی', icon: BarChart3 },
    {
      id: 'products' as AdminTab,
      label: 'مدیریت محصولات',
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} هشدار` : undefined,
      badgeColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-mono'
    },
    { id: 'bestsellers' as AdminTab, label: 'محصولات پرفروش', icon: TrendingUp },
    {
      id: 'orders' as AdminTab,
      label: 'مدیریت سفارش‌ها',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} جدید` : undefined,
      badgeColor: 'bg-[#62DB00]/15 text-[#62DB00] border border-[#62DB00]/30 font-mono'
    },
    { id: 'users' as AdminTab, label: 'مدیریت کاربران', icon: Users },
    { id: 'behavior' as AdminTab, label: 'تحلیل رفتار کاربران', icon: Activity },
    { id: 'reports' as AdminTab, label: 'گزارش‌های مالی و فروش', icon: FileSpreadsheet },
    { id: 'coupons' as AdminTab, label: 'کدهای تخفیف و کوپن', icon: Tag },
    { id: 'settings' as AdminTab, label: 'تنظیمات و متادیتا', icon: Settings }
  ];

  const handleSelectTab = (tab: AdminTab) => {
    onTabChange(tab);
    setIsMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#09090B] border-l border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <LuminaLogo variant="full" size="sm" />
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[#62DB00]/10 text-[#62DB00] border border-[#62DB00]/25 font-bold">
            ADMIN
          </span>
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-colors cursor-pointer"
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
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#62DB00] dark:text-zinc-950' : 'text-zinc-400 dark:text-zinc-500'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge ? (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black font-bold'
                      : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              ) : (
                <ChevronLeft className={`w-3.5 h-3.5 transition-transform opacity-0 ${isActive ? 'opacity-100' : ''}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Storefront Link & Admin Profile */}
      <div className="p-3 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
        <button
          onClick={onViewStore}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white text-xs font-bold border border-zinc-200/80 dark:border-zinc-800 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-[#62DB00]" />
            <span>مشاهده ویترین فروشگاه</span>
          </div>
          <span className="text-[10px] bg-[#62DB00]/15 text-[#62DB00] border border-[#62DB00]/30 px-1.5 py-0.5 rounded font-mono font-bold">
            LIVE
          </span>
        </button>

        {/* User Card */}
        <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={adminUser?.avatar || '/images/products/photo-1534528741775-53994a69daeb.jpg'}
              alt=""
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-zinc-300 dark:ring-zinc-700 shrink-0"
            />
            <div className="truncate">
              <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{adminUser?.name || 'مدیر لومینا'}</p>
              <p className="text-[10px] text-zinc-400 truncate font-mono">{adminUser?.email || 'admin@store.ir'}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="خروج از پنل مدیریت"
            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
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
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30 select-none">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
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
