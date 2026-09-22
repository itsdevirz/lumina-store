/**
 * Lumina E-Commerce - Frontend API Client Service
 * Encapsulates all REST API communication between Frontend (React) and Backend (Express / MySQL)
 */

import { Product, Category, Festival, ProductReview } from '../types';
import { Coupon, DashboardStats, AdminNotification } from '../types/admin';

// Helper for making typed API requests
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = endpoint.startsWith('/') ? endpoint : `/api/${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    }
  });

  const text = await response.text();
  let data: any;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(text && !text.startsWith('<') ? text : 'خطای ارتباط با سرور.');
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `HTTP Error ${response.status}`);
  }

  return data as T;
}

/* =========================================================================
   1. PRODUCTS API
   ========================================================================= */
export const ProductsApi = {
  getAll: (params?: { category?: string; search?: string; activeOnly?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.activeOnly) query.set('activeOnly', 'true');
    return request<Product[]>(`/api/products?${query.toString()}`);
  },

  getById: (id: string) => {
    return request<Product>(`/api/products/${id}`);
  },

  create: (product: Partial<Product>) => {
    return request<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(product)
    });
  },

  update: (id: string, product: Partial<Product>) => {
    return request<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product)
    });
  },

  delete: (id: string) => {
    return request<{ success: boolean; message: string }>(`/api/products/${id}`, {
      method: 'DELETE'
    });
  },

  toggleStatus: (id: string) => {
    return request<Product>(`/api/products/${id}/status`, {
      method: 'PATCH'
    });
  },

  getStats: (id: string) => {
    return request<any>(`/api/products/${id}/stats`);
  },

  getAnalytics: (id: string, timeRange = '30days', userId?: string) => {
    const query = new URLSearchParams({ timeRange });
    if (userId) query.set('userId', userId);
    return request<any>(`/api/products/${id}/analytics?${query.toString()}`);
  }
};

/* =========================================================================
   2. CATEGORIES API
   ========================================================================= */
export const CategoriesApi = {
  getAll: () => {
    return request<Category[]>('/api/categories');
  },

  getById: (id: string) => {
    return request<Category>(`/api/categories/${id}`);
  },

  create: (category: Partial<Category>) => {
    return request<Category>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(category)
    });
  },

  update: (id: string, category: Partial<Category>) => {
    return request<Category>(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category)
    });
  },

  delete: (id: string) => {
    return request<{ success: boolean; message: string }>(`/api/categories/${id}`, {
      method: 'DELETE'
    });
  }
};

/* =========================================================================
   3. ORDERS API
   ========================================================================= */
export const OrdersApi = {
  getAll: (params?: { search?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    return request<any[]>(`/api/orders?${query.toString()}`);
  },

  getUserOrders: (params: { userId?: string; email?: string; phone?: string }) => {
    const query = new URLSearchParams();
    if (params.userId) query.set('userId', params.userId);
    if (params.email) query.set('email', params.email);
    if (params.phone) query.set('phone', params.phone);
    return request<any[]>(`/api/orders/my-orders?${query.toString()}`);
  },

  getById: (id: string) => {
    return request<any>(`/api/orders/${id}`);
  },

  create: (orderData: any) => {
    return request<any>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  updateStatus: (id: string, updateData: { status: string; statusAdminNote?: string; courierName?: string; trackingNumber?: string }) => {
    return request<any>(`/api/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(updateData)
    });
  }
};

/* =========================================================================
   4. USERS & CUSTOMERS API
   ========================================================================= */
export const UsersApi = {
  getAll: (search?: string) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<any[]>(`/api/users${query}`);
  },

  toggleStatus: (id: string) => {
    return request<any>(`/api/users/${id}/status`, {
      method: 'PATCH'
    });
  },

  register: (userData: { name: string; email: string; phone: string; password?: string }) => {
    return request<{ success: boolean; user: any; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  login: (credentials: { usernameOrEmail: string; password?: string }) => {
    return request<{ success: boolean; user: any; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  updateProfile: (userId: string, profileData: any) => {
    return request<any>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ userId, ...profileData })
    });
  }
};

/* =========================================================================
   5. FESTIVALS & CAMPAIGNS API
   ========================================================================= */
