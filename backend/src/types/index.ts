export interface ProductVariant {
  id: string;
  sku: string;
  title: string;
  titleFa: string;
  price: number;
  originalPrice?: number;
  stock: number;
  attributes: Record<string, string>;
  image?: string;
}

export interface ProductAttribute {
  id: string;
  name: string;
  nameFa: string;
  values: string[];
  valuesFa: string[];
}

export interface ProductColor {
  name: string;
  hex: string;
  available?: boolean;
}

export interface Product {
  id: string;
  name: string;
  nameFa: string;
  brand: string;
  brandFa: string;
  category: string;
  categoryFa: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  inStock: boolean;
  stock: number;
  images: string[];
  colors?: ProductColor[];
  sizes?: string[];
  hasVariants?: boolean;
  variants?: ProductVariant[];
  attributes?: ProductAttribute[];
  sku?: string;
  salesCount?: number;
  viewCount?: number;
  favoriteCount?: number;
  description?: string;
  descriptionFa?: string;
  specs?: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  nameFa: string;
  description: string;
  descriptionFa: string;
  image: string;
  productCount: number;
  subcategories: {
    id: string;
    name: string;
    nameFa: string;
    productCount: number;
  }[];
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
  selectedAttributes?: Record<string, string>;
  variantId?: string;
  variantSku?: string;
}

export interface Order {
  id: string;
  userId?: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  statusFa: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
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

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  avatar?: string;
  role: 'regular' | 'vip' | 'wholesale';
  createdAt?: string;
  status?: 'active' | 'inactive' | 'blocked';
  addresses?: any[];
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  maxDiscount?: number;
  minPurchase?: number;
  expiryDate: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  festivalId?: string;
  festivalTitle?: string;
}

export interface Festival {
  id: string;
  title: string;
  titleFa: string;
  subtitleFa?: string;
  badgeFa?: string;
  slug: string;
  descriptionFa: string;
  bannerImage: string;
  themeColor: string;
  themeColorTo?: string;
  startTimestamp: number;
  endTimestamp: number;
  isActive: boolean;
  couponCode?: string;
  couponDiscountPercent?: number;
  discountBadgeFa?: string;
  productIds: string[];
  rulesFa?: string[];
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userEmail?: string;
  rating: number;
  comment: string;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  adminReply?: {
    text: string;
    createdAt: string;
    adminName: string;
  };
}

export type TimeRange = '24h' | '7days' | '30days' | '90days' | 'all';

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'stock' | 'review' | 'system' | 'customer';
  time: string;
  read: boolean;
  link?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  averageOrderValue: number;
  aovGrowth: number;
  totalCustomers: number;
  customersGrowth: number;
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  revenueChart: { label: string; value: number }[];
  ordersChart: { label: string; value: number }[];
  topSellingProducts: any[];
  categoryDistribution: { name: string; value: number; count: number }[];
  recentOrders: Order[];
}
