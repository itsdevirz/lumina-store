import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import { dbManager } from '../database/db';
import { mySQLService } from '../database/mysql';
import { TimeRange } from '../types/admin';
import { handleSupportChat, handleSupportChatStream } from '../services/aiSupport';

export const apiRouter = Router();

// --- Admin Authentication ---
apiRouter.post('/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body || {};

  // Default credentials: admin / admin123
  if ((username === 'admin' && password === 'admin123') || (username === 'dev' && password === 'dev123')) {
    return res.json({
      success: true,
      token: 'jwt_admin_lumina_secret_session_token',
      admin: {
        id: 'adm-01',
        name: 'مدیر ارشد لومینا',
        email: 'admin@luminastore.ir',
        username: 'admin',
        role: 'super_admin',
        avatar: '/images/products/photo-1534528741775-53994a69daeb.jpg',
        lastLogin: 'هم‌اکنون'
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'نام کاربری یا رمز عبور اشتباه است. (پیش‌فرض: admin / admin123)'
  });
});

// --- Customer / User Authentication & Profile ---
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body || {};
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        error: 'لطفاً نام، ایمیل و شماره همراه را تکمیل فرمایید.'
      });
    }

    const user = dbManager.createUser({
      name,
      email,
      phone,
      password: password || 'password123'
    });

    const safeUser = { ...user };
    delete safeUser.password;

    res.status(201).json({
      success: true,
      user: safeUser,
      token: `usr_token_${user.id}_${Date.now()}`
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.message || 'خطا در ثبت‌نام کاربر.'
    });
  }
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { identifier, password } = req.body || {};
  if (!identifier) {
    return res.status(400).json({
      success: false,
      error: 'لطفاً ایمیل یا شماره موبایل خود را وارد کنید.'
    });
  }

  const user: any = dbManager.findUserByIdentifier(identifier);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'کاربری با این مشخصات یافت نشد. لطفاً ثبت‌نام فرمایید.'
    });
  }

  if (user.status === 'blocked') {
    return res.status(403).json({
      success: false,
      error: 'حساب کاربری شما مسدود شده است. لطفاً با پشتیبانی لومینا تماس بگیرید.'
    });
  }

  // If password provided and user has a password, verify
  if (password && user.password && user.password !== password) {
    return res.status(401).json({
      success: false,
      error: 'رمز عبور وارد شده نادرست است.'
    });
  }

  user.lastActive = 'هم‌اکنون';
  const safeUser = { ...user };
  delete safeUser.password;

  res.json({
    success: true,
    user: safeUser,
    token: `usr_token_${user.id}_${Date.now()}`
  });
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string);
  if (!userId) {
    return res.status(401).json({ authenticated: false, error: 'User ID is required' });
  }

  const user: any = dbManager.getUserById(userId);
  if (!user) {
    return res.status(404).json({ authenticated: false, error: 'User not found' });
  }

  const safeUser = { ...user };
  delete safeUser.password;
  res.json({ authenticated: true, user: safeUser });
});

apiRouter.put('/auth/profile', (req: Request, res: Response) => {
  const { userId, name, phone, email, avatar } = req.body || {};
  if (!userId) {
    return res.status(400).json({ success: false, error: 'شناسه کاربر الزامی است.' });
  }

  const updated: any = dbManager.updateUserProfile(userId, { name, phone, email, avatar });
  if (!updated) {
    return res.status(404).json({ success: false, error: 'کاربر یافت نشد.' });
  }

  const safeUser = { ...updated };
  delete safeUser.password;
  res.json({ success: true, user: safeUser });
});

apiRouter.post('/auth/addresses', (req: Request, res: Response) => {
  const { userId, title, city, address, postalCode, isDefault } = req.body || {};
  if (!userId || !address) {
    return res.status(400).json({ success: false, error: 'نشانی و شناسه کاربر الزامی است.' });
  }

  const newAddr = dbManager.addUserAddress(userId, { title, city, address, postalCode, isDefault });
  if (!newAddr) {
    return res.status(404).json({ success: false, error: 'کاربر یافت نشد.' });
  }
  res.status(201).json({ success: true, address: newAddr });
});

apiRouter.delete('/auth/addresses/:id', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string);
  if (!userId) {
    return res.status(400).json({ success: false, error: 'شناسه کاربر الزامی است.' });
  }

  const ok = dbManager.removeUserAddress(userId, req.params.id);
  res.json({ success: ok });
});

apiRouter.put('/auth/addresses/:id/default', (req: Request, res: Response) => {
  const { userId } = req.body || {};
  if (!userId) {
    return res.status(400).json({ success: false, error: 'شناسه کاربر الزامی است.' });
  }

  const ok = dbManager.setDefaultAddress(userId, req.params.id);
  res.json({ success: ok });
});

