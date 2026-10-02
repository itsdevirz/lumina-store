<?php
/**
 * Template Name: تسویه حساب (Checkout)
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
    
    <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 14px; margin-bottom: 24px;">
        <h1 style="font-size: 1.5rem; font-weight: 900; color: var(--text-main); margin: 0;">اطلاعات ارسال و تسویه حساب</h1>
    </div>

    <div style="display: grid; grid-template-columns: 1fr; gap: 24px;">
        
        <form style="display: flex; flex-direction: column; gap: 20px;">
            <!-- Customer Information -->
            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 20px;">
                <h3 style="font-size: 14px; font-weight: 800; margin-bottom: 16px;">۱. مشخصات خریدار و تحویل‌گیرنده</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 14px;">
                    <div>
                        <label style="display: block; font-size: 12px; font-weight: 700; margin-bottom: 6px;">نام و نام خانوادگی *</label>
                        <input type="text" value="کیان مهرآذر" style="width: 100%; height: 42px; border-radius: 12px; border: 1px solid var(--border-color); padding: 0 12px; background: var(--bg-surface); font-size: 12px;">
                    </div>
                    <div>
                        <label style="display: block; font-size: 12px; font-weight: 700; margin-bottom: 6px;">شماره همراه *</label>
                        <input type="text" value="۰۹۱۲۳۴۵۶۷۸۹" style="width: 100%; height: 42px; border-radius: 12px; border: 1px solid var(--border-color); padding: 0 12px; background: var(--bg-surface); font-size: 12px;">
                    </div>
                </div>

                <div>
                    <label style="display: block; font-size: 12px; font-weight: 700; margin-bottom: 6px;">آدرس دقیق پستی *</label>
                    <textarea rows="3" style="width: 100%; border-radius: 12px; border: 1px solid var(--border-color); padding: 12px; background: var(--bg-surface); font-size: 12px;">تهران، خیابان ولیعصر، بالاتر از پارک وی، پلاک ۱۲</textarea>
                </div>
            </div>

            <!-- Delivery & Payment Method -->
            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 20px;">
                <h3 style="font-size: 14px; font-weight: 800; margin-bottom: 16px;">۲. شیوه ارسال و درگاه پرداخت</h3>
                
                <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
                    <label style="display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: 12px; border: 1px solid #10B981; background: var(--primary-light); cursor: pointer;">
                        <input type="radio" name="shipping_method" checked>
                        <span style="font-size: 12px; font-weight: 700;">ارسال اکسپرس لومینا (تحویل فوری امروز) — رایگان</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-surface); cursor: pointer;">
                        <input type="radio" name="shipping_method">
                        <span style="font-size: 12px; font-weight: 700;">پست پیشتاز سراسری (۲ تا ۳ روز کاری)</span>
                    </label>
                </div>

                <div style="display: flex; gap: 10px;">
                    <label style="flex: 1; display: flex; align-items: center; gap: 8px; padding: 12px; border-radius: 12px; border: 1px solid #10B981; background: var(--primary-light); cursor: pointer;">
                        <input type="radio" name="payment_gateway" checked>
                        <span style="font-size: 12px; font-weight: 700;">درگاه پرداخت اینترنتی شاپرک (زرین‌پال / ملت)</span>
                    </label>
                </div>
            </div>

            <button type="button" onclick="alert('سفارش تستی شما با موفقیت ثبت شد!'); window.location.href='<?php echo esc_url(home_url('/my-account/')); ?>';" style="height: 48px; border-radius: 14px; background: #10B981; color: #fff; font-size: 14px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer;">
                <span>پرداخت و ثبت نهایی سفارش</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
        </form>

    </div>

</div>

<?php
get_footer();
