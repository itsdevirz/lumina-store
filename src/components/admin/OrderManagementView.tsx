import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  X,
  Send,
  Save,
  ShieldCheck,
  Building2,
  Calendar,
  Sparkles,
  Check
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const OrderManagementView: React.FC = () => {
  const { updateOrderStatus: updateContextOrderStatus } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Order Details / Edit Modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Edit status form fields in modal
  const [modalStatus, setModalStatus] = useState<string>('processing');
  const [modalCourier, setModalCourier] = useState<string>('پیک اکسپرس لومینا');
  const [modalTracking, setModalTracking] = useState<string>('');
  const [modalEstDelivery, setModalEstDelivery] = useState<string>('');
  const [modalAdminNote, setModalAdminNote] = useState<string>('');
  const [isSavingStatus, setIsSavingStatus] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [search, selectedStatus]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);

      const res = await fetch(`/api/orders?${params.toString()}`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const openOrderModal = (order: any) => {
    setSelectedOrder(order);
    setModalStatus(order.status || 'processing');
    setModalCourier(order.courierName || order.courier || 'پیک اکسپرس لومینا');
    setModalTracking(order.trackingCode || order.trackingNumber || '');
    setModalEstDelivery(order.estimatedDelivery || '');
    setModalAdminNote(order.statusAdminNote || '');
    setSaveSuccessMsg(null);
  };

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: string,
    metadata?: {
      trackingNumber?: string;
      courier?: string;
      estimatedDelivery?: string;
      statusAdminNote?: string;
    }
  ) => {
    setIsSavingStatus(true);
    try {
      const payload = {
        status: newStatus,
        ...(metadata || {})
      };

      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(updated);
        }

        // Also notify client StoreContext
        try {
          updateContextOrderStatus(orderId, newStatus as any, {
            trackingCode: metadata?.trackingNumber,
            courierName: metadata?.courier,
            estimatedDelivery: metadata?.estimatedDelivery,
            statusAdminNote: metadata?.statusAdminNote
          });
        } catch (e) {
          console.error(e);
        }

        setSaveSuccessMsg('وضعیت مرسوله با موفقیت ثبت شد و در پنل کاربر بروزرسانی گردید.');
        setTimeout(() => setSaveSuccessMsg(null), 3500);
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    } finally {
      setIsSavingStatus(false);
    }
  };

  const handleSaveModalStatus = async () => {
    if (!selectedOrder) return;
    await handleUpdateStatus(selectedOrder.id, modalStatus, {
      trackingNumber: modalTracking,
      courier: modalCourier,
      estimatedDelivery: modalEstDelivery,
      statusAdminNote: modalAdminNote
    });
  };

  const formatTomans = (num: number) => {
    return (num || 0).toLocaleString('fa-IR') + ' تومان';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
            پرداخت شده
          </span>
        );
      case 'processing':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
            در حال پردازش
          </span>
        );
      case 'shipped':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
            ارسال شده
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            تحویل داده شده
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400">
            لغو شده
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            در انتظار پرداخت
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              مدیریت و تعیین وضعیت مرسولات
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              کنترل پنل مدیر
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            تعیین وضعیت سفارش‌ها، تخصیص ناوگان پستی، صدور کد رهگیری و بازتاب لحظه‌ای در پنل کاربری خریداران
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="جستجوی کد سفارش، نام مشتری یا شماره تماس..."
            className="w-full pr-9 pl-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-indigo-500"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="paid">پرداخت شده</option>
            <option value="processing">در حال پردازش</option>
            <option value="shipped">ارسال شده</option>
            <option value="delivered">تحویل داده شده</option>
            <option value="cancelled">لغو شده</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold">
                <th className="py-4 pr-6">شماره سفارش</th>
                <th className="py-4 px-3">خریدار</th>
                <th className="py-4 px-3">تاریخ ثبت</th>
                <th className="py-4 px-3">مبلغ کل</th>
                <th className="py-4 px-3">وضعیت فعلی مرسوله</th>
                <th className="py-4 px-3">تغییر سریع وضعیت</th>
                <th className="py-4 pl-6 text-center">تعیین کامل مرسوله</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    در حال دریافت سفارش‌ها...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    سفارشی با این شرایط پیدا نشد.
                  </td>
                </tr>
              ) : (
                orders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 pr-6 font-black text-slate-900 dark:text-white font-mono">
                      {o.id}
                    </td>
                    <td className="py-4 px-3">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{o.customer?.name}</p>
                        <p className="text-[11px] text-slate-400">{o.customer?.phone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-slate-500">{o.date}</td>
                    <td className="py-4 px-3 font-black text-indigo-600 dark:text-indigo-400">
                      {formatTomans(o.total)}
                    </td>
                    <td className="py-4 px-3">{getStatusBadge(o.status)}</td>
                    <td className="py-4 px-3">
                      <select
                        value={o.status}
                        onChange={e => handleUpdateStatus(o.id, e.target.value)}
                        className="text-xs px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold outline-hidden cursor-pointer hover:border-indigo-400 transition-colors"
                      >
                        <option value="pending">در انتظار پرداخت</option>
                        <option value="paid">پرداخت شده</option>
                        <option value="processing">در حال پردازش</option>
                        <option value="shipped">ارسال شده</option>
                        <option value="delivered">تحویل داده شده</option>
                        <option value="cancelled">لغو شده</option>
                      </select>
                    </td>
                    <td className="py-4 pl-6 text-center">
                      <button
                        onClick={() => openOrderModal(o)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 font-bold transition-all text-xs cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>تعیین وضعیت و کد پستی</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Full Shipment Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm text-slate-900 dark:text-white">
                      تعیین وضعیت مرسوله سفارش {selectedOrder.id}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-slate-500">
                      پنل ادمین
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">تاریخ ثبت: {selectedOrder.date}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Success Notification */}
              {saveSuccessMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-2 font-bold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* Status Update Card */}
              <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="font-black text-slate-900 dark:text-white text-xs">
                    تنظیم وضعیت مرسوله و اطلاعات ارسال برای کاربر
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Status Selection */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      مرحله / وضعیت سفارش:
                    </label>
                    <select
                      value={modalStatus}
                      onChange={e => setModalStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-slate-100 outline-hidden focus:border-indigo-500"
                    >
                      <option value="pending">در انتظار پرداخت</option>
                      <option value="paid">پرداخت شده</option>
                      <option value="processing">در حال پردازش و بسته‌بندی</option>
                      <option value="shipped">ارسال شده (تحویل به سرویس ارسال)</option>
                      <option value="delivered">تحویل نهایی داده شده</option>
                      <option value="cancelled">لغو شده</option>
                    </select>
                  </div>

                  {/* Courier Selection */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      سرویس حمل و توزیع:
                    </label>
                    <select
                      value={modalCourier}
                      onChange={e => setModalCourier(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-slate-100 outline-hidden focus:border-indigo-500"
                    >
                      <option value="پیک اکسپرس لومینا">پیک اکسپرس اختصاصی لومینا</option>
                      <option value="پست پیشتاز">پست پیشتاز جمهوری اسلامی ایران</option>
                      <option value="تیپاکس">تیپاکس اکسپرس (Tipax)</option>
                      <option value="چاپار">پست خصوصی چاپار (Chapar)</option>
                      <option value="اسنپ‌باکس">اسنپ باکس (تحویل فوری شهری)</option>
                      <option value="ماهکس">شرکت پست سریع ماهکس</option>
                    </select>
                  </div>

                  {/* Tracking Number Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      کد رهگیری پستی / بارنامه:
                    </label>
                    <input
                      type="text"
                      value={modalTracking}
                      onChange={e => setModalTracking(e.target.value)}
                      placeholder="مثلاً: LM-982347 یا ۲۴ رقم کد رهگیری پستی"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-hidden focus:border-indigo-500 font-mono text-xs"
                    />
                  </div>

                  {/* Estimated Delivery Date */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      زمان تقریبی تحویل:
                    </label>
                    <input
                      type="text"
                      value={modalEstDelivery}
                      onChange={e => setModalEstDelivery(e.target.value)}
                      placeholder="مثلاً: فردا تا ساعت ۱۸ یا ۳ روز کاری"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-hidden focus:border-indigo-500 text-xs"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveModalStatus}
                    disabled={isSavingStatus}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {isSavingStatus ? 'در حال ثبت...' : 'ثبت وضعیت و ارسال به پنل کاربر'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Customer and Shipping Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-500" />
                    <span>مشخصات خریدار</span>
                  </span>
                  <div className="space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                    <p>نام و نام خانوادگی: {selectedOrder.customer?.name}</p>
                    <p>شماره تماس: {selectedOrder.customer?.phone}</p>
                    <p>پست الکترونیک: {selectedOrder.customer?.email || '-'}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    <span>آدرس و اطلاعات تحویل</span>
                  </span>
                  <div className="space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                    <p>شهر: {selectedOrder.customer?.city}</p>
                    <p>نشانی: {selectedOrder.customer?.address}</p>
                    <p>کد پستی: {selectedOrder.customer?.postalCode || '-'}</p>
                    <p>سرویس ارسال: {selectedOrder.courierName || selectedOrder.courier || '-'}</p>
                    <p>کد رهگیری: {selectedOrder.trackingCode || selectedOrder.trackingNumber || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Ordered Items List */}
              <div className="space-y-3">
                <h4 className="font-black text-slate-900 dark:text-white">اقلام خریداری‌شده</h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between gap-3 bg-white dark:bg-slate-900">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {item.productNameFa || item.nameFa || item.name}
                          </p>
                          <span className="text-[11px] text-slate-400">
                            تعداد: {item.quantity} عدد × {formatTomans(item.price)}
                          </span>
                        </div>
                      </div>

                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatTomans(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="flex justify-between text-slate-500">
                  <span>مجموع مبالغ اقلام:</span>
                  <span>{formatTomans(selectedOrder.subtotal || selectedOrder.total)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>تخفیف اعمال‌شده:</span>
                    <span>- {formatTomans(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>هزینه بسته‌بندی و ارسال:</span>
                  <span>{selectedOrder.shipping > 0 ? formatTomans(selectedOrder.shipping) : 'رایگان'}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>مبلغ کل پرداختی:</span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {formatTomans(selectedOrder.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
