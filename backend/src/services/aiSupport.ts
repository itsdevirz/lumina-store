import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { dbManager } from '../database/db';
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
  const categories = dbManager.getCategories();

  const discountedProducts = products.filter(p =>
    (p.discountPercent && p.discountPercent > 0) ||
    (p.originalPrice && p.originalPrice > p.price)
  );

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

  const couponCatalog = coupons
    .filter(c => c.isActive)
    .map(c => {
      const pct = c.discountPercent || (c as any).percent || 20;
      return `• کد تخفیف «${c.code}»: ${pct}٪ تخفیف${c.maxDiscount ? ` (سقف تخفیف: ${c.maxDiscount.toLocaleString('fa-IR')} تومان)` : ''}${c.minPurchase ? ` (حداقل مبلغ خرید: ${c.minPurchase.toLocaleString('fa-IR')} تومان)` : ''}`;
    })
    .join('\n');

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

  const festivalCatalog = festivals
    .map(f => `• جشنواره «${f.title}»: ${f.badgeText || 'تخفیف ویژه'} | تعداد کالا: ${f.products?.length || 0}`)
    .join('\n');

  const categoryCatalog = categories
    .map(c => `- ${c.nameFa} (${c.name}) [کلید: ${c.id}]`)
    .join('\n');

  return `
شما «دستیار هوشمند، فوق‌سریع و کارشناس ارشد پشتیبانی فروشگاه آنلاین لومینا (Lumina Store)» هستید.
وظیفه شما پاسخگویی جامع، دقیق، مؤدبانه و دوستانه به تمام سوالات کاربران درباره فروشگاه لومینا، آمار محصولات، پیگیری زنده سفارشات، جشنواره‌ها و خدمات است.

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
  - ارسال اکسپرس در شهر تهران: تحویل فوری در همان روز کاری با پیک اختصاصی لومینا.
  - ارسال سراسری به تمام شهرها: ظرف ۲۴ تا ۴۸ ساعت با پست پیشتاز یا تیپاکس.

• گارانتی، ضمانت و مرجوعی کالا:
  - ضمانت ۱۰۰٪ اصالت و اورجینال بودن کلیه کالاها.
  - مهلت تست ۷ روزه و ضمانت ۱۰۰٪ بازگشت وجه.

🎟️ کدهای تخفیف فعال:
${couponCatalog}

🎡 جشنواره‌های فعال:
${festivalCatalog || 'هیچ جشنواره‌ای در حال حاضر فعال نیست.'}

📦 کاتالوگ محصولات:
${productCatalog}

📋 سفارشات خریداران جهت رهگیری:
${orderRegistry}
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
        response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: contents as any,
          config: {
            systemInstruction: buildSystemPrompt(),
            temperature: 0.3,
          },
        });
      }

      if (response && response.text) {
        return parseResponseAndActions(response.text);
      }
    } catch (err) {
      console.warn('[AI Support] Error with Gemini API, falling back to local responder:', err);
    }
  }

  // Local fallback response engine
  const lowerMsg = normalizeDigits(lastUserMessage.toLowerCase());

  if (lowerMsg.includes('سفارش') || lowerMsg.includes('پیگیری') || lowerMsg.includes('کد رهگیری') || lowerMsg.includes('ord-') || lowerMsg.includes('tpx-') || lowerMsg.includes('pst-')) {
    const orders = dbManager.getOrders();
    const matchedOrder = orders.find(o =>
      (o.id && lowerMsg.includes(o.id.toLowerCase())) ||
      (o.trackingNumber && lowerMsg.includes(o.trackingNumber.toLowerCase()))
    );

    if (matchedOrder) {
      return {
        reply: `✅ وضعیت سفارش «${matchedOrder.id}»:\n• وضعیت: ${matchedOrder.statusFa || matchedOrder.status}\n• نحوه ارسال: ${matchedOrder.courierName || 'پست پیشتاز'}\n• زمان تحویل تقریبی: ${matchedOrder.estimatedDelivery || '۱ تا ۲ روز کاری'}\n• مبلغ کل: ${(matchedOrder.total || 0).toLocaleString('fa-IR')} تومان`
      };
    }
  }

  if (lowerMsg.includes('تخفیف') || lowerMsg.includes('کوپن') || lowerMsg.includes('کد تخفیف')) {
    const activeCoupons = coupons.filter(c => c.isActive);
    if (activeCoupons.length > 0) {
      const list = activeCoupons.map(c => `• کد «${c.code}»: ${c.discountPercent || 20}٪ تخفیف`).join('\n');
      return {
        reply: `🎉 کدهای تخفیف فعال در لومینا:\n${list}`
      };
    }
  }

  return {
    reply: `سلام! چطور می‌توانم در فروشگاه لومینا به شما کمک کنم؟ شما می‌توانید درباره محصولات، شرایط ارسال، تخفیف‌ها یا پیگیری سفارش از من سوال بپرسید.`
  };
}

export async function handleSupportChatStream(
  messages: ChatMessage[],
  res: Response,
  userContext?: { name?: string; email?: string; cartCount?: number }
): Promise<void> {
  const result = await handleSupportChat(messages, userContext);
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write(`data: ${JSON.stringify({ text: result.reply, actions: result.actions || [] })}\n\n`);
  res.write('data: [DONE]\n\n');
  res.end();
}
