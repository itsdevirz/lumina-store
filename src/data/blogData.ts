export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  content: string;
  coverImage: string;
  category: string;
  categoryFa: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  views: number;
  featured?: boolean;
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'best-anc-headphones-guide-2026',
    title: 'راهنمای جامع خرید بهترین هدفون‌های بی‌سیم با حذف نویز فعال (ANC)',
    titleEn: 'Ultimate Guide to Best Noise-Cancelling Headphones (2026)',
    excerpt: 'بررسی فاکتورهای کلیدی در انتخاب هدفون مانیتورینگ و بی‌سیم: کیفیت تفکیک صدا، راحتی پدهای ارگونومیک، دوام باتری و کدک‌های صوتی Hi-Res LDAC.',
    content: `هدفون‌های دارای فناوری حذف نویز فعال (ANC) در سال‌های اخیر از یک محصول لوکس به ابزاری ضروری برای متخصصان، تولیدکنندگان محتوا و علاقه‌مندان به موسیقی تبدیل شده‌اند.

هنگام خرید هدفون بی‌سیم پرچمدار، توجه به فاکتورهای زیر حیاتی است:
۱. سیستم میکروفون‌های هیبریدی داخلی و خارجی برای مهار نویز محیطی تا ۹۸٪
۲. درایورهای پوشش داده شده با تیتانیوم برای بازتولید فرکانس‌های بم دقیق و شفافیت صدا در محدوده زیر
۳. پشتیبانی از کدک‌های صوتی با وضوح بالا مانند LDAC و aptX Adaptive
۴. شارژدهی حداقل ۳۰ تا ۴۰ ساعت با یک بار شارژ کامل و پشتیبانی از شارژ سریع تایپ C.`,
    coverImage: '/images/products/photo-1505740420928-5e560c06d30e.jpg',
    category: 'audio',
    categoryFa: 'صوتی و موسیقی',
    author: {
      name: 'مهندس نوید راد',
      role: 'کارشناس ارشد آکوستیک و صوت',
      avatar: '/images/products/photo-1534528741775-53994a69daeb.jpg'
    },
    date: '۲۵ شهریور ۱۴۰۴',
    readTime: '۶ دقیقه مطالعه',
    views: 1420,
    featured: true,
    tags: ['هدفون', 'صدا', 'ANC', 'تکنولوژی']
  },
  {
    id: 'blog-2',
    slug: 'mechanical-keyboards-switches-guide',
    title: 'راهنمای انتخاب کیبورد مکانیکال: تفاوت سوئیچ‌های خطی، لمسی و کلیکی',
    titleEn: 'Mechanical Keyboards Guide: Linear vs Tactile vs Clicky Switches',
    excerpt: 'کدام سوئیچ مکانیکال برای برنامه‌نویسی، تایپ طولانی‌مدت و گیمینگ مناسب‌تر است؟ بررسی ساختار گسکت‌مانت و کلیدهای PBT دابل‌شات.',
    content: `کیبوردهای مکانیکال مدرن به دلیل حس تایپ دقیق، صدای رضایت‌بخش و دوام فوق‌العاده بالا، به ابزار شماره یک برنامه‌نویسان و طراحان تبدیل شده‌اند.

انواع سوئیچ‌های اصلی:
- سوئیچ‌های خطی (Linear/Red): حرکتی روان و بی‌صدا، ایده‌آل برای محیط‌های اداری و استریم.
- سوئیچ‌های لمسی (Tactile/Brown): دارای یک برآمدگی حسی ملایم در نقطه فعال‌سازی که بازخورد عالی برای تایپیست‌ها ارائه می‌دهد.
- ساختار Gasket Mount با فوم Poron داخلی که ضربه و لرزش را جذب کرده و صدای عمیق و اصیل ایجاد می‌کند.`,
    coverImage: '/images/products/photo-1587829741301-dc798b83add3.jpg',
    category: 'workspace',
    categoryFa: 'تجهیزات محیط کار',
    author: {
      name: 'سارا امینی',
      role: 'طراح تجربه کاربری و ستاپ',
      avatar: '/images/products/photo-1494790108377-be9c29b29330.jpg'
    },
    date: '۱۸ شهریور ۱۴۰۴',
    readTime: '۸ دقیقه مطالعه',
    views: 2180,
    featured: false,
    tags: ['کیبورد', 'ارگونومی', 'محیط کار', 'سخت‌افزار']
  },
  {
    id: 'blog-3',
    slug: 'ergonomic-workspace-setup-principles',
    title: 'اصول چیدمان ارگونومیک میز کار برای افزایش تمرکز و جلوگیری از خستگی',
    titleEn: 'Ergonomic Desk Setup: Maximizing Focus & Health',
    excerpt: 'چگونه با تنظیم صحیح ارتفاع مانیتور، استفاده از نورپردازی ۲۷۰۰K بدون لرزش و پدهای چرمی، راندمان کاری خود را تا دو برابر ارتقا دهیم.',
    content: `ساعت‌های طولانی کار پشت میز نیازمند طراحی دقیق فضا است تا سلامت ستون فقرات و چشمان شما حفظ شود.

اصول طلایی ارگونومی:
۱. لبه بالایی مانیتور باید هم‌سطح خط چشم قرار گیرد تا گردن در زاویه طبیعی بماند.
۲. استفاده از لامپ‌های مانیتوربار (ScreenBar) با شاخص CRI بالای ۹۵ برای کاهش خستگی چشم در کار شبانه.
۳. انتخاب ماوس‌های عمودی یا ارگونومیک با سنسور دقیق جهت جلوگیری از سندروم تونل کارپال.
۴. استفاده از متریال‌های طبیعی مثل چوب گردو و چرم گاوی دباغی گیاهی که حس آرامش به محیط کار می‌بخشند.`,
    coverImage: '/images/products/photo-1527864550417-7fd91fc51a46.jpg',
    category: 'home-design',
    categoryFa: 'دکوراسیون و نور',
    author: {
      name: 'آرش کیانی',
      role: 'مشاور طراحی داخلی دفاتر مدرن',
      avatar: '/images/products/photo-1507003211169-0a1dd7228f2d.jpg'
    },
    date: '۱۰ شهریور ۱۴۰۴',
    readTime: '۵ دقیقه مطالعه',
    views: 980,
    featured: false,
    tags: ['میز کار', 'نورپردازی', 'سلامت', 'دکوراسیون']
  },
  {
    id: 'blog-4',
    slug: 'smartwatches-titanium-health-sensors-2026',
    title: 'بررسی ساعت‌های هوشمند تیتانیومی: سنسورهای پایش سلامت و عمر باتری',
    titleEn: 'Titanium Smartwatches: Health Tracking and Battery Life',
    excerpt: 'مقایسه دقت سنسورهای اپتیکال نسل جدید، مقاومت شیشه سافایر در برابر خط و خش و الگوریتم‌های هوش مصنوعی در پایش خواب عمیق.',
    content: `ساعت‌های هوشمند امروزی فراتر از یک نمایشگر نوتیفیکیشن هستند و به دستیار جامع سلامتی و ورزش تبدیل شده‌اند.

ویژگی‌های برجسته پرچمداران:
- بدنه تیتانیوم گرید هوافضا که علاوه بر وزن بسیار سبک، بالاترین مقاومت را در برابر ضربه و خوردگی دارد.
- شیشه یاقوت کبود (Sapphire Crystal) با درجه سختی ۹ موهس که عملاً ضدخش است.
- سنسورهای بیومتریک چندکاناله با قابلیت ثبت نوار قلب (ECG)، سنجش اکسیژن خون (SpO2) و بررسی دمای سطح پوست.
- حالت‌های ذخیره انرژی هوشمند با عمر باتری تا ۱۴ روز بدون نیاز به شارژ روزانه.`,
    coverImage: '/images/products/photo-1523275335684-37898b6baf30.jpg',
    category: 'smart-wear',
    categoryFa: 'ساعت و گجت پوشیدنی',
    author: {
      name: 'دکتر هومن صابری',
      role: 'متخصص سلامت دیجیتال و گجت‌ها',
      avatar: '/images/products/photo-1500648767791-00dcc994a43e.jpg'
    },
    date: '۰۲ شهریور ۱۴۰۴',
    readTime: '۷ دقیقه مطالعه',
    views: 3100,
    featured: true,
    tags: ['ساعت هوشمند', 'سلامتی', 'تیتانیوم', 'ورزش']
  }
];
