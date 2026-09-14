import React, { useState, useEffect } from 'react';
import {
  Activity,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  ShoppingCart,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Radio,
  ExternalLink,
  Percent
} from 'lucide-react';
import { UserBehaviorData } from '../../types/admin';

export const UserBehaviorView: React.FC = () => {
  const [data, setData] = useState<UserBehaviorData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchBehaviorData();
  }, []);

  const fetchBehaviorData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/analytics/visitor-behavior');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching behavior data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return (num || 0).toLocaleString('fa-IR');
  };

  if (!data) {
    return (
      <div className="p-8 text-center text-xs text-slate-400">
        در حال واکشی آمار رفتار کاربران...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans">
      {/* View Header with Online Pulse */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            تحلیل رفتار کاربران و مخاطبان
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            ردیابی کاربران آنلاین، صفحات پربازدید، دستگاه‌ها و قیف تبدیل سبد خرید
          </p>
        </div>

        {/* Live Online Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <Radio className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{formatNumber(data.onlineUsers)} کاربر هم‌اکنون آنلاین در سایت</span>
        </div>
      </div>

      {/* Conversion Funnel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400">افزودن به سبد خرید</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {formatNumber(data.cartAdditions)} بار
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>نقطه آغاز تصمیم به خرید</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400">خریدهای نهایی موفق</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatNumber(data.successfulPurchases)} سفارش
          </div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>تسویه‌حساب موفق شاپرک</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400">نرخ رها کردن سبد خرید</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {data.abandonmentRate}٪
          </div>
          <div className="text-[11px] text-amber-600 font-bold flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>سبدهای خرید تکمیل‌نشده</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400">نرخ کلی تبدیل بازدید به خرید</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {data.conversionRate}٪
          </div>
          <div className="text-[11px] text-indigo-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>بالاتر از میانگین صنعت (۲.۵٪)</span>
          </div>
        </div>
      </div>

      {/* Traffic Sources & Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            <span>منابع ترافیک و مبدا ورودی کاربران</span>
          </h3>

          <div className="space-y-3">
            {data.trafficSources.map((source, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-800 dark:text-slate-200">{source.name}</span>
                  <span className="text-slate-500">
                    {source.percent}٪ ({formatNumber(source.visits)} بازدید)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${source.percent}%`, backgroundColor: source.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Devices */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-indigo-500" />
            <span>توزیع دستگاه‌های کاربران</span>
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {data.devices.map((d, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center space-y-1"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
                  {d.name.includes('Mobile') ? (
                    <Smartphone className="w-4 h-4" />
                  ) : d.name.includes('Tablet') ? (
                    <Tablet className="w-4 h-4" />
                  ) : (
                    <Monitor className="w-4 h-4" />
                  )}
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{d.name}</p>
                <div className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                  {d.percent}٪
                </div>
                <span className="text-[10px] text-slate-400">{formatNumber(d.count)} بازدید</span>
              </div>
            ))}
          </div>

          {/* Operating Systems & Browsers */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="font-bold text-slate-400 block mb-1">سیستم‌عامل‌ها:</span>
              <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                {data.operatingSystems.map((os, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{os.name}</span>
                    <span className="font-bold">{os.percent}٪</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-bold text-slate-400 block mb-1">مرورگرها:</span>
              <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                {data.browsers.map((b, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{b.name}</span>
                    <span className="font-bold">{b.percent}٪</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Top Landing Pages Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-slate-900 dark:text-white">
          صفحات پربازدید و نرخ پرش (Bounce Rate)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold">
                <th className="pb-3 pr-2">آدرس صفحه (URL)</th>
                <th className="pb-3">عنوان صفحه</th>
                <th className="pb-3">تعداد مشاهده (Pageviews)</th>
                <th className="pb-3">نرخ خروج لحظه‌ای (Bounce Rate)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {data.topPages.map((page, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 pr-2 font-mono text-indigo-600 dark:text-indigo-400">{page.path}</td>
                  <td className="py-3 text-slate-900 dark:text-white font-bold">{page.title}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{formatNumber(page.views)}</td>
                  <td className="py-3 text-slate-500">{page.bounceRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