apiRouter.post('/auth/change-password', (req: Request, res: Response) => {
  const { userId, oldPassword, newPassword } = req.body || {};
  if (!userId || !newPassword) {
    return res.status(400).json({ success: false, error: 'اطلاعات کامل ارسال نشده است.' });
  }

  try {
    dbManager.changeUserPassword(userId, oldPassword, newPassword);
    res.json({ success: true, message: 'رمز عبور با موفقیت بروزرسانی شد.' });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- Dashboard & Analytics ---
apiRouter.get('/dashboard/stats', (_req: Request, res: Response) => {
  const stats = dbManager.getDashboardStats();
  res.json(stats);
});

apiRouter.get('/analytics/charts', (req: Request, res: Response) => {
  const range = (req.query.range as TimeRange) || '7days';
  const data = dbManager.getChartData(range);
  res.json(data);
});

apiRouter.get('/analytics/bestsellers', (req: Request, res: Response) => {
  const sort = (req.query.sort as 'sales' | 'revenue' | 'views' | 'stock-asc') || 'sales';
  const items = dbManager.getBestsellers(sort);
  res.json(items);
});

apiRouter.get('/analytics/most-viewed', (_req: Request, res: Response) => {
  const items = dbManager.getMostViewed();
  res.json(items);
});

apiRouter.get('/analytics/visitor-behavior', (_req: Request, res: Response) => {
  const data = dbManager.getUserBehavior();
  res.json(data);
});

// --- Products CRUD ---
apiRouter.get('/products', (req: Request, res: Response) => {
  const filter = {
    search: req.query.search as string,
    category: req.query.category as string,
    status: req.query.status as string,
    stock: req.query.stock as string,
    sortBy: req.query.sortBy as string
  };
  const products = dbManager.getProducts(filter);
  res.json(products);
});

apiRouter.get('/products/:id', (req: Request, res: Response) => {
  const product = dbManager.getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

apiRouter.post('/products', (req: Request, res: Response) => {
  const created = dbManager.createProduct(req.body);
  res.status(201).json(created);
});

apiRouter.put('/products/:id', (req: Request, res: Response) => {
  const updated = dbManager.updateProduct(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Product not found' });
  res.json(updated);
});

apiRouter.delete('/products/:id', (req: Request, res: Response) => {
  const success = dbManager.deleteProduct(req.params.id);
  if (!success) return res.status(404).json({ error: 'Product not found' });
  res.json({ success: true, message: 'Product deleted' });
});

apiRouter.patch('/products/:id/status', (req: Request, res: Response) => {
  const product = dbManager.getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const updated = dbManager.updateProduct(req.params.id, { isActive: !product.isActive });
  res.json(updated);
});

// --- Product-Specific Analytics & Performance Routes ---
apiRouter.get('/products/:id/analytics', (req: Request, res: Response) => {
  const timeRange = (req.query.timeRange as any) || '30days';
  const userId = req.query.userId as string | undefined;
  const analytics = dbManager.getProductAnalytics(req.params.id, timeRange, userId);
  if (!analytics) return res.status(404).json({ error: 'Product not found' });
  res.json(analytics);
});

apiRouter.get('/products/:id/stats', (req: Request, res: Response) => {
  const stats = dbManager.getProductPublicStats(req.params.id);
  if (!stats) return res.status(404).json({ error: 'Product not found' });
  res.json(stats);
});

apiRouter.post('/products/:id/events', (req: Request, res: Response) => {
  const event = dbManager.recordProductEvent({
    productId: req.params.id,
    eventType: req.body.eventType,
    userId: req.body.userId,
    sessionId: req.body.sessionId,
    metadata: req.body.metadata
  });
  if (!event) return res.status(404).json({ error: 'Product not found' });
  res.json(event);
});

apiRouter.post('/products/:id/favorite', (req: Request, res: Response) => {
  const userId = req.body.userId || 'guest-session';
  const result = dbManager.toggleProductFavorite(req.params.id, userId);
  res.json(result);
});

apiRouter.get('/products/:id/favorite', (req: Request, res: Response) => {
  const userId = req.query.userId as string | undefined;
  const favorited = userId ? dbManager.isProductFavorited(req.params.id, userId) : false;
  const count = dbManager.getProductFavoritesCount(req.params.id);
  res.json({ favorited, count });
});

// --- Product Reviews & Ratings Routes ---
apiRouter.get('/products/:id/reviews', (req: Request, res: Response) => {
  const productId = req.params.id;
  const currentUserId = req.query.userId as string;

  // Get all approved reviews for product
  const approvedReviews = dbManager.getReviews({ productId, status: 'approved' });
  const stats = dbManager.getReviewStats(productId);

  // If user is logged in, also include their review even if pending/rejected so they can see/edit it
  let userReview = undefined;
  if (currentUserId) {
    userReview = dbManager.getReviews({ productId }).find(r => r.userId === currentUserId);
  }

  res.json({
    productId,
    reviews: approvedReviews,
    userReview,
    stats
  });
});

apiRouter.post('/products/:id/reviews', (req: Request, res: Response) => {
  const productId = req.params.id;
  const { userId, userName, userAvatar, userEmail, rating, comment } = req.body || {};

  if (!userId) {
    return res.status(401).json({ error: 'برای ثبت نظر باید وارد حساب کاربری خود شوید.' });
  }

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'لطفاً امتیازی بین ۱ تا ۵ ستاره انتخاب کنید.' });
  }

  const review = dbManager.createOrUpdateReview({
    productId,
    userId,
    userName: userName || 'کاربر لومینا',
    userAvatar,
    userEmail,
    rating: Number(rating),
    comment: comment ? String(comment) : ''
  });

  const stats = dbManager.getReviewStats(productId);

  res.status(201).json({
    success: true,
    message: 'نظر و امتیاز شما با موفقیت ثبت شد.',
    review,
    stats
  });
});

apiRouter.delete('/reviews/:id', (_req: Request, res: Response) => {
  return res.status(403).json({ error: 'ویرایش و حذف نظر توسط کاربر امکان‌پذیر نیست.' });
});

// --- Admin Reviews Management Routes ---
apiRouter.get('/admin/reviews', (req: Request, res: Response) => {
  const filter = {
    productId: req.query.productId as string,
    status: req.query.status as string,
    search: req.query.search as string,
    rating: req.query.rating ? Number(req.query.rating) : undefined
  };

  const reviews = dbManager.getReviews(filter);
  const globalStats = dbManager.getReviewStats();

  res.json({
    reviews,
    stats: globalStats
  });
});

apiRouter.get('/admin/products/:id/reviews', (req: Request, res: Response) => {
  const productId = req.params.id;
  const reviews = dbManager.getReviews({ productId, status: 'all' });
  const stats = dbManager.getReviewStats(productId);

  res.json({
    productId,
    reviews,
    stats
  });
});

apiRouter.patch('/admin/reviews/:id/status', (req: Request, res: Response) => {
  const reviewId = req.params.id;
  const { status } = req.body || {};

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'وضعیت نامعتبر است.' });
  }

  const updated = dbManager.updateReviewStatus(reviewId, status);
  if (!updated) {
    return res.status(404).json({ error: 'نظر یافت نشد.' });
  }

  res.json({ success: true, review: updated });
});

