import { Product, Category } from '../types';

export interface LocalChatAction {
  type: 'APPLY_COUPON' | 'VIEW_PRODUCT' | 'NAVIGATE';
  payload: string;
  label: string;
}

export interface LocalChatResult {
  reply: string;
  actions: LocalChatAction[];
}

function normalizeDigits(str: string): string {
  if (!str) return '';
  const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const aDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let res = str;
  for (let i = 0; i < 10; i++) {
    res = res.replace(new RegExp(pDigits[i], 'g'), i.toString());
    res = res.replace(new RegExp(aDigits[i], 'g'), i.toString());
  }
  return res;
}

export function generateClientSmartReply(
  rawQuery: string,
  products: Product[],
  activeCoupons: Array<{ code: string; percent: number; minPurchase?: number }> = []
): LocalChatResult {
  const query = normalizeDigits(rawQuery.trim()).toLowerCase();
  const actions: LocalChatAction[] = [];

  // Default active coupons if none passed
  const coupons = activeCoupons.length > 0 ? activeCoupons : [
    { code: 'LUMINA2025', percent: 20 },
    { code: 'VIP50', percent: 50 },
    { code: 'FREESHIP', percent: 10 }
  ];

  // 1. COUPON / DISCOUNT INTENT
  if (
    query.includes('تخفیف') ||
    query.includes('کوپن') ||
    query.includes('کد تخفیف') ||
    query.includes('کدتخفیف') ||
    query.includes('جشنواره') ||
    query.includes('ارزان') ||
    query.includes('discount') ||
    query.includes('coupon') ||
    query.includes('off')
  ) {
    coupons.forEach(c => {
      actions.push({
        type: 'APPLY_COUPON',
        payload: c.code,
        label: `اعمال خودکار کد ${c.code} (${c.percent}٪)`
      });
    });

    const couponLines = coupons
      .map(c => `🏷️ کد **${c.code}**: **${c.percent}٪ تخفیف ویژه**`)
      .join('\n');

    return {
      reply: `کدهای تخفیف فعال و تاییدشده فروشگاه لومینا به شرح زیر است:\n\n${couponLines}\n\nبرای اعمال آنی و مستقیم تخفیف روی سفارش، کافیست روی دکمه‌های زیر کلیک کنید.`,
      actions
    };
  }

  // 2. ORDER TRACKING INTENT
  if (
    query.includes('پیگیری') ||
    query.includes('رهگیری') ||
    query.includes('سفارش') ||
    query.includes('کد رهگیری') ||
    query.includes('کجاست') ||
    query.includes('مرسوله') ||
    query.includes('پست') ||
    query.includes('تیپاکس') ||
    query.includes('track')
  ) {
    actions.push({
      type: 'NAVIGATE',
      payload: 'account',
      label: '📦 مشاهده وضعیت سفارشات در پنل کاربری'
    });

    // Check if an order ID like ORD-xxx was mentioned
    const match = rawQuery.match(/(?:ORD-?|LMN-?|TPX-?)?\d{4,10}/i);
    if (match) {
      const code = match[0];
      return {
        reply: `مرسوله شما با کد پیگیری **${code}** بررسی شد.\n\n📦 **وضعیت کنونی:** تحویل به شرکت پست/تیپاکس جهت ارسال اکسپرس هوایی.\n⏱️ **زمان تحویل تقریبی:** ظرف ۲۴ الی ۴۸ ساعت کاری در سراسر کشور.\n\nهمچنین می‌توانید از طریق بخش حساب کاربری موقعیت دقیق بسته را رصد فرمایید.`,
        actions
      };
    }

    return {
      reply: `برای پیگیری آنلاین وضعیت سفارشات، می‌توانید کد پیگیری پیامک‌شده را ارسال کنید یا مستقیماً وارد بخش **حساب کاربری > تاریخچه سفارشات** شوید.\n\nسفارش‌های شهر تهران ظرف کمتر از ۴ ساعت با پیک اکسپرس و سایر استان‌ها ظرف ۲۴ الی ۴۸ ساعت با تیپاکس ارسال می‌گردند.`,
      actions
    };
  }

  // 3. SHIPPING & DELIVERY INTENT
  if (
    query.includes('ارسال') ||
    query.includes('هزینه ارسال') ||
    query.includes('پیک') ||
    query.includes('چند روزه') ||
    query.includes('تحویل') ||
    query.includes('shipping') ||
    query.includes('delivery')
  ) {
    actions.push({
      type: 'NAVIGATE',
      payload: 'shop',
      label: '🛍️ مشاهده محصولات با ارسال فوری'
    });

    return {
      reply: `🚀 **شرایط و زمان‌بندی ارسال سفارشات لومینا:**\n\n• **ارسال رایگان:** برای تمام سبدهای خرید بالای ۲ میلیون تومان.\n• **تهران:** ارسال فوق‌سریع کمتر از ۴ ساعت کاری با پیک ویژه لومینا اکسپرس.\n• **شهرستان‌ها:** ارسال روزانه با تیپاکس هوایی و پست پیشتاز ویژه (۱ تا ۲ روز کاری).\n• کلیه مرسولات دارای بیمه کامل ارزش بار و بسته‌بندی ضدضربه می‌باشند.`,
      actions
    };
  }

  // 4. WARRANTY & RETURN POLICY INTENT
  if (
    query.includes('گارانتی') ||
    query.includes('ضمانت') ||
    query.includes('مرجوع') ||
    query.includes('اصالت') ||
    query.includes('خراب') ||
    query.includes('تعویض') ||
    query.includes('warranty')
  ) {
    return {
      reply: `🛡️ **ضمانت اصالت و خدمات پس از فروش لومینا:**\n\n• **۱۸ ماه گارانتی طلایی تعویض** بی قید و شرط برای تمامی تجهیزات الکترونیکی و صوتی.\n• **۷ روز مهلت تست و بازگشت وجه** ۱۰۰٪ در صورت هرگونه عدم رضایت مشتری یا مغایرت مشخصات.\n• ضمانت قطعی اصالت کالا و ارائه فاکتور رسمی معتبر شرکتی.`,
      actions
    };
  }

  // 5. SPECIFIC PRODUCT SEARCH & INQUIRY
  const matchedProducts = products.filter(p => {
    const pName = (p.nameFa || '').toLowerCase();
    const pEnName = (p.name || '').toLowerCase();
    const pBrand = (p.brand || '').toLowerCase();
    const pCategory = (p.categoryFa || p.category || '').toLowerCase();

    const words = query.split(/\s+/).filter(w => w.length >= 3);
    return words.some(w => pName.includes(w) || pEnName.includes(w) || pBrand.includes(w) || pCategory.includes(w));
  });

  if (matchedProducts.length > 0) {
    const topProd = matchedProducts[0];
    actions.push({
      type: 'VIEW_PRODUCT',
      payload: topProd.id,
      label: `مشاهده جزئیات ${topProd.nameFa || topProd.name}`
    });

    if (matchedProducts.length > 1) {
      actions.push({
        type: 'VIEW_PRODUCT',
        payload: matchedProducts[1].id,
        label: `مشاهده ${matchedProducts[1].nameFa || matchedProducts[1].name}`
      });
    }

    const priceFormatted = topProd.price ? topProd.price.toLocaleString('fa-IR') + ' تومان' : 'استعلام قیمت';
    const oldPriceFormatted = topProd.originalPrice ? topProd.originalPrice.toLocaleString('fa-IR') + ' تومان' : '';
    const discountText = topProd.discountPercent ? ` (🔥 دارای ${topProd.discountPercent}٪ تخفیف ویژه)` : '';
    const specsList = topProd.specs ? Object.entries(topProd.specs).slice(0, 3).map(([k, v]) => `• **${k}:** ${v}`).join('\n') : '';

    return {
      reply: `مشخصات محصول مدنظر شما **${topProd.nameFa || topProd.name}**:\n\n💰 **قیمت:** **${priceFormatted}**${discountText}${oldPriceFormatted ? ` ~~(قیمت قبل: ${oldPriceFormatted})~~` : ''}\n📦 **وضعیت موجودی:** ${topProd.stock > 0 ? `${topProd.stock} عدد در انبار آماده ارسال` : 'در حال تأمین مجدد'}\n⭐ **امتیاز خریداران:** ${topProd.rating || 4.9} از ۵\n\n${specsList ? `**مشخصات فنی برجسته:**\n${specsList}\n\n` : ''}${topProd.descriptionFa || topProd.description}\n\nجهت سفارش با ضمانت اصالت، روی دکمه زیر کلیک فرمایید:`,
      actions
    };
  }

  // 6. DEFAULT POLITE SMART FALLBACK
  actions.push({
    type: 'NAVIGATE',
    payload: 'shop',
    label: '🛍️ کاتالوگ فروشگاه'
  });
  actions.push({
    type: 'APPLY_COUPON',
    payload: 'LUMINA2025',
    label: '🏷️ کد تخفیف LUMINA2025'
  });

  return {
    reply: `سلام و احترام! من دستیار هوشمند لومینا هستم.\n\nمی‌توانید در زمینه‌های زیر از من راهنمایی بخواهید:\n• **استعلام قیمت و مشخصات محصولات** (مانند هدفون هورایزن، ساعت تیتانیومی، کیبورد مکانیکال و...)\n• **کدهای تخفیف و جشنواره‌ها** (کد فعال **LUMINA2025** با ۲۰٪ تخفیف)\n• **پیگیری سریع سفارشات و وضعیت ارسال**\n• **شرایط گارانتی طلایی ۱۸ ماهه و مرجوعی کالا**\n\nهمچنین می‌توانید با انتخاب تب «ارتباط با کارشناسان» مستقیماً با اپراتور آنلاین گفتگو فرمایید.`,
    actions
  };
}
