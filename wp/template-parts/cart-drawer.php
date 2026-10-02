<?php
/**
 * Lumina Theme - Slide-Out Cart Drawer Template Part
 *
 * @package Lumina
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
<!-- Cart Drawer Backdrop -->
<div id="lumina-drawer-backdrop" class="lumina-drawer-backdrop"></div>

<!-- Cart Drawer Panel -->
<div id="lumina-cart-drawer" class="lumina-cart-drawer">
    
    <!-- Drawer Header -->
    <div class="drawer-header">
        <div style="display: flex; align-items: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            <h4 class="drawer-title"><?php esc_html_e('سبد خرید شما', 'lumina'); ?></h4>
        </div>
        <button type="button" id="lumina-drawer-close" class="drawer-close" aria-label="<?php esc_attr_e('بستن', 'lumina'); ?>">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
    </div>

    <!-- Items List (Hydrated dynamically by JS) -->
    <div id="drawer-items-list" class="drawer-items">
        <div style="text-align: center; padding: 40px 10px; color: #94A3B8;">
            <p style="font-size: 13px; font-weight: 700; margin-bottom: 6px;"><?php esc_html_e('سبد خرید شما خالی است', 'lumina'); ?></p>
            <p style="font-size: 11px;"><?php esc_html_e('محصولات دلخواه خود را به سبد خرید اضافه کنید.', 'lumina'); ?></p>
        </div>
    </div>

    <!-- Drawer Footer -->
    <div class="drawer-footer">
        <div class="drawer-subtotal">
            <span><?php esc_html_e('مجموع خرید:', 'lumina'); ?></span>
            <span id="drawer-subtotal-price" style="color: #10B981; font-family: var(--font-mono);">۰ تومان</span>
        </div>

        <a href="<?php echo esc_url(home_url('/cart/')); ?>" class="btn-checkout">
            <span><?php esc_html_e('مشاهده سبد و تسویه حساب', 'lumina'); ?></span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </a>
    </div>

</div>
