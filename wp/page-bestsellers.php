<?php
/**
 * Template Name: پرفروش‌ترین‌ها (Best Sellers)
 *
 * @package Lumina
 */

get_header();

$default_prods = lumina_get_default_products();
?>

<div class="lumina-container" style="padding-top: 20px; padding-bottom: 48px;">
    
    <div style="display: flex; flex-direction: column; gap: 4px; padding-bottom: 14px; border-bottom: 1px solid var(--border-color); margin-bottom: 24px;">
        <div style="display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: #F59E0B;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>رتبه‌بندی محبوب‌ترین انتخاب‌ها</span>
        </div>
        <h1 style="font-size: 1.5rem; font-weight: 900; color: var(--text-main); margin: 0;">پرفروش‌ترین تجهیزات و محصولات</h1>
        <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">کالاهای دارای بالاترین رضایت خریداران و بیشترین میزان سفارش در ماه اخیر.</p>
    </div>

    <div class="lumina-products-grid">
        <?php
        foreach ($default_prods as $p) {
            set_query_var('lumina_mock_product', $p);
            get_template_part('template-parts/content-product-card');
        }
        ?>
    </div>

</div>

<?php
get_footer();
