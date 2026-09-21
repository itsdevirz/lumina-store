import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, ArrowLeft, ArrowRight, Tag, Truck, ShieldCheck, Check } from 'lucide-react';
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

  const currentSubtotal = cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartDrawerOpen(false)}
          className="absolute inset-0 bg-black/50 backdrop-blur-xs"
        />

        <div className="fixed inset-y-0 right-0 rtl:right-0 ltr:right-auto ltr:left-0 max-w-full flex pl-10 rtl:pl-10 rtl:pr-0 ltr:pr-10 ltr:pl-0">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="w-screen max-w-md bg-white dark:bg-[#0C0C0E] shadow-2xl flex flex-col border-l rtl:border-l-0 rtl:border-r border-zinc-200 dark:border-zinc-800"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-zinc-400" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono">
                  {lang === 'fa' ? 'سبد خرید' : 'Active Cart'}
                </h2>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </div>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="py-16 text-center text-zinc-400">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                    {lang === 'fa' ? 'سبد خرید شما خالی است' : 'Your cart is empty'}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    {lang === 'fa' ? 'محصولات را از کاتالوگ اضافه فرمایید.' : 'Browse the catalog to add artifacts.'}
                  </p>
                  <button
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      setActiveTab('shop');
                    }}
                    className="mt-4 px-3 py-1.5 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-medium cursor-pointer"
                  >
                    {lang === 'fa' ? 'مشاهده کاتالوگ' : 'Explore Catalog'}
                  </button>
                </div>
              ) : (
                cart.map(item => {
                  const key = `${item.product.id}-${item.selectedColor || ''}-${item.selectedSize || ''}`;
                  return (
                    <div
                      key={key}
                      className="flex items-start gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 text-xs"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-14 h-14 rounded object-cover bg-zinc-100 dark:bg-zinc-800 shrink-0 img-outline"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                            {lang === 'fa' ? item.product.nameFa : item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                            className="text-zinc-400 hover:text-rose-500 cursor-pointer shrink-0 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Variant Labels */}
                        {(item.selectedColor || item.selectedSize) && (
                          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-mono text-zinc-400">
                            {item.selectedColor && (
                              <span className="flex items-center gap-1">
                                {item.selectedColorHex && (
                                  <span
                                    className="w-2 h-2 rounded-full border border-zinc-300"
                                    style={{ backgroundColor: item.selectedColorHex }}
                                  />
                                )}
                                {item.selectedColor}
                              </span>
                            )}
                            {item.selectedSize && <span>/ {item.selectedSize}</span>}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-2 pt-1">
                          {/* Quantity control */}
                          <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                              className="px-2 py-0.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-mono"
                            >
                              -
                            </button>
                            <span className="px-2 py-0.5 font-mono tabular-nums text-[11px] text-zinc-900 dark:text-zinc-100">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                              className="px-2 py-0.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-mono"
                            >
                              +
                            </button>
                          </div>

                          {/* Price */}
                          <span className="font-mono tabular-nums font-semibold text-zinc-900 dark:text-zinc-100">
                            {formatPrice(item.product.price * item.quantity, (item.product.priceUSD || 0) * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3 bg-zinc-50/50 dark:bg-zinc-900/30">
                {/* Coupon input */}
                <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder={lang === 'fa' ? 'کد تخفیف (مثلاً LUMINA10)...' : 'Promo code...'}
                    className="flex-1 px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0C0C0E] text-xs font-mono uppercase focus:outline-none focus:border-[#62DB00]"
                  />
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-mono font-medium hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer disabled:opacity-50 tactile-press"
                  >
                    {isApplying ? '...' : lang === 'fa' ? 'اعمال' : 'Apply'}
                  </button>
                </form>

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">
                    <span>COUPON: {appliedCoupon.code} (-{(appliedCoupon as any).percent ?? (appliedCoupon as any).discountPercent}%)</span>
                    <button onClick={removeCoupon} className="text-zinc-400 hover:text-rose-500">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Subtotal / Total */}
                <div className="space-y-1 pt-1 border-t border-zinc-200 dark:border-zinc-800 text-xs">
                  <div className="flex justify-between text-zinc-400 font-mono text-[11px]">
                    <span>{lang === 'fa' ? 'جمع اقلام:' : 'Subtotal:'}</span>
                    <span className="tabular-nums">{formatPrice(currentSubtotal, Math.round(currentSubtotal / 50000))}</span>
                  </div>
                  <div className="flex justify-between font-mono font-semibold text-sm text-zinc-900 dark:text-zinc-100 pt-1">
                    <span>{lang === 'fa' ? 'مبلغ نهایی:' : 'Total:'}</span>
                    <span className="tabular-nums">{formatPrice(cartTotal.total, Math.round(cartTotal.total / 50000))}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-2.5 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-medium hover:bg-[#62DB00] hover:text-black dark:hover:bg-[#62DB00] dark:hover:text-black transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs tactile-press"
                >
                  <span>{lang === 'fa' ? 'تکمیل سفارش و پرداخت' : 'Proceed to Checkout'}</span>
                  <span className="font-mono text-[11px]">→</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
