<?php
/**
 * WooCommerce Archive Product Template Override
 *
 * @package Lumina
 */

defined('ABSPATH') || exit;

get_header('shop');

$categories = lumina_get_categories();
$active_cat = is_tax('product_cat') ? get_queried_object()->slug : 'all';
?>

<div class="lumina-container" style="padding-top: 16px; padding-bottom: 40px;">
    
    <!-- 1. Header -->
    <div style="display: flex; flex-direction: column; gap: 4px; padding-bottom: 14px; border-bottom: 1px solid var(--border-color); margin-bottom: 16px;">
        <h1 style="font-size: 1.5rem; font-weight: 900; color: var(--text-main); margin: 0;">
            <?php woocommerce_page_title(); ?>
        </h1>
        <?php do_action('woocommerce_archive_description'); ?>
    </div>

    <!-- 2. Compact Real Photo Categories Selector -->
    <div class="lumina-categories-wrap" style="padding-top: 0;">
        <div class="lumina-cat-scroll">
            <?php foreach ($categories as $c): ?>
                <?php $is_active = ($active_cat === $c['id']); ?>
                <a href="<?php echo esc_url($c['id'] === 'all' ? (wc_get_page_permalink('shop') ?: home_url('/categories/')) : get_term_link($c['id'], 'product_cat')); ?>" class="cat-item-btn <?php echo $is_active ? 'active' : ''; ?>">
                    <div class="cat-thumb-box">
                        <img src="<?php echo esc_url($c['image']); ?>" alt="<?php echo esc_attr($c['nameFa']); ?>" loading="lazy">
                    </div>
                    <span class="cat-name"><?php echo esc_html($c['nameFa']); ?></span>
                    <span class="cat-count"><?php echo esc_html(lumina_to_persian_num($c['count'])); ?> کالا</span>
                </a>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- 3. WooCommerce Loop -->
    <?php if (woocommerce_product_loop()): ?>
        <div class="lumina-products-grid">
            <?php
            if (wc_get_loop_prop('total')) {
                while (have_posts()) {
                    the_post();
                    get_template_part('template-parts/content-product-card');
                }
            }
            ?>
        </div>

        <div style="margin-top: 32px; display: flex; justify-content: center;">
            <?php woocommerce_pagination(); ?>
        </div>
    <?php else: ?>
        <div style="text-align: center; padding: 48px; background: var(--bg-card); border-radius: 20px; border: 1px solid var(--border-color);">
            <p><?php esc_html_e('هیچ محصولی مطابق با انتخاب شما پیدا نشد.', 'lumina'); ?></p>
        </div>
    <?php endif; ?>

</div>

<?php
get_footer('shop');
