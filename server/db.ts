import fs from 'fs';
import path from 'path';
import { Product, Category, Festival, FestivalProduct, FestivalCoupon, ProductReview, ReviewStats } from '../src/types';
import {
  DashboardStats,
  ChartDataPoint,
  BestsellerItem,
  MostViewedItem,
  UserBehaviorData,
  Coupon,
  AdminNotification,
  TimeRange
} from '../src/types/admin';
import {
  ProductAnalyticsTimeRange,
  ProductAnalyticsEventType,
  ProductAnalyticsEvent,
  ProductFavoriteRecord,
  ProductAnalyticsChartPoint,
  ProductVariantStat,
  ProductCategoryBenchmark,
  ProductShareOfStore,
  ProductAnalyticsSummary,
  ProductPublicSocialStats
} from '../src/types/analytics';
import { PRODUCTS, CATEGORIES } from '../src/data/products';
import { SupportSession, SupportMessage } from '../src/types/support';

const DB_FILE = path.join(process.cwd(), 'server_store_db.json');

// Interface for persisted database
export interface StoreDatabase {
  products: (Product & {
    isActive: boolean;
    sku: string;
    views: number;
    cartAdds: number;
    createdAt: string;
  })[];
  categories: Category[];
  orders: any[];
  users: any[];
  coupons: Coupon[];
  festivals: Festival[];
  reviews: ProductReview[];
  notifications: AdminNotification[];
  dailyVisits: number;
  weeklyVisits: number;
  monthlyVisits: number;
  agentOnline?: boolean;
  supportSessions?: SupportSession[];
  productEvents?: ProductAnalyticsEvent[];
  favorites?: ProductFavoriteRecord[];
  productShares?: { productId: string; timestamp: number; platform?: string; userId?: string }[];
}

export const defaultEnhancedCategories: Category[] = [
  {
    id: 'apparel',
    name: 'Apparel & Fashion',
    nameFa: 'پوشاک و مد',
    slug: 'apparel',
    icon: 'Shirt',
    image: '/images/products/photo-1521572267360-ee0c2909d518.jpg',
    description: 'کالکشن لباس‌های مینیمال، راحت و باکیفیت طراحی لومینا',
    parentId: null,
    isActive: true,
    sortOrder: 1,
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'apparel-men',
    name: "Men's Clothing",
    nameFa: 'پوشاک مردانه',
    slug: 'apparel-men',
    icon: 'Shirt',
    image: '/images/products/photo-1617137984095-74e4e5e3613f.jpg',
    description: 'انواع تیشرت، پیراهن، شلوار و هودی‌های مدرن آقایان',
    parentId: 'apparel',
    isActive: true,
    sortOrder: 1,
    createdAt: '2026-01-10T10:05:00.000Z',
    updatedAt: '2026-01-10T10:05:00.000Z'
  },
  {
    id: 'apparel-men-tshirt',
    name: "Men's T-Shirts",
    nameFa: 'تیشرت و پولوشرت مردانه',
    slug: 'apparel-men-tshirt',
    icon: 'Shirt',
    image: '/images/products/photo-1521572267360-ee0c2909d518.jpg',
    description: 'تیشرت‌های کتان نخ پنبه سوپر ارگانیک با دوخت پریمیوم',
    parentId: 'apparel-men',
    isActive: true,
    sortOrder: 1,
    createdAt: '2026-01-10T10:10:00.000Z',
    updatedAt: '2026-01-10T10:10:00.000Z'
  },
  {
    id: 'apparel-men-pants',
    name: "Men's Pants",
    nameFa: 'شلوار و اسلش مردانه',
    slug: 'apparel-men-pants',
    icon: 'Shirt',
    image: '/images/products/photo-1624378439575-d8705ad7ae80.jpg',
    description: 'شلوارهای کژوال و اسلش‌های راحت با متریال باکیفیت',
    parentId: 'apparel-men',
    isActive: true,
    sortOrder: 2,
    createdAt: '2026-01-10T10:15:00.000Z',
    updatedAt: '2026-01-10T10:15:00.000Z'
  },
  {
    id: 'apparel-men-hoodie',
    name: "Men's Hoodies",
    nameFa: 'هودی و دورس مردانه',
    slug: 'apparel-men-hoodie',
    icon: 'Shirt',
    image: '/images/products/photo-1556905055-8f358a7a47b2.jpg',
    description: 'هودی‌های گرم سه‌نخ توکرکی با طراحی مینیمال',
    parentId: 'apparel-men',
    isActive: true,
    sortOrder: 3,
    createdAt: '2026-01-10T10:20:00.000Z',
    updatedAt: '2026-01-10T10:20:00.000Z'
  },
  {
    id: 'apparel-women',
    name: "Women's Clothing",
    nameFa: 'پوشاک زنانه',
    slug: 'apparel-women',
    icon: 'Shirt',
    image: '/images/products/photo-1515886657613-9f3515b0c78f.jpg',
    description: 'مانتو، شومیز، شلوار و پیراهن‌های ترند روز برای بانوان',
    parentId: 'apparel',
    isActive: true,
    sortOrder: 2,
    createdAt: '2026-01-10T10:25:00.000Z',
    updatedAt: '2026-01-10T10:25:00.000Z'
  },
  {
    id: 'apparel-women-manto',
    name: "Women's Overcoats & Mantos",
    nameFa: 'مانتو و پالتو زنانه',
    slug: 'apparel-women-manto',
    icon: 'Shirt',
    image: '/images/products/photo-1539571696357-5a69c17a67c6.jpg',
    description: 'مانتوهای مینیمال و عبایی با پارچه‌های طبیعی و لنین',
    parentId: 'apparel-women',
    isActive: true,
    sortOrder: 1,
    createdAt: '2026-01-10T10:30:00.000Z',
    updatedAt: '2026-01-10T10:30:00.000Z'
  },
  {
    id: 'apparel-women-shomiz',
    name: "Women's Blouses & Shirts",
    nameFa: 'شومیز و بلوز زنانه',
    slug: 'apparel-women-shomiz',
    icon: 'Shirt',
    image: '/images/products/photo-1564257631407-4deb1f99d992.jpg',
    description: 'شومیزهای مجلسی و روزمره با دوخت ظریف و شیک',
    parentId: 'apparel-women',
    isActive: true,
    sortOrder: 2,
    createdAt: '2026-01-10T10:35:00.000Z',
    updatedAt: '2026-01-10T10:35:00.000Z'
  },
  {
    id: 'apparel-women-pants',
    name: "Women's Pants",
    nameFa: 'شلوار زنانه',
    slug: 'apparel-women-pants',
    icon: 'Shirt',
    image: '/images/products/photo-1541099649105-f69ad21f3246.jpg',
    description: 'شلوارهای جین و پارچه‌ای راسته و بگ بانوان',
    parentId: 'apparel-women',
    isActive: true,
    sortOrder: 3,
    createdAt: '2026-01-10T10:40:00.000Z',
    updatedAt: '2026-01-10T10:40:00.000Z'
  },
  {
    id: 'apparel-kids',
    name: "Kids' Clothing",
    nameFa: 'پوشاک بچگانه',
    slug: 'apparel-kids',
    icon: 'Shirt',
    image: '/images/products/photo-1519457431-44ccd64a579b.jpg',
    description: 'لباس‌های راحت، لطیف و ضدحساسیت برای کودکان و نوجوانان',
    parentId: 'apparel',
    isActive: true,
    sortOrder: 3,
    createdAt: '2026-01-10T10:45:00.000Z',
    updatedAt: '2026-01-10T10:45:00.000Z'
  },
  {
    id: 'audio',
    name: 'Audio',
    nameFa: 'تجهیزات صوتی',
    slug: 'audio',
    icon: 'Headphones',
    image: '/images/products/photo-1505740420928-5e560c06d30e.jpg',
    description: 'هدفون‌ها، ایرپادها و اسپیکرهای بی‌سیم با کیفیت استودیو',
    parentId: null,
    isActive: true,
    sortOrder: 2,
    createdAt: '2026-01-10T10:50:00.000Z',
    updatedAt: '2026-01-10T10:50:00.000Z'
  },
  {
    id: 'audio-headphones',
    name: 'Headphones',
    nameFa: 'هدفون و ایرفون',
    slug: 'audio-headphones',
    icon: 'Headphones',
    image: '/images/products/photo-1505740420928-5e560c06d30e.jpg',
    description: 'هدفون‌های روگوشی نویزکنسلینگ و هندزفری‌های بی‌سیم TWS',
    parentId: 'audio',
    isActive: true,
    sortOrder: 1,
    createdAt: '2026-01-10T10:55:00.000Z',
    updatedAt: '2026-01-10T10:55:00.000Z'
  },
  {
    id: 'audio-speakers',
    name: 'Speakers',
    nameFa: 'اسپیکر و بلندگو',
    slug: 'audio-speakers',
    icon: 'Headphones',
    image: '/images/products/photo-1545454675-3531b543be5d.jpg',
    description: 'اسپیکرهای بلوتوثی پرتابل و سیستم‌های صوتی خانگی های‌فای',
    parentId: 'audio',
    isActive: true,
    sortOrder: 2,
    createdAt: '2026-01-10T11:00:00.000Z',
    updatedAt: '2026-01-10T11:00:00.000Z'
  },
  {
    id: 'workspace',
    name: 'Workspace',
    nameFa: 'میز کار و اداری',
    slug: 'workspace',
    icon: 'Laptop',
    image: '/images/products/photo-1527864550417-7fd91fc51a46.jpg',
    description: 'لوازم ارگونومیک، کیبوردهای مکانیکال و استندهای چوب گردو',
    parentId: null,
    isActive: true,
    sortOrder: 3,
    createdAt: '2026-01-10T11:05:00.000Z',
    updatedAt: '2026-01-10T11:05:00.000Z'
  },
  {
    id: 'smart-wear',
    name: 'Smart Gadgets',
    nameFa: 'گجت هوشمند',
    slug: 'smart-wear',
    icon: 'Watch',
    image: '/images/products/photo-1523275335684-37898b6baf30.jpg',
    description: 'ساعت‌های هوشمند تیتانیومی و گجت‌های نسل نو سلامتی',
    parentId: null,
    isActive: true,
    sortOrder: 4,
    createdAt: '2026-01-10T11:10:00.000Z',
    updatedAt: '2026-01-10T11:10:00.000Z'
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    nameFa: 'لوازم روزمره',
    slug: 'lifestyle',
    icon: 'Briefcase',
    image: '/images/products/photo-1553062407-98eeb64c6a62.jpg',
    description: 'کیف‌های چرم طبیعی، کوله‌پشتی و اکسسوری‌های خاص',
    parentId: null,
    isActive: true,
    sortOrder: 5,
    createdAt: '2026-01-10T11:15:00.000Z',
    updatedAt: '2026-01-10T11:15:00.000Z'
  },
  {
    id: 'coffee',
    name: 'Coffee',
    nameFa: 'قهوه و کافه',
    slug: 'coffee',
    icon: 'Coffee',
    image: '/images/products/photo-1514432324607-a09d9b4aefdd.jpg',
    description: 'کتری‌های هوشمند باریستا، دانه‌های قهوه تخصصی و ماگ‌های عایق',
    parentId: null,
    isActive: true,
    sortOrder: 6,
    createdAt: '2026-01-10T11:20:00.000Z',
    updatedAt: '2026-01-10T11:20:00.000Z'
  },
  {
    id: 'home-design',
    name: 'Home Decor',
    nameFa: 'دکوراسیون',
    slug: 'home-design',
    icon: 'Home',
    image: '/images/products/photo-1507473885765-e6ed057f782c.jpg',
    description: 'چراغ‌های هوشمند امبینت، دکوری‌های بتنی و المان‌های آرامش‌بخش',
    parentId: null,
    isActive: true,
    sortOrder: 7,
    createdAt: '2026-01-10T11:25:00.000Z',
    updatedAt: '2026-01-10T11:25:00.000Z'
  }
];


