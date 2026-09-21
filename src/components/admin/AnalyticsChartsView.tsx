import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Eye,
  Calendar,
  DollarSign,
  Download,
  Filter
} from 'lucide-react';
import { TimeRange, ChartDataPoint } from '../../types/admin';

export const AnalyticsChartsView: React.FC = () => {
  const [range, setRange] = useState<TimeRange>('7days');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMetric, setActiveMetric] = useState<'sales' | 'orders' | 'visitors' | 'newUsers'>('sales');

  const ranges: { id: TimeRange; label: string }[] = [
    { id: 'today', label: 'امروز' },
    { id: '7days', label: '۷ روز اخیر' },
    { id: '30days', label: '۳۰ روز اخیر' },
    { id: '3months', label: '۳ ماه اخیر' },
    { id: '6months', label: '۶ ماه اخیر' },
    { id: 'year', label: 'امسال' }
  ];

  useEffect(() => {
    fetchChartData(range);
  }, [range]);

  const fetchChartData = async (selectedRange: TimeRange) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/analytics/charts?range=${selectedRange}`);
      const data = await res.json();
      setChartData(data);
    } catch (err) {
      console.error('Error fetching chart data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (value: number) => {
    if (value >= 1000000) {
      return (value / 1000000).toLocaleString('fa-IR') + ' م.ت';
    }
    return (value / 1000).toLocaleString('fa-IR') + ' هـ.ت';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#121215] text-white p-3 rounded-2xl shadow-xl border border-zinc-800 text-xs space-y-1.5 font-sans" dir="rtl">
          <p className="font-bold text-zinc-400 pb-1 border-b border-zinc-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 text-xs">
              <span style={{ color: entry.color }} className="font-bold">
                {entry.name}:
              </span>
              <span className="font-black text-white font-mono">
                {entry.dataKey === 'sales'
                  ? `${entry.value.toLocaleString('fa-IR')} تومان`
                  : entry.value.toLocaleString('fa-IR')}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate totals for active period
  const totalSalesInPeriod = chartData.reduce((s, d) => s + d.sales, 0);
  const totalOrdersInPeriod = chartData.reduce((s, d) => s + d.orders, 0);
  const totalVisitorsInPeriod = chartData.reduce((s, d) => s + d.visitors, 0);
  const totalUsersInPeriod = chartData.reduce((s, d) => s + d.newUsers, 0);

  return (
    <div className="p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-8 font-sans">
      {/* View Header & Time Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white">
            نمودارهای تحلیلی و آماری
          </h1>
          <p className="text-[11px] sm:text-xs text-zinc-400 mt-1">
            بررسی روندهای مالی، حجم فروش، نرخ سفارش‌گیری و جریان جذب کاربر
          </p>
        </div>

        {/* Time range pill buttons */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-x-auto max-w-full">
          {ranges.map(r => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all shrink-0 cursor-pointer ${
                range === r.id
                  ? 'bg-[#62DB00] text-black font-black shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Quick Stats in Selected Period */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <button
          onClick={() => setActiveMetric('sales')}
          className={`p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl text-right transition-all border cursor-pointer ${
            activeMetric === 'sales'
              ? 'bg-[#62DB00]/10 dark:bg-[#62DB00]/10 border-[#62DB00] shadow-sm'
              : 'bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800/90 hover:border-zinc-300 dark:hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400 mb-1.5 sm:mb-2">
            <span className="text-[11px] sm:text-xs font-bold truncate">فروش کل</span>
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#62DB00] shrink-0" />
          </div>
          <div className="text-sm sm:text-xl font-black text-zinc-900 dark:text-white truncate font-mono">
            {totalSalesInPeriod.toLocaleString('fa-IR')} <span className="text-[10px] sm:text-xs font-medium text-zinc-400 font-sans">تومان</span>
          </div>
        </button>

        <button
          onClick={() => setActiveMetric('orders')}
          className={`p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl text-right transition-all border cursor-pointer ${
            activeMetric === 'orders'
              ? 'bg-emerald-500/10 dark:bg-emerald-500/10 border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800/90 hover:border-zinc-300 dark:hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400 mb-1.5 sm:mb-2">
            <span className="text-[11px] sm:text-xs font-bold truncate">سفارش‌ها</span>
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />
          </div>
          <div className="text-sm sm:text-xl font-black text-zinc-900 dark:text-white truncate font-mono">
            {totalOrdersInPeriod.toLocaleString('fa-IR')} <span className="text-[10px] sm:text-xs font-medium text-zinc-400 font-sans">سفارش</span>
          </div>
        </button>

        <button
          onClick={() => setActiveMetric('visitors')}
          className={`p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl text-right transition-all border cursor-pointer ${
            activeMetric === 'visitors'
              ? 'bg-sky-500/10 dark:bg-sky-500/10 border-sky-500 shadow-sm'
              : 'bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800/90 hover:border-zinc-300 dark:hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400 mb-1.5 sm:mb-2">
            <span className="text-[11px] sm:text-xs font-bold truncate">بازدیدها</span>
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-500 shrink-0" />
          </div>
          <div className="text-sm sm:text-xl font-black text-zinc-900 dark:text-white truncate font-mono">
            {totalVisitorsInPeriod.toLocaleString('fa-IR')} <span className="text-[10px] sm:text-xs font-medium text-zinc-400 font-sans">نفر</span>
          </div>
        </button>

        <button
          onClick={() => setActiveMetric('newUsers')}
          className={`p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl text-right transition-all border cursor-pointer ${
            activeMetric === 'newUsers'
              ? 'bg-purple-500/10 dark:bg-purple-500/10 border-purple-500 shadow-sm'
              : 'bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800/90 hover:border-zinc-300 dark:hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400 mb-1.5 sm:mb-2">
            <span className="text-[11px] sm:text-xs font-bold truncate">کاربر جدید</span>
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500 shrink-0" />
          </div>
          <div className="text-sm sm:text-xl font-black text-zinc-900 dark:text-white truncate font-mono">
            {totalUsersInPeriod.toLocaleString('fa-IR')} <span className="text-[10px] sm:text-xs font-medium text-zinc-400 font-sans">عضو جدید</span>
          </div>
        </button>
      </div>

      {/* Primary Active Chart */}
      <div className="p-3.5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white">
              {activeMetric === 'sales' && 'روند درآمد و فروش در طول زمان'}
              {activeMetric === 'orders' && 'نمودار تعداد سفارش‌های ثبت‌شده'}
              {activeMetric === 'visitors' && 'ترافیک ورودی و تعداد بازدید سایت'}
              {activeMetric === 'newUsers' && 'نرخ رشد ثبت‌نام کاربران جدید'}
            </h3>
            <p className="text-[10px] sm:text-xs text-zinc-400 mt-0.5">
              بازه زمانی فعال: {ranges.find(r => r.id === range)?.label}
            </p>
          </div>
        </div>

        <div className="h-64 sm:h-80 w-full" dir="ltr">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-xs text-zinc-400">
              در حال بارگذاری اطلاعات نمودار...
            </div>
          ) : activeMetric === 'sales' ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#62DB00" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#62DB00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" strokeOpacity={0.3} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickFormatter={formatPrice} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  name="فروش"
                  stroke="#62DB00"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : activeMetric === 'orders' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" strokeOpacity={0.3} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="orders" name="سفارش‌ها" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : activeMetric === 'visitors' ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" strokeOpacity={0.3} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="بازدیدکنندگان"
                  stroke="#0EA5E9"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVisits)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" strokeOpacity={0.3} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  name="کاربر جدید"
                  stroke="#A855F7"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#A855F7' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Dual Comparative Charts: Sales vs Visits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
        <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-3 sm:space-y-4">
          <h4 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#62DB00]" />
            <span>مقایسه فروش و حجم سفارش‌ها</span>
          </h4>
          <div className="h-56 sm:h-64" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" strokeOpacity={0.3} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="orders" name="سفارش‌ها" fill="#62DB00" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-3 sm:space-y-4">
          <h4 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-500" />
            <span>جذب اعضای جدید سایت</span>
          </h4>
          <div className="h-56 sm:h-64" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" strokeOpacity={0.3} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="newUsers"
                  name="عضو جدید"
                  stroke="#A855F7"
                  fill="#A855F7"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
