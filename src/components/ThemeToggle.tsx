import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ThemeMode } from '../types';

interface ThemeToggleProps {
  variant?: 'button' | 'segmented' | 'dropdown';
  className?: string;
  showLabels?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'button',
  className = '',
  showLabels = false
}) => {
  const { darkMode, themeMode, setThemeMode, toggleDarkMode, lang } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: { mode: ThemeMode; labelFa: string; labelEn: string; icon: typeof Sun }[] = [
    { mode: 'light', labelFa: 'روشن', labelEn: 'Light', icon: Sun },
    { mode: 'dark', labelFa: 'تاریک', labelEn: 'Dark', icon: Moon },
    { mode: 'system', labelFa: 'سیستم', labelEn: 'System', icon: Laptop }
  ];

  // Segmented 3-way selector (ideal for mobile menu, profile settings, or admin)
  if (variant === 'segmented') {
    return (
      <div
        id="theme-toggle-segmented"
        className={`inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 transition-colors ${className}`}
      >
        {options.map(opt => {
          const Icon = opt.icon;
          const isSelected = themeMode === opt.mode;
          const label = lang === 'fa' ? opt.labelFa : opt.labelEn;

          return (
            <button
              key={opt.mode}
              type="button"
              onClick={() => setThemeMode(opt.mode)}
              title={label}
              className={`relative flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeThemePill"
                  className="absolute inset-0 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 shadow-xs"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Icon
                  className={`w-4 h-4 ${
                    opt.mode === 'light' && isSelected
                      ? 'text-amber-500'
                      : opt.mode === 'dark' && isSelected
                      ? 'text-indigo-500 dark:text-indigo-400'
                      : opt.mode === 'system' && isSelected
                      ? 'text-teal-500 dark:text-teal-400'
                      : ''
                  }`}
                />
                {(showLabels || variant === 'segmented') && <span>{label}</span>}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Interactive Button with Dropdown / Quick Switcher
  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        id="theme-toggle-btn"
        type="button"
        onClick={() => {
          // Quick toggle between light & dark, or open dropdown with secondary click
          toggleDarkMode();
        }}
        onContextMenu={e => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        title={
          lang === 'fa'
            ? `حالت ظاهری: ${
                themeMode === 'system' ? 'سیستم' : darkMode ? 'تاریک' : 'روشن'
              } (کلیک برای تغییر، راست‌کلیک برای منو)`
            : `Theme: ${
                themeMode === 'system' ? 'System' : darkMode ? 'Dark' : 'Light'
              } (Click to toggle, right-click for menu)`
        }
        aria-label="Toggle visual theme"
        className="relative p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700/80 active:scale-95 group cursor-pointer"
      >
        <AnimatePresence mode="wait" initial={false}>
          {darkMode ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500 group-hover:text-amber-600 transition-colors" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Small badge when operating in system mode */}
        {themeMode === 'system' && (
          <span
            className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-teal-500 ring-2 ring-white dark:ring-slate-900"
            title={lang === 'fa' ? 'پیروی از تم سیستم' : 'Following System'}
          />
        )}
      </button>

      {/* Dropdown for explicit selection if opened */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 rtl:left-auto rtl:right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 z-50 backdrop-blur-md"
          >
            <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {lang === 'fa' ? 'انتخاب حالت تصویر' : 'Appearance'}
            </div>
            <div className="space-y-0.5">
              {options.map(opt => {
                const Icon = opt.icon;
                const isSelected = themeMode === opt.mode;
                return (
                  <button
                    key={opt.mode}
                    type="button"
                    onClick={() => {
                      setThemeMode(opt.mode);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        className={`w-4 h-4 ${
                          opt.mode === 'light'
                            ? 'text-amber-500'
                            : opt.mode === 'dark'
                            ? 'text-indigo-500'
                            : 'text-teal-500'
                        }`}
                      />
                      <span>{lang === 'fa' ? opt.labelFa : opt.labelEn}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
