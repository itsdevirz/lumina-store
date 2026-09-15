import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Star,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  Lock,
  Send,
  CornerDownLeft,
  ShoppingBag,
  RefreshCw
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductReview, ReviewStats } from '../types';
import { INITIAL_REVIEWS, computeReviewStats } from '../data/reviews';

interface ProductReviewsSectionProps {
  productId: string;
}

const STORAGE_KEY = 'lumina_custom_reviews';

// Helper to get local stored reviews
const getLocalReviews = (pId: string): ProductReview[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const customList: ProductReview[] = raw ? JSON.parse(raw) : [];
    const defaults = INITIAL_REVIEWS.filter(r => r.productId === pId);
    const combined = [...customList.filter(r => r.productId === pId), ...defaults];
    return combined;
  } catch {
    return INITIAL_REVIEWS.filter(r => r.productId === pId);
  }
};

const saveLocalReview = (newReview: ProductReview): ProductReview[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const current: ProductReview[] = raw ? JSON.parse(raw) : [];
    // remove existing if same user & product
    const updated = [newReview, ...current.filter(r => !(r.productId === newReview.productId && r.id === newReview.id))];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    const defaults = INITIAL_REVIEWS.filter(r => r.productId === newReview.productId);
    return [...updated.filter(r => r.productId === newReview.productId), ...defaults];
  } catch {
    return [newReview, ...INITIAL_REVIEWS.filter(r => r.productId === newReview.productId)];
  }
};

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({ productId }) => {
  const {
    lang,
    currentUser,
    isAuthenticated,
    openLoginModal,
    addToast,
    userOrders,
    refetchProducts
  } = useStore();

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'verified' | 'has_reply'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  // Check if current user has purchased this product
  const isVerifiedPurchase = userOrders.some(order =>
    Array.isArray(order.items) && order.items.some(item => item.productId === productId)
  );

  // Fetch Reviews & Stats with Server + Static Host Fallback
  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`);
      const contentType = res.headers.get('content-type') || '';
      
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        const serverReviews: ProductReview[] = data.reviews || [];
        // Merge with any local user reviews that might exist
        const localList = getLocalReviews(productId);
        const userAdded = localList.filter(lr => !serverReviews.some(sr => sr.id === lr.id));
        const combined = [...userAdded, ...serverReviews];
        
        setReviews(combined);
        setStats(computeReviewStats(combined));
        return;
      }
      
      // Fallback for static hosts where API is not routed or returns index.html
      const fallbackList = getLocalReviews(productId);
      setReviews(fallbackList);
      setStats(computeReviewStats(fallbackList));
    } catch {
      // Offline or static host fallback
      const fallbackList = getLocalReviews(productId);
      setReviews(fallbackList);
      setStats(computeReviewStats(fallbackList));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, currentUser?.id]);

  // Rating star label text
  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 5: return lang === 'fa' ? 'عالی (۵ از ۵)' : 'Excellent (5/5)';
      case 4: return lang === 'fa' ? 'خیلی خوب (۴ از ۵)' : 'Very Good (4/5)';
      case 3: return lang === 'fa' ? 'معمولی (۳ از ۵)' : 'Average (3/5)';
      case 2: return lang === 'fa' ? 'ضعیف (۲ از ۵)' : 'Poor (2/5)';
      case 1: return lang === 'fa' ? 'خیلی ضعیف (۱ از ۵)' : 'Very Poor (1/5)';
      default: return '';
    }
  };

  // Submit Review or Rating
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !currentUser) {
      openLoginModal();
      addToast({
        title: lang === 'fa' ? 'ورود به حساب' : 'Login Required',
        description: lang === 'fa' ? 'جهت ثبت نظر و امتیاز، لطفاً ابتدا وارد حساب کاربری خود شوید.' : 'Please log in to submit a review.',
        type: 'warning'
      });
      return;
    }

    if (rating < 1 || rating > 5) {
      addToast({
        title: lang === 'fa' ? 'انتخاب امتیاز' : 'Rating Required',
        description: lang === 'fa' ? 'لطفاً امتیازی بین ۱ تا ۵ ستاره تعیین کنید.' : 'Please select a rating between 1 and 5 stars.',
        type: 'warning'
      });
      return;
    }

    setIsSubmitting(true);

    const newReviewItem: ProductReview = {
      id: 'rev-' + Date.now(),
      productId,
      userId: currentUser.id,
      userName: currentUser.name || (lang === 'fa' ? 'کاربر لومینا' : 'Lumina User'),
      userAvatar: currentUser.avatar,
      userEmail: currentUser.email,
      rating: Number(rating),
      comment: comment ? String(comment).trim() : '',
      status: 'approved',
      isVerifiedPurchase,
      createdAt: new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date()),
      timestamp: Date.now()
    };

    try {
      let savedSuccessfully = false;

      // Try calling the backend API first
      try {
        const res = await fetch(`/api/products/${productId}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser.id,
            userName: currentUser.name || 'کاربر لومینا',
            userAvatar: currentUser.avatar,
            userEmail: currentUser.email,
            rating,
            comment
          })
        });

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (res.ok && data.success) {
            savedSuccessfully = true;
          }
        }
      } catch (networkErr) {
        // Backend unavailable (e.g. static hosting on cPanel/Nginx/GitHub Pages)
        console.warn('API backend not reachable, using local fallback:', networkErr);
      }

      // Always ensure local persistence fallback for static hosting
      const updatedList = saveLocalReview(newReviewItem);
      setReviews(updatedList);
      setStats(computeReviewStats(updatedList));

      addToast({
        title: lang === 'fa' ? 'نظر با موفقیت ثبت شد' : 'Review Submitted',
        description: lang === 'fa' ? 'با تشکر! نظر و امتیاز شما با موفقیت ذخیره و نمایش داده شد.' : 'Thank you! Your review has been saved.',
        type: 'success'
      });
      setComment('');
      setRating(5);
      refetchProducts(); // Sync store rating
    } catch (err: any) {
      addToast({
        title: lang === 'fa' ? 'خطا در ارسال' : 'Submission Error',
        description: err?.message || (lang === 'fa' ? 'متأسفانه مشکلی رخ داد. دوباره تلاش کنید.' : 'An error occurred.'),
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter & Sort reviews list
  const filteredReviews = reviews
    .filter(r => {
      if (filterMode === 'verified') return r.isVerifiedPurchase;
      if (filterMode === 'has_reply') return !!r.adminReply;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      return b.timestamp - a.timestamp; // newest
    });

  return (
    <div className="space-y-8 pt-2">
      {/* 1. Rating Overview & Breakdown Header */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
        {/* Rating Score Card */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs text-center">
          <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {stats.averageRating.toFixed(1)}
          </span>
          <span className="text-xs text-slate-400 mt-1 font-medium">
            {lang === 'fa' ? 'از ۵ ستاره' : 'out of 5 stars'}
          </span>

          {/* Stars */}
          <div className="flex items-center gap-1 my-3 dir-ltr">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(stats.averageRating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-200 dark:text-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-400">
            <span>
              {lang === 'fa'
                ? `بر اساس ${stats.totalRatings} امتیاز و ${stats.totalReviews} دیدگاه`
                : `Based on ${stats.totalRatings} ratings & ${stats.totalReviews} reviews`}
            </span>
            {isVerifiedPurchase && (
              <span className="inline-flex items-center justify-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {lang === 'fa' ? 'شما خریدار این محصول هستید' : 'You purchased this product'}
              </span>
            )}
          </div>
        </div>

        {/* Distribution Progress Bars (5★ -> 1★) */}
        <div className="md:col-span-7 flex flex-col justify-center space-y-2">
          {[5, 4, 3, 2, 1].map(stars => {
            const pct = stats.distributionPercentages[stars as 1|2|3|4|5] || 0;
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 w-14 shrink-0 font-bold text-slate-700 dark:text-slate-300">
                  <span>{stars}</span>
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </div>

                <div className="flex-1 h-2.5 rounded-full bg-slate-200/80 dark:bg-slate-700/80 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      stars >= 4
                        ? 'bg-amber-400'
                        : stars === 3
                        ? 'bg-indigo-500'
                        : 'bg-rose-500'
                    }`}
                  />
                </div>

                <span className="w-12 text-left shrink-0 text-slate-500 font-medium">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Review & Rating Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {lang === 'fa' ? 'ثبت نظر و امتیاز جدید' : 'Write a Review & Rating'}
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmitReview} className="space-y-4">
          {!isAuthenticated && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-center justify-between gap-3 flex-wrap mb-2">
              <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300 font-medium">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{lang === 'fa' ? 'برای ثبت نظر ابتدا باید وارد حساب کاربری شوید.' : 'Please log in to submit a review.'}</span>
              </div>
              <button
                type="button"
                onClick={openLoginModal}
                className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {lang === 'fa' ? 'ورود / ثبت‌نام' : 'Login / Register'}
              </button>
            </div>
          )}

          {/* Interactive Star Rating Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {lang === 'fa' ? 'امتیاز شما به این محصول *' : 'Your Rating *'}
            </label>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 dir-ltr bg-slate-50 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700">
                {[1, 2, 3, 4, 5].map(star => {
                  const active = star <= (hoverRating || rating);
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 hover:scale-125 transition-transform cursor-pointer focus:outline-hidden"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          active
                            ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                {getRatingLabel(hoverRating || rating)}
              </span>
            </div>
          </div>

          {/* Comment Textarea */}
          <div className="space-y-1.5">
            <label htmlFor="review-comment-textarea" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {lang === 'fa' ? 'متن نظر شما (اختیاری)' : 'Your Review Comment (Optional)'}
            </label>
            <textarea
              id="review-comment-textarea"
              rows={3}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder={
                lang === 'fa'
                  ? 'تجربه واقعی خود درباره کیفیت ساخت، کارایی، نقاط قوت و پیشنهاد به سایر خریداران را بنویسید...'
                  : 'Share your experience with quality, performance, and recommendations...'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-hidden transition-all resize-none"
            />
          </div>

          {/* Verified Buyer Badge Preview */}
          {isVerifiedPurchase && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40">
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>
                {lang === 'fa'
                  ? 'شما این محصول را خریده‌اید و نشان «خریدار محصول» روی نظر شما درج می‌شود.'
                  : 'Your review will be marked with a "Verified Buyer" badge.'}
              </span>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4 rtl:rotate-180" />
              )}
              <span>
                {lang === 'fa' ? 'ارسال نظر و امتیاز' : 'Submit Review'}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Filter & Sort Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterMode === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {lang === 'fa' ? `همه نظرات (${reviews.length})` : `All Reviews (${reviews.length})`}
          </button>

          <button
            onClick={() => setFilterMode('verified')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterMode === 'verified'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {lang === 'fa' ? 'خریداران واقعی 🛒' : 'Verified Buyers 🛒'}
          </button>

          <button
            onClick={() => setFilterMode('has_reply')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterMode === 'has_reply'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {lang === 'fa' ? 'دارای پاسخ فروشگاه 💬' : 'With Store Reply 💬'}
          </button>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">{lang === 'fa' ? 'مرتب‌سازی:' : 'Sort:'}</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold outline-hidden cursor-pointer"
          >
            <option value="newest">{lang === 'fa' ? 'جدیدترین' : 'Newest'}</option>
            <option value="highest">{lang === 'fa' ? 'بالاترین امتیاز' : 'Highest Rating'}</option>
            <option value="lowest">{lang === 'fa' ? 'پایین‌ترین امتیاز' : 'Lowest Rating'}</option>
          </select>
        </div>
      </div>

      {/* 4. Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/40 animate-pulse h-28" />
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800">
          <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {lang === 'fa' ? 'هنوز نظری برای این محصول ثبت نشده است.' : 'No reviews submitted yet.'}
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {lang === 'fa' ? 'اولین نفری باشید که تجربه‌تان را درباره این محصول ثبت می‌کند.' : 'Be the first to leave a review!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map(rev => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3 transition-all hover:border-slate-300 dark:hover:border-slate-700"
            >
              {/* Review Header */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                    {rev.userAvatar ? (
                      <img src={rev.userAvatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      rev.userName.slice(0, 1)
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{rev.userName}</span>
                      {rev.isVerifiedPurchase && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                          <ShoppingBag className="w-3 h-3" />
                          {lang === 'fa' ? 'خریدار محصول' : 'Verified Buyer'}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{rev.createdAt}</span>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 dir-ltr bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-lg border border-amber-200/50 dark:border-amber-900/40">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{rev.rating}</span>
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </div>
              </div>

              {/* Comment Content */}
              {rev.comment && (
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                  {rev.comment}
                </p>
              )}

              {/* Admin Reply Thread */}
              {rev.adminReply && (
                <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border-r-4 border-r-indigo-600 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-indigo-700 dark:text-indigo-400">
                    <div className="flex items-center gap-1.5">
                      <CornerDownLeft className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{rev.adminReplyBy || (lang === 'fa' ? 'پاسخ فروشگاه لومینا' : 'Lumina Store Reply')}</span>
                    </div>
                    <span className="text-slate-400 font-normal">{rev.adminReplyAt}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pr-2">
                    {rev.adminReply}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
