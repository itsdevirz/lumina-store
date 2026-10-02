<?php
/**
 * Lumina WordPress Theme - Functions & Definitions
 *
 * @package Lumina
 * @version 2.5.0
 */

if (!defined('ABSPATH')) {
    exit;
}

// Define Theme Constants
define('LUMINA_THEME_VERSION', '2.5.0');
define('LUMINA_THEME_DIR', get_template_directory());
define('LUMINA_THEME_URI', get_template_directory_uri());

// 1. Core Helpers & Price Formatting
require_once LUMINA_THEME_DIR . '/inc/helpers.php';

// 2. Theme Supports, Menus & Image Sizes
require_once LUMINA_THEME_DIR . '/inc/theme-setup.php';

// 3. Enqueue Stylesheets & Scripts
require_once LUMINA_THEME_DIR . '/inc/enqueue.php';

// 4. WooCommerce Bridge & Filters
require_once LUMINA_THEME_DIR . '/inc/woocommerce-compat.php';

// 5. AJAX Endpoints (Live Search, Infinite Scroll, Cart, Coupons)
require_once LUMINA_THEME_DIR . '/inc/ajax-handlers.php';

// 6. Admin Panel & Theme Options
require_once LUMINA_THEME_DIR . '/inc/admin-options.php';

// 7. 1-Click Demo Data Importer Engine
require_once LUMINA_THEME_DIR . '/inc/demo-importer.php';
