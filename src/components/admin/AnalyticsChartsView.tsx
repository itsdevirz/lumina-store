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
        <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-800 text-xs space-y-1.5 font-sans" dir="rtl">
          <p className="font-bold text-slate-300 pb-1 border-b border-slate-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 text-xs">
              <span style={{ color: entry.color }} className="font-bold">
                {entry.name}:
              </span>
              <span className="font-black text-white">
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 font-sans">
      {/* View Header & Time Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            نمودارهای تحلیلی و آماری
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            بررسی روندهای مالی، حجم فروش، نرخ سفارش‌گیری و جریان جذب کاربر
          </p>
        </div>

        {/* Time range pill buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
          {ranges.map(r => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                range === r.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Quick Stats in Selected Period */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveMetric('sales')}
          className={`p-5 rounded-3xl text-right transition-all border ${
            activeMetric === 'sales'
              ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">فروش در بازه انتخابی</span>
            <DollarSign className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {totalSalesInPeriod.toLocaleString('fa-IR')} <span className="text-xs font-medium text-slate-400">تومان</span>
          </div>
        </button>

        <button
          onClick={() => setActiveMetric('orders')}
          className={`p-5 rounded-3xl text-right transition-all border ${
            activeMetric === 'orders'
              ? 'bg-emerald-50/50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">تعداد سفارش‌ها</span>
            <ShoppingBag className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {totalOrdersInPeriod.toLocaleString('fa-IR')} <span className="text-xs font-medium text-slate-400">سفارش</span>
          </div>
        </button>

        <button
          onClick={() => setActiveMetric('visitors')}
          className={`p-5 rounded-3xl text-right transition-all border ${
            activeMetric === 'visitors'
              ? 'bg-blue-50/50 dark:bg-blue-950/40 border-blue-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">تعداد بازدیدکنندگان</span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {totalVisitorsInPeriod.toLocaleString('fa-IR')} <span className="text-xs font-medium text-slate-400">نفر</span>
          </div>
        </button>

        <button
          onClick={() => setActiveMetric('newUsers')}
          className={`p-5 rounded-3xl text-right transition-all border ${
            activeMetric === 'newUsers'
              ? 'bg-purple-50/50 dark:bg-purple-950/40 border-purple-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">کاربران جدید</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {totalUsersInPeriod.toLocaleString('fa-IR')} <span className="text-xs font-medium text-slate-400">عضو جدید</span>
          </div>
        </button>
      </div>

      {/* Primary Active Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {activeMetric === 'sales' && 'روند درآمد و فروش در طول زمان'}
              {activeMetric === 'orders' && 'نمودار تعداد سفارش‌های ثبت‌شده'}
              {activeMetric === 'visitors' && 'ترافیک ورودی و تعداد بازدید سایت'}
              {activeMetric === 'newUsers' && 'نرخ رشد ثبت‌نام کاربران جدید'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              بازه زمانی فعال: {ranges.find(r => r.id === range)?.label}
            </p>
          </div>
        </div>

        <div className="h-80 w-full" dir="ltr">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              در حال بارگذاری اطلاعات نمودار...
            </div>
          ) : activeMetric === 'sales' ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.3} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={formatPrice} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  name="فروش"
                  stroke="#6366F1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : activeMetric === 'orders' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.3} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="orders" name="سفارش‌ها" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : activeMetric === 'visitors' ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.3} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="بازدیدکنندگان"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVisits)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.3} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  name="کاربر جدید"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#8B5CF6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Dual Comparative Charts: Sales vs Visits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-indigo-500" />
            <span>مقایسه فروش و حجم سفارش‌ها</span>
          </h4>
          <div className="h-64" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.3} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="orders" name="سفارش‌ها" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-500" />
            <span>جذب اعضای جدید سایت</span>
          </h4>
          <div className="h-64" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.3} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="newUsers"
                  name="عضو جدید"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
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
