<?php
/**
 * Lumina Theme - Hero Full-Width Showcase Card
 *
 * @package Lumina
 */

if (!defined('ABSPATH')) {
    exit;
}

$hero_badge = lumina_get_option('hero_badge', 'پیشنهاد ویژه و پرچمدار ۲۰۲۶');
$hero_title = lumina_get_option('hero_title', 'هدفون بی‌سیم نویزکنسلینگ لومینا هورایزن پرو');
$hero_desc  = lumina_get_option('hero_desc', 'حذف نویز هوشمند و تطبیقی با درایورهای اختصاصی ۴۵ میلی‌متری تیتانیوم، شارژدهی خیره‌کننده ۴۰ ساعته با بدنه آلومینیوم برس‌خورده و پدهای ارگونومیک مموری فوم.');
$hero_img   = lumina_asset('images/products/photo-1505740420928-5e560c06d30e.jpg');
$hero_price = 14800000;
$hero_orig  = 18500000;
?>
<section class="lumina-hero-section">
    <div class="lumina-container">
        <div class="lumina-hero-card" data-featured-hero="true" data-product-id="lum-01" data-product-name="<?php echo esc_attr($hero_title); ?>" data-product-price="<?php echo esc_attr($hero_price); ?>" data-product-image="<?php echo esc_url($hero_img); ?>">
            
            <!-- 1. Background Cover Image -->
            <div class="lumina-hero-bg">
                <img src="<?php echo esc_url($hero_img); ?>" alt="<?php echo esc_attr($hero_title); ?>">
            </div>

            <!-- 2. Shadow Gradient Overlay (Rich Vignette & Bottom Shadow) -->
            <div class="lumina-hero-overlay"></div>

            <!-- 3. Top Header Badges Over Image -->
            <div class="lumina-hero-top">
                <div class="lumina-hero-badges">
                    <span class="hero-pill primary">
                        <span class="pulse-indicator"></span>
                        <span><?php echo esc_html($hero_badge); ?></span>
                    </span>
                    <span class="hero-pill discount">
                        <span>۲۰٪ تخفیف</span>
                    </span>
                    <span class="hero-pill glass">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34D399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        <span>۱۸ ماه گارانتی طلایی</span>
                    </span>
                </div>

                <button type="button" class="card-wishlist-btn" data-product-id="lum-01" aria-label="<?php esc_attr_e('علاقه‌مندی', 'lumina'); ?>" style="width: 38px; height: 38px; border-radius: 50%;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </button>
            </div>

            <!-- 4. Bottom Specifications & Details Overlay -->
            <div class="lumina-hero-content">
                <div class="hero-brand">Lumina Sound • سیستم‌های صوتی حرفه‌ای</div>
                <h1 class="hero-title"><?php echo esc_html($hero_title); ?></h1>
                <p class="hero-desc"><?php echo esc_html($hero_desc); ?></p>

                <!-- Technical Highlights Pills -->
                <div class="hero-specs-row">
                    <span class="hero-spec-chip">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34D399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                        <span>حذف نویز فعال ANC هیبریدی</span>
                    </span>
                    <span class="hero-spec-chip">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34D399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="10" x="2" y="7" rx="2" ry="2"/><line x1="22" x2="22" y1="11" y2="13"/></svg>
                        <span>۴۰ ساعت شارژدهی مداوم</span>
                    </span>
                    <span class="hero-spec-chip">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        <span>درایور ۴۵ میلی‌متری تیتانیوم</span>
                    </span>
                </div>

                <!-- Footer Bar: Price & Action CTAs -->
                <div class="hero-footer-bar">
                    <div class="hero-price-wrap">
                        <span class="hero-price-old"><?php echo esc_html(lumina_format_price($hero_orig, true)); ?></span>
                        <div class="hero-price-main">
                            <span><?php echo esc_html(lumina_format_price($hero_price, true)); ?></span>
                        </div>
                    </div>

                    <div class="hero-actions">
                        <button type="button" class="btn-hero-primary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                            <span>افزودن به سبد خرید</span>
                        </button>
                        <a href="<?php echo esc_url(home_url('/?lumina_product=lum-01')); ?>" class="btn-hero-secondary">
                            <span>مشاهده مشخصات کامل</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        </a>
                    </div>
                </div>
            </div>

        </div>
    </div>
</section>
