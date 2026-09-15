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
  Receipt
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CheckoutView: React.FC = () => {
  const { cart, cartTotal, formatPrice, lang, setActiveTab, placeOrder, userProfile, addToast } = useStore();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: userProfile.name || 'محمد امین رضایی',
    phone: userProfile.phone || '۰۹۱۲۳۴۵۶۷۸۹',
    city: 'تهران',
    address: 'خیابان ولیعصر، بالاتر از پارک وی، کوچه مهر، پلاک ۱۲، واحد ۴',
    postalCode: '۱۹۶۸۸۱۴۵۳۲',
    shippingMethod: 'express', // express | standard | tipax
    paymentMethod: 'online_gateway' // online_gateway | card_to_card | cod
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateStep1 = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.fullName.trim()) errs.fullName = lang === 'fa' ? 'نام و نام خانوادگی الزامی است' : 'Full name is required';
    if (!formData.phone.trim() || formData.phone.length < 10) errs.phone = lang === 'fa' ? 'شماره تماس معتبر نیست' : 'Valid phone is required';
    if (!formData.city.trim()) errs.city = lang === 'fa' ? 'نام شهر الزامی است' : 'City is required';
    if (!formData.address.trim() || formData.address.length < 10) errs.address = lang === 'fa' ? 'نشانی دقیق پستی الزامی است' : 'Detailed address is required';
    if (!formData.postalCode.trim() || formData.postalCode.length < 5) errs.postalCode = lang === 'fa' ? 'کد پستی ۱۰ رقمی الزامی است' : 'Postal code required';

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
          ? (lang === 'fa' ? 'درگاه شاپرک سامان' : 'Online Gateway')
          : formData.paymentMethod === 'cod'
          ? (lang === 'fa' ? 'پرداخت در محل' : 'Cash on Delivery')
          : (lang === 'fa' ? 'کارت به کارت' : 'Card Transfer')
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
    { num: 1, title: lang === 'fa' ? 'نشانی و مشخصات تحویل' : 'Shipping Address' },
    { num: 2, title: lang === 'fa' ? 'انتخاب روش ارسال' : 'Shipping Method' },
    { num: 3, title: lang === 'fa' ? 'شیوه پرداخت' : 'Payment Method' },
    { num: 4, title: lang === 'fa' ? 'تایید و صدور فاکتور' : 'Confirmation' }
  ];

  if (cart.length === 0 && currentStep !== 4) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
          {lang === 'fa' ? 'سبد خرید شما خالی است' : 'Your cart is empty'}
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          {lang === 'fa' ? 'برای ادامه فرآیند خرید، ابتدا کالاهای مورد نظر خود را انتخاب فرمایید.' : 'Please add items before checkout.'}
        </p>
        <button
          onClick={() => setActiveTab('shop')}
          className="px-6 py-3 rounded-xl bg-[#E80645] text-white font-bold text-xs shadow-xs hover:bg-[#c7053b] transition-colors cursor-pointer"
        >
          {lang === 'fa' ? 'بازگشت به فروشگاه' : 'Go to Shop'}
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Step Progress Stepper */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative px-2 sm:px-6">
            <div className="absolute top-1/2 inset-x-8 sm:inset-x-12 -translate-y-1/2 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0" />
            {steps.map(s => {
              const isDone = currentStep > s.num;
              const isCurrent = currentStep === s.num;

              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-[#E80645] text-white shadow-md shadow-rose-900/25 scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                  </div>
                  <span
                    className={`text-[11px] font-bold mt-2 hidden sm:inline ${
                      isCurrent
                        ? 'text-[#E80645] dark:text-rose-400'
                        : isDone
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400'
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
          <div className="max-w-xl mx-auto p-8 rounded-2xl bg-white dark:bg-[#111726] border border-slate-200/80 dark:border-slate-800/80 text-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-500 flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-900/60">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              {lang === 'fa' ? 'سفارش شما با موفقیت ثبت شد!' : 'Order Placed Successfully!'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
              {lang === 'fa'
                ? 'فاکتور سفارش شما صادر گردید و پیامک تایید با شماره رهگیری برای شما ارسال شد.'
                : 'Order confirmation with tracking number has been dispatched.'}
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs text-right space-y-2.5 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">{lang === 'fa' ? 'شماره پیگیری سفارش:' : 'Order ID:'}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                  {createdOrderId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{lang === 'fa' ? 'تحویل‌گیرنده:' : 'Recipient:'}</span>
                <span className="font-bold text-slate-900 dark:text-white">{formData.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{lang === 'fa' ? 'نشانی تحویل:' : 'Destination:'}</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[260px]">{formData.city}، {formData.address}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-700 dark:text-slate-300 font-bold">{lang === 'fa' ? 'مبلغ کل پرداخت‌شده:' : 'Amount Paid:'}</span>
                <span className="font-black text-[#E80645] dark:text-rose-400 text-sm">{formatPrice(cartTotal.total, cartTotal.totalUSD)}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setActiveTab('account');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                {lang === 'fa' ? 'پیگیری در حساب کاربری' : 'Track in Account'}
              </button>
              <button
                onClick={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-2.5 rounded-xl bg-[#E80645] text-white text-xs font-bold hover:bg-[#c7053b] transition-colors cursor-pointer"
              >
                {lang === 'fa' ? 'بازگشت به صفحه اصلی' : 'Back to Home'}
              </button>
            </div>
          </div>
        ) : (
          /* Steps 1, 2, 3 Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Column (7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-[#111726] p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
              
              {/* STEP 1: SHIPPING ADDRESS */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <MapPin className="w-5 h-5 text-[#E80645]" />
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {lang === 'fa' ? '۱. مشخصات و نشانی تحویل‌گیرنده' : '1. Delivery Information'}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {lang === 'fa' ? 'نام و نام خانوادگی' : 'Full Name'}
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#E80645] focus:outline-none"
                      />
                      {errors.fullName && <span className="text-[11px] text-rose-500 mt-1 block">{errors.fullName}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {lang === 'fa' ? 'شماره تلفن همراه' : 'Mobile Phone'}
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#E80645] focus:outline-none"
                      />
                      {errors.phone && <span className="text-[11px] text-rose-500 mt-1 block">{errors.phone}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {lang === 'fa' ? 'شهر محل سکونت' : 'City'}
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#E80645] focus:outline-none"
                      />
                      {errors.city && <span className="text-[11px] text-rose-500 mt-1 block">{errors.city}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {lang === 'fa' ? 'کد پستی ۱۰ رقمی' : 'Postal Code'}
                      </label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#E80645] focus:outline-none font-mono"
                      />
                      {errors.postalCode && <span className="text-[11px] text-rose-500 mt-1 block">{errors.postalCode}</span>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {lang === 'fa' ? 'نشانی دقیق پستی (خیابان، کوچه، پلاک، زنگ/واحد)' : 'Full Address'}
                    </label>
                    <textarea
                      rows={2}
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#E80645] focus:outline-none"
                    />
                    {errors.address && <span className="text-[11px] text-rose-500 mt-1 block">{errors.address}</span>}
                  </div>
                </div>
              )}

              {/* STEP 2: SHIPPING METHOD */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <Truck className="w-5 h-5 text-[#E80645]" />
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {lang === 'fa' ? '۲. انتخاب شیوه ارسال کالا' : '2. Select Shipping Method'}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        id: 'express',
                        title: lang === 'fa' ? 'ارسال سریع اکسپرس لومینا' : 'Lumina Express',
                        time: lang === 'fa' ? 'تحویل امروز یا فردا صبح با هماهنگی تلفنی' : 'Same/Next Day Delivery',
                        badge: lang === 'fa' ? 'سریع‌ترین' : 'Fastest',
                        price: lang === 'fa' ? 'رایگان' : 'Free'
                      },
                      {
                        id: 'tipax',
                        title: lang === 'fa' ? 'تیپاکس / پست پیشتاز بیمه‌شده' : 'Insured Post / Tipax',
                        time: lang === 'fa' ? '۲۴ الی ۴۸ ساعت کاری در سراسر کشور' : '1-2 business days nationwide',
                        badge: lang === 'fa' ? 'مطمئن' : 'Secure',
                        price: lang === 'fa' ? 'رایگان' : 'Free'
                      }
                    ].map(method => (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                          formData.shippingMethod === method.id
                            ? 'border-[#E80645] bg-rose-50/50 dark:bg-rose-950/20 shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={formData.shippingMethod === method.id}
                            onChange={() => setFormData({ ...formData, shippingMethod: method.id })}
                            className="text-[#E80645] focus:ring-[#E80645] w-4 h-4 cursor-pointer accent-[#E80645]"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">{method.title}</span>
                              <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/60 text-[#E80645] dark:text-rose-300 text-[10px] font-bold">
                                {method.badge}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{method.time}</div>
                          </div>
                        </div>
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{method.price}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT METHOD */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <CreditCard className="w-5 h-5 text-[#E80645]" />
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {lang === 'fa' ? '۳. انتخاب درگاه و نحوه پرداخت' : '3. Payment Method'}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        id: 'online_gateway',
                        title: lang === 'fa' ? 'درگاه شاپرک اینترنتی (کلیه کارت‌های بانکی)' : 'Online Payment (Saman Bank Gateway)',
                        desc: lang === 'fa' ? 'پرداخت آنی و امن با کلیه کارت‌های عضو شتاب به همراه رمز پویا' : 'Instant and secure card transaction',
                        badge: lang === 'fa' ? 'پیشنهادی' : 'Recommended'
                      },
                      {
                        id: 'card_to_card',
                        title: lang === 'fa' ? 'کارت به کارت / حواله پایا و ساتنا' : 'Card / Bank Wire Transfer',
                        desc: lang === 'fa' ? 'واریز به شماره حساب شرکت و ارسال فیش تراکنش' : 'Direct bank transfer',
                        badge: null
                      },
                      {
                        id: 'cod',
                        title: lang === 'fa' ? 'پرداخت در محل هنگام تحویل (مخصوص شهر تهران)' : 'Cash on Delivery (Tehran only)',
                        desc: lang === 'fa' ? 'تسویه با کارت‌خوان سیار پس از بررسی سلامت ظاهری کالا' : 'Pay via POS machine at door',
                        badge: null
                      }
                    ].map(payment => (
                      <label
                        key={payment.id}
                        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          formData.paymentMethod === payment.id
                            ? 'border-[#E80645] bg-rose-50/50 dark:bg-rose-950/20 shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={formData.paymentMethod === payment.id}
                          onChange={() => setFormData({ ...formData, paymentMethod: payment.id })}
                          className="mt-0.5 text-[#E80645] focus:ring-[#E80645] w-4 h-4 cursor-pointer accent-[#E80645]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{payment.title}</span>
                            {payment.badge && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                                {payment.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{payment.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step Action Buttons */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
                {currentStep > 1 ? (
                  <button
                    onClick={() => setCurrentStep((currentStep - 1) as any)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {lang === 'fa' ? 'بازگشت به مرحله قبل' : 'Back'}
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('cart')}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {lang === 'fa' ? 'بازگشت به سبد خرید' : 'Back to Cart'}
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    onClick={handleNextStep}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#E80645] text-white font-bold text-xs shadow-md shadow-rose-900/20 hover:bg-[#c7053b] transition-colors cursor-pointer active:scale-98"
                  >
                    <span>{lang === 'fa' ? 'ادامه مرحله بعد' : 'Continue'}</span>
                    <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinalPayment}
                    disabled={isProcessing}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors disabled:opacity-50 cursor-pointer active:scale-98"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isProcessing ? 'در حال اتصال به شاپرک...' : (lang === 'fa' ? 'پرداخت و ثبت نهایی سفارش' : 'Complete & Pay')}</span>
                  </button>
                )}
              </div>
            </div>

            {/* ORDER SUMMARY SIDEBAR (5 cols) */}
            <div className="lg:col-span-5 bg-white dark:bg-[#111726] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs sticky top-24 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[#E80645]" />
                  <span>{lang === 'fa' ? 'خلاصه فاکتور خرید' : 'Order Summary'}</span>
                </h4>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold tabular-nums">
                  {cart.reduce((a, b) => a + b.quantity, 0)} کالا
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={item.variantId ? `${item.product.id}-${item.variantId}-${idx}` : `${item.product.id}-${idx}`} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={item.selectedVariant?.image || item.product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-white shrink-0 border border-slate-200/80 dark:border-slate-700" />
                      <div className="truncate">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                          {lang === 'fa' ? item.product.nameFa : item.product.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400 mt-0.5">
                          <span>{item.quantity} عدد</span>
                          {item.selectedColor && <span>• {item.selectedColor}</span>}
                          {item.selectedSize && <span>• سایز {item.selectedSize}</span>}
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white shrink-0 tabular-nums">
                      {formatPrice(item.product.price * item.quantity, item.product.priceUSD * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-slate-500">
                  <span>{lang === 'fa' ? 'جمع اقلام سفارش' : 'Subtotal'}</span>
                  <span className="tabular-nums font-semibold">{formatPrice(cartTotal.subtotal, cartTotal.subtotalUSD)}</span>
                </div>

                {cartTotal.discount > 0 && (
                  <div className="flex justify-between text-[#E80645] dark:text-rose-400 font-bold">
                    <span>{lang === 'fa' ? 'تخفیف کوپن' : 'Discount'}</span>
                    <span className="tabular-nums">-{formatPrice(cartTotal.discount, cartTotal.discountUSD)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-500">
                  <span>{lang === 'fa' ? 'هزینه ارسال' : 'Shipping'}</span>
                  <span className="tabular-nums font-semibold">
                    {cartTotal.shipping === 0 ? (lang === 'fa' ? 'رایگان' : 'Free') : formatPrice(cartTotal.shipping, cartTotal.shippingUSD)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-900 dark:text-white font-black text-sm pt-3 border-t border-slate-200 dark:border-slate-800">
                  <span>{lang === 'fa' ? 'مبلغ نهایی قابل پرداخت' : 'Grand Total'}</span>
                  <span className="tabular-nums text-[#E80645] dark:text-rose-400 text-base">{formatPrice(cartTotal.total, cartTotal.totalUSD)}</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
