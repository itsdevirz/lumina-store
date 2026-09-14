import { Product, ProductVariant, ProductColor } from '../types';

/**
 * Checks whether a product belongs to a wearable or apparel category
 */
export const isWearableCategory = (category?: string, categoryFa?: string, name?: string, nameFa?: string): boolean => {
  const c = (category || '').toLowerCase();
  const cFa = (categoryFa || '');
  const n = (name || '').toLowerCase();
  const nFa = (nameFa || '');

  const wearableKeywords = [
    'apparel',
    'clothing',
    'wearable',
    'wearables',
    'fashion',
    'clothes',
    'shoes',
    'shirt',
    'pants',
    'hoodie',
    'jacket',
    'tshirt',
    'tee'
  ];

  const faWearableKeywords = [
    'پوشاک',
    'لباس',
    'مد',
    'تیشرت',
    'تی‌شرت',
    'شلوار',
    'هودی',
    'کفش',
    'پیراهن',
    'کت',
    'کاپشن',
    'پوشیدنی'
  ];

  const matchesEn = wearableKeywords.some(kw => c.includes(kw) || n.includes(kw));
  const matchesFa = faWearableKeywords.some(kw => cFa.includes(kw) || nFa.includes(kw));

  return matchesEn || matchesFa;
};

/**
 * Determines whether the variant selector (Color / Size / Custom) must be displayed.
 * Rule:
 * - IF product is wearable/clothing -> ALWAYS display Color + Size selection.
 * - IF product is other (mobile, laptop, coffee, home...) -> ONLY display if it has variants defined and variantType !== 'none'.
 */
export const shouldShowVariants = (product?: Product | null): boolean => {
  if (!product) return false;

  // 1. Wearable products always show variant selector
  if (isWearableCategory(product.category, product.categoryFa, product.name, product.nameFa)) {
    return true;
  }

  // 2. Non-wearable products: only show if variants are actively configured
  const hasConfiguredVariants = Boolean(
    (product.variants && product.variants.length > 0) ||
    (product.colors && product.colors.length > 0) ||
    (product.sizes && product.sizes.length > 0) ||
    (product.customAttributes && product.customAttributes.length > 0)
  );

  const hasActiveVariantType = product.variantType && product.variantType !== 'none';

  return Boolean(hasConfiguredVariants && hasActiveVariantType);
};

/**
 * Finds the specific variant matching color, size, and custom attributes.
 */
export const findMatchingVariant = (
  product: Product,
  colorName?: string | null,
  size?: string | null,
  attributes?: Record<string, string>
): ProductVariant | null => {
  if (!product.variants || product.variants.length === 0) return null;

  return product.variants.find(v => {
    if (!v.active) return false;
    if (colorName && v.colorName && v.colorName !== colorName) return false;
    if (size && v.size && v.size !== size) return false;
    if (attributes && v.attributes) {
      for (const [k, val] of Object.entries(attributes)) {
        if (v.attributes[k] !== val) return false;
      }
    }
    return true;
  }) || null;
};

/**
 * Calculates stock for a specific combination of color + size + attributes.
 */
export const getCombinationStock = (
  product: Product,
  colorName?: string | null,
  size?: string | null,
  attributes?: Record<string, string>
): number => {
  if (!product.variants || product.variants.length === 0) {
    return product.stock ?? 0;
  }

  // Exact match search
  const exact = findMatchingVariant(product, colorName, size, attributes);
  if (exact) {
    return exact.stock;
  }

  // If only color is passed, sum stock of active variants with this color
  if (colorName && !size) {
    const colorVars = product.variants.filter(v => v.active && v.colorName === colorName);
    if (colorVars.length > 0) {
      return colorVars.reduce((sum, v) => sum + v.stock, 0);
    }
  }

  // If only size is passed, sum stock of active variants with this size
  if (size && !colorName) {
    const sizeVars = product.variants.filter(v => v.active && v.size === size);
    if (sizeVars.length > 0) {
      return sizeVars.reduce((sum, v) => sum + v.stock, 0);
    }
  }

  return 0;
};

/**
 * Checks if a specific size is in stock for the currently selected color.
 */
export const isSizeAvailable = (
  product: Product,
  size: string,
  selectedColor?: string | null
): boolean => {
  if (!product.variants || product.variants.length === 0) {
    return (product.stock ?? 0) > 0;
  }

  if (selectedColor) {
    const matched = product.variants.find(
      v => v.active && v.colorName === selectedColor && v.size === size
    );
    return matched ? matched.stock > 0 : false;
  }

  // If no color selected yet, check if ANY active variant with this size has stock
  return product.variants.some(v => v.active && v.size === size && v.stock > 0);
};

/**
 * Checks if a specific color is in stock for the currently selected size.
 */
export const isColorAvailable = (
  product: Product,
  colorName: string,
  selectedSize?: string | null
): boolean => {
  if (!product.variants || product.variants.length === 0) {
    return (product.stock ?? 0) > 0;
  }

  if (selectedSize) {
    const matched = product.variants.find(
      v => v.active && v.colorName === colorName && v.size === selectedSize
    );
    return matched ? matched.stock > 0 : false;
  }

  // If no size selected yet, check if ANY active variant with this color has stock
  return product.variants.some(v => v.active && v.colorName === colorName && v.stock > 0);
};
