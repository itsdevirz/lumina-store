import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const WishlistView: React.FC = () => {
  const {
    wishlist,
    products,
    lang,
    setActiveTab,
    addToCart,
    toggleWishlist,
    addToast
  } = useStore();

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const handleMoveAllToCart = () => {
    let addedCount = 0;
    wishlistProducts.forEach(product => {
      if (product.stock > 0) {
        addToCart(product, 1);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      addToast({
        title:
          lang === 'fa'
            ? `${addedCount} کالا به سبد خرید افزوده شد`
            : `${addedCount} items moved to cart`,
        type: 'success'
      });
    }
  };

  const handleClearWishlist = () => {
    wishlist.forEach(id => toggleWishlist(id));
  };

  return (
    <div className="py-8 sm:py-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                {lang === 'fa' ? 'محصولات نشان‌شده' : 'Saved Hardware'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">
              {lang === 'fa' ? 'علاقه‌مندی‌های شما' : 'My Wishlist'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {lang === 'fa'
                ? `${wishlistProducts.length} محصول برای بررسی یا خرید ذخیره شده است`
                : `${wishlistProducts.length} items saved for future purchase`}
            </p>
          </div>

          {wishlistProducts.length > 0 && (
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleMoveAllToCart}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-[#62DB00] hover:text-black dark:hover:bg-[#62DB00] dark:hover:text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{lang === 'fa' ? 'انتقال همه به سبد' : 'Move All to Cart'}</span>
              </button>

              <button
                onClick={handleClearWishlist}
                className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title={lang === 'fa' ? 'پاک‌سازی همه' : 'Clear Wishlist'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {wishlistProducts.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-[#111113] rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-8 shadow-xs max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-200 dark:border-rose-900/40">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              {lang === 'fa' ? 'لیست علاقه‌مندی‌های شما خالی است' : 'Your Wishlist is Empty'}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-6 leading-relaxed">
              {lang === 'fa'
                ? 'با کلیک روی آیکون قلب در کنار هر محصول، آن را برای خرید آینده در این صفحه ذخیره نمایید.'
                : 'Click the heart icon on any product to bookmark it here for later.'}
            </p>
            <button
              onClick={() => setActiveTab('shop')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-[#62DB00] hover:text-black dark:hover:bg-[#62DB00] dark:hover:text-black text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <span>{lang === 'fa' ? 'مشاهده کاتالوگ فروشگاه' : 'Explore Store'}</span>
              {lang === 'fa' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
