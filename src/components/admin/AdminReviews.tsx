import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Search,
  Filter,
  Trash2,
  CornerDownLeft,
  Send,
  ShoppingBag,
  RefreshCw,
  AlertCircle,
  Award,
  ChevronDown,
  Edit3
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductReview, ReviewStats } from '../../types';

export const AdminReviews: React.FC = () => {
  const { lang, addToast } = useStore();

  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 5.0,
    totalRatings: 0,
    totalReviews: 0,
    approvedReviewsCount: 0,
    pendingReviewsCount: 0,
    rejectedReviewsCount: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    distributionPercentages: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Reply State
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [isSubmittingReply, setIsSubmittingReply] = useState<boolean>(false);

  // Delete Confirmation State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Fetch Admin Reviews
  const fetchAdminReviews = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (ratingFilter > 0) params.append('rating', String(ratingFilter));
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/admin/reviews?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to fetch admin reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminReviews();
  }, [statusFilter, ratingFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAdminReviews();
  };

  // Change Status (Approve / Reject / Pending)
  const handleUpdateStatus = async (reviewId: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        const statusLabel =
          status === 'approved' ? 'تأیید شد' : status === 'rejected' ? 'رد شد' : 'در انتظار قرار گرفت';
        addToast({
          title: 'تغییر وضعیت نظر',
          description: `وضعیت نظر با موفقیت به «${statusLabel}» تغییر یافت.`,
          type: 'success'
        });
        fetchAdminReviews();
      }
    } catch (err) {
      console.error('Error updating review status:', err);
    }
  };

  // Submit Admin Reply
  const handleSaveReply = async (reviewId: string) => {
    if (!replyText.trim()) return;
    setIsSubmittingReply(true);

    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          replyText: replyText.trim(),
          adminName: 'پشتیبانی لومینا'
        })
      });

      if (res.ok) {
        addToast({
          title: 'پاسخ ثبت شد',
          description: 'پاسخ مدیر با موفقیت روی این نظر منتشر شد.',
          type: 'success'
        });
        setActiveReplyId(null);
        setReplyText('');
        fetchAdminReviews();
      }
    } catch (err) {
      console.error('Error sending reply:', err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Delete Admin Reply
  const handleDeleteReply = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}/reply`, {
        method: 'DELETE'
      });

      if (res.ok) {
        addToast({
          title: 'پاسخ حذف شد',
          description: 'پاسخ مدیر پاک شد.',
          type: 'info'
        });
        fetchAdminReviews();
      }
    } catch (err) {
      console.error('Error deleting reply:', err);
    }
  };

  // Delete Review
  const handleDeleteReview = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        addToast({
          title: 'نظر حذف شد',
          description: 'نظر کاربر با موفقیت از سیستم پاک شد.',
          type: 'info'
        });
        setDeleteTargetId(null);
        fetchAdminReviews();
      }
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>مدیریت نظرات و امتیازات خریداران</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            بررسی، تأیید/رد و پاسخ‌دهی به دیدگاه‌های ثبت‌شده کاربران فروشگاه
          </p>
        </div>

        <button
          onClick={fetchAdminReviews}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>بروزرسانی لیست</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">کل نظرات</span>
            <MessageSquare className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {reviews.length}
          </span>
        </div>

        {/* Pending */}
        <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 shadow-2xs">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
            <span className="text-xs font-bold">در انتظار بررسی</span>
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-amber-700 dark:text-amber-300">
            {stats.pendingReviewsCount}
          </span>
        </div>

        {/* Approved */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
            <span className="text-xs font-bold">تأییدشده</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
            {stats.approvedReviewsCount}
          </span>
        </div>

        {/* Rejected */}
        <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 shadow-2xs">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 mb-2">
            <span className="text-xs font-bold">ردشده</span>
            <XCircle className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-rose-700 dark:text-rose-300">
            {stats.rejectedReviewsCount}
          </span>
        </div>

        {/* Average Rating */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">میانگین امتیاز</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.averageRating.toFixed(1)} <span className="text-xs text-slate-400 font-normal">/ ۵</span>
          </span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Status Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'همه نظرات' },
              { id: 'pending', label: 'در انتظار ⏳' },
              { id: 'approved', label: 'تأییدشده ✅' },
              { id: 'rejected', label: 'ردشده ❌' },
              { id: 'no_reply', label: 'بدون پاسخ 💬' },
              { id: 'has_reply', label: 'پاسخ داده‌شده' },
              { id: 'verified', label: 'خریداران واقعی 🛒' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">امتیاز:</span>
            <select
              value={ratingFilter}
              onChange={e => setRatingFilter(Number(e.target.value))}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold outline-hidden cursor-pointer"
            >
              <option value={0}>همه امتیازها</option>
              <option value={5}>۵ ستاره ⭐⭐⭐⭐⭐</option>
              <option value={4}>۴ ستاره ⭐⭐⭐⭐</option>
              <option value={3}>۳ ستاره ⭐⭐⭐</option>
              <option value={2}>۲ ستاره ⭐⭐</option>
              <option value={1}>۱ ستاره ⭐</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="جستجو بر اساس نام کاربر، نام محصول یا متن نظر..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/40 animate-pulse h-32" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">هیچ نظری مطابق با فیلترها یافت نشد</h4>
          <p className="text-xs text-slate-400 mt-1">تنظیمات فیلتر یا واژه جستجو را تغییر دهید.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(rev => (
            <div
              key={rev.id}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all space-y-4 ${
                rev.status === 'pending'
                  ? 'border-amber-300 dark:border-amber-900/60 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Review Card Top Header */}
              <div className="flex items-start justify-between flex-wrap gap-3">
                {/* User & Product Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-bold text-sm flex items-center justify-center overflow-hidden shrink-0 border border-indigo-200 dark:border-indigo-800">
                    {rev.userAvatar ? (
                      <img src={rev.userAvatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      rev.userName.slice(0, 1)
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{rev.userName}</span>
                      {rev.userEmail && (
                        <span className="text-[10px] text-slate-400 dir-ltr font-mono">{rev.userEmail}</span>
                      )}
                      {rev.isVerifiedPurchase && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                          <ShoppingBag className="w-3 h-3" />
                          خریدار واقعی
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                      مربوط به محصول: <span className="font-bold text-slate-800 dark:text-slate-200">{rev.productNameFa}</span>
                    </div>
                  </div>
                </div>

                {/* Rating & Date & Status Badge */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[11px] text-slate-400">{rev.createdAt}</span>

                  <div className="flex items-center gap-1 dir-ltr bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-lg border border-amber-200/50">
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{rev.rating}</span>
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      rev.status === 'approved'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                        : rev.status === 'rejected'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {rev.status === 'approved' ? 'تأییدشده' : rev.status === 'rejected' ? 'ردشده' : 'در انتظار بررسی'}
                  </span>
                </div>
              </div>

              {/* Comment Body */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                {rev.comment || <em className="text-slate-400 font-normal">کاربر فقط امتیاز ستاره‌ای ثبت کرده است.</em>}
              </div>

              {/* Admin Reply Section */}
              {rev.adminReply ? (
                <div className="p-3.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-300">
                    <div className="flex items-center gap-1.5">
                      <CornerDownLeft className="w-4 h-4 text-indigo-600" />
                      <span>پاسخ ثبت‌شده مدیر ({rev.adminReplyBy})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-normal">{rev.adminReplyAt}</span>
                      <button
                        onClick={() => {
                          setActiveReplyId(rev.id);
                          setReplyText(rev.adminReply || '');
                        }}
                        className="p-1 hover:text-indigo-600 transition-colors text-slate-400 cursor-pointer"
                        title="ویرایش پاسخ"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteReply(rev.id)}
                        className="p-1 hover:text-rose-600 transition-colors text-slate-400 cursor-pointer"
                        title="حذف پاسخ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pr-4">
                    {rev.adminReply}
                  </p>
                </div>
              ) : null}

              {/* Active Reply Input Form */}
              {activeReplyId === rev.id && (
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>ثبت پاسخ مدیر به نظر کاربر</span>
                    <button
                      onClick={() => {
                        setActiveReplyId(null);
                        setReplyText('');
                      }}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      بستن
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="متن پاسخ رسمی فروشگاه را بنویسید..."
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleSaveReply(rev.id)}
                      disabled={isSubmittingReply || !replyText.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                      <span>ثبت و انتشار پاسخ</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Card Action Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  {rev.status !== 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(rev.id, 'approved')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تأیید و انتشار</span>
                    </button>
                  )}

                  {rev.status !== 'rejected' && (
                    <button
                      onClick={() => handleUpdateStatus(rev.id, 'rejected')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 hover:bg-rose-200 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>رد نظر</span>
                    </button>
                  )}

                  {activeReplyId !== rev.id && (
                    <button
                      onClick={() => {
                        setActiveReplyId(rev.id);
                        setReplyText(rev.adminReply || '');
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{rev.adminReply ? 'ویرایش پاسخ' : 'پاسخ مدیر'}</span>
                    </button>
                  )}
                </div>

                {/* Delete Review Button */}
                <div>
                  {deleteTargetId === rev.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-rose-600 font-medium">حذف شود؟</span>
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="px-2.5 py-1 rounded-md bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer"
                      >
                        بله
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(null)}
                        className="px-2.5 py-1 rounded-md bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                      >
                        خیر
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteTargetId(rev.id)}
                      className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                      title="حذف کامل نظر"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
