<?php
/**
 * Template Name: سبد خرید (Cart)
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
        <h1 style="font-size: 1.5rem; font-weight: 900; color: var(--text-main); margin: 0;">سبد خرید و سفارش شما</h1>
    </div>

    <div style="display: grid; grid-template-columns: 1fr; gap: 24px;" id="cart-layout-wrap">
        
        <!-- Cart Items List (Hydrated via LuminaCart JS) -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 20px;">
            <h3 style="font-size: 14px; font-weight: 800; margin-bottom: 16px;">کالاهای موجود در سبد</h3>
            <div id="page-cart-items-container">
                <!-- Fallback item -->
                <div style="display: flex; gap: 14px; padding: 14px; background: var(--bg-surface); border-radius: 14px; border: 1px solid var(--border-color); align-items: center;">
                    <img src="<?php echo esc_url(lumina_asset('images/products/photo-1505740420928-5e560c06d30e.jpg')); ?>" alt="Cart Item" style="width: 70px; height: 70px; border-radius: 12px; object-fit: cover;">
                    <div style="flex: 1;">
                        <h4 style="font-size: 13px; font-weight: 800; margin-bottom: 4px;">هدفون بی‌سیم نویزکنسلینگ لومینا هورایزن پرو</h4>
                        <span style="font-size: 12px; font-weight: 700; color: #10B981; font-family: var(--font-mono);">۱,۴۸۰,۰۰۰ تومان</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button type="button" class="qty-btn">+</button>
                        <span style="font-weight: 700; font-family: var(--font-mono);">۱</span>
                        <button type="button" class="qty-btn">-</button>
                    </div>
                </div>
            </div>

            <!-- Coupon Box -->
            <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-subtle); display: flex; gap: 10px;">
                <input type="text" id="coupon-code-input" placeholder="کد تخفیف (مثال: LUMINA2025)" style="flex: 1; height: 42px; border-radius: 12px; border: 1px solid var(--border-color); padding: 0 14px; background: var(--bg-surface); font-size: 12px; outline: none;">
                <button type="button" id="apply-coupon-btn" style="height: 42px; padding: 0 20px; border-radius: 12px; background: #18181B; color: #fff; font-size: 12px; font-weight: 700;">اعمال کد</button>
            </div>
        </div>

        <!-- Order Summary Box -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 20px; height: fit-content;">
            <h3 style="font-size: 14px; font-weight: 800; margin-bottom: 16px;">خلاصه فاکتور سفارش</h3>
            
            <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 10px;">
                <span style="color: var(--text-muted);">مجموع اقلام:</span>
                <span style="font-family: var(--font-mono); font-weight: 700;">۱,۴۸۰,۰۰۰ تومان</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 10px;">
                <span style="color: var(--text-muted);">هزینه ارسال:</span>
                <span style="color: #10B981; font-weight: 700;">رایگان (طرح ویژه)</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: 900; padding-top: 14px; border-top: 1px solid var(--border-color); margin-top: 14px; margin-bottom: 20px;">
                <span>مبلغ قابل پرداخت:</span>
                <span style="color: #10B981; font-family: var(--font-mono);">۱,۴۸۰,۰۰۰ تومان</span>
            </div>

            <a href="<?php echo esc_url(home_url('/checkout/')); ?>" style="width: 100%; height: 46px; border-radius: 14px; background: #10B981; color: #fff; font-size: 13px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px;">
                <span>ادامه فرایند خرید و تسویه حساب</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </a>
        </div>

    </div>

</div>

<?php
get_footer();
