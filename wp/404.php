<?php
/**
 * Lumina Theme - 404 Error Template
 *
 * @package Lumina
 */

get_header();
?>

<div class="lumina-container" style="padding-top: 60px; padding-bottom: 80px; text-align: center;">
    
    <div style="max-width: 500px; margin: 0 auto; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-3xl); padding: 40px 24px; box-shadow: var(--shadow-sm);">
        <span style="font-size: 4rem; font-weight: 900; font-family: var(--font-mono); color: #10B981; line-height: 1;">۴۰۴</span>
        <h2 style="font-size: 1.5rem; font-weight: 900; color: var(--text-main); margin-top: 14px; margin-bottom: 8px;">صفحه مورد نظر پیدا نشد!</h2>
        <p style="font-size: 13px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">متأسفانه صفحه‌ای که به دنبال آن بودید جابجا شده یا حذف گردیده است.</p>
        
        <div style="display: flex; justify-content: center; gap: 10px;">
            <a href="<?php echo esc_url(home_url('/')); ?>" class="btn-hero-primary">
                <span>بازگشت به صفحه اصلی</span>
            </a>
            <a href="<?php echo esc_url(home_url('/categories/')); ?>" class="btn-hero-secondary" style="color: var(--text-main); border-color: var(--border-color); background: var(--bg-surface);">
                <span>مشاهده محصولات</span>
            </a>
        </div>
    </div>

</div>

<?php
get_footer();
