import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Tag,
  Package,
  CheckCircle2,
  XCircle,
  Search,
  Percent,
  TrendingDown,
  Layers,
  Copy,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Flame,
  Check,
  X,
  Eye,
  Sliders,
  Gift
} from 'lucide-react';
import { Festival, FestivalProduct, FestivalCoupon, Product, AccentColor } from '../../types';

interface FestivalManagementViewProps {
  onViewStoreFestival?: (festival: Festival) => void;
}

export const FestivalManagementView: React.FC<FestivalManagementViewProps> = ({
  onViewStoreFestival
}) => {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'scheduled' | 'expired' | 'disabled'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFestival, setEditingFestival] = useState<Festival | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'info' | 'schedule' | 'products' | 'coupons'>('info');

  // Form State
  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [slogan, setSlogan] = useState('');
  const [sloganEn, setSloganEn] = useState('');
  const [description, setDescription] = useState('');
  const [badgeText, setBadgeText] = useState('تخفیف شگفت‌انگیز');
  const [themeColor, setThemeColor] = useState<AccentColor>('rose');
  const [priority, setPriority] = useState<number>(10);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<FestivalProduct[]>([]);
  const [festivalCoupons, setFestivalCoupons] = useState<FestivalCoupon[]>([]);

  // Product Picker Filter in Modal
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // New Coupon in Modal Form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percent' | 'fixed'>('percent');
  const [newCouponAmount, setNewCouponAmount] = useState('20');
  const [newCouponMinPurchase, setNewCouponMinPurchase] = useState('2000000');
  const [newCouponMaxDiscount, setNewCouponMaxDiscount] = useState('2000000');
  const [newCouponMaxUsage, setNewCouponMaxUsage] = useState('500');

  useEffect(() => {
    fetchFestivals();
    fetchProducts();
  }, []);

  const fetchFestivals = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/festivals');
      const data = await res.json();
      setFestivals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching festivals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setAllProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const openCreateModal = () => {
    setEditingFestival(null);
    setTitle('');
    setTitleEn('');
    setSlogan('');
    setSloganEn('');
    setDescription('');
    setBadgeText('تخفیف شگفت‌انگیز');
    setThemeColor('rose');
    setPriority(10);
    setIsActive(true);
    
    // Default dates: now to +7 days
    const now = new Date();
    const future = new Date(Date.now() + 7 * 86400000);
    setStartDate(now.toISOString().split('T')[0]);
    setEndDate(future.toISOString().split('T')[0]);
    setBannerImage('/images/products/photo-1505740420928-5e560c06d30e.jpg');
    
    // Pre-select 2 top products
    if (allProducts.length > 0) {
      const initialSelected = allProducts.slice(0, 3).map(p => ({
        productId: p.id,
        name: p.name,
        nameFa: p.nameFa,
        brand: p.brand,
        image: p.images[0],
        category: p.category,
        categoryFa: p.categoryFa,
        originalPrice: p.price,
        discountedPrice: Math.round(p.price * 0.75),
        discountPercent: 25,
        festivalStock: 10,
        soldInFestival: 0,
        validUntil: 'تا پایان جشنواره'
      }));
      setSelectedProducts(initialSelected);
    } else {
      setSelectedProducts([]);
    }

    setFestivalCoupons([
      {
        id: `coup-${Date.now()}`,
        code: 'FESTIVAL2026',
        type: 'percent',
        amount: 20,
        minPurchase: 2000000,
        maxDiscount: 2000000,
        maxUsage: 500,
        usageCount: 0,
        isActive: true
      }
    ]);

    setActiveModalTab('info');
    setIsModalOpen(true);
  };

  const openEditModal = (fest: Festival) => {
    setEditingFestival(fest);
    setTitle(fest.title || '');
    setTitleEn(fest.titleEn || '');
    setSlogan(fest.slogan || '');
    setSloganEn(fest.sloganEn || '');
    setDescription(fest.description || '');
    setBadgeText(fest.badgeText || 'تخفیف شگفت‌انگیز');
    setThemeColor(fest.themeColor || 'rose');
    setPriority(fest.priority || 10);
    setIsActive(fest.isActive ?? true);
    setStartDate(fest.startDate || new Date(fest.startTimestamp || Date.now()).toISOString().split('T')[0]);
    setEndDate(fest.endDate || new Date(fest.endTimestamp || Date.now() + 86400000 * 7).toISOString().split('T')[0]);
    setBannerImage(fest.bannerImage || '');
    setSelectedProducts(fest.products || []);
    setFestivalCoupons(fest.coupons || []);
    setActiveModalTab('info');
    setIsModalOpen(true);
  };

  const handleToggleActive = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const res = await fetch(`/api/festivals/${id}/toggle`, { method: 'PATCH' });
      if (res.ok) {
        const updated = await res.json();
        setFestivals(prev => prev.map(f => (f.id === id ? updated : f)));
        window.dispatchEvent(new CustomEvent('lumina_festival_updated'));
      }
    } catch (err) {
      console.error('Error toggling festival:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/festivals/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFestivals(prev => prev.filter(f => f.id !== id));
        setDeleteConfirmId(null);
        window.dispatchEvent(new CustomEvent('lumina_festival_updated'));
      }
    } catch (err) {
      console.error('Error deleting festival:', err);
    }
  };

  const handleSaveFestival = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('لطفاً عنوان جشنواره را وارد کنید.');
      return;
    }

    const startTimestamp = new Date(startDate).getTime() || Date.now();
    // End of selected day
    const endTimestamp = new Date(endDate).getTime() + 86399000 || Date.now() + 86400000 * 7;

    const payload: Partial<Festival> = {
      title: title.trim(),
      titleEn: titleEn.trim() || undefined,
      slogan: slogan.trim() || undefined,
      sloganEn: sloganEn.trim() || undefined,
      description: description.trim(),
      badgeText: badgeText.trim() || 'تخفیف شگفت‌انگیز',
      themeColor,
      priority: Number(priority) || 10,
      isActive,
      startDate,
      endDate,
      startTimestamp,
      endTimestamp,
      bannerImage,
      couponCode: festivalCoupons[0]?.code || undefined,
      discountPercent: selectedProducts[0]?.discountPercent || 25,
      products: selectedProducts,
      coupons: festivalCoupons
    };

    try {
      if (editingFestival) {
        const res = await fetch(`/api/festivals/${editingFestival.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const updated = await res.json();
          setFestivals(prev => prev.map(f => (f.id === updated.id ? updated : f)));
        }
      } else {
        const res = await fetch('/api/festivals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const created = await res.json();
          setFestivals(prev => [created, ...prev]);
        }
      }

      setIsModalOpen(false);
      window.dispatchEvent(new CustomEvent('lumina_festival_updated'));
    } catch (err) {
      console.error('Error saving festival:', err);
      alert('خطا در ذخیره جشنواره. لطفاً مجدداً تلاش فرمایید.');
    }
  };

  // Schedule Presets
  const applyPreset = (days: number) => {
    const now = new Date();
    const end = new Date(Date.now() + days * 86400000);
    setStartDate(now.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  // Product Selection Handlers
  const handleToggleProduct = (product: Product) => {
    const exists = selectedProducts.some(p => p.productId === product.id);
    if (exists) {
      setSelectedProducts(prev => prev.filter(p => p.productId !== product.id));
    } else {
      const discountPercent = 25;
      const discountedPrice = Math.round(product.price * (1 - discountPercent / 100));
      setSelectedProducts(prev => [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          nameFa: product.nameFa,
          brand: product.brand,
          image: product.images[0],
          category: product.category,
          categoryFa: product.categoryFa,
          originalPrice: product.price,
          discountedPrice,
          discountPercent,
          festivalStock: 10,
          soldInFestival: 0,
          validUntil: 'تا پایان جشنواره'
        }
      ]);
    }
  };

  const handleUpdateProductDiscount = (productId: string, percent: number) => {
    setSelectedProducts(prev =>
      prev.map(p => {
        if (p.productId !== productId) return p;
        const validPercent = Math.min(90, Math.max(1, percent));
        const discountedPrice = Math.round(p.originalPrice * (1 - validPercent / 100));
        return {
          ...p,
          discountPercent: validPercent,
          discountedPrice
        };
      })
    );
  };

  const handleUpdateProductPrice = (productId: string, price: number) => {
    setSelectedProducts(prev =>
      prev.map(p => {
        if (p.productId !== productId) return p;
        const validPrice = Math.max(1000, price);
        const discountPercent = Math.round(((p.originalPrice - validPrice) / p.originalPrice) * 100);
        return {
          ...p,
          discountedPrice: validPrice,
          discountPercent: Math.max(1, Math.min(99, discountPercent))
        };
      })
    );
  };

  const handleUpdateProductStock = (productId: string, stock: number) => {
    setSelectedProducts(prev =>
      prev.map(p => {
        if (p.productId !== productId) return p;
        return {
          ...p,
          festivalStock: Math.max(1, stock)
        };
      })
    );
  };

  // Festival Coupon Handlers
  const handleAddCoupon = () => {
    if (!newCouponCode.trim()) return;
    const newCoupon: FestivalCoupon = {
      id: `fest-coup-${Date.now()}`,
      code: newCouponCode.trim().toUpperCase(),
      type: newCouponType,
      amount: Number(newCouponAmount) || 10,
      minPurchase: Number(newCouponMinPurchase) || 0,
      maxDiscount: newCouponType === 'percent' ? Number(newCouponMaxDiscount) || undefined : undefined,
      maxUsage: Number(newCouponMaxUsage) || 100,
      usageCount: 0,
      isActive: true
    };

    setFestivalCoupons(prev => [...prev, newCoupon]);
    setNewCouponCode('');
  };

  const handleRemoveCoupon = (id: string) => {
    setFestivalCoupons(prev => prev.filter(c => c.id !== id));
  };

  const handleToggleCoupon = (id: string) => {
    setFestivalCoupons(prev =>
      prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Helper formatting
  const formatToman = (amount: number) => {
    return (amount || 0).toLocaleString('fa-IR') + ' تومان';
  };

  const getFestivalStatus = (fest: Festival) => {
    const now = Date.now();
    if (!fest.isActive) return { label: 'غیرفعال', color: 'bg-slate-500/20 text-slate-400 border-slate-700' };
    if (fest.startTimestamp && now < fest.startTimestamp) {
      return { label: 'زمان‌بندی شده', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
    }
    if (fest.endTimestamp && now > fest.endTimestamp) {
      return { label: 'منقضی شده', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
    }
    return { label: '🟢 فعال در فروشگاه', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
  };

  // Filtering list
  const filteredFestivals = festivals.filter(fest => {
    const now = Date.now();
    const matchesSearch =
      fest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fest.slogan && fest.slogan.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'active') {
      return fest.isActive && (!fest.startTimestamp || now >= fest.startTimestamp) && (!fest.endTimestamp || now <= fest.endTimestamp);
    }
    if (statusFilter === 'scheduled') {
      return fest.isActive && fest.startTimestamp && now < fest.startTimestamp;
    }
    if (statusFilter === 'expired') {
      return fest.endTimestamp && now > fest.endTimestamp;
    }
    if (statusFilter === 'disabled') {
      return !fest.isActive;
    }
    return true;
  });

  const activeCount = festivals.filter(f => {
    const now = Date.now();
    return f.isActive && (!f.startTimestamp || now >= f.startTimestamp) && (!f.endTimestamp || now <= f.endTimestamp);
  }).length;

  const totalDiscountedProducts = festivals.reduce((sum, f) => sum + (f.products?.length || 0), 0);
  const totalCoupons = festivals.reduce((sum, f) => sum + (f.coupons?.length || 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
              مدیریت جشنواره‌ها و کمپین‌ها
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#62DB00]/15 text-[#62DB00] border border-[#62DB00]/30">
              CAMPAIGNS
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            ایجاد کمپین‌های تخفیفی، زمان‌بندی تاریخ شروع و پایان، تعیین شعار تبلیغاتی، قیمت‌های ویژه و کدهای تخفیف اختصاصی
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#62DB00] hover:bg-[#52B800] text-black text-xs font-black transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>ایجاد جشنواره جدید</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>جشنواره‌های فعال</span>
            <Flame className="w-4 h-4 text-[#62DB00]" />
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-white mt-2 font-mono">
            {activeCount.toLocaleString('fa-IR')}
          </p>
          <p className="text-[11px] text-[#62DB00] mt-1 font-medium">نمایش زنده در صفحه اصلی</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>کل کمپین‌ها</span>
            <Layers className="w-4 h-4 text-zinc-400" />
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-white mt-2 font-mono">
            {festivals.length.toLocaleString('fa-IR')}
          </p>
          <p className="text-[11px] text-zinc-400 mt-1 font-medium">ثبت‌شده در پایگاه داده</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>محصولات تخفیف‌دار</span>
            <Package className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-white mt-2 font-mono">
            {totalDiscountedProducts.toLocaleString('fa-IR')}
          </p>
          <p className="text-[11px] text-amber-500 mt-1 font-medium">کالای منتخب جشنواره</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>کدهای تخفیف متصل</span>
            <Tag className="w-4 h-4 text-zinc-400" />
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-white mt-2 font-mono">
            {totalCoupons.toLocaleString('fa-IR')}
          </p>
          <p className="text-[11px] text-zinc-400 mt-1 font-medium">کوپن‌های فعال کمپین</p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="جستجو بر اساس عنوان یا شعار جشنواره..."
            className="w-full pr-10 pl-4 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white outline-hidden focus:border-[#62DB00]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'همه' },
            { id: 'active', label: 'فعال' },
            { id: 'scheduled', label: 'زمان‌بندی شده' },
            { id: 'expired', label: 'پایان‌یافته' },
            { id: 'disabled', label: 'غیرفعال' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#62DB00] text-black font-black shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Festival List */}
      {isLoading ? (
        <div className="p-12 text-center text-zinc-400 text-xs">در حال بارگذاری اطلاعات جشنواره‌ها...</div>
      ) : filteredFestivals.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 text-[#62DB00]" />
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">هیچ جشنواره‌ای یافت نشد</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            می‌توانید با زدن دکمه «ایجاد جشنواره جدید»، اولین کمپین تخفیفی فروشگاه خود را راه‌اندازی کنید.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-[#62DB00] hover:bg-[#52B800] text-black text-xs font-bold transition-colors cursor-pointer"
          >
            ایجاد جشنواره جدید
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredFestivals.map(fest => {
            const status = getFestivalStatus(fest);
            return (
              <div
                key={fest.id}
                className="rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 p-5 sm:p-6 space-y-4 shadow-xs relative overflow-hidden transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
              >
                {/* Top Row: Title, Status, Priority */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-mono">
                        اولویت: {fest.priority || 10}
                      </span>
                      {fest.badgeText && (
                        <span className="px-2 py-0.5 rounded-full bg-[#62DB00]/15 text-[#62DB00] border border-[#62DB00]/30 text-[10px] font-bold">
                          {fest.badgeText}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white pt-1">
                      {fest.title}
                    </h3>
                    {/* Optional Slogan Display */}
                    {fest.slogan && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        «{fest.slogan}»
                      </p>
                    )}
                  </div>

                  {/* Switch Active Status Toggle */}
                  <button
                    onClick={(e) => handleToggleActive(fest.id, e)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                      fest.isActive ? 'bg-[#62DB00]' : 'bg-zinc-300 dark:bg-zinc-700'
                    }`}
                    title={fest.isActive ? 'غیرفعال کردن' : 'فعال کردن'}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-black transition-transform ${
                        fest.isActive ? 'translate-x-1' : 'translate-x-6'
                      }`}
                    />
                  </button>
                </div>

                {/* Date & Time Duration */}
                <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <span>شروع: {fest.startDate || 'نامشخص'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>پایان: {fest.endDate || 'نامشخص'}</span>
                  </div>
                </div>

                {/* Products & Coupons Summary Badges */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                      <Package className="w-3.5 h-3.5 text-zinc-400" />
                      <strong>{fest.products?.length || 0}</strong> محصول تخفیف‌دار
                    </span>
                    <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                      <Tag className="w-3.5 h-3.5 text-zinc-400" />
                      <strong>{fest.coupons?.length || 0}</strong> کد تخفیف
                    </span>
                  </div>

                  {fest.couponCode && (
                    <button
                      onClick={() => copyToClipboard(fest.couponCode!)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono font-bold text-[11px] hover:border-[#62DB00] border border-transparent transition-colors cursor-pointer"
                    >
                      {copiedCode === fest.couponCode ? (
                        <Check className="w-3 h-3 text-[#62DB00]" />
                      ) : (
                        <Copy className="w-3 h-3 text-zinc-400" />
                      )}
                      <span>{fest.couponCode}</span>
                    </button>
                  )}
                </div>

                {/* Selected Products Preview Thumbnails */}
                {fest.products && fest.products.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {fest.products.slice(0, 4).map((p, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/90 text-[11px] shrink-0 border border-zinc-200 dark:border-zinc-700/60"
                      >
                        <img
                          src={p.image || 'https://via.placeholder.com/40'}
                          alt={p.nameFa || p.name}
                          className="w-7 h-7 rounded-lg object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex flex-col">
                          <span className="text-zinc-900 dark:text-zinc-200 font-medium line-clamp-1 max-w-[120px]">
                            {p.nameFa || p.name}
                          </span>
                          <span className="text-[#62DB00] font-mono font-bold text-[10px]">
                            {p.discountPercent}٪ تخفیف
                          </span>
                        </div>
                      </div>
                    ))}
                    {fest.products.length > 4 && (
                      <span className="text-[11px] text-zinc-400 px-2 font-mono">
                        +{fest.products.length - 4} محصول دیگر
                      </span>
                    )}
                  </div>
                )}

                {/* Actions Row */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(fest)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-bold transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700/60"
                    >
                      <Edit className="w-3.5 h-3.5 text-zinc-400" />
                      <span>ویرایش</span>
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(fest.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold transition-colors cursor-pointer border border-rose-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف</span>
                    </button>
                  </div>

                  {onViewStoreFestival && (
                    <button
                      onClick={() => onViewStoreFestival(fest)}
                      className="flex items-center gap-1 text-xs text-[#62DB00] font-bold hover:underline cursor-pointer"
                    >
                      <span>مشاهده در فروشگاه</span>
                      <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 p-6 space-y-5 shadow-2xl text-zinc-900 dark:text-white">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black">حذف جشنواره</h3>
                <p className="text-xs text-zinc-400">این عملیات قابل بازگشت نیست.</p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              آیا از حذف کامل این جشنواره و کدهای تخفیف متصل به آن اطمینان دارید؟ در صورت فعال بودن، بنر آن بلافاصله از صفحه اصلی سایت برداشته خواهد شد.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
              >
                انصراف
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                بله، حذف کن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Full Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden text-zinc-900 dark:text-white">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#62DB00] text-black">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white">
                    {editingFestival ? 'ویرایش جشنواره' : 'ایجاد جشنواره و کمپین جدید'}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    تنظیمات پوسته، بنر صفحه اصلی، تاریخ شروع و پایان، محصولات تخفیف‌دار و کوپن‌ها
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 px-6 pt-3 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto shrink-0">
              {[
                { id: 'info', label: '۱. اطلاعات پایه و شعار', icon: Sliders },
                { id: 'schedule', label: '۲. زمان‌بندی و انقضا', icon: Calendar },
                { id: 'products', label: `۳. محصولات تخفیف‌دار (${selectedProducts.length})`, icon: Package },
                { id: 'coupons', label: `۴. کدهای تخفیف (${festivalCoupons.length})`, icon: Tag }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveModalTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      activeModalTab === tab.id
                        ? 'border-[#62DB00] text-zinc-900 dark:text-white'
                        : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#62DB00]" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body / Tab Contents */}
            <form onSubmit={handleSaveFestival} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              {/* TAB 1: INFO & BRANDING */}
              {activeModalTab === 'info' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-zinc-700 dark:text-zinc-300">
                        عنوان جشنواره <span className="text-[#62DB00]">*</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="مثال: جشنواره شگفت‌انگیز هوشمند لومینا ۲۰۲۶"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white outline-hidden focus:border-[#62DB00] text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-zinc-700 dark:text-zinc-300">
                        عنوان انگلیسی (اختیاری)
                      </label>
                      <input
                        type="text"
                        value={titleEn}
                        onChange={e => setTitleEn(e.target.value)}
                        placeholder="e.g. Lumina Mega Spring Festival"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white outline-hidden focus:border-[#62DB00] text-xs text-left font-mono"
                      />
                    </div>
                  </div>

                  {/* Slogan - Optional requirement */}
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <Gift className="w-4 h-4 text-[#62DB00]" />
                        <span>شعار تبلیغاتی (اختیاری)</span>
                      </label>
                      <span className="text-[10px] text-zinc-400">
                        در صورت ثبت، در بنر بالای سایت و صفحه جشنواره نمایش داده می‌شود
                      </span>
                    </div>
                    <input
                      type="text"
                      value={slogan}
                      onChange={e => setSlogan(e.target.value)}
                      placeholder="مثال: تخفیف‌های استثنایی بر روی جدیدترین پرچمداران تکنولوژی و صدای استودیویی"
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white outline-hidden focus:border-[#62DB00] text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300">
                      توضیحات جشنواره
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="توضیحات تکمیلی برای معرفی جشنواره، شرایط ارسال، گارانتی یا هدایا..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white outline-hidden focus:border-[#62DB00] text-xs resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="font-bold text-zinc-700 dark:text-zinc-300">
                        متن نشان (بج) تخفیف
                      </label>
                      <input
                        type="text"
                        value={badgeText}
                        onChange={e => setBadgeText(e.target.value)}
                        placeholder="مثال: جشنواره بهاره، تا ۵۰٪ تخفیف"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white outline-hidden focus:border-[#62DB00] text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-zinc-700 dark:text-zinc-300">
                        تم رنگی اختصاصی
                      </label>
                      <select
                        value={themeColor}
                        onChange={e => setThemeColor(e.target.value as AccentColor)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white outline-hidden focus:border-[#62DB00] text-xs"
                      >
                        <option value="emerald">سبز لومینا (Lumina Green)</option>
                        <option value="rose">رز فستیوال (Rose)</option>
                        <option value="indigo">نیلی مدرن (Indigo)</option>
                        <option value="amber">طلایی و کهربایی (Amber)</option>
                        <option value="purple">بنفش کهکشانی (Purple)</option>
                        <option value="cyan">آبی فیروزه‌ای نئون (Cyan)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-zinc-700 dark:text-zinc-300">
                        اولویت نمایش (۱ تا ۱۰۰)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={priority}
                        onChange={e => setPriority(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white outline-hidden focus:border-[#62DB00] text-xs font-mono"
                      />
                      <p className="text-[10px] text-zinc-400">عددهای بالاتر اولویت بیشتری در صفحه اصلی دارند.</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                    <div>
                      <span className="font-bold text-zinc-900 dark:text-white block">وضعیت فعال بودن جشنواره</span>
                      <span className="text-[11px] text-zinc-400">
                        در صورت فعال بودن و قرار داشتن در بازه تاریخی، در بالای صفحه اصلی نمایش داده می‌شود.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsActive(!isActive)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        isActive ? 'bg-[#62DB00]' : 'bg-zinc-300 dark:bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-black transition-transform ${
                          isActive ? 'translate-x-1' : 'translate-x-6'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: SCHEDULE */}
              {activeModalTab === 'schedule' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-900 dark:text-white">الگوهای زمان‌بندی آماده:</span>
                      <span className="text-[11px] text-zinc-400">تنظیم خودکار بازه زمانی</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => applyPreset(1)}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold border border-zinc-200 dark:border-zinc-700 hover:border-[#62DB00] cursor-pointer"
                      >
                        ⚡ ۲۴ ساعته (فلش سیل)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset(3)}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold border border-zinc-200 dark:border-zinc-700 hover:border-[#62DB00] cursor-pointer"
                      >
                        🔥 ۳ روزه (آخر هفته شگفت‌انگیز)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset(7)}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold border border-zinc-200 dark:border-zinc-700 hover:border-[#62DB00] cursor-pointer"
                      >
                        🌟 ۷ روزه (کمپین هفتگی)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset(30)}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold border border-zinc-200 dark:border-zinc-700 hover:border-[#62DB00] cursor-pointer"
                      >
                        🗓️ یک ماهه (جشنواره فصلی)
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-zinc-700 dark:text-zinc-300">
                        تاریخ شروع جشنواره
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white outline-hidden focus:border-[#62DB00] text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-zinc-700 dark:text-zinc-300">
                        تاریخ پایان جشنواره
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white outline-hidden focus:border-[#62DB00] text-xs"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
                    <h4 className="font-bold text-zinc-900 dark:text-white">قوانین سیستم زمان‌بندی:</h4>
                    <ul className="list-disc pr-5 space-y-1 text-zinc-500 dark:text-zinc-400 text-[11px]">
                      <li>شمارنده معکوس در صفحه اصلی تا ثانیه آخر تاریخ پایان فعال خواهد بود.</li>
                      <li>به محض رسیدن به زمان پایان، جشنواره به طور خودکار از بالای سایت خارج می‌شود.</li>
                      <li>تخفیف‌های جشنواره فقط در همین بازه برای خریداران اعمال خواهند شد.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 3: PRODUCTS SELECTION */}
              {activeModalTab === 'products' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={e => setProductSearch(e.target.value)}
                        placeholder="جستجوی کالا برای افزودن به جشنواره..."
                        className="w-full pr-9 pl-3 py-2 text-xs rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white outline-hidden focus:border-[#62DB00]"
                      />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={e => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white outline-hidden focus:border-[#62DB00]"
                    >
                      <option value="all">همه دسته‌بندی‌ها</option>
                      <option value="audio">صدا و هدفون</option>
                      <option value="wearables">گجت‌های پوشیدنی</option>
                      <option value="lighting">روشنایی هوشمند</option>
                      <option value="accessories">لوازم جانبی</option>
                    </select>
                  </div>

                  {/* Selected Products Editable Table */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-zinc-900 dark:text-white flex items-center justify-between">
                      <span>محصولات منتخب جشنواره ({selectedProducts.length})</span>
                      <span className="text-[10px] text-zinc-400">تخفیف و موجودی جشنواره را ویرایش کنید</span>
                    </h4>

                    {selectedProducts.length === 0 ? (
                      <div className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-dashed border-zinc-300 dark:border-zinc-700 text-center text-zinc-400">
                        هنوز محصولی به جشنواره اضافه نشده است. از لیست زیر انتخاب کنید.
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                        {selectedProducts.map(p => (
                          <div
                            key={p.productId}
                            className="p-3 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={p.image || 'https://via.placeholder.com/48'}
                                alt={p.nameFa || p.name}
                                className="w-10 h-10 rounded-xl object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <span className="font-bold text-zinc-900 dark:text-white block line-clamp-1 max-w-[200px]">
                                  {p.nameFa || p.name}
                                </span>
                                <span className="text-[11px] text-zinc-400 font-mono">
                                  قیمت پایه: {formatToman(p.originalPrice)}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                              {/* Discount % Input */}
                              <div className="flex items-center gap-1">
                                <label className="text-[10px] text-zinc-400">درصد تخفیف:</label>
                                <div className="relative w-16">
                                  <input
                                    type="number"
                                    min="1"
                                    max="90"
                                    value={p.discountPercent}
                                    onChange={e => handleUpdateProductDiscount(p.productId, Number(e.target.value))}
                                    className="w-full px-2 py-1 text-center font-mono font-bold text-[#62DB00] rounded-lg bg-[#62DB00]/10 border border-[#62DB00]/30 text-xs"
                                  />
                                </div>
                                <span className="text-[#62DB00] font-bold">٪</span>
                              </div>

                              {/* Discounted Price */}
                              <div className="flex items-center gap-1">
                                <label className="text-[10px] text-zinc-400">قیمت جشنواره:</label>
                                <input
                                  type="number"
                                  step="10000"
                                  value={p.discountedPrice}
                                  onChange={e => handleUpdateProductPrice(p.productId, Number(e.target.value))}
                                  className="w-28 px-2 py-1 text-left font-mono font-bold rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white"
                                />
                              </div>

                              {/* Festival Stock */}
                              <div className="flex items-center gap-1">
                                <label className="text-[10px] text-zinc-400">موجودی کمپین:</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={p.festivalStock}
                                  onChange={e => handleUpdateProductStock(p.productId, Number(e.target.value))}
                                  className="w-14 px-2 py-1 text-center font-mono font-bold rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => handleToggleProduct({ id: p.productId } as any)}
                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                                title="حذف از جشنواره"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Available Products to Add */}
                  <div className="space-y-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                    <h4 className="font-bold text-zinc-900 dark:text-white">افزودن محصولات فروشگاه به این جشنواره:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                      {allProducts
                        .filter(prod => {
                          const matchesSearch =
                            prod.nameFa.toLowerCase().includes(productSearch.toLowerCase()) ||
                            prod.name.toLowerCase().includes(productSearch.toLowerCase());
                          const matchesCat = selectedCategory === 'all' || prod.category === selectedCategory;
                          return matchesSearch && matchesCat;
                        })
                        .map(prod => {
                          const isSelected = selectedProducts.some(p => p.productId === prod.id);
                          return (
                            <button
                              key={prod.id}
                              type="button"
                              onClick={() => handleToggleProduct(prod)}
                              className={`p-2.5 rounded-xl border flex items-center justify-between text-right transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#62DB00]/10 border-[#62DB00]/40 text-zinc-900 dark:text-white'
                                  : 'bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white hover:border-zinc-400'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <img
                                  src={prod.images[0]}
                                  alt={prod.nameFa}
                                  className="w-8 h-8 rounded-lg object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <span className="font-bold block line-clamp-1 text-[11px]">{prod.nameFa}</span>
                                  <span className="text-[10px] text-zinc-400 font-mono">{formatToman(prod.price)}</span>
                                </div>
                              </div>
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                  isSelected ? 'bg-[#62DB00] text-black' : 'border border-zinc-400 dark:border-zinc-600'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: FESTIVAL COUPONS */}
              {activeModalTab === 'coupons' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
                    <h4 className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-[#62DB00]" />
                      <span>افزودن کد تخفیف جدید برای این جشنواره</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] text-zinc-600 dark:text-zinc-400 font-bold">کد کوپن</label>
                        <input
                          type="text"
                          value={newCouponCode}
                          onChange={e => setNewCouponCode(e.target.value)}
                          placeholder="مثال: FESTIVAL2026"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white uppercase font-mono text-xs focus:border-[#62DB00] outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-zinc-600 dark:text-zinc-400 font-bold">نوع تخفیف</label>
                        <select
                          value={newCouponType}
                          onChange={e => setNewCouponType(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs focus:border-[#62DB00] outline-hidden"
                        >
                          <option value="percent">درصدی (٪)</option>
                          <option value="fixed">مبلغ ثابت (تومان)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-zinc-600 dark:text-zinc-400 font-bold">
                          {newCouponType === 'percent' ? 'درصد تخفیف' : 'مبلغ تخفیف (تومان)'}
                        </label>
                        <input
                          type="number"
                          value={newCouponAmount}
                          onChange={e => setNewCouponAmount(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs focus:border-[#62DB00] outline-hidden font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[11px] text-zinc-600 dark:text-zinc-400 font-bold">حداقل خرید (تومان)</label>
                        <input
                          type="number"
                          value={newCouponMinPurchase}
                          onChange={e => setNewCouponMinPurchase(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs focus:border-[#62DB00] outline-hidden font-mono"
                        />
                      </div>

                      {newCouponType === 'percent' && (
                        <div className="space-y-1">
                          <label className="text-[11px] text-zinc-600 dark:text-zinc-400 font-bold">سقف تخفیف (تومان)</label>
                          <input
                            type="number"
                            value={newCouponMaxDiscount}
                            onChange={e => setNewCouponMaxDiscount(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs focus:border-[#62DB00] outline-hidden font-mono"
                          />
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-[11px] text-zinc-600 dark:text-zinc-400 font-bold">تعداد مجاز استفاده</label>
                        <input
                          type="number"
                          value={newCouponMaxUsage}
                          onChange={e => setNewCouponMaxUsage(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs focus:border-[#62DB00] outline-hidden font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddCoupon}
                      className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 font-bold text-xs shadow-xs cursor-pointer"
                    >
                      افزودن این کد به جشنواره
                    </button>
                  </div>

                  {/* Existing Coupons List */}
                  <div className="space-y-2.5">
                    <h4 className="font-bold text-zinc-900 dark:text-white">کدهای تخفیف متصل به این جشنواره:</h4>
                    {festivalCoupons.length === 0 ? (
                      <div className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-dashed border-zinc-300 dark:border-zinc-700 text-center text-zinc-400">
                        کد تخفیفی تعریف نشده است. می‌توانید با فرم بالا کد جدید اضافه کنید.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {festivalCoupons.map(c => (
                          <div
                            key={c.id}
                            className="p-3 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <span className="px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 font-mono font-bold text-xs">
                                {c.code}
                              </span>
                              <div className="space-y-0.5">
                                <span className="font-bold text-zinc-900 dark:text-white block">
                                  {c.type === 'percent' ? `${c.amount}٪ تخفیف` : `${formatToman(c.amount)} تخفیف ثابت`}
                                </span>
                                <span className="text-[11px] text-zinc-400 font-mono">
                                  حداقل خرید: {formatToman(c.minPurchase)}
                                  {c.maxDiscount ? ` | سقف: ${formatToman(c.maxDiscount)}` : ''}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleCoupon(c.id)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                                  c.isActive
                                    ? 'bg-[#62DB00]/15 text-[#62DB00]'
                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                                }`}
                              >
                                {c.isActive ? 'فعال' : 'غیرفعال'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveCoupon(c.id)}
                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Modal Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
                >
                  انصراف
                </button>

                <div className="flex items-center gap-2.5">
                  {activeModalTab !== 'coupons' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeModalTab === 'info') setActiveModalTab('schedule');
                        else if (activeModalTab === 'schedule') setActiveModalTab('products');
                        else if (activeModalTab === 'products') setActiveModalTab('coupons');
                      }}
                      className="px-4 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-white font-bold cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700"
                    >
                      مرحله بعد
                    </button>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#62DB00] hover:bg-[#52B800] text-black font-black shadow-xs cursor-pointer"
                  >
                    {editingFestival ? 'ذخیره تغییرات جشنواره' : 'انتشار و فعال‌سازی جشنواره'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
