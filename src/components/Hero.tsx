import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Zap,
  Truck,
  RotateCcw,
  CreditCard,
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
  Clock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Hero: React.FC = () => {
  const { lang, setActiveTab, setFilters, openProductDetails, products, formatPrice, addToCart } = useStore();

  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      id: 'slide-1',
      tag: lang === 'fa' ? 'محصول برگزیده فصل • ۲۰۲۶' : 'Featured Product 2026',
      title: lang === 'fa' ? 'هدفون نویزکنسلینگ استودیویی Horizon ANC Pro' : 'Horizon ANC Pro Studio Headphones',
      description:
        lang === 'fa'
          ? 'صدای خالص های-رزولوشن با فناوری حذف نویز هیبریدی تا ۴۵ دسی‌بل و باتری قدرتمند با ۵۵ ساعت شارژدهی مداوم.'
          : 'Pure high-resolution acoustic fidelity with hybrid active noise cancellation and 55 hours battery life.',
      price: 12800000,
      priceUSD: 249,
      originalPrice: 15500000,
      image: '/images/products/photo-1505740420928-5e560c06d30e.jpg',
      badge: lang === 'fa' ? '۱۸٪ تخفیف ویژه' : '18% OFF',
      category: 'audio',
      productId: 'prod-1'
    },
    {
      id: 'slide-2',
      tag: lang === 'fa' ? 'اکسسوری میز کار مدرن' : 'Workspace Essentials',
      title: lang === 'fa' ? 'پایه مانیتور چوب گردو و آلومینیوم مات' : 'Solid Walnut Dual Monitor Stand',
      description:
        lang === 'fa'
          ? 'دست‌ساز از چوب طبیعی گردوی آمریکایی با مدیریت پنهان کابل‌ها و استند اختصاصی برای لپ‌تاپ و شارژ بی‌سیم.'
          : 'Handcrafted from solid walnut wood with integrated cable routing and sleek aluminum legs.',
      price: 4900000,
      priceUSD: 99,
      originalPrice: 5800000,
      image: '/images/products/photo-1527864550417-7fd91fc51a46.jpg',
      badge: lang === 'fa' ? 'پرفروش‌ترین' : 'Best Seller',
      category: 'workspace',
      productId: 'prod-3'
    },
    {
      id: 'slide-3',
      tag: lang === 'fa' ? 'ساعت هوشمند پرچمدار' : 'Flagship Wearable',
      title: lang === 'fa' ? 'ساعت هوشمند تیتانیومی Aura Ultra GPS' : 'Aura Ultra Titanium GPS Smartwatch',
      description:
        lang === 'fa'
          ? 'بدنه تیتانیوم گرید هوافضا با صفحه سافایر ضدخش و سنجش پیشرفته اکسیژن، ضربان و تحلیل خواب هوش مصنوعی.'
          : 'Aerospace-grade titanium chassis with sapphire glass and medical-grade AI health sensors.',
      price: 18500000,
      priceUSD: 360,
      originalPrice: 21000000,
      image: '/images/products/photo-1523275335684-37898b6baf30.jpg',
      badge: lang === 'fa' ? 'تکنولوژی ۲۰۲۶' : '2026 Tech',
      category: 'smart-wear',
      productId: 'prod-2'
    }
  ];

  // Auto slide rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const currentSlide = heroSlides[activeSlide];

  return (
    <section className="pt-4 pb-8 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP: Split Hero Main Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 mb-6">
          
          {/* Main Showcase Banner (8 cols) */}
          <div className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[380px] sm:min-h-[440px] flex flex-col justify-end p-6 sm:p-10 shadow-lg group">
            {/* Background Image Carousel with Overlay */}
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlide.id}
                src={currentSlide.image}
                alt={currentSlide.title}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 0.45, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </AnimatePresence>

            {/* Subtle Gradient Overlays for High Contrast Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent rtl:from-slate-950/90" />

            {/* Slide Navigation Dots & Arrows */}
            <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeSlide === i ? 'w-6 bg-blue-500' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length)}
                  className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white border border-white/10 transition-colors cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                </button>
                <button
                  onClick={() => setActiveSlide(prev => (prev + 1) % heroSlides.length)}
                  className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white border border-white/10 transition-colors cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                </button>
              </div>
            </div>

            {/* Slide Content */}
            <div className="relative z-10 max-w-xl text-right">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/90 text-white text-xs font-bold mb-3 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentSlide.tag}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>{currentSlide.badge}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mb-2.5 leading-tight">
                {currentSlide.title}
              </h1>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 mb-6 line-clamp-2 leading-relaxed font-normal">
                {currentSlide.description}
              </p>

              {/* Actions & Price */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    const found = products.find(p => p.id === currentSlide.productId);
                    if (found) {
                      openProductDetails(found);
                    } else {
                      setActiveTab('shop');
                    }
                  }}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all active:scale-95 cursor-pointer"
                >
                  <span>{lang === 'fa' ? 'مشاهده و خرید محصول' : 'View Product'}</span>
                  <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                </button>

                <div className="flex items-baseline gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  <span className="text-xs text-slate-400 font-medium">{lang === 'fa' ? 'قیمت ویژه:' : 'Price:'}</span>
                  <span className="text-sm sm:text-base font-black text-white tabular-nums">
                    {formatPrice(currentSlide.price, currentSlide.priceUSD)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Side Cards (4 cols) */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
            
            {/* Card 1: Studio Audio */}
            <div
              onClick={() => {
                setFilters(prev => ({ ...prev, selectedCategory: 'audio' }));
                setActiveTab('shop');
              }}
              className="flex-1 relative rounded-3xl overflow-hidden bg-slate-900 p-5 flex flex-col justify-end text-white shadow-md group cursor-pointer border border-slate-800"
            >
              <img
                src="/images/products/photo-1546435770-a3e426bf472b.jpg"
                alt="Audio Collection"
                className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="relative z-10 text-right">
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-600 text-white text-[10px] font-bold mb-1.5 inline-block">
                  {lang === 'fa' ? 'تجهیزات صوتی های-فای' : 'Studio Acoustics'}
                </span>
                <h3 className="text-base sm:text-lg font-black mb-1">
                  {lang === 'fa' ? 'صدای خالص، بدون تحریف' : 'Pure Acoustic Sound'}
                </h3>
                <p className="text-[11px] text-slate-300 mb-3">
                  {lang === 'fa' ? 'اسپیکرهای مانیتورینگ و هدفون‌های تخصصی' : 'Professional audio gear with warranty'}
                </p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 group-hover:text-blue-300">
                  <span>{lang === 'fa' ? 'مشاهده کالکشن' : 'Explore'}</span>
                  <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
                </div>
              </div>
            </div>

            {/* Card 2: Minimal Workspace */}
            <div
              onClick={() => {
                setFilters(prev => ({ ...prev, selectedCategory: 'workspace' }));
                setActiveTab('shop');
              }}
              className="flex-1 relative rounded-3xl overflow-hidden bg-slate-900 p-5 flex flex-col justify-end text-white shadow-md group cursor-pointer border border-slate-800"
            >
              <img
                src="/images/products/photo-1593062096033-9a26b09da705.jpg"
                alt="Workspace Gear"
                className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="relative z-10 text-right">
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold mb-1.5 inline-block">
                  {lang === 'fa' ? 'میز کار ارگونومیک' : 'Ergonomic Setup'}
                </span>
                <h3 className="text-base sm:text-lg font-black mb-1">
                  {lang === 'fa' ? 'فضای کار مینیمال و آرامش‌بخش' : 'Minimalist Workspace'}
                </h3>
                <p className="text-[11px] text-slate-300 mb-3">
                  {lang === 'fa' ? 'پایه‌ها، دسک‌پد چرم و ارگنایزرها' : 'Elevate your daily productivity'}
                </p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                  <span>{lang === 'fa' ? 'مشاهده محصولات' : 'View Gear'}</span>
                  <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM: Store Value Proposition / Trust Features Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 shadow-sm">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'ارسال سریع و اکسپرس' : 'Express Delivery'}
              </div>
              <div className="text-[10.5px] text-slate-400">
                {lang === 'fa' ? 'تحویل در کمترین زمان' : 'Nationwide fast shipping'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'ضمانت اصالت ۱۰۰٪' : '100% Authentic'}
              </div>
              <div className="text-[10.5px] text-slate-400">
                {lang === 'fa' ? 'تضمین اصالت کالا' : 'Direct verified makers'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {lang === 'fa' ? '۷ روز مهلت تست' : '7-Day Return'}
              </div>
              <div className="text-[10.5px] text-slate-400">
                {lang === 'fa' ? 'بازگشت بدون قید و شرط' : 'Hassle-free refunds'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'پرداخت امن شاپرک' : 'Secure Payment'}
              </div>
              <div className="text-[10.5px] text-slate-400">
                {lang === 'fa' ? 'درگاه‌های معتبر بانکی' : 'Encrypted transactions'}
              </div>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'پشتیبانی ۲۴ ساعته' : '24/7 Support'}
              </div>
              <div className="text-[10.5px] text-slate-400">
                {lang === 'fa' ? 'پاسخگویی در تمام روزها' : 'Always here to assist'}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
