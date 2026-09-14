import React, { useState } from 'react';
import { Settings, User, Store, Shield, CheckCircle2, Save, Bell, RefreshCw } from 'lucide-react';
import { AdminUser } from '../../types/admin';

interface AdminSettingsViewProps {
  adminUser: AdminUser | null;
  onUpdateAdminUser: (user: AdminUser) => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  adminUser,
  onUpdateAdminUser
}) => {
  const [name, setName] = useState(adminUser?.name || 'مدیر ارشد لومینا');
  const [email, setEmail] = useState(adminUser?.email || 'admin@luminastore.ir');
  const [avatar, setAvatar] = useState(
    adminUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80&auto=format&fit=crop'
  );

  // Store settings
  const [storeName, setStoreName] = useState('فروشگاه اینترنتی لومینا (Lumina Store)');
  const [supportPhone, setSupportPhone] = useState('۰۲۱-۸۸۹۹۰۰۱۱');
  const [freeShippingLimit, setFreeShippingLimit] = useState('2000000');
  const [taxRate, setTaxRate] = useState('0');
  const [savedSuccess, setSavedSuccess] = useState(false);

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
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          تنظیمات عمومی و پروفایل مدیریت
        </h1>
        <p className="text-xs text-slate-400 mt-1">
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
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" />
            <span>اطلاعات پروفایل مدیر سامانه</span>
          </h3>

          <div className="flex items-center gap-4">
            <img
              src={avatar}
              alt=""
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/30"
            />
            <div className="flex-1 max-w-md">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                آدرس تصویر آواتار (URL)
              </label>
              <input
                type="text"
                value={avatar}
                onChange={e => setAvatar(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-hidden font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                نام نمایشی مدیر
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                پست الکترونیک (Email)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Store Settings Section */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Store className="w-4 h-4 text-indigo-500" />
            <span>پیکربندی فروشگاه آنلاین</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                نام رسمی فروشگاه
              </label>
              <input
                type="text"
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                شماره تماس پشتیبانی
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={e => setSupportPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                سقف خرید جهت ارسال رایگان (تومان)
              </label>
              <input
                type="number"
                value={freeShippingLimit}
                onChange={e => setFreeShippingLimit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                واحد پول اصلی
              </label>
              <input
                type="text"
                disabled
                value="تومان ایران (ریال شاپرک)"
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-400 outline-hidden"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>ذخیره کلیه تنظیمات</span>
          </button>
        </div>
      </form>
    </div>
  );
};