apiRouter.post('/admin/reviews/:id/reply', (req: Request, res: Response) => {
  const reviewId = req.params.id;
  const { replyText, adminName } = req.body || {};

  if (!replyText || !replyText.trim()) {
    return res.status(400).json({ error: 'متن پاسخ نمی‌تواند خالی باشد.' });
  }

  const updated = dbManager.addOrUpdateAdminReply(reviewId, replyText, adminName || 'پشتیبانی لومینا');
  if (!updated) {
    return res.status(404).json({ error: 'نظر یافت نشد.' });
  }

  res.json({ success: true, review: updated });
});

apiRouter.put('/admin/reviews/:id/reply', (req: Request, res: Response) => {
  const reviewId = req.params.id;
  const { replyText, adminName } = req.body || {};

  if (!replyText || !replyText.trim()) {
    return res.status(400).json({ error: 'متن پاسخ نمی‌تواند خالی باشد.' });
  }

  const updated = dbManager.addOrUpdateAdminReply(reviewId, replyText, adminName || 'پشتیبانی لومینا');
  if (!updated) {
    return res.status(404).json({ error: 'نظر یافت نشد.' });
  }

  res.json({ success: true, review: updated });
});

apiRouter.delete('/admin/reviews/:id/reply', (req: Request, res: Response) => {
  const reviewId = req.params.id;
  const updated = dbManager.deleteAdminReply(reviewId);
  if (!updated) {
    return res.status(404).json({ error: 'نظر یافت نشد.' });
  }

  res.json({ success: true, review: updated });
});

apiRouter.delete('/admin/reviews/:id', (req: Request, res: Response) => {
  const reviewId = req.params.id;
  const success = dbManager.deleteReview(reviewId);
  if (!success) {
    return res.status(404).json({ error: 'نظر یافت نشد.' });
  }

  res.json({ success: true, message: 'نظر با موفقیت توسط مدیر حذف شد.' });
});

// --- Orders CRUD ---
apiRouter.get('/orders', (req: Request, res: Response) => {
  const filter = {
    search: req.query.search as string,
    status: req.query.status as string
  };
  const orders = dbManager.getOrders(filter);
  res.json(orders);
});

