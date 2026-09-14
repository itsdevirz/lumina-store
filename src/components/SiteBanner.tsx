import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Copy, 
  Check, 
  Zap, 
  ShieldCheck, 
  Truck, 
  Percent, 
  ChevronLeft, 
  ChevronRight,
  Headphones,
  Laptop,
  Flame
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface BannerSlide {
  id: string;
  badge: { fa: string; en: string };
  badgeColor: string;
  title: { fa: string; en: string };
  highlight: { fa: string; en: string };
  subtitle: { fa: string; en: string };
  couponCode?: string;
  discountText: { fa: string; en: string };
  ctaText: { fa: string; en: string };
  targetTab: string;
  targetCategory?: string;
  bgGradient: string;
  accentBorder: string;
  image: string;
  perks: { icon: typeof Truck; fa: string; en: string }[];
}

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'slide-1',
    badge: { fa: 'جشنواره شگفت‌انگیز لومینا ۲۰۲۶', en: 'Mega Tech Festival 2026' },
    badgeColor: 'bg-rose-500 text-white',
    title: { fa: 'فستیوال تخصصی صدا و هدفون‌های نویزکنسلینگ', en: 'Acoustics & Hi-Res Studio Headphones' },
    highlight: { fa: 'تا ۳۵٪ تخفیف نقدی', en: 'Up to 35% OFF' },
    subtitle: { 
      fa: 'جدیدترین ایرفون‌ها و هدفون‌های ارگونومیک با صدای استودیویی Hi-Res و گارانتی طلایی تعویض', 
      en: 'Premium active noise cancellation studio gear with 24-month instant replacement warranty.' 
    },
    couponCode: 'LUMINA20',
    discountText: { fa: '۲۰٪ تخفیف ویژه با کد:', en: 'Extra 20% OFF with code:' },
    ctaText: { fa: 'مشاهده کالکشن هدفون‌ها', en: 'Explore Audio' },
    targetTab: 'shop',
    targetCategory: 'audio',
    bgGradient: 'from-slate-900 via-indigo-950 to-slate-900 dark:from-[#0b0e14] dark:via-[#131b2e] dark:to-[#0b0e14]',
    accentBorder: 'border-indigo-500/30',
    image: '/images/products/photo-1505740420928-5e560c06d30e.jpg',
    perks: [
      { icon: Truck, fa: 'ارسال اکسپرس رایگان', en: 'Free Express Delivery' },
      { icon: ShieldCheck, fa: 'گارانتی اصالت ۲۴ ماهه', en: '24-Mo Warranty' },
      { icon: Zap, fa: 'تحویل فوری همان‌روز', en: 'Same-day Dispatch' },
    ]
  },
  {
    id: 'slide-2',
    badge: { fa: 'تجهیزات نوین ارگونومیک', en: 'Modern Workspace 2026' },
    badgeColor: 'bg-emerald-500 text-white',
    title: { fa: 'ستاپ مدرن و مینیمال میز کار حرفه‌ای', en: 'Minimalist Workspace & Mechanical Keyboards' },
    highlight: { fa: 'ارسال ۱۰۰٪ رایگان سراسر کشور', en: 'Free Nationwide Shipping' },
    subtitle: { 
      fa: 'کیبوردهای مکانیکال گسکت‌مانت، پدهای چرم طبیعی و استندهای آلومینیومی برای نهایت تمرکز و راحتی', 
      en: 'Custom tactile switches, CNC aluminum desk stands and genuine desk mats for peak productivity.' 
    },
    couponCode: 'WELCOME10',
    discountText: { fa: '۱۰٪ هدیه سفارش اول با کد:', en: '10% Welcome gift code:' },
    ctaText: { fa: 'بررسی تجهیزات میز کار', en: 'Explore Workspace' },
    targetTab: 'shop',
    targetCategory: 'workspace',
    bgGradient: 'from-emerald-950 via-slate-900 to-teal-950 dark:from-[#061e18] dark:via-[#0c161d] dark:to-[#08241e]',
    accentBorder: 'border-emerald-500/30',
    image: '/images/products/photo-1587829741301-dc798b83add3.jpg',
    perks: [
      { icon: Sparkles, fa: 'سوئیچ‌های هات‌سواپ', en: 'Hot-Swappable' },
      { icon: ShieldCheck, fa: 'ضمانت بازگشت ۷ روزه', en: '7-Day Return' },
      { icon: Percent, fa: 'تخفیف ویژه ستاپ', en: 'Bundle Discount' },
    ]
  },
  {
    id: 'slide-3',
    badge: { fa: 'پیشنهاد محدود و انحصاری', en: 'Exclusive Limited Offer' },
    badgeColor: 'bg-amber-500 text-slate-950',
    title: { fa: 'ساعت‌ها و اکسسوری‌های مینیمال سبک زندگی', en: 'Smart Wearables & Premium Minimal Living' },
    highlight: { fa: 'فروش شگفت‌انگیز محدود', en: 'Flash Sale Deals' },
    subtitle: { 
      fa: 'پایش دقیق سلامت، ضربان قلب، خواب و اعلان‌های هوشمند با طراحی فوق‌باریک و بدنه سرامیکی مقاوم', 
      en: 'Continuous biometric health tracking, AMOLED display and titanium unibody design.' 
    },
    couponCode: 'VIPGIFT',
    discountText: { fa: 'کد تخفیف کاربران VIP:', en: 'VIP Member discount:' },
    ctaText: { fa: 'مشاهده گجت‌های هوشمند', en: 'Explore Wearables' },
    targetTab: 'shop',
    targetCategory: 'smart-wear',
    bgGradient: 'from-amber-950/80 via-slate-900 to-rose-950/80 dark:from-[#251405] dark:via-[#121019] dark:to-[#220710]',
    accentBorder: 'border-amber-500/30',
    image: '/images/products/photo-1523275335684-37898b6baf30.jpg',
    perks: [
      { icon: Flame, fa: 'موجودی محدود', en: 'Limited Quantity' },
      { icon: ShieldCheck, fa: 'پشتیبانی ۲۴ ساعته', en: '24/7 Support' },
      { icon: Truck, fa: 'بسته‌بندی هدیه لوکس', en: 'Luxury Gift Box' },
    ]
  }
];

