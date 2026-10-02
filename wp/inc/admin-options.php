<?php
/**
 * Lumina Theme - Admin Theme Options Panel
 *
 * @package Lumina
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register Admin Menu for Lumina Settings
 */
function lumina_register_admin_menu() {
    add_menu_page(
        __('تنظیمات قالب لومینا', 'lumina'),
        __('تنظیمات لومینا', 'lumina'),
        'manage_options',
        'lumina-settings',
        'lumina_render_admin_page',
        'dashicons-store',
        59
    );

    add_submenu_page(
        'lumina-settings',
        __('درون‌ریزی دمو', 'lumina'),
        __('درون‌ریزی دمو', 'lumina'),
        'manage_options',
        'lumina-demo-importer',
        'lumina_render_demo_importer_page'
    );
}
add_action('admin_menu', 'lumina_register_admin_menu');

/**
 * Render Main Theme Settings Page
 */
function lumina_render_admin_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    // Save Settings
    if (isset($_POST['lumina_save_settings']) && check_admin_referer('lumina_save_settings_nonce', 'lumina_nonce')) {
        $options = array(
            'topbar_notice'    => sanitize_text_field($_POST['topbar_notice'] ?? ''),
            'support_phone'    => sanitize_text_field($_POST['support_phone'] ?? ''),
            'festival_active'  => isset($_POST['festival_active']) ? 1 : 0,
            'festival_text'    => sanitize_text_field($_POST['festival_text'] ?? ''),
            'festival_link'    => esc_url_raw($_POST['festival_link'] ?? ''),
            'hero_badge'       => sanitize_text_field($_POST['hero_badge'] ?? ''),
            'hero_title'       => sanitize_text_field($_POST['hero_title'] ?? ''),
            'hero_desc'        => sanitize_textarea_field($_POST['hero_desc'] ?? ''),
            'footer_about'     => sanitize_textarea_field($_POST['footer_about'] ?? ''),
            'copyright_text'   => sanitize_text_field($_POST['copyright_text'] ?? ''),
        );

        update_option('lumina_theme_options', $options);
        echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__('تنظیمات قالب لومینا با موفقیت ذخیره شد.', 'lumina') . '</p></div>';
    }

    $opts = get_option('lumina_theme_options', array());
    ?>
    <div class="wrap lumina-admin-wrap" style="direction: rtl; font-family: 'Vazirmatn', Tahoma, sans-serif;">
        <h1 style="font-weight: 900; margin-bottom: 20px;"><?php esc_html_e('تنظیمات اختصاصی قالب فروشگاهی لومینا', 'lumina'); ?></h1>

        <form method="post" action="" style="background: #fff; padding: 24px; border-radius: 12px; border: 1px solid #ccd0d4; max-width: 900px;">
            <?php wp_nonce_field('lumina_save_settings_nonce', 'lumina_nonce'); ?>

            <h3 style="border-bottom: 2px solid #10B981; padding-bottom: 8px;"><?php esc_html_e('نوار بالای سایت (Topbar)', 'lumina'); ?></h3>
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="topbar_notice"><?php esc_html_e('متن اعلان بالای سایت', 'lumina'); ?></label></th>
                    <td>
                        <input name="topbar_notice" type="text" id="topbar_notice" value="<?php echo esc_attr($opts['topbar_notice'] ?? 'ارسال رایگان سفارش‌های بالای ۲ میلیون تومان در تهران و شهرستان‌ها'); ?>" class="regular-text" style="width: 100%;">
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="support_phone"><?php esc_html_e('شماره پشتیبانی', 'lumina'); ?></label></th>
                    <td>
                        <input name="support_phone" type="text" id="support_phone" value="<?php echo esc_attr($opts['support_phone'] ?? '۰۲۱-۸۸۸۸۴۳۲۱'); ?>" class="regular-text">
                    </td>
                </tr>
            </table>

            <h3 style="border-bottom: 2px solid #10B981; padding-bottom: 8px; margin-top: 30px;"><?php esc_html_e('بنر جشنواره تخفیف (Festival Banner)', 'lumina'); ?></h3>
            <table class="form-table">
                <tr>
                    <th scope="row"><?php esc_html_e('نمایش بنر جشنواره', 'lumina'); ?></th>
                    <td>
                        <label>
                            <input name="festival_active" type="checkbox" value="1" <?php checked(!empty($opts['festival_active'])); ?>>
                            <?php esc_html_e('فعال‌سازی بنر تایمردار در بالای صفحه اصلی', 'lumina'); ?>
                        </label>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="festival_text"><?php esc_html_e('متن جشنواره', 'lumina'); ?></label></th>
                    <td>
                        <input name="festival_text" type="text" id="festival_text" value="<?php echo esc_attr($opts['festival_text'] ?? 'جشنواره بهاره تخفیف ویژه تجهیزات صوتی و ستاپ'); ?>" class="regular-text" style="width: 100%;">
                    </td>
                </tr>
            </table>

            <h3 style="border-bottom: 2px solid #10B981; padding-bottom: 8px; margin-top: 30px;"><?php esc_html_e('کارت عریض پرچمدار هیرو (Hero Showcase)', 'lumina'); ?></h3>
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="hero_badge"><?php esc_html_e('عنوان بج بالای کارت', 'lumina'); ?></label></th>
                    <td>
                        <input name="hero_badge" type="text" id="hero_badge" value="<?php echo esc_attr($opts['hero_badge'] ?? 'پیشنهاد ویژه و پرچمدار ۲۰۲۶'); ?>" class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="hero_title"><?php esc_html_e('عنوان تیتر اصلی', 'lumina'); ?></label></th>
                    <td>
                        <input name="hero_title" type="text" id="hero_title" value="<?php echo esc_attr($opts['hero_title'] ?? 'هدفون بی‌سیم نویزکنسلینگ لومینا هورایزن پرو'); ?>" class="regular-text" style="width: 100%;">
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="hero_desc"><?php esc_html_e('توضیحات کوتاه محصول', 'lumina'); ?></label></th>
                    <td>
                        <textarea name="hero_desc" id="hero_desc" rows="3" class="large-text"><?php echo esc_textarea($opts['hero_desc'] ?? 'حذف نویز هوشمند و تطبیقی با درایورهای اختصاصی ۴۵ میلی‌متری تیتانیوم، شارژدهی خیره‌کننده ۴۰ ساعته با بدنه آلومینیوم برس‌خورده و پدهای ارگونومیک مموری فوم.'); ?></textarea>
                    </td>
                </tr>
            </table>

            <h3 style="border-bottom: 2px solid #10B981; padding-bottom: 8px; margin-top: 30px;"><?php esc_html_e('تنظیمات فوتر (Footer)', 'lumina'); ?></h3>
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="footer_about"><?php esc_html_e('متن درباره فروشگاه در فوتر', 'lumina'); ?></label></th>
                    <td>
                        <textarea name="footer_about" id="footer_about" rows="3" class="large-text"><?php echo esc_textarea($opts['footer_about'] ?? 'فروشگاه تخصصی لومینا؛ ارائه‌دهنده مرجع سخت‌افزارهای ارگونومیک، تجهیزات صوتی استودیویی و گجت‌های هوشمند مینیمال با ضمانت اصالت و گارانتی طلایی.'); ?></textarea>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="copyright_text"><?php esc_html_e('متن کپی‌رایت', 'lumina'); ?></label></th>
                    <td>
                        <input name="copyright_text" type="text" id="copyright_text" value="<?php echo esc_attr($opts['copyright_text'] ?? 'تمامی حقوق مادی و معنوی این وب‌سایت متعلق به استودیو لومینا است.'); ?>" class="regular-text" style="width: 100%;">
                    </td>
                </tr>
            </table>

            <p class="submit" style="margin-top: 24px;">
                <input type="submit" name="lumina_save_settings" id="submit" class="button button-primary" value="<?php esc_attr_e('ذخیره تغییرات', 'lumina'); ?>" style="background: #10B981; border-color: #059669; padding: 6px 24px; font-weight: bold;">
            </p>
        </form>
    </div>
    <?php
}

