<?php
/**
 * Lumina Theme - Search Results Template
 *
 * @package Lumina
 */

get_header();

$search_query = get_search_query();
?>

<div class="lumina-container" style="padding-top: 24px; padding-bottom: 48px;">
    
    <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 14px; margin-bottom: 24px;">
        <span style="font-size: 11px; font-weight: 700; color: #10B981;">نتایج جستجو</span>
        <h1 style="font-size: 1.5rem; font-weight: 900; color: var(--text-main); margin-top: 4px;">
            <?php printf(esc_html__('نتایج جستجو برای: «%s»', 'lumina'), esc_html($search_query)); ?>
        </h1>
    </div>

    <?php if (have_posts()) : ?>
        <div class="lumina-products-grid">
            <?php while (have_posts()) : the_post(); ?>
                <?php
                if (get_post_type() === 'product') {
                    get_template_part('template-parts/content-product-card');
                } else {
                    ?>
                    <article style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 18px; padding: 16px;">
                        <h4 style="font-size: 14px; font-weight: 800; margin-bottom: 6px;"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h4>
                        <p style="font-size: 12px; color: var(--text-muted);"><?php echo wp_trim_words(get_the_excerpt(), 14); ?></p>
                    </article>
                    <?php
                }
                ?>
            <?php endwhile; ?>
        </div>
    <?php else : ?>
        <div style="text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border-color);">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="1.5" style="margin: 0 auto 12px;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <h3 style="font-size: 15px; font-weight: 800; margin-bottom: 8px;">نتیجه‌ای برای جستجوی شما یافت نشد</h3>
            <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">لطفاً املای کلمات را بررسی کنید یا عبارت دیگری را امتحان نمایید.</p>
            <a href="<?php echo esc_url(home_url('/categories/')); ?>" class="btn-hero-primary" style="display: inline-flex;">مشاهده همه محصولات</a>
        </div>
    <?php endif; ?>

</div>

<?php
get_footer();
