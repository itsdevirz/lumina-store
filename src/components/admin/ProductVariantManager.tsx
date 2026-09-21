import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Trash2,
  Sparkles,
  Layers,
  Palette,
  Ruler,
  Check,
  RefreshCw,
  Edit3,
  Sliders,
  DollarSign,
  Package,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ProductColor, ProductVariant, ProductAttribute, VariantType } from '../../types';

interface ProductVariantManagerProps {
  variantType: VariantType;
  colors: ProductColor[];
  sizes: string[];
  customAttributes: ProductAttribute[];
  variants: ProductVariant[];
  basePrice: number;
  productSku?: string;
  baseSku?: string;
  onChangeVariantType: (type: VariantType) => void;
  onChangeColors: (colors: ProductColor[]) => void;
  onChangeSizes: (sizes: string[]) => void;
  onChangeCustomAttributes: (attrs: ProductAttribute[]) => void;
  onChangeVariants: (variants: ProductVariant[]) => void;
}

const COLOR_PRESETS: ProductColor[] = [
  { id: 'c-1', name: 'مشکی', hex: '#18181b', active: true, stock: 10 },
  { id: 'c-2', name: 'سفید', hex: '#f8fafc', active: true, stock: 10 },
  { id: 'c-3', name: 'خاکستری', hex: '#64748b', active: true, stock: 10 },
  { id: 'c-4', name: 'سرمه‌ای', hex: '#1e3a8a', active: true, stock: 10 },
  { id: 'c-5', name: 'آبی‌کاربنی', hex: '#2563eb', active: true, stock: 10 },
  { id: 'c-6', name: 'قرمز', hex: '#dc2626', active: true, stock: 10 },
  { id: 'c-7', name: 'سبز یشم', hex: '#15803d', active: true, stock: 10 },
  { id: 'c-8', name: 'طلایی', hex: '#d97706', active: true, stock: 10 },
  { id: 'c-9', name: 'رزگلد', hex: '#f43f5e', active: true, stock: 10 },
  { id: 'c-10', name: 'کرم نود', hex: '#f59e0b', active: true, stock: 10 },
];

const APPAREL_SIZES_PRESET = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const SHOE_SIZES_PRESET = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

