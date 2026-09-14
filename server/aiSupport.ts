import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { dbManager } from './db';
import { CATEGORIES } from '../src/data/products';
import { Response } from 'express';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
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

function buildSystemPrompt(): string {
  const products = dbManager.getProducts();
  const coupons = dbManager.getCoupons();
  const orders = dbManager.getOrders();
  const festivals = dbManager.getFestivals(true);
  const categories = CATEGORIES;

  // Discounted Products Count & List
  const discountedProducts = products.filter(p =>
    (p.discountPercent && p.discountPercent > 0) ||
    (p.originalPrice && p.originalPrice > p.price)
  );

  // Comprehensive Product Knowledge Base
  const productCatalog = products
    .map(p => {
      const specsList = p.specs ? Object.entries(p.specs).map(([k, v]) => `${k}: ${v}`).join(' | ') : '';
      const featList = p.featuresFa?.join('، ') || p.features?.join(', ') || '';
      const hasDiscount = (p.discountPercent && p.discountPercent > 0) || (p.originalPrice && p.originalPrice > p.price);
      return `• شناسه: ${p.id}
  - نام فارسی: ${p.nameFa} (${p.name})
  - برند: ${p.brand || 'Lumina'} | دسته: ${p.categoryFa || p.category}
  - وضعیت تخفیف: ${hasDiscount ? `دارای تخفیف ویژه (${p.discountPercent || 0}٪)` : 'قیمت معمولی'}
  - قیمت اصلی: ${p.originalPrice ? p.originalPrice.toLocaleString('fa-IR') + ' تومان' : p.price.toLocaleString('fa-IR') + ' تومان'} | قیمت ویژه/فعلی: ${p.price.toLocaleString('fa-IR')} تومان
  - موجودی انبار: ${p.stock > 0 ? `${p.stock} عدد موجود` : 'ناموجود'} | امتیاز: ${p.rating || 4.9} از ۵ (${p.reviewsCount || 0} دیدگاه)
  - مشخصات فنی: ${specsList}
  - ویژگی‌های برتر: ${featList}
  - شرح کوتاه: ${p.descriptionFa || p.description}`;
    })
    .join('\n\n');

  // Dynamic Active Coupons
  const couponCatalog = coupons
    .filter(c => c.isActive)
    .map(c => {
      const pct = c.discountPercent || (c as any).percent || 20;
      return `• کد تخفیف «${c.code}»: ${pct}٪ تخفیف${c.maxDiscount ? ` (سقف تخفیف: ${c.maxDiscount.toLocaleString('fa-IR')} تومان)` : ''}${c.minPurchase ? ` (حداقل مبلغ خرید: ${c.minPurchase.toLocaleString('fa-IR')} تومان)` : ''}`;
    })
    .join('\n');

  // Orders Registry for Order Tracking
  const orderRegistry = orders
    .map(o => {
      const itemsList = o.items ? o.items.map((i: any) => `${i.productNameFa || i.productName} (${i.quantity}عدد)`).join('، ') : '';
      return `• شماره سفارش: ${o.id} | کد رهگیری: ${o.trackingNumber || 'در حال صدور'}
  - خریدار: ${o.customer?.name || 'مشتری لومینا'} (شهر: ${o.customer?.city || 'تهران'}, تلفن: ${o.customer?.phone || '-'})
  - وضعیت زنده: ${o.statusFa || o.status}
  - پست/پیک: ${o.courierName || 'پیک اکسپرس لومینا'} | زمان تحویل تقریبی: ${o.estimatedDelivery || '۱ تا ۲ روز کاری'}
  - تاریخ ثبت: ${o.date} | مبلغ کل: ${(o.total || 0).toLocaleString('fa-IR')} تومان
  - اقلام: ${itemsList}`;
    })
    .join('\n\n');

  // Active Festivals
  const festivalCatalog = festivals
    .map(f => `• جشنواره «${f.title}»: ${f.badgeText || 'تخفیف ویژه'} | تعداد کالا: ${f.products?.length || 0}`)
    .join('\n');

  // Categories
  const categoryCatalog = categories
    .map(c => `- ${c.nameFa} (${c.name}) [کلید: ${c.id}]`)
    .join('\n');

  return `
شما «دستیار هوشمند، فوق‌سریع و کارشناس ارشد پشتیبانی فروشگاه آنلاین لومینا (Lumina Store)» هستید.
وظیفه شما پاسخگویی جامع، دقیق، مؤدبانه، بسیار سریع و دوستانه به تمام سوالات کاربران درباره فروشگاه لومینا، آمار محصولات، پیگیری زنده سفارشات، جشنواره‌ها و خدمات است.

════════════════════════════════════════════════
📊 آمار زنده و اطلاعات کامل دیتابیس فروشگاه لومینا
════════════════════════════════════════════════
• تعداد کل محصولات فعال فروشگاه: ${products.length} کالا
• تعداد محصولات دارای تخفیف ویژه: ${discountedProducts.length} کالا
• تعداد دسته‌بندی‌های تخصصی: ${categories.length} دسته
• جشنواره‌های فعال: ${festivals.length} رویداد
• تعداد کدهای تخفیف فعال: ${coupons.filter(c => c.isActive).length} کد
• تعداد کل سفارشات ثبت‌شده: ${orders.length} سفارش

• دسته‌بندی‌های اصلی:
${categoryCatalog}

• شرایط و هزینه‌های ارسال:
  - ارسال رایگان اکسپرس: برای تمامی خریدهای بالای ۱۵,۰۰۰,۰۰۰ تومان (۱۵ میلیون تومان).
  - ارسال اکسپرس در شهر تهران: تحویل فوری در همان روز کاری (بازه ۲ تا ۴ ساعته) با پیک اختصاصی لومینا (هزینه سفارش‌های زیر ۱۵ میلیون: ۷۵,۰۰۰ تومان).
  - ارسال سراسری به تمام شهرها و استان‌های کشور: ظرف ۲۴ تا ۴۸ ساعت با پست پیشتاز بیمه‌شده یا تیپاکس ضدضربه (هزینه سفارش‌های زیر ۱۵ میلیون: ۴۵,۰۰۰ تومان).

• گارانتی، ضمانت و مرجوعی کالا:
  - ضمانت ۱۰۰٪ اصالت و اورجینال بودن کلیه کالاها با برچسب و بارکد معتبر.
  - مهلت تست ۷ روزه و ضمانت ۱۰۰٪ بازگشت وجه در صورت هرگونه نقص یا عدم رضایت.
  - گارانتی ۱۸ ماهه طلایی شرکتی لومینا برای تمام قطعات الکترونیک.

• اطلاعات تماس و پشتیبانی:
  - شماره تماس پشتیبانی تلفنی: ۰۲۱-۸۸۹۹۰۰۱۱ (روزهای شنبه تا پنجشنبه از ساعت ۹:۰۰ الی ۲۱:۰۰)
  - ایمیل سازمانی: support@luminastore.ir
  - نشانی دفتر مرکزی: تهران، خیابان ولیعصر، بالاتر از پارک وی، برج تجاری لومینا، طبقه ۸

════════════════════════════════════════════════
🎟️ کدهای تخفیف فعال در سیستم
════════════════════════════════════════════════
${couponCatalog}

════════════════════════════════════════════════
🎡 جشنواره‌های فعال در سیستم
════════════════════════════════════════════════
${festivalCatalog || 'هیچ جشنواره‌ای در حال حاضر فعال نیست.'}

════════════════════════════════════════════════
📦 کاتالوگ جامع محصولات موجود در لومینا
════════════════════════════════════════════════
${productCatalog}

════════════════════════════════════════════════
📋 دیتابیس زنده سفارشات خریداران جهت رهگیری خودکار
════════════════════════════════════════════════
${orderRegistry}

════════════════════════════════════════════════
⚠️ قوانین بسیار مهم و حیاتی پاسخگویی
════════════════════════════════════════════════
۱. تفکیک کامل «کالای تخفیف‌دار» و «کد تخفیف»:
   - اگر کاربر بپرسد «چندتا محصول تخفیف‌دار داریم؟» یا «محصولات دارای تخفیف چیست؟»، دقیقاً بگویید که **${discountedProducts.length} محصول دارای تخفیف ویژه** در سایت موجود است و لیست تک‌تک آن‌ها را با قیمت اصلی و قیمت تخفیف‌خورده مشخص کنید. به هیچ وجه کدهای تخفیف (مثل LUMINA2025) را به‌جای کالای تخفیف‌دار تحویل ندهید!
   - فقط زمانی کدهای تخفیف را ارائه کنید که کاربر صراحتاً بپرسد «کد تخفیف چیه؟» یا «کوپن تخفیف».

۲. رهگیری خودکار سفارشات:
   - اگر کاربر یک کد رهگیری (مانند LMN-77492019, TPX-994108420, PST-1109483321, TRK-98432190) یا شماره سفارش (مانند ORD-98750, ORD-98612, LUM-84920) یا شماره تلفن ارسال کرد، بلافاصله آن را در دیتابیس سفارشات فوق پیدا کنید و گزارش جامع (تحویل‌گیرنده، وضعیت زنده، پست/پیک، زمان تحویل تقریبی، اقلام و مبلغ کل) بدهید.
   - اگر کد وارد شده وجود نداشت، با احترام بگویید کد یافت نشد و شماره سفارش/رهگیری معتبر بخواهید.

۳. آمار تمام سایت:
   - اگر کاربر آمار سایت یا تعداد کالاها/دسته‌بندی‌ها را خواست، آمار فوق را دقیق بیان کنید.

۴. اکشن‌های تعاملی انتهای پاسخ:
   - [ACTION:VIEW_PRODUCT:شناسه_محصول|متن_دکمه]
   - [ACTION:APPLY_COUPON:کد_تخفیف|متن_دکمه]
   - [ACTION:NAVIGATE:shop|متن_دکمه]
   - [ACTION:NAVIGATE:cart|متن_دکمه]
   - [ACTION:NAVIGATE:dashboard|متن_دکمه]
   - [ACTION:NAVIGATE:checkout|متن_دکمه]
`.trim();
}

