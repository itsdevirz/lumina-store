<?php
/**
 * Lumina Theme - Helpers & Utilities
 *
 * @package Lumina
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Convert Latin numerals to Persian numerals
 *
 * @param mixed $string
 * @return string
 */
function lumina_to_persian_num($string) {
    $latin = array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
    $persian = array('۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹');
    return str_replace($latin, $persian, (string)$string);
}

/**
 * Format price in Iranian Tomans
 *
 * @param int|float $price_in_rials
 * @param bool $show_currency
 * @return string
 */
function lumina_format_price($price_in_rials, $show_currency = true) {
    if (empty($price_in_rials)) {
        return '۰' . ($show_currency ? ' تومان' : '');
    }
    // Convert Rials to Tomans
    $tomans = floor($price_in_rials / 10);
    $formatted = number_format($tomans, 0, '.', ',');
    $persian_formatted = lumina_to_persian_num($formatted);
    return $persian_formatted . ($show_currency ? ' تومان' : '');
}

/**
 * Helper to get asset URL inside the theme
 *
 * @param string $path
 * @return string
 */
function lumina_asset($path) {
    $clean_path = ltrim($path, '/');
    return get_template_directory_uri() . '/assets/' . $clean_path;
}

/**
 * Get Theme Option with Default Fallback
 *
 * @param string $key
 * @param mixed $default
 * @return mixed
 */
function lumina_get_option($key, $default = '') {
    $options = get_option('lumina_theme_options', array());
    return isset($options[$key]) && $options[$key] !== '' ? $options[$key] : $default;
}

/**
 * Get In-Memory Default Demo Products (Fallback if WooCommerce is empty)
 *
 * @return array
 */