/**
 * Render 1-Click Demo Data Importer Page
 */
function lumina_render_demo_importer_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    $imported = false;
    if (isset($_POST['lumina_run_demo_import']) && check_admin_referer('lumina_demo_import_nonce', 'lumina_demo_nonce')) {
        require_once get_template_directory() . '/inc/demo-importer.php';
        $result = lumina_execute_demo_import();
        $imported = true;
    }
    ?>
    <div class="wrap" style="direction: rtl; font-family: 'Vazirmatn', Tahoma, sans-serif;">
        <h1 style="font-weight: 900; margin-bottom: 12px;"><?php esc_html_e('درون‌ریزی محتوای دمو (1-Click Demo Import)', 'lumina'); ?></h1>
        <p style="color: #64748B; font-size: 14px; margin-bottom: 24px;">
            <?php esc_html_e('با کلیک بر روی دکمه زیر، تمامی دسته‌بندی‌ها، محصولات پرچمدار، مشخصات فنی، نظرات خریداران و صفحات اصلی فروشگاه به طور خودکار در وب‌سایت شما ایجاد خواهند شد.', 'lumina'); ?>
        </p>

        <?php if ($imported): ?>
            <div class="notice notice-success is-dismissible" style="padding: 14px; border-radius: 8px;">
                <h4 style="margin: 0 0 6px 0; color: #10B981; font-weight: 800;">درون‌ریزی دمو با موفقیت کامل انجام شد!</h4>
                <p style="margin: 0; font-size: 13px;">تعداد ۸ دسته‌بندی، محصولات کامل و صفحات کلیدی به پایگاه‌داده وردپرس افزوده شدند.</p>
            </div>
        <?php endif; ?>

        <div style="background: #fff; padding: 24px; border-radius: 12px; border: 1px solid #ccd0d4; max-width: 600px;">
            <h3 style="margin-top: 0;"><?php esc_html_e('مواردی که درون‌ریزی خواهند شد:', 'lumina'); ?></h3>
            <ul style="list-style: disc; padding-right: 20px; line-height: 2; font-size: 13px; color: #334155;">
                <li>دسته‌بندی‌های تجهیزات صوتی، میز کار، پوشاک، گجت هوشمند، قهوه و دکوراسیون</li>
                <li>محصولات شاخص با گالری تصاویر، قیمت‌ها به تومان، رنگ‌بندی و جدول مشخصات فنی</li>
                <li>تنظیمات بنر جشنواره و کارت عریض هیرو پرچمدار</li>
                <li>صفحات فروشگاه، دسته‌بندی‌ها، پرفروش‌ترین‌ها، درباره ما و وبلاگ</li>
            </ul>

            <form method="post" action="" onsubmit="return confirm('آیا از درون‌ریزی داده‌های دموی لومینا اطمینان دارید؟');">
                <?php wp_nonce_field('lumina_demo_import_nonce', 'lumina_demo_nonce'); ?>
                <input type="submit" name="lumina_run_demo_import" class="button button-primary" value="<?php esc_attr_e('شروع درون‌ریزی دمو', 'lumina'); ?>" style="background: #10B981; border-color: #059669; padding: 8px 24px; font-size: 14px; font-weight: bold; margin-top: 14px;">
            </form>
        </div>
    </div>
    <?php
}
