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
  Cpu,
  Layers,
  Activity,
  Sliders,
  Volume2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { playTactileClick, playLaserBlip } from '../utils/sound';

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
  const [viewMode, setViewMode] = useState<'studio' | 'schematic'>('studio');

  const heroSlides = [
    {
      id: 'slide-1',
      sku: 'LMN-HZN-ANC01',
      tag: 'FLAGSHIP ACOUSTICS',
      tagFa: 'پرچمدار مهندسی صدا',
      title: lang === 'fa' ? 'هدفون استودیویی Horizon ANC Pro' : 'Horizon ANC Pro Studio Headphones',
      description:
        lang === 'fa'
          ? 'آکوستیک ۴۰ میلی‌متری بریلیوم، حذف نویز فعال هیبریدی تا ۴۵dB و ۵۵ ساعت شارژدهی بی‌وقفه با صدای Hi-Res بی‌سیم.'
          : 'Custom 40mm beryllium drivers, 45dB hybrid ANC, low-latency aptX HD, and 55h continuous battery life.',
      price: 12800000,
      priceUSD: 249,
      originalPrice: 15500000,
      image: '/images/products/photo-1505740420928-5e560c06d30e.jpg',
      badge: '-18% DROPRATE',
      productId: 'lum-01',
      accentColor: '#62DB00',
      schematics: [
        { key: 'TRANSDUCER', val: '40mm Pure Beryllium Diaphragm', valFa: 'دیافراگم ۴۰ میلی‌متری بریلیوم خالص' },
        { key: 'FREQUENCY RESPONSE', val: '5Hz - 45,000Hz Ultra-Wide', valFa: 'پاسخ فرکانسی ۵ الی ۴۵,۰۰۰ هرتز' },
        { key: 'THD DISTORTION', val: '< 0.05% @ 1kHz 94dB SPL', valFa: 'اعوجاج هارمونیک کمتر از ۰.۰۵٪' },
        { key: 'CHASSIS CNC', val: 'Aircraft Grade 6063 Aluminum', valFa: 'آلومینیوم هوانوردی سری ۶۰۶۳' }
      ],
      specs: [
        { label: lang === 'fa' ? 'درایور' : 'Driver', val: lang === 'fa' ? '۴۰ میلی‌متر' : '40mm Beryll.' },
        { label: lang === 'fa' ? 'کاهش نویز' : 'ANC', val: lang === 'fa' ? '۴۵dB نویزگیر' : '45dB Hybrid' },
        { label: lang === 'fa' ? 'شارژدهی' : 'Battery', val: lang === 'fa' ? '۵۵ ساعت' : '55 Hours' }
      ]
    },
    {
      id: 'slide-2',
      sku: 'LMN-DSK-WLN02',
      tag: 'ARCHITECTURAL DESK',
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
      productId: 'lum-03',
      accentColor: '#38BDF8',
      schematics: [
        { key: 'MATERIAL', val: '100% Sustainably Sourced Walnut', valFa: 'چوب گردوی آمریکایی ۱۰۰٪ طبیعی' },
        { key: 'RISER ALLOY', val: 'Anodized 8mm Matte Aluminum', valFa: 'پایه‌های آلومینیومی ۸ میلی‌متری' },
        { key: 'MAX PAYLOAD', val: 'Tested to 38kg Load Capacity', valFa: 'تست تحمل بار مداوم تا ۳۸ کیلوگرم' },
        { key: 'TOLERANCE', val: 'CNC Mill Cut within ±0.05mm', valFa: 'دقت برش دستگاه CNC در حد ۰.۰۵ میلی‌متر' }
      ],
      specs: [
        { label: lang === 'fa' ? 'متریال' : 'Material', val: lang === 'fa' ? 'چوب گردو' : 'Solid Walnut' },
        { label: lang === 'fa' ? 'تحمل وزن' : 'Payload', val: lang === 'fa' ? 'تا ۳۸ کیلو' : 'Up to 38kg' },
        { label: lang === 'fa' ? 'طول پایه' : 'Width', val: lang === 'fa' ? '۱۱۵ سانتی‌متر' : '115cm Dual' }
      ]
    },
    {
      id: 'slide-3',
      sku: 'LMN-KB-APX03',
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
      productId: 'lum-04',
      accentColor: '#62DB00',
      schematics: [
        { key: 'GASKET MOUNT', val: 'Multi-layer Silicone + Poron Dampening', valFa: 'ساختار واشرماونت با فوم پورون ۵ لایه' },
        { key: 'SWITCHES', val: 'Custom Factory-Lubed Tactile 55g', valFa: 'سوئیچ‌های روان‌کاری شده کارخانه‌ای ۵۵ گرم' },
        { key: 'LATENCY', val: '< 1.2ms Sub-Millisecond 2.4GHz', valFa: 'تاخیر اتصال زیر ۱.۲ میلی‌ثانیه' },
        { key: 'HOT-SWAP', val: '5-Pin PCB Compatible with all MX', valFa: 'برد هات‌سواپ سازگار با کلیه سوئیچ‌ها' }
      ],
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
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length, isPaused]);

  const handleProductAction = () => {
    playLaserBlip();
    const found = products.find(p => p.id === currentSlide.productId || p.name.includes(currentSlide.title.slice(0, 8))) || products[0];
    if (found) {
      openProductDetails(found);
    } else {
      setActiveTab('shop');
    }
  };

  const toggleViewMode = () => {
    playTactileClick(1500);
    setViewMode(prev => (prev === 'studio' ? 'schematic' : 'studio'));
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-5 pb-6 select-none"
    >
      {/* Industrial Hardware Outer Shell */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0A0A0C] text-white border border-zinc-800 shadow-2xl flex flex-col">
        
        {/* Top Hardware Telemetry / Chassis Ribbon */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-zinc-950/80 border-b border-zinc-800/80 text-[11px] font-mono tracking-wider z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold text-zinc-300">
              <span className="signal-dot animate-pulse" />
              <span>LUMINA HARDWARE LABS</span>
            </span>
            <span className="hidden sm:inline-block text-zinc-600">//</span>
            <span className="hidden sm:inline-block text-zinc-400">SERIES 04 PROTOCOL</span>
            <span className="hidden md:inline-block text-zinc-600">//</span>
            <span className="hidden md:inline-block text-[#62DB00] font-semibold">{currentSlide.sku}</span>
          </div>

          {/* Interactive Mode Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleViewMode}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === 'schematic'
                  ? 'bg-[#62DB00]/15 text-[#62DB00] border-[#62DB00]/40 shadow-[0_0_12px_rgba(98,219,0,0.25)]'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
            >
              {viewMode === 'schematic' ? (
                <>
                  <Cpu className="w-3 h-3 text-[#62DB00]" />
                  <span>{lang === 'fa' ? 'نمای شماتیک فعال' : 'Schematic Mode'}</span>
                </>
              ) : (
                <>
                  <Layers className="w-3 h-3" />
                  <span>{lang === 'fa' ? 'نمای مهندسی کالا' : 'View Blueprint'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Ambient Subtle Luminous Flares */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000"
          style={{ backgroundColor: currentSlide.accentColor }}
        />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Precision Architectural Grid */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* Main Content Body */}
        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center p-5 sm:p-8 lg:p-12 pb-16 sm:pb-14">
          
          {/* Text & Specification Column */}
          <div className="lg:col-span-7 flex flex-col justify-center text-right rtl:text-right ltr:text-left">
            
            {/* Tag & Release Pill */}
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white font-mono text-[10px] sm:text-[11px] font-semibold border border-white/15 backdrop-blur-xs">
                <Sparkles className="w-3 h-3 text-[#62DB00]" />
                <span>{lang === 'fa' ? currentSlide.tagFa : currentSlide.tag}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#62DB00] text-black font-mono text-[10px] sm:text-[11px] font-black tracking-wider">
                {currentSlide.badge}
              </span>
            </div>

            {/* Architectural Display Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight leading-[1.15] mb-3 text-white">
              {currentSlide.title}
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm lg:text-base text-zinc-400 max-w-xl leading-relaxed mb-5 font-normal">
              {currentSlide.description}
            </p>

            {/* Dynamic Spec Area: Schematics vs Specs Bar */}
            {viewMode === 'schematic' ? (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-zinc-950/80 border border-[#62DB00]/30 font-mono text-xs mb-5 max-w-lg space-y-1.5 shadow-inner"
              >
                <div className="flex items-center justify-between text-[10px] text-[#62DB00] pb-1 border-b border-zinc-800">
                  <span>// LABORATORY BENCHMARK SPECS</span>
                  <span>TOL: ±0.02%</span>
                </div>
                {currentSlide.schematics.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] text-zinc-300">
                    <span className="text-zinc-500 font-semibold">{item.key}:</span>
                    <span className="font-mono text-zinc-100">{lang === 'fa' ? item.valFa : item.val}</span>
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mb-5 sm:mb-7">
                {currentSlide.specs.map((spec, i) => (
                  <div
                    key={i}
                    className="py-2 px-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs text-center min-w-0"
                  >
                    <span className="block text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase tracking-wider truncate">
                      {spec.label}
                    </span>
                    <span className="block text-xs sm:text-sm font-mono font-bold text-zinc-100 mt-0.5 truncate">
                      {spec.val}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Price & Direct Purchase Action Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pt-1">
              <div className="flex items-baseline gap-2.5 sm:flex-col sm:gap-0">
                <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white tracking-tight">
                  {formatPrice(currentSlide.price, currentSlide.priceUSD)}
                </span>
                <span className="text-xs font-mono text-zinc-500 line-through">
                  {formatPrice(currentSlide.originalPrice)}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handleProductAction}
                  className="flex-1 sm:flex-initial px-5 sm:px-7 py-3 rounded-xl bg-[#62DB00] text-black font-black text-xs sm:text-sm hover:bg-[#76f008] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#62DB00]/25 cursor-pointer tactile-press"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span>{lang === 'fa' ? 'سفارش و بررسی کالا' : 'Acquire Hardware'}</span>
                  {lang === 'fa' ? (
                    <ArrowLeft className="w-4 h-4 shrink-0" />
                  ) : (
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  )}
                </button>

                <button
                  onClick={() => {
                    playTactileClick();
                    setActiveTab('shop');
                  }}
                  className="px-4 sm:px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm border border-white/15 transition-colors cursor-pointer shrink-0 tactile-press"
                >
                  {lang === 'fa' ? 'کاتالوگ تجهیزات' : 'All Products'}
                </button>
              </div>
            </div>
          </div>

          {/* Visual Showcase Stage Column */}
          <div className="lg:col-span-5 relative flex items-center justify-center mt-2 lg:mt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentSlide.id}-${viewMode}`}
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full aspect-square max-w-sm sm:max-w-md rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-zinc-900 group"
              >
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className={`w-full h-full object-cover object-center transition-transform duration-700 ${
                    viewMode === 'schematic' ? 'filter grayscale contrast-125 brightness-75 scale-105' : 'group-hover:scale-105'
                  }`}
                />

                {/* Technical Schematic Overlay HUD */}
                {viewMode === 'schematic' && (
                  <div className="absolute inset-0 bg-[#0A100A]/70 backdrop-blur-[1px] p-5 flex flex-col justify-between font-mono text-[10px] text-[#62DB00] border-2 border-[#62DB00]/40">
                    <div className="flex items-center justify-between border-b border-[#62DB00]/30 pb-2">
                      <span>LMN-SCHEMATIC // REV 2.4</span>
                      <span>FOV: 84° // FL: 35mm</span>
                    </div>

                    {/* Laser Crosshairs */}
                    <div className="relative flex-1 flex items-center justify-center">
                      <div className="absolute w-24 h-24 border border-[#62DB00]/40 rounded-full animate-spin [animation-duration:12s]" />
                      <div className="w-3 h-3 border-t-2 border-l-2 border-[#62DB00]" />
                      <span className="absolute bottom-6 font-mono text-[9px] text-[#62DB00]/80 tracking-widest">
                        ACOUSTIC OPTIMIZED
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#62DB00]/30 pt-2">
                      <span>REF: {currentSlide.sku}</span>
                      <span>STATUS: CALIBRATED</span>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Floating Corner Spec Stamp */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono">
                  <span className="text-zinc-300 font-semibold truncate max-w-[65%]">{currentSlide.title}</span>
                  <span className="text-[#62DB00] font-bold shrink-0 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#62DB00]" />
                    <span>LUMINA CERTIFIED</span>
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Carousel Bottom Control Ribbon */}
        <div className="relative z-20 px-5 sm:px-8 py-3 bg-zinc-950/90 border-t border-zinc-800/80 flex items-center justify-between">
          {/* Progress Timeline Tabs */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md">
            {heroSlides.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => {
                  playTactileClick();
                  setActiveSlide(i);
                }}
                className={`group flex-1 flex flex-col gap-1 py-1 text-right rtl:text-right ltr:text-left transition-all cursor-pointer`}
              >
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${
                    activeSlide === i ? 'bg-[#62DB00]' : 'bg-zinc-800 group-hover:bg-zinc-700'
                  }`}
                />
                <span className={`text-[10px] font-mono truncate hidden sm:block ${
                  activeSlide === i ? 'text-zinc-200 font-bold' : 'text-zinc-500'
                }`}>
                  0{i + 1} // {slide.tag.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>

          {/* Stepper Chevrons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playTactileClick();
                setActiveSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
              }}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer tactile-press"
              aria-label="Previous slide"
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            </button>
            <button
              onClick={() => {
                playTactileClick();
                setActiveSlide(prev => (prev + 1) % heroSlides.length);
              }}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer tactile-press"
              aria-label="Next slide"
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
