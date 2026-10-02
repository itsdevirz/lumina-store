<?php
/**
 * Lumina Theme - AJAX Request Handlers
 *
 * @package Lumina
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * 1. Live Instant Search AJAX Handler
 */
function lumina_ajax_search() {
    check_ajax_referer('lumina_ajax_nonce', 'nonce');

    $query = isset($_GET['q']) ? sanitize_text_field($_GET['q']) : '';
    if (empty($query)) {
        wp_send_json_error(array('message' => 'عبارت جستجو خالی است'));
    }

    $results = array();

    if (lumina_is_woocommerce_active()) {
        $args = array(
            'post_type'      => 'product',
            'post_status'    => 'publish',
            'posts_per_page' => 5,
            's'              => $query,
        );
        $products_query = new WP_Query($args);

        if ($products_query->have_posts()) {
            while ($products_query->have_posts()) {
                $products_query->the_post();
                global $product;
                $results[] = array(
                    'id'    => get_the_ID(),
                    'title' => get_the_title(),
                    'url'   => get_permalink(),
                    'price' => $product ? $product->get_price() * 10 : 0, // In Rials
                    'image' => get_the_post_thumbnail_url(get_the_ID(), 'thumbnail') ?: lumina_asset('images/products/photo-1505740420928-5e560c06d30e.jpg'),
                );
            }
            wp_reset_postdata();
        }
    }

    // Fallback search in default catalog if WooCommerce yields no items
    if (empty($results)) {
        $default_items = lumina_get_default_products();
        foreach ($default_items as $item) {
            if (mb_stripos($item['name'], $query) !== false || mb_stripos($item['brand'], $query) !== false || mb_stripos($item['categoryFa'], $query) !== false) {
                $results[] = array(
                    'id'    => $item['id'],
                    'title' => $item['name'],
                    'url'   => home_url('/?lumina_product=' . $item['id']),
                    'price' => $item['price'],
                    'image' => $item['image'],
                );
                if (count($results) >= 5) break;
            }
        }
    }

    wp_send_json_success($results);
}
add_action('wp_ajax_lumina_search', 'lumina_ajax_search');
add_action('wp_ajax_nopriv_lumina_search', 'lumina_ajax_search');

/**
 * 2. Infinite Scroll Load More Products Handler
 */
function lumina_ajax_load_more() {
    check_ajax_referer('lumina_ajax_nonce', 'nonce');

    $page = isset($_GET['page']) ? intval($_GET['page']) : 2;
    $category = isset($_GET['category']) ? sanitize_text_field($_GET['category']) : 'all';
    $per_page = 4;

    $html = '';
    $has_more = false;

    if (lumina_is_woocommerce_active()) {
        $args = array(
            'post_type'      => 'product',
            'post_status'    => 'publish',
            'posts_per_page' => $per_page,
            'paged'          => $page,
        );

        if ($category !== 'all') {
            $args['tax_query'] = array(
                array(
                    'taxonomy' => 'product_cat',
                    'field'    => 'slug',
                    'terms'    => $category,
                ),
            );
        }

        $query = new WP_Query($args);
        $total_pages = $query->max_num_pages;
        $has_more = $page < $total_pages;

        if ($query->have_posts()) {
            ob_start();
            while ($query->have_posts()) {
                $query->the_post();
                get_template_part('template-parts/content-product-card');
            }
            $html = ob_get_clean();
            wp_reset_postdata();
        }
    }

    // Fallback load more simulation with default catalog
    if (empty($html)) {
        $all_products = lumina_get_default_products();
        if ($category !== 'all') {
            $all_products = array_filter($all_products, function($p) use ($category) {
                return $p['category'] === $category;
            });
        }
        $all_products = array_values($all_products);

        $offset = ($page - 1) * $per_page;
        $slice = array_slice($all_products, $offset, $per_page);
        $has_more = ($offset + $per_page) < count($all_products);

        ob_start();
        foreach ($slice as $product_data) {
            set_query_var('lumina_mock_product', $product_data);
            get_template_part('template-parts/content-product-card');
        }
        $html = ob_get_clean();
    }

    wp_send_json_success(array(
        'html'    => $html,
        'hasMore' => $has_more,
    ));
}
add_action('wp_ajax_lumina_load_more', 'lumina_ajax_load_more');
add_action('wp_ajax_nopriv_lumina_load_more', 'lumina_ajax_load_more');

/**
 * 3. Validate & Apply Coupon Code
 */
function lumina_ajax_apply_coupon() {
    check_ajax_referer('lumina_ajax_nonce', 'nonce');

    $code = isset($_POST['code']) ? strtoupper(sanitize_text_field($_POST['code'])) : '';
    if (empty($code)) {
        wp_send_json_error(array('message' => 'کد تخفیف را وارد کنید'));
    }

    $valid_coupons = array(
        'LUMINA2025' => array('percent' => 15, 'title' => 'تخفیف جشنواره لومینا'),
        'VIPGIFT'    => array('percent' => 20, 'title' => 'تخفیف ویژه مشتریان VIP'),
        'WELCOME10'  => array('percent' => 10, 'title' => 'تخفیف خرید اول'),
    );

    if (isset($valid_coupons[$code])) {
        wp_send_json_success(array(
            'code'    => $code,
            'percent' => $valid_coupons[$code]['percent'],
            'message' => 'کد تخفیف ' . $valid_coupons[$code]['percent'] . '٪ با موفقیت اعمال شد.',
        ));
    } else {
        wp_send_json_error(array('message' => 'کد تخفیف وارد شده معتبر یا فعال نیست.'));
    }
}
add_action('wp_ajax_lumina_apply_coupon', 'lumina_ajax_apply_coupon');
add_action('wp_ajax_nopriv_lumina_apply_coupon', 'lumina_ajax_apply_coupon');
