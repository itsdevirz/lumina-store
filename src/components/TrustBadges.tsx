import React from 'react';
import { Truck, ShieldCheck, RotateCcw, Headphones, Award } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const TrustBadges: React.FC = () => {
  const { lang } = useStore();

  const badges = [
    {
      icon: <Truck className="w-5 h-5 text-[#62DB00]" />,
      titleFa: 'ارسال اکسپرس و امن',
      titleEn: 'Express Insured Shipping',
      descFa: 'بسته‌بندی ضربه‌گیر ویژه با ارسال فوری به سراسر کشور',
      descEn: 'Dispatched in shock-absorbent protective packaging'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-sky-400" />,
      titleFa: 'ضمانت اصالت ۲۴ ماهه',
      titleEn: 'Official 2-Year Warranty',
      descFa: 'تضمین سلامت ۱۰۰٪ و خدمات پس از فروش رسمی',
      descEn: 'Full hardware guarantee with genuine serial verification'
    },
    {
      icon: <RotateCcw className="w-5 h-5 text-amber-400" />,
      titleFa: '۷ روز مهلت تعویض',
      titleEn: '7-Day Return Policy',
      descFa: 'امکان عودت و تعویض بی‌قید و شرط در صورت هرگونه مغایرت',
      descEn: 'Hassle-free replacement if unsatisfied'
    },
    {
      icon: <Headphones className="w-5 h-5 text-purple-400" />,
      titleFa: 'مشاوره تخصصی ۲۴/۷',
      titleEn: 'VIP Engineering Support',
      descFa: 'پشتیبانی فنی توسط کارشناسان سخت‌افزار',
      descEn: 'Direct live chat assistance with tech specialists'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
        {badges.map((badge, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center shrink-0 border border-zinc-200/60 dark:border-zinc-700/60">
              {badge.icon}
            </div>
            <div className="text-right rtl:text-right ltr:text-left">
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {lang === 'fa' ? badge.titleFa : badge.titleEn}
              </h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed mt-0.5">
                {lang === 'fa' ? badge.descFa : badge.descEn}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
