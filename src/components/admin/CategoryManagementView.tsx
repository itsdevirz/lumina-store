import React, { useState, useEffect, useMemo } from 'react';
import {
  FolderTree,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  Layers,
  Sparkles,
  X,
  ExternalLink,
  Package,
  ArrowUpDown,
  MoveDown,
  MoveUp,
  HelpCircle,
  Eye,
  Check,
  RefreshCw,
  Loader2,
  Headphones,
  Shirt,
  Laptop,
  Watch,
  ShoppingBag,
  Tag,
  Box,
  Camera,
  Smartphone,
  Home,
  Coffee,
  Flame,
  Briefcase
} from 'lucide-react';
import { Category } from '../../types';

interface CategoryManagementViewProps {
  onNavigateToProducts?: (categoryId: string) => void;
  onCategoryChanged?: () => void;
}

// Available icons dictionary for category selection
const AVAILABLE_ICONS: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Folder: Folder,
  Headphones: Headphones,
  Shirt: Shirt,
  Laptop: Laptop,
  Watch: Watch,
  ShoppingBag: ShoppingBag,
  Tag: Tag,
  Box: Box,
  Camera: Camera,
  Smartphone: Smartphone,
  Home: Home,
  Coffee: Coffee,
  Flame: Flame,
  Briefcase: Briefcase,
  Layers: Layers,
  Sparkles: Sparkles
};

