import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Star,
  Trash2,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Link,
  Plus,
  RefreshCw,
  FileText
} from 'lucide-react';
import { ProductImage } from '../../types';

interface UploadItem {
  id: string;
  url: string;
  fileName: string;
  fileSize?: number;
  isPrimary: boolean;
  uploading?: boolean;
  error?: string;
}

interface ProductImageUploadBoxProps {
  images: string[];
  primaryImage?: string;
  onChange: (images: string[], primaryImage: string) => void;
  productId?: string;
}

export const ProductImageUploadBox: React.FC<ProductImageUploadBoxProps> = ({
  images,
  primaryImage,
  onChange,
  productId
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Helper to format file size
  const formatFileSize = (bytes?: number): string => {
    if (!bytes || isNaN(bytes)) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Helper to parse filename from URL
  const getFileNameFromUrl = (url: string): string => {
    try {
      if (url.startsWith('data:')) return 'تصویر محلی (Base64)';
      const parts = url.split('/');
      const lastPart = parts[parts.length - 1];
      return decodeURIComponent(lastPart.split('?')[0]) || 'image.jpg';
    } catch {
      return 'image.jpg';
    }
  };

  // Convert string array to items list
  const currentPrimary = primaryImage || images[0] || '';

  // Client-side file validation
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // 1. Max size: 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { valid: false, error: `فایل «${file.name}» بیش از حد مجاز (۱۰ مگابایت) است.` };
    }

    // 2. Reject SVG
    if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
      return {
        valid: false,
        error: `آپلود فرمت SVG برای تصویر محصول مجاز نیست. لطفاً از JPG، PNG یا WEBP استفاده کنید.`
      };
    }

    // 3. Allowed extensions
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    const validMimes = ['image/jpeg', 'image/png', 'image/webp'];
    const hasValidMime = validMimes.includes(file.type);

    if (!hasValidExt || !hasValidMime) {
      return {
        valid: false,
        error: `فرمت فایل «${file.name}» مجاز نیست. تنها فرمت‌های JPG، PNG و WEBP پشتیبانی می‌شوند.`
      };
    }

    return { valid: true };
  };

  // Upload handler
  const handleFilesUpload = async (files: FileList | File[]) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    // Validate all files
    for (const file of fileArray) {
      const check = validateFile(file);
      if (!check.valid) {
        setErrorMessage(check.error || 'فایل نامعتبر است.');
        return;
      }
    }

    setIsUploading(true);
    setUploadProgress(`در حال پردازش و آپلود ${fileArray.length} تصویر...`);

    try {
      const formData = new FormData();
      fileArray.forEach(f => formData.append('files', f));
      formData.append('folder', 'products');

      const response = await fetch('/api/upload?folder=products', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'خطا در آپلود تصاویر در سرور.');
      }

      const uploadedUrls: string[] = (data.files || []).map((f: any) => f.url);

      if (uploadedUrls.length === 0 && data.url) {
        uploadedUrls.push(data.url);
      }

      // Append new images to existing list
      const updatedImages = [...images, ...uploadedUrls];
      const newPrimary = currentPrimary || updatedImages[0] || '';

      onChange(updatedImages, newPrimary);
      setSuccessMessage(`${uploadedUrls.length} تصویر با موفقیت آپلود و ذخیره شد.`);
    } catch (err: any) {
      console.error('Upload error:', err);
      setErrorMessage(err.message || 'خطا در ارتباط با سرور آپلود.');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesUpload(e.dataTransfer.files);
    }
  };

  // Set primary image
  const handleSetPrimary = (targetUrl: string) => {
    // Put primary image first in array as standard practice
    const reordered = [targetUrl, ...images.filter(url => url !== targetUrl)];
    onChange(reordered, targetUrl);
    setSuccessMessage('تصویر اصلی محصول به‌روزرسانی شد.');
  };

  // Reorder left/right
  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const newImages = [...images];
    const [moved] = newImages.splice(index, 1);
    newImages.splice(targetIndex, 0, moved);

    const newPrimary = newImages[0] || '';
    onChange(newImages, newPrimary);
  };

  // Delete image
  const handleDeleteImage = async (urlToDelete: string) => {
    const updatedImages = images.filter(url => url !== urlToDelete);
    const newPrimary = currentPrimary === urlToDelete ? (updatedImages[0] || '') : currentPrimary;
    onChange(updatedImages, newPrimary);

    // Call server to clean up physical storage if it was an uploaded file
    if (urlToDelete.startsWith('/uploads/')) {
      try {
        await fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlToDelete, productId })
        });
      } catch (err) {
        console.warn('Silent file unlink notification error:', err);
      }
    }
  };

  // Add custom URL
  const handleAddCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    const url = customUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/uploads/')) {
      setErrorMessage('لطفاً یک آدرس اینترنتی معتبر (با http یا https) وارد کنید.');
      return;
    }

    const updatedImages = [...images, url];
    const newPrimary = currentPrimary || updatedImages[0];
    onChange(updatedImages, newPrimary);
    setCustomUrl('');
    setShowUrlInput(false);
    setSuccessMessage('تصویر اینترنتی به لیست اضافه شد.');
  };

  return (
    <div className="space-y-4" id="product-image-upload-section">
      {/* Upload Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center group select-none ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30 ring-4 ring-indigo-500/15 scale-[1.008]'
            : 'border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={e => {
            if (e.target.files && e.target.files.length > 0) {
              handleFilesUpload(e.target.files);
            }
          }}
        />

        {isUploading ? (
          <div className="py-4 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 animate-pulse">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
              {uploadProgress || 'در حال آپلود تصاویر به سرور...'}
            </p>
            <span className="text-xs text-slate-500">لطفاً شکیبا باشید</span>
          </div>
        ) : (
          <div className="py-2 flex flex-col items-center">
            <div className="w-13 h-13 rounded-2xl bg-white dark:bg-slate-700 shadow-sm border border-slate-200/80 dark:border-slate-600 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 group-hover:scale-105 transition-transform duration-200">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">
              تصاویر محصول را اینجا بکشید یا برای انتخاب کلیک کنید
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              پشتیبانی از آپلود همزمان چند تصویر واقعی از سیستم
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200/80 dark:border-slate-600 font-mono">
                JPG
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200/80 dark:border-slate-600 font-mono">
                PNG
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200/80 dark:border-slate-600 font-mono">
                WEBP
              </span>
              <span className="text-slate-400 mr-1.5">(حداکثر ۱۰ مگابایت)</span>
            </div>
          </div>
        )}
      </div>

      {/* Notifications / Alerts */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <div className="flex-1 font-medium">{errorMessage}</div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-rose-600 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-400 hover:text-emerald-600 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Uploaded Images Preview Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
            <span>تصاویر انتخاب‌شده محصول ({images.length} تصویر)</span>
          </label>

          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Link className="w-3 h-3" />
            <span>{showUrlInput ? 'بستن ورودی آدرس' : 'افزودن با آدرس اینترنتی (URL)'}</span>
          </button>
        </div>

        {/* Optional Direct URL Input Form */}
        {showUrlInput && (
          <form
            onSubmit={handleAddCustomUrl}
            className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex gap-2"
          >
            <input
              type="url"
              value={customUrl}
              onChange={e => setCustomUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... یا آدرس اینترنتی تصویر"
              className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-hidden font-mono"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>افزودن</span>
            </button>
          </form>
        )}

        {images.length === 0 ? (
          <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500">
            هنوز تصویری برای این محصول آپلود نشده است. برای نمایش بهتر محصول در فروشگاه حداقل ۱ تصویر بارگذاری کنید.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
            {images.map((url, index) => {
              const isPrimary = url === currentPrimary || (index === 0 && !currentPrimary);
              const fileName = getFileNameFromUrl(url);

              return (
                <div
                  key={`${url}-${index}`}
                  className={`group relative rounded-2xl p-2.5 bg-white dark:bg-slate-800/90 border transition-all duration-200 shadow-xs flex flex-col ${
                    isPrimary
                      ? 'border-amber-400/90 dark:border-amber-500/80 ring-2 ring-amber-400/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 mb-2">
                    <img
                      src={url}
                      alt={`تصویر ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={e => {
                        (e.target as HTMLImageElement).src =
                          '/images/products/photo-1526170375885-4d8ecf77b99f.jpg';
                      }}
                    />

                    {/* Primary Badge */}
                    {isPrimary ? (
                      <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-sm flex items-center gap-1 z-10">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>تصویر اصلی</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(url)}
                        title="تنظیم به عنوان تصویر اصلی محصول"
                        className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 hover:bg-amber-500 text-white hover:text-slate-950 shadow-sm opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 z-10 cursor-pointer"
                      >
                        <Star className="w-2.5 h-2.5" />
                        <span>اصلی شود</span>
                      </button>
                    )}

                    {/* Image Source Badge */}
                    <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-black/55 text-white/90 backdrop-blur-xs">
                      #{index + 1}
                    </span>
                  </div>

                  {/* File Details */}
                  <div className="flex-1 min-w-0 mb-2 px-0.5">
                    <p className="text-[11px] font-medium text-slate-700 dark:text-slate-200 truncate" title={fileName}>
                      {fileName}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                      {url.startsWith('/uploads/') ? 'فایل محلی ذخیره‌شده' : 'آدرس خارجی'}
                    </p>
                  </div>

                  {/* Card Controls */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMove(index, 'left')}
                        title="انتقال به راست / جلو"
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      >
                        <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </button>
                      <button
                        type="button"
                        disabled={index === images.length - 1}
                        onClick={() => handleMove(index, 'right')}
                        title="انتقال به چپ / بعد"
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteImage(url)}
                      title="حذف تصویر"
                      className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
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
    </div>
  );
};
