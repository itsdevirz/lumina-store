import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  Image as ImageIcon,
  Check,
  X,
  Trash2,
  Sparkles,
  AlertCircle,
  Camera,
  RefreshCw
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

// Collection of 8 beautifully styled minimal SVG animated avatars
export const PRESET_AVATARS = [
  {
    id: 'avatar-1',
    name: 'Cosmic Explorer',
    nameFa: 'کاوشگر کهکشانی',
    bg: 'bg-indigo-500/15 border-indigo-500/30',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="46" fill="#6366F1" fillOpacity="0.2" />
        <circle cx="50" cy="50" r="38" fill="#4F46E5" />
        <circle cx="50" cy="46" r="22" fill="#E0E7FF" />
        <rect x="36" y="42" width="28" height="12" rx="6" fill="#1E1B4B" />
        <circle cx="44" cy="48" r="2.5" fill="#818CF8" />
        <circle cx="56" cy="48" r="2.5" fill="#818CF8" />
        <path d="M35 78 C35 68 65 68 65 78 Z" fill="#EEF2FF" />
        <circle cx="30" cy="30" r="3" fill="#FDE047" className="animate-pulse" />
        <circle cx="72" cy="28" r="2" fill="#38BDF8" className="animate-pulse" />
      </svg>
    ),
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%234F46E5"/><circle cx="50" cy="46" r="22" fill="%23E0E7FF"/><rect x="36" y="42" width="28" height="12" rx="6" fill="%231E1B4B"/><circle cx="44" cy="48" r="2.5" fill="%23818CF8"/><circle cx="56" cy="48" r="2.5" fill="%23818CF8"/><path d="M35 78 C35 68 65 68 65 78 Z" fill="%23EEF2FF"/></svg>'
  },
  {
    id: 'avatar-2',
    name: 'Neon Cyber Cat',
    nameFa: 'گربه سایبرپانک',
    bg: 'bg-rose-500/15 border-rose-500/30',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="46" fill="#F43F5E" fillOpacity="0.2" />
        <circle cx="50" cy="50" r="38" fill="#E11D48" />
        {/* Cat ears */}
        <polygon points="32,24 44,40 26,42" fill="#BE123C" />
        <polygon points="68,24 74,42 56,40" fill="#BE123C" />
        <polygon points="34,28 42,39 30,40" fill="#FDA4AF" />
        <polygon points="66,28 70,40 58,39" fill="#FDA4AF" />
        <circle cx="50" cy="54" r="22" fill="#FFE4E6" />
        {/* Glasses */}
        <rect x="34" y="48" width="13" height="9" rx="3" fill="#18181B" />
        <rect x="53" y="48" width="13" height="9" rx="3" fill="#18181B" />
        <line x1="47" y1="52" x2="53" y2="52" stroke="#18181B" strokeWidth="2" />
        <circle cx="40.5" cy="52.5" r="2" fill="#38BDF8" />
        <circle cx="59.5" cy="52.5" r="2" fill="#38BDF8" />
        <polygon points="50,61 47,59 53,59" fill="#F43F5E" />
      </svg>
    ),
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23E11D48"/><polygon points="32,24 44,40 26,42" fill="%23BE123C"/><polygon points="68,24 74,42 56,40" fill="%23BE123C"/><circle cx="50" cy="54" r="22" fill="%23FFE4E6"/><rect x="34" y="48" width="13" height="9" rx="3" fill="%2318181B"/><rect x="53" y="48" width="13" height="9" rx="3" fill="%2318181B"/><circle cx="40.5" cy="52.5" r="2" fill="%2338BDF8"/><circle cx="59.5" cy="52.5" r="2" fill="%2338BDF8"/></svg>'
  },
  {
    id: 'avatar-3',
    name: 'Zen Minimal Robot',
    nameFa: 'ربات هوشمند ذن',
    bg: 'bg-emerald-500/15 border-emerald-500/30',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="46" fill="#10B981" fillOpacity="0.2" />
        <circle cx="50" cy="50" r="38" fill="#059669" />
        {/* Antenna */}
        <line x1="50" y1="22" x2="50" y2="32" stroke="#A7F3D0" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="20" r="3.5" fill="#34D399" className="animate-ping origin-center" />
        <circle cx="50" cy="20" r="3.5" fill="#FDE047" />
        {/* Robot Head */}
        <rect x="30" y="32" width="40" height="34" rx="8" fill="#ECFDF5" />
        <rect x="35" y="40" width="30" height="15" rx="4" fill="#064E3B" />
        {/* LED Eyes */}
        <circle cx="43" cy="47" r="3" fill="#34D399" />
        <circle cx="57" cy="47" r="3" fill="#34D399" />
        <line x1="43" y1="60" x2="57" y2="60" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23059669"/><circle cx="50" cy="20" r="4" fill="%23FDE047"/><rect x="30" y="32" width="40" height="34" rx="8" fill="%23ECFDF5"/><rect x="35" y="40" width="30" height="15" rx="4" fill="%23064E3B"/><circle cx="43" cy="47" r="3" fill="%2334D399"/><circle cx="57" cy="47" r="3" fill="%2334D399"/></svg>'
  },
  {
    id: 'avatar-4',
    name: 'Sunset Minimal Fox',
    nameFa: 'روباه غروب کهربایی',
    bg: 'bg-amber-500/15 border-amber-500/30',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="46" fill="#F59E0B" fillOpacity="0.2" />
        <circle cx="50" cy="50" r="38" fill="#D97706" />
        {/* Ears */}
        <polygon points="28,26 42,42 24,44" fill="#B45309" />
        <polygon points="72,26 76,44 58,42" fill="#B45309" />
        {/* Face */}
        <path d="M28 44 L50 74 L72 44 Z" fill="#FBBF24" />
        <path d="M28 44 L50 74 L38 52 Z" fill="#FFFBEB" />
        <path d="M72 44 L50 74 L62 52 Z" fill="#FFFBEB" />
        <circle cx="42" cy="48" r="2.5" fill="#78350F" />
        <circle cx="58" cy="48" r="2.5" fill="#78350F" />
        <circle cx="50" cy="71" r="3" fill="#78350F" />
      </svg>
    ),
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23D97706"/><polygon points="28,26 42,42 24,44" fill="%23B45309"/><polygon points="72,26 76,44 58,42" fill="%23B45309"/><path d="M28 44 L50 74 L72 44 Z" fill="%23FBBF24"/><circle cx="42" cy="48" r="2.5" fill="%2378350F"/><circle cx="58" cy="48" r="2.5" fill="%2378350F"/><circle cx="50" cy="71" r="3" fill="%2378350F"/></svg>'
  },
  {
    id: 'avatar-5',
    name: 'Minimalist Studio Artist',
    nameFa: 'هنرمند استودیو',
    bg: 'bg-purple-500/15 border-purple-500/30',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="46" fill="#8B5CF6" fillOpacity="0.2" />
        <circle cx="50" cy="50" r="38" fill="#7C3AED" />
        {/* Beret Hat */}
        <ellipse cx="50" cy="34" rx="20" ry="8" fill="#4C1D95" />
        <circle cx="50" cy="26" r="3" fill="#A78BFA" />
        {/* Face */}
        <circle cx="50" cy="48" r="16" fill="#F3E8FF" />
        {/* Sunglasses */}
        <circle cx="44" cy="46" r="4.5" fill="#1E1B4B" />
        <circle cx="56" cy="46" r="4.5" fill="#1E1B4B" />
        <line x1="48" y1="46" x2="52" y2="46" stroke="#1E1B4B" strokeWidth="1.5" />
        <path d="M46 54 Q50 58 54 54" stroke="#7C3AED" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M36 78 C36 68 64 68 64 78 Z" fill="#DDD6FE" />
      </svg>
    ),
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%237C3AED"/><ellipse cx="50" cy="34" rx="20" ry="8" fill="%234C1D95"/><circle cx="50" cy="48" r="16" fill="%23F3E8FF"/><circle cx="44" cy="46" r="4.5" fill="%231E1B4B"/><circle cx="56" cy="46" r="4.5" fill="%231E1B4B"/></svg>'
  },
  {
    id: 'avatar-6',
    name: 'Cyan Gamer Ninja',
    nameFa: 'نینجای سایبری فیروزه‌ای',
    bg: 'bg-cyan-500/15 border-cyan-500/30',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="46" fill="#06B6D4" fillOpacity="0.2" />
        <circle cx="50" cy="50" r="38" fill="#0891B2" />
        <circle cx="50" cy="48" r="20" fill="#164E63" />
        <rect x="36" y="44" width="28" height="8" rx="2" fill="#CFFAFE" />
        <circle cx="43" cy="48" r="2" fill="#0891B2" />
        <circle cx="57" cy="48" r="2" fill="#0891B2" />
        <path d="M30 38 Q50 32 70 38" stroke="#22D3EE" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M34 78 C34 68 66 68 66 78 Z" fill="#155E75" />
      </svg>
    ),
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%230891B2"/><circle cx="50" cy="48" r="20" fill="%23164E63"/><rect x="36" y="44" width="28" height="8" rx="2" fill="%23CFFAFE"/><circle cx="43" cy="48" r="2" fill="%230891B2"/><circle cx="57" cy="48" r="2" fill="%230891B2"/></svg>'
  },
  {
    id: 'avatar-7',
    name: 'Boba Panda',
    nameFa: 'پاندای بامبو و قهوه',
    bg: 'bg-teal-500/15 border-teal-500/30',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="46" fill="#14B8A6" fillOpacity="0.2" />
        <circle cx="50" cy="50" r="38" fill="#0D9488" />
        {/* Ears */}
        <circle cx="34" cy="34" r="9" fill="#134E4A" />
        <circle cx="66" cy="34" r="9" fill="#134E4A" />
        <circle cx="50" cy="52" r="20" fill="#F0FDFA" />
        {/* Eye patches */}
        <ellipse cx="42" cy="50" rx="5" ry="6" fill="#134E4A" />
        <ellipse cx="58" cy="50" rx="5" ry="6" fill="#134E4A" />
        <circle cx="43" cy="49" r="1.8" fill="#FFFFFF" />
        <circle cx="57" cy="49" r="1.8" fill="#FFFFFF" />
        <ellipse cx="50" cy="57" rx="3" ry="2" fill="#134E4A" />
      </svg>
    ),
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%230D9488"/><circle cx="34" cy="34" r="9" fill="%23134E4A"/><circle cx="66" cy="34" r="9" fill="%23134E4A"/><circle cx="50" cy="52" r="20" fill="%23F0FDFA"/><ellipse cx="42" cy="50" rx="5" ry="6" fill="%23134E4A"/><ellipse cx="58" cy="50" rx="5" ry="6" fill="%23134E4A"/><circle cx="43" cy="49" r="1.8" fill="%23FFFFFF"/><circle cx="57" cy="49" r="1.8" fill="%23FFFFFF"/></svg>'
  },
  {
    id: 'avatar-8',
    name: 'Electric Bolt Hero',
    nameFa: 'قهرمان رعدوبرق',
    bg: 'bg-yellow-500/15 border-yellow-500/30',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="46" fill="#EAB308" fillOpacity="0.2" />
        <circle cx="50" cy="50" r="38" fill="#CA8A04" />
        <circle cx="50" cy="48" r="18" fill="#FEF08A" />
        {/* Lightning mask */}
        <polygon points="50,30 43,46 51,46 47,60 59,44 51,44" fill="#A16207" />
        <circle cx="43" cy="46" r="2" fill="#713F12" />
        <circle cx="57" cy="46" r="2" fill="#713F12" />
        <path d="M35 78 C35 68 65 68 65 78 Z" fill="#FEF9C3" />
      </svg>
    ),
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23CA8A04"/><circle cx="50" cy="48" r="18" fill="%23FEF08A"/><polygon points="50,30 43,46 51,46 47,60 59,44 51,44" fill="%23A16207"/></svg>'
  }
];

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

