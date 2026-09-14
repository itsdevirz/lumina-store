import { Product, Language } from '../types';
import { CATEGORIES } from '../data/products';

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType: 'website' | 'product' | 'article';
  ogImage?: string;
  keywords?: string[];
  jsonLd?: Record<string, any>;
  noIndex?: boolean;
}

// Category-specific SEO descriptions & keywords for rich search engine indexing
export const CATEGORY_SEO_DATA: Record<
  string,
  {
    titleFa: string;
    titleEn: string;
    descriptionFa: string;
    descriptionEn: string;
    keywordsFa: string[];
    keywordsEn: string[];
  }
> = {
  audio: {
    titleFa: 'خرید سیستم‌های صوتی و هدفون بی‌سیم | قیمت و بررسی انواع اسپیکر و هدست | لومینا',
    titleEn: 'Audio & Acoustics | Premium Headphones, Earbuds & Speakers | Lumina Store',
    descriptionFa:
      'مجموعه برترین هدفون‌های نویزکنسلینگ، هندزفری‌های بلوتوثی Hi-Res و اسپیکرهای پرتابل با بهترین کیفیت صدا، ضمانت اصالت کالا و ارسال سریع در فروشگاه اینترنتی لومینا.',
    descriptionEn:
      'Shop industry-leading active noise cancelling headphones, Hi-Res wireless earbuds, and portable audiophile speakers with guaranteed authenticity and fast delivery.',
    keywordsFa: ['هدفون نویزکنسلینگ', 'خرید هندزفری بلوتوث', 'اسپیکر پرتابل', 'صوت های فای', 'هدفون لومینا'],
    keywordsEn: ['ANC headphones', 'wireless earbuds', 'audiophile speakers', 'high fidelity audio', 'Lumina sound']
  },
  'smart-wear': {
    titleFa: 'خرید گجت‌های پوشیدنی هوشمند | ساعت هوشمند و مچ‌بند سلامتی | لومینا',
    titleEn: 'Smart Wearables | Luxury Smartwatches & Fitness Trackers | Lumina Store',
    descriptionFa:
      'جدیدترین ساعت‌های هوشمند با بدنه تیتانیوم، سنسورهای پایش سلامت پیشرفته، ECG و عمر باتری طولانی. انتخابی بی‌نظیر برای ورزش و روزمرگی با ضمانت لومینا.',
    descriptionEn:
      'Discover premium titanium smartwatches, fitness trackers with continuous health monitoring, ECG sensors, and extended battery life at Lumina Store.',
    keywordsFa: ['ساعت هوشمند', 'مچ بند سلامتی', 'خرید اسمارت واچ', 'ساعت تیتانیوم', 'ساعت ورزشی'],
    keywordsEn: ['smartwatch', 'fitness tracker', 'health monitor', 'titanium watch', 'smart wearable']
  },
  workspace: {
    titleFa: 'تجهیزات مدرن میز کار و ورک‌استیشن | کیبورد مکانیکال و استند | لومینا',
    titleEn: 'Workspace & Desk Setup | Ergonomic Keyboards & Minimal Desk Accessories | Lumina',
    descriptionFa:
      'ارتقای بهره‌وری با لوازم ارگونومیک و مینیمال میز کار؛ کیبوردهای مکانیکال سفارشی، استندهای مانیتور آلومینیومی و پدهای چرمی با بالاترین کیفیت ساخت.',
    descriptionEn:
      'Elevate your desk ergonomics and productivity with custom mechanical keyboards, anodized aluminum monitor stands, and artisan leather desk mats.',
    keywordsFa: ['تجهیزات میز کار', 'کیبورد مکانیکال', 'استند مانیتور', 'لوازم دسکتاپ', 'محیط کار مدرن'],
    keywordsEn: ['desk setup', 'mechanical keyboard', 'ergonomic workspace', 'monitor stand', 'desk accessories']
  },
  lifestyle: {
    titleFa: 'لوازم روزمره و اکسسوری سفر لوکس | کوله پشتی ضدآب و کیف پاسپورت | لومینا',
    titleEn: 'Lifestyle & Travel | Minimalist Bags, Wallets & EDC Essentials | Lumina Store',
    descriptionFa:
      'مجموعه اکسسوری‌های مینیمال سبک زندگی و ملزومات سفر؛ کوله‌پشتی‌های مقاوم در برابر آب با قفل امنیتی، کیف پول‌های مسدودکننده RFID و تجهیزات EDC لوکس.',
    descriptionEn:
      'Explore durable weather-resistant urban backpacks, RFID-blocking travel wallets, and premium everyday carry essentials crafted for modern commuters.',
    keywordsFa: ['کوله پشتی شهری', 'کیف پول ضد سرقت', 'لوازم سفر مدرن', 'اکسسوری لوکس', 'وسایل روزمره'],
    keywordsEn: ['urban backpack', 'RFID wallet', 'travel gear', 'EDC essentials', 'lifestyle accessories']
  },
  coffee: {
    titleFa: 'تجهیزات تخصصی دم‌آوری قهوه | آسیاب دستی دقیق و قهوه‌ساز دمی | لومینا',
    titleEn: 'Specialty Coffee Gear | Precision Grinders & Pour-Over Makers | Lumina Store',
    descriptionFa:
      'تجربه عطر و طعم واقعی قهوه با ابزارهای باریستای حرفه‌ای؛ گرایندرهای دقیق مخروطی استیل، کتل‌های هوشمند دماسنج‌دار و دریپرهای تخصصی در لومینا.',
    descriptionEn:
      'Brew specialty-grade coffee at home with precision manual conical burr grinders, temperature-controlled gooseneck kettles, and artisan drippers.',
    keywordsFa: ['آسیاب قهوه دستی', 'قهوه ساز تخصصی', 'ابزار باریستا', 'کتل دماسنج دار', 'دم آوری قهوه'],
    keywordsEn: ['specialty coffee', 'manual coffee grinder', 'pour over kettle', 'barista tools', 'coffee brewer']
  },
  'home-design': {
    titleFa: 'دکوراسیون مینیمال و نورپردازی هوشمند منزل | لومینا هوم',
    titleEn: 'Minimal Home & Smart Ambient Lighting | Lumina Home Design',
    descriptionFa:
      'فضای زندگی خود را متحول کنید؛ چراغ‌های رومیزی مغناطیسی معلق، ساعت‌های رومیزی بتنی مینیمال و المان‌های دکوراتیو معاصر با طراحی ماندگار.',
    descriptionEn:
      'Transform your living spaces with floating magnetic balance lamps, cast concrete clocks, and sculptural Scandinavian minimal decor.',
    keywordsFa: ['دکوراسیون مینیمال', 'چراغ خواب معلق', 'نورپردازی هوشمند', 'طراحی داخلی مدرن', 'ساعت رومیزی بتنی'],
    keywordsEn: ['minimal home decor', 'magnetic balance lamp', 'smart ambient lighting', 'scandinavian decor']
  }
};

