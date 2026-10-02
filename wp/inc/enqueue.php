<?php
/**
 * Lumina Theme - Enqueue Scripts & Stylesheets
 *
 * @package Lumina
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue Frontend Scripts and Styles
 */
function lumina_enqueue_scripts() {
    $theme_version = wp_get_theme()->get('Version');

    // 1. Core Stylesheet (Theme Info & Resets)
    wp_enqueue_style(
        'lumina-style',
        get_stylesheet_uri(),
        array(),
        $theme_version
    );

    // 2. Production Compiled Stylesheet (Tailwind, RTL, Dark Mode, Components)
    wp_enqueue_style(
        'lumina-main-css',
        get_template_directory_uri() . '/assets/css/lumina-main.css',
        array('lumina-style'),
        $theme_version
    );

    // 3. Main Interactivity Script
    wp_enqueue_script(
        'lumina-main-js',
        get_template_directory_uri() . '/assets/js/lumina-main.js',
        array('jquery'),
        $theme_version,
        true
    );

    // Localize Data for AJAX, Nonce & URLs
    wp_localize_script('lumina-main-js', 'luminaThemeData', array(
        'ajaxUrl'   => admin_url('admin-ajax.php'),
        'nonce'     => wp_create_nonce('lumina_ajax_nonce'),
        'siteUrl'   => home_url('/'),
        'themeUri'  => get_template_directory_uri(),
        'isRtl'     => is_rtl()
    ));

    // Comment Reply Script on Singular Posts
    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }
}
add_action('wp_enqueue_scripts', 'lumina_enqueue_scripts');

/**
 * Enqueue Admin Scripts and Styles for Lumina Theme Options Panel
 */
function lumina_admin_enqueue_scripts($hook) {
    if (strpos($hook, 'lumina') === false) {
        return;
    }

    wp_enqueue_style(
        'lumina-admin-css',
        get_template_directory_uri() . '/assets/css/admin-style.css',
        array(),
        wp_get_theme()->get('Version')
    );

    wp_enqueue_script(
        'lumina-admin-js',
        get_template_directory_uri() . '/assets/js/admin-script.js',
        array('jquery'),
        wp_get_theme()->get('Version'),
        true
    );

    wp_localize_script('lumina-admin-js', 'luminaAdminData', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce'   => wp_create_nonce('lumina_admin_nonce')
    ));
}
add_action('admin_enqueue_scripts', 'lumina_admin_enqueue_scripts');
