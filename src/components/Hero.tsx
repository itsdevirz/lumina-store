import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Hero: React.FC = () => {
  const {
    lang,
    setActiveTab,
    setFilters,
    openProductDetails,
    products,
    formatPrice,
    addToCart
  } = useStore();

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const heroSlides = [
    {
      id: 'slide-1',
      tag: 'NEW FLAGSHIP RELEASE',
      tagFa: 'جدیدترین پرچمدار صوتی',
      title: lang === 'fa' ? 'هدفون استودیویی Horizon ANC Pro' : 'Horizon ANC Pro Studio Headphones',
      description:
        lang === 'fa'
          ? 'آکوستیک ۴۰ میلی‌متری بریلیوم، حذف نویز فعال هیبریدی تا ۴۵dB و ۵۵ ساعت شارژدهی بی‌وقفه با صدای Hi-Res بی‌سیم.'
          : 'Custom 40mm beryllium drivers, 45dB hybrid ANC, low-latency aptX HD, and 55h continuous battery life.',
      price: 12800000,
      priceUSD: 249,
      originalPrice: 15500000,
      image: '/images/products/photo-1505740420928-5e560c06d30e.jpg',
      badge: '-18% OFF',
      productId: 'prod-1',
      accentColor: '#62DB00',
      specs: [
        { label: lang === 'fa' ? 'درایور' : 'Driver', val: lang === 'fa' ? '۴۰ میلی‌متر' : '40mm Beryll.' },
        { label: lang === 'fa' ? 'کاهش نویز' : 'ANC', val: lang === 'fa' ? '۴۵dB نویزگیر' : '45dB Hybrid' },
        { label: lang === 'fa' ? 'شارژدهی' : 'Battery', val: lang === 'fa' ? '۵۵ ساعت' : '55 Hours' }
      ]
    },
    {
      id: 'slide-2',
      tag: 'PRECISION HARDWARE',
      tagFa: 'سخت‌افزار مدرن اداری',
      title: lang === 'fa' ? 'پایه مانیتور دوگانه گردوی سالید' : 'Solid Walnut Dual Monitor Stand',
      description:
        lang === 'fa'
          ? 'تراشیده شده از چوب گردوی آمریکایی با پایه‌های آلومینیوم برس‌خورده و کانال مخفی مدیریت کابل.'
          : 'Milled from American solid walnut hardwood with bead-blasted anodized aluminum risers and hidden cable management.',
      price: 4900000,
      priceUSD: 99,
      originalPrice: 5800000,
      image: '/images/products/photo-1527864550417-7fd91fc51a46.jpg',
      badge: 'TOP RATED',
      productId: 'prod-3',
      accentColor: '#38BDF8',
      specs: [
        { label: lang === 'fa' ? 'متریال' : 'Material', val: lang === 'fa' ? 'چوب گردو' : 'Solid Walnut' },
        { label: lang === 'fa' ? 'تحمل وزن' : 'Payload', val: lang === 'fa' ? 'تا ۳۵ کیلو' : 'Up to 35kg' },
        { label: lang === 'fa' ? 'طول پایه' : 'Width', val: lang === 'fa' ? '۱۱۵ سانتی‌متر' : '115cm Dual' }
      ]
    },
    {
      id: 'slide-3',
      tag: 'ENGINEERING WORKSTATION',
      tagFa: 'کیبورد مکانیکال سفارشی',
      title: lang === 'fa' ? 'کیبورد مکانیکال آلومینیومی Apex 75%' : 'Apex 75% Anodized Mechanical',
      description:
        lang === 'fa'
          ? 'شاسی یکپارچه CNC با فوم‌های میرایی ۵ لایه، سوئیچ‌های روان‌کاری شده کارخانه و اتصال بیسیم سه‌گانه.'
          : 'Unibody CNC chassis with 5-layer acoustic dampening, factory-lubed switches, and tri-mode low-latency wireless.',
      price: 8900000,
      priceUSD: 179,
      originalPrice: 10500000,
      image: '/images/products/photo-1587829741301-dc798b83add3.jpg',
      badge: 'PRO SERIES',
      productId: 'prod-4',
      accentColor: '#A855F7',
      specs: [
        { label: lang === 'fa' ? 'چیدمان' : 'Layout', val: lang === 'fa' ? '۷۵٪ کامپکت' : '75% Compact' },
        { label: lang === 'fa' ? 'اتصال' : 'Connectivity', val: lang === 'fa' ? 'بیسیم سه‌گانه' : 'Tri-Mode' },
        { label: lang === 'fa' ? 'سوئیچ' : 'Switches', val: lang === 'fa' ? 'روان‌کاری شده' : 'Custom Lubed' }
      ]
    }
  ];

  const currentSlide = heroSlides[activeSlide];

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroSlides.length, isPaused]);

  const handleProductAction = () => {
    const found = products.find(p => p.id === currentSlide.productId) || products[0];
    if (found) {
      openProductDetails(found);
    } else {
      setActiveTab('shop');
    }
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-6 select-none"
    >
      {/* Main Hero Card */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0C0C0E] text-white border border-zinc-800/80 shadow-2xl min-h-0 lg:min-h-[520px] flex items-center">
        {/* Ambient Glows */}
        <div
          className="absolute -top-24 -right-24 w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: currentSlide.accentColor }}
        />
        <div className="absolute -bottom-24 -left-24 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        {/* Delicate Grid Lines */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />

        {/* Content Layout */}
        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center p-4 sm:p-8 lg:p-12 pb-14 sm:pb-12">
          {/* Text & Action Column */}
          <div className="lg:col-span-7 flex flex-col justify-center text-right rtl:text-right ltr:text-left">
            {/* Tag & Badge */}
            <div className="flex items-center gap-2 mb-2.5 sm:mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/10 text-white font-mono text-[10px] sm:text-[11px] font-semibold border border-white/15">
                <Sparkles className="w-3 h-3 text-[#62DB00]" />
                <span>{lang === 'fa' ? currentSlide.tagFa : currentSlide.tag}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#62DB00] text-black font-mono text-[10px] sm:text-[11px] font-bold">
                {currentSlide.badge}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-xl sm:text-3xl lg:text-5xl font-black tracking-tight leading-snug sm:leading-tight mb-2 sm:mb-4 text-zinc-100">
              {currentSlide.title}
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm lg:text-base text-zinc-400 max-w-xl leading-relaxed mb-3.5 sm:mb-6 line-clamp-2 sm:line-clamp-none font-normal">
              {currentSlide.description}
            </p>

            {/* Technical Specs Strip */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 max-w-md mb-4 sm:mb-7">
              {currentSlide.specs.map((spec, i) => (
                <div
                  key={i}
                  className="py-1.5 px-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs text-center min-w-0"
                >
                  <span className="block text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase tracking-wider truncate">
                    {spec.label}
                  </span>
                  <span className="block text-[11px] sm:text-xs md:text-sm font-mono font-bold text-zinc-100 mt-0.5 truncate">
                    {spec.val}
                  </span>
                </div>
              ))}
            </div>

            {/* Price & CTA Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pt-1">
              <div className="flex items-baseline gap-2.5 sm:flex-col sm:gap-0">
                <span className="text-xl sm:text-2xl font-mono font-black text-white">
                  {formatPrice(currentSlide.price, currentSlide.priceUSD)}
                </span>
                <span className="text-xs font-mono text-zinc-400 line-through">
                  {formatPrice(currentSlide.originalPrice)}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handleProductAction}
                  className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#62DB00] text-black font-black text-xs sm:text-sm hover:bg-[#74ea0a] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#62DB00]/20 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span>{lang === 'fa' ? 'خرید و مشاهده کالا' : 'Shop Product'}</span>
                  {lang === 'fa' ? (
                    <ArrowLeft className="w-4 h-4 shrink-0" />
                  ) : (
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('shop')}
                  className="px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm border border-white/15 transition-colors cursor-pointer shrink-0"
                >
                  {lang === 'fa' ? 'تمام محصولات' : 'Browse Catalog'}
                </button>
              </div>
            </div>
          </div>

          {/* Visual Showcase Column */}
          <div className="lg:col-span-5 relative flex items-center justify-center mt-2 lg:mt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -15 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full aspect-[16/10] sm:aspect-[4/3] lg:aspect-square max-h-[220px] sm:max-h-[300px] lg:max-h-none max-w-full sm:max-w-md rounded-xl sm:rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-zinc-900/60 group"
              >
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Floating Corner Pill */}
                <div className="absolute bottom-2.5 sm:bottom-4 left-2.5 sm:left-4 right-2.5 sm:right-4 flex items-center justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs font-mono">
                  <span className="text-zinc-300 font-semibold truncate max-w-[60%]">{currentSlide.title}</span>
                  <span className="text-[#62DB00] font-bold shrink-0">LUMINA CERTIFIED</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Carousel Bottom Controls & Indicators */}
        <div className="absolute bottom-3 sm:bottom-4 left-4 sm:left-6 right-4 sm:right-6 z-20 flex items-center justify-between pointer-events-auto">
          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeSlide === i ? 'w-6 sm:w-8 bg-[#62DB00]' : 'w-1.5 sm:w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Chevrons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() =>
                setActiveSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length)
              }
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 rtl:rotate-0 ltr:rotate-180" />
            </button>
            <button
              onClick={() => setActiveSlide(prev => (prev + 1) % heroSlides.length)}
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
