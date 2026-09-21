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
    <div className="p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 font-sans">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white">
              گزارش‌های جامع مالی و عملکرد فروش
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#62DB00]/15 text-[#62DB00] border border-[#62DB00]/30">
              REPORTS
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-400 mt-1">
            تهیه گزارش‌های تحلیلی، تفکیک دسته‌بندی‌ها و خروجی فایل اکسل (CSV)
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={handleDownloadCSV}
          disabled={isExporting || !reportData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#62DB00] hover:bg-[#52ba00] text-black text-xs font-black shadow-lg shadow-[#62DB00]/20 transition-all disabled:opacity-50 cursor-pointer"
        >
          <Download className="w-4 h-4 text-black" />
          <span>{isExporting ? 'در حال خروجی...' : 'دریافت فایل اکسل (CSV)'}</span>
        </button>
      </div>

      {/* Period Selector Tabs */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 dark:text-zinc-400">
          <Calendar className="w-4 h-4 text-[#62DB00]" />
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                period === p.id
                  ? 'bg-[#62DB00] text-black font-black shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Financial Snapshot */}
      {reportData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-2">
            <span className="text-xs font-bold text-zinc-400">فروش ناخالص دوره</span>
            <div className="text-xl font-black text-zinc-900 dark:text-white font-mono">
              {formatTomans(reportData.totalRevenue + 4500000)}
            </div>
            <span className="text-[11px] text-zinc-400">قبل از کسر تخفیف‌ها</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-2">
            <span className="text-xs font-bold text-zinc-400">تخفیف‌های ارائه‌شده</span>
            <div className="text-xl font-black text-rose-500 font-mono">
              - {formatTomans(4500000)}
            </div>
            <span className="text-[11px] text-zinc-400">کوپن‌ها و حراج‌های ویژه</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-2">
            <span className="text-xs font-bold text-zinc-400">فروش خالص وصول‌شده</span>
            <div className="text-xl font-black text-[#62DB00] font-mono">
              {formatTomans(reportData.totalRevenue)}
            </div>
            <span className="text-[11px] text-zinc-400">تراکنش‌های قطعی شاپرک</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-2">
            <span className="text-xs font-bold text-zinc-400">سود ناخالص برآوردی (۳۵٪)</span>
            <div className="text-xl font-black text-zinc-900 dark:text-white font-mono">
              {formatTomans(Math.round(reportData.totalRevenue * 0.35))}
            </div>
            <span className="text-[11px] text-zinc-400">پس از کسر بهای تمام‌شده کالا</span>
          </div>
        </div>
      )}

      {/* Category Breakdown Table */}
      {reportData?.categoryBreakdown && (
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#62DB00]" />
            <span>تفکیک درآمد و سفارش‌ها بر اساس دسته‌بندی کالا</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold">
                  <th className="pb-3 pr-2">دسته‌بندی</th>
                  <th className="pb-3">تعداد اقلام فروخته‌شده</th>
                  <th className="pb-3">درآمد حاصله (تومان)</th>
                  <th className="pb-3 pl-2">سهم از کل درآمد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-medium">
                {reportData.categoryBreakdown.map((cat: any, idx: number) => {
                  const percent =
                    reportData.totalRevenue > 0
                      ? Math.round((cat.revenue / reportData.totalRevenue) * 100)
                      : 0;
                  return (
                    <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                      <td className="py-3 pr-2 font-bold text-zinc-900 dark:text-white">{cat.nameFa}</td>
                      <td className="py-3 text-zinc-600 dark:text-zinc-300 font-mono">
                        {formatNumber(cat.ordersCount)} کالا
                      </td>
                      <td className="py-3 font-bold text-zinc-900 dark:text-white font-mono">
                        {formatTomans(cat.revenue)}
                      </td>
                      <td className="py-3 pl-2">
                        <div className="flex items-center gap-2 max-w-[120px]">
                          <div className="flex-1 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                            <div
                              className="h-full bg-[#62DB00] rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-zinc-500 font-mono">{percent}٪</span>
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
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-[#62DB00]" />
              <span>جزییات محصولات در این گزارش</span>
            </h3>
            <span className="text-xs text-zinc-400">نمایش ۱۰ محصول پرفروش گزارش</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold">
                  <th className="pb-3 pr-2">کد SKU</th>
                  <th className="pb-3">نام محصول</th>
                  <th className="pb-3">دسته‌بندی</th>
                  <th className="pb-3">قیمت واحد</th>
                  <th className="pb-3">تعداد فروش</th>
                  <th className="pb-3">مجموع فروش</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-medium">
                {reportData.products.map((p: any, idx: number) => (
                  <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                    <td className="py-3 pr-2 font-mono text-[#62DB00]">{p.sku}</td>
                    <td className="py-3 font-bold text-zinc-900 dark:text-white">{p.nameFa}</td>
                    <td className="py-3 text-zinc-500">{p.category}</td>
                    <td className="py-3 text-zinc-700 dark:text-zinc-300 font-mono">{formatTomans(p.price)}</td>
                    <td className="py-3 font-bold text-[#62DB00] font-mono">
                      {formatNumber(p.soldCount)} عدد
                    </td>
                    <td className="py-3 font-black text-zinc-900 dark:text-white font-mono">
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
