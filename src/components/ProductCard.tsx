import React, { useState } from 'react';
import {
  Star,
  Heart,
  ShoppingBag,
  Eye,
  Check,
  Loader2
} from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { playTactileClick, playNotificationChime } from '../utils/sound';

export interface ProductCardProps {
  product: Product;
  rankingBadge?: number;
  priority?: boolean;
  variant?: string;
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
      className="group relative flex flex-col h-full w-full rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 p-2.5 sm:p-3.5 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden select-none"
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
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex items-center gap-1 z-10 pointer-events-none">
          {rankingBadge && (
            <span className="px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-mono font-bold bg-amber-500 text-white shadow-xs">
              #{rankingBadge}
            </span>
          )}
          {hasDiscount && discountValue && (
            <span className="px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-mono tabular-nums font-bold bg-rose-500 text-white shadow-xs">
              {discountValue}٪-
            </span>
          )}
        </div>

        {/* Action Overlay: Wishlist & QuickView */}
        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex flex-col gap-1.5 z-10">
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label="افزودن به علاقه‌مندی‌ها"
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-xs ${
              inWishlist
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 dark:bg-zinc-800/90 text-zinc-400 hover:text-rose-500 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60'
            }`}
          >
            <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
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

      {/* 2. Structured Card Information (Clean, Minimal, Mobile-Friendly) */}
      <div className="flex flex-col flex-1 min-h-0 pt-2 sm:pt-2.5">
        {/* Brand Label (Clean & uncluttered on mobile) */}
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-400 dark:text-zinc-400 font-medium mb-1 truncate">
          <span className="truncate text-emerald-600 dark:text-emerald-400 font-semibold">{product.brand}</span>
          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700" aria-hidden="true">·</span>
          <span className="hidden sm:inline truncate">{lang === 'fa' ? product.categoryFa : product.category}</span>
          
          {/* Rating (Compact on mobile) */}
          <div className="flex items-center gap-0.5 sm:hidden font-mono text-[10px] text-amber-500 font-bold">
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            <span>{product.rating ? product.rating.toFixed(1) : '۵.۰'}</span>
          </div>
        </div>

        {/* Product Title (2 lines clamp) */}
        <h3
          title={lang === 'fa' ? product.nameFa : product.name}
          className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2 min-h-[2.2rem] sm:min-h-[2.5rem] max-h-[2.2rem] sm:max-h-[2.5rem] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
        >
          {lang === 'fa' ? product.nameFa : product.name}
        </h3>

        {/* Desktop-only secondary metadata to prevent mobile clutter */}
        <div className="hidden sm:flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
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
              <span className="text-emerald-600 dark:text-emerald-400">موجود</span>
            ) : (
              <span className="text-rose-500">ناموجود</span>
            )}
          </div>
        </div>

        {/* 3. Card Footer with Aligned Price & Action CTA */}
        <div className="mt-auto pt-2 sm:pt-2.5 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Price Block */}
          <div className="flex flex-col min-w-0">
            {hasDiscount && product.originalPrice ? (
              <span className="text-[9px] sm:text-[10px] font-mono tabular-nums text-zinc-400 line-through leading-none mb-0.5">
                {formatPrice(product.originalPrice, product.originalPriceUSD)}
              </span>
            ) : null}
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
            className={`h-7 w-7 sm:h-8 sm:w-auto sm:px-2.5 rounded-lg sm:rounded-xl font-medium text-xs flex items-center justify-center gap-1 transition-all shadow-xs shrink-0 cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : !isAvailable
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline text-[11px]">ثبت شد</span>
              </>
            ) : isAdding ? (
              <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" />
            ) : !isAvailable ? (
              <span className="text-[9px] sm:text-[10px]">اتمام</span>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline font-semibold text-[11px]">خرید</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
