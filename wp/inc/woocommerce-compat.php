<?php
/**
 * Lumina Theme - WooCommerce Compatibility & Hook Bridge
 *
 * @package Lumina
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Check if WooCommerce is active
 *
 * @return bool
 */
function lumina_is_woocommerce_active() {
    return class_exists('WooCommerce');
}

/**
 * WooCommerce Custom Currency Formatter (Iranian Toman / Rial)
 */
function lumina_add_iranian_currencies($currencies) {
    $currencies['IRT'] = __('تومان ایران', 'lumina');
    $currencies['IRR'] = __('ریال ایران', 'lumina');
    return $currencies;
}
add_filter('woocommerce_currencies', 'lumina_add_iranian_currencies');

function lumina_add_iranian_currency_symbols($currency_symbol, $currency) {
    switch ($currency) {
        case 'IRT':
            $currency_symbol = ' تومان';
            break;
        case 'IRR':
            $currency_symbol = ' ریال';
            break;
    }
    return $currency_symbol;
}
add_filter('woocommerce_currency_symbol', 'lumina_add_iranian_currency_symbols', 10, 2);

/**
 * WooCommerce AJAX Cart Fragments (Header & Drawer Sync)
 */
function lumina_cart_count_fragments($fragments) {
    if (!lumina_is_woocommerce_active()) {
        return $fragments;
    }

    $count = WC()->cart ? WC()->cart->get_cart_contents_count() : 0;
    $persian_count = lumina_to_persian_num($count);

    $fragments['.cart-badge-counter'] = '<span class="badge-count cart-badge-counter" style="' . ($count > 0 ? 'display:flex;' : 'display:none;') . '">' . esc_html($persian_count) . '</span>';
    
    return $fragments;
}
add_filter('woocommerce_add_to_cart_fragments', 'lumina_cart_count_fragments');

/**
 * Custom WooCommerce Wrapper
 */
function lumina_woocommerce_wrapper_start() {
    echo '<div class="lumina-container py-8"><div class="lumina-wc-content">';
}
remove_action('woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10);
add_action('woocommerce_before_main_content', 'lumina_woocommerce_wrapper_start', 10);

function lumina_woocommerce_wrapper_end() {
    echo '</div></div>';
}
remove_action('woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10);
add_action('woocommerce_after_main_content', 'lumina_woocommerce_wrapper_end', 10);
