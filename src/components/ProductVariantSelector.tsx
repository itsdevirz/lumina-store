import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Check, AlertCircle, PackageCheck, Ban, Sparkles } from 'lucide-react';
import { Product, ProductVariant, ProductColor, VariantType } from '../types';
import { useStore } from '../context/StoreContext';
import {
  shouldShowVariants,
  isWearableCategory,
  isSizeAvailable,
  isColorAvailable,
  getCombinationStock,
  findMatchingVariant
} from '../utils/variantUtils';

interface ProductVariantSelectorProps {
  product: Product;
  selectedColor: string | null;
  selectedColorHex?: string | null;
  selectedSize: string | null;
  selectedAttributes: Record<string, string>;
  selectedVariant?: ProductVariant | null;
  onSelectColor?: (colorName: string, colorHex: string, colorImage?: string) => void;
  onSelectSize?: (size: string) => void;
  onSelectAttribute?: (attrName: string, value: string) => void;
  onColorChange?: (colorName: string, colorHex: string, colorImage?: string) => void;
  onSizeChange?: (size: string) => void;
  onAttributeChange?: (attrName: string, value: string) => void;
  validationError?: string | null;
}

export const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = (props) => {
  const {
    product,
    selectedColor,
    selectedSize,
    selectedAttributes,
    selectedVariant = null,
    validationError
  } = props;

  const onColorChange = props.onSelectColor || props.onColorChange || (() => {});
  const onSizeChange = props.onSelectSize || props.onSizeChange || (() => {});
  const onAttributeChange = props.onSelectAttribute || props.onAttributeChange || (() => {});

  const { lang, formatPrice } = useStore();

  // Strict conditional rendering:
  // IF product is wearable -> always show color + size selector
  // ELSE -> only show if product has variants defined and variantType !== 'none'
  if (!shouldShowVariants(product)) {
    return null;
  }

  const isWearable = isWearableCategory(
    product.category,
    product.categoryFa,
    product.name,
    product.nameFa
  );

  // Available colors list
  const colorsList: ProductColor[] = useMemo(() => {
    if (product.colors && product.colors.length > 0) {
      return product.colors;
    }
    // Extract unique colors from variants if not explicitly set
    if (product.variants && product.variants.length > 0) {
      const map = new Map<string, ProductColor>();
      product.variants.forEach(v => {
        if (v.colorName && !map.has(v.colorName)) {
          map.set(v.colorName, {
            id: v.colorId || v.colorName,
            name: v.colorName,
            hex: v.colorHex || '#18181b',
            image: v.image
          });
        }
      });
      return Array.from(map.values());
    }
    return [];
  }, [product]);

  // Available sizes list
  const sizesList: string[] = useMemo(() => {
    if (product.sizes && product.sizes.length > 0) {
      return product.sizes;
    }
    if (product.variants && product.variants.length > 0) {
      const set = new Set<string>();
      product.variants.forEach(v => {
        if (v.size) set.add(v.size);
      });
      return Array.from(set);
    }
    return [];
  }, [product]);

  // Determine current active variant or combination
  const activeVariant = useMemo(() => {
    if (selectedVariant) return selectedVariant;
    return findMatchingVariant(product, selectedColor, selectedSize, selectedAttributes);
  }, [product, selectedVariant, selectedColor, selectedSize, selectedAttributes]);

  const combinationStock = useMemo(() => {
    return getCombinationStock(product, selectedColor, selectedSize, selectedAttributes);
  }, [product, selectedColor, selectedSize, selectedAttributes]);

  return (
    <div
      id="product-variant-selector"
      className="space-y-5 p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/90 transition-all shadow-xs"
    >
      {/* 1. Color Swatches Selection */}
      {colorsList.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {lang === 'fa' ? 'انتخاب رنگ:' : 'Select Color:'}
              </span>
              {selectedColor ? (
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-black text-xs border border-indigo-200/60 dark:border-indigo-800/60">
                  {selectedColor}
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                  {lang === 'fa' ? '(لطفاً انتخاب کنید)' : '(Please select)'}
                </span>
              )}
            </div>

            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              {colorsList.length} {lang === 'fa' ? 'رنگ متنوع' : 'colors available'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {colorsList.map(c => {
              const isSelected = selectedColor === c.name;
              // Check stock availability based on cross combination
              const inStock = isColorAvailable(product, c.name, selectedSize);

              return (
                <motion.button
                  key={c.id || c.name}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onColorChange(c.name, c.hex, c.image)}
                  className={`group relative flex items-center gap-2.5 min-h-[44px] px-3.5 py-2 rounded-xl border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-indigo-600 dark:border-indigo-500 shadow-sm ring-2 ring-indigo-500/25'
                      : inStock
                      ? 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      : 'bg-slate-100/70 dark:bg-slate-800/40 border-dashed border-slate-300 dark:border-slate-700 opacity-60'
                  }`}
                  title={`${c.name} ${!inStock ? (lang === 'fa' ? '(ناموجود در این سایز)' : '(Out of stock)') : ''}`}
                >
                  {/* Swatch Circle */}
                  <span
                    className="w-5 h-5 rounded-full border border-black/15 dark:border-white/20 flex items-center justify-center shrink-0 shadow-2xs relative"
                    style={{ backgroundColor: c.hex }}
                  >
                    {isSelected && (
                      <Check
                        className={`w-3.5 h-3.5 stroke-[3.5] ${
                          // Choose contrast checkmark based on hex brightness estimation
                          ['#ffffff', '#fff', 'white', '#f8fafc', '#f1f5f9', '#e2e8f0', '#e2d5c3', '#cbd5e1'].includes(c.hex.toLowerCase())
                            ? 'text-slate-950'
                            : 'text-white'
                        }`}
                      />
                    )}
                    {!inStock && !isSelected && (
                      <span className="w-full h-0.5 bg-rose-500 rotate-45 absolute" />
                    )}
                  </span>

                  {/* Label */}
                  <span
                    className={`text-xs font-bold ${
                      isSelected
                        ? 'text-slate-950 dark:text-white'
                        : inStock
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-slate-400 dark:text-slate-500 line-through'
                    }`}
                  >
                    {c.name}
                  </span>

                  {/* Out of stock strike indicator */}
                  {!inStock && (
                    <span className="text-[10px] text-rose-500 font-bold bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded-md">
                      {lang === 'fa' ? 'ناموجود' : 'Out'}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Size Button Selection */}
      {sizesList.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {lang === 'fa' ? 'انتخاب سایز:' : 'Select Size:'}
              </span>
              {selectedSize ? (
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-black text-xs border border-indigo-200/60 dark:border-indigo-800/60">
                  {lang === 'fa' ? `سایز ${selectedSize}` : `Size ${selectedSize}`}
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                  {lang === 'fa' ? '(لطفاً انتخاب کنید)' : '(Please select)'}
                </span>
              )}
            </div>

            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              {isWearable ? (lang === 'fa' ? 'قواره و سایزبندی استاندارد' : 'Standard Fit') : ''}
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {sizesList.map(size => {
              const isSelected = selectedSize === size;
              const inStock = isSizeAvailable(product, size, selectedColor);

              return (
                <motion.button
                  key={size}
                  type="button"
                  whileTap={inStock ? { scale: 0.95 } : undefined}
                  disabled={!inStock}
                  onClick={() => onSizeChange(size)}
                  className={`min-w-[48px] h-11 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center border relative select-none ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-500/25 cursor-pointer'
                      : !inStock
                      ? 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 border-slate-200/60 dark:border-slate-800/60 line-through cursor-not-allowed opacity-50'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 cursor-pointer'
                  }`}
                  title={
                    !inStock
                      ? lang === 'fa'
                        ? `سایز ${size} در رنگ انتخاب‌شده موجود نیست`
                        : `Size ${size} out of stock`
                      : `سایز ${size}`
                  }
                >
                  {size}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Custom Attributes Selection (for non-clothing products like Memory, Capacity, etc.) */}
      {product.customAttributes && product.customAttributes.length > 0 && (
        <div className="space-y-4 pt-1">
          {product.customAttributes.map(attr => (
            <div key={attr.id || attr.name} className="space-y-2">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span>{attr.name}:</span>
                {selectedAttributes[attr.name] && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-black text-xs border border-indigo-200/60 dark:border-indigo-800/60">
                    {selectedAttributes[attr.name]}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {attr.options.map(opt => {
                  const isSelected = selectedAttributes[attr.name] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onAttributeChange(attr.name, opt)}
                      className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border select-none ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Selected Variant Live Status Feedback */}
      {(selectedColor || selectedSize || activeVariant) && (
        <motion.div
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 flex items-center justify-between flex-wrap gap-2 text-xs shadow-2xs"
        >
          <div className="flex items-center gap-2 min-w-0">
            {combinationStock > 0 ? (
              <PackageCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <Ban className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            )}

            <div className="flex items-center gap-1.5 flex-wrap font-bold text-slate-900 dark:text-white truncate">
              {selectedColor && <span>رنگ {selectedColor}</span>}
              {selectedColor && selectedSize && <span>•</span>}
              {selectedSize && <span>سایز {selectedSize}</span>}
              {activeVariant?.sku && (
                <span className="text-[10.5px] font-mono text-slate-400 dark:text-slate-500 font-normal">
                  (SKU: {activeVariant.sku})
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {combinationStock > 0 ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200/60 dark:border-emerald-900/40 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {lang === 'fa'
                    ? `موجود در انبار (${combinationStock} عدد)`
                    : `In Stock (${combinationStock})`}
                </span>
              </span>
            ) : (
              <span className="text-rose-700 dark:text-rose-300 font-bold bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-200/60 dark:border-rose-900/40 text-[11px]">
                {lang === 'fa' ? 'ناموجود در انبار' : 'Out of Stock'}
              </span>
            )}

            {/* Price override if different */}
            {activeVariant?.price && activeVariant.price !== product.price && (
              <span className="font-black text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm tabular-nums">
                {formatPrice(activeVariant.price)}
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* 5. Validation Warning Message */}
      {validationError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-bold"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{validationError}</span>
        </motion.div>
      )}
    </div>
  );
};
