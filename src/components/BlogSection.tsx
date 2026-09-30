import React from 'react';
import { BookOpen, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BLOG_POSTS, BlogPost } from '../data/blogData';
import { playTactileClick } from '../utils/sound';

interface BlogSectionProps {
  onSelectPost?: (post: BlogPost) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onSelectPost }) => {
  const { lang, setActiveTab } = useStore();

  const handlePostClick = (post: BlogPost) => {
    playTactileClick();
    if (onSelectPost) {
      onSelectPost(post);
    } else {
      setActiveTab('blog');
    }
  };

  // 3 curated articles
  const displayPosts = BLOG_POSTS.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <div className="flex items-center gap-1.5 mb-1 text-emerald-600 dark:text-emerald-400">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {lang === 'fa' ? 'مجله تخصصی و راهنمای خرید' : 'Lumina Journal'}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {lang === 'fa' ? 'راهنماها و بررسی‌های تخصصی' : 'Guides & Editorial Stories'}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => {
            playTactileClick();
            setActiveTab('blog');
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          <span>{lang === 'fa' ? 'مشاهده همه مقالات' : 'All Articles'}</span>
          {lang === 'fa' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 3-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {displayPosts.map(post => (
          <article
            key={post.id}
            onClick={() => handlePostClick(post)}
            className="group flex flex-col rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 p-3.5 sm:p-4 hover:border-emerald-500/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden"
          >
            {/* Cover Image */}
            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-900 mb-3">
              <img
                src={post.coverImage}
                alt={post.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-zinc-950/70 backdrop-blur-md text-white font-mono text-[10px] font-semibold border border-white/10">
                {post.categoryFa}
              </span>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-medium mb-1.5">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{post.readTime}</span>
              </div>
              <span>·</span>
              <span>{post.date}</span>
            </div>

            {/* Title */}
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug mb-1.5">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
              {post.excerpt}
            </p>

            {/* Author */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-6 h-6 rounded-full object-cover bg-zinc-100 dark:bg-zinc-800"
                />
                <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                  {post.author.name}
                </span>
              </div>

              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:underline">
                <span>مطالعه</span>
                <ArrowLeft className="w-3 h-3 rtl:rotate-0 ltr:rotate-180" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