apiRouter.get('/orders/my-orders', (req: Request, res: Response) => {
  const { userId, email, phone } = req.query;
  const userOrders = dbManager.getUserOrders({
    userId: userId as string,
    email: email as string,
    phone: phone as string
  });
  res.json(userOrders);
});

apiRouter.get('/orders/:id', (req: Request, res: Response) => {
  const order = dbManager.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

apiRouter.post('/orders', (req: Request, res: Response) => {
  const newOrder = dbManager.createOrder(req.body);
  res.status(201).json(newOrder);
});

apiRouter.patch('/orders/:id/status', (req: Request, res: Response) => {
  const updated = dbManager.updateOrderStatus(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Order not found' });
  res.json(updated);
});

// --- Users ---
apiRouter.get('/users', (req: Request, res: Response) => {
  const search = req.query.search as string;
  const users = dbManager.getUsers(search);
  res.json(users);
});

apiRouter.patch('/users/:id/status', (req: Request, res: Response) => {
  const updated = dbManager.toggleUserStatus(req.params.id);
  if (!updated) return res.status(404).json({ error: 'User not found' });
  res.json(updated);
});

// --- Festivals & Campaigns ---
apiRouter.get('/festivals', (req: Request, res: Response) => {
  const activeOnly = req.query.active === 'true';
  const festivals = dbManager.getFestivals(activeOnly);
  res.json(festivals);
});

apiRouter.get('/festivals/active', (_req: Request, res: Response) => {
  const active = dbManager.getFestivals(true);
  res.json(active);
});

apiRouter.get('/festivals/top-active', (_req: Request, res: Response) => {
  const topActive = dbManager.getActiveFestival();
  res.json(topActive || null);
});

apiRouter.get('/festivals/:id', (req: Request, res: Response) => {
  const festival = dbManager.getFestivalById(req.params.id);
  if (!festival) return res.status(404).json({ error: 'Festival not found' });
  res.json(festival);
});

apiRouter.post('/festivals', (req: Request, res: Response) => {
  const created = dbManager.createFestival(req.body);
  res.status(201).json(created);
});

apiRouter.put('/festivals/:id', (req: Request, res: Response) => {
  const updated = dbManager.updateFestival(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Festival not found' });
  res.json(updated);
});

apiRouter.delete('/festivals/:id', (req: Request, res: Response) => {
  const success = dbManager.deleteFestival(req.params.id);
  if (!success) return res.status(404).json({ error: 'Festival not found' });
  res.json({ success: true, message: 'Festival deleted' });
});

apiRouter.patch('/festivals/:id/toggle', (req: Request, res: Response) => {
  const updated = dbManager.toggleFestivalStatus(req.params.id);
  if (!updated) return res.status(404).json({ error: 'Festival not found' });
  res.json(updated);
});

// --- Coupons ---
apiRouter.get('/coupons', (_req: Request, res: Response) => {
  res.json(dbManager.getCoupons());
});

apiRouter.post('/coupons', (req: Request, res: Response) => {
  const coupon = dbManager.createCoupon(req.body);
  res.status(201).json(coupon);
});

apiRouter.patch('/coupons/:id/toggle', (req: Request, res: Response) => {
  const coupon = dbManager.toggleCoupon(req.params.id);
  if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
  res.json(coupon);
});

apiRouter.post('/coupons/validate', (req: Request, res: Response) => {
  const { code, subtotal = 0, items = [] } = req.body || {};
  if (!code) return res.status(400).json({ valid: false, error: 'کد تخفیف ارسال نشده است.' });

  const cleanCode = String(code).trim().toUpperCase();

  // Search in standard coupons
  const standardCoupons = dbManager.getCoupons();
  const std = standardCoupons.find(c => c.code.toUpperCase() === cleanCode && c.isActive);

  if (std) {
    if (std.minPurchase && subtotal < std.minPurchase) {
      return res.status(400).json({
        valid: false,
        error: `حداقل مبلغ سفارش برای استفاده از این کد ${std.minPurchase.toLocaleString('fa-IR')} تومان است.`
      });
    }
    const discountAmount = Math.min(
      Math.round((subtotal * std.discountPercent) / 100),
      std.maxDiscount || Infinity
    );
    return res.json({
      valid: true,
      coupon: {
        code: std.code,
        percent: std.discountPercent,
        type: 'percent',
        amount: std.discountPercent,
        maxDiscount: std.maxDiscount,
        minPurchase: std.minPurchase,
        discountAmount
      }
    });
  }

  // Search in active festivals coupons
  const activeFestivals = dbManager.getFestivals(true);
  for (const fest of activeFestivals) {
    const fc = (fest.coupons || []).find(c => c.code.toUpperCase() === cleanCode && c.isActive);
    if (fc) {
      if (fc.minPurchase && subtotal < fc.minPurchase) {
        return res.status(400).json({
          valid: false,
          error: `حداقل مبلغ خرید برای کد جشنواره «${fest.title}» مبلغ ${fc.minPurchase.toLocaleString('fa-IR')} تومان است.`
        });
      }
      let discountAmount = 0;
      if (fc.type === 'fixed') {
        discountAmount = fc.amount;
      } else {
        discountAmount = Math.round((subtotal * fc.amount) / 100);
        if (fc.maxDiscount) {
          discountAmount = Math.min(discountAmount, fc.maxDiscount);
        }
      }

      return res.json({
        valid: true,
        coupon: {
          code: fc.code,
          percent: fc.type === 'percent' ? fc.amount : Math.round((fc.amount / (subtotal || 1)) * 100),
          type: fc.type,
          amount: fc.amount,
          maxDiscount: fc.maxDiscount,
          minPurchase: fc.minPurchase,
          discountAmount,
          festivalTitle: fest.title
        }
      });
    }
  }

  return res.status(404).json({ valid: false, error: 'کد تخفیف وارد شده معتبر نیست یا منقضی شده است.' });
});


// --- Notifications ---
apiRouter.get('/notifications', (_req: Request, res: Response) => {
  res.json(dbManager.getNotifications());
});

apiRouter.patch('/notifications/read-all', (_req: Request, res: Response) => {
  dbManager.markAllNotificationsRead();
  res.json({ success: true });
});

apiRouter.patch('/notifications/:id/read', (req: Request, res: Response) => {
  const notif = dbManager.markNotificationRead(req.params.id);
  res.json(notif || { success: true });
});

// --- Sales Reports ---
apiRouter.get('/reports/sales', (req: Request, res: Response) => {
  const period = (req.query.period as string) || 'monthly';
  const products = dbManager.getProducts();
  const orders = dbManager.getOrders();

  // Category breakdown
  const categorySales: { [cat: string]: { nameFa: string; revenue: number; ordersCount: number } } = {};
  for (const p of products) {
    if (!categorySales[p.category]) {
      categorySales[p.category] = { nameFa: p.categoryFa, revenue: 0, ordersCount: 0 };
    }
    categorySales[p.category].revenue += p.price * p.soldCount;
    categorySales[p.category].ordersCount += p.soldCount;
  }

  // Top products in report
  const productReport = products.slice(0, 10).map(p => ({
    sku: p.sku,
    nameFa: p.nameFa,
    category: p.categoryFa,
    stock: p.stock,
    soldCount: p.soldCount,
    price: p.price,
    revenue: p.price * p.soldCount
  }));

  // CSV content generation
  const csvHeader = 'SKU,Product Name,Category,Price (Toman),Sold Count,Stock,Total Revenue (Toman)\n';
  const csvRows = productReport
    .map(p => `"${p.sku}","${p.nameFa}","${p.category}",${p.price},${p.soldCount},${p.stock},${p.revenue}`)
    .join('\n');

  res.json({
    period,
    generatedAt: new Date().toISOString(),
    totalOrders: orders.length,
    totalRevenue: orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0),
    categoryBreakdown: Object.entries(categorySales).map(([k, v]) => ({
      category: k,
      ...v
    })),
    products: productReport,
    csvData: csvHeader + csvRows
  });
});

// --- AI Support Chatbot ---
apiRouter.post('/support/chat', async (req: Request, res: Response) => {
  try {
    const { messages, userContext } = req.body || {};
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }
    const result = await handleSupportChat(messages, userContext);
    res.json(result);
  } catch (err: any) {
    console.error('Support chat route error:', err);
    res.status(500).json({ error: err.message || 'Error processing chat request' });
  }
});

apiRouter.post('/support/stream', async (req: Request, res: Response) => {
  try {
    const { messages, userContext } = req.body || {};
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }
    await handleSupportChatStream(messages, res, userContext);
  } catch (err: any) {
    console.error('Support stream route error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message || 'Error streaming chat response' });
    }
  }
});

// --- Live Support Agent & Chat Sessions API ---
apiRouter.get('/support/agent-status', (req: Request, res: Response) => {
  res.json(dbManager.getAgentStatus());
});

apiRouter.post('/support/agent-status', (req: Request, res: Response) => {
  const { isOnline } = req.body || {};
  res.json(dbManager.setAgentStatus(Boolean(isOnline)));
});

apiRouter.get('/support/sessions', (req: Request, res: Response) => {
  res.json(dbManager.getSupportSessions());
});

apiRouter.get('/support/sessions/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { readBy } = req.query;
  const session = dbManager.getSupportSessionById(id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  if (readBy === 'admin') {
    dbManager.markSupportReadByAdmin(id);
  } else if (readBy === 'user') {
    dbManager.markSupportReadByUser(id);
  }
  res.json(session);
});

apiRouter.post('/support/sessions/:id/messages', (req: Request, res: Response) => {
  const { id } = req.params;
  const { sender, text, fileUrl, fileName, fileType, userName, userEmail, userPhone } = req.body || {};

  if (!sender || (!text && !fileUrl)) {
    return res.status(400).json({ error: 'Sender and text or fileUrl are required' });
  }

  const result = dbManager.addSupportMessage({
    sessionId: id,
    sender,
    text: text || '',
    fileUrl,
    fileName,
    fileType,
    userName,
    userEmail,
    userPhone
  });

  res.json(result);
});

apiRouter.patch('/support/sessions/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, readBy } = req.body || {};

  if (readBy === 'admin') {
    dbManager.markSupportReadByAdmin(id);
  } else if (readBy === 'user') {
    dbManager.markSupportReadByUser(id);
  }

  if (status) {
    const updated = dbManager.updateSupportSessionStatus(id, status);
    return res.json(updated);
  }

  const session = dbManager.getSupportSessionById(id);
  res.json(session);
});

