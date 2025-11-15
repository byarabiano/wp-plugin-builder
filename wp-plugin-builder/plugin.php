<?php
/**
 * Plugin Name: WP Plugin Builder Studio
 * Description: منصة لبناء إضافات ووردبريس من داخل لوحة التحكم
 * Version:     0.1.0
 */

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'WPB_PATH', plugin_dir_path(__FILE__) );
define( 'WPB_URL',  plugin_dir_url(__FILE__) );
define( 'WPB_VERSION', '0.1.0' );

require_once WPB_PATH . 'includes/class-loader.php';

add_action('plugins_loaded', function() {
    if ( class_exists('WPB_Loader') ) new WPB_Loader();
});

/**
 * 1) القائمة — مكان واحد فقط
 */
add_action('admin_menu', function() {
    add_menu_page(
        'WP Plugin Builder Studio',
        'Plugin Builder',
        'manage_options',
        'wpb-builder',
        'wpb_render_admin_page',
        'dashicons-admin-generic',
        25
    );
});

/**
 * 2) صفحة الأدمن
 */
function wpb_render_admin_page() {
    echo '<div class="wrap">';
    echo '<h1>WP Plugin Builder Studio</h1>';
    echo '<div id="wpb-app"></div>';
    echo '</div>';
}

/**
 * 3) تحميل سكربتات الواجهة
 */
add_action('admin_enqueue_scripts', function($hook) {

    if ($hook !== 'toplevel_page_wpb-builder')
        return;

    $build_path = WPB_PATH . 'admin/build/';
    $build_url  = WPB_URL . 'admin/build/';

    if ( file_exists($build_path . 'index.css') ) {
        wp_enqueue_style(
            'wpb-index-css',
            $build_url . 'index.css',
            [],
            filemtime($build_path . 'index.css')
        );
    }

    if ( file_exists($build_path . 'admin.css') ) {
        wp_enqueue_style(
            'wpb-admin-css',
            $build_url . 'admin.css',
            [],
            filemtime($build_path . 'admin.css')
        );
    }

    if ( file_exists($build_path . 'admin.js') ) {
        wp_enqueue_script(
            'wpb-admin-js',
            $build_url . 'admin.js',
            [],
            filemtime($build_path . 'admin.js'),
            true
        );

        wp_localize_script('wpb-admin-js', 'WPB_API', [
            'root'  => esc_url_raw( rest_url('wp-plugin-builder/v1/') ),
            'nonce' => wp_create_nonce('wp_rest'),
            'pluginUrl' => WPB_URL
        ]);
    }
});
