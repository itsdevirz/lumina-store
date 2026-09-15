import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Layers,
  BatteryCharging,
  Radio
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Hero: React.FC = () => {
  const { lang, setActiveTab, setFilters, openProductDetails, products, formatPrice, addToCart } = useStore();

  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      id: 'slide-1',
      tag: 'FLAGSHIP DROP • AUDIO',
      title: lang === 'fa' ? 'هدفون نویزکنسلینگ Horizon ANC Pro' : 'Horizon ANC Pro Studio Headphones',
      description:
        lang === 'fa'
          ? 'معماری آکوستیک ۴۰ میلی‌متری با دیافراگم بریلیوم، حذف نویز فعال هیبریدی تا ۴۵dB و ۵۵ ساعت بازدهی باتری.'
          : 'Custom 40mm beryllium drivers, 45dB hybrid ANC, low-latency aptX HD, and 55h continuous battery life.',
      price: 12800000,
      priceUSD: 249,
      originalPrice: 15500000,
      image: '/images/products/photo-1505740420928-5e560c06d30e.jpg',
      badge: '-18%',
      productId: 'prod-1',
      specs: [
        { label: lang === 'fa' ? 'درایور' : 'Driver', val: '40mm Beryllium' },
        { label: lang === 'fa' ? 'کاهش نویز' : 'ANC', val: 'Hybrid -45dB' },
        { label: lang === 'fa' ? 'باتری' : 'Battery', val: '55 Hours' },
        { label: lang === 'fa' ? 'تاخیر' : 'Latency', val: '< 28ms' }
      ]
    },
    {
      id: 'slide-2',
      tag: 'WORK ENVIRONMENT • SETUP',
      title: lang === 'fa' ? 'پایه مانیتور دوگانه گردوی سالید' : 'Solid Walnut Dual Monitor Stand',
      description:
        lang === 'fa'
          ? 'طراحی ارگونومیک مینیمال از چوب گردوی آمریکایی با پایه‌های آلومینیوم مات و کانال مدیریت سیم مخفی.'
          : 'Milled from solid walnut hardwood with bead-blasted anodized aluminum risers and hidden cable management.',
      price: 4900000,
      priceUSD: 99,
      originalPrice: 5800000,
      image: '/images/products/photo-1527864550417-7fd91fc51a46.jpg',
      badge: 'PRO',
      productId: 'prod-3',
      specs: [
        { label: lang === 'fa' ? 'جنس' : 'Material', val: 'Solid Walnut' },
        { label: lang === 'fa' ? 'پایه' : 'Legs', val: 'Anodized 6061' },
        { label: lang === 'fa' ? 'تحمل وزن' : 'Payload', val: 'up to 45 kg' },
        { label: lang === 'fa' ? 'ابعاد' : 'Dimensions', val: '105 × 23 cm' }
      ]
    },
    {
      id: 'slide-3',
      tag: 'HARDWARE • WEARABLE',
      title: lang === 'fa' ? 'ساعت هوشمند تیتانیومی Aura Ultra GPS' : 'Aura Ultra Titanium GPS Smartwatch',
      description:
        lang === 'fa'
          ? 'شاسی تیتانیوم گرید هوافضا با کریستال یاقوت کبود، پایش بیومتریک نسل ۵ و مسیریابی ماهواره‌ای دوفرکانسه.'
          : 'Aerospace-grade titanium housing, sapphire crystal face, dual-band GNSS, and clinical-grade biometrics.',
      price: 18500000,
      priceUSD: 360,
      originalPrice: 21900000,
      image: '/images/products/photo-1523275335684-37898b6baf30.jpg',
      badge: 'TITANIUM',
      productId: 'prod-2',
      specs: [
        { label: lang === 'fa' ? 'شاسی' : 'Chassis', val: 'Grade 5 Titanium' },
        { label: lang === 'fa' ? 'شیشه' : 'Glass', val: 'Sapphire Crystal' },
        { label: lang === 'fa' ? 'مقاومت' : 'Rating', val: '10 ATM / 100m' },
        { label: lang === 'fa' ? 'سنسور' : 'Sensors', val: 'Multi-Path Bio' }
      ]
    }
  ];

  const current = heroSlides[activeSlide];

  const handleInspect = () => {
    const p = products.find(prod => prod.id === current.productId) || products[0];
    if (p) openProductDetails(p);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const p = products.find(prod => prod.id === current.productId) || products[0];
    if (p) addToCart(p, 1);
  };

  return (
    <section className="border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Status & Live Telemetry Strip */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-200/80 dark:border-zinc-800/80 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE STOREFRONT
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span>{products.length} HARDWARE ARTIFACTS</span>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">/</span>
            <span className="hidden sm:inline">ZERO INTERMEDIARIES</span>
          </div>

          <div className="flex items-center gap-1.5">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  activeSlide === idx
                    ? 'w-6 bg-zinc-900 dark:bg-zinc-100'
                    : 'w-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Split Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Specifications & Information */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900">
                {current.tag}
              </span>
              <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
                {current.badge}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              {current.title}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
              {current.description}
            </p>

            {/* Technical Specifications Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2">
              {current.specs.map((s, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60"
                >
                  <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                    {s.label}
                  </div>
                  <div className="text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                    {s.val}
                  </div>
                </div>
              ))}
            </div>

            {/* Price & Action Row */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex flex-col">
                <span className="text-[11px] font-mono text-zinc-400 line-through">
                  {formatPrice(current.originalPrice, 320)}
                </span>
                <span className="text-base sm:text-lg font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  {formatPrice(current.price, current.priceUSD)}
                </span>
              </div>

              <button
                onClick={handleQuickAdd}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-medium hover:bg-zinc-800 dark:hover:bg-white/90 transition-colors cursor-pointer shadow-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'افزودن به سبد خرید' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={handleInspect}
                className="px-3.5 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                {lang === 'fa' ? 'بررسی مشخصات فنی' : 'View Spec Sheet'}
              </button>
            </div>
          </div>

          {/* Right Column: Minimalist Product Imagery */}
          <div className="lg:col-span-6 relative aspect-16/10 sm:aspect-16/9 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900/40">
            <AnimatePresence mode="wait">
              <motion.img
                key={current.image}
                src={current.image}
                alt={current.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Quick slide controls */}
            <div className="absolute bottom-3 rtl:left-3 ltr:right-3 flex items-center gap-1.5 z-10">
              <button
                onClick={() => setActiveSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length)}
                className="p-1.5 rounded-md bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-white cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
              <button
                onClick={() => setActiveSlide(prev => (prev + 1) % heroSlides.length)}
                className="p-1.5 rounded-md bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-white cursor-pointer shadow-xs"
              >
                <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
