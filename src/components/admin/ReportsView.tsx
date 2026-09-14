import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Layers,
  Package,
  TrendingUp,
  DollarSign,
  CheckCircle2
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [period, setPeriod] = useState('monthly');
  const [reportData, setReportData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [period]);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/reports/sales?period=${period}`);
      const data = await res.json();
      setReportData(data);
    } catch (err) {
      console.error('Error fetching report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!reportData?.csvData) return;
    setIsExporting(true);

    const blob = new Blob(['\uFEFF' + reportData.csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `lumina_sales_report_${period}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setIsExporting(false), 500);
  };

  const formatTomans = (num: number) => {
    return (num || 0).toLocaleString('fa-IR') + ' تومان';
  };

  const formatNumber = (num: number) => {
    return (num || 0).toLocaleString('fa-IR');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            گزارش‌های جامع مالی و عملکرد فروش
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            تهیه گزارش‌های تحلیلی، تفکیک دسته‌بندی‌ها و خروجی فایل اکسل (CSV)
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={handleDownloadCSV}
          disabled={isExporting || !reportData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'در حال خروجی...' : 'دریافت فایل اکسل (CSV)'}</span>
        </button>
      </div>

      {/* Period Selector Tabs */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span>بازه گزارش:</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'daily', label: 'روزانه (۲۴ ساعت گذشته)' },
            { id: 'weekly', label: 'هفتگی (۷ روز گذشته)' },
            { id: 'monthly', label: 'ماهانه (۳۰ روز گذشته)' },
            { id: 'annual', label: 'سالانه (عملکرد ۱ ساله)' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                period === p.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Financial Snapshot */}
      {reportData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400">فروش ناخالص دوره</span>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {formatTomans(reportData.totalRevenue + 4500000)}
            </div>
            <span className="text-[11px] text-slate-400">قبل از کسر تخفیف‌ها</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400">تخفیف‌های ارائه‌شده</span>
            <div className="text-xl font-black text-rose-600 dark:text-rose-400">
              - {formatTomans(4500000)}
            </div>
            <span className="text-[11px] text-slate-400">کوپن‌ها و حراج‌های ویژه</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400">فروش خالص وصول‌شده</span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {formatTomans(reportData.totalRevenue)}
            </div>
            <span className="text-[11px] text-slate-400">تراکنش‌های قطعی شاپرک</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400">سود ناخالص برآوردی (۳۵٪)</span>
            <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">
              {formatTomans(Math.round(reportData.totalRevenue * 0.35))}
            </div>
            <span className="text-[11px] text-slate-400">پس از کسر بهای تمام‌شده کالا</span>
          </div>
        </div>
      )}

      {/* Category Breakdown Table */}
      {reportData?.categoryBreakdown && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>تفکیک درآمد و سفارش‌ها بر اساس دسته‌بندی کالا</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold">
                  <th className="pb-3 pr-2">دسته‌بندی</th>
                  <th className="pb-3">تعداد اقلام فروخته‌شده</th>
                  <th className="pb-3">درآمد حاصله (تومان)</th>
                  <th className="pb-3 pl-2">سهم از کل درآمد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {reportData.categoryBreakdown.map((cat: any, idx: number) => {
                  const percent =
                    reportData.totalRevenue > 0
                      ? Math.round((cat.revenue / reportData.totalRevenue) * 100)
                      : 0;
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3 pr-2 font-bold text-slate-900 dark:text-white">{cat.nameFa}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">
                        {formatNumber(cat.ordersCount)} کالا
                      </td>
                      <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">
                        {formatTomans(cat.revenue)}
                      </td>
                      <td className="py-3 pl-2">
                        <div className="flex items-center gap-2 max-w-[120px]">
                          <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-slate-500">{percent}٪</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top 10 Products Breakdown for this report */}
      {reportData?.products && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-500" />
              <span>جزییات محصولات در این گزارش</span>
            </h3>
            <span className="text-xs text-slate-400">نمایش ۱۰ محصول پرفروش گزارش</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold">
                  <th className="pb-3 pr-2">کد SKU</th>
                  <th className="pb-3">نام محصول</th>
                  <th className="pb-3">دسته‌بندی</th>
                  <th className="pb-3">قیمت واحد</th>
                  <th className="pb-3">تعداد فروش</th>
                  <th className="pb-3">مجموع فروش</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {reportData.products.map((p: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 pr-2 font-mono text-slate-500">{p.sku}</td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">{p.nameFa}</td>
                    <td className="py-3 text-slate-500">{p.category}</td>
                    <td className="py-3 text-slate-700 dark:text-slate-300">{formatTomans(p.price)}</td>
                    <td className="py-3 font-bold text-indigo-600 dark:text-indigo-400">
                      {formatNumber(p.soldCount)} عدد
                    </td>
                    <td className="py-3 font-black text-emerald-600 dark:text-emerald-400">
                      {formatTomans(p.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
