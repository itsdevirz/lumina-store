import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, ArrowLeft, Tag, Truck, ShieldCheck, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
    formatPrice,
    lang,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setActiveTab
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      setIsApplying(true);
      const ok = await applyCoupon(couponCode);
      setIsApplying(false);
      if (ok) setCouponCode('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    setActiveTab('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const freeShippingThreshold = 15000000;
  const currentSubtotal = cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const freeShippingLeft = Math.max(0, freeShippingThreshold - currentSubtotal);
  const freeShippingPercent = Math.min(100, Math.round((currentSubtotal / freeShippingThreshold) * 100));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartDrawerOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 rtl:right-0 ltr:right-auto ltr:left-0 max-w-full flex pl-10 rtl:pl-10 rtl:pr-0 ltr:pr-10 ltr:pl-0">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            className="w-screen max-w-md bg-white dark:bg-[#090D16] shadow-2xl flex flex-col border-l rtl:border-l-0 rtl:border-r border-slate-200 dark:border-slate-800"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200/90 dark:border-slate-800/90">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {lang === 'fa' ? 'سبد خرید شما' : 'Shopping Cart'}
                </h2>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-full font-bold tabular-nums">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </div>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            {cart.length > 0 && (
              <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/40 text-xs">
                <div className="flex items-center justify-between mb-1.5 font-medium">
                  <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <Truck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>
                      {freeShippingLeft === 0
                        ? (lang === 'fa' ? 'سفارش شما مشمول ارسال رایگان شد! 🎉' : 'You unlocked free shipping! 🎉')
                        : (lang === 'fa' ? `تنها ${formatPrice(freeShippingLeft)} تا ارسال رایگان` : `${formatPrice(freeShippingLeft)} away from free shipping`)}
                    </span>
                  </div>
                  <span className="font-bold text-blue-600 dark:text-blue-400 tabular-nums">{freeShippingPercent}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {lang === 'fa' ? 'سبد خرید شما در حال حاضر خالی است' : 'Your cart is empty'}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs mb-5 leading-relaxed">
                    {lang === 'fa'
                      ? 'محصولات جذاب لومینا را بررسی کنید و کالاهای مدنظر خود را به سبد بیفزایید.'
                      : 'Explore our catalog and add items to your cart.'}
                  </p>
                  <button
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      setActiveTab('shop');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    {lang === 'fa' ? 'مشاهده کاتالوگ فروشگاه' : 'Start Shopping'}
                  </button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div
                    key={item.variantId ? `${item.product.id}-${item.variantId}-${idx}` : `${item.product.id}-${item.selectedColor || ''}-${item.selectedSize || ''}-${idx}`}
                    className="flex gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90"
                  >
                    <img
                      src={item.selectedVariant?.image || item.product.images[0]}
                      alt={item.product.name}
                      className="w-18 h-18 rounded-xl object-cover bg-white shrink-0"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {lang === 'fa' ? item.product.nameFa : item.product.name}
                        </h4>

                        {/* Selected Variant Attributes */}
                        {(item.selectedColor || item.selectedSize || (item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0)) && (
                          <div className="flex flex-wrap items-center gap-1 mt-1 text-[10.5px]">
                            {item.selectedColor && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                                {item.selectedColorHex && (
                                  <span className="w-2 h-2 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: item.selectedColorHex }} />
                                )}
                                <span>{item.selectedColor}</span>
                              </span>
                            )}
                            {item.selectedSize && (
                              <span className="px-1.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                                {lang === 'fa' ? `سایز ${item.selectedSize}` : `Size ${item.selectedSize}`}
                              </span>
                            )}
                            {item.selectedAttributes && Object.entries(item.selectedAttributes).map(([k, v]) => (
                              <span key={k} className="px-1.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                                {k}: {v}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="text-xs font-black text-blue-600 dark:text-blue-400 mt-1 tabular-nums">
                          {formatPrice((item.selectedVariant?.price ?? item.product.price) * item.quantity, item.product.priceUSD * item.quantity)}
                        </div>
                      </div>

                      {/* Quantity Stepper & Remove */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                          <button
                            onClick={() => updateCartQuantity(idx, -1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 text-xs rounded-r-md rtl:rounded-r-none rtl:rounded-l-md cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(idx, 1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 text-xs rounded-l-md rtl:rounded-l-none rtl:rounded-r-md cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="حذف از سبد"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer: Coupon & Checkout Summary */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#090D16] space-y-3">
                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      placeholder={lang === 'fa' ? 'کد تخفیف (مثال: LUMINA20)' : 'Coupon code...'}
                      className="w-full pl-3 pr-8 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase"
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
                </form>

                {/* Applied Coupon Tag */}
                {appliedCoupon && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    <span>کد «{appliedCoupon.code}» اعمال شد ({appliedCoupon.percent}٪ تخفیف)</span>
                    <button onClick={removeCoupon} className="text-rose-600 hover:underline cursor-pointer">
                      {lang === 'fa' ? 'حذف' : 'Remove'}
                    </button>
                  </div>
                )}

                {/* Pricing Summary */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>{lang === 'fa' ? 'جمع اقلام سفارش' : 'Subtotal'}</span>
                    <span className="tabular-nums font-semibold">{formatPrice(cartTotal.subtotal, cartTotal.subtotalUSD)}</span>
                  </div>

                  {cartTotal.discount > 0 && (
                    <div className="flex justify-between text-rose-600 dark:text-rose-400 font-bold">
                      <span>{lang === 'fa' ? 'سود شما از خرید' : 'Discount'}</span>
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

                  <div className="flex justify-between text-slate-900 dark:text-white font-black text-sm pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span>{lang === 'fa' ? 'مبلغ نهایی پرداخت' : 'Total'}</span>
                    <span className="tabular-nums text-blue-600 dark:text-blue-400">{formatPrice(cartTotal.total, cartTotal.totalUSD)}</span>
                  </div>
                </div>

                {/* Proceed to Checkout Button */}
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>{lang === 'fa' ? 'ادامه ثبت سفارش و پرداخت' : 'Proceed to Checkout'}</span>
                  <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