export const ProductVariantManager: React.FC<ProductVariantManagerProps> = ({
  variantType,
  colors,
  sizes,
  customAttributes,
  variants,
  basePrice,
  productSku,
  onChangeVariantType,
  onChangeColors,
  onChangeSizes,
  onChangeCustomAttributes,
  onChangeVariants
}) => {
  // New Color Form State
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#4F46E5');
  const [newColorImage, setNewColorImage] = useState('');

  // New Custom Size State
  const [customSizeInput, setCustomSizeInput] = useState('');

  // New Custom Attribute Form State
  const [attrNameInput, setAttrNameInput] = useState('');
  const [attrOptsInput, setAttrOptsInput] = useState('');

  // Bulk Edit State
  const [bulkStockInput, setBulkStockInput] = useState<number | ''>('');
  const [bulkPriceInput, setBulkPriceInput] = useState<number | ''>('');

  // --- Handlers for Colors ---
  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    const newC: ProductColor = {
      id: `c-${Date.now()}`,
      name: newColorName.trim(),
      hex: newColorHex,
      image: newColorImage.trim() || undefined,
      active: true,
      stock: 10
    };
    onChangeColors([...colors, newC]);
    setNewColorName('');
    setNewColorImage('');
  };

  const handleToggleColorPreset = (preset: ProductColor) => {
    const exists = colors.some(c => c.name === preset.name);
    if (exists) {
      onChangeColors(colors.filter(c => c.name !== preset.name));
    } else {
      onChangeColors([...colors, { ...preset, id: `c-${Date.now()}` }]);
    }
  };

  const handleRemoveColor = (id: string) => {
    onChangeColors(colors.filter(c => c.id !== id));
  };

  // --- Handlers for Sizes ---
  const handleToggleSizePreset = (size: string) => {
    if (sizes.includes(size)) {
      onChangeSizes(sizes.filter(s => s !== size));
    } else {
      onChangeSizes([...sizes, size]);
    }
  };

  const handleAddCustomSize = () => {
    if (!customSizeInput.trim()) return;
    const s = customSizeInput.trim().toUpperCase();
    if (!sizes.includes(s)) {
      onChangeSizes([...sizes, s]);
    }
    setCustomSizeInput('');
  };

  // --- Handlers for Custom Attributes ---
  const handleAddCustomAttribute = () => {
    if (!attrNameInput.trim() || !attrOptsInput.trim()) return;
    const opts = attrOptsInput.split(',').map(o => o.trim()).filter(Boolean);
    if (opts.length === 0) return;

    const newAttr: ProductAttribute = {
      id: `attr-${Date.now()}`,
      name: attrNameInput.trim(),
      options: opts
    };
    onChangeCustomAttributes([...customAttributes, newAttr]);
    setAttrNameInput('');
    setAttrOptsInput('');
  };

  const handleRemoveCustomAttribute = (id: string) => {
    onChangeCustomAttributes(customAttributes.filter(a => a.id !== id));
  };

  // --- Bulk Generate Combinations ---
  const handleGenerateCombinations = () => {
    const generated: ProductVariant[] = [];
    const prefixSku = productSku || 'LUM-PROD';

    if (variantType === 'color_only' || (colors.length > 0 && sizes.length === 0)) {
      colors.forEach((c, idx) => {
        generated.push({
          id: `var-${Date.now()}-${idx}`,
          sku: `${prefixSku}-${c.name.slice(0, 3).toUpperCase()}`,
          colorId: c.id,
          colorName: c.name,
          colorHex: c.hex,
          image: c.image,
          stock: c.stock || 10,
          price: basePrice,
          active: true
        });
      });
    } else if (variantType === 'size_only' || (sizes.length > 0 && colors.length === 0)) {
      sizes.forEach((s, idx) => {
        generated.push({
          id: `var-${Date.now()}-${idx}`,
          sku: `${prefixSku}-${s}`,
          size: s,
          stock: 10,
          price: basePrice,
          active: true
        });
      });
    } else if (variantType === 'color_size' || (colors.length > 0 && sizes.length > 0)) {
      let idx = 0;
      colors.forEach(c => {
        sizes.forEach(s => {
          generated.push({
            id: `var-${Date.now()}-${idx++}`,
            sku: `${prefixSku}-${c.name.slice(0, 3).toUpperCase()}-${s}`,
            colorId: c.id,
            colorName: c.name,
            colorHex: c.hex,
            size: s,
            image: c.image,
            stock: 10,
            price: basePrice,
            active: true
          });
        });
      });
    } else if (variantType === 'custom' && customAttributes.length > 0) {
      // Cartesion product generator for custom attributes
      let combinations: Record<string, string>[] = [{}];
      customAttributes.forEach(attr => {
        const nextComb: Record<string, string>[] = [];
        combinations.forEach(comb => {
          attr.options.forEach(opt => {
            nextComb.push({ ...comb, [attr.name]: opt });
          });
        });
        combinations = nextComb;
      });

      combinations.forEach((comb, idx) => {
        const attrSuffix = Object.values(comb).join('-').toUpperCase();
        generated.push({
          id: `var-${Date.now()}-${idx}`,
          sku: `${prefixSku}-${attrSuffix}`,
          attributes: comb,
          stock: 10,
          price: basePrice,
          active: true
        });
      });
    }

    onChangeVariants(generated);
  };

  // --- Handlers for Individual Variant Edit ---
  const handleUpdateVariant = (id: string, updates: Partial<ProductVariant>) => {
    onChangeVariants(variants.map(v => (v.id === id ? { ...v, ...updates } : v)));
  };

  const handleRemoveVariant = (id: string) => {
    onChangeVariants(variants.filter(v => v.id !== id));
  };

  // --- Bulk Edit Apply ---
  const handleApplyBulkStock = () => {
    if (bulkStockInput === '' || bulkStockInput < 0) return;
    onChangeVariants(variants.map(v => ({ ...v, stock: Number(bulkStockInput) })));
    setBulkStockInput('');
  };

  const handleApplyBulkPrice = () => {
    if (bulkPriceInput === '' || bulkPriceInput < 0) return;
    onChangeVariants(variants.map(v => ({ ...v, price: Number(bulkPriceInput) })));
    setBulkPriceInput('');
  };

  return (
    <div className="space-y-6">
      {/* 1. Variant Type Selection Card */}
      <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#62DB00]" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            نوع تنوع محصول (Variant Mode)
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[
            { id: 'none', label: 'بدون تنوع (تک محصول)', desc: 'یک قیمت و یک موجودی' },
            { id: 'color_only', label: 'فقط رنگ‌بندی', desc: 'انتخاب رنگ‌های مختلف' },
            { id: 'size_only', label: 'فقط سایزبندی', desc: 'انتخاب سایزهای مختلف' },
            { id: 'color_size', label: 'ترکیب رنگ + سایز', desc: 'برای پوشاک و کفش' },
            { id: 'custom', label: 'ویژگی سفارشی', desc: 'حافظه، مدل، جنس و...' },
          ].map(item => {
            const isSelected = variantType === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeVariantType(item.id as VariantType)}
                className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#62DB00] text-black border-[#62DB00] shadow-sm font-black ring-2 ring-[#62DB00]/20'
                    : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                }`}
              >
                <div className="font-bold text-xs">{item.label}</div>
                <div className={`text-[10px] mt-1 ${isSelected ? 'text-black/70' : 'text-zinc-400 dark:text-zinc-500'}`}>
                  {item.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Color Management Section */}
      {(variantType === 'color_only' || variantType === 'color_size') && (
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#62DB00]" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                مدیریت رنگ‌های محصول ({colors.length} رنگ)
              </h3>
            </div>
          </div>

          {/* Color Presets */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              انتخاب سریع از میان پالت رنگ‌های پرکاربرد:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_PRESETS.map(p => {
                const isSelected = colors.some(c => c.name === p.name);
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleToggleColorPreset(p)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#62DB00]/15 border-[#62DB00] text-[#62DB00]'
                        : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: p.hex }}
                    />
                    <span>{p.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#62DB00]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Color Input Form */}
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                نام رنگ جدید
              </label>
              <input
                type="text"
                value={newColorName}
                onChange={e => setNewColorName(e.target.value)}
                placeholder="مثلاً: دودی متالیک"
                className="w-full h-9 px-3 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-[#62DB00] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                کد HEX رنگ
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newColorHex}
                  onChange={e => setNewColorHex(e.target.value)}
                  className="w-9 h-9 p-0.5 rounded-lg border border-zinc-300 dark:border-zinc-700 cursor-pointer bg-white"
                />
                <input
                  type="text"
                  value={newColorHex}
                  onChange={e => setNewColorHex(e.target.value)}
                  className="w-full h-9 px-2 text-xs font-mono rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-[#62DB00] outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                لینک تصویر اختصاصی رنگ (اختیاری)
              </label>
              <input
                type="text"
                value={newColorImage}
                onChange={e => setNewColorImage(e.target.value)}
                placeholder="https://..."
                className="w-full h-9 px-3 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-[#62DB00] outline-hidden"
              />
            </div>

            <button
              type="button"
              onClick={handleAddColor}
              className="h-9 px-4 rounded-lg bg-[#62DB00] hover:bg-[#52B800] text-black font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن رنگ</span>
            </button>
          </div>

          {/* Active Colors List */}
          {colors.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-2">
              {colors.map(c => (
                <div
                  key={c.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold"
                >
                  <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: c.hex }} />
                  <span>{c.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(c.id)}
                    className="text-zinc-400 hover:text-rose-500 transition-colors p-0.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Size Management Section */}
      {(variantType === 'size_only' || variantType === 'color_size') && (
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#62DB00]" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              مدیریت سایزبندی محصول ({sizes.length} سایز انتخاب شده)
            </h3>
          </div>

          {/* Apparel Presets */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              سایزهای استاندارد پوشاک:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {APPAREL_SIZES_PRESET.map(size => {
                const isSelected = sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleToggleSizePreset(size)}
                    className={`min-w-10 h-8 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#62DB00] text-black border-[#62DB00] font-black shadow-2xs'
                        : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shoe Presets */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              سایزهای عددی (کفش / تجهیزات):
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {SHOE_SIZES_PRESET.map(size => {
                const isSelected = sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleToggleSizePreset(size)}
                    className={`min-w-10 h-8 px-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#62DB00] text-black border-[#62DB00] font-black shadow-2xs'
                        : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Size Add Input */}
          <div className="flex items-center gap-2 max-w-sm">
            <input
              type="text"
              value={customSizeInput}
              onChange={e => setCustomSizeInput(e.target.value)}
              placeholder="سایز سفارشی (مثلاً: 48 یا Free Size)"
              className="flex-1 h-9 px-3 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-[#62DB00] outline-hidden"
            />
            <button
              type="button"
              onClick={handleAddCustomSize}
              className="h-9 px-3.5 rounded-lg bg-zinc-800 dark:bg-zinc-700 text-white text-xs font-bold hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              افزودن
            </button>
          </div>
        </div>
      )}

      {/* 4. Custom Attributes Management Section */}
      {variantType === 'custom' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#62DB00]" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              تعریف ویژگی‌های سفارشی (مانند: حافظه، جنس، مدل)
            </h3>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                نام ویژگی
              </label>
              <input
                type="text"
                value={attrNameInput}
                onChange={e => setAttrNameInput(e.target.value)}
                placeholder="مثلاً: حافظه داخلی"
                className="w-full h-9 px-3 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-[#62DB00] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                مقادیر (با ویرگول انگلیسی جدا کنید)
              </label>
              <input
                type="text"
                value={attrOptsInput}
                onChange={e => setAttrOptsInput(e.target.value)}
                placeholder="مثلاً: 128GB, 256GB, 512GB"
                className="w-full h-9 px-3 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-[#62DB00] outline-hidden"
              />
            </div>

            <button
              type="button"
              onClick={handleAddCustomAttribute}
              className="h-9 px-4 rounded-lg bg-[#62DB00] hover:bg-[#52B800] text-black font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن ویژگی</span>
            </button>
          </div>

          {/* Active Custom Attributes */}
          {customAttributes.map(attr => (
            <div
              key={attr.id}
              className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-xs text-zinc-900 dark:text-white">{attr.name}:</span>
                <div className="flex items-center gap-1.5 mt-1">
                  {attr.options.map(opt => (
                    <span key={opt} className="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-700 text-[11px] font-bold text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-600">
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveCustomAttribute(attr.id)}
                className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 5. Auto-Generate Combinations Button & Action Bar */}
      {variantType !== 'none' && (
        <div className="p-4 rounded-2xl bg-[#62DB00]/10 border border-[#62DB00]/30 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#62DB00]" />
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                تولید خودکار جدول تنوع‌های محصول (Variants Table)
              </h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                بر اساس رنگ‌ها، سایزها و ویژگی‌های تعریف شده تمام ترکیب‌های ممکن را ایجاد کنید.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerateCombinations}
            className="px-4 py-2.5 rounded-xl bg-[#62DB00] hover:bg-[#52B800] text-black font-black text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>تولید خودکار تمام ترکیب‌ها</span>
          </button>
        </div>
      )}

      {/* 6. Variants Table & Bulk Edit Section */}
      {variants.length > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#62DB00]" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                جدول ترکیب‌های تنوع ({variants.length} مورد)
              </h3>
            </div>

            {/* Bulk Edit Tool */}
            <div className="flex items-center gap-2 flex-wrap bg-zinc-50 dark:bg-zinc-800 p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs">
              <span className="font-bold text-zinc-600 dark:text-zinc-300">ویرایش دسته‌جمعی:</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  placeholder="موجودی"
                  value={bulkStockInput}
                  onChange={e => setBulkStockInput(e.target.value ? Number(e.target.value) : '')}
                  className="w-20 h-7 px-2 text-xs rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900"
                />
                <button
                  type="button"
                  onClick={handleApplyBulkStock}
                  className="h-7 px-2 bg-zinc-800 dark:bg-zinc-700 text-white rounded-md font-bold text-[11px] cursor-pointer"
                >
                  اعمال موجودی
                </button>
              </div>

              <div className="flex items-center gap-1">
                <input
                  type="number"
                  placeholder="قیمت (تومان)"
                  value={bulkPriceInput}
                  onChange={e => setBulkPriceInput(e.target.value ? Number(e.target.value) : '')}
                  className="w-28 h-7 px-2 text-xs rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900"
                />
                <button
                  type="button"
                  onClick={handleApplyBulkPrice}
                  className="h-7 px-2 bg-[#62DB00] hover:bg-[#52B800] text-black font-black rounded-md text-[11px] cursor-pointer"
                >
                  اعمال قیمت
                </button>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-right text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="p-3">رنگ / سایز / ویژگی</th>
                  <th className="p-3">شناسه (SKU)</th>
                  <th className="p-3">موجودی انبار</th>
                  <th className="p-3">قیمت اختصاصی (تومان)</th>
                  <th className="p-3">وضعیت</th>
                  <th className="p-3 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {variants.map(v => (
                  <tr key={v.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                    {/* Attributes Column */}
                    <td className="p-3 font-bold text-zinc-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        {v.colorName && (
                          <span className="flex items-center gap-1">
                            <span className="w-3.5 h-3.5 rounded-full border" style={{ backgroundColor: v.colorHex }} />
                            <span>{v.colorName}</span>
                          </span>
                        )}
                        {v.size && <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">سایز {v.size}</span>}
                        {v.attributes && Object.entries(v.attributes).map(([k, val]) => (
                          <span key={k} className="bg-[#62DB00]/15 text-[#62DB00] border border-[#62DB00]/30 px-2 py-0.5 rounded-md">
                            {k}: {val}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* SKU Column */}
                    <td className="p-3 font-mono text-zinc-500 dark:text-zinc-400">
                      <input
                        type="text"
                        value={v.sku}
                        onChange={e => handleUpdateVariant(v.id, { sku: e.target.value })}
                        className="w-full h-8 px-2 text-xs font-mono rounded border border-transparent hover:border-zinc-300 focus:border-[#62DB00] bg-transparent"
                      />
                    </td>

                    {/* Stock Column */}
                    <td className="p-3">
                      <input
                        type="number"
                        value={v.stock}
                        onChange={e => handleUpdateVariant(v.id, { stock: Number(e.target.value) })}
                        className={`w-20 h-8 px-2 text-xs font-bold rounded border ${
                          v.stock > 0
                            ? 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400'
                            : 'border-rose-300 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                        }`}
                      />
                    </td>

                    {/* Price Override Column */}
                    <td className="p-3">
                      <input
                        type="number"
                        value={v.price ?? basePrice}
                        onChange={e => handleUpdateVariant(v.id, { price: Number(e.target.value) })}
                        className="w-28 h-8 px-2 text-xs font-bold rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                      />
                    </td>

                    {/* Active Toggle Column */}
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => handleUpdateVariant(v.id, { active: !v.active })}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                          v.active
                            ? 'bg-[#62DB00]/20 text-[#62DB00] border border-[#62DB00]/30'
                            : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        {v.active ? 'فعال' : 'غیرفعال'}
                      </button>
                    </td>

                    {/* Actions Column */}
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(v.id)}
                        className="text-zinc-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
