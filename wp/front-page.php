<?php
/**
 * Lumina Theme - Front Page Template
 *
 * @package Lumina
 */

get_header();

// 1. Hero Showcase Full-Width Card
get_template_part('template-parts/hero-showcase');

// Prepare Products Query (WooCommerce or Default Demo)
$featured_products = array();
if (lumina_is_woocommerce_active()) {
    $wc_query = new WP_Query(array(
        'post_type'      => 'product',
        'posts_per_page' => 4,
        'tax_query'      => array(
            array(
                'taxonomy' => 'product_visibility',
                'field'    => 'name',
                'terms'    => 'featured',
            ),
        ),
    ));
    if ($wc_query->have_posts()) {
        $featured_products = $wc_query;
    }
}
$default_prods = lumina_get_default_products();
?>

<!-- 2. Featured Products Section -->
<section class="lumina-container" style="padding-top: 24px; padding-bottom: 24px;">
    <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
        <div>
            <div style="display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: #10B981; margin-bottom: 4px;">
                <span class="pulse-indicator"></span>
                <span>پیشنهادات برگزیده لومینا</span>
            </div>
            <h2 style="font-size: 1.35rem; font-weight: 900; color: var(--text-main);">سخت‌افزارهای منتخب استودیو</h2>
        </div>
        <a href="<?php echo esc_url(home_url('/categories/')); ?>" style="font-size: 12px; font-weight: 700; color: #10B981; display: flex; align-items: center; gap: 4px;">
            <span>مشاهده همه محصولات</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </a>
    </div>

    <div class="lumina-products-grid">
        <?php
        if (!empty($featured_products) && $featured_products->have_posts()) {
            while ($featured_products->have_posts()) {
                $featured_products->the_post();
                get_template_part('template-parts/content-product-card');
            }
            wp_reset_postdata();
        } else {
            // Render first 4 default products
            for ($i = 0; $i < 4; $i++) {
                if (isset($default_prods[$i])) {
                    set_query_var('lumina_mock_product', $default_prods[$i]);
                    get_template_part('template-parts/content-product-card');
                }
            }
        }
        ?>
    </div>
</section>

<!-- 3. Promotional 2-Column Banners -->
<?php get_template_part('template-parts/promotional-banners'); ?>

<!-- 4. New Arrivals Section -->
<section class="lumina-container" style="padding-top: 24px; padding-bottom: 32px;">
    <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
        <div>
            <div style="display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: #0EA5E9; margin-bottom: 4px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                <span>جدیدترین دستاوردهای تکنولوژی</span>
            </div>
            <h2 style="font-size: 1.35rem; font-weight: 900; color: var(--text-main);">تازه‌ترین ادوات کار و زندگی</h2>
        </div>
        <a href="<?php echo esc_url(home_url('/categories/')); ?>" style="font-size: 12px; font-weight: 700; color: #0EA5E9; display: flex; align-items: center; gap: 4px;">
            <span>کاتالوگ کامل</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </a>
    </div>

    <div class="lumina-products-grid">
        <?php
        // Render next 4 products (index 4 to 7)
        for ($i = 4; $i < 8; $i++) {
            if (isset($default_prods[$i])) {
                set_query_var('lumina_mock_product', $default_prods[$i]);
                get_template_part('template-parts/content-product-card');
            }
        }
        ?>
    </div>
</section>

<!-- 5. Trust Badges & Guarantee -->
<?php get_template_part('template-parts/trust-badges'); ?>

