<?php
/**
 * Lumina Theme - Single Post & Product Detail Template
 *
 * @package Lumina
 */

get_header();

// Check if previewing a specific product ID via query param
$requested_pid = isset($_GET['lumina_product']) ? sanitize_text_field($_GET['lumina_product']) : '';

if (!empty($requested_pid) || (lumina_is_woocommerce_active() && is_singular('product'))) {
    // Resolve Product
    $prod = null;
    $default_prods = lumina_get_default_products();

    if (!empty($requested_pid)) {
        foreach ($default_prods as $p) {
            if ($p['id'] === $requested_pid) {
                $prod = $p;
                break;
            }
        }
    }
    if (!$prod && lumina_is_woocommerce_active() && is_singular('product')) {
        global $product;
        if ($product) {
            $prod = array(
                'id'            => $product->get_id(),
                'name'          => $product->get_name(),
                'brand'         => get_post_meta($product->get_id(), '_lumina_brand', true) ?: 'Lumina',
                'categoryFa'    => 'تجهیزات تخصصی',
                'rating'        => (float)$product->get_average_rating() ?: 5.0,
                'reviewsCount'  => $product->get_review_count() ?: 0,
                'price'         => (float)$product->get_price() * 10,
                'originalPrice' => (float)$product->get_regular_price() * 10,
                'image'         => get_the_post_thumbnail_url($product->get_id(), 'large') ?: lumina_asset('images/products/photo-1505740420928-5e560c06d30e.jpg'),
                'descriptionFa' => get_the_content(),
                'specs'         => get_post_meta($product->get_id(), '_lumina_specs', true) ?: array(
                    'گارانتی' => '۱۸ ماه گارانتی طلایی لومینا',
                    'اصالت' => 'ضمانت بازگشت وجه ۱۰۰٪'
                )
            );
        }
    }
    if (!$prod) {
        $prod = $default_prods[0];
    }
    ?>

    <!-- Product Detail View -->
    <div class="lumina-container" style="padding-top: 24px; padding-bottom: 48px;">
        
        <!-- Breadcrumbs -->
        <nav style="font-size: 11px; color: var(--text-muted); margin-bottom: 20px; display: flex; align-items: center; gap: 6px;">
            <a href="<?php echo esc_url(home_url('/')); ?>">صفحه اصلی</a>
            <span>/</span>
            <a href="<?php echo esc_url(home_url('/categories/')); ?>"><?php echo esc_html($prod['categoryFa'] ?? 'محصولات'); ?></a>
            <span>/</span>
            <span style="color: var(--text-main); font-weight: 700;"><?php echo esc_html($prod['name']); ?></span>
        </nav>

        <div style="display: grid; grid-template-columns: 1fr; gap: 32px; margin-bottom: 40px;" id="prod-detail-grid">
            
            <!-- Gallery & Main Image -->
            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-3xl); padding: 24px; display: flex; align-items: center; justify-content: center; overflow: hidden; aspect-ratio: 1/1;">
                <img src="<?php echo esc_url($prod['image']); ?>" alt="<?php echo esc_attr($prod['name']); ?>" style="max-height: 100%; object-fit: contain;">
            </div>

            <!-- Product Specs & Purchase Column -->
            <div style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <span style="font-size: 12px; font-weight: 800; color: #10B981; font-family: var(--font-mono); text-transform: uppercase;"><?php echo esc_html($prod['brand'] ?? 'Lumina'); ?></span>
                        <span style="color: var(--text-muted);">•</span>
                        <div style="display: flex; align-items: center; gap: 4px; font-size: 11px; color: #F59E0B; font-weight: 700;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <span><?php echo esc_html(lumina_to_persian_num($prod['rating'])); ?></span>
                            <span style="color: var(--text-muted);">(<?php echo esc_html(lumina_to_persian_num($prod['reviewsCount'])); ?> نظر خریداران)</span>
                        </div>
                    </div>

                    <h1 style="font-size: 1.6rem; font-weight: 900; line-height: 1.4; color: var(--text-main); margin-bottom: 14px;"><?php echo esc_html($prod['name']); ?></h1>

                    <p style="font-size: 13px; color: var(--text-muted); line-height: 1.8; margin-bottom: 24px;"><?php echo esc_html($prod['descriptionFa']); ?></p>

                    <!-- Technical Specifications Table -->
                    <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 16px; padding: 16px; margin-bottom: 24px;">
                        <h4 style="font-size: 13px; font-weight: 800; margin-bottom: 10px;">مشخصات فنی دستگاه</h4>
                        <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
                            <?php if (!empty($prod['specs'])): ?>
                                <?php foreach ($prod['specs'] as $label => $val): ?>
                                    <tr style="border-bottom: 1px solid var(--border-subtle);">
                                        <td style="padding: 8px 0; color: var(--text-muted); font-weight: 600; width: 40%;"><?php echo esc_html($label); ?></td>
                                        <td style="padding: 8px 0; font-weight: 700; color: var(--text-main);"><?php echo esc_html($val); ?></td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </table>
                    </div>
                </div>

                <!-- Price & Purchase Action -->
                <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 20px;">
                    <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 16px;">
                        <span style="font-size: 13px; color: var(--text-muted);">قیمت نهایی با تخفیف:</span>
                        <div style="font-size: 1.5rem; font-weight: 900; font-family: var(--font-mono); color: #10B981;">
                            <?php echo esc_html(lumina_format_price($prod['price'], true)); ?>
                        </div>
                    </div>

                    <div style="display: flex; gap: 10px;">
                        <button type="button" class="btn-hero-primary" style="flex: 1;" onclick="window.LuminaCart.addItem({id:'<?php echo esc_js($prod['id']); ?>', name:'<?php echo esc_js($prod['name']); ?>', price:<?php echo (int)$prod['price']; ?>, image:'<?php echo esc_js($prod['image']); ?>'}, 1)">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                            <span>افزودن به سبد خرید</span>
                        </button>
                        <button type="button" class="card-wishlist-btn" data-product-id="<?php echo esc_attr($prod['id']); ?>" style="width: 46px; height: 46px; border-radius: 14px;" aria-label="علاقه‌مندی">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                        </button>
                    </div>
                </div>

            </div>

        </div>

    </div>

    <style>
    @media (min-width: 768px) {
        #prod-detail-grid {
            grid-template-columns: 1fr 1fr;
        }
    }
    </style>

    <?php
} else {
    // Standard Blog Post View
    ?>
    <article class="lumina-container py-8" style="max-width: 800px; padding-top: 24px; padding-bottom: 48px;">
        <?php while (have_posts()) : the_post(); ?>
            <header style="margin-bottom: 24px;">
                <span style="font-size: 11px; font-weight: 700; color: #10B981;"><?php the_category(', '); ?></span>
                <h1 style="font-size: 2rem; font-weight: 900; line-height: 1.4; color: var(--text-main); margin-top: 6px;"><?php the_title(); ?></h1>
                <div style="font-size: 12px; color: var(--text-muted); margin-top: 8px;">
                    <span><?php the_author(); ?></span> • <span><?php echo get_the_date(); ?></span>
                </div>
            </header>

            <?php if (has_post_thumbnail()) : ?>
                <div style="border-radius: 20px; overflow: hidden; margin-bottom: 24px;">
                    <?php the_post_thumbnail('full'); ?>
                </div>
            <?php endif; ?>

            <div class="entry-content" style="font-size: 14px; line-height: 1.9; color: var(--text-main);">
                <?php the_content(); ?>
            </div>

            <?php if (comments_open() || get_comments_number()) : ?>
                <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--border-color);">
                    <?php comments_template(); ?>
                </div>
            <?php endif; ?>
        <?php endwhile; ?>
    </article>
    <?php
}

get_footer();
