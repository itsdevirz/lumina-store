import React from 'react';
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const TrustBadges: React.FC = () => {
  const { lang } = useStore();

  const badges = [
    {
      icon: <Truck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      titleFa: 'ارسال سریع و مطمئن',
      titleEn: 'Express Shipping',
      descFa: 'بسته‌بندی ایمن و ارسال فوری به سراسر کشور',
      descEn: 'Fast & secured delivery'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
      titleFa: 'ضمانت اصالت و سلامت',
      titleEn: '100% Genuine Guarantee',
      descFa: 'ضمانت ۱۸ ماهه رسمی تمامی محصولات',
      descEn: 'Official 18-month warranty'
    },
    {
      icon: <RotateCcw className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      titleFa: '۷ روز مهلت بازگشت کالا',
      titleEn: '7-Day Return Policy',
      descFa: 'امکان عودت و تعویض آسان در صورت هرگونه مغایرت',
      descEn: 'Hassle-free replacement'
    },
    {
      icon: <Headphones className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      titleFa: 'پشتیبانی تخصصی ۲۴/۷',
      titleEn: '24/7 Expert Support',
      descFa: 'پاسخگویی فنی کارشناسان و هوش مصنوعی لومینا',
      descEn: 'Live specialist assistance'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 select-none">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
        {badges.map((badge, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-200/60 dark:border-zinc-800">
              {badge.icon}
            </div>
            <div className="text-right rtl:text-right ltr:text-left min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {lang === 'fa' ? badge.titleFa : badge.titleEn}
              </h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug mt-0.5 truncate">
                {lang === 'fa' ? badge.descFa : badge.descEn}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