/**
 * Cleanly truncates text to a specific length without breaking words
 */
function truncateText(text: string, maxLength = 155): string {
  if (!text) return '';
  const cleaned = text.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  const cut = cleaned.substring(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.substring(0, lastSpace) : cut) + '...';
}

/**
 * Gets clean canonical base URL from current window location
 */
export function getBaseOrigin(): string {
  if (typeof window !== 'undefined' && window.location) {
    return window.location.origin;
  }
  return 'https://lumina.io';
}

/**
 * Generates SEO metadata based on current state (tab, product, category, lang)
 */
export function generateSeoMetadata(params: {
  activeTab: string;
  selectedProduct: Product | null;
  selectedCategory?: string;
  lang: Language;
  isAdmin?: boolean;
}): SeoMetadata {
  const { activeTab, selectedProduct, selectedCategory, lang, isAdmin } = params;
  const origin = getBaseOrigin();

  // 1. ADMIN ROUTE
  if (isAdmin || activeTab === 'admin') {
    return {
      title: lang === 'fa' ? 'داشبورد مدیریت فروشگاه | لومینا' : 'Admin Management Dashboard | Lumina Store',
      description:
        lang === 'fa'
          ? 'پنل مدیریت یکپارچه فروشگاه لومینا جهت مشاهده آمار، پردازش سفارش‌ها و مدیریت انبار کالا.'
          : 'Lumina store administration panel for order processing, inventory control and analytics.',
      canonicalUrl: `${origin}/admin`,
      ogType: 'website',
      noIndex: true // Admin panel should not be indexed by search engines
    };
  }

  // 2. PRODUCT DETAIL PAGE
  if (activeTab === 'product-detail' && selectedProduct) {
    const p = selectedProduct;
    const isFa = lang === 'fa';
    const prodName = isFa ? p.nameFa : p.name;
    const brandName = p.brand;
    const catName = isFa ? p.categoryFa : p.category;
    const priceText = p.price.toLocaleString(isFa ? 'fa-IR' : 'en-US');

    const title = isFa
      ? `خرید و قیمت ${prodName} - برند ${brandName} | لومینا`
      : `Buy ${p.name} by ${brandName} - Price & Specs | Lumina`;

    const rawDesc = isFa ? (p.descriptionFa || p.description) : (p.description || p.descriptionFa);
    const shortDesc = truncateText(rawDesc, 140);
    const description = isFa
      ? `${shortDesc} | قیمت: ${priceText} تومان | موجود در انبار | ارسال سریع و گارانتی اصالت کالا در لومینا.`
      : `${shortDesc} | Price: ${priceText} Tomans | In Stock. Free shipping & warranty at Lumina Store.`;

    const canonicalUrl = `${origin}/product/${p.id}`;
    const primaryImage = p.images?.[0] || '/images/products/photo-1505740420928-5e560c06d30e.jpg';

    // JSON-LD Structured Data for Google Product Rich Snippet
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: prodName,
      image: p.images || [primaryImage],
      description: rawDesc,
      sku: p.id,
      mpn: p.id,
      brand: {
        '@type': 'Brand',
        name: brandName
      },
      category: catName,
      offers: {
        '@type': 'Offer',
        url: canonicalUrl,
        priceCurrency: 'IRT',
        price: p.price,
        itemCondition: 'https://schema.org/NewCondition',
        availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'فروشگاه اینترنتی لومینا (Lumina)'
        }
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: p.rating || 4.9,
        reviewCount: p.reviewsCount || 18,
        bestRating: '5',
        worstRating: '1'
      }
    };

    return {
      title,
      description,
      canonicalUrl,
      ogType: 'product',
      ogImage: primaryImage,
      keywords: isFa
        ? [prodName, brandName, catName, 'خرید اینترنتی', 'قیمت روز', ...(p.tags || [])]
        : [p.name, brandName, p.category, 'buy online', 'best price', ...(p.tags || [])],
      jsonLd
    };
  }

  // 3. CATEGORY / SHOP LISTING
  if (activeTab === 'shop') {
    const isFa = lang === 'fa';
    const catId = selectedCategory && selectedCategory !== 'all' ? selectedCategory : undefined;
    const catSeo = catId ? CATEGORY_SEO_DATA[catId] : null;
    const matchedCategory = catId ? CATEGORIES.find(c => c.id === catId) : null;

    if (catSeo && matchedCategory) {
      const title = isFa ? catSeo.titleFa : catSeo.titleEn;
      const description = isFa ? catSeo.descriptionFa : catSeo.descriptionEn;
      const canonicalUrl = `${origin}/category/${catId}`;
      const ogImage = matchedCategory.image;

      // JSON-LD for Category / CollectionPage
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: isFa ? matchedCategory.nameFa : matchedCategory.name,
        description,
        url: canonicalUrl,
        breadcrumb: {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: isFa ? 'صفحه اصلی' : 'Home',
              item: `${origin}/`
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: isFa ? 'فروشگاه' : 'Shop',
              item: `${origin}/shop`
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: isFa ? matchedCategory.nameFa : matchedCategory.name,
              item: canonicalUrl
            }
          ]
        }
      };

      return {
        title,
        description,
        canonicalUrl,
        ogType: 'website',
        ogImage,
        keywords: isFa ? catSeo.keywordsFa : catSeo.keywordsEn,
        jsonLd
      };
    }

    // All Products Shop View
    return {
      title:
        isFa
          ? 'فروشگاه و محصولات لومینا | گجت‌های هوشمند، هدفون و اکسسوری‌های مدرن'
          : 'Lumina Shop | Premium Smart Tech, Audio & Lifestyle Gadgets',
      description:
        isFa
          ? 'مشاهده و خرید آنلاین تمامی محصولات فروشگاه لومینا؛ هدفون‌های نویزکنسلینگ، ساعت‌های هوشمند، تجهیزات مدرن میز کار و اکسسوری‌های سفر با بهترین قیمت و ارسال اکسپرس.'
          : 'Browse our complete catalog of precision-engineered audio, smart wearables, workspace essentials, and specialty lifestyle gear.',
      canonicalUrl: `${origin}/shop`,
      ogType: 'website',
      ogImage: '/images/products/photo-1505740420928-5e560c06d30e.jpg',
      keywords: isFa
        ? ['فروشگاه اینترنتی', 'خرید گجت', 'هدفون بلوتوث', 'ساعت هوشمند', 'لوازم دیجیتال لوکس']
        : ['online store', 'tech shop', 'gadgets catalog', 'audiophile gear', 'smart accessories']
    };
  }

  // 4. CART
  if (activeTab === 'cart') {
    return {
      title: lang === 'fa' ? 'سبد خرید شما | فروشگاه لومینا' : 'Your Shopping Cart | Lumina Store',
      description:
        lang === 'fa'
          ? 'بررسی و ویرایش اقلام سبد خرید، اعمال کدهای تخفیف شگفت‌انگیز و محاسبه هزینه نهایی سفارش در لومینا.'
          : 'Review and modify the items in your shopping cart, apply promotional coupons, and proceed to secure checkout.',
      canonicalUrl: `${origin}/cart`,
      ogType: 'website',
      noIndex: true // Cart pages should typically not be indexed
    };
  }

  // 5. CHECKOUT
  if (activeTab === 'checkout') {
    return {
      title: lang === 'fa' ? 'تسویه حساب و پرداخت امن سفارش | لومینا' : 'Secure Checkout & Payment | Lumina Store',
      description:
        lang === 'fa'
          ? 'تکمیل نشانی ارسال، انتخاب روش پرداخت شتابی و نهایی‌سازی سفارش در درگاه امن فروشگاه لومینا.'
          : 'Enter shipping details, select your preferred secure payment method, and complete your order at Lumina Store.',
      canonicalUrl: `${origin}/checkout`,
      ogType: 'website',
      noIndex: true
    };
  }

  // 6. WISHLIST
  if (activeTab === 'wishlist') {
    return {
      title: lang === 'fa' ? 'لیست علاقه‌مندی‌های من | فروشگاه لومینا' : 'My Saved Wishlist | Lumina Store',
      description:
        lang === 'fa'
          ? 'مشاهده و مدیریت محصولات ذخیره‌شده و محبوب شما در فروشگاه لومینا جهت خرید در آینده.'
          : 'View and organize your favorite tech and lifestyle products saved in your personal Lumina wishlist.',
      canonicalUrl: `${origin}/wishlist`,
      ogType: 'website',
      noIndex: true
    };
  }

  // 7. USER ACCOUNT
  if (activeTab === 'account') {
    return {
      title: lang === 'fa' ? 'پروفایل و حساب کاربری | فروشگاه لومینا' : 'My Profile & Orders | Lumina Store',
      description:
        lang === 'fa'
          ? 'مدیریت اطلاعات حساب، پیگیری سفارش‌های ارسال‌شده و مشاهده آدرس‌های پستی ثبت‌شده در لومینا.'
          : 'Manage your user profile, track active package deliveries, and review previous order history.',
      canonicalUrl: `${origin}/account`,
      ogType: 'website',
      noIndex: true
    };
  }

  // 8. DEFAULT / HOME PAGE
  const isFa = lang === 'fa';
  return {
    title: isFa
      ? 'فروشگاه اینترنتی لومینا | خرید جدیدترین گجت‌های هوشمند، هدفون و لوازم لوکس'
      : 'Lumina | Premium Modern Tech, Audio & Lifestyle Gadgets',
    description: isFa
      ? 'فروشگاه آنلاین لومینا؛ مرجع تخصصی خرید برترین هدفون‌های بی‌سیم، ساعت‌های هوشمند، تجهیزات ارگونومیک میز کار و لوازم سفر با گارانتی اصالت کالا و ارسال سریع.'
      : 'Lumina Store offers top-tier active noise cancelling audio, titanium smartwatches, and minimalist workspace lifestyle products designed for perfection.',
    canonicalUrl: `${origin}/`,
    ogType: 'website',
    ogImage: '/images/products/photo-1505740420928-5e560c06d30e.jpg',
    keywords: isFa
      ? ['فروشگاه اینترنتی لومینا', 'خرید گجت مدرن', 'هدفون نویزکنسلینگ', 'ساعت هوشمند', 'میز کار مینیمال']
      : ['lumina store', 'modern ecommerce', 'premium audio', 'minimalist gadgets', 'lifestyle tech'],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Lumina Store',
      alternateName: 'فروشگاه اینترنتی لومینا',
      url: `${origin}/`,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${origin}/shop?search={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    }
  };
}

