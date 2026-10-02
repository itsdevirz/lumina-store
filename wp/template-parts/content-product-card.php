<?php
/**
 * Lumina Theme - Unified Product Card Template Part
 *
 * @package Lumina
 */

if (!defined('ABSPATH')) {
    exit;
}

// 1. Resolve Product Data from WooCommerce or Mock Data
$mock = get_query_var('lumina_mock_product');

if (!empty($mock)) {
    $p_id       = $mock['id'];
    $p_title    = $mock['name'];
    $p_brand    = $mock['brand'] ?? 'Lumina';
    $p_rating   = $mock['rating'] ?? 5.0;
    $p_reviews  = $mock['reviewsCount'] ?? 0;
    $p_price    = $mock['price'] ?? 0;
    $p_orig     = $mock['originalPrice'] ?? 0;
    $p_discount = $mock['discountPercent'] ?? 0;
    $p_stock    = $mock['stock'] ?? 1;
    $p_image    = $mock['image'] ?? lumina_asset('images/products/photo-1505740420928-5e560c06d30e.jpg');
    $p_url      = home_url('/?lumina_product=' . $p_id);
} elseif (lumina_is_woocommerce_active()) {
    global $product;
    if (!$product) return;

    $p_id       = $product->get_id();
    $p_title    = $product->get_name();
    $p_brand    = get_post_meta($p_id, '_lumina_brand', true) ?: 'Lumina';
    $p_rating   = (float)$product->get_average_rating() ?: 5.0;
    $p_reviews  = $product->get_review_count() ?: 0;
    $p_price    = (float)$product->get_price() * 10; // Convert to Rials for helper
    $p_orig     = (float)$product->get_regular_price() * 10;
    $p_discount = 0;
    if ($p_orig > $p_price && $p_orig > 0) {
        $p_discount = round((($p_orig - $p_price) / $p_orig) * 100);
    }
    $p_stock    = $product->is_in_stock() ? 10 : 0;
    $p_image    = get_the_post_thumbnail_url($p_id, 'medium') ?: lumina_asset('images/products/photo-1505740420928-5e560c06d30e.jpg');
    $p_url      = get_permalink($p_id);
} else {
    return;
}

$has_discount = $p_discount > 0 || ($p_orig > $p_price && $p_orig > 0);
?>
<article class="product-card" data-product-id="<?php echo esc_attr($p_id); ?>" data-product-name="<?php echo esc_attr($p_title); ?>" data-product-price="<?php echo esc_attr($p_price); ?>" data-product-image="<?php echo esc_url($p_image); ?>">
    
    <!-- Product Thumbnail Container -->
    <div class="product-card-img-wrap">
        <a href="<?php echo esc_url($p_url); ?>" style="display: block; width: 100%; height: 100%;">
            <img src="<?php echo esc_url($p_image); ?>" alt="<?php echo esc_attr($p_title); ?>" loading="lazy">
        </a>

        <!-- Discount & Rank Badges -->
        <?php if ($has_discount): ?>
            <div class="card-badge-top">
                <span class="card-badge-discount"><?php echo esc_html(lumina_to_persian_num($p_discount)); ?>٪-</span>
            </div>
        <?php endif; ?>

        <!-- Wishlist Button -->
        <div class="card-actions-top">
            <button type="button" class="card-wishlist-btn" data-product-id="<?php echo esc_attr($p_id); ?>" aria-label="<?php esc_attr_e('افزودن به علاقه‌مندی‌ها', 'lumina'); ?>">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>
        </div>
    </div>

    <!-- Product Card Details -->
    <div class="product-card-info">
        <!-- Brand & Rating -->
        <div class="product-card-brand-row">
            <span class="product-card-brand"><?php echo esc_html($p_brand); ?></span>
            <div class="product-card-rating">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span><?php echo esc_html(lumina_to_persian_num(number_format($p_rating, 1))); ?></span>
            </div>
        </div>

        <!-- Title -->
        <h3 class="product-card-title">
            <a href="<?php echo esc_url($p_url); ?>"><?php echo esc_html($p_title); ?></a>
        </h3>

        <!-- Footer: Price & Add to Cart -->
        <div class="product-card-footer">
            <div class="product-card-prices">
                <?php if ($has_discount && !empty($p_orig)): ?>
                    <span class="product-card-old-price"><?php echo esc_html(lumina_format_price($p_orig, true)); ?></span>
                <?php endif; ?>
                <span class="product-card-price">
                    <?php echo esc_html(lumina_format_price($p_price, true)); ?>
                </span>
            </div>

            <button type="button" class="product-card-add-btn" aria-label="<?php esc_attr_e('افزودن به سبد خرید', 'lumina'); ?>">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                <span>خرید</span>
            </button>
        </div>
    </div>
</article>