export const AvatarUploadManager: React.FC = () => {
  const { userProfile, updateUserProfile, addToast, lang } = useStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate and process uploaded image
  const processImageFile = (file: File) => {
    // 1. Validate File Format (ONLY PNG, JPG, JPEG)
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    const hasValidExt = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
    const hasValidMime = ALLOWED_MIME_TYPES.includes(fileType);

    if (!hasValidMime && !hasValidExt) {
      addToast({
        title: lang === 'fa' ? 'فرمت فایل نامعتبر است' : 'Invalid File Format',
        description:
          lang === 'fa'
            ? 'تنها فایل‌های با پسوند PNG یا JPG / JPEG مجاز به بارگذاری هستند.'
            : 'Only PNG or JPG / JPEG images are supported.',
        type: 'error'
      });
      return;
    }

    // 2. Validate File Size (Max 2 MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      addToast({
        title: lang === 'fa' ? 'حجم فایل بیشتر از حد مجاز است' : 'File Size Exceeded',
        description:
          lang === 'fa'
            ? `حجم فایل انتخابی (${fileSizeMB}MB) بیشتر از سقف مجاز ۲ مگابایت است.`
            : `File size (${fileSizeMB}MB) exceeds the 2MB maximum limit.`,
        type: 'error'
      });
      return;
    }

    // 3. Read and Save Image as Data URL
    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = e => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        updateUserProfile({ avatar: dataUrl });
        setSelectedPresetId(null);
        setIsUploading(false);
        addToast({
          title: lang === 'fa' ? 'پروفایل به‌روزرسانی شد' : 'Profile Updated',
          description:
            lang === 'fa'
              ? 'تصویر پروفایل شما با موفقیت آپلود و ذخیره گردید.'
              : 'Your new avatar image has been uploaded and saved.',
          type: 'success'
        });
      }
    };

    reader.onerror = () => {
      setIsUploading(false);
      addToast({
        title: lang === 'fa' ? 'خطا در بارگذاری' : 'Upload Error',
        description:
          lang === 'fa'
            ? 'خطایی هنگام خواندن فایل رخ داد. لطفاً مجدداً امتحان کنید.'
            : 'Failed to read the image file. Please try again.',
        type: 'error'
      });
    };

    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    // reset input value so re-uploading same filename works
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleSelectPreset = (preset: (typeof PRESET_AVATARS)[0]) => {
    setSelectedPresetId(preset.id);
    updateUserProfile({ avatar: preset.dataUrl });
    addToast({
      title: lang === 'fa' ? 'آواتار انتخاب شد' : 'Avatar Selected',
      description:
        lang === 'fa'
          ? `آواتار «${preset.nameFa}» به عنوان تصویر پروفایل تنظیم شد.`
          : `Preset avatar "${preset.name}" applied.`,
      type: 'success'
    });
  };

  const handleResetToDefault = () => {
    const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';
    updateUserProfile({ avatar: defaultAvatar });
    setSelectedPresetId(null);
    addToast({
      title: lang === 'fa' ? 'بازنشانی به پیش‌فرض' : 'Reset to Default',
      description:
        lang === 'fa'
          ? 'تصویر پروفایل به حالت پیش‌فرض بازگردانی شد.'
          : 'Avatar reset to original default photo.',
      type: 'info'
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Active Avatar Preview Bar */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
        <div className="relative group shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border-2 border-indigo-500/30 p-1 shadow-md">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1.5 -right-1.5 p-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title={lang === 'fa' ? 'تغییر عکس پروفایل' : 'Change Photo'}
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 text-center sm:text-right">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h4 className="text-base font-black text-slate-900 dark:text-white">
              {userProfile.name}
            </h4>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold">
              {lang === 'fa' ? 'تصویر فعال' : 'Active Avatar'}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
            {lang === 'fa'
              ? 'می‌توانید عکس دلخواه خود (PNG یا JPG تا سقف ۲ مگابایت) را بارگذاری کنید یا از آواتارهای آماده استفاده نمایید.'
              : 'Upload your custom photo (PNG or JPG up to 2MB) or pick one of the minimal preset avatars below.'}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{lang === 'fa' ? 'آپلود عکس جدید' : 'Upload Photo'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 text-xs font-semibold transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === 'fa' ? 'بازنشانی پیش‌فرض' : 'Reset'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Upload Drag & Drop Box */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
          {lang === 'fa' ? 'بارگذاری فایل عکس اختصاصی' : 'Upload Custom Avatar'}
        </label>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 hover:border-indigo-400 hover:bg-indigo-50/20'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 shadow-2xs">
            {isUploading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </div>

          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
            {lang === 'fa'
              ? 'فایل عکس خود را اینجا رها کنید یا برای انتخاب کلیک نمایید'
              : 'Drag & drop image file here, or click to browse'}
          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            {lang === 'fa'
              ? 'فرمت‌های مجاز: PNG, JPG • حداکثر حجم مجاز: ۲ مگابایت'
              : 'Supported formats: PNG, JPG • Maximum file size: 2 MB'}
          </p>
        </div>
      </div>

      {/* Preset Animated / Vector Avatars Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              {lang === 'fa' ? 'آواتارهای انیمیشنی و مینیمال آماده' : 'Preset Minimal Animated Avatars'}
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">
            {lang === 'fa' ? 'انتخاب با ۱ کلیک' : '1-Click Selection'}
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-3.5">
          {PRESET_AVATARS.map(avatar => {
            const isSelected =
              selectedPresetId === avatar.id || userProfile.avatar === avatar.dataUrl;

            return (
              <button
                key={avatar.id}
                type="button"
                onClick={() => handleSelectPreset(avatar)}
                className={`group relative flex flex-col items-center p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/50 shadow-sm scale-105 ring-2 ring-indigo-500/25'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 hover:scale-105'
                }`}
                title={lang === 'fa' ? avatar.nameFa : avatar.name}
              >
                {/* SVG Avatar Container */}
                <div
                  className={`w-14 h-14 rounded-2xl overflow-hidden p-1.5 transition-transform duration-300 group-hover:rotate-6 shadow-2xs ${avatar.bg}`}
                >
                  {avatar.svg}
                </div>

                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 mt-2 line-clamp-1 text-center">
                  {lang === 'fa' ? avatar.nameFa : avatar.name}
                </span>

                {/* Selected Indicator */}
                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
