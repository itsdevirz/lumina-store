import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  Heart,
  ShoppingBag,
  Eye,
  Check,
  Loader2,
  Zap,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { isColorAvailable } from '../utils/variantUtils';

interface ProductCardProps {
  product: Product;
  rankingBadge?: number;
  priority?: boolean;
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

  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorIdx, setSelectedColorIdx] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const hasMultipleImages = product.images && product.images.length > 1;

  // Secondary image for hover crossfade
  const secondaryImage = hasMultipleImages ? product.images[1] : product.images[0];
  const primaryImage = product.images[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdding || isAdded) return;

    setIsAdding(true);
    setTimeout(() => {
      // If a color is selected, pass that variant
      const chosenColor = selectedColorIdx !== null ? product.colors?.[selectedColorIdx]?.name : undefined;
      addToCart(product, 1, chosenColor);
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1800);
    }, 240);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => openProductDetails(product)}
      className="group relative flex flex-col justify-between h-full w-full bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700/90 rounded-2xl p-3 sm:p-3.5 transition-all duration-200 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 cursor-pointer select-none"
    >
      {/* Top Floating Badges */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-start justify-between pointer-events-none">
        {/* Left Side: Category Badges */}
        <div className="flex flex-col gap-1 items-start">
          {rankingBadge && (
            <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[10px] font-mono font-bold shadow-xs">
              #{rankingBadge}
            </span>
          )}
          {product.isFlashSale && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold shadow-xs">
              <Zap className="w-2.5 h-2.5 fill-current" />
              <span>{lang === 'fa' ? 'پیشنهاد آنی' : 'Flash'}</span>
            </span>
          )}
          {product.discountPercent && !product.isFlashSale && (
            <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-mono font-bold shadow-xs">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Right Side: Wishlist Toggle Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`pointer-events-auto p-2 rounded-xl transition-all duration-150 cursor-pointer shadow-xs ${
            inWishlist
              ? 'bg-rose-500 text-white scale-105'
              : 'bg-white/90 dark:bg-zinc-900/90 text-zinc-400 hover:text-rose-500 hover:scale-105 border border-zinc-200/60 dark:border-zinc-700/60'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform ${
              inWishlist ? 'fill-current scale-110' : ''
            }`}
          />
        </button>
      </div>

      {/* Product Image Gallery Canvas */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/40 mb-3 shrink-0 border border-zinc-100 dark:border-zinc-800/50">
        {/* Primary Image */}
        <img
          src={primaryImage}
          alt={product.name}
          loading={priority ? 'eager' : 'lazy'}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-300 ${
            isHovered && hasMultipleImages ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
        />

        {/* Secondary Image for smooth crossfade on hover */}
        {hasMultipleImages && (
          <img
            src={secondaryImage}
            alt={`${product.name} - view 2`}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-300 ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          />
        )}

        {/* Floating Quick View action on hover */}
        <div className="absolute inset-x-3 bottom-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 hidden sm:block">
          <button
            onClick={handleQuickView}
            className="w-full py-2 px-3 rounded-xl bg-white/95 dark:bg-zinc-900/95 text-zinc-900 dark:text-zinc-100 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md border border-zinc-200/80 dark:border-zinc-700/80 hover:bg-[#62DB00] hover:text-black dark:hover:bg-[#62DB00] dark:hover:text-black transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{lang === 'fa' ? 'مشاهده سریع' : 'Quick View'}</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Rating Row */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold truncate max-w-[120px]">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-semibold">{product.rating}</span>
              <span className="text-zinc-400 text-[10px]">({product.reviewsCount || 24})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 min-h-[2.5rem] leading-snug mb-2 group-hover:text-[#55A800] dark:group-hover:text-[#62DB00] transition-colors">
            {lang === 'fa' ? product.nameFa : product.name}
          </h3>

          {/* Color Variants Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3" onClick={e => e.stopPropagation()}>
              <div className="flex items-center -space-x-1 rtl:space-x-reverse">
                {product.colors.slice(0, 5).map((color, idx) => {
                  const isAvailable = isColorAvailable(product, color.name, null);
                  const isSelected = selectedColorIdx === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => isAvailable && setSelectedColorIdx(idx)}
                      disabled={!isAvailable}
                      title={`${color.nameFa || color.name}${!isAvailable ? ' (ناموجود)' : ''}`}
                      className={`relative w-4 h-4 rounded-full border-2 transition-transform ${
                        isSelected
                          ? 'border-zinc-900 dark:border-white scale-110 z-10'
                          : 'border-white dark:border-zinc-800'
                      } ${!isAvailable ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {!isAvailable && (
                        <span className="absolute inset-0 m-auto w-full h-[1.5px] bg-rose-500 rotate-45" />
                      )}
                    </button>
                  );
                })}
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                {product.colors.length} {lang === 'fa' ? 'رنگ' : 'colors'}
              </span>
            </div>
          )}
        </div>

        {/* Price and Cart Action Footer */}
        <div className="pt-2.5 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 mt-auto">
          {/* Price Stack */}
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-[11px] font-mono text-zinc-400 line-through">
                {formatPrice(product.originalPrice, product.originalPriceUSD)}
              </span>
            )}
            <span className="text-xs sm:text-sm font-mono font-bold text-zinc-950 dark:text-white">
              {formatPrice(product.price, product.priceUSD)}
            </span>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding || isAdded || product.stock <= 0}
            aria-label={lang === 'fa' ? 'افزودن به سبد خرید' : 'Add to cart'}
            className={`flex items-center justify-center h-9 px-3 rounded-xl border font-semibold text-xs transition-all duration-150 cursor-pointer ${
              product.stock <= 0
                ? 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400 border-transparent cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                : 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-[#62DB00] hover:text-black dark:hover:bg-[#62DB00] dark:hover:text-black border-transparent shadow-xs hover:scale-[1.02]'
            }`}
          >
            {isAdding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isAdded ? (
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4 stroke-[3]" />
                <span className="hidden sm:inline-block text-[11px]">
                  {lang === 'fa' ? 'افزوده شد' : 'Added'}
                </span>
              </div>
            ) : product.stock <= 0 ? (
              <span className="text-[10px]">{lang === 'fa' ? 'ناموجود' : 'Out of stock'}</span>
            ) : (
              <div className="flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline-block text-[11px]">
                  {lang === 'fa' ? 'خرید' : 'Add'}
                </span>
              </div>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full w-full bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-3.5 animate-pulse">
      <div className="aspect-square w-full rounded-xl bg-zinc-200 dark:bg-zinc-800/70 mb-3" />
      <div className="space-y-2">
        <div className="h-3 w-1/3 bg-zinc-200 dark:bg-zinc-800/70 rounded" />
        <div className="h-4 w-4/5 bg-zinc-200 dark:bg-zinc-800/70 rounded" />
        <div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-800/70 rounded" />
      </div>
      <div className="pt-3 mt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
        <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800/70 rounded" />
        <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-800/70 rounded-xl" />
      </div>
    </div>
  );
};