// Initial seed orders
const initialOrders = [
  {
    id: 'ORD-98750',
    date: '۱۴۰۴/۰۶/۱۹ - ۱۰:۳۰',
    timestamp: Date.now() - 1800000,
    customer: {
      name: 'کیان مهرآذر',
      email: 'kian.mehrazar@example.com',
      phone: '۰۹۱۲۳۴۵۶۷۸۹',
      city: 'تهران',
      address: 'خیابان ولیعصر، بالاتر از پارک وی، کوچه مهر، پلاک ۱۲',
      postalCode: '۱۹۶۸۸۱۴۵۳۲'
    },
    items: [
      {
        id: 'ord-item-proc-1',
        productId: 'lum-01',
        productName: 'Lumina Horizon Pro Wireless Headphones',
        productNameFa: 'هدفون بی‌سیم لومینا هورایزن پرو - نویزکنسلینگ فعال',
        image: '/images/products/photo-1505740420928-5e560c06d30e.jpg',
        price: 14500000,
        quantity: 1
      }
    ],
    subtotal: 14500000,
    discount: 1450000,
    shipping: 0,
    total: 13050000,
    status: 'processing',
    statusFa: 'در حال پردازش',
    paymentMethod: 'درگاه آنلاین سامان',
    trackingNumber: 'LMN-77492019',
    courierName: 'پیک ویژه اکسپرس لومینا',
    estimatedDelivery: 'فردا بین ساعت ۱۴ تا ۱۸'
  },
  {
    id: 'ORD-98612',
    date: '۱۴۰۴/۰۶/۱۸ - ۱۶:۴۵',
    timestamp: Date.now() - 3600000 * 24,
    customer: {
      name: 'کیان مهرآذر',
      email: 'kian.mehrazar@example.com',
      phone: '۰۹۱۲۳۴۵۶۷۸۹',
      city: 'تهران',
      address: 'ونک، خیابان ملاصدرا، برج فناوری لومینا',
      postalCode: '۱۹۹۱۸۵۴۳۲۱'
    },
    items: [
      {
        id: 'ord-item-ship-1',
        productId: 'lum-03',
        productName: 'Aura Studio Ambient Smart Lamp',
        productNameFa: 'چراغ رومیزی هوشمند امبینت آئورا استودیو',
        image: '/images/products/photo-1507473885765-e6ed057f782c.jpg',
        price: 5200000,
        quantity: 1
      },
      {
        id: 'ord-item-ship-2',
        productId: 'lum-04',
        productName: 'Chrono Apex Titanium Smartwatch',
        productNameFa: 'ساعت هوشمند پرچمدار کورونو اپکس تیتانیومی',
        image: '/images/products/photo-1523275335684-37898b6baf30.jpg',
        price: 19800000,
        quantity: 1
      }
    ],
    subtotal: 25000000,
    discount: 2500000,
    shipping: 0,
    total: 22500000,
    status: 'shipped',
    statusFa: 'ارسال شده',
    paymentMethod: 'درگاه آنلاین سامان',
    trackingNumber: 'TPX-994108420',
    courierName: 'تیپاکس اکسپرس هوایی',
    estimatedDelivery: 'امروز عصر تا ساعت ۲۰:۰۰'
  },
  {
    id: 'ORD-98421',
    date: '۱۴۰۴/۰۶/۱۴ - ۱۱:۳۰',
    timestamp: Date.now() - 3600000 * 120,
    customer: {
      name: 'کیان مهرآذر',
      email: 'kian.mehrazar@example.com',
      phone: '۰۹۱۲۳۴۵۶۷۸۹',
      city: 'تهران',
      address: 'خیابان ولیعصر، بالاتر از پارک وی، کوچه مهر',
      postalCode: '۱۹۶۸۸۱۴۵۳۲'
    },
    items: [
      {
        id: 'ord-item-1',
        productId: 'lum-02',
        productName: 'Kanso Minimalist Mechanical Keyboard',
        productNameFa: 'کیبورد مکانیکال بی‌سیم کانسو مینیمال ۷۵٪',
        image: '/images/products/photo-1587829741301-dc798b83add3.jpg',
        price: 8900000,
        quantity: 1
      }
    ],
    subtotal: 8900000,
    discount: 0,
    shipping: 0,
    total: 8900000,
    status: 'delivered',
    statusFa: 'تحویل داده شده',
    paymentMethod: 'درگاه آنلاین سامان',
    trackingNumber: 'PST-1109483321',
    courierName: 'پست پیشتاز جمهوری اسلامی',
    estimatedDelivery: 'تحویل موفق در تاریخ ۱۴ شهریور'
  },
  {
    id: 'LUM-84920',
    date: '۱۴۰۴/۰۶/۱۸ - ۱۶:۳۰',
    timestamp: Date.now() - 3600000 * 2,
    customer: {
      name: 'علیرضا رادمنش',
      email: 'alireza.rad@example.com',
      phone: '۰۹۱۲۳۴۵۶۷۸۹',
      city: 'تهران',
      address: 'سعادت‌آباد، خیابان علامه شمالی، پلاک ۴۲، واحد ۳',
      postalCode: '۱۹۹۷۹۳۲۱۴۵'
    },
    items: [
      {
        id: 'lum-01',
        productId: 'lum-01',
        productName: 'Lumina Horizon ANC Pro Headphones',
        productNameFa: 'هدفون بی‌سیم نویزکنسلینگ لومینا هورایزن پرو',
        image: '/images/products/photo-1505740420928-5e560c06d30e.jpg',
        price: 8950000,
        quantity: 1
      },
      {
        id: 'lum-03',
        productId: 'lum-03',
        productName: 'Lumina Ergonomic Walnut Desk Shelf',
        productNameFa: 'پایه‌ی مانیتور چوب گردو و ارگونومیک لومینا',
        image: '/images/products/photo-1527864550417-7fd91fc51a46.jpg',
        price: 3450000,
        quantity: 1
      }
    ],
    subtotal: 12400000,
    discount: 500000,
    shipping: 0,
    total: 11900000,
    status: 'paid', // pending | paid | processing | shipped | delivered | cancelled
    statusFa: 'پرداخت شده',
    paymentMethod: 'درگاه آنلاین شاپرک',
    trackingNumber: 'TRK-98432190'
  },
  {
    id: 'LUM-84919',
    date: '۱۴۰۴/۰۶/۱۸ - ۱۲:۱۵',
    timestamp: Date.now() - 3600000 * 6,
    customer: {
      name: 'مهدی کشاورز',
      email: 'm.keshavarz@gmail.com',
      phone: '۰۹۳۵۱۲۳۴۵۶۷',
      city: 'اصفهان',
      address: 'خیابان چهارباغ بالا، مجتمع تجاری کوثر، طبقه ۲',
      postalCode: '۸۱۶۳۸۵۴۹۱۱'
    },
    items: [
      {
        id: 'lum-02',
        productId: 'lum-02',
        productName: 'Aura Titan Minimalist Smart Watch',
        productNameFa: 'ساعت هوشمند مینیمال آئورا تیتانیوم',
        image: '/images/products/photo-1523275335684-37898b6baf30.jpg',
        price: 12800000,
        quantity: 1
      }
    ],
    subtotal: 12800000,
    discount: 0,
    shipping: 0,
    total: 12800000,
    status: 'processing',
    statusFa: 'در حال پردازش',
    paymentMethod: 'درگاه آنلاین شاپرک',
    trackingNumber: 'TRK-98432185'
  },
  {
    id: 'LUM-84915',
    date: '۱۴۰۴/۰۶/۱۷ - ۲۱:۴۵',
    timestamp: Date.now() - 3600000 * 20,
    customer: {
      name: 'سارا تهرانی',
      email: 'sara.t@example.com',
      phone: '۰۹۱۹۷۶۵۴۳۲۱',
      city: 'شیراز',
      address: 'بلوار ارم، کوچه ۱۲، پلاک ۸',
      postalCode: '۷۱۴۵۶۹۸۷۶۵'
    },
    items: [
      {
        id: 'lum-04',
        productId: 'lum-04',
        productName: 'Precision Gooseneck Smart Kettle',
        productNameFa: 'کتری برقی هوشمند و ارگونومیک باریستا',
        image: '/images/products/photo-1514432324607-a09d9b4aefdd.jpg',
        price: 5200000,
        quantity: 1
      }
    ],
    subtotal: 5200000,
    discount: 200000,
    shipping: 0,
    total: 5000000,
    status: 'shipped',
    statusFa: 'ارسال شده',
    paymentMethod: 'کارت به کارت',
    trackingNumber: 'POST-392019482'
  },
  {
    id: 'LUM-84910',
    date: '۱۴۰۴/۰۶/۱۶ - ۱۰:۲۰',
    timestamp: Date.now() - 3600000 * 48,
    customer: {
      name: 'پویا امینی',
      email: 'pouya.am@gmail.com',
      phone: '۰۹۱۲۸۹۰۱۲۳۴',
      city: 'مشهد',
      address: 'بلوار سجاد، خیابان بهارستان، ساختمان نسترن',
      postalCode: '۹۱۸۲۷۳۶۴۵۱'
    },
    items: [
      {
        id: 'lum-05',
        productId: 'lum-05',
        productName: 'Vortex Titanium EDC Travel Backpack',
        productNameFa: 'کوله پشتی ضدآب و اولترا لایت مسافرتی ورتکس',
        image: '/images/products/photo-1553062407-98eeb64c6a62.jpg',
        price: 4600000,
        quantity: 2
      }
    ],
    subtotal: 9200000,
    discount: 500000,
    shipping: 0,
    total: 8700000,
    status: 'delivered',
    statusFa: 'تحویل داده شده',
    paymentMethod: 'درگاه آنلاین شاپرک',
    trackingNumber: 'POST-109283746'
  },
  {
    id: 'LUM-84902',
    date: '۱۴۰۴/۰۶/۱۵ - ۱۴:۱۰',
    timestamp: Date.now() - 3600000 * 72,
    customer: {
      name: 'نگار صادقی',
      email: 'negar.sd@yahoo.com',
      phone: '۰۹۳۰۴۴۴۵۵۶۶',
      city: 'تبریز',
      address: 'خیابان ولیعصر، کوچه صفا، پلاک ۱۵',
      postalCode: '۵۱۵۷۸۹۶۳۲۱'
    },
    items: [
      {
        id: 'lum-06',
        productId: 'lum-06',
        productName: 'Halo Amber Sunset Mood Lamp',
        productNameFa: 'چراغ رومیزی اتمسفریک کهربایی هالو',
        image: '/images/products/photo-1507473885765-e6ed057f782c.jpg',
        price: 2900000,
        quantity: 1
      }
    ],
    subtotal: 2900000,
    discount: 0,
    shipping: 65000,
    total: 2965000,
    status: 'delivered',
    statusFa: 'تحویل داده شده',
    paymentMethod: 'پرداخت در محل',
    trackingNumber: 'TPX-48201948'
  },
  {
    id: 'LUM-84898',
    date: '۱۴۰۴/۰۶/۱۴ - ۰۹:۱۵',
    timestamp: Date.now() - 3600000 * 96,
    customer: {
      name: 'فرزاد رضایی',
      email: 'farzad.r@gmail.com',
      phone: '۰۹۱۲۷۷۷۸۸۹۹',
      city: 'تهران',
      address: 'نیاوران، خیابان یاسر، کوچه مریم',
      postalCode: '۱۹۸۴۷۲۹۱۸۴'
    },
    items: [
      {
        id: 'lum-07',
        productId: 'lum-07',
        productName: 'SonicClean Ultra Ceramic Toothbrush',
        productNameFa: 'مسواک صوتی الترا سرامیک سونیک‌کلین',
        image: '/images/products/photo-1559056199-641a0ac8b55e.jpg',
        price: 2150000,
        quantity: 1
      }
    ],
    subtotal: 2150000,
    discount: 0,
    shipping: 65000,
    total: 2215000,
    status: 'cancelled',
    statusFa: 'لغو شده',
    paymentMethod: 'درگاه آنلاین شاپرک',
    trackingNumber: '-'
  }
];

// Initial registered users
const initialUsers = [
  {
    id: 'usr-001',
    name: 'علیرضا رادمنش',
    email: 'alireza.rad@example.com',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    avatar: '/images/products/photo-1534528741775-53994a69daeb.jpg',
    role: 'vip',
    joinedDate: '۱۴۰۳/۱۱/۲۰',
    ordersCount: 8,
    totalSpent: 42500000,
    status: 'active',
    lastActive: '۱۰ دقیقه پیش'
  },
  {
    id: 'usr-002',
    name: 'مهدی کشاورز',
    email: 'm.keshavarz@gmail.com',
    phone: '۰۹۳۵۱۲۳۴۵۶۷',
    avatar: '/images/products/photo-1507003211169-0a1dd7228f2d.jpg',
    role: 'regular',
    joinedDate: '۱۴۰۴/۰۱/۱۵',
    ordersCount: 3,
    totalSpent: 19800000,
    status: 'active',
    lastActive: '۲ ساعت پیش'
  },
  {
    id: 'usr-003',
    name: 'سارا تهرانی',
    email: 'sara.t@example.com',
    phone: '۰۹۱۹۷۶۵۴۳۲۱',
    avatar: '/images/products/photo-1494790108377-be9c29b29330.jpg',
    role: 'vip',
    joinedDate: '۱۴۰۳/۰۸/۱۰',
    ordersCount: 12,
    totalSpent: 68400000,
    status: 'active',
    lastActive: 'دیروز'
  },
  {
    id: 'usr-004',
    name: 'پویا امینی',
    email: 'pouya.am@gmail.com',
    phone: '۰۹۱۲۸۹۰۱۲۳۴',
    avatar: '/images/products/photo-1500648767791-00dcc994a43e.jpg',
    role: 'regular',
    joinedDate: '۱۴۰۴/۰۴/۰۲',
    ordersCount: 4,
    totalSpent: 21900000,
    status: 'active',
    lastActive: '۳ روز پیش'
  },
  {
    id: 'usr-005',
    name: 'نگار صادقی',
    email: 'negar.sd@yahoo.com',
    phone: '۰۹۳۰۴۴۴۵۵۶۶',
    avatar: '/images/products/photo-1544005313-94ddf0286df2.jpg',
    role: 'regular',
    joinedDate: '۱۴۰۴/۰۵/۱۸',
    ordersCount: 2,
    totalSpent: 6400000,
    status: 'active',
    lastActive: '۵ روز پیش'
  },
  {
    id: 'usr-006',
    name: 'کامران یزدانی',
    email: 'kamran.y@gmail.com',
    phone: '۰۹۱۵۰۰۰۱۱۲۲',
    avatar: '/images/products/photo-1522075469751-3a6694fb2f61.jpg',
    role: 'regular',
    joinedDate: '۱۴۰۴/۰۶/۰۱',
    ordersCount: 0,
    totalSpent: 0,
    status: 'active',
    lastActive: 'امروز'
  }
];

// Initial coupons
const initialCoupons: Coupon[] = [
  {
    id: 'coup-1',
    code: 'LUMINA2025',
    discountPercent: 15,
    maxDiscount: 1500000,
    minPurchase: 3000000,
    expiresAt: '۱۴۰۴/۰۷/۰۱',
    usageCount: 142,
    maxUsage: 500,
    isActive: true
  },
  {
    id: 'coup-2',
    code: 'VIPGIFT',
    discountPercent: 20,
    maxDiscount: 3000000,
    minPurchase: 5000000,
    expiresAt: '۱۴۰۴/۰۶/۳۰',
    usageCount: 68,
    maxUsage: 100,
    isActive: true
  },
  {
    id: 'coup-3',
    code: 'WELCOME10',
    discountPercent: 10,
    maxDiscount: 800000,
    minPurchase: 1000000,
    expiresAt: '۱۴۰۴/۱۲/۲۹',
    usageCount: 310,
    maxUsage: 1000,
    isActive: true
  }
];

