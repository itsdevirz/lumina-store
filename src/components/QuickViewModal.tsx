import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ShoppingBag, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    lang,
    formatPrice,
    addToCart,
    openProductDetails
  } = useStore();

  const [activeImgIdx, setActiveImgIdx] = useState(0);

  if (!quickViewProduct) return null;

  const images = quickViewProduct.images && quickViewProduct.images.length > 0
    ? quickViewProduct.images
    : ['/images/products/photo-1505740420928-5e560c06d30e.jpg'];

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIdx(prev => (prev + 1) % images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIdx(prev => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        onClick={() => {
          setQuickViewProduct(null);
          setActiveImgIdx(0);
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 8 }}
          transition={{ duration: 0.15 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-xl bg-white dark:bg-[#0C0C0E] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-2xl overflow-hidden p-5 text-xs"
        >
          {/* Header Row */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase text-zinc-400">
                {quickViewProduct.brand}
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">/</span>
              <span className="font-mono text-[10px] text-zinc-400">
                {quickViewProduct.id}
              </span>
            </div>

            <button
              onClick={() => {
                setQuickViewProduct(null);
                setActiveImgIdx(0);
              }}
              className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
            {/* Image Preview with Thumbnails */}
            <div className="space-y-2">
              <div className="relative aspect-square rounded-md overflow-hidden bg-zinc-50 dark:bg-zinc-900/50 img-outline">
                <img
                  src={images[activeImgIdx]}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />

                {images.length > 1 && (
                  <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                    <button
                      onClick={prevImg}
                      className="p-1 rounded bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 pointer-events-auto cursor-pointer tactile-press"
                    >
                      <ChevronLeft className="w-3 h-3 rtl:rotate-180" />
                    </button>
                    <button
                      onClick={nextImg}
                      className="p-1 rounded bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 pointer-events-auto cursor-pointer tactile-press"
                    >
                      <ChevronRight className="w-3 h-3 rtl:rotate-180" />
                    </button>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIdx(idx)}
                      className={`w-10 h-10 rounded overflow-hidden shrink-0 cursor-pointer tactile-press ${
                        activeImgIdx === idx
                          ? 'ring-2 ring-[#62DB00]'
                          : 'opacity-60 hover:opacity-100 img-outline'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                {lang === 'fa' ? quickViewProduct.nameFa : quickViewProduct.name}
              </h3>

              <div className="flex items-center gap-2 text-zinc-500 font-mono tabular-nums text-[11px]">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{quickViewProduct.rating}</span>
                </div>
                <span>•</span>
                <span>{quickViewProduct.reviewsCount} {lang === 'fa' ? 'نظر' : 'reviews'}</span>
                <span>•</span>
                <span className={quickViewProduct.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}>
                  {quickViewProduct.stock > 0 ? `${quickViewProduct.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                {lang === 'fa' ? quickViewProduct.descriptionFa : quickViewProduct.description}
              </p>

              {/* Price */}
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                {quickViewProduct.originalPrice && (
                  <div className="text-[10px] font-mono tabular-nums text-zinc-400 line-through">
                    {formatPrice(quickViewProduct.originalPrice, quickViewProduct.originalPriceUSD)}
                  </div>
                )}
                <div className="text-base font-mono tabular-nums font-bold text-zinc-900 dark:text-zinc-100">
                  {formatPrice(quickViewProduct.price, quickViewProduct.priceUSD)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    addToCart(quickViewProduct, 1);
                    setQuickViewProduct(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-medium hover:bg-[#62DB00] hover:text-black dark:hover:bg-[#62DB00] dark:hover:text-black transition-colors cursor-pointer tactile-press shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{lang === 'fa' ? 'افزودن به سبد' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={() => {
                    openProductDetails(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="px-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer tactile-press"
                >
                  {lang === 'fa' ? 'صفحه کامل' : 'Inspect'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