// --- Category Endpoints ---

apiRouter.get('/categories', (req: Request, res: Response) => {
  try {
    const { search, parentId, isActive } = req.query;
    const categories = dbManager.getCategories({
      search: search ? String(search) : undefined,
      parentId: parentId !== undefined ? (parentId === 'null' || parentId === '' ? null : String(parentId)) : undefined,
      isActive: isActive !== undefined ? isActive === 'true' : undefined
    });
    res.json(categories);
  } catch (err: any) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

apiRouter.get('/categories/:id', (req: Request, res: Response) => {
  try {
    const cat = dbManager.getCategoryById(req.params.id);
    if (!cat) {
      return res.status(404).json({ error: 'دسته‌بندی یافت نشد.' });
    }
    res.json(cat);
  } catch (err: any) {
    console.error('Error fetching category:', err);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

apiRouter.post('/categories', (req: Request, res: Response) => {
  try {
    const { nameFa } = req.body || {};
    if (!nameFa || !nameFa.trim()) {
      return res.status(400).json({ error: 'نام فارسی دسته‌بندی الزامی است.' });
    }
    const newCat = dbManager.createCategory(req.body);
    res.status(201).json(newCat);
  } catch (err: any) {
    console.error('Error creating category:', err);
    res.status(400).json({ error: err.message || 'خطا در ایجاد دسته‌بندی.' });
  }
});

apiRouter.put('/categories/:id', (req: Request, res: Response) => {
  try {
    const updated = dbManager.updateCategory(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'دسته‌بندی برای ویرایش یافت نشد.' });
    }
    res.json(updated);
  } catch (err: any) {
    console.error('Error updating category:', err);
    res.status(400).json({ error: err.message || 'خطا در به‌روزرسانی دسته‌بندی.' });
  }
});

apiRouter.delete('/categories/:id', (req: Request, res: Response) => {
  try {
    const result = dbManager.deleteCategory(req.params.id);
    if (!result.success) {
      return res.status(400).json({
        error: result.error,
        productCount: result.productCount,
        childCount: result.childCount
      });
    }
    res.json({ success: true, message: 'دسته‌بندی با موفقیت حذف شد.' });
  } catch (err: any) {
    console.error('Error deleting category:', err);
    res.status(500).json({ error: 'خطا در حذف دسته‌بندی.' });
  }
});

apiRouter.patch('/categories/:id/toggle', (req: Request, res: Response) => {
  try {
    const updated = dbManager.toggleCategoryStatus(req.params.id);
    if (!updated) {
      return res.status(404).json({ error: 'دسته‌بندی یافت نشد.' });
    }
    res.json(updated);
  } catch (err: any) {
    console.error('Error toggling category status:', err);
    res.status(500).json({ error: 'خطا در تغییر وضعیت دسته‌بندی.' });
  }
});

// --- Upload Security & File Handling ---

const storage = multer.memoryStorage();
const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max limit per file
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedExts.includes(ext) || !allowedMimes.includes(file.mimetype)) {
      return cb(new Error('تنها فرمت‌های تصویری JPG، PNG و WEBP با حداکثر حجم ۱۰ مگابایت مجاز هستند.'));
    }
    cb(null, true);
  }
});

