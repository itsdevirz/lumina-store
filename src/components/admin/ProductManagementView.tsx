import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Upload,
  Image as ImageIcon,
  Tag,
  Layers,
  Sparkles,
  X,
  Palette,
  BarChart2
} from 'lucide-react';
import { Product, ProductColor, ProductAttribute, ProductVariant, VariantType, Category } from '../../types';
import { CATEGORIES, PRODUCTS } from '../../data/products';
import { ProductVariantManager } from './ProductVariantManager';
import { ProductImageUploadBox } from './ProductImageUploadBox';
import { ProductAnalyticsModal } from './ProductAnalyticsModal';

interface ProductManagementViewProps {
  onProductChanged?: () => void;
  initialCategoryFilter?: string;
}

export const ProductManagementView: React.FC<ProductManagementViewProps> = ({
  onProductChanged,
  initialCategoryFilter
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryFilter || 'all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedStock, setSelectedStock] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [analyticsProductId, setAnalyticsProductId] = useState<string | null>(null);

  // Form State
  const [formState, setFormState] = useState({
    name: '',
    nameFa: '',
    sku: '',
    brand: 'Lumina Collection',
    category: 'audio',
    price: '',
    originalPrice: '',
    discountPercent: '',
    stock: '15',
    isFlashSale: false,
    isActive: true,
    description: '',
    descriptionFa: '',
    images: [] as string[],
    primaryImage: '',
    featuresText: '',
    featuresFaText: '',
    tagsText: '',
    seoTitle: '',
    seoMeta: ''
  });

  // Variant Management State
  const [variantType, setVariantType] = useState<VariantType>('color_size');
  const [colors, setColors] = useState<ProductColor[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [customAttributes, setCustomAttributes] = useState<ProductAttribute[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Delete Confirm Modal
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Helper to retrieve fallback / locally saved products if backend is not reachable or on static hosting
  const getInitialLocalProducts = (): any[] => {
    try {
      const saved = localStorage.getItem('lumina_products_cache');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read cached products:', e);
    }
    return PRODUCTS.map((p, idx) => ({
      ...p,
      isActive: true,
      sku: `LUM-${(p.category || 'GEN').toUpperCase().slice(0, 3)}-00${idx + 1}`,
      views: 320 + idx * 45,
      cartAdds: 42 + idx * 7,
      primaryImage: p.images?.[0] || '',
      createdAt: new Date(Date.now() - idx * 86400000).toISOString()
    }));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory, selectedStatus, selectedStock, sortBy]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const text = await res.text();
        if (text && !text.trim().startsWith('<')) {
          const data = JSON.parse(text);
          if (Array.isArray(data) && data.length > 0) {
            setAvailableCategories(data);
            return;
          }
        }
      }
    } catch (err) {
      console.warn('Error loading categories from API, falling back to static categories:', err);
    }
    setAvailableCategories(CATEGORIES as any);
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      if (selectedStock !== 'all') params.append('stock', selectedStock);
      if (sortBy) params.append('sortBy', sortBy);

      let fetchedFromApi = false;
      try {
        const res = await fetch(`/api/products?${params.toString()}`);
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const text = await res.text();
          if (text && !text.trim().startsWith('<')) {
            const data = JSON.parse(text);
            if (Array.isArray(data)) {
              setProducts(data);
              try {
                localStorage.setItem('lumina_products_cache', JSON.stringify(data));
              } catch (_) {}
              fetchedFromApi = true;
            }
          }
        }
      } catch (apiErr) {
        console.warn('Backend API unavailable, using local products cache:', apiErr);
      }

      if (!fetchedFromApi) {
        // Fallback to local products dataset
        let list = getInitialLocalProducts();
        if (search.trim()) {
          const q = search.toLowerCase().trim();
          list = list.filter((p: any) =>
            p.name?.toLowerCase().includes(q) ||
            p.nameFa?.toLowerCase().includes(q) ||
            p.sku?.toLowerCase().includes(q)
          );
        }
        if (selectedCategory !== 'all') {
          list = list.filter((p: any) => p.category === selectedCategory);
        }
        if (selectedStatus !== 'all') {
          list = list.filter((p: any) => selectedStatus === 'active' ? p.isActive !== false : p.isActive === false);
        }
        if (selectedStock !== 'all') {
          list = list.filter((p: any) => {
            const st = p.stock ?? 10;
            if (selectedStock === 'in_stock') return st > 5;
            if (selectedStock === 'low_stock') return st > 0 && st <= 5;
            if (selectedStock === 'out_of_stock') return st === 0;
            return true;
          });
        }
        if (sortBy === 'price_asc') list.sort((a: any, b: any) => (a.price || 0) - (b.price || 0));
        if (sortBy === 'price_desc') list.sort((a: any, b: any) => (b.price || 0) - (a.price || 0));
        if (sortBy === 'sold') list.sort((a: any, b: any) => (b.soldCount || 0) - (a.soldCount || 0));
        if (sortBy === 'views') list.sort((a: any, b: any) => (b.views || 0) - (a.views || 0));

        setProducts(list);
      }
      setCurrentPage(1);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (product: any) => {
    // 1. Optimistic update
    setProducts(prev => {
      const next = prev.map(p => (p.id === product.id ? { ...p, isActive: !p.isActive } : p));
      try {
        localStorage.setItem('lumina_products_cache', JSON.stringify(next));
      } catch (_) {}
      return next;
    });

    try {
      await fetch(`/api/products/${product.id}/status`, {
        method: 'PATCH'
      });
    } catch (err) {
      console.warn('API status patch failed, updated locally:', err);
    }
    if (onProductChanged) onProductChanged();
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    const targetId = deleteConfirmId;
    setProducts(prev => {
      const next = prev.filter(p => p.id !== targetId);
      try {
        localStorage.setItem('lumina_products_cache', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
    setDeleteConfirmId(null);

    try {
      await fetch(`/api/products/${targetId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('API delete failed, removed locally:', err);
    }
    if (onProductChanged) onProductChanged();
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setFormState({
      name: '',
      nameFa: '',
      sku: `LUM-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      brand: 'Lumina Collection',
      category: availableCategories[0]?.slug || availableCategories[0]?.id || 'audio',
      price: '',
      originalPrice: '',
      discountPercent: '',
      stock: '20',
      isFlashSale: false,
      isActive: true,
      description: '',
      descriptionFa: '',
      images: [],
      primaryImage: '',
      featuresText: 'High Fidelity Sound\nNoise Cancelling\nFast Charging',
      featuresFaText: 'صدای شفاف و با تفکیک بالا\nقابلیت نویزکنسلینگ هوشمند\nشارژ فوق سریع با پورت تایپ سی',
      tagsText: 'هدفون, پرمیوم, لومینا, صوت',
      seoTitle: '',
      seoMeta: ''
    });

    setVariantType('color_size');
    setColors([
      { id: 'c1', name: 'مشکی', hex: '#000000', stock: 10, active: true },
      { id: 'c2', name: 'سفید', hex: '#FFFFFF', stock: 10, active: true }
    ]);
    setSizes(['S', 'M', 'L', 'XL']);
    setCustomAttributes([]);
    setVariants([]);

    setIsModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setModalMode('edit');
    setEditingId(p.id);
    const existingImages =
      Array.isArray(p.images) && p.images.length > 0
        ? p.images
        : p.primaryImage
        ? [p.primaryImage]
        : [];
    const existingPrimary = p.primaryImage || existingImages[0] || '';

    setFormState({
      name: p.name || '',
      nameFa: p.nameFa || '',
      sku: p.sku || '',
      brand: p.brand || 'Lumina Collection',
      category: p.category || 'audio',
      price: p.price ? String(p.price) : '',
      originalPrice: p.originalPrice ? String(p.originalPrice) : '',
      discountPercent: p.discountPercent ? String(p.discountPercent) : '',
      stock: String(p.stock ?? 10),
      isFlashSale: !!p.isFlashSale,
      isActive: p.isActive !== false,
      description: p.description || '',
      descriptionFa: p.descriptionFa || '',
      images: existingImages,
      primaryImage: existingPrimary,
      featuresText: (p.features || []).join('\n'),
      featuresFaText: (p.featuresFa || []).join('\n'),
      tagsText: (p.tags || []).join(', '),
      seoTitle: p.seoTitle || p.nameFa || '',
      seoMeta: p.seoMeta || p.descriptionFa?.slice(0, 150) || ''
    });

    setVariantType(
      p.variantType ||
        (p.colors?.length && p.sizes?.length
          ? 'color_size'
          : p.colors?.length
          ? 'color'
          : p.sizes?.length
          ? 'size'
          : 'none')
    );
    setColors(p.colors || []);
    setSizes(p.sizes || []);
    setCustomAttributes(p.customAttributes || []);
    setVariants(p.variants || []);

    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const features = formState.featuresText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const featuresFa = formState.featuresFaText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const tags = formState.tagsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const basePrice = Number(formState.price) || 0;
    const totalVariantStock =
      variants.length > 0
        ? variants.reduce((sum, v) => sum + (v.stock || 0), 0)
        : Number(formState.stock) || 0;

    const finalImages =
      formState.images.length > 0
        ? formState.images
        : ['/images/products/photo-1526170375885-4d8ecf77b99f.jpg'];
    const finalPrimaryImage = formState.primaryImage || finalImages[0];

    const payload = {
      name: formState.name || formState.nameFa,
      nameFa: formState.nameFa,
      brand: formState.brand,
      category: formState.category,
      sku: formState.sku,
      price: basePrice,
      originalPrice: formState.originalPrice ? Number(formState.originalPrice) : undefined,
      discountPercent: formState.discountPercent ? Number(formState.discountPercent) : 0,
      stock: totalVariantStock,
      isFlashSale: formState.isFlashSale,
      isActive: formState.isActive,
      description: formState.description,
      descriptionFa: formState.descriptionFa,
      images: finalImages,
      primaryImage: finalPrimaryImage,
      features,
      featuresFa,
      tags,
      variantType,
      colors,
      sizes,
      customAttributes,
      variants
    };

    try {
      let savedProduct: any = null;

      try {
        if (modalMode === 'create') {
          const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const contentType = res.headers.get('content-type') || '';
          if (res.ok && contentType.includes('application/json')) {
            const text = await res.text();
            if (text && !text.trim().startsWith('<')) {
              savedProduct = JSON.parse(text);
            }
          }
        } else if (editingId) {
          const res = await fetch(`/api/products/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const contentType = res.headers.get('content-type') || '';
          if (res.ok && contentType.includes('application/json')) {
            const text = await res.text();
            if (text && !text.trim().startsWith('<')) {
              savedProduct = JSON.parse(text);
            }
          }
        }
      } catch (apiErr) {
        console.warn('API save failed, persisting locally:', apiErr);
      }

      if (modalMode === 'create') {
        const createdItem = savedProduct || {
          ...payload,
          id: `prod-${Date.now()}`,
          rating: 5,
          reviewsCount: 0,
          soldCount: 0,
          views: 1,
          createdAt: new Date().toISOString()
        };
        setProducts(prev => {
          const next = [createdItem, ...prev];
          try {
            localStorage.setItem('lumina_products_cache', JSON.stringify(next));
          } catch (_) {}
          return next;
        });
      } else if (editingId) {
        setProducts(prev => {
          const next = prev.map(p => (p.id === editingId ? (savedProduct || { ...p, ...payload }) : p));
          try {
            localStorage.setItem('lumina_products_cache', JSON.stringify(next));
          } catch (_) {}
          return next;
        });
      }

      setIsModalOpen(false);
      if (onProductChanged) onProductChanged();
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  // Pagination calculation
  const totalPages = Math.ceil(products.length / pageSize) || 1;
  const paginatedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
              مدیریت محصولات فروشگاه
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#62DB00]/15 text-[#62DB00] border border-[#62DB00]/30">
              INVENTORY
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            ایجاد، ویرایش، کنترل موجودی انبار، قیمت‌گذاری و وضعیت عرضه کالاها در دیتابیس
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#62DB00] hover:bg-[#52B800] text-black text-xs font-black shadow-lg shadow-[#62DB00]/15 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن محصول جدید</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {/* Search Query */}
          <div className="relative lg:col-span-2">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="جستجو با نام، برند یا کد SKU..."
              className="w-full pr-9 pl-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:border-[#62DB00] transition-all"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute right-3 top-2.5" />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 focus:outline-hidden focus:border-[#62DB00] cursor-pointer"
            >
              <option value="all">همه دسته‌بندی‌ها</option>
              {(availableCategories.length > 0 ? availableCategories : CATEGORIES).map(c => (
                <option key={c.id} value={c.slug || c.id}>
                  {c.parentId ? `  └── ${c.nameFa}` : `● ${c.nameFa}`}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 focus:outline-hidden focus:border-[#62DB00] cursor-pointer"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="active">فقط فعال</option>
              <option value="inactive">غیرفعال (مخفی)</option>
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <select
              value={selectedStock}
              onChange={e => setSelectedStock(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 focus:outline-hidden focus:border-[#62DB00] cursor-pointer"
            >
              <option value="all">همه موجودی‌ها</option>
              <option value="in_stock">موجود در انبار</option>
              <option value="low_stock">رو به اتمام (&le; ۵)</option>
              <option value="out_of_stock">ناموجود</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200 dark:border-zinc-800/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold">
                <th className="py-4 pr-6">کالا</th>
                <th className="py-4 px-3 font-mono">کد SKU</th>
                <th className="py-4 px-3">دسته‌بندی</th>
                <th className="py-4 px-3">قیمت واحد</th>
                <th className="py-4 px-3">موجودی</th>
                <th className="py-4 px-3">وضعیت نمایش</th>
                <th className="py-4 pl-6 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    در حال دریافت محصولات از دیتابیس...
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    محصولی با این مشخصات یافت نشد.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map(p => (
                  <tr key={p.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="py-4 pr-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || '/images/products/photo-1526170375885-4d8ecf77b99f.jpg'}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-zinc-200 dark:ring-zinc-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-zinc-900 dark:text-white truncate max-w-xs">
                            {p.nameFa}
                          </p>
                          <p className="text-[11px] text-zinc-400 truncate">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 font-mono text-zinc-600 dark:text-zinc-300 font-bold">
                      {p.sku || '-'}
                    </td>
                    <td className="py-4 px-3 text-zinc-600 dark:text-zinc-400">
                      {p.categoryFa || p.category}
                    </td>
                    <td className="py-4 px-3">
                      <div>
                        <span className="font-bold text-zinc-900 dark:text-white font-mono">
                          {formatTomans(p.price)}
                        </span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="block text-[10px] text-zinc-400 line-through font-mono">
                            {formatTomans(p.originalPrice)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      {p.stock === 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          ناموجود
                        </span>
                      ) : p.stock <= 5 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          {formatNumber(p.stock)} عدد (رو به اتمام)
                        </span>
                      ) : (
                        <span className="font-bold text-zinc-700 dark:text-zinc-300 font-mono">
                          {formatNumber(p.stock)} عدد
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-3">
                      <button
                        onClick={() => handleToggleStatus(p)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          p.isActive
                            ? 'bg-[#62DB00]/15 text-[#62DB00] border border-[#62DB00]/30 hover:bg-[#62DB00]/25'
                            : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200'
                        }`}
                      >
                        {p.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>فعال در فروشگاه</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>غیرفعال</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 pl-6 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setAnalyticsProductId(p.id)}
                          title="آمار و عملکرد تحلیلی محصول"
                          className="p-1.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 transition-colors cursor-pointer"
                        >
                          <BarChart2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(p)}
                          title="ویرایش کالا"
                          className="p-1.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          title="حذف کالا"
                          className="p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            نمایش {formatNumber(products.length > 0 ? (currentPage - 1) * pageSize + 1 : 0)} تا{' '}
            {formatNumber(Math.min(currentPage * pageSize, products.length))} از مجموع{' '}
            {formatNumber(products.length)} محصول
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="px-2 font-bold text-slate-900 dark:text-white">
              صفحه {formatNumber(currentPage)} از {formatNumber(totalPages)}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">
                    {modalMode === 'create' ? 'ثبت محصول جدید در فروشگاه' : 'ویرایش اطلاعات کالا'}
                  </h3>
                  {modalMode === 'edit' && editingId && (
                    <p className="text-[11px] text-slate-400">شناسه سیستم: {editingId}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {modalMode === 'edit' && editingId && (
                  <button
                    type="button"
                    onClick={() => setAnalyticsProductId(editingId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800 transition-colors cursor-pointer"
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                    <span>آمار و عملکرد این محصول</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نام محصول (فارسی) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.nameFa}
                    onChange={e => setFormState({ ...formState, nameFa: e.target.value })}
                    placeholder="مثال: هدفون نویزکنسلینگ لومینا پرو"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نام لاتین کالا (English)
                  </label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={e => setFormState({ ...formState, name: e.target.value })}
                    placeholder="Lumina Horizon ANC Pro"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    کد انبار (SKU)
                  </label>
                  <input
                    type="text"
                    value={formState.sku}
                    onChange={e => setFormState({ ...formState, sku: e.target.value })}
                    placeholder="LUM-AUD-001"
                    className="w-full px-3 py-2 rounded-xl font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    برند محصول
                  </label>
                  <input
                    type="text"
                    value={formState.brand}
                    onChange={e => setFormState({ ...formState, brand: e.target.value })}
                    placeholder="Lumina Collection"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    دسته‌بندی کالا
                  </label>
                  <select
                    value={formState.category}
                    onChange={e => setFormState({ ...formState, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 outline-hidden"
                  >
                    {(availableCategories.length > 0 ? availableCategories : CATEGORIES).map(c => (
                      <option key={c.id} value={c.slug || c.id}>
                        {c.parentId ? `  └── ${c.nameFa}` : `● ${c.nameFa}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    قیمت فروش (تومان) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formState.price}
                    onChange={e => setFormState({ ...formState, price: e.target.value })}
                    placeholder="8900000"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    قیمت خط‌خورده (اصلی)
                  </label>
                  <input
                    type="number"
                    value={formState.originalPrice}
                    onChange={e => setFormState({ ...formState, originalPrice: e.target.value })}
                    placeholder="9900000"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    درصد تخفیف
                  </label>
                  <input
                    type="number"
                    value={formState.discountPercent}
                    onChange={e => setFormState({ ...formState, discountPercent: e.target.value })}
                    placeholder="10"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    موجودی در انبار *
                  </label>
                  <input
                    type="number"
                    required
                    value={formState.stock}
                    onChange={e => setFormState({ ...formState, stock: e.target.value })}
                    placeholder="25"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Product Images: Modern Real File Upload Box */}
              <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                <ProductImageUploadBox
                  images={formState.images}
                  primaryImage={formState.primaryImage}
                  onChange={(newImages, newPrimary) =>
                    setFormState(prev => ({
                      ...prev,
                      images: newImages,
                      primaryImage: newPrimary
                    }))
                  }
                  productId={editingId || undefined}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  توضیحات معرفی محصول (فارسی)
                </label>
                <textarea
                  rows={3}
                  value={formState.descriptionFa}
                  onChange={e => setFormState({ ...formState, descriptionFa: e.target.value })}
                  placeholder="توضیحات و ویژگی‌های بارز برای نمایش در صفحه محصول..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-hidden"
                />
              </div>

              {/* Key Features & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ویژگی‌های کلیدی (هر مورد در یک خط)
                  </label>
                  <textarea
                    rows={3}
                    value={formState.featuresFaText}
                    onChange={e => setFormState({ ...formState, featuresFaText: e.target.value })}
                    placeholder="قابلیت نویزکنسلینگ فعال&#10;باتری با دوام ۴۰ ساعت&#10;بدنه آلومینیومی سبک"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    برچسب‌ها و تگ‌های سئو (با ویرگول جدا کنید)
                  </label>
                  <textarea
                    rows={3}
                    value={formState.tagsText}
                    onChange={e => setFormState({ ...formState, tagsText: e.target.value })}
                    placeholder="هدفون, بی‌سیم, نویزکنسلینگ, لومینا"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-hidden"
                  />
                </div>
              </div>

              {/* Product Variants (Color, Size, Custom Specs & Inventory) */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    مدیریت رنگ، سایز و تنوع محصول (Variants)
                  </h4>
                </div>
                <ProductVariantManager
                  variantType={variantType}
                  colors={colors}
                  sizes={sizes}
                  customAttributes={customAttributes}
                  variants={variants}
                  basePrice={Number(formState.price) || 0}
                  baseSku={formState.sku}
                  onChangeVariantType={setVariantType}
                  onChangeColors={setColors}
                  onChangeSizes={setSizes}
                  onChangeCustomAttributes={setCustomAttributes}
                  onChangeVariants={setVariants}
                />
              </div>

              {/* Status Toggles */}
              <div className="flex flex-wrap gap-6 pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.isActive}
                    onChange={e => setFormState({ ...formState, isActive: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    وضعیت فعال (قابل رویت و خرید در فروشگاه)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.isFlashSale}
                    onChange={e => setFormState({ ...formState, isFlashSale: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    نمایش در بخش فروش ویژه (Flash Sale)
                  </span>
                </label>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30"
                >
                  {modalMode === 'create' ? 'افزودن و انتشار کالا' : 'ذخیره تغییرات محصول'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-sm w-full space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900 dark:text-white">
                آیا از حذف این محصول اطمینان دارید؟
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                این کالا به طور کامل از انبار و ویترین فروشگاه حذف خواهد شد.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold"
              >
                انصراف
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30"
              >
                بله، حذف کن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Product Analytics & Performance Modal */}
      {analyticsProductId && (
        <ProductAnalyticsModal
          productId={analyticsProductId}
          isOpen={!!analyticsProductId}
          onClose={() => setAnalyticsProductId(null)}
          lang="fa"
        />
      )}
    </div>
  );
};
