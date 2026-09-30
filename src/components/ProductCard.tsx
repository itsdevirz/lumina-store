import React, { useState } from 'react';
import {
  Star,
  Heart,
  ShoppingBag,
  Eye,
  Check,
  Loader2,
  PackageCheck,
  AlertCircle
} from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { playTactileClick, playNotificationChime } from '../utils/sound';

export interface ProductCardProps {
  product: Product;
  rankingBadge?: number;
  priority?: boolean;
  variant?: string; // Kept for backward compatibility
  curatorNote?: string;
  curatorNoteFa?: string;
  pairingNote?: string;
  pairingNoteFa?: string;
  claimedPercent?: number;
  batchCode?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  rankingBadge,
  priority = false
}) => {
  const {
    lang,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    openProductDetails
  } = useStore();

  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const isAvailable = product.stock > 0;
  const primaryImage = product.images?.[0] || product.primaryImage || '/images/products/photo-1505740420928-5e560c06d30e.jpg';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdding || isAdded || !isAvailable) return;

    playTactileClick(1400);
    setIsAdding(true);
    setTimeout(() => {
      addToCart(product, 1);
      setIsAdding(false);
      setIsAdded(true);
      playNotificationChime();
      setTimeout(() => setIsAdded(false), 1800);
    }, 200);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTactileClick(1100);
    setQuickViewProduct(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTactileClick(1600);
    toggleWishlist(product.id);
  };

  const hasDiscount = Boolean(
    (product.discountPercent && product.discountPercent > 0) ||
    (product.originalPrice && product.originalPrice > product.price)
  );

  const discountValue = product.discountPercent || (
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null
  );

  return (
    <article
      onClick={() => openProductDetails(product)}
      className="group relative flex flex-col h-full w-full rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 p-3 sm:p-3.5 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden select-none"
    >
      {/* 1. Fixed Aspect-Ratio Image Container */}
      <div className="relative aspect-square w-full rounded-xl bg-zinc-50 dark:bg-zinc-900/60 p-2 sm:p-3 flex items-center justify-center overflow-hidden shrink-0">
        {!imageError ? (
          <img
            src={primaryImage}
            alt={lang === 'fa' ? product.nameFa : product.name}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => setImageError(true)}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-600 gap-1">
            <ShoppingBag className="w-8 h-8 stroke-1" />
            <span className="text-[10px] font-mono">Lumina</span>
          </div>
        )}

        {/* Top Badges (Rank or Discount) */}
        <div className="absolute top-2 right-2 flex items-center gap-1 z-10 pointer-events-none">
          {rankingBadge && (
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500 text-white shadow-xs">
              #{rankingBadge}
            </span>
          )}
          {hasDiscount && discountValue && (
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono tabular-nums font-bold bg-rose-500 text-white shadow-xs">
              {discountValue}٪-
            </span>
          )}
        </div>

        {/* Action Overlay: Wishlist & QuickView */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label="افزودن به علاقه‌مندی‌ها"
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-xs ${
              inWishlist
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 dark:bg-zinc-800/90 text-zinc-400 hover:text-rose-500 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleQuickView}
            aria-label="مشاهده سریع"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/90 dark:bg-zinc-800/90 text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs opacity-0 group-hover:opacity-100 border border-zinc-200/60 dark:border-zinc-700/60 hidden sm:flex"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Structured Card Information */}
      <div className="flex flex-col flex-1 min-h-0 pt-2.5 sm:pt-3">
        {/* Category & Brand Metadata */}
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-400 font-medium mb-1 truncate">
          <span className="truncate">{product.brand}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{lang === 'fa' ? product.categoryFa : product.category}</span>
        </div>

        {/* Fixed Height 2-Line Product Title */}
        <h3
          title={lang === 'fa' ? product.nameFa : product.name}
          className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2 min-h-[2.5rem] max-h-[2.5rem] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
        >
          {lang === 'fa' ? product.nameFa : product.name}
        </h3>

        {/* Rating & Availability */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 mt-1.5">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-mono tabular-nums font-semibold text-zinc-700 dark:text-zinc-300">
              {product.rating ? product.rating.toFixed(1) : '۵.۰'}
            </span>
            {product.reviewsCount ? (
              <span className="text-[10px] text-zinc-400">({product.reviewsCount})</span>
            ) : null}
          </div>

          <div className="text-[10px] font-medium">
            {isAvailable ? (
              <span className="text-emerald-600 dark:text-emerald-400">موجود در انبار</span>
            ) : (
              <span className="text-rose-500">ناموجود</span>
            )}
          </div>
        </div>

        {/* 3. Card Footer with Aligned Price & Action CTA */}
        <div className="mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between gap-2">
          {/* Price Block */}
          <div className="flex flex-col min-w-0">
            {hasDiscount && product.originalPrice ? (
              <span className="text-[10px] sm:text-[11px] font-mono tabular-nums text-zinc-400 line-through leading-none mb-0.5">
                {formatPrice(product.originalPrice, product.originalPriceUSD)}
              </span>
            ) : (
              <span className="text-[10px] text-transparent leading-none mb-0.5 select-none" aria-hidden="true">
                -
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-xs sm:text-sm font-bold font-mono tabular-nums text-zinc-900 dark:text-zinc-100 leading-none">
                {formatPrice(product.price, product.priceUSD)}
              </span>
            </div>
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding || isAdded || !isAvailable}
            className={`h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : !isAvailable
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">ثبت شد</span>
              </>
            ) : isAdding ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : !isAvailable ? (
              <span className="text-[11px]">اتمام</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-semibold">خرید</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
