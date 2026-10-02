<?php
/**
 * Lumina Theme - Promotional Banners Template Part
 *
 * @package Lumina
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
<section class="lumina-container">
    <div class="lumina-promo-banners">
        <!-- Banner 1: Audio Studio -->
        <a href="<?php echo esc_url(home_url('/categories/?cat=audio')); ?>" class="promo-banner-card" style="background: linear-gradient(135deg, #064E3B 0%, #09090B 100%);">
            <div class="promo-banner-bg">
                <img src="<?php echo esc_url(lumina_asset('images/products/photo-1505740420928-5e560c06d30e.jpg')); ?>" alt="Audio Gear" loading="lazy">
            </div>
            <div class="promo-banner-overlay"></div>
            <div class="promo-content">
                <span class="promo-tag" style="background: rgba(16, 185, 129, 0.2); color: #6EE7B7; border: 1px solid rgba(16, 185, 129, 0.3);">
                    <span>تجهیزات صوتی استودیویی</span>
                </span>
                <h3 class="promo-title">هدفون‌ها و اسپیکرهای های‌فای</h3>
                <p class="promo-desc">تفکیک صدای استودیویی با درایورهای تیتانیوم و نویزکنسلینگ</p>
                <span class="promo-link">
                    <span>مشاهده محصولات</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </span>
            </div>
        </a>

        <!-- Banner 2: Workspace Essentials -->
        <a href="<?php echo esc_url(home_url('/categories/?cat=workspace')); ?>" class="promo-banner-card" style="background: linear-gradient(135deg, #1E293B 0%, #09090B 100%);">
            <div class="promo-banner-bg">
                <img src="<?php echo esc_url(lumina_asset('images/products/photo-1527864550417-7fd91fc51a46.jpg')); ?>" alt="Workspace" loading="lazy">
            </div>
            <div class="promo-banner-overlay"></div>
            <div class="promo-content">
                <span class="promo-tag" style="background: rgba(14, 165, 233, 0.2); color: #7DD3FC; border: 1px solid rgba(14, 165, 233, 0.3);">
                    <span>میز کار ارگونومیک</span>
                </span>
                <h3 class="promo-title">ستاپ و کیبوردهای مکانیکال</h3>
                <p class="promo-desc">مهندسی ارگونومی و چوب گردوی طبیعی برای تمرکز و بازدهی</p>
                <span class="promo-link" style="color: #38BDF8;">
                    <span>مشاهده محصولات</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </span>
            </div>
        </a>
    </div>
</section>