<!-- 6. Blog & Guides Section -->
<section class="lumina-container" style="padding-top: 36px; padding-bottom: 48px;">
    <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px;">
        <div>
            <span style="font-size: 11px; font-weight: 700; color: #10B981;">مجله و وبلاگ تخصصی</span>
            <h2 style="font-size: 1.35rem; font-weight: 900; color: var(--text-main); margin-top: 2px;">راهنماهای ستاپ، صدا و ارگونومی</h2>
        </div>
        <a href="<?php echo esc_url(home_url('/blog/')); ?>" style="font-size: 12px; font-weight: 700; color: #10B981; display: flex; align-items: center; gap: 4px;">
            <span>آرشیو مقالات</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </a>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
        <article style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; overflow: hidden; display: flex; flex-direction: column;">
            <div style="aspect-ratio: 16/9; overflow: hidden; background: #09090B;">
                <img src="<?php echo esc_url(lumina_asset('images/products/photo-1527864550417-7fd91fc51a46.jpg')); ?>" alt="Setup Guide" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="padding: 16px; display: flex; flex-direction: column; flex: 1;">
                <span style="font-size: 11px; font-weight: 700; color: #10B981; margin-bottom: 6px;">راهنمای ارگونومی میز کار</span>
                <h4 style="font-size: 14px; font-weight: 800; line-height: 1.5; margin-bottom: 8px; color: var(--text-main);">چگونه یک محیط کار مینیمال و ارگونومیک برای ساعات طولانی بسازیم؟</h4>
                <p style="font-size: 12px; color: var(--text-muted); line-height: 1.6; margin-bottom: 14px;">بررسی ارتفاع مانیتور، چیدمان کیبورد و نورپردازی ملایم جهت جلوگیری از خستگی چشم و مفاصل.</p>
                <span style="margin-top: auto; font-size: 11px; color: #94A3B8;">زمان مطالعه: ۶ دقیقه • تحریریه لومینا</span>
            </div>
        </article>

        <article style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; overflow: hidden; display: flex; flex-direction: column;">
            <div style="aspect-ratio: 16/9; overflow: hidden; background: #09090B;">
                <img src="<?php echo esc_url(lumina_asset('images/products/photo-1505740420928-5e560c06d30e.jpg')); ?>" alt="Audio Guide" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="padding: 16px; display: flex; flex-direction: column; flex: 1;">
                <span style="font-size: 11px; font-weight: 700; color: #F43F5E; margin-bottom: 6px;">فناوری آکوستیک</span>
                <h4 style="font-size: 14px; font-weight: 800; line-height: 1.5; margin-bottom: 8px; color: var(--text-main);">تفاوت نویزکنسلینگ اکتیو (ANC) هیبریدی با هدفون‌های معمولی چیست؟</h4>
                <p style="font-size: 12px; color: var(--text-muted); line-height: 1.6; margin-bottom: 14px;">نگاهی موشکافانه به نحوه عملکرد میکروفون‌های داخلی و خارجی در حذف فرکانس‌های مزاحم محیطی.</p>
                <span style="margin-top: auto; font-size: 11px; color: #94A3B8;">زمان مطالعه: ۵ دقیقه • تحریریه لومینا</span>
            </div>
        </article>

        <article style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; overflow: hidden; display: flex; flex-direction: column;">
            <div style="aspect-ratio: 16/9; overflow: hidden; background: #09090B;">
                <img src="<?php echo esc_url(lumina_asset('images/products/photo-1514432324607-a09d9b4aefdd.jpg')); ?>" alt="Coffee Guide" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="padding: 16px; display: flex; flex-direction: column; flex: 1;">
                <span style="font-size: 11px; font-weight: 700; color: #8B5CF6; margin-bottom: 6px;">هنر قهوه تخصصی</span>
                <h4 style="font-size: 14px; font-weight: 800; line-height: 1.5; margin-bottom: 8px; color: var(--text-main);">دم‌آوری پور-اور خانگی با کتری‌های باریستا با کنترل دما</h4>
                <p style="font-size: 12px; color: var(--text-muted); line-height: 1.6; margin-bottom: 14px;">رسیدن به عصاره‌گیری متعادل و کشف نوت‌های طعمی اصیل با حفظ دمای دقیق ۹۳ درجه سانتی‌گراد.</p>
                <span style="margin-top: auto; font-size: 11px; color: #94A3B8;">زمان مطالعه: ۴ دقیقه • تحریریه لومینا</span>
            </div>
        </article>
    </div>
</section>

<?php
get_footer();
