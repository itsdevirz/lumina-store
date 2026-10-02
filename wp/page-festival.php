<?php
/**
 * Template Name: جشنواره تخفیف (Festival Deals)
 *
 * @package Lumina
 */

get_header();

$default_prods = lumina_get_default_products();
?>

<div class="lumina-container" style="padding-top: 20px; padding-bottom: 48px;">
    
    <!-- Festival Header Banner -->
    <div style="background: linear-gradient(135deg, #065F46 0%, #064E3B 50%, #09090B 100%); border-radius: var(--radius-3xl); padding: 32px; color: #fff; margin-bottom: 28px; position: relative; overflow: hidden; box-shadow: var(--shadow-xl);">
        <div style="position: relative; z-index: 2; max-width: 600px;">
            <span style="display: inline-block; padding: 4px 12px; border-radius: 9999px; background: rgba(244, 63, 94, 0.9); font-size: 11px; font-weight: 800; margin-bottom: 12px;">جشنواره تخفیف بهاره لومینا</span>
            <h1 style="font-size: 2rem; font-weight: 900; line-height: 1.3; margin-bottom: 10px;">تا ۳۰٪ تخفیف روی برترین گجت‌ها</h1>
            <p style="font-size: 13px; color: #E2E8F0; line-height: 1.7; margin-bottom: 20px;">فرصت استثنایی خرید تجهیزات صوتی، هدفون‌های ANC و تجهیزات ستاپ با ضمانت تعویض طلایی.</p>
            
            <div style="display: flex; gap: 8px; font-family: var(--font-mono); font-size: 12px; font-weight: 800;">
                <div style="background: rgba(0,0,0,0.4); padding: 6px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15);">۱۴ ساعت</div>
                <div style="background: rgba(0,0,0,0.4); padding: 6px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15);">۳۲ دقیقه</div>
                <div style="background: rgba(0,0,0,0.4); padding: 6px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15);">۴۵ ثانیه</div>
            </div>
        </div>
    </div>

    <!-- Festival Products Grid -->
    <div class="lumina-products-grid">
        <?php
        foreach ($default_prods as $p) {
            if (!empty($p['discountPercent'])) {
                set_query_var('lumina_mock_product', $p);
                get_template_part('template-parts/content-product-card');
            }
        }
        ?>
    </div>

</div>

<?php
get_footer();
