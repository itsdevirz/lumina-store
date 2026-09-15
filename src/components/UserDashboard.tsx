import React, { useState } from 'react';
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Plus,
  LogIn,
  Zap,
  Save,
  X,
  Clock,
  Truck,
  CheckCircle2,
  Filter,
  Palette,
  Sun,
  Moon,
  Laptop,
  Camera,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OrderStatusTimeline } from './OrderStatusTimeline';
import { AvatarUploadManager } from './AvatarUploadManager';

export const UserDashboard: React.FC = () => {
  const {
    currentUser,
    isAuthenticated,
    openLoginModal,
    openRegisterModal,
    quickDemoLogin,
    logout,
    updateUserProfile,
    addAddress,
    userProfile,
    userOrders,
    syncOrdersWithBackend,
    isSyncingOrders,
    formatPrice,
    lang,
    setActiveTab,
    wishlist,
    themeMode,
    setThemeMode,
    darkMode
  } = useStore();

  const [activeSection, setActiveSection] = useState<'overview' | 'orders' | 'addresses' | 'profile'>('overview');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'processing' | 'shipped' | 'delivered'>('all');
  const [expandedOverviewTimeline, setExpandedOverviewTimeline] = useState<string | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddrTitle, setNewAddrTitle] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrText, setNewAddrText] = useState('');
  const [newAddrPostal, setNewAddrPostal] = useState('');

  // Edit profile state
  const [profileName, setProfileName] = useState(userProfile.name);
  const [profilePhone, setProfilePhone] = useState(userProfile.phone);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name: profileName, phone: profilePhone });
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrText.trim()) return;
    addAddress({
      title: newAddrTitle || (lang === 'fa' ? 'آدرس جدید' : 'New Address'),
      city: newAddrCity || (lang === 'fa' ? 'تهران' : 'Tehran'),
      address: newAddrText,
      postalCode: newAddrPostal || '۱۹۰۰۰۰۰۰۰۰',
      isDefault: false
    });
    setIsAddingAddress(false);
    setNewAddrTitle('');
    setNewAddrCity('');
    setNewAddrText('');
    setNewAddrPostal('');
  };

  // Unauthenticated State
  if (!isAuthenticated) {
    return (
      <div className="py-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-[#E80645] dark:text-rose-400 flex items-center justify-center mx-auto mb-4 shadow-xs border border-rose-100 dark:border-rose-900/40">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            {lang === 'fa' ? 'برای مشاهده پنل کاربری وارد شوید' : 'Please Sign In to Access Dashboard'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            {lang === 'fa'
              ? 'برای مشاهده تاریخچه سفارشات، پیگیری مرسولات و مدیریت آدرس‌های ذخیره‌شده، لطفاً وارد حساب خود شوید.'
              : 'Sign in or register to view your order history, track deliveries, and manage saved addresses.'}
          </p>

          <div className="space-y-3">
            <button
              onClick={openLoginModal}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#E80645] hover:bg-[#c7053b] text-white font-bold text-xs shadow-md shadow-rose-900/20 transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{lang === 'fa' ? 'ورود به حساب کاربری' : 'Sign In to Account'}</span>
            </button>
            <button
              onClick={openRegisterModal}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <span>{lang === 'fa' ? 'ایجاد حساب کاربری جدید' : 'Create New Account'}</span>
            </button>
            <button
              onClick={quickDemoLogin}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/30 text-[#E80645] dark:text-rose-300 font-bold text-xs hover:bg-rose-100/70 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{lang === 'fa' ? 'ورود سریع با حساب آزمایشی (VIP)' : 'Instant Demo Login'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-8">
          {lang === 'fa' ? 'حساب کاربری و سفارشات' : 'My Account & Orders'}
        </h1>

        {/* Mobile Tab Switcher */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
          <button
            onClick={() => setActiveSection('overview')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'overview'
                ? 'bg-[#E80645] text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{lang === 'fa' ? 'نمای کلی' : 'Overview'}</span>
          </button>
          <button
            onClick={() => setActiveSection('orders')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'orders'
                ? 'bg-[#E80645] text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>{lang === 'fa' ? 'سفارشات' : 'Orders'}</span>
            <span className="text-[10px] bg-white/20 dark:bg-slate-800 px-1.5 py-0.2 rounded-full">
              {userOrders.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSection('addresses')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'addresses'
                ? 'bg-[#E80645] text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{lang === 'fa' ? 'آدرس‌ها' : 'Addresses'}</span>
            <span className="text-[10px] bg-white/20 dark:bg-slate-800 px-1.5 py-0.2 rounded-full">
              {userProfile.addresses.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSection('profile')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'profile'
                ? 'bg-[#E80645] text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{lang === 'fa' ? 'اطلاعات' : 'Profile'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar / Navigation Profile Pill */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl bg-white dark:bg-[#111726] border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs space-y-6">
              {/* User Profile Card */}
              <div className="flex items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div 
                  onClick={() => setActiveSection('profile')}
                  className="relative group cursor-pointer shrink-0"
                  title={lang === 'fa' ? 'تغییر تصویر پروفایل' : 'Change Profile Picture'}
                >
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#E80645]/20 shadow-xs group-hover:opacity-85 transition-opacity"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                    <Camera className="w-4 h-4" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-[#E80645] text-white shadow-2xs">
                    <Camera className="w-2.5 h-2.5" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base truncate">
                    {userProfile.name}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">{userProfile.email}</p>
                  <span className="inline-block mt-1 text-[10px] bg-rose-50 dark:bg-rose-950/60 text-[#E80645] dark:text-rose-400 font-bold px-2 py-0.5 rounded-full">
                    {userProfile.role === 'vip'
                      ? (lang === 'fa' ? 'عضو باشگاه مشتریان VIP' : 'VIP Member')
                      : (lang === 'fa' ? 'کاربر رسمی لومینا' : 'Verified Member')}
                  </span>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="space-y-1">
                <button
                  onClick={() => setActiveSection('overview')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    activeSection === 'overview'
                      ? 'bg-rose-50 dark:bg-rose-950/50 text-[#E80645] dark:text-rose-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4" />
                    <span>{lang === 'fa' ? 'نمای کلی حساب' : 'Overview'}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>

                <button
                  onClick={() => setActiveSection('orders')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    activeSection === 'orders'
                      ? 'bg-rose-50 dark:bg-rose-950/50 text-[#E80645] dark:text-rose-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4" />
                    <span>{lang === 'fa' ? 'تاریخچه سفارشات' : 'My Orders'}</span>
                  </div>
                  <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                    {userOrders.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('wishlist')}
                  className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4" />
                    <span>{lang === 'fa' ? 'کالاهای مورد علاقه' : 'Wishlist'}</span>
                  </div>
                  <span className="text-[11px] bg-rose-50 dark:bg-rose-950 text-[#E80645] px-2 py-0.5 rounded-full font-bold">
                    {wishlist.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveSection('addresses')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    activeSection === 'addresses'
                      ? 'bg-rose-50 dark:bg-rose-950/50 text-[#E80645] dark:text-rose-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4" />
                    <span>{lang === 'fa' ? 'آدرس‌های تحویل' : 'Saved Addresses'}</span>
                  </div>
                  <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                    {userProfile.addresses.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveSection('profile')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    activeSection === 'profile'
                      ? 'bg-rose-50 dark:bg-rose-950/50 text-[#E80645] dark:text-rose-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Settings className="w-4 h-4" />
                    <span>{lang === 'fa' ? 'ویرایش اطلاعات' : 'Edit Profile'}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold text-[#E80645] dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{lang === 'fa' ? 'خروج از حساب' : 'Log Out'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Panel */}
          <div className="lg:col-span-8 space-y-6">
            {/* OVERVIEW SECTION */}
            {activeSection === 'overview' && (
              <div className="space-y-6">
                {/* Highlights Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#111726] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                    <span className="text-xs text-slate-400 font-medium">{lang === 'fa' ? 'تعداد سفارش‌ها' : 'Total Orders'}</span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {userOrders.length}
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#111726] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                    <span className="text-xs text-slate-400 font-medium">{lang === 'fa' ? 'علاقه‌مندی‌ها' : 'Wishlist Items'}</span>
                    <div className="text-2xl font-black text-[#E80645] mt-1">
                      {wishlist.length}
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#111726] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                    <span className="text-xs text-slate-400 font-medium">{lang === 'fa' ? 'سطح کاربری' : 'Membership Level'}</span>
                    <div className="text-2xl font-black text-[#E80645] dark:text-rose-400 mt-1">
                      {userProfile.role === 'vip' ? 'VIP Platinum' : 'Standard'}
                    </div>
                  </div>
                </div>

                {/* Recent Orders Overview with Timeline Preview */}
                <div className="p-6 rounded-2xl bg-white dark:bg-[#111726] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {lang === 'fa' ? 'آخرین وضعیت سفارش فعال' : 'Active Order Status'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {lang === 'fa'
                          ? 'رهگیری لحظه‌ای و مرحله‌بندی شده جدیدترین سفارش شما'
                          : 'Real-time step-by-step progress of your latest order'}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveSection('orders')}
                      className="text-xs text-[#E80645] dark:text-rose-400 font-bold hover:underline cursor-pointer"
                    >
                      {lang === 'fa' ? 'مشاهده همه سفارشات' : 'View all orders'}
                    </button>
                  </div>

                  {userOrders.length > 0 && (
                    <div className="space-y-4">
                      {/* Interactive Timeline for the most recent order */}
                      <OrderStatusTimeline
                        order={userOrders[0]}
                        lang={lang}
                      />

                      {userOrders.length > 1 && (
                        <div className="pt-2">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">
                            {lang === 'fa' ? 'سایر سفارش‌های اخیر:' : 'Other Recent Orders:'}
                          </span>
                          <div className="space-y-2">
                            {userOrders.slice(1, 3).map(order => (
                              <div
                                key={order.id}
                                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={order.items[0]?.image}
                                    alt=""
                                    className="w-12 h-12 rounded-xl object-cover bg-white shrink-0"
                                  />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                                        {order.id}
                                      </span>
                                      <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                          order.status === 'delivered'
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                            : order.status === 'shipped'
                                            ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400'
                                            : order.status === 'cancelled'
                                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                                            : order.status === 'paid'
                                            ? 'bg-rose-100 text-[#E80645] dark:bg-rose-950 dark:text-rose-400'
                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                                        }`}
                                      >
                                        {order.statusFa ||
                                          (order.status === 'delivered'
                                            ? 'تحویل داده شده'
                                            : order.status === 'shipped'
                                            ? 'ارسال شده'
                                            : order.status === 'cancelled'
                                            ? 'لغو شده'
                                            : order.status === 'paid'
                                            ? 'پرداخت شده'
                                            : 'در حال پردازش')}
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                      {lang === 'fa' ? order.items[0]?.productNameFa : order.items[0]?.productName}
                                      {order.items.length > 1 && ` (+${order.items.length - 1} قلم دیگر)`}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-3">
                                  <span className="text-xs font-black text-[#E80645] dark:text-rose-400">
                                    {formatPrice(order.total)}
                                  </span>
                                  <button
                                    onClick={() => {
                                      setActiveSection('orders');
                                      setOrderStatusFilter(order.status as any);
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-[#E80645] dark:text-rose-400 hover:bg-slate-50 cursor-pointer"
                                  >
                                    {lang === 'fa' ? 'جزئیات مرسوله' : 'Details'}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ORDERS SECTION WITH TIMELINE COMPONENT */}
            {activeSection === 'orders' && (
              <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111726] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                        {lang === 'fa' ? 'پیگیری و تاریخچه سفارشات' : 'Order Tracking & History'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => syncOrdersWithBackend()}
                        disabled={isSyncingOrders}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-[#E80645] dark:hover:text-rose-400 text-[11px] font-bold transition-all disabled:opacity-50 cursor-pointer"
                        title={lang === 'fa' ? 'بروزرسانی وضعیت سفارشات از سرور' : 'Sync latest status from server'}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncingOrders ? 'animate-spin text-[#E80645]' : ''}`} />
                        <span>{lang === 'fa' ? (isSyncingOrders ? 'در حال دریافت...' : 'بروزرسانی وضعیت') : (isSyncingOrders ? 'Syncing...' : 'Sync Status')}</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {lang === 'fa'
                        ? 'نمایش مرحله‌به‌مرحله فرآیند آماده‌سازی، ارسال و تحویل تعیین‌شده توسط مدیریت فروشگاه'
                        : 'Official delivery progress set and verified by site administration'}
                    </p>
                  </div>

                  {/* Status Filter Tabs */}
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
                    <button
                      onClick={() => setOrderStatusFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        orderStatusFilter === 'all'
                          ? 'bg-white dark:bg-slate-900 text-[#E80645] dark:text-rose-400 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {lang === 'fa' ? `همه (${userOrders.length})` : `All (${userOrders.length})`}
                    </button>
                    <button
                      onClick={() => setOrderStatusFilter('processing')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        orderStatusFilter === 'processing'
                          ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {lang === 'fa' ? 'در حال پردازش' : 'Processing'}
                    </button>
                    <button
                      onClick={() => setOrderStatusFilter('shipped')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        orderStatusFilter === 'shipped'
                          ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {lang === 'fa' ? 'ارسال شده' : 'Shipped'}
                    </button>
                    <button
                      onClick={() => setOrderStatusFilter('delivered')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        orderStatusFilter === 'delivered'
                          ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {lang === 'fa' ? 'تحویل شده' : 'Delivered'}
                    </button>
                    <button
                      onClick={() => setOrderStatusFilter('cancelled')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        orderStatusFilter === 'cancelled'
                          ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {lang === 'fa' ? 'لغو شده' : 'Cancelled'}
                    </button>
                  </div>
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                  {userOrders
                    .filter(order => orderStatusFilter === 'all' || order.status === orderStatusFilter)
                    .map(order => (
                      <div
                        key={order.id}
                        className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 overflow-hidden space-y-4 p-5 sm:p-6 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                      >
                        {/* Order Header Meta */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-700/80">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-black text-slate-900 dark:text-white">
                              {order.id}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{order.date}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 hidden sm:inline">
                              {lang === 'fa' ? `مبلغ سفارش:` : `Total:`}
                            </span>
                            <span className="text-base font-black text-[#E80645] dark:text-rose-400">
                              {formatPrice(order.total)}
                            </span>
                          </div>
                        </div>

                        {/* EMBEDDED MODERN ORDER STATUS TIMELINE COMPONENT */}
                        <OrderStatusTimeline
                          order={order}
                          lang={lang}
                        />

                        {/* Order Items Summary */}
                        <div className="pt-2">
                          <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
                            {lang === 'fa' ? `اقلام سفارش (${order.items.length} قلم کالا):` : `Order Items:`}
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {order.items.map(item => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 text-xs"
                              >
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={item.image}
                                    alt=""
                                    className="w-11 h-11 rounded-lg object-cover bg-slate-50 shrink-0"
                                  />
                                  <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                                      {lang === 'fa' ? item.productNameFa : item.productName}
                                    </p>
                                    <span className="text-slate-400 text-[11px]">
                                      {item.quantity} × {formatPrice(item.price)}
                                    </span>
                                  </div>
                                </div>
                                <span className="font-bold text-slate-900 dark:text-white shrink-0">
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping & Payment Footer */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {lang === 'fa' ? 'روش پرداخت:' : 'Payment:'}
                            </span>
                            <span>{order.paymentMethod}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {lang === 'fa' ? 'تحویل‌گیرنده:' : 'Recipient:'}
                            </span>
                            <span>{order.shippingAddress?.fullName || userProfile.name}</span>
                            <span className="text-slate-400">({order.shippingAddress?.city})</span>
                          </div>
                        </div>
                      </div>
                    ))}

                  {userOrders.filter(
                    order => orderStatusFilter === 'all' || order.status === orderStatusFilter
                  ).length === 0 && (
                    <div className="py-12 text-center text-slate-400">
                      <p className="text-sm">
                        {lang === 'fa'
                          ? 'هیچ سفارشی با این وضعیت یافت نشد.'
                          : 'No orders found matching this status.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ADDRESSES SECTION */}
            {activeSection === 'addresses' && (
              <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111726] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                    {lang === 'fa' ? 'آدرس‌های ذخیره‌شده' : 'Saved Addresses'}
                  </h3>
                  <button
                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#E80645] dark:text-rose-400 hover:underline cursor-pointer"
                  >
                    {isAddingAddress ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    <span>{isAddingAddress ? (lang === 'fa' ? 'انصراف' : 'Cancel') : (lang === 'fa' ? 'افزودن آدرس جدید' : 'Add New Address')}</span>
                  </button>
                </div>

                {isAddingAddress && (
                  <form onSubmit={handleCreateAddress} className="p-4 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 mb-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {lang === 'fa' ? 'مشخصات آدرس جدید' : 'New Address Details'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder={lang === 'fa' ? 'عنوان (مثال: محل کار، منزل پدری)' : 'Label (e.g. Home, Office)'}
                        value={newAddrTitle}
                        onChange={e => setNewAddrTitle(e.target.value)}
                        className="text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-hidden"
                      />
                      <input
                        type="text"
                        placeholder={lang === 'fa' ? 'شهر (مثال: تهران)' : 'City'}
                        value={newAddrCity}
                        onChange={e => setNewAddrCity(e.target.value)}
                        className="text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-hidden"
                      />
                    </div>
                    <textarea
                      placeholder={lang === 'fa' ? 'نشانی دقیق، خیابان، پلاک، واحد...' : 'Full address, street, building, apt...'}
                      value={newAddrText}
                      onChange={e => setNewAddrText(e.target.value)}
                      rows={2}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-hidden"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <input
                        type="text"
                        placeholder={lang === 'fa' ? 'کد پستی ۱۰ رقمی' : 'Postal code'}
                        value={newAddrPostal}
                        onChange={e => setNewAddrPostal(e.target.value)}
                        className="text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-hidden"
                      />
                      <button
                        type="submit"
                        className="py-2.5 px-4 rounded-xl bg-[#E80645] text-white font-bold text-xs hover:bg-[#c7053b] transition-colors cursor-pointer"
                      >
                        {lang === 'fa' ? 'ذخیره آدرس جدید' : 'Save Address'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userProfile.addresses.map(addr => (
                    <div
                      key={addr.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 relative"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{addr.title}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-rose-50 dark:bg-rose-950/80 text-[#E80645] dark:text-rose-400 px-2 py-0.5 rounded-full font-bold">
                            {lang === 'fa' ? 'پیش‌فرض' : 'Default'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                        {addr.address}
                      </p>
                      <div className="text-[11px] text-slate-400">
                        {lang === 'fa' ? `کد پستی: ${addr.postalCode}` : `Postal code: ${addr.postalCode}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EDIT PROFILE SECTION */}
            {activeSection === 'profile' && (
              <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111726] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-8">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">
                    {lang === 'fa' ? 'مدیریت حساب کاربری و تصویر پروفایل' : 'Account & Profile Management'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === 'fa'
                      ? 'تصویر پروفایل خود را آپلود کنید، از آواتارهای آماده استفاده نمایید یا مشخصات فردی را ویرایش کنید.'
                      : 'Upload your custom profile photo, select preset avatars, or update personal information.'}
                  </p>
                </div>

                {/* Avatar Upload & Preset Selector Component */}
                <AvatarUploadManager />

                {/* Personal Information Form */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4">
                    {lang === 'fa' ? 'ویرایش اطلاعات فردی' : 'Personal Information'}
                  </h4>

                  <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {lang === 'fa' ? 'نام و نام خانوادگی' : 'Full Name'}
                      </label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={e => setProfileName(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-[#E80645]/20 focus:border-[#E80645]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {lang === 'fa' ? 'شماره موبایل' : 'Phone'}
                      </label>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={e => setProfilePhone(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-[#E80645]/20 focus:border-[#E80645]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {lang === 'fa' ? 'ایمیل (غیرقابل تغییر)' : 'Email (Read only)'}
                      </label>
                      <input
                        type="email"
                        value={userProfile.email}
                        disabled
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40 text-slate-400 outline-hidden cursor-not-allowed"
                      />
                    </div>

                    <button
                      type="submit"
                      className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-[#E80645] hover:bg-[#c7053b] text-white font-bold text-xs shadow-md shadow-rose-900/20 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{lang === 'fa' ? 'ذخیره اطلاعات کاربری' : 'Save Changes'}</span>
                    </button>
                  </form>
                </div>

                {/* Appearance & Theme Customization */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-[#E80645] dark:text-rose-400" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {lang === 'fa' ? 'تنظیمات تم و حالت نمایشی فروشگاه' : 'Appearance & Theme'}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {lang === 'fa'
                            ? 'پوسته ظاهری لومینا را مطابق سلیقه یا نور محیط خود تنظیم کنید'
                            : 'Customize Lumina color scheme to suit your preference or ambient light'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Light Option */}
                    <button
                      type="button"
                      onClick={() => setThemeMode('light')}
                      className={`p-4 rounded-2xl border text-start transition-all cursor-pointer ${
                        themeMode === 'light'
                          ? 'bg-rose-50/70 dark:bg-rose-950/40 border-[#E80645] ring-2 ring-[#E80645]/20 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mb-3 shadow-xs">
                        <Sun className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {lang === 'fa' ? 'حالت روز (روشن)' : 'Light Theme'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {lang === 'fa'
                          ? 'پس‌زمینه تمیز و سفید با بیشترین شفافیت و کنتراست متنی'
                          : 'Crisp white canvas with high contrast and readability'}
                      </p>
                    </button>

                    {/* Dark Option */}
                    <button
                      type="button"
                      onClick={() => setThemeMode('dark')}
                      className={`p-4 rounded-2xl border text-start transition-all cursor-pointer ${
                        themeMode === 'dark'
                          ? 'bg-rose-50/70 dark:bg-rose-950/40 border-[#E80645] ring-2 ring-[#E80645]/20 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-[#E80645] dark:text-rose-400 flex items-center justify-center mb-3 shadow-xs">
                        <Moon className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {lang === 'fa' ? 'حالت شب (تاریک)' : 'Dark Theme'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {lang === 'fa'
                          ? 'مشکی ملایم با هایلایت‌های روبی بدون خستگی چشم'
                          : 'Ergonomic deep slate with ruby accents for low eye strain'}
                      </p>
                    </button>

                    {/* System Option */}
                    <button
                      type="button"
                      onClick={() => setThemeMode('system')}
                      className={`p-4 rounded-2xl border text-start transition-all cursor-pointer ${
                        themeMode === 'system'
                          ? 'bg-rose-50/70 dark:bg-rose-950/40 border-[#E80645] ring-2 ring-[#E80645]/20 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3 shadow-xs">
                        <Laptop className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {lang === 'fa' ? 'خودکار / سیستم' : 'System Match'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {lang === 'fa'
                          ? 'هماهنگی هوشمند و خودکار با تم ویندوز، مکینتاش یا موبایل شما'
                          : 'Automatically syncs with your OS light/dark schedule'}
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
