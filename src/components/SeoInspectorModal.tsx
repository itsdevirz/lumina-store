import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  X,
  ExternalLink,
  Copy,
  Check,
  Search,
  Share2,
  Code2,
  Sparkles,
  Layers,
  FileText,
  Link2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { generateSeoMetadata } from '../services/seo';

interface SeoInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export const SeoInspectorModal: React.FC<SeoInspectorModalProps> = ({
  isOpen,
  onClose,
  isAdmin = false
}) => {
  const { activeTab, selectedProduct, filters, lang } = useStore();
  const [activeTabSub, setActiveTabSub] = useState<'serp' | 'tags' | 'social' | 'schema'>('serp');
  const [copied, setCopied] = useState<string | null>(null);

  const seo = generateSeoMetadata({
    activeTab,
    selectedProduct,
    selectedCategory: filters.selectedCategory,
    lang,
    isAdmin
  });

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <span>بررسی زنده تگ‌های سئو (Dynamic SEO Inspector)</span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800">
                    فعال و پویا
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  تگ‌های متای صفحه جاری که برای موتورهای جستجو تولید شده است
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTabSub('serp')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
                activeTabSub === 'serp'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>پیش‌نمایش گوگل (SERP)</span>
            </button>

            <button
              onClick={() => setActiveTabSub('tags')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
                activeTabSub === 'tags'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>تگ‌های متا و Canonical</span>
            </button>

            <button
              onClick={() => setActiveTabSub('social')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
                activeTabSub === 'social'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>کارت اشتراک‌گذاری (OG / Social)</span>
            </button>

            <button
              onClick={() => setActiveTabSub('schema')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
                activeTabSub === 'schema'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>ساختار JSON-LD</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* View Context Indicator */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-indigo-700 dark:text-indigo-300">موقعیت فعلی صفحه:</span>
                <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300 border border-indigo-200/50 dark:border-indigo-800/40">
                  {activeTab === 'product-detail'
                    ? `محصول: ${selectedProduct?.nameFa || selectedProduct?.name}`
                    : activeTab === 'shop'
                    ? `فروشگاه ${filters.selectedCategory && filters.selectedCategory !== 'all' ? `(دسته: ${filters.selectedCategory})` : '(همه محصولات)'}`
                    : activeTab}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">به‌روزرسانی خودکار با هر کلیک</span>
            </div>

            {/* TAB 1: GOOGLE SERP PREVIEW */}
            {activeTabSub === 'serp' && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  نمایش در نتایج جستجوی گوگل (Google Search Preview)
                </h4>

                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                  {/* Google search URL header */}
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-indigo-600">
                      L
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">Lumina Store</span>
                      <span className="text-[11px] text-slate-400 font-mono dir-ltr text-right truncate max-w-sm">
                        {seo.canonicalUrl}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="text-lg sm:text-xl font-medium text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-snug">
                    {seo.title}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {seo.description}
                  </p>

                  {/* Rich Snippet Details if Product */}
                  {selectedProduct && activeTab === 'product-detail' && (
                    <div className="pt-2 flex items-center gap-3 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-900">
                      <span className="text-amber-500 font-bold">★★★★★ {selectedProduct.rating}</span>
                      <span>·</span>
                      <span>{selectedProduct.reviewsCount || 18} نظر خریداران</span>
                      <span>·</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {selectedProduct.price.toLocaleString('fa-IR')} تومان
                      </span>
                      <span>·</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">موجود در انبار</span>
                    </div>
                  )}
                </div>

                {/* Character Counter Insights */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                    <div className="flex justify-between text-slate-500 mb-1">
                      <span>طول عنوان (Title Length):</span>
                      <span className="font-bold font-mono">{seo.title.length} کاراکتر</span>
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {seo.title.length >= 40 && seo.title.length <= 75 ? 'ایده‌آل برای گوگل (۴۰ تا ۷۰)' : 'استاندارد'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                    <div className="flex justify-between text-slate-500 mb-1">
                      <span>طول توضیحات (Description Length):</span>
                      <span className="font-bold font-mono">{seo.description.length} کاراکتر</span>
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {seo.description.length >= 120 && seo.description.length <= 165
                        ? 'ایده‌آل برای اسنیپت (۱۲۰ تا ۱۶۰)'
                        : 'استاندارد'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: META TAGS & CANONICAL */}
            {activeTabSub === 'tags' && (
              <div className="space-y-4">
                {/* Canonical Tag Box */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      <Link2 className="w-4 h-4" />
                      <span>تگ کانونیکال (Canonical Tag)</span>
                    </div>
                    <button
                      onClick={() => handleCopy(`<link rel="canonical" href="${seo.canonicalUrl}" />`, 'canonical')}
                      className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                      {copied === 'canonical' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied === 'canonical' ? 'کپی شد' : 'کپی تگ'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 font-mono text-xs text-slate-800 dark:text-slate-200 dir-ltr text-left break-all border border-slate-200 dark:border-slate-800 select-all">
                    {`<link rel="canonical" href="${seo.canonicalUrl}" />`}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    این تگ از ایجاد جریمه محتوای تکراری (Duplicate Content) در موتورهای جستجو جلوگیری کرده و آدرس رسمی صفحه را تعیین می‌کند.
                  </p>
                </div>

                {/* Meta Title Box */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">&lt;title&gt;</span>
                    <button
                      onClick={() => handleCopy(`<title>${seo.title}</title>`, 'title')}
                      className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                      {copied === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>کپی</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 font-mono text-xs text-slate-800 dark:text-slate-200 dir-ltr text-left border border-slate-200 dark:border-slate-800 select-all">
                    {`<title>${seo.title}</title>`}
                  </div>
                </div>

                {/* Meta Description Box */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">&lt;meta name="description" ...&gt;</span>
                    <button
                      onClick={() =>
                        handleCopy(`<meta name="description" content="${seo.description}" />`, 'desc')
                      }
                      className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                      {copied === 'desc' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>کپی</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 font-mono text-xs text-slate-800 dark:text-slate-200 dir-ltr text-left border border-slate-200 dark:border-slate-800 select-all">
                    {`<meta name="description" content="${seo.description}" />`}
                  </div>
                </div>

                {/* Robots tag */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">&lt;meta name="robots" ...&gt;</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 font-mono text-xs text-slate-800 dark:text-slate-200 dir-ltr text-left border border-slate-200 dark:border-slate-800 select-all">
                    {`<meta name="robots" content="${seo.noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}" />`}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SOCIAL / OPEN GRAPH PREVIEW */}
            {activeTabSub === 'social' && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  پیش‌نمایش اشتراک‌گذاری در شبکه‌های اجتماعی (Open Graph & Twitter Cards)
                </h4>

                <div className="max-w-md mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950 shadow-lg">
                  {seo.ogImage && (
                    <div className="relative aspect-16/9 bg-slate-100 dark:bg-slate-900 overflow-hidden">
                      <img
                        src={seo.ogImage}
                        alt={seo.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-[10px] text-white font-mono">
                        og:image
                      </div>
                    </div>
                  )}

                  <div className="p-4 space-y-1.5">
                    <span className="text-[11px] text-slate-400 uppercase font-mono block">
                      {new URL(seo.canonicalUrl).hostname}
                    </span>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {seo.title}
                    </h5>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {seo.description}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
                  <div className="font-bold text-slate-700 dark:text-slate-300">متادیتای شبکه‌های اجتماعی پیاده‌سازی شده:</div>
                  <ul className="list-disc list-inside text-slate-500 text-[11px] space-y-0.5">
                    <li>og:title, og:description, og:url, og:type ({seo.ogType})</li>
                    <li>og:image با ابعاد استاندارد اشتراک‌گذاری تلگرام، واتساپ و لینکدین</li>
                    <li>twitter:card (summary_large_image)، twitter:title، twitter:description</li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 4: SCHEMA.ORG JSON-LD */}
            {activeTabSub === 'schema' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      کد داده‌های ساختاریافته (JSON-LD Structured Data)
                    </h4>
                    <p className="text-xs text-slate-500">
                      تولید خودکار اسکیما جهت نمایش قیمت، امتیاز، ستاره و موجودی کالا در گوگل
                    </p>
                  </div>

                  {seo.jsonLd && (
                    <button
                      onClick={() => handleCopy(JSON.stringify(seo.jsonLd, null, 2), 'schema')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-100 transition-colors"
                    >
                      {copied === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied === 'schema' ? 'کپی شد!' : 'کپی کد JSON-LD'}</span>
                    </button>
                  )}
                </div>

                {seo.jsonLd ? (
                  <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 text-xs font-mono overflow-x-auto max-h-80 dir-ltr text-left border border-slate-800 select-all">
                    {JSON.stringify(seo.jsonLd, null, 2)}
                  </pre>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    برای این صفحه نیاز به استراکچردیتای خاصی نیست یا تگ‌های پایه اعمال شده‌اند.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>پشتیبانی کامل از استانداردهای گوگل، بینگ و استانداردهای OpenGraph</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              بستن
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
