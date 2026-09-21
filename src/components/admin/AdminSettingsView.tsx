import React, { useState, useEffect } from 'react';
import { Settings, User, Store, Shield, CheckCircle2, Save, Bell, RefreshCw, Database, Download, AlertCircle, HardDrive, Server, Check } from 'lucide-react';
import { AdminUser } from '../../types/admin';

interface AdminSettingsViewProps {
  adminUser: AdminUser | null;
  onUpdateAdminUser: (user: AdminUser) => void;
}

interface DatabaseStatus {
  connected: boolean;
  database: string;
  host: string;
  port: number;
  user: string;
  memoryCounts: {
    products: number;
    orders: number;
    users: number;
    categories: number;
    reviews: number;
    coupons: number;
  };
  mysqlCounts: {
    products: number;
    orders: number;
    users: number;
    categories: number;
    reviews: number;
    coupons: number;
    festivals: number;
    supportSessions: number;
  } | null;
  statusMessage: string;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  adminUser,
  onUpdateAdminUser
}) => {
  const [name, setName] = useState(adminUser?.name || 'مدیر ارشد لومینا');
  const [email, setEmail] = useState(adminUser?.email || 'admin@luminastore.ir');
  const [avatar, setAvatar] = useState(
    adminUser?.avatar || '/images/products/photo-1534528741775-53994a69daeb.jpg'
  );

  // Store settings
  const [storeName, setStoreName] = useState('فروشگاه اینترنتی لومینا (Lumina Store)');
  const [supportPhone, setSupportPhone] = useState('۰۲۱-۸۸۹۹۰۰۱۱');
  const [freeShippingLimit, setFreeShippingLimit] = useState('2000000');
  const [taxRate, setTaxRate] = useState('0');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Database status state
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  const [isLoadingDb, setIsLoadingDb] = useState(false);
  const [isSyncingDb, setIsSyncingDb] = useState(false);
  const [dbActionMessage, setDbActionMessage] = useState<{ type: 'success' | 'error'; text: string; diagnostic?: string } | null>(null);

  // Custom connection inputs for testing
  const [showDbConfigForm, setShowDbConfigForm] = useState(false);
  const [configMode, setConfigMode] = useState<'url' | 'manual'>('url');
  const [dbConnectionUrl, setDbConnectionUrl] = useState('mysql://cp63925519643_dev:Alireza23%21%23@localhost:3306/cp63925519643_online_shop_db');
  const [dbHost, setDbHost] = useState('localhost');
  const [dbPort, setDbPort] = useState('3306');
  const [dbUser, setDbUser] = useState('cp63925519643_dev');
  const [dbPass, setDbPass] = useState('Alireza23!#');
  const [dbName, setDbName] = useState('cp63925519643_online_shop_db');

  const safeFetchJson = async (url: string, options?: RequestInit) => {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(options?.headers || {})
        }
      });
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        return {
          success: false,
          connected: false,
          message: text.startsWith('<') ? 'خطا در برقراری ارتباط با پایگاه داده.' : text
        };
      }
    } catch (err: any) {
      return {
        success: false,
        connected: false,
        message: 'عدم دسترسی به سرویس پایگاه داده: ' + (err?.message || 'خطای شبکه')
      };
    }
  };

  const fetchDbStatus = async () => {
    setIsLoadingDb(true);
    try {
      const data = await safeFetchJson('/api/database/status');
      if (data && typeof data === 'object') {
        setDbStatus(data);
        if (data.databaseUrl) setDbConnectionUrl(data.databaseUrl);
        if (data.host) setDbHost(data.host);
        if (data.port) setDbPort(String(data.port));
        if (data.database) setDbName(data.database);
        if (data.user) setDbUser(data.user);
      }
    } catch (err) {
      console.error('Failed to fetch DB status:', err);
    } finally {
      setIsLoadingDb(false);
    }
  };

  useEffect(() => {
    fetchDbStatus();
  }, []);

  const getPayload = () => {
    if (configMode === 'url') {
      return { databaseUrl: dbConnectionUrl.trim() };
    }
    return {
      host: dbHost.trim(),
      port: Number(dbPort) || 3306,
      user: dbUser.trim(),
      password: dbPass,
      database: dbName.trim()
    };
  };

  const handleTestConnection = async () => {
    setIsLoadingDb(true);
    setDbActionMessage(null);
    try {
      const body = showDbConfigForm ? getPayload() : { databaseUrl: dbConnectionUrl };

      const data = await safeFetchJson('/api/database/test-connection', {
        method: 'POST',
        body: JSON.stringify(body)
      });

      if (data && (data.connected || data.success)) {
        setDbActionMessage({
          type: 'success',
          text: data.message || 'اتصال با موفقیت به دیتابیس MySQL برقرار شد.'
        });
      } else {
        setDbActionMessage({
          type: 'error',
          text: data?.message || 'ارتباط با سرور MySQL برقرار نشد.',
          diagnostic: data?.diagnostic
        });
      }
      fetchDbStatus();
    } catch (err: any) {
      setDbActionMessage({ type: 'error', text: 'خطا در تست اتصال: ' + (err?.message || 'عدم پاسخگویی سرور') });
    } finally {
      setIsLoadingDb(false);
    }
  };

  const handleSyncToMySQL = async () => {
    setIsSyncingDb(true);
    setDbActionMessage(null);
    try {
      const body = showDbConfigForm ? getPayload() : { databaseUrl: dbConnectionUrl };

      const data = await safeFetchJson('/api/database/sync-to-mysql', {
        method: 'POST',
        body: JSON.stringify(body)
      });

      if (data && data.success) {
        setDbActionMessage({
          type: 'success',
          text: data.message || 'کلیه داده‌ها با موفقیت به پایگاه داده MySQL منتقل شدند.'
        });
        fetchDbStatus();
      } else {
        setDbActionMessage({
          type: 'error',
          text: data?.message || 'همگام‌سازی انجام نشد.',
          diagnostic: data?.diagnostic
        });
      }
    } catch (err: any) {
      setDbActionMessage({ type: 'error', text: 'خطا در همگام‌سازی: ' + (err?.message || 'خطای سرور') });
    } finally {
      setIsSyncingDb(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser) {
      const updated: AdminUser = {
        ...adminUser,
        name,
        email,
        avatar
      };
      onUpdateAdminUser(updated);
      localStorage.setItem('lumina_admin_user', JSON.stringify(updated));
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans max-w-4xl">
      {/* View Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
          تنظیمات عمومی و پروفایل مدیریت
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          پیکربندی پارامترهای پایه‌ای فروشگاه، اطلاعات حساب مدیر و تماس با پشتیبانی
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>تغییرات با موفقیت ذخیره و در سامانه اعمال شد.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Admin Profile Section */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-[#62DB00]" />
            <span>اطلاعات پروفایل مدیر سامانه</span>
          </h3>

          <div className="flex items-center gap-4">
            <img
              src={avatar}
              alt=""
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#62DB00]/40"
            />
            <div className="flex-1 max-w-md">
              <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                آدرس تصویر آواتار (URL)
              </label>
              <input
                type="text"
                value={avatar}
                onChange={e => setAvatar(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-[#62DB00] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                نام نمایشی مدیر
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-[#62DB00]"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                پست الکترونیک (Email)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-[#62DB00] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Store Settings Section */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Store className="w-4 h-4 text-[#62DB00]" />
            <span>پیکربندی فروشگاه آنلاین</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                نام رسمی فروشگاه
              </label>
              <input
                type="text"
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-[#62DB00]"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                شماره تماس پشتیبانی
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={e => setSupportPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-[#62DB00] font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                سقف خرید جهت ارسال رایگان (تومان)
              </label>
              <input
                type="number"
                value={freeShippingLimit}
                onChange={e => setFreeShippingLimit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-[#62DB00] font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                واحد پول اصلی
              </label>
              <input
                type="text"
                disabled
                value="تومان ایران (ریال شاپرک)"
                className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 text-zinc-400 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* MySQL Database Configuration & Management Section */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${dbStatus?.connected ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
                  <span>پایگاه داده MySQL اختصاصی</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-normal">
                    online_shop_db
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400">
                  اتصال به پایگاه داده MySQL روی هاست شخصی (سی‌پنل، دایرکت‌ادمین یا سرور لینوکس)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                dbStatus?.connected
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${dbStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                {dbStatus?.connected ? 'متصل به MySQL (آنلاین)' : 'حالت ذخیره‌سازی محلی (فالبک)'}
              </span>
            </div>
          </div>

          {dbActionMessage && (
            <div className={`p-4 rounded-xl text-xs space-y-2 animate-in fade-in ${
              dbActionMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
            }`}>
              <div className="flex items-center gap-2 font-bold">
                {dbActionMessage.type === 'success' ? <Check className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-rose-500" />}
                <span>{dbActionMessage.text}</span>
              </div>
              {dbActionMessage.diagnostic && (
                <div className="mt-2 p-3 rounded-lg bg-black/10 dark:bg-white/5 border border-rose-200/50 dark:border-rose-700/50 text-xs font-normal leading-relaxed text-zinc-700 dark:text-zinc-300">
                  <span className="font-bold text-rose-600 dark:text-rose-400 block mb-1">راهنمای رفع مشکل اتصال:</span>
                  {dbActionMessage.diagnostic}
                </div>
              )}
            </div>
          )}

          {/* Database Info Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800">
              <span className="text-[11px] text-zinc-400 block mb-1">نام دیتابیس</span>
              <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200 truncate block" title={dbStatus?.database || 'cp63925519643_online_shop_db'}>
                {dbStatus?.database || 'cp63925519643_online_shop_db'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800">
              <span className="text-[11px] text-zinc-400 block mb-1">میزبان سرور (Host)</span>
              <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                {dbStatus?.host || 'localhost'}:{dbStatus?.port || 3306}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800">
              <span className="text-[11px] text-zinc-400 block mb-1">تعداد محصولات</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">
                {dbStatus?.mysqlCounts?.products != null
                  ? `${dbStatus.mysqlCounts.products} در MySQL`
                  : `${dbStatus?.memoryCounts?.products ?? 12} قلم`}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800">
              <span className="text-[11px] text-zinc-400 block mb-1">سفارشات و مشتریان</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">
                {dbStatus?.memoryCounts?.orders ?? 4} سفارش / {dbStatus?.memoryCounts?.users ?? 6} کاربر
              </span>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isLoadingDb}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDb ? 'animate-spin' : ''}`} />
              <span>تست و بررسی اتصال</span>
            </button>

            <button
              type="button"
              onClick={handleSyncToMySQL}
              disabled={isSyncingDb}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#62DB00]/15 hover:bg-[#62DB00]/25 text-[#62DB00] border border-[#62DB00]/30 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              <HardDrive className={`w-3.5 h-3.5 ${isSyncingDb ? 'animate-pulse' : ''}`} />
              <span>{isSyncingDb ? 'در حال ارسال داده‌ها...' : 'همگام‌سازی داده‌ها با MySQL'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDbConfigForm(!showDbConfigForm)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium transition-all cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-[#62DB00]" />
              <span>{showDbConfigForm ? 'بستن تنظیمات URL / هاست' : 'تنظیم و تغییر URL دیتابیس'}</span>
            </button>

            <a
              href="/api/database/export-sql"
              download="online_shop_db.sql"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/80 text-xs font-bold transition-all cursor-pointer ml-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دانلود فایل SQL اصلاح‌شده</span>
            </a>
          </div>

          {/* Form for custom credentials / URL testing */}
          {showDbConfigForm && (
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-xs space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <h4 className="font-bold text-zinc-800 dark:text-zinc-200">
                  تنظیم آدرس و مشخصات اتصال به پایگاه داده MySQL:
                </h4>
                <div className="flex rounded-lg bg-zinc-200 dark:bg-zinc-800 p-0.5 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setConfigMode('url')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      configMode === 'url'
                        ? 'bg-white dark:bg-zinc-900 text-[#62DB00] shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    آدرس URL اتصال (پیشنهادی)
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfigMode('manual')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      configMode === 'manual'
                        ? 'bg-white dark:bg-zinc-900 text-[#62DB00] shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    فیلدهای تفکیک‌شده
                  </button>
                </div>
              </div>

              {configMode === 'url' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block font-sans text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      آدرس کامل اتصال MySQL (Connection URL):
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={dbConnectionUrl}
                      onChange={e => setDbConnectionUrl(e.target.value)}
                      placeholder="mysql://user:password@host:3306/dbname"
                      className="w-full px-3 py-2 font-mono text-xs rounded-lg bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 outline-hidden focus:border-[#62DB00]"
                    />
                    <span className="text-[11px] text-zinc-400 block mt-1">
                      فرمت: <code className="text-[#62DB00]">mysql://user:password@host:3306/dbname</code> (با قابلیت دیکد خودکار کاراکترهای خاص)
                    </span>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={isLoadingDb}
                      className="px-6 py-2 rounded-lg bg-[#62DB00] hover:bg-[#52B800] text-black font-sans font-black text-xs transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isLoadingDb ? 'در حال بررسی اتصال...' : 'تست اتصال با این URL'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                  <div>
                    <label className="block font-sans text-[11px] font-bold text-zinc-500 mb-1">میزبان (Host)</label>
                    <input
                      type="text"
                      value={dbHost}
                      onChange={e => setDbHost(e.target.value)}
                      placeholder="localhost یا IP هاست"
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-xs outline-hidden focus:border-[#62DB00]"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[11px] font-bold text-zinc-500 mb-1">نام دیتابیس (DB Name)</label>
                    <input
                      type="text"
                      value={dbName}
                      onChange={e => setDbName(e.target.value)}
                      placeholder="cp63925519643_online_shop_db"
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-xs outline-hidden focus:border-[#62DB00]"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[11px] font-bold text-zinc-500 mb-1">نام کاربری (DB User)</label>
                    <input
                      type="text"
                      value={dbUser}
                      onChange={e => setDbUser(e.target.value)}
                      placeholder="cp63925519643_dev"
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-xs outline-hidden focus:border-[#62DB00]"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[11px] font-bold text-zinc-500 mb-1">رمز عبور (Password)</label>
                    <input
                      type="password"
                      value={dbPass}
                      onChange={e => setDbPass(e.target.value)}
                      placeholder="رمز دیتابیس"
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-xs outline-hidden focus:border-[#62DB00]"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[11px] font-bold text-zinc-500 mb-1">پورت (Port)</label>
                    <input
                      type="text"
                      value={dbPort}
                      onChange={e => setDbPort(e.target.value)}
                      placeholder="3306"
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-xs outline-hidden focus:border-[#62DB00]"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={isLoadingDb}
                      className="w-full py-2 rounded-lg bg-[#62DB00] hover:bg-[#52B800] text-black font-sans font-black text-xs transition-all cursor-pointer disabled:opacity-50"
                    >
                      تست اتصال با مشخصات تفکیک شده
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Host Setup Instructions Helper Box */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/60 text-xs space-y-2">
            <h4 className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-[#62DB00]" />
              <span>راهنمای اتصال به هاست شخصی شما (سی‌پنل / دایرکت‌ادمین):</span>
            </h4>
            <p className="text-zinc-500 leading-relaxed text-[11px]">
              ۱. در هاست خود وارد <strong>phpMyAdmin</strong> شوید، از ستون سمت چپ روی نام دیتابیس ساخته‌شده کلیک کنید، سپس تب <strong>Import</strong> را انتخاب کرده و فایل <strong>online_shop_db.sql</strong> را بارگذاری نمایید.<br />
              ۲. توجه: در سی‌پنل، نام دیتابیس و نام کاربر معمولاً دارای پیشوند یوزرنیم هاست شما هستند (مثلاً <code className="text-[#62DB00]">cp63925519643_online_shop_db</code>).<br />
              ۳. در فایل <strong>.env</strong> هاست، متغیرها را با نام کامل وارد کنید:
            </p>
            <div className="p-2.5 rounded-lg bg-zinc-900 text-zinc-200 font-mono text-[11px] leading-tight space-y-1">
              <div>DB_HOST=localhost</div>
              <div>DB_PORT=3306</div>
              <div>DB_USER=cp63925519643_نام‌کاربر</div>
              <div>DB_PASSWORD=رمز_عبور_دیتابیس</div>
              <div>DB_NAME=cp63925519643_online_shop_db</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#62DB00] hover:bg-[#52B800] text-black text-xs font-black shadow-lg shadow-[#62DB00]/15 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>ذخیره کلیه تنظیمات</span>
          </button>
        </div>
      </form>
    </div>
  );
};
