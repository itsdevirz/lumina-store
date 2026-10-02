<?php
/**
 * Lumina Theme - Universal Archive Template
 *
 * @package Lumina
 */

get_header();
?>

<div class="lumina-container" style="padding-top: 24px; padding-bottom: 48px;">
    
    <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 14px; margin-bottom: 24px;">
        <h1 style="font-size: 1.5rem; font-weight: 900; color: var(--text-main); margin: 0;"><?php the_archive_title(); ?></h1>
        <?php if (get_the_archive_description()): ?>
            <div style="font-size: 13px; color: var(--text-muted); margin-top: 6px;"><?php the_archive_description(); ?></div>
        <?php endif; ?>
    </div>

    <?php if (is_post_type_archive('product') || is_tax('product_cat') || is_tax('product_tag')): ?>
        <!-- Products Grid Archive -->
        <div class="lumina-products-grid">
            <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
                <?php get_template_part('template-parts/content-product-card'); ?>
            <?php endwhile; else: ?>
                <p><?php esc_html_e('محصولی در این دسته‌بندی یافت نشد.', 'lumina'); ?></p>
            <?php endif; ?>
        </div>
    <?php else: ?>
        <!-- Posts Grid Archive -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
            <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
                <article style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 18px; padding: 18px;">
                    <h3 style="font-size: 15px; font-weight: 800; margin-bottom: 8px;">
                        <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                    </h3>
                    <p style="font-size: 12px; color: var(--text-muted);"><?php echo wp_trim_words(get_the_excerpt(), 18); ?></p>
                </article>
            <?php endwhile; endif; ?>
        </div>
    <?php endif; ?>

    <div style="margin-top: 32px; display: flex; justify-content: center;">
        <?php the_posts_pagination(array('prev_text' => '« قبلی', 'next_text' => 'بعدی »')); ?>
    </div>

</div>

<?php
get_footer();
