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
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Top Banner & Quick Actions */}
      <div className="rounded-2xl bg-[#121215] border border-zinc-800 text-white p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#62DB00]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#62DB00]/15 text-[#62DB00] border border-[#62DB00]/30 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LIVE STORE TELEMETRY</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">داشبورد جامع مدیریت لومینا استور</h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            تمامی آمارهای مالی، سفارش‌های ورودی، پردازش مرسولات و وضعیت انبار به صورت بلادرنگ مانیتور می‌شوند.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 relative z-10">
          <button
            onClick={() => onNavigateTab('products')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#62DB00] hover:bg-[#52B800] text-black text-xs font-black transition-all cursor-pointer shadow-sm shadow-[#62DB00]/20"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن محصول جدید</span>
          </button>
          <button
            onClick={() => onNavigateTab('charts')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-white text-xs font-bold transition-all cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-[#62DB00]" />
            <span>نمودارهای تحلیلی</span>
          </button>
        </div>
      </div>

      {/* 1. درآمد و فروش (Sales & Revenue Cards) */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-2">
          <DollarSign className="w-3.5 h-3.5 text-[#62DB00]" />
          <span>آمار مالی و فروش</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Revenue */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold">درآمد کل فروشگاه</span>
              <div className="w-8 h-8 rounded-xl bg-[#62DB00]/10 text-[#62DB00] flex items-center justify-center border border-[#62DB00]/20">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-zinc-900 dark:text-white">
              {formatTomans(stats.totalRevenue)}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#62DB00] font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{stats.revenueChangeWeek}٪ رشد هفتگی</span>
            </div>
          </div>

          {/* Sales Today */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold">فروش امروز</span>
              <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-zinc-900 dark:text-white">
              {formatTomans(stats.salesToday)}
            </div>
            <div className="text-[11px] text-zinc-400 font-medium">به‌روزرسانی در لحظه</div>
          </div>

          {/* Sales This Week */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold">فروش این هفته</span>
              <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-zinc-900 dark:text-white">
              {formatTomans(stats.salesWeek)}
            </div>
            <div className="text-[11px] text-zinc-400 font-medium">۷ روز گذشته</div>
          </div>

          {/* Sales This Month */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold">فروش این ماه</span>
              <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-zinc-900 dark:text-white">
              {formatTomans(stats.salesMonth)}
            </div>
            <div className="text-[11px] text-zinc-400 font-medium">۳۰ روز گذشته</div>
          </div>
        </div>
      </div>

      {/* 2. سفارش‌ها (Orders Cards) */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-2">
          <ShoppingBag className="w-3.5 h-3.5 text-[#62DB00]" />
          <span>آمار سفارش‌ها</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-2">
            <span className="text-xs font-bold text-zinc-400">تعداد کل سفارش‌ها</span>
            <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono">
              {formatNumber(stats.totalOrders)}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#62DB00] font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{stats.ordersChangeWeek}٪ رشد هفتگی</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-2">
            <span className="text-xs font-bold text-zinc-400">سفارش‌های امروز</span>
            <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono">
              {formatNumber(stats.ordersToday)}
            </div>
            <span className="text-[11px] text-zinc-400">ثبت‌شده تا این لحظه</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-2">
            <span className="text-xs font-bold text-zinc-400">سفارش‌های این هفته</span>
            <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono">
              {formatNumber(stats.ordersWeek)}
            </div>
            <span className="text-[11px] text-zinc-400">میانگین روزانه: {formatNumber(Math.round(stats.ordersWeek / 7))}</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-2">
            <span className="text-xs font-bold text-zinc-400">سفارش‌های این ماه</span>
            <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono">
              {formatNumber(stats.ordersMonth)}
            </div>
            <span className="text-[11px] text-zinc-400">نرخ تکمیل: ۹۵٪</span>
          </div>
        </div>
      </div>

      {/* 3. کاربران (Users Cards) */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-[#62DB00]" />
          <span>آمار مشتریان و کاربران</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-2">
            <span className="text-xs font-bold text-zinc-400">تعداد کل مشتریان</span>
            <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono">
              {formatNumber(stats.totalUsers)}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#62DB00] font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{stats.usersChangeWeek}٪ رشد هفتگی</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-2">
            <span className="text-xs font-bold text-zinc-400">ثبت‌نام امروز</span>
            <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono">
              {formatNumber(stats.newUsersToday)}
            </div>
            <span className="text-[11px] text-zinc-400">کاربران احراز هویت شده</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-2">
            <span className="text-xs font-bold text-zinc-400">کاربران جدید این هفته</span>
            <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono">
              {formatNumber(stats.newUsersWeek)}
            </div>
            <span className="text-[11px] text-zinc-400">مشتریان پیوسته</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-2">
            <span className="text-xs font-bold text-zinc-400">کاربران جدید این ماه</span>
            <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono">
              {formatNumber(stats.newUsersMonth)}
            </div>
            <span className="text-[11px] text-zinc-400">۳۰ روز اخیر</span>
          </div>
        </div>
      </div>

      {/* 4. محصولات و انبار + ترافیک سایت */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products Stock Overview */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-500" />
              <span>وضعیت انبار و کاتالوگ محصولات</span>
            </h3>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs text-[#62DB00] font-bold hover:underline cursor-pointer"
            >
              مدیریت کالاها
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-center">
              <span className="text-xs text-zinc-400 font-medium">کل محصولات</span>
              <div className="text-xl font-black text-zinc-900 dark:text-white mt-1 font-mono">
                {formatNumber(stats.totalProducts)}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#62DB00]/10 border border-[#62DB00]/25 text-center">
              <span className="text-xs text-[#62DB00] font-medium">محصولات فعال</span>
              <div className="text-xl font-black text-[#62DB00] mt-1 font-mono">
                {formatNumber(stats.activeProducts)}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
              <span className="text-xs text-rose-400 font-medium">اتمام موجودی</span>
              <div className="text-xl font-black text-rose-400 mt-1 font-mono">
                {formatNumber(stats.outOfStockProducts)}
              </div>
            </div>
          </div>

          {stats.lowStockProducts > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-xs text-amber-300">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{stats.lowStockProducts} محصول با موجودی کمتر از ۵ عدد (هشدار تامین فوری)</span>
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
        <div className="p-6 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
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

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-center">
              <span className="text-xs text-zinc-400 font-medium">بازدید امروز</span>
              <div className="text-xl font-black text-zinc-900 dark:text-white mt-1 font-mono">
                {formatNumber(stats.visitsToday)}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-center">
              <span className="text-xs text-zinc-400 font-medium">بازدید هفته</span>
              <div className="text-xl font-black text-zinc-900 dark:text-white mt-1 font-mono">
                {formatNumber(stats.visitsWeek)}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-center">
              <span className="text-xs text-zinc-400 font-medium">بازدید ماه</span>
              <div className="text-xl font-black text-zinc-900 dark:text-white mt-1 font-mono">
                {formatNumber(stats.visitsMonth)}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#62DB00]" />
              <span>ترافیک فروشگاه {stats.visitsChangeWeek}٪ نسبت به ماه قبل افزایش داشته است.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. آخرین سفارش‌های ثبت‌شده (Recent Orders Snapshot) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-zinc-900 dark:text-white">آخرین سفارش‌های دریافتی</h3>
            <p className="text-xs text-zinc-400 mt-0.5">سفارش‌های جدید نیازمند بررسی و آماده‌سازی مرسوله</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs text-[#62DB00] font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>مشاهده همه سفارش‌ها</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
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
