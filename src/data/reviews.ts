import { ProductReview, ReviewStats } from '../types';

export const INITIAL_REVIEWS: ProductReview[] = [
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
  }
];

export function computeReviewStats(reviews: ProductReview[]): ReviewStats {
  const approved = reviews.filter(r => r.status === 'approved');
  const total = approved.length;
  const average = total > 0 ? approved.reduce((acc, r) => acc + r.rating, 0) / total : 5.0;

  const distribution: { 1: number; 2: number; 3: number; 4: number; 5: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  approved.forEach(r => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    distribution[star] = (distribution[star] || 0) + 1;
  });

  const distributionPercentages: { 1: number; 2: number; 3: number; 4: number; 5: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  (Object.keys(distribution) as unknown as (1 | 2 | 3 | 4 | 5)[]).forEach(star => {
    distributionPercentages[star] = total > 0 ? Math.round((distribution[star] / total) * 100) : 0;
  });

  return {
    averageRating: Number(average.toFixed(1)),
    totalRatings: total,
    totalReviews: total,
    approvedReviewsCount: total,
    pendingReviewsCount: reviews.filter(r => r.status === 'pending').length,
    rejectedReviewsCount: reviews.filter(r => r.status === 'rejected').length,
    distribution,
    distributionPercentages
  };
}
