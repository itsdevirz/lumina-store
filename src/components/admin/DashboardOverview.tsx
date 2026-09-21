import React from 'react';
import {
  Users,
  UserPlus,
  ShoppingBag,
  DollarSign,
  Package,
  Eye,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  ChevronLeft,
  Sparkles,
  Plus,
  Activity,
  Boxes
} from 'lucide-react';
import { DashboardStats } from '../../types/admin';
import { AdminTab } from './AdminSidebar';

interface DashboardOverviewProps {
  stats: DashboardStats | null;
  onNavigateTab: (tab: AdminTab) => void;
  recentOrders: any[];
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  onNavigateTab,
  recentOrders
}) => {
  if (!stats) {
    return (
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="h-28 rounded-2xl bg-zinc-200 dark:bg-zinc-800/80" />
        ))}
      </div>
    );
  }

  const formatTomans = (num: number) => {
    return (num || 0).toLocaleString('fa-IR') + ' تومان';
  };

  const formatNumber = (num: number) => {
    return (num || 0).toLocaleString('fa-IR');
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 p-3 sm:p-6 lg:p-8">
      {/* Top Banner & Quick Actions */}
      <div className="rounded-2xl bg-[#121215] border border-zinc-800 text-white p-4 sm:p-6 lg:p-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#62DB00]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

        <div className="space-y-1.5 sm:space-y-2 relative z-10 max-w-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-[#62DB00]/15 text-[#62DB00] border border-[#62DB00]/30 text-[10px] sm:text-xs font-mono font-bold">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>LIVE STORE TELEMETRY</span>
            </div>
            <button
              onClick={() => onNavigateTab('settings')}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 text-[10px] sm:text-xs font-mono transition-all cursor-pointer group"
              title="تنظیمات و وضعیت دیتابیس MySQL"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
              <span>MySQL: online_shop_db</span>
            </button>
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight">داشبورد جامع مدیریت لومینا استور</h1>
          <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
            تمامی آمارهای مالی، سفارش‌های ورودی، پردازش مرسولات و وضعیت انبار به صورت بلادرنگ مانیتور می‌شوند.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 relative z-10 w-full sm:w-auto">
          <button
            onClick={() => onNavigateTab('products')}
            className="flex items-center justify-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl bg-[#62DB00] hover:bg-[#52B800] text-black text-xs font-black transition-all cursor-pointer shadow-sm shadow-[#62DB00]/20"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن محصول جدید</span>
          </button>
          <button
            onClick={() => onNavigateTab('charts')}
            className="flex items-center justify-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-white text-xs font-bold transition-all cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-[#62DB00]" />
            <span>نمودارهای تحلیلی</span>
          </button>
        </div>
      </div>

      {/* 1. درآمد و فروش (Sales & Revenue Cards) */}
      <div className="space-y-2.5 sm:space-y-3">
        <h2 className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-2">
          <DollarSign className="w-3.5 h-3.5 text-[#62DB00]" />
          <span>آمار مالی و فروش</span>
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {/* Total Revenue */}
          <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] sm:text-xs font-bold truncate">درآمد کل فروشگاه</span>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#62DB00]/10 text-[#62DB00] flex items-center justify-center border border-[#62DB00]/20 shrink-0">
                <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="text-sm sm:text-lg lg:text-xl font-black text-zinc-900 dark:text-white leading-tight">
              {formatTomans(stats.totalRevenue)}
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] text-[#62DB00] font-bold">
              <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">{stats.revenueChangeWeek}٪ رشد هفتگی</span>
            </div>
          </div>

          {/* Sales Today */}
          <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] sm:text-xs font-bold truncate">فروش امروز</span>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center shrink-0">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="text-sm sm:text-lg lg:text-xl font-black text-zinc-900 dark:text-white leading-tight">
              {formatTomans(stats.salesToday)}
            </div>
            <div className="text-[10px] sm:text-[11px] text-zinc-400 font-medium truncate">به‌روزرسانی لحظه‌ای</div>
          </div>

          {/* Sales This Week */}
          <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] sm:text-xs font-bold truncate">فروش این هفته</span>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center shrink-0">
                <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="text-sm sm:text-lg lg:text-xl font-black text-zinc-900 dark:text-white leading-tight">
              {formatTomans(stats.salesWeek)}
            </div>
            <div className="text-[10px] sm:text-[11px] text-zinc-400 font-medium truncate">۷ روز گذشته</div>
          </div>

          {/* Sales This Month */}
          <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] sm:text-xs font-bold truncate">فروش این ماه</span>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center shrink-0">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="text-sm sm:text-lg lg:text-xl font-black text-zinc-900 dark:text-white leading-tight">
              {formatTomans(stats.salesMonth)}
            </div>
            <div className="text-[10px] sm:text-[11px] text-zinc-400 font-medium truncate">۳۰ روز گذشته</div>
          </div>
        </div>
      </div>

      {/* 2. سفارش‌ها (Orders Cards) */}
      <div className="space-y-2.5 sm:space-y-3">
        <h2 className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-2">
          <ShoppingBag className="w-3.5 h-3.5 text-[#62DB00]" />
          <span>آمار سفارش‌ها</span>
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-1.5 sm:space-y-2">
            <span className="text-[11px] sm:text-xs font-bold text-zinc-400 truncate block">کل سفارش‌ها</span>
            <div className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white font-mono">
              {formatNumber(stats.totalOrders)}
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] text-[#62DB00] font-bold">
              <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">{stats.ordersChangeWeek}٪ رشد</span>
            </div>
          </div>

          <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-1.5 sm:space-y-2">
            <span className="text-[11px] sm:text-xs font-bold text-zinc-400 truncate block">سفارش امروز</span>
            <div className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white font-mono">
              {formatNumber(stats.ordersToday)}
            </div>
            <span className="text-[10px] sm:text-[11px] text-zinc-400 truncate block">تا این لحظه</span>
          </div>

          <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-1.5 sm:space-y-2">
            <span className="text-[11px] sm:text-xs font-bold text-zinc-400 truncate block">سفارش این هفته</span>
            <div className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white font-mono">
              {formatNumber(stats.ordersWeek)}
            </div>
            <span className="text-[10px] sm:text-[11px] text-zinc-400 truncate block">میانگین: {formatNumber(Math.round(stats.ordersWeek / 7))} روزانه</span>
          </div>

          <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-1.5 sm:space-y-2">
            <span className="text-[11px] sm:text-xs font-bold text-zinc-400 truncate block">سفارش این ماه</span>
            <div className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white font-mono">
              {formatNumber(stats.ordersMonth)}
            </div>
            <span className="text-[10px] sm:text-[11px] text-zinc-400 truncate block">نرخ تکمیل: ۹۵٪</span>
          </div>
        </div>
      </div>

      {/* 3. کاربران (Users Cards) */}
      <div className="space-y-2.5 sm:space-y-3">
        <h2 className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-[#62DB00]" />
          <span>آمار مشتریان و کاربران</span>
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-1.5 sm:space-y-2">
            <span className="text-[11px] sm:text-xs font-bold text-zinc-400 truncate block">کل مشتریان</span>
            <div className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white font-mono">
              {formatNumber(stats.totalUsers)}
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] text-[#62DB00] font-bold">
              <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">{stats.usersChangeWeek}٪ رشد</span>
            </div>
          </div>

          <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-1.5 sm:space-y-2">
            <span className="text-[11px] sm:text-xs font-bold text-zinc-400 truncate block">ثبت‌نام امروز</span>
            <div className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white font-mono">
              {formatNumber(stats.newUsersToday)}
            </div>
            <span className="text-[10px] sm:text-[11px] text-zinc-400 truncate block">احراز هویت شده</span>
          </div>

          <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-1.5 sm:space-y-2">
            <span className="text-[11px] sm:text-xs font-bold text-zinc-400 truncate block">کاربر جدید هفته</span>
            <div className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white font-mono">
              {formatNumber(stats.newUsersWeek)}
            </div>
            <span className="text-[10px] sm:text-[11px] text-zinc-400 truncate block">مشتریان پیوسته</span>
          </div>

          <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-1.5 sm:space-y-2">
            <span className="text-[11px] sm:text-xs font-bold text-zinc-400 truncate block">کاربر جدید ماه</span>
            <div className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white font-mono">
              {formatNumber(stats.newUsersMonth)}
            </div>
            <span className="text-[10px] sm:text-[11px] text-zinc-400 truncate block">۳۰ روز اخیر</span>
          </div>
        </div>
      </div>

      {/* 4. محصولات و انبار + ترافیک سایت */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Products Stock Overview */}
        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-500" />
              <span>وضعیت انبار و کاتالوگ</span>
            </h3>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs text-[#62DB00] font-bold hover:underline cursor-pointer"
            >
              مدیریت کالاها
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
            <div className="p-2.5 sm:p-4 rounded-lg sm:rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-center">
              <span className="text-[10px] sm:text-xs text-zinc-400 font-medium truncate block">کل محصولات</span>
              <div className="text-base sm:text-xl font-black text-zinc-900 dark:text-white mt-1 font-mono">
                {formatNumber(stats.totalProducts)}
              </div>
            </div>
            <div className="p-2.5 sm:p-4 rounded-lg sm:rounded-xl bg-[#62DB00]/10 border border-[#62DB00]/25 text-center">
              <span className="text-[10px] sm:text-xs text-[#62DB00] font-medium truncate block">محصولات فعال</span>
              <div className="text-base sm:text-xl font-black text-[#62DB00] mt-1 font-mono">
                {formatNumber(stats.activeProducts)}
              </div>
            </div>
            <div className="p-2.5 sm:p-4 rounded-lg sm:rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
              <span className="text-[10px] sm:text-xs text-rose-400 font-medium truncate block">اتمام موجودی</span>
              <div className="text-base sm:text-xl font-black text-rose-400 mt-1 font-mono">
                {formatNumber(stats.outOfStockProducts)}
              </div>
            </div>
          </div>

          {stats.lowStockProducts > 0 && (
            <div className="p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-[11px] sm:text-xs text-amber-300 gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">{stats.lowStockProducts} محصول با موجودی کمتر از ۵ عدد</span>
              </div>
              <button
                onClick={() => onNavigateTab('products')}
                className="font-bold underline shrink-0 cursor-pointer text-amber-400"
              >
                مشاهده
              </button>
            </div>
          )}
        </div>

        {/* Visits Overview */}
        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#62DB00]" />
              <span>ترافیک و بازدید سایت</span>
            </h3>
            <button
              onClick={() => onNavigateTab('behavior')}
              className="text-xs text-[#62DB00] font-bold hover:underline cursor-pointer"
            >
              تحلیل رفتار
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
            <div className="p-2.5 sm:p-4 rounded-lg sm:rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-center">
              <span className="text-[10px] sm:text-xs text-zinc-400 font-medium truncate block">امروز</span>
              <div className="text-base sm:text-xl font-black text-zinc-900 dark:text-white mt-1 font-mono">
                {formatNumber(stats.visitsToday)}
              </div>
            </div>
            <div className="p-2.5 sm:p-4 rounded-lg sm:rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-center">
              <span className="text-[10px] sm:text-xs text-zinc-400 font-medium truncate block">هفته</span>
              <div className="text-base sm:text-xl font-black text-zinc-900 dark:text-white mt-1 font-mono">
                {formatNumber(stats.visitsWeek)}
              </div>
            </div>
            <div className="p-2.5 sm:p-4 rounded-lg sm:rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-center">
              <span className="text-[10px] sm:text-xs text-zinc-400 font-medium truncate block">ماه</span>
              <div className="text-base sm:text-xl font-black text-zinc-900 dark:text-white mt-1 font-mono">
                {formatNumber(stats.visitsMonth)}
              </div>
            </div>
          </div>

          <div className="p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] sm:text-xs text-zinc-400">
            <div className="flex items-center gap-1.5 sm:gap-2 truncate">
              <TrendingUp className="w-4 h-4 text-[#62DB00] shrink-0" />
              <span className="truncate">رشد {stats.visitsChangeWeek}٪ نسبت به ماه گذشته</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. آخرین سفارش‌های ثبت‌شده (Recent Orders Snapshot) */}
      <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white">آخرین سفارش‌های دریافتی</h3>
            <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">نیازمند بررسی و آماده‌سازی مرسوله</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs text-[#62DB00] font-bold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>همه سفارش‌ها</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile View: Clean Card List */}
        <div className="block md:hidden space-y-2.5">
          {recentOrders.slice(0, 5).map(o => (
            <div
              key={o.id}
              onClick={() => onNavigateTab('orders')}
              className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 space-y-2 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-zinc-900 dark:text-white">{o.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                      o.status === 'delivered'
                        ? 'bg-[#62DB00]/15 text-[#62DB00] border border-[#62DB00]/30'
                        : o.status === 'processing'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : o.status === 'paid'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : o.status === 'shipped'
                        ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {o.statusFa || o.status}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">{o.date || o.createdAt?.split('T')[0]}</span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-200/60 dark:border-zinc-800/60">
                <span className="text-zinc-600 dark:text-zinc-300 font-medium truncate max-w-[150px]">
                  {o.customer?.name || o.customerName || 'مشتری'}
                </span>
                <span className="font-bold text-zinc-900 dark:text-white font-mono">
                  {formatTomans(o.total || o.totalAmount)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Full Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold">
                <th className="pb-3 pr-2 font-mono">شناسه</th>
                <th className="pb-3">مشتری</th>
                <th className="pb-3">تاریخ و ساعت</th>
                <th className="pb-3">مبلغ کل</th>
                <th className="pb-3">روش پرداخت</th>
                <th className="pb-3">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-medium">
              {recentOrders.slice(0, 5).map(o => (
                <tr key={o.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3.5 pr-2 font-mono font-bold text-zinc-900 dark:text-white">{o.id}</td>
                  <td className="py-3.5 text-zinc-700 dark:text-zinc-300">{o.customer?.name || o.customerName || 'مشتری'}</td>
                  <td className="py-3.5 text-zinc-400 font-mono text-[11px]">{o.date || o.createdAt?.split('T')[0]}</td>
                  <td className="py-3.5 font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                    {formatTomans(o.total || o.totalAmount)}
                  </td>
                  <td className="py-3.5 text-zinc-500">{o.paymentMethod || 'درگاه بانکی شتاب'}</td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        o.status === 'delivered'
                          ? 'bg-[#62DB00]/15 text-[#62DB00] border border-[#62DB00]/30'
                          : o.status === 'processing'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : o.status === 'paid'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : o.status === 'shipped'
                          ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {o.statusFa || o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