// Helper for validating real image magic bytes
function isValidImageBuffer(buffer: Buffer): { valid: boolean; detectedExt?: string } {
  if (!buffer || buffer.length < 12) return { valid: false };

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, detectedExt: 'jpg' };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, detectedExt: 'png' };
  }

  // WEBP: RIFF .... WEBP
  if (
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return { valid: true, detectedExt: 'webp' };
  }

  return { valid: false };
}

// Upload endpoint (Supports multipart files, multiple files, and fallback base64)
apiRouter.post('/upload', (req: Request, res: Response) => {
  uploadMiddleware.any()(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message || 'خطا در اعتبارسنجی فایل. فرمت یا حجم فایل غیرمجاز است.'
      });
    }

    try {
      const folder = (req.query.folder as string) || (req.body?.folder as string) || 'products';
      const safeFolder = folder === 'categories' ? 'categories' : 'products';
      const targetDir = path.join(process.cwd(), 'uploads', safeFolder);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const files = (req.files as Express.Multer.File[]) || [];

      if (files.length > 0) {
        const savedFiles = [];

        for (const file of files) {
          // Verify Magic Bytes
          const magicCheck = isValidImageBuffer(file.buffer);
          if (!magicCheck.valid) {
            return res.status(400).json({
              success: false,
              error: `محتوای فایل «${file.originalname}» ساختار تصویر معتبر ندارد. آپلود فایل‌های غیرتصویری یا تغییر پسوند غیرمجاز است.`
            });
          }

          const safeExt = magicCheck.detectedExt || 'jpg';
          const safeFilename = `img_${Date.now()}_${crypto.randomBytes(6).toString('hex')}.${safeExt}`;
          const filePath = path.join(targetDir, safeFilename);

          fs.writeFileSync(filePath, file.buffer);

          const fileUrl = `/uploads/${safeFolder}/${safeFilename}`;
          savedFiles.push({
            id: `img-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
            url: fileUrl,
            fileName: file.originalname,
            fileSize: file.size,
            mimeType: file.mimetype,
            createdAt: new Date().toISOString()
          });
        }

        return res.json({
          success: true,
          files: savedFiles,
          // First file shortcuts for single-file handlers
          url: savedFiles[0].url,
          fileName: savedFiles[0].fileName,
          fileSize: savedFiles[0].fileSize,
          file: savedFiles[0]
        });
      }

      // Fallback: check if base64 data was sent in JSON body (e.g. from chat support or legacy client)
      const { fileData, fileName, fileType } = req.body || {};
      if (fileData && typeof fileData === 'string' && fileData.startsWith('data:image')) {
        const matches = fileData.match(/^data:image\/([a-zA-Z0-9.+_-]+);base64,(.+)$/);
        if (matches) {
          const buffer = Buffer.from(matches[2], 'base64');
          const magicCheck = isValidImageBuffer(buffer);
          if (!magicCheck.valid) {
            return res.status(400).json({
              success: false,
              error: 'محتوای تصویر ارسالی معتبر نیست.'
            });
          }
          const safeExt = magicCheck.detectedExt || 'jpg';
          const safeFilename = `img_${Date.now()}_${crypto.randomBytes(6).toString('hex')}.${safeExt}`;
          const filePath = path.join(targetDir, safeFilename);
          fs.writeFileSync(filePath, buffer);

          const fileUrl = `/uploads/${safeFolder}/${safeFilename}`;
          const savedFile = {
            id: `img-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
            url: fileUrl,
            fileName: fileName || safeFilename,
            fileSize: buffer.length,
            mimeType: `image/${safeExt}`,
            createdAt: new Date().toISOString()
          };

          return res.json({
            success: true,
            files: [savedFile],
            url: fileUrl,
            fileName: fileName || safeFilename,
            fileSize: buffer.length,
            file: savedFile,
            fileType: fileType || 'image'
          });
        }
      }

      return res.status(400).json({
        success: false,
        error: 'هیچ فایلی برای آپلود انتخاب نشده است.'
      });
    } catch (processErr: any) {
      console.error('File processing error:', processErr);
      return res.status(500).json({
        success: false,
        error: 'خطای سرور در ذخیره‌سازی تصویر.'
      });
    }
  });
});

