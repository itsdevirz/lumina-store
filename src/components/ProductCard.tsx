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
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${theme.primaryHex}66`;
        e.currentTarget.style.boxShadow = `0 12px 28px -6px ${theme.primaryHex}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '';
        e.currentTarget.style.boxShadow = '';
      }}
      className="group relative flex flex-col lumina-card rounded-2xl p-3 bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 transition-all duration-200 hover:-translate-y-1 cursor-pointer select-none"
    >
      {/* Product Color Top Accent Bar (matches product theme) */}
      <div
        className="absolute top-0 inset-x-5 h-[2px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: theme.primaryHex }}
      />

      {/* Ranking Badge (for Best Sellers) */}
      {rankingBadge && (
        <div className="absolute top-3 left-3 z-20 flex items-center justify-center w-7 h-7 rounded-xl bg-slate-900/90 text-white dark:bg-white dark:text-slate-900 text-xs font-black shadow-md">
          #{rankingBadge}
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/3.2] w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800/60 mb-3">
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
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </AnimatePresence>

        {/* Dynamic Badges in Top Right Corner (Only Discount on image, NOT flash sale) */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1 items-end pointer-events-none">
          {product.discountPercent && (
            <span className="px-2 py-0.5 rounded-lg bg-rose-600 text-white text-[10.5px] font-black tracking-tight shadow-xs tabular-nums">
              {lang === 'fa' ? `${product.discountPercent}٪ تخفیف` : `-${product.discountPercent}%`}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={inWishlist ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
          className={`absolute top-2.5 left-2.5 z-10 p-2 rounded-xl transition-all duration-200 cursor-pointer ${
            inWishlist
              ? 'bg-rose-500 text-white shadow-md scale-105'
              : 'bg-white/90 dark:bg-slate-900/90 text-slate-400 hover:text-rose-500 shadow-xs hover:scale-108'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Gallery Chevrons on Hover */}
        {hasMultipleImages && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handlePrevImage}
              aria-label="Previous image"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 shadow-xs hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNextImage}
              aria-label="Next image"
              className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 shadow-xs hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Image Pagination Indicator Dots */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 inset-x-0 z-10 flex justify-center items-center gap-1">
            {product.images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => handleDotClick(e, idx)}
                aria-label={`Show image ${idx + 1}`}
                className={`h-1 rounded-full transition-all duration-200 cursor-pointer ${
                  currentImgIndex === idx
                    ? 'w-4 bg-white shadow-xs'
                    : 'w-1 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}

        {/* Quick View Button */}
        <button
          onClick={handleQuickView}
          className="absolute inset-x-3 bottom-2.5 py-1.5 px-3 rounded-xl bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900 text-[11px] font-bold shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 hidden sm:flex items-center justify-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" style={{ color: theme.primaryHex }} />
          <span>{lang === 'fa' ? 'پیش‌نمایش سریع' : 'Quick Preview'}</span>
        </button>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-1">
        {/* Flash Sale Tag INSIDE card body (not on image), styled with product theme */}
        {product.isFlashSale && (
          <div
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold self-start mb-2 border transition-all"
            style={{
              backgroundColor: `${theme.primaryHex}15`,
              color: theme.primaryHex,
              borderColor: `${theme.primaryHex}35`
            }}
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>{lang === 'fa' ? 'پیشنهاد شگفت‌انگیز' : 'Flash Deal'}</span>
          </div>
        )}

        {/* Brand & Rating Row */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate max-w-[120px]">
            {product.brand}
          </span>
          <div className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-900/50">
            <Star className="w-3 h-3 fill-current text-amber-500" />
            <span className="font-extrabold text-slate-800 dark:text-slate-200 text-[11px] tabular-nums">
              {product.rating}
            </span>
            <span className="text-[9.5px] text-slate-400">
              ({product.reviewsCount || 18})
            </span>
          </div>
        </div>

        {/* Title (2 lines clamp with fixed height for perfect alignment) */}
        <h3
          className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white line-clamp-2 min-h-[2.4rem] leading-snug transition-colors mb-2"
          onMouseEnter={(e) => {
            e.currentTarget.style.color = theme.primaryHex;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '';
          }}
        >
          {lang === 'fa' ? product.nameFa : product.name}
        </h3>

        {/* Color Palette Indicators & Delivery Tag */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1">
            <div className="flex items-center -space-x-1 rtl:space-x-reverse">
              {colorDots.map((c, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full border border-white dark:border-slate-800 shadow-2xs"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              {lang === 'fa' ? `${colorDots.length} رنگ` : `${colorDots.length} colors`}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-medium" style={{ color: theme.primaryHex }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: theme.primaryHex }} />
            <span>{lang === 'fa' ? 'ارسال سریع' : 'Fast Delivery'}</span>
          </div>
        </div>

        {/* Price & Cart Button Row */}
        <div className="mt-auto pt-2.5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-[10px] text-slate-400 line-through tabular-nums">
                {formatPrice(product.originalPrice, product.originalPriceUSD)}
              </span>
            )}
            <div className="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
              {formatPrice(product.price, product.priceUSD)}
            </div>
          </div>

          {/* Add to Cart CTA with dynamic hover matching product theme */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding || isAdded}
            onMouseEnter={(e) => {
              if (!isAdded) {
                e.currentTarget.style.backgroundColor = theme.primaryHex;
                e.currentTarget.style.color = '#ffffff';
              }
            }}
            onMouseLeave={(e) => {
              if (!isAdded) {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.color = '';
              }
            }}
            className={`relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-sm scale-105'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 active:scale-95'
            }`}
            aria-label={lang === 'fa' ? 'افزودن به سبد خرید' : 'Add to cart'}
          >
            {isAdding ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: theme.primaryHex }} />
            ) : isAdded ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.15 }}>
                <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
              </motion.div>
            ) : (
              <ShoppingBag className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
