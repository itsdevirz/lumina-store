<?php
/**
 * Template Name: دسته‌بندی‌های محصولات (Categories Catalog)
 *
 * @package Lumina
 */

get_header();

$categories = lumina_get_categories();
$active_cat = isset($_GET['cat']) ? sanitize_text_field($_GET['cat']) : 'all';

// Fetch products based on active category
$default_prods = lumina_get_default_products();
$filtered = $default_prods;

if ($active_cat !== 'all') {
    $filtered = array_values(array_filter($default_prods, function($p) use ($active_cat) {
        return $p['category'] === $active_cat;
    }));
}
?>

<div class="lumina-container" style="padding-top: 16px; padding-bottom: 40px;">
    
    <!-- 1. Header (Compact & Crisp) -->
    <div style="display: flex; flex-direction: column; gap: 4px; padding-bottom: 14px; border-bottom: 1px solid var(--border-color); margin-bottom: 16px;">
        <div style="display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: #10B981;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            <span>دسته‌بندی‌ها و کالکشن‌های اختصاصی</span>
        </div>
        <h1 style="font-size: 1.5rem; font-weight: 900; color: var(--text-main); margin: 0;">دسته‌بندی‌های محصولات لومینا</h1>
    </div>

    <!-- 2. Compact Real Photo Thumbnails Category Selector -->
    <div class="lumina-categories-wrap" style="padding-top: 0;">
        <div class="lumina-cat-scroll">
            <?php foreach ($categories as $c): ?>
                <?php $is_active = ($active_cat === $c['id']); ?>
                <a href="<?php echo esc_url(add_query_arg('cat', $c['id'], home_url('/categories/'))); ?>" class="cat-item-btn <?php echo $is_active ? 'active' : ''; ?>">
                    <div class="cat-thumb-box">
                        <img src="<?php echo esc_url($c['image']); ?>" alt="<?php echo esc_attr($c['nameFa']); ?>" loading="lazy">
                    </div>
                    <span class="cat-name"><?php echo esc_html($c['nameFa']); ?></span>
                    <span class="cat-count"><?php echo esc_html(lumina_to_persian_num($c['count'])); ?> کالا</span>
                </a>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- 3. Search & Filter Bar -->
    <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 16px; padding: 14px; margin-bottom: 20px; box-shadow: var(--shadow-sm);">
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <input type="text" id="cat-live-filter" placeholder="فیلتر آنی در نام کالا یا برند..." style="flex: 1; min-width: 200px; height: 38px; border-radius: 10px; border: 1px solid var(--border-color); padding: 0 14px; background: var(--bg-surface); color: var(--text-main); font-size: 12px; outline: none;">
                
                <select style="height: 38px; border-radius: 10px; border: 1px solid var(--border-color); padding: 0 12px; background: var(--bg-surface); color: var(--text-main); font-size: 12px; font-weight: 700; outline: none; cursor: pointer;">
                    <option value="popular">مرتب‌سازی: پرفروش‌ترین‌ها</option>
                    <option value="newest">جدیدترین محصولات</option>
                    <option value="price-asc">ارزان‌ترین به گران‌ترین</option>
                    <option value="price-desc">گران‌ترین به ارزان‌ترین</option>
                </select>
            </div>
        </div>
    </div>

    <!-- 4. Products Catalog Grid -->
    <div id="lumina-products-catalog-grid" class="lumina-products-grid" data-category="<?php echo esc_attr($active_cat); ?>">
        <?php
        if (!empty($filtered)) {
            // Render first page items
            $first_chunk = array_slice($filtered, 0, 4);
            foreach ($first_chunk as $p) {
                set_query_var('lumina_mock_product', $p);
                get_template_part('template-parts/content-product-card');
            }
        }
        ?>
    </div>

    <!-- 5. Infinite Scroll Sentinel & Small Loading Indicator -->
    <div id="lumina-infinite-sentinel" class="lumina-infinite-loader">
        <div id="lumina-loading-indicator" class="infinite-loading-pill" style="display: none;">
            <div class="spin-loader"></div>
            <span><?php esc_html_e('درحال بارگذاری...', 'lumina'); ?></span>
            <span class="pulse-indicator"></span>
        </div>
        <div id="lumina-end-notice" style="display: none; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); font-weight: 600;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span>تمامی کالاهای این بخش بارگذاری شدند</span>
        </div>
    </div>

</div>

<?php
get_footer();