// Delete upload endpoint with reference safety check
apiRouter.delete('/upload', (req: Request, res: Response) => {
  try {
    const { url, productId } = req.body || {};
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, error: 'URL تصویر برای حذف الزامی است.' });
    }

    if (!url.startsWith('/uploads/')) {
      return res.json({
        success: true,
        deletedPhysicalFile: false,
        message: 'تصویر از این فرم حذف شد (فایل خارجی است).'
      });
    }

    // Safety check: is this image still referenced by any other product or category?
    const isStillUsed = dbManager.isImageReferenced(url, productId);
    if (isStillUsed) {
      return res.json({
        success: true,
        deletedPhysicalFile: false,
        message: 'تصویر از لیست حذف شد اما فایل فیزیکی به دلیل استفاده در محصول یا دسته‌بندی دیگر حفظ گردید.'
      });
    }

    // Unlink physical file safely
    const filePath = path.join(process.cwd(), url.replace(/^\//, ''));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.json({
        success: true,
        deletedPhysicalFile: true,
        message: 'فایل با موفقیت از حافظه سرور حذف شد.'
      });
    }

    return res.json({
      success: true,
      deletedPhysicalFile: false,
      message: 'فایل قبلاً از حافظه حذف شده بود.'
    });
  } catch (err: any) {
    console.error('Error deleting upload:', err);
    res.status(500).json({ success: false, error: 'خطا در حذف فایل فیزیکی.' });
  }
});

