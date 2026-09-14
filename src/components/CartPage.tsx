import React, { useState } from 'react';
import { ShoppingBag, Trash2, Heart, ArrowLeft, ArrowRight, Tag, ShieldCheck, Truck, RotateCcw, CheckCircle2 } from 'lucide-react';
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
    toggleWishlist
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
      <div className="py-20 max-w-7xl mx-auto px-4 text-center">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-5 shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
          {lang === 'fa' ? 'سبد خرید شما در حال حاضر خالی است' : 'Your Shopping Cart is Empty'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
          {lang === 'fa'
            ? 'به نظر می‌رسد هنوز هیچ کالایی به سبد خرید خود اضافه نکرده‌اید. همین حالا کاتالوگ محصولات لومینا را بررسی کنید.'
            : 'You have not added any items yet. Explore our curated collections today.'}
        </p>
        <button
          onClick={() => setActiveTab('shop')}
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/25 transition-all active:scale-95 cursor-pointer"
        >
          <span>{lang === 'fa' ? 'مشاهده کاتالوگ فروشگاه' : 'Explore Catalog'}</span>
          <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
        </button>
      </div>
    );
  }

  // Free shipping progress calculation (Free shipping over 15,000,000 Toman)
  const freeShippingThreshold = 15000000;
  const freeShippingProgress = Math.min(100, Math.round((cartTotal.subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal.subtotal);

  return (
    <div className="py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Heading */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
              {lang === 'fa' ? 'مدیریت خرید' : 'Checkout Flow'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {lang === 'fa' ? 'سبد خرید و اقلام انتخابی' : 'Shopping Cart'}
            </h1>
          </div>

          <button
            onClick={() => setActiveTab('shop')}
            className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>{lang === 'fa' ? 'ادامه خرید از فروشگاه' : 'Continue Shopping'}</span>
            <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* ITEMS COLUMN (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Free Shipping Tracker Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  {remainingForFreeShipping === 0 ? (
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {lang === 'fa' ? 'تبریک! سفارش شما مشمول ارسال اکسپرس رایگان است 🎉' : 'Your order qualifies for FREE Express Shipping 🎉'}
                    </span>
                  ) : (
                    <span>
                      {lang === 'fa'
                        ? `تنها ${formatPrice(remainingForFreeShipping)} دیگر تا ارسال رایگان اکسپرس`
                        : `Add ${formatPrice(remainingForFreeShipping)} more to qualify for Free Shipping`}
                    </span>
                  )}
                </div>
                <span className="font-bold text-blue-600 dark:text-blue-400 tabular-nums">{freeShippingProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3">
              {cart.map((item, idx) => (
                <div
                  key={item.variantId ? `${item.product.id}-${item.variantId}-${idx}` : `${item.product.id}-${item.selectedColor || ''}-${item.selectedSize || ''}-${idx}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 shadow-sm"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <img
                      src={item.selectedVariant?.image || item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-800"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">
                        {item.product.brand}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {lang === 'fa' ? item.product.nameFa : item.product.name}
                      </h3>

                      {/* Variant Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[11px]">
                        {item.selectedColor && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                            {item.selectedColorHex && (
                              <span className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: item.selectedColorHex }} />
                            )}
                            <span>{item.selectedColor}</span>
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                            {lang === 'fa' ? `سایز ${item.selectedSize}` : `Size ${item.selectedSize}`}
                          </span>
                        )}
                        {item.selectedAttributes && Object.entries(item.selectedAttributes).map(([k, v]) => (
                          <span key={k} className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                            {k}: {v}
                          </span>
                        ))}
                      </div>

                      <div className="text-xs font-black text-blue-600 dark:text-blue-400 mt-2 sm:hidden tabular-nums">
                        {formatPrice((item.selectedVariant?.price ?? item.product.price) * item.quantity, item.product.priceUSD * item.quantity)}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    {/* Stepper */}
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 p-0.5">
                      <button
                        onClick={() => updateCartQuantity(idx, -1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 text-xs rounded-lg cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(idx, 1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 text-xs rounded-lg cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Price Column on Desktop */}
                    <div className="hidden sm:block text-right min-w-[120px]">
                      <div className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
                        {formatPrice((item.selectedVariant?.price ?? item.product.price) * item.quantity, item.product.priceUSD * item.quantity)}
                      </div>
                      <div className="text-[10.5px] text-slate-400 font-normal">
                        {formatPrice(item.selectedVariant?.price ?? item.product.price, item.product.priceUSD)} / {lang === 'fa' ? 'هر عدد' : 'unit'}
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeFromCart(idx)}
                      className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title={lang === 'fa' ? 'حذف کالا' : 'Remove item'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* SUMMARY SIDEBAR (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 shadow-sm sticky top-24 space-y-4">
              <h2 className="text-base font-black text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                {lang === 'fa' ? 'خلاصه فاکتور سفارش' : 'Order Summary'}
              </h2>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      placeholder={lang === 'fa' ? 'کد تخفیف (مثال: LUMINA20)' : 'Coupon code...'}
                      className="w-full pl-3 pr-8 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none uppercase"
                    />
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3" />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplying || !couponCode.trim()}
                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {isApplying ? '...' : (lang === 'fa' ? 'اعمال' : 'Apply')}
                  </button>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    <span>کد «{appliedCoupon.code}» اعمال شد ({appliedCoupon.percent}٪ تخفیف)</span>
                    <button onClick={removeCoupon} className="text-rose-600 hover:underline cursor-pointer">
                      {lang === 'fa' ? 'حذف' : 'Remove'}
                    </button>
                  </div>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs pt-2">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>{lang === 'fa' ? 'قیمت کل کالاها' : 'Subtotal'}</span>
                  <span className="tabular-nums font-semibold">{formatPrice(cartTotal.subtotal, cartTotal.subtotalUSD)}</span>
                </div>

                {cartTotal.discount > 0 && (
                  <div className="flex justify-between text-rose-600 dark:text-rose-400 font-bold">
                    <span>{lang === 'fa' ? 'تخفیف اعمال‌شده' : 'Discount'}</span>
                    <span className="tabular-nums">-{formatPrice(cartTotal.discount, cartTotal.discountUSD)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>{lang === 'fa' ? 'هزینه ارسال' : 'Shipping'}</span>
                  <span className="tabular-nums font-semibold">
                    {cartTotal.shipping === 0
                      ? (lang === 'fa' ? 'رایگان' : 'Free')
                      : formatPrice(cartTotal.shipping, cartTotal.shippingUSD)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-900 dark:text-white font-black text-sm pt-3 border-t border-slate-200 dark:border-slate-800">
                  <span>{lang === 'fa' ? 'مبلغ قابل پرداخت' : 'Total Amount'}</span>
                  <span className="tabular-nums text-blue-600 dark:text-blue-400 text-base">
                    {formatPrice(cartTotal.total, cartTotal.totalUSD)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  setActiveTab('checkout');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>{lang === 'fa' ? 'ثبت سفارش و ادامه خرید' : 'Proceed to Checkout'}</span>
                <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
              </button>

              {/* Security Seals */}
              <div className="pt-2 text-[11px] text-slate-400 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{lang === 'fa' ? 'پرداخت امن و تضمین سلامت فیزیکی' : 'Safe and secure encrypted payment'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{lang === 'fa' ? '۷ روز مهلت بازگشت وجه بی‌قید و شرط' : '7 days money back guarantee'}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
