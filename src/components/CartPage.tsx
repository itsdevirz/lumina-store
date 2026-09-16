import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Heart,
  ArrowLeft,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Plus,
  Minus,
  Check,
  CreditCard
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
    formatPrice,
    lang,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setActiveTab,
    toggleWishlist,
    isInWishlist
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplying(true);
    const ok = await applyCoupon(couponCode);
    setIsApplying(false);
    if (ok) setCouponCode('');
  };

  const handleQuickCoupon = async (code: string) => {
    setIsApplying(true);
    await applyCoupon(code);
    setIsApplying(false);
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 max-w-4xl mx-auto px-4 text-center select-none">
        <div className="w-20 h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-400 dark:text-zinc-500 flex items-center justify-center mx-auto mb-5 border border-zinc-200/80 dark:border-zinc-700/80 shadow-xs">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mb-2">
          {lang === 'fa' ? 'سبد خرید شما در حال حاضر خالی است' : 'Your Shopping Cart is Empty'}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
          {lang === 'fa'
            ? 'به نظر می‌رسد هنوز هیچ کالایی به سبد خرید خود اضافه نکرده‌اید. همین حالا مجموعه‌های سخت‌افزاری لومینا را بررسی کنید.'
            : 'You have not added any hardware items yet. Browse our curated catalogs and find your next upgrade.'}
        </p>
        <button
          onClick={() => setActiveTab('shop')}
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-[#62DB00] hover:text-black dark:hover:bg-[#62DB00] dark:hover:text-black font-bold text-xs sm:text-sm shadow-lg transition-all active:scale-95 cursor-pointer"
        >
          <span>{lang === 'fa' ? 'مشاهده کاتالوگ فروشگاه' : 'Explore Hardware Catalog'}</span>
          {lang === 'fa' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  // Free shipping threshold (15,000,000 Toman or $250)
  const freeShippingThreshold = 15000000;
  const currentTotal = typeof cartTotal === 'number' ? cartTotal : cartTotal.subtotal;
  const freeShippingProgress = Math.min(100, Math.round((currentTotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - currentTotal);

  return (
    <div className="py-6 sm:py-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#62DB00]" />
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                {lang === 'fa' ? 'صورت‌حساب و خرید' : 'Cart & Checkout'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              {lang === 'fa' ? 'سبد خرید' : 'Shopping Cart'}
              <span className="text-base font-normal font-mono text-zinc-400 rtl:mr-2 ltr:ml-2">
                ({cart.reduce((a, b) => a + b.quantity, 0)} {lang === 'fa' ? 'کالا' : 'items'})
              </span>
            </h1>
          </div>

          <button
            onClick={() => setActiveTab('shop')}
            className="text-xs sm:text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>{lang === 'fa' ? 'ادامه خرید' : 'Continue Shopping'}</span>
            {lang === 'fa' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="mb-8 p-4 rounded-2xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#62DB00]" />
              <span className="text-zinc-900 dark:text-zinc-100">
                {remainingForFreeShipping === 0
                  ? lang === 'fa'
                    ? '🎉 تبریک! سفارش شما مشمول ارسال رایگان اکسپرس شد.'
                    : '🎉 Great news! Your order qualifies for free express delivery.'
                  : lang === 'fa'
                  ? `فقط ${formatPrice(remainingForFreeShipping)} دیگر تا دریافت ارسال رایگان!`
                  : `Add ${formatPrice(remainingForFreeShipping)} more to get free express shipping!`}
              </span>
            </div>
            <span className="font-mono text-[11px] text-zinc-400">{freeShippingProgress}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-[#62DB00] transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item, index) => (
              <div
                key={`${item.product.id}-${index}-${item.selectedColor || ''}`}
                className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-all shadow-xs gap-4"
              >
                {/* Thumbnail & Meta */}
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200/60 dark:border-zinc-700/60"
                  />

                  <div className="min-w-0">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold mb-0.5">
                      {item.product.brand}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 leading-snug">
                      {lang === 'fa' ? item.product.nameFa : item.product.name}
                    </h3>

                    {/* Variant tags */}
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                      {item.selectedColor && (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800">
                          <span>{lang === 'fa' ? 'رنگ:' : 'Color:'}</span>
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {item.selectedColor}
                          </span>
                        </span>
                      )}
                      {item.selectedSize && (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800">
                          <span>{lang === 'fa' ? 'سایز:' : 'Size:'}</span>
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {item.selectedSize}
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Price each */}
                    <div className="mt-2 font-mono text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {formatPrice(item.product.price, item.product.priceUSD)}
                    </div>
                  </div>
                </div>

                {/* Stepper, Subtotal & Remove */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800 gap-3">
                  {/* Stepper */}
                  <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 p-0.5">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedColor)}
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-mono font-bold text-xs">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedColor)}
                      disabled={item.quantity >= item.product.stock}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWishlist(item.product.id)}
                      className="p-2 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="انتقال به علاقه‌مندی‌ها"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isInWishlist(item.product.id) ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                      className="p-2 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="حذف از سبد"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary & Checkout */}
          <div className="lg:col-span-4 space-y-4">
            {/* Promo Code Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                <Tag className="w-4 h-4 text-[#62DB00]" />
                <span>{lang === 'fa' ? 'کد تخفیف دارید؟' : 'Have a Promo Code?'}</span>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#62DB00]/10 border border-[#62DB00]/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#62DB00]" />
                    <span className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100">
                      {appliedCoupon.code} ({appliedCoupon.percent}% OFF)
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    {lang === 'fa' ? 'حذف کد' : 'Remove'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder={lang === 'fa' ? 'کد تخفیف مثلاً LUMINA10' : 'Promo code (e.g. LUMINA10)'}
                    className="flex-1 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs font-mono uppercase focus:outline-none focus:border-[#62DB00]"
                  />
                  <button
                    type="submit"
                    disabled={isApplying || !couponCode.trim()}
                    className="px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-[#62DB00] hover:text-black dark:hover:bg-[#62DB00] dark:hover:text-black font-bold text-xs disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    {isApplying ? '...' : lang === 'fa' ? 'اعمال' : 'Apply'}
                  </button>
                </form>
              )}

              {/* Quick voucher chips */}
              <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-mono">
                {['LUMINA10', 'PROUPGRADE'].map(c => (
                  <button
                    key={c}
                    onClick={() => handleQuickCoupon(c)}
                    className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    +{c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Summary Breakdown */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-3.5">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
                {lang === 'fa' ? 'خلاصه فاکتور سفارش' : 'Order Summary'}
              </h3>

              <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                <span>{lang === 'fa' ? 'مجموع اقلام:' : 'Subtotal:'}</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {formatPrice(typeof cartTotal === 'number' ? cartTotal : cartTotal.subtotal)}
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs text-rose-500 font-mono">
                  <span>
                    {lang === 'fa' ? 'تخفیف کوپن (' : 'Coupon Discount ('}
                    {appliedCoupon.percent}%):
                  </span>
                  <span>
                    -
                    {formatPrice(
                      typeof cartTotal === 'object' && cartTotal.discount
                        ? cartTotal.discount
                        : (typeof cartTotal === 'number' ? cartTotal : cartTotal.subtotal) *
                            (appliedCoupon.percent / 100)
                    )}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                <span>{lang === 'fa' ? 'هزینه ارسال:' : 'Shipping:'}</span>
                <span className="font-semibold">
                  {remainingForFreeShipping === 0 ? (
                    <span className="text-[#62DB00] font-bold">
                      {lang === 'fa' ? 'رایگان (اکسپرس)' : 'Free Express'}
                    </span>
                  ) : (
                    formatPrice(85000, 5)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                  {lang === 'fa' ? 'مبلغ نهایی قابل پرداخت:' : 'Final Payable Total:'}
                </span>
                <span className="text-lg sm:text-xl font-mono font-black text-zinc-950 dark:text-white">
                  {formatPrice(
                    typeof cartTotal === 'number'
                      ? cartTotal
                      : (cartTotal.total || cartTotal.subtotal)
                  )}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => setActiveTab('checkout')}
                className="w-full mt-4 py-3.5 px-4 rounded-xl bg-[#62DB00] hover:bg-[#73e809] text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#62DB00]/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>{lang === 'fa' ? 'تکمیل خرید و ثبت سفارش' : 'Proceed to Checkout'}</span>
                {lang === 'fa' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>

              {/* Guarantees */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#62DB00]" />
                  <span>{lang === 'fa' ? 'پرداخت امن SSL' : 'SSL Secure'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'fa' ? 'ضمانت بازگشت' : '7-Day Return'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
