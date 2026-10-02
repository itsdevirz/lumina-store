<?php
/**
 * Lumina Theme - Standard Page Template
 *
 * @package Lumina
 */

get_header();
?>

<div class="lumina-container" style="padding-top: 24px; padding-bottom: 48px;">
    <?php while (have_posts()) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <header style="margin-bottom: 24px; border-bottom: 1px solid var(--border-color); padding-bottom: 14px;">
                <h1 style="font-size: 1.75rem; font-weight: 900; color: var(--text-main);"><?php the_title(); ?></h1>
            </header>

            <div class="entry-content" style="font-size: 14px; line-height: 1.9; color: var(--text-main);">
                <?php the_content(); ?>
            </div>
        </article>
    <?php endwhile; ?>
</div>

<?php
get_footer();