/**
 * Directly updates all head tags in the browser DOM.
 * Ensures compatibility across all environments and search engine pre-renderers.
 */
export function applySeoToDom(meta: SeoMetadata): void {
  if (typeof document === 'undefined') return;

  // 1. Document Title
  document.title = meta.title;

  // Helper to get or create a meta tag
  const setMetaTag = (attribute: 'name' | 'property', key: string, content: string) => {
    let el = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attribute, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Helper to get or create a link tag
  const setLinkTag = (rel: string, href: string) => {
    let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  };

  // 2. Meta Description
  setMetaTag('name', 'description', meta.description);

  // 3. Canonical Tag
  setLinkTag('canonical', meta.canonicalUrl);

  // 4. OpenGraph Tags
  setMetaTag('property', 'og:title', meta.title);
  setMetaTag('property', 'og:description', meta.description);
  setMetaTag('property', 'og:url', meta.canonicalUrl);
  setMetaTag('property', 'og:type', meta.ogType);
  if (meta.ogImage) {
    setMetaTag('property', 'og:image', meta.ogImage);
  }

  // 5. Twitter Card Tags
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', meta.title);
  setMetaTag('name', 'twitter:description', meta.description);
  if (meta.ogImage) {
    setMetaTag('name', 'twitter:image', meta.ogImage);
  }

  // 6. Keywords
  if (meta.keywords && meta.keywords.length > 0) {
    setMetaTag('name', 'keywords', meta.keywords.join(', '));
  }

  // 7. Robots (noindex if private/admin/checkout)
  if (meta.noIndex) {
    setMetaTag('name', 'robots', 'noindex, nofollow');
  } else {
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1');
  }

  // 8. JSON-LD Structured Data Script
  const SCRIPT_ID = 'lumina-dynamic-seo-jsonld';
  let jsonScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (meta.jsonLd) {
    if (!jsonScript) {
      jsonScript = document.createElement('script');
      jsonScript.id = SCRIPT_ID;
      jsonScript.type = 'application/ld+json';
      document.head.appendChild(jsonScript);
    }
    jsonScript.textContent = JSON.stringify(meta.jsonLd, null, 2);
  } else if (jsonScript) {
    jsonScript.remove();
  }
}
