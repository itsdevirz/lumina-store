<?php
/**
 * Lumina Theme - Blog Archive Template
 *
 * @package Lumina
 */

get_header();
?>

<div class="lumina-container" style="padding-top: 24px; padding-bottom: 48px;">
    
    <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 14px; margin-bottom: 28px;">
        <span style="font-size: 11px; font-weight: 700; color: #10B981;">وبلاگ و آکادمی تخصصی</span>
        <h1 style="font-size: 1.75rem; font-weight: 900; color: var(--text-main); margin-top: 4px;">مقالات، بررسی‌ها و راهنماهای لومینا</h1>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
        <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
            <article style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; overflow: hidden; display: flex; flex-direction: column;">
                <?php if (has_post_thumbnail()) : ?>
                    <a href="<?php the_permalink(); ?>" style="aspect-ratio: 16/9; overflow: hidden; display: block;">
                        <?php the_post_thumbnail('medium_large', array('style' => 'width: 100%; height: 100%; object-fit: cover;')); ?>
                    </a>
                <?php endif; ?>
                <div style="padding: 18px; display: flex; flex-direction: column; flex: 1;">
                    <div style="font-size: 11px; font-weight: 700; color: #10B981; margin-bottom: 6px;">
                        <?php the_category(', '); ?>
                    </div>
                    <h3 style="font-size: 15px; font-weight: 800; line-height: 1.5; margin-bottom: 8px;">
                        <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                    </h3>
                    <p style="font-size: 12px; color: var(--text-muted); line-height: 1.6; margin-bottom: 16px;">
                        <?php echo wp_trim_words(get_the_excerpt(), 18); ?>
                    </p>
                    <div style="margin-top: auto; display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); padding-top: 10px; border-top: 1px solid var(--border-subtle);">
                        <span><?php the_author(); ?></span>
                        <span><?php echo get_the_date(); ?></span>
                    </div>
                </div>
            </article>
        <?php endwhile; else : ?>
            <p style="text-align: center; color: var(--text-muted);"><?php esc_html_e('هنوز مقاله‌ای منتشر نشده است.', 'lumina'); ?></p>
        <?php endif; ?>
    </div>

    <!-- Pagination -->
    <div style="margin-top: 32px; display: flex; justify-content: center;">
        <?php the_posts_pagination(array('prev_text' => '« قبلی', 'next_text' => 'بعدی »')); ?>
    </div>

</div>

<?php
get_footer();
