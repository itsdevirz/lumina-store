# 🚀 Lumina E-Commerce - Standalone Backend REST API
> پروژه مستقل بک‌اند فروشگاه آنلاین لومینا با فریم‌ورک Express، دیتابیس MySQL و موتور هوش مصنوعی Gemini

این پوشه یک **پروژه کاملاً مستقل، ماژولار و آماده استقرار (Production-Ready)** برای سمت سرور است که فرانت‌اند (React) با آن در ارتباط بوده و بک‌اند وظیفه ذخیره، مدیریت و همگام‌سازی داده‌ها با دیتابیس MySQL را بر عهده دارد.

---

## 📁 ساختار پوشه‌بندی پروژه بک‌اند (`/backend`)

```text
backend/
├── src/
│   ├── database/
│   │   ├── mysql.ts         # مدیریت استخر اتصالات MySQL (Connection Pool) و ایجاد خودکار جداول
│   │   └── db.ts            # مدیریت حافظه محلی و هماهنگی بلادرنگ با دیتابیس
│   ├── routes/
│   │   └── api.ts           # کلیه اندپوینت‌های REST API (محصولات، سفارشات، کاربران و...)
│   ├── services/
│   │   └── aiSupport.ts     # سرویس دستیار هوشمند فروشگاه و پشتیبانی با Gemini
│   ├── types/
│   │   └── index.ts         # تایپ‌ها و اینترفیس‌های کامل TypeScript
│   └── server.ts            # فایل ورودی اصلی سرور Express با CORS و پورت مجزا
├── .env.example             # نمونه متغیرهای محیطی برای هاست و دیتابیس
├── package.json             # پکیج‌ها و اسکریپت‌های اختصاصی بک‌اند
├── tsconfig.json            # تنظیمات کامپایلر تایپ‌اسکریپت Node.js
└── README.md                # راهنمای کامل راه‌اندازی و استقرار
```

---

## ⚙️ متغیرهای محیطی (`.env`)

یک فایل با نام `.env` در همین پوشه `backend/` ایجاد کرده و مقادیر زیر را در آن قرار دهید:

```env
# پورت اجرای بک‌اند
PORT=5000

# دامنه‌های مجاز برای برقراری ارتباط با فرانت‌اند (CORS)
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# مشخصات اتصال به پایگاه داده MySQL هاست cPanel
DB_HOST=localhost
DB_PORT=3306
DB_USER=cp63925519643_dev
DB_PASSWORD=Alireza23!#
DB_NAME=cp63925519643_online_shop_db

# کلید هوش مصنوعی جمینای (اختیاری برای دستیار هوشمند)
GEMINI_API_KEY=
```

---

## 💻 راه‌اندازی سریع در محیط توسعه (Local Development)

```bash
# ۱. رفتن به پوشه بک‌اند
cd backend

# ۲. نصب وابستگی‌ها
npm install

# ۳. اجرای سرور در حالت توسعه (با راه‌اندازی مجدد خودکار)
npm run dev
```

سرور روی پورت مشخص‌شده (مثلاً `http://localhost:5000`) اجرا می‌شود و آدرس تست سلامت:
`http://localhost:5000/api/health`

---

## 🏗️ ساخت نسخه پروداکشن (Production Build)

```bash
cd backend
npm run build
npm start
```

---

## 🌐 راهنمای استقرار روی هاست اشتراکی cPanel (Node.js App)

۱. در **cPanel** وارد بخش **Setup Node.js App** شوید.
۲. روی دکمه **Create Application** کلیک کنید:
   - **Node.js version**: نسخه 18 یا 20 یا بالاتر را انتخاب کنید.
   - **Application root**: مسیر پوشه بک‌اند (مثلاً `backend` یا `api.yourdomain.com`).
   - **Application URL**: ساب‌دامین یا پوشه مدنظر (مثلاً `api.yourdomain.com`).
   - **Application startup file**: مقدار `dist/server.js` (یا `src/server.ts` در صورت استفاده از tsx).
۳. فایل‌های پوشه `backend` را آپلود نمایید و فایل `.env` را با مشخصات دیتابیس cPanel خود ذخیره کنید.
۴. در پنل cPanel روی **Run NPM Install** کلیک کنید.
۵. دکمه **Start App** را بزنید. بک‌اند آماده پاسخگویی به درخواست‌های فرانت‌اند است!

---

## 🗄️ ایجاد خودکار جداول پایگاه داده

هنگام اولین اتصال بک‌اند به دیتابیس MySQL، تمامی جداول زیر به صورت کاملاً خودکار با کاراکترست `utf8mb4_unicode_ci` ساخته می‌شوند:
- `products` (محصولات، ویژگی‌ها، تصاویر، موجودی، تنوع‌ها و...)
- `categories` (دسته‌بندی‌های اصلی و زیردسته‌ها)
- `orders` (سفارشات، اطلاعات تحویل، اقلام و وضعیت)
- `users` (مشتریان و مدیران)
- `coupons` (کدهای تخفیف)
- `festivals` (جشنواره‌ها و کمپین‌های فروش)
- `reviews` (دیدگاه‌ها و امتیازات کاربران به محصولات)
- `support_sessions` (پیام‌های پشتیبانی آنلاین)
