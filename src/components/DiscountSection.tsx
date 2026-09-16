import React, { useState } from 'react';
import { Tag, Copy, Check, Sparkles, Percent, ArrowLeft, ArrowRight, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const DiscountSection: React.FC = () => {
  const { lang, setActiveTab, setFilters, addToast } = useStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const coupons = [
    {
      code: 'LUMINA10',
      percent: 10,
      titleFa: '۱۰٪ تخفیف خرید اول',
      titleEn: '10% First Order Discount',
      descFa: 'برای تمام سفارش‌های بالای ۱,۰۰۰,۰۰۰ تومان',
      descEn: 'On all orders exceeding $80',
      expiresFa: 'مهلت تا پایان ماه',
      expiresEn: 'Valid until month end'
    },
    {
      code: 'PROUPGRADE',
      percent: 15,
      titleFa: '۱۵٪ تخفیف پکیج‌های Pro',
      titleEn: '15% Pro Tier Upgrade',
      descFa: 'ویژه خرید مانیتور، استند و ادوات اداری',
      descEn: 'Applies to monitor stands & studio gear',
      expiresFa: 'تعداد محدود',
      expiresEn: 'Limited stock'
    }
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast({
      title: lang === 'fa' ? `کد تخفیف ${code} کپی شد!` : `Coupon ${code} copied!`,
      description: lang === 'fa' ? 'می‌توانید در صفحه پرداخت اعمال کنید.' : 'You can paste it during checkout.',
      type: 'success'
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-zinc-900 via-[#121214] to-zinc-900 border border-zinc-800 p-6 sm:p-10 text-white shadow-xl">
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-[#62DB00]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text Left */}
          <div className="lg:col-span-6 text-right rtl:text-right ltr:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#62DB00]/10 text-[#62DB00] font-mono text-[11px] font-bold border border-[#62DB00]/20 mb-3">
              <Sparkles className="w-3 h-3" />
              <span>{lang === 'fa' ? 'کدهای تخفیف ویژه مشتریان' : 'Exclusive Promo Codes'}</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black tracking-tight mb-3">
              {lang === 'fa'
                ? 'خرید هوشمندانه با کدهای تخفیف فعال'
                : 'Save Instantly with Lumina Voucher Codes'}
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
              {lang === 'fa'
                ? 'کدهای زیر را کپی کرده و در مرحله نهایی سبد خرید اعمال نمایید تا تخفیف مستقیم روی سفارش شما محاسبه شود.'
                : 'Copy any of the active discount codes below and paste at checkout for instant savings.'}
            </p>

            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, onSaleOnly: true }));
                setActiveTab('shop');
              }}
              className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#62DB00] transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <span>{lang === 'fa' ? 'مشاهده کالاهای تخفیف‌دار' : 'Explore Sale Items'}</span>
              {lang === 'fa' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Coupon Cards Right */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coupons.map((coupon, i) => (
              <div
                key={i}
                className="relative p-5 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 flex flex-col justify-between text-right rtl:text-right ltr:text-left shadow-lg backdrop-blur-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-xl bg-[#62DB00]/20 text-[#62DB00] flex items-center justify-center font-mono font-bold text-xs">
                      {coupon.percent}%
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {lang === 'fa' ? coupon.expiresFa : coupon.expiresEn}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">
                    {lang === 'fa' ? coupon.titleFa : coupon.titleEn}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mb-4">
                    {lang === 'fa' ? coupon.descFa : coupon.descEn}
                  </p>
                </div>

                {/* Coupon Code Strip */}
                <div
                  onClick={() => handleCopy(coupon.code)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 hover:border-[#62DB00] transition-colors cursor-pointer group"
                >
                  <span className="font-mono font-bold text-xs sm:text-sm text-[#62DB00] tracking-wider">
                    {coupon.code}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 group-hover:text-white">
                    {copiedCode === coupon.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#62DB00]" />
                        <span className="text-[#62DB00]">{lang === 'fa' ? 'کپی شد' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{lang === 'fa' ? 'کپی کد' : 'Copy'}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
