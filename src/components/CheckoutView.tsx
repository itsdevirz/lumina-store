import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Check,
  Truck,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  PackageCheck,
  Copy,
  MapPin,
  Phone,
  User,
  Building,
  Mail,
  Receipt,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartTotal,
    formatPrice,
    lang,
    setActiveTab,
    placeOrder,
    currentUser,
    addToast
  } = useStore();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || 'کیان مهرآذر',
    phone: currentUser?.phone || '۰۹۱۲۳۴۵۶۷۸۹',
    city: 'تهران',
    address: 'ونک، خیابان ملاصدرا، برج فناوری لومینا، طبقه ۴',
    postalCode: '۱۹۹۱۸۵۴۳۲۱',
    shippingMethod: 'express', // express | standard | tipax
    paymentMethod: 'online_gateway' // online_gateway | card_to_card | cod
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateStep1 = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.fullName.trim())
      errs.fullName = lang === 'fa' ? 'نام و نام خانوادگی الزامی است' : 'Full name is required';
    if (!formData.phone.trim() || formData.phone.length < 10)
      errs.phone = lang === 'fa' ? 'شماره تماس معتبر نیست' : 'Valid phone is required';
    if (!formData.city.trim())
      errs.city = lang === 'fa' ? 'نام شهر الزامی است' : 'City is required';
    if (!formData.address.trim() || formData.address.length < 8)
      errs.address =
        lang === 'fa' ? 'نشانی دقیق پستی الزامی است' : 'Detailed address is required';
    if (!formData.postalCode.trim() || formData.postalCode.length < 5)
      errs.postalCode =
        lang === 'fa' ? 'کد پستی ۱۰ رقمی الزامی است' : 'Postal code required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleFinalPayment = async () => {
    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const orderId = await placeOrder(
        {
          fullName: formData.fullName,
          phone: formData.phone,
          city: formData.city,
          address: formData.address,
          postalCode: formData.postalCode
        },
        formData.paymentMethod === 'online_gateway'
          ? lang === 'fa'
            ? 'درگاه شاپرک سامان'
            : 'Online Gateway'
          : formData.paymentMethod === 'cod'
          ? lang === 'fa'
            ? 'پرداخت در محل'
            : 'Cash on Delivery'
          : lang === 'fa'
          ? 'کارت به کارت'
          : 'Card Transfer'
      );

      setCreatedOrderId(orderId);
      setIsProcessing(false);
      setCurrentStep(4);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    } catch {
      setIsProcessing(false);
    }
  };

  const steps = [
    { num: 1, title: lang === 'fa' ? 'مشخصات تحویل' : 'Address' },
    { num: 2, title: lang === 'fa' ? 'روش ارسال' : 'Shipping' },
    { num: 3, title: lang === 'fa' ? 'شیوه پرداخت' : 'Payment' },
    { num: 4, title: lang === 'fa' ? 'تایید نهایی' : 'Confirmation' }
  ];

  const totalAmount = typeof cartTotal === 'number' ? cartTotal : (cartTotal.total || cartTotal.subtotal);

  if (cart.length === 0 && currentStep !== 4) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4 select-none">
        <h2 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100">
          {lang === 'fa' ? 'سبد خرید شما خالی است' : 'Your cart is empty'}
        </h2>
        <p className="text-xs text-zinc-400 mb-6">
          {lang === 'fa'
            ? 'برای ادامه فرآیند خرید، ابتدا کالاهای مورد نظر خود را انتخاب فرمایید.'
            : 'Please add items to your cart before proceeding to checkout.'}
        </p>
        <button
          onClick={() => setActiveTab('shop')}
          className="px-6 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs shadow-xs hover:bg-[#62DB00] hover:text-black transition-colors cursor-pointer"
        >
          {lang === 'fa' ? 'بازگشت به فروشگاه' : 'Go to Shop'}
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-10 select-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Step Progress Stepper */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative px-4 sm:px-12">
            <div className="absolute top-1/2 inset-x-10 sm:inset-x-20 -translate-y-1/2 h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-0" />
            {steps.map(s => {
              const isDone = currentStep > s.num;
              const isCurrent = currentStep === s.num;

              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all ${
                      isDone
                        ? 'bg-[#62DB00] text-black shadow-xs'
                        : isCurrent
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 scale-105 ring-4 ring-[#62DB00]/20'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                  </div>
                  <span
                    className={`text-[11px] font-bold mt-2 hidden sm:inline ${
                      isCurrent
                        ? 'text-zinc-950 dark:text-white font-black'
                        : isDone
                        ? 'text-[#62DB00] font-bold'
                        : 'text-zinc-400'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 4: SUCCESS VIEW */}
        {currentStep === 4 ? (
          <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800/80 text-center shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-[#62DB00]/10 text-[#62DB00] flex items-center justify-center mx-auto mb-4 border border-[#62DB00]/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mb-2">
              {lang === 'fa' ? 'سفارش شما با موفقیت ثبت شد!' : 'Order Placed Successfully!'}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-6 leading-relaxed">
              {lang === 'fa'
                ? 'فاکتور الکترونیکی صادر گردید و پیامک تایید با شماره رهگیری برای شما ارسال شد.'
                : 'Order confirmation with tracking number has been generated and dispatched.'}
            </p>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 text-xs text-right rtl:text-right ltr:text-left space-y-2.5 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">{lang === 'fa' ? 'شماره پیگیری سفارش:' : 'Order ID:'}</span>
                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-700">
                  {createdOrderId || 'LUM-84920'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{lang === 'fa' ? 'تحویل‌گیرنده:' : 'Recipient:'}</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{formData.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{lang === 'fa' ? 'نشانی تحویل:' : 'Destination:'}</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-[260px]">
                  {formData.city}، {formData.address}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-200 dark:border-zinc-700">
                <span className="text-zinc-700 dark:text-zinc-300 font-bold">
                  {lang === 'fa' ? 'مبلغ کل پرداخت‌شده:' : 'Amount Paid:'}
                </span>
                <span className="font-mono font-black text-zinc-950 dark:text-white text-sm">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setActiveTab('account');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-bold hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                {lang === 'fa' ? 'پیگیری در حساب کاربری' : 'Track in Account'}
              </button>
              <button
                onClick={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-2.5 rounded-xl bg-[#62DB00] text-black text-xs font-bold hover:bg-[#72e609] transition-colors cursor-pointer"
              >
                {lang === 'fa' ? 'بازگشت به صفحه اصلی' : 'Back to Home'}
              </button>
            </div>
          </div>
        ) : (
          /* Steps 1, 2, 3 Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column (7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-[#111113] p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
              {/* STEP 1: SHIPPING ADDRESS */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <MapPin className="w-5 h-5 text-[#62DB00]" />
                    <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                      {lang === 'fa' ? '۱. مشخصات و نشانی تحویل‌گیرنده' : '1. Delivery Information'}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        {lang === 'fa' ? 'نام و نام خانوادگی' : 'Full Name'}
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-[#62DB00] focus:outline-none"
                      />
                      {errors.fullName && (
                        <span className="text-[11px] text-rose-500 mt-1 block">
                          {errors.fullName}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        {lang === 'fa' ? 'شماره تلفن همراه' : 'Mobile Phone'}
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-[#62DB00] focus:outline-none"
                      />
                      {errors.phone && (
                        <span className="text-[11px] text-rose-500 mt-1 block">{errors.phone}</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        {lang === 'fa' ? 'شهر محل سکونت' : 'City'}
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-[#62DB00] focus:outline-none"
                      />
                      {errors.city && (
                        <span className="text-[11px] text-rose-500 mt-1 block">{errors.city}</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        {lang === 'fa' ? 'کد پستی ۱۰ رقمی' : 'Postal Code'}
                      </label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-[#62DB00] focus:outline-none font-mono"
                      />
                      {errors.postalCode && (
                        <span className="text-[11px] text-rose-500 mt-1 block">
                          {errors.postalCode}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      {lang === 'fa'
                        ? 'نشانی دقیق پستی (خیابان، کوچه، پلاک، واحد)'
                        : 'Full Address'}
                    </label>
                    <textarea
                      rows={2}
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-[#62DB00] focus:outline-none"
                    />
                    {errors.address && (
                      <span className="text-[11px] text-rose-500 mt-1 block">
                        {errors.address}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: SHIPPING METHOD */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <Truck className="w-5 h-5 text-[#62DB00]" />
                    <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                      {lang === 'fa' ? '۲. انتخاب شیوه ارسال کالا' : '2. Select Shipping Method'}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        id: 'express',
                        title: lang === 'fa' ? 'ارسال سریع اکسپرس لومینا' : 'Lumina Express Direct',
                        time:
                          lang === 'fa'
                            ? 'تحویل امروز یا فردا صبح با هماهنگی تلفنی'
                            : 'Same/Next Day Dedicated Courier',
                        badge: lang === 'fa' ? 'پیشنهادی' : 'Recommended',
                        price: lang === 'fa' ? 'رایگان' : 'Free'
                      },
                      {
                        id: 'tipax',
                        title: lang === 'fa' ? 'تیپاکس / پست پیشتاز بیمه‌شده' : 'Insured Courier Delivery',
                        time:
                          lang === 'fa'
                            ? '۲۴ الی ۴۸ ساعت کاری در سراسر کشور با بیمه کامل'
                            : '1-2 business days nationwide with full insurance',
                        badge: lang === 'fa' ? 'مطمئن' : 'Insured',
                        price: lang === 'fa' ? 'رایگان' : 'Free'
                      }
                    ].map(method => (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                          formData.shippingMethod === method.id
                            ? 'border-[#62DB00] bg-[#62DB00]/5 shadow-xs'
                            : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value={method.id}
                            checked={formData.shippingMethod === method.id}
                            onChange={() => setFormData({ ...formData, shippingMethod: method.id })}
                            className="accent-[#62DB00]"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                                {method.title}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#62DB00]/20 text-[#62DB00]">
                                {method.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-0.5">{method.time}</p>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-xs text-[#62DB00]">
                          {method.price}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT METHOD */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <CreditCard className="w-5 h-5 text-[#62DB00]" />
                    <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                      {lang === 'fa' ? '۳. شیوه پرداخت فاکتور' : '3. Payment Method'}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        id: 'online_gateway',
                        title: lang === 'fa' ? 'درگاه آنلاین شاپرک (کلیه کارت‌های شتاب)' : 'Online Banking Gateway',
                        desc:
                          lang === 'fa'
                            ? 'اتصال امن به درگاه با گواهی SSL ۲۵۶ بیتی'
                            : 'Direct secure bank routing via 256-bit SSL',
                        badge: lang === 'fa' ? 'فوری' : 'Instant'
                      },
                      {
                        id: 'card_to_card',
                        title: lang === 'fa' ? 'کارت به کارت / حواله پایا و ساتنا' : 'Bank Transfer / Wire',
                        desc:
                          lang === 'fa'
                            ? 'ارسال رسید فیش واریزی پس از ثبت سفارش'
                            : 'Upload receipt after placing order'
                      },
                      {
                        id: 'cod',
                        title: lang === 'fa' ? 'پرداخت در محل (تهران)' : 'Cash / Card on Delivery',
                        desc:
                          lang === 'fa'
                            ? 'پرداخت از طریق پوز سیار مامور ارسال'
                            : 'Pay upon physical delivery'
                      }
                    ].map(payment => (
                      <label
                        key={payment.id}
                        className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                          formData.paymentMethod === payment.id
                            ? 'border-[#62DB00] bg-[#62DB00]/5 shadow-xs'
                            : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={payment.id}
                            checked={formData.paymentMethod === payment.id}
                            onChange={() => setFormData({ ...formData, paymentMethod: payment.id })}
                            className="accent-[#62DB00]"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                                {payment.title}
                              </span>
                              {payment.badge && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#62DB00]/20 text-[#62DB00]">
                                  {payment.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-0.5">{payment.desc}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Stepper Buttons */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-zinc-100 dark:border-zinc-800">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((currentStep - 1) as any)}
                    className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    {lang === 'fa' ? 'مرحله قبل' : 'Back'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTab('cart')}
                    className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    {lang === 'fa' ? 'بازگشت به سبد' : 'Back to Cart'}
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-[#62DB00] hover:text-black dark:hover:bg-[#62DB00] dark:hover:text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{lang === 'fa' ? 'ادامه مرحله بعد' : 'Continue'}</span>
                    {lang === 'fa' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinalPayment}
                    disabled={isProcessing}
                    className="px-6 py-2.5 rounded-xl bg-[#62DB00] hover:bg-[#72e609] text-black font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-[#62DB00]/20 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {isProcessing
                        ? lang === 'fa'
                          ? 'در حال پردازش...'
                          : 'Processing...'
                        : lang === 'fa'
                        ? 'پرداخت و ثبت نهایی'
                        : 'Complete Order'}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar (5 cols) */}
            <div className="lg:col-span-5 bg-white dark:bg-[#111113] p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                {lang === 'fa' ? 'اقلام سفارش شما' : 'Cart Overview'}
              </h4>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-9 h-9 rounded-lg object-cover bg-zinc-100 shrink-0 border border-zinc-200 dark:border-zinc-800"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[170px]">
                          {lang === 'fa' ? item.product.nameFa : item.product.name}
                        </p>
                        <p className="text-[10px] font-mono text-zinc-400">
                          {item.quantity} × {formatPrice(item.product.price, item.product.priceUSD)}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-zinc-500">
                  <span>{lang === 'fa' ? 'هزینه ارسال:' : 'Shipping:'}</span>
                  <span className="text-[#62DB00] font-bold">
                    {lang === 'fa' ? 'رایگان' : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-zinc-900 dark:text-zinc-100 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                  <span>{lang === 'fa' ? 'مبلغ نهایی:' : 'Total:'}</span>
                  <span className="font-mono text-base text-zinc-950 dark:text-white font-black">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
