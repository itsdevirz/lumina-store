import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Shield,
  ShoppingBag,
  DollarSign,
  Calendar,
  Lock,
  Unlock,
  Eye,
  X
} from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users${search ? `?search=${search}` : ''}`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (user: any) => {
    try {
      const res = await fetch(`/api/users/${user.id}/status`, {
        method: 'PATCH'
      });
      if (res.ok) {
        const updated = await res.json();
        setUsers(prev => prev.map(u => (u.id === user.id ? updated : u)));
        if (selectedUser && selectedUser.id === user.id) {
          setSelectedUser(updated);
        }
      }
    } catch (err) {
      console.error('Error toggling user status:', err);
    }
  };

  const formatTomans = (num: number) => {
    return (num || 0).toLocaleString('fa-IR') + ' تومان';
  };

  const formatNumber = (num: number) => {
    return (num || 0).toLocaleString('fa-IR');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            مدیریت کاربران و مشتریان
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            مشاهده پرونده مشتریان، سابقه خریدهای انجام‌شده، وضعیت حساب و سطح کاربری
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="جستجوی نام کاربر، شماره تلفن یا ایمیل..."
            className="w-full pr-9 pl-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
        </div>

        <div className="text-xs text-slate-400 font-bold">
          مجموع: {formatNumber(users.length)} کاربر
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold">
                <th className="py-4 pr-6">کاربر</th>
                <th className="py-4 px-3">شماره تماس / ایمیل</th>
                <th className="py-4 px-3">تاریخ عضویت</th>
                <th className="py-4 px-3">تعداد سفارش‌ها</th>
                <th className="py-4 px-3">مجموع خریدها</th>
                <th className="py-4 px-3">وضعیت حساب</th>
                <th className="py-4 pl-6 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    در حال بارگذاری اطلاعات کاربران...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    کاربری با این مشخصات یافت نشد.
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 pr-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80&auto=format&fit=crop'}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                            {u.role === 'vip' && (
                              <span className="text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-black px-1.5 py-0.5 rounded-sm">
                                VIP
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">شناسه: {u.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <div>
                        <p className="font-bold text-slate-700 dark:text-slate-300">{u.phone}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-slate-500">{u.joinedDate}</td>
                    <td className="py-4 px-3 font-bold text-slate-700 dark:text-slate-300">
                      {formatNumber(u.ordersCount)} سفارش
                    </td>
                    <td className="py-4 px-3 font-black text-indigo-600 dark:text-indigo-400">
                      {formatTomans(u.totalSpent)}
                    </td>
                    <td className="py-4 px-3">
                      {u.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>فعال</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400">
                          <XCircle className="w-3 h-3" />
                          <span>مسدود شده</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 pl-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedUser(u)}
                          title="مشاهده پروفایل کاربر"
                          className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(u)}
                          title={u.status === 'active' ? 'مسدودسازی حساب' : 'فعال‌سازی حساب'}
                          className={`p-1.5 rounded-xl transition-colors ${
                            u.status === 'active'
                              ? 'hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-500'
                              : 'hover:bg-emerald-50 dark:hover:bg-emerald-950 text-rose-500 hover:text-emerald-500'
                          }`}
                        >
                          {u.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-slate-900 dark:text-white">پروفایل مشتری</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={selectedUser.avatar}
                alt=""
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/30"
              />
              <div>
                <h4 className="font-black text-base text-slate-900 dark:text-white">{selectedUser.name}</h4>
                <p className="text-xs text-slate-400">{selectedUser.phone}</p>
                <p className="text-xs text-slate-400">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400">تعداد سفارش‌ها</span>
                <p className="font-black text-slate-900 dark:text-white text-base mt-0.5">
                  {formatNumber(selectedUser.ordersCount)}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400">مجموع خرید</span>
                <p className="font-black text-indigo-600 dark:text-indigo-400 text-sm mt-0.5">
                  {formatTomans(selectedUser.totalSpent)}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                وضعیت: {selectedUser.status === 'active' ? 'فعال' : 'مسدود'}
              </span>
              <button
                onClick={() => handleToggleStatus(selectedUser)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedUser.status === 'active'
                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                }`}
              >
                {selectedUser.status === 'active' ? 'مسدودسازی حساب' : 'رفع مسدودی'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
