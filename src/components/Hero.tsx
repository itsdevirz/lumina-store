import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Star,
  ShieldCheck,
  Zap,
  Volume2,
  BatteryCharging,
  Eye,
  Heart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { playTactileClick } from '../utils/sound';
import { Product } from '../types';

export const Hero: React.FC = () => {
  const {
    lang,
    products,
    openProductDetails,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setActiveTab,
    setFilters
  } = useStore();

  // Pick top flagship products for showcase
  const showcaseProducts = products.filter(p => p.featured || p.rank <= 3).slice(0, 3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const activeProduct: Product = showcaseProducts[currentIndex] || products[0];

  // Auto-advance spotlight every 6 seconds if not hovered
  useEffect(() => {
    if (isHovered || showcaseProducts.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % showcaseProducts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered, showcaseProducts.length]);

  if (!activeProduct) return null;

  const handleProductClick = () => {
    playTactileClick();
    openProductDetails(activeProduct);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTactileClick();
    addToCart(activeProduct, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTactileClick();
    toggleWishlist(activeProduct.id);
  };

  const isFavorited = isInWishlist(activeProduct.id);

  // Price calculations in Tomans
  const priceToman = activeProduct.price ? Math.round(activeProduct.price / 10) : 0;
  const originalPriceToman = activeProduct.originalPrice ? Math.round(activeProduct.originalPrice / 10) : 0;
  const discountPercent = activeProduct.discountPercent || (originalPriceToman > priceToman
    ? Math.round(((originalPriceToman - priceToman) / originalPriceToman) * 100)
    : null);

  return (
    <section
      className="relative w-full pt-2 pb-6 sm:pb-8 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Wide Full-Width Immersive Showcase Card */}
        <div
          onClick={handleProductClick}
          className="group relative w-full rounded-3xl overflow-hidden min-h-[480px] sm:min-h-[520px] lg:min-h-[560px] flex flex-col justify-between p-5 sm:p-8 lg:p-12 shadow-xl border border-zinc-200/50 dark:border-zinc-800/80 cursor-pointer transition-all duration-300"
        >
          {/* 1. Full-Coverage Background Image */}
          <div className="absolute inset-0 z-0 bg-zinc-900 overflow-hidden">
            <img
              key={activeProduct.id}
              src={activeProduct.images?.[0] || '/images/products/photo-1505740420928-5e560c06d30e.jpg'}
              alt={lang === 'fa' ? activeProduct.nameFa : activeProduct.name}
              className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
              loading="eager"
            />
          </div>

          {/* 2. Deep Shadow Gradient Overlay (Rich Vignette & Bottom Fade) */}
          <div className="absolute inset-0 z-1 bg-gradient-to-t from-black/95 via-black/60 to-black/30 pointer-events-none" />
          <div className="absolute inset-0 z-1 bg-gradient-to-r from-black/80 via-black/40 to-transparent rtl:bg-gradient-to-l rtl:from-black/80 rtl:via-black/40 rtl:to-transparent pointer-events-none" />

          {/* 3. Top Header Bar Over Image */}
          <div className="relative z-10 flex items-center justify-between gap-3">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-bold shadow-md backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>{lang === 'fa' ? 'پیشنهاد ویژه و پرچمدار' : 'Flagship Spotlight'}</span>
              </span>

              {discountPercent && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-rose-500/90 text-white text-xs font-bold font-mono shadow-md backdrop-blur-md">
                  {discountPercent}٪ تخفیف
                </span>
              )}

              <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-md border border-white/20">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'fa' ? '۱۸ ماه گارانتی رسمی' : '18-Month Warranty'}</span>
              </span>
            </div>

            {/* Quick Actions (Wishlist & Slide Controls) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleWishlist}
                aria-label="Wishlist"
                className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer shadow-md ${
                  isFavorited
                    ? 'bg-rose-500 text-white border-rose-400 scale-105'
                    : 'bg-white/20 hover:bg-white/30 text-white border-white/20'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>

              {showcaseProducts.length > 1 && (
                <div className="hidden sm:flex items-center gap-1 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(prev => (prev === 0 ? showcaseProducts.length - 1 : prev - 1));
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(prev => (prev + 1) % showcaseProducts.length);
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 4. Bottom Specifications & Details Overlay */}
          <div className="relative z-10 mt-auto pt-16">
            
            {/* Brand & Category Label */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs sm:text-sm font-mono font-bold tracking-wider uppercase text-emerald-400">
                {activeProduct.brand || 'Lumina Studio'}
              </span>
              <span className="text-zinc-400">•</span>
              <span className="text-xs text-zinc-300 font-medium">
                {lang === 'fa' ? (activeProduct.categoryFa || 'تجهیزات تخصصی') : activeProduct.category}
              </span>
              {activeProduct.rating && (
                <div className="flex items-center gap-1 text-amber-400 text-xs font-mono font-bold mr-2">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{activeProduct.rating}</span>
                  <span className="text-zinc-400 text-[11px] font-normal">({activeProduct.reviewsCount || 48})</span>
                </div>
              )}
            </div>

            {/* Main Product Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight sm:leading-snug max-w-3xl drop-shadow-md mb-3">
              {lang === 'fa' ? activeProduct.nameFa : activeProduct.name}
            </h1>

            {/* Product Persian Description */}
            <p className="text-xs sm:text-sm text-zinc-200/90 leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-2 mb-5 drop-shadow">
              {lang === 'fa'
                ? (activeProduct.descriptionFa || activeProduct.description)
                : activeProduct.description}
            </p>

            {/* Specifications Highlight Pills */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-100 text-xs font-medium backdrop-blur-md border border-white/10 transition-colors">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>حذف نویز فعال ANC هیبریدی</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-100 text-xs font-medium backdrop-blur-md border border-white/10 transition-colors">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                <span>۴۰ ساعت شارژدهی مداوم</span>
              </span>

              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-100 text-xs font-medium backdrop-blur-md border border-white/10 transition-colors">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>درایور ۴۵ میلی‌متری تیتانیوم</span>
              </span>
            </div>

            {/* Price & Action CTA Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/15">
              
              {/* Price Block */}
              <div className="flex items-baseline gap-3">
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono text-emerald-400 tabular-nums">
                      {priceToman.toLocaleString('fa-IR')}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-zinc-300">
                      تومان
                    </span>
                  </div>

                  {originalPriceToman > priceToman && (
                    <span className="text-xs sm:text-sm text-zinc-400 line-through font-mono tabular-nums">
                      {originalPriceToman.toLocaleString('fa-IR')} تومان
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="h-11 sm:h-12 px-5 sm:px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{lang === 'fa' ? 'افزودن به سبد خرید' : 'Add to Cart'}</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductClick();
                  }}
                  className="h-11 sm:h-12 px-5 sm:px-6 rounded-xl bg-white/20 hover:bg-white/30 active:scale-95 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>{lang === 'fa' ? 'مشاهده جزئیات کامل' : 'Full Specs'}</span>
                  {lang === 'fa' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>

            </div>

          </div>

          {/* 5. Pagination Slide Dots (for multiple flagship items) */}
          {showcaseProducts.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
              {showcaseProducts.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-6 bg-emerald-400'
                      : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
