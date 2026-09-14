import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  XCircle,
  X,
  Truck,
  PackageCheck,
  ArrowLeft,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast, lang, setActiveTab } = useStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return (
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-800">
            <Truck className="w-5 h-5 animate-pulse" />
          </div>
        );
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-indigo-500 shrink-0" />;
    }
  };

  const handleAction = (toast: any) => {
    if (toast.onAction) {
      toast.onAction();
    } else if (toast.type === 'order') {
      setActiveTab('profile');
    }
    removeToast(toast.id);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2.5 pointer-events-none w-full max-w-md px-4">
      <AnimatePresence>
        {toasts.map(toast => {
          const isOrderToast = toast.type === 'order';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 12 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className={`pointer-events-auto flex flex-col gap-2 p-3.5 sm:p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl shadow-slate-900/10 dark:shadow-black/50 border transition-all ${
                isOrderToast
                  ? 'border-indigo-200 dark:border-indigo-800/80 ring-2 ring-indigo-500/20'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {getIcon(toast.type)}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">
                        {toast.title}
                      </p>
                      {isOrderToast && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold border border-indigo-200/60 dark:border-indigo-800">
                          <ShieldCheck className="w-3 h-3" />
                          <span>{lang === 'fa' ? 'تایید ادمین' : 'Admin Update'}</span>
                        </span>
                      )}
                    </div>

                    {toast.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                        {toast.description}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors shrink-0"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Action Button for Order Status Toast */}
              {(isOrderToast || toast.actionText) && (
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => handleAction(toast)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 px-2.5 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
                  >
                    <span>{toast.actionText || (lang === 'fa' ? 'پیگیری در حساب کاربری' : 'View in Dashboard')}</span>
                    {lang === 'fa' ? (
                      <ArrowLeft className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

