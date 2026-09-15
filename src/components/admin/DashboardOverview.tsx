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
  Plus
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
          <div key={i} className="h-28 rounded-3xl bg-slate-200 dark:bg-slate-800" />
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
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>گزارش زنده وضعیت فروشگاه</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">داشبورد جامع مدیریت لومینا استور</h1>
          <p className="text-xs text-indigo-200/90 leading-relaxed">
            تمامی آمارهای کاربران، فروش لحظه‌ای، پردازش مرسولات و موجودی انبار به صورت متمرکز از دیتابیس دریافت می‌شوند.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 relative z-10">
          <button
            onClick={() => onNavigateTab('products')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-900 text-xs font-bold shadow-lg hover:bg-indigo-50 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن محصول جدید</span>
          </button>
          <button
            onClick={() => onNavigateTab('charts')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold backdrop-blur-xs transition-all"
          >
            <TrendingUp className="w-4 h-4" />
            <span>مشاهده نمودارهای تحلیلی</span>
          </button>
        </div>
      </div>

      {/* 1. درآمد و فروش (Sales & Revenue Cards) */}
      <div className="space-y-3">
        <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-500" />
          <span>آمار مالی و فروش</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Revenue */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold">درآمد کل فروشگاه</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {formatTomans(stats.totalRevenue)}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{stats.revenueChangeWeek}٪ افزایش نسبت به هفته قبل</span>
            </div>
          </div>

          {/* Sales Today */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold">فروش امروز</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {formatTomans(stats.salesToday)}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">به‌روزرسانی در لحظه</div>
          </div>

          {/* Sales This Week */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold">فروش این هفته</span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-[#E80645] dark:text-rose-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {formatTomans(stats.salesWeek)}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">۷ روز گذشته</div>
          </div>

          {/* Sales This Month */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold">فروش این ماه</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {formatTomans(stats.salesMonth)}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">۳۰ روز گذشته</div>
          </div>
        </div>
      </div>

      {/* 2. سفارش‌ها (Orders Cards) */}
      <div className="space-y-3">
        <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-indigo-500" />
          <span>آمار سفارش‌ها</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400">تعداد کل سفارش‌ها</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {formatNumber(stats.totalOrders)}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{stats.ordersChangeWeek}٪ رشد هفتگی</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400">سفارش‌های امروز</span>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {formatNumber(stats.ordersToday)}
            </div>
            <span className="text-[11px] text-slate-400">ثبت‌شده تا این لحظه</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400">سفارش‌های این هفته</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {formatNumber(stats.ordersWeek)}
            </div>
            <span className="text-[11px] text-slate-400">میانگین روزانه: {formatNumber(Math.round(stats.ordersWeek / 7))}</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400">سفارش‌های این ماه</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {formatNumber(stats.ordersMonth)}
            </div>
            <span className="text-[11px] text-slate-400">نرخ تحقق: ۹۴٪</span>
          </div>
        </div>
      </div>

      {/* 3. کاربران (Users Cards) */}
      <div className="space-y-3">
        <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Users className="w-4 h-4 text-[#E80645]" />
          <span>آمار کاربران و مخاطبان</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400">تعداد کل کاربران</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {formatNumber(stats.totalUsers)}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{stats.usersChangeWeek}٪ رشد هفتگی</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400">کاربران جدید امروز</span>
            <div className="text-2xl font-black text-[#E80645] dark:text-rose-400">
              {formatNumber(stats.newUsersToday)}
            </div>
            <span className="text-[11px] text-slate-400">ثبت‌نام مستقیم</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400">کاربران جدید این هفته</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {formatNumber(stats.newUsersWeek)}
            </div>
            <span className="text-[11px] text-slate-400">مشتریان پیوسته</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400">کاربران جدید این ماه</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {formatNumber(stats.newUsersMonth)}
            </div>
            <span className="text-[11px] text-slate-400">۳۰ روز اخیر</span>
          </div>
        </div>
      </div>

      {/* 4. محصولات و انبار + بازدیدها (Products & Visits) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products Stock Overview */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-500" />
              <span>وضعیت انبار و کاتالوگ محصولات</span>
            </h3>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              مدیریت کالاها
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <span className="text-xs text-slate-400 font-medium">کل محصولات</span>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {formatNumber(stats.totalProducts)}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 text-center">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">محصولات فعال</span>
              <div className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
                {formatNumber(stats.activeProducts)}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 text-center">
              <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">ناموجود در انبار</span>
              <div className="text-xl font-black text-rose-700 dark:text-rose-300 mt-1">
                {formatNumber(stats.outOfStockProducts)}
              </div>
            </div>
          </div>

          {stats.lowStockProducts > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs text-amber-800 dark:text-amber-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{stats.lowStockProducts} محصول با موجودی کمتر از ۵ عدد (هشدار تامین موجودی)</span>
              </div>
              <button
                onClick={() => onNavigateTab('products')}
                className="font-bold underline shrink-0"
              >
                مشاهده
              </button>
            </div>
          )}
        </div>

        {/* Visits Overview */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-500" />
              <span>ترافیک و بازدید سایت</span>
            </h3>
            <button
              onClick={() => onNavigateTab('behavior')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              تحلیل رفتار
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <span className="text-xs text-slate-400 font-medium">بازدید امروز</span>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {formatNumber(stats.visitsToday)}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <span className="text-xs text-slate-400 font-medium">بازدید هفته</span>
              <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {formatNumber(stats.visitsWeek)}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <span className="text-xs text-slate-400 font-medium">بازدید ماه</span>
              <div className="text-xl font-black text-purple-600 dark:text-purple-400 mt-1">
                {formatNumber(stats.visitsMonth)}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-200">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>ترافیک سایت {stats.visitsChangeWeek}٪ نسبت به ماه پیش افزایش یافته است.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. آخرین سفارش‌های ثبت‌شده (Recent Orders Snapshot) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">آخرین سفارش‌های دریافتی</h3>
            <p className="text-xs text-slate-400 mt-0.5">سفارش‌های جدید نیازمند بررسی و تایید وضعیت</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
          >
            <span>مشاهده همه سفارش‌ها</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold">
                <th className="pb-3 pr-2">شناسه سفارش</th>
                <th className="pb-3">مشتری</th>
                <th className="pb-3">تاریخ و ساعت</th>
                <th className="pb-3">مبلغ کل</th>
                <th className="pb-3">روش پرداخت</th>
                <th className="pb-3">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {recentOrders.slice(0, 5).map(o => (
                <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 pr-2 font-black text-slate-900 dark:text-white">{o.id}</td>
                  <td className="py-3.5 text-slate-700 dark:text-slate-300">{o.customer?.name || 'مشتری'}</td>
                  <td className="py-3.5 text-slate-400">{o.date}</td>
                  <td className="py-3.5 font-bold text-indigo-600 dark:text-indigo-400">
                    {formatTomans(o.total)}
                  </td>
                  <td className="py-3.5 text-slate-500">{o.paymentMethod}</td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        o.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                          : o.status === 'processing'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                          : o.status === 'paid'
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400'
                          : o.status === 'shipped'
                          ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
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
