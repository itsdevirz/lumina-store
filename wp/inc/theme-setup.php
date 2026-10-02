<?php
/**
 * Lumina Theme - Theme Setup & Core Registrations
 *
 * @package Lumina
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register theme supports and menus
 */
function lumina_theme_setup() {
    // Localization
    load_theme_textdomain('lumina', get_template_directory() . '/languages');

    // Title tag
    add_theme_support('title-tag');

    // Post thumbnails
    add_theme_support('post-thumbnails');
    set_post_thumbnail_size(600, 600, true);
    add_image_size('lumina-product-card', 500, 500, true);
    add_image_size('lumina-hero-banner', 1400, 800, true);
    add_image_size('lumina-blog-thumb', 800, 450, true);

    // Custom Logo
    add_theme_support('custom-logo', array(
        'height'      => 60,
        'width'       => 200,
        'flex-height' => true,
        'flex-width'  => true,
    ));

    // HTML5 markup support
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script'
    ));

    // WooCommerce Support
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');

    // Selective Refresh for Widgets
    add_theme_support('customize-selective-refresh-widgets');

    // Responsive Embeds
    add_theme_support('responsive-embeds');

    // Register Navigation Menus
    register_nav_menus(array(
        'primary-menu' => esc_html__('منوی اصلی هدر', 'lumina'),
        'footer-menu'  => esc_html__('منوی پیوندهای فوتر', 'lumina'),
        'mobile-menu'  => esc_html__('منوی ناوبری موبایل', 'lumina'),
    ));
}
add_action('after_setup_theme', 'lumina_theme_setup');

/**
 * Register Sidebars & Widget Areas
 */
function lumina_widgets_init() {
    register_sidebar(array(
        'name'          => esc_html__('سایدبار وبلاگ', 'lumina'),
        'id'            => 'blog-sidebar',
        'description'   => esc_html__('ابزارک‌های این بخش در کنار مقالات وبلاگ نمایش داده می‌شوند.', 'lumina'),
        'before_widget' => '<div id="%1$s" class="lumina-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="lumina-widget-title">',
        'after_title'   => '</h4>',
    ));
}
add_action('widgets_init', 'lumina_widgets_init');
