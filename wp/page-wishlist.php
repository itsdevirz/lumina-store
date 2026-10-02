<?php
/**
 * Template Name: لیست علاقه‌مندی‌ها (Wishlist)
 *
 * @package Lumina
 */

get_header();

$default_prods = lumina_get_default_products();
?>

<div class="lumina-container" style="padding-top: 20px; padding-bottom: 48px;">
    
    <div style="display: flex; flex-direction: column; gap: 4px; padding-bottom: 14px; border-bottom: 1px solid var(--border-color); margin-bottom: 24px;">
        <div style="display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: #F43F5E;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            <span>کالاهای برگزیده شما</span>
        </div>
        <h1 style="font-size: 1.5rem; font-weight: 900; color: var(--text-main); margin: 0;">لیست علاقه‌مندی‌ها</h1>
    </div>

    <!-- Render Favorite Items -->
    <div class="lumina-products-grid">
        <?php
        // Render first 4 items as initial demo favorites
        for ($i = 0; $i < 4; $i++) {
            if (isset($default_prods[$i])) {
                set_query_var('lumina_mock_product', $default_prods[$i]);
                get_template_part('template-parts/content-product-card');
            }
        }
        ?>
    </div>

</div>

<?php
get_footer();