export function parseResponseAndActions(rawText: string): { reply: string; actions: Array<{ type: string; payload: string; label: string }> } {
  const actions: Array<{ type: string; payload: string; label: string }> = [];
  const actionRegex = /\[ACTION:(VIEW_PRODUCT|APPLY_COUPON|NAVIGATE|FILTER_CATEGORY):([^|\]]+)(?:\|([^\]]+))?\]/g;

  let cleanedText = rawText.replace(actionRegex, (_match, type, payload, label) => {
    actions.push({
      type,
      payload: payload.trim(),
      label: label ? label.trim() : (type === 'APPLY_COUPON' ? `اعمال کد ${payload}` : 'مشاهده')
    });
    return '';
  }).trim();

  return { reply: cleanedText, actions };
}

// 1. Fast Regular Chat Endpoint
export async function handleSupportChat(
  messages: ChatMessage[],
  userContext?: { name?: string; email?: string; cartCount?: number }
): Promise<{ reply: string; actions?: Array<{ type: string; payload: string; label: string }> }> {
  const lastUserMessage = messages[messages.length - 1]?.content || '';
  const products = dbManager.getProducts();
  const coupons = dbManager.getCoupons();

  const ai = getAiClient();

  if (ai) {
    try {
      const contents = messages.slice(-6).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      if (userContext?.name && contents.length > 0) {
        contents[contents.length - 1].parts.push({
          text: `\n[اطلاعات کاربر متصل: نام: ${userContext.name}, ایمیل: ${userContext.email || '-'}, تعداد اقلام سبد: ${userContext.cartCount || 0}]`
        });
      }

      // Try gemini-2.5-flash first, fallback to gemini-1.5-flash or local engine
      let response: GenerateContentResponse | null = null;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: contents as any,
          config: {
            systemInstruction: buildSystemPrompt(),
            temperature: 0.3,
          },
        });
      } catch (e1) {
        try {
          response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: contents as any,
            config: {
              systemInstruction: buildSystemPrompt(),
              temperature: 0.3,
            },
          });
        } catch (e2) {
          response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: contents as any,
            config: {
              systemInstruction: buildSystemPrompt(),
              temperature: 0.3,
            },
          });
        }
      }

      const replyText = response?.text || '';
      if (replyText.trim()) {
        return parseResponseAndActions(replyText);
      }
    } catch (err) {
      console.warn('Gemini generateContent error, falling back to local smart engine:', err);
    }
  }

  return getComprehensiveLocalReply(lastUserMessage, products, coupons);
}

