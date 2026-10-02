<?php
/**
 * Lumina Theme - 1-Click Demo Data Importer Engine
 *
 * @package Lumina
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Execute Full Demo Content Import
 *
 * @return array
 */
function lumina_execute_demo_import() {
    $products = lumina_get_default_products();
    $categories = lumina_get_categories();

    $imported_cats = 0;
    $imported_prods = 0;
    $imported_pages = 0;

    // 1. Create or Map Pages
    $pages_to_create = array(
        'خانه'               => array('slug' => 'home', 'template' => 'front-page.php'),
        'دسته‌بندی‌ها'        => array('slug' => 'categories', 'template' => 'page-categories.php'),
        'پرفروش‌ترین‌ها'     => array('slug' => 'bestsellers', 'template' => 'page-bestsellers.php'),
        'جشنواره تخفیف'      => array('slug' => 'festival', 'template' => 'page-festival.php'),
        'راهنما و وبلاگ'     => array('slug' => 'blog', 'template' => 'home.php'),
        'سبد خرید'           => array('slug' => 'cart', 'template' => 'page-cart.php'),
        'تسویه حساب'         => array('slug' => 'checkout', 'template' => 'page-checkout.php'),
        'حساب کاربری'        => array('slug' => 'my-account', 'template' => 'page-account.php'),
        'علاقه‌مندی‌ها'       => array('slug' => 'wishlist', 'template' => 'page-wishlist.php'),
    );

    foreach ($pages_to_create as $title => $data) {
        $existing = get_page_by_path($data['slug']);
        if (!$existing) {
            $page_id = wp_insert_post(array(
                'post_title'     => $title,
                'post_name'      => $data['slug'],
                'post_status'    => 'publish',
                'post_type'      => 'page',
                'comment_status' => 'closed'
            ));

            if ($page_id && !is_wp_error($page_id)) {
                update_post_meta($page_id, '_wp_page_template', $data['template']);
                $imported_pages++;

                // Set Home as Front Page
                if ($data['slug'] === 'home') {
                    update_option('show_on_front', 'page');
                    update_option('page_on_front', $page_id);
                }
            }
        }
    }

    // 2. Import Categories into Taxonomy
    $cat_taxonomy = lumina_is_woocommerce_active() ? 'product_cat' : 'category';
    $cat_term_ids = array();

    foreach ($categories as $cat) {
        if ($cat['id'] === 'all') continue;

        $term = term_exists($cat['id'], $cat_taxonomy);
        if (!$term) {
            $created_term = wp_insert_term(
                $cat['nameFa'],
                $cat_taxonomy,
                array(
                    'slug'        => $cat['id'],
                    'description' => $cat['name']
                )
            );
            if (!is_wp_error($created_term)) {
                $cat_term_ids[$cat['id']] = $created_term['term_id'];
                $imported_cats++;
            }
        } else {
            $cat_term_ids[$cat['id']] = is_array($term) ? $term['term_id'] : $term;
        }
    }

    // 3. Import Products into WooCommerce or Posts
    if (lumina_is_woocommerce_active()) {
        foreach ($products as $p) {
            // Check existing product by title
            $existing = get_page_by_title($p['name'], OBJECT, 'product');
            if ($existing) continue;

            $post_id = wp_insert_post(array(
                'post_title'   => $p['name'],
                'post_content' => $p['descriptionFa'],
                'post_status'  => 'publish',
                'post_type'    => 'product',
            ));

            if ($post_id && !is_wp_error($post_id)) {
                $product_obj = wc_get_product($post_id);
                if ($product_obj) {
                    $price_toman = floor($p['price'] / 10);
                    $orig_toman = !empty($p['originalPrice']) ? floor($p['originalPrice'] / 10) : $price_toman;

                    $product_obj->set_regular_price($orig_toman);
                    if ($orig_toman > $price_toman) {
                        $product_obj->set_sale_price($price_toman);
                        $product_obj->set_price($price_toman);
                    } else {
                        $product_obj->set_price($price_toman);
                    }

                    $product_obj->set_manage_stock(true);
                    $product_obj->set_stock_quantity($p['stock']);
                    $product_obj->set_stock_status($p['stock'] > 0 ? 'instock' : 'outofstock');
                    $product_obj->set_featured(!empty($p['featured']));
                    $product_obj->save();

                    // Assign category
                    if (isset($cat_term_ids[$p['category']])) {
                        wp_set_object_terms($post_id, (int)$cat_term_ids[$p['category']], 'product_cat');
                    }

                    // Save custom metadata
                    update_post_meta($post_id, '_lumina_brand', $p['brand']);
                    update_post_meta($post_id, '_lumina_rating', $p['rating']);
                    update_post_meta($post_id, '_lumina_reviews_count', $p['reviewsCount']);
                    update_post_meta($post_id, '_lumina_specs', $p['specs']);

                    $imported_prods++;
                }
            }
        }
    }

    return array(
        'success'    => true,
        'categories' => $imported_cats,
        'products'   => $imported_prods,
        'pages'      => $imported_pages,
    );
}