function lumina_get_default_products() {
    $base_img = get_template_directory_uri() . '/assets/images/products/';

    return array(
        array(
            'id' => 'lum-01',
            'name' => 'هدفون بی‌سیم نویزکنسلینگ لومینا هورایزن پرو',
            'brand' => 'Lumina Sound',
            'category' => 'audio',
            'categoryFa' => 'سیستم‌های صوتی و هدفون',
            'rating' => 4.9,
            'reviewsCount' => 142,
            'price' => 14800000,
            'originalPrice' => 18500000,
            'discountPercent' => 20,
            'stock' => 7,
            'soldCount' => 43,
            'featured' => true,
            'rank' => 1,
            'image' => $base_img . 'photo-1505740420928-5e560c06d30e.jpg',
            'descriptionFa' => 'حذف نویز هوشمند و تطبیقی با درایورهای اختصاصی ۴۵ میلی‌متری تیتانیوم، شارژدهی خیره‌کننده ۴۰ ساعته با بدنه آلومینیوم برس‌خورده و پدهای ارگونومیک مموری فوم.',
            'specs' => array(
                'نوع اتصال' => 'Bluetooth 5.3 + جک ۳.۵ میلی‌متری',
                'شارژدهی' => '۴۰ ساعت با ANC فعال',
                'وزن' => '۲۵۲ گرم',
                'گارانتی' => '۱۸ ماه گارانتی طلایی لومینا'
            )
        ),
        array(
            'id' => 'lum-02',
            'name' => 'کیبورد مکانیکال بی‌سیم کانسو مینیمال ۷۵٪',
            'brand' => 'Kanso Studio',
            'category' => 'workspace',
            'categoryFa' => 'تجهیزات مدرن میز کار',
            'rating' => 4.8,
            'reviewsCount' => 98,
            'price' => 8900000,
            'originalPrice' => 10500000,
            'discountPercent' => 15,
            'stock' => 12,
            'soldCount' => 38,
            'featured' => true,
            'rank' => 2,
            'image' => $base_img . 'photo-1527864550417-7fd91fc51a46.jpg',
            'descriptionFa' => 'شاسی یکپارچه آلومینیومی CNC با سوییچ‌های روان روغن‌کاری شده کارخانه‌ای و فوم جذب صدای ۳ لایه.',
            'specs' => array(
                'سوییچ‌ها' => 'Gateron Oil King سفارشی',
                'قابلیت اتصال' => 'بلوتوث ۵.۲ + دانگل 2.4GHz + تایپ سی',
                'نورپردازی' => 'RGB با نرم‌افزار اختصاصی'
            )
        ),
        array(
            'id' => 'lum-03',
            'name' => 'ساعت هوشمند لومینا کرونو واچ اولترا تیتانیوم',
            'brand' => 'Lumina Tech',
            'category' => 'smart-wear',
            'categoryFa' => 'گجت‌های هوشمند و پوشیدنی',
            'rating' => 4.9,
            'reviewsCount' => 112,
            'price' => 21500000,
            'originalPrice' => 25000000,
            'discountPercent' => 14,
            'stock' => 5,
            'soldCount' => 29,
            'featured' => true,
            'rank' => 3,
            'image' => $base_img . 'photo-1523275335684-37898b6baf30.jpg',
            'descriptionFa' => 'صفحه‌نمایش امولد ۳۰۰۰ نیتی زیر نور آفتاب، شاسی تیتانیوم گرید ۵ هوانوردی و پایش سلامت پیشرفته قلب و اکسیژن خون.',
            'specs' => array(
                'عمر باتری' => '۷ روز استفاده مداوم',
                'مقاومت در برابر آب' => '100 متر غواصی',
                'سنسورها' => 'ECG, SpO2, شتاب‌سنج و دماسنج بدن'
            )
        ),
        array(
            'id' => 'lum-04',
            'name' => 'پد ماوس ارگونومیک و چرم طبیعی نوردیک',
            'brand' => 'Nordic Goods',
            'category' => 'workspace',
            'categoryFa' => 'تجهیزات مدرن میز کار',
            'rating' => 4.7,
            'reviewsCount' => 64,
            'price' => 2400000,
            'originalPrice' => 2900000,
            'discountPercent' => 17,
            'stock' => 20,
            'soldCount' => 55,
            'featured' => false,
            'rank' => 4,
            'image' => $base_img . 'photo-1548036328-c9fa89d128fa.jpg',
            'descriptionFa' => 'چرم گاوی دباغی شده گیاهی ایتالیایی با لایه زیرین چوب‌پنبه طبیعی ضدلغزش و دوخت دور تمام دست‌دوز.',
            'specs' => array(
                'ابعاد' => '۹۰ × ۴۵ سانتی‌متر',
                'جنس' => 'چرم طبیعی با پوشش آبگریز',
                'رنگ‌بندی' => 'قهوه‌ای عسلی، مشکی ابسیدین'
            )
        ),
        array(
            'id' => 'lum-05',
            'name' => 'تیشرت پنبه ارگانیک مینیمال اورسایز',
            'brand' => 'Kanso Studio',
            'category' => 'apparel',
            'categoryFa' => 'پوشاک و لایف‌استایل',
            'rating' => 4.8,
            'reviewsCount' => 76,
            'price' => 1450000,
            'originalPrice' => 1750000,
            'discountPercent' => 17,
            'stock' => 30,
            'soldCount' => 84,
            'featured' => false,
            'rank' => 5,
            'image' => $base_img . 'photo-1521572267360-ee0c2909d518.jpg',
            'descriptionFa' => 'پارچه ۱۰۰٪ کتان سوپیما سنگین ۲۸۰ گرمی با دوخت دولایه و فیت آزاد مینیمال ژاپنی.',
            'specs' => array(
                'جنس' => '۱۰۰٪ پنبه ارگانیک سوپیما',
                'برش' => 'اورسایز کژوال',
                'سایزبندی' => 'S, M, L, XL'
            )
        ),
        array(
            'id' => 'lum-06',
            'name' => 'کوله‌پشتی شهری مسافرتی اولترالایت ضدآب',
            'brand' => 'Orbit Labs',
            'category' => 'lifestyle',
            'categoryFa' => 'کیف و اکسسوری سفر',
            'rating' => 4.9,
            'reviewsCount' => 88,
            'price' => 6200000,
            'originalPrice' => 7500000,
            'discountPercent' => 17,
            'stock' => 14,
            'soldCount' => 46,
            'featured' => true,
            'rank' => 6,
            'image' => $base_img . 'photo-1553062407-98eeb64c6a62.jpg',
            'descriptionFa' => 'پارچه کوردورا ۱۰۰۰D ضدپارگی با زیپ‌های آب‌بندی شده YKK، محفظه پددار لپ‌تاپ ۱۶ اینچی و ارگونومی بندهای طبی.',
            'specs' => array(
                'حجم' => '۲۶ لیتر با قابلیت افزایش',
                'وزن' => '۸۵۰ گرم',
                'محفظه لپ‌تاپ' => 'تا ۱۶ اینچ مک‌بوک پرو'
            )
        ),
        array(
            'id' => 'lum-07',
            'name' => 'کتری برقی هوشمند باریستا ارگونومیک لومینا',
            'brand' => 'Lumina Coffee',
            'category' => 'coffee',
            'categoryFa' => 'قهوه و بار سرد و گرم',
            'rating' => 4.9,
            'reviewsCount' => 53,
            'price' => 7800000,
            'originalPrice' => 8900000,
            'discountPercent' => 12,
            'stock' => 8,
            'soldCount' => 31,
            'featured' => false,
            'rank' => 7,
            'image' => $base_img . 'photo-1514432324607-a09d9b4aefdd.jpg',
            'descriptionFa' => 'گردن غازی مهندسی‌شده برای جریان خروجی آب دقیق، کنترل دمای دیجیتال با دقت ۱ درجه و بدنه استیل مات ضدزنگ.',
            'specs' => array(
                'توان المنت' => '۱۲۰۰ وات جوش سریع',
                'گنجایش' => '۹۰۰ میلی‌لیتر',
                'قابلیت ویژه' => 'نگهداری دما تا ۶۰ دقیقه'
            )
        ),
        array(
            'id' => 'lum-08',
            'name' => 'چراغ رومیزی هوشمند امبینت مینیمال بتنی',
            'brand' => 'Nordic Goods',
            'category' => 'home-design',
            'categoryFa' => 'دکوراسیون و نورپردازی',
            'rating' => 4.8,
            'reviewsCount' => 42,
            'price' => 3900000,
            'originalPrice' => 4500000,
            'discountPercent' => 13,
            'stock' => 11,
            'soldCount' => 24,
            'featured' => false,
            'rank' => 8,
            'image' => $base_img . 'photo-1507473885765-e6ed057f782c.jpg',
            'descriptionFa' => 'پایه بتن اکسپوز ریخته‌گری شده با دست، لامپ ادیسونی دیمردار با کلید لمسی برنجی و نور گرم کهربایی ۲۲۰۰ کلوین.',
            'specs' => array(
                'ولتاژ' => '۲۲۰ ولت مستقیم',
                'نوع سرپیچ' => 'E27 استاندارد',
                'تنظیم نور' => 'دیمر لمسی ۳ سطحی'
            )
        )
    );
}

