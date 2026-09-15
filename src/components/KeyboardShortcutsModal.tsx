import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Keyboard, Command } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { lang } = useStore();

  if (!isOpen) return null;

  const shortcutGroups = [
    {
      title: lang === 'fa' ? 'دستورات عمومی و ناوبری' : 'Global & Navigation',
      items: [
        { key: '⌘ K / Ctrl K', desc: lang === 'fa' ? 'باز کردن منوی فرمان (Command Palette)' : 'Open Command Palette' },
        { key: 'G then S', desc: lang === 'fa' ? 'رفتن به فروشگاه و کاتالوگ محصولات' : 'Go to Store / Catalog' },
        { key: 'G then D', desc: lang === 'fa' ? 'پیشنهادهای شگفت‌انگیز (Flash Drops)' : 'Go to Flash Deals' },
        { key: 'G then F', desc: lang === 'fa' ? 'جشنواره‌ها و کوپن‌ها' : 'Go to Seasonal Festivals' },
        { key: 'G then C', desc: lang === 'fa' ? 'باز کردن سبد خرید' : 'Open Shopping Cart' },
        { key: 'G then W', desc: lang === 'fa' ? 'لیست علاقه‌مندی‌ها' : 'Go to Wishlist' },
        { key: 'G then A', desc: lang === 'fa' ? 'حساب کاربری و پیگیری سفارش‌ها' : 'Go to Account' },
        { key: 'G then M', desc: lang === 'fa' ? 'داشبورد مدیریت فروشگاه' : 'Open Admin Console' }
      ]
    },
    {
      title: lang === 'fa' ? 'سیستم و ظاهر' : 'System & Appearance',
      items: [
        { key: 'T', desc: lang === 'fa' ? 'تغییر تم (دارک / لایت)' : 'Toggle Dark / Light Theme' },
        { key: 'L', desc: lang === 'fa' ? 'تغییر زبان (فارسی / انگلیسی)' : 'Switch Language (FA / EN)' },
        { key: '?', desc: lang === 'fa' ? 'نمایش این پنجره کلیدهای میانبر' : 'Show Keyboard Shortcuts' },
        { key: 'ESC', desc: lang === 'fa' ? 'بستن منو، پالت فرمان یا پنجره باز' : 'Close active modal / drawer' }
      ]
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-lg bg-white dark:bg-[#0C0C0E] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-6 z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
              <Keyboard className="w-4 h-4 text-zinc-400" />
              <h3 className="text-sm font-semibold tracking-tight">
                {lang === 'fa' ? 'کلیدهای میانبر صفحه‌کلید' : 'Keyboard Shortcuts'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Groups */}
          <div className="space-y-5">
            {shortcutGroups.map((group, gIdx) => (
              <div key={gIdx}>
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  {group.title}
                </h4>
                <div className="space-y-1.5">
                  {group.items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className="flex items-center justify-between py-1 px-2 rounded text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors"
                    >
                      <span className="text-zinc-700 dark:text-zinc-300">{item.desc}</span>
                      <kbd className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                        {item.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>Linear + Vercel UX</span>
            <span>ESC to close</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