// 2. High-Speed Real-time SSE Streaming Endpoint
export async function handleSupportChatStream(
  messages: ChatMessage[],
  res: Response,
  userContext?: { name?: string; email?: string; cartCount?: number }
): Promise<void> {
  const lastUserMessage = messages[messages.length - 1]?.content || '';
  const products = dbManager.getProducts();
  const coupons = dbManager.getCoupons();

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const ai = getAiClient();

  if (ai) {
    try {
      const contents = messages.slice(-6).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      if (userContext?.name && contents.length > 0) {
        contents[contents.length - 1].parts.push({
          text: `\n[اطلاعات کاربر متصل: نام: ${userContext.name}, تعداد اقلام در سبد: ${userContext.cartCount || 0}]`
        });
      }

      let streamResponse = null;
      try {
        streamResponse = await ai.models.generateContentStream({
          model: 'gemini-2.5-flash',
          contents: contents as any,
          config: {
            systemInstruction: buildSystemPrompt(),
            temperature: 0.3,
          },
        });
      } catch (e1) {
        streamResponse = await ai.models.generateContentStream({
          model: 'gemini-1.5-flash',
          contents: contents as any,
          config: {
            systemInstruction: buildSystemPrompt(),
            temperature: 0.3,
          },
        });
      }

      let accumulatedText = '';

      for await (const chunk of streamResponse) {
        const text = (chunk as GenerateContentResponse).text || '';
        if (text) {
          accumulatedText += text;
          res.write(`data: ${JSON.stringify({ type: 'chunk', text })}\n\n`);
        }
      }

      const { reply, actions } = parseResponseAndActions(accumulatedText);
      res.write(`data: ${JSON.stringify({ type: 'done', reply, actions })}\n\n`);
      res.end();
      return;
    } catch (err) {
      console.warn('Gemini stream error, falling back to local smart engine:', err);
    }
  }

  // Fallback streaming simulation with local engine
  const localResult = getComprehensiveLocalReply(lastUserMessage, products, coupons);
  
  // Stream words quickly for high responsiveness
  const words = localResult.reply.split(' ');
  for (let i = 0; i < words.length; i += 3) {
    const chunkText = words.slice(i, i + 3).join(' ') + ' ';
    res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunkText })}\n\n`);
    await new Promise(r => setTimeout(r, 20));
  }

  res.write(`data: ${JSON.stringify({ type: 'done', reply: localResult.reply, actions: localResult.actions })}\n\n`);
  res.end();
}

// 3. Comprehensive Local Smart Rule Engine (Bulletproof 100% accurate engine)
export function getComprehensiveLocalReply(
  query: string,
  productsList?: any[],
  couponsList?: any[]
): { reply: string; actions: Array<{ type: string; payload: string; label: string }> } {
  const products = productsList || dbManager.getProducts();
  const coupons = couponsList || dbManager.getCoupons();
  const orders = dbManager.getOrders();
  const festivals = dbManager.getFestivals(true);

  const rawQuery = query.trim();
  const normalizedQuery = normalizeDigits(rawQuery).toLowerCase();
  const actions: Array<{ type: string; payload: string; label: string }> = [];

  // =========================================================================
  // INTENT 1: ORDER TRACKING & TRACKING CODE LOOKUP
  // =========================================================================
  const trackingKeywords = ['پیگیری', 'رهگیری', 'کد رهگیری', 'کدرهگیری', 'سفارش', 'وضعیت سفارش', 'مرسوله', 'پست', 'تیپاکس', 'کجاست', 'تراکنش', 'track', 'order'];
  const hasTrackingKeyword = trackingKeywords.some(k => normalizedQuery.includes(k));

  // Extract candidate codes or search matched order
  const matchedOrder = orders.find(o => {
    const oId = o.id ? normalizeDigits(o.id).toLowerCase() : '';
    const oTrk = o.trackingNumber ? normalizeDigits(o.trackingNumber).toLowerCase() : '';
    const cPhone = o.customer?.phone ? normalizeDigits(o.customer.phone) : '';
    const cName = o.customer?.name ? o.customer.name.toLowerCase() : '';
    const cEmail = o.customer?.email ? o.customer.email.toLowerCase() : '';

    const oIdClean = oId.replace(/[^a-z0-9]/g, '');
    const oTrkClean = oTrk.replace(/[^a-z0-9]/g, '');

    if (oId && normalizedQuery.includes(oId)) return true;
    if (oTrk && oTrk !== '-' && normalizedQuery.includes(oTrk)) return true;
    if (cPhone && cPhone.length >= 6 && normalizedQuery.includes(cPhone)) return true;
    if (cName && cName.length >= 3 && normalizedQuery.includes(cName)) return true;
    if (cEmail && cEmail.length >= 5 && normalizedQuery.includes(cEmail)) return true;

    // Numbers search (e.g. 98750, 84920, 77492019)
    const queryNums = normalizedQuery.replace(/[^a-z0-9]/g, '');
    if (queryNums.length >= 4) {
      if (oIdClean && (queryNums.includes(oIdClean) || oIdClean.includes(queryNums))) return true;
      if (oTrkClean && oTrkClean !== '-' && (queryNums.includes(oTrkClean) || oTrkClean.includes(queryNums))) return true;
    }
    return false;
  });

  if (matchedOrder) {
    const itemsList = matchedOrder.items
      ? matchedOrder.items.map((i: any) => `  • **${i.productNameFa || i.productName}** (${i.quantity} عدد) - ${(i.price || 0).toLocaleString('fa-IR')} تومان`).join('\n')
      : '';

    return {
      reply: `📦 **اطلاعات و وضعیت زنده سفارش شما (${matchedOrder.id}):**\n\n` +
        `• **نام تحویل‌گیرنده:** ${matchedOrder.customer?.name || 'مشتری لومینا'} (شهر: ${matchedOrder.customer?.city || 'تهران'})\n` +
        `• **وضعیت سفارش:** **«${matchedOrder.statusFa || matchedOrder.status}»**\n` +
        `• **کد رهگیری پستی / تیپاکس:** \`${matchedOrder.trackingNumber || 'در حال صدور'}\`\n` +
        `• **نحوه و شرکت ارسال:** ${matchedOrder.courierName || matchedOrder.paymentMethod || 'پیک اکسپرس لومینا'}\n` +
        `• **زمان تحویل تقریبی:** ${matchedOrder.estimatedDelivery || '۱ تا ۲ روز کاری'}\n` +
        `• **مبلغ کل پرداخت شده:** **${(matchedOrder.total || 0).toLocaleString('fa-IR')} تومان**\n` +
        `• **تاریخ ثبت سفارش:** ${matchedOrder.date || 'امروز'}\n\n` +
        `🛍️ **اقلام سفارش:**\n${itemsList}\n\n` +
        `جهت مشاهده تایم‌لاین کامل سفارشات به حساب کاربری خود مراجعه فرمایید.`,
      actions: [
        { type: 'NAVIGATE', payload: 'dashboard', label: '📦 پیگیری در حساب کاربری' },
        { type: 'NAVIGATE', payload: 'shop', label: '🛍️ بازگشت به فروشگاه' }
      ]
    };
  }

  // If user searched for tracking or entered a code that was NOT found
  if (hasTrackingKeyword && (normalizedQuery.match(/[a-z0-9]{4,}/i) || normalizedQuery.length >= 5)) {
    const searchedTerm = rawQuery.replace(/^(پیگیری|کد رهگیری|وضعیت سفارش|رهگیری|سفارش|وضعیت|کدرهگیری)\s*/gi, '');
    return {
      reply: `🔍 **نتیجه رهگیری سفارش:**\n\n` +
        `کد رهگیری یا شماره سفارش وارد شده ${searchedTerm ? `(**«${searchedTerm}»**)` : ''} در دیتابیس سفارشات فعال لومینا یافت نشد.\n\n` +
        `📌 **راهنمای شماره سفارشات:**\n` +
        `• شماره سفارش‌های لومینا با فرمت **ORD-98750** یا **LUM-84920** ثبت می‌شوند.\n` +
        `• کدهای رهگیری پستی و تیپاکس به صورت **LMN-77492019** یا **TPX-994108420** صادر می‌گردند.\n` +
        `• همچنین با ورود به بخش **«حساب کاربری > پیگیری سفارشات»** می‌توانید لیست تمام خرید‌های قبلی خود را ملاحظه فرمایید.`,
      actions: [
        { type: 'NAVIGATE', payload: 'dashboard', label: '📦 ورود به پیگیری سفارشات' },
        { type: 'NAVIGATE', payload: 'shop', label: '🛍️ مشاهده کاتالوگ فروشگاه' }
      ]
    };
  }

  // =========================================================================
  // INTENT 2: DISCOUNTED PRODUCTS COUNT & LIST (محصولات تخفیف‌دار)
  // =========================================================================
  const isAskingForCoupons = (
    normalizedQuery.includes('کد تخفیف') ||
    normalizedQuery.includes('کوپن') ||
    normalizedQuery.includes('کد عمومی') ||
    normalizedQuery.includes('کد آف') ||
    normalizedQuery.includes('coupon') ||
    normalizedQuery.includes('promo code')
  );

  const isAskingAboutDiscountedProducts = (
    normalizedQuery.includes('محصول') ||
    normalizedQuery.includes('کالا') ||
    normalizedQuery.includes('چندتا') ||
    normalizedQuery.includes('چند تا') ||
    normalizedQuery.includes('تعداد') ||
    normalizedQuery.includes('لیست') ||
    normalizedQuery.includes('کدام') ||
    normalizedQuery.includes('چه محصولات') ||
    normalizedQuery.includes('تخفیف دار') ||
    normalizedQuery.includes('تخفیف‌دار')
  ) && (
    normalizedQuery.includes('تخفیف') ||
    normalizedQuery.includes('حراج') ||
    normalizedQuery.includes('ارزان') ||
    normalizedQuery.includes('ویژه') ||
    normalizedQuery.includes('off')
  );

  if (isAskingAboutDiscountedProducts && !isAskingForCoupons) {
    const discountedProducts = products.filter(p =>
      (p.discountPercent && p.discountPercent > 0) ||
      (p.originalPrice && p.originalPrice > p.price)
    );

    const count = discountedProducts.length;
    const listText = discountedProducts.map(p => {
      const origStr = p.originalPrice ? `${p.originalPrice.toLocaleString('fa-IR')} تومان` : '';
      const currentStr = `${p.price.toLocaleString('fa-IR')} تومان`;
      const discPercent = p.discountPercent || Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
      return `• **${p.nameFa}** (${p.brand || 'Lumina'}):\n  قیمت اصلی: ~${origStr}~ ⬅️ **قیمت ویژه: ${currentStr}** (${discPercent}٪ تخفیف)`;
    }).join('\n\n');

    const productActions = discountedProducts.slice(0, 4).map(p => ({
      type: 'VIEW_PRODUCT',
      payload: p.id,
      label: `مشاهده ${p.nameFa.slice(0, 24)}...`
    }));

    productActions.push({ type: 'NAVIGATE', payload: 'shop', label: '🛍️ کاتالوگ فروشگاه' });

    return {
      reply: `🔥 **لیست محصولات دارای تخفیف ویژه در فروشگاه لومینا:**\n\n` +
        `در حال حاضر **${count} محصول دارای تخفیف ویژه و استثنایی** در سایت موجود می‌باشد:\n\n` +
        `${listText}\n\n` +
        `برای بررسی کامل مشخصات یا خرید هر محصول، روی دکمه‌های زیر کلیک کنید:`,
      actions: productActions
    };
  }

  // =========================================================================
  // INTENT 3: ACTIVE DISCOUNT COUPON CODES (کدهای تخفیف)
  // =========================================================================
  if (isAskingForCoupons || (normalizedQuery.includes('تخفیف') && !isAskingAboutDiscountedProducts)) {
    const activeCoupons = coupons.filter(c => c.isActive);
    const couponsText = activeCoupons.map(c => {
      const pct = c.discountPercent || (c as any).percent || 20;
      const maxStr = c.maxDiscount ? ` (سقف تخفیف: ${c.maxDiscount.toLocaleString('fa-IR')} تومان)` : '';
      const minStr = c.minPurchase ? ` (حداقل خرید: ${c.minPurchase.toLocaleString('fa-IR')} تومان)` : '';
      return `• **کد تخفیف «${c.code}»**: **${pct}٪ تخفیف**${maxStr}${minStr}`;
    }).join('\n');

    const couponActions = activeCoupons.slice(0, 3).map(c => ({
      type: 'APPLY_COUPON',
      payload: c.code,
      label: `اعمال کد ${c.code}`
    }));

    couponActions.push({ type: 'NAVIGATE', payload: 'cart', label: '🛍️ بررسی سبد خرید' });

    return {
      reply: `🎟️ **کدهای تخفیف فعال و ویژه فروشگاه لومینا:**\n\n` +
        `${couponsText}\n\n` +
        `با کلیک بر روی دکمه‌های زیر می‌توانید کد مورد نظر را مستقیماً روی سبد خرید خود اعمال فرمایید!`,
      actions: couponActions
    };
  }

  // =========================================================================
  // INTENT 4: SITE STATISTICS & SITE OVERVIEW (آمار تمام سایت)
  // =========================================================================
  if (
    normalizedQuery.includes('آمار') ||
    normalizedQuery.includes('چند تا محصول') ||
    normalizedQuery.includes('چندتا محصول') ||
    normalizedQuery.includes('تعداد کالا') ||
    normalizedQuery.includes('آمار سایت') ||
    normalizedQuery.includes('اطلاعات سایت') ||
    normalizedQuery.includes('stats')
  ) {
    const totalProds = products.length;
    const discProds = products.filter(p => (p.discountPercent && p.discountPercent > 0) || (p.originalPrice && p.originalPrice > p.price)).length;
    const catCount = CATEGORIES.length;
    const festCount = festivals.length;
    const couponCount = coupons.filter(c => c.isActive).length;
    const totalOrdersCount = orders.length;

    return {
      reply: `📊 **آمار زنده و وضعیت کلی فروشگاه آنلاین لومینا:**\n\n` +
        `• 🛍️ **تعداد کل محصولات موجود:** **${totalProds} کالا**\n` +
        `• 🔥 **تعداد کالاهای دارای تخفیف ویژه:** **${discProds} کالا**\n` +
        `• 📁 **تعداد دسته‌بندی‌های تخصصی:** **${catCount} دسته کالا**\n` +
        `• 🎡 **جشنواره‌های فعال در جریان:** **${festCount} رویداد**\n` +
        `• 🎟️ **کدهای تخفیف فعال:** **${couponCount} کد تخفیف**\n` +
        `• 📦 **سفارشات ثبت‌شده در سیستم:** **${totalOrdersCount} سفارش**\n` +
        `• 🚚 **ارسال رایگان اکسپرس:** برای خریدهای بالای **۱۵,۰۰۰,۰۰۰ تومان**\n` +
        `• 🛡️ **گارانتی اصالت:** ۱۸ ماه گارانتی طلایی + ۷ روز مهلت تست`,
      actions: [
        { type: 'NAVIGATE', payload: 'shop', label: '🛍️ کاتالوگ محصولات' },
        { type: 'APPLY_COUPON', payload: 'LUMINA2025', label: '🏷️ کدهای تخفیف' },
        { type: 'NAVIGATE', payload: 'dashboard', label: '📦 پیگیری سفارشات' }
      ]
    };
  }

  // =========================================================================
  // INTENT 5: FESTIVALS & CAMPAIGNS (جشنواره‌ها)
  // =========================================================================
  if (normalizedQuery.includes('جشنواره') || normalizedQuery.includes('کمپین') || normalizedQuery.includes('festival')) {
    if (festivals.length > 0) {
      const festText = festivals.map(f => {
        return `• **${f.title}** (${f.badgeText || 'جشنواره'}):\n  ${f.description || f.slogan || 'تخفیف‌های استثنایی جشنواره لومینا'}`;
      }).join('\n\n');

      return {
        reply: `🎡 **جشنواره‌های فعال در فروشگاه لومینا:**\n\n` +
          `${festText}\n\n` +
          `برای مشاهده محصولات اختصاصی جشنواره روی دکمه زیر کلیک فرمایید:`,
        actions: [
          { type: 'NAVIGATE', payload: 'shop', label: '🛍️ محصولات جشنواره' }
        ]
      };
    }
  }

  // =========================================================================
  // INTENT 6: SPECIFIC PRODUCT / CATEGORY SEARCH
  // =========================================================================
  const searchTerms = normalizedQuery.split(/\s+/).filter(t => t.length >= 2);
  const matchedProducts = products.filter(p => {
    const fullText = (p.nameFa + ' ' + p.name + ' ' + (p.brand || '') + ' ' + (p.categoryFa || '') + ' ' + (p.descriptionFa || '')).toLowerCase();
    return searchTerms.some(term => fullText.includes(term));
  });

  if (matchedProducts.length > 0 && searchTerms.some(t => ['هدفون', 'ساعت', 'کیبورد', 'ماوس', 'موس', 'قهوه', 'چراغ', 'کوله', 'مسواک', 'هندزفری', 'اسپیکر', 'باریستا', 'کتری', 'تیتانیوم'].includes(t))) {
    const listStr = matchedProducts.slice(0, 4).map(p => {
      const disc = p.discountPercent ? ` (${p.discountPercent}٪ تخفیف)` : '';
      return `• **${p.nameFa}** (${p.brand || 'Lumina'}):\n  قیمت: **${p.price.toLocaleString('fa-IR')} تومان**${disc} | ${p.stock > 0 ? `${p.stock} عدد موجود` : 'ناموجود'}`;
    }).join('\n\n');

    const productActions = matchedProducts.slice(0, 3).map(p => ({
      type: 'VIEW_PRODUCT',
      payload: p.id,
      label: `مشاهده ${p.nameFa.slice(0, 22)}...`
    }));

    productActions.push({ type: 'NAVIGATE', payload: 'shop', label: '🛍️ کاتالوگ کامل' });

    return {
      reply: `🔍 **محصولات مرتبط پیدا شده با جستجوی شما:**\n\n` +
        `${listStr}\n\n` +
        `برای مشاهده جزییات هر محصول روی دکمه مربوطه کلیک کنید:`,
      actions: productActions
    };
  }

  // =========================================================================
  // INTENT 7: SHIPPING & DELIVERY POLICIES
  // =========================================================================
  if (normalizedQuery.includes('ارسال') || normalizedQuery.includes('پیک') || normalizedQuery.includes('هزینه ارسال') || normalizedQuery.includes('پست') || normalizedQuery.includes('رایگان')) {
    return {
      reply: `📦 **شرایط و زمان‌بندی ارسال مرسولات لومینا:**\n\n` +
        `• **ارسال رایگان اکسپرس:** برای تمام خریدهای بالای **۱۵,۰۰۰,۰۰۰ تومان** کاملاً **رایگان** است.\n` +
        `• **تحویل فوری شهر تهران:** تحویل همان روز با پیک اختصاصی لومینا ظرف **۲ الی ۴ ساعت** (هزینه سفارش‌های زیر ۱۵ میلیون: ۷۵,۰۰۰ تومان).\n` +
        `• **ارسال به سراسر کشور:** ظرف **۲۴ الی ۴۸ ساعت** با پست پیشتاز بیمه‌شده یا تیپاکس ضدضربه (هزینه سفارش‌های زیر ۱۵ میلیون: ۴۵,۰۰۰ تومان).\n` +
        `• تمام محصولات در هاردکیس پلمپ و کاور ضدضربه ارسال می‌گردند.`,
      actions: [
        { type: 'NAVIGATE', payload: 'shop', label: '🛍️ ثبت سفارش' },
        { type: 'NAVIGATE', payload: 'cart', label: '🛒 بررسی سبد خرید' }
      ]
    };
  }

  // =========================================================================
  // DEFAULT SMART RESPONSE
  // =========================================================================
  return {
    reply: `سلام و درود! 🌟 من **دستیار هوشمند و برخط فروشگاه لومینا** هستم.\n\n` +
      `می‌توانم در تمامی زمینه‌های زیر بلافاصله به شما پاسخ دقیق دهم:\n` +
      `• 🔥 **استعلام آمار محصولات دارای تخفیف** (تعداد: ${products.filter(p => p.discountPercent || p.originalPrice > p.price).length} کالا)\n` +
      `• 📦 **رهگیری زنده سفارش با کد رهگیری** (مانند LMN-77492019 یا ORD-98750)\n` +
      `• 📊 **آمار زنده و کامل تمام سایت** (تعداد محصولات، دسته‌ها و کدهای تخفیف)\n` +
      `• 🔍 **مشخصات فنی و قیمت کلیه کالاها** (هدفون، ساعت، کیبورد، ماوس، قهوه‌ساز و گجت‌ها)\n` +
      `• 🏷️ **اعلام و اعمال کدهای تخفیف فعال**\n` +
      `• 🚚 **شرایط ارسال رایگان بالای ۱۵ میلیون و تحویل اکسپرس**\n\n` +
      `چه موردی را مایلید بررسی کنیم؟`,
    actions: [
      { type: 'APPLY_COUPON', payload: 'LUMINA2025', label: '🏷️ کدهای تخفیف' },
      { type: 'NAVIGATE', payload: 'shop', label: '🛍️ کاتالوگ محصولات' },
      { type: 'NAVIGATE', payload: 'dashboard', label: '📦 پیگیری سفارشات' }
    ]
  };
}
