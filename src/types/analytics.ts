export type ProductAnalyticsTimeRange =
  | 'today'
  | '7days'
  | '30days'
  | '3months'
  | '6months'
  | 'this_year'
  | 'all_time';

export type ProductAnalyticsEventType =
  | 'product_view'
  | 'color_select'
  | 'size_select'
  | 'variant_change'
  | 'add_to_favorite'
  | 'remove_from_favorite'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'checkout_start'
  | 'purchase_success'
  | 'share'
  | 'review_submit'
  | 'rating_submit';

export interface ProductAnalyticsEvent {
  id: string;
  productId: string;
  eventType: ProductAnalyticsEventType;
  timestamp: number;
  userId?: string;
  sessionId?: string;
  metadata?: {
    variantId?: string;
    title?: string;
    color?: string;
    size?: string;
    attributes?: Record<string, string>;
    price?: number;
    quantity?: number;
    orderId?: string;
    rating?: number;
    referrer?: string;
    platform?: string;
  };
}

export interface ProductFavoriteRecord {
  productId: string;
  userId: string;
  createdAt: number;
}

export interface ProductAnalyticsChartPoint {
  date: string;
  rawDate?: string;
  views: number;
  salesCount: number;
  revenue: number;
  cartAdds: number;
  favorites: number;
}

export interface ProductVariantStat {
  variantId?: string;
  title: string;
  colorName?: string;
  size?: string;
  salesCount: number;
  views: number;
  favorites: number;
  stock: number;
  revenue: number;
}

export interface ProductCategoryBenchmark {
  salesPercentile: number; // e.g. 87 -> higher than 87% of products in category
  viewsPercentile: number;
  favoritesPercentile: number;
  conversionPercentile: number;
  categoryNameFa: string;
  totalProductsInCategory: number;
}

export interface ProductShareOfStore {
  percentage: number; // e.g. 12.8%
  growthPercentage: number; // e.g. +23.4% compared to previous period
  timeRange: ProductAnalyticsTimeRange;
  totalStoreRevenue: number;
  productRevenue: number;
  growthLabel: string;
}

export interface ProductAnalyticsSummary {
  productId: string;
  productNameFa: string;
  productName: string;
  category: string;
  categoryFa: string;
  price: number;
  stock: number;
  image: string;

  // Views stats
  viewsToday: number;
  viewsWeek: number;
  viewsMonth: number;
  viewsAllTime: number;

  // Favorites stats
  favoritesCount: number;
  isFavoritedByCurrentUser?: boolean;

  // Cart & Purchases
  cartAddsCount: number;
  successfulPurchasesCount: number;
  uniqueBuyersCount: number;
  salesCountToday: number;
  salesCountWeek: number;
  salesCountMonth: number;
  totalSalesCount: number;
  totalRevenue: number;

  // Ratings & Reviews
  averageRating: number;
  ratingCount: number;
  reviewsCount: number;
  shareCount: number;

  // Popularity & Conversion
  popularityScore: number; // 0 to 100
  popularityLabelFa: string;
  conversionRate: number; // percentage
  viewToFavoriteRate: number;
  viewToCartRate: number;
  viewToPurchaseRate: number;

  // Store Share & Growth
  shareOfStore: ProductShareOfStore;

  // Benchmark against same category
  categoryBenchmark: ProductCategoryBenchmark;

  // Variants breakdown
  variantStats: ProductVariantStat[];

  // Time series chart data
  chartData: ProductAnalyticsChartPoint[];
}

export interface ProductPublicSocialStats {
  productId: string;
  favoritesCount: number;
  uniqueBuyersCount: number;
  soldCount: number;
  rating: number;
  reviewsCount: number;
  popularityScore: number;
  popularityLabelFa: string;
  viewsAllTime: number;
  isTopInCategory: boolean;
  categoryNameFa: string;
}
