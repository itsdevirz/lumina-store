import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ShoppingBag, ArrowLeft, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
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
    : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'];

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
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800/90 rounded-3xl shadow-2xl overflow-hidden p-5 sm:p-6"
        >
          {/* Close button */}
          <button
            onClick={() => {
              setQuickViewProduct(null);
              setActiveImgIdx(0);
            }}
            className="absolute top-4 left-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors z-20 cursor-pointer shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 items-center">
            {/* Image Slider Column */}
            <div className="flex flex-col gap-2.5">
              <div className="relative aspect-[4/3] sm:aspect-square max-h-64 sm:max-h-72 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImgIdx}
                    src={images[activeImgIdx]}
                    alt={quickViewProduct.name}
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="w-full h-full object-cover object-center"
                  />
                </AnimatePresence>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImg}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextImg}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </>
                )}

                {quickViewProduct.discountPercent && (
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-rose-500 text-white text-[10.5px] font-black shadow-md">
                    {lang === 'fa' ? `${quickViewProduct.discountPercent}٪ تخفیف` : `-${quickViewProduct.discountPercent}%`}
                  </span>
                )}
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="flex gap-2 justify-center overflow-x-auto pb-1 no-scrollbar">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIdx(idx)}
                      className={`relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 shrink-0 transition-all cursor-pointer ${
                        activeImgIdx === idx
                          ? 'border-indigo-600 dark:border-indigo-400 shadow-md scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Column */}
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                {quickViewProduct.brand}
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mb-2 leading-snug">
                {lang === 'fa' ? quickViewProduct.nameFa : quickViewProduct.name}
              </h3>

              <div className="flex items-center gap-1.5 text-xs mb-3">
                <div className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="font-black text-slate-900 dark:text-slate-100 text-xs">{quickViewProduct.rating}</span>
                </div>
                <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">({quickViewProduct.reviewsCount} {lang === 'fa' ? 'دیدگاه کاربران' : 'reviews'})</span>
              </div>

              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-3">
                {formatPrice(quickViewProduct.price, quickViewProduct.priceUSD)}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 mb-5 leading-relaxed font-normal bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                {lang === 'fa' ? quickViewProduct.descriptionFa : quickViewProduct.description}
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    addToCart(quickViewProduct, 1);
                    setQuickViewProduct(null);
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{lang === 'fa' ? 'افزودن به سبد خرید' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={() => {
                    openProductDetails(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <span>{lang === 'fa' ? 'مشاهده صفحه کامل محصول' : 'View Full Details'}</span>
                  <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