export const CategoryManagementView: React.FC<CategoryManagementViewProps> = ({
  onNavigateToProducts,
  onCategoryChanged
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParentFilter, setSelectedParentFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'order' | 'products' | 'name'>('order');
  const [viewMode, setViewMode] = useState<'tree' | 'table'>('tree');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [formState, setFormState] = useState({
    nameFa: '',
    name: '',
    slug: '',
    parentId: '' as string | null,
    description: '',
    image: '',
    icon: 'Folder',
    sortOrder: 1,
    isActive: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Image upload in form
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  // Delete & Alert dialog states
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<Category | null>(null);
  const [deleteBlockedReason, setDeleteBlockedReason] = useState<{
    title: string;
    message: string;
    productCount?: number;
    childCount?: number;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast / Feedback message
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('خطا در دریافت لیست دسته‌بندی‌ها');
      const data: Category[] = await res.json();
      setCategories(data);

      // Auto expand root categories that have children
      const parentIdsWithChildren = new Set(data.filter(c => c.parentId).map(c => c.parentId!));
      setExpandedIds(parentIdsWithChildren);
    } catch (err: any) {
      console.error('Fetch categories error:', err);
      showToast(err.message || 'خطا در بارگذاری دسته‌بندی‌ها', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num?: number) => {
    return (num ?? 0).toLocaleString('fa-IR');
  };

  // Build Hierarchical Tree Structure
  const rootCategories = useMemo(() => {
    return categories.filter(c => !c.parentId);
  }, [categories]);

  const getChildrenOf = (parentId: string) => {
    return categories
      .filter(c => c.parentId === parentId)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Filtered categories for Table View or Search
  const filteredCategories = useMemo(() => {
    let list = [...categories];

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        c =>
          c.nameFa.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q)
      );
    }

    if (selectedParentFilter !== 'all') {
      if (selectedParentFilter === 'root_only') {
        list = list.filter(c => !c.parentId);
      } else {
        list = list.filter(c => c.parentId === selectedParentFilter);
      }
    }

    if (selectedStatusFilter !== 'all') {
      list = list.filter(c => (selectedStatusFilter === 'active' ? c.isActive : !c.isActive));
    }

    if (sortBy === 'order') {
      list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    } else if (sortBy === 'products') {
      list.sort((a, b) => (b.itemCount || 0) - (a.itemCount || 0));
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.nameFa.localeCompare(b.nameFa, 'fa'));
    }

    return list;
  }, [categories, searchQuery, selectedParentFilter, selectedStatusFilter, sortBy]);

  // Overall Statistics
  const stats = useMemo(() => {
    const total = categories.length;
    const activeCount = categories.filter(c => c.isActive).length;
    const subCategoriesCount = categories.filter(c => !!c.parentId).length;
    const totalAssignedProducts = categories.reduce((sum, c) => sum + (c.itemCount || 0), 0);
    return { total, activeCount, subCategoriesCount, totalAssignedProducts };
  }, [categories]);

  // Open Create Modal
  const handleOpenCreate = (defaultParentId?: string) => {
    setModalMode('create');
    setEditingCategory(null);
    setFormError(null);
    setImageUploadError(null);
    setFormState({
      nameFa: '',
      name: '',
      slug: '',
      parentId: defaultParentId || null,
      description: '',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80&auto=format&fit=crop',
      icon: 'Folder',
      sortOrder: categories.length + 1,
      isActive: true
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (category: Category) => {
    setModalMode('edit');
    setEditingCategory(category);
    setFormError(null);
    setImageUploadError(null);
    setFormState({
      nameFa: category.nameFa,
      name: category.name || '',
      slug: category.slug,
      parentId: category.parentId || null,
      description: category.description || '',
      image: category.image || '',
      icon: category.icon || 'Folder',
      sortOrder: category.sortOrder || 1,
      isActive: category.isActive !== false
    });
    setIsModalOpen(true);
  };

  // Auto-generate slug when name changes (in create mode)
  const handleNameFaChange = (val: string) => {
    if (modalMode === 'create' && !formState.slug) {
      // Create a friendly Latin slug or use a fallback
      const latinized = val
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\u0600-\u06FF\s-]/g, '')
        .replace(/\s+/g, '-');
      setFormState(prev => ({ ...prev, nameFa: val, slug: latinized || prev.slug }));
    } else {
      setFormState(prev => ({ ...prev, nameFa: val }));
    }
  };

  // Handle single category image upload
  const handleImageUpload = async (file: File) => {
    setImageUploadError(null);

    // Validate
    if (file.size > 10 * 1024 * 1024) {
      setImageUploadError('حجم تصویر نباید بیشتر از ۱۰ مگابایت باشد.');
      return;
    }
    if (file.type === 'image/svg+xml') {
      setImageUploadError('فرمت SVG مجاز نیست. لطفاً JPG، PNG یا WEBP انتخاب کنید.');
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('files', file);
      formData.append('folder', 'categories');

      const res = await fetch('/api/upload?folder=categories', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'خطا در آپلود تصویر دسته‌بندی.');
      }

      const uploadedUrl = data.url || (data.files && data.files[0]?.url);
      if (uploadedUrl) {
        setFormState(prev => ({ ...prev, image: uploadedUrl }));
        showToast('تصویر دسته‌بندی با موفقیت آپلود شد.');
      }
    } catch (err: any) {
      setImageUploadError(err.message || 'خطا در آپلود تصویر.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle Form Submit (Create or Update)
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.nameFa.trim()) {
      setFormError('نام فارسی دسته‌بندی الزامی است.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        nameFa: formState.nameFa.trim(),
        name: formState.name.trim() || formState.nameFa.trim(),
        slug:
          formState.slug.trim().toLowerCase() ||
          formState.nameFa
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-'),
        parentId: formState.parentId || null,
        description: formState.description.trim(),
        image: formState.image.trim(),
        icon: formState.icon,
        sortOrder: Number(formState.sortOrder) || 1,
        isActive: formState.isActive
      };

      let response: Response;

      if (modalMode === 'create') {
        response = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(`/api/categories/${editingCategory?.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'خطا در ذخیره‌سازی دسته‌بندی.');
      }

      showToast(
        modalMode === 'create'
          ? `دسته‌بندی «${payload.nameFa}» با موفقیت ایجاد شد.`
          : `دسته‌بندی «${payload.nameFa}» با موفقیت ویرایش گردید.`
      );

      setIsModalOpen(false);
      await fetchCategories();
      onCategoryChanged?.();
    } catch (err: any) {
      setFormError(err.message || 'خطای غیرمنتظره در سرور.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle category active status
  const handleToggleStatus = async (cat: Category) => {
    try {
      const res = await fetch(`/api/categories/${cat.id}/toggle`, {
        method: 'PATCH'
      });
      if (!res.ok) throw new Error('خطا در تغییر وضعیت');
      const updated = await res.json();

      setCategories(prev => prev.map(c => (c.id === cat.id ? { ...c, isActive: updated.isActive } : c)));
      showToast(
        `دسته‌بندی «${cat.nameFa}» ${updated.isActive ? 'فعال' : 'غیرفعال'} گردید.`
      );
      onCategoryChanged?.();
    } catch (err: any) {
      showToast(err.message || 'خطا در تغییر وضعیت دسته‌بندی', 'error');
    }
  };

  // Request category deletion
  const handleDeleteRequest = (cat: Category) => {
    // 1. Check if it has products
    if (cat.itemCount && cat.itemCount > 0) {
      setDeleteBlockedReason({
        title: 'عدم امکان حذف دسته‌بندی',
        message: `این دسته‌بندی در حال حاضر دارای ${cat.itemCount} محصول فعال است. برای حفظ یکپارچگی فروشگاه، ابتدا باید محصولات را به دسته‌بندی دیگری منتقل نمایید یا آنها را حذف کنید.`,
        productCount: cat.itemCount
      });
      return;
    }

    // 2. Check if it has subcategories
    const children = getChildrenOf(cat.id);
    if (children.length > 0) {
      setDeleteBlockedReason({
        title: 'عدم امکان حذف دسته‌بندی والد',
        message: `این دسته‌بندی دارای ${children.length} زیردسته‌بندی وابسته است. ابتدا زیردسته‌ها را حذف نموده یا والد آنها را تغییر دهید.`,
        childCount: children.length
      });
      return;
    }

    // Safe to prompt confirmation
    setDeleteConfirmTarget(cat);
  };

  // Execute deletion
  const handleConfirmDelete = async () => {
    if (!deleteConfirmTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/categories/${deleteConfirmTarget.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'خطا در حذف دسته‌بندی.');
      }

      showToast(`دسته‌بندی «${deleteConfirmTarget.nameFa}» با موفقیت حذف شد.`);
      setDeleteConfirmTarget(null);
      await fetchCategories();
      onCategoryChanged?.();
    } catch (err: any) {
      showToast(err.message || 'خطا در حذف دسته‌بندی', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper for rendering category icon
  const renderCategoryIcon = (iconName?: string, className = 'w-4 h-4') => {
    const IconComponent = (iconName && AVAILABLE_ICONS[iconName]) || Folder;
    return <IconComponent className={className} />;
  };

  return (
    <div className="space-y-6" id="category-management-view">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 left-6 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-bold border transition-all animate-in slide-in-from-bottom-5 ${
            toastMessage.type === 'success'
              ? 'bg-slate-900 text-emerald-300 border-emerald-500/40 dark:bg-emerald-950/90 dark:text-emerald-200'
              : 'bg-slate-900 text-rose-300 border-rose-500/40 dark:bg-rose-950/90 dark:text-rose-200'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <FolderTree className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-100">مدیریت دسته‌بندی‌ها</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            سازماندهی دسته‌بندی‌های اصلی، زیرمجموعه‌ها، تصاویر شاخص و ارتباط با محصولات فروشگاه
          </p>
        </div>

        <button
          onClick={() => handleOpenCreate()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن دسته‌بندی جدید</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">کل دسته‌بندی‌ها</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {formatNumber(stats.total)}
            </span>
            <span className="text-[11px] text-slate-400">شاخه</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">دسته‌های فعال</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {formatNumber(stats.activeCount)}
            </span>
            <span className="text-[11px] text-slate-400">در فروشگاه</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">زیردسته‌بندی‌ها</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <FolderTree className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {formatNumber(stats.subCategoriesCount)}
            </span>
            <span className="text-[11px] text-slate-400">وابسته</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">محصولات منتسب</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {formatNumber(stats.totalAssignedProducts)}
            </span>
            <span className="text-[11px] text-slate-400">کالا</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters & View Mode */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="جستجو در نام فارسی، انگلیسی یا نامک..."
              className="w-full pr-9 pl-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-hidden focus:border-indigo-500"
            />
          </div>

          {/* View Mode Toggle & Actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode('tree')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'tree'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <FolderTree className="w-3.5 h-3.5" />
                <span>نمای درختی</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>نمای جدول</span>
              </button>
            </div>

            <button
              onClick={fetchCategories}
              title="تازه‌سازی لیست"
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Secondary Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>فیلترها:</span>
          </div>

          {/* Parent filter */}
          <select
            value={selectedParentFilter}
            onChange={e => setSelectedParentFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-hidden text-xs"
          >
            <option value="all">همه شاخه‌ها (والد و زیردسته)</option>
            <option value="root_only">فقط دسته‌بندی‌های اصلی (بدون والد)</option>
            {rootCategories.map(r => (
              <option key={r.id} value={r.id}>
                زیردسته‌های «{r.nameFa}»
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatusFilter}
            onChange={e => setSelectedStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-hidden text-xs"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="active">فقط فعال‌ها</option>
            <option value="inactive">فقط غیرفعال‌ها</option>
          </select>

          {/* Sort order */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-hidden text-xs mr-auto"
          >
            <option value="order">مرتب‌سازی: اولویت چیدمان</option>
            <option value="products">مرتب‌سازی: بیشترین محصول</option>
            <option value="name">مرتب‌سازی: الفبای نام</option>
          </select>
        </div>
      </div>

      {/* Main Content Area: Tree View or Table View */}
      {isLoading ? (
        <div className="p-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-500" />
          <span className="text-xs font-bold">در حال بارگذاری دسته‌بندی‌ها...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="p-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <FolderTree className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">دسته‌بندی‌ای یافت نشد</h3>
          <p className="text-xs text-slate-500 mb-4">می‌توانید اولین دسته‌بندی فروشگاه را اکنون ایجاد کنید.</p>
          <button
            onClick={() => handleOpenCreate()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
          >
            ایجاد اولین دسته‌بندی
          </button>
        </div>
      ) : viewMode === 'tree' && !searchQuery.trim() && selectedParentFilter === 'all' ? (
        /* --- HIERARCHICAL TREE VIEW --- */
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500">
            <span>ساختار درختی شاخه‌ها و زیرمجموعه‌ها</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const allParentIds = new Set(categories.map(c => c.id));
                  setExpandedIds(allParentIds);
                }}
                className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                باز کردن همه
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setExpandedIds(new Set())}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
              >
                بستن همه
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {rootCategories.map(rootCat => {
              const children = getChildrenOf(rootCat.id);
              const isExpanded = expandedIds.has(rootCat.id);

              return (
                <div
                  key={rootCat.id}
                  className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 overflow-hidden transition-all"
                >
                  {/* Root Category Row */}
                  <div className="p-3.5 flex items-center justify-between gap-3 bg-white dark:bg-slate-800/80">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Expand / Collapse Button */}
                      {children.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => toggleExpand(rootCat.id)}
                          className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-transform cursor-pointer"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? 'rotate-0' : '-rotate-90'
                            }`}
                          />
                        </button>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600">
                          •
                        </div>
                      )}

                      {/* Image Thumbnail */}
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 shrink-0 border border-slate-200/80 dark:border-slate-700">
                        {rootCat.image ? (
                          <img
                            src={rootCat.image}
                            alt={rootCat.nameFa}
                            className="w-full h-full object-cover"
                            onError={e => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&q=80&auto=format&fit=crop';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            {renderCategoryIcon(rootCat.icon)}
                          </div>
                        )}
                      </div>

                      {/* Category Info */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                            {rootCat.nameFa}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                            ({rootCat.slug})
                          </span>
                          {!rootCat.isActive && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                              غیرفعال
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <span>{children.length} زیردسته</span>
                          <span>•</span>
                          <span className="font-medium">
                            {formatNumber(rootCat.totalProductCount || rootCat.itemCount)} محصول
                          </span>
                          {rootCat.description && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-[200px]">{rootCat.description}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenCreate(rootCat.id)}
                        title="افزودن زیردسته‌بندی به این شاخه"
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-700 dark:hover:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">افزودن زیردسته</span>
                      </button>

                      {onNavigateToProducts && (
                        <button
                          type="button"
                          onClick={() => onNavigateToProducts(rootCat.slug || rootCat.id)}
                          title="مشاهده محصولات این دسته‌بندی"
                          className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        >
                          <Package className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(rootCat)}
                        title={rootCat.isActive ? 'غیرفعال‌سازی دسته‌بندی' : 'فعال‌سازی دسته‌بندی'}
                        className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                          rootCat.isActive
                            ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60'
                            : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {rootCat.isActive ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(rootCat)}
                        title="ویرایش دسته‌بندی"
                        className="p-1.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteRequest(rootCat)}
                        title="حذف دسته‌بندی"
                        className="p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/60 text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subcategories Container */}
                  {isExpanded && children.length > 0 && (
                    <div className="p-3 pr-10 border-t border-slate-100 dark:border-slate-800/80 space-y-2 bg-slate-50/70 dark:bg-slate-900/40">
                      {children.map(subCat => {
                        const grandChildren = getChildrenOf(subCat.id);

                        return (
                          <div
                            key={subCat.id}
                            className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 shadow-2xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-slate-300 dark:text-slate-600">└──</span>

                              <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 shrink-0 border border-slate-200 dark:border-slate-700">
                                {subCat.image ? (
                                  <img
                                    src={subCat.image}
                                    alt={subCat.nameFa}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    {renderCategoryIcon(subCat.icon, 'w-3.5 h-3.5')}
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                                    {subCat.nameFa}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-400">({subCat.slug})</span>
                                  {!subCat.isActive && (
                                    <span className="px-1 py-0.2 rounded text-[9px] bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                      غیرفعال
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                  {formatNumber(subCat.itemCount)} محصول مستقیم
                                  {grandChildren.length > 0 && ` • ${grandChildren.length} زیرشاخه`}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleOpenCreate(subCat.id)}
                                title="افزودن زیردسته سطح ۳"
                                className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>

                              {onNavigateToProducts && (
                                <button
                                  type="button"
                                  onClick={() => onNavigateToProducts(subCat.slug || subCat.id)}
                                  title="مشاهده محصولات"
                                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                                >
                                  <Package className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleToggleStatus(subCat)}
                                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                                  subCat.isActive ? 'text-emerald-500' : 'text-slate-400'
                                }`}
                              >
                                {subCat.isActive ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5" />
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenEdit(subCat)}
                                className="p-1 rounded-lg text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteRequest(subCat)}
                                className="p-1 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* --- TABLE / GRID VIEW --- */
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 font-bold">
                <tr>
                  <th className="py-3.5 pr-6 pl-3">نام و آیکون دسته‌بندی</th>
                  <th className="py-3.5 px-3">نامک (Slug)</th>
                  <th className="py-3.5 px-3">دسته‌بندی والد</th>
                  <th className="py-3.5 px-3 text-center">محصولات</th>
                  <th className="py-3.5 px-3 text-center">اولویت نمایش</th>
                  <th className="py-3.5 px-3 text-center">وضعیت</th>
                  <th className="py-3.5 pl-6 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      هیچ دسته‌بندی‌ای با فیلترهای انتخابی مطابقت ندارد.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map(cat => {
                    const parentCategory = categories.find(c => c.id === cat.parentId);

                    return (
                      <tr key={cat.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 pr-6 pl-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/80 dark:border-slate-700">
                              {cat.image ? (
                                <img
                                  src={cat.image}
                                  alt={cat.nameFa}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                  {renderCategoryIcon(cat.icon)}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{cat.nameFa}</p>
                              <p className="text-[11px] text-slate-400 font-sans">{cat.name}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                          {cat.slug}
                        </td>

                        <td className="py-3.5 px-3">
                          {parentCategory ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
                              <Folder className="w-3 h-3" />
                              <span>{parentCategory.nameFa}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">دسته‌بندی اصلی (والد)</span>
                          )}
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {formatNumber(cat.itemCount)}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-center font-mono text-slate-600 dark:text-slate-400">
                          {formatNumber(cat.sortOrder)}
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(cat)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                              cat.isActive
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 hover:bg-emerald-200'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
                            }`}
                          >
                            {cat.isActive ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>فعال</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" />
                                <span>غیرفعال</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="py-3.5 pl-6 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {onNavigateToProducts && (
                              <button
                                onClick={() => onNavigateToProducts(cat.slug || cat.id)}
                                title="مشاهده کالاها"
                                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                              >
                                <Package className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => handleOpenEdit(cat)}
                              title="ویرایش دسته‌بندی"
                              className="p-1.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteRequest(cat)}
                              title="حذف دسته‌بندی"
                              className="p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT CATEGORY MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <FolderTree className="w-4 h-4" />
                </div>
                <h3 className="font-black text-slate-900 dark:text-slate-100 text-base">
                  {modalMode === 'create' ? 'افزودن دسته‌بندی جدید' : `ویرایش دسته‌بندی «${editingCategory?.nameFa}»`}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveCategory} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 flex items-center gap-2 text-rose-700 dark:text-rose-300">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نام فارسی دسته‌بندی *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.nameFa}
                    onChange={e => handleNameFaChange(e.target.value)}
                    placeholder="مثال: ساعت و گجت‌های پوشیدنی"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نام لاتین / انگلیسی (اختیاری)
                  </label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={e => setFormState({ ...formState, name: e.target.value })}
                    placeholder="Smartwatches & Wearables"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Slug & Parent */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نامک یکتا (Slug) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.slug}
                    onChange={e => setFormState({ ...formState, slug: e.target.value.toLowerCase() })}
                    placeholder="smartwatches"
                    className="w-full px-3 py-2 rounded-xl font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-hidden"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    در آدرس URL صفحات و فیلتر محصولات استفاده می‌شود.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    دسته‌بندی والد (سلسله‌مراتب)
                  </label>
                  <select
                    value={formState.parentId || ''}
                    onChange={e => setFormState({ ...formState, parentId: e.target.value || null })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-hidden"
                  >
                    <option value="">دسته‌بندی اصلی (بدون والد)</option>
                    {categories
                      .filter(c => (editingCategory ? c.id !== editingCategory.id : true))
                      .map(c => (
                        <option key={c.id} value={c.id}>
                          {c.parentId ? `── ${c.nameFa}` : `● ${c.nameFa}`}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Category Image Upload & Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-3">
                <label className="block font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>تصویر شاخص دسته‌بندی</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">آپلود مستقیم یا آدرس وب</span>
                </label>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {/* Thumbnail Preview */}
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border border-slate-300 dark:border-slate-600 relative group">
                    {formState.image ? (
                      <img
                        src={formState.image}
                        alt="پیش‌نمایش"
                        className="w-full h-full object-cover"
                        onError={e => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&q=80&auto=format&fit=crop';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}

                    {isUploadingImage && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    {/* File Upload Input */}
                    <div className="flex items-center gap-2">
                      <label className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-dashed border-indigo-300 dark:border-indigo-800 hover:border-indigo-500 text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploadingImage ? 'در حال آپلود...' : 'انتخاب و آپلود تصویر از کامپیوتر'}</span>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp"
                          className="hidden"
                          disabled={isUploadingImage}
                          onChange={e => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageUpload(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* URL Input */}
                    <input
                      type="url"
                      value={formState.image}
                      onChange={e => setFormState({ ...formState, image: e.target.value })}
                      placeholder="یا آدرس اینترنتی تصویر را اینجا وارد کنید: https://..."
                      className="w-full px-3 py-1.5 rounded-xl text-[11px] font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-hidden"
                    />

                    {imageUploadError && (
                      <p className="text-[11px] text-rose-500 font-medium">{imageUploadError}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Icon Selector & Sort Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    آیکون نماد دسته‌بندی
                  </label>
                  <div className="grid grid-cols-8 gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {Object.keys(AVAILABLE_ICONS).map(iconKey => {
                      const IconComp = AVAILABLE_ICONS[iconKey];
                      const isSelected = formState.icon === iconKey;

                      return (
                        <button
                          key={iconKey}
                          type="button"
                          onClick={() => setFormState({ ...formState, icon: iconKey })}
                          title={iconKey}
                          className={`p-2 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-xs scale-105'
                              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700'
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    ترتیب چیدمان (Sort Order)
                  </label>
                  <input
                    type="number"
                    value={formState.sortOrder}
                    onChange={e => setFormState({ ...formState, sortOrder: Number(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono outline-hidden"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  توضیح کوتاه معرفی دسته‌بندی
                </label>
                <textarea
                  rows={2}
                  value={formState.description}
                  onChange={e => setFormState({ ...formState, description: e.target.value })}
                  placeholder="معرفی اجمالی کالاهای این شاخه برای نمایش به مشتریان..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-hidden"
                />
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">وضعیت انتشار در فروشگاه</p>
                  <p className="text-[11px] text-slate-500">
                    در صورت غیرفعال بودن، این شاخه در منوی ناوبری و فیلترها نمایش داده نمی‌شود.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.isActive}
                    onChange={e => setFormState({ ...formState, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-colors cursor-pointer"
                >
                  انصراف
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{modalMode === 'create' ? 'ایجاد دسته‌بندی' : 'ذخیره تغییرات'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CONFIRMATION DIALOG (FOR SAFE DELETION) --- */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-slate-100 mb-1">
                تأیید حذف دسته‌بندی
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                آیا از حذف دسته‌بندی «<strong className="text-slate-800 dark:text-slate-200">{deleteConfirmTarget.nameFa}</strong>» اطمینان دارید؟ این عملیات غیرقابل بازگشت است.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>حذف نهایی</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- BLOCKED DELETION ALERT DIALOG --- */}
      {deleteBlockedReason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-amber-200 dark:border-amber-900/60 shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-slate-100 mb-1">
                {deleteBlockedReason.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed px-2">
                {deleteBlockedReason.message}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setDeleteBlockedReason(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-sm hover:opacity-90 transition-all cursor-pointer"
              >
                متوجه شدم
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
