<?php
/**
 * Lumina Theme - Header Template
 *
 * @package Lumina
 */

if (!defined('ABSPATH')) {
    exit;
}

$topbar_notice = lumina_get_option('topbar_notice', 'ارسال رایگان سفارش‌های بالای ۲ میلیون تومان در سراسر کشور');
$support_phone = lumina_get_option('support_phone', '۰۲۱-۸۸۸۸۴۳۲۱');
$festival_active = lumina_get_option('festival_active', 1);
$festival_text   = lumina_get_option('festival_text', 'جشنواره بهاره تخفیف ویژه تجهیزات صوتی و ستاپ لومینا — تا ۳۰٪ تخفیف');
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> dir="rtl">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- 1. Slim Top Utility Bar -->
<div class="lumina-topbar">
    <div class="lumina-container">
        <div class="lumina-topbar-left">
            <div style="display: flex; align-items: center; gap: 6px;">
                <span class="pulse-indicator"></span>
                <span><?php echo esc_html($topbar_notice); ?></span>
            </div>
            <span style="color: #52525B;">|</span>
            <div style="display: flex; align-items: center; gap: 4px; color: #A1A1AA;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34D399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>پشتیبانی: <?php echo esc_html($support_phone); ?></span>
            </div>
        </div>

        <div class="lumina-topbar-right">
            <?php if (current_user_can('manage_options')): ?>
                <a href="<?php echo esc_url(admin_url('admin.php?page=lumina-settings')); ?>" style="color: #A1A1AA; display: flex; align-items: center; gap: 4px;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                    <span>پنل مدیریت</span>
                </a>
                <span style="color: #52525B;">|</span>
            <?php endif; ?>

            <!-- Theme Mode Toggle -->
            <button type="button" class="lumina-theme-toggle" aria-label="<?php esc_attr_e('تغییر تم تاریک/روشن', 'lumina'); ?>" style="color: #D4D4D8; display: flex; align-items: center; gap: 4px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                <span>تم روز/شب</span>
            </button>
        </div>
    </div>
</div>

<!-- 2. Main Sticky Header -->
<header class="lumina-header">
    <div class="lumina-container">
        <div class="lumina-header-inner">
            
            <!-- Logo -->
            <div class="lumina-header-logo">
                <a href="<?php echo esc_url(home_url('/')); ?>" class="lumina-logo">
                    <div class="lumina-logo-symbol">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>
                    </div>
                    <span>لومینا</span>
                </a>
            </div>

            <!-- Instant Live Search Bar -->
            <div class="lumina-search-box">
                <input type="text" id="lumina-main-search" class="lumina-search-input" placeholder="<?php esc_attr_e('جستجو در میان هزاران محصول، برند یا مشخصات فنی...', 'lumina'); ?>" autocomplete="off">
                <svg class="lumina-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <button type="button" id="lumina-search-clear" class="lumina-search-clear" aria-label="<?php esc_attr_e('پاک کردن', 'lumina'); ?>">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
                <div id="lumina-search-results" class="lumina-search-dropdown"></div>
            </div>

            <!-- Navigation Links -->
            <nav class="lumina-nav-links">
                <?php
                if (has_nav_menu('primary-menu')) {
                    wp_nav_menu(array(
                        'theme_location' => 'primary-menu',
                        'container'      => false,
                        'depth'          => 1,
                        'fallback_cb'    => false,
                    ));
                } else {
                    // Fallback Navigation matching current store
                    ?>
                    <a href="<?php echo esc_url(home_url('/')); ?>" class="<?php echo is_front_page() ? 'active' : ''; ?>"><?php esc_html_e('صفحه اصلی', 'lumina'); ?></a>
                    <a href="<?php echo esc_url(home_url('/categories/')); ?>" class="<?php echo is_page('categories') ? 'active' : ''; ?>"><?php esc_html_e('دسته‌بندی‌ها', 'lumina'); ?></a>
                    <a href="<?php echo esc_url(home_url('/bestsellers/')); ?>" class="<?php echo is_page('bestsellers') ? 'active' : ''; ?>"><?php esc_html_e('پرفروش‌ترین‌ها', 'lumina'); ?></a>
                    <a href="<?php echo esc_url(home_url('/festival/')); ?>" class="highlight <?php echo is_page('festival') ? 'active' : ''; ?>"><?php esc_html_e('جشنواره تخفیف', 'lumina'); ?></a>
                    <a href="<?php echo esc_url(home_url('/blog/')); ?>" class="<?php echo (is_home() || is_singular('post')) ? 'active' : ''; ?>"><?php esc_html_e('راهنما و وبلاگ', 'lumina'); ?></a>
                    <?php
                }
                ?>
            </nav>

            <!-- Actions: Wishlist, Cart, Account -->
            <div class="lumina-header-actions">
                <!-- Wishlist -->
                <a href="<?php echo esc_url(home_url('/wishlist/')); ?>" class="lumina-action-btn" aria-label="<?php esc_attr_e('علاقه‌مندی‌ها', 'lumina'); ?>">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    <span class="badge-count wishlist-badge-counter" style="display: none;">۰</span>
                </a>

                <!-- Cart Button (Triggers Drawer) -->
                <button type="button" class="lumina-action-btn lumina-cart-trigger" aria-label="<?php esc_attr_e('سبد خرید', 'lumina'); ?>">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                    <span class="badge-count cart-badge-counter" style="display: none;">۰</span>
                </button>

                <!-- User Account -->
                <a href="<?php echo esc_url(lumina_is_woocommerce_active() ? wc_get_page_permalink('myaccount') : home_url('/my-account/')); ?>" class="lumina-action-btn" aria-label="<?php esc_attr_e('حساب کاربری', 'lumina'); ?>">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </a>
            </div>

        </div>
    </div>
</header>

<!-- 3. Festival Discount Banner (Optional) -->
<?php if (!empty($festival_active) && is_front_page()): ?>
<div style="background: linear-gradient(90deg, #059669 0%, #10B981 100%); color: #fff; font-size: 12px; font-weight: 700; padding: 8px 16px; text-align: center;">
    <div class="lumina-container" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        <span><?php echo esc_html($festival_text); ?></span>
        <a href="<?php echo esc_url(home_url('/festival/')); ?>" style="color: #fff; text-decoration: underline; margin-right: 6px;">مشاهده تخفیف‌ها</a>
    </div>
</div>
<?php endif; ?>
