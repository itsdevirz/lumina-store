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
  Zap
} from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  rankingBadge?: number;
}

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
      setTimeout(() => setIsAdded(false), 1600);
    }, 220);
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

  return (
    <div
      onClick={() => openProductDetails(product)}
      className="group relative flex flex-col justify-between h-full w-full bg-white dark:bg-[#0C0C0E] border border-zinc-200 dark:border-zinc-800/90 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-lg p-3 transition-colors duration-150 cursor-pointer select-none"
    >
      {/* Ranking Badge (for Best Sellers) */}
      {rankingBadge && (
        <div className="absolute top-2 left-2 z-20 flex items-center justify-center px-1.5 py-0.5 rounded bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[10px] font-mono font-bold shadow-xs">
          #{rankingBadge}
        </div>
      )}

      {/* Image Container - Square Aspect Ratio */}
      <div className="relative aspect-square w-full rounded-md overflow-hidden bg-zinc-50 dark:bg-zinc-900/60 mb-2.5 shrink-0 border border-zinc-100 dark:border-zinc-800/60">
        <img
          src={product.images[currentImgIndex] || product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-200 group-hover:scale-103"
        />

        {/* Minimal Tags */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end pointer-events-none">
          {product.discountPercent && (
            <span className="px-1.5 py-0.5 rounded bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[10px] font-mono font-semibold">
              {lang === 'fa' ? `${product.discountPercent}٪-` : `-${product.discountPercent}%`}
            </span>
          )}
          {product.isFlashSale && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[9px] font-mono font-semibold">
              <Zap className="w-2.5 h-2.5 fill-current" />
              <span>{lang === 'fa' ? 'پیشنهاد آنی' : 'Flash'}</span>
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2 left-2 z-10 p-1.5 rounded-md transition-colors duration-150 cursor-pointer ${
            inWishlist
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 dark:bg-zinc-900/80 text-zinc-400 hover:text-rose-500 border border-zinc-200/60 dark:border-zinc-700/60'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Gallery Chevrons on Hover */}
        {hasMultipleImages && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 hidden sm:block">
            <button
              onClick={handlePrevImage}
              aria-label="Previous image"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 p-1 rounded bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-2xs hover:bg-zinc-100 cursor-pointer"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={handleNextImage}
              aria-label="Next image"
              className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 p-1 rounded bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-2xs hover:bg-zinc-100 cursor-pointer"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Quick View Button on Hover */}
        <button
          onClick={handleQuickView}
          className="absolute inset-x-2 bottom-2 py-1 px-2 rounded-md bg-zinc-900/90 dark:bg-zinc-100/95 text-white dark:text-zinc-900 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-all duration-150 translate-y-0.5 group-hover:translate-y-0 hidden sm:flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Eye className="w-3 h-3 text-indigo-400 dark:text-indigo-600" />
          <span>{lang === 'fa' ? 'پیش‌نمایش سریع' : 'Quick Preview'}</span>
        </button>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Rating Row */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider truncate max-w-[110px]">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-zinc-500 font-mono text-[10px]">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 min-h-[2rem] leading-snug mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {lang === 'fa' ? product.nameFa : product.name}
          </h3>

          {/* Color swatches with disabled state if out of stock */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="flex items-center -space-x-1 rtl:space-x-reverse">
                {product.colors.slice(0, 4).map((c, i) => {
                  const isColorOutOfStock = c.inStock === false;
                  return (
                    <span
                      key={i}
                      title={`${c.nameFa || c.name}${isColorOutOfStock ? ' (ناموجود)' : ''}`}
                      className={`relative w-2.5 h-2.5 rounded-full border border-white dark:border-zinc-800 ${
                        isColorOutOfStock ? 'opacity-30 cursor-not-allowed' : ''
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {isColorOutOfStock && (
                        <span className="absolute inset-0 m-auto w-full h-[1px] bg-rose-500 rotate-45" />
                      )}
                    </span>
                  );
                })}
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                {product.colors.length} {lang === 'fa' ? 'رنگ' : 'colors'}
              </span>
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 mt-auto">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-[10px] font-mono text-zinc-400 line-through">
                {formatPrice(product.originalPrice, product.originalPriceUSD)}
              </span>
            )}
            <span className="text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-100">
              {formatPrice(product.price, product.priceUSD)}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding || isAdded}
            className={`flex items-center justify-center w-7 h-7 rounded-md border transition-colors duration-150 cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900'
            }`}
            aria-label={lang === 'fa' ? 'افزودن به سبد' : 'Add to cart'}
          >
            {isAdding ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500" />
            ) : isAdded ? (
              <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
