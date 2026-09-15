import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  Heart,
  ShoppingBag,
  Eye,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Truck,
  Sparkles,
  Zap
} from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  rankingBadge?: number;
}

// Determines the signature color theme for each product
const getProductCardTheme = (product: Product) => {
  if (product.colors && product.colors.length > 0 && product.colors[0]?.hex) {
    return { primaryHex: product.colors[0].hex };
  }

  const signatureMap: Record<string, string> = {
    'lum-01': '#2563EB', // Blue ANC Pro Headphones
    'lum-02': '#6366F1', // Indigo Mechanical Keyboard
    'lum-03': '#0284C7', // Sapphire Chronos Watch
    'lum-04': '#B45309', // Florentine Caramel Leather Bag
    'lum-05': '#C2410C', // Ceramic Pour-Over Terracotta
    'lum-06': '#059669', // Nordic Halo Emerald Walnut Lamp
    'lum-07': '#4F46E5', // Precision Wireless Mouse M9
    'lum-08': '#E11D48', // Minimalist Titanium Water Bottle
  };

  const categoryMap: Record<string, string> = {
    audio: '#2563EB',
    workspace: '#6366F1',
    'smart-wear': '#0284C7',
    coffee: '#C2410C',
    'home-design': '#059669',
    lifestyle: '#B45309',
  };

  const primaryHex = signatureMap[product.id] || categoryMap[product.category] || '#2563EB';
  return { primaryHex };
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, rankingBadge }) => {
  const {
    lang,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    openProductDetails
  } = useStore();

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const theme = getProductCardTheme(product);
  const inWishlist = isInWishlist(product.id);
  const hasMultipleImages = product.images && product.images.length > 1;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdding || isAdded) return;

    setIsAdding(true);
    setTimeout(() => {
      addToCart(product, 1);
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1800);
    }, 280);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex(prev => (prev + 1) % product.images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex(prev => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleDotClick = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setCurrentImgIndex(idx);
  };

  // Color options palette
  const sampleColors: Record<string, string[]> = {
    audio: ['#1F2937', '#9CA3AF', '#2563EB', '#E11D48'],
    workspace: ['#111827', '#E2E8F0', '#6366F1', '#10B981'],
    'smart-wear': ['#0F172A', '#F59E0B', '#06B6D4', '#EC4899'],
    coffee: ['#3E2723', '#795548', '#D97706', '#E2E8F0'],
    'home-design': ['#334155', '#E2E8F0', '#059669', '#F59E0B'],
    lifestyle: ['#0F172A', '#64748B', '#2563EB', '#D97706']
  };
  const colorDots = sampleColors[product.category] || ['#1E293B', '#64748B', '#3B82F6'];

  return (
    <div
      onClick={() => openProductDetails(product)}
      className="group relative flex flex-col justify-between h-full w-full lumina-card rounded-2xl p-2 sm:p-2.5 lg:p-3 bg-white dark:bg-[#111726] border border-slate-200/80 dark:border-slate-800/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-500/30 hover:shadow-md cursor-pointer select-none"
    >
      {/* Ranking Badge (for Best Sellers) */}
      {rankingBadge && (
        <div className="absolute top-2 left-2 z-20 flex items-center justify-center w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-lg bg-slate-900/90 text-white dark:bg-white dark:text-slate-900 text-[9px] sm:text-[10px] font-black shadow-xs">
          #{rankingBadge}
        </div>
      )}

      {/* Image Container - Square Aspect Ratio for 100% uniformity */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800/50 mb-2 sm:mb-2.5 shrink-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImgIndex}
            src={product.images[currentImgIndex] || product.images[0]}
            alt={product.name}
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.9 }}
            transition={{ duration: 0.18 }}
            loading="lazy"
            className="w-full h-full object-cover object-center"
          />
        </AnimatePresence>

        {/* Dynamic Discount & Flash Sale Badges (pinned on image so card height never varies) */}
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 flex flex-col gap-1 items-end pointer-events-none">
          {product.discountPercent && (
            <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-[#E80645] text-white text-[9px] sm:text-[10px] font-black tracking-tight shadow-xs tabular-nums font-modern">
              {lang === 'fa' ? `${product.discountPercent}٪-` : `-${product.discountPercent}%`}
            </span>
          )}
          {product.isFlashSale && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[8px] sm:text-[9px] font-black tracking-tight shadow-xs font-modern">
              <Zap className="w-2.5 h-2.5 fill-current" />
              <span>{lang === 'fa' ? 'شگفت‌انگیز' : 'Flash'}</span>
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={inWishlist ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
          className={`absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10 p-1.5 rounded-lg sm:rounded-xl transition-all duration-200 cursor-pointer ${
            inWishlist
              ? 'bg-[#E80645] text-white shadow-xs scale-105'
              : 'bg-white/90 dark:bg-slate-900/90 text-slate-400 hover:text-[#E80645] shadow-2xs'
          }`}
        >
          <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Gallery Chevrons on Hover */}
        {hasMultipleImages && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
            <button
              onClick={handlePrevImage}
              aria-label="Previous image"
              className="absolute right-1 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 shadow-xs hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={handleNextImage}
              aria-label="Next image"
              className="absolute left-1 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 shadow-xs hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Image Pagination Indicator Dots */}
        {hasMultipleImages && (
          <div className="absolute bottom-1.5 inset-x-0 z-10 flex justify-center items-center gap-1">
            {product.images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => handleDotClick(e, idx)}
                aria-label={`Show image ${idx + 1}`}
                className={`h-1 rounded-full transition-all duration-200 cursor-pointer ${
                  currentImgIndex === idx
                    ? 'w-3 bg-white shadow-xs'
                    : 'w-1 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}

        {/* Quick View Button */}
        <button
          onClick={handleQuickView}
          className="absolute inset-x-2 bottom-1.5 py-1 px-2 rounded-lg bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900 text-[9.5px] font-bold shadow-xs opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0 hidden sm:flex items-center justify-center gap-1"
        >
          <Eye className="w-3 h-3 text-[#E80645]" />
          <span>{lang === 'fa' ? 'پیش‌نمایش سریع' : 'Quick Preview'}</span>
        </button>
      </div>

      {/* Product Content Details (Strictly uniform vertical layout) */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Rating Row */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider truncate max-w-[70px] sm:max-w-[100px]">
              {product.brand}
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1 text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-1 sm:px-1.5 py-0.5 rounded-md border border-amber-200/40 dark:border-amber-900/40 shrink-0">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current text-amber-500" />
              <span className="font-extrabold text-slate-800 dark:text-slate-200 text-[9px] sm:text-[10px] tabular-nums">
                {product.rating}
              </span>
            </div>
          </div>

          {/* Title (Standardized 2-line height for 100% consistent card alignment) */}
          <h3 className="text-[10.5px] sm:text-xs font-bold text-slate-900 dark:text-white line-clamp-2 h-7 sm:h-8 leading-snug transition-colors mb-1.5 group-hover:text-[#E80645] dark:group-hover:text-rose-400 font-modern">
            {lang === 'fa' ? product.nameFa : product.name}
          </h3>

          {/* Color Palette Indicators & Delivery Tag */}
          <div className="flex items-center justify-between gap-1 mb-2 h-4 sm:h-5">
            <div className="flex items-center gap-1">
              <div className="flex items-center -space-x-1 rtl:space-x-reverse">
                {colorDots.slice(0, 3).map((c, i) => (
                  <span
                    key={i}
                    className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-white dark:border-slate-800 shadow-2xs"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <span className="text-[8px] sm:text-[9px] text-slate-400 font-medium hidden xs:inline sm:inline">
                {lang === 'fa' ? `${colorDots.length} رنگ` : `${colorDots.length} colors`}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[8px] sm:text-[9px] font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{lang === 'fa' ? 'ارسال سریع' : 'Fast Delivery'}</span>
            </div>
          </div>
        </div>

        {/* Price & Cart Button Row (Baseline-aligned for both discounted & regular items) */}
        <div className="pt-1.5 sm:pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 mt-auto">
          <div className="flex flex-col justify-center min-h-[2rem] sm:min-h-[2.2rem]">
            {product.originalPrice ? (
              <span className="text-[8.5px] sm:text-[9.5px] text-slate-400 line-through tabular-nums leading-none mb-0.5">
                {formatPrice(product.originalPrice, product.originalPriceUSD)}
              </span>
            ) : (
              <span className="text-[8.5px] sm:text-[9.5px] opacity-0 select-none leading-none mb-0.5">
                -
              </span>
            )}
            <div className="text-[11px] sm:text-xs font-black text-slate-900 dark:text-white tabular-nums tracking-tight leading-tight font-modern">
              {formatPrice(product.price, product.priceUSD)}
            </div>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding || isAdded}
            className={`relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl transition-all duration-200 cursor-pointer shrink-0 ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-xs scale-105'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-[#E80645] hover:text-white dark:hover:bg-[#E80645] dark:hover:text-white active:scale-95'
            }`}
            aria-label={lang === 'fa' ? 'افزودن به سبد خرید' : 'Add to cart'}
          >
            {isAdding ? (
              <Loader2 className="w-3 h-3 animate-spin text-[#E80645]" />
            ) : isAdded ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.15 }}>
                <Check className="w-3 h-3 text-white stroke-[3]" />
              </motion.div>
            ) : (
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
