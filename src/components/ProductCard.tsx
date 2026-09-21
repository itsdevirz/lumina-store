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
  ArrowRight,
  ArrowLeft,
  Sliders,
  Award,
  CheckCircle2,
  TrendingUp,
  Clock,
  Plus
} from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { isColorAvailable } from '../utils/variantUtils';
import { playTactileClick, playNotificationChime } from '../utils/sound';

export type ProductCardVariant =
  | 'standard'
  | 'featured'
  | 'bestseller'
  | 'discount'
  | 'new_arrival'
  | 'compact'
  | 'recommended';

export interface ProductCardProps {
  product: Product;
  rankingBadge?: number;
  priority?: boolean;
  variant?: ProductCardVariant;
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
  priority = false,
  variant = 'standard',
  curatorNote,
  curatorNoteFa,
  pairingNote,
  pairingNoteFa,
  claimedPercent = 78,
  batchCode = 'BATCH-04'
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

  // Selected image depending on active color swatch
  const activeColorImage =
    selectedColorIdx !== null && product.colors?.[selectedColorIdx]?.image
      ? product.colors[selectedColorIdx].image
      : null;

  const primaryImage = activeColorImage || product.images[0];
  const secondaryImage = hasMultipleImages ? product.images[1] : primaryImage;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdding || isAdded) return;

    playTactileClick(1400);
    setIsAdding(true);
    setTimeout(() => {
      const chosenColor =
        selectedColorIdx !== null ? product.colors?.[selectedColorIdx]?.name : undefined;
      addToCart(product, 1, chosenColor);
      setIsAdding(false);
      setIsAdded(true);
      playNotificationChime();
      setTimeout(() => setIsAdded(false), 1800);
    }, 240);
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

  /* =========================================================================
     COMPOSITION 1: COMPACT PRODUCT ROW (High-Density Executive Strip)
     ========================================================================= */
  if (variant === 'compact') {
    return (
      <div
        onClick={() => openProductDetails(product)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 cursor-pointer shadow-xs tactile-press"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Square Photo with Outline */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shrink-0 img-outline">
            <img
              src={primaryImage}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
            {product.discountPercent && (
              <span className="absolute top-1 left-1 px-1 py-0.2 rounded text-[9px] font-mono tabular-nums font-bold bg-[#62DB00] text-black shadow-xs">
                -{product.discountPercent}%
              </span>
            )}
          </div>

          {/* Product Meta */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold truncate">
                {product.brand}
              </span>
              <div className="flex items-center gap-0.5 text-amber-400 text-[10px] font-mono">
                <Star className="w-2.5 h-2.5 fill-current" />
                <span className="text-zinc-600 dark:text-zinc-400">{product.rating}</span>
              </div>
            </div>

            <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-[#62DB00] transition-colors">
              {lang === 'fa' ? product.nameFa : product.name}
            </h4>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs sm:text-sm font-mono tabular-nums font-bold text-zinc-900 dark:text-white">
                {formatPrice(product.price, product.priceUSD)}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] font-mono tabular-nums text-zinc-400 line-through">
                  {formatPrice(product.originalPrice, product.originalPriceUSD)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1.5 shrink-0 rtl:mr-2 ltr:ml-2">
          <button
            onClick={handleQuickView}
            aria-label="Quick View"
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors tactile-press hidden sm:block"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isAdding || isAdded || product.stock <= 0}
            className={`p-2 rounded-xl border transition-all cursor-pointer tactile-press ${
              isAdded
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-[#62DB00] hover:text-black dark:hover:bg-[#62DB00] dark:hover:text-black border-transparent shadow-xs'
            }`}
          >
            {isAdded ? (
              <Check className="w-4 h-4 stroke-[2.2]" />
            ) : isAdding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
     COMPOSITION 2: FEATURED EDITORIAL CARD (Large Showcase Composition)
     ========================================================================= */
  if (variant === 'featured') {
    return (
      <div
        onClick={() => openProductDetails(product)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex flex-col justify-between h-full w-full rounded-3xl bg-white dark:bg-[#0D0D10] border border-zinc-200/90 dark:border-zinc-800 p-6 sm:p-8 overflow-hidden transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/10 cursor-pointer select-none"
      >
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#62DB00]/8 dark:bg-[#62DB00]/12 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="relative z-10 flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#62DB00]/15 text-[#62DB00] font-mono text-[10px] font-bold tracking-widest border border-[#62DB00]/30 uppercase">
                {lang === 'fa' ? 'پرچمدار استودیو' : 'EDITORIAL SPOTLIGHT'}
              </span>
              <span className="text-[11px] font-mono text-zinc-400 uppercase font-medium">
                {product.brand}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-display font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight group-hover:text-[#62DB00] transition-colors">
              {lang === 'fa' ? product.nameFa : product.name}
            </h3>
          </div>

          <button
            onClick={handleToggleWishlist}
            aria-label="Wishlist"
            className={`p-2.5 rounded-2xl transition-all cursor-pointer shadow-xs tactile-press ${
              inWishlist
                ? 'bg-rose-500 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-400 hover:text-rose-500 border border-zinc-200/60 dark:border-zinc-700/60'
            }`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Large Stage Product Photography */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/50 my-4 img-outline">
          <img
            src={primaryImage}
            alt={product.name}
            loading={priority ? 'eager' : 'lazy'}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ${
              isHovered && hasMultipleImages ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
          />
          {hasMultipleImages && (
            <img
              src={secondaryImage}
              alt={product.name}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
            />
          )}

          {/* Floating Spec Overlays */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
              {Object.entries(product.specs).slice(0, 3).map(([k, v], idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md text-white font-mono text-[10px] border border-white/10"
                >
                  <span className="text-zinc-400 uppercase mr-1">{k}:</span>
                  <span className="text-[#62DB00] font-bold">{v}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Technical Highlights / Description */}
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
          {lang === 'fa' ? product.descriptionFa : product.description}
        </p>

        {/* Footer: Color Variants Swatch + Pricing & Actions */}
        <div className="relative z-10 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Swatches & Stock */}
          <div className="flex items-center gap-3">
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center -space-x-1 rtl:space-x-reverse" onClick={e => e.stopPropagation()}>
                {product.colors.slice(0, 4).map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColorIdx(idx)}
                    title={color.nameFa || color.name}
                    className={`w-5 h-5 rounded-full border-2 transition-transform ${
                      selectedColorIdx === idx
                        ? 'border-zinc-900 dark:border-white scale-110 z-10'
                        : 'border-white dark:border-zinc-800'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-500 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{lang === 'fa' ? 'آماده ارسال اکسپرس' : 'In Stock • Ready to Dispatch'}</span>
            </div>
          </div>

          {/* Pricing & CTA Button */}
          <div className="flex items-center gap-3 justify-between sm:justify-end">
            <div className="text-right rtl:text-right ltr:text-left">
              {product.originalPrice && (
                <span className="text-[11px] font-mono tabular-nums text-zinc-400 line-through block">
                  {formatPrice(product.originalPrice, product.originalPriceUSD)}
                </span>
              )}
              <span className="text-base sm:text-xl font-mono tabular-nums font-extrabold text-zinc-900 dark:text-white">
                {formatPrice(product.price, product.priceUSD)}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding || isAdded || product.stock <= 0}
              className={`h-11 px-5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer tactile-press shadow-xs ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-[#62DB00] hover:text-black dark:hover:bg-[#62DB00] dark:hover:text-black'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.2]" />
                  <span>{lang === 'fa' ? 'افزوده شد' : 'Added'}</span>
                </>
              ) : isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>{lang === 'fa' ? 'خرید مستقیم' : 'Add to Order'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     COMPOSITION 3: BESTSELLER CARD (Prestige Numbered Composition)
     ========================================================================= */
  if (variant === 'bestseller') {
    return (
      <div
        onClick={() => openProductDetails(product)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex flex-col justify-between h-full w-full bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-3xl p-4 transition-all duration-200 hover:shadow-xl hover:shadow-black/5 cursor-pointer select-none"
      >
        {/* Top Badges: Ranking Index + Sales Velocity */}
        <div className="flex items-center justify-between mb-3 z-10">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-zinc-900 text-[#62DB00] dark:bg-zinc-800 dark:text-[#62DB00] font-mono text-xs font-black shadow-xs border border-zinc-800 dark:border-zinc-700">
              #{rankingBadge || product.rank || 1}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-mono font-bold flex items-center gap-1">
              <TrendingUp className="w-2.5 h-2.5" />
              <span>{lang === 'fa' ? 'پرفروش‌ترین' : 'Top Choice'}</span>
            </span>
          </div>

          <button
            onClick={handleToggleWishlist}
            aria-label="Wishlist"
            className={`p-1.5 rounded-xl transition-all cursor-pointer tactile-press ${
              inWishlist
                ? 'bg-rose-500 text-white'
                : 'text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Image Stage */}
        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/50 mb-3 img-outline">
          <img
            src={primaryImage}
            alt={product.name}
            loading={priority ? 'eager' : 'lazy'}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />

          {/* Hover Quick View */}
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleQuickView}
              className="w-full py-2 rounded-xl bg-white/95 dark:bg-zinc-900/95 text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-1.5 shadow-md border border-zinc-200/80 dark:border-zinc-700/80 hover:bg-[#62DB00] hover:text-black dark:hover:bg-[#62DB00] dark:hover:text-black transition-colors tactile-press"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{lang === 'fa' ? 'مشاهده سریع' : 'Quick View'}</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1">
              <span className="uppercase font-semibold">{product.brand}</span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-zinc-700 dark:text-zinc-300 font-bold">{product.rating}</span>
                <span className="text-zinc-400">({product.reviewsCount})</span>
              </div>
            </div>

            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug mb-2 group-hover:text-[#62DB00] transition-colors">
              {lang === 'fa' ? product.nameFa : product.name}
            </h3>

            <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mb-3">
              {lang === 'fa'
                ? `بیش از ${product.soldCount} سفارش موفق در این ماه`
                : `${product.soldCount}+ verified orders this month`}
            </div>
          </div>

          {/* Pricing & Add */}
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              {product.originalPrice && (
                <span className="text-[10px] font-mono tabular-nums text-zinc-400 line-through">
                  {formatPrice(product.originalPrice, product.originalPriceUSD)}
                </span>
              )}
              <span className="text-sm font-mono tabular-nums font-extrabold text-zinc-900 dark:text-white">
                {formatPrice(product.price, product.priceUSD)}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding || isAdded || product.stock <= 0}
              className={`h-9 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer tactile-press shadow-xs ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-[#62DB00] hover:text-black dark:hover:bg-[#62DB00] dark:hover:text-black'
              }`}
            >
              {isAdded ? (
                <Check className="w-4 h-4 stroke-[2.2]" />
              ) : isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{lang === 'fa' ? 'سفارش' : 'Order'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     COMPOSITION 4: DISCOUNT / FLASH SALE CARD (Urgent Drop Composition)
     ========================================================================= */
  if (variant === 'discount') {
    return (
      <div
        onClick={() => openProductDetails(product)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex flex-col justify-between h-full w-full bg-white dark:bg-[#111113] border border-rose-500/20 dark:border-rose-500/30 hover:border-[#62DB00] dark:hover:border-[#62DB00] rounded-3xl p-3.5 sm:p-4 transition-all duration-200 hover:shadow-xl cursor-pointer select-none"
      >
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-3 z-10">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white font-mono text-[11px] font-black shadow-xs">
              -{product.discountPercent || 20}%
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono text-[10px] font-bold">
              {batchCode}
            </span>
          </div>

          <button
            onClick={handleToggleWishlist}
            aria-label="Wishlist"
            className={`p-1.5 rounded-xl transition-all cursor-pointer tactile-press ${
              inWishlist
                ? 'bg-rose-500 text-white'
                : 'text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Product Image Stage */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/50 mb-3 img-outline">
          <img
            src={primaryImage}
            alt={product.name}
            loading={priority ? 'eager' : 'lazy'}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />

          {/* Quick View Button */}
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleQuickView}
              className="w-full py-1.5 rounded-xl bg-white/95 dark:bg-zinc-900/95 text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-1 shadow-md border border-zinc-200/80 dark:border-zinc-700/80 hover:bg-[#62DB00] hover:text-black dark:hover:bg-[#62DB00] dark:hover:text-black transition-colors tactile-press"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{lang === 'fa' ? 'پیش‌نمایش' : 'Preview'}</span>
            </button>
          </div>
        </div>

        {/* Content & Allocation Progress Meter */}
        <div className="flex flex-col flex-1 justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
              {product.brand}
            </span>
            <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug mb-2 group-hover:text-[#62DB00] transition-colors">
              {lang === 'fa' ? product.nameFa : product.name}
            </h3>

            {/* Inventory Claim Meter */}
            <div className="space-y-1 mb-3">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>{lang === 'fa' ? `${claimedPercent}٪ رزرو شده` : `${claimedPercent}% Claimed`}</span>
                <span className="text-rose-500 font-bold">
                  {lang === 'fa' ? `تنها ${product.stock} عدد باقیست` : `Only ${product.stock} left`}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-[#62DB00] transition-all duration-500"
                  style={{ width: `${claimedPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Pricing & Claim Button */}
          <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              {product.originalPrice && (
                <span className="text-[10px] font-mono tabular-nums text-zinc-400 line-through">
                  {formatPrice(product.originalPrice, product.originalPriceUSD)}
                </span>
              )}
              <span className="text-xs sm:text-sm font-mono tabular-nums font-black text-rose-500 dark:text-rose-400">
                {formatPrice(product.price, product.priceUSD)}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding || isAdded || product.stock <= 0}
              className={`h-9 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer tactile-press shadow-xs ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-500 hover:bg-rose-600 text-white'
              }`}
            >
              {isAdded ? (
                <Check className="w-4 h-4 stroke-[2.2]" />
              ) : isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>{lang === 'fa' ? 'دریافت تخفیف' : 'Claim'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     COMPOSITION 5: NEW ARRIVAL CARD (Editorial Fashion / Minimalist Composition)
     ========================================================================= */
  if (variant === 'new_arrival') {
    return (
      <div
        onClick={() => openProductDetails(product)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex flex-col justify-between h-full w-full bg-white dark:bg-[#0D0D10] border border-zinc-200/70 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-3xl p-4 sm:p-5 transition-all duration-300 hover:shadow-2xl cursor-pointer select-none"
      >
        {/* Subtle Editorial Top Tag */}
        <div className="flex items-center justify-between mb-3 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#62DB00]" />
            <span>DROP 2026</span>
          </span>
          <span className="text-zinc-500 font-semibold">{product.brand}</span>
        </div>

        {/* Large Minimal Stage Photo */}
        <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-100/60 dark:bg-zinc-900/40 mb-4 img-outline">
          <img
            src={primaryImage}
            alt={product.name}
            loading={priority ? 'eager' : 'lazy'}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ${
              isHovered && hasMultipleImages ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
          />
          {hasMultipleImages && (
            <img
              src={secondaryImage}
              alt={product.name}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
            />
          )}

          {/* Subtle Corner Wishlist */}
          <button
            onClick={handleToggleWishlist}
            aria-label="Wishlist"
            className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 dark:bg-black/60 backdrop-blur-md text-zinc-500 hover:text-rose-500 transition-colors cursor-pointer tactile-press shadow-xs"
          >
            <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Minimal Typography */}
        <div className="space-y-1.5 mb-3">
          <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-snug group-hover:text-[#62DB00] transition-colors">
            {lang === 'fa' ? product.nameFa : product.name}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
            {lang === 'fa' ? product.categoryFa : product.category}
          </p>
        </div>

        {/* Bottom Strip: Pure Price and Minimal Quick Action */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between mt-auto">
          <span className="text-sm sm:text-base font-mono tabular-nums font-bold text-zinc-900 dark:text-white">
            {formatPrice(product.price, product.priceUSD)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={isAdding || isAdded || product.stock <= 0}
            className={`h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer tactile-press ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-[#62DB00] hover:text-black dark:hover:bg-[#62DB00] dark:hover:text-black'
            }`}
          >
            {isAdded ? (
              <Check className="w-3.5 h-3.5 stroke-[2.2]" />
            ) : isAdding ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <span>{lang === 'fa' ? 'افزودن' : 'Add to Bag'}</span>
            )}
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
     COMPOSITION 6: RECOMMENDED / CURATOR'S CHOICE CARD
     ========================================================================= */
  if (variant === 'recommended') {
    return (
      <div
        onClick={() => openProductDetails(product)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex flex-col justify-between h-full w-full bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800/80 hover:border-[#62DB00]/60 rounded-3xl p-4 sm:p-5 transition-all duration-200 hover:shadow-xl cursor-pointer select-none"
      >
        {/* Curator Note Banner */}
        <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800 mb-3 flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#62DB00] shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 block font-mono text-[10px] uppercase tracking-wider">
              {lang === 'fa' ? 'پیشنهاد کارشناس لومینا' : "Curator's Choice"}
            </span>
            <span className="text-zinc-600 dark:text-zinc-400">
              {lang === 'fa'
                ? curatorNoteFa || 'تست‌شده برای حداکثر پایداری در ست‌آپ‌های حرفه‌ای'
                : curatorNote || 'Engineered for seamless integration with studio setups'}
            </span>
          </div>
        </div>

        {/* Product Image Stage */}
        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900/50 mb-3 img-outline">
          <img
            src={primaryImage}
            alt={product.name}
            loading={priority ? 'eager' : 'lazy'}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />

          {pairingNote && (
            <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white font-mono text-[9px] border border-white/10">
              {lang === 'fa' ? pairingNoteFa || 'مکمل استودیو' : pairingNote}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col flex-1 justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold">
                {product.brand}
              </span>
              <div className="flex items-center gap-1 text-amber-400 text-[11px] font-mono">
                <Star className="w-3 h-3 fill-current" />
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">{product.rating}</span>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug mb-2 group-hover:text-[#62DB00] transition-colors">
              {lang === 'fa' ? product.nameFa : product.name}
            </h3>
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between mt-auto">
            <span className="text-sm font-mono tabular-nums font-bold text-zinc-900 dark:text-white">
              {formatPrice(product.price, product.priceUSD)}
            </span>

            <button
              onClick={handleAddToCart}
              disabled={isAdding || isAdded || product.stock <= 0}
              className={`h-9 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer tactile-press shadow-xs ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-[#62DB00] hover:text-black dark:hover:bg-[#62DB00] dark:hover:text-black'
              }`}
            >
              {isAdded ? (
                <Check className="w-4 h-4 stroke-[2.2]" />
              ) : isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{lang === 'fa' ? 'انتخاب' : 'Select'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     COMPOSITION 0: STANDARD CARD (Default Grid Composition)
     ========================================================================= */
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => openProductDetails(product)}
      className="group relative flex flex-col justify-between h-full w-full bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700/90 rounded-3xl p-3 sm:p-3.5 transition-all duration-200 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 cursor-pointer select-none"
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
            <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-mono tabular-nums font-bold shadow-xs">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Right Side: Wishlist Toggle Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`pointer-events-auto p-2 rounded-xl transition-all duration-150 cursor-pointer shadow-xs tactile-press ${
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
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/40 mb-3 shrink-0 img-outline">
        <img
          src={primaryImage}
          alt={product.name}
          loading={priority ? 'eager' : 'lazy'}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-300 ${
            isHovered && hasMultipleImages ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
        />

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
            className="w-full py-2 px-3 rounded-xl bg-white/95 dark:bg-zinc-900/95 text-zinc-900 dark:text-zinc-100 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md border border-zinc-200/80 dark:border-zinc-700/80 hover:bg-[#62DB00] hover:text-black dark:hover:bg-[#62DB00] dark:hover:text-black transition-colors cursor-pointer tactile-press"
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
              <span className="text-[11px] font-mono tabular-nums text-zinc-400 line-through">
                {formatPrice(product.originalPrice, product.originalPriceUSD)}
              </span>
            )}
            <span className="text-xs sm:text-sm font-mono tabular-nums font-bold text-zinc-950 dark:text-white">
              {formatPrice(product.price, product.priceUSD)}
            </span>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding || isAdded || product.stock <= 0}
            aria-label={lang === 'fa' ? 'افزودن به سبد خرید' : 'Add to cart'}
            className={`flex items-center justify-center h-9 px-3 rounded-xl border font-semibold text-xs transition-all duration-150 cursor-pointer tactile-press ${
              product.stock <= 0
                ? 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400 border-transparent cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                : 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-[#62DB00] hover:text-black dark:hover:bg-[#62DB00] dark:hover:text-black border-transparent shadow-xs'
            }`}
          >
            {isAdding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isAdded ? (
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4 stroke-[2.2]" />
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
    <div className="flex flex-col justify-between h-full w-full bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-3.5 animate-pulse">
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
