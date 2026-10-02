<?php
/**
 * Lumina Theme - Universal Index Fallback Template
 *
 * @package Lumina
 */

get_header();
?>

<div class="lumina-container" style="padding-top: 24px; padding-bottom: 48px;">
    
    <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 14px; margin-bottom: 24px;">
        <h1 style="font-size: 1.5rem; font-weight: 900; color: var(--text-main); margin: 0;"><?php bloginfo('name'); ?></h1>
    </div>

    <?php if (have_posts()) : ?>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
            <?php while (have_posts()) : the_post(); ?>
                <article style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 18px; padding: 18px;">
                    <h3 style="font-size: 15px; font-weight: 800; margin-bottom: 8px;">
                        <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                    </h3>
                    <p style="font-size: 12px; color: var(--text-muted); line-height: 1.6;"><?php echo wp_trim_words(get_the_excerpt(), 18); ?></p>
                </article>
            <?php endwhile; ?>
        </div>
    <?php endif; ?>

</div>

<?php
get_footer();
