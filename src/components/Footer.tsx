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
  Terminal,
  Command
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
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
      title: lang === 'fa' ? 'عضویت در خبرنامه مهندسی' : 'Subscribed to changelog',
      description: lang === 'fa' ? 'کد تخفیف ۱۰ درصدی (LUMINA10) برای شما فعال شد.' : 'Discount code LUMINA10 is now active.',
      type: 'success'
    });
    setNewsletterEmail('');
  };

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/60 text-zinc-600 dark:text-zinc-400 py-10 mt-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Value Proposition Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8 mb-8 border-b border-zinc-200 dark:border-zinc-800/80">
          <div className="flex items-start gap-2.5">
            <Truck className="w-4 h-4 text-zinc-400 mt-0.5" />
            <div>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                {lang === 'fa' ? 'ارسال سریع و مطمئن' : 'Direct Dispatch'}
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                {lang === 'fa' ? 'تحویل اکسپرس ۲۴ تا ۴۸ ساعته' : 'Worldwide delivery via DHL & Express'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-zinc-400 mt-0.5" />
            <div>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                {lang === 'fa' ? 'اصالت ۱۰۰٪ قطعات' : 'Hardware Guarantee'}
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                {lang === 'fa' ? 'ضمانت بازگشت ۷ روزه بدون قید' : '7-day no-questions refund policy'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Headphones className="w-4 h-4 text-zinc-400 mt-0.5" />
            <div>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                {lang === 'fa' ? 'پشتیبانی فنی ۲۴/۷' : 'Developer Support'}
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                {lang === 'fa' ? 'پاسخگویی کارشناسان سخت‌افزار' : 'Live hardware specialist assistance'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <RotateCcw className="w-4 h-4 text-zinc-400 mt-0.5" />
            <div>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                {lang === 'fa' ? 'گارانتی ۱۸ ماهه طلایی' : '18-Month Warranty'}
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                {lang === 'fa' ? 'پوشش کامل قطعات و فریم‌ور' : 'Comprehensive hardware coverage'}
              </div>
            </div>
          </div>
        </div>

        {/* Links & Newsletter Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-zinc-200 dark:border-zinc-800/80">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2">
              <LuminaLogo variant="full" size="md" />
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
              {lang === 'fa'
                ? 'پلتفرم تجارت مدرن با معماری با کارایی بالا، طراحی مینیمال و تجربه مهندسی دقیق برای انتخاب و خرید ادوات دیجیتال.'
                : 'High-density developer-first commerce platform designed for precision hardware acquisition.'}
            </p>
            <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-zinc-400">
              <span>SYSTEM STATUS:</span>
              <span className="text-emerald-500 font-semibold">99.99% OPERATIONAL</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-2 space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
              {lang === 'fa' ? 'بخش‌های اصلی' : 'Workspace'}
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
                >
                  {lang === 'fa' ? 'ویترین اصلی' : 'Storefront'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('shop')}
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
                >
                  {lang === 'fa' ? 'کاتالوگ و مشخصات' : 'Catalog Matrix'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('cart')}
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
                >
                  {lang === 'fa' ? 'سبد خرید' : 'Cart'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('account')}
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
                >
                  {lang === 'fa' ? 'تنظیمات حساب' : 'Account'}
                </button>
              </li>
            </ul>
          </div>

          {/* Developer Tools */}
          <div className="md:col-span-2 space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
              {lang === 'fa' ? 'ابزارهای سیستم' : 'Developer'}
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button
                  onClick={onGoToAdmin}
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer flex items-center gap-1 text-[#62DB00] font-medium"
                >
                  <Terminal className="w-3 h-3" />
                  <span>{lang === 'fa' ? 'کنسول ادمین' : 'Admin Console'}</span>
                </button>
              </li>
              <li>
                <span className="text-zinc-400 font-mono text-[10px]">
                  Cmd+K / Ctrl+K
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter Input */}
          <div className="md:col-span-4 space-y-2.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
              {lang === 'fa' ? 'عضویت در خبرنامه تحلیلی' : 'Engineering Changelog'}
            </div>
            <p className="text-[11px] text-zinc-400">
              {lang === 'fa'
                ? 'دریافت گزارش هفتگی موجودی محصولات جدید و تخفیف‌های ویژه.'
                : 'Get notified of new hardware releases, drop dates, and firmware updates.'}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-1.5">
              <input
                type="email"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                placeholder="dev@domain.com"
                className="flex-1 px-2.5 py-1.5 rounded-md bg-white dark:bg-[#0C0C0E] border border-zinc-200 dark:border-zinc-800 text-xs font-mono focus:outline-none focus:border-[#62DB00]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-md bg-[#62DB00] hover:bg-[#52B800] text-black text-xs font-semibold cursor-pointer transition-colors"
              >
                {lang === 'fa' ? 'ثبت' : 'Join'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright & status */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-zinc-400">
          <div>
            © 2026 LUMINA SYSTEMS INC. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span>REACT 19</span>
            <span>•</span>
            <span>TAILWIND 4</span>
            <span>•</span>
            <span>VITE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
