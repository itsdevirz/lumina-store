import { Product, Order, UserProfile, Festival, FestivalProduct, FestivalCoupon } from '../types';

export type { Festival, FestivalProduct, FestivalCoupon };


export interface DashboardStats {
  totalUsers: number;
  newUsersToday: number;
  newUsersWeek: number;
  newUsersMonth: number;
  usersChangeWeek: number; // percentage, e.g. +12.5

  totalProducts: number;
  activeProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;

  totalOrders: number;
  ordersToday: number;
  ordersWeek: number;
  ordersMonth: number;
  ordersChangeWeek: number; // percentage

  totalRevenue: number;
  salesToday: number;
  salesWeek: number;
  salesMonth: number;
  revenueChangeWeek: number; // percentage

  visitsToday: number;
  visitsWeek: number;
  visitsMonth: number;
  visitsChangeWeek: number; // percentage
}

export type TimeRange = 'today' | '7days' | '30days' | '3months' | '6months' | 'year';

export interface ChartDataPoint {
  date: string; // e.g. "۱۴ شهریور" or "Sat"
  sales: number; // in Toman
  orders: number;
  visitors: number;
  newUsers: number;
}

export interface BestsellerItem {
  id: string;
  name: string;
  nameFa: string;
  image: string;
  categoryFa: string;
  price: number;
  soldCount: number;
  revenue: number;
  stock: number;
  sharePercent: number;
  views: number;
}

export interface MostViewedItem {
  id: string;
  name: string;
  nameFa: string;
  image: string;
  views: number;
  cartAdds: number;
  purchases: number;
  conversionRate: number; // percentage
}

export interface UserBehaviorData {
  onlineUsers: number;
  dailyVisits: number;
  weeklyVisits: number;
  monthlyVisits: number;
  conversionRate: number;
  cartAdditions: number;
  successfulPurchases: number;
  abandonmentRate: number;
  trafficSources: { name: string; percent: number; visits: number; color: string }[];
  devices: { name: string; percent: number; count: number; color: string }[];
  topPages: { path: string; title: string; views: number; bounceRate: string }[];
  browsers: { name: string; percent: number }[];
  operatingSystems: { name: string; percent: number }[];
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'stock' | 'user' | 'system';
  read: boolean;
  linkTab?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  maxDiscount?: number;
  minPurchase: number;
  expiresAt: string;
  usageCount: number;
  maxUsage: number;
  isActive: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: 'super_admin' | 'manager' | 'support';
  avatar: string;
  lastLogin: string;
}
