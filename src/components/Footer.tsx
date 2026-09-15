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
  Instagram,
  Twitter,
  Linkedin,
  Headphones,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  onGoToAdmin?: () => void;
  onOpenSeoInspector?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onGoToAdmin, onOpenSeoInspector }) => {
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
      title: lang === 'fa' ? 'عضویت در باشگاه مشتریان لومینا' : 'Subscribed successfully',
      description: lang === 'fa' ? 'کد تخفیف ۱۰ درصدی اولین خرید (LUMINA10) برای شما فعال شد.' : 'Your 10% discount code is now active.',
      type: 'success'
    });
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#090D16] text-slate-400 border-t border-slate-800/80 pt-10 pb-20 sm:pb-10 mt-12 sm:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6 pb-8 sm:pb-10 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white">
                {lang === 'fa' ? 'تحویل اکسپرس' : 'Express Delivery'}
              </h4>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                {lang === 'fa' ? 'تحویل سریع کاری' : 'Fast shipment'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white">
                {lang === 'fa' ? 'ضمانت ۱۰۰٪ اصالت' : '100% Authentic'}
              </h4>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                {lang === 'fa' ? 'گارانتی معتبر شرکتی' : 'Guaranteed original'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white">
                {lang === 'fa' ? '۷ روز مهلت بازگشت' : '7-Day Return'}
              </h4>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                {lang === 'fa' ? 'استرداد بی‌قید و شرط' : 'Hassle-free refunds'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
              <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white">
                {lang === 'fa' ? 'پشتیبانی ۲۴/۷' : '24/7 Support'}
              </h4>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                {lang === 'fa' ? 'همراهی کارشناسان' : 'Always here to help'}
              </p>
            </div>
          </div>
        </div>

        {/* Links & Newsletter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 py-12 border-b border-slate-800/80">
          
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E80645] flex items-center justify-center text-white font-black shadow-md shadow-rose-600/30">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                {lang === 'fa' ? 'فروشگاه تخصصی لومینا' : 'Lumina Store'}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {lang === 'fa'
                ? 'مرجع تخصصی تجهیزات صوتی های‌فای، ستاپ‌های مدرن رومیزی، گجت‌های پوشیدنی هوشمند و اکسسوری‌های مینیمال با بالاترین استاندارد کیفی جهانی.'
                : 'Curated premium audio gear, ergonomic workspace tools, and tech essentials engineered for enthusiasts.'}
            </p>

            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E80645]" />
                <span className="dir-ltr font-mono font-bold">۰۲۱-۸۸۹۹۰۰۲۲</span>
                <span className="text-[11px] text-slate-500">({lang === 'fa' ? 'شنبه تا پنج‌شنبه ۹ الی ۲۱' : 'Mon-Sat 9AM-9PM'})</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E80645]" />
                <span>{lang === 'fa' ? 'تهران، خیابان ولیعصر، برج تجارت الکترونیک، طبقه ۸' : 'Tehran, Valiasr St, Tech Tower, Floor 8'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-[#E80645] hover:text-white flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-[#E80645] hover:text-white flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Linkedin" className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-[#E80645] hover:text-white flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {lang === 'fa' ? 'دسترسی سریع' : 'Navigation'}
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {lang === 'fa' ? 'صفحه اصلی' : 'Home'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, selectedCategory: 'all' }));
                    setActiveTab('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {lang === 'fa' ? 'کاتالوگ همه محصولات' : 'Product Catalog'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('wishlist');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {lang === 'fa' ? 'لیست علاقه‌مندی‌ها' : 'Wishlist'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('account');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {lang === 'fa' ? 'پیگیری سفارشات من' : 'Track Orders'}
                </button>
              </li>
            </ul>
          </div>

          {/* Categories (3 cols) */}
          <div className="lg:col-span-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {lang === 'fa' ? 'دسته‌بندی‌های برگزیده' : 'Categories'}
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, selectedCategory: 'audio' }));
                    setActiveTab('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {lang === 'fa' ? 'تجهیزات صوتی و هدفون‌های Hi-Fi' : 'Audio & Headphones'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, selectedCategory: 'workspace' }));
                    setActiveTab('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {lang === 'fa' ? 'اکسسوری و ستاپ میز کار مدرن' : 'Workspace Gear'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, selectedCategory: 'smart-watch' }));
                    setActiveTab('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {lang === 'fa' ? 'ساعت و گجت‌های هوشمند سلامتی' : 'Smart Watches'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, selectedCategory: 'bags' }));
                    setActiveTab('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {lang === 'fa' ? 'کوله و کیف‌های چرم مسافرتی' : 'Leather Bags'}
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter (3 cols) */}
          <div className="lg:col-span-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {lang === 'fa' ? 'باشگاه مشتریان و تخفیف‌ها' : 'Newsletter Club'}
            </h5>
            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              {lang === 'fa'
                ? 'با ثبت ایمیل خود، کد تخفیف ۱۰ درصدی خرید اول و اطلاع‌رسانی جشنواره‌ها را دریافت کنید.'
                : 'Join our club for 10% off your first purchase and early drops.'}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                placeholder={lang === 'fa' ? 'ایمیل شما (مثال: user@gmail.com)' : 'Email address...'}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#E80645]"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#E80645] hover:bg-[#c7053b] text-white text-xs font-bold transition-colors cursor-pointer shadow-md shadow-rose-900/20 active:scale-98"
              >
                {lang === 'fa' ? 'دریافت کد تخفیف ۱۰٪' : 'Claim 10% Discount'}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            {lang === 'fa'
              ? '© ۲۰۲۶ فروشگاه اینترنتی لومینا (Lumina). کلیه حقوق محفوظ است.'
              : '© 2026 Lumina Store. All rights reserved.'}
          </div>

          <div className="flex items-center gap-4">
            {onGoToAdmin && (
              <button onClick={onGoToAdmin} className="hover:text-slate-300 transition-colors cursor-pointer">
                {lang === 'fa' ? 'ورود به پنل مدیریت' : 'Admin Panel'}
              </button>
            )}
            {onOpenSeoInspector && (
              <button onClick={onOpenSeoInspector} className="hover:text-slate-300 transition-colors cursor-pointer">
                {lang === 'fa' ? 'بازرسی سئو' : 'SEO Inspector'}
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
