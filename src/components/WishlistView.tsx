import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const WishlistView: React.FC = () => {
  const { wishlist, products, lang, setActiveTab, addToCart, toggleWishlist } = useStore();

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {lang === 'fa' ? 'علاقه‌مندی‌های شما' : 'My Wishlist'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {lang === 'fa'
                ? `${wishlist.length} محصول در لیست علاقه‌مندی‌ها ذخیره شده است`
                : `${wishlist.length} saved products`}
            </p>
          </div>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8">
            <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {lang === 'fa' ? 'لیست علاقه‌مندی‌های شما خالی است' : 'Your wishlist is currently empty'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto mb-6">
              {lang === 'fa'
                ? 'با کلیک روی آیکون قلب در کنار هر محصول، آن را برای خرید آینده در این صفحه ذخیره نمایید.'
                : 'Click the heart icon on any product to save it here for later.'}
            </p>
            <button
              onClick={() => setActiveTab('shop')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md"
            >
              <span>{lang === 'fa' ? 'مشاهده کاتالوگ فروشگاه' : 'Explore Store'}</span>
              <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