export const FestivalsApi = {
  getAll: (activeOnly = false) => {
    return request<Festival[]>(`/api/festivals${activeOnly ? '?active=true' : ''}`);
  },

  getActive: () => {
    return request<Festival[]>('/api/festivals/active');
  },

  getTopActive: () => {
    return request<Festival | null>('/api/festivals/top-active');
  },

  create: (festival: Partial<Festival>) => {
    return request<Festival>('/api/festivals', {
      method: 'POST',
      body: JSON.stringify(festival)
    });
  },

  update: (id: string, festival: Partial<Festival>) => {
    return request<Festival>(`/api/festivals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(festival)
    });
  },

  delete: (id: string) => {
    return request<{ success: boolean; message: string }>(`/api/festivals/${id}`, {
      method: 'DELETE'
    });
  },

  toggleStatus: (id: string) => {
    return request<Festival>(`/api/festivals/${id}/toggle`, {
      method: 'PATCH'
    });
  }
};

/* =========================================================================
   6. COUPONS API
   ========================================================================= */
export const CouponsApi = {
  getAll: () => {
    return request<Coupon[]>('/api/coupons');
  },

  validate: (code: string, subtotal: number, items?: any[]) => {
    return request<{ valid: boolean; coupon?: any; error?: string }>('/api/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal, items })
    });
  },

  create: (coupon: Partial<Coupon>) => {
    return request<Coupon>('/api/coupons', {
      method: 'POST',
      body: JSON.stringify(coupon)
    });
  },

  update: (id: string, coupon: Partial<Coupon>) => {
    return request<Coupon>(`/api/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(coupon)
    });
  },

  delete: (id: string) => {
    return request<{ success: boolean; message: string }>(`/api/coupons/${id}`, {
      method: 'DELETE'
    });
  }
};

/* =========================================================================
   7. REVIEWS & RATINGS API
   ========================================================================= */
export const ReviewsApi = {
  getByProduct: (productId: string, userId?: string) => {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return request<{ productId: string; reviews: ProductReview[]; userReview?: ProductReview; stats: any }>(`/api/products/${productId}/reviews${query}`);
  },

  submit: (productId: string, data: { userId: string; userName: string; userAvatar?: string; rating: number; comment: string }) => {
    return request<any>(`/api/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  getAdminReviews: (filter?: { productId?: string; status?: string; search?: string; rating?: number }) => {
    const query = new URLSearchParams();
    if (filter?.productId) query.set('productId', filter.productId);
    if (filter?.status) query.set('status', filter.status);
    if (filter?.search) query.set('search', filter.search);
    if (filter?.rating) query.set('rating', String(filter.rating));
    return request<{ reviews: any[]; stats: any }>(`/api/admin/reviews?${query.toString()}`);
  },

  reply: (reviewId: string, replyText: string) => {
    return request<any>(`/api/admin/reviews/${reviewId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ reply: replyText })
    });
  },

  delete: (reviewId: string) => {
    return request<any>(`/api/admin/reviews/${reviewId}`, {
      method: 'DELETE'
    });
  }
};

/* =========================================================================
   8. ADMIN & DATABASE API
   ========================================================================= */
export const AdminApi = {
  login: (credentials: { username: string; password?: string }) => {
    return request<{ success: boolean; token?: string; admin?: any; message?: string }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  getDashboardStats: (timeRange = '30days') => {
    return request<DashboardStats>(`/api/admin/dashboard-stats?timeRange=${timeRange}`);
  },

  getNotifications: () => {
    return request<AdminNotification[]>('/api/admin/notifications');
  },

  getDatabaseStatus: () => {
    return request<{
      connected: boolean;
      database: string;
      host: string;
      port: number;
      user: string;
      error?: string;
      counts: Record<string, number>;
      mysqlCounts?: Record<string, number> | null;
    }>('/api/database/status');
  },

  testDatabaseConnection: (config?: any) => {
    return request<{
      success: boolean;
      connected: boolean;
      message: string;
      diagnostic?: string;
      error?: string;
    }>('/api/database/test-connection', {
      method: 'POST',
      body: JSON.stringify(config || {})
    });
  },

  syncToMySQL: (config?: any) => {
    return request<{
      success: boolean;
      message: string;
      diagnostic?: string;
      error?: string;
    }>('/api/database/sync-to-mysql', {
      method: 'POST',
      body: JSON.stringify(config || {})
    });
  }
};

/* =========================================================================
   9. SUPPORT & AI CHAT API
   ========================================================================= */
export const SupportApi = {
  sendMessage: (data: { message: string; history?: any[]; sessionId?: string; userId?: string }) => {
    return request<{ reply: string; sessionId?: string }>('/api/support/chat', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  getSessions: () => {
    return request<any[]>('/api/admin/support/sessions');
  },

  sendAdminReply: (sessionId: string, message: string) => {
    return request<any>(`/api/admin/support/sessions/${sessionId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }
};
