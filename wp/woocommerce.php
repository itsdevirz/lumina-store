<?php
/**
 * Lumina Theme - WooCommerce Universal Template Bridge
 *
 * @package Lumina
 */

get_header();
?>

<div class="lumina-container" style="padding-top: 24px; padding-bottom: 48px;">
    <?php
    if (lumina_is_woocommerce_active()) {
        woocommerce_content();
    } else {
        echo '<p style="text-align: center; color: var(--text-muted);">' . esc_html__('افزونه ووکامرس فعال نیست.', 'lumina') . '</p>';
    }
    ?>
</div>

<?php
get_footer();
