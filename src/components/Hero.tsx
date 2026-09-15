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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
          
          {/* Main Showcase Banner (8 cols) */}
          <div className="lg:col-span-8 relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[310px] sm:min-h-[400px] flex flex-col justify-end p-4 sm:p-8 lg:p-10 shadow-sm group">
            {/* Background Image Carousel with Overlay */}
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlide.id}
                src={currentSlide.image}
                alt={currentSlide.title}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 0.4, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </AnimatePresence>

            {/* Subtle Gradient Overlays for High Contrast Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-transparent rtl:from-slate-950/80" />

            {/* Slide Navigation Dots & Arrows */}
            <div className="absolute top-3 sm:top-6 left-3 sm:left-6 z-20 flex items-center gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1 sm:gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeSlide === i ? 'w-5 sm:w-6 bg-[#E80645]' : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white border border-white/10 transition-colors cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronRight className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
                </button>
                <button
                  onClick={() => setActiveSlide(prev => (prev + 1) % heroSlides.length)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white border border-white/10 transition-colors cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
                </button>
              </div>
            </div>

            {/* Slide Content with Synchronized Ease-In-Out Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.08,
                      delayChildren: 0.05,
                    },
                  },
                  exit: {
                    opacity: 0,
                    transition: { duration: 0.25, ease: 'easeInOut' },
                  },
                }}
                className="relative z-10 max-w-xl text-right"
              >
                {/* Badge */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: -10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E80645]/90 text-white text-[10px] sm:text-xs font-bold mb-2 sm:mb-2.5 shadow-xs"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{currentSlide.tag}</span>
                  <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                  <span>{currentSlide.badge}</span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
                  }}
                  className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white mb-1.5 sm:mb-2 leading-snug"
                >
                  {currentSlide.title}
                </motion.h1>

                {/* Description */}
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
                  }}
                  className="text-[11px] sm:text-xs text-slate-300 mb-3.5 sm:mb-5 line-clamp-2 leading-relaxed font-normal max-w-lg"
                >
                  {currentSlide.description}
                </motion.p>

                {/* Actions & Price */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
                  }}
                  className="flex flex-wrap items-center gap-2.5 sm:gap-3"
                >
                  <button
                    onClick={() => {
                      const found = products.find(p => p.id === currentSlide.productId);
                      if (found) {
                        openProductDetails(found);
                      } else {
                        setActiveTab('shop');
                      }
                    }}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#E80645] hover:bg-[#c7053b] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-rose-950/20 transition-all active:scale-95 cursor-pointer"
                  >
                    <span>{lang === 'fa' ? 'مشاهده و خرید محصول' : 'View Product'}</span>
                    <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
                  </button>

                  <div className="flex items-baseline gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                    <span className="text-[11px] text-slate-400 font-medium">{lang === 'fa' ? 'قیمت ویژه:' : 'Price:'}</span>
                    <span className="text-xs sm:text-sm font-black text-white tabular-nums">
                      {formatPrice(currentSlide.price, currentSlide.priceUSD)}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bento Side Cards (4 cols on lg, 2 cols on mobile) */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
            
            {/* Card 1: Studio Audio */}
            <div
              onClick={() => {
                setFilters(prev => ({ ...prev, selectedCategory: 'audio' }));
                setActiveTab('shop');
              }}
              className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 p-3.5 sm:p-5 flex flex-col justify-end text-white shadow-xs group cursor-pointer border border-slate-800/80 min-h-[140px] sm:min-h-[190px]"
            >
              <img
                src="/images/products/photo-1546435770-a3e426bf472b.jpg"
                alt="Audio Collection"
                className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
              <div className="relative z-10 text-right">
                <span className="px-2 py-0.5 rounded-md bg-[#E80645] text-white text-[9.5px] sm:text-[10px] font-bold mb-1 inline-block">
                  {lang === 'fa' ? 'صدای های-فای' : 'Hi-Fi Audio'}
                </span>
                <h3 className="text-xs sm:text-sm lg:text-base font-black mb-0.5 line-clamp-1">
                  {lang === 'fa' ? 'هدفون‌های حرفه‌ای استودیو' : 'Studio Headphones'}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-300 mb-2 line-clamp-1 hidden sm:block">
                  {lang === 'fa' ? 'اسپیکرها و تجهیزات مانیتورینگ' : 'Professional audio gear with warranty'}
                </p>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-rose-400 group-hover:text-rose-300">
                  <span>{lang === 'fa' ? 'مشاهده کالکشن' : 'Explore'}</span>
                  <ArrowLeft className="w-3 h-3 rtl:rotate-0 ltr:rotate-180" />
                </div>
              </div>
            </div>

            {/* Card 2: Minimal Workspace */}
            <div
              onClick={() => {
                setFilters(prev => ({ ...prev, selectedCategory: 'workspace' }));
                setActiveTab('shop');
              }}
              className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 p-3.5 sm:p-5 flex flex-col justify-end text-white shadow-xs group cursor-pointer border border-slate-800/80 min-h-[140px] sm:min-h-[190px]"
            >
              <img
                src="/images/products/photo-1593062096033-9a26b09da705.jpg"
                alt="Workspace Gear"
                className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
              <div className="relative z-10 text-right">
                <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[9.5px] sm:text-[10px] font-bold mb-1 inline-block">
                  {lang === 'fa' ? 'میز کار ارگونومیک' : 'Ergonomic'}
                </span>
                <h3 className="text-xs sm:text-sm lg:text-base font-black mb-0.5 line-clamp-1">
                  {lang === 'fa' ? 'فضای کار مینیمال و آرام' : 'Minimalist Workspace'}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-300 mb-2 line-clamp-1 hidden sm:block">
                  {lang === 'fa' ? 'پایه‌ها، دسک‌پد چرم و کیبوردها' : 'Elevate your daily productivity'}
                </p>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                  <span>{lang === 'fa' ? 'مشاهده محصولات' : 'View Gear'}</span>
                  <ArrowLeft className="w-3 h-3 rtl:rotate-0 ltr:rotate-180" />
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM: Store Value Proposition / Trust Features Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#111726] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          
          <div className="flex items-center gap-2.5 p-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-[#E80645] dark:text-rose-400 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {lang === 'fa' ? 'ارسال سریع و اکسپرس' : 'Express Delivery'}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {lang === 'fa' ? 'تحویل سریع سراسر کشور' : 'Nationwide fast shipping'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {lang === 'fa' ? 'ضمانت اصالت ۱۰۰٪' : '100% Authentic'}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {lang === 'fa' ? 'تضمین اصالت کالاها' : 'Direct verified makers'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {lang === 'fa' ? '۷ روز مهلت تست' : '7-Day Return'}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {lang === 'fa' ? 'بازگشت بدون قید و شرط' : 'Hassle-free refunds'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {lang === 'fa' ? 'پرداخت امن شاپرک' : 'Secure Payment'}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {lang === 'fa' ? 'درگاه‌های معتبر بانکی' : 'Encrypted transactions'}
              </div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 p-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {lang === 'fa' ? 'پشتیبانی ۲۴ ساعته' : '24/7 Support'}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {lang === 'fa' ? 'پاسخگویی آنلاین و سریع' : 'Always here to assist'}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
