import React, { useState, useEffect } from 'react';
import { Tag, Plus, CheckCircle2, XCircle, Clock, Percent, DollarSign, X } from 'lucide-react';
import { Coupon } from '../../types/admin';

export const CouponsView: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('15');
  const [maxDiscount, setMaxDiscount] = useState('1500000');
  const [minPurchase, setMinPurchase] = useState('3000000');
  const [expiresAt, setExpiresAt] = useState('۱۴۰۴/۰۸/۳۰');
  const [maxUsage, setMaxUsage] = useState('500');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      setCoupons(data);
    } catch (err) {
      console.error('Error loading coupons:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const res = await fetch(`/api/coupons/${id}/toggle`, { method: 'PATCH' });
      if (res.ok) {
        const updated = await res.json();
        setCoupons(prev => prev.map(c => (c.id === id ? updated : c)));
      }
    } catch (err) {
      console.error('Error toggling coupon:', err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          discountPercent: Number(discountPercent),
          maxDiscount: Number(maxDiscount),
          minPurchase: Number(minPurchase),
          expiresAt,
          maxUsage: Number(maxUsage)
        })
      });
      if (res.ok) {
        const created = await res.json();
        setCoupons(prev => [...prev, created]);
        setIsCreateOpen(false);
        setCode('');
      }
    } catch (err) {
      console.error('Error creating coupon:', err);
    }
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
            کدهای تخفیف و جشنواره‌ها
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            تعریف و نظارت بر کوپن‌های تخفیف درصدی، سقف مجاز و محدودیت استفاده مشتریان
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>ایجاد کد تخفیف جدید</span>
        </button>
      </div>

      {/* Coupons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map(c => (
          <div
            key={c.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-base font-black px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                {c.code}
              </span>
              <button
                onClick={() => handleToggle(c.id)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  c.isActive
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                }`}
              >
                {c.isActive ? 'فعال' : 'غیرفعال'}
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">میزان تخفیف:</span>
                <span className="font-bold text-slate-900 dark:text-white">{c.discountPercent}٪</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">حداقل خرید:</span>
                <span className="font-bold">{formatTomans(c.minPurchase)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">انقضا:</span>
                <span className="font-bold">{c.expiresAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">تعداد استفاده:</span>
                <span className="font-bold">
                  {formatNumber(c.usageCount)} از {formatNumber(c.maxUsage)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${Math.min(100, (c.usageCount / c.maxUsage) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Coupon Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-slate-900 dark:text-white">تعریف کوپن تخفیف</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  کد کوپن (حروف انگلیسی یا عدد) *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="مثال: SPRING1404"
                  className="w-full px-3 py-2 rounded-xl font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    درصد تخفیف *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={discountPercent}
                    onChange={e => setDiscountPercent(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    حداکثر سقف استفاده
                  </label>
                  <input
                    type="number"
                    value={maxUsage}
                    onChange={e => setMaxUsage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  حداقل مبلغ خرید (تومان)
                </label>
                <input
                  type="number"
                  value={minPurchase}
                  onChange={e => setMinPurchase(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  تاریخ انقضا (شمسی)
                </label>
                <input
                  type="text"
                  value={expiresAt}
                  onChange={e => setExpiresAt(e.target.value)}
                  placeholder="۱۴۰۴/۰۸/۳۰"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-hidden"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  ثبت کد تخفیف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
