<?php
/**
 * Lumina Theme - Mobile Bottom Navigation Bar
 *
 * @package Lumina
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
<nav class="lumina-mobile-nav" aria-label="<?php esc_attr_e('ناوبری موبایل', 'lumina'); ?>">
    <a href="<?php echo esc_url(home_url('/')); ?>" class="mobile-nav-item <?php echo is_front_page() ? 'active' : ''; ?>">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span><?php esc_html_e('خانه', 'lumina'); ?></span>
    </a>

    <a href="<?php echo esc_url(home_url('/categories/')); ?>" class="mobile-nav-item <?php echo is_page('categories') ? 'active' : ''; ?>">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>
        <span><?php esc_html_e('دسته‌ها', 'lumina'); ?></span>
    </a>

    <button type="button" class="mobile-nav-item lumina-cart-trigger">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        <span><?php esc_html_e('سبد خرید', 'lumina'); ?></span>
        <span class="badge-count cart-badge-counter" style="display: none;">۰</span>
    </button>

    <a href="<?php echo esc_url(home_url('/wishlist/')); ?>" class="mobile-nav-item <?php echo is_page('wishlist') ? 'active' : ''; ?>">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        <span><?php esc_html_e('علاقه‌مندی', 'lumina'); ?></span>
        <span class="badge-count wishlist-badge-counter" style="display: none;">۰</span>
    </a>

    <a href="<?php echo esc_url(lumina_is_woocommerce_active() ? wc_get_page_permalink('myaccount') : home_url('/my-account/')); ?>" class="mobile-nav-item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span><?php esc_html_e('حساب من', 'lumina'); ?></span>
    </a>
</nav>
