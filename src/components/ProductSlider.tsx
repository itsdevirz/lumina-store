import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface ProductSliderProps {
  title?: { fa: string; en: string };
  subtitle?: { fa: string; en: string };
  products?: Product[];
}

export const ProductSlider: React.FC<ProductSliderProps> = ({
  title,
  subtitle,
  products: customProducts
}) => {
  const { products, lang, setActiveTab } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Selected hot / featured products
  const sliderProducts = customProducts || products.filter(p => p.featured || p.isFlashSale || (p.rank && p.rank <= 8));
  const totalItems = sliderProducts.length;

  // Responsive items per view (more compact and higher density)
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width < 440) {
        setItemsPerPage(2.2); // 2 full cards + 20% preview peek on phones
      } else if (width < 640) {
        setItemsPerPage(2.6); // 2 full cards + 60% preview on large phones
      } else if (width < 768) {
        setItemsPerPage(3.2);
      } else if (width < 1024) {
        setItemsPerPage(4);
      } else {
        setItemsPerPage(5);
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const maxIndex = Math.max(0, Math.ceil(totalItems - itemsPerPage));

  const nextSlide = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Touch gesture support for mobile swiping
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsHovered(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 35;
    if (Math.abs(distance) > minSwipeDistance) {
      if (isRTL) {
        if (distance > 0) prevSlide();
        else nextSlide();
      } else {
        if (distance > 0) nextSlide();
        else prevSlide();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Automatic slideshow without manual play/pause buttons (pauses smoothly on hover/touch)
  useEffect(() => {
    if (isHovered || totalItems <= itemsPerPage) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, 3400);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, maxIndex, totalItems, itemsPerPage]);

  const defaultTitle = {
    fa: 'اسلایدر هوشمند محصولات برگزیده',
    en: 'Featured Products Spotlight'
  };

  const defaultSubtitle = {
    fa: 'چرخش خودکار محبوب‌ترین تجهیزات و گجت‌های هوشمند لومینا',
    en: 'Auto-rotating handpicked selection of premium gear'
  };

  const heading = title || defaultTitle;
  const subHeading = subtitle || defaultSubtitle;

  const isRTL = lang === 'fa';
  const itemWidthPercent = 100 / itemsPerPage;
  const translateXValue = (isRTL ? 1 : -1) * (currentIndex * itemWidthPercent);

  return (
    <section 
      className="py-6 sm:py-8 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header with Title and Nav Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-[#E80645] dark:text-rose-400 text-[11px] sm:text-xs font-bold border border-rose-200/50 dark:border-rose-900/40">
              <Flame className="w-3.5 h-3.5" />
              <span>{lang === 'fa' ? 'پیشنهادهای ویژه و پرفروش' : 'Featured & Trending'}</span>
            </span>
          </div>

          <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {lang === 'fa' ? heading.fa : heading.en}
          </h2>

          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {lang === 'fa' ? subHeading.fa : subHeading.en}
          </p>
        </div>

        {/* Navigation Controls: Prev / Next Buttons and View All */}
        <div className="flex items-center gap-1.5 sm:gap-2 self-end sm:self-auto">
          {/* Prev Arrow */}
          <button
            onClick={prevSlide}
            aria-label={lang === 'fa' ? 'محصول قبلی' : 'Previous product'}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Next Arrow */}
          <button
            onClick={nextSlide}
            aria-label={lang === 'fa' ? 'محصول بعدی' : 'Next product'}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* View All Button */}
          <button
            onClick={() => {
              setActiveTab('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-xs"
          >
            <span>{lang === 'fa' ? 'مشاهده کاتالوگ' : 'View All'}</span>
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
          </button>
        </div>
      </div>

      {/* Slider Carousel Viewport */}
      <div className="relative overflow-hidden rounded-2xl w-full">
        <div
          className="flex items-stretch transition-transform duration-500 ease-out -mx-1 sm:-mx-1.5 lg:-mx-2"
          style={{
            transform: `translateX(${translateXValue}%)`,
          }}
        >
          {sliderProducts.map((product) => (
            <div
              key={product.id}
              style={{ width: `${itemWidthPercent}%` }}
              className="shrink-0 px-1 sm:px-1.5 lg:px-2 flex flex-col items-stretch"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dot Indicators */}
      {maxIndex > 0 && (
        <div className="flex justify-center items-center gap-1.5 mt-4 sm:mt-5">
          {Array.from({ length: Math.min(8, maxIndex + 1) }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx
                  ? 'w-5 sm:w-6 bg-[#E80645] shadow-xs'
                  : 'w-1.5 sm:w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