/**
 * Get Categories List with Real Photos & Count
 *
 * @return array
 */
function lumina_get_categories() {
    $base_img = get_template_directory_uri() . '/assets/images/products/';

    return array(
        array(
            'id' => 'all',
            'name' => 'All Categories',
            'nameFa' => 'همه دسته‌ها',
            'image' => $base_img . 'photo-1505740420928-5e560c06d30e.jpg',
            'count' => 8
        ),
        array(
            'id' => 'audio',
            'name' => 'Audio',
            'nameFa' => 'تجهیزات صوتی',
            'image' => $base_img . 'photo-1505740420928-5e560c06d30e.jpg',
            'count' => 2
        ),
        array(
            'id' => 'workspace',
            'name' => 'Workspace',
            'nameFa' => 'میز کار و اداری',
            'image' => $base_img . 'photo-1527864550417-7fd91fc51a46.jpg',
            'count' => 2
        ),
        array(
            'id' => 'smart-wear',
            'name' => 'Smart Gadgets',
            'nameFa' => 'گجت هوشمند',
            'image' => $base_img . 'photo-1523275335684-37898b6baf30.jpg',
            'count' => 1
        ),
        array(
            'id' => 'apparel',
            'name' => 'Apparel & Fashion',
            'nameFa' => 'پوشاک و مد',
            'image' => $base_img . 'photo-1521572267360-ee0c2909d518.jpg',
            'count' => 1
        ),
        array(
            'id' => 'lifestyle',
            'name' => 'Lifestyle',
            'nameFa' => 'لوازم روزمره',
            'image' => $base_img . 'photo-1553062407-98eeb64c6a62.jpg',
            'count' => 1
        ),
        array(
            'id' => 'coffee',
            'name' => 'Coffee',
            'nameFa' => 'قهوه و کافه',
            'image' => $base_img . 'photo-1514432324607-a09d9b4aefdd.jpg',
            'count' => 1
        ),
        array(
            'id' => 'home-design',
            'name' => 'Home Decor',
            'nameFa' => 'دکوراسیون',
            'image' => $base_img . 'photo-1507473885765-e6ed057f782c.jpg',
            'count' => 1
        )
    );
}