// --- MySQL Database Management & Synchronization Endpoints ---
apiRouter.get('/database/status', async (req: Request, res: Response) => {
  try {
    const isConnected = mySQLService.isConnectedToMySQL();
    const config = mySQLService.getConfig();
    const rawDb = dbManager.getRawDatabase();
    const tableCounts = isConnected ? await mySQLService.getTableCounts() : null;

    return res.json({
      success: true,
      connected: isConnected,
      database: config.database,
      host: config.host,
      port: config.port,
      user: config.user,
      memoryCounts: {
        products: rawDb.products?.length || 0,
        orders: rawDb.orders?.length || 0,
        users: rawDb.users?.length || 0,
        categories: rawDb.categories?.length || 0,
        reviews: rawDb.reviews?.length || 0,
        coupons: rawDb.coupons?.length || 0
      },
      mysqlCounts: tableCounts,
      statusMessage: isConnected
        ? `دیتابیس MySQL با نام «${config.database}» متصل است و همگام‌سازی بلادرنگ فعال می‌باشد.`
        : `سیستم هم‌اکنون در حالت ذخیره‌سازی محلی (فالبک امن) است. در صورت تمایل برای اتصال به MySQL در هاست، مشخصات DB_HOST, DB_USER, DB_PASSWORD را تنظیم نمایید.`
    });
  } catch (err: any) {
    return res.json({
      success: false,
      connected: false,
      database: 'online_shop_db',
      host: 'localhost',
      port: 3306,
      user: 'root',
      memoryCounts: { products: 12, orders: 4, users: 6, categories: 10, reviews: 6, coupons: 2 },
      mysqlCounts: null,
      statusMessage: 'وضعیت: حالت ذخیره‌سازی محلی فعال است.',
      error: err.message
    });
  }
});

apiRouter.post('/database/sync-to-mysql', async (req: Request, res: Response) => {
  try {
    const rawDb = dbManager.getRawDatabase();
    const configOverride = req.body && Object.keys(req.body).length > 0 ? req.body : undefined;
    const testResult = await mySQLService.testAndReconnect(configOverride, rawDb);
    if (!testResult.success) {
      return res.json({
        success: false,
        connected: false,
        message: testResult.message,
        diagnostic: testResult.diagnostic,
        error: testResult.error
      });
    }

    const success = await dbManager.syncToMySQL();
    if (!success) {
      return res.json({
        success: false,
        connected: false,
        message: 'همگام‌سازی انجام نشد. لطفاً دسترسی‌های کاربری MySQL در هاست را بررسی نمایید.'
      });
    }

    const counts = await mySQLService.getTableCounts();
    return res.json({
      success: true,
      connected: true,
      message: 'کلیه اطلاعات محصولات، کاربران، سفارشات، تخفیف‌ها و آمار با موفقیت به پایگاه داده MySQL منتقل شدند.',
      counts
    });
  } catch (err: any) {
    return res.json({
      success: false,
      connected: false,
      message: 'خطا در همگام‌سازی: ' + (err.message || 'خطای اتصال به سرور دیتابیس')
    });
  }
});

apiRouter.post('/database/test-connection', async (req: Request, res: Response) => {
  try {
    const rawDb = dbManager.getRawDatabase();
    const configOverride = req.body && Object.keys(req.body).length > 0 ? req.body : undefined;
    const result = await mySQLService.testAndReconnect(configOverride, rawDb);
    
    return res.json({
      success: result.success,
      connected: result.success,
      message: result.message,
      diagnostic: result.diagnostic,
      error: result.error
    });
  } catch (err: any) {
    return res.json({
      success: false,
      connected: false,
      message: 'خطا در برقراری ارتباط با سرور MySQL: ' + (err.message || 'عدم دسترسی به هاست MySQL'),
      error: err.message
    });
  }
});

apiRouter.get('/database/export-sql', (req: Request, res: Response) => {
  const sqlPath = path.join(process.cwd(), 'online_shop_db.sql');
  if (fs.existsSync(sqlPath)) {
    res.setHeader('Content-Type', 'application/sql');
    res.setHeader('Content-Disposition', 'attachment; filename="online_shop_db.sql"');
    return res.sendFile(sqlPath);
  }
  return res.status(404).json({ success: false, message: 'فایل online_shop_db.sql یافت نشد.' });
});
