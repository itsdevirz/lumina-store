<?php
/**
 * WooCommerce Single Product Template Override
 *
 * @package Lumina
 */

defined('ABSPATH') || exit;

get_header('shop');

while (have_posts()) :
    the_post();
    global $product;
    if (!$product) continue;

    $p_id       = $product->get_id();
    $p_title    = $product->get_name();
    $p_brand    = get_post_meta($p_id, '_lumina_brand', true) ?: 'Lumina';
    $p_rating   = (float)$product->get_average_rating() ?: 5.0;
    $p_reviews  = $product->get_review_count() ?: 0;
    $p_price    = (float)$product->get_price() * 10;
    $p_orig     = (float)$product->get_regular_price() * 10;
    $p_image    = get_the_post_thumbnail_url($p_id, 'large') ?: lumina_asset('images/products/photo-1505740420928-5e560c06d30e.jpg');
    $p_specs    = get_post_meta($p_id, '_lumina_specs', true) ?: array(
        'گارانتی' => '۱۸ ماه گارانتی طلایی لومینا',
        'اصالت'   => 'ضمانت بازگشت وجه ۱۰۰٪',
        'ارسال'   => 'ارسال رایگان در سراسر کشور'
    );
    ?>

    <div class="lumina-container" style="padding-top: 24px; padding-bottom: 48px;">
        
        <div style="display: grid; grid-template-columns: 1fr; gap: 32px; margin-bottom: 40px;" id="prod-detail-grid">
            
            <!-- Gallery & Main Image -->
            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-3xl); padding: 24px; display: flex; align-items: center; justify-content: center; overflow: hidden; aspect-ratio: 1/1;">
                <img src="<?php echo esc_url($p_image); ?>" alt="<?php echo esc_attr($p_title); ?>" style="max-height: 100%; object-fit: contain;">
            </div>

            <!-- Product Specs & Purchase Column -->
            <div style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <span style="font-size: 12px; font-weight: 800; color: #10B981; font-family: var(--font-mono); text-transform: uppercase;"><?php echo esc_html($p_brand); ?></span>
                        <span style="color: var(--text-muted);">•</span>
                        <div style="display: flex; align-items: center; gap: 4px; font-size: 11px; color: #F59E0B; font-weight: 700;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <span><?php echo esc_html(lumina_to_persian_num(number_format($p_rating, 1))); ?></span>
                            <span style="color: var(--text-muted);">(<?php echo esc_html(lumina_to_persian_num($p_reviews)); ?> نظر خریداران)</span>
                        </div>
                    </div>

                    <h1 style="font-size: 1.6rem; font-weight: 900; line-height: 1.4; color: var(--text-main); margin-bottom: 14px;"><?php echo esc_html($p_title); ?></h1>

                    <div style="font-size: 13px; color: var(--text-muted); line-height: 1.8; margin-bottom: 24px;">
                        <?php the_content(); ?>
                    </div>

                    <!-- Technical Specifications Table -->
                    <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 16px; padding: 16px; margin-bottom: 24px;">
                        <h4 style="font-size: 13px; font-weight: 800; margin-bottom: 10px;">مشخصات فنی دستگاه</h4>
                        <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
                            <?php if (!empty($p_specs)): ?>
                                <?php foreach ($p_specs as $label => $val): ?>
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
                            <?php echo esc_html(lumina_format_price($p_price, true)); ?>
                        </div>
                    </div>

                    <?php woocommerce_template_single_add_to_cart(); ?>
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
endwhile;

get_footer('shop');
