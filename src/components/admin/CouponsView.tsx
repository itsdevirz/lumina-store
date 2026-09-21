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
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
              کدهای تخفیف و جشنواره‌ها
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#62DB00]/15 text-[#62DB00] border border-[#62DB00]/30">
              PROMOTIONS
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            تعریف و نظارت بر کوپن‌های تخفیف درصدی، سقف مجاز و محدودیت استفاده مشتریان
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#62DB00] hover:bg-[#52B800] text-black text-xs font-black shadow-lg shadow-[#62DB00]/15 transition-all cursor-pointer"
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
            className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-base font-black px-3 py-1 rounded-xl bg-[#62DB00]/10 text-[#62DB00] border border-[#62DB00]/25">
                {c.code}
              </span>
              <button
                onClick={() => handleToggle(c.id)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold cursor-pointer ${
                  c.isActive
                    ? 'bg-[#62DB00]/15 text-[#62DB00] border border-[#62DB00]/30'
                    : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700'
                }`}
              >
                {c.isActive ? 'فعال' : 'غیرفعال'}
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
              <div className="flex justify-between">
                <span className="text-zinc-400">میزان تخفیف:</span>
                <span className="font-bold text-zinc-900 dark:text-white font-mono">{c.discountPercent}٪</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">حداقل خرید:</span>
                <span className="font-bold font-mono">{formatTomans(c.minPurchase)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">انقضا:</span>
                <span className="font-bold font-mono">{c.expiresAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">تعداد استفاده:</span>
                <span className="font-bold font-mono">
                  {formatNumber(c.usageCount)} از {formatNumber(c.maxUsage)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-[#62DB00] rounded-full"
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
          <div className="bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-zinc-900 dark:text-white">تعریف کوپن تخفیف</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-xl text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  کد کوپن (حروف انگلیسی یا عدد) *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="مثال: SPRING1404"
                  className="w-full px-3 py-2 rounded-xl font-mono uppercase bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-[#62DB00] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    درصد تخفیف *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={discountPercent}
                    onChange={e => setDiscountPercent(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-[#62DB00] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    حداکثر سقف استفاده
                  </label>
                  <input
                    type="number"
                    value={maxUsage}
                    onChange={e => setMaxUsage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-[#62DB00] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  حداقل مبلغ خرید (تومان)
                </label>
                <input
                  type="number"
                  value={minPurchase}
                  onChange={e => setMinPurchase(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-[#62DB00] font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  تاریخ انقضا (شمسی)
                </label>
                <input
                  type="text"
                  value={expiresAt}
                  onChange={e => setExpiresAt(e.target.value)}
                  placeholder="۱۴۰۴/۰۸/۳۰"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-[#62DB00] font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#62DB00] hover:bg-[#52B800] text-black font-black shadow-md shadow-[#62DB00]/15 cursor-pointer"
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