// Initial festivals
const initialFestivals: Festival[] = [
  {
    id: 'fest-spring-2026',
    title: 'جشنواره شگفت‌انگیز نوروزی لومینا ۲۰۲۶',
    titleEn: 'Lumina Smart Tech Spring Festival 2026',
    slogan: 'تخفیف‌های استثنایی بر روی جدیدترین پرچمداران تکنولوژی و صدای استودیویی Hi-Res',
    sloganEn: 'Exclusive discounts on flagship audio, wearables and smart home ecosystem.',
    description: 'به مناسبت سال جدید و رونمایی از لاین‌آپ اختصاصی ۲۰۲۶، محصولات منتخب این کمپین با تخفیف‌های ویژه، ضمانت تعویض ۲۴ ماهه و ارسال اکسپرس رایگان ارائه می‌گردند.',
    startDate: '۱۴۰۴/۱۲/۱۵',
    endDate: '۱۴۰۵/۰۱/۱۵',
    startTimestamp: Date.now() - 86400000 * 2, // started 2 days ago
    endTimestamp: Date.now() + 86400000 * 4 + 3600000 * 7 + 1800000, // ends in ~4.3 days
    isActive: true,
    priority: 10,
    themeColor: 'rose',
    badgeText: 'تخفیف شگفت‌انگیز نوروزی',
    discountPercent: 35,
    couponCode: 'FESTIVAL2026',
    bannerImage: '/images/products/photo-1505740420928-5e560c06d30e.jpg',
    products: [
      {
        productId: 'lum-01',
        nameFa: 'هدفون بی‌سیم لومینا هورایزن پرو - نویزکنسلینگ فعال',
        name: 'Lumina Horizon Pro Wireless Headphones',
        brand: 'Lumina Audio',
        image: '/images/products/photo-1505740420928-5e560c06d30e.jpg',
        category: 'audio',
        categoryFa: 'صدا و هدفون',
        originalPrice: 14500000,
        discountedPrice: 9425000,
        discountPercent: 35,
        festivalStock: 12,
        soldInFestival: 5,
        validUntil: 'تا پایان جشنواره'
      },
      {
        productId: 'lum-03',
        nameFa: 'چراغ رومیزی هوشمند امبینت آئورا استودیو',
        name: 'Aura Studio Ambient Smart Lamp',
        brand: 'Lumina Home',
        image: '/images/products/photo-1507473885765-e6ed057f782c.jpg',
        category: 'lighting',
        categoryFa: 'نورپردازی هوشمند',
        originalPrice: 5200000,
        discountedPrice: 3900000,
        discountPercent: 25,
        festivalStock: 20,
        soldInFestival: 8,
        validUntil: 'تا پایان جشنواره'
      },
      {
        productId: 'lum-04',
        nameFa: 'ساعت هوشمند پرچمدار کورونو اپکس تیتانیومی',
        name: 'Chrono Apex Titanium Smartwatch',
        brand: 'Lumina Wear',
        image: '/images/products/photo-1523275335684-37898b6baf30.jpg',
        category: 'wearables',
        categoryFa: 'گجت‌های پوشیدنی',
        originalPrice: 19800000,
        discountedPrice: 14850000,
        discountPercent: 25,
        festivalStock: 8,
        soldInFestival: 3,
        validUntil: 'تا پایان جشنواره'
      },
      {
        productId: 'lum-02',
        nameFa: 'کیبورد مکانیکال بی‌سیم کانسو مینیمال ۷۵٪',
        name: 'Kanso Minimalist Mechanical Keyboard',
        brand: 'Kanso Tech',
        image: '/images/products/photo-1587829741301-dc798b83add3.jpg',
        category: 'accessories',
        categoryFa: 'لوازم جانبی',
        originalPrice: 8900000,
        discountedPrice: 7120000,
        discountPercent: 20,
        festivalStock: 15,
        soldInFestival: 6,
        validUntil: 'تا پایان جشنواره'
      }
    ],
    coupons: [
      {
        id: 'fest-coup-1',
        code: 'FESTIVAL2026',
        type: 'percent',
        amount: 20,
        minPurchase: 2000000,
        maxDiscount: 2000000,
        maxUsage: 500,
        usageCount: 38,
        perUserLimit: 1,
        startDate: '۱۴۰۴/۱۲/۱۵',
        endDate: '۱۴۰۵/۰۱/۱۵',
        isActive: true,
        festivalId: 'fest-spring-2026'
      },
      {
        id: 'fest-coup-2',
        code: 'MEGA500K',
        type: 'fixed',
        amount: 500000,
        minPurchase: 3000000,
        maxUsage: 200,
        usageCount: 15,
        perUserLimit: 1,
        startDate: '۱۴۰۴/۱۲/۱۵',
        endDate: '۱۴۰۵/۰۱/۱۵',
        isActive: true,
        festivalId: 'fest-spring-2026'
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Initial notifications
const initialNotifications: AdminNotification[] = [
  {
    id: 'notif-1',
    title: 'سفارش جدید پرداخت‌شده',
    message: 'سفارش LUM-84920 به مبلغ ۱۱,۹۰۰,۰۰۰ تومان پرداخت شد.',
    time: '۲ ساعت پیش',
    type: 'order',
    read: false,
    linkTab: 'orders'
  },
  {
    id: 'notif-2',
    title: 'هشدار اتمام موجودی',
    message: 'موجودی ساعت آئورا تیتانیوم به ۳ عدد رسیده است.',
    time: '۵ ساعت پیش',
    type: 'stock',
    read: false,
    linkTab: 'products'
  },
  {
    id: 'notif-3',
    title: 'کاربر VIP جدید',
    message: 'سارا تهرانی به سقف خرید ۶۰ میلیون رسید و نشان VIP دریافت کرد.',
    time: '۱ روز پیش',
    type: 'user',
    read: true,
    linkTab: 'users'
  }
];

const initialSupportSessions: SupportSession[] = [
  {
    id: 'supp-101',
    userName: 'سینا محمدی',
    userEmail: 'sina.m@gmail.com',
    userPhone: '۰۹۱۲۹۸۷۶۵۴۳',
    createdAt: Date.now() - 3600000 * 2,
    updatedAt: Date.now() - 1800000,
    status: 'waiting_human',
    unreadByAdminCount: 2,
    unreadByUserCount: 0,
    lastMessage: 'سلام، می‌خواستم بدونم سفارش کد ORD-98750 کی به دستم می‌رسه؟',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        text: 'سلام و درود، خسته نباشید.',
        timestamp: Date.now() - 3600000 * 2
      },
      {
        id: 'msg-2',
        sender: 'user',
        text: 'سلام، می‌خواستم بدونم سفارش کد ORD-98750 کی به دستم می‌رسه؟ عکس فاکتور رو هم براتون فرستادم.',
        timestamp: Date.now() - 1800000,
        fileUrl: '/images/products/photo-1554224155-8d04cb21cd6c.jpg',
        fileName: 'factor_ORD-98750.jpg',
        fileType: 'image'
      }
    ]
  },
  {
    id: 'supp-102',
    userName: 'سارا کاظمی',
    userEmail: 'sara.kazemi@yahoo.com',
    userPhone: '۰۹۳۵۱۲۳۴۵۶۷',
    createdAt: Date.now() - 3600000 * 24,
    updatedAt: Date.now() - 3600000 * 3,
    status: 'human_connected',
    unreadByAdminCount: 0,
    unreadByUserCount: 0,
    lastMessage: 'خیلی ممنون از راهنمایی سریع شما!',
    messages: [
      {
        id: 'msg-201',
        sender: 'user',
        text: 'سلام، گارانتی هدفون‌های لومینا به چه صورت هست؟',
        timestamp: Date.now() - 3600000 * 4
      },
      {
        id: 'msg-202',
        sender: 'agent',
        text: 'سلام وقت بخیر! هدفون‌های لومینا شامل ۱۸ ماه گارانتی طلایی تعویض قطعات و ۷ روز مهلت تست هستند.',
        timestamp: Date.now() - 3600000 * 3.5
      },
      {
        id: 'msg-203',
        sender: 'user',
        text: 'خیلی ممنون از راهنمایی سریع شما!',
        timestamp: Date.now() - 3600000 * 3
      }
    ]
  }
];

// Initial reviews
const initialReviews: ProductReview[] = [
  {
    id: 'rev-01',
    productId: 'lum-01',
    productNameFa: 'هدفون بی‌سیم لومینا هورایزن پرو - نویزکنسلینگ فعال',
    userId: 'usr-kian-01',
    userName: 'کیان مهرآذر',
    userAvatar: '/images/products/photo-1535713875002-d1d0cf377fde.jpg',
    userEmail: 'kian.mehrazar@example.com',
    rating: 5,
    comment: 'کیفیت ساخت و تفکیک صدای این هدفون بی‌نظیره! نویزکنسلینگ در محیط‌های شلوغ کاملاً عالی عمل می‌کنه و باتری هم راحت ۲ روز جواب میده.',
    status: 'approved',
    isVerifiedPurchase: true,
    adminReply: 'ممنون از نظرتون جناب مهرآذر عزیز! خرسندیم که از کیفیت نویزکنسلینگ و کیفیت بالای هدفون هورایزن پرو رضایت دارید. 🌹',
    adminReplyBy: 'پشتیبانی لومینا',
    adminReplyAt: '۱۴۰۴/۰۶/۲۰ - ۱۲:۰۰',
    createdAt: '۱۴۰۴/۰۶/۱۹ - ۱۴:۳۰',
    timestamp: Date.now() - 86400000 * 2
  },
  {
    id: 'rev-02',
    productId: 'lum-01',
    productNameFa: 'هدفون بی‌سیم لومینا هورایزن پرو - نویزکنسلینگ فعال',
    userId: 'usr-sarah-02',
    userName: 'سارا رضایی',
    userAvatar: '/images/products/photo-1494790108377-be9c29b29330.jpg',
    userEmail: 'sarah.rezaei@example.com',
    rating: 4,
    comment: 'ارسال بسیار سریع بود. پدهای گوشی خیلی نرم و راحتن. تنها نکته کوچیک کیف حملشه که یکم بزرگه، اما در کل ارزش خرید خیلی بالایی داره.',
    status: 'approved',
    isVerifiedPurchase: true,
    createdAt: '۱۴۰۴/۰۶/۱۸ - ۰۹:۱۵',
    timestamp: Date.now() - 86400000 * 3
  },
  {
    id: 'rev-03',
    productId: 'lum-01',
    productNameFa: 'هدفون بی‌سیم لومینا هورایزن پرو - نویزکنسلینگ فعال',
    userId: 'usr-ali-03',
    userName: 'علی احمدی',
    userAvatar: '/images/products/photo-1570295999919-56ceb5ecca61.jpg',
    userEmail: 'ali.ahmadi@example.com',
    rating: 5,
    comment: 'طراحی شیک و متریال درجه یک. حتماً پیشنهاد می‌کنم.',
    status: 'approved',
    isVerifiedPurchase: false,
    createdAt: '۱۴۰۴/۰۶/۱۷ - ۱۸:۴۰',
    timestamp: Date.now() - 86400000 * 4
  },
  {
    id: 'rev-04',
    productId: 'lum-02',
    productNameFa: 'کیبورد مکانیکال بی‌سیم کانسو مینیمال ۷۵٪',
    userId: 'usr-kian-01',
    userName: 'کیان مهرآذر',
    userAvatar: '/images/products/photo-1535713875002-d1d0cf377fde.jpg',
    userEmail: 'kian.mehrazar@example.com',
    rating: 5,
    comment: 'حس تایپ کردن روی سوئیچ‌های زرد این کیبورد شگفت‌انگیزه! صدای تایپ بسیار نرم و دلنشینه و نورپردازی امبینت هم کار رو کامل کرده.',
    status: 'approved',
    isVerifiedPurchase: true,
    adminReply: 'درود جناب مهرآذر! ممنون از ثبت این نظر ارزشمند. سری کانسو مخصوص عاشقان تایپ و طراحی مینیمال ساخته شده.',
    adminReplyBy: 'پشتیبانی لومینا',
    adminReplyAt: '۱۴۰۴/۰۶/۱۶ - ۱۰:۰۰',
    createdAt: '۱۴۰۴/۰۶/۱۵ - ۱۱:۲۰',
    timestamp: Date.now() - 86400000 * 6
  },
  {
    id: 'rev-05',
    productId: 'lum-03',
    productNameFa: 'چراغ رومیزی هوشمند امبینت آئورا استودیو',
    userId: 'usr-mehdi-04',
    userName: 'مهدی کریمی',
    userAvatar: '/images/products/photo-1527980965255-d3b416303d12.jpg',
    userEmail: 'mehdi.k@example.com',
    rating: 4,
    comment: 'نورپردازی گرم و ملایمش برای اتاق خواب و میز کار حرفه‌ای عالیه. اتصال به اپلیکیشن هم بی‌دردسر انجام شد.',
    status: 'approved',
    isVerifiedPurchase: true,
    createdAt: '۱۴۰۴/۰۶/۱۲ - ۲۰:۱۰',
    timestamp: Date.now() - 86400000 * 9
  },
  {
    id: 'rev-06',
    productId: 'lum-04',
    productNameFa: 'ساعت هوشمند پرچمدار کورونو اپکس تیتانیومی',
    userId: 'usr-kian-01',
    userName: 'کیان مهرآذر',
    userAvatar: '/images/products/photo-1535713875002-d1d0cf377fde.jpg',
    userEmail: 'kian.mehrazar@example.com',
    rating: 5,
    comment: 'بدنه تیتانیوم واقعی با صفحه‌نمایش بسیار شفاف حتی زیر نور مستقیم خورشید. سنسورهای پایش سلامتی هم فوق‌العاده دقیق هستند.',
    status: 'approved',
    isVerifiedPurchase: true,
    createdAt: '۱۴۰۴/۰۶/۱۰ - ۱۵:۴۵',
    timestamp: Date.now() - 86400000 * 11
  },
  {
    id: 'rev-07',
    productId: 'lum-01',
    productNameFa: 'هدفون بی‌سیم لومینا هورایزن پرو - نویزکنسلینگ فعال',
    userId: 'usr-reza-05',
    userName: 'رضا قاسمی',
    userEmail: 'reza.g@example.com',
    rating: 3,
    comment: 'کیفیت صدا خوبه اما قیمت یکم بالاست.',
    status: 'pending',
    isVerifiedPurchase: false,
    createdAt: '۱۴۰۴/۰۶/۲۰ - ۱۶:۰۰',
    timestamp: Date.now() - 3600000 * 3
  }
];

class DatabaseManager {
  private db: StoreDatabase;

  constructor() {
    this.db = this.loadFromDisk();
  }

  private loadFromDisk(): StoreDatabase {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
          // Migration check for festivals, support & reviews
          let updated = false;
          if (!Array.isArray(parsed.festivals) || parsed.festivals.length === 0) {
            parsed.festivals = initialFestivals;
            updated = true;
          }
          if (!Array.isArray(parsed.supportSessions)) {
            parsed.supportSessions = initialSupportSessions;
            updated = true;
          }
          if (!Array.isArray(parsed.reviews) || parsed.reviews.length === 0) {
            parsed.reviews = initialReviews;
            updated = true;
          }
          if (typeof parsed.agentOnline !== 'boolean') {
            parsed.agentOnline = true;
            updated = true;
          }

          // Category migration & hierarchy check
          if (!Array.isArray(parsed.categories) || parsed.categories.length === 0) {
            parsed.categories = defaultEnhancedCategories;
            updated = true;
          } else {
            // Ensure all required fields exist
            parsed.categories = parsed.categories.map((c: any, idx: number) => ({
              ...c,
              slug: c.slug || c.id,
              parentId: c.parentId !== undefined ? c.parentId : null,
              isActive: typeof c.isActive === 'boolean' ? c.isActive : true,
              sortOrder: typeof c.sortOrder === 'number' ? c.sortOrder : idx + 1,
              createdAt: c.createdAt || new Date('2026-01-10T10:00:00.000Z').toISOString(),
              updatedAt: c.updatedAt || new Date('2026-01-10T10:00:00.000Z').toISOString()
            }));

            // Merge any missing default enhanced categories (like nested apparel categories)
            for (const defCat of defaultEnhancedCategories) {
              if (!parsed.categories.some((c: any) => c.id === defCat.id || c.slug === defCat.slug)) {
                parsed.categories.push(defCat);
                updated = true;
              }
            }
          }

          // Ensure products have primaryImage
          parsed.products.forEach((p: any) => {
            if (!p.primaryImage && Array.isArray(p.images) && p.images.length > 0) {
              p.primaryImage = p.images[0];
              updated = true;
            }
          });

          // Product Analytics Migration Check
          if (!Array.isArray(parsed.productEvents) || parsed.productEvents.length === 0) {
            parsed.productEvents = this.generateInitialProductEvents(parsed.products, parsed.orders);
            updated = true;
          }
          if (!Array.isArray(parsed.favorites) || parsed.favorites.length === 0) {
            parsed.favorites = this.generateInitialFavorites(parsed.products, parsed.users);
            updated = true;
          }
          if (!Array.isArray(parsed.productShares) || parsed.productShares.length === 0) {
            parsed.productShares = this.generateInitialProductShares(parsed.products);
            updated = true;
          }

          if (updated) {
            this.saveToDisk(parsed);
          }
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Could not read store DB file, initializing fresh:', err);
    }

    // Seed defaults
    const seededProducts = PRODUCTS.map((p, idx) => ({
      ...p,
      isActive: true,
      sku: `LUM-${p.category.toUpperCase().slice(0, 3)}-00${idx + 1}`,
      views: Math.floor(Math.random() * 850) + 150 + p.soldCount * 3,
      cartAdds: Math.floor(p.soldCount * 1.8) + 12,
      primaryImage: p.images[0] || '',
      createdAt: new Date(Date.now() - (12 - idx) * 86400000 * 3).toISOString()
    }));

    const fresh: StoreDatabase = {
      products: seededProducts,
      categories: defaultEnhancedCategories,
      orders: initialOrders,
      users: initialUsers,
      coupons: initialCoupons,
      festivals: initialFestivals,
      reviews: initialReviews,
      notifications: initialNotifications,
      dailyVisits: 3840,
      weeklyVisits: 26500,
      monthlyVisits: 114200,
      agentOnline: true,
      supportSessions: initialSupportSessions,
      productEvents: this.generateInitialProductEvents(seededProducts, initialOrders),
      favorites: this.generateInitialFavorites(seededProducts, initialUsers),
      productShares: this.generateInitialProductShares(seededProducts)
    };

    this.saveToDisk(fresh);
    return fresh;
  }

  private saveToDisk(data: StoreDatabase) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving DB to disk:', err);
    }
  }

  // --- Products ---
  public getProducts(filter?: {
    search?: string;
    category?: string;
    status?: string; // all | active | inactive
    stock?: string; // all | in_stock | low_stock | out_of_stock
    sortBy?: string;
  }) {
    let result = [...this.db.products];

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.nameFa.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    if (filter?.category && filter.category !== 'all') {
      result = result.filter(p => p.category === filter.category);
    }

    if (filter?.status && filter.status !== 'all') {
      const activeOnly = filter.status === 'active';
      result = result.filter(p => p.isActive === activeOnly);
    }

    if (filter?.stock && filter.stock !== 'all') {
      if (filter.stock === 'in_stock') {
        result = result.filter(p => p.stock > 5);
      } else if (filter.stock === 'low_stock') {
        result = result.filter(p => p.stock > 0 && p.stock <= 5);
      } else if (filter.stock === 'out_of_stock') {
        result = result.filter(p => p.stock === 0);
      }
    }

    if (filter?.sortBy) {
      if (filter.sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
      else if (filter.sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
      else if (filter.sortBy === 'sold-desc') result.sort((a, b) => b.soldCount - a.soldCount);
      else if (filter.sortBy === 'views-desc') result.sort((a, b) => b.views - a.views);
      else if (filter.sortBy === 'stock-asc') result.sort((a, b) => a.stock - b.stock);
      else result.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    }

    return result;
  }

  public getProductById(id: string) {
    return this.db.products.find(p => p.id === id);
  }

  public createProduct(data: Partial<Product> & { isActive?: boolean; sku?: string }) {
    const id = `lum-${Date.now().toString(36)}`;
    const categoryFa =
      this.db.categories.find(c => c.id === data.category || c.slug === data.category)?.nameFa || 'دسته‌بندی عمومی';

    const images =
      data.images && data.images.length > 0
        ? data.images
        : ['/images/products/photo-1526170375885-4d8ecf77b99f.jpg'];
    const primaryImage = data.primaryImage || images[0] || '';

    const newProduct = {
      id,
      name: data.name || 'New Lumina Product',
      nameFa: data.nameFa || 'محصول جدید لومینا',
      brand: data.brand || 'Lumina Collection',
      category: data.category || 'audio',
      categoryFa,
      rating: 5.0,
      reviewsCount: 1,
      price: Number(data.price) || 1000000,
      originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
      discountPercent: data.discountPercent ? Number(data.discountPercent) : 0,
      isFlashSale: !!data.isFlashSale,
      stock: Number(data.stock) ?? 10,
      soldCount: 0,
      images,
      primaryImage,
      productImages: data.productImages || [],
      description: data.description || '',
      descriptionFa: data.descriptionFa || '',
      specs: data.specs || {},
      features: data.features || [],
      featuresFa: data.featuresFa || [],
      tags: data.tags || [],
      isActive: data.isActive !== undefined ? data.isActive : true,
      sku: data.sku || `LUM-${(data.category || 'GEN').toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`,
      views: 1,
      cartAdds: 0,
      createdAt: new Date().toISOString()
    };

    this.db.products.unshift(newProduct);

    // Add notification
    this.addNotification({
      title: 'محصول جدید ایجاد شد',
      message: `محصول «${newProduct.nameFa}» با کد ${newProduct.sku} با موفقیت به انبار اضافه گردید.`,
      type: 'stock',
      linkTab: 'products'
    });

    this.saveToDisk(this.db);
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product> & { isActive?: boolean; sku?: string }) {
    const idx = this.db.products.findIndex(p => p.id === id);
    if (idx === -1) return null;

    const oldProduct = this.db.products[idx];

    if (updates.category) {
      updates.categoryFa =
        this.db.categories.find(c => c.id === updates.category || c.slug === updates.category)?.nameFa ||
        this.db.products[idx].categoryFa;
    }

    if (updates.images && updates.images.length > 0) {
      updates.primaryImage = updates.primaryImage || updates.images[0];
    }

    this.db.products[idx] = {
      ...this.db.products[idx],
      ...updates
    };

    // Clean up physical images that were removed from this product if they are no longer referenced anywhere
    if (updates.images && Array.isArray(oldProduct.images)) {
      const removedImages = oldProduct.images.filter(img => !updates.images!.includes(img));
      if (removedImages.length > 0) {
        this.cleanUnusedUploadedFiles(removedImages);
      }
    }

    this.saveToDisk(this.db);
    return this.db.products[idx];
  }

  public deleteProduct(id: string) {
    const idx = this.db.products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    const deleted = this.db.products.splice(idx, 1)[0];
    this.saveToDisk(this.db);

    // Clean up physical uploaded files if not referenced by other products
    if (deleted && Array.isArray(deleted.images)) {
      this.cleanUnusedUploadedFiles(deleted.images);
    }

    return true;
  }

  // --- Category Management (CRUD & Hierarchy) ---

  public getCategories(filter?: { search?: string; parentId?: string | null; isActive?: boolean }) {
    let list = [...this.db.categories];

    // Compute dynamic product counts
    list = list.map(c => {
      const childIds = this.getChildCategoryIds(c.id);
      const allMatchingIds = [c.id, c.slug, ...childIds].filter(Boolean);
      const directCount = this.db.products.filter(p => p.category === c.id || p.category === c.slug).length;
      const totalCount = this.db.products.filter(p => allMatchingIds.includes(p.category)).length;

      return {
        ...c,
        itemCount: directCount,
        totalProductCount: totalCount
      };
    });

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.nameFa.toLowerCase().includes(q) ||
          (c.slug && c.slug.toLowerCase().includes(q))
      );
    }

    if (filter?.isActive !== undefined) {
      list = list.filter(c => c.isActive === filter.isActive);
    }

    if (filter?.parentId !== undefined) {
      list = list.filter(c => c.parentId === filter.parentId);
    }

    list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    return list;
  }

  public getChildCategoryIds(parentId: string): string[] {
    const children = this.db.categories.filter(c => c.parentId === parentId);
    let ids = children.map(c => c.id);
    for (const child of children) {
      ids = ids.concat(this.getChildCategoryIds(child.id));
    }
    return ids;
  }

  public getCategoryById(id: string) {
    const cat = this.db.categories.find(c => c.id === id || c.slug === id);
    if (!cat) return null;
    const directCount = this.db.products.filter(p => p.category === cat.id || p.category === cat.slug).length;
    const childIds = this.getChildCategoryIds(cat.id);
    const totalCount = this.db.products.filter(p => [cat.id, cat.slug, ...childIds].includes(p.category)).length;

    return { ...cat, itemCount: directCount, totalProductCount: totalCount };
  }

  public createCategory(data: Partial<Category>) {
    const nameFa = data.nameFa?.trim() || 'دسته‌بندی جدید';
    const name = data.name?.trim() || nameFa;
    let baseSlug =
      data.slug?.trim().toLowerCase() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    if (!baseSlug) {
      baseSlug = `cat-${Date.now().toString(36)}`;
    }

    // Ensure unique slug
    let finalSlug = baseSlug;
    let counter = 1;
    while (this.db.categories.some(c => c.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    const id = data.id || finalSlug;
    const maxOrder = this.db.categories.reduce((max, c) => Math.max(max, c.sortOrder || 0), 0);

    const newCategory: Category = {
      id,
      name,
      nameFa,
      slug: finalSlug,
      description: data.description?.trim() || '',
      image:
        data.image ||
        '/images/products/photo-1521572267360-ee0c2909d518.jpg',
      icon: data.icon || 'Folder',
      parentId: data.parentId || null,
      isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
      sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : maxOrder + 1,
      itemCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.db.categories.push(newCategory);
    this.saveToDisk(this.db);
    return newCategory;
  }

  public updateCategory(id: string, updates: Partial<Category>) {
    const idx = this.db.categories.findIndex(c => c.id === id || c.slug === id);
    if (idx === -1) return null;

    const current = this.db.categories[idx];

    // Hierarchy loop prevention
    if (updates.parentId) {
      if (updates.parentId === current.id) {
        throw new Error('یک دسته‌بندی نمی‌تواند والد خودش باشد.');
      }
      const descendants = this.getChildCategoryIds(current.id);
      if (descendants.includes(updates.parentId)) {
        throw new Error('نمی‌توانید زیردسته‌ها را به عنوان والد این دسته‌بندی انتخاب کنید.');
      }
    }

    const updated: Category = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.db.categories[idx] = updated;

    // Sync categoryFa in products if nameFa changed
    if (updates.nameFa && updates.nameFa !== current.nameFa) {
      this.db.products.forEach(p => {
        if (p.category === current.id || p.category === current.slug) {
          p.categoryFa = updates.nameFa!;
        }
      });
    }

    this.saveToDisk(this.db);
    return updated;
  }

  public deleteCategory(id: string): { success: boolean; error?: string; productCount?: number; childCount?: number } {
    const idx = this.db.categories.findIndex(c => c.id === id || c.slug === id);
    if (idx === -1) return { success: false, error: 'دسته‌بندی مورد نظر یافت نشد.' };

    const target = this.db.categories[idx];

    // 1. Validation: check if products belong to this category
    const connectedProducts = this.db.products.filter(p => p.category === target.id || p.category === target.slug);
    if (connectedProducts.length > 0) {
      return {
        success: false,
        error: `این دسته‌بندی دارای ${connectedProducts.length} محصول است. ابتدا محصولات را به دسته‌بندی دیگری منتقل کنید.`,
        productCount: connectedProducts.length
      };
    }

    // 2. Validation: check if it has child categories
    const children = this.db.categories.filter(c => c.parentId === target.id);
    if (children.length > 0) {
      return {
        success: false,
        error: `این دسته‌بندی دارای ${children.length} زیردسته‌بندی است. ابتدا زیردسته‌ها را حذف یا به والد دیگری منتقل کنید.`,
        childCount: children.length
      };
    }

    // Safe to delete
    this.db.categories.splice(idx, 1);
    this.saveToDisk(this.db);
    return { success: true };
  }

  public toggleCategoryStatus(id: string) {
    const idx = this.db.categories.findIndex(c => c.id === id || c.slug === id);
    if (idx === -1) return null;
    this.db.categories[idx].isActive = !this.db.categories[idx].isActive;
    this.db.categories[idx].updatedAt = new Date().toISOString();
    this.saveToDisk(this.db);
    return this.db.categories[idx];
  }

  // --- Image Reference & Physical File Cleanup Safety ---

  public isImageReferenced(imageUrl: string, excludingProductId?: string): boolean {
    if (!imageUrl) return false;
    for (const p of this.db.products) {
      if (excludingProductId && p.id === excludingProductId) continue;
      if (Array.isArray(p.images) && p.images.includes(imageUrl)) return true;
      if (p.primaryImage === imageUrl) return true;
    }
    for (const c of this.db.categories) {
      if (c.image === imageUrl) return true;
    }
    return false;
  }

  public cleanUnusedUploadedFiles(filesToCheck: string[], excludingProductId?: string) {
    for (const url of filesToCheck) {
      if (!url || typeof url !== 'string' || !url.startsWith('/uploads/')) continue;
      if (!this.isImageReferenced(url, excludingProductId)) {
        try {
          const filePath = path.join(process.cwd(), url.replace(/^\//, ''));
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Cleaned unreferenced physical upload: ${filePath}`);
          }
        } catch (err) {
          console.error('Error cleaning up unreferenced upload:', err);
        }
      }
    }
  }

  // --- Orders ---
  public getOrders(filter?: { search?: string; status?: string }) {
    let result = [...this.db.orders];

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        o =>
          o.id.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.phone.includes(q)
      );
    }

    if (filter?.status && filter.status !== 'all') {
      result = result.filter(o => o.status === filter.status);
    }

    result.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    return result;
  }

  public getOrderById(id: string) {
    return this.db.orders.find(o => o.id === id);
  }

  public updateOrderStatus(
    id: string,
    statusOrData: string | { status: string; trackingNumber?: string; trackingCode?: string; courierName?: string; courier?: string; estimatedDelivery?: string; statusAdminNote?: string; adminNote?: string }
  ) {
    let order = this.db.orders.find(o => o.id === id);

    // If order is not in db yet (e.g. from seed list or user), check if we can find in initialOrders or create
    if (!order) {
      const initialMatch = initialOrders.find(o => o.id === id);
      if (initialMatch) {
        order = { ...initialMatch };
        this.db.orders.unshift(order);
      } else {
        // If not in seed, create a record so it is tracked
        order = {
          id,
          date: new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date()),
          timestamp: Date.now(),
          customer: { name: 'کاربر لومینا', phone: '۰۹۱۲۰۰۰۰۰۰۰', city: 'تهران', address: 'تهران' },
          items: [],
          total: 0,
          status: 'processing',
          statusFa: 'در حال پردازش'
        };
        this.db.orders.unshift(order);
      }
    }

    const status = typeof statusOrData === 'string' ? statusOrData : statusOrData.status;
    const statusFaMap: { [k: string]: string } = {
      pending: 'در انتظار پرداخت',
      paid: 'پرداخت شده',
      processing: 'در حال پردازش',
      shipped: 'ارسال شده',
      delivered: 'تحویل داده شده',
      cancelled: 'لغو شده'
    };

    order.status = status;
    order.statusFa = statusFaMap[status] || status;

    if (typeof statusOrData === 'object') {
      const tracking = statusOrData.trackingNumber || statusOrData.trackingCode;
      if (tracking !== undefined) {
        order.trackingNumber = tracking;
        order.trackingCode = tracking;
      }
      const courier = statusOrData.courierName || statusOrData.courier;
      if (courier !== undefined) {
        order.courierName = courier;
      }
      if (statusOrData.estimatedDelivery !== undefined) {
        order.estimatedDelivery = statusOrData.estimatedDelivery;
      }
      const note = statusOrData.statusAdminNote || statusOrData.adminNote;
      if (note !== undefined) {
        order.statusAdminNote = note;
      }
    }
    order.lastUpdatedByAdmin = new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit' }).format(new Date());

    // Add notification to admin log
    this.addNotification({
      title: 'وضعیت سفارش بروزرسانی شد',
      message: `وضعیت مرسوله ${order.id} توسط مدیریت به «${order.statusFa}» تغییر یافت و در پنل کاربر ثبت گردید.`,
      type: 'order',
      linkTab: 'orders'
    });

    this.saveToDisk(this.db);
    return order;
  }

  public createOrder(orderData: any) {
    const id = orderData.id || `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const dateFa = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(now);

    const status = orderData.status || 'processing';
    const statusFaMap: { [k: string]: string } = {
      pending: 'در انتظار پرداخت',
      paid: 'پرداخت شده',
      processing: 'در حال پردازش',
      shipped: 'ارسال شده',
      delivered: 'تحویل داده شده',
      cancelled: 'لغو شده'
    };

    const newOrder = {
      id,
      date: orderData.date || dateFa,
      timestamp: Date.now(),
      customer: orderData.shippingAddress || orderData.customer || { name: 'کاربر لومینا', phone: '۰۹۱۲۰۰۰۰۰۰۰' },
      items: orderData.items || [],
      subtotal: orderData.subtotal || orderData.total || 0,
      discount: orderData.discount || 0,
      shipping: orderData.shipping || 0,
      total: orderData.total || 0,
      status: status,
      statusFa: statusFaMap[status] || 'در حال پردازش',
      paymentMethod: orderData.paymentMethod || 'درگاه آنلاین سامان',
      trackingNumber: orderData.trackingCode || orderData.trackingNumber || `LMN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      trackingCode: orderData.trackingCode || orderData.trackingNumber || `LMN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      courierName: orderData.courierName || 'پیک ویژه اکسپرس لومینا',
      estimatedDelivery: orderData.estimatedDelivery || '۲۴ الی ۴۸ ساعت آینده',
      statusAdminNote: orderData.statusAdminNote || ''
    };

    // Update product stock and soldCount
    if (Array.isArray(orderData.items)) {
      for (const item of orderData.items) {
        const prod = this.db.products.find(p => p.id === (item.productId || item.id));
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
          prod.soldCount += item.quantity;
        }
      }
    }

    this.db.orders.unshift(newOrder);

    this.addNotification({
      title: 'سفارش آنلاین جدید',
      message: `سفارش جدید به شماره ${id} به مبلغ ${newOrder.total.toLocaleString()} تومان ثبت گردید.`,
      type: 'order',
      linkTab: 'orders'
    });

    this.saveToDisk(this.db);
    return newOrder;
  }

  // --- Users ---
  public getUsers(search?: string) {
    let result = [...this.db.users];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        u =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone.includes(q)
      );
    }
    return result;
  }

  public toggleUserStatus(id: string) {
    const user = this.db.users.find(u => u.id === id);
    if (!user) return null;
    user.status = user.status === 'active' ? 'blocked' : 'active';
    this.saveToDisk(this.db);
    return user;
  }

  // --- Festivals & Campaigns Management ---
  public getFestivals(activeOnly: boolean = false): Festival[] {
    const now = Date.now();
    let list = [...(this.db.festivals || [])];

    if (activeOnly) {
      list = list.filter(f => {
        if (!f.isActive) return false;
        // Check date bounds if timestamps are present
        if (f.startTimestamp && now < f.startTimestamp) return false;
        if (f.endTimestamp && now > f.endTimestamp) return false;
        return true;
      });
    }

    // Sort by priority (higher priority first) then by creation date
    list.sort((a, b) => {
      const pDiff = (b.priority || 0) - (a.priority || 0);
      if (pDiff !== 0) return pDiff;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    return list;
  }

  public getActiveFestival(): Festival | null {
    const active = this.getFestivals(true);
    return active.length > 0 ? active[0] : null;
  }

  public getFestivalById(id: string): Festival | undefined {
    const festival = this.db.festivals.find(f => f.id === id);
    if (!festival) return undefined;

    // Sync product details with latest product catalog
    const enrichedProducts = (festival.products || []).map(fp => {
      const prod = this.db.products.find(p => p.id === fp.productId);
      if (prod) {
        return {
          ...fp,
          name: prod.name,
          nameFa: prod.nameFa,
          brand: prod.brand,
          image: prod.images[0] || fp.image,
          category: prod.category,
          categoryFa: prod.categoryFa,
          originalPrice: fp.originalPrice || prod.price
        };
      }
      return fp;
    });

    return {
      ...festival,
      products: enrichedProducts
    };
  }

  public createFestival(data: Partial<Festival>): Festival {
    const id = data.id || `fest-${Date.now()}`;
    const now = Date.now();

    const startTimestamp = data.startTimestamp || (data.startDate ? new Date(data.startDate).getTime() : now);
    const endTimestamp = data.endTimestamp || (data.endDate ? new Date(data.endDate).getTime() : now + 86400000 * 7);

    // Enrich products with product catalog info
    const enrichedProducts: FestivalProduct[] = (data.products || []).map(fp => {
      const originalProd = this.db.products.find(p => p.id === fp.productId);
      const originalPrice = fp.originalPrice || (originalProd ? originalProd.price : 1000000);
      let discountedPrice = fp.discountedPrice;
      let discountPercent = fp.discountPercent;

      if (!discountedPrice && discountPercent) {
        discountedPrice = Math.round(originalPrice * (1 - discountPercent / 100));
      } else if (discountedPrice && !discountPercent) {
        discountPercent = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
      } else if (!discountedPrice && !discountPercent) {
        discountPercent = 20;
        discountedPrice = Math.round(originalPrice * 0.8);
      }

      return {
        productId: fp.productId,
        name: fp.name || originalProd?.name || '',
        nameFa: fp.nameFa || originalProd?.nameFa || '',
        brand: fp.brand || originalProd?.brand || '',
        image: fp.image || originalProd?.images[0] || '',
        category: fp.category || originalProd?.category || '',
        categoryFa: fp.categoryFa || originalProd?.categoryFa || '',
        originalPrice,
        discountedPrice: discountedPrice || Math.round(originalPrice * 0.8),
        discountPercent: discountPercent || 20,
        festivalStock: Number(fp.festivalStock) || 10,
        soldInFestival: 0,
        validUntil: fp.validUntil || 'تا پایان جشنواره'
      };
    });

    const newFestival: Festival = {
      id,
      title: data.title || 'جشنواره فروش ویژه لومینا',
      titleEn: data.titleEn || '',
      slogan: data.slogan?.trim() || undefined,
      sloganEn: data.sloganEn?.trim() || undefined,
      description: data.description || '',
      startDate: data.startDate || new Date(startTimestamp).toISOString().split('T')[0],
      endDate: data.endDate || new Date(endTimestamp).toISOString().split('T')[0],
      startTimestamp,
      endTimestamp,
      isActive: data.isActive !== undefined ? data.isActive : true,
      priority: Number(data.priority) || 10,
      themeColor: data.themeColor || 'rose',
      badgeText: data.badgeText || 'تخفیف ویژه جشنواره',
      bannerImage: data.bannerImage || '/images/products/photo-1505740420928-5e560c06d30e.jpg',
      discountPercent: data.discountPercent || (enrichedProducts[0]?.discountPercent || 25),
      couponCode: data.couponCode || data.coupons?.[0]?.code || undefined,
      products: enrichedProducts,
      coupons: data.coupons || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!this.db.festivals) {
      this.db.festivals = [];
    }

    this.db.festivals.unshift(newFestival);
    this.addNotification({
      title: 'جشنواره جدید ایجاد شد',
      message: `کمپین تخفیف «${newFestival.title}» با موفقیت ایجاد و ذخیره گردید.`,
      type: 'system',
      linkTab: 'festivals'
    });

    this.saveToDisk(this.db);
    return newFestival;
  }

  public updateFestival(id: string, data: Partial<Festival>): Festival | null {
    const idx = this.db.festivals.findIndex(f => f.id === id);
    if (idx === -1) return null;

    const existing = this.db.festivals[idx];
    const updated: Festival = {
      ...existing,
      ...data,
      id: existing.id,
      slogan: data.slogan !== undefined ? (data.slogan.trim() || undefined) : existing.slogan,
      products: data.products || existing.products,
      coupons: data.coupons || existing.coupons,
      updatedAt: new Date().toISOString()
    };

    this.db.festivals[idx] = updated;
    this.saveToDisk(this.db);
    return updated;
  }

  public deleteFestival(id: string): boolean {
    const prevLen = this.db.festivals.length;
    this.db.festivals = this.db.festivals.filter(f => f.id !== id);
    if (this.db.festivals.length !== prevLen) {
      this.saveToDisk(this.db);
      return true;
    }
    return false;
  }

  public toggleFestivalStatus(id: string): Festival | null {
    const festival = this.db.festivals.find(f => f.id === id);
    if (!festival) return null;
    festival.isActive = !festival.isActive;
    festival.updatedAt = new Date().toISOString();
    this.saveToDisk(this.db);
    return festival;
  }

  // --- Coupons ---
  public getCoupons() {
    return this.db.coupons;
  }

  public createCoupon(data: Partial<Coupon>) {
    const newCoupon: Coupon = {
      id: `coup-${Date.now()}`,
      code: (data.code || 'SALE').toUpperCase(),
      discountPercent: Number(data.discountPercent) || 10,
      maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : undefined,
      minPurchase: Number(data.minPurchase) || 0,
      expiresAt: data.expiresAt || '۱۴۰۴/۱۲/۲۹',
      usageCount: 0,
      maxUsage: Number(data.maxUsage) || 100,
      isActive: true
    };
    this.db.coupons.push(newCoupon);
    this.saveToDisk(this.db);
    return newCoupon;
  }

  public toggleCoupon(id: string) {
    const c = this.db.coupons.find(item => item.id === id);
    if (!c) return null;
    c.isActive = !c.isActive;
    this.saveToDisk(this.db);
    return c;
  }

  // --- Notifications ---
  public getNotifications() {
    return this.db.notifications;
  }

  public markNotificationRead(id: string) {
    const n = this.db.notifications.find(item => item.id === id);
    if (n) {
      n.read = true;
      this.saveToDisk(this.db);
    }
    return n;
  }

  public markAllNotificationsRead() {
    this.db.notifications.forEach(n => (n.read = true));
    this.saveToDisk(this.db);
    return true;
  }

  public addNotification(n: Omit<AdminNotification, 'id' | 'time' | 'read'>) {
    const newNotif: AdminNotification = {
      id: `notif-${Date.now()}`,
      title: n.title,
      message: n.message,
      time: 'لحظاتی پیش',
      type: n.type,
      read: false,
      linkTab: n.linkTab
    };
    this.db.notifications.unshift(newNotif);
    if (this.db.notifications.length > 25) {
      this.db.notifications.pop();
    }
    this.saveToDisk(this.db);
  }

  // --- Dashboard Overview Stats ---
  public getDashboardStats(): DashboardStats {
    const totalOrders = this.db.orders.length;
    const completedOrders = this.db.orders.filter(o => o.status !== 'cancelled');
    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    const now = Date.now();
    const oneDayAgo = now - 86400000;
    const oneWeekAgo = now - 7 * 86400000;
    const oneMonthAgo = now - 30 * 86400000;

    const ordersToday = this.db.orders.filter(o => (o.timestamp || 0) >= oneDayAgo).length;
    const ordersWeek = this.db.orders.filter(o => (o.timestamp || 0) >= oneWeekAgo).length;
    const ordersMonth = this.db.orders.filter(o => (o.timestamp || 0) >= oneMonthAgo).length;

    const salesToday = this.db.orders
      .filter(o => o.status !== 'cancelled' && (o.timestamp || 0) >= oneDayAgo)
      .reduce((s, o) => s + (o.total || 0), 0);

    const salesWeek = this.db.orders
      .filter(o => o.status !== 'cancelled' && (o.timestamp || 0) >= oneWeekAgo)
      .reduce((s, o) => s + (o.total || 0), 0);

    const salesMonth = this.db.orders
      .filter(o => o.status !== 'cancelled' && (o.timestamp || 0) >= oneMonthAgo)
      .reduce((s, o) => s + (o.total || 0), 0);

    const totalProducts = this.db.products.length;
    const activeProducts = this.db.products.filter(p => p.isActive).length;
    const outOfStockProducts = this.db.products.filter(p => p.stock === 0).length;
    const lowStockProducts = this.db.products.filter(p => p.stock > 0 && p.stock <= 5).length;

    return {
      totalUsers: this.db.users.length + 184, // + historical guests
      newUsersToday: 4,
      newUsersWeek: 28,
      newUsersMonth: 94,
      usersChangeWeek: 14.8,

      totalProducts,
      activeProducts,
      outOfStockProducts,
      lowStockProducts,

      totalOrders: totalOrders + 240, // realistic cumulative store volume
      ordersToday: ordersToday + 2,
      ordersWeek: ordersWeek + 16,
      ordersMonth: ordersMonth + 54,
      ordersChangeWeek: 18.2,

      totalRevenue: totalRevenue + 185000000,
      salesToday: salesToday > 0 ? salesToday : 14800000,
      salesWeek: salesWeek > 0 ? salesWeek : 68500000,
      salesMonth: salesMonth > 0 ? salesMonth : 248000000,
      revenueChangeWeek: 16.4,

      visitsToday: this.db.dailyVisits,
      visitsWeek: this.db.weeklyVisits,
      visitsMonth: this.db.monthlyVisits,
      visitsChangeWeek: 11.7
    };
  }

  // --- Charts Analytics by Time Range ---
  public getChartData(range: TimeRange): ChartDataPoint[] {
    if (range === 'today') {
      return [
        { date: '۰۰:۰۰', sales: 450000, orders: 1, visitors: 120, newUsers: 0 },
        { date: '۰۴:۰۰', sales: 0, orders: 0, visitors: 35, newUsers: 0 },
        { date: '۰۸:۰۰', sales: 1200000, orders: 2, visitors: 340, newUsers: 1 },
        { date: '۱۲:۰۰', sales: 4850000, orders: 4, visitors: 890, newUsers: 2 },
        { date: '۱۶:۰۰', sales: 7400000, orders: 5, visitors: 1240, newUsers: 1 },
        { date: '۲۰:۰۰', sales: 9100000, orders: 7, visitors: 1680, newUsers: 3 },
        { date: '۲۳:۵۹', sales: 3200000, orders: 3, visitors: 650, newUsers: 1 }
      ];
    }

    if (range === '7days') {
      return [
        { date: 'شنبه', sales: 8400000, orders: 6, visitors: 3200, newUsers: 3 },
        { date: 'یکشنبه', sales: 11200000, orders: 8, visitors: 3650, newUsers: 4 },
        { date: 'دوشنبه', sales: 9800000, orders: 7, visitors: 3400, newUsers: 5 },
        { date: 'سه‌شنبه', sales: 14500000, orders: 11, visitors: 4100, newUsers: 6 },
        { date: 'چهارشنبه', sales: 16200000, orders: 12, visitors: 4350, newUsers: 4 },
        { date: 'پنج‌شنبه', sales: 13900000, orders: 10, visitors: 3950, newUsers: 5 },
        { date: 'جمعه', sales: 18400000, orders: 14, visitors: 4900, newUsers: 7 }
      ];
    }

    if (range === '30days') {
      return [
        { date: 'هفته ۱', sales: 48000000, orders: 38, visitors: 18500, newUsers: 22 },
        { date: 'هفته ۲', sales: 62000000, orders: 49, visitors: 22400, newUsers: 31 },
        { date: 'هفته ۳', sales: 58500000, orders: 45, visitors: 21100, newUsers: 26 },
        { date: 'هفته ۴', sales: 79500000, orders: 62, visitors: 28900, newUsers: 39 }
      ];
    }

    if (range === '3months') {
      return [
        { date: 'تیر', sales: 182000000, orders: 140, visitors: 68000, newUsers: 85 },
        { date: 'مرداد', sales: 215000000, orders: 168, visitors: 79000, newUsers: 104 },
        { date: 'شهریور', sales: 248000000, orders: 194, visitors: 92000, newUsers: 122 }
      ];
    }

    if (range === '6months') {
      return [
        { date: 'فروردین', sales: 125000000, orders: 98, visitors: 48000, newUsers: 55 },
        { date: 'اردیبهشت', sales: 149000000, orders: 118, visitors: 56000, newUsers: 68 },
        { date: 'خرداد', sales: 168000000, orders: 132, visitors: 63000, newUsers: 79 },
        { date: 'تیر', sales: 182000000, orders: 140, visitors: 68000, newUsers: 85 },
        { date: 'مرداد', sales: 215000000, orders: 168, visitors: 79000, newUsers: 104 },
        { date: 'شهریور', sales: 248000000, orders: 194, visitors: 92000, newUsers: 122 }
      ];
    }

    // year
    return [
      { date: 'پاییز ۱۴۰۳', sales: 380000000, orders: 290, visitors: 145000, newUsers: 190 },
      { date: 'زمستان ۱۴۰۳', sales: 490000000, orders: 380, visitors: 189000, newUsers: 250 },
      { date: 'بهار ۱۴۰۴', sales: 442000000, orders: 348, visitors: 167000, newUsers: 202 },
      { date: 'تابستان ۱۴۰۴', sales: 645000000, orders: 502, visitors: 239000, newUsers: 311 }
    ];
  }

  // --- Bestselling Products ---
  public getBestsellers(sortBy: 'sales' | 'revenue' | 'views' | 'stock-asc' = 'sales'): BestsellerItem[] {
    const totalRev = this.db.products.reduce((s, p) => s + p.price * p.soldCount, 0) || 1;

    const items: BestsellerItem[] = this.db.products.map(p => {
      const revenue = p.price * p.soldCount;
      const sharePercent = Number(((revenue / totalRev) * 100).toFixed(1));
      return {
        id: p.id,
        name: p.name,
        nameFa: p.nameFa,
        image: p.images[0],
        categoryFa: p.categoryFa,
        price: p.price,
        soldCount: p.soldCount,
        revenue,
        stock: p.stock,
        sharePercent,
        views: p.views
      };
    });

    if (sortBy === 'sales') items.sort((a, b) => b.soldCount - a.soldCount);
    else if (sortBy === 'revenue') items.sort((a, b) => b.revenue - a.revenue);
    else if (sortBy === 'views') items.sort((a, b) => b.views - a.views);
    else if (sortBy === 'stock-asc') items.sort((a, b) => a.stock - b.stock);

    return items;
  }

  // --- Most Viewed Products ---
  public getMostViewed(): MostViewedItem[] {
    return this.db.products
      .map(p => {
        const conv = p.views > 0 ? Number(((p.soldCount / p.views) * 100).toFixed(1)) : 0;
        return {
          id: p.id,
          name: p.name,
          nameFa: p.nameFa,
          image: p.images[0],
          views: p.views,
          cartAdds: p.cartAdds,
          purchases: p.soldCount,
          conversionRate: conv
        };
      })
      .sort((a, b) => b.views - a.views);
  }

  // --- User Behavior & Analytics ---
  public getUserBehavior(): UserBehaviorData {
    return {
      onlineUsers: 28,
      dailyVisits: this.db.dailyVisits,
      weeklyVisits: this.db.weeklyVisits,
      monthlyVisits: this.db.monthlyVisits,
      conversionRate: 3.8, // percentage
      cartAdditions: 412,
      successfulPurchases: 156,
      abandonmentRate: 62.1, // percentage
      trafficSources: [
        { name: 'جستجوی ارگانیک (گوگل)', percent: 46, visits: 12190, color: '#6366F1' },
        { name: 'ورود مستقیم (Direct)', percent: 24, visits: 6360, color: '#10B981' },
        { name: 'اینستاگرام و تلگرام', percent: 18, visits: 4770, color: '#EC4899' },
        { name: 'سایر وبلاگ‌ها و بک‌لینک', percent: 12, visits: 3180, color: '#F59E0B' }
      ],
      devices: [
        { name: 'گوشی همراه (Mobile)', percent: 68, count: 18020, color: '#6366F1' },
        { name: 'کامپیوتر رومیزی (Desktop)', percent: 27, count: 7155, color: '#3B82F6' },
        { name: 'تبلت (Tablet)', percent: 5, count: 1325, color: '#8B5CF6' }
      ],
      topPages: [
        { path: '/', title: 'صفحه اصلی لومینا استور', views: 18450, bounceRate: '۲۶٪' },
        { path: '/shop', title: 'فروشگاه و آرشیو محصولات', views: 9820, bounceRate: '۳۱٪' },
        { path: '/product/lum-01', title: 'هدفون Horizon ANC Pro', views: 5410, bounceRate: '۱۹٪' },
        { path: '/product/lum-02', title: 'ساعت هوشمند Aura Titan', views: 4290, bounceRate: '۲۲٪' },
        { path: '/cart', title: 'سبد خرید و سفارش', views: 3100, bounceRate: '۱۴٪' }
      ],
      browsers: [
        { name: 'Chrome', percent: 64 },
        { name: 'Safari', percent: 26 },
        { name: 'Firefox', percent: 6 },
        { name: 'Edge & Other', percent: 4 }
      ],
      operatingSystems: [
        { name: 'Android', percent: 48 },
        { name: 'iOS', percent: 32 },
        { name: 'Windows', percent: 16 },
        { name: 'macOS & Linux', percent: 4 }
      ]
    };
  }

  // --- Product-Specific Analytics & Real Event Tracking ---

  public generateInitialProductEvents(products: any[], orders: any[]): ProductAnalyticsEvent[] {
    const events: ProductAnalyticsEvent[] = [];
    const now = Date.now();
    const dayMs = 86400000;

    // 1. Generate purchase_success events directly from real historical orders
    if (Array.isArray(orders)) {
      for (const order of orders) {
        if (order.status === 'cancelled') continue;
        const orderTime = order.timestamp || (order.createdAt ? new Date(order.createdAt).getTime() : now - Math.floor(Math.random() * 30) * dayMs);
        if (Array.isArray(order.items)) {
          for (const item of order.items) {
            const pId = item.productId || item.id;
            events.push({
              id: `evt-pur-${Math.random().toString(36).substr(2, 9)}`,
              productId: pId,
              eventType: 'purchase_success',
              timestamp: orderTime,
              userId: order.customer?.email || 'customer@lumina.io',
              metadata: {
                orderId: order.id,
                quantity: item.quantity || 1,
                price: item.price,
                color: item.selectedColor?.name || item.color,
                size: item.selectedSize || item.size,
                variantId: item.variantId
              }
            });
          }
        }
      }
    }

    // 2. Generate distributed views and cart adds per product over the last 90 days
    for (const p of products) {
      const targetViews = Math.max(p.views || 250, 180);
      const targetCartAdds = Math.max(p.cartAdds || 35, 25);

      // Views distributed over 90 days
      for (let i = 0; i < targetViews; i++) {
        // Skew towards recent days (exponential decay for realistic analytics)
        const daysAgo = Math.floor(Math.pow(Math.random(), 1.6) * 89);
        const randomHour = Math.floor(Math.random() * 24);
        const randomMinute = Math.floor(Math.random() * 60);
        const eventTime = now - (daysAgo * dayMs) + (randomHour * 3600000) + (randomMinute * 60000);

        events.push({
          id: `evt-vw-${Math.random().toString(36).substr(2, 9)}`,
          productId: p.id,
          eventType: 'product_view',
          timestamp: eventTime,
          sessionId: `sess-${Math.floor(Math.random() * 50000)}`,
          metadata: {
            referrer: daysAgo % 3 === 0 ? 'google' : daysAgo % 3 === 1 ? 'direct' : 'instagram'
          }
        });
      }

      // Cart adds
      for (let i = 0; i < targetCartAdds; i++) {
        const daysAgo = Math.floor(Math.pow(Math.random(), 1.5) * 85);
        const eventTime = now - (daysAgo * dayMs) + (Math.floor(Math.random() * 24) * 3600000);

        events.push({
          id: `evt-ca-${Math.random().toString(36).substr(2, 9)}`,
          productId: p.id,
          eventType: 'add_to_cart',
          timestamp: eventTime,
          sessionId: `sess-${Math.floor(Math.random() * 50000)}`
        });
      }

      // Variant clicks if product has colors or sizes
      if (Array.isArray(p.colors) && p.colors.length > 0) {
        for (let i = 0; i < Math.floor(targetViews * 0.4); i++) {
          const colorObj = p.colors[i % p.colors.length];
          const daysAgo = Math.floor(Math.random() * 60);
          events.push({
            id: `evt-col-${Math.random().toString(36).substr(2, 9)}`,
            productId: p.id,
            eventType: 'color_select',
            timestamp: now - (daysAgo * dayMs),
            metadata: { color: colorObj.name || colorObj.hex }
          });
        }
      }
    }

    // Sort chronologically
    events.sort((a, b) => a.timestamp - b.timestamp);
    return events;
  }

  public generateInitialFavorites(products: any[], users: any[]): ProductFavoriteRecord[] {
    const favorites: ProductFavoriteRecord[] = [];
    const now = Date.now();
    const dayMs = 86400000;

    const baseUserIds = Array.isArray(users) && users.length > 0
      ? users.map(u => u.id || u.email)
      : ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'];

    for (const p of products) {
      // Calculate realistic favorite count based on product popularity (60 to 240)
      const count = Math.max(45, Math.floor((p.soldCount || 20) * 1.6) + Math.floor(Math.random() * 50));
      const userSet = new Set<string>();

      for (let i = 0; i < count; i++) {
        let uId: string;
        if (i < baseUserIds.length) {
          uId = baseUserIds[i];
        } else {
          uId = `usr-${1000 + i}-${p.id.slice(0, 3)}`;
        }

        if (!userSet.has(uId)) {
          userSet.add(uId);
          const daysAgo = Math.floor(Math.random() * 90);
          favorites.push({
            productId: p.id,
            userId: uId,
            createdAt: now - (daysAgo * dayMs)
          });
        }
      }
    }

    return favorites;
  }

  public generateInitialProductShares(products: any[]): { productId: string; timestamp: number; platform?: string; userId?: string }[] {
    const shares: { productId: string; timestamp: number; platform?: string; userId?: string }[] = [];
    const now = Date.now();
    const dayMs = 86400000;
    const platforms = ['telegram', 'whatsapp', 'instagram', 'copy_link', 'twitter'];

    for (const p of products) {
      const shareCount = Math.max(12, Math.floor((p.soldCount || 10) * 0.4) + Math.floor(Math.random() * 18));
      for (let i = 0; i < shareCount; i++) {
        const daysAgo = Math.floor(Math.random() * 60);
        shares.push({
          productId: p.id,
          timestamp: now - (daysAgo * dayMs),
          platform: platforms[i % platforms.length],
          userId: `usr-share-${i}`
        });
      }
    }
    return shares;
  }

  // --- Real Event Recording & Anti-Fraud Rate Limiting ---
  public recordProductEvent(eventData: {
    productId: string;
    eventType: ProductAnalyticsEventType;
    userId?: string;
    sessionId?: string;
    metadata?: any;
  }): ProductAnalyticsEvent | null {
    if (!this.db.productEvents) this.db.productEvents = [];
    const prod = this.db.products.find(p => p.id === eventData.productId);
    if (!prod) return null;

    const now = Date.now();

    // Anti-Fraud / Deduplication for Product Views:
    // If the same user or session has viewed this exact product within the past 5 minutes, do not artificially inflate.
    if (eventData.eventType === 'product_view') {
      const userKey = eventData.userId || eventData.sessionId;
      if (userKey) {
        const recentDuplicate = this.db.productEvents.find(
          e => e.productId === eventData.productId &&
               e.eventType === 'product_view' &&
               (e.userId === userKey || e.sessionId === userKey) &&
               (now - e.timestamp) < 300000 // 5 minutes
        );
        if (recentDuplicate) {
          // Skip duplicate view count
          return recentDuplicate;
        }
      }
      prod.views++;
    } else if (eventData.eventType === 'add_to_cart') {
      prod.cartAdds++;
    } else if (eventData.eventType === 'share') {
      if (!this.db.productShares) this.db.productShares = [];
      this.db.productShares.push({
        productId: eventData.productId,
        timestamp: now,
        platform: eventData.metadata?.platform || 'web',
        userId: eventData.userId
      });
    }

    const newEvent: ProductAnalyticsEvent = {
      id: `evt-${Math.random().toString(36).substr(2, 9)}`,
      productId: eventData.productId,
      eventType: eventData.eventType,
      timestamp: now,
      userId: eventData.userId,
      sessionId: eventData.sessionId,
      metadata: eventData.metadata
    };

    this.db.productEvents.push(newEvent);

    // Keep bounded memory/file size (max 25,000 events)
    if (this.db.productEvents.length > 25000) {
      this.db.productEvents = this.db.productEvents.slice(-20000);
    }

    this.saveToDisk(this.db);
    return newEvent;
  }

  // --- Favorite Operations ---
  public toggleProductFavorite(productId: string, userId: string): { favorited: boolean; count: number } {
    if (!this.db.favorites) this.db.favorites = [];
    const idx = this.db.favorites.findIndex(f => f.productId === productId && f.userId === userId);
    let favorited = false;

    if (idx >= 0) {
      this.db.favorites.splice(idx, 1);
      favorited = false;
      this.recordProductEvent({
        productId,
        eventType: 'remove_from_favorite',
        userId
      });
    } else {
      this.db.favorites.push({
        productId,
        userId,
        createdAt: Date.now()
      });
      favorited = true;
      this.recordProductEvent({
        productId,
        eventType: 'add_to_favorite',
        userId
      });
    }

    this.saveToDisk(this.db);
    const count = this.db.favorites.filter(f => f.productId === productId).length;
    return { favorited, count };
  }

  public isProductFavorited(productId: string, userId?: string): boolean {
    if (!userId || !this.db.favorites) return false;
    return this.db.favorites.some(f => f.productId === productId && f.userId === userId);
  }

  public getProductFavoritesCount(productId: string): number {
    if (!this.db.favorites) return 0;
    return this.db.favorites.filter(f => f.productId === productId).length;
  }

  // --- Detailed Product Analytics Engine (for Admin & Performance View) ---
  public getProductAnalytics(
    productId: string,
    timeRange: ProductAnalyticsTimeRange = '30days',
    currentUserId?: string
  ): ProductAnalyticsSummary | null {
    const product = this.db.products.find(p => p.id === productId);
    if (!product) return null;

    const now = Date.now();
    const dayMs = 86400000;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayTimestamp = startOfToday.getTime();
    const weekTimestamp = now - 7 * dayMs;
    const monthTimestamp = now - 30 * dayMs;

    const events = (this.db.productEvents || []).filter(e => e.productId === productId);
    const favorites = (this.db.favorites || []).filter(f => f.productId === productId);
    const shares = (this.db.productShares || []).filter(s => s.productId === productId);

    // 1. Views
    const viewEvents = events.filter(e => e.eventType === 'product_view');
    const viewsToday = viewEvents.filter(e => e.timestamp >= todayTimestamp).length;
    const viewsWeek = viewEvents.filter(e => e.timestamp >= weekTimestamp).length;
    const viewsMonth = viewEvents.filter(e => e.timestamp >= monthTimestamp).length;
    const viewsAllTime = Math.max(product.views, viewEvents.length);

    // 2. Favorites
    const favoritesCount = favorites.length;
    const isFavoritedByCurrentUser = currentUserId ? favorites.some(f => f.userId === currentUserId) : false;

    // 3. Cart Adds
    const cartAddEvents = events.filter(e => e.eventType === 'add_to_cart');
    const cartAddsCount = Math.max(product.cartAdds, cartAddEvents.length);

    // 4. Sales and Orders (source of truth: non-cancelled orders)
    const validOrders = (this.db.orders || []).filter(o => o.status !== 'cancelled');
    const productOrderItems: { order: any; item: any }[] = [];
    const uniqueBuyersSet = new Set<string>();

    let totalSalesCount = 0;
    let totalRevenue = 0;
    let salesCountToday = 0;
    let salesCountWeek = 0;
    let salesCountMonth = 0;
    let successfulPurchasesCount = 0;

    for (const order of validOrders) {
      let orderHasProduct = false;
      const orderTime = order.timestamp || (order.createdAt ? new Date(order.createdAt).getTime() : now);

      if (Array.isArray(order.items)) {
        for (const item of order.items) {
          if (item.productId === productId || item.id === productId) {
            orderHasProduct = true;
            const qty = Number(item.quantity) || 1;
            const price = Number(item.price) || product.price;

            totalSalesCount += qty;
            totalRevenue += qty * price;

            if (orderTime >= todayTimestamp) salesCountToday += qty;
            if (orderTime >= weekTimestamp) salesCountWeek += qty;
            if (orderTime >= monthTimestamp) salesCountMonth += qty;

            productOrderItems.push({ order, item });
          }
        }
      }

      if (orderHasProduct) {
        successfulPurchasesCount++;
        const buyerId = order.customer?.email || order.customer?.phone || order.customer?.name || order.id;
        if (buyerId) uniqueBuyersSet.add(buyerId);
      }
    }

    // Consistency check with product.soldCount
    if (product.soldCount > totalSalesCount) {
      totalSalesCount = product.soldCount;
      totalRevenue = Math.max(totalRevenue, product.soldCount * product.price);
    }
    const uniqueBuyersCount = Math.max(
      uniqueBuyersSet.size,
      Math.min(successfulPurchasesCount, Math.ceil(totalSalesCount * 0.85))
    );

    // 5. Ratings & Reviews
    const prodReviews = (this.db.reviews || []).filter(
      r => r.productId === productId && (r.status === 'approved' || r.status === undefined)
    );
    const reviewsCount = prodReviews.length || product.reviewsCount;
    const averageRating = prodReviews.length > 0
      ? Number((prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length).toFixed(1))
      : product.rating;
    const ratingCount = prodReviews.length || Math.floor(reviewsCount * 0.9);
    const shareCount = shares.length + events.filter(e => e.eventType === 'share').length;

    // 6. Conversion Rate & Funnel
    const conversionRate = viewsAllTime > 0
      ? Number(((successfulPurchasesCount / viewsAllTime) * 100).toFixed(1))
      : 0;
    const viewToFavoriteRate = viewsAllTime > 0
      ? Number(((favoritesCount / viewsAllTime) * 100).toFixed(1))
      : 0;
    const viewToCartRate = viewsAllTime > 0
      ? Number(((cartAddsCount / viewsAllTime) * 100).toFixed(1))
      : 0;
    const viewToPurchaseRate = conversionRate;

    // 7. Algorithmic Popularity Score (0-100)
    const normRating = (averageRating / 5) * 100;
    const normSales = Math.min(100, (totalSalesCount / 70) * 100);
    const normFavs = Math.min(100, (favoritesCount / 140) * 100);
    const normViews = Math.min(100, (viewsAllTime / 700) * 100);
    const normConv = Math.min(100, (conversionRate / 6) * 100);

    const popularityScore = Math.min(
      99,
      Math.max(
        50,
        Math.round(
          normRating * 0.25 +
          normSales * 0.25 +
          normFavs * 0.20 +
          normConv * 0.15 +
          normViews * 0.15
        )
      )
    );

    let popularityLabelFa = 'کالای استاندارد';
    if (popularityScore >= 90) popularityLabelFa = 'فوق‌العاده محبوب • در ۵٪ برتر فروشگاه';
    else if (popularityScore >= 80) popularityLabelFa = 'بسیار محبوب • انتخاب ویژه کاربران';
    else if (popularityScore >= 70) popularityLabelFa = 'پرفروش و پرطرفدار • رضایت بالای خریداران';
    else if (popularityScore >= 60) popularityLabelFa = 'روند صعودی و تقاضای مداوم';

    // 8. Share of Store & Growth
    const shareOfStore = this.calculateProductShareOfStore(productId, timeRange);

    // 9. Category Benchmark
    const categoryBenchmark = this.calculateCategoryBenchmark(productId);

    // 10. Variant Stats
    const variantStats = this.calculateVariantStats(product, events, productOrderItems);

    // 11. Chart Data
    const chartData = this.generateProductChartData(productId, timeRange, events, validOrders);

    return {
      productId: product.id,
      productNameFa: product.nameFa,
      productName: product.name,
      category: product.category,
      categoryFa: product.categoryFa,
      price: product.price,
      stock: product.stock,
      image: product.primaryImage || product.images[0] || '',

      viewsToday,
      viewsWeek,
      viewsMonth,
      viewsAllTime,

      favoritesCount,
      isFavoritedByCurrentUser,

      cartAddsCount,
      successfulPurchasesCount,
      uniqueBuyersCount,
      salesCountToday,
      salesCountWeek,
      salesCountMonth,
      totalSalesCount,
      totalRevenue,

      averageRating,
      ratingCount,
      reviewsCount,
      shareCount,

      popularityScore,
      popularityLabelFa,
      conversionRate,
      viewToFavoriteRate,
      viewToCartRate,
      viewToPurchaseRate,

      shareOfStore,
      categoryBenchmark,
      variantStats,
      chartData
    };
  }

  // --- Public Social Stats (for user product page) ---
  public getProductPublicStats(productId: string): ProductPublicSocialStats | null {
    const p = this.db.products.find(x => x.id === productId);
    if (!p) return null;

    const favorites = (this.db.favorites || []).filter(f => f.productId === productId);
    const validOrders = (this.db.orders || []).filter(o => o.status !== 'cancelled');
    const uniqueBuyersSet = new Set<string>();

    let totalSold = 0;
    for (const order of validOrders) {
      let hasProd = false;
      if (Array.isArray(order.items)) {
        for (const item of order.items) {
          if (item.productId === productId || item.id === productId) {
            hasProd = true;
            totalSold += Number(item.quantity) || 1;
          }
        }
      }
      if (hasProd) {
        const b = order.customer?.email || order.customer?.phone || order.customer?.name || order.id;
        if (b) uniqueBuyersSet.add(b);
      }
    }
    totalSold = Math.max(totalSold, p.soldCount);
    const uniqueBuyersCount = Math.max(uniqueBuyersSet.size, Math.min(totalSold, Math.ceil(totalSold * 0.85)));

    const prodReviews = (this.db.reviews || []).filter(
      r => r.productId === productId && (r.status === 'approved' || r.status === undefined)
    );
    const rating = prodReviews.length > 0
      ? Number((prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length).toFixed(1))
      : p.rating;
    const reviewsCount = prodReviews.length || p.reviewsCount;

    const normRating = (rating / 5) * 100;
    const normSales = Math.min(100, (totalSold / 70) * 100);
    const normFavs = Math.min(100, (favorites.length / 140) * 100);
    const popularityScore = Math.min(99, Math.max(52, Math.round(normRating * 0.35 + normSales * 0.35 + normFavs * 0.3)));

    const sameCategory = this.db.products.filter(x => x.category === p.category);
    const betterOrEqualCount = sameCategory.filter(x => x.soldCount <= totalSold).length;
    const isTopInCategory = sameCategory.length > 0 ? (betterOrEqualCount / sameCategory.length) >= 0.7 : true;

    let popularityLabelFa = 'محبوب و پرفروش';
    if (popularityScore >= 90) popularityLabelFa = 'فوق‌العاده محبوب • یکی از برترین انتخاب‌های خریداران';
    else if (popularityScore >= 80) popularityLabelFa = 'بسیار محبوب • رضایت بالای مشتریان';

    return {
      productId: p.id,
      favoritesCount: favorites.length,
      uniqueBuyersCount,
      soldCount: totalSold,
      rating,
      reviewsCount,
      popularityScore,
      popularityLabelFa,
      viewsAllTime: p.views,
      isTopInCategory,
      categoryNameFa: p.categoryFa
    };
  }

  // --- Helper: Share of Store Sales & Growth ---
  private calculateProductShareOfStore(productId: string, timeRange: ProductAnalyticsTimeRange): ProductShareOfStore {
    const now = Date.now();
    const dayMs = 86400000;

    let windowMs = 30 * dayMs;
    if (timeRange === 'today') windowMs = 1 * dayMs;
    else if (timeRange === '7days') windowMs = 7 * dayMs;
    else if (timeRange === '30days') windowMs = 30 * dayMs;
    else if (timeRange === '3months') windowMs = 90 * dayMs;
    else if (timeRange === '6months') windowMs = 180 * dayMs;
    else if (timeRange === 'this_year') windowMs = 365 * dayMs;
    else if (timeRange === 'all_time') windowMs = 1000 * dayMs;

    const currentPeriodStart = now - windowMs;
    const previousPeriodStart = now - 2 * windowMs;

    const validOrders = (this.db.orders || []).filter(o => o.status !== 'cancelled');

    let currentPeriodStoreRevenue = 0;
    let currentPeriodProductRevenue = 0;
    let previousPeriodProductRevenue = 0;

    for (const order of validOrders) {
      const orderTime = order.timestamp || (order.createdAt ? new Date(order.createdAt).getTime() : now);
      const isCurrent = orderTime >= currentPeriodStart && orderTime <= now;
      const isPrevious = orderTime >= previousPeriodStart && orderTime < currentPeriodStart;

      if (isCurrent) {
        currentPeriodStoreRevenue += Number(order.total) || 0;
      }

      if (Array.isArray(order.items)) {
        for (const item of order.items) {
          if (item.productId === productId || item.id === productId) {
            const rev = (Number(item.quantity) || 1) * (Number(item.price) || 0);
            if (isCurrent) currentPeriodProductRevenue += rev;
            if (isPrevious) previousPeriodProductRevenue += rev;
          }
        }
      }
    }

    // Fallback baseline for clean presentation if store recently initialized
    if (currentPeriodStoreRevenue === 0) currentPeriodStoreRevenue = 150000000;
    if (currentPeriodProductRevenue === 0) {
      const prod = this.db.products.find(p => p.id === productId);
      currentPeriodProductRevenue = (prod?.soldCount || 10) * (prod?.price || 1000000);
      currentPeriodStoreRevenue = Math.max(currentPeriodStoreRevenue, currentPeriodProductRevenue * 6);
    }

    const percentage = Number(((currentPeriodProductRevenue / currentPeriodStoreRevenue) * 100).toFixed(1));

    let growthPercentage = 0;
    if (previousPeriodProductRevenue > 0) {
      growthPercentage = Number((((currentPeriodProductRevenue - previousPeriodProductRevenue) / previousPeriodProductRevenue) * 100).toFixed(1));
    } else {
      growthPercentage = 18.5; // Positive initial trend
    }

    const growthLabel = growthPercentage >= 0
      ? `+${growthPercentage}٪ افزایش سهم فروش نسبت به بازه قبلی`
      : `${growthPercentage}٪ تغییر سهم فروش نسبت به بازه قبلی`;

    return {
      percentage,
      growthPercentage,
      timeRange,
      totalStoreRevenue: currentPeriodStoreRevenue,
      productRevenue: currentPeriodProductRevenue,
      growthLabel
    };
  }

  // --- Helper: Benchmark vs Same Category ---
  private calculateCategoryBenchmark(productId: string): ProductCategoryBenchmark {
    const product = this.db.products.find(p => p.id === productId);
    if (!product) {
      return {
        salesPercentile: 50,
        viewsPercentile: 50,
        favoritesPercentile: 50,
        conversionPercentile: 50,
        categoryNameFa: 'عمومی',
        totalProductsInCategory: 1
      };
    }

    const sameCategory = this.db.products.filter(
      p => p.category === product.category || p.categoryFa === product.categoryFa
    );
    const total = sameCategory.length || 1;

    // Calculate product's metrics
    const pFavs = (this.db.favorites || []).filter(f => f.productId === productId).length;
    const pViews = product.views || 1;
    const pSales = product.soldCount || 0;
    const pConv = pViews > 0 ? (pSales / pViews) * 100 : 0;

    let lessOrEqualSales = 0;
    let lessOrEqualViews = 0;
    let lessOrEqualFavs = 0;
    let lessOrEqualConv = 0;

    for (const item of sameCategory) {
      const itemFavs = (this.db.favorites || []).filter(f => f.productId === item.id).length;
      const itemViews = item.views || 1;
      const itemSales = item.soldCount || 0;
      const itemConv = itemViews > 0 ? (itemSales / itemViews) * 100 : 0;

      if (itemSales <= pSales) lessOrEqualSales++;
      if (itemViews <= pViews) lessOrEqualViews++;
      if (itemFavs <= pFavs) lessOrEqualFavs++;
      if (itemConv <= pConv) lessOrEqualConv++;
    }

    return {
      salesPercentile: Math.min(99, Math.max(15, Math.round((lessOrEqualSales / total) * 100))),
      viewsPercentile: Math.min(99, Math.max(15, Math.round((lessOrEqualViews / total) * 100))),
      favoritesPercentile: Math.min(99, Math.max(15, Math.round((lessOrEqualFavs / total) * 100))),
      conversionPercentile: Math.min(99, Math.max(15, Math.round((lessOrEqualConv / total) * 100))),
      categoryNameFa: product.categoryFa || product.category,
      totalProductsInCategory: total
    };
  }

  // --- Helper: Variant Performance Breakdown ---
  private calculateVariantStats(
    product: any,
    events: ProductAnalyticsEvent[],
    orderItems: { order: any; item: any }[]
  ): ProductVariantStat[] {
    const stats: ProductVariantStat[] = [];

    // Check if product has explicit variants array
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      for (const v of product.variants) {
        let salesCount = 0;
        let revenue = 0;

        for (const oi of orderItems) {
          if (oi.item.variantId === v.id || oi.item.sku === v.sku || oi.item.title === v.title) {
            const qty = Number(oi.item.quantity) || 1;
            salesCount += qty;
            revenue += qty * (Number(oi.item.price) || v.price || product.price);
          }
        }

        // Views with this variant in metadata
        const views = events.filter(
          e => e.eventType === 'product_view' &&
               (e.metadata?.variantId === v.id || e.metadata?.title === v.title)
        ).length || Math.floor(product.views / product.variants.length);

        stats.push({
          variantId: v.id,
          title: v.title || `${v.colorName || ''} ${v.size || ''}`.trim() || 'تنوع ۱',
          colorName: v.colorName,
          size: v.size,
          salesCount: Math.max(salesCount, Math.floor(product.soldCount / product.variants.length)),
          views,
          favorites: Math.floor((this.db.favorites || []).filter(f => f.productId === product.id).length / product.variants.length),
          stock: v.stock !== undefined ? v.stock : Math.floor(product.stock / product.variants.length),
          revenue: revenue || (salesCount * (v.price || product.price))
        });
      }
      return stats;
    }

    // Check if product has colors
    if (Array.isArray(product.colors) && product.colors.length > 0) {
      for (let i = 0; i < product.colors.length; i++) {
        const c = product.colors[i];
        const colorName = c.name || c.hex || `رنگ ${i + 1}`;

        let salesCount = 0;
        let revenue = 0;
        for (const oi of orderItems) {
          const itemColor = oi.item.selectedColor?.name || oi.item.color;
          if (itemColor && itemColor.toLowerCase() === colorName.toLowerCase()) {
            const qty = Number(oi.item.quantity) || 1;
            salesCount += qty;
            revenue += qty * (Number(oi.item.price) || product.price);
          }
        }

        const colorEvents = events.filter(
          e => (e.eventType === 'color_select' || e.eventType === 'product_view') &&
               (e.metadata?.color === colorName)
        ).length;

        const shareWeight = i === 0 ? 0.55 : (0.45 / Math.max(product.colors.length - 1, 1));
        const estimatedSales = Math.max(salesCount, Math.round(product.soldCount * shareWeight));

        stats.push({
          variantId: `var-col-${i}`,
          title: `رنگ ${colorName}`,
          colorName: colorName,
          salesCount: estimatedSales,
          views: Math.max(colorEvents, Math.round(product.views * shareWeight)),
          favorites: Math.round(this.getProductFavoritesCount(product.id) * shareWeight),
          stock: Math.round(product.stock * shareWeight),
          revenue: revenue || (estimatedSales * product.price)
        });
      }
      return stats;
    }

    // Fallback: single standard item
    return [
      {
        variantId: 'default',
        title: 'مدل استاندارد محصول',
        salesCount: product.soldCount,
        views: product.views,
        favorites: this.getProductFavoritesCount(product.id),
        stock: product.stock,
        revenue: product.soldCount * product.price
      }
    ];
  }

  // --- Helper: Time Series Chart Data Points ---
  private generateProductChartData(
    productId: string,
    timeRange: ProductAnalyticsTimeRange,
    events: ProductAnalyticsEvent[],
    orders: any[]
  ): ProductAnalyticsChartPoint[] {
    const now = Date.now();
    const dayMs = 86400000;
    const points: ProductAnalyticsChartPoint[] = [];

    if (timeRange === 'today') {
      const hours = [
        { label: '۰۰:۰۰', startH: 0, endH: 4 },
        { label: '۰۴:۰۰', startH: 4, endH: 8 },
        { label: '۰۸:۰۰', startH: 8, endH: 12 },
        { label: '۱۲:۰۰', startH: 12, endH: 16 },
        { label: '۱۶:۰۰', startH: 16, endH: 20 },
        { label: '۲۰:۰۰', startH: 20, endH: 24 }
      ];

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      for (const h of hours) {
        const intervalStart = new Date(startOfToday).setHours(h.startH, 0, 0, 0);
        const intervalEnd = new Date(startOfToday).setHours(h.endH, 0, 0, 0);

        const bucketEvents = events.filter(e => e.timestamp >= intervalStart && e.timestamp < intervalEnd);
        const views = bucketEvents.filter(e => e.eventType === 'product_view').length;
        const cartAdds = bucketEvents.filter(e => e.eventType === 'add_to_cart').length;
        const favorites = bucketEvents.filter(e => e.eventType === 'add_to_favorite').length;

        let salesCount = 0;
        let revenue = 0;
        for (const o of orders) {
          const ot = o.timestamp || (o.createdAt ? new Date(o.createdAt).getTime() : 0);
          if (ot >= intervalStart && ot < intervalEnd && Array.isArray(o.items)) {
            for (const item of o.items) {
              if (item.productId === productId || item.id === productId) {
                const q = Number(item.quantity) || 1;
                salesCount += q;
                revenue += q * (Number(item.price) || 0);
              }
            }
          }
        }

        points.push({
          date: h.label,
          views,
          salesCount,
          revenue,
          cartAdds,
          favorites
        });
      }
      return points;
    }

    if (timeRange === '7days') {
      const faDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
      for (let i = 6; i >= 0; i--) {
        const dayStart = now - (i + 1) * dayMs;
        const dayEnd = now - i * dayMs;

        const dateObj = new Date(dayEnd);
        const dayNameFa = faDays[(dateObj.getDay() + 1) % 7];

        const bucketEvents = events.filter(e => e.timestamp >= dayStart && e.timestamp < dayEnd);
        const views = bucketEvents.filter(e => e.eventType === 'product_view').length;
        const cartAdds = bucketEvents.filter(e => e.eventType === 'add_to_cart').length;
        const favs = bucketEvents.filter(e => e.eventType === 'add_to_favorite').length;

        let salesCount = 0;
        let revenue = 0;
        for (const o of orders) {
          const ot = o.timestamp || (o.createdAt ? new Date(o.createdAt).getTime() : 0);
          if (ot >= dayStart && ot < dayEnd && Array.isArray(o.items)) {
            for (const item of o.items) {
              if (item.productId === productId || item.id === productId) {
                const q = Number(item.quantity) || 1;
                salesCount += q;
                revenue += q * (Number(item.price) || 0);
              }
            }
          }
        }

        points.push({
          date: dayNameFa,
          views,
          salesCount,
          revenue,
          cartAdds,
          favorites: favs
        });
      }
      return points;
    }

    if (timeRange === '30days') {
      // 4 distinct weeks
      const weeks = ['هفته ۱', 'هفته ۲', 'هفته ۳', 'هفته ۴'];
      for (let w = 3; w >= 0; w--) {
        const wStart = now - (w + 1) * 7 * dayMs;
        const wEnd = now - w * 7 * dayMs;

        const bucketEvents = events.filter(e => e.timestamp >= wStart && e.timestamp < wEnd);
        const views = bucketEvents.filter(e => e.eventType === 'product_view').length;
        const cartAdds = bucketEvents.filter(e => e.eventType === 'add_to_cart').length;
        const favs = bucketEvents.filter(e => e.eventType === 'add_to_favorite').length;

        let salesCount = 0;
        let revenue = 0;
        for (const o of orders) {
          const ot = o.timestamp || (o.createdAt ? new Date(o.createdAt).getTime() : 0);
          if (ot >= wStart && ot < wEnd && Array.isArray(o.items)) {
            for (const item of o.items) {
              if (item.productId === productId || item.id === productId) {
                const q = Number(item.quantity) || 1;
                salesCount += q;
                revenue += q * (Number(item.price) || 0);
              }
            }
          }
        }

        points.push({
          date: weeks[3 - w],
          views,
          salesCount,
          revenue,
          cartAdds,
          favorites: favs
        });
      }
      return points;
    }

    if (timeRange === '3months' || timeRange === '6months') {
      const numMonths = timeRange === '3months' ? 3 : 6;
      const monthNames = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

      for (let m = numMonths - 1; m >= 0; m--) {
        const mStart = now - (m + 1) * 30 * dayMs;
        const mEnd = now - m * 30 * dayMs;

        const bucketEvents = events.filter(e => e.timestamp >= mStart && e.timestamp < mEnd);
        const views = bucketEvents.filter(e => e.eventType === 'product_view').length;
        const cartAdds = bucketEvents.filter(e => e.eventType === 'add_to_cart').length;
        const favs = bucketEvents.filter(e => e.eventType === 'add_to_favorite').length;

        let salesCount = 0;
        let revenue = 0;
        for (const o of orders) {
          const ot = o.timestamp || (o.createdAt ? new Date(o.createdAt).getTime() : 0);
          if (ot >= mStart && ot < mEnd && Array.isArray(o.items)) {
            for (const item of o.items) {
              if (item.productId === productId || item.id === productId) {
                const q = Number(item.quantity) || 1;
                salesCount += q;
                revenue += q * (Number(item.price) || 0);
              }
            }
          }
        }

        const labelIndex = (12 + 5 - m) % 12; // Persian month alignment
        points.push({
          date: monthNames[labelIndex] || `ماه ${numMonths - m}`,
          views,
          salesCount,
          revenue,
          cartAdds,
          favorites: favs
        });
      }
      return points;
    }

    // Default / this_year / all_time
    const seasons = ['پاییز ۱۴۰۳', 'زمستان ۱۴۰۳', 'بهار ۱۴۰۴', 'تابستان ۱۴۰۴'];
    for (let s = 3; s >= 0; s--) {
      const sStart = now - (s + 1) * 90 * dayMs;
      const sEnd = now - s * 90 * dayMs;

      const bucketEvents = events.filter(e => e.timestamp >= sStart && e.timestamp < sEnd);
      const views = bucketEvents.filter(e => e.eventType === 'product_view').length;
      const cartAdds = bucketEvents.filter(e => e.eventType === 'add_to_cart').length;
      const favs = bucketEvents.filter(e => e.eventType === 'add_to_favorite').length;

      let salesCount = 0;
      let revenue = 0;
      for (const o of orders) {
        const ot = o.timestamp || (o.createdAt ? new Date(o.createdAt).getTime() : 0);
        if (ot >= sStart && ot < sEnd && Array.isArray(o.items)) {
          for (const item of o.items) {
            if (item.productId === productId || item.id === productId) {
              const q = Number(item.quantity) || 1;
              salesCount += q;
              revenue += q * (Number(item.price) || 0);
            }
          }
        }
      }

      points.push({
        date: seasons[3 - s],
        views,
        salesCount,
        revenue,
        cartAdds,
        favorites: favs
      });
    }
    return points;
  }

  // --- Live Support Agent & Chat Sessions ---
  private checkWorkingHours() {
    const WORK_START = 9; // 09:00
    const WORK_END = 21;  // 21:00
    let currentHour = new Date().getHours();
    try {
      const tehranTimeStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Tehran', hour: '2-digit', hour12: false });
      const parsed = parseInt(tehranTimeStr, 10);
      if (!isNaN(parsed)) {
        currentHour = parsed;
      }
    } catch {
      // Fallback to local system hour
    }

    const isWorkingHours = currentHour >= WORK_START && currentHour < WORK_END;
    return {
      isWorkingHours,
      workStartHour: WORK_START,
      workEndHour: WORK_END,
      workHoursText: '۰۹:۰۰ الی ۲۱:۰۰'
    };
  }

  public getAgentStatus() {
    const manualOnline = this.db.agentOnline ?? true;
    const wh = this.checkWorkingHours();
    const isOnline = manualOnline && wh.isWorkingHours;

    let offlineReason: 'outside_hours' | 'manual_offline' | undefined = undefined;
    if (!isOnline) {
      if (!wh.isWorkingHours) {
        offlineReason = 'outside_hours';
      } else {
        offlineReason = 'manual_offline';
      }
    }

    return {
      isOnline,
      manualOnline,
      isWorkingHours: wh.isWorkingHours,
      workStartHour: wh.workStartHour,
      workEndHour: wh.workEndHour,
      workHoursText: wh.workHoursText,
      offlineReason,
      activeSessionsCount: (this.db.supportSessions || []).filter(s => s.status !== 'closed').length,
      waitingUsersCount: (this.db.supportSessions || []).filter(s => s.status === 'waiting_human').length
    };
  }

  public setAgentStatus(isOnline: boolean) {
    this.db.agentOnline = isOnline;
    this.saveToDisk(this.db);
    return this.getAgentStatus();
  }

  public getSupportSessions(): SupportSession[] {
    if (!this.db.supportSessions) {
      this.db.supportSessions = [];
    }
    return [...this.db.supportSessions].sort((a, b) => b.updatedAt - a.updatedAt);
  }

  public getSupportSessionById(id: string): SupportSession | undefined {
    const sessions = this.getSupportSessions();
    return sessions.find(s => s.id === id);
  }

  public getOrCreateSupportSession(sessionId?: string, userMeta?: { userName?: string; userEmail?: string; userPhone?: string }): SupportSession {
    const sessions = this.getSupportSessions();
    let session = sessionId ? sessions.find(s => s.id === sessionId) : undefined;

    if (!session) {
      const newId = sessionId || `supp-${Date.now()}`;
      session = {
        id: newId,
        userName: userMeta?.userName || 'کاربر جدید لومینا',
        userEmail: userMeta?.userEmail || 'user@luminastore.ir',
        userPhone: userMeta?.userPhone,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'waiting_human',
        unreadByAdminCount: 0,
        unreadByUserCount: 0,
        lastMessage: '',
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'system',
            text: 'درخواست ارتباط با کارشناسان پشتیبانی لومینا ثبت شد.',
            timestamp: Date.now()
          }
        ]
      };
      this.db.supportSessions.unshift(session);
      this.saveToDisk(this.db);
    }
    return session;
  }

  public addSupportMessage(params: {
    sessionId: string;
    sender: 'user' | 'agent' | 'system';
    text: string;
    fileUrl?: string;
    fileName?: string;
    fileType?: 'image' | 'document' | 'file';
    userName?: string;
    userEmail?: string;
    userPhone?: string;
  }): { session: SupportSession; message: SupportMessage; autoReply?: SupportMessage } {
    if (!this.db.supportSessions) {
      this.db.supportSessions = [];
    }
    let session = this.db.supportSessions.find(s => s.id === params.sessionId);

    if (!session) {
      session = this.getOrCreateSupportSession(params.sessionId, {
        userName: params.userName,
        userEmail: params.userEmail,
        userPhone: params.userPhone
      });
    }

    const newMessage: SupportMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sender: params.sender,
      text: params.text,
      timestamp: Date.now(),
      fileUrl: params.fileUrl,
      fileName: params.fileName,
      fileType: params.fileType
    };

    session.messages.push(newMessage);
    session.lastMessage = params.text || (params.fileName ? `[فایل: ${params.fileName}]` : '');
    session.updatedAt = Date.now();

    if (params.sender === 'user') {
      session.unreadByAdminCount += 1;
      if (session.status === 'bot') {
        session.status = 'waiting_human';
      }
    } else if (params.sender === 'agent') {
      session.unreadByUserCount += 1;
      session.status = 'human_connected';
    }

    let autoReply: SupportMessage | undefined = undefined;

    // Auto-notify if agent is offline (due to working hours or manual toggle)
    const statusInfo = this.getAgentStatus();
    if (params.sender === 'user' && !statusInfo.isOnline) {
      let replyText = 'پشتیبانی در حال حاضر آفلاین است. پیام شما ثبت گردید و پس از آنلاین شدن کارشناسان پاسخ داده خواهد شد.';
      if (statusInfo.offlineReason === 'outside_hours') {
        replyText = `با تشکر از پیام شما. هم‌اکنون خارج از ساعت کاری (ساعت کاری: ${statusInfo.workHoursText}) هستیم. پیام شما در سامانه ثبت شد و در اول وقت کاری پاسخ داده می‌شود.`;
      }

      autoReply = {
        id: `msg-auto-${Date.now()}`,
        sender: 'system',
        text: replyText,
        timestamp: Date.now() + 100
      };
      session.messages.push(autoReply);
    }

    this.saveToDisk(this.db);
    return { session, message: newMessage, autoReply };
  }

  public markSupportReadByAdmin(sessionId: string) {
    const session = this.getSupportSessionById(sessionId);
    if (session) {
      session.unreadByAdminCount = 0;
      this.saveToDisk(this.db);
    }
  }

  public markSupportReadByUser(sessionId: string) {
    const session = this.getSupportSessionById(sessionId);
    if (session) {
      session.unreadByUserCount = 0;
      this.saveToDisk(this.db);
    }
  }

  public updateSupportSessionStatus(sessionId: string, status: SupportSession['status']) {
    const session = this.getSupportSessionById(sessionId);
    if (session) {
      session.status = status;
      this.saveToDisk(this.db);
    }
    return session;
  }

  // --- Reviews & Ratings Management ---
  public getReviews(filter?: {
    productId?: string;
    status?: string; // 'all' | 'pending' | 'approved' | 'rejected' | 'has_reply' | 'no_reply' | 'with_rating' | 'verified'
    search?: string;
    rating?: number;
  }): ProductReview[] {
    if (!this.db.reviews) {
      this.db.reviews = [...initialReviews];
      this.saveToDisk(this.db);
    }

    let list = [...this.db.reviews];

    if (filter?.productId) {
      list = list.filter(r => r.productId === filter.productId);
    }

    if (filter?.status && filter.status !== 'all') {
      if (filter.status === 'pending') list = list.filter(r => r.status === 'pending');
      else if (filter.status === 'approved') list = list.filter(r => r.status === 'approved');
      else if (filter.status === 'rejected') list = list.filter(r => r.status === 'rejected');
      else if (filter.status === 'has_reply') list = list.filter(r => !!r.adminReply);
      else if (filter.status === 'no_reply') list = list.filter(r => !r.adminReply);
      else if (filter.status === 'verified') list = list.filter(r => r.isVerifiedPurchase);
      else if (filter.status === 'with_rating') list = list.filter(r => r.rating > 0);
      else if (filter.status === 'without_rating') list = list.filter(r => !r.rating || r.rating === 0);
    }

    if (filter?.rating && filter.rating > 0) {
      list = list.filter(r => r.rating === filter.rating);
    }

    if (filter?.search && filter.search.trim()) {
      const q = filter.search.trim().toLowerCase();
      list = list.filter(r =>
        (r.userName && r.userName.toLowerCase().includes(q)) ||
        (r.comment && r.comment.toLowerCase().includes(q)) ||
        (r.productNameFa && r.productNameFa.toLowerCase().includes(q)) ||
        (r.userEmail && r.userEmail.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => b.timestamp - a.timestamp);
  }

  public getReviewById(id: string): ProductReview | undefined {
    return (this.db.reviews || []).find(r => r.id === id);
  }

  public getReviewStats(productId?: string): ReviewStats {
    const reviews = (this.db.reviews || []).filter(r => !productId || r.productId === productId);
    const approved = reviews.filter(r => r.status === 'approved');
    const pending = reviews.filter(r => r.status === 'pending');
    const rejected = reviews.filter(r => r.status === 'rejected');

    const totalRatings = approved.length;
    const totalReviews = approved.filter(r => r.comment && r.comment.trim().length > 0).length;

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;

    approved.forEach(r => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      distribution[star] = (distribution[star] || 0) + 1;
      sum += r.rating;
    });

    const averageRating = totalRatings > 0 ? Math.round((sum / totalRatings) * 10) / 10 : 5.0;

    const distributionPercentages = {
      1: totalRatings > 0 ? Math.round((distribution[1] / totalRatings) * 100) : 0,
      2: totalRatings > 0 ? Math.round((distribution[2] / totalRatings) * 100) : 0,
      3: totalRatings > 0 ? Math.round((distribution[3] / totalRatings) * 100) : 0,
      4: totalRatings > 0 ? Math.round((distribution[4] / totalRatings) * 100) : 0,
      5: totalRatings > 0 ? Math.round((distribution[5] / totalRatings) * 100) : 0,
    };

    return {
      averageRating,
      totalRatings,
      totalReviews,
      approvedReviewsCount: approved.length,
      pendingReviewsCount: pending.length,
      rejectedReviewsCount: rejected.length,
      distribution,
      distributionPercentages
    };
  }

  private sanitizeText(input: string): string {
    if (!input) return '';
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  public createOrUpdateReview(params: {
    productId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    userEmail?: string;
    rating: number;
    comment?: string;
  }): ProductReview {
    if (!this.db.reviews) {
      this.db.reviews = [...initialReviews];
    }

    const sanitizedComment = this.sanitizeText(params.comment || '');
    const product = this.getProductById(params.productId);
    const productNameFa = product ? product.nameFa : 'محصول لومینا';

    // Check if verified purchase from orders
    const userOrders = (this.db.orders || []).filter(o =>
      (o.customer?.email && params.userEmail && o.customer.email.toLowerCase() === params.userEmail.toLowerCase()) ||
      (o.customer?.name && params.userName && o.customer.name.trim() === params.userName.trim())
    );
    const hasBought = userOrders.some(o =>
      Array.isArray(o.items) && o.items.some((i: any) => i.productId === params.productId)
    );

    const nowFormatted = new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

    // Always create a new review entry to allow multiple reviews per user
    const review: ProductReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      productId: params.productId,
      productNameFa,
      userId: params.userId,
      userName: params.userName || 'کاربر لومینا',
      userAvatar: params.userAvatar,
      userEmail: params.userEmail,
      rating: Math.min(5, Math.max(1, params.rating)),
      comment: sanitizedComment,
      status: 'approved',
      isVerifiedPurchase: hasBought,
      createdAt: nowFormatted,
      timestamp: Date.now()
    };
    this.db.reviews.unshift(review);

    this.recalculateProductRating(params.productId);
    this.saveToDisk(this.db);
    return review;
  }

  public updateReviewStatus(reviewId: string, status: 'approved' | 'rejected' | 'pending'): ProductReview | null {
    const review = this.getReviewById(reviewId);
    if (!review) return null;

    review.status = status;
    review.updatedAt = new Date().toLocaleDateString('fa-IR');

    this.recalculateProductRating(review.productId);
    this.saveToDisk(this.db);
    return review;
  }

  public addOrUpdateAdminReply(reviewId: string, replyText: string, adminName = 'پشتیبانی لومینا'): ProductReview | null {
    const review = this.getReviewById(reviewId);
    if (!review) return null;

    const nowFormatted = new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

    review.adminReply = this.sanitizeText(replyText);
    review.adminReplyBy = adminName;
    review.adminReplyAt = nowFormatted;
    review.status = 'approved';

    this.recalculateProductRating(review.productId);
    this.saveToDisk(this.db);
    return review;
  }

  public deleteAdminReply(reviewId: string): ProductReview | null {
    const review = this.getReviewById(reviewId);
    if (!review) return null;

    delete review.adminReply;
    delete review.adminReplyBy;
    delete review.adminReplyAt;

    this.saveToDisk(this.db);
    return review;
  }

  public deleteReview(reviewId: string, userId?: string): boolean {
    if (!this.db.reviews) return false;

    const index = this.db.reviews.findIndex(r => r.id === reviewId);
    if (index === -1) return false;

    const review = this.db.reviews[index];
    if (userId && review.userId !== userId) {
      return false;
    }

    const productId = review.productId;
    this.db.reviews.splice(index, 1);

    this.recalculateProductRating(productId);
    this.saveToDisk(this.db);
    return true;
  }

  private recalculateProductRating(productId: string) {
    if (!this.db.products) return;

    const approvedReviews = (this.db.reviews || []).filter(r => r.productId === productId && r.status === 'approved');
    const product = this.db.products.find(p => p.id === productId);

    if (product) {
      if (approvedReviews.length > 0) {
        const sum = approvedReviews.reduce((acc, r) => acc + r.rating, 0);
        const avg = Math.round((sum / approvedReviews.length) * 10) / 10;
        product.rating = avg;
        product.reviewsCount = approvedReviews.length;
      }
    }
  }
}

export const dbManager = new DatabaseManager();
