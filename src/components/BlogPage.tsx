import React, { useState } from 'react';
import { BookOpen, Clock, ArrowLeft, ArrowRight, User, Share2, Tag, ChevronRight, Eye, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BLOG_POSTS, BlogPost } from '../data/blogData';
import { ProductCard } from './ProductCard';
import { playTactileClick } from '../utils/sound';
import { toPersianDigits } from '../utils/persianNumber';

export const BlogPage: React.FC = () => {
  const { lang, setActiveTab, products } = useStore();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredPosts = selectedCategory === 'all'
    ? BLOG_POSTS
    : BLOG_POSTS.filter(p => p.category === selectedCategory);

  const relatedProducts = selectedPost
    ? products.filter(p => p.category === selectedPost.category).slice(0, 3)
    : [];

  if (selectedPost) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6 font-medium">
          <button onClick={() => setActiveTab('home')} className="hover:text-zinc-900 dark:hover:text-white cursor-pointer">
            خانه
          </button>
          <span>/</span>
          <button onClick={() => setSelectedPost(null)} className="hover:text-zinc-900 dark:hover:text-white cursor-pointer">
            وبلاگ و راهنمای خرید
          </button>
          <span>/</span>
          <span className="text-zinc-900 dark:text-white truncate max-w-[200px]">{selectedPost.title}</span>
        </div>

        {/* Back Button */}
        <button
          onClick={() => setSelectedPost(null)}
          className="mb-6 flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
          <span>بازگشت به لیست مقالات</span>
        </button>

        {/* Article Container */}
        <article className="rounded-3xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-10 shadow-sm">
          {/* Category & Date */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 font-mono mb-4">
            <span className="px-3 py-1 rounded-full bg-[#62DB00]/15 text-[#62DB00] font-bold">
              {selectedPost.categoryFa}
            </span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{selectedPost.readTime}</span>
            </div>
            <span>•</span>
            <span>{selectedPost.date}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white leading-snug tracking-tight mb-6">
            {selectedPost.title}
          </h1>

          {/* Author Strip */}
          <div className="flex items-center justify-between py-4 border-y border-zinc-100 dark:border-zinc-800 mb-8">
            <div className="flex items-center gap-3">
              <img
                src={selectedPost.author.avatar}
                alt={selectedPost.author.name}
                className="w-10 h-10 rounded-full object-cover bg-zinc-200 dark:bg-zinc-800"
              />
              <div>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 block">
                  {selectedPost.author.name}
                </span>
                <span className="text-xs text-zinc-400">{selectedPost.author.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Eye className="w-4 h-4" />
              <span>{toPersianDigits(selectedPost.views)} بازدید</span>
            </div>
          </div>

          {/* Cover Image */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-8 img-outline">
            <img
              src={selectedPost.coverImage}
              alt={selectedPost.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Content Body */}
          <div className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300 space-y-5 whitespace-pre-line font-normal">
            {selectedPost.content}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-8 mt-8 border-t border-zinc-100 dark:border-zinc-800">
            <Tag className="w-4 h-4 text-zinc-400" />
            <span className="text-xs font-bold text-zinc-400">برچسب‌ها:</span>
            {selectedPost.tags.map((t, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 font-medium"
              >
                #{t}
              </span>
            ))}
          </div>
        </article>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
              محصولات مرتبط با این مقاله
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} variant="standard" />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#62DB00]/10 text-[#62DB00] font-mono text-xs font-bold mb-3 border border-[#62DB00]/20">
          <BookOpen className="w-3.5 h-3.5" />
          <span>LUMINA TECH JOURNAL</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight leading-snug mb-3">
          مجله تخصصی و راهنمای جامع خرید
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          تحلیل‌های تخصصی سخت‌افزار، راهنمای چیدمان ارگونومیک، مقایسه گجت‌های هوشمند و جدیدترین اخبار تکنولوژی
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: 'all', labelFa: 'همه مقالات' },
          { id: 'audio', labelFa: 'صوتی و هدفون' },
          { id: 'workspace', labelFa: 'تجهیزات میز کار' },
          { id: 'smart-wear', labelFa: 'ساعت و گجت‌ها' },
          { id: 'home-design', labelFa: 'دکوراسیون و نور' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            {cat.labelFa}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map(post => (
          <article
            key={post.id}
            onClick={() => {
              playTactileClick();
              setSelectedPost(post);
            }}
            className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 p-5 transition-all duration-200 hover:shadow-xl cursor-pointer"
          >
            <div>
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-4 img-outline">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white font-mono text-[10px] font-bold border border-white/10">
                  {post.categoryFa}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mb-2">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime}</span>
                <span>•</span>
                <span>{post.date}</span>
              </div>

              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#62DB00] transition-colors leading-snug mb-2">
                {post.title}
              </h2>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed mb-6">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-7 h-7 rounded-full object-cover bg-zinc-200 dark:bg-zinc-800"
                />
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {post.author.name}
                </span>
              </div>

              <span className="text-xs font-bold text-[#62DB00] flex items-center gap-1 group-hover:translate-x-[-3px] transition-transform">
                <span>مطالعه مقاله</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
