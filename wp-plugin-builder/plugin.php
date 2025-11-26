<?php
/**
 * Plugin Name: WP Plugin Builder (Fixed)
 * Description: منشئ إضافات ووردبريس — يدعم React + Vite + REST + ZIP Export
 * Version: 1.0.0
 * Author: ByArabiano
 */

if (!defined('ABSPATH')) exit;

/*
|--------------------------------------------------------------------------
| 1) تعريف ثوابت مهمة
|--------------------------------------------------------------------------
*/

define('WPB_PATH', plugin_dir_path(__FILE__));
define('WPB_URL', plugin_dir_url(__FILE__));
define('WPB_VERSION', '1.0.0');


/*
|--------------------------------------------------------------------------
| 2) تحميل ملفات النظام (REST API + Helpers)
|--------------------------------------------------------------------------
*/

require_once WPB_PATH . 'includes/rest-api.php';



/*
|--------------------------------------------------------------------------
| 3) إضافة صفحة لوحة التحكم الخاصة بالبلجن
|--------------------------------------------------------------------------
*/

add_action('admin_menu', function () {
    add_menu_page(
        'WP Plugin Builder',
        'WP Builder',
        'manage_options',
        'wpb-builder',
        'wpb_render_admin_app',
        'dashicons-editor-code',
        58
    );
});

function wpb_render_admin_app()
{
    ?>
    <div id="wpb-admin-root"></div>
    <?php
}



/*
|--------------------------------------------------------------------------
| 4) تحميل سكربتات Vite + React الخاصة بلوحة التحكم
|--------------------------------------------------------------------------
*/

add_action('admin_enqueue_scripts', function ($hook) {

    if ($hook !== 'toplevel_page_wpb-builder') return;

    // تحميل CSS
    wp_enqueue_style(
        'wpb-admin-css',
        WPB_URL . 'admin/build/admin.css',
        array(),
        WPB_VERSION
    );

    // تحميل JS
    wp_enqueue_script(
        'wpb-admin-js',
        WPB_URL . 'admin/build/admin.js',
        array('wp-element'),
        WPB_VERSION,
        true
    );

    /*
    |--------------------------------------------------------------------------
    | 5) تمرير بيانات REST + Nonce إلى React (مهم جداً)
    |--------------------------------------------------------------------------
    */
    wp_localize_script(
        'wpb-admin-js',
        'wpb_rest',
        array(
            'root'  => esc_url_raw(rest_url()),
            'nonce' => wp_create_nonce('wp_rest')
        )
    );
});



/*
|--------------------------------------------------------------------------
| 6) تفعيل البلجن لأول مرة (إنشاء مجلدات)
|--------------------------------------------------------------------------
*/

register_activation_hook(__FILE__, function () {

    $uploads = wp_get_upload_dir();
    $base = trailingslashit($uploads['basedir']) . 'wp-plugin-builder';

    if (!file_exists($base)) {
        wp_mkdir_p($base);
    }
});


/*
|--------------------------------------------------------------------------
| 7) تنظيف عند الحذف (اختياري — يمكن تعطيله)
|--------------------------------------------------------------------------
| ⚠ لا تحذف شيئًا الآن. قد نضيف إعدادات للتحكم بالحذف لاحقًا.
*/

// register_uninstall_hook(__FILE__, function () {
//     // حذف مجلد wp-plugin-builder من uploads (اختياري)
// });

