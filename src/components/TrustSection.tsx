import React from 'react';
import { Truck, ShieldCheck, RotateCcw, Headphones, CreditCard } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const TrustSection: React.FC = () => {
  const { lang } = useStore();

  const benefits = [
    {
      id: 'delivery',
      icon: Truck,
      titleFa: 'تحویل سریع و اکسپرس',
      titleEn: 'Express Delivery',
      descFa: 'تحویل سریع و مطمئن در سراسر کشور',
      descEn: 'Fast & tracked nationwide shipping',
      color: 'text-[#E80645] dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-900/40'
    },
    {
      id: 'authentic',
      icon: ShieldCheck,
      titleFa: 'ضمانت ۱۰۰٪ اصالت کالا',
      titleEn: '100% Authentic',
      descFa: 'کالاهای دارای گارانتی رسمی و معتبر',
      descEn: 'Guaranteed original brand hardware',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40'
    },
    {
      id: 'return',
      icon: RotateCcw,
      titleFa: '۷ روز مهلت بازگشت',
      titleEn: '7 Days Return',
      descFa: 'استرداد بی‌قید و شرط طبق ضوابط',
      descEn: 'Hassle-free 7-day refund guarantee',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40'
    },
    {
      id: 'support',
      icon: Headphones,
      titleFa: 'پشتیبانی ۲۴ ساعته',
      titleEn: '24/7 Expert Support',
      descFa: 'مشاوره پیش و پس از خرید توسط کارشناسان',
      descEn: 'Step-by-step guidance from tech specialists',
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200/60 dark:border-purple-900/40'
    },
    {
      id: 'payment',
      icon: CreditCard,
      titleFa: 'پرداخت امن و منعطف',
      titleEn: 'Secure Payment',
      descFa: 'درگاه‌های معتبر بانکی و اقساطی',
      descEn: 'Encrypted multi-gateway & installments',
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-900/40'
    }
  ];

  return (
    <section className="py-6 sm:py-8 border-y border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-[#111827]/70 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/70 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 border ${item.bg} ${item.color}`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white truncate">
                    {lang === 'fa' ? item.titleFa : item.titleEn}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5">
                    {lang === 'fa' ? item.descFa : item.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
