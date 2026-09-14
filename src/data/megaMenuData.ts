import { Product } from '../types';
import { CATEGORIES, PRODUCTS } from './products';

export interface MegaMenuSubItem {
  label: string;
  type: 'product' | 'brand' | 'filter' | 'feature';
  productId?: string;
  brand?: string;
  badge?: string;
}

export interface MegaMenuSubColumn {
  title: string;
  items: MegaMenuSubItem[];
}

export interface MegaMenuItem {
  id: string;
  nameFa: string;
  nameEn: string;
  iconName: string;
  allProductsLabelFa: string;
  productCount: number;
  columns: MegaMenuSubColumn[];
}

// Category-specific real technical specs & highlights directly based on real products in the catalog
const CATEGORY_REAL_SPECS: Record<string, string[]> = {
  audio: [
    'حذف نویز فعال هیبریدی (ANC)',
    'صدای فراگیر سه‌بعدی Spatial Audio',
    'درایورهای ۴۵ میلی‌متری تیتانیوم',
    'شارژدهی ۴۰ ساعته مداوم',
    'کیس شارژ وایرلس استاندارد Qi',
    'کدک‌های صوتی Hi-Res و LDAC'
  ],
  workspace: [
    'سوئیچ مکانیکال Hot-Swap سایلنت',
    'ساختار گسکت مانت با فوم صداگیر',
    'اسکرول الکترومغناطیسی MagSpeed',
    'سنسور اپتیکال لیزری ۸۰۰۰ DPI',
    'کلیدهای دابل شات PBT ضدسایش',
    'شارژدهی باتری تا ۷۰ روز'
  ],
  'smart-wear': [
    'شیشه ضدخش یاقوت کبود (Sapphire)',
    'فریم تیتانیوم گرید هوافضا',
    'سنسورهای نوار قلب ECG و SpO2',
    'مقاومت غواصی 5ATM ضدآب',
    'نمایشگر Always-On Retina AMOLED',
    'عمر باتری ۱۴ روزه با شارژ وایرلس'
  ],
  lifestyle: [
    'چرم طبیعی گاوی با دباغی گیاهی',
    'زیپ‌های برنجی ژاپنی YKK Excella',
    'محفظه ضربه‌گیر لپ‌تاپ ۱۶ اینچی',
    'محفظه تهویه‌دار مجزا برای کفش',
    'گنجایش ۳۲ لیتر برای سفر ۳ تا ۵ روز',
    'ضمانت مادام‌العمر دوخت و یراق‌آلات'
  ],
  coffee: [
    'سرامیک مات نسوز ۱۳۰۰ درجه',
    'دریپر مخروطی با زاویه ۶۰ درجه',
    'سرور شیشه‌ای مقاوم به شوک پیرکس',
    'پایه نگهدارنده چوب گردوی طبیعی',
    'بسته ۱۰۰ عددی فیلتر کاغذی ژاپنی',
    'گنجایش ۶۰۰ میلی‌لیتر (۲ الی ۴ فنجان)'
  ],
  'home-design': [
    'چوب گردوی سالید آمریکای شمالی',
    'نورپردازی گرم ۲۷۰۰K بدون لرزش چشم',
    'دیمر لمسی با حافظه شدت روشنایی',
    'شاخص تفکیک رنگ بسیار بالا CRI 95+',
    'کم‌مصرف با برچسب انرژی A+++',
    'کابل ۱.۸ متری با روکش بافته‌شده کنفی'
  ]
};

// Dynamic Mega Menu builder completely powered by actual products in the store
export function buildMegaMenuItems(productsList: Product[] = PRODUCTS): MegaMenuItem[] {
  return CATEGORIES.map(cat => {
    const catProducts = productsList.filter(p => p.category === cat.id);
    const brands = Array.from(new Set(catProducts.map(p => p.brand).filter(Boolean)));
    const hasFlashSale = catProducts.some(p => p.isFlashSale || (p.discountPercent && p.discountPercent > 0));

    // Column 1: Real Products in this category
    const productsColumn: MegaMenuSubColumn = {
      title: `محصولات برگزیده (${catProducts.length} کالا)`,
      items: catProducts.map(p => ({
        label: p.nameFa,
        type: 'product',
        productId: p.id,
        badge: p.discountPercent ? `${p.discountPercent}٪ تخفیف` : undefined
      }))
    };

    // Column 2: Real Brands in this category
    const brandsColumn: MegaMenuSubColumn = {
      title: 'برندهای موجود در لومینا',
      items: brands.map(b => ({
        label: b,
        type: 'brand',
        brand: b
      }))
    };

    // Column 3: Real Technical Features & Specs
    const realSpecs = CATEGORY_REAL_SPECS[cat.id] || [];
    const specsColumn: MegaMenuSubColumn = {
      title: 'ویژگی‌ها و قابلیت‌های فنی',
      items: realSpecs.map(spec => ({
        label: spec,
        type: 'feature'
      }))
    };

    // Column 4: Quick Filters & Collections
    const filterItems: MegaMenuSubItem[] = [];

    if (hasFlashSale) {
      filterItems.push({
        label: 'پیشنهادهای شگفت‌انگیز لومینا',
        type: 'filter'
      });
    }

    filterItems.push({
      label: 'کالاهای موجود و آماده ارسال فوری',
      type: 'filter'
    });

    filterItems.push({
      label: 'پرفروش‌ترین‌های این دسته',
      type: 'filter'
    });

    // Price brackets specific to actual product prices
    if (cat.id === 'audio') {
      filterItems.push({ label: 'کالاهای زیر ۱۰ میلیون تومان', type: 'filter' });
      filterItems.push({ label: 'کالاهای بالای ۱۰ میلیون تومان', type: 'filter' });
    } else if (cat.id === 'workspace') {
      filterItems.push({ label: 'کالاهای زیر ۶ میلیون تومان', type: 'filter' });
      filterItems.push({ label: 'کالاهای بالای ۶ میلیون تومان', type: 'filter' });
    } else if (cat.id === 'smart-wear') {
      filterItems.push({ label: 'ساعت‌های لوکس بالای ۱۵ میلیون تومان', type: 'filter' });
    } else if (cat.id === 'lifestyle') {
      filterItems.push({ label: 'محصولات دست‌ساز بالای ۱۵ میلیون تومان', type: 'filter' });
    } else if (cat.id === 'coffee') {
      filterItems.push({ label: 'تجهیزات دم‌آوری زیر ۵ میلیون تومان', type: 'filter' });
    } else if (cat.id === 'home-design') {
      filterItems.push({ label: 'دکوراسیون زیر ۱۰ میلیون تومان', type: 'filter' });
    }

    const filtersColumn: MegaMenuSubColumn = {
      title: 'دسترسی سریع و فیلترها',
      items: filterItems
    };

    return {
      id: cat.id,
      nameFa: cat.nameFa,
      nameEn: cat.name,
      iconName: cat.icon,
      allProductsLabelFa: `مشاهده همه محصولات ${cat.nameFa}`,
      productCount: catProducts.length,
      columns: [productsColumn, brandsColumn, specsColumn, filtersColumn]
    };
  });
}

// Pre-built default for components needing static fallback
export const MEGA_MENU_ITEMS: MegaMenuItem[] = buildMegaMenuItems(PRODUCTS);
