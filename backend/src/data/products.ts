import { Product } from '../types';

export const CATEGORIES = [
  {
    id: 'apparel',
    name: 'Apparel & Fashion',
    nameFa: 'پوشاک و مد',
    icon: 'Shirt',
    image: '/images/products/photo-1521572267360-ee0c2909d518.jpg',
    itemCount: 3,
  },
  {
    id: 'audio',
    name: 'Audio',
    nameFa: 'تجهیزات صوتی',
    icon: 'Headphones',
    image: '/images/products/photo-1505740420928-5e560c06d30e.jpg',
    itemCount: 2,
  },
  {
    id: 'workspace',
    name: 'Workspace',
    nameFa: 'میز کار',
    icon: 'Laptop',
    image: '/images/products/photo-1527864550417-7fd91fc51a46.jpg',
    itemCount: 2,
  },
  {
    id: 'smart-wear',
    name: 'Smart Gadgets',
    nameFa: 'گجت هوشمند',
    icon: 'Watch',
    image: '/images/products/photo-1523275335684-37898b6baf30.jpg',
    itemCount: 1,
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    nameFa: 'لوازم روزمره',
    icon: 'Briefcase',
    image: '/images/products/photo-1553062407-98eeb64c6a62.jpg',
    itemCount: 1,
  },
  {
    id: 'coffee',
    name: 'Coffee',
    nameFa: 'قهوه و کافه',
    icon: 'Coffee',
    image: '/images/products/photo-1514432324607-a09d9b4aefdd.jpg',
    itemCount: 1,
  },
  {
    id: 'home-design',
    name: 'Home Decor',
    nameFa: 'دکوراسیون',
    icon: 'Home',
    image: '/images/products/photo-1507473885765-e6ed057f782c.jpg',
    itemCount: 1,
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'lum-01',
    name: 'Lumina Horizon ANC Pro Headphones',
    nameFa: 'هدفون بی‌سیم نویزکنسلینگ لومینا هورایزن پرو',
    brand: 'Lumina Sound',
    category: 'audio',
    categoryFa: 'سیستم‌های صوتی و هدفون',
    rating: 4.9,
    reviewsCount: 142,
    price: 14800000,
    priceUSD: 249,
    originalPrice: 18500000,
    originalPriceUSD: 310,
    discountPercent: 20,
    isFlashSale: true,
    flashSaleEndsAt: Date.now() + 1000 * 60 * 60 * 14 + 1000 * 60 * 32, // ~14 hours
    stock: 7,
    soldCount: 43,
    featured: true,
    rank: 1,
    images: [
      '/images/products/photo-1505740420928-5e560c06d30e.jpg',
      '/images/products/photo-1484704849700-f032a568e944.jpg',
      '/images/products/photo-1546435770-a3e426bf472b.jpg',
    ],
    description: 'Ultra-refined active noise cancellation with 45mm custom titanium drivers and 40-hour continuous battery life. Crafted from anodized aluminum and memory foam leather cushions.',
    descriptionFa: 'حذف نویز هوشمند و تطبیقی با درایورهای اختصاصی ۴۵ میلی‌متری تیتانیوم، شارژدهی خیره‌کننده ۴۰ ساعته با بدنه آلومینیوم برس‌خورده و پدهای ارگونومیک مموری فوم.',
    specs: {
      'نوع اتصال': 'Bluetooth 5.3 + کابل جک ۳.۵ میلی‌متری',
      'شارژدهی': '۴۰ ساعت با فعال بودن ANC',
      'وزن': '۲۵۲ گرم',
      'درگاه شارژ': 'USB-C با قابلیت شارژ سریع (۵ دقیقه شارژ = ۴ ساعت پخش)',
      'کدک‌های صوتی': 'LDAC, aptX Adaptive, AAC'
    },
    features: [
      'Hybrid Active Noise Cancelling with Transparency Mode',
      'Custom 45mm Titanium Coated Drivers',
      'Multi-device seamless pairing (2 devices simultaneously)',
      'Crafted with aircraft-grade aluminum'
    ],
    featuresFa: [
      'سیستم نویزکنسلینگ هیبریدی ۴ میکرونه با حالت شفافیت طبیعی',
      'درایورهای ۴۵ میلی‌متری تیتانیوم با تفکیک صدای استودیویی',
      'امکان اتصال همزمان به دو دستگاه با سوییچ آنی',
      'کیف حمل هاردکیس چرمی با بدنه مقاوم'
    ],
    tags: ['ANC', 'Wireless', 'Premium', 'BestSeller'],
    variantType: 'color_only',
    colors: [
      { id: 'c-space-gray', name: 'خاکستری تیتانیوم', hex: '#374151', image: '/images/products/photo-1505740420928-5e560c06d30e.jpg', stock: 4, active: true },
      { id: 'c-silver', name: 'نقره‌ای استودیویی', hex: '#cbd5e1', image: '/images/products/photo-1484704849700-f032a568e944.jpg', stock: 3, active: true },
      { id: 'c-navy', name: 'سرمه‌ای مات', hex: '#1e293b', image: '/images/products/photo-1546435770-a3e426bf472b.jpg', stock: 0, active: true }
    ],
    variants: [
      { id: 'v-lum01-gray', sku: 'LUM01-SGY', colorName: 'خاکستری تیتانیوم', colorHex: '#374151', stock: 4, price: 14800000, active: true, image: '/images/products/photo-1505740420928-5e560c06d30e.jpg' },
      { id: 'v-lum01-silv', sku: 'LUM01-SLV', colorName: 'نقره‌ای استودیویی', colorHex: '#cbd5e1', stock: 3, price: 14800000, active: true, image: '/images/products/photo-1484704849700-f032a568e944.jpg' },
      { id: 'v-lum01-navy', sku: 'LUM01-NVY', colorName: 'سرمه‌ای مات', colorHex: '#1e293b', stock: 0, price: 15200000, active: true, image: '/images/products/photo-1546435770-a3e426bf472b.jpg' }
    ]
  },
  {
    id: 'lum-02',
    name: 'Kanso Minimalist Mechanical Keyboard',
    nameFa: 'کیبورد مکانیکال بی‌سیم کانسو مینیمال ۷۵٪',
    brand: 'Kanso Studio',
    category: 'workspace',
    categoryFa: 'تجهیزات مدرن میز کار',
    rating: 4.8,
    reviewsCount: 98,
    price: 8900000,
    priceUSD: 155,
    originalPrice: 10500000,
    originalPriceUSD: 180,
    discountPercent: 15,
    isFlashSale: false,
    stock: 12,
    soldCount: 38,
    featured: true,
    rank: 2,
    images: [
      '/images/products/photo-1587829741301-dc798b83add3.jpg',
      '/images/products/photo-1618384887929-16ec33fab9ef.jpg',
      '/images/products/photo-1595225476474-87563907a212.jpg'
    ],
    description: 'A 75% compact mechanical keyboard engineered with hot-swappable tactile switches, sound-dampening silicone gaskets, and premium PBT dye-sub keycaps.',
    descriptionFa: 'کیبورد مکانیکی جمع‌وجور ۷۵ درصد با ساختار گسکت مانت، سوئیچ‌های روان و سایلنت با قابلیت تعویض آنی (Hot-Swap) و کلیدهای دابل شات PBT ضدسایش.',
    specs: {
      'سوئیچ': 'Gateron G-Pro Yellow سایلنت و کارخانه‌ای روان‌شده',
      'اتصالات': 'بی‌سیم 2.4GHz + بلوتوث ۵.۰ + کابل تایپ C روکش‌دار',
      'باتری': '۴۰۰۰ میلی‌آمپر (تا ۲۰۰ ساعت بدون نورپردازی)',
      'نور پس‌زمینه': 'نور سفید گرم با ۲۰ افکت نوری جذاب',
      'سازگاری': 'macOS, Windows, iOS, Android'
    },
    features: [
      'Gasket mounted acoustic dampening layers',
      'Hot-swappable 3-pin & 5-pin PCB',
      'Rotary CNC aluminum volume encoder knob',
      'Mac and Windows keycaps included'
    ],
    featuresFa: [
      'طراحی گسکت مانت با فوم سیلیکونی صداگیر برای تجربه تایپ مخملی',
      'کلید ولوم آلومینیومی چرخشی چندکاره با تراش CNC',
      'پشتیبانی کامل از سوییچ‌های ۳ پین و ۵ پین استانداردهای روز',
      'کلیدهای یدکی اختصاصی سیستم‌عامل مک و ویندوز در جعبه'
    ],
    tags: ['Mechanical', 'Keyboard', 'HotSwap', 'Workspace']
  },
  {
    id: 'lum-03',
    name: 'Chronos Series 4 Sapphire Smartwatch',
    nameFa: 'ساعت هوشمند کرونوس سری ۴ با شیشه یاقوت کبود',
    brand: 'Chronos',
    category: 'smart-wear',
    categoryFa: 'گجت‌های پوشیدنی هوشمند',
    rating: 4.9,
    reviewsCount: 215,
    price: 19800000,
    priceUSD: 330,
    originalPrice: 24000000,
    originalPriceUSD: 400,
    discountPercent: 18,
    isFlashSale: true,
    flashSaleEndsAt: Date.now() + 1000 * 60 * 60 * 14 + 1000 * 60 * 32,
    stock: 5,
    soldCount: 89,
    featured: true,
    rank: 3,
    images: [
      '/images/products/photo-1523275335684-37898b6baf30.jpg',
      '/images/products/photo-1508685096489-7aacd43bd3b1.jpg',
      '/images/products/photo-1546868871-7041f2a55e12.jpg'
    ],
    description: 'Aerospace-grade titanium chassis matched with ultra-clear sapphire crystal glass. Features precise ECG, SpO2 monitoring, and 14-day battery reserve.',
    descriptionFa: 'فریم تیتانیوم گرید هوافضا با صفحه شیشه‌ای ضدخش یاقوت کبود (Sapphire)، سنسور سنجش ضربان قلب، نوار قلب ECG و باتری ۱۴ روزه با شارژ وایرلس.',
    specs: {
      'نمایشگر': 'AMOLED Retina با روشنایی ۲۰۰۰ نیت و قابلیت Always-On',
      'مقاومت در برابر آب': '5ATM (ضدآب تا عمق ۵۰ متر استاندارد غواصی)',
      'سنسورها': 'ECG, سنجش اکسیژن خون SpO2, شتاب‌سنج, فشارسنج',
      'عمر باتری': '۱۴ روز استفاده عادی، ۷ روز استفاده سنگین',
      'جنس بدنه': 'تیتانیوم برس‌خورده مات'
    },
    features: [
      'Always-on Ultra HD AMOLED display',
      'Heart health alerts and sleep architecture analysis',
      'Over 100 dedicated workout and outdoor tracking profiles',
      'Dual-frequency high precision GPS'
    ],
    featuresFa: [
      'صفحه نمایش همیشه روشن با رزولوشن فوق‌العاده و خوانایی زیر نور مستقیم',
      'پایش هوشمند وضعیت خواب، استرس و تمرینات ورزشی بیش از ۱۰۰ رشته',
      'مجهز به GPS دوبانده با دقت فوق‌العاده بالا برای ردیابی مسیر',
      'بند چرم طبیعی با دوخت دست‌دوز به همراه بند سیلیکونی ورزشی'
    ],
    tags: ['Smartwatch', 'Titanium', 'Health', 'Luxury']
  },
  {
    id: 'lum-04',
    name: 'Atelier Florentine Full-Grain Leather Bag',
    nameFa: 'کیف مسافرتی چرم طبیعی دست‌دوز آتلیه فلورانس',
    brand: 'Atelier Nord',
    category: 'lifestyle',
    categoryFa: 'لوازم روزمره و سفر',
    rating: 4.9,
    reviewsCount: 76,
    price: 17200000,
    priceUSD: 290,
    originalPrice: 21500000,
    originalPriceUSD: 360,
    discountPercent: 20,
    isFlashSale: false,
    stock: 8,
    soldCount: 31,
    featured: true,
    rank: 4,
    images: [
      '/images/products/photo-1553062407-98eeb64c6a62.jpg',
      '/images/products/photo-1548036328-c9fa89d128fa.jpg',
      '/images/products/photo-1584917865442-de89df76afd3.jpg'
    ],
    description: 'Handcrafted from vegetable-tanned full-grain Italian leather that ages with a magnificent patina. YKK Excella brass zippers and padded 16-inch laptop pocket.',
    descriptionFa: 'ساخته شده با چرم گاوی درجه یک ایتالیایی با دباغی گیاهی، یراق‌آلات برنجی لوکس، محفظه اختصاصی محافظت‌شده برای لپ‌تاپ ۱۶ اینچی و آستر ضدآب.',
    specs: {
      'جنس چرم': 'چرم فول‌گرین دباغی گیاهی با پتینای ماندگار',
      'گنجایش': '۳۲ لیتر، مناسب سفرهای ۳ تا ۵ روزه',
      'ابعاد': '۵۲ × ۳۰ × ۲۶ سانتی‌متر',
      'یراق‌آلات': 'زیپ‌های دندانه‌درشت برنجی ژاپنی YKK Excella',
      'وزن': '۱.۴ کیلوگرم'
    },
    features: [
      'Detachable padded leather shoulder strap',
      'Luggage trolley pass-through strap on back',
      'Separate ventilated shoe compartment',
      'Lifetime warranty on stitching and hardware'
    ],
    featuresFa: [
      'بند دوشی عریض چرمی با پد نرم و قابلیت تنظیم ارتفاع',
      'بند اتصال به دسته چمدان فرودگاهی برای جابجایی آسان در سفر',
      'محفظه زیرین جداگانه دارای تهویه مخصوص کفش یا البسه ورزشی',
      'ضمانت مادام‌العمر کیفیت دوخت و یراق‌آلات'
    ],
    tags: ['Leather', 'Travel', 'Handmade', 'Minimal']
  },
  {
    id: 'lum-05',
    name: 'Aroma Artisanal Ceramic Pour-Over Set',
    nameFa: 'ست دم‌آوری تخصصی قهوه سرامیکی مات آروما',
    brand: 'Aroma Crafts',
    category: 'coffee',
    categoryFa: 'تجهیزات تخصصی قهوه',
    rating: 4.7,
    reviewsCount: 63,
    price: 3600000,
    priceUSD: 60,
    originalPrice: 4500000,
    originalPriceUSD: 75,
    discountPercent: 20,
    isFlashSale: true,
    flashSaleEndsAt: Date.now() + 1000 * 60 * 60 * 14 + 1000 * 60 * 32,
    stock: 14,
    soldCount: 52,
    featured: false,
    images: [
      '/images/products/photo-1514432324607-a09d9b4aefdd.jpg',
      '/images/products/photo-1495474472287-4d71bcdd2085.jpg',
      '/images/products/photo-1511920170033-f8396924c348.jpg'
    ],
    description: 'Hand-thrown matte black ceramic dripper with precision internal spirals designed for steady thermal retention and balanced coffee extraction.',
    descriptionFa: 'دریپر سرامیکی دست‌ساز با خطوط مارپیچ ارگونومیک برای حفظ حرارت ثابت و استخراج یکنواخت و شفاف عطر و طعم دانه‌های تخصصی قهوه.',
    specs: {
      'جنس بدنه': 'سرامیک پخته‌شده در دمای ۱۳۰۰ درجه با لعاب مات ضدجذب بو',
      'ظرفیت سِرو': '۶۰۰ میلی‌لیتر (۲ الی ۴ فنجان)',
      'همراه با': 'سرور شیشه‌ای بوروسیلیکات مقاوم به شوک حرارتی + ۱۰۰ عدد فیلتر کاغذی ژاپنی',
      'پایه': 'چوب گردوی طبیعی روغن‌خورده ضدآب'
    },
    features: [
      'Optimal 60-degree extraction angle',
      'Heavy heat-retaining ceramic body',
      'Heat-resistant borosilicate glass server',
      'Handcrafted natural walnut base'
    ],
    featuresFa: [
      'زاویه دقیق ۶۰ درجه برای جریان روان آب و جلوگیری از تلخی بیش از حد قهوه',
      'سرور مدرن از جنس شیشه پیرکس با خطوط راهنمای حجم نوشیدنی',
      'شامل یک بسته ۱۰۰ عددی فیلتر کاغذی سفید ساخت ژاپن',
      'پایه نگهدارنده ارگونومیک از چوب گردوی با اصالت'
    ],
    tags: ['Coffee', 'Ceramic', 'Barista', 'Minimal']
  },
  {
    id: 'lum-06',
    name: 'Nordic Halo Walnut Ambient Lamp',
    nameFa: 'چراغ رومیزی مدرن نوردیک هالو با چوب گردو',
    brand: 'Nordic Lumens',
    category: 'home-design',
    categoryFa: 'دکوراسیون مینیمال منزل',
    rating: 4.8,
    reviewsCount: 84,
    price: 6400000,
    priceUSD: 110,
    originalPrice: 8000000,
    originalPriceUSD: 135,
    discountPercent: 20,
    isFlashSale: false,
    stock: 9,
    soldCount: 41,
    featured: true,
    images: [
      '/images/products/photo-1507473885765-e6ed057f782c.jpg',
      '/images/products/photo-1513506003901-1e6a229e2d15.jpg',
      '/images/products/photo-1540932239986-30128078f3c5.jpg'
    ],
    description: 'Circular architectural ambient light featuring dimmable 2700K warm LED illumination embedded into solid sustainably sourced North American walnut.',
    descriptionFa: 'لوستر و چراغ خواب رومیزی حلقه‌ای مینیمال با نورپردازی گرم ۲۷۰۰ کلوین و دیمر لمسی بدون وقفه، تراشیده شده از چوب گردوی سالید آمریکای شمالی.',
    specs: {
      'نوع نور': 'LED با شاخص تفکیک رنگ CRI 95+ (نور طبیعی بدون لرزش)',
      'کنترل': 'سنسور لمسی دیمر با قابلیت تنظیم از ۵٪ تا ۱۰۰٪ روشنایی',
      'توان مصرفی': '۱۲ وات کم‌مصرف انرژی A+++',
      'کابل': 'طول کابل ۱.۸ متر با روکش بافته‌شده کنفی و آداپتور تایپ C'
    },
    features: [
      'Touch-sensitive stepless dimming memory',
      'Glare-free diffused indirect illumination',
      'Sculpted from single-piece genuine walnut',
      'Flicker-free eye-care certified LED'
    ],
    featuresFa: [
      'تنظیم پیوسته شدت نور با لمس و ذخیره آخرین سطح روشنایی در حافظه داخلی',
      'پخش نور نرم و غیرمستقیم برای مطالعه شبانه بدون خستگی چشم',
      'طراحی دایره‌ای نمادین و چشم‌نواز با تعادل بصری فوق‌العاده',
      'همراه با کابل پارچه‌ای شیک و بادوام'
    ],
    tags: ['Lighting', 'Minimal', 'Interior', 'Wood']
  },
  {
    id: 'lum-07',
    name: 'Precision Ergonomic Wireless Mouse M9',
    nameFa: 'موس بی‌سیم ارگونومیک حرفه‌ای لومینا M9',
    brand: 'Lumina Tech',
    category: 'workspace',
    categoryFa: 'تجهیزات مدرن میز کار',
    rating: 4.8,
    reviewsCount: 112,
    price: 4800000,
    priceUSD: 80,
    originalPrice: 5900000,
    originalPriceUSD: 100,
    discountPercent: 18,
    isFlashSale: false,
    stock: 16,
    soldCount: 65,
    featured: false,
    images: [
      '/images/products/photo-1527864550417-7fd91fc51a46.jpg',
      '/images/products/photo-1615663245857-ac93bb7c39e7.jpg',
      '/images/products/photo-1593305841991-05c297ba4575.jpg'
    ],
    description: 'Sculpted for hand ergonomics with dual scroll wheels, MagSpeed electromagnetic scrolling, and silent clicks for peak workspace focus.',
    descriptionFa: 'طراحی کامپکت و ارگونومیک سازگار با آناتومی مچ دست، اسکرول مغناطیسی فوق‌سریع و کلیک‌های سایلنت ۹۰٪ بی‌صدا برای تمرکز بالا در محیط کار.',
    specs: {
      'دقت سنسور': 'سنسور لیزری اپتیکال با دقت تا ۸۰۰۰ DPI قابل تنظیم',
      'شارژدهی': 'تا ۷۰ روز با یک بار شارژ کامل تایپ C',
      'قابلیت اتصال': 'بلوتوث + دانگل Bolt با پشتیبانی از ۳ سیستم همزمان',
      'اسکرول': 'چرخ اسکرول فلزی الکترومغناطیسی با چرخش ۱۰۰۰ خط در ثانیه'
    },
    features: [
      'Dual thumb and primary scroll wheels',
      '90% noise reduction silent switches',
      'Customizable gesture button for productivity',
      'Works seamlessly on all surfaces including glass'
    ],
    featuresFa: [
      'اسکرول افقی اختصاصی انگشت شست برای اکسل و تایم‌لاین ادیت',
      'کلیدهای کاملاً سایلنت با فیدبک لمسی مطمئن و نرم',
      'پشتیبانی از ژست‌های حرکتی برای جابجایی بین دسکتاپ‌ها و نرم‌افزارها',
      'قابلیت کار روی سطوح مختلف حتی شیشه شفاف'
    ],
    tags: ['Mouse', 'Ergonomic', 'Wireless', 'Productivity']
  },
  {
    id: 'lum-08',
    name: 'Aura Spatial True Wireless Earbuds',
    nameFa: 'هندزفری بی‌سیم لومینا آئورا با صدای سه‌بعدی',
    brand: 'Lumina Sound',
    category: 'audio',
    categoryFa: 'سیستم‌های صوتی و هدفون',
    rating: 4.7,
    reviewsCount: 168,
    price: 7900000,
    priceUSD: 135,
    originalPrice: 9900000,
    originalPriceUSD: 165,
    discountPercent: 20,
    isFlashSale: true,
    flashSaleEndsAt: Date.now() + 1000 * 60 * 60 * 14 + 1000 * 60 * 32,
    stock: 11,
    soldCount: 110,
    featured: true,
    images: [
      '/images/products/photo-1590658268037-6bf12165a8df.jpg',
      '/images/products/photo-1572536147248-ac59a8abfa4b.jpg',
      '/images/products/photo-1606220588913-b3aacb4d2f46.jpg'
    ],
    description: 'Dynamic spatial audio head-tracking, ultra-low latency game mode, and adaptive silicone ear tips for all-day featherweight comfort.',
    descriptionFa: 'پشتیبانی از صدای سه‌بعدی Spatial Audio با ردیابی حرکات سر، مود گیمینگ با کمترین تاخیر و کیس شارژ بی‌سیم مجهز به شارژ سریع.',
    specs: {
      'شارژدهی کلی': '۳۲ ساعت (۸ ساعت ایرباد + ۲۴ ساعت کیس)',
      'استاندارد مقاومت': 'IPX5 مقاوم در برابر پاشش آب و تعریق ورزشی',
      'میکروفون': '۶ میکروفون با تکنولوژی هوش مصنوعی حذف صدای باد',
      'وزن هر گوشی': 'تنها ۴.۲ گرم'
    },
    features: [
      'Spatial 360-degree audio with head tracking',
      'Wireless Qi-compatible charging case',
      'Instant touch controls with haptic feedback',
      'Custom EQ mobile companion application'
    ],
    featuresFa: [
      'ردیابی سر و شبیه‌سازی فضای صدای سینمایی سه‌بعدی',
      'پشتیبانی کیس از شارژ وایرلس استاندارد Qi و پورت Type-C',
      'کنترل‌های لمسی دقیق با بازخورد لرزشی خفیف',
      'دارای سری‌های سیلیکونی ضدحساسیت در ۴ سایز مختلف'
    ],
    tags: ['Earbuds', 'ANC', 'SpatialAudio', 'Audio']
  },
  {
    id: 'lum-09',
    name: 'Lumina Heavyweight Minimal Oversized Tee',
    nameFa: 'تیشرت اورسایز نخ پنبه سنگین لومینا استودیو',
    brand: 'Lumina Wear',
    category: 'apparel',
    categoryFa: 'پوشاک و مد',
    rating: 4.9,
    reviewsCount: 88,
    price: 890000,
    priceUSD: 16,
    originalPrice: 1100000,
    originalPriceUSD: 19,
    discountPercent: 19,
    stock: 35,
    soldCount: 164,
    featured: true,
    rank: 2,
    images: [
      '/images/products/photo-1521572267360-ee0c2909d518.jpg',
      '/images/products/photo-1581655353564-df123a1eb820.jpg',
      '/images/products/photo-1583743814966-8936f5b7be1a.jpg',
      '/images/products/photo-1618354691373-d851c5c3a990.jpg'
    ],
    description: '100% premium combed organic cotton (280 GSM), custom drop-shoulder silhouette, reinforced ribbed collar, pre-shrunk minimal aesthetic.',
    descriptionFa: '۱۰۰٪ نخ پنبه ارگانیک شانه شده با گرماژ سنگین ۲۸۰ گرم، الگو و قواره اورسایز با سرشانه افتاده (Drop-shoulder)، یقه کشباف مقاوم ضد دفرمه شدن و رنگرزی راکتیو بدون پرزدهی.',
    specs: {
      'جنس پارچه': '۱۰۰٪ نخ پنبه سوپر ارگانیک ۲۸۰ GSM',
      'نوع برش و فیت': 'اورسایز (Oversized Boxy Fit)',
      'نوع یقه': 'گرد کشباف ضخیم ۳ سانتی‌متری',
      'شستشو': 'ماشین لباسشویی ۳۰ درجه با مایع ملایم، بدون آب‌رفت'
    },
    features: [
      'Heavyweight 280 GSM premium organic cotton',
      'Durable double-stitched reinforced collar',
      'Pre-shrunk fabric wash preventing shrinkage',
      'Minimalist tone-on-tone embroidery detail'
    ],
    featuresFa: [
      'پارچه فوق‌العاده باکیفیت و ضخیم با ایستایی شکیل و مدرن',
      'دوخت دوبل مقاوم در درزهای سرشانه و پایین لباس',
      'فرآیند پیش‌شستشو ضد آبرفت و رنگ‌رفتگی',
      'تنفس‌پذیری فوق‌العاده بالا و ضد حساسیت پوستی'
    ],
    tags: ['Apparel', 'Oversized', 'Streetwear', 'OrganicCotton'],
    variantType: 'color_size',
    colors: [
      {
        id: 'c-blk',
        name: 'مشکی',
        hex: '#18181b',
        image: '/images/products/photo-1521572267360-ee0c2909d518.jpg',
        stock: 13,
        active: true
      },
      {
        id: 'c-wht',
        name: 'سفید صدفی',
        hex: '#f8fafc',
        image: '/images/products/photo-1581655353564-df123a1eb820.jpg',
        stock: 11,
        active: true
      },
      {
        id: 'c-crm',
        name: 'کرم نود',
        hex: '#e2d5c3',
        image: '/images/products/photo-1583743814966-8936f5b7be1a.jpg',
        stock: 9,
        active: true
      },
      {
        id: 'c-blu',
        name: 'سرمه‌ای اقیانوسی',
        hex: '#1e3a8a',
        image: '/images/products/photo-1618354691373-d851c5c3a990.jpg',
        stock: 7,
        active: true
      },
      {
        id: 'c-red',
        name: 'زرشکی مات',
        hex: '#881337',
        image: '/images/products/photo-1503342217505-b0a15ec3261c.jpg',
        stock: 5,
        active: true
      }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    variants: [
      // Black combinations
      { id: 'v-tee-blk-xs', sku: 'LUM-TEE-BLK-XS', colorName: 'مشکی', colorHex: '#18181b', size: 'XS', stock: 2, price: 890000, active: true, image: '/images/products/photo-1521572267360-ee0c2909d518.jpg' },
      { id: 'v-tee-blk-s',  sku: 'LUM-TEE-BLK-S',  colorName: 'مشکی', colorHex: '#18181b', size: 'S',  stock: 4, price: 890000, active: true, image: '/images/products/photo-1521572267360-ee0c2909d518.jpg' },
      { id: 'v-tee-blk-m',  sku: 'LUM-TEE-BLK-M',  colorName: 'مشکی', colorHex: '#18181b', size: 'M',  stock: 8, price: 890000, active: true, image: '/images/products/photo-1521572267360-ee0c2909d518.jpg' },
      { id: 'v-tee-blk-l',  sku: 'LUM-TEE-BLK-L',  colorName: 'مشکی', colorHex: '#18181b', size: 'L',  stock: 5, price: 890000, active: true, image: '/images/products/photo-1521572267360-ee0c2909d518.jpg' },
      { id: 'v-tee-blk-xl', sku: 'LUM-TEE-BLK-XL', colorName: 'مشکی', colorHex: '#18181b', size: 'XL', stock: 0, price: 890000, active: true, image: '/images/products/photo-1521572267360-ee0c2909d518.jpg' },
      { id: 'v-tee-blk-xxl',sku: 'LUM-TEE-BLK-2XL',colorName: 'مشکی', colorHex: '#18181b', size: 'XXL', stock: 0, price: 890000, active: true, image: '/images/products/photo-1521572267360-ee0c2909d518.jpg' },

      // White combinations
      { id: 'v-tee-wht-xs', sku: 'LUM-TEE-WHT-XS', colorName: 'سفید صدفی', colorHex: '#f8fafc', size: 'XS', stock: 0, price: 890000, active: true, image: '/images/products/photo-1581655353564-df123a1eb820.jpg' },
      { id: 'v-tee-wht-s',  sku: 'LUM-TEE-WHT-S',  colorName: 'سفید صدفی', colorHex: '#f8fafc', size: 'S',  stock: 3, price: 890000, active: true, image: '/images/products/photo-1581655353564-df123a1eb820.jpg' },
      { id: 'v-tee-wht-m',  sku: 'LUM-TEE-WHT-M',  colorName: 'سفید صدفی', colorHex: '#f8fafc', size: 'M',  stock: 7, price: 890000, active: true, image: '/images/products/photo-1581655353564-df123a1eb820.jpg' },
      { id: 'v-tee-wht-l',  sku: 'LUM-TEE-WHT-L',  colorName: 'سفید صدفی', colorHex: '#f8fafc', size: 'L',  stock: 4, price: 890000, active: true, image: '/images/products/photo-1581655353564-df123a1eb820.jpg' },
      { id: 'v-tee-wht-xl', sku: 'LUM-TEE-WHT-XL', colorName: 'سفید صدفی', colorHex: '#f8fafc', size: 'XL', stock: 0, price: 890000, active: true, image: '/images/products/photo-1581655353564-df123a1eb820.jpg' },
      { id: 'v-tee-wht-xxl',sku: 'LUM-TEE-WHT-2XL',colorName: 'سفید صدفی', colorHex: '#f8fafc', size: 'XXL', stock: 0, price: 890000, active: true, image: '/images/products/photo-1581655353564-df123a1eb820.jpg' },

      // Cream combinations
      { id: 'v-tee-crm-xs', sku: 'LUM-TEE-CRM-XS', colorName: 'کرم نود', colorHex: '#e2d5c3', size: 'XS', stock: 0, price: 890000, active: true, image: '/images/products/photo-1583743814966-8936f5b7be1a.jpg' },
      { id: 'v-tee-crm-s',  sku: 'LUM-TEE-CRM-S',  colorName: 'کرم نود', colorHex: '#e2d5c3', size: 'S',  stock: 3, price: 890000, active: true, image: '/images/products/photo-1583743814966-8936f5b7be1a.jpg' },
      { id: 'v-tee-crm-m',  sku: 'LUM-TEE-CRM-M',  colorName: 'کرم نود', colorHex: '#e2d5c3', size: 'M',  stock: 6, price: 890000, active: true, image: '/images/products/photo-1583743814966-8936f5b7be1a.jpg' },
      { id: 'v-tee-crm-l',  sku: 'LUM-TEE-CRM-L',  colorName: 'کرم نود', colorHex: '#e2d5c3', size: 'L',  stock: 0, price: 890000, active: true, image: '/images/products/photo-1583743814966-8936f5b7be1a.jpg' },
      { id: 'v-tee-crm-xl', sku: 'LUM-TEE-CRM-XL', colorName: 'کرم نود', colorHex: '#e2d5c3', size: 'XL', stock: 0, price: 890000, active: true, image: '/images/products/photo-1583743814966-8936f5b7be1a.jpg' },

      // Navy combinations
      { id: 'v-tee-blu-s',  sku: 'LUM-TEE-BLU-S',  colorName: 'سرمه‌ای اقیانوسی', colorHex: '#1e3a8a', size: 'S',  stock: 2, price: 890000, active: true, image: '/images/products/photo-1618354691373-d851c5c3a990.jpg' },
      { id: 'v-tee-blu-m',  sku: 'LUM-TEE-BLU-M',  colorName: 'سرمه‌ای اقیانوسی', colorHex: '#1e3a8a', size: 'M',  stock: 5, price: 890000, active: true, image: '/images/products/photo-1618354691373-d851c5c3a990.jpg' },
      { id: 'v-tee-blu-l',  sku: 'LUM-TEE-BLU-L',  colorName: 'سرمه‌ای اقیانوسی', colorHex: '#1e3a8a', size: 'L',  stock: 2, price: 890000, active: true, image: '/images/products/photo-1618354691373-d851c5c3a990.jpg' },
      { id: 'v-tee-blu-xl', sku: 'LUM-TEE-BLU-XL', colorName: 'سرمه‌ای اقیانوسی', colorHex: '#1e3a8a', size: 'XL', stock: 0, price: 890000, active: true, image: '/images/products/photo-1618354691373-d851c5c3a990.jpg' },

      // Maroon combinations
      { id: 'v-tee-red-s',  sku: 'LUM-TEE-RED-S',  colorName: 'زرشکی مات', colorHex: '#881337', size: 'S',  stock: 0, price: 890000, active: true, image: '/images/products/photo-1503342217505-b0a15ec3261c.jpg' },
      { id: 'v-tee-red-m',  sku: 'LUM-TEE-RED-M',  colorName: 'زرشکی مات', colorHex: '#881337', size: 'M',  stock: 4, price: 890000, active: true, image: '/images/products/photo-1503342217505-b0a15ec3261c.jpg' },
      { id: 'v-tee-red-l',  sku: 'LUM-TEE-RED-L',  colorName: 'زرشکی مات', colorHex: '#881337', size: 'L',  stock: 1, price: 890000, active: true, image: '/images/products/photo-1503342217505-b0a15ec3261c.jpg' },
      { id: 'v-tee-red-xl', sku: 'LUM-TEE-RED-XL', colorName: 'زرشکی مات', colorHex: '#881337', size: 'XL', stock: 0, price: 890000, active: true, image: '/images/products/photo-1503342217505-b0a15ec3261c.jpg' }
    ]
  },
  {
    id: 'lum-10',
    name: 'Lumina Tech-Fleece Minimalist Zip Hoodie',
    nameFa: 'هودی زیپ‌دار پشمی لومینا استودیو',
    brand: 'Lumina Wear',
    category: 'apparel',
    categoryFa: 'پوشاک و مد',
    rating: 4.8,
    reviewsCount: 54,
    price: 1850000,
    priceUSD: 31,
    originalPrice: 2200000,
    originalPriceUSD: 37,
    discountPercent: 16,
    stock: 22,
    soldCount: 97,
    featured: false,
    rank: 8,
    images: [
      '/images/products/photo-1556905055-8f358a7a47b2.jpg',
      '/images/products/photo-1578587018452-892bacefd3f2.jpg',
      '/images/products/photo-1509967419530-da38b4704bc6.jpg'
    ],
    description: 'Ultra-dense double-faced thermal fleece (360 GSM), YKK matte two-way zipper, ergonomic raglan sleeves, wind-resistant double-layered hood.',
    descriptionFa: 'پشم فلیس دولایه متراکم ۳۶۰ گرم با عایق گرمایی بالا، زیپ دوطرفه فلزی مات اورجینال YKK، دوخت رگلان آزادی حرکت بالا و کلاه دوجداره ضد باد با استایل مدرن مینیمال.',
    specs: {
      'جنس پارچه': 'فلیس دو رو پنبه-پلی‌استر گرم ۳۶۰ GSM',
      'نوع زیپ': 'زیپ مات YKK دوطرفه ضد گیر کردن',
      'جیب‌ها': 'دو جیب کانگورویی مخفی با آستر گرم پلار',
      'کلاه': 'کلاه دو جداره عمیق با بند تنظیم مخفی'
    },
    features: [
      'Double-sided insulated tech fleece',
      'Matte black Japanese YKK two-way zipper',
      'Ergonomic raglan cut for free mobility',
      'Concealed zippered valuables pocket'
    ],
    featuresFa: [
      'پارچه فلیس دوجداره بدون پرزدهی با حفظ گرمای فوق‌العاده',
      'سرآستین‌ها و لبه کشباف ضخیم مقاوم در برابر شل شدن',
      'برش ارگونومیک رگلان مناسب استایل روزمره و فعالیت شهری',
      'رنگ‌های مینیمال خنثی هماهنگ با انواع پوشش'
    ],
    tags: ['Apparel', 'Hoodie', 'Fleece', 'WinterWear'],
    variantType: 'color_size',
    colors: [
      { id: 'c-charcoal', name: 'زغالی مات', hex: '#27272a', image: '/images/products/photo-1556905055-8f358a7a47b2.jpg', stock: 10, active: true },
      { id: 'c-melange', name: 'طوسی ملانژ', hex: '#64748b', image: '/images/products/photo-1578587018452-892bacefd3f2.jpg', stock: 8, active: true },
      { id: 'c-olive', name: 'سبز زیتونی', hex: '#3f6212', image: '/images/products/photo-1509967419530-da38b4704bc6.jpg', stock: 4, active: true }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    variants: [
      { id: 'v-hood-chr-s', sku: 'LUM-HOD-CHR-S', colorName: 'زغالی مات', colorHex: '#27272a', size: 'S', stock: 3, price: 1850000, active: true, image: '/images/products/photo-1556905055-8f358a7a47b2.jpg' },
      { id: 'v-hood-chr-m', sku: 'LUM-HOD-CHR-M', colorName: 'زغالی مات', colorHex: '#27272a', size: 'M', stock: 4, price: 1850000, active: true, image: '/images/products/photo-1556905055-8f358a7a47b2.jpg' },
      { id: 'v-hood-chr-l', sku: 'LUM-HOD-CHR-L', colorName: 'زغالی مات', colorHex: '#27272a', size: 'L', stock: 3, price: 1850000, active: true, image: '/images/products/photo-1556905055-8f358a7a47b2.jpg' },
      { id: 'v-hood-chr-xl', sku: 'LUM-HOD-CHR-XL', colorName: 'زغالی مات', colorHex: '#27272a', size: 'XL', stock: 0, price: 1850000, active: true, image: '/images/products/photo-1556905055-8f358a7a47b2.jpg' },
      { id: 'v-hood-chr-2xl', sku: 'LUM-HOD-CHR-2XL', colorName: 'زغالی مات', colorHex: '#27272a', size: 'XXL', stock: 2, price: 1950000, originalPrice: 2300000, active: true, image: '/images/products/photo-1556905055-8f358a7a47b2.jpg' },

      { id: 'v-hood-mel-s', sku: 'LUM-HOD-MEL-S', colorName: 'طوسی ملانژ', colorHex: '#64748b', size: 'S', stock: 2, price: 1850000, active: true, image: '/images/products/photo-1578587018452-892bacefd3f2.jpg' },
      { id: 'v-hood-mel-m', sku: 'LUM-HOD-MEL-M', colorName: 'طوسی ملانژ', colorHex: '#64748b', size: 'M', stock: 3, price: 1850000, active: true, image: '/images/products/photo-1578587018452-892bacefd3f2.jpg' },
      { id: 'v-hood-mel-l', sku: 'LUM-HOD-MEL-L', colorName: 'طوسی ملانژ', colorHex: '#64748b', size: 'L', stock: 3, price: 1850000, active: true, image: '/images/products/photo-1578587018452-892bacefd3f2.jpg' },
      { id: 'v-hood-mel-xl', sku: 'LUM-HOD-MEL-XL', colorName: 'طوسی ملانژ', colorHex: '#64748b', size: 'XL', stock: 0, price: 1850000, active: true, image: '/images/products/photo-1578587018452-892bacefd3f2.jpg' },

      { id: 'v-hood-olv-m', sku: 'LUM-HOD-OLV-M', colorName: 'سبز زیتونی', colorHex: '#3f6212', size: 'M', stock: 2, price: 1850000, active: true, image: '/images/products/photo-1509967419530-da38b4704bc6.jpg' },
      { id: 'v-hood-olv-l', sku: 'LUM-HOD-OLV-L', colorName: 'سبز زیتونی', colorHex: '#3f6212', size: 'L', stock: 2, price: 1850000, active: true, image: '/images/products/photo-1509967419530-da38b4704bc6.jpg' }
    ]
  },
  {
    id: 'lum-11',
    name: 'Lumina Relaxed Cotton Chino Pants',
    nameFa: 'شلوار کتان راسته ارگونومیک لومینا',
    brand: 'Lumina Wear',
    category: 'apparel',
    categoryFa: 'پوشاک و مد',
    rating: 4.7,
    reviewsCount: 42,
    price: 1350000,
    priceUSD: 23,
    originalPrice: 1600000,
    originalPriceUSD: 27,
    discountPercent: 15,
    stock: 24,
    soldCount: 78,
    featured: false,
    rank: 9,
    images: [
      '/images/products/photo-1624378439575-d8705ad7ae80.jpg',
      '/images/products/photo-1473966968600-fa801b869a1a.jpg'
    ],
    description: 'Cotton twill with 2% elastane for flexible movement, tailored straight-leg fit, durable reinforced pockets, and anti-crease wash finish.',
    descriptionFa: 'کتان توییل با ۲ درصد الیاف الاستان برای راحتی و انعطاف بالا، فیت راسته استاندارد، دکمه‌های بیورزین مقاوم، جیب‌های تقویت‌شده و فرآیند شستشوی ضد چروک.',
    specs: {
      'جنس پارچه': '۹۸٪ کتان شانه شده + ۲٪ الاستان کشسان',
      'نوع برش': 'راسته استاندارد (Straight Fit)',
      'سایزبندی': 'سایزهای استاندارد عددی (۳۸ تا ۴۶)',
      'شستشو': 'شستشوی ملایم در آب سرد، اتوکشی با حرارت متوسط'
    },
    features: [
      'Premium stretch cotton twill blend',
      'Comfort-waistband with clean internal finish',
      'Deep reinforced slash pockets',
      'Pre-washed garment dyed texture'
    ],
    featuresFa: [
      'پارچه کتان بسیار لطیف و بادوام با خاصیت کشسانی ملایم',
      'طراحی مینیمال و مناسب برای استایل روزمره، کاری و کژوال',
      'سایزبندی دقیق و مطابق استانداردهای فیت بین‌المللی',
      'دارای دو جیب پشتی فیلتو با دکمه مخفی'
    ],
    tags: ['Apparel', 'Pants', 'Chino', 'Casual'],
    variantType: 'color_size',
    colors: [
      { id: 'c-ch-blk', name: 'مشکی', hex: '#18181b', image: '/images/products/photo-1624378439575-d8705ad7ae80.jpg', stock: 12, active: true },
      { id: 'c-ch-crm', name: 'خاکی کرم', hex: '#d4b996', image: '/images/products/photo-1473966968600-fa801b869a1a.jpg', stock: 8, active: true },
      { id: 'c-ch-grn', name: 'دودی ملایم', hex: '#475569', image: '/images/products/photo-1624378439575-d8705ad7ae80.jpg', stock: 4, active: true }
    ],
    sizes: ['38', '40', '42', '44', '46'],
    variants: [
      { id: 'v-pnt-blk-38', sku: 'LUM-PNT-BLK-38', colorName: 'مشکی', colorHex: '#18181b', size: '38', stock: 3, price: 1350000, active: true },
      { id: 'v-pnt-blk-40', sku: 'LUM-PNT-BLK-40', colorName: 'مشکی', colorHex: '#18181b', size: '40', stock: 4, price: 1350000, active: true },
      { id: 'v-pnt-blk-42', sku: 'LUM-PNT-BLK-42', colorName: 'مشکی', colorHex: '#18181b', size: '42', stock: 3, price: 1350000, active: true },
      { id: 'v-pnt-blk-44', sku: 'LUM-PNT-BLK-44', colorName: 'مشکی', colorHex: '#18181b', size: '44', stock: 2, price: 1350000, active: true },
      { id: 'v-pnt-blk-46', sku: 'LUM-PNT-BLK-46', colorName: 'مشکی', colorHex: '#18181b', size: '46', stock: 0, price: 1350000, active: true },

      { id: 'v-pnt-crm-38', sku: 'LUM-PNT-CRM-38', colorName: 'خاکی کرم', colorHex: '#d4b996', size: '38', stock: 2, price: 1350000, active: true },
      { id: 'v-pnt-crm-40', sku: 'LUM-PNT-CRM-40', colorName: 'خاکی کرم', colorHex: '#d4b996', size: '40', stock: 3, price: 1350000, active: true },
      { id: 'v-pnt-crm-42', sku: 'LUM-PNT-CRM-42', colorName: 'خاکی کرم', colorHex: '#d4b996', size: '42', stock: 3, price: 1350000, active: true },
      { id: 'v-pnt-crm-44', sku: 'LUM-PNT-CRM-44', colorName: 'خاکی کرم', colorHex: '#d4b996', size: '44', stock: 0, price: 1350000, active: true },

      { id: 'v-pnt-grn-40', sku: 'LUM-PNT-GRN-40', colorName: 'دودی ملایم', colorHex: '#475569', size: '40', stock: 2, price: 1350000, active: true },
      { id: 'v-pnt-grn-42', sku: 'LUM-PNT-GRN-42', colorName: 'دودی ملایم', colorHex: '#475569', size: '42', stock: 2, price: 1350000, active: true }
    ]
  }
];

export const REVIEWS = [
  {
    id: 'rev-1',
    userName: 'علیرضا راد',
    userAvatar: '/images/products/photo-1534528741775-53994a69daeb.jpg',
    rating: 5,
    date: '۲ روز پیش',
    comment: 'کیفیت ساخت و تفکیک صدای این هدفون شگفت‌انگیزه! بسته‌بندی در حد محصولات اپل بود و خیلی سریع به دستم رسید.',
    verified: true
  },
  {
    id: 'rev-2',
    userName: 'سارا تهرانی',
    userAvatar: '/images/products/photo-1494790108377-be9c29b29330.jpg',
    rating: 5,
    date: 'هفته گذشته',
    comment: 'رنگ و متریال چرم کیف دقیقاً مثل عکس‌هاست و بوی چرم طبیعی میده. پشتیبانی فروشگاه هم در پاسخگویی عالی بود.',
    verified: true
  },
  {
    id: 'rev-3',
    userName: 'محمد کاظمی',
    userAvatar: '/images/products/photo-1507003211169-0a1dd7228f2d.jpg',
    rating: 4,
    date: '۳ روز پیش',
    comment: 'کیبورد صدای فوق‌العاده نرم و ارضاکننده‌ای داره. بدون هیچ لگی با مک و ویندوز سوییچ میکنه. کاملاً راضی‌ام.',
    verified: true
  }
];
