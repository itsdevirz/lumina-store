<?php
/**
 * Template Name: حساب کاربری (My Account)
 *
 * @package Lumina
 */

get_header();

if (lumina_is_woocommerce_active()) {
    echo '<div class="lumina-container py-8">';
    the_content();
    echo '</div>';
    get_footer();
    return;
}
?>

<div class="lumina-container" style="padding-top: 24px; padding-bottom: 48px;">
    
    <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 14px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between;">
        <h1 style="font-size: 1.5rem; font-weight: 900; color: var(--text-main); margin: 0;">داشبورد و حساب کاربری</h1>
        <span style="font-size: 12px; font-weight: 700; color: #10B981; background: var(--primary-light); padding: 4px 12px; border-radius: 8px;">کاربر ویژه VIP</span>
    </div>

    <div style="display: grid; grid-template-columns: 1fr; gap: 24px;">
        
        <!-- User Profile Card -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 20px; display: flex; align-items: center; gap: 16px;">
            <div style="width: 60px; height: 60px; border-radius: 50%; background: #10B981; color: #fff; font-size: 20px; font-weight: 800; display: flex; align-items: center; justify-content: center;">
                ک‌م
            </div>
            <div>
                <h3 style="font-size: 15px; font-weight: 800; margin-bottom: 2px;">کیان مهرآذر</h3>
                <p style="font-size: 12px; color: var(--text-muted); margin: 0;">kian.mehrazar@lumina.io • ۰۹۱۲۳۴۵۶۷۸۹</p>
            </div>
        </div>

        <!-- Orders History -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 20px;">
            <h3 style="font-size: 14px; font-weight: 800; margin-bottom: 16px;">تاریخچه سفارش‌های اخیر</h3>
            
            <div style="border: 1px solid var(--border-color); border-radius: 14px; padding: 14px; background: var(--bg-surface); margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 10px;">
                    <span style="font-weight: 800;">سفارش #LUM-8492</span>
                    <span style="color: #10B981; font-weight: 700;">تحویل داده شده</span>
                </div>
                <p style="font-size: 13px; font-weight: 700; margin-bottom: 6px;">هدفون بی‌سیم نویزکنسلینگ لومینا هورایزن پرو</p>
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted);">
                    <span>تاریخ: ۲۵ شهریور ۱۴۰۴</span>
                    <span style="font-family: var(--font-mono); font-weight: 700; color: var(--text-main);">مبلغ: ۱,۴۸۰,۰۰۰ تومان</span>
                </div>
            </div>

            <div style="border: 1px solid var(--border-color); border-radius: 14px; padding: 14px; background: var(--bg-surface);">
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 10px;">
                    <span style="font-weight: 800;">سفارش #LUM-7910</span>
                    <span style="color: #0EA5E9; font-weight: 700;">در حال پردازش در انبار</span>
                </div>
                <p style="font-size: 13px; font-weight: 700; margin-bottom: 6px;">کیبورد مکانیکال بی‌سیم کانسو مینیمال ۷۵٪</p>
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted);">
                    <span>تاریخ: ۲ مهر ۱۴۰۴</span>
                    <span style="font-family: var(--font-mono); font-weight: 700; color: var(--text-main);">مبلغ: ۸۹۰,۰۰۰ تومان</span>
                </div>
            </div>
        </div>

        <!-- Saved Addresses -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 20px;">
            <h3 style="font-size: 14px; font-weight: 800; margin-bottom: 16px;">آدرس‌های ثبت شده</h3>
            <div style="padding: 12px; background: var(--bg-surface); border-radius: 12px; border: 1px solid var(--border-color); font-size: 12px; line-height: 1.7;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 6px; background: var(--primary-light); color: #10B981; font-weight: 700; margin-bottom: 6px;">آدرس پیش‌فرض منزل</span>
                <p style="margin: 0; color: var(--text-main);">تهران، خیابان ولیعصر، بالاتر از پارک وی، کوچه مهر، پلاک ۱۲، زنگ ۴</p>
                <span style="color: var(--text-muted); font-size: 11px;">کد پستی: ۱۹۶۸۸۱۴۵۳۲</span>
            </div>
        </div>

    </div>

</div>

<?php
get_footer();
