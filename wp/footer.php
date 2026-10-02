<?php
/**
 * Lumina Theme - Footer Template
 *
 * @package Lumina
 */

if (!defined('ABSPATH')) {
    exit;
}

$footer_about = lumina_get_option('footer_about', 'فروشگاه تخصصی لومینا؛ ارائه‌دهنده مرجع سخت‌افزارهای ارگونومیک، تجهیزات صوتی استودیویی و گجت‌های هوشمند مینیمال با ضمانت اصالت و ۱۸ ماه گارانتی طلایی.');
$copyright    = lumina_get_option('copyright_text', 'تمامی حقوق مادی و معنوی این وب‌سایت متعلق به استودیو لومینا است.');
?>
<footer class="lumina-footer">
    <div class="footer-top">
        <div class="lumina-container">
            <div class="footer-grid">
                
                <!-- Col 1: About Lumina -->
                <div class="footer-col">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px;">
                        <div class="lumina-logo-symbol" style="width: 28px; height: 28px;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>
                        </div>
                        <span style="font-weight: 900; font-size: 1.1rem; color: #fff;">استودیو لومینا</span>
                    </div>
                    <p style="font-size: 12px; line-height: 1.8; color: #94A3B8;"><?php echo esc_html($footer_about); ?></p>
                </div>

                <!-- Col 2: Quick Links -->
                <div class="footer-col">
                    <h4><?php esc_html_e('دسترسی سریع', 'lumina'); ?></h4>
                    <ul class="footer-links">
                        <li><a href="<?php echo esc_url(home_url('/')); ?>"><?php esc_html_e('صفحه اصلی', 'lumina'); ?></a></li>
                        <li><a href="<?php echo esc_url(home_url('/categories/')); ?>"><?php esc_html_e('دسته‌بندی‌های کالا', 'lumina'); ?></a></li>
                        <li><a href="<?php echo esc_url(home_url('/bestsellers/')); ?>"><?php esc_html_e('پرفروش‌ترین محصولات', 'lumina'); ?></a></li>
                        <li><a href="<?php echo esc_url(home_url('/festival/')); ?>"><?php esc_html_e('جشنواره تخفیف ویژه', 'lumina'); ?></a></li>
                        <li><a href="<?php echo esc_url(home_url('/blog/')); ?>"><?php esc_html_e('راهنما و مقالات', 'lumina'); ?></a></li>
                    </ul>
                </div>

                <!-- Col 3: Customer Service -->
                <div class="footer-col">
                    <h4><?php esc_html_e('خدمات مشتریان', 'lumina'); ?></h4>
                    <ul class="footer-links">
                        <li><a href="<?php echo esc_url(home_url('/cart/')); ?>"><?php esc_html_e('سبد خرید', 'lumina'); ?></a></li>
                        <li><a href="<?php echo esc_url(home_url('/checkout/')); ?>"><?php esc_html_e('تسویه حساب سفارش', 'lumina'); ?></a></li>
                        <li><a href="<?php echo esc_url(home_url('/wishlist/')); ?>"><?php esc_html_e('علاقه‌مندی‌های ذخیره شده', 'lumina'); ?></a></li>
                        <li><a href="<?php echo esc_url(home_url('/my-account/')); ?>"><?php esc_html_e('پیگیری وضعیت سفارش', 'lumina'); ?></a></li>
                        <li><a href="<?php echo esc_url(home_url('/contact/')); ?>"><?php esc_html_e('تماس و پشتیبانی', 'lumina'); ?></a></li>
                    </ul>
                </div>

                <!-- Col 4: Trust & Contact -->
                <div class="footer-col">
                    <h4><?php esc_html_e('ارتباط با لومینا', 'lumina'); ?></h4>
                    <p style="font-size: 12px; margin-bottom: 8px;">تهران، خیابان ولیعصر، برج فناوری لومینا</p>
                    <p style="font-size: 12px; margin-bottom: 14px;">تلفن: <?php echo esc_html(lumina_get_option('support_phone', '۰۲۱-۸۸۸۸۴۳۲۱')); ?></p>
                    
                    <div style="display: flex; gap: 8px;">
                        <div style="width: 50px; height: 50px; border-radius: 10px; background: #1E1E24; border: 1px solid #27272A; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #34D399; font-weight: bold;">
                            اینماد
                        </div>
                        <div style="width: 50px; height: 50px; border-radius: 10px; background: #1E1E24; border: 1px solid #27272A; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #34D399; font-weight: bold;">
                            ساماندهی
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <!-- Copyright -->
    <div class="footer-bottom">
        <div class="lumina-container">
            <p><?php echo esc_html($copyright); ?></p>
        </div>
    </div>
</footer>

<!-- Slide-Out Cart Drawer -->
<?php get_template_part('template-parts/cart-drawer'); ?>

<!-- Mobile Bottom Navigation Bar -->
<?php get_template_part('template-parts/mobile-nav'); ?>

<!-- Toast Notification Container -->
<div id="lumina-toast-container" class="lumina-toast-container"></div>

<?php wp_footer(); ?>
</body>
</html>