export const SiteBanner: React.FC = () => {
  const { lang, setActiveTab, setFilters, addToast, applyCoupon } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = BANNER_SLIDES.length;

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    timerRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentSlide, isAutoPlaying]);

  const handleCopyCoupon = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    applyCoupon(code);
    addToast({
      title: lang === 'fa' ? 'کد تخفیف اعمال شد!' : 'Coupon Applied!',
      description: lang === 'fa' ? `کد ${code} با موفقیت کپی و روی سبد خرید شما فعال شد.` : `Code ${code} copied and applied.`,
      type: 'success'
    });
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleSlideClick = (slide: BannerSlide) => {
    if (slide.targetCategory) {
      setFilters(prev => ({ ...prev, selectedCategory: slide.targetCategory || 'all' }));
    }
    setActiveTab(slide.targetTab);
  };

  const slide = BANNER_SLIDES[currentSlide];

  return (
    <section 
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div 
        className={`relative overflow-hidden rounded-3xl bg-linear-to-r ${slide.bgGradient} border ${slide.accentBorder} text-white shadow-xl transition-all duration-500`}
      >
        {/* Subtle decorative background circles */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-5 items-center p-5 sm:p-7 lg:p-8 min-h-[240px] sm:min-h-[260px]">
          
          {/* Text Content Column */}
          <div className="lg:col-span-8 flex flex-col justify-center z-10">
            {/* Top Badge & Discount Pill */}
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold tracking-tight shadow-xs ${slide.badgeColor}`}>
                <Sparkles className="w-3 h-3" />
                <span>{lang === 'fa' ? slide.badge.fa : slide.badge.en}</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-[11px] sm:text-xs font-bold border border-white/15">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>{lang === 'fa' ? slide.highlight.fa : slide.highlight.en}</span>
              </span>
            </div>

            {/* Banner Main Title */}
            <h2 className="text-lg sm:text-xl lg:text-2xl font-black leading-snug sm:leading-tight mb-1.5 tracking-tight text-white">
              {lang === 'fa' ? slide.title.fa : slide.title.en}
            </h2>

            {/* Subtitle */}
            <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed max-w-xl">
              {lang === 'fa' ? slide.subtitle.fa : slide.subtitle.en}
            </p>

            {/* Coupon Code Strip & CTA Button */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              {slide.couponCode && (
                <div className="flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20 transition-colors">
                  <span className="text-xs text-slate-300 font-medium">
                    {lang === 'fa' ? slide.discountText.fa : slide.discountText.en}
                  </span>
                  <button
                    onClick={(e) => handleCopyCoupon(e, slide.couponCode!)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white text-slate-900 text-xs font-black hover:bg-amber-300 transition-colors cursor-pointer shadow-xs"
                    title={lang === 'fa' ? 'کپی و اعمال تخفیف' : 'Copy and apply coupon'}
                  >
                    <span>{slide.couponCode}</span>
                    {copiedCode === slide.couponCode ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-600" />
                    )}
                  </button>
                </div>
              )}

              <button
                onClick={() => handleSlideClick(slide)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-xs shadow-md shadow-black/20 hover:scale-102 active:scale-98 transition-all cursor-pointer"
              >
                <span>{lang === 'fa' ? slide.ctaText.fa : slide.ctaText.en}</span>
                <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
              </button>
            </div>

            {/* Perks Row */}
            <div className="flex flex-wrap items-center gap-3.5 pt-3 border-t border-white/10 text-[11px] text-slate-300">
              {slide.perks.map((perk, i) => {
                const Icon = perk.icon;
                return (
                  <div key={i} className="flex items-center gap-1.5 font-medium">
                    <Icon className="w-3 h-3 text-amber-300 shrink-0" />
                    <span>{lang === 'fa' ? perk.fa : perk.en}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Compact Controlled Image Column */}
          <div className="lg:col-span-4 relative flex justify-center items-center py-1">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 rounded-2xl overflow-hidden bg-white/5 border border-white/15 shadow-xl group">
              <img
                src={slide.image}
                alt={slide.title.en}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-2 inset-x-2 flex items-center justify-between text-[10px] text-white bg-slate-900/85 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                <span className="font-semibold truncate">
                  {lang === 'fa' ? slide.badge.fa : slide.badge.en}
                </span>
                <span className="text-amber-300 font-mono font-bold text-[10px]">LUMINA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label={lang === 'fa' ? 'اسلاید قبلی' : 'Previous slide'}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center border border-white/15 transition-all z-20 cursor-pointer shadow-md"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={nextSlide}
          aria-label={lang === 'fa' ? 'اسلاید بعدی' : 'Next slide'}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center border border-white/15 transition-all z-20 cursor-pointer shadow-md"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Bottom Slide Indicators */}
        <div className="absolute bottom-3 inset-x-0 flex justify-center items-center gap-1.5 z-20">
          {BANNER_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx ? 'w-6 bg-white shadow-xs' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
