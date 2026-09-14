export type Language = 'fa' | 'en';
export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'indigo' | 'emerald' | 'rose' | 'amber' | 'purple' | 'cyan';

export type VariantType = 'none' | 'color_only' | 'size_only' | 'color_size' | 'custom';

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  image?: string;
  stock?: number;
  active?: boolean;
}

export interface ProductAttribute {
  id: string;
  name: string;
  options: string[];
}

export interface ProductVariant {
  id: string;
  sku: string;
  colorId?: string;
  colorName?: string;
  colorHex?: string;
  size?: string;
  attributes?: { [key: string]: string };
  stock: number;
  price?: number; // Override price in Toman
  originalPrice?: number;
  image?: string;
  images?: string[];
  active: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  sortOrder?: number;
  isPrimary?: boolean;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  nameFa: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  parentId?: string | null;
  isActive: boolean;
  sortOrder: number;
  itemCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  nameFa: string;
  brand: string;
  category: string;
  categoryFa: string;
  rating: number;
  reviewsCount: number;
  price: number; // base price in Toman
  priceUSD?: number;
  originalPrice?: number;
  originalPriceUSD?: number;
  discountPercent?: number;
  isFlashSale?: boolean;
  flashSaleEndsAt?: number; // timestamp
  stock: number;
  soldCount: number;
  featured?: boolean;
  rank?: number; // for bestsellers: 1, 2, 3...
  images: string[];
  primaryImage?: string;
  productImages?: ProductImage[];
  description: string;
  descriptionFa: string;
  specs: { [key: string]: string };
  features: string[];
  featuresFa: string[];
  tags: string[];
  // Variants extension
  variantType?: VariantType;
  colors?: ProductColor[];
  sizes?: string[];
  customAttributes?: ProductAttribute[];
  variants?: ProductVariant[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedColorHex?: string;
  selectedSize?: string;
  selectedAttributes?: { [key: string]: string };
  selectedVariant?: ProductVariant;
  variantId?: string;
  variantSku?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productNameFa: string;
  image: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  selectedColorHex?: string;
  selectedSize?: string;
  selectedAttributes?: { [key: string]: string };
  variantId?: string;
  variantSku?: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'paid' | 'pending';
  statusFa: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    city: string;
    address: string;
    postalCode: string;
  };
  paymentMethod: string;
  trackingCode?: string;
  courierName?: string;
  estimatedDelivery?: string;
  statusAdminNote?: string;
  lastUpdatedByAdmin?: string;
}

export interface FilterState {
  searchQuery: string;
  selectedCategory: string;
  selectedBrand: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  sortBy: 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error' | 'order';
  duration?: number;
  orderId?: string;
  statusFa?: string;
  actionText?: string;
  onAction?: () => void;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role?: 'vip' | 'regular' | 'admin';
  createdAt?: string;
  addresses: {
    id: string;
    title: string;
    city: string;
    address: string;
    postalCode: string;
    isDefault: boolean;
  }[];
}

export interface StoredUser extends UserProfile {
  password?: string;
}

export interface FestivalProduct {
  productId: string;
  name?: string;
  nameFa?: string;
  brand?: string;
  image?: string;
  category?: string;
  categoryFa?: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  festivalStock: number;
  soldInFestival?: number;
  validUntil?: string;
}

export interface FestivalCoupon {
  id: string;
  code: string;
  type: 'percent' | 'fixed'; // 'percent' (e.g. 20%) or 'fixed' (e.g. 500,000 Toman)
  amount: number;
  minPurchase: number;
  maxDiscount?: number;
  maxUsage: number;
  usageCount: number;
  perUserLimit?: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  applicableCategories?: string[];
  applicableProducts?: string[];
  festivalId?: string;
}

export interface Festival {
  id: string;
  title: string;
  titleEn?: string;
  slogan?: string; // Optional promotional slogan
  sloganEn?: string;
  description?: string;
  startDate: string;
  endDate: string;
  startTimestamp: number;
  endTimestamp: number;
  isActive: boolean;
  priority: number; // 1-100, highest first
  themeColor: AccentColor;
  badgeText?: string;
  bannerImage?: string;
  discountPercent?: number;
  couponCode?: string;
  products: FestivalProduct[];
  coupons: FestivalCoupon[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  productNameFa?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userEmail?: string;
  rating: number; // 1 to 5
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  isVerifiedPurchase: boolean;
  adminReply?: string;
  adminReplyBy?: string;
  adminReplyAt?: string;
  createdAt: string;
  timestamp: number;
  updatedAt?: string;
}

export interface ReviewStats {
  averageRating: number;
  totalRatings: number;
  totalReviews: number;
  approvedReviewsCount: number;
  pendingReviewsCount: number;
  rejectedReviewsCount: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  distributionPercentages: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
