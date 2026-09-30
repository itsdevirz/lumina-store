import React, { useState } from 'react';
import {
  Sparkles,
  Mail,
  Send,
  Phone,
  MapPin,
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle2,
  ChevronUp,
  CreditCard,
  Building2,
  Lock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';
import { LuminaLogo } from './LuminaLogo';

interface FooterProps {
  onGoToAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onGoToAdmin }) => {
  const { lang, addToast, setActiveTab, setFilters } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      addToast({
        title: lang === 'fa' ? 'ایمیل نامعتبر' : 'Invalid email',
        description: lang === 'fa' ? 'لطفاً یک آدرس ایمیل معتبر وارد فرمایید.' : 'Please provide a valid email.',
        type: 'error'
      });
      return;
    }

    addToast({
      title: lang === 'fa' ? 'عضویت در خبرنامه لومینا' : 'Subscribed to newsletter',
      description: lang === 'fa' ? 'کد تخفیف ۱۰ درصدی (LUMINA10) برای شما فعال شد.' : 'Discount code LUMINA10 is now active.',
      type: 'success'
    });
    setNewsletterEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-[#0A0A0C] text-zinc-600 dark:text-zinc-400 pt-10 pb-8 mt-14 text-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header: Logo, Hotline & Back to Top Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between pb-8 mb-8 border-b border-zinc-200/80 dark:border-zinc-800/80 gap-4">
          <div className="flex items-center gap-3">
            <LuminaLogo variant="full" size="md" />
            <span className="hidden md:inline-block text-zinc-400">|</span>
            <span className="hidden md:inline-block text-xs text-zinc-500">
              تلفن پشتیبانی: ۰۲۱-۸۸۸۸۴۳۲۱ | ۷ روز هفته، ۲۴ ساعته پاسخگوی شما هستیم
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:border-[#62DB00] hover:text-[#62DB00] transition-colors cursor-pointer shadow-xs"
          >
            <span>بازگشت به بالا</span>
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>

        {/* 5 Features Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pb-8 mb-8 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-[#62DB00]" />
            </div>
            <div>
              <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">ارسال سریع و رایگان</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">برای سفارش‌های بالای ۲ میلیون</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">ضمانت اصالت ۱۰۰٪</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">کالاهای اورجینال با گارانتی</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">۷ روز مهلت بازگشت</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">در صورت هرگونه مغایرت فنی</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">پرداخت امن شاپرک</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">با کلیه کارت‌های عضو شتاب</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">مشاوره تخصصی خرید</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">پاسخگویی آنلاین کارشناسان</div>
            </div>
          </div>
        </div>

        {/* Multi-Column Links & Trust Certificates */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-zinc-200/80 dark:border-zinc-800/80">
          {/* Column 1: Store Intro & Address */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
              فروشگاه اینترنتی لومینا (Lumina Store)
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              لومینا، مرجع تخصصی ارائه ادوات صوتی مانیتورینگ، تجهیزات ارگونومیک میز کار، گجت‌های هوشمند و اکسسوری‌های لایف‌استایل اورجینال در ایران با تضمین بالاترین کیفیت و پشتیبانی بی‌وقفه.
            </p>
            <div className="space-y-1 text-xs text-zinc-500 font-medium pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#62DB00] shrink-0" />
                <span>تهران، خیابان ولیعصر، تقاطع بهشتی، مجتمع تجاری لومینا، طبقه ۴</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#62DB00] shrink-0" />
                <span className="font-mono">۰۲۱-۸۸۸۸۴۳۲۱</span>
              </div>
            </div>
          </div>

          {/* Column 2: Popular Categories */}
          <div className="md:col-span-2 space-y-2.5">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs uppercase tracking-wider">
              دسته‌بندی‌های محبوب
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, selectedCategory: cat.id }));
                      setActiveTab('shop');
                    }}
                    className="hover:text-[#62DB00] transition-colors cursor-pointer text-right"
                  >
                    {cat.nameFa}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Service & Quick Links */}
          <div className="md:col-span-2 space-y-2.5">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs uppercase tracking-wider">
              خدمات مشتریان
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('account')} className="hover:text-[#62DB00] transition-colors cursor-pointer">
                  پیگیری سفارش‌های من
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('festival')} className="hover:text-[#62DB00] transition-colors cursor-pointer">
                  جشنواره تخفیف‌ها و پیشنهادات
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('blog')} className="hover:text-[#62DB00] transition-colors cursor-pointer">
                  راهنمای خرید و نقد و بررسی
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('wishlist')} className="hover:text-[#62DB00] transition-colors cursor-pointer">
                  لیست علاقه‌مندی‌ها
                </button>
              </li>
              {onGoToAdmin && (
                <li>
                  <button onClick={onGoToAdmin} className="text-[#62DB00] font-bold hover:underline cursor-pointer">
                    ورود به پنل مدیریت
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Newsletter & Trust Certificates */}
          <div className="md:col-span-4 space-y-4">
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs uppercase tracking-wider mb-1.5">
                عضویت در باشگاه مشتریان و خبرنامه
              </h4>
              <p className="text-xs text-zinc-500 mb-3">
                با عضویت در خبرنامه از جدیدترین محصولات و کدهای تخفیف اختصاصی مطلع شوید:
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder="ایمیل خود را وارد نمایید..."
                  className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs focus:outline-none focus:border-[#62DB00]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#62DB00] hover:bg-[#52BA00] text-black font-bold text-xs transition-colors cursor-pointer shrink-0"
                >
                  عضویت
                </button>
              </form>
            </div>

            {/* Trust Certificate Symbols */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-zinc-400 block mb-2">نمادهای اعتماد الکترونیکی:</span>
              <div className="flex items-center gap-3">
                <div className="w-16 h-18 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 flex flex-col items-center justify-center text-center shadow-xs">
                  <ShieldCheck className="w-6 h-6 text-emerald-500 mb-1" />
                  <span className="text-[9px] font-bold text-zinc-600 dark:text-zinc-300">اینماد ۵ ستاره</span>
                </div>
                <div className="w-16 h-18 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 flex flex-col items-center justify-center text-center shadow-xs">
                  <Award className="w-6 h-6 text-sky-500 mb-1" />
                  <span className="text-[9px] font-bold text-zinc-600 dark:text-zinc-300">نشان ساماندهی</span>
                </div>
                <div className="w-16 h-18 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 flex flex-col items-center justify-center text-center shadow-xs">
                  <Building2 className="w-6 h-6 text-amber-500 mb-1" />
                  <span className="text-[9px] font-bold text-zinc-600 dark:text-zinc-300">عضو اتحادیه</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 text-center sm:text-right">
          <div>
            تمامی حقوق مادی و معنوی این وب‌سایت متعلق به <strong>فروشگاه اینترنتی لومینا</strong> است.
          </div>
          <div className="font-mono text-[11px]">
            LUMINA STORE © 2026 — ALL RIGHTS RESERVED
          </div>
        </div>
      </div>
    </footer>
  );
};
