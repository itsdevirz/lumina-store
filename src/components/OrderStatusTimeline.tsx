import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  CheckCircle2,
  PackageCheck,
  Truck,
  Home,
  Clock,
  Copy,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  XCircle,
  FileText,
  ShieldCheck,
  Sparkles,
  MapPin,
  Calendar
} from 'lucide-react';
import { Order } from '../types';

interface OrderStatusTimelineProps {
  order: Order;
  compact?: boolean;
  onStatusChange?: (newStatus: Order['status']) => void;
  lang?: 'fa' | 'en';
}

interface StepConfig {
  key: string;
  stepNumber: number;
  titleFa: string;
  titleEn: string;
  subtitleFa: string;
  subtitleEn: string;
  descFa: string;
  descEn: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({
  order,
  compact = false,
  onStatusChange,
  lang = 'fa'
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(!compact);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const steps: StepConfig[] = [
    {
      key: 'placed',
      stepNumber: 1,
      titleFa: 'ثبت و تایید سفارش',
      titleEn: 'Order Placed',
      subtitleFa: 'پرداخت تایید شد',
      subtitleEn: 'Payment Verified',
      descFa: 'سفارش شما در سیستم لومینا ثبت و تاییدیه پرداخت الکترونیکی صادر گردید.',
      descEn: 'Your order has been recorded and electronic payment is confirmed.',
      icon: CheckCircle2
    },
    {
      key: 'processing',
      stepNumber: 2,
      titleFa: 'در حال پردازش و بسته‌بندی',
      titleEn: 'Processing & Packaging',
      subtitleFa: 'انبار مرکزی لومینا',
      subtitleEn: 'Central Warehouse',
      descFa: 'اقلام سفارش توسط کارشناسان کنترل کیفی بررسی و با پوشش محافظتی بسته‌بندی شدند.',
      descEn: 'Items quality-inspected and securely packaged at our fulfillment facility.',
      icon: PackageCheck
    },
    {
      key: 'shipped',
      stepNumber: 3,
      titleFa: 'تحویل به سرویس ارسال',
      titleEn: 'Shipped / In Transit',
      subtitleFa: order.courierName || (lang === 'fa' ? 'پیک اکسپرس' : 'Express Courier'),
      subtitleEn: order.courierName || 'Express Courier',
      descFa: 'مرسوله با بارنامه رسمی تحویل ناوگان توزیع گردیده و در مسیر انتقال به آدرس گیرنده است.',
      descEn: 'Package handed to delivery courier and currently en route to shipping address.',
      icon: Truck
    },
    {
      key: 'delivered',
      stepNumber: 4,
      titleFa: 'تحویل نهایی به مشتری',
      titleEn: 'Delivered',
      subtitleFa: 'تحویل موفقیت‌آمیز',
      subtitleEn: 'Successfully Delivered',
      descFa: 'بسته با موفقیت به گیرنده تحویل و کد تایید دریافت در سامانه ثبت گردید.',
      descEn: 'Package safely delivered to recipient with digital signature confirmation.',
      icon: Home
    }
  ];

  // Map order status to active step index (0-based)
  const getActiveStepIndex = (status: Order['status']): number => {
    switch (status) {
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      case 'cancelled':
        return -1;
      case 'paid':
        return 0;
      case 'pending':
        return 0;
      default:
        return 0;
    }
  };

  const statusFaMap: Record<string, string> = {
    pending: 'در انتظار پرداخت',
    paid: 'پرداخت شده',
    processing: 'در حال پردازش',
    shipped: 'ارسال شده',
    delivered: 'تحویل داده شده',
    cancelled: 'لغو شده'
  };

  const statusEnMap: Record<string, string> = {
    pending: 'Pending Payment',
    paid: 'Paid & Confirmed',
    processing: 'Processing & Packaging',
    shipped: 'Shipped / In Transit',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };

  const activeIndex = getActiveStepIndex(order.status);
  const isCancelled = order.status === 'cancelled';
  const displayStatus =
    lang === 'fa'
      ? order.statusFa || statusFaMap[order.status] || order.status
      : statusEnMap[order.status] || order.status;

  const handleCopyTracking = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Helper dates simulation relative to order date
  const getStepTimestamp = (index: number) => {
    if (index === 0) return `${order.date} - ۱۰:۱۵`;
    if (index === 1) return `${order.date} - ۱۴:۳۰`;
    if (index === 2) return `روز بعد - ۰۹:۴۵`;
    return `تحویل در ۱۶:۲۰`;
  };

  if (isCancelled) {
    return (
      <div className="p-4 rounded-2xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/80 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold">
                {lang === 'fa' ? 'سفارش لغو شده است' : 'Order Has Been Cancelled'}
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-200/80 dark:bg-rose-900/80 text-rose-900 dark:text-rose-200 font-bold">
                {lang === 'fa' ? 'ثبت شده توسط مدیریت' : 'Cancelled by Admin'}
              </span>
            </div>
            <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5 leading-relaxed">
              {lang === 'fa'
                ? 'این سفارش توسط مدیریت فروشگاه لغو گردیده است. وجه پرداختی طی ۲۴ تا ۴۸ ساعت به حساب خریدار عودت داده می‌شود.'
                : 'This order was cancelled by administration. Any payment will be refunded within 24-48 business hours.'}
            </p>
            {order.statusAdminNote && (
              <p className="text-[11px] font-bold text-rose-700 dark:text-rose-300 mt-1">
                {lang === 'fa' ? `علت لغو: ${order.statusAdminNote}` : `Reason: ${order.statusAdminNote}`}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const progressPercent =
    activeIndex === -1 ? 0 : Math.min(100, Math.max(0, (activeIndex / (steps.length - 1)) * 100));

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 space-y-4 shadow-sm">
      {/* Header: Current Status Summary & Estimated Delivery */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-3 h-3 rounded-full ${
              order.status === 'delivered'
                ? 'bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950/60'
                : order.status === 'shipped'
                ? 'bg-[#E80645] ring-4 ring-rose-100 dark:ring-rose-950/60 animate-pulse'
                : order.status === 'processing'
                ? 'bg-amber-500 ring-4 ring-amber-100 dark:ring-amber-950/60 animate-pulse'
                : 'bg-[#E80645] ring-4 ring-rose-100 dark:ring-rose-950/60'
            }`}
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'وضعیت مرسوله:' : 'Shipment Status:'}
              </span>
              <span
                className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                  order.status === 'delivered'
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : order.status === 'shipped'
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-[#E80645] dark:text-rose-400 border border-rose-200 dark:border-rose-900/50'
                    : order.status === 'processing'
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-[#E80645] dark:text-rose-400 border border-rose-200 dark:border-rose-900/50'
                }`}
              >
                {displayStatus}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                {lang === 'fa' ? 'سیستم رهگیری لومینا' : 'Verified by Lumina'}
              </span>
              {order.lastUpdatedByAdmin && (
                <span className="text-[10px] text-slate-400">
                  {lang === 'fa' ? `(بروزرسانی: ${order.lastUpdatedByAdmin})` : `(Updated: ${order.lastUpdatedByAdmin})`}
                </span>
              )}
            </div>

            {order.estimatedDelivery && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {lang === 'fa'
                    ? `موعد تحویل: ${order.estimatedDelivery}`
                    : `Est. Delivery: ${order.estimatedDelivery}`}
                </span>
              </p>
            )}

            {order.statusAdminNote && (
              <div className="mt-2 p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 text-[11px] text-rose-950 dark:text-rose-200 flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E80645] dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">{lang === 'fa' ? 'یادداشت ادمین: ' : 'Admin note: '}</span>
                  <span>{order.statusAdminNote}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tracking Code Badge with Copy */}
        {order.trackingCode && (
          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-[11px] text-slate-400">
              {lang === 'fa' ? 'کد رهگیری:' : 'Tracking #:'}
            </span>
            <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 select-all">
              {order.trackingCode}
            </span>
            <button
              type="button"
              onClick={() => handleCopyTracking(order.trackingCode || '')}
              title={lang === 'fa' ? 'کپی کد رهگیری' : 'Copy Tracking Code'}
              className="p-1 rounded-lg text-slate-400 hover:text-[#E80645] dark:hover:text-rose-400 transition-colors cursor-pointer"
            >
              {copiedCode ? (
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* MODERN HORIZONTAL STEPPER */}
      <div className="relative pt-2 pb-1">
        {/* Background Connecting Line */}
        <div className="hidden sm:block absolute top-[28px] left-[5%] right-[5%] h-1 bg-slate-100 dark:bg-slate-800 rounded-full z-0">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full bg-[#E80645] rounded-full"
          />
        </div>

        {/* 4 Step Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative z-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < activeIndex || order.status === 'delivered';
            const isCurrent = idx === activeIndex && order.status !== 'delivered';
            const isPending = idx > activeIndex;

            return (
              <div
                key={step.key}
                className="flex sm:flex-col items-center sm:items-center text-start sm:text-center gap-3 sm:gap-2 group"
              >
                {/* Node Circle */}
                <div className="relative shrink-0">
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : isCurrent
                        ? 'bg-[#E80645] text-white ring-4 ring-rose-100 dark:ring-rose-950/80 shadow-md shadow-rose-900/20'
                        : 'bg-slate-100 dark:bg-slate-800/90 text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>

                  {/* Step Number Pill for mobile orientation */}
                  <span
                    className={`sm:hidden absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${
                      isCompleted || isCurrent
                        ? 'bg-[#E80645] text-white'
                        : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {step.stepNumber}
                  </span>
                </div>

                {/* Node Texts */}
                <div className="flex-1 sm:flex-initial">
                  <div className="flex items-center gap-1.5 sm:justify-center">
                    <p
                      className={`text-xs font-bold leading-tight ${
                        isCurrent
                          ? 'text-[#E80645] dark:text-rose-400'
                          : isCompleted
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {lang === 'fa' ? step.titleFa : step.titleEn}
                    </p>
                    {isCurrent && (
                      <span className="inline-flex sm:hidden text-[10px] font-bold px-1.5 py-0.2 rounded-sm bg-rose-50 dark:bg-rose-950 text-[#E80645] dark:text-rose-400">
                        {lang === 'fa' ? 'مرحله فعلی' : 'Current'}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {lang === 'fa' ? step.subtitleFa : step.subtitleEn}
                  </p>

                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5 font-mono">
                    {isCompleted
                      ? getStepTimestamp(idx)
                      : isCurrent
                      ? (lang === 'fa' ? 'در حال انجام' : 'In Progress')
                      : (lang === 'fa' ? 'در انتظار' : 'Pending')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAILED CHRONOLOGICAL EVENT LOG (Collapsible) */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#E80645] dark:hover:text-rose-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-[#E80645]" />
            <span>
              {isExpanded
                ? (lang === 'fa' ? 'بستن ریزگزارش و جزئیات رویدادها' : 'Hide Detailed Event Log')
                : (lang === 'fa' ? 'مشاهده ریزگزارش و جزئیات رویدادها' : 'View Detailed Event Log')}
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="relative border-r-2 rtl:border-r-2 ltr:border-l-2 border-slate-200 dark:border-slate-700 pr-4 rtl:pr-4 ltr:pl-4 space-y-4">
                  {steps.map((step, idx) => {
                    const isPassed = idx <= activeIndex || order.status === 'delivered';
                    const isCurrent = idx === activeIndex && order.status !== 'delivered';

                    return (
                      <div key={step.key} className="relative">
                        {/* Event Dot */}
                        <div
                          className={`absolute -right-[23px] rtl:-right-[23px] ltr:-left-[23px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                            isPassed
                              ? isCurrent
                                ? 'bg-[#E80645] ring-2 ring-rose-200 dark:ring-rose-900 animate-pulse'
                                : 'bg-emerald-500'
                              : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                        />

                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-xs font-bold ${
                                isPassed
                                  ? 'text-slate-900 dark:text-white'
                                  : 'text-slate-400 dark:text-slate-500'
                              }`}
                            >
                              {lang === 'fa' ? step.titleFa : step.titleEn}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {getStepTimestamp(idx)}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                            {lang === 'fa' ? step.descFa : step.descEn}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Destination & Insurance Info */}
                <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>
                      {lang === 'fa'
                        ? `مقصد: ${order.shippingAddress?.city} - ${order.shippingAddress?.address}`
                        : `Dest: ${order.shippingAddress?.city} - ${order.shippingAddress?.address}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{lang === 'fa' ? 'بیمه بارنامه رسمی لومینا' : 'Full Value Cargo Insurance'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
